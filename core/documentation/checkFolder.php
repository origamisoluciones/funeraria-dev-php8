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

    if(isset($_POST['folder']) && isset($_POST['directory'])){
        $folder = cleanStr($_POST['folder']);
        $directory = cleanStr($_POST['directory']);

        if(preg_match('/\.\.\//', $directory)){
            echo json_encode(false);
            return;
        }

        $scan = scandir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentation$directory");
        array_shift($scan);
        array_shift($scan);

        $flag = true;
        foreach($scan as $elem){
            if($elem == $folder){
                $flag = false;
                break;
            }
        }

        echo json_encode($flag);
    }else{
        echo json_encode(false);
    }
?>