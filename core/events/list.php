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

    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/events.php");

    $events = new Events;
    $logs = new Logs;

    $data = $events->list();
    foreach($data as $index => $elem){
        $data[$index]['allDay'] = $elem['allDay'] == '0' ? false : true;
    }
    
    $logs->createSimple("Agenda", "Eventos - Consulta", "'Ha consultado los eventos'");
    
    echo json_encode($data);
?>