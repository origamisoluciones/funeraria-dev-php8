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

    if(empty($_POST) || !isset($_POST['documentCategoryID'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/documentsEditorCategories.php");

    $documentsEditorCategories = new DocumentsEditorCategories;

    $found = $documentsEditorCategories->read($_POST);
    if($found){
        echo json_encode($found);
    }else{
        echo json_encode(false);
    }
?>