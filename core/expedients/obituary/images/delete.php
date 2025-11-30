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

    if(isset($_POST) && isset($_POST['id']) && isset($_POST['expedient'])){
        require_once($_SESSION['basePath'] . "core/tools/security.php");
        
        $id = cleanStr($_POST['id']);
        $expedient = cleanStr($_POST['expedient']);

        require_once($_SESSION['basePath'] . "model/expedientsObituariesImages.php");

        $expedientsObituariesImages = new ExpedientsObituariesImages;

        $found = $expedientsObituariesImages->getNameById($id);
        if($found !== false){
            $deleted = $expedientsObituariesImages->delete($id);
            if($deleted){
                $dir = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-images";
                if(is_file("$dir/{$found[0]['name']}")){
                    unlink("$dir/{$found[0]['name']}");
                }
            }else{
                echo json_encode(false);
            }
        }else{
            echo json_encode(false);
        }
    }else{
        echo json_encode(false);
    }
?>