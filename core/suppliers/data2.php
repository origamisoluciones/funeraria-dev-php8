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

    if(empty($_GET) || !isset($_GET['q']) || !isset($_GET['product'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/suppliers.php");
    $supplier = new Suppliers();
    $data = $supplier->searchByProduct($_GET['q'], $_GET['product']);

    $json = array();
    foreach($data as $supplier){
        array_push(
            $json, 
            array(
                'supplierID' => $supplier['supplierID'],
                'name' => $supplier['name']
            )
        );
    }

    echo json_encode(
        array(
            'incomplete_results' => true,
            'items' => $json,
            'total_count' => count($data)
        )
    );
?>