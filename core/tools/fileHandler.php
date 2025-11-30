<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
    }

    /*if(!isset($_SESSION['user'])){
        http_response_code(403);
        return;
    }*/
    
    require_once($_SESSION['basePath'] . "core/tools/utils.php");

    class FileHandler{
        public function uploadFile($name, $file, $path, $extensions, $deleteOld = false){
            $utils = new Utils();

            $flag = 0;

            $targetFile = $_SESSION['basePath'] . $path . basename($file['name']);
            $oldFileName = explode(".", basename($file['name']));
            $extension = $oldFileName[count($oldFileName) - 1];

            if($deleteOld){
                foreach(glob($_SESSION['basePath'] . $path . $name . ".*") as $filename){
                    unlink($filename);
                }
            }

            if($file['size'] > intval($utils->getMaxFileSize())){
                $flag++;
                $_SESSION['errorSettingsMaxFileSize'] = false;
            }

            if(!in_array(pathinfo($targetFile, PATHINFO_EXTENSION), $extensions)){
                $flag++;
                $_SESSION['errorSettingsExtension'] = false;
            }

            if($flag == 0){
                if(!file_exists($_SESSION['basePath'] . $path)){
                    if(!mkdir($_SESSION['basePath'] . $path, 0755)){
                        $flag++;
                        $_SESSION['errorSettingsUpload'] = false;
                    }
                }

                if(!move_uploaded_file($file['tmp_name'], $_SESSION['basePath'] . $path . $name . '.' . $extension)){
                    $flag++;
                    $_SESSION['errorSettingsUpload'] = false;
                }
            }

            return array("flag" => $flag, "path" => $utils->getRoute() . $path . $name . '.' . $extension);
        }
    }
?>