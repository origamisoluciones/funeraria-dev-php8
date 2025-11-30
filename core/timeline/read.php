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

    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/timeline.php");
    
    $logs = new Logs;
    $timeline = new Timeline;

    $info = $timeline->read();

    $logs->createSimple("Configuración", "Timeline - Consulta", "'Ha consultado la configuración del Timeline'");
    
    echo json_encode($info);
?>