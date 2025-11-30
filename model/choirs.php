<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Choirs{
        /**
         * Añade un coro
         *
         * @param array $data Datos del coro
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['nif'] = cleanStr($data['nif']);
            $data['mail'] = cleanStr($data['mail']);
            $data['address'] = cleanStr($data['address']);
            $data['location'] = cleanStr($data['location']);
            $data['homePhone'] = cleanStr($data['homePhone']);
            $data['mobilePhone'] = cleanStr($data['mobilePhone']);
            $data['otherPhone'] = cleanStr($data['otherPhone']);

            
            // Validación de campos
            if($data['name'] == ''){
                return false;
            }
         
            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return false;
                }
            }
           
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }

            if($data['homePhone'] != ''){
                if(!checkPhone(str_replace(" ", "", $data['homePhone']))){
                    return false;
                }
            }
 
            if($data['mobilePhone'] != ''){
                if(!checkPhone(str_replace(" ", "", $data['mobilePhone']))){
                    return false;
                }
            }
 
            if($data['otherPhone'] != ''){
                if(!checkPhone(str_replace(" ", "", $data['otherPhone']))){
                    return false;
                }
            }
    
            if($data['location'] == ''){
                $data['location'] = "null";
            }
     
            if(!$this->existsCif($data['nif'])){
                return $db->query(" INSERT INTO Choirs(location, nif, name, address, mail, homePhone, mobilePhone, otherPhone) 
                                    VALUES(" . $data['location'] . ", '" . $data['nif'] . "', 
                                            '" . $data['name'] . "', '" . $data['address'] . "', 
                                            '" . $data['mail'] . "', '" . $data['homePhone'] . "',
                                            '" . $data['mobilePhone'] . "', '" . $data['otherPhone'] . "')");
            }else{
                return "CIF_ERROR";
            }
        }

        /**
         * Obtiene los datos de un coro
         *
         * @param array $data ID del coro
         * @return array
         */
        public function read($data){
            $db = new DbHandler;

            $data['choirID'] = cleanStr($data['choirID']);

            $result = $db->query("  SELECT      c.choirID, c.nif, c.name as choirName, c.address, 
                                                c.mail, c.homePhone, c.mobilePhone, c.otherPhone,
                                                l.locationID, l.name as locationName, l.postalCode, l.province
                                    FROM        (Choirs c)
                                    LEFT JOIN   Locations l ON c.location = l.locationID
                                    WHERE       choirID = " . $data['choirID']);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Modifica los datos de un coro
         *
         * @param array $data Datos del coro
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['homePhone'] = cleanStr($data['homePhone']);
            $data['mobilePhone'] = cleanStr($data['mobilePhone']);
            $data['otherPhone'] = cleanStr($data['otherPhone']);
            $data['choirID'] = cleanStr($data['choirID']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return false;
                }
            }

            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }

            if($data['homePhone'] != ''){
                if(!checkPhone($data['homePhone'])){
                    return false;
                }
            }

            if($data['mobilePhone'] != ''){
                if(!checkPhone($data['mobilePhone'])){
                    return false;
                }
            }

            if($data['otherPhone'] != ''){
                if(!checkPhone($data['otherPhone'])){
                    return false;
                }
            }

            if(!$this->existsCif($data['nif'],  $data['choirID'])){
                return $db->query(" UPDATE  Choirs
                                    SET     location = " . $data['location'] . ",
                                            nif = '" . $data['nif'] . "', 
                                            name = '" . $data['name'] . "',
                                            address = '" . $data['address'] . "',
                                            mail = '" . $data['mail'] . "', 
                                            homePhone = '" . $data['homePhone'] . "',
                                            mobilePhone = '" . $data['mobilePhone'] . "',
                                            otherPhone = '" . $data['otherPhone'] . "'
                                    WHERE   choirID = " . $data['choirID'] . "");
            }else{
                return "CIF_ERROR";
            }
        }

        /**
        * Comprueba si existe un coro para un nif dado
        *
        * @param array $cif, $id 
        *
        * @return array
        */
        public function existsCif($cif, $id = null){
            $db = new DbHandler;

            $cif = cleanStr($cif);

            if($cif == ''){
                return false;
            }
            if($id !== null){
                $id = cleanStr($id);
                $result = $db->query("  SELECT   COUNT(*) as row
                                        FROM      Choirs c
                                        WHERE     c.nif = '" . $cif . "' AND c.choirID != '" . $id . "' AND c.leavingDate IS NULL");
            } else{
                $result = $db->query("  SELECT   COUNT(*) as row
                                        FROM      Choirs c
                                        WHERE     c.nif = '" . $cif . "' AND c.leavingDate IS NULL");
            }

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return false;
            }else{
                return true;
            }   
            
        }

        /**
        * Comprueba si existe un coro para un nif dado
        *
        * @param array $cif, $id 
        *
        * @return array
        */
        public function existsNameChoir($name, $id = null){
            $db = new DbHandler;

            $name = cleanStr($name);

            if($name == ''){
                return false;
            }
            if($id !== null){
                $id = cleanStr($id);
                $result = $db->query("  SELECT   COUNT(*) as row
                                        FROM      Choirs c
                                        WHERE     c.name = '" . $name . "' AND c.choirID != '" . $id . "' AND c.leavingDate IS NULL");
            } else{
                $result = $db->query("  SELECT   COUNT(*) as row
                                        FROM      Choirs c
                                        WHERE     c.name = '" . $name . "' AND c.leavingDate IS NULL");
            }

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return false;
            }else{
                return true;
            }   
            
        }

        /**
         * Elimina un coro
         *
         * @param array $data ID del coro
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['choirID'] = cleanStr($data['choirID']);

            return $db->query(" UPDATE  Choirs 
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                                WHERE   choirID = " . $data['choirID']);
        }

        /**
        * Obtiene los datos de los coros
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("SELECT        c.nif, c.name as choirName, c.address, c.mail, c.phones, c.leavingDate,
                                                l.locationID, l.name as locationName, l.postalCode, l.province 
                                  FROM          Choirs c
                                  LEFT JOIN     Locations l ON c.location = l.locationID 
                                  WHERE         c.leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de la localidad dado un coro
        *
        * @param array $data
        * 
        * @return array
        */
        public function getLocation($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("SELECT l.locationID, l.name
                                  FROM Choirs c, Locations l 
                                  WHERE c.location = l.locationID AND
                                        c.choirID = " . $data);

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los coros
        *
        * @return array
        */
        public function listChoirsDatatables(){
            $db = new DbHandler;

            $result = $db->query("SELECT    c.choirID, c.name, c.nif, c.address, l.name, c.mail, c.homePhone, c.mobilePhone, c.otherPhone
                                  FROM      Choirs c
                                  LEFT JOIN Locations l ON c.location = l.locationID
                                  WHERE     c.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
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
                                    FROM    Choirs c
                                    WHERE   c.choirID = $id AND c.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }

        public function listToExport(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      c.choirID, c.name as name, c.address, c.nif,
                                                l.province, l.name as locationName, l.postalCode,
                                                c.mail, c.homePhone, c.mobilePhone, c.otherPhone
                                    FROM        (Choirs c)
                                    LEFT JOIN   Locations l ON c.location = l.locationID
                                    WHERE       c.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) > 0){
                $choirs = $db->resultToArray($result);
                $result = ["choirs" => $choirs];
                return $result;
			}else{
               return null;
			}
        }

        /**
        * Añade un cura
        *
        * @param array $data
        */
        public function createImport($data){
            $db = new DbHandler;
          
            $data['name'] = cleanStr($data['name']);
            $data['nif'] = cleanStr($data['nif']);
            $data['mail'] = cleanStr($data['mail']);
            $data['address'] = cleanStr($data['address']);
            $data['location'] = cleanStr($data['location']);
            $data['homePhone'] = cleanStr($data['homePhone']);
            $data['mobilePhone'] = cleanStr($data['mobilePhone']);
            $data['otherPhone'] = cleanStr($data['otherPhone']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }
         
            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return false;
                }
            }
           
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }

            if($data['homePhone'] != ''){
                if(!checkPhone(str_replace(" ", "", $data['homePhone']))){
                    return false;
                }
            }
 
            if($data['mobilePhone'] != ''){
                if(!checkPhone(str_replace(" ", "", $data['mobilePhone']))){
                    return false;
                }
            }
 
            if($data['otherPhone'] != ''){
                if(!checkPhone(str_replace(" ", "", $data['otherPhone']))){
                    return false;
                }
            }
    
            if($data['location'] == ''){
                $data['location'] = "null";
            }
    
            if(!$this->existsCif($data['nif'])){
                return $db->query(" INSERT INTO Choirs(location, nif, name, address, mail, homePhone, mobilePhone, otherPhone) 
                                    VALUES(" . $data['location'] . ", '" . $data['nif'] . "', 
                                            '" . $data['name'] . "', '" . $data['address'] . "', 
                                            '" . $data['mail'] . "', '" . $data['homePhone'] . "',
                                            '" . $data['mobilePhone'] . "', '" . $data['otherPhone'] . "')");
            }else{
                return "Ya existe un coro con ese NIF";
            }
        }

        /**
         * Modifica los datos de un cura
         *
         * @param array $data
         */
        public function updateImport($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['homePhone'] = cleanStr($data['homePhone']);
            $data['mobilePhone'] = cleanStr($data['mobilePhone']);
            $data['otherPhone'] = cleanStr($data['otherPhone']);
            $data['choirID'] = cleanStr($data['choirID']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return false;
                }
            }

            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }

            if($data['homePhone'] != ''){
                if(!checkPhone($data['homePhone'])){
                    return false;
                }
            }

            if($data['mobilePhone'] != ''){
                if(!checkPhone($data['mobilePhone'])){
                    return false;
                }
            }

            if($data['otherPhone'] != ''){
                if(!checkPhone($data['otherPhone'])){
                    return false;
                }
            }

            if(!$this->existsCif($data['nif'],  $data['choirID'])){
                return $db->query(" UPDATE  Choirs
                                    SET     location = " . $data['location'] . ",
                                            nif = '" . $data['nif'] . "', 
                                            name = '" . $data['name'] . "',
                                            address = '" . $data['address'] . "',
                                            mail = '" . $data['mail'] . "', 
                                            homePhone = '" . $data['homePhone'] . "',
                                            mobilePhone = '" . $data['mobilePhone'] . "',
                                            otherPhone = '" . $data['otherPhone'] . "'
                                    WHERE   choirID = " . $data['choirID'] . "");
            }else{
                return "Ya existe un coro con ese NIF";
            }
        }

        /**
         * Obtiene el nombre de un coro por ID
         *
         * @param array $data ID del coro
         * @return array
         */
        public function getChoir($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  c.name
                                    FROM    Choirs c
                                    WHERE   c.choirID = $id");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result)[0]['name'];
			}
        }

        /**
         * Obtiene los coros con correo electrónico
         *
         * @param array $data ID del coro
         * @return array
         */
        public function getToEmailAddressee($search){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.choirID as id,
                                            CONCAT(c.name, ' (', c.mail, ')') as text
                                    FROM    Choirs c
                                    WHERE   c.mail IS NOT NULL AND c.mail != ''
                                        AND c.leavingDate IS NULL
                                        AND (
                                            c.name LIKE '%". $search ."%' OR 
                                            c.mail LIKE '%". $search ."%'
                                        )");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArray($result);
        }

        /**
         * Obtiene el email de un coro
         *
         * @param array $data ID del coro
         * @return array
         */
        public function getEmail($id){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.mail as email
                                    FROM    Choirs c
                                    WHERE   c.choirID = " . $id);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>