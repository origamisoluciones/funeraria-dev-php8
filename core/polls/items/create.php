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
    
    $createReponse = $pollsItems->create($_POST);
    if(!$createReponse){
        $logs->createSimple("Configuración", "Encuesta de Satisfacción - Preguntas - Alta", "'Error! No ha podido crear la pregunta de la encuesta de satisfacción'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        $logs->createSimple("Configuración", "Encuesta de Satisfacción - Preguntas - Alta", "'Ha creado una pregunta de la encuesta de satisfacción'");
        $response = ["success" => "Creada con éxito"];
    }
    echo json_encode($response);
?>