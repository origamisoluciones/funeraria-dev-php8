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

    require_once($_SESSION['basePath'] . "model/budgets.php");
    $budgets = new Budgets();

    echo json_encode(array('data' => $budgets->listBudgetsDatatables()));
?>