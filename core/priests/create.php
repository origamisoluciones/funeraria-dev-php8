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
    require_once($_SESSION['basePath'] . "model/priests.php");

    $priests = new Priests();
    $logs = new Logs;

    $addResponse = $priests->create($_POST);
    if(!$addResponse){
        $logs->createSimple("Configuración", "Curas - Alta", "'Error! No ha podido crear el cura'");

        $response = ["error" => "Ha ocurrido un error"];
    }if($addResponse === 'CIF_ERROR'){
        $logs->createSimple("Configuración", "Curas - Alta", "'Error! No ha podido crear el cura'");

        $response = ["cif" => "Ya existe un cura con ese DNI"];
    } else{
        $logs->createSimple("Configuración", "Curas - Alta", "'Ha creado un cura'");
        
        $response = ["success" => "Creado con éxito"];
    }
    echo json_encode($response);
?>