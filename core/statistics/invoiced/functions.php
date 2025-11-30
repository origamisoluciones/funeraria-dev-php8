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

    require_once($_SESSION['basePath'] . "model/invoices.php");

    
    if(isset($_GET['type'])){
        $type = $_GET['type'];
        switch($type){
            case 'getExpedients':
                echo json_encode(getExpedients($_GET['from'], $_GET['to'], $_GET['client']));
            break;
            case 'getInvoices':
                echo json_encode(getInvoices($_GET['from'], $_GET['to'], $_GET['client']));
            break;
            case 'getRecievedInvoicesCash':
                echo json_encode(getRecievedInvoicesCash($_GET['from'], $_GET['to']));
            break;
        }
    }
        
    /**
     * Obtiene los expedientes facturados en el rango de fechas para el cliente(Particulaes, distintas empresas)
     * 
     * @return array
     */
    function getExpedients($from, $to, $client){
        $expedients = new Invoices;
        return $expedients->getExpedients($from, $to, $client);
    }

    /**
     * Obtiene las facturas para e rango de fechas y para el cliente(Particulaes, distintas empresas)
     * 
     * @return array
     */
    function getInvoices($from, $to, $client){
        $invoices = new Invoices;
        return $invoices->getInvoices($from, $to, $client);
    }

    /**
     * Obtiene las facturas para e rango de fechas y para el cliente(Particulaes, distintas empresas)
     * 
     * @return array
     */
    function getRecievedInvoicesCash($from, $to){
        $invoices = new Invoices;
        return $invoices->getRecievedInvoicesCash($from, $to);
    }
?>