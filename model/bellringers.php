<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class BellRingers{
        /**
         * Añade un nuevo campanero
         * 
         * @param array $data Datos del campanero
         * @return bool
         */
        public function create($data){
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

            $location = $data['location'] == '' ? 'null' : $data['location'];
            $nif = $data['nif'];
            $name = $data['name'];
            $surname = $data['surname'];
            $address = $data['address'];
            $area = $data['area'];
            $parish = $data['parish'];
            $homePhone = $data['homePhone'];
            $email = $data['email'];
            $mobilePhone = $data['mobilePhone'];
            $otherPhone = $data['otherPhone'];

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    BellRingers 
                                    WHERE   extraID = '" . $extraID . "'");
       
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    BellRingers 
                                        WHERE   extraID = '" . $extraID . "'");
            }

            if(!$this->existsCif($nif)){

                $db->query("INSERT INTO BellRingers(location, nif, name, surname, address, area, parish, email, homePhone, mobilePhone, otherPhone, extraID)
                            VALUES ($location, '$nif', '$name', '$surname', '$address', '$area', '$parish', '$email', '$homePhone', '$mobilePhone', '$otherPhone', '$extraID')");
                
                $result = $db->query("  SELECT  b.ID
                                        FROM    BellRingers b
                                        WHERE   b.extraID = '$extraID'");

                if(mysqli_num_rows($result) > 0){
                    $id = $db->resultToArray($result)[0]['ID'];

                    if(isset($data['churches'])){
                        foreach($data['churches'] as $church){
                            $church = cleanStr($church);
                            $db->query("INSERT INTO ChurchesBellringers(church, bellringer)
                                        VALUES ($church, $id)");
                        }
                    }
                }else{
                    return false;
                }

                return true;
            }else{
                return "CIF_ERROR";
            }
        }

        /**
         * Obtiene los datos de un campanero
         * 
         * @param array $data ID del campanero
         * @return array
         */
        public function read($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT      b.*,
                                                l.locationID, l.name as locationName, l.postalCode, l.province
                                    FROM        (BellRingers b)
                                    LEFT JOIN   Locations l ON b.location = l.locationID
                                    WHERE       b.ID = " . $data['ID']);

            if(mysqli_num_rows($result) > 0){
                $bellringer = $db->resultToArray($result)[0];

                $result = $db->query("  SELECT  c.churchID, c.name
                                        FROM    ChurchesBellringers cb, Churches c
                                        WHERE   cb.church = c.churchID AND
                                                cb.bellringer = " . $data['ID']);

                if(mysqli_num_rows($result) == 0){
                    return array($bellringer, null);
                }else{
                    return array($bellringer, $db->resultToArray($result));
                }
            }else{
                return null;
            }
        }

        /**
         * Modifica los datos de un campanero
         * 
         * @param array $data Datos del campanero
         * @return bool
         */
        public function update($data){
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
            $data['ID'] = cleanStr($data['ID']);

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

            $location = $data['location'] == '' ? 'null' : $data['location'];
            $nif = $data['nif'];
            $name = $data['name'];
            $surname = $data['surname'];
            $address = $data['address'];
            $area = $data['area'];
            $parish = $data['parish'];
            $email = $data['email'];
            $homePhone = $data['homePhone'];
            $mobilePhone = $data['mobilePhone'];
            $otherPhone = $data['otherPhone'];

            if(!$this->existsCif($nif, $data['ID'])){
                $db->query("UPDATE  BellRingers
                            SET     location = $location,
                                    nif = '$nif',
                                    name = '$name',
                                    surname = '$surname',
                                    address = '$address',
                                    area = '$area',
                                    parish = '$parish',
                                    email = '$email',
                                    homePhone = '$homePhone',
                                    mobilePhone = '$mobilePhone',
                                    otherPhone = '$otherPhone'
                            WHERE   ID = " . $data['ID']);

                if(isset($data['churches'])){
                    $churches = '(';
                    foreach($data['churches'] as $church){
                        $church = cleanStr($church);
                        $churches .= $church . ',';

                        $result = $db->query("  SELECT  ID
                                                FROM    ChurchesBellringers
                                                WHERE   bellringer = " . $data['ID'] . " AND
                                                        church = $church");

                        if(mysqli_num_rows($result) == 0){
                            $db->query("INSERT INTO ChurchesBellringers(church, bellringer)
                                        VALUES ($church, " . $data['ID'] . ")");
                        }
                    }
                    $churches = substr($churches, 0, -1);
                    $churches .= ')';

                    $db->query("DELETE FROM ChurchesBellringers WHERE bellringer = " . $data['ID'] . " AND church NOT IN $churches");
                }else{
                    $db->query("DELETE FROM ChurchesBellringers WHERE bellringer = " . $data['ID']);
                }
                return true;
            }else{
                return "CIF_ERROR";
            }
        }

        /**
        * Comprueba si existe un campanero con un nif dado
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
                                        FROM      BellRingers b
                                        WHERE     b.nif = '" . $cif . "' AND b.ID != '" . $id . "' AND b.leavingDate IS NULL");
            } else{
                $result = $db->query("SELECT   COUNT(*) as row
                                        FROM      BellRingers b
                                        WHERE     b.nif = '" . $cif . "' AND b.leavingDate IS NULL");
            }

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return false;
            }else{
                return true;
            }   
        }

        /**
         * Elimina un campanero
         * 
         * @param array $data ID del campanero
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  BellRingers
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
        * Obtiene los campaneros
        *
        * @return array
        */
        public function listBellRingersDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  ID, name, surname, parish, email, mobilePhone
                                    FROM    BellRingers
                                    WHERE   leavingDate IS NULL");
            
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

            $result = $db->query("  SELECT      b.ID, b.name as name, b.surname, b.nif, b.address,
                                                l.province, l.postalCode, l.name as locationName,
                                                b.area, b.parish, b.email, b.homePhone, b.mobilePhone, b.otherPhone
                                    FROM        (BellRingers b)
                                    LEFT JOIN   Locations l ON b.location = l.locationID
                                    WHERE       b.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                $bellringer = $db->resultToArray($result);

                $result = $db->query("  SELECT  cb.bellringer, c.name
                                        FROM    ChurchesBellringers cb, Churches c
                                        WHERE   cb.church = c.churchID ");

                if(mysqli_num_rows($result) == 0){
                    $result = ["bellringer" => $bellringer];
                }else{
                    $bellringerChurch = $db->resultToArray($result);
                    $result = [
                        "bellringer" => $bellringer,
                        "bellringerChurch" => $bellringerChurch
                    ];
                }
                return $result;
			}
        }

        /**
        * Comprueba si existe un campanero con un nif dado
        *
        * @param array $cif
        *
        * @return array
        */
        public function isDelete($id){
            $db = new DbHandler;

            $id = cleanStr($id);
            $result = $db->query("  SELECT  COUNT(*) as row
                                    FROM    BellRingers b
                                    WHERE   b.ID = $id AND b.leavingDate IS NULL");

            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return true;
            }else{
                return false;
            }   
        }

        /**
        * Añade un campanero
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
                                    FROM    BellRingers 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    BellRingers 
                                        WHERE   extraID = '" . $extraID . "'");
            }
            
            if(!$this->existsCif($data['nif'])){
                $db->query("INSERT INTO BellRingers(location, nif, name, surname, address, area, parish, email, homePhone, mobilePhone, otherPhone, extraID) 
                            VALUES (" . $data['location'] . ", '" . $data['nif'] . "', 
                                    '" . $data['name'] . "', '" . $data['surname'] . "', 
                                    '" . $data['address'] . "', '" . $data['area'] . "', 
                                    '" . $data['parish'] . "', '" . $data['email'] . "', 
                                    '" . $data['homePhone'] . "', '" . $data['mobilePhone'] . "', 
                                    '" . $data['otherPhone'] . "',
                                    '$extraID')");

                $bellringer = $db->query("  SELECT  ID
                                            FROM    BellRingers
                                            WHERE   extraID = '$extraID'");

                $bellringer = $db->resultToArray($bellringer)[0]['ID'];

                if(isset($data['churches'])){
                    foreach($data['churches'] as $church){
                        $church = cleanStr($church);
                        $db->query("INSERT INTO ChurchesBellringers(church, bellringer)
                                    VALUES ($church, $bellringer)");
                    }
                }

                return true;
            }else{
                return "Ya existe un cura con ese NIF";
            }
        }

        /**
         * Modifica los datos de un campanero
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
            $data['ID'] = cleanStr($data['ID']);

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

            if(!$this->existsCif($data['nif'], $data['ID'])){
                $db->query("UPDATE  BellRingers
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
                            WHERE   ID = " . $data['ID'] . "");

                if(isset($data['churches']) && count($data['churches']) > 0){
                    $churches = '(';
                    foreach($data['churches'] as $church){
                        $church = cleanStr($church);
                        $churches .= $church . ',';

                        $result = $db->query("  SELECT  ID
                                                FROM    ChurchesBellringers
                                                WHERE   bellringer = " . $data['ID'] . " AND
                                                        church = $church");

                        if(mysqli_num_rows($result) == 0){
                            $db->query("INSERT INTO ChurchesBellringers(church, bellringer)
                                        VALUES ($church, " . $data['ID'] . ")");
                        }
                    }
                    $churches = substr($churches, 0, -1);
                    $churches .= ')';

                    $db->query("DELETE FROM ChurchesBellringers WHERE bellringer = " . $data['ID'] . " AND church NOT IN $churches");
                }else{
                    $db->query("DELETE FROM ChurchesBellringers WHERE bellringer = " . $data['ID']);
                }

                return true;
            }else{
                return "Ya existe un cura con ese NIF";
            }
        }

        /**
         * Obtiene los campaneros con correo electrónico
         *
         * @param array $data ID del campanero
         * @return array
         */
        public function getToEmailAddressee($search){
            $db = new DbHandler;

            $result = $db->query("  SELECT  b.ID as id,
                                            CONCAT(CONCAT(CONCAT(b.name, ' ', b.surname), ' (', b.email), ')') as text
                                    FROM    BellRingers b
                                    WHERE   b.email IS NOT NULL AND b.email != ''
                                        AND b.leavingDate IS NULL
                                        AND (
                                            b.name LIKE '%". $search ."%' OR 
                                            b.surname LIKE '%". $search ."%' OR 
                                            b.email LIKE '%". $search ."%'
                                        )");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArray($result);
        }

        /**
         * Obtiene el email de un campanero
         *
         * @param array $data ID del campanero
         * @return array
         */
        public function getEmail($id){
            $db = new DbHandler;

            $result = $db->query("  SELECT  b.email
                                    FROM    BellRingers b
                                    WHERE   b.ID = " . $id);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>