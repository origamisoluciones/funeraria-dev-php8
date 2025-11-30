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

    require_once($_SESSION['basePath'] . "model/orders.php");
    $orders = new Orders();

    echo json_encode(array('data' => $orders->listOrdersDatatables($_GET['type'], $_GET['agreement'], $_GET['from'], $_GET['to'])));
?>