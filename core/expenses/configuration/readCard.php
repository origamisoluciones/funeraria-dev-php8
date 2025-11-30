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

    $creditCardInfo = $expenses->readCreditCard($_POST);
    
    $logs->createSimple("Configuración", "Gestión Económica - Tarjetas de crédito/débito - Consulta", "'Ha consultado una tarjeta de crédito/débito'");

    echo json_encode($creditCardInfo);
?>