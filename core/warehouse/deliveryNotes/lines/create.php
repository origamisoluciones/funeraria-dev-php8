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
    require_once($_SESSION['basePath'] . "model/deliveryNotes.php");

    $deliveryNotes = new DeliveryNotes();
    $logs = new Logs;

    if(!$deliveryNotes->createLine($_POST)){
        $logs->createSimple("Warehouse", "Albaranes - Alta línea", "'Error! No ha podido crear la línea de albarán'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Warehouse", "Albaranes - Alta línea", "'Ha creado la línea de albarán'");

        echo json_encode(true);
    }
?>