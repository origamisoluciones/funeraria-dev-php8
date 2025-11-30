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
    require_once($_SESSION['basePath'] . "model/billingSeries.php");

    $billingSeries = new BillingSeries;
    $logs = new Logs;

    $logs->createSimple("Configuración", "Expediente - Contratación - Consulta", "'Ha consultado los datos del cliente'");
    
    $invoiceYear = null;
    if(isset($_POST['invoiceYear'])){
        $invoiceYear = $_POST['invoiceYear'];
    }

    echo json_encode($billingSeries->checkSerieAndDate($_POST['expedient'], $_POST['billingSerie'], $_POST['invoiceYear']));
?>