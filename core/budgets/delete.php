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
  
    $deleted = $budgets->delete($_POST['expedient'], $_POST['budget']);

    $logs->createSimple("Presupuestos", "Baja", "'Ha eliminado un presupuesto'");
    
    echo json_encode($deleted);
?>