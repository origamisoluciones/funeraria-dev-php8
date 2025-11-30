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
    $expedient = $expedients->listTodayExpedients();
    
    $logs = new Logs;
    $logs->createSimple("C. Servicio", "Resumen de hoy - Consulta", "'Ha consultado el resumen del " . date('d/m/Y') . "'");
    
    echo json_encode($expedient);
?>