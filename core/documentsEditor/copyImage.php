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
    
    if(isset($_POST) && isset($_POST['imageName']) && isset($_POST['doc']) && isset($_POST['stamp'])){
        $imageName = cleanStr($_POST['imageName']);
        if(preg_match('/\.\.\//', $imageName)){
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

        $folder = "{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/documentEditor/$doc/img";
        if(!is_dir($folder)){
            mkdir($folder, 0777, true);

            $file = fopen("$folder/.htaccess", 'w');
            fwrite($file, ' <FilesMatch ".*">
                                Order Allow,Deny
                                Allow from All
                            </FilesMatch>');
            fclose($file);
        }
        $cont = 0;
        $folder = scandir("{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/documentEditor/$doc/img");
        foreach($folder as $file){
            if(preg_match('/^image_[0-9]+.*$/', $file)){
                $name = explode('.', $file);
                $name = explode('_', $name[0]);
                $id = $name[1];
    
                if($cont < $id){
                    $cont = $id;
                }
            }
        }

        if(!is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/tmp/documentEditor/$doc/img")){
            mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/tmp/documentEditor/$doc/img", 0777, true);

            $file = fopen($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/tmp/documentEditor/$doc/img/.htaccess", 'w');
            fwrite($file, ' <FilesMatch ".*">
                                Order Allow,Deny
                                Allow from All
                            </FilesMatch>');
            fclose($file);
        }

        $filesTmp = scandir("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/tmp/documentEditor/$doc/img");
        foreach($filesTmp as $file){
            if(preg_match("/{$stamp}--------image.*/", $file)){
                if(file_exists("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/tmp/documentEditor/$doc/img/$file")){
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

        if($cont >= 0){
            $cont++;
        }

        $imagesDir = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/obituariesImages";
        if(is_file("$imagesDir/$imageName")){
            $mimeType = mime_content_type("$imagesDir/$imageName");
            if($mimeType == 'image/jpeg'){
                $extension = 'jpg';
            }else{
                $extension = 'png';
            }
            copy("$imagesDir/$imageName", $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/tmp/documentEditor/$doc/img/{$stamp}--------image_$cont.$extension");

            echo json_encode(array(true, $cont, "resources/files/{$_SESSION['company']}/tmp/documentEditor/$doc/img/{$stamp}--------image_$cont.$extension"));
        }else{
            echo json_encode(array(false));
        }
    }else{
        echo json_encode(array(false));
    }
?>