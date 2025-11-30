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

    $expenseFixedInfo = $expenses->readExpenseFixed($_POST);
    
    $logs->createSimple("Configuración", "Gestión Económica - Gastos fijos - Consulta", "'Ha consultado un tipo de gasto fijo'");

    echo json_encode($expenseFixedInfo);
?>