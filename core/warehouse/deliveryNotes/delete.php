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

    $deliveryNotes = new DeliveryNotes;
    $logs = new Logs;
    
    if(!$deliveryNotes->delete($_POST)){
        $logs->createSimple("Almacén", "Albaranes - Baja", "'Error! No ha podido eliminar el albarán'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Almacén", "Albaranes - Baja", "'Ha eliminado un albarán'");

        echo json_encode(true);
    }
?>