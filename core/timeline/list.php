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
    $logs = new Logs;

    require_once($_SESSION['basePath'] . "model/timeline.php");
    $timeline = new Timeline;

    $info = array();

    // Get timeline items
    $info['pendingTasks'] = $timeline->getPendingTasks($_POST['start'], $_POST['end'], $_POST['mortuary']);
    $info['departuresToday'] = $timeline->getDeparturesToday($_POST['start'], $_POST['end'], $_POST['mortuary']);
    $info['cremations'] = $timeline->getCremations($_POST['start'], $_POST['end'], $_POST['mortuary']);
    $info['personalTasks'] = $timeline->getPersonalTasks($_POST['start'], $_POST['end'], $_POST['mortuary']);

    $logs->createSimple("Timeline", "Consulta", "'Ha consultado el Timeline'");
    
    echo json_encode($info);
?>