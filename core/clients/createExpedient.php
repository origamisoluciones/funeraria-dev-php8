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
    require_once($_SESSION['basePath'] . "model/clients.php");

    $clients = new Clients();
    $logs = new Logs;

    $createReponse = $clients->createExpedient($_POST);
    if(!$createReponse){
        $logs->createSimple("Configuración", "Clientes - Alta", "'Error! No ha podido crear el cliente'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($createReponse === 'CIF_ERROR'){
            $logs->createSimple("Configuración", "Clientes - Alta", "'Error! No ha podido crear el cliente'");
            $response = ["cif" => "Ya existe un usuario con ese dni"];
        } else{
            $logs->createSimple("Configuración", "Clientes - Alta", "'Ha creado un cliente'");
            $response = ["success" => $createReponse];
        }
    }
    echo json_encode($response);
?>