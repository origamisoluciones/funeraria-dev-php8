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
    require_once($_SESSION['basePath'] . "model/prices.php");

    $prices = new Prices();
    $logs = new Logs;
    
    $data = $prices->read($_POST);
    
    $logs->createSimple("Configuración", "Tarifas - Consulta", "'Ha consultado una tarifa'");

    echo json_encode($data);
?>