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
    require_once($_SESSION['basePath'] . "model/bellringers.php");

    $bellringers = new BellRingers;
    $logs = new Logs;

    $createResponse = $bellringers->create($_POST);
    if(!$createResponse){
        $logs->createSimple("Configuración", "Campaneros - Alta", "'Error! No ha podido crear el campanero'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($createResponse === 'CIF_ERROR'){
            $logs->createSimple("Configuración", "Campaneros - Alta", "'Error! No ha podido crear el campanero'");
            $response = ["cif" => "Ya existe un campanero con ese DNI"];
        } else{
            $logs->createSimple("Configuración", "Campaneros - Alta", "'Ha creado un campanero'");
            $response = ["success" => "Creado con éxito"];
        }
    }
    echo json_encode($response);
?>