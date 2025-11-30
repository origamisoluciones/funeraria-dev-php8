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

    if(!$survey->update($_POST)){
        $logs->createSimple("Configuración", "Cuestionario de satisfacción - Modificación", "'Error! No ha podido modificar el servicio'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Cuestionario de satisfacción - Modificación", "'Ha modificado un servicio'");

        echo json_encode(true);
    }
?>