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

    $reponse = $invoices->anuled($_POST);
    $expedient = $_POST['expedient'];
    if(!$reponse['status']){
        $logs->createSimple("Facturas", "Anulación factura en AET", "'Error! No ha podido anular la factura en la AET'");

        echo json_encode($reponse);
    }else{
        $logs->createExpedient("Facturas", $expedient, "Expedientes - Contratación - Anular factura en AET", "'Ha anulado la factura'");

        echo json_encode($reponse);
    }
?>