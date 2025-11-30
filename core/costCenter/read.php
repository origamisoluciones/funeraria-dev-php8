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
    require_once($_SESSION['basePath'] . "model/mortuaries.php");

    $mortuaries = new Mortuaries();
    $logs = new Logs;

    $mortuary = $mortuaries->readCostCenter($_POST);
    
    $logs->createSimple("Configuración", "Centros de Coste - Consulta", "'Ha consultado el centro de coste'");
    
    echo json_encode($mortuary);
?>