<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class TimelineGarageTasks{

        /**
         * Obtiene a los miembros del staff disponibles
         * 
         * @return array Datos del timeline
         */
        public function getGarageEvents($search){
            $db = new DbHandler;

            $dateGarage = date('Y-m-d', strtotime("+10 days"));
            $dateITV = date('Y-m-d', strtotime("+15 days"));

            $result = $db->query("  SELECT      e.ID as id,
                                                IF(
                                                    e.upkeeps IS NOT NULL,
                                                    CONCAT('Mantenimientos del coche ', CONCAT(c.licensePlate, ' para el día ', DATE_FORMAT(e.start,'%d-%m-%Y'))),
                                                    CONCAT(e.name, ' para el día ', DATE_FORMAT(e.start,'%d-%m-%Y'))
                                                ) as text,
                                                e.start,
                                                e.upkeeps as upkeepID,
                                                IF(
                                                    e.upkeeps IS NOT NULL,
                                                    (
                                                        SELECT  COUNT(*)
                                                        FROM    Events e2
                                                        WHERE   e2.upkeeps = e.upkeeps AND 
                                                                e2.`leavingDate` IS NULL AND 
                                                                e2.status = 1
                                                    ),
                                                    0
                                                ) as total_upkeeps
                                    FROM        Events e
                                    LEFT JOIN   Upkeeps u ON e.upkeeps = u.ID AND u.leavingDate IS NULL AND u.cost IS NULL AND u.kms IS NULL
                                    LEFT JOIN   Cars c ON c.ID = e.car AND c.leavingDate IS NULL AND c.external = 0
                                    WHERE       e.reminder = 1 AND
                                                e.type IN(3,7,8,9) AND
                                                e.start <= '$dateGarage' AND       
                                                e.leavingDate IS NULL AND
                                                e.status = 1 AND
                                                (
                                                    (e.upkeeps IS NOT NULL AND CONCAT('Mantenimientos del coche ', CONCAT(c.licensePlate, ' para el día ', DATE_FORMAT(e.start,'%d-%m-%Y'))) LIKE '%" . $search . "%')
                                                    OR
                                                    (e.upkeeps IS NULL AND CONCAT(e.name, ' para el día ', DATE_FORMAT(e.start,'%d-%m-%Y')) LIKE '%" . $search . "%')
                                                ) AND
                                                (
                                                    SELECT  COUNT(*)
                                                    FROM    Timeline_Garage_Tasks tgt
                                                    WHERE   tgt.leavingDate IS NULL AND
                                                            tgt.event = e.ID AND 
                                                            tgt.upkeep = e.upkeeps
                                                ) = 0
                                    GROUP BY    text
                                    UNION
                                    SELECT      e.ID as id,
                                                SUBSTRING(e.name, 14) as text,
                                                e.start,
                                                e.upkeeps as upkeepID,
                                                0 as total_upkeeps
                                    FROM        Events e, Cars c
                                    WHERE       e.reminder = 1 AND
                                                e.type = 6 AND
                                                e.start <= '$dateITV' AND
                                                e.leavingDate IS NULL AND
                                                e.status = 1 AND
                                                e.car = c.ID AND 
                                                c.leavingDate IS NULL AND
                                                c.external = 0 AND
                                                e.name LIKE '%" . $search . "%' AND
                                                (
                                                    SELECT  COUNT(*)
                                                    FROM    Timeline_Garage_Tasks tgt
                                                    WHERE   tgt.leavingDate IS NULL AND
                                                            tgt.event = e.ID AND 
                                                            tgt.upkeep = e.upkeeps
                                                ) = 0
                                    GROUP BY    e.name
                                    ORDER BY    start ASC
            ");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Lista los eventos de mantenimiento
         * 
         * @return @array
         */
        public function listUpkeeps($upkeep){
            $db = new DbHandler;

            $upkeep = cleanStr($upkeep);

            $result = $db->query("  SELECT  e.name
                                    FROM    Events e, Upkeeps u
                                    WHERE   e.type IN (9,8) AND
                                            e.leavingDate IS NULL AND
                                            e.upkeeps = u.ID AND
                                            u.ID = $upkeep AND
                                            u.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);;
        }

        /*
        * Obtiene el listado de tareas de mantenimiento
        *
        * @return array
        */
        public function list($from, $to, $mortuary, $status){
            $db = new DbHandler;

            $where = '';
            if(
                $from != 'null' && $to != 'null' 
            ){
                $where .= " AND tgt.start BETWEEN $from AND $to";
            }else if( 
                $from != 'null' && $to == 'null' 
            ){
                $where .= " AND tgt.start >= $from";
            }else if( 
                $from == 'null' && $to != 'null' 
            ){
                $where .= " AND tgt.start <= $to";
            }

            if($mortuary != 'null'){
                $where .= " AND tgt.mortuary = $mortuary";
            }
            if($status != 'null'){
                $where .= " AND tgt.status = $status";
            }

            $result = $db->query(   "SELECT     tgt.id,
                                                IF(
                                                    e.type = 6, 
                                                    SUBSTRING(e.name, 14), 
                                                    IF(
                                                        e.upkeeps IS NOT NULL,
                                                        CONCAT('Mantenimientos del coche ', CONCAT(c.licensePlate, ' para el día ', DATE_FORMAT(e.start,'%d-%m-%Y'))),
                                                        CONCAT(e.name, ' para el día ', DATE_FORMAT(e.start,'%d-%m-%Y'))
                                                    )
                                                ),
                                                DATE_FORMAT(FROM_UNIXTIME(tgt.start), '%d/%m/%Y %H:%i'),
                                                CONCAT(s.name, ' ', s.surname),
                                                IF(m.name IS NULL, '-', m.name),
                                                IF(tgt.status = 0, 'Pendiente', 'Realizada')
                                    FROM        Staff s, Mortuaries m, Timeline_Garage_Tasks tgt, Events e
                                    LEFT JOIN   Cars c ON c.ID = e.car AND c.leavingDate IS NULL AND c.external = 0
                                    WHERE       tgt.leavingDate IS NULL AND
                                                tgt.staffDesignated =  s.ID AND
                                                tgt.mortuary = m.mortuaryID AND
                                                tgt.start BETWEEN $from AND $to AND
                                                e.leavingDate IS NULL AND
                                                tgt.event = e.ID
            ");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
         * Añade una nueva tarea de mantenimiento
         *
         * @param array Datos de la tarea de mantenimiento
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            // Validación de campos
            if($data['event'] == ''){
                return false;
            }else{
                $event = cleanStr($data['event']);
            }
            if($data['upkeep'] == ''){
                $upkeep = 'null';
            }else{
                $upkeep = cleanStr($data['upkeep']);
            }
            if($data['start'] == ''){
                return false;
            }else{
                $start = cleanStr($data['start']);
            }
            if($data['end'] == ''){
                return false;
            }else{
                $end = cleanStr($data['end']);
            }
            if($data['staff'] == ''){
                return false;
            }else{
                $staff = cleanStr($data['staff']);
            }
            if($data['mortuary'] == ''){
                return false;
            }else{
                $mortuary = cleanStr($data['mortuary']);
            }
            if($data['status'] == ''){
                return false;
            }else{
                $status = cleanStr($data['status']);
            }

            return $db->query(" INSERT INTO Timeline_Garage_Tasks(event, upkeep, start, end, staffDesignated, mortuary, status)
                                VALUES ($event, $upkeep, $start, $end, $staff, $mortuary, $status)");
        }

        /**
         * Obtiene los datos de una tarea de mantenimiento
         * 
         * @param array ID de la tarea mantenimiento
         * @return array Datos de la tarea mantenimiento
         */
        public function read($data){
            $db = new DbHandler;

            $data['id'] = cleanStr($data['id']);

            $result = $db->query("  SELECT      tgt.*, 
                                                IF(
                                                    e.type = 6, 
                                                    SUBSTRING(e.name, 14), 
                                                    IF(
                                                        e.upkeeps IS NOT NULL,
                                                        CONCAT('Mantenimientos del coche ', CONCAT(c.licensePlate, ' para el día ', DATE_FORMAT(e.start,'%d-%m-%Y'))),
                                                        CONCAT(e.name, ' para el día ', DATE_FORMAT(e.start,'%d-%m-%Y'))
                                                    )
                                                ) as eventName,
                                                CONCAT(s.name, ' ', s.surname) as staffDesignatedName,
                                                m.name as mortuaryName,
                                                e.upkeeps as upkeepID,
                                                IF(
                                                    e.upkeeps IS NOT NULL,
                                                    (
                                                        SELECT  COUNT(*)
                                                        FROM    Events e2
                                                        WHERE   e2.upkeeps = e.upkeeps AND 
                                                                e2.`leavingDate` IS NULL AND 
                                                                e2.status = 1
                                                    ),
                                                    0
                                                ) as total_upkeeps
                                    FROM        Staff s, Mortuaries m, Timeline_Garage_Tasks tgt, Events e
                                    LEFT JOIN   Cars c ON c.ID = e.car AND c.leavingDate IS NULL AND c.external = 0
                                    WHERE       tgt.staffDesignated = s.ID AND
                                                tgt.mortuary = m.mortuaryID AND
                                                tgt.event = e.ID AND
                                                tgt.id = " . $data['id']);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Modifica los datos de una tarea mantenimiento
         * 
         * @param array Datos de la tarea mantenimiento
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            // Validación de campos
            if($data['id'] == ''){
                return false;
            }else{
                $id = cleanStr($data['id']);
            }
            if($data['start'] == ''){
                return false;
            }else{
                $start = cleanStr($data['start']);
            }
            if($data['end'] == ''){
                return false;
            }else{
                $end = cleanStr($data['end']);
            }
            if($data['staff'] == ''){
                return false;
            }else{
                $staff = cleanStr($data['staff']);
            }
            if($data['mortuary'] == ''){
                return false;
            }else{
                $mortuary = cleanStr($data['mortuary']);
            }
            if($data['status'] == ''){
                return false;
            }else{
                $status = cleanStr($data['status']);
            }

            return $db->query(" UPDATE  Timeline_Garage_Tasks
                                SET     start = " . $start . ",
                                        end = " . $end . ",
                                        staffDesignated = " . $staff . ",
                                        mortuary = " . $mortuary . ",
                                        status = " . $status . "
                                WHERE   id = " . $id);
        }

        /**
         * Elimina una tarea de mantenimiento
         * 
         * @param array ID de la tarea de mantenimiento
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['id'] = cleanStr($data['id']);

            return $db->query(" UPDATE  Timeline_Garage_Tasks
                                SET     leavingDate = " . time() . "
                                WHERE   id = " . $data['id']);
        }
    }
?>