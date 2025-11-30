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

    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/orders.php");

    $orders = new Orders;

    if(!$orders->update($_POST)){
        $logs = new Logs;
        $logs->createSimple("Almacén", "Pedidos - Modificación", "'Error! No ha podido modificar el pedido'");

        echo json_encode(false);
    }else{
        $logs = new Logs;
        $logs->createSimple("Almacén", "Pedidos - Modificación", "'Ha modificado un pedido'");

        echo json_encode(true);
    }
?>