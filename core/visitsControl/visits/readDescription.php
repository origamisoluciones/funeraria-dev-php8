<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath']) || !isset($_SESSION['user'])){
        http_response_code(403);
        return;
    }

    if(empty($_POST)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/visitsControl.php");
    require_once($_SESSION['basePath'] . "model/logs.php");

    $visitsControl = new VisitsControl();
    $logs = new Logs;

    $visit = $visitsControl->readVisitDescription($_POST);
    
    $logs->createSimple("Control de visitas", "Control de visitas - Descripción - Consulta", "'Ha consultado la descripción de un control de visitas'");
    
    echo json_encode($visit);
?>