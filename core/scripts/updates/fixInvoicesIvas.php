<?php   
    return;
    
    /* Script updated invoices ivas */
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
        
        updateInvoicesIvas();
        updateInvoicesBruto();
        updateReceivedInvoicesIvas();
    }

    function updateInvoicesIvas(){

        $db = new DbHandler;

        $result = $db->query("  SELECT  i.*
                                FROM    Invoices i, Expedients e
                                WHERE   i.leavingDate IS NULL
                                    AND i.expedient = e.expedientID 
                                    AND e.leavingDate IS NULL
        ");
       
        if(mysqli_num_rows($result) > 0){
            $invoices = $db->resultToArray($result);

            $createDate = time();
            foreach($invoices as $item){
                $expedient = $item['expedient'];
                $invoice = $item['ID'];

                // IVA 10 %
                $typeIva = 10;
                $base = $item['base10'];
                $iva = $item['IVA10'];
                $db->query("
                    INSERT INTO Invoices_Ivas(expedient, invoice, typeIva, base, iva, createDate) 
                    VALUES ($expedient, $invoice, $typeIva, $base, $iva, $createDate)
                ");

                // IVA 21 %
                $typeIva = 21;
                $base = $item['base21'];
                $iva = $item['IVA21'];
                $db->query("
                    INSERT INTO Invoices_Ivas(expedient, invoice, typeIva, base, iva, createDate) 
                    VALUES ($expedient, $invoice, $typeIva, $base, $iva, $createDate)
                ");
            }
        }
    }

    function updateInvoicesBruto(){

        $db = new DbHandler;

        $result = $db->query("  SELECT  i.*
                                FROM    Invoices i, Expedients e
                                WHERE   i.leavingDate IS NULL
                                    AND i.expedient = e.expedientID 
                                    AND e.leavingDate IS NULL
        ");
       
        if(mysqli_num_rows($result) > 0){
            $invoices = $db->resultToArray($result);

            foreach($invoices as $item){
                $invoice = $item['ID'];

                $bruto = floatval($item['supplieds']) + floatval($item['base10']) + floatval($item['base21']);

                $result = $db->query("  UPDATE  Invoices 
                                        SET     bruto = $bruto
                                        WHERE   ID = $invoice
                ");
            }
        }
    }

    function updateReceivedInvoicesIvas(){

        $db = new DbHandler;

        $result = $db->query("  SELECT  ri.*
                                FROM    Received_Invoices ri
                                WHERE   ri.leavingDate IS NULL AND
                                        ri.deliveryNote IS NULL
        ");
       
        if(mysqli_num_rows($result) > 0){
            $invoices = $db->resultToArray($result);

            $createDate = time();
            foreach($invoices as $item){
                $invoice = $item['ID'];

                // Taxbase 1
                if(floatval($item['taxBase']) > 0 && (floatval($item['feeHoldIva']) > 0)){
                    $base = $item['taxBase'];
                    $typeIva = $item['feeHoldIva'];
                    $iva = floatval($item['taxBase']) * floatval($item['feeHoldIva']) / 100;

                    $db->query("
                        INSERT INTO Received_Invoices_Ivas(received_invoice, typeIva, base, iva, createDate) 
                        VALUES ($invoice, $typeIva, $base, $iva, $createDate)
                    ");
                }

                // Taxbase 2
                if(floatval($item['taxBase2']) > 0 && (floatval($item['feeHoldIva2']) > 0)){
                    $base = $item['taxBase2'];
                    $typeIva = $item['feeHoldIva2'];
                    $iva = floatval($item['taxBase2']) * floatval($item['feeHoldIva2']) / 100;

                    $db->query("
                        INSERT INTO Received_Invoices_Ivas(received_invoice, typeIva, base, iva, createDate) 
                        VALUES ($invoice, $typeIva, $base, $iva, $createDate)
                    ");
                }

                // Taxbase 3
                if(floatval($item['taxBase3']) > 0 && (floatval($item['feeHoldIva3']) > 0)){
                    $base = $item['taxBase3'];
                    $typeIva = $item['feeHoldIva3'];
                    $iva = floatval($item['taxBase3']) * floatval($item['feeHoldIva3']) / 100;

                    $db->query("
                        INSERT INTO Received_Invoices_Ivas(received_invoice, typeIva, base, iva, createDate) 
                        VALUES ($invoice, $typeIva, $base, $iva, $createDate)
                    ");
                }
            }
        }
    }
?>

