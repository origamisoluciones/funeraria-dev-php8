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

    require_once($_SESSION['basePath'] . "model/statistics.php");

    $statistics = new Statistics();

    $data = $statistics->searchGeneralByName($_GET['q']);

    $json = array();
    foreach($data as $general){
        array_push($json, array(
                                'id' => $general['ID'],
                                'name' => $general['name'])
                                );
    }
    echo json_encode(
        array('incomplete_results' => false,
            'items' => $json,
            'total' => count($data)));
?>