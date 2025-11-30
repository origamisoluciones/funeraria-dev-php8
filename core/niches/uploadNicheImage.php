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

    $return = Array('ok'=> true);
    $upload_folder = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/". $_POST['expedientID'] ."/docs/nicheImage/";

    if(file_exists($upload_folder)){
        $ficheros  = scandir($upload_folder);

    }else{
        mkdir($upload_folder, 0777, true);
    }

    if(count($ficheros) > 2){
        unlink($upload_folder . $ficheros[2]);
    }
    $nombre_archivo = "image.jpg";
    $tipo_archivo = $_FILES['archivo']['type'];
    $tamano_archivo = $_FILES['archivo']['size'];
    $tmp_archivo = $_FILES['archivo']['tmp_name'];
    $archivador = $upload_folder . $nombre_archivo;

    if (!move_uploaded_file($tmp_archivo, $archivador)) {    
        $return = Array('ok' => FALSE, 'msg' => "Ocurrio un error al subir el archivo. No pudo guardarse.", 'status' => 'error');
    }
?>