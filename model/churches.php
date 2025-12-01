<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Churches{

        /**
        * Obtiene las iglesias
        *
        * @return array
        */
        public function listChurchesDatatables(){
            $db = new DbHandler;

            $result = $db->query("SELECT    c.churchID, c.name, c.address, l.name, c.email, c.phones
                                  FROM      Churches c
                                  LEFT JOIN Locations l ON c.location = l.locationID
                                  WHERE     c.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }
        
        /**
        * Añade una iglesia
        *
        * @param array $data
        */
        public function create($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['phones'] = cleanStr($data['phones']);
            $data['latitude'] = cleanStr($data['latitude']);
            $data['longitude'] = cleanStr($data['longitude']);
            $data['email'] = cleanStr($data['email']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Churches 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Churches 
                                        WHERE   extraID = '" . $extraID . "'");
            }

            if(strlen($data["longitude"]) == 0 && strlen($data["latitude"]) == 0){

                $db->query("INSERT INTO Churches(location, name, address, email, phones, leavingDate, extraID) 
                            VALUES (" . $data['location'] . ", '" . $data['name'] . "', '" . $data['address'] . "', '" . $data['email'] . "', 
                                '" . $data['phones'] . "', null, '" . $extraID . "')");
            }else{

                $db->query("INSERT INTO Churches(location, name, address, email, phones, latitude, longitude, leavingDate, extraID) 
                            VALUES (" . $data['location'] . ", '" . $data['name'] . "', '" . $data['address'] . "', '" . $data['email'] . "', 
                                '" . $data['phones'] . "', " . $data['latitude'] . ", " . $data['longitude'] . ", null, '" . $extraID . "')"); 
            }
            
            $church = $db->query("  SELECT  churchID
                                    FROM    Churches
                                    WHERE   extraID = '" . $extraID . "'");

            $church = $db->resultToArray($church)[0]['churchID'];

            $priests = $data['priests'];

            if($priests != null){
                foreach($priests as $priest){
                    $priest = cleanStr($priest);
                    $db->query("INSERT INTO ChurchesPriests(church, priest)
                                VALUES ($church, $priest)");
                }
            }

            return true;
        }

        /**
        * Obtiene los datos de una iglesia
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['churchID'] = cleanStr($data['churchID']);

            $result = $db->query("  SELECT      c.churchID, c.name as churchName, c.address, c.email, c.phones, 
                                                c.leavingDate, c.latitude, c.longitude, 
                                                l.locationID, l.name as locationName, l.postalCode, l.province
                                    FROM        Churches c
                                    LEFT JOIN   Locations l ON c.location = l.locationID
                                    WHERE       c.churchID = " . $data['churchID']);
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                $church = $db->resultToArray($result)[0];
                
                $priests = $db->query(" SELECT  cp.priest, p.name
                                        FROM    ChurchesPriests cp, Priests p
                                        WHERE   cp.priest = p.priestID AND
                                                cp.church = " . $church['churchID']);

                if(mysqli_num_rows($result) == 0){
                    return array($church, null);
                }else{
                    $priests = $db->resultToArray($priests);

                    return array($church, $priests);
                }
			}
        }

        /**
        * Modifica los datos de una iglesia
        *
        * @param array $data
        */
        public function update($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['phones'] = cleanStr($data['phones']);
            $data['latitude'] = cleanStr($data['latitude']);
            $data['longitude'] = cleanStr($data['longitude']);
            $data['email'] = cleanStr($data['email']);
            $data['churchID'] = cleanStr($data['churchID']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            if(strlen($data["longitude"]) == 0 && strlen($data["latitude"]) == 0){
                
                $result = $db->query("  UPDATE  Churches
                                        SET     location = " . $data['location'] . ", 
                                                name = '" . $data['name'] . "', 
                                                address = '" . $data['address'] . "', 
                                                email = '" . $data['email'] . "',
                                                phones = '" . $data['phones'] . "'
                                        WHERE   churchID = " . $data['churchID']);
            }else{

                $result = $db->query("  UPDATE  Churches
                                        SET     location = " . $data['location'] . ", 
                                                name = '" . $data['name'] . "', 
                                                address = '" . $data['address'] . "', 
                                                email = '" . $data['email'] . "',
                                                phones = '" . $data['phones'] . "', 
                                                latitude = " . $data['latitude'] . ", 
                                                longitude = " . $data['longitude'] . "
                                        WHERE   churchID = " . $data['churchID']);
            }

            if(isset($data['priests'])){
                $priests = '(';
                foreach($data['priests'] as $priest){
                    $priest = cleanStr($priest);

                    $priests .= $priest . ',';

                    $result = $db->query("  SELECT  ID
                                            FROM    ChurchesPriests
                                            WHERE   church = " . $data['churchID'] . " AND
                                                    priest = $priest");

                    if(mysqli_num_rows($result) == 0){
                        $db->query("INSERT INTO ChurchesPriests(priest, church)
                                    VALUES ($priest, " . $data['churchID'] . ")");
                    }
                }
                $priests = substr($priests, 0, -1);
                $priests .= ')';

                $db->query("DELETE FROM ChurchesPriests WHERE church = " . $data['churchID'] . " AND priest NOT IN $priests");
            }else{
                $db->query("DELETE FROM ChurchesPriests WHERE church = " . $data['churchID']);
            }
            
            return true;
        }

        /**
        * Elimina una iglesia
        *
        * @param array $data
        */
        public function delete($data){
            $db = new DbHandler;

            $data['churchID'] = cleanStr($data['churchID']);

            return $db->query(" UPDATE  Churches
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                                WHERE   churchID = " . $data['churchID']);
        }

        /**
        * Obtiene los datos de las iglesias
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      c.churchID, c.name as churchName, c.address, c.phones, c.leavingDate, c.latitude, c.longitude, 
                                                l.locationID, l.name as locationName, l.postalCode, l.province
                                    FROM        Churches c
                                    LEFT JOIN   Locations l ON c.location = l.locationID
                                    WHERE       c.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene las iglesias por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT      churchID, name
                                    FROM        Churches 
                                    WHERE       leavingDate IS NULL AND name LIKE '%". $name ."%'
                                    ORDER BY    name");
            
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
                                    FROM    Churches c, Locations l 
                                    WHERE   c.location = l.locationID AND
                                            c.churchID = " . $data . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Obtiene los datos de un cura
         *
         * @param array $data ID del cura
         * @return array
         */
        public function listToExport(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      c.churchID, c.name as name, c.address,  c.email, l.province, 
                                                l.name as locationName, l.postalCode,
                                                c.phones, c.latitude,  c.longitude
                                    FROM        (Churches c)
                                    LEFT JOIN   Locations l ON c.location = l.locationID
                                    WHERE       c.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                $churchs = $db->resultToArray($result);

                $result = $db->query("  SELECT  cp.church, p.name
                                        FROM    ChurchesPriests cp, Priests p
                                        WHERE   cp.priest = p.priestID ");

                if(mysqli_num_rows($result) == 0){
                    $result = ["churchs" => $churchs];
                }else{
                    $priestChurch = $db->resultToArray($result);
                    $result = ["churchs" => $churchs,
                                "priestChurch" => $priestChurch
                            ];
                }
                return $result;
			}
        }

        /**
        * Añade un cura
        *
        * @param array $data
        */
        public function createImport($data){
            $db = new DbHandler;
          
            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['email'] = cleanStr($data['email']);
            $data['phones'] = cleanStr($data['phones']);
            $data['latitude'] = cleanStr($data['latitude']);
            $data['longitude'] = cleanStr($data['longitude']);

            // Validación de campos
            if($data['name'] == ''){
                return "El nombre no puede ser vacío";
            }

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Churches 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Churches 
                                        WHERE   extraID = '" . $extraID . "'");
            }
            
     
            if(strlen($data["longitude"]) == 0 && strlen($data["latitude"]) == 0){

                $db->query("INSERT INTO Churches(location, name, address, email, phones, leavingDate, extraID) 
                            VALUES (" . $data['location'] . ", '" . $data['name'] . "', '" . $data['address'] . "', '" . $data['email'] . "', 
                                '" . $data['phones'] . "', null, '" . $extraID . "')");
            }else{
                $data['longitude'] = preg_replace('/((?<=\.)[^.]*)\./', '$1',$data['longitude']);
                $data['latitude'] = preg_replace('/((?<=\.)[^.]*)\./', '$1',$data['latitude']);

                $db->query("INSERT INTO Churches(location, name, address, email, phones, latitude, longitude, leavingDate, extraID) 
                            VALUES (" . $data['location'] . ", '" . $data['name'] . "', '" . $data['address'] . "', '" . $data['email'] . "', 
                                '" . $data['phones'] . "', " . $data['latitude'] . ", " . $data['longitude'] . ", null, '" . $extraID . "')"); 
            }
            
            $church = $db->query("  SELECT  churchID
                                    FROM    Churches
                                    WHERE   extraID = '" . $extraID . "'");

            $church = $db->resultToArray($church)[0]['churchID'];

            $priests = $data['priests'];

            if($priests != null){
                foreach($priests as $priest){
                    $priest = cleanStr($priest);
                    $db->query("INSERT INTO ChurchesPriests(church, priest)
                                VALUES ($church, $priest)");
                }
            }

            return true;
        }

        /**
        * Comprueba si existe una iglesia
        *
        * @param array $cif
        *
        * @return array
        */
        public function isDelete($id){
            $db = new DbHandler;

            $id = cleanStr($id);
            $result = $db->query("  SELECT  COUNT(*) as row
                                    FROM    Churches p
                                    WHERE   p.churchID = $id AND p.leavingDate IS NULL");

            $churchExists = $db->resultToArray($result)[0]['row'];

            if($churchExists == 0){
                return true;
            }else{
                return false;
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
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['email'] = cleanStr($data['email']);
            $data['phones'] = cleanStr($data['phones']);
            $data['latitude'] = cleanStr($data['latitude']);
            $data['longitude'] = cleanStr($data['longitude']);
            $data['churchID'] = cleanStr($data['churchID']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            if(strlen($data["longitude"]) == 0 && strlen($data["latitude"]) == 0){
                $result = $db->query("  UPDATE  Churches
                                        SET     location = " . $data['location'] . ", 
                                                name = '" . $data['name'] . "', 
                                                address = '" . $data['address'] . "', 
                                                email = '" . $data['email'] . "', 
                                                phones = '" . $data['phones'] . "'
                                        WHERE   churchID = " . $data['churchID']);
            } else{
                $data['longitude'] = preg_replace('/((?<=\.)[^.]*)\./', '$1',$data['longitude']);
                $data['latitude'] = preg_replace('/((?<=\.)[^.]*)\./', '$1',$data['latitude']);

                $result = $db->query("  UPDATE  Churches
                                        SET     location = " . $data['location'] . ", 
                                                name = '" . $data['name'] . "', 
                                                address = '" . $data['address'] . "', 
                                                email = '" . $data['email'] . "',
                                                phones = '" . $data['phones'] . "', 
                                                latitude = " . $data['latitude'] . ", 
                                                longitude = " . $data['longitude'] . "
                                        WHERE   churchID = " . $data['churchID']);
            }
           
            if(isset($data['priests']) && count($data['priests']) > 0){
                $priests = '(';
                foreach($data['priests'] as $priest){
                    $priest = cleanStr($priest);

                    $priests .= $priest . ',';

                    $result = $db->query("  SELECT  ID
                                            FROM    ChurchesPriests
                                            WHERE   church = " . $data['churchID'] . " AND
                                                    priest = $priest");

                    if(mysqli_num_rows($result) == 0){
                        $db->query("INSERT INTO ChurchesPriests(priest, church)
                                    VALUES ($priest, " . $data['churchID'] . ")");
                    }
                }
                $priests = substr($priests, 0, -1);
                $priests .= ')';

                $db->query("DELETE FROM ChurchesPriests WHERE church = " . $data['churchID'] . " AND priest NOT IN $priests");
            }else{
                $db->query("DELETE FROM ChurchesPriests WHERE church = " . $data['churchID']);
            }
            
            return true;
        }

        /**
         * Obtiene las iglesias con correo electrónico
         *
         * @param array $data ID del enterrador
         * @return array
         */
        public function getToEmailAddressee($search){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.churchID as id,
                                            CONCAT(c.name, ' (', c.email, ')') as text
                                    FROM    Churches c
                                    WHERE   c.email IS NOT NULL AND c.email != ''
                                        AND c.leavingDate IS NULL
                                        AND (
                                            c.name LIKE '%". $search ."%' OR 
                                            c.email LIKE '%". $search ."%'
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

            $result = $db->query("  SELECT  c.email
                                    FROM    Churches c
                                    WHERE   c.churchID = " . $id);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>