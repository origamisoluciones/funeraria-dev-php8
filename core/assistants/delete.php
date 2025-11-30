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

    $assistants = new Assistants;
    $logs = new Logs;
    
    if(!$assistants->delete($_POST)){
        $logs->createSimple("Configuración", "Asistente - Baja", "'Error! No ha podido eliminar el asistente'");
        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Asistente - Baja", "'Ha eliminado un asistente'");
        echo json_encode(true);
    }
?>