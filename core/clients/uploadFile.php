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

    require_once($_SESSION['basePath'] . "core/tools/fileHandlerAjax.php");
    require_once($_SESSION['basePath'] . "model/clients.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");

    $file = $_FILES["files"];
    $id = cleanStr($_GET['id']);

    $name = $file['name'][0];
    $extension = explode(".", $name);
    $extension = $extension[count($extension) - 1];

    $fileHandlerAjax = new FileHandlerAjax();
    $upload = $fileHandlerAjax->uploadFile(
        "documentacion." . $extension, $file, 
        "resources/files/{$_SESSION['company']}/clients/". $id ."/documents/", 
        array("pdf"), 
        false, 
        "Clients"
    );

    $clients = new Clients();
    $clients->updateFile(
        array(
            "clientID" => $id, 
            "name" => "resources/files/{$_SESSION['company']}/clients/". $id ."/documents/documentacion." . $extension
        )
    );
?>