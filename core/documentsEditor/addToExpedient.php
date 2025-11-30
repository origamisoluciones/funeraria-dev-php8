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

    if(empty($_POST) || !isset($_POST['document']) || !isset($_POST['expedient'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/documentsEditor.php");
    require_once($_SESSION['basePath'] . "model/expedientsDocumentsEditor.php");

    $documentsEditor = new DocumentsEditor;
    $expedientsDocumentsEditor = new ExpedientsDocumentsEditor;

    $found = $documentsEditor->read(array('documentID' => $_POST['document']));
    if($found == null || empty($found)){
        echo json_encode(false);
        return;
    }
    $documentName = $found[0]['documentName'];

    $found = $expedientsDocumentsEditor->checkByExpedientDocument($_POST['expedient'], $_POST['document']);
    if(!empty($found)){
        echo json_encode('already_added');
        return;
    }

    $created = $documentsEditor->addToExpedient($_POST['document'], $_POST['expedient'], $_SESSION['user'], $documentName);
    if($created){
        $found = $expedientsDocumentsEditor->checkByExpedientDocument($_POST['expedient'], $_POST['document']);
        if(empty($found)){
            echo json_encode(false);
            return;
        }
        $id = $found[0]['ID'];

        $source = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/{$_POST['document']}/files";
        $dest = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/{$_POST['expedient']}/documentsEditor/$id";
        if(is_dir($dest)){
            exec("rm -r $dest");
        }
        mkdir($dest, 0777, true);

        exec("cp -r $source $dest");

        $source = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/{$_POST['document']}/img";
        if(is_dir($source)){
            exec("cp -r $source $dest");
        }

        if(is_file("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/{$_POST['expedient']}/documentsEditor/$created/files/documento.pdf")){
            unlink("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/{$_POST['expedient']}/documentsEditor/$created/files/documento.pdf");
        }
        
        echo json_encode(true);
    }else{
        echo json_encode(false);
    }
?>