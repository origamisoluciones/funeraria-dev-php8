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
    require_once($_SESSION['basePath'] . "model/choirs.php");

    $choirs = new Choirs();
    $logs = new Logs;

    $choir = $choirs->read($_POST);
    
    $logs->createSimple("Configuración", "Coros - Consulta", "'Ha consultado un coro'");
    
    echo json_encode($choir);
?>