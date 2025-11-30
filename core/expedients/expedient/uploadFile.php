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

    $dirFolder = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/". $_POST['expedientID'] ."/info/";
    if(!file_exists($dirFolder)){
        mkdir($dirFolder, 0777, true);
    }
    $fileName = $_POST['docName'];
    $extension = explode('.', $fileName)[count(explode('.', $fileName)) - 1];
    switch(strtolower($extension)){
        case 'jpeg':
        case 'jpg':
        case 'png':
            $fileTemp = $_FILES['archivo']['tmp_name'];
            $filePath = $dirFolder . $fileName;

            echo json_encode(move_uploaded_file($fileTemp, $filePath));
        break;
        default:
            echo json_encode('extension');
        break;
    }
?>