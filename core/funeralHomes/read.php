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
    require_once($_SESSION['basePath'] . "model/funeralHomes.php");

    $funeralHomes = new FuneralHomes();
    $logs = new Logs;

    $funeralHome = $funeralHomes->read($_POST);
    
    $logs->createSimple("Configuración", "Funerarias - Consulta", "'Ha consultado una funeraria'");
    
    echo json_encode($funeralHome);
?>