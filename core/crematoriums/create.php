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
    require_once($_SESSION['basePath'] . "model/crematoriums.php");

    $crematoriums = new Crematoriums();
    $logs = new Logs;

    if(!$crematoriums->create($_POST)){
        $logs->createSimple("Configuración", "Crematorios - Alta", "'Error! No ha podido crear el crematorio'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Crematorios - Alta", "'Ha creado el crematorio'");

        echo json_encode(true);
    }
?>