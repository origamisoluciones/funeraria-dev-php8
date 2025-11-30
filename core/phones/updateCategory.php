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

    $phones = new Phones();
    $logs = new Logs;

    $category = $phones->readCategory($_POST);
    if(!$phones->updateCategory($_POST)){
        $logs->createSimple("Phones", "Teléfonos - Categorías - Modificación", "'Error! No ha podido modificar la categoría telefónica " . $category['name'] . "'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Phones", "Teléfonos - Categorías - Modificación", "'Ha modificado la categoría telefónica " . $category['name'] . "'");

        echo json_encode(true);
    }
?>