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

    if(isset($_POST) && isset($_POST['document']) && isset($_POST['stamp'])){
        $document = cleanStr($_POST['document']);
        if(preg_match('/\.\.\//', $document)){
            echo json_encode(false);
            return;
        }
        $stamp = cleanStr($_POST['stamp']);
        if(preg_match('/\.\.\//', $stamp)){
            echo json_encode(false);
            return;
        }

        $files = "{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/documentEditor/$document/img";
        if(is_dir($files)){
            foreach(scandir($files) as $file){
                if(preg_match("/{$stamp}--------image.*/", $file)){
                    if(file_exists("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/documentEditor/$document/img/$file")){
                        $newFilename = explode('--------', $file)[1];

                        if(!is_dir("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/documentEditor/$document/img")){
                            mkdir("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/documentEditor/$document/img", 0777, true);
                        }

                        copy("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/documentEditor/$document/img/$file", "{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/documentEditor/$document/img/$newFilename");
                        unlink("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/documentEditor/$document/img/$file");
                    }
                }
            }
        }

        echo json_encode(true);
    }else{
        echo json_encode(false);
    }
?>