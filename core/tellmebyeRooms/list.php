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
    require_once($_SESSION['basePath'] . "model/tellmebyeRooms.php");

    $tellmebyeDelegations = new TellmebyeDelegations;

    $delegations = $tellmebyeDelegations->get();
    
    $rooms = array();
    foreach($delegations as $delegation){
        $tellmebyeRooms = new TellmebyeRooms($delegation->id);
    
        $result = $tellmebyeRooms->get();
        foreach($result as $item){
            array_push(
                $rooms,
                array(
                    $item->id,
                    $delegation->id,
                    $delegation->name,
                    $item->name
                )
            );
        }
    }

    echo json_encode(array('data' => $rooms));
?>