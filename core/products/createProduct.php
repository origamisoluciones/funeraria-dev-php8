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

    $addResponse = $products->createProduct($_POST);
    if(!$addResponse){
        $logs->createSimple("Configuración", "Productos - Alta", "'Error! No ha podido crear el producto'");
        
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($addResponse === 'NAME_ERROR'){
            $logs->createSimple("Configuración", "Productos - Alta", "'Error! No ha podido crear el producto'");
            
            $response = ["name" => "Ya existe un producto con ese nombre"];
        }else{
            $logs->createSimple("Configuración", "Productos - Alta", "'Ha creado un producto'");
            
            $response = ["success" => "Creado con éxito"];
        }
    }
    echo json_encode($response);
?>