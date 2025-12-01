<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Carriers{
        /**
        * Añade un palafrenero
        *
        * @param array $data
        */
        public function create($data){
            $db = new DbHandler;

            $data['entryDate'] = cleanStr($data['entryDate']);
            $data['location'] = cleanStr($data['location']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['drives'] = cleanStr($data['drives']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return false;
                }
            }

            if($data['entryDate'] == ""){
                $data['entryDate'] = 'null';
            }else{
                $data['entryDate'] = "'" . $data['entryDate'] . "'";
            }

            if(!$this->existsCif($data['nif'])){
                return $db->query("INSERT INTO Carriers(location, nif, name, surname, 
                                                        address, mail, phones, drives, entryDate, 
                                                        leavingDate) 
                                VALUES(" . $data['location'] . ", '" . $data['nif'] . "', 
                                        '" . $data['name'] . "', '" . $data['surname'] . "', 
                                        '" . $data['address'] . "', '" . $data['mail'] . "',
                                        '" . $data['phones'] . "', '" . $data['drives'] . "', 
                                        " . $data['entryDate'] . ", null)");
            }else{
                return "CIF_ERROR";
            }
        }

        /**
        * Obtiene los datos de un palafrenero
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['carrierID'] = cleanStr($data['carrierID']);

            $result = $db->query("SELECT c.carrierID, c.nif, c.name as carrierName, c.surname, c.address, 
                                         c.mail, c.phones, c.drives, c.entryDate, c.leavingDate, 
                                         l.locationID, l.name as locationName, l.postalCode, l.province
                                  FROM Carriers c
                                  LEFT JOIN Locations l
                                  ON c.location = l.locationID
                                  WHERE carrierID = " . $data['carrierID']);
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Modifica los datos de un palafrenero
        *
        * @param array $data
        */
        public function update($data){
            $db = new DbHandler;

            $data['entryDate'] = cleanStr($data['entryDate']);
            $data['location'] = cleanStr($data['location']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['entryDate'] = cleanStr($data['entryDate']);
            $data['phones'] = cleanStr($data['phones']);
            $data['drives'] = cleanStr($data['drives']);
            $data['carrierID'] = cleanStr($data['carrierID']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return false;
                }
            }

            if($data['entryDate'] == ""){
                $data['entryDate'] = "";
            }else{
                $data['entryDate'] = "entryDate = '" . $data['entryDate'] . "', ";
            }

            if(!$this->existsCif($data['nif'], $data['carrierID'])){
                return $db->query("UPDATE Carriers
                                SET location = " . $data['location'] . ", nif = '" . $data['nif'] . "', 
                                    name = '" . $data['name'] . "', surname = '" . $data['surname'] . "', 
                                    address = '" . $data['address'] . "', mail = '" . $data['mail'] . "', 
                                    " . $data['entryDate'] . " phones = '" . $data['phones'] . "', drives = '" . $data['drives'] . "' 
                                WHERE carrierID = " .$data['carrierID']. "");
            }else{
                return "CIF_ERROR";
            }
        }

        /**
        * Comprueba si existe un porteador con un nif dado
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
                $result = $db->query("SELECT   COUNT(*) as row
                                        FROM      Carriers c
                                        WHERE     c.nif = '" . $cif . "' AND c.carrierID != '" . $id . "' AND c.leavingDate IS NULL");
            } else{
                $result = $db->query("SELECT   COUNT(*) as row
                                        FROM      Carriers c
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
        * Elimina un palafrenero
        *
        * @param array $data
        */
        public function delete($data){
            $db = new DbHandler;

            $data['carrierID'] = cleanStr($data['carrierID']);

            return $db->query("UPDATE Carriers
                               SET leavingDate = '" . date('Y-m-d H:i:s') . "'
                               WHERE carrierID = " . $data['carrierID'] . "");
        }

        /**
        * Obtiene los datos de los palafreneros
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("SELECT c.carrierID, c.nif, c.name as carrierName, c.surname, c.address, 
                                         c.mail, c.phones, c.drives, c.entryDate, c.leavingDate, 
                                         l.locationID, l.name as locationName, l.postalCode, l.province
                                  FROM Carriers c
                                  LEFT JOIN Locations l
                                  ON c.location = l.locationID
                                  WHERE c.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de la localidad dado un porteador
        *
        * @param array $data
        * 
        * @return array
        */
        public function getLocation($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("SELECT l.locationID, l.name
                                  FROM Carriers c, Locations l 
                                  WHERE c.location = l.locationID AND
                                        c.carrierID = " . $data);

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        public function searchByName($search){
            $db = new DbHandler;

            $search = cleanStr($search);

            $result = $db->query("  SELECT  c.carrierID, CONCAT(c.name, ' ', c.surname) as name
                                    FROM    Carriers c
                                    WHERE   (c.name LIKE '%$search%' OR
                                            c.surname LIKE '%$search%') AND
                                            c.leavingDate IS NULL
                                    ORDER BY c.name");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        public function getCarrier($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  CONCAT(c.name, ' ', c.surname) as carrier
                                    FROM    Carriers c
                                    WHERE   c.carrierID = $id");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result)[0]['carrier'];
			}
        }

        /*
        **
        * Obtiene los porteadores
        *
        * @return array
        */
        public function listCarriersDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT c.carrierID, c.name, c.surname, c.drives, c.entryDate, l.name, c.phones, c.leavingDate
                                    FROM Carriers c
                                    LEFT JOIN Locations l ON c.location = l.locationID
                                    WHERE  c.leavingDate IS NULL");
            
            return mysqli_num_rows($result) == 0 ? array() : $db->resultToArrayValue($result);
            return array();
        }


         /**
         * Obtiene los datos de un palafrenero
         *
         * @param array $data ID del palafrenero
         * @return array
         */
        public function listToExport(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      c.carrierID, c.name as name, c.surname, c.nif, c.address,
                                                c.mail, c.phones, c.drives, c.entryDate,
                                                l.province, l.name as locationName, l.postalCode
                                    FROM        (Carriers c)
                                    LEFT JOIN   Locations l ON c.location = l.locationID
                                    WHERE       c.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                $carriers = $db->resultToArray($result);
                $result = ["carriers" => $carriers];
                return $result;
			}
        }

        /**
        * Añade un palafrenero
        *
        * @param array $data
        */
        public function createImport($data){
            $db = new DbHandler;

            $data['entryDate'] = cleanStr($data['entryDate']);
            $data['location'] = cleanStr($data['location']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['drives'] = cleanStr($data['drives']);

            // Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }

            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return "Formato de NIF incorrecto";
                }
            }

            if($data['entryDate'] == ""){
                $data['entryDate'] = 'null';
            }else{
                $data['entryDate'] = "'" . $data['entryDate'] . "'";
            }

            if(!$this->existsCif($data['nif'])){
                return $db->query("INSERT INTO Carriers(location, nif, name, surname, 
                                                        address, mail, phones, drives, entryDate, 
                                                        leavingDate) 
                                    VALUES(" . $data['location'] . ", '" . $data['nif'] . "', 
                                            '" . $data['name'] . "', '" . $data['surname'] . "', 
                                            '" . $data['address'] . "', '" . $data['mail'] . "',
                                            '" . $data['phones'] . "', '" . $data['drives'] . "', 
                                            " . $data['entryDate'] . ", null)");
            }else{
                return "Ya existe un porteador con ese NIF";
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
            $result = $db->query("SELECT      COUNT(*) as row
                                    FROM      Carriers c
                                    WHERE     c.carrierID = $id AND c.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }

        /**
        * Modifica los datos de un palafrenero
        *
        * @param array $data
        */
        public function updateImport($data){
            $db = new DbHandler;

            $data['entryDate'] = cleanStr($data['entryDate']);
            $data['location'] = cleanStr($data['location']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['drives'] = cleanStr($data['drives']);

            // Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }

            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return "Formato de NIF incorrecto";
                }
            }

            if($data['entryDate'] == ""){
                $entryDate = 'null';
            }else{
                $entryDate = "'" . $data['entryDate'] . "'";
            }

            if(!$this->existsCif($data['nif'], $data['carrierID'])){
                return $db->query(" UPDATE  Carriers
                                    SET     location = " . $data['location'] . ", nif = '" . $data['nif'] . "', 
                                            name = '" . $data['name'] . "', surname = '" . $data['surname'] . "', 
                                            address = '" . $data['address'] . "', mail = '" . $data['mail'] . "', 
                                            entryDate = $entryDate, phones = '" . $data['phones'] . "', drives = '" . $data['drives'] . "' 
                                    WHERE   carrierID = " .$data['carrierID']);
            }else{
                return "Ya existe un porteador con ese NIF";
            }
        }

        /**
         * Obtiene los porteadores con correo electrónico
         *
         * @param array $data ID del enterrador
         * @return array
         */
        public function getToEmailAddressee($search){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.carrierID as id,
                                            CONCAT(CONCAT(CONCAT(c.name, ' ', c.surname), ' (', c.mail), ')') as text
                                    FROM    Carriers c
                                    WHERE   c.mail IS NOT NULL AND c.mail != ''
                                        AND c.leavingDate IS NULL
                                        AND (
                                            c.name LIKE '%". $search ."%' OR 
                                            c.surname LIKE '%". $search ."%' OR
                                            c.mail LIKE '%". $search ."%'
                                        )");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArray($result);
        }

        /**
         * Obtiene el email de un porteador
         *
         * @param array $data ID del porteador
         * @return array
         */
        public function getEmail($id){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.mail as email
                                    FROM    Carriers c
                                    WHERE   c.carrierID = " . $id);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>