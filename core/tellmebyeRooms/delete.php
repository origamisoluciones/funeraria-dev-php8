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

    $data = $_POST;

    require_once($_SESSION['basePath'] . "model/tellmebyeRooms.php");

    $data['mortuaryTellmebye'] = cleanStr($data['mortuaryTellmebye']);

    $tellmebyeRooms = new TellmebyeRooms($data['mortuaryTellmebye']);

    $result = $tellmebyeRooms->delete($data);
    echo json_encode($result);
?>