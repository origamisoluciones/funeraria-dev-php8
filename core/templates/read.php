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
    require_once($_SESSION['basePath'] . "model/templates.php");

    $templates = new Templates();
    $logs = new Logs;

    $template = $templates->read($_POST);
    
    $logs->createSimple("Configuración", "Plantillas - Consulta", "'Ha consultado una plantilla'");
    
    echo json_encode($template);
?>