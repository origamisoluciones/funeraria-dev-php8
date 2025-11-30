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
    require_once($_SESSION['basePath'] . "model/prices.php");

    $prices = new Prices();
    $logs = new Logs;

    if(!$prices->delete($_POST)){
        $logs->createSimple("Configuración", "Tarifas - Baja", "'Error! No ha podido eliminar la tarifa'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Tarifas - Baja", "'Ha eliminado una tarifa'");

        echo json_encode(true);
    }
?>