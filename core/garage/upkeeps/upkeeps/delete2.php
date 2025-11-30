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
    require_once($_SESSION['basePath'] . "model/upkeeps.php");

    $upkeeps = new Upkeeps();
    $logs = new Logs;
    
    if(!$upkeeps->delete2($_POST)){
        $logs->createSimple("Garage", "Mantenimiento - Eliminación", "'Error! No ha podido eliminar el mantenimiento'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Garage", "Mantenimiento - Eliminación", "'Ha eliminado el mantenimiento'");

        echo json_encode(true);
    }
?>