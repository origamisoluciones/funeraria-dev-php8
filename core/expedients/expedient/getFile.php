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
  
    $files = array();
    $dir = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/". $_POST['expedientID'] ."/info/";
    if(is_dir($dir)){
        foreach(scandir($dir) as $elem){
            if($elem != '.' && $elem != '..'){
                $mimeType = mime_content_type($dir . $elem);
                array_push(
                    $files, array(
                        'src' => 'data:' . $mimeType . ';base64,' . base64_encode(file_get_contents($dir . $elem)),
                        'name' => $elem
                    )
                );
            }
        }
    }

    echo json_encode($files);
?>