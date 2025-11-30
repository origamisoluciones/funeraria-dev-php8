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

    if(empty($_POST) || !isset($_POST['action'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/events.php");
    
    if(isset($_POST['action'])){
        $action = $_POST['action'];
        switch($action){
            case 'getProducts':
                echo json_encode(getProducts($_POST['expedient']));
            break;
            case 'closeAndDoneEvent':                             
                echo json_encode(closeAndDoneEvent($_POST));
            break;
        }
    }

    /**
     * Obtiene los productos asociados a una cremación
     *
     * @param int $expedient ID del expediente
     * @return array
     */
    function getProducts($data){
        $events = new Events;
        return $events->getProducts($data);
    }
    /**
     * Obtiene los productos asociados a una cremación
     *
     * @param int $expedient ID del expediente
     * @return array
     */
    function closeAndDoneEvent($data){
        $events = new Events;
        return $events->close($data);
    }
?>