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
    require_once($_SESSION['basePath'] . "model/timelineFreeTasks.php");
    
    $timelineFreeTasks = new TimelineFreeTasks();
    $logs = new Logs;
    
    if(!$timelineFreeTasks->delete($_POST)){
        $logs->createSimple("Timeline", "Tareas Libres - Baja", "'Error! No ha podido eliminar la tarea libre'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Timeline", "Tareas Libres - Baja", "'Ha eliminado una tarea libre'");

        echo json_encode(true);
    }
?>