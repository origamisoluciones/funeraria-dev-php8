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

    if(isset($_POST['directory'])){
        $directory = cleanStr($_POST['directory']);

        if(preg_match('/\.\.\//', $directory)){
            http_response_code(405);
            return;
        }

        $scan = scandir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentation$directory");
        array_shift($scan);
        array_shift($scan);

        $items = array();
        foreach($scan as $elem){
            if(is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentation$directory/$elem")){
                array_push($items, array('folder', $elem, filemtime($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentation$directory/$elem")));
            }
        }
        foreach($scan as $elem){
            if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentation$directory/$elem")){
                array_push($items, array('file', $elem, filemtime($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentation$directory/$elem")));
            }
        }
        echo json_encode($items);
    }else{
        http_response_code(405);
        return;
    }
?>