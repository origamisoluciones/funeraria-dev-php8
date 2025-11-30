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

    require_once($_SESSION['basePath'] . "model/users.php");
    $users = new Users();
    $data = $users->getUsersCleaningData($_GET['q']);

    $json = array();
    if($data != null){
        foreach($data as $choir){
            array_push(
                $json, 
                array(
                    'userID' => $choir['ID'],
                    'name' => $choir['name'] . ' ' . $choir['surname']
                )
            );
        }
    }

    echo json_encode(
        array('incomplete_results' => false,
              'items' => $json,
              'total' => count($data))
    );
?>