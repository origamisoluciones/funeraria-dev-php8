<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Polls{

        /*
        * Obtiene las encuestas de satisfacción
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("SELECT p.ID, p.title
                                  FROM   Polls p
                                  WHERE  p.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
         * Añade una encuesta
         *
         * @param array Datos de la encuesta
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            // Validación de campos
            if($data['title'] == ''){
                return false;
            }else{
                $data['title'] = cleanStr($data['title']);
            }

            return $db->query(" INSERT INTO Polls(title) VALUES ('" . $data['title'] . "')");
        }

        /**
         * Obtiene los datos de una encuesta
         * 
         * @param array ID de la encuesta
         * @return array Datos de la encuesta
         */
        public function read($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  *
                                    FROM    Polls
                                    WHERE   ID = " . $data['ID']);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Modifica los datos de una encuesta
         * 
         * @param array Datos de la encuesta
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
            if($data['title'] == ''){
                return false;
            }else{
                $data['title'] = cleanStr($data['title']);
            }

            return $db->query(" UPDATE  Polls
                                SET     title = '" . $data['title'] . "'
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Elimina una encuesta
         * 
         * @param array ID de la encuesta
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $db->query(" UPDATE  Polls_Items
                         SET     leavingDate = " . time() . "
                         WHERE   poll = " . $data['ID']);

            return $db->query(" UPDATE  Polls
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Obtiene las encuestas para el select2
         *
         * @param int $data
         * 
         * @return array
         */
        public function getPollsSelect2($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      p.ID, p.title
                                    FROM        Polls p
                                    WHERE       p.leavingDate IS NULL AND
                                                p.title LIKE '%$data%' AND
                                                (
                                                    SELECT  COUNT(*)
                                                    FROM    Polls_Items pi
                                                    WHERE   pi.poll = p.ID
                                                        AND pi.leavingDate IS NULL
                                                ) > 0
                                    ORDER BY    p.title");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Obtiene los resultados de una encuesta asociado a un expediente
         * 
         * @param array ID de la encuesta
         * @return array Datos de la encuesta
         */
        public function getExpedientResult($data){
            $db = new DbHandler;

            $expedient = cleanStr($data['ID']);

            $result = $db->query("  SELECT      e.number, CONCAT(e.deceasedName, ' ', e.deceasedSurname) as deceased, p.title as poll_title, pit.question, ep.phone, epr.score, epr.notes, ep.ID as result_id, ep.admin_notes
                                    FROM        Expedients_Polls ep, Expedients_Polls_Results epr, Polls p, Polls_Items pit, Expedients e
                                    WHERE       e.expedientID = $expedient AND 
                                                ep.expedient = e.expedientID AND
                                                ep.ID = epr.expedient_poll AND
                                                epr.poll_item = pit.ID AND
                                                epr.leavingDate IS NULL AND
                                                pit.poll = p.ID
                                    ORDER BY    ep.ID, pit.order_question ASC");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Actualiza las notas de una encuesta de satisfacción
         * 
         * @param array
         * @return bool
         */
        public function getUpdateNotesExpedientResult($data){
            $db = new DbHandler;

            $notesInfo = $data['notes'];
            foreach($notesInfo as $note){

                $expedientResultID = cleanStr($note['expedient_result']);
                $note = cleanEditor($note['note']);

                $db->query("    UPDATE  Expedients_Polls
                                SET     admin_notes = '" . $note . "'
                                WHERE   ID = " .$expedientResultID);
            }

            return true;
        }
    }
?>