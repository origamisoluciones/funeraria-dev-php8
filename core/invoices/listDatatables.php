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

    require_once($_SESSION['basePath'] . "model/invoices.php");
    $invoices = new Invoices();

    if(isset($_GET['from']) && isset($_GET['to'])){
        echo json_encode(array('data' => $invoices->listInvoicesDatatables($_GET['from'], $_GET['to'], $_GET['type'], $_GET['clientType'], $_GET['client'], $_GET['status'], $_GET['invoiceType'], $_GET['paymentMethod'], $_GET['numAccount'], $_GET['invoiceDateFilter'], $_GET['invoicePaymentFilter'])));
    }else{
        echo json_encode(array('data' => $invoices->listInvoicesDatatables(null, null, $_GET['type'], $_GET['clientType'], $_GET['client'], $_GET['status'], $_GET['invoiceType'], $_GET['paymentMethod'], $_GET['numAccount'], $_GET['invoiceDateFilter'], $_GET['invoicePaymentFilter'])));
    }
?>