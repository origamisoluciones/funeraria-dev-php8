<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
    }

    if(!isset($_SESSION['user']) || !isset($_POST['expedient'])){
        http_response_code(403);
        return;
    }

    require_once($_SESSION['basePath'] . "core/tools/security.php");

    $expedient = cleanStr($_POST['expedient']);

    $route = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/'. $expedient . '/docs/instanciaAytoSJoanLibritja.json';
    $isDoc = file_exists($route) ? true : false;
    if($isDoc){
        echo file_get_contents($route);
    }else{
        echo json_encode(false);
    }
?>