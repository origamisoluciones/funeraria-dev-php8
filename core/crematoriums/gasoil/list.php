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
    
    // DB table to use
    $table1 = 'Gasoil';
    $table2 = array('IVA_Types', 'Suppliers');
    
    // Table's primary key
    $primaryKey = 'Gasoil.gasoilID';

    // Array of database columns which should be read and sent back to DataTables.
    // The `db` parameter represents the column name in the database, while the `dt`
    // parameter represents the DataTables column identifier. In this case simple
    // indexes
    $columns = array(
        array('db' => 'Gasoil.gasoilID', 'dt' => 0),
        array('db' => 'Gasoil.hasOrder', 'dt' => 1),
        array('db' => 'Suppliers.name', 'dt' => 2),
        array('db' => 'Gasoil.date', 'dt' => 3),
        array('db' => 'Gasoil.priceLitre', 'dt' => 4),
        array('db' => 'Gasoil.litres', 'dt' => 5),
        array('db' => 'IVA_Types.name', 'dt' => 6),
        array('db' => 'Gasoil.total', 'dt' => 7)
    );

    $columns2 = array(
        array('db' => 'column0', 'dt' => 0),
        array('db' => 'column1', 'dt' => 1),
        array('db' => 'column2', 'dt' => 2),
        array('db' => 'column3', 'dt' => 3),
        array('db' => 'column4', 'dt' => 4),
        array('db' => 'column5', 'dt' => 5),
        array('db' => 'column6', 'dt' => 6),
        array('db' => 'column7', 'dt' => 7)
    );

    $whereOn = array( "IVA_Types.IVATypeID = Gasoil.ivaID", "Suppliers.supplierID = Gasoil.supplier");
    $where = "Gasoil.leavingDate IS NULL";

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
    $logs->createSimple("Gasoil", "Gasoil - Consulta", "'Ha consulta los gasoils'");
?>