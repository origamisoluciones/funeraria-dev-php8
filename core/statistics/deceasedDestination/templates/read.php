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

    $template = $statistics->deceseadedDestinationRead($_POST['ID']);
    
    $logs->createSimple("Configuración", "Estadísticas - Plantillas - Destino de Difuntos - Consulta", "'Ha consultado una plantilla de destino de difuntos");
    
    echo json_encode($template);
?>