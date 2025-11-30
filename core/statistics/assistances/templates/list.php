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
    $table = array('Statistics_Assistances');
    
    // Table's primary key
    $primaryKey = 'Statistics_Assistances.ID';

    // Array of database columns which should be read and sent back to DataTables.
    // The `db` parameter represents the column name in the database, while the `dt`
    // parameter represents the DataTables column identifier. In this case simple
    // indexes
    $columns = array(
        array('db' => 'Statistics_Assistances.ID', 'dt' => 0),
        array('db' => 'Statistics_Assistances.name', 'dt' => 1)
    );

    $columns2 = array(
        array('db' => 'column0', 'dt' => 0),
        array('db' => 'column1', 'dt' => 1)
    );

    $where = "Statistics_Assistances.leavingDate IS NULL";

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
        SSP::complex($_GET, $sql_details, $table, $primaryKey, $columns, $columns2, null, $where)
    );

    require_once($_SESSION['basePath'] . "model/logs.php");
    
    $logs = new Logs;
    $logs->createSimple("Settings - Statistics", "Asistencias", "'Ha listado las plantillas para asistencias'");
?>