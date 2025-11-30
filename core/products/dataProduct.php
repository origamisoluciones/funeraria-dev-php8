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

    if(empty($_GET) || !isset($_GET['q'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/products.php");
    $product = new Products();
    $data = $product->searchByNameProduct($_GET['q']);

    $json = array();
    if(count($data) > 0){
        foreach($data as $product){
            array_push(
                $json, 
                array(
                    'productID' => $product['productID'],
                    'name' => $product['name']
                )
            );
        }
    }

    echo json_encode(
        array(
            'incomplete_results' => true,
            'items' => $json,
            'total_count' => count($data)
        )
    );
?>