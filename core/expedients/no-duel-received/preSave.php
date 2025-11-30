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

    if(isset($_POST) && isset($_POST['expedient']) && isset($_POST['type']) && isset($_POST['model']) && isset($_POST['stamp'])){
        $expedient = cleanStr($_POST['expedient']);
        if(preg_match('/\.\.\//', $expedient)){
            echo json_encode(false);
            return;
        }
        $type = cleanStr($_POST['type']);
        if(preg_match('/\.\.\//', $type)){
            echo json_encode(false);
            return;
        }
        $model = cleanStr($_POST['model']);
        if(preg_match('/\.\.\//', $model)){
            echo json_encode(false);
            return;
        }
        $stamp = cleanStr($_POST['stamp']);
        if(preg_match('/\.\.\//', $stamp)){
            echo json_encode(false);
            return;
        }

        $files = "{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/$expedient";
        if(is_dir($files)){
            foreach(scandir($files) as $file){
                if(preg_match("/{$stamp}--------image.*/", $file)){
                    if(file_exists("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/$expedient/$file")){
                        $newFilename = explode('--------', $file)[1];
                        copy("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/$expedient/$file", "{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/expedients/$expedient/no-duel-received/$type/$model/img/$newFilename");
                        unlink("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/$expedient/$file");
                    }
                }
            }
        }

        echo json_encode(true);
    }else{
        echo json_encode(false);
    }
?>