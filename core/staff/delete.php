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
    require_once($_SESSION['basePath'] . "model/staff.php");

    $staff = new Staff;
    $logs = new Logs;
    
    if(!$staff->delete($_POST['id'])){
        $logs->createSimple("Taller", "Personal - Baja", "'Error! No ha podido eliminar al miembro del personal'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Taller", "Personal - Baja", "'Ha eliminado a un miembro del personal'");

        echo json_encode(true);
    }
?>