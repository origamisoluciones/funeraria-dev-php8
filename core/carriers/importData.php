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
            require_once($_SESSION['basePath'] . "model/carriers.php");
            require_once($_SESSION['basePath'] . "model/locations.php");
            require_once($_SESSION['basePath'] . "model/churches.php");
            require_once($_SESSION['basePath'] . "core/tools/security.php");
        
            $carriers = new Carriers;
            $locations = new Locations;

            $logs = new Logs;
            $logs->createSimple("Configuración", "Porteadores - Importar datos", "'Ha importado los datos de los porteadores'");


            $i = 0;
            $errors = array();
            while(($line = fgetcsv($fileManager, 1000, ",")) !== FALSE){
                // $line = array_map("utf8_encode", $line);
                
                $line[0] = trim($line[0]);
                if($line[0] != ''){
                    $data = explode(';', $line[0]);

                    if(!isset($data[0]) || !isset($data[1]) || !isset($data[2]) || !isset($data[3]) || !isset($data[4]) || !isset($data[5]) || !isset($data[6]) || !isset($data[7]) || !isset($data[8]) || !isset($data[9]) || !isset($data[10]) || !isset($data[11])){
                        array_push($errors, "Número de columnas incorrecto. Las columnas son: ID, Nombre, Apellidos, NIF, Dirección, Provincia, Localidad, Código postal, Email, Teléfonos, Conduce, Fecha de Entrada");
                        break;
                    }else{
                        if($i != 0){
                        
                            //Reemplazamos los campos que vengan con comillas para que no rompa la consulta
                            $carrierID = str_replace ('"', "",$data[0]);
                            $name = str_replace ('"', "",$data[1]);
                            $surname = str_replace ('"', "",$data[2]);
                            $nif = str_replace ('"', "",$data[3]);
                            $address = str_replace ('"', "",$data[4]);
                            $province = str_replace ('"', "",$data[5]);
                            $location = str_replace ('"', "",$data[6]);
                            $postalCode = str_replace ('"', "",$data[7]);
                            $mail = str_replace ('"', "",$data[8]);
                            $phones = str_replace ('"', "",$data[9]);
                            $drives = str_replace ('"', "",$data[10]);
                            $entryDate = str_replace ('"', "",$data[11]);

                            //Evaluamos si los campos vienen con un caracter sin codear ('�') (excel los guarda sin codificación) y en ese caso los codeamos
                            if (!preg_match('!!u', $carrierID)){
                                $carrierID = utf8_encode($carrierID);
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

                            if (!preg_match('!!u', $phones)){
                                $phones = utf8_encode($phones);
                            }

                            if (!preg_match('!!u', $drives)){
                                $drives = utf8_encode($drives);
                            }

                            if (!preg_match('!!u', $entryDate)){
                                $entryDate = utf8_encode($entryDate);
                            }

                            if($entryDate != ''){
                                $entryDateFormat = preg_match('/-/', $entryDate);
                                if($entryDateFormat == 0){
                                    $entryDateAux = explode('/', $entryDate);
                                    if(mb_strlen($entryDateAux[0]) == 4){
                                        $year = $entryDateAux[0];
                                        $day = explode(' ', $entryDateAux[2])[0];
                                    }else{
                                        $year = explode(' ', $entryDateAux[2])[0];
                                        $day = $entryDateAux[0];
                                    }
                                    $month = $entryDateAux[1];

                                    $entryDate = "$year-$month-$day 00:00:00";
                                }else{
                                    $entryDateAux = explode('-', $entryDate);
                                    if(mb_strlen($entryDateAux[0]) == 4){
                                        $year = $entryDateAux[0];
                                        $day = explode(' ', $entryDateAux[2])[0];
                                    }else{
                                        $year = explode(' ', $entryDateAux[2])[0];
                                        $day = $entryDateAux[0];
                                    }
                                    $month = $entryDateAux[1];

                                    $entryDate = "$year-$month-$day 00:00:00";
                                }
                            }
                           
                            $locationId = $location == '' ? null : $locations->searchByNameAndProvinceImport($location, $province, $postalCode);
                            $location = $locationId == null ? 'null' : $locationId[0]['locationID'];
                            
                            $data = array(
                                'carrierID' => $carrierID,
                                'name' => $name,
                                'surname' => $surname,
                                'nif' => $nif,
                                'address' => $address,
                                'location' => $location,
                                'mail' => $mail,
                                'phones' => $phones,
                                'drives' => $drives,
                                'entryDate' => $entryDate
                            );
                            
            
                            if($data["carrierID"] == ""){
                                $response = $carriers->createImport($data);
                                if($response !== true){
                                    $line = $i + 1;
                                    array_push($errors, "Error en la línea $line - $response");
                                }
                            }else{
                                if($carriers->isDelete($data["carrierID"])){
                                    $response = $carriers->createImport($data);
                                    if($response !== true){
                                        $line = $i + 1;
                                        array_push($errors, "Error en la línea $line - $response");
                                    }
                                }else{
                                    $response = $carriers->updateImport($data);
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