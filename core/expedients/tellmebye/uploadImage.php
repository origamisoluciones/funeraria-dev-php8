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

    if(empty($_POST) || empty($_FILES)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "core/tools/security.php");

    $data = $_POST;
    $file = $_FILES['file'];
    
    $expedient = cleanStr($data['expedient']);
    $tellmebyeMortuary = cleanStr($data['tellmebyeMortuary']);

    $filename = $file['name'];
    $extension = explode('.', $filename)[count(explode('.', $filename)) - 1];
    if(strtolower($extension) != 'jpg' && strtolower($extension) != 'png' && strtolower($extension) != 'gif' && strtolower($extension) != 'jpeg'){
        echo json_encode('format');
    }else{
        $imagesDir = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/tellmebye/img";

        if(!is_dir($imagesDir)){
            mkdir($imagesDir, 0777, true);

            $fileHtaccess = fopen($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/tellmebye/img/.htaccess", 'w');
            fwrite($fileHtaccess, ' <FilesMatch ".*">
                                        Order Allow,Deny
                                        Allow from All
                                    </FilesMatch>');
            fclose($fileHtaccess);
        }else{
            foreach(scandir($imagesDir) as $index => $elem){
                if($elem != '.' && $elem != '..' && $elem != '.htaccess'){
                    unlink("$imagesDir/$elem");
                }
            }
        }

        $uploaded = move_uploaded_file($file['tmp_name'], "$imagesDir/$filename");
        if($uploaded){
            // Send to Tellmebye
            require_once($_SESSION['basePath'] . "model/tellmebye.php");

            $tellmebye = new Tellmebye($tellmebyeMortuary);

            $found = $tellmebye->getDataSheetInfoFromTellMeByeData(array('ID' => $expedient));
            if($found['general'] != null){
                $updated = $tellmebye->updateImage($found['general']['idTellmebye'], "$imagesDir/$filename");
                if($updated){
                    // Set deceased picture to true
                    $tellmebye->updateDeceasedPicture($found['general']['id']);

                    require_once($_SESSION['basePath'] . "model/logs.php");
                    $logs = new Logs;
                    $logs->createExpedient("Expedientes", $data['expedient'], "Expedientes - Tellmebye - Guardado", "'Ha modificado la imagen del difunto'");
                    
                    echo json_encode(true);
                }else{
                    echo json_encode(false);
                }
            }else{
                echo json_encode(false);
            }
        }else{
            echo json_encode(false);
        }
    }
?>