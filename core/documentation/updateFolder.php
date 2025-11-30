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
        if(isset($_POST['directory']) && isset($_POST['folder']) && isset($_POST['oldFolder'])){
            $directory = cleanStr($_POST['directory']);
            if(preg_match('/\.\.\//', $directory)){
                echo json_encode(false);
                return;
            }
            $oldFolder = cleanStr($_POST['oldFolder']);
            if(preg_match('/\.\.\//', $oldFolder)){
                echo json_encode(false);
                return;
            }
            $folder = cleanStr($_POST['folder']);
            if(preg_match('/\.\.\//', $folder)){
                echo json_encode(false);
                return;
            }

            require_once($_SESSION['basePath'] . "model/documentation.php");

            $documentation = new Documentation;
            $password = $documentation->getPassword($directory, $oldFolder);
            if($password != null){
                $documentation->create($directory, $folder, $password);
            }
            $documentation->unsetPassword($directory, $oldFolder);

            echo json_encode(rename($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentation$directory$oldFolder", $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentation$directory$folder"));
        }else{
            echo json_encode(false);
        }
    }else{
        echo json_encode(false);
    }
?>