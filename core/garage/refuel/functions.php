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

    require_once($_SESSION['basePath'] . "model/refuel.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
              
        switch($type){
            case 'getLastRefuel':                
                echo json_encode(getLastRefuel($_POST['car']));
            break;     
            case 'getFirstRefuel':                
                echo json_encode(getFirstRefuel($_POST['vehicle']));
            break; 
            case 'getAllRefuelbyMonth':                
                echo json_encode(getAllRefuelbyMonth($_POST['vehicle'], $_POST['year'], $_POST['month']));
            break;     
            case 'getMonthTotal':                
                echo json_encode(getMonthTotal($_POST['vehicle'], $_POST['year'], $_POST['month']));
            break;     
            case 'getlLastKmRefuel':                
                echo json_encode(getlLastKmRefuel($_POST['vehicle'], $_POST['year'], $_POST['month']));
            break;     
            case 'getTotalAcumulate':                
                echo json_encode(getTotalAcumulate($_POST['vehicle']));
            break;     
        }
    }   

    /**
    * Obtiene el ultimo repostaje
    *
    * @return array
    */
    function getLastRefuel($id){
        $vehicles = new Refuel();
        return $vehicles->getLastRefuel($id);
    }

    /**
     * Obtiene el primer repostaje
     * 
     * @param int $vehicle Vehículo
     * @return int Año
     */
    function getFirstRefuel($vehicle){
        $vehicles = new Refuel;
        return $vehicles->getFirstRefuel($vehicle);
    }
    /**
     * Obtiene todos los repostajes de un coche en un mes
     * 
     * @param int $vehicle Vehículo
     * @return int Año
     */
    function getAllRefuelbyMonth($vehicle, $year, $month){
        $vehicles = new Refuel;
        return $vehicles->getAllRefuelbyMonth($vehicle, $year, $month);
    }
    
    /**
     * Obtiene todos los repostajes
     * 
     * @param int $vehicle Vehículo
     * @param int $year Año
     * @param int $month Mes
     * @return int Año
     */
    function getMonthTotal($vehicle, $year, $month){
        $vehicles = new Refuel;
        return $vehicles->getMonthTotal($vehicle, $year, $month);
    }
    /**
     * Obtiene todos los repostajes
     * 
     * @param int $vehicle Vehículo
     * @param int $year Año
     * @param int $month Mes
     * @return int Año
     */
    function getlLastKmRefuel($vehicle, $year, $month){
        $vehicles = new Refuel;
        return $vehicles->getlLastKmRefuel($vehicle, $year, $month);
    }
    /**
     * Obtiene el total de gasto y litros acumulados de un coche
     * 
     * @param int $vehicle Vehículo
     */
    function getTotalAcumulate($vehicle){
        $vehicles = new Refuel;
        return $vehicles->getTotalAcumulate($vehicle);
    }
?>