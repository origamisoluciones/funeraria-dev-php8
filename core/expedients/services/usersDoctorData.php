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
    $expedients = new Expedients();
    $data = $expedients->getUsersDoctor($_GET['q']);

    $json = array();
    if($data != null){
        foreach($data as $user){
            array_push(
                $json, 
                array(
                    'userID' => $user['userID'],
                    'name' => $user['name'], 
                    'surname' => $user['surname']
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