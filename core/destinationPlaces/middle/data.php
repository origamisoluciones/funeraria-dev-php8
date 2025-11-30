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

    require_once($_SESSION['basePath'] . "model/destinationPlacesMiddles.php");
    $destinationPlacesMiddles = new DestinationPlacesMiddles();

    $data = $destinationPlacesMiddles->getUbicationSelect2($_GET['q']);

    $json = array();
    foreach($data as $places){

        if($places['location'] != '' && $places['location'] != null){
            $name = $places['name'] . " - " . $places['location'];
        }else{
            $name = $places['name'];
        }
        
        array_push(
            $json, 
            array(
                'placesID' => $places['ID'],
                'name' => $name
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