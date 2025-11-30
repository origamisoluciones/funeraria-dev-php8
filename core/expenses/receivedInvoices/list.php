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

    if(empty($_GET)){
        http_response_code(405);
        return;
    }
    
    /*
    * DataTables example server-side processing script.
    *
    * Please note that this script is intentionally extremely simply to show how
    * server-side processing can be implemented, and probably shouldn't be used as
    * the basis for a large complex system. It is suitable for simple use cases as
    * for learning.
    *
    * See http://datatables.net/usage/server-side for full details on the server-
    * side processing requirements of DataTables.
    *
    * @license MIT - http://datatables.net/license_mit
    */
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * Easy set variables
    */
    
    // DB table to use
    $table1 = 'Received_Invoices';
    $table2 = array('Suppliers');
    
    // Table's primary key
    $primaryKey = 'Received_Invoices.ID';

    // Array of database columns which should be read and sent back to DataTables.
    // The `db` parameter represents the column name in the database, while the `dt`
    // parameter represents the DataTables column identifier. In this case simple
    // indexes
    $columns = array(
        array('db' => 'Received_Invoices.ID', 'dt' => 0),
        array('db' => 'Received_Invoices.invoiceNumber', 'dt' => 1),
        array('db' => 'Received_Invoices.date', 'dt' => 2),
        array('db' => 'Suppliers.nif', 'dt' => 3),
        array('db' => 'Suppliers.name', 'dt' => 4),
        array('db' => 'Received_Invoices.dueDate', 'dt' => 5),
        array('db' => 'Received_Invoices.taxBase', 'dt' => 6),
        array('db' => 'Received_Invoices.feeHoldIVA', 'dt' => 7),
        array('db' => 'Received_Invoices.withholding', 'dt' => 8),
        array('db' => 'Received_Invoices.supplied', 'dt' => 9),
        array('db' => 'Received_Invoices.total', 'dt' => 10),
        array('db' => 'Received_Invoices.paymentDate', 'dt' => 11)
    );

    $columns2 = array(
        array('db' => 'column0', 'dt' => 0),
        array('db' => 'column1', 'dt' => 1),
        array('db' => 'column2', 'dt' => 2),
        array('db' => 'column3', 'dt' => 3),
        array('db' => 'column4', 'dt' => 4),
        array('db' => 'column5', 'dt' => 5),
        array('db' => 'column6', 'dt' => 6),
        array('db' => 'column7', 'dt' => 7),
        array('db' => 'column8', 'dt' => 8),
        array('db' => 'column9', 'dt' => 9),
        array('db' => 'column10', 'dt' => 10),
        array('db' => 'column11', 'dt' => 11)
    );

    $where = "Received_Invoices.leavingDate IS NULL ";
    if(isset($_GET['from']) && isset($_GET['to'])){
        $where .= "AND Received_Invoices.date BETWEEN " . $_GET['from'] . " AND " . $_GET['to'];
    }

    $whereOn = array('Received_Invoices.supplier = Suppliers.supplierID');

    $order = "Received_Invoices.ID DESC";

    // SQL server connection information
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    $db = new DbHandler;
    $sql_details = $db->getDataConnection();
    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * If you just want to use the basic configuration for DataTables with PHP
    * server-side, there is no need to edit below this line.
    */
    require_once($_SESSION['basePath'] . "core/libraries/ssp.class.php");
    
    echo json_encode(
        SSP::complexLeftJoin($_GET, $sql_details, $table1, $table2, $primaryKey, $columns, $columns2, $whereOn, $where, null, null)
    );

    require_once($_SESSION['basePath'] . "model/logs.php");

    $logs = new Logs;
    $logs->createSimple("Salidas", "Facturas recibidas - Consulta", "'Ha consultado las facturas recibidas'");
?>