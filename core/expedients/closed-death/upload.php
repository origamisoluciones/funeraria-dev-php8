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

    if(isset($_POST) && isset($_POST['expedient']) && isset($_POST['type']) && isset($_POST['model']) && isset($_POST['cont']) && isset($_POST['stamp'])){
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

        $stamp = cleanStr($_POST['stamp']);
        if(preg_match('/\.\.\//', $stamp)){
            echo json_encode(false);
            return;
        }

        $cont = $_POST['cont'];
        $file = $_FILES['file'];

        $filename = $file['name'];
        $extension = explode('.', $filename)[count(explode('.', $filename)) - 1];
        if(strtolower($extension) != 'jpg' && strtolower($extension) != 'png' && strtolower($extension) != 'gif' && strtolower($extension) != 'jpeg'){
            echo json_encode('format');
        }else{
            $obituaryDir = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/closed-death/$type/$model/img";
            if(is_dir($obituaryDir)){
                if(!is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/tmp")){
                    mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/tmp", 0777, true);
                }
                if(!is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/tmp/$expedient")){
                    mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/tmp/$expedient", 0777, true);

                    $fileHtaccess = fopen($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/tmp/$expedient/.htaccess", 'w');
                    fwrite($fileHtaccess, ' <FilesMatch ".*">
                                                Order Allow,Deny
                                                Allow from All
                                            </FilesMatch>');
                    fclose($fileHtaccess);
                }
                $uploaded = move_uploaded_file($file['tmp_name'], $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/tmp/$expedient/{$stamp}--------image_$cont.$extension");

                echo json_encode(array(true, $cont, "resources/files/{$_SESSION['company']}/tmp/$expedient/{$stamp}--------image_$cont.$extension"));
            }else{
                echo json_encode(array(false));
            }
        }
    }else{
        echo json_encode(false);
    }
?>