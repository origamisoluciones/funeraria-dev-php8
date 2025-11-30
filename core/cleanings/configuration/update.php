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
    require_once($_SESSION['basePath'] . "model/cleaning.php");

    $cleaning = new Cleaning;
    $logs = new Logs;

    if(!$cleaning->updateType($_POST)){
        $logs->createSimple("Configuración", "Limpieza - Modificación", "'Error! No ha podido modificar el tipo de limpieza'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Limpieza - Alta", "'Ha modificado un tipo de limpieza'");

        echo json_encode(true);
    }
?>