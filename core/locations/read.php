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
    require_once($_SESSION['basePath'] . "model/locations.php");

    $locations = new Locations();
    $logs = new Logs;

    $location = $locations->read($_POST);
    
    $logs->createSimple("Configuración", "Localidades - Consulta", "'Ha consultado una localidad'");
    
    echo json_encode($location);
?>