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
    
    require_once($_SESSION['basePath'] . "model/locations.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getLocations':
                echo json_encode(getLocations());
            break;
            case 'getLocationsByID':
                echo json_encode(getLocationsByID($_POST['locationID']));
            break;
            case 'getLocationsByProvince':
                echo json_encode(getLocationsByProvince($_GET['q'], $_GET['province']));
            break;
            case 'getProvinces':
                echo json_encode(getProvinces());
            break;
        }
    }

    /**
    * Obtiene los datos de las poblaciones
    *
    * @return array
    */
    function getLocations(){
        $locations = new Locations();
        return $locations->list();
    }

    /**
    * Obtiene los datos de una población en concreto
    *
    * @return array
    */
    function getLocationsByID($data){
        $locations = new Locations();
        return $locations->getLocationsByID($data);
    }
    /**
    * Obtiene los datos de una población en concreto
    *
    * @return array
    */
    function getLocationsByProvince($val, $province){
        $locations = new Locations();
        return $locations->getLocationsByProvince($val, $province);
    }

    /**
     * Obtiene las provincias
     *
     * @return array
     */
    function getProvinces(){
        $locations = new Locations();
        return $locations->getProvinces();
    }
?>