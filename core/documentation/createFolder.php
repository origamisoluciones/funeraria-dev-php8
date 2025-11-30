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

    if(isset($_POST)){
        if(isset($_POST['directory']) && isset($_POST['folder'])){
            $directory = cleanStr($_POST['directory']);
            $folder = cleanStr($_POST['folder']);
            
            if(preg_match('/\.\.\//', $directory) || preg_match('/\.\.\//', $folder)){
                echo json_encode(false);
                return;
            }

            echo json_encode(mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentation$directory$folder", 0755, true));
        }else{
            echo json_encode(false);
        }
    }else{
        echo json_encode(false);
    }
?>