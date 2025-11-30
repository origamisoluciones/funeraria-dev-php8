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

    if(empty($_POST)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/timelineGarageTasks.php");
    
    $timelineGarageTasks = new TimelineGarageTasks();
    $logs = new Logs;

    if(!$timelineGarageTasks->delete($_POST)){
        $logs->createSimple("Timeline", "Tareas de Mantenimiento de Vehículos - Baja", "'Error! No ha podido eliminar la tarea de mantenimiento de vehículos'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Timeline", "Tareas de Mantenimiento de Vehículos - Baja", "'Ha eliminado una tarea de mantenimiento de vehículos'");

        echo json_encode(true);
    }
?>