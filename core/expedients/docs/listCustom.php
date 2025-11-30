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

    require_once($_SESSION['basePath'] . "model/documentsEditor.php");
    $documentsEditor = new DocumentsEditor();

    $found = $documentsEditor->listExpedientDatatables($_GET['expedient'], $_GET['category']);
    foreach($found as $index => $elem){
        // var_dump("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/{$_GET['expedient']}/documentsEditor/{$elem[0]}/files/documento.pdf");
        if(file_exists("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/{$_GET['expedient']}/documentsEditor/{$elem[0]}/files/documento.pdf")){
            $found[$index][5] = true;
        }else{
            $found[$index][5] = false;
        }
    }

    echo json_encode(array('data' => $found));
?>