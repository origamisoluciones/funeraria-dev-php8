<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Cleaning{
        /**
        * Añade un registro en la limpieza
        *
        * @param array $data
        *
        * @return bool
        */
        public function create($data){
            $db = new DbHandler;
            $utils = new Utils();

            $data['type'] = cleanStr($data['type']);
            $data['mortuary'] = cleanStr($data['mortuary']);
            $data['user'] = cleanStr($data['user']);
            $data['date'] = cleanStr($data['date']);
            $data['status'] = cleanStr($data['status']);

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("SELECT * 
                                  FROM Cleaning 
                                  WHERE extraID = '" . $extraID . "'");

            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("SELECT * 
                                      FROM Cleaning 
                                      WHERE extraID = '" . $extraID . "'");
            }

            $result = $db->query("  INSERT INTO Cleaning(ID, type, mortuary, user, event, date, status, extraID) 
                                    VALUES('', " . $data['type'] . ", " . $data['mortuary'] . ", 
                                            " . $data['user'] . ", null, '" . $utils->dateConvert($data['date']) . "', 
                                            '" . $data['status'] . "', '" . $extraID . "')");

            if($result){
                $cleaning = $db->query("SELECT  c.ID, c.date, c.status, m.name as mortuaryName, ct.name as cleaningTypeName, u.name as userName, u.surname
                                        FROM    Cleaning c, Mortuaries m, Cleaning_Types ct, Users u
                                        WHERE   c.type = ct.ID AND
                                                c.mortuary = m.mortuaryID AND
                                                c.user = u.userID AND
                                                extraID = '" . $extraID . "'");

                $cleaning = $db->resultToArray($cleaning)[0];

                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
                
                $result = $db->query("SELECT * 
                                        FROM Cleaning 
                                        WHERE extraID = '" . $extraID . "'");
    
                while(mysqli_num_rows($result) > 0){
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
    
                    $result = $db->query("SELECT * 
                                            FROM Cleaning 
                                            WHERE extraID = '" . $extraID . "'");
                }

                $currentDate = strtotime("today");
                $db->query("INSERT INTO Events(ID, status, user, name, start, end, type, reminder, cremation, leavingDate, extraID, dischargeDay) 
                            VALUES('', 5, " . $_SESSION['user'] . ", 
                                    '" . $cleaning['cleaningTypeName'] . " - " . $cleaning['mortuaryName'] . "', '" . $cleaning['date'] . " 00:00:00', 
                                    '" . $cleaning['date'] . " 23:59:59', 2, 0, 0, null, '" . $extraID . "', '$currentDate')");

                $event = $db->query("   SELECT  ID
                                        FROM    Events
                                        WHERE   extraID = '" . $extraID . "'");

                $event = $db->resultToArray($event)[0]['ID'];

                $db->query("UPDATE  Cleaning
                            SET     event = " . $event . "
                            WHERE   ID = " . $cleaning['ID'] . "");
                
                return true;
            }else{
                return false;
            }
        }

        /**
        * Obtiene los datos de un registro de la limpieza
        *
        * @param array $data
        *
        * @return array
        */
        public function createType($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            return $db->query("INSERT INTO Cleaning_Types(name) VALUES('" . $data['name'] . "')");
        }

        /**
        * Obtiene los datos de un registro de la limpieza
        *
        * @param array $data
        *
        * @return array
        */
        public function updateType($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['cleaningID'] = cleanStr($data['cleaningID']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            $result = $db->query("UPDATE Cleaning_Types SET name = '" . $data['name'] . "' WHERE ID = " . $data['cleaningID'] . "");

            if($result){
				return true;
			}else{
				return false;
			}
        }

        /**
         * Elimina un tipo de limpieza
         *
         * @param array $data ID del tipo de limpieza
         * @return bool
         */
        public function deleteType($data){
            $db = new DbHandler;

            $data['cleaningID'] = cleanStr($data['cleaningID']);

            return $db->query(" UPDATE  Cleaning_Types 
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                                WHERE   ID = " . $data['cleaningID']);
        }

        /**
        * Obtiene los datos de un registro de la limpieza
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['cleaningID'] = cleanStr($data['cleaningID']);

            $result = $db->query("SELECT c.ID as cleanID, c.date, c.status, ct.ID as typeID, ct.name as cleaningTypeName, 
                                         m.mortuaryID as mortuaryID, m.name as mortuaryName, u.userID as userID, u.name as userName, u.surname 
                                  FROM Cleaning c, Cleaning_Types ct, Mortuaries m, Users u 
                                  WHERE c.type = ct.ID AND 
                                        c.mortuary = m.mortuaryID AND 
                                        c.user = u.userID AND 
                                        c.ID = " . $data['cleaningID'] . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los typos de limpiezas
        *
        * @param array $data
        *
        * @return array
        */
        public function getTypes(){
            $db = new DbHandler;

            $result = $db->query("SELECT * FROM Cleaning_Types");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Modifica los datos de un registro de la limpieza
        *
        * @param array $data
        *
        * @return bool
        */
        public function update($data){
            $db = new DbHandler;
            $utils = new Utils();

            $data['type'] = cleanStr($data['type']);
            $data['mortuary'] = cleanStr($data['mortuary']);
            $data['user'] = cleanStr($data['user']);
            $data['date'] = cleanStr($data['date']);
            $data['status'] = cleanStr($data['status']);
            $data['cleaningID'] = cleanStr($data['cleaningID']);

            return $db->query(" UPDATE  Cleaning 
                                SET     type = " . $data['type'] . ", mortuary = " . $data['mortuary'] . ", 
                                        user = " . $data['user'] . ", date = '" . $utils->dateConvert($data['date']) . "', 
                                        status = '" . $data['status'] . "' 
                                WHERE   ID = " . $data['cleaningID'] . "");
        }

        /**
        * Elimina los datos de un registro de la limpieza
        *
        * @param array $data
        *
        * @return bool
        */
        public function delete($data){
            $db = new DbHandler;

            $data['cleaningID'] = cleanStr($data['cleaningID']);

            $db->query("UPDATE  Cleaning 
                        SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                        WHERE   ID = " . $data['cleaningID'] . "");

            $event = $db->query("   SELECT  event
                                    FROM    Cleaning
                                    WHERE   ID = " . $data['cleaningID'] . "");

            $event = $db->resultToArray($event)[0]['event'];

            $db->query("UPDATE  Events
                        SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                        WHERE   ID = " . $event . "");
        }

        /* **************** Resumen general de limpieza **************** */
        /**
         * Obtiene el id del control de visitas
         * 
         * @param int $data
         * 
         * @return array
         */
        public function getVisitControl($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  ID
                                    FROM    VisitsControl
                                    WHERE   expedient = $data");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['ID'] : null;
        }

        /**
         * Obtiene la primera visita
         *
         * @param int $data
         * 
         * @return array
         */
        public function getMin($data){
            $db = new DbHandler;

            $data['visitControl'] = cleanStr($data['visitControl']);

            $result = $db->query("  SELECT  MIN(v.ID) AS ID
                                    FROM    Visits v
                                    WHERE   visitControl = " . $data['visitControl']);

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['ID'] : null;
        }

        /**
         * Obtiene la primera visita
         *
         * @param int $data
         * 
         * @return array
         */
        public function getMax($data){
            $db = new DbHandler;

            $data['visitControl'] = cleanStr($data['visitControl']);

            $result = $db->query("  SELECT  MAX(v.ID) AS ID
                                    FROM    Visits v
                                    WHERE   visitControl = " . $data['visitControl'] . " AND
                                            v.leavingDate IS NULL");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['ID'] : null;
        }

        /**
         * Obtiene las descripciones
         *
         * @param int $data
         * 
         * @return array
         */
        public function getDescriptions($min, $max, $expedient){
            $db = new DbHandler;

            $min = cleanStr($min);
            $max = cleanStr($max);
            $expedient = cleanStr($expedient);

            $result = $db->query("  SELECT  e.number, e.requestDate, e.deceasedRoom,
                                            vd.roomReviewCheck, s1.name AS roomReviewName, s1.surname AS roomReviewSurname, vd.roomReviewTime,
                                            vd.toiletReviewCheck, s2.name AS toiletReviewName, s2.surname AS toiletReviewSurname, vd.toiletReviewTime,
                                            vd.roomBurialReviewCheck, s3.name AS roomBurialReviewName, s3.surname AS roomBurialReviewSurname, vd.roomBurialReviewTime,
                                            m.name as mortuary
                                    FROM    (Visits_Descriptions vd, Expedients e, Mortuaries m)
                               LEFT JOIN    Staff s1 ON s1.ID = vd.roomReviewUser
                               LEFT JOIN    Staff s2 ON s2.ID = vd.toiletReviewUser
                               LEFT JOIN    Staff s3 ON s3.ID = vd.roomBurialReviewUser
                                    WHERE   vd.visit = $min AND                               
                                            e.expedientID = $expedient AND 
                                            e.deceasedMortuary = m.mortuaryID ");

            if(mysqli_num_rows($result)){
                $res = $db->resultToArray($result)[0];
            }                                         

            $result = $db->query("  SELECT  vd.roomCleaningCheck, s1.name AS roomCleaningName, s1.surname AS roomCleaningSurname, vd.roomCleaningTime,
                                            vd.roomBathroomsCleaningCheck, s2.name AS roomBathroomsCleaningName, s2.surname AS roomBathroomsCleaningSurname, vd.roomBathroomsCleaningTime,
                                            vd.commonBathroomsCleaningCheck, s3.name AS commonBathroomsCleaningName, s3.surname AS commonBathroomsCleaningSurname, vd.commonBathroomsCleaningTime,
                                            vd.commonZonesCleaningCheck, s4.name AS commonZonesCleaningName, s4.surname AS commonZonesCleaningSurname, vd.commonZonesCleaningTime,
                                            vd.thanatopraxieCleaningCheck, s5.name AS thanatopraxieCleaningName, s5.surname AS thanatopraxieCleaningSurname, vd.thanatopraxieCleaningTime,
                                            vd.burialCleaningCheck, s6.name AS burialCleaningName, s6.surname AS burialCleaningSurname, vd.burialCleaningTime,
                                            m.name as mortuary
                                    FROM    (Visits_Descriptions vd, Expedients e, Mortuaries m)
                               LEFT JOIN    Staff s1 ON s1.ID = vd.roomCleaningUser
                               LEFT JOIN    Staff s2 ON s2.ID = vd.roomBathroomsCleaningUser
                               LEFT JOIN    Staff s3 ON s3.ID = vd.commonBathroomsCleaningUser
                               LEFT JOIN    Staff s4 ON s4.ID = vd.commonZonesCleaningUser
                               LEFT JOIN    Staff s5 ON s5.ID = vd.thanatopraxieCleaningUser
                               LEFT JOIN    Staff s6 ON s6.ID = vd.burialCleaningUser
                                    WHERE   vd.visit = $max AND                                            
                                            e.expedientID = $expedient AND 
                                            e.deceasedMortuary = m.mortuaryID");

            if(mysqli_num_rows($result)){
                $res = array_merge($res, $db->resultToArray($result)[0]);
            }  

            return count($res) > 0 ? $res : null;
        }

        /**
         * Obtiene los distintos años de las visitas para el filtrado
         * 
         * @return array
         */
        public function getYears(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      DISTINCT(EXTRACT(YEAR FROM date)) as year
                                    FROM        Visits
                                    ORDER BY    year DESC");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /* ******************************** Agenda ******************************** */
        /**
         * Obtiene todos los eventos de limpieza
         * 
         * @return array
         */
        public function listEvents(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      e.ID as id, e.name as title, e.start, e.end as end, e.regularity,
                                                e.reminder, e.cleaningType, e.cleaningMortuary, e.cleaningUser, e.description,
                                                es.ID as statusID, es.name as statusName, es.borderColor, es.backgroundColor, 
                                                u.name as userName, ct.name as cleaningTypeName, m.name as cleaningMortuaryName,
                                                s.name as cleaningUserName, s.surname as cleaningUserSurname, e.success
                                    FROM        (Events e, Events_Status es, Users u)
                                    LEFT JOIN   Cleaning_Types ct ON e.cleaningType = ct.ID
                                    LEFT JOIN   Mortuaries m ON e.cleaningMortuary = m.mortuaryID
                                    LEFT JOIN   Staff s ON e.cleaningUser = s.ID
                                    WHERE       e.status = es.ID AND 
                                                e.user = u.userID AND
                                                e.leavingDate IS NULL AND
                                                e.type = 2" );

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Modifica los datos de una limpieza y su correspondiente evento
         * 
         * @param int $data
         * 
         * @return bool
         */
        public function updateEvent($data){
            $db = new DbHandler;

            $data['date'] = cleanStr($data['date']);
            $data['status'] = cleanStr($data['status']);
            $data['event'] = cleanStr($data['event']);

            $db->query("UPDATE  Events
                        SET     start = '" . $data['date'] . " 00:00:00',
                                end = '" . $data['date'] . " 23:59:59',
                                status = " . $data['status'] . "
                        WHERE   ID = " . $data['event'] . "");

            $cleaning = $db->query("SELECT  ID
                                    FROM    Cleaning
                                    WHERE   event = " . $data['event'] . "");

            $cleaning = $db->resultToArray($cleaning)[0]['ID'];

            if($data['status'] == 5){
                $status = "Solicitado";
            }else{
                $status = "Realizado";
            }

            $db->query("UPDATE  Cleaning
                        SET     date = '" . $data['date'] . "',
                                status = '" . $status . "'
                        WHERE   ID = " . $cleaning . "");

            return true;
        }

        /**
        * Obtiene los enterrador
        *
        * @return array
        */
        public function listCleaningsDatatables(){
            $db = new DbHandler;

            $result = $db->query("SELECT ct.ID, ct.name
                                FROM Cleaning_Types ct
                                WHERE ct.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
                return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
        * Obtiene el registro de limpieza del vehiculo
        *
        * @return array
        */
        public function listCleaningsCarsDatatables($from, $to){
            $db = new DbHandler;

            $where = "e.type = 1 AND e.leavingDate IS NULL ";
            
            if($from > 0){
                $where .= " AND UNIX_TIMESTAMP(e.entryDate) >= " . ($from);
            }
            
            if($to > 0){
                $where .= " AND UNIX_TIMESTAMP(e.entryDate) < " . ($to + 60*60*24);
            }

            $result = $db->query("  SELECT      e.expedientID, e.number, e.entryDate, ca.brand, ca.model, ca.licensePlate, s.name, c.name
                                    FROM        Expedients e
                                    LEFT JOIN   Services_Cars sc ON e.expedientID = sc.service
                                    LEFT JOIN   Cars ca ON ca.ID = sc.car
                                    LEFT JOIN   Staff s ON s.ID = sc.cleanBefore
                                    LEFT JOIN   Carriers c ON sc.cleanAfter = c.carrierID
                                    WHERE       $where");
            
            if(mysqli_num_rows($result) == 0){
                return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
        * Obtiene los tanatorios
        *
        * @return array
        */
        public function listGeneralMortuaryCleaningsDatatables($from, $to){
            $db = new DbHandler;

            $result = $db->query("  SELECT      e.ID, e.name, e.start, e.end, m.name, ct.name, es.name, s.name
                                    FROM        (Events e, Events_Status es, Mortuaries m)
                                    LEFT JOIN   Staff s ON e.cleaningUser = s.ID 
                                    LEFT JOIN   Cleaning_Types ct ON ct.ID = e.cleaningType 
                                    WHERE       e.leavingDate IS NULL 
                                                AND e.cleaningMortuary IS NOT NULL
                                                AND e.cleaningMortuary = m.mortuaryID 
                                                AND e.status = es.ID");

            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
        * Obtiene los tanatorios
        *
        * @return array
        */
        public function listGeneralCleaningsDatatables($from, $to){
            $db = new DbHandler;

            $where = "  e.deceasedMortuary = m.mortuaryID AND
                        e.leavingDate IS NULL AND
                        e.expedientID = v.expedient";

            if($from > 0){
                $where .= " AND UNIX_TIMESTAMP(Expedients.requestDate) > " . $from;
            }
            
            if($to > 0){
                $where .= " AND UNIX_TIMESTAMP(Expedients.requestDate) < " . ($to + 60*60*24);
            }

            $result = $db->query("SELECT e.expedientID, e.requestDate, e.number, m.name, e.deceasedRoom
                                  FROM Expedients e, Mortuaries m, VisitsControl v
                                  WHERE $where");
            
            if(mysqli_num_rows($result) == 0){
                return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }
    }
?>