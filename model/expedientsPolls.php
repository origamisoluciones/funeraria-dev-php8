<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class ExpedientsPolls{

        /*
        * Obtiene los teléfonos de una encuesta de un expediente
        *
        * @return array
        */
        public function listByExpedient($expedient){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);

            $result = $db->query("SELECT ep.ID, ep.phone, ep.sent
                                  FROM   Expedients_Polls ep
                                  WHERE  ep.leavingDate IS NULL
                                    AND  ep.expedient = $expedient");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /*
        * Obtiene los teléfonos de una encuesta de un expediente a los que no se les ha enviado una encuesta
        *
        * @return array
        */
        public function getPhonesNotSendedByExpedient($data){
            $db = new DbHandler;

            $expedient = cleanStr($data['expedient']);

            $result = $db->query("SELECT ep.ID, ep.phone, ep.expedient, es.poll as survey
                                  FROM   Expedients_Polls ep, Expedients_Services es
                                  WHERE  ep.leavingDate IS NULL
                                    AND  ep.expedient = es.expedient
                                    AND  ep.expedient = $expedient
                                    AND ep.sent = 0");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Añade una pregunta a una encuesta
         *
         * @param array Datos de la pregunta
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            // Validación de campos
            if($data['expedient'] == ''){
                return false;
            }else{
                $data['expedient'] = cleanStr($data['expedient']);
            }

            if($data['phone'] == ''){
                return false;
            }else{
                $data['phone'] = cleanStr($data['phone']);
            }

            return $db->query(" INSERT INTO Expedients_Polls(expedient, phone)
                                VALUES ('" . $data['expedient'] . "', '" . $data['phone'] . "')");
        }

        /**
         * Modifica los datos de una pregunta
         * 
         * @param array Datos de la pregunta
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            // Validación de campos
            if($data['ID'] == ''){
                return false;
            }else{
                $data['ID'] = cleanStr($data['ID']);
            }

            if($data['phone'] == ''){
                return false;
            }else{
                $data['phone'] = cleanStr($data['phone']);
            }

            return $db->query(" UPDATE  Expedients_Polls
                                SET     phone = '" . $data['phone'] . "'
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Elimina una pregunta de la encuesta
         * 
         * @param array ID de la pregunta
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $id = cleanStr($data['ID']);

            return $db->query(" UPDATE  Expedients_Polls
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $id);
        }

        /**
         * Actualiza el estado del envio de un sms
         * 
         * @return bool
         */
        public function updateStatus($id, $status){
            $db = new DbHandler;

            return $db->query(" UPDATE  Expedients_Polls
                                SET     sent = $status
                                WHERE   ID = $id");
        }
    }
?>