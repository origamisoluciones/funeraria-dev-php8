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

    $updateReponse = $suppliers->update($_POST);
    if(!$updateReponse){
        $logs->createSimple("Configuración", "Proveedores - Modificación", "'Error! No ha podido modificar el proveedor'");
        $response = ["error" => "Ha ocurrido un error"];
    }else{
        if($updateReponse === 'CIF_ERROR'){
            $logs->createSimple("Configuración", "Proveedores - Modificación", "'Error! No ha podido modificar el proveedor'");
            $response = ["cif" => "Ya existe un proveedor con ese CIF"];
        }else{
            $logs->createSimple("Configuración", "Proveedores - Modificación", "'Ha modificado un proveedor'");
            $response = ["success" => "Modificado con éxito"];
        }
    }

    echo json_encode($response);
?>