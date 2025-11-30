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
    require_once($_SESSION['basePath'] . "model/obituaries.php");

    $obituaries = new Obituaries;
    $logs = new Logs;

    $obituary = $obituaries->readTemplate($_POST['ID']);
    
    $logs->createSimple("Configuración", "Esquelas - Consulta", "'Ha consultado una plantilla de esquela'");
    
    echo json_encode($obituary);
?>