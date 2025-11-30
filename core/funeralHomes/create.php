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
    require_once($_SESSION['basePath'] . "model/funeralHomes.php");

    $funeralHomes = new FuneralHomes();
    $logs = new Logs;

    $createReponse = $funeralHomes->create($_POST);
    if(!$createReponse){
        $logs->createSimple("Configuración", "Funerarias - Alta", "'Error! No ha podido crear la funeraria'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($createReponse === 'CIF_ERROR'){
            $logs->createSimple("Configuración", "Funerarias - Alta", "'Error! No ha podido crear la funeraria'");
            $response = ["cif" => "Ya existe una funeraria con ese CIF"];
        } else{
            $logs->createSimple("Configuración", "Funerarias - Alta", "'Ha creado una funeraria'");
            $response = ["success" => true];
        }
    }
    echo json_encode($response);
?>