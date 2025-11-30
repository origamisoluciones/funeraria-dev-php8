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

    if(isset($_POST) && isset($_POST['doc']) && isset($_POST['filename']) && isset($_POST['stamp'])){
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

        if(is_dir("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/documentEditor/$doc/img")){
            $files = scandir("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/documentEditor/$doc/img");
            foreach($files as $file){
                if(preg_match("/$filename.*/", $file)){
                    if(file_exists("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/documentEditor/$doc/img/$file")){
                        unlink("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/documentEditor/$doc/img/$file");
                        break;
                    }
                }
            }
        }

        if(is_dir("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/documentEditor/$doc/img")){
            $files = "{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/documentEditor/$doc/img";
            if(is_dir($files)){
                foreach(scandir($files) as $file){
                    if(preg_match("/{$stamp}--------$filename.*/", $file)){
                        if(file_exists("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/documentEditor/$doc/img/$file")){
                            unlink("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/documentEditor/$doc/img/$file");
                            break;
                        }
                    }
                }
            }
        }
    
        echo json_encode(true);
    }else{
        echo json_encode(false);
    }
?>