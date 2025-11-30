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

    require_once($_SESSION['basePath'] . "model/expedients.php");

    $expedients = new Expedients();

    $expedient = $expedients->searchSummary($_POST);
    echo json_encode($expedient);

    $logs = new Logs;
    $timestamp = strtotime($_POST["date"]);
    $dmy = date("d-m-Y", $timestamp);
    $logs->createSimple("C. Servicio", "Resumen por fecha - Consulta", "'Ha consultado el resumen del " . $dmy . "'");
?>