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

    require($_SESSION['basePath'] . "model/gravediggers.php");
    $gravediggers = new Gravediggers;
    $data = $gravediggers->getToEmailAddressee($_GET['q']);

    $json = array();
    foreach($data as $gravedigger){
        array_push(
            $json, 
            array(
                'id' => $gravedigger['id'],
                'text' => $gravedigger['text']
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