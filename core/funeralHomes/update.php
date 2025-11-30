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
    require_once($_SESSION['basePath'] . "model/funeralHomes.php");

    $funeralHomes = new FuneralHomes();
    $logs = new Logs;

    $updateReponse = $funeralHomes->update($_POST);
    if(!$updateReponse){
        $logs->createSimple("Configuración", "Funerarias - Modificación", "'Error! No ha podido modificar la funeraria'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($updateReponse === 'CIF_ERROR'){
            $logs->createSimple("Configuración", "Funerarias - Modificación", "'Error! No ha podido modificar la funeraria'");
            $response = ["cif" => "Ya existe una funeraria con ese CIF"];
        }else{
            $logs->createSimple("Configuración", "Funerarias - Modificación", "'Ha modificado una funeraria'");
            $response = ["success" => "Modificado con éxito"];
        }
    }
    echo json_encode($response);
?>