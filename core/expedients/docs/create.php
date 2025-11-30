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
    require_once($_SESSION['basePath'] . "model/expedients.php");

    $expedientDoc = new Expedients();
    $logs = new Logs;

    $data = $_POST;
    if(isset($_POST['opt']) && $_POST['opt'] == 'upload'){
        if(!$expedientDoc->uploadDoc($data)){
            $logs->createSimple("Expedientes", "Documentación - Subida", "'Error! No ha podido subir el documento'");

            echo json_encode(false);
        }else{
            $logs->createSimple("Expedientes", "Documentación - Subida", "'Ha subido un documento'");

            echo json_encode(true);
        }
    }else{
        if(!$expedientDoc->createDoc($data)){
            $logs->createExpedient("Expedientes", $data['expedientID'], "Expedientes - Documentación - Alta", "'" . 'Error! No ha podido crear el documento ' . $data['nameFile'] . "'");
            echo json_encode(false);
        }else{
            $logs->createExpedient("Expedientes", $data['expedientID'], "Expedientes - Documentación - Alta", "'" . 'Ha creado el documento ' . $data['nameFile'] . "'");
            echo json_encode(true);
        }
    }
?>