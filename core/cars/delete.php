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

    $cars = new Cars;
    $logs = new Logs;
    
    if(!$cars->delete($_POST)){
        $logs->createSimple("Taller", "Vehículos - Baja", "'Error! No ha podido eliminar el vehículo'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Taller", "Vehículos - Baja", "'Ha eliminado un vehículo'");

        echo json_encode(true);
    }
?>