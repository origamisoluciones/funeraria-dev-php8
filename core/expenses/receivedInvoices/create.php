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

    $expenses = new Expenses;
    $logs = new Logs;

    if(isset($_POST["items"])){
        $addResponse =  $expenses->createReceivedInvoiceDelivery($_POST);
    } else{
        $addResponse =  $expenses->createReceivedInvoice($_POST);
    }

    if(!$addResponse){
        $logs->createSimple("Salidas", "Facturas recibidas - Alta", "'Error! No ha podido crear la factura recibida'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Salidas", "Facturas recibidas - Alta", "'Ha creado una factura recibida'");

        echo json_encode($addResponse);
    }
?>