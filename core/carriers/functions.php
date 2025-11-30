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

    if(empty($_POST) || !isset($_POST['type'])){
        http_response_code(405);
        return;
    }
    
    require_once($_SESSION['basePath'] . "model/carriers.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getLocation':
                echo json_encode(getLocation($_POST['carrierID']));
            break;
        }
    }

    /**
    * Obtiene los datos de la localidad para un porteador dado
    *
    * @return array
    */
    function getLocation($data){
        $carriers = new Carriers();
        return $carriers->getLocation($data);
    }
?>