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

    require_once($_SESSION['basePath'] . "model/products.php");
    $products = new Products();
    $data = $products->listProductsExpedients($_GET['q']);

    $json = array();
    foreach($data as $product){
        array_push(
            $json, 
            array(
                'ID' => $product['productID'],
                'name' => $product['name']
            )
        );
    }
    
    echo json_encode(
        array(
            'incomplete_results' => false,
            'items' => $json,
            'total' => count($data)
        )
    );
?>
