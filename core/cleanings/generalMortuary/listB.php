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

    if(empty($_GET) || !isset($_GET['from2']) || !isset($_GET['to2'])){
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
    $table = array('Expedients', 'Mortuaries', 'VisitsControl');
    
    // Table's primary key
    $primaryKey = 'Expedients.expedientID';

    // Array of database columns which should be read and sent back to DataTables.
    // The `db` parameter represents the column name in the database, while the `dt`
    // parameter represents the DataTables column identifier. In this case simple
    // indexes
    $columns = array(
        array('db' => 'Expedients.expedientID', 'dt' => 0),
        array('db' => 'Expedients.requestDate', 'dt' => 1),
        array('db' => 'Expedients.number', 'dt' => 2),
        array('db' => 'Mortuaries.name', 'dt' => 3),
        array('db' => 'Expedients.deceasedRoom', 'dt' => 4)
    );

    $columns2 = array(
        array('db' => 'column0', 'dt' => 0),
        array('db' => 'column1', 'dt' => 1),
        array('db' => 'column2', 'dt' => 2),
        array('db' => 'column3', 'dt' => 3),
        array('db' => 'column4', 'dt' => 4)
    );

    // Conditions
    $where = "  Expedients.deceasedMortuary = Mortuaries.mortuaryID AND
                Expedients.leavingDate IS NULL AND
                Expedients.expedientID = VisitsControl.expedient";
    
    if($_GET['from2'] > 0){
        $where .= " AND UNIX_TIMESTAMP(Expedients.requestDate) > " . $_GET['from2'];
    }
    
    if($_GET['to2'] > 0){
        $where .= " AND UNIX_TIMESTAMP(Expedients.requestDate) < " . ($_GET['to2'] + 60*60*24);
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
    $logs->createSimple("Mantenimiento", "Registro limpieza - Consulta", "'Ha listado los registros de la limpieza'");
?>