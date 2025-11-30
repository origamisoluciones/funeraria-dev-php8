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

    require_once($_SESSION['basePath'] . "model/expedients.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
    
    $logs = new Logs;
    $expedients = new Expedients();

    $logs->createExpedient("Cloased by Death", $_POST['expedient'], "Cerrado por defunción - Consulta", "'Ha consultado los datos de un cartel de cerrado por defunción'");
    
    echo json_encode($expedients->readObituary($_POST));
?>