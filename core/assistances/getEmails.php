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

    if(empty($_POST) || !isset($_POST['assistants'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/assistants.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
    
    $logs = new Logs;
    $assistants = new Assistants;

    $ids = '';
    foreach($_POST['assistants'] as $elem){
        $ids .= "$elem,";
    }
    $ids = substr($ids, 0, -1);
    
    $info = $assistants->getEmailsByIds($ids);
    echo json_encode($info);
?>