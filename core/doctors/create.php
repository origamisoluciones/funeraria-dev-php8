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
    require_once($_SESSION['basePath'] . "model/doctors.php");

    $doctors = new Doctors;
    $logs = new Logs;

    if(!$doctors->create($_POST)){
        $logs->createSimple("Configuración", "Médicos - Alta", "'Error! No ha podido crear el médico'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Médicos - Alta", "'Ha creado un médico'");

        echo json_encode(true);
    }
?>