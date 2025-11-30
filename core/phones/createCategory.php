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
    require_once($_SESSION['basePath'] . "model/phones.php");

    $phones = new Phones;
    $logs = new Logs;

    $data = $_POST;
    if(!$phones->createCategory($data)){
        $logs->createSimple("Phones", "Teléfonos - Categorías - Alta", "'Error! No ha podido crear la categoría " . $data['name'] . "'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Phones", "Teléfonos - Categorías - Alta", "'Ha creado la categoría " . $data['name'] . "'");

        echo json_encode(true);
    }
?>