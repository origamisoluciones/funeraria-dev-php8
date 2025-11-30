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

    $template = $statistics->economicPerformanceRead($_POST['ID']);
    
    $logs->createSimple("Configuración", "Estadísticas - Plantillas - Rendimiento Económico - Consulta", "'Ha consultado una plantilla de rendimiento económico");
    
    echo json_encode($template);
?>