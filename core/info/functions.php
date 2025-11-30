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

    if(isset($_POST)){
        switch($_POST['type']){
            case 'getActiveExpedients':
                echo json_encode(getActiveExpedients());
            break;
            case 'getActiveExpedientsInfo':
                echo json_encode(getActiveExpedientsInfo());
            break;
            case 'getPendingExpedients':
                echo json_encode(getPendingExpedients());
            break;
            case 'getPendingInvoices':
                echo json_encode(getPendingInvoices());
            break;
            case 'getInvoices':
                echo json_encode(getInvoices());
            break;
            case 'getPendingReceivedInvoices':
                echo json_encode(getPendingReceivedInvoices());
            break;
            case 'getReceivedInvoices':
                echo json_encode(getReceivedInvoices());
            break;
            case 'updateLastActivity':
                echo json_encode(updateLastActivity());
            break;
        }
    }else{
        echo json_encode(null);
    }

    /**
     * Obtiene los expedientes activos
     * 
     * @return array
     */
    function getActiveExpedients(){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return array('data' => $expedients->getInfoActiveExpedients());
    }
    /**
     * Obtiene los expedientes activos
     * 
     * @return array
     */
    function getActiveExpedientsInfo(){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return array('data' => $expedients->getActiveExpedientsInfo());
    }

    /**
     * Obtiene los expedientes con tareas pendientes
     * 
     * @return array
     */
    function getPendingExpedients(){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return array('data' => $expedients->getInfoPendingExpedients());
    }

    /**
     * Obtiene las facturas pendientes de cobro
     * 
     * @return array
     */
    function getPendingInvoices(){
        require_once($_SESSION['basePath'] . "model/invoices.php");

        $invoices = new Invoices;
        return array('data' => $invoices->getPendingInvoices());
    }

    /**
     * Obtiene las facturas cobradas
     * 
     * @return array
     */
    function getInvoices(){
        require_once($_SESSION['basePath'] . "model/invoices.php");

        $invoices = new Invoices;
        return array('data' => $invoices->getPaidInvoices());
    }

    /**
     * Obtiene las facturas pendientes de pago
     * 
     * @return array
     */
    function getPendingReceivedInvoices(){
        require_once($_SESSION['basePath'] . "model/expenses.php");

        $expenses = new Expenses;
        return array('data' => $expenses->getPendingReceivedInvoices());
    }

    /**
     * Obtiene las facturas pagadas
     * 
     * @return array
     */
    function getReceivedInvoices(){
        require_once($_SESSION['basePath'] . "model/expenses.php");

        $expenses = new Expenses;
        return array('data' => $expenses->getReceivedInvoices());
    }

    /**
     * Obtiene las facturas pagadas
     * 
     * @return array
     */
    function updateLastActivity(){
        require_once($_SESSION['basePath'] . "model/users.php");
        
        $users = new Users;
        return $users->setLastActivity($_SESSION['user']);
    }
?>