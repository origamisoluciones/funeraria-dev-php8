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
    require_once($_SESSION['basePath'] . "model/carriers.php");

    $carriers = new Carriers();
    $logs = new Logs;

    $updateReponse = $carriers->update($_POST);
    if(!$updateReponse){
        $logs->createSimple("Configuración", "Porteadores - Modificación", "'Error! No ha podido modificar el porteador'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($updateReponse === 'CIF_ERROR'){
            $logs->createSimple("Configuración", "Porteadores - Modificación", "'Error! No ha podido modificar el porteador'");
            $response = ["cif" => "Ya existe un porteador con ese DNI"];
        }else{
            $logs->createSimple("Configuración", "Porteadores - Modificación", "'Ha modificado un porteador'");
            $response = ["success" => "Modificado con éxito"];
        }
    }
    echo json_encode($response);
?>