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
    require_once($_SESSION['basePath'] . "model/gravediggers.php");

    $gravediggers = new Gravediggers();
    $logs = new Logs;

    $createReponse = $gravediggers->create($_POST);
    if(!$createReponse){
        $logs->createSimple("Configuración", "Enterradores - Alta", "'Error! No ha podido crear el enterrador'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($createReponse === 'CIF_ERROR'){
            $logs->createSimple("Configuración", "Enterradores - Alta", "'Error! No ha podido crear el enterrador'");
            $response = ["cif" => "Ya existe un enterrador con ese DNI"];
        } else{
            $logs->createSimple("Configuración", "Enterradores - Alta", "'Ha creado un enterrador'");
            $response = ["success" => "Creado con éxito"];
        }
    }
    
    echo json_encode($response);
?>