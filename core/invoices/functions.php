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
    require_once($_SESSION['basePath'] . "core/tools/security.php");

    $data= array();
    foreach($_POST as $name => $value){
        if(gettype($_POST) != "array"){
            $aux = array($name => cleanStr($value));
        }else{
            $aux = array($name => $value);
        }

        $data = array_merge($data, $aux);
    }

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'exist':
                echo json_encode(exist($data));
            break;
            case 'getInvoiceDate':
                echo json_encode(getInvoiceDate($data));
            break;
            case 'getExpedientRequestDate':
                echo json_encode(getExpedientRequestDate($data));
            break;
            case 'getFirstInvoiceDate':
                echo json_encode(getFirstInvoiceDate());
            break;
            case 'getInvoiceInfo':
                echo json_encode(getInvoiceInfo($_POST['expedient'], isset($_POST['invoice']) ? $_POST['invoice'] : null));
            break;
            case 'getProducts':
                echo json_encode(getProducts());
            break;
            case 'getFirstReceivedInvoiceDate':
                echo json_encode(getFirstReceivedInvoiceDate());
            break;                
            case 'getSalaries':
                echo json_encode(getSalaries($_POST['mortuary'], $_POST['from'], $_POST['to']));
            break;
            case 'getMortuaryPerformance':
                echo json_encode(getMortuaryPerformance($_POST['mortuary'], $_POST['from'], $_POST['to']));
            break;
            case 'getInvoiceInfoEconomic':
                echo json_encode(getInvoiceInfoEconomic($_POST['expedient'], $_POST['invoice']));
            break;
            case 'changeStatus':
                echo json_encode(changeStatus($_POST['expedient'], $_POST['invoice']));
            break;
            case 'getPayments':
                echo json_encode(getPayments($_POST['invoice']));
            break;
            case 'getPaidInfo':
                echo json_encode(getPaidInfo($_POST['invoice']));
            break;
            case 'updatePayment':
                echo json_encode(updatePayment($_POST['ID'], $_POST['amount'], $_POST['date']));
            break;
            case 'deletePayment':
                echo json_encode(deletePayment($_POST['ID']));
            break;
            case 'getTotalInvoice':
                echo json_encode(getTotalInvoice($_POST['expedient'], $_POST['numHiring']));
            break;
            case 'getPaymentsDocs':
                echo json_encode(getPaymentsDocs($_POST['invoice'], $_POST['payment']));
            break;
            case 'exportImportExcel':
                echo json_encode(exportImportExcel($_POST['data'], $_POST['number']));
            break;
            case 'getTotals':
                echo json_encode(getTotals($_POST['from'], $_POST['to'], $_POST['typeInvoice'], $_POST['clientType'], $_POST['client'], $_POST['status'], $_POST['invoiceType'], $_POST['paymentMethod'], $_POST['numAccount'], $_POST['invoiceDateFilter'], $_POST['invoicePaymentFilter']));
            break;
            case 'getInvoiceInfoToDownload':
                echo json_encode(getInvoiceInfoToDownload((isset($_POST['invoice']) ? $_POST['invoice'] : null), (isset($_POST['expedient']) ? $_POST['expedient'] : null), (isset($_POST['isRectified']) ? $_POST['isRectified'] : null)));
            break;
        }
    }

    /**
    * Comprueba si existe la factura
    *
    * @return array
    */
    function exist($data){
        $invoice = new Invoices();
        return $invoice->exist($data);
    }

    /**
    * Obtiene la fecha de una factura
    *
    * @return array
    */
    function getInvoiceDate($data){
        $invoice = new Invoices();
        return $invoice->getInvoiceDate($data);
    }

    /**
    * Obtiene la fecha de solicitud de un expediente
    *
    * @return array
    */
    function getExpedientRequestDate($data){
        $invoice = new Invoices();
        return $invoice->getExpedientRequestDate($data);
    }

    /**
    * Obtiene los años en los que existen facturas
    *
    * @return array
    */
    function getFirstInvoiceDate(){
        $year = new Invoices();
        return $year->getFirstInvoiceDate();
    }

    /**
    * Obtiene los años en los que existen facturas
    *
    * @return array
    */
    function getInvoiceInfoEconomic($expedient, $invoice){
        $year = new Invoices();
        return $year->getInvoiceInfoEconomic($expedient, $invoice);
    }

    /**
    * Obtiene los productos
    *
    * @return array
    */
    function getProducts(){
        $products = new Invoices();
        return $products->getProducts();
    }

    /**
    * Obtiene los años en los que existen facturas receibida
    *
    * @return array
    */
    function getFirstReceivedInvoiceDate(){
        $invoices = new Invoices();
        return $invoices->getFirstReceivedInvoiceDate();
    }

    /**
    * Obtiene los años en los que existen facturas
    *
    * @return array
    */
    function getSalaries($mortuary, $from, $to){
        $salaries = new Invoices();
        return $salaries->getSalaries($mortuary, $from, $to);
    }

    /**
    * Obtiene los años en los que existen facturas
    *
    * @return array
    */
    function getMortuaryPerformance($mortuary, $from, $to){
        $mortuaryPerformance = new Invoices();
        return $mortuaryPerformance->getMortuaryPerformance($mortuary, $from, $to);
    }

    /**
     * Obtiene datos de la factura
     * 
     * @param int $expedient Id del expediente
     * @return array
     */
    function getInvoiceInfo($expedient, $invoiceID = null){

        $invoice = new Invoices;
        return $invoice->getInvoiceInfo($expedient, $invoiceID);
    }

    /**
     * Modifica el estado de una factura
     * 
     * @param int $expedient Id del expediente
     * @return array
     */
    function changeStatus($expedient, $invoice){
        require_once($_SESSION['basePath'] . "model/logs.php");
        $invoices = new Invoices;
        $logs = new Logs;

        $response = $invoices->changeStatus($invoice);
        if($response[0]){
            // Log
            $newStatus = $response[1] == 1 ? 'pagada' : 'pendiente';
            $oldStatus = $newStatus == 'pagada' ? 'pendiente' : 'pagada';
            $logs->createExpedient("Facturas", $expedient, "Expedientes - Actualización de estado", "'Ha actualizado el estado de la factura de $oldStatus a $newStatus'");
        }else{
            $logs->createExpedient("Facturas", $expedient, "Expedientes - Actualización de estado", "'Error! No ha podido actualizar el estado de la factura'");
        }

        return $response[0];
    }

    /**
     * Modifica el estado de una factura
     * 
     * @param int $expedient Id del expediente
     * @return array
     */
    function getPayments($invoiceID){
        $invoice = new Invoices;

        $listPayments = $invoice->getPayments($invoiceID);
        if($listPayments != null){
            foreach($listPayments as $index=>$item){
    
                $listPayments[$index]['has_attachments'] = false;
                $dir = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/invoices/$invoiceID/payment/" . $item['ID'];
                if(is_dir($dir)){
                    if(count(scandir($dir)) >= 3){
                        $listPayments[$index]['has_attachments'] = true;
                    }
                }
            }
        }

        return $listPayments;
    }

    /**
     * Modifica el estado de una factura
     * 
     * @param int $expedient Id del expediente
     * @return array
     */
    function getPaidInfo($invoiceID){
        $invoice = new Invoices;
        return $invoice->getPaidInfo($invoiceID);
    }

    /**
     * Paga una factura parcialmente
     *
     * @param array $id Id de la factura
     * @return bool
     */
    function updatePayment($id, $amount, $date){
        require_once($_SESSION['basePath'] . "model/logs.php");
        
        if($date == null){
            $date = time();
        }
        $invoice = new Invoices;
        $logs = new Logs;

        $invoicePayment = $invoice->getPaymentInfo($id);
        $expedientID = $invoicePayment['expedient'];
        $oldAmount = $invoicePayment['amount'];
        $newAmount = number_format($amount, 2, '.', '');

        $response = $invoice->updatePayment($id, $amount, $date);
        if($response){
            $logs->createExpedient("Facturas", $expedientID, "Expedientes - Actualizar pago", "'Ha actualizado un pago de $oldAmount € a $newAmount €'");
        }else{
            $logs->createExpedient("Facturas", $expedientID, "Expedientes - Actualizar pago", "'Error! No ha podido actualizar el pago de $oldAmount €'");
        }

        return $response;
    }

    /**
     * Paga una factura parcialmente
     *
     * @param array $id Id de la factura
     * @return bool
     */
    function deletePayment($id){
        require_once($_SESSION['basePath'] . "model/logs.php");
        
        $invoice = new Invoices;
        $logs = new Logs;

        $invoicePayment = $invoice->getPaymentInfo($id);
        $expedientID = $invoicePayment['expedient'];
        $oldAmount = $invoicePayment['amount'];

        $response = $invoice->deletePayment($id);
        if($response){
            $logs->createExpedient("Facturas", $expedientID, "Expedientes - Eliminar pago", "'Ha eliminado un pago de $oldAmount €'");
        }else{
            $logs->createExpedient("Facturas", $expedientID, "Expedientes - Eliminar pago", "'Error! No ha podido eliminar el pago de $oldAmount €'");
        }

        return $response;
    }

    /**
     * Paga una factura parcialmente
     *
     * @param int $id Id de la factura
     * @param int $numHiring Id de la factura
     * 
     * @return bool
     */
    function getTotalInvoice($id, $numHiring){
        $invoice = new Invoices;
        return $invoice->getTotalInvoice($id, $numHiring);
    }

    /**
     * Paga una factura parcialmente
     *
     * @param array $id Id de la factura
     * @return bool
     */
    function exportImportExcel($data, $number){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/invoices/desglose.csv', 'w');
        $elemName = [' ',' ',' ','Desglose del expediente ' .$number];
        fputcsv($f, $elemName, ';');
        foreach($data as $elem){
            fputcsv($f, $elem, ';');
        }
        fclose($f);
        return 'invoices/desglose.csv';
    }

    /**
     * Paga una factura parcialmente
     *
     * @param array $id Id de la factura
     * @return bool
     */
    function getTotals(
        $from, $to, $type, $clientType, $client, $status, 
        $invoiceType, $paymentMethodFilter, $numAccount, $invoicePayment, $invoiceDate
    ){
        $invoice = new Invoices;
        return $invoice->getTotalInvoicesDatatables($from, $to, $type, $clientType, $client, $status, $invoiceType, $paymentMethodFilter, $numAccount, $invoicePayment, $invoiceDate);
    }

    /**
     * Obtener los adjuntos de un cobro
     *
     * @param array $invoice Invoice id
     * @param array $payment Payment id
     * @return bool
     */
    function getPaymentsDocs($invoice, $payment){

        $info = array();

        // Files
        $dir = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/invoices/$invoice/payment/$payment/";
        $files = array();
        if(is_dir($dir)){
            foreach(scandir($dir) as $elem){
                if($elem != '.' && $elem != '..'){
                    array_push($files, $elem);
                }
            }
        }

        $info = $files;
        
        return json_encode($info);
    }

    /**
     * Obtiene el numero de factura para descargar el archivo asociado
     *
     * @param array $id Id de la factura
     * @return bool
     */
    function getInvoiceInfoToDownload($invoiceID, $xpedientID, $isRectified){
        $invoice = new Invoices;
        return $invoice->getInvoiceInfoToDownload($invoiceID, $xpedientID, $isRectified);
    }
?>