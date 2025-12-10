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
    $expedient = $expedients->listSummaryFlowers(date("Y-m-d"));
    
    $logs = new Logs;
    $logs->createSimple("C. Servicio", "Resumen de flores de hoy - Consulta", "'Ha consultado el resumen de flores del " . date('d/m/Y') . "'");
    
    echo json_encode($expedient);
?>