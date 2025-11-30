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

    require_once($_SESSION['basePath'] . "model/cleaning.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getVisitControl':
                echo json_encode(getVisitControl($_POST['expedient']));
            break;
            case 'getMin':
                echo json_encode(getMin($_POST));
            break;
            case 'getMax':
                echo json_encode(getMax($_POST));
            break;
            case 'getDescriptions':
                echo json_encode(getDescriptions($_POST['min'], $_POST['max'], $_POST['expedient']));
            break;
            case 'getYears':
                echo json_encode(getYears());
            break;
        }
    }

    /**
    * Obtiene el id del control de visitas
    *
    * @return array
    */
    function getVisitControl($data){
        $cleaning = new Cleaning();
        return $cleaning->getVisitControl($data);
    }

    /**
     * Obtiene la primera visita
     *
     * @param int $data
     * 
     * @return array
     */
    function getMin($data){
        $cleaning = new Cleaning();
        return $cleaning->getMin($data);
    }

    /**
     * Obtiene la última visita
     *
     * @param int $data
     * 
     * @return array
     */
    function getMax($data){
        $cleaning = new Cleaning();
        return $cleaning->getMax($data);
    }

    /**
     * Obtiene las descripciones
     *
     * @param int $min
     * @param int $min
     * 
     * @return array
     */
    function getDescriptions($min, $max, $expedient){
        $cleaning = new Cleaning();
        return $cleaning->getDescriptions($min, $max, $expedient);
    }

    /**
     * Obtiene los distintos años de la limpieza general
     * 
     * @return array
     */
    function getYears(){
        $cleaning = new Cleaning();
        return $cleaning->getYears();
    }
?>