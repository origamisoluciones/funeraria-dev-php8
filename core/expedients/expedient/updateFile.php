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
    
    if(
        empty($_FILES) && 
        ($_POST['docNameToDelete'] == null || $_POST['docNameToDelete'] == '') &&
        ($_POST['expedientID'] == null || $_POST['expedientID'] == '')
    ){
        http_response_code(405);
        return;
    }
    
    $dirFolder = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/". $_POST['expedientID'] ."/info/";

    // Delete old file (optional)
    if($_POST['docNameToDelete'] != null && $_POST['docNameToDelete'] != '' && $_POST['docNameToDelete'] != 'null'){
        unlink($dirFolder . $_POST['docNameToDelete']);
    }

    // Create new file
    if(!empty($_FILES)){

        if(!file_exists($dirFolder)){
            mkdir($dirFolder, 0777, true);
        }

        $fileName = $_POST['docName'];
        $extension = explode('.', $fileName)[count(explode('.', $fileName)) - 1];
        switch(strtolower($extension)){
            case 'jpeg':
            case 'jpg':
            case 'png':
                $tmpFile = $_FILES['archivo']['tmp_name'];
                $pathFile = $dirFolder . $fileName;
                echo json_encode(move_uploaded_file($tmpFile, $pathFile));
            break;
            default:
                echo json_encode('extension');
            break;
        }
    }else{
        echo json_encode(true);
    }
?>