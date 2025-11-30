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
    require_once($_SESSION['basePath'] . "model/gasoil.php");

    $gasoils = new Gasoil();
    $logs = new Logs;

    if($gasoils->addOrder($_POST)){
        $orderID =  $gasoils->getOrderGasoil($_POST);
        $logs->createSimple("Crematorios", "Gasoil - Crear Pedido", "'Ha creado un pedido de gasoil'");
        
        echo json_encode(["response" => true, "order" =>  $orderID]);
    }else{
        $logs->createSimple("Crematorios", "Gasoil - Crear Pedido", "'Ha ocurrido un error al crear un pedido de gasoil'");
        
        echo json_encode(["response" => false]);
    }
?>