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
    require_once($_SESSION['basePath'] . "model/emails.php");

    $emails = new Emails;
    $logs = new Logs;
    
    if(!$emails->delete($_POST)){
        $logs->createSimple("Configuración", "Correos - Baja", "'Error! No ha podido eliminar el correo'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Correos - Baja", "'Ha eliminado un correo'");

        echo json_encode(true);
    }
?>