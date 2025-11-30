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
    require_once($_SESSION['basePath'] . "model/visitsControl.php");

    $visits = new VisitsControl;
    $logs = new Logs;

    if(!$visits->updateVisitDescription($_POST)){
        $logs->createSimple("Mantenimiento", "Control de visitas - Descripción - Modificación", "'No ha podido modificar la visita'");
        
        echo json_encode(false);
    }else{
        $logs->createSimple("Mantenimiento", "Control de visitas - Descripción - Modificación", "'Ha modificado una visita'");
        
        echo json_encode(true);
    }
?>