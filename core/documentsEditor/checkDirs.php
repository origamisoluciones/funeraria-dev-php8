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
    
    if(isset($_POST) && isset($_POST['document'])){
        $document = cleanStr($_POST['document']);
        if(preg_match('/\.\.\//', $document)){
            echo json_encode(false);
            return;
        }

        if(!is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documents/$document/img")){
            mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documents/$document/img", 0777, true);

            copy($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/settings/logo.png", $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documents/$document/img/logo.png");

            $file = fopen($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documents/$document/img/.htaccess", 'w');
            fwrite($file, ' <FilesMatch ".*">
                                Order Allow,Deny
                                Allow from All
                            </FilesMatch>');
            fclose($file);
        }
        echo json_encode(true);
    }else{
        echo json_encode(false);
    }
?>