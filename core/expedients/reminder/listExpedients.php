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

    require_once($_SESSION['basePath'] . "model/expedients.php");
    $expedient = new Expedients;
    $data = $expedient->searchByNameOrderObituary($_GET['q']);

    $json = array();
    foreach($data as $expedient){
        array_push($json,
            array(
                'expedientID' => $expedient['expedientID'],                                
                'number' => $expedient['number'] . ' - ' . $expedient['deceasedName'] . ' ' . $expedient['deceasedSurname'],
                'status' => $expedient['status']
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