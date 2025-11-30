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
    $table = array('Assistances', 'Expedients');
    
    // Table's primary key
    $primaryKey = 'Assistances.ID';

    // Array of database columns which should be read and sent back to DataTables.
    // The `db` parameter represents the column name in the database, while the `dt`
    // parameter represents the DataTables column identifier. In this case simple
    // indexes
    $columns = array(
        array('db' => 'Assistances.ID', 'dt' => 0),
        array('db' => 'Assistances.attendanceDate', 'dt' => 1),
        array('db' => 'Expedients.number', 'dt' => 2),
        array('db' => 'Expedients.deceasedName', 'dt' => 3),
        array('db' => 'Expedients.deceasedSurname', 'dt' => 4)
    );

    $columns2 = array(
        array('db' => 'column0', 'dt' => 0),
        array('db' => 'column1', 'dt' => 1),
        array('db' => 'column2', 'dt' => 2),
        array('db' => 'column3', 'dt' => 3),
        array('db' => 'column4', 'dt' => 4)
    );

    $where = "Assistances.expedient = Expedients.expedientID AND Assistances.leavingDate IS NULL";
    
    if(isset($_GET['year'])){
        $where .= " AND FROM_UNIXTIME(Assistances.attendanceDate, '%Y') = " . $_GET['year'];
    }
    
    if(isset($_GET['month'])){
        $where .= " AND FROM_UNIXTIME(Assistances.attendanceDate, '%m') = " . $_GET['month'];
    }

    if(isset($_GET['from']) && isset($_GET['to'])){
        $where .= " AND Assistances.attendanceDate BETWEEN " . $_GET['from'] . " AND " . $_GET['to'];
    }

    if(isset($_GET['trimester'])){
        switch($_GET['trimester']){
            case 1:
                $where .= " AND FROM_UNIXTIME(Assistances.attendanceDate, '%m') > 0 AND FROM_UNIXTIME(Assistances.attendanceDate, '%m') < 4";
                break;
            case 2:
                $where .= " AND FROM_UNIXTIME(Assistances.attendanceDate, '%m') > 3 AND FROM_UNIXTIME(Assistances.attendanceDate, '%m') < 7";
                break;
            case 3:
                $where .= " AND FROM_UNIXTIME(Assistances.attendanceDate, '%m') > 6 AND FROM_UNIXTIME(Assistances.attendanceDate, '%m') < 10";
                break;
            case 4:
                $where .= " AND FROM_UNIXTIME(Assistances.attendanceDate, '%m') > 9 AND FROM_UNIXTIME(Assistances.attendanceDate, '%m') < 13";
                break;
        }
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
        SSP::complex($_GET, $sql_details, $table, $primaryKey, $columns, $columns2, null, $where)
    );

    require_once($_SESSION['basePath'] . "model/logs.php");
    
    $logs = new Logs;
    $logs->createSimple("Statistics", "Asistencias", "'Ha listado las asistencias'");
?>