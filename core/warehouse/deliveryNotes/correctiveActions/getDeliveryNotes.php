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

    if(empty($_GET) || !isset($_GET['supplier'])){
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
    $table1 = 'DeliveryNotes';
    $table2 = array('Orders', 'Suppliers');
    
    // Table's primary key
    $primaryKey = 'DeliveryNotes.ID';

    // Array of database columns which should be read and sent back to DataTables.
    // The `db` parameter represents the column name in the database, while the `dt`
    // parameter represents the DataTables column identifier. In this case simple
    // indexes
    $columns = array(
        array('db' => 'DeliveryNotes.ID', 'dt' => 0),
        array('db' => 'DeliveryNotes.date', 'dt' => 1),
        array('db' => 'DeliveryNotes.number', 'dt' => 2),
        array('db' => 'Suppliers.name', 'dt' => 3),
        array('db' => 'Suppliers.name', 'dt' => 4),
        array('db' => 'DeliveryNotes.received', 'dt' => 5),
        array('db' => 'DeliveryNotes.inAgreement', 'dt' => 6)
    );

    $columns2 = array(
        array('db' => 'column0', 'dt' => 0),
        array('db' => 'column1', 'dt' => 1),
        array('db' => 'column2', 'dt' => 2),
        array('db' => 'column3', 'dt' => 3),
        array('db' => 'column4', 'dt' => 4),
        array('db' => 'column5', 'dt' => 5),
        array('db' => 'column6', 'dt' => 6)
    );

    $whereOn = array('DeliveryNotes.order = Orders.ID', 'Orders.supplier = Suppliers.supplierID');
    $where = "  DeliveryNotes.leavingDate IS NULL AND Orders.supplier = {$_GET['supplier']} AND DeliveryNotes.inAgreement = 0";

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
        SSP::complexLeftJoin($_GET, $sql_details, $table1, $table2, $primaryKey, 
                            $columns, $columns2, $whereOn, $where, null, null)
    );

    require_once($_SESSION['basePath'] . "model/logs.php");

    $logs = new Logs;
    $logs->createSimple("Almacén", "Albaranes - Consulta", "'Ha consulta los albaranes'");
?>