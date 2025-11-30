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

    $return = Array('ok'=>TRUE);
    $expedient = cleanStr($_POST['expedientID']);
    if(preg_match('/\.\.\//', $expedient)){
        echo json_encode(false);
        return;
    }
    $upload_folder = $_SESSION['basePath'] . "resources/files/expedients/$expedient/docs/deceasedImage/";

    $ficheros  = scandir($upload_folder);
    if(count($ficheros) > 2){
        unlink($upload_folder . $ficheros[2]);
    }
    if(!file_exists($upload_folder)){
        mkdir($upload_folder, 0777, true);
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