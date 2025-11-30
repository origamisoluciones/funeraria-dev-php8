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
    require_once($_SESSION['basePath'] . "model/mortuaries.php");

    $mortuaries = new Mortuaries();
    $logs = new Logs;

    if(!$mortuaries->createCostCenter($_POST)){
        $logs->createSimple("Configuración", "Centros de Coste - Alta", "'Error! No ha podido crear el centro de coste'");
        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Centros de Coste - Alta", "'Ha creado un centro de coste'");
        echo json_encode(true);
    }
?>