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

    require($_SESSION['basePath'] . "model/assistants.php");
    $assistants = new Assistants;
    $data = $assistants->getToEmailAddressee($_GET['q']);

    $json = array();
    foreach($data as $assistant){
        array_push(
            $json, 
            array(
                'id' => $assistant['id'],
                'text' => $assistant['text']
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