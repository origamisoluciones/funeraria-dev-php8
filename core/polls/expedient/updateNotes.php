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
    
    $info = $polls->getUpdateNotesExpedientResult($_POST);
    
    $logs->createExpedient("Expedientes", $_POST['ID'], "Expediente - Encuesta de Satisfacción", "'Ha actualizado las notas de los resultados de la encuesta de satisfacción'");
    
    echo json_encode($info);
?>