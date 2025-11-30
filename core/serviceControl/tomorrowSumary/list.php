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

    $expedient = $expedients->listTomorrowExpedients();
    echo json_encode($expedient);

    $logs = new Logs;
    $logs->createSimple("C. Servicio", "Resumen de mañana - Consulta", "'Ha consultado el resumen del " . date('d/m/Y', strtotime(date('Y-m-d') . ' +1 day')) . "'");
?>