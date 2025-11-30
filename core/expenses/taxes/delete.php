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
    require_once($_SESSION['basePath'] . "model/expenses.php");

    $expenses = new Expenses();
    $logs = new Logs;

    if(!$expenses->deleteTax($_POST)){
        $logs->createSimple("Salidas", "Impuestos y tasas - Baja", "'Error! No ha podido eliminar el impuesto'");
        
        echo json_encode(false);
    }else{
        $logs->createSimple("Salidas", "Impuestos y tasas - Baja", "'Error! Ha elminado un impuesto'");

        echo json_encode(true);
    }
?>