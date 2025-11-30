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
    require_once($_SESSION['basePath'] . "model/clients.php");

    $clients = new Clients();
    $logs = new Logs;

    $client = $clients->read($_POST);
    
    $logs->createSimple("Configuración", "Clientes - Consulta", "'Ha consultado un cliente'");
    
    echo json_encode($client);
?>