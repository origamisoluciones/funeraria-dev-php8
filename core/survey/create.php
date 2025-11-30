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

    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/survey.php");

    $survey = new Survey;
    $logs = new Logs;

    if(!$survey->create($_POST)){
        $logs->createSimple("Configuración", "Cuestionario de satisfacción - Alta", "'Error! No ha podido crear el servicio'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Cuestionario de satisfacción - Alta", "'Ha creado un servicio'");

        echo json_encode(true);
    }
?>