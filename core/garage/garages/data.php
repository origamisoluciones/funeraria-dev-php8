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

    require_once($_SESSION['basePath'] . "model/garages.php");
    $garage = new Garages();
    $data = $garage->searchByName($_GET['q']);

    $json = array();
    foreach($data as $garage){
        array_push(
            $json, 
            array(
                'ID' => $garage['ID'],
                'name' => $garage['name']
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