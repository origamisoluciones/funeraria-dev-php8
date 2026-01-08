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
    require_once($_SESSION['basePath'] . "model/expedients.php");

    $expedients = new Expedients();
    $logs = new Logs;
    $result = $expedients->createExpedient($_POST);
    
    if(isset($result['expedient'])){
        $logs->createExpedient("Expedientes", $result['expedient'], "Expedientes - Alta", "'Ha creado un expediente'");
    }else{
        $logs->createSimple("Expedientes", "Expedientes - Alta", "'Ha ocurrido un error al crear un expediente'");
    }

    echo json_encode($result);
?>