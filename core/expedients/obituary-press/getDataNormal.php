<?php
    /**
     * Elimina un directorio de forma recursiva
     * 
     * @param string $dir Directorio
     */
    function rrmdir($dir){ 
        if(is_dir($dir)){ 
            $objects = scandir($dir);
            foreach($objects as $object){ 
                if($object != "." && $object != ".."){ 
                    if(is_dir($dir."/".$object))
                        rrmdir($dir."/".$object);
                    else
                        unlink($dir."/".$object); 
                } 
            }
            rmdir($dir); 
        } 
    }

    function copy_recursive($src, $dst) { 
        // open the source directory
        $dir = opendir($src); 
      
        // Make the destination directory if not exist
        @mkdir($dst); 
      
        // Loop through the files in source directory
        while($file = readdir($dir)){ 
            if (($file != '.') && ($file != '..')){ 
                if(is_dir($src . '/' . $file)){ 
                    // Recursively calling custom copy function
                    // for sub directory 
                    copy_recursive($src . '/' . $file, $dst . '/' . $file); 
                }else{ 
                    copy($src . '/' . $file, $dst . '/' . $file); 
                } 
            } 
        } 
      
        closedir($dir);
    } 

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

    if(isset($_POST) && isset($_POST['expedient']) && isset($_POST['type']) && isset($_POST['model'])){
        require_once($_SESSION['basePath'] . "core/tools/security.php");
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedient = cleanStr($_POST['expedient']);
        $type = cleanStr($_POST['type']);
        $model = cleanStr($_POST['model']);

        $expedients = new Expedients;
        $data = $expedients->getObituaryEditor($expedient, $type, $model)[0];
        $obituary = file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary/$type/$model/files/json.json") ? true : false;
        if($obituary){
            if(is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/$type/$model")){
                rrmdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/$type/$model");

                if(!is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/")){
                    mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/", 0777, true);
                }
                if(!is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/$type")){
                    mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/$type", 0777, true);
                }
                if(!is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/$type/$model")){
                    mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/$type/$model", 0777, true);
                }
                if(!is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/$type/$model/img")){
                    mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/$type/$model/img", 0777, true);
                }

                copy_recursive($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary/$type/$model/img", $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/$type/$model/img");
            }
        }
        echo json_encode(array($obituary, $data));
    }else{
        echo json_encode(array());
    }
?>