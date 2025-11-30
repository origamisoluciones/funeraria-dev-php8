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

    if(empty($_POST) || !isset($_POST['assistance'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/assistances.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
    
    $logs = new Logs;
    $assistances = new Assistances();

    if(!$assistances->delete($_POST["assistance"])){
        $logs->createSimple("Asistencias", "Baja", "'Error! No ha podido eliminar la asistencia'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Asistencias", "Baja", "'Ha eliminado una asistencia'");

        echo json_encode(true);
    }
?>