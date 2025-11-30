<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Editors{
        /**
         * Obtiene los datos de los documentos
         * 
         * @return array
         */
        public function listEsquelas(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      eo.ID, e.number, eo.type, eo.model, CONCAT(u.name, ' ', u.surname)
                                    FROM        Expedients e, Expedients_Obituaries eo
                                    LEFT JOIN   Users u ON eo.user = u.userID
                                    WHERE       eo.expedient = e.expedientID AND
                                                eo.isOpen = 1");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArrayValue($result);
        }

        /**
         * Desbloquea el editor de esquela
         */
        public function unlockEsquela($id){
            $db = new DbHandler;

            return $db->query(" UPDATE  Expedients_Obituaries
                                SET     isOpen = 0,
                                        user = null
                                WHERE   ID = $id");
        }

        /**
         * Obtiene los datos de los documentos
         * 
         * @return array
         */
        public function listEsquelasPrensa(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      ep.ID, e.number, ep.type, ep.model, CONCAT(u.name, ' ', u.surname)
                                    FROM        Expedients e, Expedients_Press ep
                                    LEFT JOIN   Users u ON ep.user = u.userID
                                    WHERE       ep.expedient = e.expedientID AND
                                                ep.isOpen = 1");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArrayValue($result);
        }

        /**
         * Desbloquea el editor de esquela en prensa
         */
        public function unlockEsquelaPrensa($id){
            $db = new DbHandler;

            return $db->query(" UPDATE  Expedients_Press
                                SET     isOpen = 0,
                                        user = null
                                WHERE   ID = $id");
        }

        /**
         * Obtiene los datos de los documentos
         * 
         * @return array
         */
        public function listLapidasProvisionales(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      et.ID, e.number, et.type, et.model, CONCAT(u.name, ' ', u.surname)
                                    FROM        Expedients e, Expedients_Tombstones et
                                    LEFT JOIN   Users u ON et.user = u.userID
                                    WHERE       et.expedient = e.expedientID AND
                                                et.isOpen = 1");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArrayValue($result);
        }

        /**
         * Desbloquea el editor de esquela en prensa
         */
        public function unlockLapidaProvisional($id){
            $db = new DbHandler;

            return $db->query(" UPDATE  Expedients_Tombstones
                                SET     isOpen = 0,
                                        user = null
                                WHERE   ID = $id");
        }

        /**
         * Obtiene los datos de los documentos
         * 
         * @return array
         */
        public function listCerradoDefuncion(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      ecd.ID, e.number, ecd.type, ecd.model, CONCAT(u.name, ' ', u.surname)
                                    FROM        Expedients e, Expedients_Closed_Death ecd
                                    LEFT JOIN   Users u ON ecd.user = u.userID
                                    WHERE       ecd.expedient = e.expedientID AND
                                                ecd.isOpen = 1");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArrayValue($result);
        }

        /**
         * Desbloquea el editor de esquela en prensa
         */
        public function unlockCerradoDefuncion($id){
            $db = new DbHandler;

            return $db->query(" UPDATE  Expedients_Closed_Death
                                SET     isOpen = 0,
                                        user = null
                                WHERE   ID = $id");
        }

        /**
         * Obtiene los datos de los documentos
         * 
         * @return array
         */
        public function listNoDuel(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      edr.ID, e.number, edr.type, edr.model, CONCAT(u.name, ' ', u.surname)
                                    FROM        Expedients e, Expedients_Duel_Received edr
                                    LEFT JOIN   Users u ON edr.user = u.userID
                                    WHERE       edr.expedient = e.expedientID AND
                                                edr.isOpen = 1");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArrayValue($result);
        }

        /**
         * Desbloquea el editor de esquela en prensa
         */
        public function unlockNoDuel($id){
            $db = new DbHandler;

            return $db->query(" UPDATE  Expedients_Duel_Received
                                SET     isOpen = 0,
                                        user = null
                                WHERE   ID = $id");
        }

        /**
         * Obtiene los datos de los documentos
         * 
         * @return array
         */
        public function listReminder(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      er.ID, e.number, er.type, er.model, CONCAT(u.name, ' ', u.surname)
                                    FROM        Expedients e, Expedients_Reminder er
                                    LEFT JOIN   Users u ON er.user = u.userID
                                    WHERE       er.expedient = e.expedientID AND
                                                er.isOpen = 1");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArrayValue($result);
        }

        /**
         * Desbloquea el editor de esquela en prensa
         */
        public function unlockReminder($id){
            $db = new DbHandler;

            return $db->query(" UPDATE  Expedients_Reminder
                                SET     isOpen = 0,
                                        user = null
                                WHERE   ID = $id");
        }

        /**
         * Obtiene los datos de los documentos
         * 
         * @return array
         */
        public function listReminderPacket(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      erp.ID, e.number, erp.type, erp.model, CONCAT(u.name, ' ', u.surname)
                                    FROM        Expedients e, Expedients_Reminder_Packet erp
                                    LEFT JOIN   Users u ON erp.user = u.userID
                                    WHERE       erp.expedient = e.expedientID AND
                                                erp.isOpen = 1");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArrayValue($result);
        }

        /**
         * Desbloquea el editor de esquela en prensa
         */
        public function unlockReminderPacket($id){
            $db = new DbHandler;

            return $db->query(" UPDATE  Expedients_Reminder_Packet
                                SET     isOpen = 0,
                                        user = null
                                WHERE   ID = $id");
        }

        /**
         * Obtiene los datos de los documentos
         * 
         * @return array
         */
        public function listReminderPacketCross(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      erpc.ID, e.number, erpc.type, erpc.model, CONCAT(u.name, ' ', u.surname)
                                    FROM        Expedients e, Expedients_Reminder_Packet_Cross erpc
                                    LEFT JOIN   Users u ON erpc.user = u.userID
                                    WHERE       erpc.expedient = e.expedientID AND
                                                erpc.isOpen = 1");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArrayValue($result);
        }

        /**
         * Desbloquea el editor de esquela en prensa
         */
        public function unlockReminderPacketCross($id){
            $db = new DbHandler;

            return $db->query(" UPDATE  Expedients_Reminder_Packet_Cross
                                SET     isOpen = 0,
                                        user = null
                                WHERE   ID = $id");
        }

        /**
         * Obtiene los expedientes (pestañas)
         * 
         * @return array
         */
        public function listExpedientsTabs(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  e.expedientID, e.number
                                    FROM    Expedients e
                                    WHERE   e.leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
                return [];
            }else{
                $expedients = $db->resultToArray($result);

                $blockedExpedients = array();
                foreach($expedients as $expedient){
                    $result = $db->query("  SELECT  up.page, u.username
                                            FROM    Users_Pages up, Users u
                                            WHERE   up.page LIKE '%/{$expedient['expedientID']}' AND
                                                    up.user = u.userID");

                    if(mysqli_num_rows($result) > 0){
                        $results = $db->resultToArray($result);
                        $blocked = array($expedient['expedientID'], $expedient['number'], array(0, ''), array(0, ''), array(0, ''), array(0, ''), array(0, ''));
                        $flag = false;
                        foreach($results as $res){
                            if(preg_match("/editar-expediente/", $res['page'])){
                                $blocked[2] = array(1, $res['username']);
                                $flag = true;
                            }
                            if(preg_match("/expediente\/contratacion/", $res['page'])){
                                $blocked[3] = array(1, $res['username']);
                                $flag = true;
                            }
                            if(preg_match("/expediente\/esquela\/[0-9]+$/", $res['page'])){
                                $blocked[4] = array(1, $res['username']);
                                $flag = true;
                            }
                            if(preg_match("/expediente\/cservicio/", $res['page'])){
                                $blocked[5] = array(1, $res['username']);
                                $flag = true;
                            }
                            if(preg_match("/expediente\/documentacion/", $res['page'])){
                                $blocked[6] = array(1, $res['username']);
                                $flag = true;
                            }
                        }
                        if($flag){
                            array_push($blockedExpedients, $blocked);
                        }
                    }
                }
                return $blockedExpedients;
            }
        }

        /**
         * Desbloquea la pestaña 'Expediente'
         */
        public function unlockExpedientTab($id){
            $db = new DbHandler;

            $result = $db->query("  SELECT  e.tpv
                                    FROM    Expedients e
                                    WHERE   e.expedientID = $id");

            if(mysqli_num_rows($result) == 0){
                return false;
            }

            $info = $db->resultToArray($result);

            return $db->query("DELETE FROM Users_Pages WHERE page = '/editar-expediente" . ($info[0]['tpv'] == '0' ? '' : '-tpv') . "/$id'");
        }

        /**
         * Desbloquea la pestaña 'Contratación'
         */
        public function unlockHiringTab($id){
            $db = new DbHandler;

            $result = $db->query("  SELECT  e.tpv
                                    FROM    Expedients e
                                    WHERE   e.expedientID = $id");

            if(mysqli_num_rows($result) == 0){
                return false;
            }

            $info = $db->resultToArray($result);

            return $db->query("DELETE FROM Users_Pages WHERE page = '/expediente/contratacion" . ($info[0]['tpv'] == '0' ? '' : '-tpv') . "/$id'");
        }

        /**
         * Desbloquea la pestaña 'Esquela'
         */
        public function unlockObituaryTab($id){
            $db = new DbHandler;

            return $db->query("DELETE FROM Users_Pages WHERE page = '/expediente/esquela/$id'");
        }

        /**
         * Desbloquea la pestaña 'C. Servicio'
         */
        public function unlockServiceTab($id){
            $db = new DbHandler;

            $result = $db->query("  SELECT  e.tpv
                                    FROM    Expedients e
                                    WHERE   e.expedientID = $id");

            if(mysqli_num_rows($result) == 0){
                return false;
            }

            $info = $db->resultToArray($result);

            return $db->query("DELETE FROM Users_Pages WHERE page = '/expediente/cservicio" . ($info[0]['tpv'] == '0' ? '' : '-tpv') . "/$id'");
        }

        /**
         * Desbloquea la pestaña 'Documentación'
         */
        public function unlockDocTab($id){
            $db = new DbHandler;

            $result = $db->query("  SELECT  e.tpv
                                    FROM    Expedients e
                                    WHERE   e.expedientID = $id");

            if(mysqli_num_rows($result) == 0){
                return false;
            }

            $info = $db->resultToArray($result);

            return $db->query("DELETE FROM Users_Pages WHERE page = '/expediente/documentacion" . ($info[0]['tpv'] == '0' ? '' : '-tpv') . "/$id'");
        }
    }
?>