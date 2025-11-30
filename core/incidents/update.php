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
    $incident = new Incidents();

    if(!$incident->update($_POST)){
        $logs->createSimple("Incidents", "Control de visitas - Incidencias - Modificación", "'Error! No ha podido modificar una incidencia'");
        echo json_encode(false);
    }else{
        $logs->createSimple("Incidents", "Control de visitas - Incidencias - Modificación", "'Ha modificado una incidencia'");
        echo json_encode(true);
    }
?>