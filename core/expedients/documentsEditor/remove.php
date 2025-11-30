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

    if(isset($_POST) && isset($_POST['expedient']) && isset($_POST['doc']) && isset($_POST['filename']) && isset($_POST['stamp'])){
        $expedient = cleanStr($_POST['expedient']);
        if(preg_match('/\.\.\//', $expedient)){
            echo json_encode(false);
            return;
        }
        $doc = cleanStr($_POST['doc']);
        if(preg_match('/\.\.\//', $doc)){
            echo json_encode(false);
            return;
        }
        $filename = cleanStr($_POST['filename']);
        if(preg_match('/\.\.\//', $filename)){
            echo json_encode(false);
            return;
        }
        $stamp = cleanStr($_POST['stamp']);
        if(preg_match('/\.\.\//', $stamp)){
            echo json_encode(false);
            return;
        }

        $files = scandir("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/expedients/$expedient/documentsEditor/$doc/img");
        foreach($files as $file){
            if(preg_match("/$filename.*/", $file)){
                if(file_exists("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/expedients/$expedient/documentsEditor/$doc/img/$file")){
                    unlink("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/expedients/$expedient/documentsEditor/$doc/img/$file");
                    break;
                }
            }
        }

        $files = "{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/$expedient";
        if(is_dir($files)){
            foreach(scandir($files) as $file){
                if(preg_match("/{$stamp}_$filename.*/", $file)){
                    if(file_exists("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/$expedient/$file")){
                        unlink("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/$expedient/$file");
                        break;
                    }
                }
            }
        }
    
        echo json_encode(true);
    }else{
        echo json_encode(false);
    }
?>