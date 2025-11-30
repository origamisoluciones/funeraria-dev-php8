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
    
    if(!$statistics->mortuaryUseUpdate($_POST['data'])){
        $logs->createSimple("Configuración", "Estadísticas - Plantillas - Uso de Tanatorio - Modificación", "'Error! No ha podido modificar la plantilla'");
        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Estadísticas - Plantillas - Uso de Tanatorio - Modificación", "'Ha modificado la plantilla'");
        echo json_encode(true);
    }
?>