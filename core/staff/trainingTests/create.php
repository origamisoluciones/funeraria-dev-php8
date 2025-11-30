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
    require_once($_SESSION['basePath'] . "model/trainingTests.php");

    $trainingTests = new TrainingTests;
    $logs = new Logs;
    
    $addResponse = $trainingTests->create($_POST);
    
    if(!$addResponse){
        $logs->createSimple("Configuración", "Personal - Formación - Alta", "'Error! No ha podido crear el curso al empleado'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Personal - Formación - Alta", "'Ha creado un curso para un empleado'");

        echo json_encode($addResponse);
    }
?>