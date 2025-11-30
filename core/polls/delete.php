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
    require_once($_SESSION['basePath'] . "model/polls.php");

    $polls = new Polls;
    $logs = new Logs;
    
    if(!$polls->delete($_POST)){
        $logs->createSimple("Configuración", "Encuesta de satisfacción - Baja", "'Error! No ha podido eliminar la encuesta de satisfacción'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Encuesta de satisfacción - Baja", "'Ha eliminado una encuesta de satisfacción'");

        echo json_encode(true);
    }
?>