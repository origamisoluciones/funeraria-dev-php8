<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath']) || !isset($_SESSION['user'])){
        http_response_code(403);
        return;
    }

    if(empty($_POST)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/assistances.php");
    
    $assistances = new Assistances();
    $logs = new Logs;

    $assistance = $assistances->create($_POST);
    if($assistance[0]){
        $logs->createSimple("Asistencias", "Alta", "'Ha creado una asistencia'");

        echo json_encode($assistance[1]);
    }else{
        $logs->createSimple("Asistencias", "Alta", "'Error! No se ha podido crear la asistencia'");

        echo json_encode("null");
    }
?>