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
        
        doTask();
    }

    function doTask(){
        $db = new DbHandler;

        $result = $db->query("  SELECT      e.expedientID, i.ID as invoiceID, i.generatedInvoiceNumber, i.sequence_rectified
                                FROM        Expedients e, Invoices i
                                WHERE       e.leavingDate IS NULL AND
                                            e.expedientID = i.expedient AND
                                            i.leavingDate IS NULL
                                ORDER BY    e.expedientID
        ");
       
        if(mysqli_num_rows($result) > 0){

            $invoices = $db->resultToArray($result);

            foreach($invoices as $item){
                $expedientID = $item['expedientID'];
                $invoiceID = $item['invoiceID'];
                $invoiceNumber = $item['generatedInvoiceNumber'];
                $isRectificated = $item['sequence_rectified'];
                $invoiceNumber = str_replace('/', '-', $invoiceNumber);

                $expedientDocsPath = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/$expedientID/docs/";

                if(!is_dir($expedientDocsPath)){
                    mkdir($expedientDocsPath, 0777, true);
                }

                foreach(scandir($expedientDocsPath) as $fl){
                    if(
                        ($fl == 'factura-logo.pdf' || $fl == 'factura.pdf') &&  $isRectificated == null
                    ){

                        $invoiceFolder = $expedientDocsPath . "invoices/$invoiceID";
                        if(!is_dir($invoiceFolder)){
                            mkdir($invoiceFolder, 0777, true);
                        }

                        if($fl == 'factura-logo.pdf'){
                            $dest = $invoiceFolder . '/' . $invoiceNumber .'.pdf';
                        }else if($fl == 'factura.pdf'){
                            $dest = $invoiceFolder . '/' . $invoiceNumber .'_no-logo.pdf';
                        }

                        $source = $expedientDocsPath . $fl;
                        exec("cp -r $source $dest");
                    }else if(
                        ($fl == 'factura-logo-rectificada.pdf' || $fl == 'factura-rectificada.pdf') && $isRectificated != null
                    ){

                        $invoiceFolder = $expedientDocsPath . "invoices/$invoiceID";
                        if(!is_dir($invoiceFolder)){
                            mkdir($invoiceFolder, 0777, true);
                        }

                        if($fl == 'factura-logo-rectificada.pdf'){
                            $dest = $invoiceFolder . '/' . $invoiceNumber .'.pdf';
                        }else if($fl == 'factura-rectificada.pdf'){
                            $dest = $invoiceFolder . '/' . $invoiceNumber .'_no-logo.pdf';
                        }
                        
                        $source = $expedientDocsPath . $fl;
                        exec("cp -r $source $dest");
                    }
                }
            }
        }
    }
?>