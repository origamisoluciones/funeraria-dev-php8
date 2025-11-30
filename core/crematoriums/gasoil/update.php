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
    require_once($_SESSION['basePath'] . "model/gasoil.php");

    $garages = new Gasoil;
    $logs = new Logs;

    if(!$garages->update($_POST)){
        $logs->createSimple("Crematorio", "Gasoil - Modificación", "'Error! No ha podido modificar el gasoil'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Crematorio", "Gasoil - Modificación", "'Ha modificado un gasoil'");

        echo json_encode(true);
    }
?>