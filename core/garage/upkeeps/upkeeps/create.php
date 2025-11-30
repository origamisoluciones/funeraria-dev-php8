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
    require_once($_SESSION['basePath'] . "model/upkeeps.php");

    $upkeeps = new Upkeeps();
    $logs = new Logs;

    $result = $upkeeps->create($_POST, true);
    if($result === 'UPKEEP_EXISTS'){
        $logs->createSimple("Upkeep", "Mantenimiento - Alta", "'Error! No ha podido crear el mantenimiento'");
        
        echo json_encode('UPKEEP_EXISTS');
    }else if($result === true){
        $logs->createSimple("Upkeep", "Mantenimiento - Alta", "'Ha creado el mantenimiento'");

        echo json_encode(true);
    } else if(!$result){
        $logs->createSimple("Upkeep", "Mantenimiento - Alta", "'Error! No ha podido crear el mantenimiento'");

        echo json_encode(false);
    }
?>