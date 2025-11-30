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
    require_once($_SESSION['basePath'] . "model/holidays.php");

    $holidays = new Holidays;
    $logs = new Logs;
    
    $logs->createSimple("Vacaciones", "Consulta", "'Ha consultado las vacaciones'");

    echo json_encode($holidays->getHolidays());
?>