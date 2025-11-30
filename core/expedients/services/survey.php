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

    if(empty($_GET) || !isset($_GET['expedient'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/expedientsPolls.php");
    $expedientsPolls = new ExpedientsPolls;

    echo json_encode(array('data' => $expedientsPolls->listByExpedient($_GET['expedient'])));
?>