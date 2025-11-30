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

    require_once($_SESSION['basePath'] . "model/funeralHomes.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getLocations':
                echo json_encode(getLocations($_POST['funeralHomeID']));
            break;
            case 'getFuneralHome':
                echo json_encode(getFuneralHome($_POST['funeralHomeID']));
            break;
            case 'getFuneralHomes':
                echo json_encode(getFuneralHomes());
            break;
            case 'readContactPeople':
                echo json_encode(readContactPeople($_POST['funeralHomeID']));
            break;
        }
    }

    /**
    * Obtiene los datos de la localidad para una funeraria
    *
    * @return array
    */
    function getLocations($data){
        $funeralHomes = new FuneralHomes();
        return $funeralHomes->getLocation($data);
    }

    /**
    * Obtiene los datos de las funerarias
    *
    * @return array
    */
    function getFuneralHomes(){
        $funeralHomes = new FuneralHomes();
        return $funeralHomes->list();
    }

    /**
    * Obtiene los datos de una funeraria dada
    *
    * @return array
    */
    function getFuneralHome($data){
        $funeralHomes = new FuneralHomes();
        return $funeralHomes->getFuneralHome($data);
    }

    /**
    * Obtiene los contactos de una funeraria
    * 
    * @param array $data
    *
    * @return array
    */
    function readContactPeople($data){
        $funeralHomes = new FuneralHomes();
        return $funeralHomes->readContactPeople($data);
    }
?>