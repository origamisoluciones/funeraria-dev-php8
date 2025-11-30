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
            require_once($_SESSION['basePath'] . "model/clients.php");
            require_once($_SESSION['basePath'] . "model/locations.php");
            require_once($_SESSION['basePath'] . "model/prices.php");
            require_once($_SESSION['basePath'] . "core/tools/security.php");
        
            $clients = new Clients;
            $locations = new Locations;
            $prices = new Prices;

            $i = 0;
            $errors = array();

            $logs = new Logs;
            $logs->createSimple("Configuración", "Clientes - Importar datos", "'Ha importado los datos de los clientes'");

            while(($line = fgetcsv($fileManager, 1000, ",")) !== FALSE){
                // $line = array_map("utf8_encode", $line);
                
                $line[0] = trim($line[0]);
                if($line[0] != ''){

                    $data = explode(';', $line[0]);

                    if(!isset($data[0]) || !isset($data[1]) || !isset($data[2]) || !isset($data[3]) || !isset($data[4]) || !isset($data[5]) || !isset($data[6]) || !isset($data[7]) || !isset($data[8]) || !isset($data[9]) || !isset($data[10]) || !isset($data[11]) || !isset($data[12]) || !isset($data[13])){
                        array_push($errors, "Número de columnas incorrecto. Las columnas son: ID, Nombre, Apellidos, Nombre Comercial, Tipo de Usuario, Tipo Tarifa, NIF, Tipo NIF, Dirección, Provincia, Localidad, Código Postal, Email, Teléfonos");
                        break;
                    }else{
                        if($i != 0){
                        
                            //Reemplazamos los campos que vengan con comillas para que no rompa la consulta
                            $clientID = str_replace ('"', "",$data[0]);
                            $name = str_replace ('"', "",$data[1]);
                            $surname = str_replace ('"', "",$data[2]);
                            $brandName = str_replace ('"', "",$data[3]);
                            $type = str_replace ('"', "",$data[4]);
                            $price = str_replace ('"', "",$data[5]);
                            $nif = str_replace ('"', "",$data[6]);
                            $nifType = str_replace ('"', "",$data[7]);
                            $address = str_replace ('"', "",$data[8]);
                            $province = str_replace ('"', "",$data[9]);
                            $location = str_replace ('"', "",$data[10]);
                            $postalCode = str_replace ('"', "",$data[11]);
                            $mail = str_replace ('"', "",$data[12]);
                            $phones = str_replace ('"', "",$data[13]);

                            //Evaluamos si los campos vienen con un caracter sin codear ('�') (excel los guarda sin codificación) y en ese caso los codeamos
                            if (!preg_match('!!u', $clientID)){
                                $clientID = utf8_encode($clientID);
                            }

                            if (!preg_match('!!u', $name)){
                                $name = utf8_encode($name);
                            }

                            if (!preg_match('!!u', $surname)){
                                $surname = utf8_encode($surname);
                            }

                            if (!preg_match('!!u', $type)){
                                $type = utf8_encode($type);
                            }

                            if (!preg_match('!!u', $brandName)){
                                $brandName = utf8_encode($brandName);
                            }

                            if (!preg_match('!!u', $type)){
                                $type = utf8_encode($type);
                            }

                            if (!preg_match('!!u', $price)){
                                $price = utf8_encode($price);
                            }

                            if (!preg_match('!!u', $nif)){
                                $nif = utf8_encode($nif);
                            }

                            if (!preg_match('!!u', $nifType)){
                                $nifType = utf8_encode($nifType);
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

                            if (!preg_match('!!u', $mail)){
                                $mail = utf8_encode($mail);
                            }

                            if (!preg_match('!!u', $phones)){
                                $phones = utf8_encode($phones);
                            }

                            $locationId = $location == '' ? null : $locations->searchByNameAndProvinceImport($location, $province, $postalCode);
                            $location = $locationId == null ? 'null' : $locationId[0]['locationID'];

                            $typeID = $type == '' ? null : $clients->searchByNameImport($type);
                            $type = $typeID == null ? 'null' : $typeID[0]['clientTypeID'];

                            $priceID = $price == '' ? null : $prices->searchByNameImport($price);
                            $price = $priceID == null ? 'null' : $priceID;
            
                            $data = array(
                                'clientID' => $clientID,
                                'name' => $name,
                                'surname' => $surname,
                                'brandName' => $brandName,
                                'type' => $type,
                                'price' => $price,
                                'nif' => $nif,
                                'nifType' => $nifType,
                                'address' => $address,
                                'location' => $location,
                                'mail' => $mail,
                                'phones' => $phones
                            );

                            if($data["clientID"] == ""){
                                $response = $clients->createImport($data);
                                if($response !== true){
                                    $line = $i + 1;
                                    array_push($errors, "Error en la línea $line - $response");
                                }
                            }else{
                                if($clients->isDelete($data["clientID"])){
                                    $response = $clients->createImport($data);
                                    if($response !== true){
                                        $line = $i + 1;
                                        array_push($errors, "Error en la línea $line - $response");
                                    }
                                }else{
                                    $response = $clients->updateImport($data);
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