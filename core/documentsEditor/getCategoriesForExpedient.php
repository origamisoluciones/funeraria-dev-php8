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

    if(empty($_POST) || !isset($_POST['expedient'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/documentsEditor.php");
    $documentsEditor = new DocumentsEditor;
    $data = $documentsEditor->getCategoriesByExpedient($_POST['expedient']);
    echo json_encode($data);
?>