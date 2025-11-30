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

    if(empty($_FILES)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "core/tools/fileHandlerAjax.php");
    require_once($_SESSION['basePath'] . "model/products.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");

    $file = $_FILES["files"];

    $productID = $_GET['productID'];
    $productModelID = $_GET['productModelID'];

    $name = $file['name'][0];
    $extension = explode(".", $name);
    $extension = strtolower($extension[count($extension) - 1]);

    $productID = cleanStr($productID);
    $productModelID = cleanStr($productModelID);

    $fileHandlerAjax = new FileHandlerAjax();
    $upload = $fileHandlerAjax->uploadFile("modelo." . $extension, $file, 
                                           "resources/files/{$_SESSION['company']}/products/". $productID ."/models/". $productModelID . "/", 
                                           array("jpg", "png"), false, "Products");

    $products = new Products();
    $product = $products->updateFileProductModel(array("productModelID" => $productModelID, 
                                                       "name" => "resources/files/{$_SESSION['company']}/products/" . $productID . "/models/" . $productModelID . "/modelo." . $extension));

    echo json_encode($upload['path']);
?>