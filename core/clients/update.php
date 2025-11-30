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
    require_once($_SESSION['basePath'] . "model/clients.php");

    $clients = new Clients();
    $logs = new Logs;

    if(isset($_POST['price'])){
        if($_POST['price']){
            $updateReponse = $clients->update($_POST);

            if(!$updateReponse){
                $logs->createSimple("Configuración", "Clientes - Modificación", "'Error! No ha podido modificar el cliente'");
                $response = ["error" => "Ha ocurrido un error"];
            }else{
                if($updateReponse === 'CIF_ERROR'){
                    $logs->createSimple("Configuración", "Clientes - Alta", "'Error! No ha podido modificar el cliente'");
                    $response = ["cif" => "Ya existe un usuario con ese dni"];
                }else{
                    $logs->createSimple("Configuración", "Clientes - Modificación", "'Ha modificado un cliente'");
                    $response = ["success" => "Modificado con éxito"];
                }
            }
        }else{
            $logs->createSimple("Configuración", "Clientes - Modificación", "'Error! No ha podido modificar el cliente'");
            $response = ["error" => "Ha ocurrido un error"];
        }
    }else{
        $updateReponse = $clients->update($_POST);

        if(!$updateReponse){
            $logs->createSimple("Configuración", "Clientes - Modificación", "'Error! No ha podido modificar el cliente'");
            $response = ["error" => "Ha ocurrido un error"];
        }else{
            if($updateReponse === 'CIF_ERROR'){
                $logs->createSimple("Configuración", "Clientes - Modificación", "'Error! No ha podido modificar el cliente'");
                $response = ["cif" => "Ya existe un usuario con ese dni"];
            }else{
                $logs->createSimple("Configuración", "Clientes - Modificación", "'Ha modificado un cliente'");
                $response = ["success" => "Modificado con éxito"];
            }
        }
    }
    echo json_encode($response);
?>