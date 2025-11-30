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

    if(!$statistics->controlPanelDelete($_POST['ID'])){
        $logs->createSimple("Configuración", "Estadísticas - Plantillas - Control de Mando - Baja", "'Error! No ha podido eliminar la plantilla'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Estadísticas - Plantillas - Control de Mando - Baja", "'Ha eliminado la plantilla'");

        echo json_encode(true);
    }
?>