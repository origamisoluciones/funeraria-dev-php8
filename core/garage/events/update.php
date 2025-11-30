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

    if(!$upkeeps->updateEvent($_POST)){
        $logs->createSimple("Taller", "Agenda - Consulta", "'Error! No ha podido modificar el evento'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Taller", "Agenda - Consulta", "'Ha modificado un evento'");

        echo json_encode(true);
    }
?>