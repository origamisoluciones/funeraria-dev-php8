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
    if(!$orders->updateLine($_POST)){
        $logs->createSimple("Warehouse", "Pedidos - Modificación línea", "'Error! No ha podido modificar la línea de pedido " . $order['ID'] . "'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Warehouse", "Pedidos - Modificación línea", "'Ha modificado la línea de pedido " . $order['ID'] . "'");

        echo json_encode(true);
    }
?>