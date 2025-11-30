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
        
    if(isset($_GET['page_limit'])){
        $limit = intval($_GET['page_limit']);
    }else{
        $limit = intval(10);
    }

    require_once($_SESSION['basePath'] . "model/cars.php");
    $car = new Cars();
    $data = $car->searchByLicensePlate($_GET['q']);

    $json = array();
    foreach($data as $car){
        if($car['brand'] == null){
            $car['brand'] = '';
        }
        if($car['model'] == null){
            $car['model'] = '';
        }
        if($car['licensePlate'] == null){
            $car['licensePlate'] = '';
        }
        array_push(
            $json, 
            array(
                'carID' => $car['ID'],
                'name' => $car['licensePlate'],
                'brand' => $car['brand'],
                'model' => $car['model']
            )
        );
    }

    if(isset($_GET['load_other']) && $_GET['load_other'] == '1'){
        array_push(
            $json, 
            array(
                'carID' => '0',
                'name' => 'Otro',
                'brand' => '',
                'model' => ''
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