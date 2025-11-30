<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
    }

    if(!isset($_SESSION['user']) || $_SESSION['company'] != '3' || $_SESSION['user'] != '100'){
        http_response_code(403);
        return;
    }

    if(empty($_POST)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/updates.php");
    $updates = new Updates;

    $updateInfo = $updates->read($_POST);
    echo json_encode($updateInfo);
?>