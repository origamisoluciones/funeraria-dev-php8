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
   
    require_once($_SESSION['basePath'] . "model/assistants.php");
    require_once($_SESSION['basePath'] . "model/logs.php");

    $assistants = new Assistants;
    $logs = new Logs;

    if(!$assistants->create($_POST)){
        $logs->createSimple("Configuración", "Asistentes - Alta", "'Error! No ha podido crear el asistente'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        $logs->createSimple("Configuración", "Asistentes - Alta", "'Ha creado un asistente'");
        $response = ["success" => "Creado con éxito"];
    }
    echo json_encode($response);
?>