<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Doctors{
        /**
         * Añade un médico
         *
         * @param array Datos del médico
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['college'] = cleanStr($data['college']);
            $data['email'] = cleanStr($data['email']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            if($data['email'] != ''){
                if(!checkEmail($data['email'])){
                    return false;
                }
            }

            return $db->query(" INSERT INTO Doctors(name, college, email)
                                VALUES ('" . $data['name'] . "', '" . $data['college'] . "', '" . $data['email'] . "')");
        }

        /**
         * Obtiene los datos de un médico
         * 
         * @param array ID del médico
         * @return array Datos del médico
         */
        public function read($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  *
                                    FROM    Doctors
                                    WHERE   ID = " . $data['ID']);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Modifica los datos de un médico
         * 
         * @param array Datos del médico
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['name'] = cleanStr($data['name']);
            $data['college'] = cleanStr($data['college']);
            $data['email'] = cleanStr($data['email']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }
            if($data['email'] != ''){
                if(!checkEmail($data['email'])){
                    return false;
                }
            }

            return $db->query(" UPDATE  Doctors
                                SET     name = '" . $data['name'] . "',
                                        college = '" .  $data['college'] . "',
                                        email = '" .  $data['email'] . "'
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Elimina un médico
         * 
         * @param array ID del médico
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Doctors
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Busca por nombre
         * 
         * @param string Nombre a buscar
         * @return array Información del doctor
         */
        public function searchByName($data){
            $db = new DbHandler;

            $data = cleanStr($data);
            
            $result = $db->query("  SELECT  ID, name
                                    FROM    Doctors
                                    WHERE   leavingDate IS NULL AND name LIKE '%". $data ."%'
                                    ORDER BY name");
            
            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
        * Obtiene los enterrador
        *
        * @return array
        */
        public function listDoctorsDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  d.ID, d.name, d.college, d.email
                                    FROM    Doctors d
                                    WHERE   d.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
         * Obtiene los datos de un cliente
         *
         * @return array
         */
        public function listToExport(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  d.ID, d.name, d.college
                                    FROM    (Doctors d)
                                    WHERE   d.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) > 0){
                $doctors = $db->resultToArray($result);
                $result = ["doctors" => $doctors];
				return $result;
			}else{
                return null;
			}
        }

        /**
        * Comprueba si existe un cura  con un nif dado
        *
        * @param array $cif
        *
        * @return array
        */
        public function isDelete($id){
            $db = new DbHandler;

            $id = cleanStr($id);
            $result = $db->query("  SELECT  COUNT(*) as row
                                    FROM    Doctors d
                                    WHERE   d.ID = $id AND d.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }

        /**
         * Añade un médico
         *
         * @param array Datos del médico
         * @return bool
         */
        public function createImport($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['college'] = cleanStr($data['college']);
            $data['email'] = cleanStr($data['email']);

            // Validación de campos
            if($data['name'] == ''){
                return "El nombre no puede ser vacío";
            }
            if($data['email'] != ''){
                if(!checkEmail($data['email'])){
                    return false;
                }
            }

            return $db->query(" INSERT INTO Doctors(name, college, email)
                                VALUES ('" . $data['name'] . "', '" . $data['college'] . "', '" . $data['email'] . "')");
        }

        /**
         * Modifica los datos de un médico
         * 
         * @param array Datos del médico
         * @return bool
         */
        public function updateImport($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['name'] = cleanStr($data['name']);
            $data['college'] = cleanStr($data['college']);
            $data['email'] = cleanStr($data['email']);

            // Validación de campos
            if($data['name'] == ''){
                return "El nombre no puede ser vacío";
            }
            if($data['email'] != ''){
                if(!checkEmail($data['email'])){
                    return false;
                }
            }

            return $db->query(" UPDATE  Doctors
                                SET     name = '" . $data['name'] . "',
                                        college = '" .  $data['college'] . "',
                                        email = '" .  $data['email'] . "'
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Obtiene los doctores con correo electrónico
         *
         * @param array $data ID del enterrador
         * @return array
         */
        public function getToEmailAddressee($search){
            $db = new DbHandler;

            $result = $db->query("  SELECT  d.ID as id,
                                            CONCAT(d.name, ' (', d.email, ')') as text
                                    FROM    Doctors d
                                    WHERE   d.email IS NOT NULL AND d.email != ''
                                        AND d.leavingDate IS NULL
                                        AND (
                                            d.name LIKE '%". $search ."%' OR 
                                            d.email LIKE '%". $search ."%'
                                        )");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArray($result);
        }

        /*
        * Obtiene el email de un coro
        *
        * @param array $data ID del coro
        * @return array
        */
        public function getEmail($id){
            $db = new DbHandler;

            $result = $db->query("  SELECT  d.email
                                    FROM    Doctors d
                                    WHERE   d.ID = " . $id);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>