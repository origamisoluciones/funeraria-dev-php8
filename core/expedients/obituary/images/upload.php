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
    
    if(empty($_FILES)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/expedientsObituariesImages.php");

    $expedientsObituariesImages = new ExpedientsObituariesImages;

    $expedient = cleanStr($_POST['expedientID']);

    $dir = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-images";
    if(!file_exists($dir)){
        mkdir($dir, 0777, true);

        $file = fopen("$dir/.htaccess", 'w');
        fwrite($file, ' <FilesMatch ".*">
                            Order Allow,Deny
                            Allow from All
                        </FilesMatch>');
        fclose($file);
    }
    
    $success = true;
    $time = time();
    foreach($_FILES as $elem){
        $aux = explode('.', $elem['name']);
        $filename = '';
        foreach($aux as $i => $item){
            if($i < count($aux) - 1){
                $filename .= $item;
            }
        }
        $extension = $aux[count($aux) - 1];

        $uploaded = move_uploaded_file($elem['tmp_name'], "$dir/{$filename}_{$time}.$extension");
        if($uploaded){
            $found = $expedientsObituariesImages->getMainByExpedient($expedient);
            $main = empty($found) ? 1 : 0;

            $created = $expedientsObituariesImages->create($expedient, "{$filename}_{$time}.$extension", $main, $time);
            if(!$created){
                $success = false;
            }
        }

        $time++;
    }

    echo json_encode($success);
?>