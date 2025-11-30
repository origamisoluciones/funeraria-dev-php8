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
            require_once($_SESSION['basePath'] . "model/churches.php");
            require_once($_SESSION['basePath'] . "core/tools/security.php");
        
            $costCenter = new Mortuaries;
            $locations = new Locations;
            $churches = new Churches;

            $logs = new Logs;
            $logs->createSimple("Configuración", "Centos de Coste - Importar datos", "'Ha exportaimportadodo los datos de los centros de coste'");

            $i = 0;
            $errors = array();
            while(($line = fgetcsv($fileManager, 1000, ",")) !== FALSE){
                // $line = array_map("utf8_encode", $line);
                
                $line[0] = trim($line[0]);
                if($line[0] != ''){
                    $data = explode(';', $line[0]);
              
                    if(!isset($data[0]) || !isset($data[1]) || !isset($data[2]) || !isset($data[3]) || !isset($data[4]) || !isset($data[5]) || !isset($data[6]) || !isset($data[7]) || !isset($data[8]) || !isset($data[9]) || !isset($data[10])){
                        array_push($errors, "Número de columnas incorrecto. Las columnas son: ID, Nombre, Dirección, Email, Teléfono, Provincia, Localidad, Código postal, Tanatorio asociado, Compañia, Principal");
                        break;
                    }else{
                        if($i != 0){

                            //Reemplazamos los campos que vengan con comillas para que no rompa la consulta
                            $ID = str_replace ('"', "",$data[0]);
                            $name = str_replace ('"', "",$data[1]);
                            $address = str_replace ('"', "",$data[2]);
                            $email = str_replace ('"', "",$data[3]);
                            $phones = str_replace ('"', "",$data[4]);
                            $province = str_replace ('"', "",$data[5]);
                            $location = str_replace ('"', "",$data[6]);
                            $postalCode = str_replace ('"', "",$data[7]);
                            $mortuary = str_replace ('"', "",$data[8]);
                            $company = str_replace ('"', "",$data[9]);
                            $ppal = str_replace ('"', "",$data[10]);

                            //Evaluamos si los campos vienen con un caracter sin codear ('�') (excel los guarda sin codificación) y en ese caso los codeamos
                            if (!preg_match('!!u', $ID)){
                                $ID = utf8_encode($ID);
                            }
                            if (!preg_match('!!u', $name)){
                                $name = utf8_encode($name);
                            }
                            if (!preg_match('!!u', $address)){
                                $address = utf8_encode($address);
                            }
                            if (!preg_match('!!u', $email)){
                                $email = utf8_encode($email);
                            }
                            if (!preg_match('!!u', $phones)){
                                $phones = utf8_encode($phones);
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
                            if (!preg_match('!!u', $mortuary)){
                                $mortuary = utf8_encode($mortuary);
                            }
                            if (!preg_match('!!u', $company)){
                                $company = utf8_encode($company);
                            }
                            if (!preg_match('!!u', $ppal)){
                                $ppal = utf8_encode($ppal);
                            }

                            $locationId = $location == '' ? null : $locations->searchByNameAndProvinceImport($location, $province, $postalCode);
                            $location = $locationId == null ? 'null' : $locationId[0]['locationID'];

                            if($ppal == 'Sí'){
                                $ppal = 1;
                            }else{
                                $ppal = 0;
                            }

                            $data = array(
                                'ID' => $ID,
                                'name' => $name,
                                'address' => $address,
                                'mail' => $email,
                                'phones' => $phones,
                                'location' => $location,
                                'mortuary' => $mortuary,
                                'company' => $company,
                                'warehousePpal' => $ppal
                            );
                        
                            if($data["ID"] == ""){
                                $response = $costCenter->createImportCostCenter($data);
                                if($response !== true){
                                    $line = $i + 1;
                                    array_push($errors, "Error en la línea $line - $response");
                                }
                            }else{
                                if($costCenter->isDeleteCostCenter($data["ID"])){
                                    $response = $costCenter->createImportCostCenter($data);
                                    if($response !== true){
                                        $line = $i + 1;
                                        array_push($errors, "Error en la línea $line - $response");
                                    }
                                }else{
                                    $response = $costCenter->updateImportCostCenter($data);
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