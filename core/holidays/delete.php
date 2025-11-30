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
    require_once($_SESSION['basePath'] . "model/holidays.php");

    $holidays = new Holidays;
    $logs = new Logs;
    
    if(!$holidays->delete($_POST['ID'])){
        $logs->createSimple("Vacaciones", "Baja", "'Error! No ha podido eliminar el evento'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Vacaciones", "Baja", "'Ha eliminado un evento'");

        echo json_encode(true);
    }
?>