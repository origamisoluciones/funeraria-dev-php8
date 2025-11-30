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

    if(empty($_GET) || !isset($_GET['expedient'])){
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
    $table1 = 'Expedients_Documents';
    $table2 = array('Users');
    
    // Table's primary key
    $primaryKey = 'Expedients_Documents.ID';

    // Array of database columns which should be read and sent back to DataTables.
    // The `db` parameter represents the column name in the database, while the `dt`
    // parameter represents the DataTables column identifier. In this case simple
    // indexes
    $columns = array(
        array('db' => 'Expedients_Documents.ID', 'dt' => 0),
        array('db' => 'Users.username', 'dt' => 1),
        array('db' => 'Expedients_Documents.date', 'dt' => 2),
        array('db' => 'Expedients_Documents.name', 'dt' => 3),
        array('db' => 'Expedients_Documents.file', 'dt' => 4),
        array('db' => 'Expedients_Documents.type', 'dt' => 5),
        array('db' => 'Expedients_Documents.nameFile', 'dt' => 6)
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

    // Where condition
    $whereAux = '';
    switch(intval($_SESSION['company'])){
        case 9:
            $whereAux = '';
        break;
        default:
            $whereAux = ' OR Expedients_Documents.type = 17 OR Expedients_Documents.type = 18';
        break;
    }
    $where = "(Expedients_Documents.type = 13 OR Expedients_Documents.type = 14 OR Expedients_Documents.type = 32 OR Expedients_Documents.type = 30 OR Expedients_Documents.type = 40 OR
              Expedients_Documents.type = 31 OR Expedients_Documents.type = 23 OR Expedients_Documents.type = 9 OR 
              Expedients_Documents.type = 16 OR Expedients_Documents.type = 26 OR Expedients_Documents.type = 28 OR
              Expedients_Documents.type = 29 $whereAux) AND Expedients_Documents.expedient = " . $_GET['expedient'];
    $whereOn = array("Expedients_Documents.user = Users.userID");

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
?>