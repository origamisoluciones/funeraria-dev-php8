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
   
    require_once($_SESSION['basePath'] . "model/workOrder.php");
    require_once($_SESSION['basePath'] . "model/logs.php");

    $workOrder = new WorkOrder;
    $logs = new Logs;

    $data = $_POST;
    $info = null;

    $info = $workOrder->getWorkOrderInfo($data);

    if($info != null){
        $logs->createExpedient("Expedientes", $data['ID'], "Expedientes - Orden de Trabajo - Consulta", "'Ha consultado la orden de trabajo del expediente'");
    }
    
    echo json_encode($info);
?>