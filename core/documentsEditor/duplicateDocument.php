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

    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/documentsEditor.php");

    $documentsEditor = new DocumentsEditor;
    $logs = new Logs;

    // Gets info about current document
    $found = $documentsEditor->read($_POST);
    if($found === null){
        $logs->createSimple("Configuración", "Editor documentos - Duplicar", "'Error! No ha podido duplicar el documento'");
        echo json_encode(false);
        return;
    }
    $pageSize = $found[0]['pageSize'];

    // Creates a new document from current
    $data = array(
        'categoryID' => $_POST['category'],
        'name' => $_POST['name'],
        'pageSize' => $pageSize
    );

    $created = $documentsEditor->create($data);
    if($created === null){
        $logs->createSimple("Configuración", "Editor documentos - Duplicar", "'Error! No ha podido duplicar el documento'");
        echo json_encode(false);
        return;
    }
    $newDocumentID = $created;

    $destination = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentEditor/$newDocumentID";
    mkdir($destination, 0777, true);

    // Duplicate files
    if(is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentEditor/{$_POST['documentID']}/files")){
        $source = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentEditor/{$_POST['documentID']}/files";
        $destinationAux = "$destination/files";
        exec("cp -r $source $destinationAux", $output, $status);
    }

    // Duplicate img
    if(is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentEditor/{$_POST['documentID']}/img")){
        $source = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentEditor/{$_POST['documentID']}/img";
        $destinationAux = "$destination/img";
        exec("cp -r $source $destinationAux", $output, $status);
    }

    $logs->createSimple("Configuración", "Editor documentos - Duplicar", "'Ha duplicado el documento'");
    echo json_encode(true);
?>