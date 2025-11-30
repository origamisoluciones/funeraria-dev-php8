<?php

    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Clients{

        /**
        * Añade un cliente
        *
        * @param array $data
        */
        public function create($data){
            $db = new DbHandler;

            $data['type'] = cleanStr($data['type']);
            $data['location'] = cleanStr($data['location']);
            $data['price'] = cleanStr($data['price']);
            $data['brandName'] = cleanStr($data['brandName']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['nifType'] = cleanStr($data['nifType']);
            if(isset($data['protocol'])){
                $data['protocol'] = cleanEditor($data['protocol']);
            }else{
                $data['protocol'] = "";
            }
            $data['obituaryAnniversaryReminder'] = cleanStr($data['obituaryAnniversaryReminder']);

            // Validación de campos
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }

            if($data['nif'] != ''){
                if($data['nifType'] == '1' || $data['nifType'] == '2'){
                    if(!isValidIdNumber($data['nif'])){
                        return false;
                    }
                }
            }

            if($data['price'] == '' || $data['price'] == null){
                $result = $db->query("  SELECT  priceID
                                        FROM    Prices
                                        WHERE   year = " . date('Y') . " AND name LIKE '%Particulares%' AND leavingDate IS NULL
                                        LIMIT   1");
                                        
                if(mysqli_num_rows($result) == 0){
                    $data['price'] = 'null';
                }else{
                    $data['price'] =  $db->resultToArray($result)[0]['priceID'];
                }               
            }

            if(!$this->existsCif($data['nif'])){
                $res = $db->query(" INSERT INTO Clients(type, location, price, brandName, nif, name, surname, address, mail, protocol, phones, startingDate, leavingDate, 
                                        nifType, obituaryAnniversaryReminder) 
                                    VALUES( " . $data['type'] . ", " . $data['location'] . ", " . $data['price'] . ", '" . $data['brandName'] . "', '" . $data['nif'] . "', 
                                        '" . $data['name'] . "', '" . $data['surname'] . "', '" . $data['address'] . "', '" . $data['mail'] . "',  '" . $data['protocol'] . "', 
                                        '" . $data['phones'] . "', " . time() . ", null, '" . $data['nifType'] . "', " . $data['obituaryAnniversaryReminder'] . ")");
                return $res ? mysqli_insert_id($db->getConnection()) : $res;
            } else{
                return "CIF_ERROR";
            }
        }

        public function createExpedient($data){
            $db = new DbHandler;

            $data['type'] = cleanStr($data['type']);
            $data['location'] = cleanStr($data['location']);
            $data['price'] = cleanStr($data['price']);
            $data['brandName'] = cleanStr($data['brandName']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['nifType'] = cleanStr($data['nifType']);
            if(isset($data['protocol'])){
                $data['protocol'] = cleanEditor($data['protocol']);
            }else{
                $data['protocol'] = "";
            }
            $data['obituaryAnniversaryReminder'] = cleanStr($data['obituaryAnniversaryReminder']);

            // Validación de campos
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }

            if($data['nif'] != ''){
                if($data['nifType'] == '1' || $data['nifType'] == '2'){
                    if(!isValidIdNumber($data['nif'])){
                        return false;
                    }
                }
            }

            if($data['price'] == '' || $data['price'] == null){
                $result = $db->query("  SELECT  priceID
                                        FROM    Prices
                                        WHERE   year = " . date('Y') . " AND name LIKE '%Particulares%' AND leavingDate IS NULL
                                        LIMIT   1");
                                        
                if(mysqli_num_rows($result) == 0){
                    $data['price'] = 'null';
                }else{
                    $data['price'] =  $db->resultToArray($result)[0]['priceID'];
                }               
            }

            if(!$this->existsCif($data['nif'])){
                $res = $db->query(" INSERT INTO Clients(type, location, price, brandName, nif, name, surname, address, mail, protocol,
                                        phones, startingDate, leavingDate, nifType, obituaryAnniversaryReminder) 
                                    VALUES( " . $data['type'] . ", " . $data['location'] . ", " . $data['price'] . ", '" . $data['brandName'] . "', '" . $data['nif'] . "', 
                                        '" . $data['name'] . "', '" . $data['surname'] . "', '" . $data['address'] . "',  '" . $data['mail'] . "', '" . $data['protocol'] . "',
                                        '" . $data['phones'] . "', " . time() . ", null, '" . $data['nifType'] . "', " . $data['obituaryAnniversaryReminder'] . ")");

                return array(mysqli_insert_id($db->getConnection()), $data['name']);
            } else{
                return "CIF_ERROR";
            }
        }

        /**
        * Comprueba si existe un usuario con un nif 
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
            if($id != null){
                $id = cleanStr($id);
                $result = $db->query(" SELECT   COUNT(*) as row
                                       FROM     Clients c
                                       WHERE    c.nif = '" . $cif . "' AND c.clientID != '" . $id . "' AND c.leavingDate IS NULL");
            } else{
                $result = $db->query("  SELECT    COUNT(*) as row
                                        FROM      Clients c
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
        * Obtiene los datos de un cliente
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['clientID'] = cleanStr($data['clientID']);

            $result = $db->query("SELECT    c.clientID, c.type, c.brandName, c.nif, c.name as clientsName, c.surname, c.address, 
                                            c.mail, c.phones, c.leavingDate, c.protocol, c.doc, ct.clientTypeID, ct.name as clientTypeName, c.obituaryAnniversaryReminder,
                                            l.locationID, l.name as locationName, l.postalCode, l.province,
                                            p.priceID, p.name as priceName, c.nifType
                                  FROM      (Clients c, Clients_Types ct)
                                  LEFT JOIN Locations l ON c.location = l.locationID
                                  LEFT JOIN Prices p ON c.price = p.priceID AND p.leavingDate IS NULL
                                  WHERE     c.type = ct.clientTypeID AND 
                                            c.clientID = " . $data['clientID']);
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de un cliente
        *
        * @param array $data
        *
        * @return array
        */
        public function getClientInfo($clientID){
            $db = new DbHandler;

            $clientID = cleanStr($clientID);

            $result = $db->query("SELECT    c.clientID, c.brandName, c.nif, c.name, c.surname, c.type
                                  FROM      Clients c
                                  WHERE     c.clientID = " . $clientID . "");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Modifica los datos de un cliente
        *
        * @param array $data
        */
        public function update($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['brandName'] = cleanStr($data['brandName']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['clientID'] = cleanStr($data['clientID']);
            $data['nifType'] = cleanStr($data['nifType']);
            if(isset($data['protocol'])){
                $data['protocol'] = cleanEditor($data['protocol']);
            }else{
                $data['protocol'] = "";
            }
            $data['obituaryAnniversaryReminder'] = cleanStr($data['obituaryAnniversaryReminder']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }

            if($data['nif'] != ''){
                if($data['nifType'] == '1' || $data['nifType'] == '2'){
                    if(!isValidIdNumber($data['nif'])){
                        return false;
                    }
                }
            }

            isset($data['price']) ? $price = "price = " . $data['price'] . ", " : $price = "";
            isset($data['type']) ? $type = "type = " . $data['type'] . ", " : $type = "";

            if($data['location'] == ""){
                $data['location'] = "null";
            }

            if(!$this->existsCif($data['nif'], $data['clientID'])){
                return $db->query(" UPDATE  Clients 
                                    SET     " . $type . " location = " . $data['location'] . ", 
                                            brandName = '" . $data['brandName'] . "',
                                            nif = '" . $data['nif'] . "', 
                                            name = '" . $data['name'] . "', 
                                            surname = '" . $data['surname'] . "', 
                                            address = '" . $data['address'] . "', 
                                            mail = '" . $data['mail'] . "', 
                                            " . $price . "
                                            phones = '" . $data['phones'] . "',
                                            protocol = '" . $data['protocol'] . "',
                                            obituaryAnniversaryReminder = " . $data['obituaryAnniversaryReminder'] . ",
                                            nifType = '" . $data['nifType'] . "'
                                    WHERE   clientID = " . $data['clientID']);
            }else{
                return "CIF_ERROR"; 
            }
        }

        /**
        * Elimina un cliente
        *
        * @param array $data
        */
        public function delete($data){
            $db = new DbHandler;

            $data['clientID'] = cleanStr($data['clientID']);

            return $db->query(" UPDATE  Clients
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                                WHERE   clientID = " . $data['clientID']);
        }

        /**
        * Obtiene los datos de los clientes
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  clientID, name
                                    FROM    clients
                                    WHERE   leavingDate is null");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los tipos de cliente
        *
        * @return array
        */
        public function getClientTypes(){
            $db = new DbHandler;

            $result = $db->query("SELECT * 
                                  FROM Clients_Types");

            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene la localidad asociada al cliente
        * 
        * @param array $data
        *
        * @return array
        */
        public function getLocations($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("SELECT l.locationID, l.name, l.postalCode, l.province
                                  FROM Clients c, Locations l
                                  WHERE c.location = l.locationID AND
                                  c.clientID = " . $data);

            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los tipos de clientes por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function getClientTypesByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT  ct.clientTypeID, ct.name
                                    FROM    Clients_Types ct
                                    WHERE   ct.name LIKE '%$name%'
                                    ORDER BY ct.name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los clientes por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByName($name = null){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT  clientID, `type`, brandName, nif, surname, name
                                    FROM    Clients 
                                    WHERE   (name LIKE '%". $name ."%' OR 
                                            surname LIKE '%" . $name . "%') AND
                                            leavingDate IS NULL
                                    ORDER BY name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los clientes por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByNameNoParticular($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT  clientID, `type`, brandName, nif, surname, name
                                    FROM    Clients 
                                    WHERE   (name LIKE '%". $name ."%' OR surname LIKE '%" . $name . "%' OR brandName LIKE '%" . $name . "%') 
                                        AND leavingDate IS NULL
                                    ORDER BY name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los clientes por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByNameAndType($name, $clientType){
            $db = new DbHandler;

            $name = cleanStr($name);
            $clientType = cleanStr($clientType);
            
            if($clientType == 2 || $clientType == 3){
                if(strlen($name) > 0 ){
                    $result = $db->query("  SELECT  clientID, `type`, brandName, name, surname, nif
                                            FROM    Clients 
                                            WHERE   `type` = " . $clientType . " AND
                                                    (brandName LIKE '%". $name ."%' OR name LIKE '%". $name ."%' OR nif LIKE '%". $name ."%')  AND 
                                                    leavingDate IS NULL
                                            ORDER BY brandName");
                }else{
                    $result = $db->query("  SELECT  clientID, `type`, brandName, name, surname, nif
                                            FROM    Clients 
                                            WHERE   `type` = " . $clientType . " AND
                                                    leavingDate IS NULL
                                            ORDER BY brandName");
                }
            }else{
                if(strlen($name) > 0 ){
                    $result = $db->query("  SELECT  clientID, `type`, nif, surname, name
                                            FROM    Clients 
                                            WHERE   `type` = " . $clientType . " AND
                                                    (surname LIKE '%". $name ."%' OR nif LIKE '%". $name ."%' OR name LIKE '%". $name ."%')  AND 
                                                    leavingDate IS NULL
                                            ORDER BY surname"); 
                }else{
                    $result = $db->query("  SELECT  clientID, `type`, nif, surname, name
                                            FROM    Clients 
                                            WHERE   `type` = " . $clientType . " AND
                                                    leavingDate IS NULL
                                            ORDER BY surname"); 
                }
            }
            
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los clientes por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByNameAndTypeInvoices($name, $clientType){
            $db = new DbHandler;

            $name = cleanStr($name);
            $clientType = cleanStr($clientType);
           
            if($clientType == '2' || $clientType == '3'){
                if(strlen($name) > 0 ){
                    $result = $db->query("  SELECT  clientID, `type`, brandName, nif
                                            FROM    Clients 
                                            WHERE   `type` = " . $clientType . " AND
                                                    (brandName LIKE '%". $name ."%' OR nif LIKE '%". $name ."%')  AND 
                                                    leavingDate IS NULL
                                            ORDER BY brandName");
                } else{
                    $result = $db->query("  SELECT  clientID, `type`, brandName, nif
                                            FROM    Clients 
                                            WHERE   `type` = " . $clientType . " AND
                                                    leavingDate IS NULL
                                            ORDER BY brandName");
                }
            } else if($clientType == '1'){
                if(strlen($name) > 0 ){
                    $result = $db->query("  SELECT  clientID, `type`, nif, surname as brandName
                                            FROM    Clients 
                                            WHERE   `type` = " . $clientType . " AND
                                                    (surname LIKE '%". $name ."%' OR nif LIKE '%". $name ."%' OR name LIKE '%". $name ."%')  AND 
                                                    leavingDate IS NULL
                                            ORDER BY brandName"); 
                }else{
                    $result = $db->query("  SELECT  clientID, `type`, nif, surname as brandName
                                            FROM    Clients 
                                            WHERE   `type` = " . $clientType . " AND
                                                    leavingDate IS NULL
                                            ORDER BY brandName"); 
                }
            }else{
                if(strlen($name) > 0 ){
                    $result = $db->query("  SELECT  clientID, `type`, nif, IFNULL(brandName, surname) as brandName
                                            FROM    Clients 
                                            WHERE   (brandName LIKE '%". $name ."%' OR surname LIKE '%". $name ."%' OR nif LIKE '%". $name ."%' OR name LIKE '%". $name ."%')  AND 
                                                    leavingDate IS NULL
                                            ORDER BY brandName"); 
                }else{
                    $result = $db->query("  SELECT  clientID, `type`, nif, IFNULL(brandName, surname) as brandName
                                            FROM    Clients 
                                            WHERE   leavingDate IS NULL
                                            ORDER BY brandName"); 
                }
            }
            
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Obtiene un cliente dado el nombre y los apellidos
         * 
         * @param string $name Nombre
         * @param string $surname Apellidos
         * @return int
         */
        public function searchByNameSurname($name, $surname){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.clientID, c.type
                                    FROM    Clients c
                                    WHERE   c.name LIKE '%$name%' AND
                                            c.surname LIKE '%$surname%' AND
                                            c.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['clientID'];
        }

        /**
         * Obtiene un cliente dado el nombre y los apellidos
         * 
         * @param string $name data
         * @return int
         */
        public function getSearchClient($data){
            $db = new DbHandler;

            $type = $data["type"];

            
            if($data["type"] == 2 || $data["type"] == 3){

                if(strlen($data["brandName"]) == 0 && strlen($data["nif"]) == 0) {

                    $result = $db->query("  SELECT  clientID as id, CONCAT(brandName, ' - ', nif) as text
                                            FROM    Clients c
                                            WHERE   `type` = " . $type . " AND
                                                    c.leavingDate IS NULL
                                            ORDER BY brandName");

                }else if(strlen($data["brandName"]) == 0 && strlen($data["nif"]) > 0) {

                    $nif = $data["nif"];
                    $result = $db->query("  SELECT  clientID as id, CONCAT(brandName, ' - ', nif) as text
                                            FROM    Clients c
                                            WHERE    c.nif LIKE '%$nif%' AND
                                                    `type` = " . $type . " AND
                                                    c.leavingDate IS NULL
                                            ORDER BY brandName");

                }else if(strlen($data["brandName"]) > 0 &&  strlen($data["nif"]) == 0) {

                    $brandName = $data["brandName"];
                    $result = $db->query("  SELECT  clientID as id, CONCAT(brandName, ' - ', nif) as text
                                            FROM    Clients c
                                            WHERE   c.brandName LIKE '%$brandName%' AND
                                                    `type` = " . $type . " AND
                                                    c.leavingDate IS NULL
                                            ORDER BY brandName");

               }else if(strlen($data["brandName"]) > 0 &&  strlen($data["nif"]) > 0) {

                $nif = $data["nif"];
                $brandName = $data["brandName"];

                $result = $db->query("      SELECT  clientID as id, CONCAT(brandName, ' - ', nif) as text
                                            FROM    Clients c
                                            WHERE   c.brandName LIKE '%$brandName%' AND
                                                    c.nif LIKE '%$nif%' AND
                                                    `type` = " . $type . " AND
                                                    c.leavingDate IS NULL
                                            ORDER BY brandName");
               }
               
            } else{

                if(strlen($data["name"]) == 0 && strlen($data["surname"]) == 0 && strlen($data["nif"]) == 0) {

                    $result = $db->query("  SELECT  clientID as id, CONCAT(CONCAT(name, ' ', surname), IF(nif IS NULL OR nif = '', '', CONCAT(' - ', nif))) as text
                                            FROM    Clients c
                                            WHERE   `type` = " . $type . " AND
                                                    c.leavingDate IS NULL
                                            ORDER BY surname");
                        
                }else if(strlen($data["name"]) == 0 && strlen($data["surname"]) == 0 && strlen($data["nif"]) > 0) {

                    $nif = $data["nif"];
                    $result = $db->query("  SELECT  clientID as id, CONCAT(CONCAT(name, ' ', surname), IF(nif IS NULL OR nif = '', '', CONCAT(' - ', nif))) as text
                                            FROM    Clients c
                                            WHERE   c.nif LIKE '%$nif%' AND
                                                    `type` = " . $type . " AND
                                                    c.leavingDate IS NULL
                                            ORDER BY surname");

                }else if(strlen($data["name"]) == 0 && strlen($data["surname"]) > 0 && strlen($data["nif"]) == 0) {

                    $surname = $data["surname"];
                    $result = $db->query("  SELECT  clientID as id, CONCAT(CONCAT(name, ' ', surname), IF(nif IS NULL OR nif = '', '', CONCAT(' - ', nif))) as text
                                            FROM    Clients c
                                            WHERE   c.surname LIKE '%$surname%' AND
                                                    `type` = " . $type . " AND
                                                    c.leavingDate IS NULL
                                            ORDER BY surname");

                }else if(strlen($data["name"]) == 0 && strlen($data["surname"]) > 0 && strlen($data["nif"]) > 0) {

                    $surname = $data["surname"];
                    $nif = $data["nif"];
                    $result = $db->query("  SELECT  clientID as id, CONCAT(CONCAT(name, ' ', surname), IF(nif IS NULL OR nif = '', '', CONCAT(' - ', nif))) as text
                                            FROM    Clients c
                                            WHERE   c.surname LIKE '%$surname%' AND
                                                    c.nif LIKE '%$nif%' AND
                                                    `type` = " . $type . " AND
                                                    c.leavingDate IS NULL
                                            ORDER BY surname");

                }else if(strlen($data["name"]) > 0 && strlen($data["surname"]) == 0 && strlen($data["nif"]) == 0) {

                    $name = $data["name"];
                    $result = $db->query("  SELECT  clientID as id, CONCAT(CONCAT(name, ' ', surname), IF(nif IS NULL OR nif = '', '', CONCAT(' - ', nif))) as text
                                            FROM    Clients c
                                            WHERE   c.name LIKE '%$name%' AND
                                                    `type` = " . $type . " AND
                                                    c.leavingDate IS NULL
                                            ORDER BY surname");

                }else if(strlen($data["name"]) > 0 && strlen($data["surname"]) == 0 && strlen($data["nif"]) > 0) {

                    $name = $data["name"];
                    $nif = $data["nif"];
                    $result = $db->query("  SELECT  clientID as id, CONCAT(CONCAT(name, ' ', surname), IF(nif IS NULL OR nif = '', '', CONCAT(' - ', nif))) as text
                                            FROM    Clients c
                                            WHERE   c.name LIKE '%$name%' AND
                                                    c.nif LIKE '%$nif%' AND
                                                    `type` = " . $type . " AND
                                                    c.leavingDate IS NULL
                                            ORDER BY surname");
                }else if(strlen($data["name"]) > 0 && strlen($data["surname"]) > 0 && strlen($data["nif"]) == 0) {

                    $name = $data["name"];
                    $surname = $data["surname"];
                   
                    $result = $db->query("  SELECT  clientID as id, CONCAT(CONCAT(name, ' ', surname), IF(nif IS NULL OR nif = '', '', CONCAT(' - ', nif))) as text
                                            FROM    Clients c
                                            WHERE   c.name LIKE '%$name%' AND
                                                    c.surname LIKE '%$surname%' AND
                                                    `type` = " . $type . " AND
                                                    c.leavingDate IS NULL
                                            ORDER BY surname");

                
                }else if(strlen($data["name"]) > 0 && strlen($data["surname"]) > 0 && strlen($data["nif"]) > 0) {
                
                    $name = $data["name"];
                    $surname = $data["surname"];
                    $nif = $data["nif"];

                    $result = $db->query("  SELECT  clientID as id, CONCAT(CONCAT(name, ' ', surname), IF(nif IS NULL OR nif = '', '', CONCAT(' - ', nif)))  as text
                                            FROM    Clients c
                                            WHERE   c.name LIKE '%$name%' AND
                                                    c.surname LIKE '%$surname%' AND
                                                    c.nif LIKE '%$nif%' AND
                                                    `type` = " . $type . " AND
                                                    c.leavingDate IS NULL
                                            ORDER BY surname");
                }
            }
            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
           
        /**
         * Obtiene un cliente dado el nombre y los apellidos
         * 
         * @param string $name Nombre
         * @param string $surname Apellidos
         * @return int
         */
        public function searchByNameSurname2($name, $surname){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.clientID, c.type
                                    FROM    Clients c
                                    WHERE   c.name LIKE '%$name%' AND
                                            c.surname LIKE '%$surname%' AND
                                            c.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
        * Obtiene los clientes por nombre y tipo
        *
        * @param string $name
        *
        * @return array
        */
        public function getClientByNameAndType($name, $clientType){
            $db = new DbHandler;

            $name = cleanStr($name);
            $clientType = cleanStr($clientType);
            
            $result = $db->query("  SELECT  clientID, name, surname
                                    FROM    Clients 
                                    WHERE   type IN ($clientType) AND 
                                            (name LIKE '%". $name ."%' OR
                                            surname LIKE '%" . $name . "%') AND
                                            leavingDate IS NULL
                                    ORDER BY name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los clientes por id
        *
        * @param string $name
        *
        * @return array
        */
        public function getClient($data){
            $db = new DbHandler;

            $data = cleanStr($data);
            
            $result = $db->query("  SELECT      c.*, l.name as locationName, l.postalCode, l.province
                                    FROM        (Clients c)
                                    LEFT JOIN   Locations l ON c.location = l.locationID
                                    WHERE       c.clientID = " . $data . "");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los clientes por id
        *
        * @param string $name
        *
        * @return array
        */
        public function getClients($data){
            $db = new DbHandler;

            $data = cleanStr($data);
            
            $result = $db->query("  SELECT      c.clientID, c.name
                                    FROM        Clients c
                                    ORDER BY    c.name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los clientes por id
        *
        * @param string $name
        *
        * @return array
        */
        public function getPriceByType($data){
            $db = new DbHandler;

            $data = cleanStr($data);
            
            $result = $db->query("  SELECT  priceID, name
                                    FROM    Prices
                                    WHERE   year = " . date('Y') . "
                                    LIMIT   1");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los clientes por id
        *
        * @param string $name
        *
        * @return array
        */
        public function getActualPriceParticular(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  priceID
                                    FROM    Prices
                                    WHERE   year = " . date('Y') . " AND name LIKE '%Particulares%' AND leavingDate IS NULL
                                    LIMIT   1");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['priceID'];
            }
        }
        /**
        * Obtiene los clientes por id
        *
        * @param string $name
        *
        * @return array
        */
        public function getPriceByTypeForTmpl($data){
            $db = new DbHandler;

          
            //$data = cleanStr($data["clientType"]);
            
            $result = $db->query("  SELECT  priceID, name
                                    FROM    Prices
                                    WHERE   year = " . date('Y') . " AND leavingDate IS NULL
                                    ");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Obtiene información del cliente
         *
         * @param int $data ID del cliente
         * @return array
         */
        public function getInfo($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  nif, name, surname, phones
                                    FROM    Clients
                                    WHERE   clientID = " . $data);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Obtiene todos los clientes
         * 
         * @param string $data Nombre del cliente
         * @return array
         */
        public function search($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  c.clientID, name
                                    FROM    Clients c
                                    WHERE   c.name LIKE '%$data%'");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
        * Obtiene los clientes de tipo Empresa: 3
        *
        * @param string $name
        *
        * @return array
        */
        public function getClientsCompany(){
            $db = new DbHandler;
            
            $result = $db->query("SELECT    s.ID as clientID, CONCAT(s.name, ' ', s.surname) as name
                                    FROM    Staff s
                                    WHERE   s.leavingDate IS NULL");

            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Obtiene las encuestas de satisfacción
         * 
         * @param int $client Cliente
         * @return array
         */
        public function getSurveys($client){
            $db = new DbHandler;

            $client = cleanStr($client);

            $result = $db->query("  SELECT  sc.ID, sc.year
                                    FROM    Survey_Clients sc
                                    WHERE   sc.client = $client");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Crea una encuesta de satisfacción para un cliente dado
         * 
         * @param int $client Client
         * @return bool
         */
        function createSurvey($client){
            $db = new DbHandler;

            $client = cleanStr($client);

            $result = $db->query("  SELECT  s.ID
                                    FROM    Survey s
                                    WHERE   s.leavingDate IS NULL");

            if(mysqli_num_rows($result) > 0){
                $services = $db->resultToArray($result);

                $year = date('Y');

                $db->query("INSERT INTO Survey_Clients(client, year, notes)
                            VALUES ($client, $year, '')");

                $result = $db->query("  SELECT  sc.ID
                                        FROM    Survey_Clients sc
                                        WHERE   sc.client = $client AND
                                                sc.year = $year");

                if(mysqli_num_rows($result) > 0){
                    $survey = $db->resultToArray($result)[0]['ID'];

                    foreach($services as $service){
                        $db->query("INSERT INTO Survey_Clients_Info(survey, service)
                                    VALUES ($survey, " . $service['ID'] . ")");
                    }

                    return $survey;
                }else{
                    return null;
                }
            }else{
                return null;
            }
        }

        /**
         * Obtiene una encuesta
         * 
         * @param int $survey Survey
         * @return array
         */
        public function getSurvey($survey){
            $db = new DbHandler;

            $survey = cleanStr($survey);

            $result = $db->query("  SELECT  sc.year, sc.notes
                                    FROM    Survey_Clients sc
                                    WHERE   sc.ID = $survey");

            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                $info = $db->resultToArray($result)[0];

                $result = $db->query("  SELECT      sci.ID, sci.value, sci.notes, s.service
                                        FROM        Survey_Clients_Info sci, Survey s
                                        WHERE       survey = $survey AND
                                                    sci.service = s.ID
                                        ORDER BY    s.position ASC");

                if(mysqli_num_rows($result) == 0){
                    return null;
                }else{
                    return array($info, $db->resultToArray($result));
                }
            }
        }

        /**
         * Obtiene una encuesta
         * 
         * @param int $survey Survey
         * @return array
         */
        public function getSurveyPdf($survey){
            $db = new DbHandler;

            $survey = cleanStr($survey);

            $result = $db->query("  SELECT  sc.year, sc.notes, c.name, c.surname
                                    FROM    Survey_Clients sc, Clients c
                                    WHERE   sc.ID = $survey AND
                                            sc.client = c.clientID");

            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                $info = $db->resultToArray($result)[0];

                $result = $db->query("  SELECT  sci.ID, sci.value, sci.notes, s.service
                                        FROM    Survey_Clients_Info sci, Survey s
                                        WHERE   survey = $survey AND
                                                sci.service = s.ID
                                        ORDER BY s.position ASC");
                if(mysqli_num_rows($result) == 0){
                    return null;
                }else{
                    return array($info, $db->resultToArray($result));
                }
            }
        }

        /**
         * Obtiene una encuesta
         * 
         * @param int $survey Survey
         * @param array $surveyInfo Survey info
         * @param string $notes Notes
         * @return array
         */
        public function saveSurvey($survey, $surveyInfo, $notes){
            $db = new DbHandler;

            $survey = cleanStr($survey);
            $notes = cleanEditor($notes);

            $db->query("UPDATE  Survey_Clients sc
                        SET     sc.notes = '$notes'
                        WHERE   sc.ID = $survey");

            foreach($surveyInfo as $elem){
                $elem[0] = cleanStr($elem[0]);
                $elem[1] = cleanStr($elem[1]);
                $elem[2] = cleanEditor($elem[2]);

                $db->query("UPDATE  Survey_Clients_Info sci
                            SET     sci.value = $elem[1],
                                    sci.notes = '$elem[2]'
                            WHERE   sci.ID = $elem[0]");
            }

            return true;
        }

        /*
        **
        * Obtiene los clientes
        *
        * @return array
        */
        public function listClientsDatatables(){
            $db = new DbHandler;

            $result = $db->query("SELECT c.clientID, c.nif, c.name, c.surname, c.mail, c.phones, ct.name
                                  FROM Clients c, Clients_Types ct
                                  WHERE c.type = ct.clientTypeID 
                                    AND c.leavingDate IS NULL");
            
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

            $result = $db->query("  SELECT      c.clientID, c.name as name, c.surname, c.nif, c.nifType, c.brandName, ct.name as type, 
                                                l.province, l.name as locationName, l.postalCode,
                                                p.name as price, c.address, c.mail, c.phones, c.protocol
                                    FROM        (Clients c)
                                    LEFT JOIN   Locations l ON c.location = l.locationID
                                    LEFT JOIN   Prices p ON c.price = p.priceID AND p.leavingDate IS NULL
                                    LEFT JOIN   Clients_Types ct ON c.type = ct.clientTypeID
                                    WHERE       c.leavingDate IS NULL AND c.name != 'Cliente de' AND c.surname != 'Contado'");
            
            if(mysqli_num_rows($result) > 0){
                $clients = $db->resultToArray($result);
                $result = ["clients" => $clients];
				return $result;
			}else{
                return null;
			}
        }

         /**
         * Obtiene los tipos de cliente por nombre
         *
         * @param string $name
         *
         * @return array
         */
        public function searchByNameImport($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT  clientTypeID
                                    FROM    Clients_Types 
                                    WHERE   name LIKE '%$name%'");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Añade un cliente
        *
        * @param array $data
        */
        public function createImport($data){
            $db = new DbHandler;
          
            $data['type'] = cleanStr($data['type']);
            $data['location'] = cleanStr($data['location']);
            $data['price'] = cleanStr($data['price']);
            $data['brandName'] = cleanStr($data['brandName']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);

            // Validación de campos
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "El formato del email es incorrecto";
                }
            }

            if($data['price'] == '' || $data['price'] == null || $data['price'] == 'null'){
               return "No existe tarifa para este usuario. Debe crearla primero";
            }

            if($data['nif'] != ''){
                if($data['nifType'] == 'NIF' || $data['nifType'] == 'NIE'){
                    if(!isValidIdNumber($data['nif'])){
                        return "El formato del NIF es incorrecto";
                    }
                }
            }

            $nifType = "null";
            switch($data['nifType']){
                case 'NIF':
                    $nifType = 1;
                break;
                case 'NIE':
                    $nifType = 2;
                break;
                case 'Pasaporte':
                    $nifType = 3;
                break;
                case 'Otro':
                    $nifType = 4;
                break;
            }

            return $db->query(" INSERT INTO Clients(
                                    type, location, price, brandName, nif, nifType, name, surname, address, mail,
                                    phones, startingDate, leavingDate
                                ) 
                                VALUES( " . $data['type'] . ", " . $data['location'] . ", " . $data['price'] . ", 
                                    '" . $data['brandName'] . "', '" . $data['nif'] . "', $nifType,
                                    '" . $data['name'] . "', '" . $data['surname'] . "', '" . $data['address'] . "', 
                                    '" . $data['mail'] . "', '" . $data['phones'] . "', " . time() . ", null)
            ");
        }

        /**
         * Modifica los datos de un cura
         *
         * @param array $data
         */
        public function updateImport($data){
            $db = new DbHandler;

            $data['type'] = cleanStr($data['type']);
            $data['location'] = cleanStr($data['location']);
            $data['price'] = cleanStr($data['price']);
            $data['brandName'] = cleanStr($data['brandName']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['clientID'] = cleanStr($data['clientID']);

            // Validación de campos
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "El formato del email es incorrecto";
                }
            }

            if($data['price'] == '' || $data['price'] == null || $data['price'] == 'null'){
               return "No existe tarifa para este usuario. Debe crearla primero";
            }
    
            if($data['nif'] != ''){
                if($data['nifType'] == 'NIF' || $data['nifType'] == 'NIE'){
                    if(!isValidIdNumber($data['nif'])){
                        return "El formato del NIF es incorrecto";
                    }
                }
            }

            isset($data['price']) ? $price = "price = " . $data['price'] . ", " : $price = "";
            isset($data['type']) ? $type = "type = " . $data['type'] . ", " : $type = "";

            if($data['location'] == ""){
                $data['location'] = "null";
            }

            $nifType = "null";
            switch($data['nifType']){
                case 'NIF':
                    $nifType = 1;
                break;
                case 'NIE':
                    $nifType = 2;
                break;
                case 'Pasaporte':
                    $nifType = 3;
                break;
                case 'Otro':
                    $nifType = 4;
                break;
            }

            return $db->query(" UPDATE  Clients 
                                SET     " . $type . " location = " . $data['location'] . ", 
                                        brandName = '" . $data['brandName'] . "',
                                        nif = '" . $data['nif'] . "', 
                                        nifType = " . $nifType . ", 
                                        name = '" . $data['name'] . "', 
                                        surname = '" . $data['surname'] . "', 
                                        address = '" . $data['address'] . "', 
                                        mail = '" . $data['mail'] . "', 
                                        " . $price . "
                                        phones = '" . $data['phones'] . "'
                                WHERE   clientID = " . $data['clientID'] . "");
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
            $result = $db->query("  SELECT    COUNT(*) as row
                                    FROM      Clients c
                                    WHERE     c.clientID = $id AND c.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }
        
		/**
        * Modifica la documentacion de un cliente
        *
        * @param array $data
        *
        * @return bool
        */
        public function updateFile($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['clientID'] = cleanStr($data['clientID']);

            return $db->query("UPDATE   Clients
                               SET      doc = '" . $data['name'] . "' 
                               WHERE    clientID = " . $data['clientID'] . "");
        }

        /**
         * Obtiene los clientes con correo electrónico
         *
         * @param array $data ID del cliente
         * @return array
         */
        public function getToEmailAddressee($search){
            $db = new DbHandler;

            $result = $db->query("  SELECT  c.clientID as id,
                                            CONCAT(CONCAT(CONCAT(c.name, ' ', c.surname), ' (', c.mail), ')') as text
                                    FROM    Clients c
                                    WHERE   c.mail IS NOT NULL AND c.mail != ''
                                        AND c.leavingDate IS NULL
                                        AND (
                                            c.name LIKE '%". $search ."%' OR 
                                            c.surname LIKE '%". $search ."%' OR 
                                            c.mail LIKE '%". $search ."%'
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

           $result = $db->query("  SELECT  c.mail as email
                                   FROM    Clients c
                                   WHERE   c.clientID = " . $id);

           return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
       }

       /**
        * Obtiene los clientes asociados a una tarifa
        *
        * @param array $data
        *
        * @return array
        */
        public function getClientsByPrice($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("SELECT    cl.name, cl.surname, cl.brandName, cl.nif
                                  FROM      Clients cl
                                  WHERE     cl.leavingDate IS NULL AND
                                            cl.price = " . $data);
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
			}
        }
    }
?>