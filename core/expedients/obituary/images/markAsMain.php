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

    if(isset($_POST) && isset($_POST['id']) && isset($_POST['expedient'])){
        require_once($_SESSION['basePath'] . "core/tools/security.php");

        $id = cleanStr($_POST['id']);
        $expedient = cleanStr($_POST['expedient']);

        require_once($_SESSION['basePath'] . "model/expedientsObituariesImages.php");

        $expedientsObituariesImages = new ExpedientsObituariesImages;
        $expedientsObituariesImages->unsetMainByExpedient($expedient);
        echo json_encode($expedientsObituariesImages->markAsMain($id));
    }else{
        echo json_encode(false);
    }
?>