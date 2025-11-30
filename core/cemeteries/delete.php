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
    require_once($_SESSION['basePath'] . "model/cemeteries.php");

    $cemeteries = new Cemeteries();
    $logs = new Logs;

    if(!$cemeteries->delete($_POST)){
        $logs->createSimple("Configuración", "Cementerios - Baja", "'Error! No ha podido eliminar el cementerio'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Cementerios - Baja", "'Ha eliminado el cementerio'");

        echo json_encode(true);
    }
?>