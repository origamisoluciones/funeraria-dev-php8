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

    require_once($_SESSION['basePath'] . "model/cleaning.php");
    $cleanings = new Cleaning();

    echo json_encode(array('data' => $cleanings->listGeneralCleaningsDatatables($_GET['from2'], $_GET['to2'])));
?>