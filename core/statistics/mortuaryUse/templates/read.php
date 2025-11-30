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

    $template = $statistics->mortuaryUseRead($_POST['ID']);
    
    $logs->createSimple("Configuración", "Estadísticas - Plantillas - Uso de Tanatorio - Consulta", "'Ha consultado una plantilla de uso de tanatorio");
    
    echo json_encode($template);
?>