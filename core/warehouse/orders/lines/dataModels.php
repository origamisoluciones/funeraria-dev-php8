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

    if(empty($_GET) || !isset($_GET['q']) || !isset($_GET['product']) || !isset($_GET['supplier'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/products.php");
    $product = new Products;
    $data = $product->searchByNameModelAndSupplier($_GET['q'], $_GET['product'], $_GET['supplier']);

    $json = array();
    if(count($data) > 0){
        foreach($data as $product){
            array_push(
                $json,
                array(
                    'productModelID' => $product['productModelID'],
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