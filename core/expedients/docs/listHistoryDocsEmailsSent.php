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

    if(empty($_GET) || !isset($_GET['history'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/expedientsHistoryDocsSent.php");
    $expedientsHistoryDocsSent = new ExpedientsHistoryDocsSent();
    
    echo json_encode(array('data' => $expedientsHistoryDocsSent->listUsers($_GET['history'])));
?>