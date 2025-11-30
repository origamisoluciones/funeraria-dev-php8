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
    require_once($_SESSION['basePath'] . "model/churches.php");

    $churches = new Churches;
    $logs = new Logs;

    if(!$churches->update($_POST)){
        $logs->createSimple("Configuración", "Iglesias - Modificación", "'Error! No ha podido modificar la iglesia'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Iglesias - Modificación", "'Ha modificado una iglesia'");

        echo json_encode(true);
    }
?>