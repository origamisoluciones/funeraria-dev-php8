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
    require_once($_SESSION['basePath'] . "model/survey.php");

    $survey = new Survey;
    $logs = new Logs;

    $service = $survey->read($_POST);
    
    $logs->createSimple("Configuración", "Cuestionario de satisfacción - Consulta", "'Ha consultado un servicio'");
    
    echo json_encode($service);
?>