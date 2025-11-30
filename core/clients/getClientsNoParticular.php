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

    require_once($_SESSION['basePath'] . "model/clients.php");
    $client = new Clients();

    if(!isset($_GET['clientType'])){
        $data = $client->searchByNameNoParticular($_GET['q']);
    }

    $json = array();
    foreach($data as $client){
        if($client['type'] == "2" || $client['type'] == "3"){
            if($client['brandName'] != '' && $client['brandName'] != null){
                array_push(
                    $json, 
                    array(
                    'clientID' => $client['clientID'],
                    'name' => $client['brandName'] . ' - ' . $client['nif'])
                );
            }else{
                array_push(
                    $json, 
                    array(
                        'clientID' => $client['clientID'],
                        'name' => $client['name'] . ' ' . $client['surname'] . ' - ' . $client['nif']
                    )
                );
            }
        }
    }

    echo json_encode(
        array(
            'incomplete_results' => false,
            'items' => $json,
            'total' => count($data)
        )
    );
?>