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
    require_once($_SESSION['basePath'] . "model/refuel.php");

    $refuel = new Refuel();
    $logs = new Logs;

    if(!$refuel->update($_POST)){
        $logs->createSimple("Refuel", "Repostaje - Modificación", "'Error! No ha podido modificar el repostaje'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Refuel", "Repostaje - Modificación", "'Ha modificado el repostaje'");

        echo json_encode(true);
    }
?>