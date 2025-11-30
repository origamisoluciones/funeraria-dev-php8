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

    if(empty($_POST) || !isset($_POST['document'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/expedientsDocumentsEditor.php");

    $expedientsDocumentsEditor = new ExpedientsDocumentsEditor;

    $found = $expedientsDocumentsEditor->exists($_POST['document']);
    if($found){
        echo json_encode(true);
    }else{
        echo json_encode(false);
    }
?>