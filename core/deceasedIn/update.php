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

    $deceasedIn = new DeceasedIn();
    $logs = new Logs;

    if(!$deceasedIn->update($_POST)){
        $logs->createSimple("Configuración", "Fallecido En - Modificación", "'Error! No ha podido modificar un fallecido en'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Fallecido En - Modificación", "'Ha modificado un fallecido en'");

        echo json_encode(true);
    }
?>