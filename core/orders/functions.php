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
            case 'getDescriptions':
                echo json_encode(getDescriptions($_POST['orderID']));
            break;
            case 'getPreOrders':
                echo json_encode(getPreOrders($_POST));
            break;
            case 'setPreOrders':
                echo json_encode(setPreOrders($_POST));
            break;
            case 'create':
                echo json_encode(create($_POST));
            break;
            case 'getInfo':
                echo json_encode(getInfo($_POST));
            break;
            case 'sendEmail':
                echo json_encode(sendEmail($_POST));
            break;
        }
    }

    // Funciones
    function getDescriptions($data){
        $order = new Orders();
        return $order->getDescriptions($data);
    }

    /**
     * Obtiene los pre-pedidos de un expediente
     * 
     * @param array $data ID del expediente
     * @return array Pre-pedidos
     */
    function getPreOrders($data){
        $order = new Orders;
        return $order->getPreOrders($data);
    }

    /**
     * Modifica un pre-pedido
     * 
     * @param array $data ID del pedido
     * @return bool
     */
    function setPreOrders($data){
        $order = new Orders;
        return $order->setPreOrders($data);
    }

    /**
     * Crea un pedido
     * 
     * @param array $data Datos del pedido
     * @return bool
     */
    function create($data){
        $order = new Orders;
        return $order->create($data);
    }

    /**
     * Obtiene los datos de un pedido
     * 
     * @param array $data ID del pedido
     * @return array Datos del pedido
     */
    function getInfo($data){
        $order = new Orders;
        return $order->getInfo($data);
    }

    /**
     * Enviar un email al proveedor con el pedido
     * 
     * @param array $data Datos del pedido
     * @return bool
     */
    function sendEmail($data){
        $order = new Orders;
        return $order->sendEmail($data);
    }
?>