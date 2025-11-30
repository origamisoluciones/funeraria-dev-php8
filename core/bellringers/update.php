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
    require_once($_SESSION['basePath'] . "model/bellringers.php");

    $bellringers = new BellRingers;
    $logs = new Logs;

    $updateReponse = $bellringers->update($_POST);
    if(!$updateReponse){
        $logs->createSimple("Configuración", "Campaneros - Modificación", "'Error! No ha podido modificar el campanero'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($updateReponse === 'CIF_ERROR'){
            $logs->createSimple("Configuración", "Campaneros - Modificación", "'Error! No ha podido modificar el campanero'");
            $response = ["cif" => "Ya existe un campanero con ese DNI"];
        }else{
            $logs->createSimple("Configuración", "Campaneros - Modificación", "'Ha modificado un campanero'");
            $response = ["success" => "Modificado con éxito"];
        }
    }
    echo json_encode($response);
?>