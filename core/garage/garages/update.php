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
    require_once($_SESSION['basePath'] . "model/garages.php");

    $garages = new Garages;
    $logs = new Logs;

    if(!$garages->update($_POST)){
        $logs->createSimple("Taller", "Talleres - Alta", "'Error! No ha podido modificar el taller'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Taller", "Talleres - Alta", "'Ha modificado un taller'");

        echo json_encode(true);
    }
?>