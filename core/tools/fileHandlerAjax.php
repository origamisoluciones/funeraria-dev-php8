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

    class FileHandlerAjax{
        public function uploadFile($name, $file, $path, $extensions, $deleteOld, $page){
            $utils = new Utils();
            $flag = 0;

            $targetFile = $_SESSION['basePath'] . $path . basename($file['name'][0]);
            $oldFileName = explode(".", basename($file['name'][0]));
            $extension = strtolower($oldFileName[count($oldFileName) - 1]);

            $oldFile = $_SESSION['basePath'] . $path . $name . "." . $extension;
          
            // if($deleteOld){
            //     $split = explode(".", $name);
            //     $nameNoExt = "";
            //     for($i = 0; $i < count($split) - 1; $i++){
            //         $nameNoExt .= $split[$i];
            //     }
            //     foreach(glob($_SESSION['basePath'] . $path . "/" . $nameNoExt . "." . $extension) as $filename){
            //         unlink($filename);
            //     }
            // }

            if($file['size'][0] > intval($utils->getMaxFileSize())){
                $flag++;
                $_SESSION['error' . $page . 'MaxFileSize'] = false;
            }
            if(!in_array(strtolower(pathinfo($targetFile, PATHINFO_EXTENSION)), $extensions)){
                $flag++;
                $_SESSION['error' . $page . 'Extension'] = false;
            }

            if($flag == 0){
                if(!is_dir($_SESSION['basePath'] . $path)){
                    if(!mkdir($_SESSION['basePath'] . $path, 0755, true)){
                        $flag++;
                        $_SESSION['error' . $page . 'Upload'] = false;
                    }
                }

                if($flag == 0){
                    // Delete current file
                    $files = glob($_SESSION['basePath'] . $path . "*"); // get all file names
                    foreach($files as $fileFolder){ // iterate files
                        if(is_file($fileFolder)) unlink($fileFolder); // delete file
                    }
                    
                    if(!move_uploaded_file($file['tmp_name'][0], $_SESSION['basePath'] . $path . $name)){
                        $flag++;
                        $_SESSION['error' . $page . 'Upload'] = false;
                    }
                }
            }

            return array("result" => $flag, "path" => $_SESSION['basePath'] . $path . $name);
        }
    }
?>