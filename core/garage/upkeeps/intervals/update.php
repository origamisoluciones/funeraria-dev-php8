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

    if(!$upkeeps->updateInterval($_POST)){
        $logs->createSimple("Taller", "Vehículos - Intervalos de mantenimiento - Modificación", "'Error! No ha podido modificar el intervalo de mantenimiento'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Taller", "Vehículos - Intervalos de mantenimiento - Modificación", "'Ha modificado un intervalo de mantenimiento'");

        echo json_encode(true);
    }
?>