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
    $table = array('BellRingers');
    
    // Table's primary key
    $primaryKey = 'BellRingers.ID';

    // Array of database columns which should be read and sent back to DataTables.
    // The `db` parameter represents the column name in the database, while the `dt`
    // parameter represents the DataTables column identifier. In this case simple
    // indexes
    $columns = array(
        array('db' => 'BellRingers.ID', 'dt' => 0),
        array('db' => 'BellRingers.name', 'dt' => 1),
        array('db' => 'BellRingers.surname', 'dt' => 2),
        array('db' => 'BellRingers.parish', 'dt' => 3),
        array('db' => 'BellRingers.mobilePhone', 'dt' => 4)
    );

    $columns2 = array(
        array('db' => 'column0', 'dt' => 0),
        array('db' => 'column1', 'dt' => 1),
        array('db' => 'column2', 'dt' => 2),
        array('db' => 'column3', 'dt' => 3),
        array('db' => 'column4', 'dt' => 4)
    );

    $where = "BellRingers.leavingDate IS NULL";

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
    $logs->createSimple("Configuración", "Campaneros - Consulta", "'Ha consultado los campaneros'");
?>