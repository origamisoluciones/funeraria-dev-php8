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

    $response = $expenses->createBankAccount($_POST);
    if($response === 'number_exists'){
        echo json_encode("number_exists");
    }elseif(!$response){
        $logs->createSimple("Configuración", "Gestión Económica - Cuentas bancarias - Alta", "'Error! No ha podido crear la cuenta bancaria'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Gestión Económica - Cuentas bancarias - Alta", "'Ha creado una cuenta bancaria'");

        echo json_encode(true);
    }
?>