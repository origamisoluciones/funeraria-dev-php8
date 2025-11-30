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
    
    if(!$pollsItems->update($_POST)){
        $logs->createSimple("Configuración", "Encuesta de Satisfacción - Preguntas -  Modificación", "'Error! No ha podido modificar la pregunta de la encuesta de satisfacción'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        $logs->createSimple("Configuración", "Encuesta de Satisfacción - Preguntas - Modificación", "'Ha modificado la pregunta de la encuesta de satisfacción'");
        $response = ["success" => "Modificado con éxito"];
    }
    echo json_encode($response);
?>