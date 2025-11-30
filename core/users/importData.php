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
            require_once($_SESSION['basePath'] . "model/users.php");
            require_once($_SESSION['basePath'] . "model/locations.php");
            require_once($_SESSION['basePath'] . "model/companies.php");
            require_once($_SESSION['basePath'] . "core/tools/security.php");
        
            $users = new Users;
            $locations = new Locations;
            $companies = new Companies;

            $logs = new Logs;
            $logs->createSimple("Configuración", "Usuarios - Importar datos", "'Ha importado los datos de los usuarios'");

            //Gets max user by company
            $currentSession = $_SESSION['company'];
            $_SESSION['company'] = '0';

            $userLimit = $companies->getUserLimit($currentSession);

            $_SESSION['company'] = $currentSession;
            
            $userLimit = intval($userLimit[0]['limit_users']);

            //Gets user created
            $where = "u.type = ut.userTypeID AND u.leavingDate IS NULL";
            $usersCount = $users->listUsersDatatables($where);
            $usersCount = count($usersCount);

            $errors = array();

            if($usersCount >= $userLimit){
                array_push($errors, "Se ha alcanzado el número máximo de usuarios permitidos.");
            }else{
                $i = 0;
                while(($line = fgetcsv($fileManager, 1000, ",")) !== FALSE){
                    
                    $line[0] = trim($line[0]);
                    if($line[0] != ''){
                        $data = explode(';', $line[0]);
    
                        if(!isset($data[0]) || !isset($data[1]) || !isset($data[2]) || !isset($data[3]) || !isset($data[4]) || !isset($data[5]) || !isset($data[6]) || !isset($data[7]) || !isset($data[8]) || !isset($data[9]) || !isset($data[10]) || !isset($data[11]) || !isset($data[12]) || !isset($data[13])){
                            array_push($errors, "Número de columnas incorrecto. Las columnas son: ID, Nombre de Usuario, Contraseña, Nombre, Apellidos, NIF, Dirección, Provincia, Localidad, Código postal, Email, Teléfonos, Puesto, Tipo de Usuario");
                            break;
                        }else{
                            if($i != 0){
                                //Reemplazamos los campos que vengan con comillas para que no rompa la consulta
                                $userID = str_replace ('"', "",$data[0]);
                                $username = str_replace ('"', "",$data[1]);
                                $password = str_replace ('"', "",$data[2]);
                                $name = (str_replace ('"', "",$data[3]));
                                $surname = str_replace ('"', "",$data[4]);
                                $nif = str_replace ('"', "",$data[5]);
                                $address = str_replace ('"', "",$data[6]);
                                $province = str_replace ('"', "",$data[7]);
                                $location = str_replace ('"', "",$data[8]);
                                $postalCode = str_replace ('"', "",$data[9]);
                                $mail = str_replace ('"', "",$data[10]);
                                $phones = str_replace ('"', "",$data[11]);
                                $post = str_replace ('"', "",$data[12]);
                                $usersType = (str_replace ('"', "",$data[13]));
                        
                                //Evaluamos si los campos vienen con un caracter sin codear ('�') (excel los guarda sin codificación) y en ese caso los codeamos
                                if (!preg_match('!!u', $userID)){
                                    $userID = utf8_encode($userID);
                                }
    
                                if (!preg_match('!!u', $username)){
                                    $username = utf8_encode($username);
                                }
    
                                if (!preg_match('!!u', $password)){
                                    $password = utf8_encode($password);
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
    
                                if (!preg_match('!!u', $post)){
                                    $post = utf8_encode($post);
                                }
    
                                if (!preg_match('!!u', $usersType)){
                                    $usersType = utf8_encode($usersType);
                                }
    
    
                                $locationId = $location == '' ? null : $locations->searchByNameAndProvinceImport($location, $province, $postalCode);
                                $location = $locationId == null ? 'null' : $locationId[0]['locationID'];
                                
                                $userTypeID = $usersType == '' ? null : $users->searchTypeByNameImport($usersType);
                                $usersType = $userTypeID == null ? 'null' : $userTypeID;
    
                                $data = array(
                                    'userID' => $userID,
                                    'username' => $username,
                                    'password' => $password,
                                    'name' => $name,
                                    'surname' => $surname,
                                    'nif' => $nif,
                                    'address' => $address,
                                    'location' => $location,
                                    'mail' => $mail,
                                    'phones' => $phones,
                                    'post' => $post,
                                    'type' => $usersType
                                );
    
                                if($data["userID"] == ""){
                                    if($usersCount >= $userLimit){
                                        $line = $i + 1;
                                        array_push($errors, "No se ha podido añadir la línea $line - Se han alcanzado el número máximo de usuarios permitidos.");
                                    }else{
                                        $response = $users->createImport($data);
                                        if($response !== true){
                                            $line = $i + 1;
                                            array_push($errors, "Error en la línea $line - $response");
                                        }else{
                                            $usersCount++;
                                        }
                                    }
                                }else{
                                    if($users->isDelete($data["userID"])){
                                        if($usersCount >= $userLimit){
                                            $line = $i + 1;
                                            array_push($errors, "No se ha podido añadir la línea $line - Se han alcanzado el número máximo de usuarios permitidos.");
                                        }else{
                                            $response = $users->createImport($data);
                                            if($response !== true){
                                                $line = $i + 1;
                                                array_push($errors, "Error en la línea $line - $response");
                                            }else{
                                                $usersCount++;
                                            }
                                        }
                                    }else{
                                        $response = $users->updateImport($data);
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
            }
            echo json_encode($errors);
        }else{
            echo json_encode(false);
        }
    }else{
        echo json_encode(false);
    }
?>