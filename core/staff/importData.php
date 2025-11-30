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
            require_once($_SESSION['basePath'] . "model/staff.php");
            require_once($_SESSION['basePath'] . "model/users.php");
            require_once($_SESSION['basePath'] . "model/locations.php");
            require_once($_SESSION['basePath'] . "core/tools/security.php");
        
            $staff = new Staff;
            $users = new Users;
            $locations = new Locations;

            $logs = new Logs;
            $logs->createSimple("Configuración", "Personal - Importar datos", "'Ha importado los datos del staff'");

            $i = 0;
            $errors = array();
            while(($line = fgetcsv($fileManager, 1000, ",")) !== FALSE){
                // $line = array_map("utf8_encode", $line);
                
                $line[0] = trim($line[0]);
                if($line[0] != ''){
                    $data = explode(';', $line[0]);

                    if(!isset($data[0]) || !isset($data[1]) || !isset($data[2]) || !isset($data[3]) || !isset($data[4]) || !isset($data[5]) || !isset($data[6]) || !isset($data[7]) || !isset($data[8]) || !isset($data[9]) || !isset($data[10]) || !isset($data[11]) || !isset($data[12]) || !isset($data[13]) || !isset($data[14]) || !isset($data[15])){
                        array_push($errors, "Número de columnas incorrecto. Las columnas son: ID, Código, Nombre, Apellidos, NIF, NUSS, Dirección, Provincia, Localidad, Código postal, Email, Extensión Telefónico, Núm. Cuenta, Usuario asociado, Puestos");
                        break;
                    }else{
                        if($i != 0){
                        
                            $ID = str_replace ('"', "",$data[0]);
                            $code = str_replace ('"', "",$data[1]);
                            $name = str_replace ('"', "",$data[2]);
                            $surname = str_replace ('"', "",$data[3]);
                            $nif = str_replace ('"', "",$data[4]);
                            $nuss = str_replace ('"', "",$data[5]);
                            $address = str_replace ('"', "",$data[6]);
                            $province = str_replace ('"', "",$data[7]);
                            $location = str_replace ('"', "",$data[8]);
                            $postalCode = str_replace ('"', "",$data[9]);
                            $email = str_replace ('"', "",$data[10]);
                            $extension = str_replace ('"', "",$data[11]);
                            $phones = str_replace ('"', "",$data[12]);
                            $accountNumber = str_replace ('"', "",$data[13]);
                            $username = str_replace ('"', "",$data[14]);
                            $postNames = str_replace ('"', "",$data[15]);

                             //Evaluamos si los campos vienen con un caracter sin codear ('�') (excel los guarda sin codificación) y en ese caso los codeamos
                             if (!preg_match('!!u', $ID)){
                                $ID = utf8_encode($ID);
                            }

                            if (!preg_match('!!u', $code)){
                                $code = utf8_encode($code);
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

                            if (!preg_match('!!u', $nuss)){
                                $nuss = utf8_encode($nuss);
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

                            if (!preg_match('!!u', $email)){
                                $email = utf8_encode($email);
                            }

                            if (!preg_match('!!u', $extension)){
                                $extension = utf8_encode($extension);
                            }

                            if (!preg_match('!!u', $phones)){
                                $phones = utf8_encode($phones);
                            }

                            if (!preg_match('!!u', $accountNumber)){
                                $accountNumber = utf8_encode($accountNumber);
                            }

                            if (!preg_match('!!u', $username)){
                                $username = utf8_encode($username);
                            }

                            if (!preg_match('!!u', $postNames)){
                                $postNames = utf8_encode($postNames);
                            }
                    
                            $locationId = $location == '' ? null : $locations->searchByNameAndProvinceImport($location, $province, $postalCode);
                            $location = $locationId == null ? 'null' : $locationId[0]['locationID'];
                            
                            $userID = $username == '' ? null : $users->searchByUsernameImport($username);
                            $username = $userID == null ? 'null' : $userID[0]['userID'];

                            $postsIDs = array();
                            if($postNames != ''){
                                $postNames = explode('#', $postNames);
                                foreach($postNames as $post){
                                    $id = $staff->searchByNamePost($post);
                                    if($id != null){
                                        array_push($postsIDs, $id[0]['ID']);
                                    }
                                
                                }
                            }
                        
                            $data = array(
                                'ID' => $ID,
                                'code' => $code,
                                'name' => $name,
                                'surname' => $surname,
                                'nif' => $nif,
                                'nuss' => $nuss,
                                'address' => $address,
                                'location' => $location,
                                'mail' => $email,
                                'extension' => $extension,
                                'phones' => $phones,
                                'accountNumber' => $accountNumber,
                                'user' => $username,
                            );

                            if(count($postsIDs) > 0){
                                $data['posts'] = $postsIDs;
                            }
                        
                            if($data["ID"] == ""){
                                $response = $staff->createImport($data);
                                if($response !== true){
                                    $line = $i + 1;
                                    array_push($errors, "Error en la línea $line - $response");
                                }
                            }else{
                                if($staff->isDelete($data["ID"])){
                                    $response = $staff->createImport($data);
                                    if($response !== true){
                                        $line = $i + 1;
                                        array_push($errors, "Error en la línea $line - $response");
                                    }
                                }else{
                                    $response = $staff->updateImport($data);
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