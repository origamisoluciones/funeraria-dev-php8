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

    if(empty($_FILES)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/expedients.php");

    $return = Array('ok'=>TRUE);
    $upload_folder = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/receivedInvoices/". $_POST['invoice']. "/";

    if(!file_exists($upload_folder)){
        mkdir($upload_folder, 0777, true);
    }else{
        $scan = scandir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/receivedInvoices/{$_POST['invoice']}/");
        array_shift($scan);
        array_shift($scan);
    }
    
    $nombre_archivo = $_FILES['archivo']['name'];
    $extension = explode('.', $nombre_archivo)[count(explode('.', $nombre_archivo)) - 1];
    switch(strtolower($extension)){
        case 'pdf':
            $tipo_archivo = $_FILES['archivo']['type'];
            $tamano_archivo = $_FILES['archivo']['size'];
            $tmp_archivo = $_FILES['archivo']['tmp_name'];
            $archivador = $upload_folder . $nombre_archivo;
            echo json_encode(move_uploaded_file($tmp_archivo, $archivador));
        break;
        default:
            echo json_encode('extension');
        break;
    }
?>