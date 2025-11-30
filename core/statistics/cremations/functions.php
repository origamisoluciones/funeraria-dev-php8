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

    require_once($_SESSION['basePath'] . "model/expedients.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getYears':
                echo json_encode(getYears($_POST));
                break;
            case 'filter':
                echo json_encode(filter($_POST));
                break;
        }
    }
    
    /**
     * Obtiene los años para los cuáles ha habido al menos una cremación
     * 
     * @return array
     */
    function getYears(){
        $expedients = new Expedients;
        return $expedients->getYearsCremations();
    }

    /**
     * Filtra las cremaciones
     * 
     * @param array $data Filtros
     * @param array|null Datos filtrados
     */
    function filter($data){
        $expedients = new Expedients;
        return $expedients->filterCremations($data);
    }
?>