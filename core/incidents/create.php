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
    require_once($_SESSION['basePath'] . "model/incidents.php");
    
    $logs = new Logs;
    $incident = new Incidents();

    if(!$incident->create($_POST)){
        echo json_encode(false);
    }else{
        echo json_encode(true);
    }
    
    $logs->createSimple("Mantenimiento", "Control de visitas - Incidencias - Alta", "'Ha creado una incidencia'");
?>