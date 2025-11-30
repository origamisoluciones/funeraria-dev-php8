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

    if(empty($_POST)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/expedients.php");
    require_once($_SESSION['basePath'] . "model/logs.php");

    $expedients = new Expedients();
    $logs = new Logs;

    $data = $_POST;
    if($expedients->getObituaryTypes($data) == null){
        echo $expedients->createObituary($data) ? true : false;
    }else{
        echo $expedients->updateObituary($data) ? true : false;
    }
   
    $logs->createExpedient("Closed by Death", $data['expedient'], "Cerrado por defunción - Alta/Modificación", "'Ha creado/modificado los datos del cartel de cerrado por defunción'");
?>