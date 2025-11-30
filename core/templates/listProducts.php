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
    $table1 = 'Templates_Products';
    $table2 = array('Products', 'Suppliers', 'Products_Models', 'Products_Prices', 'IVA_Types');
    
    // Table's primary key
    $primaryKey = 'Templates_Products.ID';

    // Array of database columns which should be read and sent back to DataTables.
    // The `db` parameter represents the column name in the database, while the `dt`
    // parameter represents the DataTables column identifier. In this case simple
    // indexes
    $columns = array(
        array('db' => 'Templates_Products.check', 'dt' => 0),
        array('db' => 'Templates_Products.template', 'dt' => 1),
        array('db' => 'Templates_Products.supplier', 'dt' => 2),
        array('db' => 'Suppliers.name', 'dt' => 3),
        array('db' => 'Templates_Products.product', 'dt' => 4),
        array('db' => 'Products.name', 'dt' => 5),
        array('db' => 'Templates_Products.model', 'dt' => 6),
        array('db' => 'Products_Models.name', 'dt' => 7),
        array('db' => '(Products_Prices.priceNoIVA * IVA_Types.percentage / 100 + Products_Prices.priceNoIVA)', 'dt' => 8),
        array('db' => 'Templates_Products.amount', 'dt' => 9),
        array('db' => 'Templates_Products.texts', 'dt' => 10),
        array('db' => 'Templates_Products.discount', 'dt' => 11),
        array('db' => '((Products_Prices.priceNoIVA * IVA_Types.percentage / 100 + Products_Prices.priceNoIVA) - ((Products_Prices.priceNoIVA * IVA_Types.percentage / 100 + Products_Prices.priceNoIVA) * Templates_Products.discount / 100) )* Templates_Products.amount', 'dt' => 12),
        array('db' => 'Products.amount', 'dt' => 13),
        array('db' => 'Products.texts', 'dt' => 14),
        array('db' => 'Templates_Products.ID', 'dt' => 15)

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
        array('db' => 'column11', 'dt' => 11),
        array('db' => 'column12', 'dt' => 12),
        array('db' => 'column13', 'dt' => 13),
        array('db' => 'column14', 'dt' => 14),
        array('db' => 'column15', 'dt' => 15)
    );

    if(isset($_GET['template'])){
        $template = $_GET['template'];
        $client = $_GET['client'];

        $whereOn = array("Products.productID = Templates_Products.product", 
                         "Templates_Products.supplier = Suppliers.supplierID",
                         "Templates_Products.model = Products_Models.productModelID",
                         "Products_Prices.model = Templates_Products.model",
                         "IVA_Types.IVATypeID = Products.IVA");
        $where = "  Products.leavingDate IS NULL AND
                    Templates_Products.template = " . $template . "  AND 
                    Products_Prices.price = " . $client . " AND 
                    Products_Models.leavingDate IS NULL";
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
        SSP::complexLeftJoin($_GET, $sql_details, $table1, $table2, $primaryKey, 
                             $columns, $columns2, $whereOn, $where, null, null)
    );

    /*require_once($_SESSION['basePath'] . "model/logs.php");
    
    $logs = new Logs;
    $logs->createExpedient("Expedients", $expedient, "Expedientes - Contrataciones - Lista", 
                           "'Ha listado los detalles de la contratación del expediente " . $expedient . "'");*/
?>