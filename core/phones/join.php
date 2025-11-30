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

    if(isset($_POST) && isset($_POST['category'])){
        require_once($_SESSION['basePath'] . "model/phones.php");
        $phones = new Phones;
        echo json_encode($phones->joinSettings($_POST['category']));
    }else{
        echo json_encode(false);
    }
?>