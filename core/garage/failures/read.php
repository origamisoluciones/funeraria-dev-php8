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
    require_once($_SESSION['basePath'] . "model/failures.php");

    $failures = new Failures();
    $logs = new Logs;

    $failure = $failures->read($_POST);
    
    $logs->createSimple("Taller", "Averías - Consulta", "'Ha consultado una avería'");
    
    echo json_encode($failure);
?>