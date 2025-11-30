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

    if(isset($_POST) && isset($_POST['expedient'])){
        $expedient = $_POST['expedient'];

        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        echo json_encode($expedients->getClientByExpedient($expedient));
    }else{
        echo json_encode(null);
    }
?>