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
    require_once($_SESSION['basePath'] . "model/events.php");

    $events = new Events();
    
    echo json_encode($events->listCremations());

    $logs = new Logs;
    $logs->createSimple("Agenda", "Eventos - Cremaciones - Consulta", "'Ha consultado los eventos'");
?>