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

    require_once($_SESSION['basePath'] . "model/deliveryNotes.php");
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'deleteAllLines':
                echo json_encode(deleteAllLines($_POST['ID']));
            break;
            case 'getPurchasePrice':
                echo json_encode(getPurchasePrice($_POST['ID']));
            break;
        }
    }

    /**
    * Obtiene los datos de la localidad para un cementerio dado
    *
    * @return array
    */
    function deleteAllLines($data){
        $deliveryNotes = new DeliveryNotes();
        return $deliveryNotes->deleteAllLines($data);
    }

    /**
    * Obtiene los datos de la localidad para un cementerio dado
    *
    * @return array
    */
    function getPurchasePrice($data){
        $deliveryNotes = new DeliveryNotes();
        return $deliveryNotes->getPurchasePrice($data);
    }
?>