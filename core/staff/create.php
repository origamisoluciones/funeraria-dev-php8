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
    require_once($_SESSION['basePath'] . "model/staff.php");

    $staff = new Staff;
    $logs = new Logs;

    $createReponse = $staff->create($_POST);
    if(!$createReponse){
        $logs->createSimple("Configuración", "Personal - Alta", "'Error! No ha podido crear al miembro del personal'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($createReponse === 'CIF_ERROR'){
            $logs->createSimple("Configuración", "Personal - Alta", "'Error! No ha podido crear al miembro del personal'");
            $response = ["cif" => "Ya existe un miembro del personal con ese DNI"];
        } else{
            $logs->createSimple("Configuración", "Personal - Alta", "'Ha creado un nuevo miembro del personal'");
            $response = ["success" => "Creado con éxito"];
        }
    }
    echo json_encode($response);

?>