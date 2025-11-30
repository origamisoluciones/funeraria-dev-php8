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

    require_once($_SESSION['basePath'] . "model/tellmebyeDelegations.php");

    $tellmebyeDelegations = new TellmebyeDelegations;

    $data = $tellmebyeDelegations->get();
    
    $json = array();
    foreach($data as $delegation){
        array_push(
            $json, 
            array(
                'id' => $delegation->id,
                'name' => $delegation->name
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