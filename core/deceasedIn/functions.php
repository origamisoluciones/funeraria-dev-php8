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

    require_once($_SESSION['basePath'] . "model/deceasedIn.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getLocations':
                echo json_encode(getLocations($_POST['deceasedInID']));
            break;
        }
    }

    /**
    * Obtiene los datos de la localidad para un Fallecido en
    *
    * @return array
    */
    function getLocations($data){
        $deceasedIn = new DeceasedIn();
        return $deceasedIn->getLocation($data);
    }
?>