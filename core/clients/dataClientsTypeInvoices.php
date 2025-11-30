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
    $data = $client->searchByNameAndTypeInvoices($_GET['q'], $_GET['clientType']);

    $json = array();
    foreach($data as $client){
        if($_GET['clientType'] == 2 || $_GET['clientType'] == 3){
            array_push(
                $json, 
                array(
                    'clientID' => $client['clientID'],
                    'name' => $client['brandName'] . ' ' . $client['nif']
                )
            );
        }else{
            array_push(
                $json, 
                array(
                    'clientID' => $client['clientID'],
                    'name' => $client['nif'] . ' ' . $client['brandName']
                )
            );
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