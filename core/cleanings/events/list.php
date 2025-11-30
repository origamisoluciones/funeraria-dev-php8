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
    require_once($_SESSION['basePath'] . "model/cleaning.php");

    $cleaning = new Cleaning;
    
    echo json_encode($cleaning->listEvents());

    $logs = new Logs;
    $logs->createSimple("Mantenimiento", "Agenda - Consulta", "'Ha consultado los eventos'");
?>