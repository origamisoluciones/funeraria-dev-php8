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
    require_once($_SESSION['basePath'] . "model/deceasedIn.php");

    $deceasedIn = new DeceasedIn;
    $logs = new Logs;

    if(!$deceasedIn->create($_POST)){
        $logs->createSimple("Configuración", "Fallecido en - Alta", "'Error! No ha podido crear fallecido en'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Fallecido en - Alta", "'Ha creado fallecido en'");

        echo json_encode(true);
    }
?>