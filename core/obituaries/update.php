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

    if(!$obituaries->updateTemplate($_POST)){
        $logs->createSimple("Configuración", "Esquelas - Modificación", "'Error! No ha podido modificar la plantilla'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Esquelas - Modificación", "'Ha modificado una plantilla'");

        echo json_encode(true);
    }
?>