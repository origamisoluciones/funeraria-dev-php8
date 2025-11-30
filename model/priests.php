<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Priests{
        /**
        * Añade un cura
        *
        * @param array $data
        */
        public function create($data){
            $db = new DbHandler;
          
            $data['location'] = cleanStr($data['location']);
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['area'] = cleanStr($data['area']);
            $data['email'] = cleanStr($data['email']);
            $data['parish'] = cleanStr($data['parish']);
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
            if($data['email'] != ''){
                if(!checkEmail($data['email'])){
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
    
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Priests 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Priests 
                                        WHERE   extraID = '" . $extraID . "'");
            }
            
            if(!$this->existsCif($data['nif'])){
                $db->query("INSERT INTO Priests(location, nif, name, surname, address, area, parish, email, homePhone, mobilePhone, otherPhone, extraID) 
                            VALUES (" . $data['location'] . ", '" . $data['nif'] . "', '" . $data['name'] . "', '" . $data['surname'] . "', 
                                    '" . $data['address'] . "', '" . $data['area'] . "', '" . $data['parish'] . "', '" . $data['email'] . "', 
                                    '" . $data['homePhone'] . "', '" . $data['mobilePhone'] . "', '" . $data['otherPhone'] . "', '$extraID')");

                $priest = $db->query("  SELECT  priestID
                                        FROM    Priests
                                        WHERE   extraID = '$extraID'");

                $priest = $db->resultToArray($priest)[0]['priestID'];

                if(isset($data['churches'])){
                    foreach($data['churches'] as $church){
                        $church = cleanStr($church);
                        $db->query("INSERT INTO ChurchesPriests(church, priest)
                                    VALUES ($church, $priest)");
                    }
                }

                return true;
            }else{
                return "CIF_ERROR";
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
            $data['nif'] = cleanStr($data['nif']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['area'] = cleanStr($data['area']);
            $data['parish'] = cleanStr($data['parish']);
            $data['email'] = cleanStr($data['email']);
            $data['homePhone'] = cleanStr($data['homePhone']);
            $data['mobilePhone'] = cleanStr($data['mobilePhone']);
            $data['otherPhone'] = cleanStr($data['otherPhone']);

            // Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }
            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return "Formato de NIF incorrecto";
                }
            }
            if($data['email'] != ''){
                if(!checkEmail($data['email'])){
                    return "Formato del email incorrecto";
                }
            }
            if($data['homePhone'] != ''){
                if(!checkPhone($data['homePhone'])){
                    return "Formato del teléfono de casa incorrecto";
                }
            }
            if($data['mobilePhone'] != ''){
                if(!checkPhone($data['mobilePhone'])){
                    return "Formato del teléfono móvil incorrecto";
                }
            }
            if($data['otherPhone'] != ''){
                if(!checkPhone($data['otherPhone'])){
                    return "Formato del otro teléfono incorrecto";
                }
            }
    
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Priests 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Priests 
                                        WHERE   extraID = '" . $extraID . "'");
            }
            
            if(!$this->existsCif($data['nif'])){
                $db->query("INSERT INTO Priests(location, nif, name, surname, address, area, parish, email, homePhone, mobilePhone, otherPhone, extraID) 
                            VALUES (" . $data['location'] . ", '" . $data['nif'] . "', 
                                    '" . $data['name'] . "', '" . $data['surname'] . "', 
                                    '" . $data['address'] . "', '" . $data['area'] . "', 
                                    '" . $data['parish'] . "', '" . $data['email'] . "',
                                    '" . $data['homePhone'] . "', '" . $data['mobilePhone'] . "', '" . $data['otherPhone'] . "',
                                    '$extraID')");

                $priest = $db->query("  SELECT  priestID
                                        FROM    Priests
                                        WHERE   extraID = '$extraID'");

                $priest = $db->resultToArray($priest)[0]['priestID'];

                if(isset($data['churches'])){
                    foreach($data['churches'] as $church){
                        $church = cleanStr($church);
                        $db->query("INSERT INTO ChurchesPriests(church, priest)
                                    VALUES ($church, $priest)");
                    }
                }

                return true;
            }else{
                return "Ya existe un cura con ese NIF";
            }
        }

        /**
         * Obtiene los datos de un cura
         *
         * @param array $data ID del cura
         * @return array
         */
        public function read($data){
            $db = new DbHandler;

            $data['priestID'] = cleanStr($data['priestID']);

            $result = $db->query("  SELECT      p.priestID, p.name as priestName, p.surname, p.address, p.nif, 
                                                l.locationID, l.name as locationName, l.postalCode, l.province,
                                                p.area, p.parish, p.email, p.homePhone, p.mobilePhone, p.otherPhone,
                                                p.leavingDate
                                    FROM        (Priests p)
                                    LEFT JOIN   Locations l ON p.location = l.locationID
                                    WHERE       priestID = " . $data['priestID'] . "");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                $priest = $db->resultToArray($result)[0];

                $result = $db->query("  SELECT  cp.church, c.name
                                        FROM    ChurchesPriests cp, Churches c
                                        WHERE   cp.church = c.churchID AND
                                                cp.priest = " . $priest['priestID']);

                if(mysqli_num_rows($result) == 0){
                    return array($priest, null);
                }else{
                    return array($priest, $db->resultToArray($result));
                }
			}
        }

        /**
         * Modifica los datos de un cura
         *
         * @param array $data
         */
        public function update($data){
            $db = new DbHandler;

            $data['location'] = cleanStr($data['location']);
            $data['name'] = cleanStr($data['name']);
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['nif'] = cleanStr($data['nif']);
            $data['area'] = cleanStr($data['area']);
            $data['parish'] = cleanStr($data['parish']);
            $data['homePhone'] = cleanStr($data['homePhone']);
            $data['email'] = cleanStr($data['email']);
            $data['mobilePhone'] = cleanStr($data['mobilePhone']);
            $data['otherPhone'] = cleanStr($data['otherPhone']);
            $data['priestID'] = cleanStr($data['priestID']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }
            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return false;
                }
            }
            if($data['email'] != ''){
                if(!checkEmail($data['email'])){
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

            if(!$this->existsCif($data['nif'], $data['priestID'])){
                $db->query("UPDATE  Priests
                            SET     location = " . $data['location'] . ",
                                    name = '" . $data['name'] . "',
                                    surname = '" . $data['surname'] . "', 
                                    address = '" . $data['address'] . "',
                                    nif = '" . $data['nif'] . "', 
                                    area = '" . $data['area'] . "',
                                    parish = '" . $data['parish'] . "',
                                    email = '" . $data['email'] . "',
                                    homePhone = '" . $data['homePhone'] . "',
                                    mobilePhone = '" . $data['mobilePhone'] . "',
                                    otherPhone = '" . $data['otherPhone'] . "'
                            WHERE   priestID = " . $data['priestID'] . "");

                if(isset($data['churches'])){
                    $churches = '(';
                    foreach($data['churches'] as $church){
                        $church = cleanStr($church);
                        $churches .= $church . ',';

                        $result = $db->query("  SELECT  ID
                                                FROM    ChurchesPriests
                                                WHERE   priest = " . $data['priestID'] . " AND
                                                        church = $church");

                        if(mysqli_num_rows($result) == 0){
                            $db->query("INSERT INTO ChurchesPriests(church, priest)
                                        VALUES ($church, " . $data['priestID'] . ")");
                        }
                    }
                    $churches = substr($churches, 0, -1);
                    $churches .= ')';

                    $db->query("DELETE FROM ChurchesPriests WHERE priest = " . $data['priestID'] . " AND church NOT IN $churches");
                }else{
                    $db->query("DELETE FROM ChurchesPriests WHERE priest = " . $data['priestID']);
                }

                return true;
            }else{
                return "CIF_ERROR";
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
            $data['surname'] = cleanStr($data['surname']);
            $data['address'] = cleanStr($data['address']);
            $data['nif'] = cleanStr($data['nif']);
            $data['area'] = cleanStr($data['area']);
            $data['parish'] = cleanStr($data['parish']);
            $data['email'] = cleanStr($data['email']);
            $data['homePhone'] = cleanStr($data['homePhone']);
            $data['mobilePhone'] = cleanStr($data['mobilePhone']);
            $data['otherPhone'] = cleanStr($data['otherPhone']);
            $data['priestID'] = cleanStr($data['priestID']);

            // Validación de campos
            if($data['name'] == ''){
                return "Nombre no puede ser vacío";
            }
            if($data['nif'] != ''){
                if(!isValidIdNumber($data['nif'])){
                    return "Formato de NIF incorrecto";
                }
            }
            if($data['email'] != ''){
                if(!checkEmail($data['email'])){
                    return "Formato del email incorrecto";
                }
            }
            if($data['homePhone'] != ''){
                if(!checkPhone($data['homePhone'])){
                    return "Formato del teléfono de casa incorrecto";
                }
            }
            if($data['mobilePhone'] != ''){
                if(!checkPhone($data['mobilePhone'])){
                     return "Formato del teléfono móvil incorrecto";
                }
            }
            if($data['otherPhone'] != ''){
                if(!checkPhone($data['otherPhone'])){
                    return "Formato del otro teléfono incorrecto";
                }
            }

            if(!$this->existsCif($data['nif'], $data['priestID'])){
                $db->query("UPDATE  Priests
                            SET     location = " . $data['location'] . ",
                                    name = '" . $data['name'] . "',
                                    surname = '" . $data['surname'] . "', 
                                    address = '" . $data['address'] . "',
                                    nif = '" . $data['nif'] . "', 
                                    area = '" . $data['area'] . "',
                                    parish = '" . $data['parish'] . "',
                                    email = '" . $data['email'] . "',
                                    homePhone = '" . $data['homePhone'] . "',
                                    mobilePhone = '" . $data['mobilePhone'] . "',
                                    otherPhone = '" . $data['otherPhone'] . "'
                            WHERE   priestID = " . $data['priestID'] . "");

                if(isset($data['churches'])){
                    $churches = '(';
                    foreach($data['churches'] as $church){
                        $church = cleanStr($church);
                        $churches .= $church . ',';

                        $result = $db->query("  SELECT  ID
                                                FROM    ChurchesPriests
                                                WHERE   priest = " . $data['priestID'] . " AND
                                                        church = $church");

                        if(mysqli_num_rows($result) == 0){
                            $db->query("INSERT INTO ChurchesPriests(church, priest)
                                        VALUES ($church, " . $data['priestID'] . ")");
                        }
                    }
                    $churches = substr($churches, 0, -1);
                    $churches .= ')';

                    $db->query("DELETE FROM ChurchesPriests WHERE priest = " . $data['priestID'] . " AND church NOT IN $churches");
                }else{
                    $db->query("DELETE FROM ChurchesPriests WHERE priest = " . $data['priestID']);
                }

                return true;
            }else{
                return "Ya existe un cura con ese NIF";
            }
        }

        /**
        * Comprueba si existe un cura  con un nif dado
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
                $result = $db->query("  SELECT  COUNT(*) as row
                                        FROM    Priests p
                                        WHERE   p.nif = '" . $cif . "' AND p.priestID != $id AND p.leavingDate IS NULL");
            }else{
                $result = $db->query("  SELECT  COUNT(*) as row
                                        FROM    Priests p
                                        WHERE   p.nif = '" . $cif . "' AND p.leavingDate IS NULL");
            }

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return false;
            }else{
                return true;
            }   
        }

        /**
        * Elimina un cura
        *
        * @param array $data
        */
        public function delete($data){
            $db = new DbHandler;

            $data['priestID'] = cleanStr($data['priestID']);

            return $db->query(" UPDATE  Priests
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                                WHERE   priestID = " . $data['priestID'] . "");
        }

        /**
        * Obtiene los datos de los curas
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      p.priestID, p.nif, p.name, p.surname, p.address, p.phones, p.church, p.email,
                                                p.leavingDate, l.locationID, l.name, l.postalCode, l.province
                                    FROM        Priests p
                                    LEFT JOIN   Locations l ON p.location = l.locationID");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de la localidad dado un cura
        *
        * @param array $data
        * 
        * @return array
        */
        public function getLocation($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  l.locationID, l.name
                                    FROM    Priests p, Locations l 
                                    WHERE   p.location = l.locationID AND
                                            p.priestID = " . $data . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los curas por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT      p.priestID, CONCAT(p.name, ' ', p.surname) as name
                                    FROM        Priests p
                                    WHERE       p.leavingDate IS NULL AND 
                                                (p.name LIKE '%". $name ."%' OR p.surname LIKE '%". $name ."%')
                                    ORDER BY    name");
            
            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los datos de un cura
         *
         * @param array $data ID del cura
         * @return array
         */
        public function listToExport(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      p.priestID, p.name as name, p.surname, p.nif, p.address,
                                                p.area, p.parish, p.email, p.homePhone, p.mobilePhone, p.otherPhone,
                                                l.province, l.name as locationName, l.postalCode
                                    FROM        (Priests p)
                                    LEFT JOIN   Locations l ON p.location = l.locationID
                                    WHERE       p.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                $priest = $db->resultToArray($result);

                $result = $db->query("  SELECT  cp.priest, c.name
                                        FROM    ChurchesPriests cp, Churches c
                                        WHERE   cp.church = c.churchID ");

                if(mysqli_num_rows($result) == 0){
                    $result = ["priest" => $priest];
                }else{
                    $priestChurch = $db->resultToArray($result);
                    $result = ["priest" => $priest,
                                "priestChurch" => $priestChurch
                            ];
                }
                return $result;
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
                                    FROM    Priests p
                                    WHERE   p.priestID = $id AND p.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }

        /**
        * Obtiene los curas
        *
        * @return array
        */
        public function listPriestsDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      p.priestID, p.name, l.name, p.area, p.parish, p.homePhone, p.mobilePhone, p.otherPhone, p.email, 'phones-field',
                                                IF(
                                                    (
                                                        SELECT  GROUP_CONCAT(c.name SEPARATOR ', ')
                                                        FROM    ChurchesPriests chuPrie, Churches c
                                                        WHERE   chuPrie.church = c.churchID AND
                                                                chuPrie.priest = p.priestID
                                                    ) IS NULL,
                                                    '-',
                                                    (
                                                        SELECT  GROUP_CONCAT(c.name SEPARATOR ', ')
                                                        FROM    ChurchesPriests chuPrie, Churches c
                                                        WHERE   chuPrie.church = c.churchID AND
                                                                chuPrie.priest = p.priestID
                                                    )
                                                )
                                    FROM        Priests p
                                    LEFT JOIN   Locations l ON p.location = l.locationID
                                    WHERE       p.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
        * Obtiene el cura por id
        *
        * @return array
        */
        public function getPriest($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  p.name
                                    FROM    Priests p
                                    WHERE   p.priestID = $id");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result)[0]['name'];
			}
        }

        /**
         * Obtiene los curas con correo electrónico
         *
         * @param array $data ID del campanero
         * @return array
         */
        public function getToEmailAddressee($search){
            $db = new DbHandler;

            $result = $db->query("  SELECT  p.priestID as id,
                                            CONCAT(p.name, ' (', p.email, ')') as text
                                    FROM    Priests p
                                    WHERE   p.email IS NOT NULL AND p.email != ''
                                        AND p.leavingDate IS NULL
                                        AND (
                                            p.name LIKE '%". $search ."%' OR 
                                            p.surname LIKE '%". $search ."%' OR 
                                            p.email LIKE '%". $search ."%'
                                        )");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArray($result);
        }

        /**
        * Obtiene el email de un cura
        *
        * @param array $data ID del cura
        * @return array
        */
        public function getEmail($id){
            $db = new DbHandler;

            $result = $db->query("  SELECT  p.email
                                    FROM    Priests p
                                    WHERE   p.priestID = " . $id);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>