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
    $expedients = new Expedients;

    if(isset($_GET['opt']) && $_GET['opt'] == "drivers"){
        $data = $expedients->getCarriersService(array('q' => $_GET['q'], 'fromTime' => $_GET['fromTime'], 'service' => $_GET['service']));
    }else{
        $data = $expedients->getCarriers(array('q' => $_GET['q'], 'fromTime' => $_GET['fromTime'], 'service' => $_GET['service']));
    }

    $json = array();
    if($data != null){
        foreach($data as $carrier){
            array_push(
                $json, 
                array(
                    'carrierID' => $carrier['carrierID'],
                    'name' => $carrier['name'] . ' ' . $carrier['surname'],
                    'busy' => $carrier['busy'],
                    'number' => $carrier['number']
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