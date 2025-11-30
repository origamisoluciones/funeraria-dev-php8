<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");
    require_once($_SESSION['basePath'] . "core/tools/utils.php");

    class Obituaries{
        /**
         * Obtiene los difuntos y sus esquelas desde dos días antes hasta el día actual
         * 
         * @param object $data Data
         */
        public function getDeceased($data){
            $db = new DbHandler(true);

            $where = '';

            $deceasedName = $data->deceasedName;
            $deceasedSurname = $data->deceasedSurname;
            $deceasedMortuary = $data->deceasedMortuary;

            if($deceasedMortuary != '0' && $deceasedMortuary != ''){
                $where .= " AND e.deceasedMortuary = $deceasedMortuary";
            }

            // Current time less 2 hours
            $currentTime = time() - 2 * 60 * 60;
            // Current time less 2 days
            $currentTime = time() - 2 * 24 * 60 * 60;

            $result = $db->query("  SELECT      e.expedientID, e.deceasedName, e.deceasedSurname, e.deceasedBirthday, e.deceasedDate, e.deceasedRoom,
                                                e.funeralDate, e.funeralTime, e.deceasedMortuaryAddress, e.ceremonyDate, e.ceremonyTime,
                                                m.name as mortuary
                                    FROM        Expedients e, Expedients_Services es, Mortuaries m
                                    WHERE       e.leavingDate IS NULL AND
                                                e.expedientID = es.expedient AND
                                                es.webLink IS NOT NULL AND
                                                e.deceasedMortuary = m.mortuaryID AND
                                                e.deceasedName LIKE '%$deceasedName%' AND
                                                e.deceasedSurname LIKE '%$deceasedSurname%' AND
                                                UNIX_TIMESTAMP(CONCAT(e.ceremonyDate, ' ', e.ceremonyTime)) > $currentTime AND
                                                e.funeralDate IS NOT NULL AND e.funeralTime IS NOT NULL AND
                                                e.ceremonyDate IS NOT NULL AND e.ceremonyTime IS NOT NULL
                                                $where
                                    ORDER BY    m.name ASC, e.requestDate DESC");

            if(mysqli_num_rows($result) == 0){
                return array();
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Obtiene los difuntos y sus esquelas desde dos días antes hasta el día actual
         * 
         * @param object $data Data
         */
        public function getDeceasedSearch($data){
            $db = new DbHandler(true);

            $where = '';

            $deceasedName = $data->deceasedName;
            $deceasedSurname = $data->deceasedSurname;
            $deceasedMortuary = $data->deceasedMortuary;

            if($deceasedMortuary != '0' && $deceasedMortuary != ''){
                $where .= " AND e.deceasedMortuary = $deceasedMortuary";
            }

            // Current time less 4 hours
            $result = $db->query("  SELECT      e.expedientID, e.deceasedName, e.deceasedSurname, e.deceasedBirthday, e.deceasedDate, e.deceasedRoom,
                                                e.funeralDate, e.funeralTime, e.deceasedMortuaryAddress, e.ceremonyDate, e.ceremonyTime,
                                                m.name as mortuary
                                    FROM        Expedients e, Expedients_Services es, Mortuaries m
                                    WHERE       e.leavingDate IS NULL AND
                                                e.expedientID = es.expedient AND
                                                es.webLink IS NOT NULL AND
                                                e.deceasedMortuary = m.mortuaryID AND
                                                e.deceasedName LIKE '%$deceasedName%' AND
                                                e.deceasedSurname LIKE '%$deceasedSurname%' AND
                                                e.funeralDate IS NOT NULL AND e.funeralTime IS NOT NULL AND
                                                e.ceremonyDate IS NOT NULL AND e.ceremonyTime IS NOT NULL
                                                $where
                                    ORDER BY    m.name ASC, e.requestDate DESC");

            if(mysqli_num_rows($result) == 0){
                return array();
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Obtiene los difuntos y sus esquelas desde dos días antes hasta el día actual
         * 
         * @param object $data Data
         */
        public function getDeceasedInfo($data){
            $utils = new Utils;
            $db = new DbHandler(true);

            $expedient = $data->expedient;

            $result = $db->query("  SELECT      e.expedientID, e.deceasedName, e.deceasedSurname, e.deceasedDate, e.deceasedBirthday, e.deceasedRoom,
                                                e.funeralDate, e.funeralTime, e.ceremonyDate, e.ceremonyTime, e.startVelacionTime,
                                                e.churchLabel, e.otherCeremony, c.name as church, c.latitude as churchLatitude, c.longitude as churchLongitude,
                                                e.cemeteryLabel, e.otherInhumation, ce.name as cemetery, ce.latitude as cemeteryLatitude, ce.longitude as cemeteryLongitude,
                                                m.name as mortuary, l3.name as mortuaryLocation, m.latitude, m.longitude,
                                                l.name as deceasedBirthdayLocation,
                                                l2.name as deceasedLocation,
                                                e.crematorium
                                    FROM        (Expedients e)
                                    LEFT JOIN   Mortuaries m ON e.deceasedMortuary = m.mortuaryID
                                    LEFT JOIN   Locations l ON e.deceasedBirthdayLocation = l.locationID
                                    LEFT JOIN   DeceasedIn di ON e.deceasedLocation = di.deceasedInID
                                    LEFT JOIN   Locations l2 ON di.location = l2.locationID
                                    LEFT JOIN   Locations l3 ON m.location = l3.locationID
                                    LEFT JOIN   Churches c ON e.church = c.churchID
                                    LEFT JOIN   Cemeteries ce ON e.cemetery = ce.cemeteryID
                                    LEFT JOIN   Crematoriums cr ON e.crematorium = cr.crematoriumID
                                    WHERE       e.expedientID = $expedient AND
                                                e.leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
                return array();
            }else{
                $deceased = $db->resultToArray($result);

                $host = $utils->getRoute();

                foreach($deceased as $index => $elem){
                    $deceased[$index]['obituary'] = array();
                    
                    $expedientID = $elem['expedientID'];

                    $dir = $_SESSION['basePath'] . "resources/files/1/expedients/$expedientID/obituary";
                    if(is_dir($dir)){
                        $dirList = scandir($dir);
                        array_shift($dirList);
                        array_shift($dirList);
                        
                        $result = $db->query("  SELECT  eo.type, eo.model
                                                FROM    Expedients_Obituaries eo
                                                WHERE   eo.expedient = $expedient AND
                                                        eo.selected = 1");

                        if(mysqli_num_rows($result) > 0){
                            $result = $db->resultToArray($result)[0];

                            $type = $result['type'];
                            $model = $result['model'];

                            if(file_exists($_SESSION['basePath'] . "resources/files/1/expedients/$expedientID/obituary/$type/$model/files/img.png")){
                                array_push($deceased[$index]['obituary'], "{$host}resources/files/1/expedients/$expedientID/obituary/$type/$model/files/img.png");
                            }
                        }
                    }
                }
                return $deceased;
            }
        }

        /**
         * Obtiene los datos del difunto
         * 
         * @param object $data Data
         */
        public function getDeceasedHeaderInfo($data){
            $db = new DbHandler(true);

            $expedient = $data->expedient;

            $result = $db->query("  SELECT      e.deceasedName, e.deceasedSurname, e.deceasedBirthday, e.funeralDate, e.deceasedRoom,
                                                l.name as deceasedBirthdayLocation,
                                                l3.name as mortuaryLocation,
                                                m.name as mortuary
                                    FROM        (Expedients e)
                                    LEFT JOIN   Mortuaries m ON e.deceasedMortuary = m.mortuaryID
                                    LEFT JOIN   Locations l ON e.deceasedBirthdayLocation = l.locationID
                                    LEFT JOIN   Locations l3 ON m.location = l3.locationID
                                    WHERE       e.expedientID = $expedient AND
                                                e.leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
                return array();
            }else{
                return $db->resultToArray($result)[0];
            }
        }

        /**
         * Obtiene los datos del difunto
         * 
         * @param object $data Data
         */
        public function getDeceasedName($data){
            $db = new DbHandler(true);

            $expedient = $data->expedient;

            $result = $db->query("  SELECT  e.deceasedName, e.deceasedSurname
                                    FROM    Expedients e
                                    WHERE   e.expedientID = $expedient AND
                                            e.leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
                return array();
            }else{
                return $db->resultToArray($result)[0];
            }
        }

        /**
         * Obtiene los datos del difunto
         * 
         * @param object $data Data
         */
        public function getDeceasedDate($data){
            $db = new DbHandler(true);

            $deceasedName = $data->deceasedName;
            $deceasedSurname = $data->deceasedSurname;

            $result = $db->query("  SELECT  e.funeralDate, e.funeralTime
                                    FROM    Expedients e
                                    WHERE   e.deceasedName LIKE '%$deceasedName%' AND
                                            e.deceasedSurname LIKE '%$deceasedSurname%' AND
                                            e.leavingDate IS NULL AND
                                            e.type = 1");

            if(mysqli_num_rows($result) == 0){
                return array();
            }else{
                return $db->resultToArray($result)[0];
            }
        }

        // PLANTILLAS
        /**
         * Obtiene los datos de una plantilla
         * 
         * @param int $id ID de la plantilla
         * @return array|null
         */
        public function readTemplate($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  *
                                    FROM    Obituaries_Templates ot
                                    WHERE   ot.ID = $id");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Modifica los datos de una plantilla
         * 
         * @param array $data
         * @return bool
         */
        public function updateTemplate($data){
            $db = new DbHandler;

            $info = json_decode($data['data']);

            $id = $info->id;
            $name = $info->name;
            $description = $info->description;
            $order = $info->order;
            $deceased = $info->deceased;

            $id = cleanStr($id);
            $name = cleanStr($name);
            $description = cleanStr($description);
            $order = cleanStr($order);
            $deceased = cleanStr($deceased);

            $db->query("UPDATE  Obituaries_Templates ot
                        SET     ot.name = '$name',
                                ot.description = '$description',
                                ot.order = $order,
                                ot.deceased = $deceased
                        WHERE   ot.ID = $id");

            $file = $_FILES;
            if($file != null){
                if(count($file) > 0){
                    $file = $file['file'];

                    if(!is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/obituariesTemplate/$id/")){
                        @mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/obituariesTemplate/$id/", 0777);
                    }

                    $extension = explode('.', $file['name']);
                    $extension = $extension[count($extension) - 1];
    
                    if(move_uploaded_file($file['tmp_name'], $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/obituariesTemplate/$id/image." . $extension)){
                        $db->query("UPDATE  Obituaries_Templates ot
                                    SET     ot.image = '" . $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/obituariesTemplate/$id/image." . $extension . "'
                                    WHERE   ot.ID = $id");
                    }
                }
            }

            return true;
        }

        /**
         * Obtiene los tipos de plantillas de esquelas
         *
         * @return array|null
         */
        public function getTypes(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  ot.ID, ot.name
                                    FROM    Obituaries_Templates ot");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Comprueba si una plantilla de esquela tiene imagen de difunto
         *
         * @param int $id Id de la plantilla
         * @return bool
         */
        public function hasDeceasedImage($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  ot.deceased
                                    FROM    Obituaries_Templates ot
                                    WHERE   ot.ID = $id");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                return $db->resultToArray($result)[0]['deceased'] == 0 ? false : true;
            }
        }

        /**
         * Sube la imagen del difunto
         *
         * @param array $data Datos
         * @return bool
         */
        public function uploadDeceasedImage($data){
            $data['expedient'] = cleanStr($data['expedient']);

            $expedient = $data['expedient'];
            
            $file = $_FILES;
            if($file != null){
                if(count($file) > 0){
                    $file = $_FILES['file'];

                    if(!is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/deceased/")){
                        @mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/deceased/", 0777);
                    }
        
                    $extension = explode('.', $file['name']);
                    $extension = $extension[count($extension) - 1];
        
                    return move_uploaded_file($file['tmp_name'], $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/deceased/image." . $extension) ? true : false;
                }
            }else{
                return false;
            }
        }

        /**
         * Obtiene la información de la esquela
         *
         * @param int $obituaryID Esquela
         * @param int $type Tipo
         * @return array
         */
        public function getDataObituary($obituaryID, $type){
            $db = new DbHandler;

            $obituaryID = cleanStr($obituaryID);
            $type = cleanStr($type);

            $result = $db->query("  SELECT  o.*
                                    FROM    Expedients_Obituaries o
                                    WHERE   o.expedient = $obituaryID AND
                                            o.type = $type");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                return $db->resultToArray($result)[0];
            }
        }

        /**
         * Obtiene los tipos y los modelos de esquela registrados para el expediente
         *
         * @param int $expedient Expediente
         * @return array
         */
        public function getTypeModelExpedient($expedient){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);
            $result = $db->query("  SELECT  DISTINCT o.type, o.model
                                    FROM    Expedients_Obituaries o
                                    WHERE   o.expedient = $expedient AND
                                            o.selected = 1");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                return $db->resultToArray($result);
            }
        }
    }
?>