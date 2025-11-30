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

    require_once($_SESSION['basePath'] . "model/tellmebye.php");
    require_once($_SESSION['basePath'] . "model/logs.php");

    $tellmebye = new Tellmebye;
    $logs = new Logs;

    $data = $_POST;

    echo json_encode($tellmebye->reloadDataSheet($data));

    // $updated = $tellmebye->reloadDataSheet($data);
    // if($updated){
    //     $logs->createExpedient("Expedientes", $data['expedient'], "Expedientes - Tellmebye - Recarga", "'Ha recargado la ficha de Telmebye del expediente'");
    //     echo json_encode(true);
    // }else{
    //     echo json_encode(false);
    // }
?>