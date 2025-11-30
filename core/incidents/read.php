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

    require_once($_SESSION['basePath'] . "model/incidents.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
    
    $incidents = new Incidents();
    $logs = new Logs;

    $incident = $incidents->read($_POST);
    
    $logs->createSimple("Mantenimiento", "Control de visitas - Incidencias - Consulta", "'Ha consultado los datos de una incidencia'");
    
    echo json_encode($incident);
?>