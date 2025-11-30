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
    require_once($_SESSION['basePath'] . "model/invoices.php");

    $invoices = new Invoices();
    $logs = new Logs;

    $response = $invoices->create($_POST);
    if(!$response['status']){
        $logs->createSimple("Facturas", "Alta", "'Error! No ha podido crear la factura'");

        echo json_encode($response);
    }else{
        $logs->createExpedient("Facturas", $response['expedientID'], "Expedientes - Contratación - Generar factura", "'Ha generado la factura'");

        echo json_encode(
            array(
                'status' => true,
                'invoiceID' => $response['invoiceID'],
                'invoiceNumber' => $response['invoiceNumber'],
                'invoiceRectifiedID' => $response['invoiceRectifiedID'],
                'invoiceRectifiedNumber' => $response['invoiceRectifiedNumber'],
                'invoiceRectifiedNumHiring' => $response['invoiceRectifiedNumHiring'],
            )
        );
    }
?>