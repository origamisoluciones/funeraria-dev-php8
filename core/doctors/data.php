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

    require_once($_SESSION['basePath'] . "model/doctors.php");
    $doctor = new Doctors();
    $data = $doctor->searchByName($_GET['q']);

    $json = array();
    foreach($data as $doctor){
        array_push(
            $json, 
            array(
                'ID' => $doctor['ID'],
                'name' => $doctor['name']
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