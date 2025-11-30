<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class CleaningTypes{
        /**
        * Añade un registro en la limpieza
        *
        * @param array $data
        *
        * @return bool
        */
        public function create($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);

            return $db->query("INSERT INTO Cleaning_Types(ID, name) 
                               VALUES('', " . $data['name'] . ")");
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
        * Obtiene los tipos por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("SELECT *
                                  FROM Cleaning_Types
                                  WHERE name LIKE '%". $name ."%'
                                  ORDER BY name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }
        /**
        * Obtiene el nombre 
        *
        * @param int $id
        *
        * @return string
        */
        public function getName($id){
            $db = new DbHandler;

            $id = cleanStr($id);
            
            $result = $db->query("SELECT name
                                  FROM Cleaning_Types
                                  WHERE ID = $id");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result)[0];
            }
        }


    }
?>