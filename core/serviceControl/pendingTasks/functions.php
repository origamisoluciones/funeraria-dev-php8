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

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getTasksByExpedient':
                echo json_encode(getTasksByExpedient($_POST['service']));
            break;
            case 'getLiteralsByExpedient':
                echo json_encode(getLiteralsByExpedient($_POST['service']));
            break;
            case 'updateTasksByExpedient':
                echo json_encode(updateTasksByExpedient($_POST));
            break;
            case 'updateLiteralsByExpedient':
                echo json_encode(updateLiteralsByExpedient($_POST));
            break;
            case 'getTasksByExpedientAmount':
                echo json_encode(getTasksByExpedientAmount($_POST['service']));
            break;
        }
    }

    /**
     * Obtiene los tareas (servicios) de un expediente
     * 
     * @param int $data
     * 
     * @return array
     */
    function getTasksByExpedient($data){
        $expedients = new Expedients();
        return $expedients->getTasksByExpedient($data);
    }

    /**
     * Obtiene los literales (solicitdo, pendiente) de un expediente
     * 
     * @param int $data
     * 
     * @return array
     */
    function getLiteralsByExpedient($data){
        $expedients = new Expedients();
        return $expedients->getLiteralsByExpedient($data);
    }

    /**
     * Modifica las tareas (servicios) de un expediente
     * 
     * @param array $data
     * 
     * @return array
     */
    function updateTasksByExpedient($data){
        $expedients = new Expedients();
        return $expedients->updateTasksByExpedient($data);
    }

    /**
     * Modifica las los literales pendientes de un expediente
     * 
     * @param array $data
     * 
     * @return array
     */
    function updateLiteralsByExpedient($data){
        $expedients = new Expedients();
        return $expedients->updateLiteralsByExpedient($data);
    }

    /**
     * Obtiene la cantidad de tareas pendientes de un expediente
     * 
     * @param array $data
     * @return array
     */
    function getTasksByExpedientAmount($data){
        $expedients = new Expedients;
        return $expedients->getTasksByExpedientAmount($data);
    }
?>