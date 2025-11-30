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
    require_once($_SESSION['basePath'] . "model/timeline.php");

    $timeline = new Timeline;
    $logs = new Logs;

    $data = $_POST;
    if($data['id'] != null){
        $response = $timeline->update($data);
    }else{
        $response = $timeline->create($data);
    }

    if(!$response){
        $logs->createSimple("Configuración", "Timeline - Modificación", "'Error! No ha podido actualizar la configuración del Timeline'");
        echo json_encode(true);

    }else{
        $logs->createSimple("Configuración", "Timeline - Modificación", "'Ha actualizado la configuración del timeline'");
        echo json_encode(false);
    }
?>