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

    if(!$mortuaries->create($_POST)){
        $logs->createSimple("Configuración", "Casas Mortuorias - Alta", "'Error! No ha podido crear la casa mortuoria'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Casas Mortuorias - Alta", "'Ha creado una casa mortuoria'");

        echo json_encode(true);
    }
?>