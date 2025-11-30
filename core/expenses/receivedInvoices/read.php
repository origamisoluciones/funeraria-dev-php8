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

    $receivedData = $expenses->readReceivedInvoice($_POST['ID']);

    $wasDelivery = $expenses->receivedInvoiceWasDelivery($_POST['ID']);
    if($wasDelivery == 1){
        $items = $expenses->getItems($_POST['ID']);

        $response = ["data" => $receivedData, "items" => $items];
    }else if($wasDelivery == 2){
        $items = $expenses->getItemsGasoil($_POST['ID']);

        $response = ["data" => $receivedData, "gasoil" => $items];
    }else{
        $invoiceIvas = $expenses->readReceivedInvoiceIvas($_POST['ID']);

        $response = ["data" => $receivedData, "ivas" => $invoiceIvas];
    }

    // Files
    $dir = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/receivedInvoices/{$_POST['ID']}";
    $files = array();
    if(is_dir($dir)){
        foreach(scandir($dir) as $elem){
            if($elem != '.' && $elem != '..'){
                array_push($files, $elem);
            }
        }
    }

    $response['files'] = $files;
    
    echo json_encode($response);

    $logs->createSimple("Salidas", "Facturas recibidas - Consulta", "'Ha consultado una factura recibida'");
?>