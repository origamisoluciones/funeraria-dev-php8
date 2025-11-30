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

    $statistics = new Statistics();

    if(!$statistics->cremationsDelete($_POST['ID'])){
        $logs = new Logs;
        $logs->createSimple("Configuración", "Estadísticas - Plantillas - Cremaciones - Baja", "'Error! No ha podido eliminar la plantilla'");

        echo json_encode(false);
    }else{
        $logs = new Logs;
        $logs->createSimple("Configuración", "Estadísticas - Plantillas - Cremaciones - Baja", "'Ha eliminado la plantilla'");

        echo json_encode(true);
    }
?>