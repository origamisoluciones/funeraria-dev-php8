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
    
    if(!$expenses->updateSalary($_POST)){
        $logs->createSimple("Salidas", "Sueldos y salarios - Modificación", "'Error! No ha podido modificar el salario'");
        
        echo json_encode(false);
    }else{
        $logs->createSimple("Salidas", "Sueldos y salarios - Modificación", "'Error! Ha modificado un salario'");

        echo json_encode(true);
    }
?>