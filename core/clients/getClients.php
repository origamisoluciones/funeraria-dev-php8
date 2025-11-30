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

    if(empty($_GET) || !isset($_GET['q']) || !isset($_GET['clientType'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/clients.php");
    $client = new Clients;
    $data = $client->getClientByNameAndType($_GET['q'], $_GET['clientType']);
    
    $json = array();
    foreach($data as $client){
        array_push(
            $json, 
            array(
                'clientID' => $client['clientID'],
                'name' => $client['name'] . ' ' . $client['surname']
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