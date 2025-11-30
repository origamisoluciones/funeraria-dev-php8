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

    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/carriers.php");

    $carriers = new Carriers();
    $logs = new Logs;

    $createReponse = $carriers->create($_POST);
    if(!$createReponse){
        $logs->createSimple("Configuración", "Porteadores - Alta", "'Error! No ha podido crear el porteador'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($createReponse === 'CIF_ERROR'){
            $logs->createSimple("Configuración", "Porteadores - Alta", "'Error! No ha podido crear el porteador'");
            $response = ["cif" => "Ya existe un porteador con ese DNI"];
        } else{
            $logs->createSimple("Configuración", "Porteadores - Alta", "'Ha creado un porteador'");
            $response = ["success" => "Creado con éxito"];
        }
    }
    echo json_encode($response);
?>