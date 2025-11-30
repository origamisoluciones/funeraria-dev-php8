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
    require_once($_SESSION['basePath'] . "model/events.php");

    $events = new Events();
    $logs = new Logs;
    
    if(!$events->create($_POST)[0]){
        $logs->createSimple("Agenda", "Eventos - Alta", "'Error! No ha podido crear el evento'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Agenda", "Eventos - Alta", "'Ha creado un evento'");

        echo json_encode(true);
    }
?>