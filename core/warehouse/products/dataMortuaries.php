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

    if(empty($_GET) || !isset($_GET['q']) || !isset($_GET['mortuary'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/mortuaries.php");
    $mortuary = new Mortuaries;
    $data = $mortuary->searchByNameOwnCostCenter($_GET['q'], $_GET['mortuary']);

    $json = array();
    foreach($data as $mortuary){
        array_push(
            $json, 
            array(
                'ID' => $mortuary['ID'],
                'name' => $mortuary['name']
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