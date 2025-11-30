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

    require_once($_SESSION['basePath'] . "model/settings.php");
    $settings = new Settings;

    require_once($_SESSION['basePath'] . "model/timeline.php");
    $timeline = new Timeline;

    $info = array();

    // Get timeline settings and company setted
    $info = $timeline->getSettings();
    $info['company'] = $settings->getCompany();
    
    echo json_encode($info);
?>