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

        if(file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documents/$document/files/documento.pdf")){
            echo json_encode(true);
        }else{
            echo json_encode(false);
        }
    }else{
        echo json_encode(false);
    }
?>