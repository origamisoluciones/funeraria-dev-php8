<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class TimelineFreeTasks{

        /**
         * Obtiene a los miembros del staff disponibles
         * 
         * @return array Datos del timeline
         */
        public function getStaffMembers($search, $start, $end){
            $db = new DbHandler;

            $result = $db->query("  SELECT      s.ID, 
                                                CONCAT(s.name, ' ', s.surname) as name,
                                                IF(
                                                    (
                                                        SELECT  COUNT(*)
                                                        FROM    (Expedients e, Expedients_Services es)
                                                        WHERE   e.cremation = 1 AND
                                                                e.leavingDate IS NULL AND
                                                                e.authDate IS NOT NULL AND e.authDate != '' AND
                                                                e.authTime IS NOT NULL AND e.authTime != '' AND
                                                                UNIX_TIMESTAMP(CONCAT(DATE_FORMAT(FROM_UNIXTIME(e.authDate), '%Y-%m-%d'), ' ', DATE_FORMAT(FROM_UNIXTIME(e.authTime), '%H:%i:%s'))) BETWEEN $start AND $end AND
                                                                e.expedientID = es.expedient AND
                                                                es.crematoriumWhoDelivered = s.ID
                                                    ) = 0, -- Get if staff has delivery ashes for this dates
                                                    IF(
                                                        (
                                                            SELECT  COUNT(*)
                                                            FROM    Timeline_Free_Tasks tfe
                                                            WHERE   tfe.leavingDate IS NULL AND
                                                                    (
                                                                        tfe.end BETWEEN $start AND $end OR
                                                                        tfe.start BETWEEN $start AND $end OR
                                                                        tfe.start <= $start AND tfe.end >= $end
                                                                    ) AND
                                                                    tfe.staffDesignated = s.ID
                                                        ) = 0, -- Get if staff has free tasks for this dates
                                                        IF(
                                                            (
                                                                SELECT  COUNT(*)
                                                                FROM    Events ev
                                                                WHERE   ev.leavingDate IS NULL AND
                                                                        ev.type = 2 AND 
                                                                        ev.status = 5 AND
                                                                        (
                                                                            UNIX_TIMESTAMP(ev.end) BETWEEN $start AND $end OR
                                                                            UNIX_TIMESTAMP(ev.start) BETWEEN $start AND $end OR
                                                                            UNIX_TIMESTAMP(ev.start) <= $start AND UNIX_TIMESTAMP(ev.end) >= $end
                                                                        ) AND
                                                                        ev.cleaningUser = s.ID
                                                            ) = 0, -- Get if staff has installation maintenance for this dates
                                                            0,
                                                            1
                                                        ),
                                                        1
                                                    ),
                                                    1
                                                ) as busy
                                    FROM        Staff s
                                    WHERE       s.leavingDate IS NULL AND
                                                (s.name LIKE '%" . $search . "%' OR s.surname LIKE '%" . $search . "%')
                                    ORDER BY    name
            ");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /*
        * Obtiene el listado de tareas libres
        *
        * @return array
        */
        public function list($from, $to, $mortuary, $status){
            $db = new DbHandler;

            $where = '';
            if(
                $from != 'null' && $to != 'null' 
            ){
                $where .= " AND tft.start BETWEEN $from AND $to";
            }else if( 
                $from != 'null' && $to == 'null' 
            ){
                $where .= " AND tft.start >= $from";
            }else if( 
                $from == 'null' && $to != 'null' 
            ){
                $where .= " AND tft.start <= $to";
            }

            if($mortuary != 'null'){
                $where .= " AND tft.mortuary = $mortuary";
            }
            if($status != 'null'){
                $where .= " AND tft.status = $status";
            }

            $result = $db->query(   "SELECT     tft.id, 
                                                DATE_FORMAT(FROM_UNIXTIME(tft.start), '%d/%m/%Y %H:%i'),
                                                DATE_FORMAT(FROM_UNIXTIME(tft.end), '%d/%m/%Y %H:%i'),
                                                CONCAT(s.name, ' ', s.surname),
                                                IF(m.name IS NULL, '-', m.name),
                                                IF(tft.status = 0, 'Pendiente', 'Realizada')
                                    FROM        Staff s, Timeline_Free_Tasks tft
                                    LEFT JOIN   Mortuaries m ON tft.mortuary = m.mortuaryID
                                    WHERE       tft.leavingDate IS NULL AND
                                                tft.staffDesignated =  s.ID 
                                                $where");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
         * Añade una nueva tarea libre
         *
         * @param array Datos de la tarea libre
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            // Validación de campos
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
            if($data['description'] == ''){
                $description = 'null';
            }else{
                $description = "'".cleanTextArea($data['description']) ."'";
            }

            return $db->query(" INSERT INTO Timeline_Free_Tasks(start, end, staffDesignated, mortuary, status, description)
                                VALUES ($start, $end, $staff, $mortuary, $status, $description)");
        }

        /**
         * Obtiene los datos de una tarea libre
         * 
         * @param array ID de la tarea libre
         * @return array Datos de la tarea libre
         */
        public function read($data){
            $db = new DbHandler;

            $data['id'] = cleanStr($data['id']);

            $result = $db->query("  SELECT      tft.*, 
                                                CONCAT(s.name, ' ', s.surname) as staffDesignatedName,
                                                m.name as mortuaryName
                                    FROM        Staff s, Timeline_Free_Tasks tft
                                    LEFT JOIN   Mortuaries m ON tft.mortuary = m.mortuaryID
                                    WHERE       tft.staffDesignated = s.ID AND
                                                tft.id = " . $data['id']);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Modifica los datos de una tarea libre
         * 
         * @param array Datos de la tarea libre
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
            if($data['description'] == ''){
                $description = 'null';
            }else{
                $description = "'".cleanTextArea($data['description']) ."'";
            }

            return $db->query(" UPDATE  Timeline_Free_Tasks
                                SET     start = " . $start . ",
                                        end = " . $end . ",
                                        staffDesignated = " . $staff . ",
                                        mortuary = " . $mortuary . ",
                                        status = " . $status . ",
                                        description = " . $description . "
                                WHERE   id = " . $id);
        }

        /**
         * Elimina una tarea libre
         * 
         * @param array ID de la tarea libre
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['id'] = cleanStr($data['id']);

            return $db->query(" UPDATE  Timeline_Free_Tasks
                                SET     leavingDate = " . time() . "
                                WHERE   id = " . $data['id']);
        }
    }
?>