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

    require_once($_SESSION['basePath'] . "model/expedients.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
        
    $logs = new Logs;

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getTodayCremations':
                echo json_encode(getTodayCremations());
               
                $logs->createSimple("C. Servicio", "Cremaciones de hoy - Consulta", "'Ha consultado las cremaciones de hoy'");
            break;

            case 'getTomorrowCremations':
                echo json_encode(getTomorrowCremations());
               
                $logs->createSimple("C. Servicio", "Cremaciones de mañana - Consulta", "'Ha consultado las cremaciones de mañana'");
            break;
        }
    }

    /**
     * Obtiene todas las cremaciones de hoy
     * 
     * @return array
     */
    function getTodayCremations(){
        $expedients = new Expedients();
        return $expedients->getTodayCremations();
    }

    /**
     * Obtiene todas las cremaciones de hoy
     * 
     * @return array
     */
    function getTomorrowCremations(){
        $expedients = new Expedients();
        return $expedients->getTomorrowCremations();
    }
?>