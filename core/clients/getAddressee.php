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

    require($_SESSION['basePath'] . "model/clients.php");
    $clients = new Clients;
    $data = $clients->getToEmailAddressee($_GET['q']);

    $json = array();
    foreach($data as $client){
        array_push(
            $json, 
            array(
                'id' => $client['id'],
                'text' => $client['text']
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