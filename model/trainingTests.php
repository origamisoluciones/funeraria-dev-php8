<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class TrainingTests{

        /**
        * Obtiene los datos de los tests de un usuario
        *
        * @return array
        */
        public function list($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  t.id, CONCAT(s.name, ' ', s.surname) as username, t.name, t.date_test, t.duration, t.date_review, t.result
                                    FROM    Staff s, Training_Tests t
                                    WHERE   s.ID = t.user AND t.leavingDate IS NULL AND t.user = $id
                                    ORDER BY t.date_test");

            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
                return  $db->resultToArrayValue($result);
            }
        }

        /**
         * Añade un nuevo curso a un empleado
         * 
         * @param array $data Datos del curso
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['user'] = cleanStr($data['user']);
            $data['name'] = cleanStr($data['name']);
            $data['date'] = cleanStr($data['date']);
            $data['duration'] = cleanStr($data['duration']);
            $data['dateReview'] = cleanStr($data['dateReview']);
            $data['result'] = cleanStr($data['result']);
            $data['notes'] = cleanEditor($data['notes']);

            // Validación de campos
            if($data['user'] == ''){
                return false;
            }

            if($data['name'] == ''){
                return false;
            }

            if($data['date'] == ''){
                return false;
            }

            if($data['duration'] == ''){
                return false;
            }

            if($data['dateReview'] == ''){
                return false;
            }

            $user = $data['user'];
            $name = $data['name'];
            $date = $data['date'];
            $duration = $data['duration'];
            $dateReview = $data['dateReview'];
            $result = $data['result'] == '' ? '0' : $data['result'];
            $notes = $data['notes'];
            $notes = $notes == '' ? 'null' : "'$notes'";

            $result = $db->query("  INSERT INTO Training_Tests(user, name, date_test, duration, date_review, result, notes)
                                    VALUES ($user, '$name', $date, $duration, '$dateReview', '$result', $notes)");

            return $result ? $db->getLastInsertId() : null;
        }

        /**
         * Obtiene los datos de un curso
         * 
         * @param int $id Id del curso
         * @return array $trainingTests Datos de un curso
         */
        public function read($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  t.*
                                    FROM    Training_Tests t
                                    WHERE   t.id = $id");

            if(mysqli_num_rows($result) == 0){
                return [];
            }else{
                return $db->resultToArray($result)[0];
            }
        }

        /**
         * Modifica los datos de un curso
         * 
         * @param array $data Datos de un curso
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['id'] = cleanStr($data['id']);
            $data['name'] = cleanStr($data['name']);
            $data['date'] = cleanStr($data['date']);
            $data['duration'] = cleanStr($data['duration']);
            $data['dateReview'] = cleanStr($data['dateReview']);
            $data['result'] = cleanStr($data['result']);
            $data['notes'] = cleanEditor($data['notes']);

            // Validación de campos
            if($data['id'] == ''){
                return false;
            }
            if($data['name'] == ''){
                return false;
            }
            if($data['date'] == ''){
                return false;
            }
            if($data['duration'] == ''){
                return false;
            }
            if($data['dateReview'] == ''){
                return false;
            }
            if($data['result'] == ''){
                return false;
            }

            $id = $data['id'];
            $name = $data['name'];
            $date = $data['date'];
            $duration = $data['duration'];
            $dateReview = $data['dateReview'];
            $result = $data['result'];
            $notes = $data['notes'];
            $notes = $notes == '' ? 'null' : "'$notes'";

            $db->query("UPDATE  Training_Tests
                        SET     name = '$name',
                                date_test = '$date',
                                duration = '$duration',
                                date_review = '$dateReview',
                                result = '$result',
                                notes = $notes
                        WHERE   id = $id");
            return true;
        }

        /**
         * Elimina un curso
         * 
         * @param array $id Id del curso
         * @return bool
         */
        public function delete($id){
            $db = new DbHandler;

            $id = cleanStr($id);
            $time = time();

            return $db->query(" UPDATE  Training_Tests
                                SET     leavingDate = $time
                                WHERE   id = $id");
        }

    }
?>