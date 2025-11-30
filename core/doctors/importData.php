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
            require_once($_SESSION['basePath'] . "model/doctors.php");
            require_once($_SESSION['basePath'] . "core/tools/security.php");
        
            $doctors = new Doctors;

            $logs = new Logs;
            $logs->createSimple("Configuración", "Doctores - Importar datos", "'Ha exportado los datos de los doctores'");

            $i = 0;
            $errors = array();
            while(($line = fgetcsv($fileManager, 1000, ",")) !== FALSE){
                // $line = array_map("utf8_encode", $line);
                
                $line[0] = trim($line[0]);
                if($line[0] != ''){
                    $data = explode(';', $line[0]);

                    if(!isset($data[0]) || !isset($data[1]) || !isset($data[2]) ){
                        array_push($errors, "Número de columnas incorrecto. Las columnas son: ID, Nombre, Colegio, Email");
                        break;
                    }else{
                        if($i != 0){

                            //Reemplazamos los campos que vengan con comillas para que no rompa la consulta
                            $ID = str_replace ('"', "",$data[0]);
                            $name = str_replace ('"', "",$data[1]);
                            $college = str_replace ('"', "",$data[2]);
                            $email = str_replace ('"', "",$data[3]);

                            //Evaluamos si los campos vienen con un caracter sin codear ('�') (excel los guarda sin codificación) y en ese caso los codeamos
                            if(!preg_match('!!u', $ID)){
                                $ID = utf8_encode($ID);
                            }
                            if(!preg_match('!!u', $name)){
                                $name = utf8_encode($name);
                            }
                            if(!preg_match('!!u', $college)){
                                $college = utf8_encode($college);
                            }
                            if(!preg_match('!!u', $email)){
                                $email = utf8_encode($email);
                            }

                            $data = array(
                                'ID' => $ID,
                                'name' => $name,
                                'college' => $college,
                                'email' => $email
                            );
        
                            if($data["ID"] == ""){
                                $response = $doctors->createImport($data);
                                if($response !== true){
                                    $line = $i + 1;
                                    array_push($errors, "Error en la línea $line - $response");
                                }
                            }else{
                                if($doctors->isDelete($data["ID"])){
                                    $response = $doctors->createImport($data);
                                    if($response !== true){
                                        $line = $i + 1;
                                        array_push($errors, "Error en la línea $line - $response");
                                    }
                                }else{
                                    $response = $doctors->updateImport($data);
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