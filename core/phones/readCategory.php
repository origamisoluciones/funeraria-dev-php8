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
    
    $logs->createSimple("Phones", "Teléfonos - Categorías - Consulta", "'Ha consultado la categoría " . $category['name'] . "'");
    
    echo json_encode($category);
?>