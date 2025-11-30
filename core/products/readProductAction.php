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
    require_once($_SESSION['basePath'] . "model/products.php");

    $products = new Products();
    $logs = new Logs;

    $product = $products->readProductAction($_POST);
    
    $logs->createSimple("Configuración", "Productos - Acciones - Consulta", "'Ha consultado una acción'");
    
    echo json_encode($product);
?>