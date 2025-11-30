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

    require_once($_SESSION['basePath'] . "core/tools/security.php");

    if(isset($_POST) && isset($_POST['document']) && isset($_POST['expedient'])){
        require_once($_SESSION['basePath'] . "model/expedientsDocumentsEditor.php");

        $document = cleanStr($_POST['document']);
        if(preg_match('/\.\.\//', $document)){
            echo json_encode(false);
            return;
        }

        $expedient = cleanStr($_POST['expedient']);
        if(preg_match('/\.\.\//', $expedient)){
            echo json_encode(false);
            return;
        }

        $expedientsDocumentsEditor = new ExpedientsDocumentsEditor;
        $found = $expedientsDocumentsEditor->getDocumentById($document);
        if($found == null || empty($found)){
            echo json_encode(false);
        }else{
            $documentAssociate = $found[0]['document'];

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

            if(is_dir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/documentsEditor/' . $document)){
                rrmdir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/documentsEditor/' . $document);
            }

            $source = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/$documentAssociate/files";
            $dest = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/$expedient/documentsEditor/$document";
            if(is_dir($dest)){
                exec("rm -r $dest");
            }
            mkdir($dest, 0777, true);

            exec("cp -r $source $dest");

            $source = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/$documentAssociate/img";
            if(is_dir($source)){
                exec("cp -r $source $dest");
            }

            require_once($_SESSION['basePath'] . "model/logs.php");
            
            $logs = new Logs;
            $logs->createExpedient("Obituaries", $_POST['expedient'], "Esquelas - Recargar", "'Ha recargado el editor de los documentos del expediente'");

            echo json_encode(true);
        }
    }else{
        echo json_encode(false);
    }
?>