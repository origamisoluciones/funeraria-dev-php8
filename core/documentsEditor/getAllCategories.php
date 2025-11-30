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

    require_once($_SESSION['basePath'] . "model/documentsEditorCategories.php");
    $documentsEditorCategories = new DocumentsEditorCategories;
    $data = $documentsEditorCategories->getAll();

    $result = array();
    foreach($data as $index => $elem){
        // Gets documents by category
        $found = $documentsEditorCategories->getByCategory($elem['ID']);
        if($found != null && count($found) > 0){
            array_push(
                $result, array(
                    'ID' => $elem['ID'],
                    'name' => $elem['name'],
                    'documents' => $found
                )
            );
        }
    }

    echo json_encode($result);
?>