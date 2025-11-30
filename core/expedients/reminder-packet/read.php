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

    $expedients = new Expedients();
    $logs = new Logs;

    
    $logs->createExpedient("Reminder Packet", $_POST['expedient'], "Recordatorio (Sobre) - Consulta", "'Ha consultado los datos de un sobre recordatorio'");
    echo json_encode($expedients->readObituary($_POST));
?>