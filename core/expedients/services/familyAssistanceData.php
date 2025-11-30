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
        
    // Se recoge el límite de curas que habría que listar paginado
    if(isset($_GET['page_limit'])){
        $limit = intval($_GET['page_limit']);
    }else{
        $limit = intval(10);
    }

    require_once($_SESSION['basePath'] . "model/expedients.php");
    $expedients = new Expedients();
    $data = $expedients->getFamilyAssistance($_GET['q']);

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
            'incomplete_results' => false,
            'items' => $json,
            'total' => count($data)
        )
    );
?>