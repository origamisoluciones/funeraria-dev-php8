<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Niches{
        /**
        * Obtiene los datos de los nichos
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("SELECT nicheID, name FROM Niches");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }
    }
?>