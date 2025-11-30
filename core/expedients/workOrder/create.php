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
    require_once($_SESSION['basePath'] . "model/workOrder.php");

    $workOrder = new WorkOrder();
    $logs = new Logs;
    
    $result = $workOrder->create($_POST);
    
    $logs->createExpedient("Expedientes", $_POST['expedient'], "Expedientes - Orden de Trabajo - Creación", "'Ha creado una Orden de Trabajo'");

    echo json_encode($result);
?>