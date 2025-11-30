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
    $data = $user->getCleaningUsers($_GET['q']);

    $json = array();
    if($data != null){
        foreach($data as $user){
            array_push(
                $json, 
                array(
                    'userID' => $user['ID'],
                    'name' => $user['name'],
                    'surname' => $user['surname']
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