<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Suppliers{

        /**
         * Comprueba si un proveedor existe
         * 
         * @param int $supplier Id del proveedor
         * @return bool
         */
        public function existsSupplier($supplier){
            $db = new DbHandler;

            $supplier = cleanStr($supplier);

            $result = $db->query("  SELECT  s.supplierID
                                    FROM    Suppliers s
                                    WHERE   s.supplierID = $supplier AND
                                            s.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? false : true;
        }

        /**
        * Añade un proveedor
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
            $data['entryDate'] = cleanStr($data['entryDate']);
            $data['description'] = cleanTextArea($data['description']);
            $data['contactPeople'] = cleanStr($data['contactPeople']);
            $data['sentObituary'] = cleanStr($data['sentObituary']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }
           
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Suppliers 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Suppliers 
                                        WHERE   extraID = '" . $extraID . "'");
            }
            
            if($data['entryDate'] == ""){
                $data['entryDate'] = "null";
            }else{
                $data['entryDate'] = "'" . $data['entryDate'] . "'";
            }

            if(!$this->existsCif($data['nif'])){
                $result = $db->query("  INSERT INTO Suppliers(
                                            location, nif, name, address, 
                                            mail, phones, fax, entryDate, 
                                            description, catalogue,sentObituary, leavingDate, extraID
                                        ) 
                                        VALUES (
                                            " . $data['location'] . ", '" . $data['nif'] . "','" . $data['name'] . "', '" . $data['address'] . "', 
                                                '" . $data['mail'] . "', '" . $data['phones'] . "', '" . $data['fax'] . "', " . $data['entryDate'] . ", 
                                                '" . $data['description'] . "', null,  '" . $data['sentObituary'] . "', null, '" . $extraID . "')");
                if(!$result){
                    return false;
                }

                $flag = 0;
                $result = $db->query("  SELECT  supplierID 
                                        FROM    Suppliers
                                        WHERE   extraID = '" . $extraID . "'");

                $id = $db->resultToArray($result)[0]['supplierID'];

                if($data['contactPeople'] != ""){
                    $contactPeople = explode("-", $data['contactPeople']);
                    foreach($contactPeople as $person){
                        $personalData = explode("?", $person);
        
                        $result = $db->query("  INSERT INTO ContactPeople_Suppliers(supplier, person, department) 
                                                VALUES(" . $id . ",  '" . $personalData[0] . "', '" . $personalData[1] . "')");
                        
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
            }else{
                return "CIF_ERROR";
            }
        }

        /**
        * Obtiene los datos de un proveedor
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['supplierID'] = cleanStr($data['supplierID']);

            $result = $db->query("  SELECT      s.supplierID, s.nif, s.name as supplierName, s.address, 
                                                s.mail, s.phones, s.fax, s.description, s.entryDate, 
                                                s.leavingDate, s.catalogue, s.sentObituary, l.locationID, l.name as locationName, 
                                                l.postalCode, l.province, cs.person, cs.department 
                                    FROM        Suppliers s 
                                    LEFT JOIN   Locations l ON s.location = l.locationID
                                    LEFT JOIN   ContactPeople_Suppliers cs ON cs.supplier = s.supplierID
                                    WHERE       supplierID = " . $data['supplierID']. "");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene las personas de contacto de un proveedor
        *
        * @param array $data
        *
        * @return array
        */
        public function readContactPeople($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $contactPeople = $db->query("   SELECT  person, department 
                                            FROM    ContactPeople_Suppliers 
                                            WHERE   supplier = " . $data . "");

            if(mysqli_num_rows($contactPeople) == 0){
                return null;
            }else{
                return $db->resultToArray($contactPeople);
            }
        }

        /**
        * Modifica los datos de un proveedor
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
            $data['entryDate'] = cleanStr($data['entryDate']);
            $data['fax'] = cleanStr($data['fax']);
            $data['description'] = cleanTextArea($data['description']);
            $data['supplierID'] = cleanStr($data['supplierID']);
            $data['contactPeople'] = cleanStr($data['contactPeople']);
            $data['sentObituary'] = cleanStr($data['sentObituary']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }
            if($data['entryDate'] == ""){
                $data['entryDate'] = "";
            }else{
                $data['entryDate'] = "entryDate = '" . $data['entryDate'] . "',";
            }

            if(!$this->existsCif($data['nif'], $data['supplierID'])){
                $result = $db->query("  UPDATE  Suppliers
                                        SET     location = " . $data['location'] . ",
                                                nif = '" . $data['nif'] . "', 
                                                name = '" . $data['name'] . "',
                                                address = '" . $data['address'] . "', 
                                                mail = '" . $data['mail'] . "',
                                                phones = '" . $data['phones'] . "', 
                                                " . $data['entryDate'] . "
                                                sentObituary = '" . $data['sentObituary'] . "',
                                                fax = '" . $data['fax'] . "',
                                                description = '" . $data['description'] . "'
                                        WHERE   supplierID = " . $data['supplierID']);

                if(!$result){
                    return false;
                }

                $result = $db->query("DELETE FROM ContactPeople_Suppliers WHERE supplier = " . $data['supplierID'] . "");

                if(!$result){
                    return false;
                }

                $flag = 0;
                
                if($data['contactPeople'] != ""){
                    $contactPeople = explode("-", $data['contactPeople']);
                    foreach($contactPeople as $person){
                        $personalData = explode("?", $person);

                        if(!isset($personalData[1])){
                            $personalData[1] = '';
                        }
        
                        $result = $db->query("  INSERT INTO ContactPeople_Suppliers(supplier, person, department) 
                                                VALUES(" . $data['supplierID'] . ", '" . $personalData[0] . "', '" . $personalData[1] . "')");
                        
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
            }else{
                return "CIF_ERROR";
            }
        }

        /**
        * Comprueba si existe un proveedor con un nif dado
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
            
            $where = '';
            if($id !== null){
                $id = cleanStr($id);
                $where = " AND s.supplierID != $id";
            }

            $result = $db->query("  SELECT  COUNT(*) as row
                                    FROM    Suppliers s
                                    WHERE   s.nif = '" . $cif . "' AND 
                                            s.leavingDate IS NULL 
                                            $where");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return false;
            }else{
                return true;
            }   
        }

        /**
        * Modifica el catálogo de un proveedor
        *
        * @param array $data
        *
        * @return bool
        */
        public function updateFile($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['supplierID'] = cleanStr($data['supplierID']);

            return $db->query(" UPDATE  Suppliers
                                SET     catalogue = '" . $data['name'] . "' 
                                WHERE   supplierID = " . $data['supplierID'] . "");
        }

        /**
        * Elimina un proveedor
        *
        * @param array $data
        */
        public function delete($data){
            $db = new DbHandler;

            $data['supplierID'] = cleanStr($data['supplierID']);

            return $db->query(" UPDATE  Suppliers
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                                WHERE   supplierID = " . $data['supplierID'] . "");
        }

        /**
        * Obtiene los datos de los proveedores
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      s.supplierID, s.nif, s.name as supplierName, s.address, 
                                                s.mail, s.phones, s.fax, s.contactPerson, s.entryDate, 
                                                s.leavingDate, l.locationID, l.name as locationName, 
                                                l.postalCode, l.province 
                                    FROM        Suppliers s 
                                    LEFT JOIN   Location l ON s.location = l.locationID
                                    WHERE       s.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de los proveedores (nombre)
        *
        * @return array
        */
        public function listNames(){
            $db = new DbHandler;

            $result = $db->query("SELECT supplierID, name FROM Suppliers");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los proveedores por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT      supplierID, name
                                    FROM        Suppliers 
                                    WHERE       leavingDate IS NULL AND
                                                name LIKE '%". $name ."%'
                                    ORDER BY    name");
            
            if(mysqli_num_rows($result) == 0){
                return [];
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los proveedores por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByNameImport($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT  supplierID
                                    FROM    Suppliers 
                                    WHERE   leavingDate IS NULL AND
                                            name LIKE '%". $name ."%'");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result)[0]['supplierID'];
            }
        }

        /**
        * Obtiene los proveedores por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByProduct($name, $product){
            $db = new DbHandler;

            $name = cleanStr($name);
            $product = cleanStr($product);
            
            $result = $db->query("  SELECT      DISTINCT (s.supplierID), s.name
                                    FROM        Suppliers s, Products_Models pm
                                    WHERE       pm.supplier = s.supplierID AND
                                                pm.product = " . $product . " AND
                                                s.name LIKE '%". $name ."%' AND
                                                pm.leavingDate IS NULL
                                    ORDER BY    s.name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los proveedores por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByProduct2($name, $product){
            $db = new DbHandler;

            $name = cleanStr($name);
            $product = cleanStr($product);
            
            $result = $db->query("  SELECT      DISTINCT (s.supplierID), s.name
                                    FROM        Suppliers s, Products_Models pm
                                    WHERE       pm.supplier = s.supplierID AND
                                                s.leavingDate IS NULL AND 
                                                pm.leavingDate IS NULL AND
                                                pm.product = " . $product . " AND
                                                s.name LIKE '%". $name ."%' AND
                                                pm.visibleHiring = 1
                                    ORDER BY    s.name
            ");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los proveedores por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function getDefaultSupplier($data){
            $db = new DbHandler;

            $data['product'] = cleanStr($data['product']);
            
            $result = $db->query("  SELECT  s.supplierID, s.name
                                    FROM    Suppliers s, Products_Models pm, Expedients e, Products_Prices pp
                                    WHERE   pm.supplier = s.supplierID AND 
                                            pm.product = " . $data['product'] . " AND 
                                            s.supplierID != 2 AND
                                            pm.default = 1 AND 
                                            e.client = pp.client AND 
                                            pp.model = pm.productModelID");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los datos de la localidad dado un proveedor
        *
        * @param array $data
        * 
        * @return array
        */
        public function getLocation($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  l.locationID, l.name
                                    FROM    Suppliers s, Locations l 
                                    WHERE   s.location = l.locationID AND
                                            s.supplierID = " . $data . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene el nombre de un proveedor
        *
        * @param array $data
        * 
        * @return array
        */
        public function getSupplier($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("SELECT supplierID, name
                                  FROM   Suppliers
                                  WHERE  supplierID = ". $data ."");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Obtiene información de contacto del proveedor
         * 
         * @param int $data
         * 
         * @return array
         */
        public function getSupplierInfo($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  phones, fax, mail
                                    FROM    Suppliers
                                    WHERE   supplierID = " . $data . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Obtiene el nif del proveedor
         * 
         * @param int $id Id del proveedor
         * @return string
         */
        public function getNif($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  s.nif
                                    FROM    Suppliers s
                                    WHERE   s.supplierID = $id");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['nif'];
        }
        /**
         * Obtiene la empresa actual
         * 
         * @return int
         */
        public function getCurrentCompany(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  s.value
                                    FROM    Settings s
                                    WHERE   s.settingsID = 12");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['value'];
        }

        /**
        * Obtiene los proveedores
        *
        * @return array
        */
        public function listSuppliersDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      s.supplierID, s.nif, s.name, s.phones, s.mail
                                    FROM        Suppliers s
                                    LEFT JOIN   Locations l ON s.location = l.locationID
                                    WHERE       s.leavingDate IS NULL AND 
                                                s.name != 'No proveedor' AND 
                                                s.name != 'Coros y Organistas'");
            
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

            $result = $db->query("  SELECT      s.supplierID, s.name as name, s.nif, s.address, 
                                                l.province,  l.name as locationName, l.postalCode,
                                                s.mail, s.entryDate, s.fax, s.sentObituary, s.description, s.phones
                                    FROM        (Suppliers s)
                                    LEFT JOIN   Locations l ON s.location = l.locationID
                                    WHERE       s.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                $supplier = $db->resultToArray($result);

                $result = $db->query(" SELECT cs.supplier, cs.person 
                                        FROM ContactPeople_Suppliers cs ");

                if(mysqli_num_rows($result) == 0){
                    $result = ["supplier" => $supplier];
                }else{
                    $supplierContact = $db->resultToArray($result);
                    $result = ["supplier" => $supplier,
                                "supplierContact" => $supplierContact
                            ];
                }
                return $result;
			}
        }

        /**
        * Añade un proveedor
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
            $data['entryDate'] = cleanStr($data['entryDate']);
            $data['description'] = cleanStr($data['description']);
            $data['contactNames'] = cleanStr($data['contactNames']);
            $data['sentObituary'] = cleanStr($data['sentObituary']);

            // Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }

            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return "Formato de NIF incorrecto";
                }
            }

            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "Formato de email incorrecto";
                }
            }

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("SELECT * 
                                  FROM Suppliers 
                                  WHERE extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("SELECT * 
                                      FROM Suppliers 
                                      WHERE extraID = '" . $extraID . "'");
            }
            
            if($data['entryDate'] == ""){
                $data['entryDate'] = "null";
            }else{
                $data['entryDate'] = "'" . date('Y-m-d H:i:s', strtotime($data['entryDate'])) . "'";
            }
     
            if(!$this->existsCif($data['nif'])){
                $result = $db->query("  INSERT INTO Suppliers(location, nif, name, address, mail, 
                                            phones, fax, entryDate, description, catalogue, sentObituary, leavingDate, extraID) 
                                        VALUES(" . $data['location'] . ", '" . $data['nif'] . "', 
                                            '" . $data['name'] . "', '" . $data['address'] . "', 
                                            '" . $data['mail'] . "', '" . $data['phones'] . "', 
                                            '" . $data['fax'] . "', " . $data['entryDate'] . ", 
                                            '" . $data['description'] . "', null,  '" . $data['sentObituary'] . "', null, '" . $extraID . "')");
                if(!$result){
                    return false;
                }

                $flag = 0;

                $result = $db->query("  SELECT supplierID 
                                        FROM Suppliers
                                        WHERE extraID = '" . $extraID . "'");

                $id = $db->resultToArray($result)[0]['supplierID'];

                if($data['contactNames'] != "" && $data['contactNames'] != null){

                $result = $db->query("  INSERT INTO ContactPeople_Suppliers(supplier, person) 
                                        VALUES(" . $id . ", '" .$data['contactNames'] . "')");
                    if(!$result){
                        $flag++;
                    }
                }

                if($flag > 0){
                    return false;
                }else{
                    return true;
                }
            }else{
                return "Ya existe un proveedor con ese NIF";
            }
        }

        /**
        * Modifica los datos de un proveedor
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
            $data['entryDate'] = cleanStr($data['entryDate']);
            $data['fax'] = cleanStr($data['fax']);
            $data['description'] = cleanStr($data['description']);
            $data['supplierID'] = cleanStr($data['supplierID']);
            $data['contactNames'] = cleanStr($data['contactNames']);
            $data['sentObituary'] = cleanStr($data['sentObituary']);

            // Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }
            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return "Formato de NIF incorrecto";
                }
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "Formato de email incorrecto";
                }
            }
            if($data['entryDate'] == ""){
                $data['entryDate'] = "";
            }else{
                $data['entryDate'] = "entryDate = '" . date('Y-m-d H:i:s', strtotime($data['entryDate'])) . "',";
            }

            if(!$this->existsCif($data['nif'], $data['supplierID'])){
                $result =  $db->query(" UPDATE  Suppliers
                                        SET     location = " . $data['location'] . ", nif = '" . $data['nif'] . "', 
                                                name = '" . $data['name'] . "', address = '" . $data['address'] . "', 
                                                mail = '" . $data['mail'] . "', phones = '" . $data['phones'] . "', 
                                                " . $data['entryDate'] . "
                                                sentObituary = '" . $data['sentObituary'] . "',
                                                fax = '" . $data['fax'] . "', description = '" . $data['description'] . "'
                                        WHERE   supplierID = " . $data['supplierID'] . "");
                if(!$result){
                    return false;
                }

                $result = $db->query("DELETE FROM ContactPeople_Suppliers WHERE supplier = " . $data['supplierID'] . "");
                if(!$result){
                    return false;
                }

                $flag = 0;
                
                if($data['contactNames'] != ""){
                    $contactPeople = explode("-", $data['contactNames']);
                    foreach($contactPeople as $person){
                        $personalData = $person;
        
                        $result = $db->query("  INSERT INTO ContactPeople_Suppliers(supplier, person, department) 
                                                VALUES(" . $data['supplierID'] . ", '" . $personalData . "', null)");
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
            }else{
                return "Ya existe un proveedor con ese NIF";
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
                                    FROM    Suppliers s
                                    WHERE   s.supplierID = $id AND s.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }

        /**
         * Obtiene los proveedores con correo electrónico
         *
         * @param array $data ID del proveedor
         * @return array
         */
        public function getToEmailAddressee($search){
            $db = new DbHandler;

            $result = $db->query("  SELECT  s.supplierID as id,
                                            CONCAT(s.name, ' (', s.mail, ')') as text
                                    FROM    Suppliers s
                                    WHERE   s.mail IS NOT NULL AND s.mail != ''
                                        AND s.leavingDate IS NULL
                                        AND (
                                            s.name LIKE '%". $search ."%' OR 
                                            s.mail LIKE '%". $search ."%'
                                        )");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArray($result);
        }

        /**
        * Obtiene el email de un proveedor
        *
        * @param array $data ID del proveedor
        * @return array
        */
        public function getEmail($id){
            $db = new DbHandler;

            $result = $db->query("  SELECT  s.mail as email
                                    FROM    Suppliers s
                                    WHERE   s.supplierID = " . $id);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>