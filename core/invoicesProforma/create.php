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
    require_once($_SESSION['basePath'] . "model/invoicesProforma.php");

    $invoicesProforma = new InvoicesProforma();
    $logs = new Logs;

    $reponse = $invoicesProforma->create($_POST);
    if(!$reponse[0]){
        $logs->createSimple("Facturas", "Alta", "'Error! No ha podido crear la factura proforma'");

        echo json_encode(false);
    }else{
        $logs->createExpedient("Facturas", $reponse[1], "Expedientes - Contratación - Generar factura proforma", "'Ha generado una factura proforma'");

        echo json_encode(
            array(
                'invoiceID' => $reponse[2],
                'invoiceNumber' => str_replace ("/", "-", $reponse[3]),
            )
        );
    }
?>