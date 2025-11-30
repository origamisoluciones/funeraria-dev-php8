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
    
    require_once($_SESSION['basePath'] . "model/condolences.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getCondolences':
                echo json_encode(getCondolences($_POST['expedient']));
            break;
            case 'updateDelivered':
                echo json_encode(updateDelivered($_POST['ID']));
            break;
        }
    }

    /**
     * Obtiene los pésames web de un expediente
     *
     * @param int $data Id del expediente
     * @return array
     */
    function getCondolences($data){
        $condolences = new Condolences;
        return $condolences->getCondolences($data);
    }

    /**
     * Marca una condolencia como entregada (cuando se descarga)
     *
     * @param int $data Id de la condolencia
     * @return array
     */
    function updateDelivered($id){
        $condolences = new Condolences;
        return $condolences->updateDelivered($id);
    }
?>