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
    require_once($_SESSION['basePath'] . "model/assistants.php");

    $logs = new Logs;
    $assistants = new Assistants;

    if(!$assistants->update($_POST)){
        $logs->createSimple("Configuración", "Asistentes - Modificación", "'Error! No ha podido modificar el asistente'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        $logs->createSimple("Configuración", "Asistentes - Modificación", "'Ha modificado un asistente'");
        $response = ["success" => "Modificado con éxito"];
    }
    echo json_encode($response);
?>