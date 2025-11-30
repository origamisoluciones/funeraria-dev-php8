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

    $documentsEditorCategories = new DocumentsEditorCategories();
    $logs = new Logs;

    $cemetery = $documentsEditorCategories->read($_POST);
    
    $logs->createSimple("Configuración", "Editor documentos - Consulta", "'Ha consultado una categoría de documento'");
    
    echo json_encode($cemetery);
?>