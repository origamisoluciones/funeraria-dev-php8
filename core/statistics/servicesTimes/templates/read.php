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

    $template = $statistics->servicesTimesRead($_POST['ID']);
    
    $logs->createSimple("Configuración", "Estadísticas - Plantillas - Horarios de Servicio - Consulta", "'Ha consultado una plantilla de horarios de servicio");
    
    echo json_encode($template);
?>