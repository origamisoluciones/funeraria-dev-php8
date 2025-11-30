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

    $logs = new Logs;
    $incidents = new Incidents();

    $incidentsList = $incidents->getIncidentsByVisit($_POST['visitID']);
    
    $logs->createSimple("Mantenimiento", "Control de visitas - Incidencias - Consulta", "'Ha listado las incidencias'");
    
    echo json_encode($incidentsList);
?>