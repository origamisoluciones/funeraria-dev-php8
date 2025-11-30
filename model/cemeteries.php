<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Cemeteries{
        /**
        * Añade un cementerio
        *
        * @param array $data
        *
        * @return bool
        */
        public function create($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['latitude'] = cleanStr($data['latitude']);
            $data['longitude'] = cleanStr($data['longitude']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            if(strlen($data['latitude']) == 0){
                $data['latitude'] = NULL;
            }

            if(strlen($data['longitude']) == 0){
                $data['longitude'] = NULL;
            }

            if(strlen($data['latitude']) == 0 && strlen($data['longitude']) == 0){
                return $db->query("INSERT INTO Cemeteries(location, name, address, mail, phones, leavingDate) 
                                    VALUES(" . $data['location'] . ", '" . $data['name'] . "', 
                                    '" . $data['address'] . "', '" . $data['mail'] . "', 
                                    '" . $data['phones'] . "', null)");
            }else{
                return $db->query("INSERT INTO Cemeteries(location, name, address, mail, phones, 
                                                            latitude, longitude, leavingDate) 
                                    VALUES(" . $data['location'] . ", '" . $data['name'] . "', 
                                    '" . $data['address'] . "', '" . $data['mail'] . "', 
                                    '" . $data['phones'] . "', " . $data['latitude'] . ", 
                                    " . $data['longitude'] . ", null)");
            } 
        }

        /**
        * Obtiene los datos de un cementerio
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['cemeteryID'] = cleanStr($data['cemeteryID']);

            $result = $db->query("SELECT c.cemeteryID, c.name as cemeteryName, c.address, c.mail, c.phones, 
                                         c.latitude, c.longitude,
                                         l.locationID, l.name as locationName, l.postalCode, l.province 
                                  FROM Cemeteries c 
                                  LEFT JOIN Locations l 
                                  ON c.location = l.locationID 
                                  WHERE c.cemeteryID = " . $data['cemeteryID']);
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Modifica los datos de un cementerio
        *
        * @param array $data
        *
        * @return bool
        */
        public function update($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['latitude'] = cleanStr($data['latitude']);
            $data['longitude'] = cleanStr($data['longitude']);
            $data['cemeteryID'] = cleanStr($data['cemeteryID']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            return $db->query(" UPDATE  Cemeteries
                                SET     location = " . $data['location'] . ", 
                                        name = '" . $data['name'] . "', 
                                        address = '" . $data['address'] . "',
                                        mail = '" . $data['mail'] . "', 
                                        phones = '" . $data['phones'] . "', 
                                        latitude = " . $data['latitude'] . ", 
                                        longitude = " . $data['longitude'] . " 
                                WHERE   cemeteryID = " . $data['cemeteryID'] . "");
        }

        /**
        * Elimina un cementerio
        *
        * @param array $data
        *
        * @return bool
        */
        public function delete($data){
            $db = new DbHandler;

            $data['cemeteryID'] = cleanStr($data['cemeteryID']);

            return $db->query(" UPDATE  Cemeteries
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                                WHERE   cemeteryID = " . $data['cemeteryID']);
        }

        /**
        * Obtiene los datos de los cementerios
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      c.cemeteryID, c.name as cemeteryName, c.address, c.mail, c.phones, 
                                                c.latitude, c.longitude
                                                l.locationID, l.name as locationName, l.postalCode, l.province 
                                    FROM        Cemeteries c 
                                    LEFT JOIN   Locations l ON c.location = l.locationID 
                                    WHERE       c.leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de la localidad dado un cementerio
        *
        * @param array $data
        * 
        * @return array
        */
        public function getLocation($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  l.locationID, l.name
                                    FROM    Cemeteries c, Locations l 
                                    WHERE   c.location = l.locationID AND
                                            c.cemeteryID = " . $data);

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los cementerios por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT  cemeteryID, name
                                    FROM    Cemeteries 
                                    WHERE   leavingDate IS NULL AND name LIKE '%". $name ."%'
                                    ORDER BY name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Obtiene los cementerios por nombre
         * 
         * @param string $name Nombre
         * @return array
         */
        public function searchByNameImport($name){
            $db = new DbHandler;

            $name = cleanStr($name);

            $result = $db->query("  SELECT  c.cemeteryID
                                    FROM    Cemeteries c
                                    WHERE   c.leavingDate IS NULL AND
                                            c.name = '$name'");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
        
        /*
        **
        * Obtiene los cementerios
        *
        * @return array
        */
        public function listCemeteriesDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      c.cemeteryID, c.name, c.address, l.name, c.mail, c.phones
                                    FROM        Cemeteries c 
                                    LEFT JOIN   Locations l ON c.location = l.locationID
                                    WHERE       c.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
                return [];
            }else{
                return $db->resultToArrayValue($result);
            }
        }

        /**
         * Obtiene los datos de un cementerio
         *
         * @return array
         */
        public function listToExport(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      c.cemeteryID, c.name as name, c.address,
                                                l.province, l.name as locationName, l.postalCode,
                                                c.mail, c.phones,  c.latitude, c.longitude
                                    FROM        (Cemeteries c)
                                    LEFT JOIN   Locations l ON c.location = l.locationID
                                    WHERE       c.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) > 0){
                $cemeteries = $db->resultToArray($result);
                $result = ["cemetery" => $cemeteries];
				return $result;
			}else{
                return false;
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
                                    FROM    Cemeteries c
                                    WHERE   c.cemeteryID = $id AND c.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }

        /**
        * Añade un cementerio
        *
        * @param array $data
        */
        public function createImport($data){
            $db = new DbHandler;
          
            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['latitude'] = cleanStr($data['latitude']);
            $data['longitude'] = cleanStr($data['longitude']);
            $data['phones'] = cleanStr($data['phones']);
            $data['mail'] = cleanStr($data['mail']);

            $data['latitude'] = $data['latitude'] == '' ? 'null' : $data['latitude'];
            $data['longitude'] = $data['longitude'] == '' ? 'null' : $data['longitude'];

            // Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }

            return $db->query(" INSERT INTO Cemeteries(location, name, address, latitude, longitude, phones, mail) 
                                VALUES (" . $data['location'] . ", '" . $data['name'] . "', '" . $data['address'] . "', " . $data['latitude'] . ", 
                                        " . $data['longitude'] . ", '" . $data['phones'] . "', '" . $data['mail'] . "')");
        }

        /**
         * Modifica los datos de un cura
         *
         * @param array $data
         */
        public function updateImport($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['latitude'] = cleanStr($data['latitude']);
            $data['longitude'] = cleanStr($data['longitude']);
            $data['cemeteryID'] = cleanStr($data['cemeteryID']);

            $data['latitude'] = $data['latitude'] == '' ? 'null' : $data['latitude'];
            $data['longitude'] = $data['longitude'] == '' ? 'null' : $data['longitude'];

            // Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }

            return $db->query(" UPDATE  Cemeteries
                                SET     location = " . $data['location'] . ",
                                        name = '" . $data['name'] . "',
                                        address = '" . $data['address'] . "',
                                        phones = '" . $data['phones'] . "',
                                        mail = '" . $data['mail'] . "',
                                        latitude = " . $data['latitude'] . ",
                                        longitude = " . $data['longitude'] . "
                                WHERE   cemeteryID = " . $data['cemeteryID']);
        }

        /**
         * Obtiene los cementerios con correo electrónico
         *
         * @param array $data ID del cementerio
         * @return array
         */
        public function getToEmailAddressee($search){
            $db = new DbHandler;

            $result = $db->query(" SELECT   c.cemeteryID as id,
                                            CONCAT(c.name, ' (', c.mail, ')') as text
                                    FROM    Cemeteries c
                                    WHERE   c.mail IS NOT NULL AND c.mail != ''
                                        AND c.leavingDate IS NULL
                                        AND (
                                            c.name LIKE '%". $search ."%' OR 
                                            c.mail LIKE '%". $search ."%'
                                        )");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArray($result);
        }

        /**
         * Obtiene el email de un cementerio
         *
         * @param array $data ID del cementerio
         * @return array
         */
        public function getEmail($id){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.mail as email
                                    FROM    Cemeteries c
                                    WHERE   c.cemeteryID = " . $id);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>