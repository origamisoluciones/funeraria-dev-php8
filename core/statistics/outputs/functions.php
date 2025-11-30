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
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getFinancingsCash':
                echo json_encode(getFinancingsCash($_POST['from'], $_POST['to']));
                break;
            case 'getRecievedInvoicesCash':
                echo json_encode(getRecievedInvoicesCash($_POST['from'], $_POST['to']));
                break;
            case 'getSalariesCash':
                echo json_encode(getSalariesCash($_POST['from'], $_POST['to']));
                break;
            case 'getTaxesCash':
                echo json_encode(getTaxesCash($_POST['from'], $_POST['to']));
                break;
        }
    }

    /**
     * Obtiene las facturas para e rango de fechas y para el cliente(Particulaes, distintas empresas)
     * 
     * @return array
     */
    function getFinancingsCash($from, $to){
        require_once($_SESSION['basePath'] . "model/financing.php");
        $financings = new Financings;
        return $financings->getFinancingsCash($from, $to);
    }

    /**
     * Obtiene las facturas para e rango de fechas y para el cliente(Particulaes, distintas empresas)
     * 
     * @return array
     */
    function getRecievedInvoicesCash($from, $to){
        require_once($_SESSION['basePath'] . "model/invoices.php");         
        $invoices = new Invoices;
        return $invoices->getRecievedInvoicesCash($from, $to);
    }

    /**
     * Obtiene las facturas para e rango de fechas y para el cliente(Particulaes, distintas empresas)
     * 
     * @return array
     */
    function getSalariesCash($from, $to){
        require_once($_SESSION['basePath'] . "model/expenses.php");
        $salaries = new Expenses;
        return $salaries->getSalariesCash($from, $to);
    }

    /**
     * Obtiene las facturas para e rango de fechas y para el cliente(Particulaes, distintas empresas)
     * 
     * @return array
     */
    function getTaxesCash($from, $to){
        require_once($_SESSION['basePath'] . "model/expenses.php");
        $taxes = new Expenses;
        return $taxes->getTaxesCash($from, $to);
    }

?>