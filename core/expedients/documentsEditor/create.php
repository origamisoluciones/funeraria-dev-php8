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

    $expedient = $_POST['expedient'];
    $doc = $_POST['doc'];
    $confDoc = $_POST['confDoc'];

    $source = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/$confDoc/files";
    $dest = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/$expedient/documentsEditor/$doc";
    if(is_dir($dest)){
        exec("rm -r $dest");
    }
    mkdir($dest, 0777, true);

    exec("cp -r $source $dest");

    echo json_encode(true);
?>