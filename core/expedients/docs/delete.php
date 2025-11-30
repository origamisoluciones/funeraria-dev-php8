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

    $expedientDoc = new Expedients;
    $logs = new Logs;

    $data = $_POST;
    if(isset($_POST['opt']) && $_POST['opt'] = "upload"){
        if(!$expedientDoc->deleteUpdatedDoc($data)){
            $logs->createSimple("Expedientes", "Documentación - Baja", "'Error! No ha podido borrar el documento'");
            echo json_encode(false);
        }else{
            $logs->createSimple("Expedientes", "Documentación - Baja", "'Ha borrado un documento'");
            echo json_encode(true);
        }
    }else{
        $logs->createExpedient("Expedientes", $data['expedientID'], "Expedientes - Documentación - Baja", "'" . 'Ha eliminado el documento ' . $data['nameFile'] . "'");
        if(!$expedientDoc->deleteDoc($data)){
            echo json_encode(false);
        }else{
            //Borrar documento firmado de la tabla de pdfs
            $expedientDoc->deleteSignedDocs($data['expedientID'], $data['nameFile']);
            echo json_encode(true);
        }
    }
?>