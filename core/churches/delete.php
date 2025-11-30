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
    
    if(!$churches->delete($_POST)){
        $logs->createSimple("Configuración", "Iglesias - Baja", "'Error! No ha podido eliminar la iglesia'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Iglesias - Baja", "'Ha eliminado la iglesia'");

        echo json_encode(true);
    }
?>