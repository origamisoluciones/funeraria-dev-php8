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

    require_once($_SESSION['basePath'] . "model/invoices.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getReceivedInvoices':
                echo json_encode(getReceivedInvoices($_POST['from'], $_POST['to']));
            break;
            case 'pay':
                echo json_encode(pay($_POST['ID']));
            break;
            case 'getPaidInfo':
                echo json_encode(getPaidInfo($_POST['invoice']));
            break;
            case 'getSupplierNif':
                echo json_encode(getSupplierNif($_POST['ID']));
            break;
            case 'getSupplierName':
                echo json_encode(getSupplierName($_POST['invoice']));
            break;
            case 'getPayments':
                echo json_encode(getPayments($_POST['invoice']));
            break;
            case 'payPartialInvoice':
                echo json_encode(payPartialInvoice($_POST['ID_inv'], $_POST['amount_payed'], $_POST['date_pay']));
            break;
            case 'updatePayment':
                echo json_encode(updatePayment($_POST['ID'], $_POST['amount'], $_POST['date']));
            break;
            case 'deletePayment':
                echo json_encode(deletePayment($_POST['ID']));
            break;
            case 'getCurrentPaymentsAndTotal':
                echo json_encode(getCurrentPaymentsAndTotal($_POST['ID_inv']));
            break;
            case 'getTotals':
                echo json_encode(getTotals($_POST['from'], $_POST['to'], $_POST['typeInvoice'], $_POST['supplier'], $_POST['costCenterFilter'], $_POST['cashOutFilter'], $_POST['expenseTypeFilter'], $_POST['paymentMethodFilter'], $_POST['bankAccountFilter'], $_POST['creditCardFilter']));
            break;
        }
    }

    /**
     * Obtiene las cuentas bancarias
     *
     * @return array
     */
    function getReceivedInvoices($from, $to){
        $invoices = new Invoices();
        return $invoices->getReceivedInvoices($from, $to);
    }

    /**
     * Paga una factura
     *
     * @param array $id Id de la factura
     * @return bool
     */
    function pay($id){
        require_once($_SESSION['basePath'] . "model/expenses.php");

        $expenses = new Expenses;
        return $expenses->pay($id);
    }

    /**
     * Informacion sobre los pagos de una factura
     *
     * @param array $id Id de la factura
     * @return bool
     */
    function getPaidInfo($id){
        require_once($_SESSION['basePath'] . "model/expenses.php");

        $expenses = new Expenses;
        return $expenses->getPaidInfo($id);
    }

    /**
     * Obtiene el nif del proveedor
     * 
     * @param int $id Id del proveedor
     * @return string
     */
    function getSupplierNif($id){
        require_once($_SESSION['basePath'] . "model/suppliers.php");
        
        $suppliers = new Suppliers;
        return $suppliers->getNif($id);
    }

    /**
     * Obtiene el nombre del proveedor
     * 
     * @param int $id Id de la factura
     * @return string
     */
    function getSupplierName($id){
        require_once($_SESSION['basePath'] . "model/expenses.php");
        
        $expenses = new Expenses;
        return $expenses->getSupplierName($id);
    }

    /**
     * Obtiene los pagos de una factura
     * 
     * @param int $invoice Id de la factura
     * @return array
     */
    function getPayments($invoice){
        require_once($_SESSION['basePath'] . "model/expenses.php");
        
        $expenses = new Expenses;
        return $expenses->getPayments($invoice);
    }

     /**
     * Paga una factura parcialmente
     *
     * @param array $id Id de la factura
     * @return bool
     */
    function payPartialInvoice($id, $amount, $date){
        require_once($_SESSION['basePath'] . "model/expenses.php");
        
        if($date == null){
            $date = time();
        }
        $expenses = new Expenses;
        return $expenses->payPartialInvoice($id, $amount, $date);
    }

     /**
     * Paga una factura parcialmente
     *
     * @param array $id Id de la factura
     * @return bool
     */
    function updatePayment($id, $amount, $date){
        require_once($_SESSION['basePath'] . "model/expenses.php");
        
        if($date == null){
            $date = time();
        }
        $expenses = new Expenses;
        return $expenses->updatePayment($id, $amount, $date);
    }

    /**
     * Paga una factura parcialmente
     *
     * @param array $id Id de la factura
     * @return bool
     */
    function deletePayment($id){
        require_once($_SESSION['basePath'] . "model/expenses.php");
      
        $expenses = new Expenses;
        return $expenses->deletePayment($id);
    }

    /**
     * Obtiene la suma de los pagos actuales de una factura y su total
     *
     * @param array $id Id de la factura
     * @return bool
     */
    function getCurrentPaymentsAndTotal($id){
        require_once($_SESSION['basePath'] . "model/expenses.php");

        $expenses = new Expenses;
        return $expenses->getCurrentPaymentsAndTotal($id);
    }

    /**
     * Obtiene los totales para la tabla de facturas recibidas
     *
     * @param int $from Fecha inicio
     * @param int $to Fecha limite
     * @param int $type Tipo de factura
     * @param int $supplier Id del proveedor
     * @return array
     */
    function getTotals($from, $to, $type, $supplier, $costCenter, $cashOut, $expenseType, $paymentMethod, $bankAccount = null, $creditCard = null){
        require_once($_SESSION['basePath'] . "model/expenses.php");
        $expenses = new Expenses;
        return $expenses->getTotals($from, $to, $type, $supplier, $costCenter, $cashOut, $expenseType, $paymentMethod, $bankAccount, $creditCard);
    }
?>