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

    if(isset($_POST) && isset($_POST['expedient'])){
        $expedient = cleanStr($_POST['expedient']);
        if(preg_match('/\.\.\//', $expedient)){
            echo json_encode(false);
            return;
        }
     
        if(file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/tombstone/0/0/files/lapida.pdf")){
            echo json_encode(true);
            return;
        }else if(file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/tombstone/0/1/files/lapida.pdf")){
            echo json_encode(true);
            return;
        }else if(file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/tombstone/0/2/files/lapida.pdf")){
            echo json_encode(true);
            return;
        }
        echo json_encode(false);
        return;
    }
?>