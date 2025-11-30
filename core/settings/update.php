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

    if(empty($_POST)){
        http_response_code(405);
        return;
    }
    
    require_once($_SESSION['basePath'] . "model/settings.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "core/tools/utils.php");

    $data = get_object_vars(json_decode($_POST['data']));
    $files = $_FILES;
    $settings = new Settings;
    $logs = new Logs;
    $utils = new Utils;

    foreach($data as $index => $elem){
        if(is_object($elem)){
            $times = get_object_vars($elem);
            foreach($times as $i => $e){
                $settings->setInfo($i, $e);
            }
        }else{
            if($index == 'mailPassword'){
                if($elem != ''){
                    $settings->setInfo($index, $elem);
                }
            }else{
                $settings->setInfo($index, $elem);
            }
        }
    }

    $response = true;
    if(count($files) > 0){
        foreach($files as $index => $file){
            $name = $file['name'];
            $extension = explode('.', $name)[count(explode('.', $name)) - 1];
            $type = $file['type'];
            $tmpName = $file['tmp_name'];
            $error = $file['error'];
            $size = $file['size'];

            if($error == 0){
                if($type != 'image/jpeg' && $type != 'image/png'){
                    $response = 'image';
                }else{
                    if(move_uploaded_file($tmpName, $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/settings/$index.$extension")){
                        $settings = new Settings;
                        $settings->setValue($index, $utils->getRoute() . "resources/files/{$_SESSION['company']}/settings/$index.$extension");

                        if($index == 'logo' || $index == 'backgroundObituaries'){
                            $obituariesDir = scandir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/obituaries");
                            foreach($obituariesDir as $elem){
                                if($elem != '.' && $elem != '..'){
                                    $obituaryDir = scandir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/obituaries/$elem");
                                    foreach($obituaryDir as $f){
                                        if($f != '.' && $f != '..'){
                                            if($index == 'logo' && preg_match('/logo/', $f)){
                                                unlink($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/obituaries/$elem/$f");
                                                copy($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/settings/$index.$extension", $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/obituaries/$elem/logo.$extension");
                                            }else if($index == 'backgroundObituaries' && preg_match('/background/', $f)){
                                                unlink($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/obituaries/$elem/$f");
                                                copy($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/settings/$index.$extension", $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/obituaries/$elem/background.$extension");
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }else{
                        $response = false;
                    }
                }
            }
        }
        echo json_encode($response);
    }

    if($response){
        $logs->createSimple("Configuración", "Ajustes - Modificación", "'Ha modificado los ajustes'");
    }else{
        $logs->createSimple("Configuración", "Ajustes - Modificación", "'Error! No ha podido modificar los ajustes'");
    }
    
    echo json_encode($response);
?>