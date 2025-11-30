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

    if(empty($_GET) || !isset($_GET['year'])){
        http_response_code(405);
        return;
    }

    // DB table to use
    $table1 = 'Financing_Cuotas';
    $table2 = array('Financing');
    
    // Table's primary key
    $primaryKey = 'Financing_Cuotas.ID';

    $columns = array(
        array('db' => 'Financing_Cuotas.ID', 'dt' => 0),
        array('db' => 'Financing_Cuotas.financing', 'dt' => 1),
        array('db' => 'Financing_Cuotas.ID', 'dt' => 2),
        array('db' => 'Financing_Cuotas.startDate', 'dt' => 3),
        array('db' => 'Financing_Cuotas.endDate', 'dt' => 4),
        array('db' => 'Financing_Cuotas.cuote', 'dt' => 5),
        array('db' => 'Financing_Cuotas.interest', 'dt' => 6),
        array('db' => 'Financing_Cuotas.amortization', 'dt' => 7),
        array('db' => 'Financing_Cuotas.pendingCapital', 'dt' => 8),
        array('db' => 'Financing_Cuotas.payDate', 'dt' => 9),
        array('db' => 'Financing_Cuotas.payDate', 'dt' => 10),
        array('db' => 'Financing_Cuotas.extraAmortization', 'dt' => 11)
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

    // SQL server connection information
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    $db = new DbHandler;
    $sql_details = $db->getDataConnection();

    // Where condition
    $whereOn = array("Financing_Cuotas.financing = Financing.ID");
    //$whereOn = null;
    //$where = "FuneralHomes.leavingDate IS NULL AND FuneralHomes.funeralHomeID != 1";
    $where = "Financing_Cuotas.financing = " . $_GET['financingID'] . " AND FROM_UNIXTIME(Financing_Cuotas.startDate, '%Y') = " . $_GET['year'];
    
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
    $logs->createSimple("Salidas", "Financiación", "'Ha listado las cuotas de las financiaciones'");
?>