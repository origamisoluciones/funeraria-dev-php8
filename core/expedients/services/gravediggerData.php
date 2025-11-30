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

    if(empty($_GET) || !isset($_GET['q']) || !isset($_GET['service'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/expedients.php");
    $expedients = new Expedients();
    $data = $expedients->getGravediggers(array('q' => $_GET['q'], 'service' => $_GET['service']));

    $json = array();
    if($data != null){
        foreach($data as $gravedigger){
            array_push(
                $json, 
                array(
                    'priestID' => $gravedigger['gravediggerID'],
                    'name' => $gravedigger['name'],
                    'busy' => $gravedigger['busy'],
                    'number' => $gravedigger['number']
                )
            );
        }
    }

    echo json_encode(
        array(
            'incomplete_results' => false,
            'items' => $json,
            'total' => count($data)
        )
    );
?>