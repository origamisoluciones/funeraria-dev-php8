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
    require_once($_SESSION['basePath'] . "model/budgets.php");

    $budgets = new Budgets();
    $logs = new Logs;

    $bdConsult = $budgets->create($_POST);
    if($bdConsult === false){
        $logs->createSimple("Presupuestos", "Alta", "'Error! No se ha podido crear el presupuesto'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Presupuestos", "Alta", "'Ha creado un presupuesto'");

        echo json_encode(["data" => $bdConsult]);
    }
?>