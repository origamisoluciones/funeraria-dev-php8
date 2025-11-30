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

    if(empty($_POST)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/documentsEditorCategories.php");

    $documentsEditorCategories = new DocumentsEditorCategories;
    $logs = new Logs;

    $created = $documentsEditorCategories->create($_POST);
    if($created === false){
        $logs->createSimple("Configuración", "Editor documentos - Alta", "'Error! No ha podido crear la categoría de documento'");
        echo json_encode(false);
    }elseif($created === 'exists'){
        echo json_encode($created);
    }else{
        $logs->createSimple("Configuración", "Editor documentos - Alta", "'Ha creado una categoría de documento'");
        echo json_encode(true);
    }
?>