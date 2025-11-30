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
    $table1 = 'Carriers';
    $table2 = array('Locations');
    
    // Table's primary key
    $primaryKey = 'Carriers.carrierID';

    // Array of database columns which should be read and sent back to DataTables.
    // The `db` parameter represents the column name in the database, while the `dt`
    // parameter represents the DataTables column identifier. In this case simple
    // indexes
    $columns = array(
        array('db' => 'Carriers.carrierID', 'dt' => 0),
        array('db' => 'Carriers.name', 'dt' => 1),
        array('db' => 'Carriers.surname', 'dt' => 2),
        array('db' => 'Carriers.drives', 'dt' => 3),
        array('db' => 'Carriers.entryDate', 'dt' => 4),
        array('db' => 'Locations.name', 'dt' => 5),
        array('db' => 'Carriers.phones', 'dt' => 6),
        array('db' => 'Carriers.leavingDate', 'dt' => 7)
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

    // Where condition
    $whereOn = array("Carriers.location = Locations.locationID");
    if(isset($_GET['leavingDate'])){
        if($_GET['leavingDate'] == 0){
            $where = "Carriers.leavingDate IS NULL";
        }else{
            $where = "Carriers.leavingDate IS NOT NULL";
        }
    }else{
        $where = "Carriers.leavingDate IS NULL";
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
        SSP::complexLeftJoin($_GET, $sql_details, $table1, $table2, $primaryKey, $columns, $columns2, $whereOn, $where)
    );

    require_once($_SESSION['basePath'] . "model/logs.php");

    $logs = new Logs;
    $logs->createSimple("Configuración", "Porteadores - Consulta", "'Ha consultado los porteadores'");
?>