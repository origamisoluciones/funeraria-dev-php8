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

    $id = $_POST['ID'];
    $name = $_POST['shipperName'];
    if(!$expenses->updateShipper($id, $name)){
        $logs->createSimple("Configuración", "Gestión Económica - Expedidor - Modificación", "'Error! No ha podido modificar el expedidor'");
        
        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Gestión Económica - Expedidor - Modificación", "'Error! Ha modificado un expedidor'");

        echo json_encode(true);
    }
?>