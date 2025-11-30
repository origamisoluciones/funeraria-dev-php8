<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class ExpedientsObituariesImages{
        /*
         * Gets images by expedient
         *
         * @return array
         */
        public function getByExpedient($expedient){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);

            $result = $db->query("  SELECT  eoi.id, eoi.name, eoi.main
                                    FROM    Expedients_Obituaries_Images eoi
                                    WHERE   eoi.delete_date IS NULL AND
                                            eoi.expedient = $expedient");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArray($result);
			}
        }

        /*
         * Gets images by expedient
         *
         * 
         * @return array
         */
        public function create($expedient, $name, $main, $createDate){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);
            $name = cleanStr($name);
            $main = cleanStr($main);
            $createDate = cleanStr($createDate);

            return $db->query(" INSERT INTO Expedients_Obituaries_Images(expedient, name, main, create_date)
                                VALUES ($expedient, '$name', $main, $createDate)");
        }

        /*
         * Gets images by expedient
         *
         * @return array
         */
        public function getMainByExpedient($expedient){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);

            $result = $db->query("  SELECT  eoi.name
                                    FROM    Expedients_Obituaries_Images eoi
                                    WHERE   eoi.delete_date IS NULL AND
                                            eoi.expedient = $expedient AND
                                            eoi.main = 1");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Unset main by expedient
         * 
         * @param int $expedient Expedient
         * @return bool
         */
        public function unsetMainByExpedient($expedient){
            $db = new DbHandler;

            return $db->query(" UPDATE  Expedients_Obituaries_Images
                                SET     main = 0
                                WHERE   expedient = $expedient");
        }

        /**
         * Mark as main
         * 
         * @param int $id Id
         * @return bool
         */
        public function markAsMain($id){
            $db = new DbHandler;

            return $db->query(" UPDATE  Expedients_Obituaries_Images
                                SET     main = 1
                                WHERE   id = $id");
        }

        /**
         * Deletes a image
         * 
         * @param int $id Id
         * @return bool
         */
        public function delete($id){
            $db = new DbHandler;

            return $db->query(" UPDATE  Expedients_Obituaries_Images
                                SET     delete_date = " . time() . "
                                WHERE   id = $id");
        }

        /*
         * Gets name by id
         *
         * @param int $id id
         * @return array
         */
        public function getNameById($id){
            $db = new DbHandler;

            $result = $db->query("  SELECT  eoi.name
                                    FROM    Expedients_Obituaries_Images eoi
                                    WHERE   eoi.delete_date IS NULL AND
                                            eoi.id = $id");
            
            if(mysqli_num_rows($result) == 0){
				return false;
			}else{
				return $db->resultToArray($result);
			}
        }
    }
?>