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
    require_once($_SESSION['basePath'] . "model/garages.php");

    $garages = new Garages();
    $logs = new Logs;

    $garage = $garages->read($_POST);
    
    $logs->createSimple("Taller", "Taller - Consulta", "'Ha consultado un taller'");
    
    echo json_encode($garage);
?>