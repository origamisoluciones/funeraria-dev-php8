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

    
    if(isset($_GET['type'])){
        $type = $_GET['type'];
        switch($type){
            case 'getTimes':
                echo json_encode(getTimes($_GET['from'], $_GET['to'], $_GET['mortuary']));
                break;
        }
    }
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'filter':
                echo json_encode(filterTimes($_POST));
                break;
        }
    }

    /**
     * Obtiene las facturas para e rango de fechas y para el cliente(Particulaes, distintas empresas)
     * 
     * @return array
     */
    function getTimes($from, $to, $mortuary){
        $invoices = new Expedients;
        return $invoices->getTimes($from, $to, $mortuary);
    }

    /**
     * Filtra los tiempos de respuesta
     * 
     * @param array $data Filtros
     * @param array|null Datos filtrados
     */
    function filterTimes($data){
        $expedients = new Expedients;
        return $expedients->filterTimes($data);
    }
?>