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
    
    $name = $_POST['shipperName'];
    if(!$expenses->createShipper($name)){
        $logs->createSimple("Configuración", "Gestión Económica - Expedidor - Alta", "'Error! No ha podido crear el expedidor'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Gestión Económica - Expedidor - Alta", "'Ha creado un expedidor'");

        echo json_encode(true);
    }
?>