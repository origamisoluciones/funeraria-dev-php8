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
    require_once($_SESSION['basePath'] . "model/products.php");

    $products = new Products();
    $logs = new Logs;

    $data = array();
    foreach($_POST as $name => $value){
        if(is_array($value)){
            $aux = array();
            foreach($value as $elem){
                $aux = array_merge(cleanStr($elem));
            }
            $aux2 = array($name => $aux);
            $data = array_merge($data, $aux2);
        }else{
            $aux = array($name => cleanStr($value));
            $data = array_merge($data, $aux);
        }
    }

    if(!$products->updateProductModel($data)){
        $logs->createSimple("Configuración", "Productos - Modelos - Modificación", "'Error! No ha podido modificar el modelo'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Productos - Modelos - Modificación", "'Ha modificado un modelo'");

        echo json_encode(true);
    }
?>