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

    require_once($_SESSION['basePath'] . "model/assistances.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getTotal':
                echo json_encode(getTotal($_POST));
            break;
            case 'getDataToPDF':
                echo json_encode(getDataToPDF($_POST));
            break;
            case 'filter':
                echo json_encode(filter($_POST));
            break;
        }
    }
    
    /**
     * Obtiene el total de asistencias para un período dado
     * 
     * @param array $data
     * 
     * @return array
     */
    function getTotal($data){
        $assistances = new Assistances;
        return $assistances->getTotal($data);
    }
    
    /**
     * Obtiene las asistencias dado un período para crear un pdf
     * 
     * @param array $data
     * 
     * @return array
     */
    function getDataToPDF($data){
        $assistances = new Assistances;
        return $assistances->getDataToPDF($data);
    }

    /**
     * Obtiene las asistencias en base al filtrado dado
     * 
     * @param array $data Filtrado
     * @return array Asistencias
     */
    function filter($data){
        $assistances = new Assistances;
        return $assistances->filter($data);
    }
?>