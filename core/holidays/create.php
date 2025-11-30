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
    require_once($_SESSION['basePath'] . "model/holidays.php");

    $holidays = new Holidays;
    $logs = new Logs;

    $addResponse = $holidays->create($_POST);
    if($addResponse === "REST_DAYS_ERROR"){
        $logs->createSimple("Vacaciones", "Alta", "'Error! No ha podido crear el evento'");
        $response = ["days" => "No dispone de tantos días de vacaciones"];
    }else if($addResponse === "BIRTHDAY_ERROR"){
        $logs->createSimple("Vacaciones", "Alta", "'Error! No ha podido crear el evento'");
        $response = ["birthday" => "Ya tuvo un día libre por su cumpleaños"];
    }else{
        if($addResponse){
            $logs->createSimple("Vacaciones", "Alta", "'Ha creado un evento'");
            $response = ["success" => "Se han añadido las vacaciones"];
        }else{
            $logs->createSimple("Vacaciones", "Alta", "'Error! No ha podido crear el evento'");
            $response = ["error" => "Ha ocurrido un error"];
        }
    }
    
    echo json_encode($response);
?>