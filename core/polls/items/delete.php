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
    require_once($_SESSION['basePath'] . "model/pollsItems.php");

    $pollsItems = new PollsItems;
    $logs = new Logs;

    if(!$pollsItems->delete($_POST['ID'])){
        $logs->createSimple("Configuración", "Encuesta de Satisfacción - Preguntas - Baja", "'Error! No ha podido eliminar la pregunta de la encuesta de satisfacción'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Encuesta de Satisfacción - Preguntas - Baja", "'Ha eliminado una pregunta de la encuesta de satisfacción'");

        echo json_encode(true);
    }
?>