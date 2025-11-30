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

    if(empty($_POST)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/users.php");

    $users = new Users();
    $logs = new Logs;

    $data = $_POST;
    $user = $users->searchByUsername($data['username']);
    if($user > 0){
        $logs->createSimple("Configuración", "Usuarios - Alta", "'Error! No ha podido crear el usuario'");
        $response = ["username" => "username ya existe"];
       
    }else{
        $user = $users->searchByMail($data['mail']);
        if($user > 0){
            $logs->createSimple("Configuración", "Usuarios - Alta", "'Error! No ha podido crear el usuario'");
            $response = ["email" => "Email ya existe"];
        }else{
            $createReponse = $users->create($data);
            if(!$createReponse){
                $logs->createSimple("Configuración", "Usuarios - Alta", "'Error! No ha podido crear el usuario'");
                $response = ["error" => "Ha ocurrido un error"];
            }else{
                if($createReponse === 'CIF_ERROR'){
                    $logs->createSimple("Configuración", "Usuarios - Alta", "'Error! No ha podido crear el usuario'");
                    $response = ["cif" => "Ya existe un usuario con ese DNI"];
                } else{
                    $logs->createSimple("Configuración", "Usuarios - Alta", "'Ha creado un usuario'");
                    $response = ["success" => "Creado con éxito"];
                }
            }
        }
    }

    echo json_encode($response);
?>