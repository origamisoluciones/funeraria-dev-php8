<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class PollsItems{

        /*
        * Obtiene las preguntas de una encuesta de satisfacción
        *
        * @return array
        */
        public function list($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT      poi.ID, poi.question, poi.order_question
                                    FROM        Polls_Items poi
                                    WHERE       poi.leavingDate IS NULL AND
                                                poi.poll = $id
                                    ORDER BY    poi.order_question");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
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
            if($data['poll'] == ''){
                return false;
            }else{
                $data['poll'] = cleanStr($data['poll']);
            }

            if($data['question'] == ''){
                return false;
            }else{
                $data['question'] = cleanStr($data['question']);
            }

            if($data['order'] == ''){
                $data['order'] = 0;
            }else{
                $data['order'] = cleanStr($data['order']);
            }

            return $db->query(" INSERT INTO Polls_Items(poll, question, order_question)
                                VALUES ('" . $data['poll'] . "', '" . $data['question'] . "', '" . $data['order'] . "')");
        }

        /**
         * Obtiene los datos de una pregunta
         * 
         * @param array ID de la pregunta
         * @return array Datos de la pregunta
         */
        public function read($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  *
                                    FROM    Polls_Items
                                    WHERE   ID = " . $id);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
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
            if($data['question'] == ''){
                return false;
            }else{
                $data['question'] = cleanStr($data['question']);
            }
            if($data['order'] == ''){
                $data['order'] = 0;
            }else{
                $data['order'] = cleanStr($data['order']);
            }

            return $db->query(" UPDATE  Polls_Items
                                SET     question = '" . $data['question'] . "',
                                        order_question = " . $data['order'] . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Elimina una pregunta de la encuesta
         * 
         * @param array ID de la pregunta
         * @return bool
         */
        public function delete($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            return $db->query(" UPDATE  Polls_Items
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $id);
        }
    }
?>