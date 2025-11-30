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
    require_once($_SESSION['basePath'] . "model/orders.php");

    $orders = new Orders();
    $logs = new Logs;

    $order = $orders->readLine($_POST);
    
    $logs->createSimple("Warehouse", "Pedidos - Consulta línea", "'Ha consultado la línea de pedido " . $order['ID'] . "'");
    
    echo json_encode($order);
?>