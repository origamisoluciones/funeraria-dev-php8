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

    require_once($_SESSION['basePath'] . "model/suppliers.php");
    require_once($_SESSION['basePath'] . "model/orders.php");
    require_once($_SESSION['basePath'] . "model/products.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getSupplierInfo':
                echo json_encode(getSupplierInfo($_POST['supplier']));
            break;
            case 'getPurchasePrice':
                echo json_encode(getPurchasePrice($_POST['model']));
            break;
            case 'getOtherDeliveryPlace':
                echo json_encode(getOtherDeliveryPlace($_POST['order']));
            break;
            case 'sendEmail':
                echo json_encode(sendEmail($_POST['sendTo'], $_POST['order']));
            break;
            case 'existsOrder':
                echo json_encode(existsOrder($_POST['order']));
            break;
            case 'getSupplierReference':
                echo json_encode(getSupplierReference($_POST['model']));
            break;
            case 'getFirstOrderDate':
                echo json_encode(getFirstOrderDate());
            break;
        }
    }

    /**
     * Obtiene los datos de la localidad para un cementerio dado
     *
     * @return array
     */
    function getSupplierInfo($data){
        $suppliers = new Suppliers;
        return $suppliers->getSupplierInfo($data);
    }

    /**
     * Obtiene el precio de compra de un modelo
     *
     * @param int $model Id del modelo
     * @return int
     */
    function getPurchasePrice($model){
        $products = new Products;
        $purchasePrice = $products->getPurchasePrice($model);

        $orders = new Orders;
        $lastPurchase = $orders->getLastPurchase($model);

        return array($purchasePrice, $lastPurchase);
    }

    /**
     * Obtiene el lugar de entrega alternativo
     *
     * @param int $order Id del pedido
     * @return string
     */
    function getOtherDeliveryPlace($order){
        $orders = new Orders;
        return $orders->getOtherDeliveryPlace($order);
    }

    /**
     * Envía un email
     * 
     * @param array $emails Emails
     * @return bool
     */
    function sendEmail($emails, $order){
        $orders = new Orders;
        $order = $orders->read($order);
        
        require_once($_SESSION['basePath'] . "core/tools/mailHandler.php");
        
        $state = true;
        foreach($emails as $index=>$email){
            $mailHandler = new MailHandler;
            $flag = $mailHandler->sendOrder($email, $order, $index);
            $state = $flag ?: false;
        }

        return $state;
    }

    /**
     * Comprueba si un pedido existe
     * 
     * @param int $order Id del pedido
     * @return bool
     */
    function existsOrder($order){
        $orders = new Orders;
        return $orders->existsOrder($order);
    }

    /**
     * Obtiene la referencia del proveedor de un modelo
     * 
     * @param int $model Modelo
     * @return string
     */
    function getSupplierReference($model){
        $products = new Products;
        return $products->getSupplierReference($model);
    }

    /**
     * Obtiene la referencia del proveedor de un modelo
     * 
     * @param int $model Modelo
     * @return string
     */
    function getFirstOrderDate(){
        $products = new Products;
        return $products->getFirstOrderDate();
    }
?>