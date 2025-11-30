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

    if(empty($_GET) || !isset($_GET['q']) || !isset($_GET['t']) || !isset($_GET['expedient'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/assistants.php");
    $assistants = new Assistants;
    $data = $assistants->getAssistantsControl($_GET['q'], $_GET['expedient']);

    $json = array();
    if($data != null){
        foreach($data as $assistant){
            array_push(
                $json, 
                array(
                    'ID' => $assistant['ID'],
                    'name' => $assistant['name']
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