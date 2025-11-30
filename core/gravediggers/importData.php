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
            require_once($_SESSION['basePath'] . "model/gravediggers.php");
            require_once($_SESSION['basePath'] . "model/locations.php");
            require_once($_SESSION['basePath'] . "model/cemeteries.php");
            require_once($_SESSION['basePath'] . "core/tools/security.php");
        
            $gravediggers = new Gravediggers;
            $locations = new Locations;
            $cemeteries = new Cemeteries;

            $logs = new Logs;
            $logs->createSimple("Configuración", "Enterradores - Importar datos", "'Ha importado los datos de los enterradores'");

            $i = 0;
            $errors = array();
            while(($line = fgetcsv($fileManager, 1000, ",")) !== FALSE){
                // $line = array_map("utf8_encode", $line);
                
                $line[0] = trim($line[0]);
                if($line[0] != ''){
                    $data = explode(';', $line[0]);

                    if(!isset($data[0]) || !isset($data[1]) || !isset($data[2]) || !isset($data[3]) || !isset($data[4]) || !isset($data[5]) || !isset($data[6]) || !isset($data[7]) || !isset($data[8]) || !isset($data[9]) || !isset($data[10]) || !isset($data[11]) || !isset($data[12])){
                        array_push($errors, "Número de columnas incorrecto. Las columnas son: ID, Nombre, Apellidos, NIF, Dirección, Provincia, Localidad, Código postal, Email, Teléfono, Teléfono Móvil, Otro Teléfono, Cementerios");
                        break;
                    }else{
                        if($i != 0){
                            //Reemplazamos los campos que vengan con comillas para que no rompa la consulta
                            $graveddigerID = str_replace ('"', "",$data[0]);
                            $name = str_replace ('"', "",$data[1]);
                            $surname = str_replace ('"', "",$data[2]);
                            $nif = str_replace ('"', "",$data[3]);
                            $address = str_replace ('"', "",$data[4]);
                            $province = str_replace ('"', "",$data[5]);
                            $location = str_replace ('"', "",$data[6]);
                            $postalCode = str_replace ('"', "",$data[7]);
                            $mail = str_replace ('"', "",$data[8]);
                            $homePhone = str_replace ('"', "",$data[9]);
                            $mobilePhone = str_replace ('"', "",$data[10]);
                            $otherPhone = str_replace ('"', "",$data[11]);
                            $cemeteriesNames = str_replace ('"', "",$data[12]);

                            //Evaluamos si los campos vienen con un caracter sin codear ('�') (excel los guarda sin codificación) y en ese caso los codeamos
                            if (!preg_match('!!u', $graveddigerID)){
                                $graveddigerID = utf8_encode($graveddigerID);
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

                            if (!preg_match('!!u', $province)){
                                $province = utf8_encode($province);
                            }

                            if (!preg_match('!!u', $location)){
                                $location = utf8_encode($location);
                            }

                            if (!preg_match('!!u', $postalCode)){
                                $postalCode = utf8_encode($postalCode);
                            }

                            if (!preg_match('!!u', $mail)){
                                $mail = utf8_encode($mail);
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

                            if (!preg_match('!!u', $cemeteriesNames)){
                                $cemeteriesNames = utf8_encode($cemeteriesNames);
                            }
                    
                            $locationId = $location == '' ? null : $locations->searchByNameAndProvinceImport($location, $province, $postalCode);
                            $location = $locationId == null ? 'null' : $locationId[0]['locationID'];

                            $cemeteriesIds = array();
                            if($cemeteriesNames != ''){
                                $cemeteriesNames = explode('#', $cemeteriesNames);
                                foreach($cemeteriesNames as $cemetery){
                                    $id = $cemeteries->searchByName($cemetery);
                                    if($id != null){
                                        array_push($cemeteriesIds, $id[0]['cemeteryID']);
                                    }
                                
                                }
                            }

                            $data = array(
                                'gravediggerID' => $graveddigerID,
                                'name' => $name,
                                'surname' => $surname,
                                'nif' => $nif,
                                'address' => $address,
                                'location' => $location,
                                'mail' => $mail,
                                'homePhone' => $homePhone,
                                'mobilePhone' => $mobilePhone,
                                'otherPhone' => $otherPhone
                            );
                            
                            if(count($cemeteriesIds) > 0){
                                $data['cemeteries'] = $cemeteriesIds;
                            }

                            if($data["gravediggerID"] == ""){
                                $response = $gravediggers->createImport($data);
                                if($response !== true){
                                    $line = $i + 1;
                                    array_push($errors, "Error en la línea $line - $response");
                                }
                            }else{
                                if($gravediggers->isDelete($data["gravediggerID"])){
                                    $response = $gravediggers->createImport($data);
                                    if($response !== true){
                                        $line = $i + 1;
                                        array_push($errors, "Error en la línea $line - $response");
                                    }
                                }else{
                                    $response = $gravediggers->updateImport($data);
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