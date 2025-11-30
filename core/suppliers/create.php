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
    require_once($_SESSION['basePath'] . "model/suppliers.php");
    
    $suppliers = new Suppliers();
    $logs = new Logs;

    $createReponse = $suppliers->create($_POST);
    if(!$createReponse){
        $logs->createSimple("Configuración", "Proveedor - Alta", "'Error! No ha podido crear el proveedor'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($createReponse === 'CIF_ERROR'){
            $logs->createSimple("Configuración", "Proveedor - Alta", "'Error! No ha podido crear el proveedor'");
            $response = ["cif" => "Ya existe un proveedor con ese CIF"];
        } else{
            $logs->createSimple("Configuración", "Proveedor - Alta", "'Ha creado un proveedor'");
            $response = ["success" => "Creado con éxito"];
        }
    }

    echo json_encode($response);
?>