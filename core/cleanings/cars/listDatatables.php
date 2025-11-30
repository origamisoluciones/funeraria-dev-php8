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
    $cleaning = new Cleaning();

    echo json_encode(array('data' => $cleaning->listCleaningsCarsDatatables($_GET['from'],$_GET['to'])));
?>