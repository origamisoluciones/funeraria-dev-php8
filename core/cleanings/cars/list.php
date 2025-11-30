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
    $table1 = 'Expedients';
    $table2 = array('Services_Cars', 'Cars', 'Users', 'Carriers');
    
    // Table's primary key
    $primaryKey = 'Expedients.expedientID';

    // indexes
    $columns = array(
        array('db' => 'Expedients.expedientID', 'dt' => 0),
        array('db' => 'Expedients.number', 'dt' => 1),
        array('db' => 'Expedients.entryDate', 'dt' => 2),
        array('db' => 'Cars.brand', 'dt' => 3),
        array('db' => 'Cars.model', 'dt' => 4),
        array('db' => 'Cars.licensePlate', 'dt' => 5),
        array('db' => 'Users.name', 'dt' => 6),
        array('db' => 'Carriers.name', 'dt' => 7)
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
    $whereOn = array("Expedients.expedientID = Services_Cars.service", "Services_Cars.car = Cars.ID", "Services_Cars.cleanBefore = Users.userID", "Services_Cars.cleanAfter = Carriers.carrierID");

    $where = "Expedients.leavingDate IS NULL";

    if($_GET['from'] > 0){
        $where .= " AND UNIX_TIMESTAMP(Expedients.entryDate) >= " . $_GET['from'];
    }
    
    if($_GET['to'] > 0){
        $where .= " AND UNIX_TIMESTAMP(Expedients.entryDate) < " . ($_GET['to'] + 60*60*24);
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
    $logs->createSimple("Mantenimiento", "Limpieza coches - Consulta", "'Ha consultado la limpieza de los coches'");

    
?>