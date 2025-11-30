<?php
    return;
    
    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";
    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }
    
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    // Get all companies
    $dbSettings = new DbHandler;
    $result = $dbSettings->query("  SELECT  c.id
                                    FROM    Companies c
                                    WHERE   c.leaving_date IS NULL
    ");
    $listCompanies = [];
    if(mysqli_num_rows($result) > 0){
        $listCompanies = $dbSettings->resultToArray($result);
    }

    // Run for all companies
    foreach($listCompanies as $comp){
        $_SESSION['company'] = $comp['id'];
        
        updateInvoicesFS();
        updateInvoicesV();
        updateInvoicesD();
        updateInvoicesFR();
    }

    function updateInvoicesFS(){
        $db = new DbHandler;

        $result = $db->query("  SELECT  ID 
                                FROM    `Invoices` 
                                WHERE   `sequence_cash_customer` IS NOT NULL 
                                    AND `leavingDate` IS NULL
        ");
       
        if(mysqli_num_rows($result) > 0){

            $invoices = $db->resultToArray($result);

            foreach($invoices as $item){
                $invoiceID = $item['ID'];
                
                $result = $db->query("  UPDATE  Invoices 
                                        SET     billingSerie = 5
                                        WHERE   ID = $invoiceID
                ");

            }
        }
    }

    function updateInvoicesV(){
        $db = new DbHandler;

        $result = $db->query("  SELECT  ID
                                FROM    Invoices i, Expedients e
                                WHERE   i.sequence_cash_customer IS NULL AND
                                        i.sequence_rectified IS NULL AND 
                                        i.leavingDate IS NULL AND
                                        i.expedient = e.expedientID AND
                                        e.leavingDate IS NULL AND
                                        e.type = 3
        ");
       
        if(mysqli_num_rows($result) > 0){

            $invoices = $db->resultToArray($result);

            foreach($invoices as $item){
                $invoiceID = $item['ID'];
                
                $result = $db->query("  UPDATE  Invoices 
                                        SET     billingSerie = 3
                                        WHERE   ID = $invoiceID
                ");

            }
        }
    }

    function updateInvoicesD(){
        $db = new DbHandler;

        $result = $db->query("  SELECT  ID
                                FROM    Invoices i, Expedients e
                                WHERE   i.sequence_cash_customer IS NULL AND
                                        i.sequence_rectified IS NULL AND 
                                        i.leavingDate IS NULL AND
                                        i.expedient = e.expedientID AND
                                        e.leavingDate IS NULL AND
                                        e.type = 1
        ");
       
        if(mysqli_num_rows($result) > 0){

            $invoices = $db->resultToArray($result);

            foreach($invoices as $item){
                $invoiceID = $item['ID'];
                
                $result = $db->query("  UPDATE  Invoices 
                                        SET     billingSerie = 1
                                        WHERE   ID = $invoiceID
                ");
            }
        }
    }

    function updateInvoicesFR(){
        $db = new DbHandler;

        $result = $db->query("  SELECT  ID
                                FROM    Invoices i
                                WHERE   i.sequence_rectified IS NOT NULL AND 
                                        i.leavingDate IS NULL 
        ");
       
        if(mysqli_num_rows($result) > 0){

            $invoices = $db->resultToArray($result);

            foreach($invoices as $item){
                $invoiceID = $item['ID'];
                
                $result = $db->query("  UPDATE  Invoices 
                                        SET     billingSerie = 7
                                        WHERE   ID = $invoiceID
                ");
            }
        }
    }
?>