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
    require_once($_SESSION['basePath'] . "model/destinationPlacesMiddles.php");

    $destinationPlacesMiddles = new DestinationPlacesMiddles();
    $logs = new Logs;

    if(!$destinationPlacesMiddles->create($_POST)){
        $logs->createSimple("Configuración", "Lugar de Destino Intermedio - Alta", "'Error! No ha podido crear un lugar de destino intermedio'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Lugar de Destino Intermedio - Alta", "'Ha creado lugar de destino intermedio'");

        echo json_encode(true);
    }
?>