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

    $id = $_POST['ID'];
    $vechice = $_POST['vehicleID'];  
    if(!$refuel->delete($id, $vechice)){
        $logs->createSimple("Refuel", "Repostaje - Eliminación", "'Error! No ha podido eliminar el repostaje'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Refuel", "Repostaje - Eliminación", "'Ha eliminado el repostaje'");

        echo json_encode(true);
    }
?>