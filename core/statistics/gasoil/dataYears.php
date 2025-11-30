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

    require_once($_SESSION['basePath'] . "model/statistics.php");

    $statistics = new Statistics();

    $data = $statistics->searchGasoilYearsByName();

    $json = array();
    foreach($data as $gasoilYear){
        array_push($json, array(
                                'id' => $gasoilYear['mounth'],
                                'name' => $gasoilYear['mounth'])
                                );
    }
    echo json_encode(
        array('incomplete_results' => false,
            'items' => $json,
            'total' => count($data)));
?>