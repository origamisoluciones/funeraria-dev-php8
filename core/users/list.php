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
    $table = array('Users', 'Users_Types');
    
    // Table's primary key
    $primaryKey = 'Users.userID';

    // Array of database columns which should be read and sent back to DataTables.
    // The `db` parameter represents the column name in the database, while the `dt`
    // parameter represents the DataTables column identifier. In this case simple
    // indexes
    $columns = array(
        array('db' => 'Users.userID', 'dt' => 0),
        array('db' => 'Users.username', 'dt' => 1),
        array('db' => 'Users.name', 'dt' => 2),
        array('db' => 'Users.mail', 'dt' => 3),
        array('db' => 'Users_Types.name', 'dt' => 4),
        array('db' => 'Users.leavingDate', 'dt' => 5)
    );

    $columns2 = array(
        array('db' => 'column0', 'dt' => 0),
        array('db' => 'column1', 'dt' => 1),
        array('db' => 'column2', 'dt' => 2),
        array('db' => 'column3', 'dt' => 3),
        array('db' => 'column4', 'dt' => 4),
        array('db' => 'column5', 'dt' => 5)
    );

    // SQL server connection information
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    $db = new DbHandler;
    $sql_details = $db->getDataConnection();

    // Where condition
    if(isset($_GET['all'])){
        if($_GET['all'] == 1){
            //Mostrar dados de baja
            $where = array("Users.type = Users_Types.userTypeID");
        }else{
            $where = array("Users.type = Users_Types.userTypeID AND Users.leavingDate IS NULL");
        }
    }else{
        $where = array("Users.type = Users_Types.userTypeID AND Users.leavingDate IS NULL");
    }
    
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
    $logs->createSimple("Configuración", "Usuarios - Consulta", "'Ha consultado los usuarios'");
?>