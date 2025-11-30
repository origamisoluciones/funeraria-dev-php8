<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class FuneralHomes{
        
        /**
        * Añade una funeraria
        *
        * @param array $data
        */
        public function create($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['fax'] = cleanStr($data['fax']);

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

            $flag = 0;

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    FuneralHomes 
                                    WHERE   extraID = '" . $extraID . "'");

            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    FuneralHomes 
                                        WHERE   extraID = '" . $extraID . "'");
            }

            // if(!$this->existsCif($data['nif'])){
                $result = $db->query("  INSERT INTO FuneralHomes(location, nif, name, address, mail, phones, fax, leavingDate, extraID) 
                                        VALUES(" . $data['location'] . ", '" . $data['nif'] . "', '" . $data['name'] . "', '" . $data['address'] . "', 
                                            '" . $data['mail'] . "', '" . $data['phones'] . "', '" . $data['fax'] . "', null, '" . $extraID . "')");

                if(!$result){
                    $flag++;
                }else{
                    $result = $db->query("  SELECT  funeralHomeID 
                                            FROM    FuneralHomes 
                                            WHERE   extraID = '" . $extraID . "'");

                    if(mysqli_num_rows($result) > 0){
                        if($data['person'] != ""){
                            $id = $db->resultToArray($result)[0]['funeralHomeID'];
                            $contactPeople = explode("-", $data['person']);
                            foreach($contactPeople as $person){
                                $person = cleanStr($person);
                                $personalData = explode("?", $person);
                
                                $result = $db->query("  INSERT INTO ContactPeople_FuneralHomes (funeralHome, person, post) 
                                                        VALUES(" . $id . ", '" . $personalData[0] . "', '" . $personalData[1] . "')");
                                
                                if(!$result){
                                    $flag++;
                                }
                            }
                        }
                    }
                }

                if($flag > 0){
                    return false;
                }else{
                    return true;
                }
            // }else{
            //     return "CIF_ERROR";
            // }
        }

        /**
        * Obtiene los datos de una funeraria
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['funeralHomeID'] = cleanStr($data['funeralHomeID']);

            $result = $db->query("  SELECT      f.funeralHomeID, f.nif, f.name as funeralHomeName, f.address, 
                                                f.mail, f.phones, f.fax, f.leavingDate, 
                                                l.locationID, l.name as locationName, l.postalCode, l.province
                                    FROM        FuneralHomes f
                                    LEFT JOIN   Locations l ON f.location = l.locationID
                                    WHERE       funeralHomeID = " . $data['funeralHomeID'] . "");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene las personas de contacto de una funeraria
        *
        * @param array $data
        *
        * @return array
        */
        public function readContactPeople($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $contactPeople = $db->query("   SELECT  person, post 
                                            FROM    ContactPeople_FuneralHomes 
                                            WHERE   funeralHome = " . $data . "");

            if(mysqli_num_rows($contactPeople) == 0){
                return null;
            }else{
                return $db->resultToArray($contactPeople);
            }
        }

        /**
        * Modifica los datos de una funeraria
        *
        * @param array $data
        */
        public function update($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['fax'] = cleanStr($data['fax']);
            $data['funeralHomeID'] = cleanStr($data['funeralHomeID']);

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
            // if(!$this->existsCif($data['nif'], $data['funeralHomeID'])){
                $result = $db->query("  UPDATE  FuneralHomes
                                        SET     location = " . $data['location'] . ", 
                                                nif = '" . $data['nif'] . "', name = '" . $data['name'] . "', 
                                                address = '" . $data['address'] . "', mail = '" . $data['mail'] . "', 
                                                phones = '" . $data['phones'] . "', fax = '" . $data['fax'] . "' 
                                        WHERE   funeralHomeID = " . $data['funeralHomeID'] . "");
                
                if(!$result){
                    return false;
                }else{
                    $result = $db->query("DELETE FROM ContactPeople_FuneralHomes WHERE funeralHome = " . $data['funeralHomeID'] . "");

                    if(!$result){
                        return false;
                    }else{
                        $flag = 0;
                        
                        if($data['person'] != ""){
                            $contactPeople = explode("-", $data['person']);
                            foreach($contactPeople as $person){
                                $personalData = explode("?", $person);
                
                                $result = $db->query("  INSERT INTO ContactPeople_FuneralHomes(funeralHome, person, post) 
                                                        VALUES(" . $data['funeralHomeID'] . ", '" . $personalData[0] . "', '" . $personalData[1] . "')");
                                
                                if(!$result){
                                    $flag++;
                                }
                            }
                        }
                    }

                    if($flag > 0){
                        return false;
                    }else{
                        return true;
                    }
                }
            // }else{
            //     return "CIF_ERROR";
            // }
        }

        /**
        * Comprueba si existe una funeraria con un cif dado 
        *
        * @param array $cif
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
                $result = $db->query("  SELECT  COUNT(*) as row
                                        FROM    FuneralHomes f
                                        WHERE   f.nif = '" . $cif . "' AND 
                                                f.funeralHomeID != '" . $id . "' AND 
                                                f.leavingDate IS NULL");
            } else{
                $result = $db->query("  SELECT  COUNT(*) as row
                                        FROM    FuneralHomes f
                                        WHERE   f.nif = '" . $cif . "' AND f.leavingDate IS NULL");
            }

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return false;
            }else{
                return true;
            }   
        }

        /**
        * Elimina una funeraria
        *
        * @param array $data
        */
        public function delete($data){
            $db = new DbHandler;

            $data['funeralHomeID'] = cleanStr($data['funeralHomeID']);

            return $db->query(" UPDATE  FuneralHomes
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                                WHERE   funeralHomeID = " . $data['funeralHomeID'] . "");
        }

        /**
        * Obtiene los datos de las funerarias
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  funeralHomeID, name
                                    FROM    FuneralHomes 
                                    WHERE   leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de una funeraria en concreto
        *
        * @param array $data
        * 
        * @return array
        */
        public function getFuneralHome($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      fh.nif, fh.phones, fh.fax, fh.address, cp.person, fh.name
                                    FROM        FuneralHomes fh
                                    LEFT JOIN   ContactPeople_FuneralHomes cp ON fh.funeralHomeID = cp.funeralHome
                                    WHERE       fh.funeralHomeID = " . $data . "");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }
   
        /**
        * Obtiene los datos de la localidad dado una funeraria
        *
        * @param array $data
        * 
        * @return array
        */
        public function getLocation($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  l.locationID, l.name
                                    FROM    FuneralHomes f, Locations l 
                                    WHERE   f.location = l.locationID AND
                                            f.funeralHomeID = " . $data . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene las funerarias por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT      funeralHomeID, name
                                    FROM        FuneralHomes
                                    WHERE       leavingDate IS NULL AND name LIKE '%". $name ."%'
                                    ORDER BY    name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /*
        * Obtiene las funerarias
        *
        * @return array
        */
        public function listFuneralHomesDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      f.funeralHomeID, f.nif, f.name, f.mail, f.phones, l.name
                                    FROM        FuneralHomes f
                                    LEFT JOIN   Locations l ON f.location = l.locationID
                                    WHERE       f.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
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

            $result = $db->query("  SELECT      f.funeralHomeID, f.name as name, f.nif, f.address,
                                                f.mail, f.phones, f.fax,
                                                l.province, l.name as locationName, l.postalCode
                                    FROM        (FuneralHomes f)
                                    LEFT JOIN   Locations l ON f.location = l.locationID
                                    WHERE       f.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                $funeralHomes = $db->resultToArray($result);

                $result = $db->query("  SELECT  *
                                        FROM    ContactPeople_FuneralHomes cfh");

                if(mysqli_num_rows($result) == 0){
                    $result = ["funeralHomes" => $funeralHomes];
                }else{
                    $contactFuneralHome = $db->resultToArray($result);
                    $result = ["funeralHomes" => $funeralHomes,
                                "contactFuneralHome" => $contactFuneralHome
                            ];
                }
                return $result;
			}
        }

        /**
        * Añade una funeraria
        *
        * @param array $data
        */
        public function createImport($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['fax'] = cleanStr($data['fax']);

            // Validación de campos
            if($data['name'] == ''){
                return "El nombre no puede ser vacío";
            }
            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return "El formato del NIF es incorrecto";
                }
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "El formato del emaol es incorrecto";
                }
            }

            $flag = 0;
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
            $result = $db->query("  SELECT  * 
                                    FROM    FuneralHomes 
                                    WHERE   extraID = '" . $extraID . "'");

            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    FuneralHomes 
                                        WHERE   extraID = '" . $extraID . "'");
            }

            if(!$this->existsCif($data['nif'])){
                $result = $db->query("INSERT INTO FuneralHomes(location, nif, name, address, 
                                                            mail, phones, fax, leavingDate, extraID) 
                                VALUES(" . $data['location'] . ", '" . $data['nif'] . "', 
                                        '" . $data['name'] . "', '" . $data['address'] . "', 
                                        '" . $data['mail'] . "', '" . $data['phones'] . "', 
                                        '" . $data['fax'] . "', null, '" . $extraID . "')");
                if(!$result){
                    $flag++;
                }else{
                    $result = $db->query("  SELECT funeralHomeID 
                                            FROM FuneralHomes 
                                            WHERE extraID = '" . $extraID . "'");

                    if(mysqli_num_rows($result) > 0){
                        if(isset($data['person']) && $data['person'] != ""){
                            $id = $db->resultToArray($result)[0]['funeralHomeID'];
                
                            $personalData = explode("-", $data['person'][0]);
                     
                            $personalData[0] = cleanStr($personalData[0]);
                            $personalData[1] = cleanStr($personalData[1]);
        
                            $result = $db->query("INSERT INTO ContactPeople_FuneralHomes (funeralHome, person, post) 
                                                VALUES(" . $id . ", '" . $personalData[0] . "', '" . $personalData[1] . "')");
                            
                            if(!$result){
                                $flag++;
                            }
                        }
                    }
                }

                if($flag > 0){
                    return false;
                }else{
                    return true;
                }
            }else{
                return "Ya existe una funeraria con ese NIF";
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
                                    FROM    FuneralHomes p
                                    WHERE   p.funeralHomeID = $id AND 
                                            p.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }

        /**
        * Modifica los datos de una funeraria
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
            $data['phones'] = cleanStr($data['phones']);
            $data['fax'] = cleanStr($data['fax']);
            $data['funeralHomeID'] = cleanStr($data['funeralHomeID']);

            // Validación de campos
            if($data['name'] == ''){
                return "El nombre no puede ser vacío";
            }
            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return "El formato del NIF es incorrecto";
                }
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "El formato del emaol es incorrecto";
                }
            }
            if(!$this->existsCif($data['nif'], $data['funeralHomeID'])){
                $result = $db->query("  UPDATE  FuneralHomes
                                        SET     location = " . $data['location'] . ", 
                                                nif = '" . $data['nif'] . "', name = '" . $data['name'] . "', 
                                                address = '" . $data['address'] . "', mail = '" . $data['mail'] . "', 
                                                phones = '" . $data['phones'] . "', fax = '" . $data['fax'] . "' 
                                        WHERE   funeralHomeID = " . $data['funeralHomeID'] . "");
                
                if(!$result){
                    return false;
                }else{
                    $result = $db->query("DELETE FROM ContactPeople_FuneralHomes WHERE funeralHome = " . $data['funeralHomeID'] . "");

                    if(!$result){
                        return false;
                    }else{
                        $flag = 0;
                        
                        if(isset($data['person']) && $data['person'] != ""){
                            $id = $data['funeralHomeID'];
                
                            $personalData = explode("-", $data['person'][0]);
                     
                            $personalData[0] = cleanStr($personalData[0]);
                            $personalData[1] = cleanStr($personalData[1]);
        
                            $result = $db->query("INSERT INTO ContactPeople_FuneralHomes (funeralHome, person, post) 
                                                VALUES(" . $id . ", '" . $personalData[0] . "', '" . $personalData[1] . "')");
                            
                            if(!$result){
                                $flag++;
                            }
                        }
                    }

                    if($flag > 0){
                        return false;
                    }else{
                        return true;
                    }
                }
            }else{
                return "Ya existe una funeraria con ese NIF";
            }
        }
    }
?>