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

    if(empty($_GET) || !isset($_GET['q']) || !isset($_GET['cemetery']) || !isset($_GET['crematorium'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/locations.php");
    $client = new Locations;
    $data = $client->getLocationForCemeteryCrematorium($_GET['q'], $_GET['cemetery'], $_GET['crematorium']);
    
    $json = array();
    foreach($data as $location){
        array_push(
            $json, 
            array(
                'locationID' => $location['locationID'],
                'name' => $location['name'] 
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