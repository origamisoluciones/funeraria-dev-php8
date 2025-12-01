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
            require_once($_SESSION['basePath'] . "model/suppliers.php");
            require_once($_SESSION['basePath'] . "model/locations.php");
            require_once($_SESSION['basePath'] . "core/tools/security.php");
        
            $suppliers = new Suppliers;
            $locations = new Locations;

            $logs = new Logs;
            $logs->createSimple("Configuración", "Proveedores - Importar datos", "'Ha importado los datos de los proveedores'");

            $i = 0;
            $errors = array();
            while(($line = fgetcsv($fileManager, 1000, ",")) !== FALSE){
                // $line = array_map("utf8_encode", $line);
                
                $line[0] = trim($line[0]);
                if($line[0] != ''){
                    $data = explode(';', $line[0]);

                    if(!isset($data[0]) || !isset($data[1]) || !isset($data[2]) || !isset($data[3]) || !isset($data[4]) || !isset($data[5]) || !isset($data[6]) || !isset($data[7]) || !isset($data[8]) || !isset($data[9]) || !isset($data[10]) || !isset($data[11]) || !isset($data[12]) || !isset($data[13])){
                        array_push($errors, "Número de columnas incorrecto. Las columnas son: ID, Nombre, NIF, Dirección, Provincia, Localidad, Código Postal, Email, Teléfonos, Fax, Descripción, Fecha Entrada, Enviar Esquela, Persona de Contacto");
                        break;
                    }else{
                        if($i != 0){
                            //Reemplazamos los campos que vengan con comillas para que no rompa la consulta
                            $supplierID = str_replace ('"', "",$data[0]);
                            $name = str_replace ('"', "",$data[1]);
                            $nif = str_replace ('"', "",$data[2]);
                            $address = str_replace ('"', "",$data[3]);
                            $province = str_replace ('"', "",$data[4]);
                            $location = str_replace ('"', "",$data[5]);
                            $postalCode = str_replace ('"', "",$data[6]);
                            $mail = str_replace ('"', "",$data[7]);
                            $phones = str_replace ('"', "",$data[8]);
                            $fax = str_replace ('"', "",$data[9]);
                            $description = str_replace ('"', "",$data[10]);
                            $entryDate = str_replace ('"', "",$data[11]);
                            $sentObituary = str_replace ('"', "",$data[12]);
                            $contactNames = str_replace ('"', "",$data[13]);

                            //Evaluamos si los campos vienen con un caracter sin codear ('�') (excel los guarda sin codificación) y en ese caso los codeamos
                            if (!preg_match('!!u', $supplierID)){
                                $supplierID = utf8_encode($supplierID);
                            }

                            if (!preg_match('!!u', $name)){
                                $name = utf8_encode($name);
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

                            if (!preg_match('!!u', $fax)){
                                $fax = utf8_encode($fax);
                            }

                            if (!preg_match('!!u', $description)){
                                $description = utf8_encode($description);
                            }

                            if (!preg_match('!!u', $entryDate)){
                                $entryDate = utf8_encode($entryDate);
                            }

                            if (!preg_match('!!u', $sentObituary)){
                                $sentObituary = utf8_encode($sentObituary);
                            }

                            if (!preg_match('!!u', $contactNames)){
                                $contactNames = utf8_encode($contactNames);
                            }
                    
                            $locationId = $location == '' ? null : $locations->searchByNameAndProvinceImport($location, $province, $postalCode);
                            $location = $locationId == null ? 'null' : $locationId[0]['locationID'];
                            
                            $data = array(
                                'supplierID' => $supplierID,
                                'name' => $name,
                                'nif' => $nif,
                                'address' => $address,
                                'location' => $location,
                                'mail' => $mail,
                                'phones' => $phones,
                                'fax' => $fax,
                                'description' => $description,
                                'entryDate' => $entryDate,
                                'sentObituary' => $sentObituary == 'No' ? 0 : 1,
                                'contactNames' => $contactNames
                            );
    
                            if($data["supplierID"] == ""){
                                $response = $suppliers->createImport($data);
                                if($response !== true){
                                    $line = $i + 1;
                                    array_push($errors, "Error en la línea $line - $response");
                                }
                            }else{
                                if($suppliers->isDelete($data["supplierID"])){
                                    $response = $suppliers->createImport($data);
                                    if($response !== true){
                                        $line = $i + 1;
                                        array_push($errors, "Error en la línea $line - $response");
                                    }
                                }else{
                                    $response = $suppliers->updateImport($data);
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