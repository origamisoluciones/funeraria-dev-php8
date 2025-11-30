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
    require_once($_SESSION['basePath'] . "model/choirs.php");

    $choirs = new Choirs();
    $logs = new Logs;

    $createReponse = $choirs->create($_POST);
    if(!$createReponse){
        $logs->createSimple("Configuración", "Coros - Alta", "'Error! No ha podido crear el coro'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($createReponse === 'CIF_ERROR'){
            $logs->createSimple("Configuración", "Coros - Alta", "'Error! No ha podido crear el coro'");
            $response = ["cif" => "Ya existe un usuario con ese dni"];
        } else{
            $logs->createSimple("Configuración", "Coros - Alta", "'Ha creado un coro'");
            $response = ["success" => "Creado con éxito"];
        }
    }
    echo json_encode($response);
?>