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
    require_once($_SESSION['basePath'] . "model/failures.php");

    $failures = new Failures();
    $logs = new Logs;
    
    if(!$failures->delete($_POST)){
        $logs->createSimple("Taller", "Averías - Baja", "'Error! No ha podido eliminar la avería'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Taller", "Averías - Baja", "'Ha eliminado una avería'");

        echo json_encode(true);
    }
?>