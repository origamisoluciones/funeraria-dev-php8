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

    require_once($_SESSION['basePath'] . "model/failures.php");
    $failures = new Failures();

    echo json_encode(array('data' => $failures->listFailuresDatatables($_GET['year'],$_GET['month'],$_GET['trimester'], $_GET['vehicle'])));
?>