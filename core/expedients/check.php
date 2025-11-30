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

    if(empty($_POST) || !isset($_POST['expedient'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/expedients.php");

    $expedients = new Expedients;

    $expedient = $_POST['expedient'];
    $url = $_POST['url'];

    $found = $expedients->existsExpedient($expedient);
    if($found){
        if($found['tpv'] == '1'){
            if(preg_match("/expediente-tpv/", $url) || preg_match("/contratacion/", $url) || preg_match("/cservicio-tpv/", $url) || preg_match("/documentacion-tpv/", $url) || preg_match("/logs/", $url)){
                echo json_encode(true);
            }else{
                echo json_encode(false);
            }
        }else{
            if(preg_match("/expediente/", $url) || preg_match("/contratacion/", $url) || preg_match("/cservicio/", $url) || preg_match("/documentacion/", $url) || preg_match("/logs/", $url)){
                echo json_encode(true);
            }else{
                echo json_encode(false);
            }
        }
    }else{
        echo json_encode(false);
    }
?>