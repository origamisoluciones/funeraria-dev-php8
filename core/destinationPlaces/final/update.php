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
    require_once($_SESSION['basePath'] . "model/destinationPlacesFinals.php");

    $destinationPlacesFinals = new DestinationPlacesFinals();
    $logs = new Logs;

    if(!$destinationPlacesFinals->update($_POST)){
        $logs->createSimple("Configuración", "Lugar de Destino Final - Modificación", "'Error! No ha podido modificar un lugar de destino final'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Lugar de Destino Final - Modificación", "'Ha modificado un lugar de destino final'");

        echo json_encode(true);
    }
?>