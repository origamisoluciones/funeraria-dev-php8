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

    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/users.php");

    $users = new Users();

    $result = $users->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/users/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre de Usuario', 'Contraseña', 'Nombre', 'Apellidos', 'NIF', 'Dirección', 'Provincia', 'Código postal', 'Localidad', 'Email', 'Teléfonos', 'Puesto', 'Tipo de Usuario');
    fputcsv($f, $fields, $delimiter);

    foreach($result["users"] as $users){
        $types = "";
        foreach($result["usersTypes"] as $usersTypes){
            if($users["type"] == $usersTypes["userTypeID"]){
                if($types == ""){
                    $types = $usersTypes["name"];
                } else{
                    $types .= "#".$usersTypes["name"];
                }
            }
        }

        $users['userID'] = str_replace (',', " ", $users['userID']);
        $users['username'] = str_replace (',', " ", $users['username']);
        $users['password'] = '';
        $users['name'] = str_replace (',', " ", $users['name']);
        $users['surname'] = str_replace (',', " ", $users['surname']);
        $users['nif'] = str_replace (',', " ", $users['nif']);
        $users['address'] = str_replace (',', " ", $users['address']);
        $users['province'] = str_replace (',', " ", $users['province']);
        $users['locationName'] = str_replace (',', " ", $users['locationName']);
        $users['postalCode'] = str_replace (',', " ", $users['postalCode']);
        $users['mail'] = str_replace (',', " ", $users['mail']);
        $users['phones'] = str_replace (',', " ", $users['phones']);
        $users['post'] = str_replace (',', " ", $users['post']);
        $types = str_replace (',', " ", $types);

        $lineData = array(
            $users['userID'],
            $users['username'],
            $users['password'],
            $users['name'],
            $users['surname'],
            $users['nif'],
            $users['address'],
            $users['province'],
            $users['locationName'],
            $users['postalCode'],
            $users['mail'],
            $users['phones'],
            $users['post'],
            $types
        );
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Usuarios - Exportar datos", "'Ha exportado los datos de los usuarios'");
?>