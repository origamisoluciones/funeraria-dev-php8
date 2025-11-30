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
    require_once($_SESSION['basePath'] . "model/cemeteries.php");

    $cemeteries = new Cemeteries();
    $logs = new Logs;

    $cemetery = $cemeteries->read($_POST);
    
    $logs->createSimple("Configuración", "Cementerios - Consulta", "'Ha consultado un cementerio'");
    
    echo json_encode($cemetery);
?>