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
    
    if(!$clients->delete($_POST)){
        $logs->createSimple("Configuración", "Clientes - Baja", "'Error! No ha podido eliminar el cliente'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Clientes - Baja", "'Ha eliminado un cliente'");
        echo json_encode(true);
    }
?>