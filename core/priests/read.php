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
    require_once($_SESSION['basePath'] . "model/priests.php");

    $priests = new Priests();
    $logs = new Logs;

    $priest = $priests->read($_POST);
    
    $logs->createSimple("Configuración", "Curas - Consulta", "'Ha consultado un cura'");
    
    echo json_encode($priest);
?>