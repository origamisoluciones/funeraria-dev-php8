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

    if(isset($_POST) && isset($_POST['expedient']) && isset($_POST['type']) && isset($_POST['model'])){
        require_once($_SESSION['basePath'] . "core/tools/security.php");
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedient = cleanStr($_POST['expedient']);
        $type = cleanStr($_POST['type']);
        $model = cleanStr($_POST['model']);

        $expedients = new Expedients;
        $tombstone = file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/tombstone/$type/$model/files/json.json") ? true : false;
        echo json_encode($tombstone);
    }else{
        echo json_encode(array());
    }
?>