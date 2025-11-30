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
    
    if(!$statistics->timesUpdate($_POST)){
        $logs->createSimple("Configuración", "Estadísticas - Plantillas - Tiempos de respuesta - Modificación", "'Error! No ha podido modificar la plantilla'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Estadísticas - Plantillas - Tiempos de respuesta - Modificación", "'Ha modificado la plantilla'");

        echo json_encode(true);
    }
?>