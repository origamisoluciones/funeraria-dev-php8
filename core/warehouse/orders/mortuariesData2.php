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

    require_once($_SESSION['basePath'] . "model/mortuaries.php");
    $mortuary = new Mortuaries;
    $data = $mortuary->searchByName($_GET['q']);

    $json = array();
    foreach($data as $mortuary){
        array_push(
            $json, 
            array(
                'mortuaryID' => $mortuary['mortuaryID'],
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