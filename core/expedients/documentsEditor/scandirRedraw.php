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
    
    if(isset($_POST) && isset($_POST['expedient']) && isset($_POST['doc']) && isset($_POST['stamp'])){
        $expedient = cleanStr($_POST['expedient']);
        if(preg_match('/\.\.\//', $expedient)){
            echo json_encode(false);
            return;
        }
        $doc = cleanStr($_POST['doc']);
        if(preg_match('/\.\.\//', $doc)){
            echo json_encode(false);
            return;
        }
        $stamp = cleanStr($_POST['stamp']);
        if(preg_match('/\.\.\//', $stamp)){
            echo json_encode(false);
            return;
        }

        $folder = scandir("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/expedients/$expedient/documentsEditor/$doc/img");
        $files = array();
        $cont = 0;
        foreach($folder as $file){
            if($file != '..' && $file != '.'){
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

        $filesTmp = "{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/expedientsDocumentEditor/$expedient/$doc/img";
        if(is_dir($filesTmp)){
            foreach(scandir($filesTmp) as $file){
                if(preg_match("/{$stamp}--------image.*/", $file)){
                    if(file_exists("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/tmp/expedientsDocumentEditor/$expedient/$doc/img/$file")){
                        $name = explode('--------', $file)[1];
                        $name = explode('.', $name)[0];
                        $id = $name;
    
                        $files[$id] = $file;
            
                        $contAux = explode('_', $id)[1];
                        if($cont < $contAux){
                            $cont = $contAux;
                        }
                    }
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