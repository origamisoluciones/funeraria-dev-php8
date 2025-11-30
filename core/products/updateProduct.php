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

    $updateResponse = $products->updateProduct($_POST);
    if(!$updateResponse){
        $logs->createSimple("Configuración", "Productos - Modificación", "'Error! No ha podido modificar el producto'");

        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($updateResponse === 'NAME_ERROR'){
            $logs->createSimple("Configuración", "Productos - Modificación", "'Error! No ha podido modificar el producto'");

            $response = ["name" => "Ya existe un producto con ese nombre"];
        } else{
            $logs->createSimple("Configuración", "Productos - Modificación", "'Ha modificado un producto'");
            
            $response = ["success" => "Modificado con éxito"];
        }
    }

    echo json_encode($response);
?>