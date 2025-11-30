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

    if(isset($_POST['directory'])){
        $directory = cleanStr($_POST['directory']);

        if(preg_match('/\.\.\//', $directory)){
            echo json_encode(false);
        }

        $files = $_FILES;
        if(empty($files)){
            echo json_encode(false);
        }else{
            for($i = 0; $i < count($files); $i++){
                $filename = $files['file' . $i]['name'];
                $tmp = $files['file' . $i]['tmp_name'];
                $extension = strtolower(explode('.', $filename)[count(explode('.', $filename)) - 1]);
                switch($extension){
                    case 'rar':
                    case 'zip':
                    case 'mp3':
                    case 'doc':
                    case 'docx':
                    case 'dot':
                    case 'odt':
                    case 'pdf':
                    case 'txt':
                    case 'xls':
                    case 'xlsx':
                    case 'ppt':
                    case 'pptx':
                    case 'csv':
                    case 'svg':
                    case 'bmp':
                    case 'gif':
                    case 'jpeg':
                    case 'jpg':
                    case 'png':
                    case 'psd':
                    case 'tiff':
                    case 'avi':
                    case 'flv':
                    case 'mkv':
                    case 'mpeg':
                        $cont = count(scandir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentation$directory"));
                        $name = $filename;

                        move_uploaded_file($tmp, $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentation$directory$name");
                    break;
                }
            }

            echo json_encode(true);
        }
    }else{
        echo json_encode(false);
    }
?>