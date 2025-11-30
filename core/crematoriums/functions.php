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
    
    require_once($_SESSION['basePath'] . "model/crematoriums.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getLocations':
                echo json_encode(getLocations($_POST['crematoriumID']));
            break;
        }
    }

    /**
    * Obtiene los datos de la localidad para un crematorio dado
    *
    * @return array
    */
    function getLocations($data){
        $crematoriums = new Crematoriums();
        return $crematoriums->getLocation($data);
    }
?>