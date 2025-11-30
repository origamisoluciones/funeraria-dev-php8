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

    $expedients = new Expedients;
    $logs = new Logs;

    $data = $_POST;
    if(!$expedients->updateExpedientTPV($data)){
        echo json_encode(false);
        
        $logs->createExpedient("Expedientes", $data['expedientID'], "Expedientes - Modificación", "'Error! No ha podido modificar el expediente TPV'");
    }else{
        echo json_encode(true);
        
        $logs->createExpedient("Expedientes", $data['expedientID'], "Expedientes - Modificación", "'Ha modificado el expediente TPV'");
    }
?>