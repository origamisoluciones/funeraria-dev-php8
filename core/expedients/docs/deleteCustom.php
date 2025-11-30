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
    require_once($_SESSION['basePath'] . "model/documentsEditor.php");

    $documentsEditor = new DocumentsEditor;
    $logs = new Logs;

    $data = $_POST;
    if(!$documentsEditor->deleteExpedient($data)){
        $logs->createExpedient("Expedientes", $data['expedientID'], "Expedientes - Documentación - Baja", "'" . 'Error al eliminar el documento ' . $data['nameFile'] . "'");
        echo json_encode(false);
    }else{
        // Delete dir
        function rrmdir($dir){ 
            if(is_dir($dir)){ 
                $objects = scandir($dir);
                foreach($objects as $object){ 
                    if($object != "." && $object != ".."){ 
                        if(is_dir($dir."/".$object))
                            rrmdir($dir."/".$object);
                        else
                            unlink($dir."/".$object); 
                    } 
                }
                rmdir($dir); 
            } 
        }
        rrmdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/{$data['expedientID']}/documentsEditor/{$data['ID']}");

        $logs->createExpedient("Expedientes", $data['expedientID'], "Expedientes - Documentación - Baja", "'" . 'Ha eliminado el documento ' . $data['nameFile'] . "'");
        echo json_encode(true);
    }
?>