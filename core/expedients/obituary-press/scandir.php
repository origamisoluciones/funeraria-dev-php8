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
    
    if(isset($_POST) && isset($_POST['expedient']) && isset($_POST['type']) && isset($_POST['model'])){
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

        $folder = scandir("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/$type/$model/img");
        $files = array();
        $cont = 0;
        foreach($folder as $file){
            if($file != '..' && $file != '.' && $file != 'background' && $file != '.htaccess'){
                $filename = explode('.', $file);
                $key = '';
                for($i = 0; $i < count($filename) - 1; $i++){
                    $key .= $filename[$i];
                }
                $files[$key] = $file;
            }
    
            if(preg_match('/^image_[0-9]+.*$/', $file)){
                $name = explode('.', $file);
                $name = explode('_', $name[0]);
                $id = $name[1];
    
                if($cont < $id){
                    $cont = $id;
                }
            }
        }
        if($cont >= 0){
            $cont++;
        }
        echo json_encode(array($files, $cont));
    }else{
        echo json_encode(array(null, 0));
    }
?>