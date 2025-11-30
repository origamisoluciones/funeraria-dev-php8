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
    require_once($_SESSION['basePath'] . "model/priests.php");

    $priests = new Priests();
    $logs = new Logs;

    $updateReponse =$priests->update($_POST);
    if(!$updateReponse){
        $logs->createSimple("Configuración", "Curas - Modificación", "'Error! No ha podido modificar el cura'");

        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($updateReponse === 'CIF_ERROR'){
            $logs->createSimple("Configuración", "Curas - Modificación", "'Error! No ha podido modificar el cura'");

            $response = ["cif" => "Ya existe un cura con ese DNI"];
        }else{
            $logs->createSimple("Configuración", "Curas - Modificación", "'Ha modificado un cura'");

            $response = ["success" => "Modificado con éxito"];
        }
    }
    echo json_encode($response);
?>