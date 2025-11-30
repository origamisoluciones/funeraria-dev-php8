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

    require_once($_SESSION['basePath'] . "model/cars.php");
    $vehicles = new Cars();
    $data = $vehicles->searchByName($_GET['q']);

    $json = array();
    foreach($data as $car){
        array_push(
            $json, 
            array(
                'carID' => $car['ID'],
                'name' => $car['brand'] . ' '. $car['model'] . ' - ' . $car['licensePlate']
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