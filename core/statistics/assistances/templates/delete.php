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
    $logs = new Logs;
    
    $data = $_POST;
    $template = $statistics->assistancesRead($data);
    if(!$statistics->assistancesDelete($data)){
        $logs->createSimple("Configuración", "Estadísticas - Plantillas - Asistencias - Baja", "'Error! No ha podido eliminar la plantilla " . $template['name'] . "'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Estadísticas - Plantillas - Asistencias - Baja", "'Ha eliminado la plantilla " . $template['name'] . "'");

        echo json_encode(true);
    }
?>