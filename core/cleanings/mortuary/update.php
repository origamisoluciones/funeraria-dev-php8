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

    $cleaning = new Cleaning();
    $logs = new Logs;

    $clean = $cleaning->read($_POST)[0];
    if(!$cleaning->update($_POST)){
        $logs->createSimple("Upkeep", "Registro limpieza - Modificación", "'Error! No ha podido modificar el registro de la limpieza con fecha " . $clean['date'] . "'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Upkeep", "Registro limpieza - Modificación", "'Ha modificado el registro de la limpieza con fecha  " . $clean['date'] . "'");

        echo json_encode(true);
    }
?>