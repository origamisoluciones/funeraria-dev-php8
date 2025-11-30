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

    require_once($_SESSION['basePath'] . "model/locations.php");
    $location = new Locations;
    $data = $location->searchByName($_GET['q']);
    
    $json = array();
    foreach($data as $location){
        array_push(
            $json, 
            array(
                'locationID' => $location['locationID'],
                'name' => $location['name'] . ' - ' . $location['postalCode']
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