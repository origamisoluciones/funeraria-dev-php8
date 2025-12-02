<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Mortuaries{

        /**
         * Añade un tanatorio
         *
         * @param array $data Datos del tanatorio
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['isYourOwn'] = cleanStr($data['isYourOwn']);
            $data['company'] = cleanStr($data['company']);
            $data['apiClient'] = cleanStr($data['apiClient']);
            $data['apiKey'] = cleanStr($data['apiKey']);
            $data['latitude'] = cleanStr($data['latitude']);
            $data['longitude'] = cleanStr($data['longitude']);
            $data['tellmebye'] = cleanStr($data['tellmebye']);
            $data['tellmebyeName'] = cleanStr($data['tellmebyeName']);

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

            $result = $db->query("  SELECT  m.mortuaryID 
                                    FROM    Mortuaries m 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  m.mortuaryID 
                                        FROM    Mortuaries m 
                                        WHERE   extraID = '" . $extraID . "'");
            }

            if($data['location'] == ''){
                $data['location'] = 'null';
            }

            if(
                ($data["longitude"] == 'NULL' && $data["latitude"] == 'NULL') ||
                (strlen($data["longitude"]) == 0 && strlen($data["latitude"]) == 0)
            ){
                $db->query("INSERT INTO Mortuaries(
                                location, name, address, mail, phones, isYourOwn, company,
                                vivo_recuerdo_client, vivo_recuerdo_key, tellmebye, tellmebyeName, extraID
                            ) 
                            VALUES (
                                " . $data['location'] . ", '" . $data['name'] . "', '" . $data['address'] . "',
                                '" . $data['mail'] . "', '" . $data['phones'] . "',  " . $data['isYourOwn'] . ", 
                                '" . $data['company'] . "', '" . $data['apiClient'] . "', '" . $data['apiKey'] . "',
                                '" . $data['tellmebye'] . "', '" . $data['tellmebyeName'] . "', '$extraID'
                            )
                ");
            }else{
                $db->query("INSERT INTO Mortuaries(
                                location, name, address, mail, phones, isYourOwn, company, latitude, longitude,
                                vivo_recuerdo_client, vivo_recuerdo_key, tellmebye, tellmebyeName, extraID
                            ) 
                            VALUES (
                                " . $data['location'] . ", '" . $data['name'] . "', '" . $data['address'] . "',
                                '" . $data['mail'] . "', '" . $data['phones'] . "', " . $data['isYourOwn'] . ", 
                                '" . $data['company'] . "', " . $data['latitude'] . ", " . $data['longitude'] . ", 
                                '" . $data['apiClient'] . "', '" . $data['apiKey'] . "', '" . $data['tellmebye'] . "',
                                '" . $data['tellmebyeName'] . "','$extraID'
                            )
                ");
            }

            $result = $db->query("  SELECT  m.mortuaryID, m.isYourOwn
                                    FROM    Mortuaries m
                                    WHERE   m.extraID = '$extraID'");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                $mortuary = $db->resultToArray($result)[0];
                $id = $mortuary['mortuaryID'];
                $own = $mortuary['isYourOwn'];

                if($own == 1){
                    // Stock
                    require_once($_SESSION['basePath'] . "model/stock.php");
                    $stock = new Stock;
                    $stock->addOne($id);

                    require_once($_SESSION['basePath'] . "model/panelInfo.php");
                    $panelInfo = new PanelInfo;
                    $panelInfo->firstTime($id);
                }
    
                return true;
            }
        }

        /**
         * Añade un centro de coste
         *
         * @param array $data Datos del centro de coste
         * @return bool
         */
        public function createCostCenter($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['mortuary'] = cleanStr($data['mortuary']);
            $data['company'] = cleanStr($data['company']);
            $data['ppal'] = cleanStr($data['ppal']);

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

            $result = $db->query("  SELECT  m.ID 
                                    FROM    Cost_Center m 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  m.ID 
                                        FROM    Cost_Center m 
                                        WHERE   extraID = '" . $extraID . "'");
            }

            if($data['location'] == ''){
                $data['location'] = 'null';
            }

            $db->query("INSERT INTO Cost_Center(location, name, address, mail, phones, mortuary, company,  warehousePpal,  extraID) 
                        VALUES (" . $data['location'] . ", '" . $data['name'] . "', '" . $data['address'] . "',
                                '" . $data['mail'] . "', '" . $data['phones'] . "',
                                " . $data['mortuary'] . ",'" . $data['company'] . "', " . $data['ppal'] . ", '$extraID')");

            $result = $db->query("  SELECT  m.ID
                                    FROM    Cost_Center m
                                    WHERE   m.extraID = '$extraID'");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                $mortuary = $db->resultToArray($result)[0];
                $id = $mortuary['ID'];
                // Stock
                require_once($_SESSION['basePath'] . "model/stock.php");
                $stock = new Stock;
                $stock->addOne($id);
    
                return true;
            }
        }

        /**
        * Obtiene los datos de un tanatorio
        *
        * @param array $data Id del tanatorio
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['mortuaryID'] = cleanStr($data['mortuaryID']);

            $result = $db->query("  SELECT      m.mortuaryID, m.name as mortuaryName, m.address, m.mail, 
                                                m.phones, m.text, m.isYourOwn, m.company, m.leavingDate, 
                                                m.latitude, m.longitude,
                                                m.vivo_recuerdo_client as api_client, m.vivo_recuerdo_key as api_key,
                                                m.tellmebye, m.tellmebyeName,
                                                l.locationID, l.name as locationName, l.postalCode, l.province
                                    FROM        (Mortuaries m)
                                    LEFT JOIN   Locations l ON m.location = l.locationID
                                    WHERE       m.mortuaryID = " . $data['mortuaryID']);

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de un centro de coste
        *
        * @param array $data Id del centro de coste
        * @return array
        */
        public function readCostCenter($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT      m.ID, m.name as costCenterName, m.address, m.mail, 
                                                m.phones, m.text, m.warehousePpal, m.mortuary, m1.name as mortuaryName, m.company, m.leavingDate, 
                                                l.locationID, l.name as locationName, l.postalCode, l.province
                                    FROM        (Cost_Center m)
                                    LEFT JOIN   Locations l ON m.location = l.locationID
                                    LEFT JOIN   Mortuaries m1 ON m1.mortuaryID =  m.mortuary
                                    WHERE       m.ID = " . $data['ID']);

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Modifica los datos de un tanatorio
         *
         * @param array $data Datos del tanatorio
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['isYourOwn'] = cleanStr($data['isYourOwn']);
            $data['company'] = cleanStr($data['company']);
            $data['latitude'] = cleanStr($data['latitude']);
            $data['longitude'] = cleanStr($data['longitude']);
            $data['mortuaryID'] = cleanStr($data['mortuaryID']);
            $data['apiClient'] = cleanStr($data['apiClient']);
            $data['apiKey'] = cleanStr($data['apiKey']);
            $data['tellmebye'] = cleanStr($data['tellmebye']);
            $data['tellmebyeName'] = cleanStr($data['tellmebyeName']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }
           
            if(strlen($data["longitude"]) == 0 && strlen($data["latitude"]) == 0){

                $db->query("UPDATE  Mortuaries
                            SET     location = " . $data['location'] . ",
                                    name = '" . $data['name'] . "', 
                                    address = '" . $data['address'] . "',
                                    mail = '" . $data['mail'] . "', 
                                    phones = '" . $data['phones'] . "',
                                    isYourOwn = " . $data['isYourOwn'] . ",
                                    company = '" . $data['company'] . "',
                                    vivo_recuerdo_client = '" . $data['apiClient'] . "',
                                    vivo_recuerdo_key = '" . $data['apiKey'] . "',
                                    tellmebye = '" . $data['tellmebye'] . "',
                                    tellmebyeName = '" . $data['tellmebyeName'] . "'
                            WHERE   mortuaryID = " . $data['mortuaryID']);
            }else{

                $db->query("UPDATE  Mortuaries
                            SET     location = " . $data['location'] . ",
                                    name = '" . $data['name'] . "', 
                                    address = '" . $data['address'] . "',
                                    mail = '" . $data['mail'] . "', 
                                    phones = '" . $data['phones'] . "',
                                    isYourOwn = " . $data['isYourOwn'] . ",
                                    company = '" . $data['company'] . "',
                                    latitude = " . $data['latitude'] . ", 
                                    longitude = " . $data['longitude'] . ",
                                    vivo_recuerdo_client = '" . $data['apiClient'] . "',
                                    vivo_recuerdo_key = '" . $data['apiKey'] . "',
                                    tellmebye = '" . $data['tellmebye'] . "',
                                    tellmebyeName = '" . $data['tellmebyeName'] . "'
                            WHERE   mortuaryID = " . $data['mortuaryID']);
            }

            // Stock
            require_once($_SESSION['basePath'] . "model/stock.php");
            $stock = new Stock;
            $stock->addOne($data['mortuaryID']);

            if($data['isYourOwn'] == 1){
                require_once($_SESSION['basePath'] . "model/panelInfo.php");
                $panelInfo = new PanelInfo;
                $panelInfo->nextTime($data['mortuaryID']);
            }

            return true;
        }

        /**
         * Modifica los datos de un centro de coste
         *
         * @param array $data Datos del centro de coste
         * @return bool
         */
        public function updateCostCenter($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['mortuary'] = cleanStr($data['mortuary']);
            $data['company'] = cleanStr($data['company']);
            $data['ppal'] = cleanStr($data['ppal']);
            $data['ID'] = cleanStr($data['ID']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return false;
                }
            }

            $db->query("UPDATE  Cost_Center
                        SET     location = " . $data['location'] . ",
                                name = '" . $data['name'] . "', 
                                address = '" . $data['address'] . "',
                                mail = '" . $data['mail'] . "', 
                                phones = '" . $data['phones'] . "',
                                warehousePpal = " . $data['ppal'] . ", 
                                mortuary = " . $data['mortuary'] . ", 
                                company = '" . $data['company'] . "'
                        WHERE   ID = " . $data['ID']);

            // Stock
            require_once($_SESSION['basePath'] . "model/stock.php");
            $stock = new Stock;
            $stock->addOne($data['ID']);

            return true;
        }

        /**
        * Elimina un tanatorio
        *
        * @param array $data
        */
        public function delete($data){
            $db = new DbHandler;

            $data['mortuaryID'] = cleanStr($data['mortuaryID']);

            $db->query("UPDATE  Mortuaries
                        SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                        WHERE   mortuaryID = " . $data['mortuaryID'] . "");

            return true;
        }

        /**
        * Elimina un centro de coste
        *
        * @param array $data
        */
        public function deleteCostCenter($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $db->query("UPDATE  Cost_Center
                        SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                        WHERE   ID = " . $data['ID'] . "");

            $db->query("UPDATE  Stock s
                        SET     leavingDate = " . time() . "
                        WHERE   s.mortuary = " . $data['ID']);

            return true;
        }

        /**
        * Obtiene los datos de los tanatorios
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  mortuaryID, name
                                    FROM    Mortuaries
                                    WHERE   leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de los tanatorios propios
        *
        * @return array
        */
        public function getOwnMortuaries(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  mortuaryID, name
                                    FROM    Mortuaries
                                    WHERE   leavingDate IS NULL AND
                                            isYourOwn = 1");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de los tanatorios propios - select2 mode
        *
        * @return array
        */
        public function getOwnMortuariesSelect2(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  mortuaryID as id, name as text
                                    FROM    Mortuaries
                                    WHERE   leavingDate IS NULL AND
                                            isYourOwn = 1");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de los centro de coste
        *
        * @return array
        */
        public function getCostCenter(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  ID, name
                                    FROM    Cost_Center
                                    WHERE   leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de los tanatorios
        *
        * @return array
        */
        public function getMortuaries(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  mortuaryID, name
                                    FROM    Mortuaries
                                    WHERE   leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de los tanatorios propios
        *
        * @return array
        */
        public function getMortuariesOwn(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  mortuaryID, name
                                    FROM    Mortuaries
                                    WHERE   leavingDate IS NULL AND
                                            isYourOwn = 1");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de la localidad dado un tanatorio
        *
        * @param array $data
        * 
        * @return array
        */
        public function getLocation($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  l.locationID, l.name
                                    FROM    Mortuaries m, Locations l 
                                    WHERE   m.location = l.locationID AND
                                            m.mortuaryID = " . $data . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de los tanatorios
        *
        * @return array
        */
        public function getMortuariesOwnSelect2($name){
            $db = new DbHandler;

            if($name != null){
                $name = cleanStr($name);
            }

            if($name != null){
                $result = $db->query("  SELECT  cc.ID as mortuaryID, m.name, m.mortuaryID as mortuary_id
                                        FROM    Mortuaries m, Cost_Center cc
                                        WHERE   cc.mortuary = m.mortuaryID AND
                                                m.leavingDate IS NULL AND
                                                m.isYourOwn = 1 AND
                                                m.name LIKE '%$name%' ");
            }else{
                $result = $db->query("  SELECT  cc.ID as mortuaryID, m.name, m.mortuaryID as mortuary_id
                                        FROM    Mortuaries m, Cost_Center cc
                                        WHERE   cc.mortuary = m.mortuaryID AND
                                                m.leavingDate IS NULL AND
                                                m.isYourOwn = 1 ");
            }
           
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Obtiene los tanatorios propios por nombre
         *
         * @param string $name Nombre del tanatorio
         * @return array
         */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);

            $result = $db->query("  SELECT      m.mortuaryID, m.name, m.tellmebye, m.tellmebyeName
                                    FROM        Mortuaries m
                                    WHERE       m.name LIKE '%$name%' AND
                                                m.leavingDate IS NULL
                                    ORDER BY    m.name");
            
            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los tanatorios propios por nombre
         *
         * @param string $name Nombre del tanatorio
         * @return array
         */
        public function searchByNameOwn3($name){
            $db = new DbHandler;

            $name = cleanStr($name);

            $result = $db->query("  SELECT      m.mortuaryID, m.name
                                    FROM        Mortuaries m
                                    WHERE       m.name LIKE '%$name%' AND
                                                m.leavingDate IS NULL AND
                                                m.isYourOwn = 1
                                    ORDER BY    m.name");
            
            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los tanatorios propios por nombre
         *
         * @param string $name Nombre del tanatorio
         * @return array
         */
        public function searchByNameOwn($name, $mortuary){
            $db = new DbHandler;

            $name = cleanStr($name);
            $mortuary = cleanStr($mortuary);

            if($mortuary == null){
                $result = $db->query("  SELECT  m.mortuaryID, m.name
                                        FROM    Mortuaries m
                                        WHERE   m.name LIKE '%$name%' AND
                                                m.isYourOwn = 1 AND
                                                m.leavingDate IS NULL");
            }else{
                $result = $db->query("  SELECT  m.mortuaryID, m.name
                                        FROM    Mortuaries m
                                        WHERE   m.name LIKE '%$name%' AND
                                                m.isYourOwn = 1 AND
                                                m.mortuaryID != $mortuary AND
                                                m.leavingDate IS NULL");
            }
            
            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los centro de coste propios por nombre
         *
         * @param string $name Nombre del centro de coste
         * @return array
         */
        public function searchByNameOwnCostCenter($name, $costCenter){
            $db = new DbHandler;

            $name = cleanStr($name);
            $costCenter = cleanStr($costCenter);

            if($costCenter == null){
                $result = $db->query("  SELECT      m.ID, m.name
                                        FROM        Cost_Center m
                                        WHERE       m.name LIKE '%$name%' AND
                                                    m.leavingDate IS NULL
                                        ORDER BY    m.name");
            }else{
                $result = $db->query("  SELECT      m.ID, m.name
                                        FROM        Cost_Center m
                                        WHERE       m.name LIKE '%$name%' AND
                                                    m.ID != $costCenter AND
                                                    m.leavingDate IS NULL
                                        ORDER BY    m.name");
            }
            
            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los centro de coste propios por nombre
         *
         * @param string $name Nombre del centro de coste
         * @return array
         */
        public function searchByNameOwnCostCenterHiring($name){
            $db = new DbHandler;

            $name = cleanStr($name);

            $result = $db->query("  SELECT      m.ID, m.name
                                    FROM        Cost_Center m
                                    WHERE       m.name LIKE '%$name%' AND
                                                m.leavingDate IS NULL
                                    ORDER BY    warehousePpal DESC, m.name");
           
            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los tanatorios propios por nombre para los pedidos
         *
         * @param string $name Nombre del tanatorio
         * @return array
         */
        public function searchByNameOwn2($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT  m.mortuaryID, m.name
                                    FROM    Mortuaries m
                                    WHERE   m.name LIKE '%$name%' AND
                                            m.isYourOwn = 1 AND
                                            m.leavingDate IS NULL");

            $mortuaries = array();

            if(mysqli_num_rows($result) > 0){
                $mortuaries = $db->resultToArray($result);
            }
            $mortuaries[count($mortuaries)] = array('mortuaryID' => "0", 'name' => "Otro");
            
            return $mortuaries;
        }   

        /**
         * Obtiene los centro de coste propios por nombre para los pedidos
         *
         * @param string $name Nombre del centro de coste
         * @return array
         */
        public function searchByNameOwnCostCenter2($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT  m.ID, m.name
                                    FROM    Cost_Center m
                                    WHERE   m.name LIKE '%$name%' AND
                                            m.leavingDate IS NULL");

            $mortuaries = array();

            if(mysqli_num_rows($result) > 0){
                $mortuaries = $db->resultToArray($result);
            }
            
            return $mortuaries;
        }   

        /**
         * Obtiene los tanatorios propios por nombre para los pedidos
         *
         * @param string $name Nombre del tanatorio
         * @return array
         */
        public function searchByNameMortuariesToCostCenter($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT      m.mortuaryID, m.name
                                    FROM        Mortuaries m
                                    WHERE       m.name LIKE '%$name%' AND
                                                m.leavingDate IS NULL
                                    ORDER BY    m.name");

            $mortuaries = array();

            if(mysqli_num_rows($result) > 0){
                $mortuaries = $db->resultToArray($result);
            }
            $mortuaries[count($mortuaries)] = array('mortuaryID' => "0", 'name' => "Otro");
            
            return $mortuaries;
        }   
        
        /**
        * Obtiene los tanatorios
        *
        * @return array
        */
        public function listMortuariesDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      m.mortuaryID, m.name, l.name, m.phones, m.isYourOwn
                                    FROM        Mortuaries m
                                    LEFT JOIN   Locations l ON m.location = l.locationID
                                    WHERE       m.leavingDate IS NULL AND
                                                m.mortuaryID != 0");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
        * Obtiene los centros de coste
        *
        * @return array
        */
        public function listCostCenterDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      m.ID, m.name, l.name, m.phones
                                    FROM        Cost_Center m
                                    LEFT JOIN   Locations l ON m.location = l.locationID
                                    WHERE       m.leavingDate IS NULL AND
                                                m.ID != 0");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }
        
        /*
         * Obtiene los tanatorios
         *
         * @return array
         */
        public function getApi(){
            $db = new DbHandler(true);

            $result = $db->query("  SELECT  m.mortuaryID as id, m.name as text
                                    FROM    Mortuaries m
                                    WHERE   m.leavingDate IS NULL AND
                                            m.mortuaryID != 0 AND
                                            m.isYourOwn = 1");

            return $result === false ? array() : (mysqli_num_rows($result) == 0 ? array() : $db->resultToArray($result));
        }

        /**
         * Obtiene los datos de los centros de coste para exportar
         *
         * @param array $data ID del cura
         * @return array
         */
        public function listToExportCostCenter(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      c.ID, c.name as name, c.address, c.mail, c.phones,
                                                l.name as locationName, l.province, l.postalCode,
                                                l1.name as mortuaryName,
                                                c.company, c.warehousePpal as principal
                                    FROM        (Cost_Center c)
                                    LEFT JOIN   Locations l ON c.location = l.locationID
                                    LEFT JOIN   Mortuaries l1 ON c.mortuary = l1.mortuaryID
                                    WHERE       c.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                $costCenter = $db->resultToArray($result);
                $result = ["costCenter" => $costCenter];
                return $result;
            }
        }

        /**
        * Comprueba si un centro de coste está borrado
        *
        * @param array $id
        *
        * @return array
        */
        public function isDeleteCostCenter($id){
            $db = new DbHandler;

            $id = cleanStr($id);
            $result = $db->query("  SELECT  COUNT(*) as row
                                    FROM    Cost_Center c
                                    WHERE   c.ID = $id AND c.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }

        /**
        * Añade un centro de coste (import)
        *
        * @param array $data
        */
        public function createImportCostCenter($data){
            $db = new DbHandler;
          
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['location'] = cleanStr($data['location']);
            $data['mortuary'] = cleanStr($data['mortuary']);
            $data['company'] = cleanStr($data['company']);
            $data['warehousePpal'] = cleanStr($data['warehousePpal']);

            $data['mortuary'] = $data['mortuary'] == '' ? 'null' : $data['mortuary'];

            // Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Cost_Center 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Cost_Center 
                                        WHERE   extraID = '" . $extraID . "'");
            }
            
            $db->query("INSERT INTO Cost_Center(
                            location, name,  address, mail, 
                            phones, mortuary, company, warehousePpal, extraID
                        ) 
                        VALUES (
                            " . $data['location'] . ", '" . $data['name'] . "', '" . $data['address'] . "',  '" . $data['mail'] . "', 
                            '" . $data['phones'] . "', " . $data['mortuary'] . ", '" . $data['company'] . "', '" . $data['warehousePpal'] . "', '$extraID'
                        )
            ");

            $result = $db->query("  SELECT  m.ID
                                    FROM    Cost_Center m
                                    WHERE   m.extraID = '$extraID'");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                $mortuary = $db->resultToArray($result)[0];
                $id = $mortuary['ID'];
                // Stock
                require_once($_SESSION['basePath'] . "model/stock.php");
                $stock = new Stock;
                $stock->addOne($id);
    
                return true;
            }
        }

        /**
         * Modifica los datos de un centro de coste
         *
         * @param array $data
         */
        public function updateImportCostCenter($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['location'] = cleanStr($data['location']);
            $data['mortuary'] = cleanStr($data['mortuary']);
            $data['company'] = cleanStr($data['company']);
            $data['warehousePpal'] = cleanStr($data['warehousePpal']);
            $data['ID'] = cleanStr($data['ID']);

            // Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }

            if($data['mortuary'] == ''){
                $data['mortuary'] = 'null';
            }

            $db->query("UPDATE  Cost_Center
                        SET     location = " . $data['location'] . ",
                                name = '" . $data['name'] . "', 
                                address = '" . $data['address'] . "',
                                mail = '" . $data['mail'] . "', 
                                phones = '" . $data['phones'] . "',
                                mortuary = " . $data['mortuary'] . ",
                                company = '" . $data['company'] . "',
                                warehousePpal = '" . $data['warehousePpal'] . "'
                        WHERE   ID = " . $data['ID']);

            // Stock
            require_once($_SESSION['basePath'] . "model/stock.php");
            $stock = new Stock;
            $stock->addOne($data['ID']);
            
            return true;
        }

        /**
         * Obtiene los datos de los tanarios para exportart
         *
         * @return array
         */
        public function listToExport(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      m.mortuaryID, m.name as name, m.address,
                                                m.mail, m.phones, m.company, m.isYourOwn, m.text, m.latitude, m.longitude,
                                                l.province, l.name as locationName, l.postalCode
                                    FROM        (Mortuaries m)
                                    LEFT JOIN   Locations l ON m.location = l.locationID
                                    WHERE       m.leavingDate IS NULL AND mortuaryID != 0");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                $mortuaries = $db->resultToArray($result);
                $result = ["mortuaries" => $mortuaries];
                return $result;
			}
        }

        /**
         * Añade un tanatorio (import)
         *
         * @param array $data Datos del tanatorio
         * @return bool
         */
        public function createImport($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['isYourOwn'] = cleanStr($data['isYourOwn']);
            $data['latitude'] = cleanStr($data['latitude']);
            $data['longitude'] = cleanStr($data['longitude']);
            $data['company'] = cleanStr($data['company']);

            // Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }

            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "El formato del email es incorrecto";
                }
            }

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  m.mortuaryID 
                                    FROM    Mortuaries m 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  m.mortuaryID 
                                        FROM    Mortuaries m 
                                        WHERE   extraID = '" . $extraID . "'");
            }

            if($data['location'] == ''){
                $data['location'] = 'null';
            }

            if(strlen($data["longitude"]) == 0 && strlen($data["latitude"]) == 0){

                $db->query("INSERT INTO Mortuaries(location, name, address, mail, phones, isYourOwn, company, extraID) 
                            VALUES (" . $data['location'] . ", '" . $data['name'] . "', '" . $data['address'] . "',
                                '" . $data['mail'] . "', '" . $data['phones'] . "', " . $data['isYourOwn'] . ", 
                                '" . $data['company'] . "', '$extraID')");
            }else{
                $data['longitude'] = preg_replace('/((?<=\.)[^.]*)\./', '$1',$data['longitude']);
                $data['latitude'] = preg_replace('/((?<=\.)[^.]*)\./', '$1',$data['latitude']);

                $db->query("INSERT INTO Mortuaries(location, name, address, mail, phones, isYourOwn, company, latitude, longitude, extraID) 
                            VALUES (" . $data['location'] . ", '" . $data['name'] . "', '" . $data['address'] . "',
                                '" . $data['mail'] . "', '" . $data['phones'] . "', " . $data['isYourOwn'] . ", 
                                '" . $data['company'] . "', " . $data['latitude'] . ", " . $data['longitude'] . ", '$extraID')");
            }

            $result = $db->query("  SELECT  m.mortuaryID, m.isYourOwn
                                    FROM    Mortuaries m
                                    WHERE   m.extraID = '$extraID'");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                $mortuary = $db->resultToArray($result)[0];
                $id = $mortuary['mortuaryID'];
                $own = $mortuary['isYourOwn'];

                if($own == 1){
                    // Stock
                    require_once($_SESSION['basePath'] . "model/stock.php");
                    $stock = new Stock;
                    $stock->addOne($id);

                    require_once($_SESSION['basePath'] . "model/panelInfo.php");
                    $panelInfo = new PanelInfo;
                    $panelInfo->firstTime($id);
                }
                return true;
            }
        }

        /**
        * Comprueba si un tanatorio ha sido borrado
        *
        * @param array $cif
        *
        * @return array
        */
        public function isDelete($id){
            $db = new DbHandler;

            $id = cleanStr($id);
            $result = $db->query("  SELECT  COUNT(*) as row
                                    FROM    Mortuaries m
                                    WHERE   m.mortuaryID = $id AND m.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }

        /**
         * Modifica los datos de un tanatorio (import)
         *
         * @param array $data Datos del tanatorio
         * @return bool
         */
        public function updateImport($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['phones'] = cleanStr($data['phones']);
            $data['isYourOwn'] = cleanStr($data['isYourOwn']);
            $data['company'] = cleanStr($data['company']);
            $data['mortuaryID'] = cleanStr($data['mortuaryID']);
            $data['latitude'] = cleanStr($data['latitude']);
            $data['longitude'] = cleanStr($data['longitude']);

            // Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }

            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "El formato del email es incorrecto";
                }
            }

            if(strlen($data["longitude"]) == 0 && strlen($data["latitude"]) == 0){

                $db->query("UPDATE  Mortuaries
                            SET     location = " . $data['location'] . ",
                                    name = '" . $data['name'] . "', 
                                    address = '" . $data['address'] . "',
                                    mail = '" . $data['mail'] . "', 
                                    phones = '" . $data['phones'] . "',
                                    isYourOwn = " . $data['isYourOwn'] . ",
                                    company = '" . $data['company'] . "'
                            WHERE   mortuaryID = " . $data['mortuaryID']);

            }else{

                $data['longitude'] = preg_replace('/((?<=\.)[^.]*)\./', '$1',$data['longitude']);
                $data['latitude'] = preg_replace('/((?<=\.)[^.]*)\./', '$1',$data['latitude']);

                $db->query("UPDATE  Mortuaries
                            SET     location = " . $data['location'] . ",
                                    name = '" . $data['name'] . "', 
                                    address = '" . $data['address'] . "',
                                    mail = '" . $data['mail'] . "', 
                                    phones = '" . $data['phones'] . "',
                                    isYourOwn = " . $data['isYourOwn'] . ",
                                    company = '" . $data['company'] . "',
                                    latitude = " . $data['latitude'] . ", 
                                    longitude = " . $data['longitude'] . "
                            WHERE   mortuaryID = " . $data['mortuaryID']);
            }

            // Stock
            require_once($_SESSION['basePath'] . "model/stock.php");
    
            $stock = new Stock;
            $stock->addOne($data['mortuaryID']);

            if($data['isYourOwn'] == 1){
                require_once($_SESSION['basePath'] . "model/panelInfo.php");

                $panelInfo = new PanelInfo;
                $panelInfo->nextTime($data['mortuaryID']);
            }

            return true;
        }

        /**
         * Obtiene las credenciales de vivo recuerdo para un tanatorio
         *
         * @param int $expedient Expediente
         * @return bool
         */
        public function checkVivaRecuerdoApiKeys($expedient){
            $db = new DbHandler;

            $result = $db->query("  SELECT  m.vivo_recuerdo_client as api_client, m.vivo_recuerdo_key as api_key
                                    FROM    Mortuaries m, Expedients e
                                    WHERE   m.leavingDate IS NULL AND
                                            m.mortuaryID = e.deceasedMortuary AND
                                            e.expedientID = $expedient");
            
            if(mysqli_num_rows($result) == 0){
				return false;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Obtiene los tanatorios propios por nombre
         *
         * @param string $name Nombre del tanatorio
         * @return array
         */
        public function searchByNameEquals($name){
            $db = new DbHandler;

            $name = cleanStr($name);

            $result = $db->query("  SELECT      m.mortuaryID
                                    FROM        Mortuaries m
                                    WHERE       m.name = '$name' AND
                                                m.leavingDate IS NULL
                                    ORDER BY    m.name");
            
            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>