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

    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/documentsInfo.php");

    $documentsInfo = new DocumentsInfo;
    $logs = new Logs;

    $logs->createSimple("Configuración", "Documentos - Consulta", "'Ha consultado los datos de los documentos'");
    
    echo json_encode($documentsInfo->read());
?>