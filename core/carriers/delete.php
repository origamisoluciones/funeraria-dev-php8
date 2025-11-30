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
    require_once($_SESSION['basePath'] . "model/carriers.php");

    $carriers = new Carriers();
    $logs = new Logs;
    
    if(!$carriers->delete($_POST)){
        $logs->createSimple("Configuración", "Porteadores - Baja", "'Error! No ha podido eliminar el porteador'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Porteadores - Baja", "'Ha eliminado un porteador'");

        echo json_encode(true);
    }
?>