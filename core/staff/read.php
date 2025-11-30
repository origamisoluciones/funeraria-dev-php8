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

    $logs->createSimple("Configuración", "Personal - Consulta", "'Ha consultado un miembro del personal'");
    
    echo json_encode($staff->read($_POST['id']));
?>