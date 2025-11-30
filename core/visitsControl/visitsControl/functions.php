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

    if(empty($_POST) || !isset($_POST['type'])){
        http_response_code(405);
        return;
    }
    
    require_once($_SESSION['basePath'] . "model/visitsControl.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'updateState':
                echo json_encode(updateState($_POST));
            break;
        }
    }

    function updateState($data){
        $visit = new VisitsControl();
        return $visit->updateState($data);
    }
?>