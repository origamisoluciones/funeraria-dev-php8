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
    $table1 = 'Taxes';
    $table2 = array('Mortuaries', 'Bank_Accounts', 'Shipper');
    
    // Table's primary key
    $primaryKey = 'Taxes.ID';

    // Array of database columns which should be read and sent back to DataTables.
    // The `db` parameter represents the column name in the database, while the `dt`
    // parameter represents the DataTables column identifier. In this case simple
    // indexes
    $columns = array(
        array('db' => 'Taxes.ID', 'dt' => 0),
        array('db' => 'Taxes.startDate', 'dt' => 1),
        array('db' => 'Taxes.endDate', 'dt' => 2),
        array('db' => 'Mortuaries.name', 'dt' => 3),
        array('db' => 'Taxes.settlementDate', 'dt' => 4),
        array('db' => 'Taxes.paymentMethod', 'dt' => 5),
        array('db' => 'Taxes.expenseType', 'dt' => 6),
        array('db' => 'Shipper.name', 'dt' => 7),
        array('db' => 'Taxes.taxBase', 'dt' => 8)


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

    );

    // Where condition
    $whereOn = array("Taxes.costCenter = Mortuaries.mortuaryID", "Taxes.bankAccount = Bank_Accounts.ID", "Taxes.shipperType = Shipper.ID");
    $where = "Taxes.leavingDate IS NULL";

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
        SSP::complexLeftJoin($_GET, $sql_details, $table1, $table2, $primaryKey, $columns, $columns2, $whereOn, $where)
    );

    require_once($_SESSION['basePath'] . "model/logs.php");

    $logs = new Logs;
    $logs->createSimple("Salidas", "Impuestos y tasas - Consulta", "'Ha consultado los impuestos y tasas'");
?>