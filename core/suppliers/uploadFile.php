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
    require_once($_SESSION['basePath'] . "model/suppliers.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");

    $file = $_FILES["files"];
    $id = cleanStr($_GET['id']);

    $name = $file['name'][0];
    $extension = explode(".", $name);
    $extension = $extension[count($extension) - 1];

    $fileHandlerAjax = new FileHandlerAjax();
    $upload = $fileHandlerAjax->uploadFile(
        "catalogo." . $extension,
        $file, 
        "resources/files/{$_SESSION['company']}/suppliers/". $id ."/catalogue/", 
        array(
            "pdf"
        ),
        false,
        "Suppliers"
    );

    if($upload['result'] == 0){
        $suppliers = new Suppliers();
        $supplier = $suppliers->updateFile(
            array(
                "supplierID" => $id, 
                "name" => "resources/files/{$_SESSION['company']}/suppliers/". $id ."/catalogue/catalogo." . $extension
            )
        );
    }
?>