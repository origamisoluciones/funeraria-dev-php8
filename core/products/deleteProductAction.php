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

    $data = $_POST['ID'];
    $type =  $_POST['type'];
    if(!$products->deleteProductAction($data, $type)){
        $logs->createSimple("Configuración", "Productos - Baja", "'Error! No ha podido eliminar la acción'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Productos - Baja", "'Ha eliminado una acción'");

        echo json_encode(true);
    }
?>