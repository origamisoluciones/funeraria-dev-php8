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

    $invoices = new Invoices;
    $logs = new Logs;

    $invoiceInfo = $invoices->getInvoiceExpedient($_POST['invoice']);
    $expedientID = $invoiceInfo['expedient'];

    $responseUpdate = $invoices->update($_POST);
    if(!$responseUpdate){
        $logs->createExpedient("Facturas", $expedientID, "Expedientes - Añadir pago", "'Error! No ha podido añadir un pago a la factura'");
        echo json_encode(false);
    }else{
        $amount = number_format($_POST['amountPay'], 2, '.', '');

        $logs->createExpedient("Facturas", $expedientID, "Expedientes - Añadir pago", "'Ha añadido un pago a la factura de $amount €'");
        echo json_encode($responseUpdate);
    }
   
?>