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

    if(isset($_POST) && isset($_POST['type']) && isset($_POST['model'])){
        $type = $_POST['type'];
        $obituaryDir = scandir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/obituaries/0");
        $name = null;
        foreach($obituaryDir as $file){
            if($file != '.' && $file != '..'){
                if(preg_match('/logo/', $file)){
                    $name = $file;
                    break;
                }
            }
        }
        echo json_encode($name);
    }else{
        echo json_encode(null);
    }
?>