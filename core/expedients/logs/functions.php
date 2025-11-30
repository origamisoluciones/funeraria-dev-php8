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
            case 'getExpedient':
                echo json_encode(getExpedient($_POST['expedient']));
            break;
        }
    }

    /**
    * Obtiene los datos del expediente
    *
    * @return array
    */
    function getExpedient($data){
        $expedient = new Expedients();
        return $expedient->getExpedientLogs($data);
    }
?>