<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Emails{
        /**
         * Añade un correo
         * 
         * @param array $data Información del correo
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['type'] = cleanStr($data['type']);
            $data['email'] = cleanStr($data['email']);

            // Validación de campos
            if($data['email'] == ''){
                return false;
            }else{
                if(!checkEmail($data['email'])){
                    return false;
                }
            }

            return $db->query(" INSERT INTO Emails(type, email) VALUES (" . $data['type'] . ", '" . $data['email'] . "')");
        }

        /**
         * Obtiene los datos de un correo
         * 
         * @param array $data ID
         * @return array Datos del correo
         */
        public function read($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  ID, email
                                    FROM    Emails e
                                    WHERE   e.ID = " . $data['ID']);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Modifica los datos de un correo
         * 
         * @param array $data Datos del correo
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['email'] = cleanStr($data['email']);

            // Validación de campos
            if($data['email'] == ''){
                return false;
            }else{
                if(!checkEmail($data['email'])){
                    return false;
                }
            }

            return $db->query(" UPDATE  Emails
                                SET     email = '" . $data['email'] . "'
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Elimina un correo
         * 
         * @param array $data ID
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Emails
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Obtiene los correos dado el tipo
         * 
         * @param string $search Correo a buscar
         * @param int $type Tipo de correo
         * @return array
         */
        public function getEmailsByType($search, $type){
            $db = new DbHandler;

            $search = cleanStr($search);
            $type = cleanStr($type);

            $result = $db->query("  SELECT  e.ID, e.email
                                    FROM    Emails e
                                    WHERE   e.type = $type AND
                                            e.email LIKE '%$search%' AND
                                            e.leavingDate IS NULL
                                    ORDER BY e.email");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los emails dado el nombre
         * 
         * @param string $name Nombre
         * @return array
         */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);

            $result = $db->query("  SELECT  e.ID, e.email
                                    FROM    Emails e
                                    WHERE   e.leavingDate IS NULL AND e.email LIKE '%$name%'
                                    ORDER BY e.email");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene un email
         * 
         * @param int $id Id del email
         * @return string
         */
        public function getEmail($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  e.email
                                    FROM    Emails e
                                    WHERE   e.ID = $id");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['email'];
        }

         /*
        **
        * Obtiene los emails
        *
        * @return array
        */
        public function listEmailsDatatables(){
            $db = new DbHandler;

            $result = $db->query("SELECT e.ID, e.email
                                  FROM Emails e
                                  WHERE e.leavingDate IS NULL AND e.type = 0");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }
    }
?>