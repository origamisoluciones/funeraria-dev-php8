<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
    }

    if(!isset($_SESSION['user'])){
        http_response_code(403);
        return;
    }

    if(empty($_FILES)){
        http_response_code(405);
        return;
    }

    $file = $_FILES['file'];
    $name = $file['name'];
    $extension = explode('.', $name)[count(explode('.', $name)) - 1];
    if($extension == 'csv'){

        $filename = $file['tmp_name'];
        $csvData = file_get_contents($filename);
        $csv = explode("\n", $csvData);
        $newData = array();
        
        foreach($csv as $rowData) {
            $rowData = str_replace (',', "",$rowData);
            $row = explode(";", $rowData);
            //change your data here
            $newData[] = implode(";", $row);
        }
        $newData = implode("\n", $newData);
        file_put_contents($filename, $newData);

        if(($fileManager = fopen($file['tmp_name'], "r")) !== FALSE){
            require_once($_SESSION['basePath'] . "model/bellringers.php");
            require_once($_SESSION['basePath'] . "model/locations.php");
            require_once($_SESSION['basePath'] . "model/churches.php");
            require_once($_SESSION['basePath'] . "core/tools/security.php");
        
            $bellringers = new Bellringers;
            $locations = new Locations;
            $churches = new Churches;

            $i = 0;
            $errors = array();

            $logs = new Logs;
            $logs->createSimple("Configuración", "Campaneros - Importar datos", "'Ha importado los datos de los campaneros'");

            while(($line = fgetcsv($fileManager, 1000, ",")) !== FALSE){
                // $line = array_map("utf8_encode", $line);
                
                $line[0] = trim($line[0]);
                if($line[0] != ''){
                    $data = explode(';', $line[0]);

                    if(!isset($data[0]) || !isset($data[1]) || !isset($data[2]) || !isset($data[3]) || !isset($data[4]) || !isset($data[5]) || !isset($data[6]) || !isset($data[7]) || !isset($data[8]) || !isset($data[9]) || !isset($data[10]) || !isset($data[11]) || !isset($data[12]) || !isset($data[13]) || !isset($data[14])){
                        array_push($errors, "Número de columnas incorrecto. Las columnas son: ID, Nombre, Apellidos, NIF, Dirección, Provincia, Localidad, Código postal, Zona, Parroquia, Email, Teléfono, Teléfono Móvil, Otro Teléfono, Iglesias");
                        break;
                    }else{
                        if($i != 0){
                            
                            $ID = str_replace ('"', "", $data[0]);
                            $name = str_replace ('"', "", $data[1]);
                            $surname = str_replace ('"', "", $data[2]);
                            $nif = str_replace ('"', "", $data[3]);
                            $address = str_replace ('"', "", $data[4]);
                            $province = str_replace ('"', "", $data[5]);
                            $location = str_replace ('"', "", $data[6]);
                            $postalCode = str_replace ('"', "", $data[7]);
                            $area = str_replace ('"', "", $data[8]);
                            $parish = str_replace ('"', "", $data[9]);
                            $email = str_replace ('"', "", $data[10]);
                            $homePhone = str_replace ('"', "", $data[11]);
                            $mobilePhone = str_replace ('"', "", $data[12]);
                            $otherPhone = str_replace ('"', "", $data[13]);
                            $churchesNames = str_replace ('"', "", $data[14]);

                            //Evaluamos si los campos vienen con un caracter sin codear ('�') (excel los guarda sin codificación) y en ese caso los codeamos
                            if (!preg_match('!!u', $ID)){
                                $ID = utf8_encode($ID);
                            }

                            if (!preg_match('!!u', $name)){
                                $name = utf8_encode($name);
                            }

                            if (!preg_match('!!u', $surname)){
                                $surname = utf8_encode($surname);
                            }

                            if (!preg_match('!!u', $nif)){
                                $nif = utf8_encode($nif);
                            }

                            if (!preg_match('!!u', $address)){
                                $address = utf8_encode($address);
                            }

                            if (!preg_match('!!u', $location)){
                                $location = utf8_encode($location);
                            }

                            if (!preg_match('!!u', $postalCode)){
                                $postalCode = utf8_encode($postalCode);
                            }

                            if (!preg_match('!!u', $area)){
                                $area = utf8_encode($area);
                            }

                            if (!preg_match('!!u', $parish)){
                                $parish = utf8_encode($parish);
                            }

                            if (!preg_match('!!u', $email)){
                                $email = utf8_encode($email);
                            }

                            if (!preg_match('!!u', $homePhone)){
                                $homePhone = utf8_encode($homePhone);
                            }

                            if (!preg_match('!!u', $mobilePhone)){
                                $mobilePhone = utf8_encode($mobilePhone);
                            }

                            if (!preg_match('!!u', $otherPhone)){
                                $otherPhone = utf8_encode($otherPhone);
                            }

                            if (!preg_match('!!u', $churchesNames)){
                                $churchesNames = utf8_encode($churchesNames);
                            }
                            
                            $locationId = $location == '' ? null : $locations->searchByNameAndProvinceImport($location, $province, $postalCode);
                            $location = $locationId == null ? 'null' : $locationId[0]['locationID'];
                            $churchesIds = array();
                            if($churchesNames != ''){
                                $churchesNames = explode('#', $churchesNames);
                                foreach($churchesNames as $church){
                                    $id = $churches->searchByName($church);
                                    if($id != null){
                                        array_push($churchesIds, $id[0]['churchID']);
                                    }
                                
                                }
                            }

                            $data = array(
                                'ID' => $ID,
                                'name' => $name,
                                'surname' => $surname,
                                'nif' => $nif,
                                'address' => $address,
                                'location' => $location,
                                'postalCode' => $postalCode,
                                'area' => $area,
                                'parish' => $parish,
                                'email' => $email,
                                'homePhone' => $homePhone,
                                'mobilePhone' => $mobilePhone,
                                'otherPhone' => $otherPhone
                            );
                            
                            if(count($churchesIds) > 0){
                                $data['churches'] = $churchesIds;
                            }

                            if($data["ID"] == ""){
                                $response = $bellringers->createImport($data);
                                if($response !== true){
                                    $line = $i + 1;
                                    array_push($errors, "Error en la línea $line - $response");
                                }
                            }else{
                                if($bellringers->isDelete($data["ID"])){
                                    $response = $bellringers->createImport($data);
                                    if($response !== true){
                                        $line = $i + 1;
                                        array_push($errors, "Error en la línea  $line - $response");
                                    }
                                }else{
                                    $response = $bellringers->updateImport($data);
                                    if($response !== true){
                                        $line = $i + 1;
                                        array_push($errors, "Error en la línea $line - $response");
                                    }
                                }
                            }
                            
                        }
                    }
                }
                $i++;
            }
            echo json_encode($errors);
        }else{
            echo json_encode(false);
        }
    }else{
        echo json_encode(false);
    }
?>