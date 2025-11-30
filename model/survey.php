<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Survey{

        /**
         * Añade una encuesta
         *
         * @param array Datos de la encuesta
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['service'] = cleanStr($data['service']);
            $data['position'] = cleanStr($data['position']);

            // Validación de campos
            if($data['service'] == ''){
                return false;
            }

            return $db->query(" INSERT INTO Survey(service, position)
                                VALUES ('" . $data['service'] . "', '" . $data['position'] . "')");
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
                                    FROM    Survey
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

            $data['ID'] = cleanStr($data['ID']);

            // Validación de campos
            if($data['service'] == ''){
                return false;
            }else{
                $data['service'] = cleanStr($data['service']);
            }

            if($data['position'] == ''){
                return false;
            }else{
                $data['position'] = cleanStr($data['position']);
            }
            
            return $db->query(" UPDATE  Survey
                                SET     service = '" . $data['service'] . "',
                                        position = '" . $data['position'] . "'
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

            return $db->query(" UPDATE  Survey
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Obtiene las encuestas
         * 
         * @return array
         */
        public function get(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  s.ID
                                    FROM    Survey s
                                    WHERE   s.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene las encuestas por Asistencia
         * 
         * @param int $assistance Asistencia
         * @return array
         */
        public function getSurveyByAssistance($assistance){
            $db = new DbHandler;

            $assistance = cleanStr($assistance);

            $result = $db->query("  SELECT  sa.ID, sa.value, sa.notes,
                                            s.service
                                    FROM    Survey_Assistance sa, Survey s
                                    WHERE   sa.assistance = $assistance AND
                                            sa.survey = s.ID 
                                    ORDER BY s.position ASC");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
        * Lista las encuestas
        *
        * @return array
        */
        public function listSurveyDatatables(){
            $db = new DbHandler;

            $result = $db->query("SELECT    s.ID, s.service
                                  FROM      Survey s
                                  WHERE     s.leavingDate IS NULL
                                  ORDER BY  s.position ASC");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }
    }
?>