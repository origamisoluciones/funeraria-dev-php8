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

    require_once($_SESSION['basePath'] . "model/documentsEditor.php");
    $documentsEditor = new DocumentsEditor();
    $data = $documentsEditor->searchByName($_GET['q']);

    $json = array();
    $index = -1;
    $currentCategory = null;
    foreach($data as $elem){
        if($elem['category_id'] != $currentCategory){
            $index++;
            $currentCategory = $elem['category_id'];

            array_push(
                $json,
                array(
                    'id' => $elem['category_id'],
                    'text' => $elem['category_name'],
                    'children' => array()
                )
            );
        }

        array_push(
            $json[$index]['children'],
            array(
                'id' => $elem['ID'],
                'text' => $elem['name']
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