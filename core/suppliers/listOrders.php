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

    if(empty($_GET) || !isset($_GET['id'])){
        http_response_code(405);
        return;
    }

    // DB table to use
    $table1 = 'Orders, Suppliers';
    $table2 = array('Locations');
    
    // Table's primary key
    $primaryKey = 'Orders.ID';

    // Array of database columns which should be read and sent back to DataTables.
    // The `db` parameter represents the column name in the database, while the `dt`
    // parameter represents the DataTables column identifier. In this case simple
    // indexes
    $columns = array(
        array('db' => 'Orders.ID', 'dt' => 0),
        array('db' => 'Suppliers.name', 'dt' => 1),
        array('db' => 'Orders.date', 'dt' => 2),
        array('db' => 'Orders.deliveryDate', 'dt' => 3)
    );

    $columns2 = array(
        array('db' => 'column0', 'dt' => 0),
        array('db' => 'column1', 'dt' => 1),
        array('db' => 'column2', 'dt' => 2),
        array('db' => 'column3', 'dt' => 3)
    );

    // Where condition
    $whereOn = array("Suppliers.location = Locations.locationID");
    $where = "Orders.supplier = Suppliers.supplierID AND Orders.leavingDate IS NULL AND Suppliers.supplierID = " . $_GET['id'];

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
    $logs->createSimple("Configuración", "Proveedores - Pedidos - Consulta", "'Ha listado los pedidos de un proveedor'");
?>