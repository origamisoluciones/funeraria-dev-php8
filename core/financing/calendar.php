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

    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/financing.php");

    $events = new Financings();
    $logs = new Logs;
    
    $logs->createSimple("Salidas", "Financiación - Agenda - Consulta", "'Ha consultado los eventos'");
    
    echo json_encode($events->listPaymentEvents());
?>