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
    $table1 = 'Financing';
    $table2 = array('Financing_Destinations', 'Financing_Methods', 'Mortuaries');
    
    // Table's primary key
    $primaryKey = 'Financing.ID';

    // Array of database columns which should be read and sent back to DataTables.
    // The `db` parameter represents the column cif in the database, while the `dt`
    // parameter represents the DataTables column identifier. In this case simple
    // indexes
    $columns = array(
        array('db' => 'Financing.ID', 'dt' => 0),
        array('db' => 'Financing.name', 'dt' => 1),
        array('db' => 'Financing.providerEntity', 'dt' => 2),
        array('db' => 'Financing_Destinations.name', 'dt' => 3),
        array('db' => 'Financing.startDate', 'dt' => 4),
        array('db' => 'Financing.endDate', 'dt' => 5),
        array('db' => 'Financing.term', 'dt' => 6),
        array('db' => 'Financing.pendingFee', 'dt' => 7),
        array('db' => 'Financing.amortization', 'dt' => 8),
        array('db' => 'Financing.initialCapital', 'dt' => 9),
        array('db' => 'Financing.amortizedCapital', 'dt' => 10),
        array('db' => 'Financing.pendingCapital', 'dt' => 11),
        array('db' => 'Financing_Methods.name', 'dt' => 12),
        array('db' => 'Mortuaries.name', 'dt' => 13)
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
        array('db' => 'column11', 'dt' => 11),
        array('db' => 'column12', 'dt' => 12),
        array('db' => 'column13', 'dt' => 13)
    );

    // SQL server connection information
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    $db = new DbHandler;
    $sql_details = $db->getDataConnection();

    // Where condition
    $whereOn = array("Financing.destination = Financing_Destinations.ID", "Financing.payMethod = Financing_Methods.ID",
                     "Financing.financeCenter = Mortuaries.mortuaryID");
    //$whereOn = null;
    //$where = "FuneralHomes.leavingDate IS NULL AND FuneralHomes.funeralHomeID != 1";
    $where = "Financing.leavingDate IS NULL";
    
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
    $logs->createSimple("Salidas", "Financiación - Consulta", "'Ha consultado las financiaciones'");
?>