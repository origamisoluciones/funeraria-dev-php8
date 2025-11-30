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
    require_once($_SESSION['basePath'] . "model/assistances.php");

    $assistances = new Assistances;
    $logs = new Logs;

    if(!$assistances->updateSurvey($_POST)){
        $logs->createSimple("Asistencias", "Encuesta de satisfacción - Modificación", "'Error! No ha podido modificar la encuesta de satisfacción'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Asistencias", "Encuesta de satisfacción - Modificación", "'Ha modificado una encuesta de satisfacción'");

        echo json_encode(true);
    }
?>