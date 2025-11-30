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

    if(empty($_GET) || !isset($_GET['q']) || !isset($_GET['fromTime']) || !isset($_GET['service'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/expedients.php");
    $expedients = new Expedients();
    $data = $expedients->getPriests(array('q' => $_GET['q'], 'fromTime' => $_GET['fromTime'], 'service' => $_GET['service']));

    $json = array();
    if($data != null){
        foreach($data as $priest){
            array_push(
                $json, 
                array(
                    'priestID' => $priest['priestID'],
                    'name' => $priest['name'] . ' ' . $priest['surname'],
                    'parish' => $priest['parish'],
                    'busy' => $priest['busy'],
                    'number' => $priest['number']
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