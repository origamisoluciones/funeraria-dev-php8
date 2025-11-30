<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Crematoriums{
        /**
        * Añade un crematorio
        *
        * @param array $data
        */
        public function create($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['company'] = cleanStr($data['company']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['isYourOwn'] = cleanStr($data['isYourOwn']);
            
            if(strlen($data['latitude']) > 0){
                $data['latitude'] = cleanStr($data['latitude']);
            }

            if(strlen($data['longitude']) > 0){
                $data['longitude'] = cleanStr($data['longitude']);
            }
           
            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }

            if(strlen($data["latitude"]) == 0 && strlen($data["longitude"]) == 0){

                if(strlen($data["company"]) == 0){
                    $company = null;
                } else{
                    $company = $data["company"];
                }
                return $db->query("INSERT INTO Crematoriums(location, name, company, address, mail, phones, isYourOwn, leavingDate) 
                                    VALUES(
                                        " . $data['location'] . ", '" . $data['name'] . "', 
                                        '" . $company . "', '" . $data['address'] . "', '" . $data['mail'] . "', 
                                        '" . $data['phones'] . "', " . $data['isYourOwn'] . ", null
                                    )
                ");
            }else{
                return $db->query("INSERT INTO Crematoriums(location, name, company, address, mail, phones, isYourOwn, latitude, longitude, leavingDate) 
                                VALUES(
                                    " . $data['location'] . ", '" . $data['name'] . "', 
                                    '" . $data['company'] . "', '" . $data['address'] . "', '" . $data['mail'] . "', 
                                    '" . $data['phones'] . "', " . $data['isYourOwn'] . ", 
                                    " . $data['latitude'] . ", " . $data['longitude'] . ", null
                                )
                ");
            }
        }

        /**
        * Obtiene los datos de un crematorio
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['crematoriumID'] = cleanStr($data['crematoriumID']);

            $result = $db->query("  SELECT      c.crematoriumID, c.name as crematoriumName, c.company, c.address, c.mail, 
                                                c.phones, c.isYourOwn, c.leavingDate, c.latitude, c.longitude, 
                                                l.locationID, l.name as locationName, l.postalCode, l.province
                                    FROM        Crematoriums c 
                                    LEFT JOIN   Locations l ON c.location = l.locationID
                                    WHERE       c.crematoriumID = " . $data['crematoriumID'] . "");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Modifica los datos de un crematorio
        *
        * @param array $data
        */
        public function update($data){
            $db = new DbHandler;
    
            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['company'] = cleanStr($data['company']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['isYourOwn'] = cleanStr($data['isYourOwn']);
            $data['latitude'] = cleanStr($data['latitude']);
            $data['longitude'] = cleanStr($data['longitude']);
            $data['crematoriumID'] = cleanStr($data['crematoriumID']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }

            return $db->query(" UPDATE  Crematoriums
                                SET     location = " . $data['location'] . ", 
                                        name = '" . $data['name'] . "', 
                                        address = '" . $data['address'] . "', 
                                        company = '" . $data['company'] . "', 
                                        mail = '" . $data['mail'] . "', 
                                        phones = '" . $data['phones'] . "', 
                                        isYourOwn = " . $data['isYourOwn'] . ", 
                                        latitude = " . $data['latitude'] . ", 
                                        longitude = " . $data['longitude'] . "
                               WHERE    crematoriumID = " . $data['crematoriumID']);
        }

        /**
        * Elimina un crematorio
        *
        * @param array $data
        */
        public function delete($data){
            $db = new DbHandler;

            $data['crematoriumID'] = cleanStr($data['crematoriumID']);

            return $db->query(" UPDATE  Crematoriums
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                                WHERE   crematoriumID = " . $data['crematoriumID']);
        }

        /**
        * Obtiene los crematorios
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  *
                                    FROM    Crematoriums c, Locations l
                                    WHERE   c.location = l.locationID AND 
                                            c.leavingDate = null");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de la localidad dado un crematorio
        *
        * @param array $data
        * 
        * @return array
        */
        public function getLocation($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  l.locationID, l.name
                                    FROM    Crematoriums c, Locations l 
                                    WHERE   c.location = l.locationID AND
                                            c.crematoriumID = " . $data);

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los crematorios por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT      crematoriumID, name
                                    FROM        Crematoriums 
                                    WHERE       leavingDate IS NULL AND name LIKE '%". $name ."%'
                                    ORDER BY    name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los crematorios propios por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchOwnsByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT      crematoriumID, name
                                    FROM        Crematoriums 
                                    WHERE       isYourOwn = 1 AND leavingDate IS NULL AND name LIKE '%". $name ."%'
                                    ORDER BY    name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /*
        * Obtiene los crematorios
        *
        * @return array
        */
        public function listCrematoriumsDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      c.crematoriumID, c.name, c.company, c.address, l.name, c.phones, c.isYourOwn
                                    FROM        Crematoriums c
                                    LEFT JOIN   Locations l ON c.location = l.locationID
                                    WHERE       c.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
         * Obtiene los datos de un crematorio
         *
         * @return array
         */
        public function listToExport(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      c.crematoriumID, c.name as name, c.company,
                                                c.address, c.mail, c.phones, c.isYourOwn, c.latitude, c.longitude,
                                                l.province, l.name as locationName, l.postalCode
                                    FROM        (Crematoriums c)
                                    LEFT JOIN   Locations l ON c.location = l.locationID
                                    WHERE       c.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) > 0){
                $crematoriums = $db->resultToArray($result);
                $result = ["crematoriums" => $crematoriums];
				return $result;
			}else{
                return null;
			}
        }

        /**
        * Comprueba si existe un crematorio  con un nif dado
        *
        * @param array $cif
        *
        * @return array
        */
        public function isDelete($id){
            $db = new DbHandler;

            $id = cleanStr($id);
            $result = $db->query("  SELECT  COUNT(*) as row
                                    FROM    Crematoriums c
                                    WHERE   c.crematoriumID = $id AND c.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }

        /**
        * Añade un crematorio
        *
        * @param array $data
        */
        public function createImport($data){
            $db = new DbHandler;
          
            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['company'] = cleanStr($data['company']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['isYourOwn'] = cleanStr($data['isYourOwn']);
            
            if(strlen($data['latitude']) > 0){
                $data['latitude'] = cleanStr($data['latitude']);
            }
            if(strlen($data['longitude']) > 0){
                $data['longitude'] = cleanStr($data['longitude']);
            }

            // Validación de campos
            if($data['name'] == ''){
                return "El nombre no puede ser vacío";
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "El formato del email es incorrecto";
                }
            }
            if(strlen($data["latitude"]) == 0 && strlen($data["longitude"]) == 0){

                if(strlen($data["company"]) == 0){
                    $company = null;
                } else{
                    $company = $data["company"];
                }
                return $db->query(" INSERT INTO Crematoriums(location, name, company, address, mail, phones, isYourOwn, leavingDate) 
                                    VALUES(
                                        " . $data['location'] . ", '" . $data['name'] . "', 
                                        '" . $company . "', '" . $data['address'] . "', '" . $data['mail'] . "', 
                                        '" . $data['phones'] . "', " . $data['isYourOwn'] . ", null
                                    )
                ");
            }else{
                $data['longitude'] = preg_replace('/((?<=\.)[^.]*)\./', '$1',$data['longitude']);
                $data['latitude'] = preg_replace('/((?<=\.)[^.]*)\./', '$1',$data['latitude']);
       
                return $db->query(" INSERT INTO Crematoriums(location, name, company, address, mail, phones, isYourOwn, latitude, longitude, leavingDate) 
                                    VALUES(
                                        " . $data['location'] . ", '" . $data['name'] . "', 
                                        '" . $data['company'] . "', '" . $data['address'] . "', '" . $data['mail'] . "', 
                                        '" . $data['phones'] . "', " . $data['isYourOwn'] . ", 
                                        " . $data['latitude'] . ", " . $data['longitude'] . ", null
                                    )
                ");
            }
        }

        /**
         * Modifica los datos de un crematorio
         *
         * @param array $data
         */
        public function updateImport($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['company'] = cleanStr($data['company']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['isYourOwn'] = cleanStr($data['isYourOwn']);
            $data['latitude'] = cleanStr($data['latitude']);
            $data['longitude'] = cleanStr($data['longitude']);
            $data['crematoriumID'] = cleanStr($data['crematoriumID']);

            // Validación de campos
            if($data['name'] == ''){
                return "El nombre no puede ser vacío";
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "El formato del email es incorrecto";
                }
            }

            if(strlen($data["latitude"]) > 0 && strlen($data["longitude"]) > 0){
                $data['longitude'] = preg_replace('/((?<=\.)[^.]*)\./', '$1',$data['longitude']);
                $data['latitude'] = preg_replace('/((?<=\.)[^.]*)\./', '$1',$data['latitude']);

                return $db->query(" UPDATE Crematoriums
                                    SET     location = " . $data['location'] . ", name = '" . $data['name'] . "', 
                                            address = '" . $data['address'] . "', company = '" . $data['company'] . "', 
                                            mail = '" . $data['mail'] . "', phones = '" . $data['phones'] . "', 
                                            isYourOwn = " . $data['isYourOwn'] . ", latitude = " . $data['latitude'] . ", 
                                            longitude = " . $data['longitude'] . "
                                    WHERE    crematoriumID = " . $data['crematoriumID']);
            }else{
                return $db->query(" UPDATE Crematoriums
                                    SET     location = " . $data['location'] . ", name = '" . $data['name'] . "', 
                                            address = '" . $data['address'] . "', company = '" . $data['company'] . "', 
                                            mail = '" . $data['mail'] . "', phones = '" . $data['phones'] . "', 
                                            isYourOwn = " . $data['isYourOwn'] . "
                                    WHERE    crematoriumID = " . $data['crematoriumID']);
            }
        }
    }
?>