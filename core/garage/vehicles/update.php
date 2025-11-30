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
    require_once($_SESSION['basePath'] . "model/cars.php");

    $vehicles = new Cars();
    $logs = new Logs;

    if(!$vehicles->update($_POST)){
        $logs->createSimple("Taller", "Vehículos - Alta", "'Error! No ha podido modificar el vehículo'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Taller", "Vehículos - Alta", "'Ha modificado un vehículo'");

        echo json_encode(true);
    }
?>