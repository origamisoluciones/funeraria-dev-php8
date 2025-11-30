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
    require_once($_SESSION['basePath'] . "model/statistics.php");

    $statistics = new Statistics;
    $logs = new Logs;

    $template = $statistics->assistancesRead($_POST);
    
    $logs->createSimple("Configuración", "Estadísticas - Plantillas - Asistencias - Consulta", "'Ha consultado la plantilla " . $template['name'] . "'");
    
    echo json_encode($template);
?>