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

    require_once($_SESSION['basePath'] . "model/orders.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getNonApproval':
                echo json_encode(getNonApproval($_POST['order']));
            break;
        }
    }

    /**
     * Obtiene los datos de la localidad para un cementerio dado
     *
     * @param int $order Pedido
     * @return array
     */
    function getNonApproval($order){
        $orders = new Orders;
        return $orders->getNonApproval($order);
    }
?>