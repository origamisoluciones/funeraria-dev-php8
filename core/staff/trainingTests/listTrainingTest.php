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

    require_once($_SESSION['basePath'] . "model/trainingTests.php");
    require_once($_SESSION['basePath'] . "model/logs.php");

    $trainingTests = new TrainingTests();
    $logs = new Logs;

    $logs->createSimple("Configuración", "Personal - Formación - Consulta", "'Ha consultado la formación de un empleado'");
    
    echo json_encode(array('data' => $trainingTests->list($_GET['id'])));
?>