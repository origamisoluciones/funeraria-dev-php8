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
    require_once($_SESSION['basePath'] . "model/expedients.php");

    $expedients = new Expedients();

    $data = array();
    foreach($_POST as $name => $value){
        $aux = array($name => cleanStr($value));
        $data = array_merge($data, $aux);
    }

    /**
     * Elimina un directorio de forma recursiva
     * 
     * @param string $dir Directorio
     */
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

    if(is_dir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/obituary/' . $data['type'])){
        rrmdir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $data['expedient'] . '/obituary/' . $data['type']);
    }

    require_once($_SESSION['basePath'] . "model/logs.php");
    
    $logs = new Logs;
    $logs->createExpedient("Obituaries", $_POST['expedient'], "Esquelas - Recargar", "'Ha recargado el editor de la esquela'");

    echo json_encode(true);
?>