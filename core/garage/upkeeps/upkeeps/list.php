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

    if(empty($_GET) || !isset($_GET['year']) || !isset($_GET['month']) || !isset($_GET['trimester'])){
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
    $table = array('Upkeeps', 'Cars');
    
    // Table's primary key
    $primaryKey = 'Upkeeps.ID';

    // Array of database columns which should be read and sent back to DataTables.
    // The `db` parameter represents the column name in the database, while the `dt`
    // parameter represents the DataTables column identifier. In this case simple
    // indexes
    $columns = array(
        array('db' => 'Upkeeps.ID', 'dt' => 0),
        array('db' => 'Cars.brand', 'dt' => 1),
        array('db' => 'Cars.licensePlate', 'dt' => 2),
        array('db' => 'Upkeeps.date', 'dt' => 3),
        array('db' => 'Upkeeps.kms', 'dt' => 4),
        array('db' => 'Upkeeps.cost', 'dt' => 5),
        array('db' => 'Upkeeps.engineOil', 'dt' => 6),
        array('db' => 'Upkeeps.oilFilter', 'dt' => 7),
        array('db' => 'Upkeeps.fuelFilter', 'dt' => 8),
        array('db' => 'Upkeeps.airFilter', 'dt' => 9),
        array('db' => 'Upkeeps.boxATF', 'dt' => 10),
        array('db' => 'Upkeeps.sparkPlug', 'dt' => 11),
        array('db' => 'Upkeeps.coolingLiquid', 'dt' => 12),
        array('db' => 'Upkeeps.brakesLiquid', 'dt' => 13),
        array('db' => 'Upkeeps.battery', 'dt' => 14),
        array('db' => 'Upkeeps.frontBrakes', 'dt' => 15),
        array('db' => 'Upkeeps.rearBrakes', 'dt' => 16),
        array('db' => 'Upkeeps.timingBelt', 'dt' => 17),
        array('db' => 'Upkeeps.converterATF', 'dt' => 18),
        array('db' => 'Upkeeps.differentialATF', 'dt' => 19),
        array('db' => 'Upkeeps.otherFilters', 'dt' => 20)
    );

    $columns2 = array(
        array('db' => 'column0', 'dt' => 0),
        array('db' => 'column1', 'dt' => 1),
        array('db' => 'column2', 'dt' => 2),
        array('db' => 'column3', 'dt' => 3),
        array('db' => 'column4', 'dt' => 4),
        array('db' => 'column5', 'dt' => 5),
        array('db' => 'column5', 'dt' => 6),
        array('db' => 'column5', 'dt' => 7),
        array('db' => 'column5', 'dt' => 8),
        array('db' => 'column5', 'dt' => 9),
        array('db' => 'column5', 'dt' => 10),
        array('db' => 'column5', 'dt' => 11),
        array('db' => 'column5', 'dt' => 12),
        array('db' => 'column5', 'dt' => 13),
        array('db' => 'column5', 'dt' => 14),
        array('db' => 'column5', 'dt' => 15),
        array('db' => 'column5', 'dt' => 16),
        array('db' => 'column5', 'dt' => 17),
        array('db' => 'column5', 'dt' => 18),
        array('db' => 'column5', 'dt' => 19),
        array('db' => 'column5', 'dt' => 20)
    );

    $where = "Upkeeps.leavingDate IS NULL AND Upkeeps.car = Cars.ID AND Cars.leavingDate IS NULL";
    $groupBy = "Upkeeps.date";
    $orderBy = "Upkeeps.date ASC";

    if($_GET['year'] > 0){
        $where .= " AND FROM_UNIXTIME(Upkeeps.date, '%Y') = " . $_GET['year'];
    }
    
    if($_GET['month'] > 0){
        $where .= " AND FROM_UNIXTIME(Upkeeps.date, '%m') = " . $_GET['month'];
    }

    switch($_GET['trimester']){
        case 1:
            $where .= " AND FROM_UNIXTIME(Upkeeps.date, '%m') > 0 AND FROM_UNIXTIME(Upkeeps.date, '%m') < 4";
            break;
        case 2:
            $where .= " AND FROM_UNIXTIME(Upkeeps.date, '%m') > 3 AND FROM_UNIXTIME(Upkeeps.date, '%m') < 7";
            break;
        case 3:
            $where .= " AND FROM_UNIXTIME(Upkeeps.date, '%m') > 6 AND FROM_UNIXTIME(Upkeeps.date, '%m') < 10";
            break;
        case 4:
            $where .= " AND FROM_UNIXTIME(Upkeeps.date, '%m') > 9 AND FROM_UNIXTIME(Upkeeps.date, '%m') < 13";
            break;
    }

    if($_GET['vehicle'] > 0){
        $where .= " AND Cars.ID = " . $_GET['vehicle'];
    }

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
        SSP::complexGroupByOrderBy($_GET, $sql_details, $table, $primaryKey, $columns, $columns2, null, $where, $groupBy, $orderBy)
    );

    require_once($_SESSION['basePath'] . "model/logs.php");

    $logs = new Logs;
    $logs->createSimple("Upkeeps", "Mantenimientos - Listar", "'Ha listado los mantenimientos'");
?>