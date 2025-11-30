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
    require_once($_SESSION['basePath'] . "model/phones.php");

    $phones = new Phones;
    $logs = new Logs;
    
    $category = $phones->readCategory($_POST);
    if(!$phones->deleteCategory($_POST)){
        $logs->createSimple("Phones", "Teléfonos - Listado - Baja", "'Error! No ha podido eliminar el listado telefónico " . $category['name'] . "'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Phones", "Teléfonos - Listado - Baja", "'Ha eliminado el listado telefónico " . $category['name'] . "'");
        
        echo json_encode(true);
    }
?>