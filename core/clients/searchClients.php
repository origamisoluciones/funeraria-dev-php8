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

    if(empty($_POST)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/clients.php");
    $client = new Clients;
    $data = $client->getSearchClient($_POST);
    
    echo json_encode( 
        [
            "status" => 0,
            "data" => $data
        ]
    );
?>