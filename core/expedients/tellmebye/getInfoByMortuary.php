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
    
    $data = $_POST;
    $info = null;
    
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "model/tellmebyeRooms.php");
    require_once($_SESSION['basePath'] . "model/tellmebyeCameras.php");

    $mortuary = cleanStr($data['mortuary']);

    $tellmebyeRooms = new TellmebyeRooms($mortuary);
    $tellmebyeCameras = new TellmebyeCameras($mortuary);

    $info['rooms'] = $tellmebyeRooms->get();
    $info['cameras'] = $tellmebyeCameras->get();

    echo json_encode($info);
?>