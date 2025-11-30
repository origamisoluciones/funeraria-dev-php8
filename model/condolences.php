<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");
    require_once($_SESSION['basePath'] . "core/tools/utils.php");

    class Condolences{
        /**
         * Añade un nuevo pésame
         * 
         * @param object $data Datos del pésame
         * @return bool
         */
        public function create($data){
            $utils = new Utils;
            $db = new DbHandler(true);

            $expedient = $data->expedient;
            $name = $data->name;
            $phone = $data->phone;
            $address = $data->address;
            $city = $data->city;
            $condolence = $data->condolence;
            $date = time();
            
            $expedient = cleanStr($expedient);
            $name = cleanStr($name);
            $phone = cleanStr($phone);
            $address = cleanStr($address);
            $city = cleanStr($city);
            $condolence = cleanStr($condolence);
            $condolence = str_replace('~~', '\n', $condolence);
            $condolence = str_replace('~', '\n', $condolence);

            if(count($_FILES) == 0){
                $doc = '';
            }else{
                $doc = $_FILES['file']['name'];
            }

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Condolences 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Condolences 
                                        WHERE   extraID = '" . $extraID . "'");
            }

            $file = fopen($_SESSION['basePath'] . 'test/prueba/condolences.txt', 'w');

            fwrite($file, " INSERT INTO Condolences(expedient, name, phone, address, city, condolence, date, extraID)
                            VALUES ($expedient, '$name', '$phone', '$address', '$city', '$condolence', $date, '$extraID')");

            fclose($file);

            $db->query("INSERT INTO Condolences(expedient, name, phone, address, city, condolence, date, extraID)
                        VALUES ($expedient, '$name', '$phone', '$address', '$city', '$condolence', $date, '$extraID')");

            $result = $db->query("  SELECT  c.ID
                                    FROM    Condolences c
                                    WHERE   c.extraID = '$extraID'");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                $id = $db->resultToArray($result)[0]['ID'];

                if(count($_FILES) > 0){
                    $file = $_FILES['file'];
    
                    if(!is_dir($_SESSION['basePath'] . "resources/files/1/condolences/$expedient/$id/")){
                        mkdir($_SESSION['basePath'] . "resources/files/1/condolences/$expedient/$id/", 0777);
                    }

                    $ext = explode('.', $doc)[count(explode('.', $doc)) - 1];
                    if($ext != 'pdf' && $ext != 'jpg' && $ext != 'mp3' && $ext != 'mp4'){
                        $db->query("DELETE FROM Condolences WHERE ID = $id");
                        return false;
                    }else{
                        if(move_uploaded_file($file['tmp_name'], $_SESSION['basePath'] . "resources/files/1/condolences/$expedient/$id/" . $file['name'])){
                            $db->query("UPDATE  Condolences c
                                        SET     c.doc = '" . $utils->getRoute() . "resources/files/1/condolences/$expedient/$id/" . $doc . "'
                                        WHERE   c.ID = $id");

                            return true;
                        }else{
                            $db->query("DELETE FROM Condolences WHERE ID = $id");
                            return false;
                        }
                    }
                }else{
                    return true;
                }
            }
        }

        /**
         * Obtiene los pésames web de un expediente
         * 
         * @param int $expedient Id del expediente
         * @return array|null
         */
        public function getCondolences($expedient){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);

            $result = $db->query("  SELECT  c.*
                                    FROM    Condolences c
                                    WHERE   c.expedient = $expedient");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los pésames web de un expediente
         * 
         * @param int $expedient Id del expediente
         * @return array|null
         */
        public function updateDelivered($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            return $db->query(" UPDATE  Condolences c
                                SET     c.delivered = 1
                                WHERE   c.ID = $id");
        }
    }
?>