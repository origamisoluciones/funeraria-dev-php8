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

    $productModel = $products->readProductModel($_POST);

    if(isset($productModel[0][0]['image']) && $productModel[0][0]['image'] != null && $productModel[0][0]['image'] != '' && is_file($_SESSION['basePath'].$productModel[0][0]['image'])){
        $img = file_get_contents($_SESSION['basePath'].$productModel[0][0]['image']);
        
        if(mime_content_type($_SESSION['basePath'].$productModel[0][0]['image']) == 'image/jpeg'){ //JPEG
            $data = 'data:image/jpeg;base64,';
        }else{ //PNG
            $data = 'data:image/png;base64,';
        }
        
        $data .= base64_encode($img);
        $productModel[0][0]['img64'] = $data;
    }

    $logs->createSimple("Configuración", "Productos - Modelos - Consulta", "'Ha consultado un modelo'");
    
    echo json_encode($productModel);
?>