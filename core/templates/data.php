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

    if(empty($_GET) || !isset($_GET['q']) || !isset($_GET['expedient'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/templates.php");
    $templates = new Templates();
    $data = $templates->searchByName($_GET['expedient'], $_GET['q']);

    $json = array();
    foreach($data as $supplier){
        array_push(
            $json, 
            array(
                'ID' => $supplier['templateID'],
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