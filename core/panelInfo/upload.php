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

    $upload_folder = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/configuration/panelInfo/". $_POST['mortuaryID'] ."/slides/";
    if(!file_exists($upload_folder)){
        mkdir($upload_folder, 0777, true);
    }
    $nombre_archivo = $_FILES['imagen']['name'];
    $tipo_archivo = $_FILES['imagen']['type'];
    $tamano_archivo = $_FILES['imagen']['size'];
    $tmp_archivo = $_FILES['imagen']['tmp_name'];
    $archivador = $upload_folder . $nombre_archivo;

    if (!move_uploaded_file($tmp_archivo, $archivador)) {    
       echo json_encode(false);
    }else{
        echo json_encode(true);
    }
?>