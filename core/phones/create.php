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
    require_once($_SESSION['basePath'] . "model/phones.php");

    $phones = new Phones;
    $logs = new Logs;

    if(!$phones->create($_POST)){
        $logs->createSimple("Teléfonos", "Alta", "'Error! No ha podido crear el registro'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Teléfonos", "Alta", "'Ha creado un registro'");

        echo json_encode(true);
    }
?>