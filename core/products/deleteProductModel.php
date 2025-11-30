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

    if(!$products->deleteProductModel($_POST)){
        $logs->createSimple("Configuración", "Productos - Modelos - Baja", "'Error! No ha podido eliminar el modelo'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Productos - Modelos - Baja", "'Ha eliminado un modelo'");

        echo json_encode(true);
    }
?>