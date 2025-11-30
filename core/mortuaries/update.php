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
    require_once($_SESSION['basePath'] . "model/mortuaries.php");

    $mortuaries = new Mortuaries();
    $logs = new Logs;

    if(!$mortuaries->update($_POST)){
        $logs->createSimple("Configuración", "Casas Mortuorias - Modificación", "'Error! No ha podido modificar la casa mortuoria'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Casas Mortuorias - Modificación", "'Ha modificado una casa mortuoria'");

        echo json_encode(true);
    }
?>