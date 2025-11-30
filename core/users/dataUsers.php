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
    $user = new Users();
    $data = $user->getUsers(isset($_GET['q']) ? $_GET['q'] : '');

    $json = array();
    if($data != null){
        foreach($data as $user){
            array_push(
                $json, 
                array(
                'userID' => $user['userID'],
                'name' => $user['name'],
                'surname' => $user['surname'],
                'username' => $user['username']
                )
            );
        }
    }
    
    echo json_encode(
        array(
            'incomplete_results' => true,
            'items' => $json,
            'total_count' => count($data)
        )
    );
?>