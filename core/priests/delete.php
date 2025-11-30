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
    require_once($_SESSION['basePath'] . "model/priests.php");

    $priests = new Priests();
    $logs = new Logs;
    
    if(!$priests->delete($_POST)){
        $logs->createSimple("Configuración", "Curas - Baja", "'Error! No ha podido eliminar el cura'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Curas - Baja", "'Ha eliminado un cura'");

        echo json_encode(true);
    }
?>