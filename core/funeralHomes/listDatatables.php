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

    require_once($_SESSION['basePath'] . "model/funeralHomes.php");
    $funeralHomes = new FuneralHomes();

    echo json_encode(array('data' => $funeralHomes->listFuneralHomesDatatables()));
?>