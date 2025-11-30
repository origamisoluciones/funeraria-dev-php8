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
            require_once($_SESSION['basePath'] . "model/mortuaries.php");
            require_once($_SESSION['basePath'] . "model/locations.php");
            require_once($_SESSION['basePath'] . "core/tools/security.php");
        
            $mortuaries = new Mortuaries;
            $locations = new Locations;

            $logs = new Logs;
            $logs->createSimple("Configuración", "Tanatorios - Importar datos", "'Ha importado los datos de los tanatorios'");


            $i = 0;
            $errors = array();
            while(($line = fgetcsv($fileManager, 1000, ",")) !== FALSE){
                // $line = array_map("utf8_encode", $line);
                
                $line[0] = trim($line[0]);
                if($line[0] != ''){
                    $data = explode(';', $line[0]);

                    if(!isset($data[0]) || !isset($data[1]) || !isset($data[2]) || !isset($data[3]) || !isset($data[4]) || !isset($data[5]) || !isset($data[6]) || !isset($data[7]) || !isset($data[8]) || !isset($data[9]) || !isset($data[10]) || !isset($data[11])){
                        array_push($errors, "Número de columnas incorrecto. Las columnas son: ID, Nombre, Dirección, Provincia, Localidad, Código postal, Email, Teléfonos, Compañía, Propio, Latitud, Longitud");
                        break;
                    }else{
                        if($i != 0){

                            //Reemplazamos los campos que vengan con comillas para que no rompa la consulta
                            $mortuaryID = str_replace ('"', "",$data[0]);
                            $name = str_replace ('"', "",$data[1]);
                            $address = str_replace ('"', "",$data[2]);
                            $province = str_replace ('"', "",$data[3]);
                            $location = str_replace ('"', "",$data[4]);
                            $postalCode = str_replace ('"', "",$data[5]);
                            $mail = str_replace ('"', "",$data[6]);
                            $phones = str_replace ('"', "",$data[7]);
                            $company = str_replace ('"', "",$data[8]);
                            $isYourOwn = str_replace ('"', "",$data[9]);
                            $latitude = str_replace ('"', "",$data[10]);
                            $longitude = str_replace ('"', "",$data[11]);

                            //Evaluamos si los campos vienen con un caracter sin codear ('�') (excel los guarda sin codificación) y en ese caso los codeamos
                            if(!preg_match('!!u', $mortuaryID)){
                                $mortuaryID = utf8_encode($mortuaryID);
                            }
                            if(!preg_match('!!u', $name)){
                                $name = utf8_encode($name);
                            }
                            if(!preg_match('!!u', $address)){
                                $address = utf8_encode($address);
                            }
                            if(!preg_match('!!u', $province)){
                                $province = utf8_encode($province);
                            }
                            if(!preg_match('!!u', $location)){
                                $location = utf8_encode($location);
                            }
                            if(!preg_match('!!u', $postalCode)){
                                $postalCode = utf8_encode($postalCode);
                            }
                            if(!preg_match('!!u', $company)){
                                $company = utf8_encode($company);
                            }
                            if(!preg_match('!!u', $mail)){
                                $mail = utf8_encode($mail);
                            }
                            if(!preg_match('!!u', $phones)){
                                $phones = utf8_encode($phones);
                            }
                            if(!preg_match('!!u', $isYourOwn)){
                                $isYourOwn = utf8_encode($isYourOwn);
                            }
                            if(!preg_match('!!u', $latitude)){
                                $latitude = utf8_encode($latitude);
                            }
                            if(!preg_match('!!u', $longitude)){
                                $longitude = utf8_encode($longitude);
                            }
                            
                            $locationId = $location == '' ? null : $locations->searchByNameAndProvinceImport($location, $province, $postalCode);
                            $location = $locationId == null ? 'null' : $locationId[0]['locationID'];
                            
                            if($isYourOwn == 'Sí'){
                                $isYourOwn = 1;
                            }else{
                                $isYourOwn = 0;
                            }

                            $data = array(
                                'mortuaryID' => $mortuaryID,
                                'name' => $name,
                                'address' => $address,
                                'location' => $location,
                                'mail' => $mail,
                                'phones' => $phones,
                                'company' => $company,
                                'isYourOwn' => $isYourOwn,
                                'latitude' => $latitude,
                                'longitude' => $longitude
                            );
                            
                            if($data["mortuaryID"] == ""){
                                $response = $mortuaries->createImport($data);
                                if($response !== true){
                                    $line = $i + 1;
                                    array_push($errors, "Error en la línea $line - $response");
                                }
                            }else{
                                if($mortuaries->isDelete($data["mortuaryID"])){
                                    $response = $mortuaries->createImport($data);
                                    if($response !== true){
                                        $line = $i + 1;
                                        array_push($errors, "Error en la línea $line - $response");
                                    }
                                }else{
                                    $response = $mortuaries->updateImport($data);
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