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

    require_once($_SESSION['basePath'] . "model/deceasedIn.php");
    $deceasedIn = new DeceasedIn();
    $data = $deceasedIn->getUbicationSelect2($_GET['q']);

    $json = array();
    foreach($data as $deceasedIn){
        if($deceasedIn['location'] != '' && $deceasedIn['location'] != null){
            $name = $deceasedIn['name'] . " - " . $deceasedIn['location'];
        }else{
            $name = $deceasedIn['name'];
        }
        array_push(
            $json, 
            array(
                'deceasedInID' => $deceasedIn['deceasedInID'],
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