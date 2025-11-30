<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Gravediggers{
        /**
         * Añade un enterrador
         *
         * @param array $data Datos del enterrador
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
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

            // Cálculo del extraID
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT    * 
                                    FROM      Gravediggers 
                                    WHERE     extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT    * 
                                        FROM      Gravediggers 
                                        WHERE     extraID = '" . $extraID . "'");
            }

            if(!$this->existsCif($data['nif'])){
                $db->query("INSERT INTO Gravediggers(location, nif, name, surname, address, mail, homePhone, mobilePhone, otherPhone, extraID)
                            VALUES (" . $data['location'] . ", '" . $data['nif'] . "', 
                                    '" . $data['name'] . "', '" . $data['surname'] . "', 
                                    '" . $data['address'] . "', '" . $data['mail'] . "', 
                                    '" . $data['homePhone'] . "', '" . $data['mobilePhone'] . "',
                                    '" . $data['otherPhone'] . "', '$extraID')");

                if(isset($data['cemeteries'])){
                    $result = $db->query("  SELECT  g.gravediggerID
                                            FROM    Gravediggers g
                                            WHERE   g.extraID = '$extraID'");

                    if(mysqli_num_rows($result) > 0){
                        $id = $db->resultToArray($result)[0]['gravediggerID'];

                        foreach($data['cemeteries'] as $cemetery){
                            $cemetery = cleanStr($cemetery);
                            $db->query("INSERT INTO GravediggersCemeteries(gravedigger, cemetery)
                                        VALUES ($id, $cemetery)");
                        }
                    }

                    return true;
                }else{
                    return true;
                }
            }else{
                return "CIF_ERROR";
            }
        }

        /**
         * Obtiene los datos de un enterrador
         *
         * @param array $data ID del enterrador
         * @return array
         */
        public function read($data){
            $db = new DbHandler;

            $data['gravediggerID'] = cleanStr($data['gravediggerID']);

            $result = $db->query("  SELECT      g.gravediggerID, g.nif, g.name as gravediggerName, g.surname, 
                                                g.address, g.mail, g.homePhone, g.mobilePhone, g.otherPhone, 
                                                g.leavingDate,
                                                l.locationID, l.name as locationName, l.postalCode, l.province
                                    FROM        (Gravediggers g)
                                    LEFT JOIN   Locations l ON g.location = l.locationID
                                    WHERE       g.gravediggerID = " . $data['gravediggerID'] . "");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                $gravedigger = $db->resultToArray($result)[0];

                $result = $db->query("  SELECT  gc.cemetery, c.name
                                        FROM    GravediggersCemeteries gc, Cemeteries c
                                        WHERE   gc.cemetery = c.cemeteryID AND
                                                gc.gravedigger = " . $gravedigger['gravediggerID']);

                if(mysqli_num_rows($result) == 0){
                    return array($gravedigger, null);
                }else{
                    return array($gravedigger, $db->resultToArray($result));
                }
			}
        }

        /**
         * Modifica los datos de un enterrador
         *
         * @param array $data Datos del enterrdor
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['homePhone'] = cleanStr($data['homePhone']);
            $data['mobilePhone'] = cleanStr($data['mobilePhone']);
            $data['otherPhone'] = cleanStr($data['otherPhone']);
            $data['gravediggerID'] = cleanStr($data['gravediggerID']);

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
           
            if(!$this->existsCif($data['nif'], $data['gravediggerID'])){
                $db->query("UPDATE  Gravediggers
                            SET     location = " . $data['location'] . ",
                                    nif = '" . $data['nif'] . "', 
                                    name = '" . $data['name'] . "',
                                    surname = '" . $data['surname'] . "', 
                                    address = '" . $data['address'] . "',
                                    mail = '" . $data['mail'] . "', 
                                    homePhone = '" . $data['homePhone'] . "',
                                    mobilePhone = '" . $data['mobilePhone'] . "',
                                    otherPhone = '" . $data['otherPhone'] . "'
                            WHERE   gravediggerID = " . $data['gravediggerID'] . "");
                
                if(isset($data['cemeteries'])){
                    $cemeteries = '(';
                    foreach($data['cemeteries'] as $cemetery){
                        $cemetery = cleanStr($cemetery);

                        $cemeteries .= $cemetery . ',';

                        $result = $db->query("  SELECT  ID
                                                FROM    GravediggersCemeteries
                                                WHERE   gravedigger = " . $data['gravediggerID'] . " AND
                                                        cemetery = $cemetery");

                        if(mysqli_num_rows($result) == 0){
                            $db->query("INSERT INTO GravediggersCemeteries(cemetery, gravedigger)
                                        VALUES ($cemetery, " . $data['gravediggerID'] . ")");
                        }
                    }
                    $cemeteries = substr($cemeteries, 0, -1);
                    $cemeteries .= ')';

                    $db->query("DELETE FROM GravediggersCemeteries
                                WHERE       gravedigger = " . $data['gravediggerID'] . " AND
                                            cemetery NOT IN $cemeteries");
                    return true;
                }else{
                    $db->query("DELETE FROM GravediggersCemeteries
                                WHERE       gravedigger = " . $data['gravediggerID']);
                    
                    return true;
                }
                return true;
            }else{
                return "CIF_ERROR"; 
            }
        }

        /**
        * Comprueba si existe un enterrador con un nif 
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
                                        FROM    Gravediggers g
                                        WHERE   g.nif = '" . $cif . "' AND g.gravediggerID != '" . $id . "' AND g.leavingDate IS NULL");
                                       
            } else{
                $result = $db->query("  SELECT  COUNT(*) as row
                                        FROM    Gravediggers g
                                        WHERE   g.nif = '" . $cif . "' AND g.leavingDate IS NULL");
            }

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return false;
            }else{
                return true;
            }   
        }

        /**
         * Elimina un enterrador
         *
         * @param array $data ID del enterrador
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['gravediggerID'] = cleanStr($data['gravediggerID']);

            return $db->query(" UPDATE  Gravediggers 
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                                WHERE   gravediggerID = " . $data['gravediggerID'] . "");
        }

        /**
         * Obtiene los datos de los enterradores
         *
         * @return array
         */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      g.gravediggerID, g.nif, g.name as gravediggerName, g.surname, 
                                                g.address, g.mail, g.phones, g.leavingDate, l.locationID, 
                                                l.name as locationName, l.postalCode, l.province
                                    FROM        Gravediggers g
                                    LEFT JOIN   Locations l ON g.location = l.locationID
                                    WHERE       g.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Obtiene los datos de la localidad dado un enterrador
         *
         * @param array $data
         * @return array
         */
        public function getLocation($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  l.locationID, l.name
                                    FROM    Gravediggers g, Locations l 
                                    WHERE   g.location = l.locationID AND
                                            g.gravediggerID = " . $data . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los enterrador
        *
        * @return array
        */
        public function listGravediggersDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      g.gravediggerID, g.name, g.surname, l.name, g.mail, g.homePhone, g.mobilePhone, g.otherPhone
                                    FROM        Gravediggers g
                                    LEFT JOIN   Locations l ON g.location = l.locationID
                                    WHERE       g.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
         * Obtiene los datos de un enterrador
         *
         * @param array $data ID del enterrador
         * @return array
         */
        public function listToExport(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      g.gravediggerID, g.name as name, g.surname, g.nif, g.address, l.province, 
                                                g.mail, g.homePhone, g.mobilePhone, g.otherPhone,
                                                l.name as locationName, l.province, l.postalCode
                                    FROM        (Gravediggers g)
                                    LEFT JOIN   Locations l ON g.location = l.locationID
                                    WHERE       g.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                $gravedigger = $db->resultToArray($result);

                $result = $db->query("  SELECT  cp.gravedigger, c.name
                                        FROM    GravediggersCemeteries cp, Cemeteries c
                                        WHERE   cp.cemetery = c.cemeteryID ");

                if(mysqli_num_rows($result) == 0){
                    $result = ["gravedigger" => $gravedigger];
                }else{
                    $gravediggerCemetery = $db->resultToArray($result);
                    $result = [
                        "gravedigger" => $gravedigger,
                        "gravediggerCemetery" => $gravediggerCemetery
                    ];
                }
                return $result;
			}
        }

        /**
         * Crear enterrador 
         *
         * @param array $data ID del enterrador
         * @return array
         */
        public function createImport($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
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

            // Cálculo del extraID
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT    * 
                                    FROM      Gravediggers 
                                    WHERE     extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT    * 
                                        FROM      Gravediggers 
                                        WHERE     extraID = '" . $extraID . "'");
            }

            if(!$this->existsCif($data['nif'])){
                $db->query("INSERT INTO Gravediggers(location, nif, name, surname, address, mail, homePhone, mobilePhone, otherPhone, extraID)
                            VALUES (" . $data['location'] . ", '" . $data['nif'] . "', '" . $data['name'] . "', '" . $data['surname'] . "', 
                                '" . $data['address'] . "', '" . $data['mail'] . "', '" . $data['homePhone'] . "', '" . $data['mobilePhone'] . "',
                                '" . $data['otherPhone'] . "', '$extraID')");

                if(isset($data['cemeteries'])){
                    $result = $db->query("  SELECT  g.gravediggerID
                                            FROM    Gravediggers g
                                            WHERE   g.extraID = '$extraID'");

                    if(mysqli_num_rows($result) > 0){
                        $id = $db->resultToArray($result)[0]['gravediggerID'];

                        foreach($data['cemeteries'] as $cemetery){
                            $cemetery = cleanStr($cemetery);
                            $db->query("INSERT INTO GravediggersCemeteries(gravedigger, cemetery) VALUES ($id, $cemetery)");
                        }
                    }

                    return true;
                }else{
                    return true;
                }
            }else{
                return "Ya existe un enterrador con ese NIF";
            }
        }

        /**
         * Modifica los datos de un enterrador
         *
         * @param array $data Datos del enterrdor
         * @return bool
         */
        public function updateImport($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['mail'] = cleanStr($data['mail']);
            $data['homePhone'] = cleanStr($data['homePhone']);
            $data['mobilePhone'] = cleanStr($data['mobilePhone']);
            $data['otherPhone'] = cleanStr($data['otherPhone']);
            $data['gravediggerID'] = cleanStr($data['gravediggerID']);

            // Validación de campos
            if($data['name'] == ''){
                return "El nombre no puede ser vacío";
            }
            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return "Formato de NIF incorrecto";
                }
            }
            if($data['mail'] != ''){
                if(!checkEmail($data['mail'])){
                    return "Formato del email es incorrecto";
                }
            }
            if($data['homePhone'] != ''){
                if(!checkPhone($data['homePhone'])){
                    return "Formato de teléfono móvil incorrecto";
                }
            }
            if($data['mobilePhone'] != ''){
                if(!checkPhone($data['mobilePhone'])){
                    return "Formato de telefono de casa incorrecto";
                }
            }
            if($data['otherPhone'] != ''){
                if(!checkPhone($data['otherPhone'])){
                    return "Formato de otros telefonos incorrecto";
                }
            }
           
            if(!$this->existsCif($data['nif'], $data['gravediggerID'])){
                $db->query("UPDATE  Gravediggers
                            SET     location = " . $data['location'] . ",
                                    nif = '" . $data['nif'] . "', 
                                    name = '" . $data['name'] . "',
                                    surname = '" . $data['surname'] . "', 
                                    address = '" . $data['address'] . "',
                                    mail = '" . $data['mail'] . "', 
                                    homePhone = '" . $data['homePhone'] . "',
                                    mobilePhone = '" . $data['mobilePhone'] . "',
                                    otherPhone = '" . $data['otherPhone'] . "'
                            WHERE   gravediggerID = " . $data['gravediggerID'] . "");
                
                if(isset($data['cemeteries'])){
                    $cemeteries = '(';
                    foreach($data['cemeteries'] as $cemetery){
                        $cemetery = cleanStr($cemetery);

                        $cemeteries .= $cemetery . ',';

                        $result = $db->query("  SELECT  ID
                                                FROM    GravediggersCemeteries
                                                WHERE   gravedigger = " . $data['gravediggerID'] . " AND
                                                        cemetery = $cemetery");

                        if(mysqli_num_rows($result) == 0){
                            $db->query("INSERT INTO GravediggersCemeteries(cemetery, gravedigger)
                                        VALUES ($cemetery, " . $data['gravediggerID'] . ")");
                        }
                    }
                    $cemeteries = substr($cemeteries, 0, -1);
                    $cemeteries .= ')';

                    $db->query("DELETE FROM GravediggersCemeteries
                                WHERE       gravedigger = " . $data['gravediggerID'] . " AND
                                            cemetery NOT IN $cemeteries");
                    return true;
                }else{
                    $db->query("DELETE FROM GravediggersCemeteries
                                WHERE       gravedigger = " . $data['gravediggerID']);
                    
                    return true;
                }
                return true;
            }else{
                return "Ya existe un enterrador con ese NIF";
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
                                    FROM    Gravediggers p
                                    WHERE   p.gravediggerID = $id AND p.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }

        /**
         * Obtiene el nombre de un enterrador
         *
         * @param array $data ID del enterrador
         * @return array
         */
        public function getGravedigger($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  CONCAT(g.name, ' ', g.surname) as gravedigger
                                    FROM    Gravediggers g
                                    WHERE   g.gravediggerID = $id");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result)[0]['gravedigger'];
			}
        }

        /**
         * Obtiene los enterradores con correo electrónico
         *
         * @param array $data ID del enterrador
         * @return array
         */
        public function getToEmailAddressee($search){
            $db = new DbHandler;

            $result = $db->query("  SELECT  g.gravediggerID as id,
                                            CONCAT(CONCAT(CONCAT(g.name, ' ', g.surname), ' (', g.mail), ')') as text
                                    FROM    Gravediggers g
                                    WHERE   g.mail IS NOT NULL AND g.mail != ''
                                        AND g.leavingDate IS NULL
                                        AND (
                                            g.name LIKE '%". $search ."%' OR 
                                            g.surname LIKE '%". $search ."%' OR 
                                            g.mail LIKE '%". $search ."%'
                                        )");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArray($result);
        }

        /**
        * Obtiene el email de un enterrador
        *
        * @param array $data ID del enterrador
        * @return array
        */
        public function getEmail($id){
            $db = new DbHandler;

            $result = $db->query("  SELECT  g.mail as email
                                    FROM    Gravediggers g
                                    WHERE   g.gravediggerID = " . $id);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>