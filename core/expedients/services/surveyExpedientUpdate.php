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
    require_once($_SESSION['basePath'] . "model/expedientsPolls.php");

    $expedientsPolls = new ExpedientsPolls();
    $logs = new Logs;

    if(!$expedientsPolls->update($_POST)){
        $logs->createSimple("Expedientes", "C.Servicio - Editar teléfono de encuesta", "'Error! No ha podido editar el teléfono'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Expedientes", "C.Servicio - Editar teléfono de encuesta", "'Ha añadido un teléfono a la encuesta'");

        echo json_encode(true);
    }
?>