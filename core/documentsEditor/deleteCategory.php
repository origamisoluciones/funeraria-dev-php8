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

    if(!$documentsEditorCategories->delete($_POST)){
        $logs->createSimple("Configuración", "Editor documentos - Baja", "'Error! No ha podido eliminar la categoría de documento'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Editor documentos - Baja", "'Ha eliminado la categoría de documento'");

        echo json_encode(true);
    }
?>