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

    $orders = new Orders;  
    $logs = new Logs;

    $created = $orders->create($_POST);
    if($created == 'deliveryPlace'){
        $logs->createSimple("Almacén", "Pedidos - Alta", "'Error! No ha podido crear el pedido'");

        echo json_encode('deliveryPlace');
    }else if(!$created){
        $logs->createSimple("Almacén", "Pedidos - Alta", "'Error! No ha podido crear el pedido'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Almacén", "Pedidos - Alta", "'Ha creado un pedido'");

        echo json_encode($created);
    }
?>