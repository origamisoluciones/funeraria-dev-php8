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

    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/staff.php");

    $staff = new Staff;
    $logs = new Logs;

    $updateReponse = $staff->update($_POST);
    if(!$updateReponse){
        $logs->createSimple("Configuración", "Personal - Modificación", "'Error! No ha podido modificar al miembro del personal'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($updateReponse === 'CIF_ERROR'){
            $logs->createSimple("Configuración", "Personal - Modificación", "'Error! No ha podido modificar al miembro del personal'");
            $response = ["cif" => "Ya existe un miembro del personal con ese DNI"];
        }else{
            $logs->createSimple("Configuración", "Personal - Modificación", "'Ha modificado a un miembro del personal'");
            $response = ["success" => "Modificado con éxito"];
        }
    }
    echo json_encode($response);
?>