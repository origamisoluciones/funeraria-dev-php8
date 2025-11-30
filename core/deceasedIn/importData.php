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
            require_once($_SESSION['basePath'] . "model/deceasedIn.php");
            require_once($_SESSION['basePath'] . "model/locations.php");
            require_once($_SESSION['basePath'] . "core/tools/security.php");
        
            $deceasedIn = new DeceasedIn;
            $locations = new Locations;

            $logs = new Logs;
            $logs->createSimple("Configuración", "Fallecido En - Importar datos", "'Ha importado los datos de los lugares de fallecimiento'");

            $i = 0;
            $errors = array();
            while(($line = fgetcsv($fileManager, 1000, ",")) !== FALSE){
                // $line = array_map("utf8_encode", $line);
                
                $line[0] = trim($line[0]);
                if($line[0] != ''){
                    $data = explode(';', $line[0]);

                    if(!isset($data[0]) || !isset($data[1]) || !isset($data[2]) || !isset($data[3]) || !isset($data[4]) || !isset($data[5])){
                        array_push($errors, "Número de columnas incorrecto. Las columnas son: ID, Nombre, Provincia, Localidad, Texto");
                        break;
                    }else{
                        if($i != 0){
                        
                            $deceasedInID = str_replace ('"', "",$data[0]);
                            $name = str_replace ('"', "",$data[1]);
                            $province = str_replace ('"', "",$data[2]);
                            $location = str_replace ('"', "",$data[3]);
                            $postalCode = str_replace ('"', "",$data[4]);
                            $text = str_replace ('"', "",$data[5]);

                            //Evaluamos si los campos vienen con un caracter sin codear ('�') (excel los guarda sin codificación) y en ese caso los codeamos
                            if (!preg_match('!!u', $deceasedInID)){
                                $deceasedInID = utf8_encode($deceasedInID);
                            }

                            if (!preg_match('!!u', $name)){
                                $name = utf8_encode($name);
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

                            if (!preg_match('!!u', $text)){
                                $text = utf8_encode($text);
                            }

                            $locationId = $location == '' ? null : $locations->searchByNameAndProvinceImport($location, $province, $postalCode);
                            $location = $locationId == null ? 'null' : $locationId[0]['locationID'];
                            
                            if($text == 'Sí'){
                                $text = 1;
                            }else{
                                $text = 0;
                            }

                            $data = array(
                                'deceasedInID' => $deceasedInID,
                                'name' => $name,
                                'location' => $location,
                                'text' => $text
                            );
                         
                        
                            if($data["deceasedInID"] == ""){
                                $response = $deceasedIn->createImport($data);
                                if($response !== true){
                                    $line = $i + 1;
                                    array_push($errors, "Error en la línea $line - $response");
                                }
                            }else{
                                if($deceasedIn->isDelete($data["deceasedInID"])){
                                    $response = $deceasedIn->createImport($data);
                                    if($response !== true){
                                        $line = $i + 1;
                                        array_push($errors, "Error en la línea $line - $response");
                                    }
                                }else{
                                    $response = $deceasedIn->updateImport($data);
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