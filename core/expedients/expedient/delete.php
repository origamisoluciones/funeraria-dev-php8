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

    $expedientID = $_POST['expedientID'];

    $hasInvoice = $expedients->hasInvoice($expedientID);
    if($hasInvoice){
        $result = $expedients->deleteExpedient($_POST);
        if($result[0]){
            $logs->createExpedient("Expedientes", $expedientID, "Expedientes - Baja", "'Ha eliminado el expediente'");
            echo json_encode($result);
        }else{
            $logs->createExpedient("Expedientes", $expedientID, "Expedientes - Baja", "'Error! Ha ocurrido un error al eliminar el expediente'");
            echo json_encode($result);
        }
    }else{
        echo json_encode(array(true, 'has_invoice'));
    }
?>