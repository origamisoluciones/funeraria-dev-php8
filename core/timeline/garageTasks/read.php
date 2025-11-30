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

    $timelineGarageTasks = new TimelineGarageTasks;
    $logs = new Logs;

    $info = $timelineGarageTasks->read($_POST);
    if(intval($info['total_upkeeps']) > 0){
        $info['listUpkeeps'] = $timelineGarageTasks->listUpkeeps($info['upkeepID']);
    }else{
        $info['listUpkeeps'] = [];
    }
   
    $logs->createSimple("Timeline", "Tareas de Mantenimiento de Vehículos - Consulta", "'Ha consultado una tarea de mantenimiento de vehículos'");

    echo json_encode($info);
?>