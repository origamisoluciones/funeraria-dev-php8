<?php

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
        
        updateInvoices();
        updateExpedientsHirings();
        updateExpedientsHiringsRectified();

        var_dump("FINISHED COMPANY: " . $_SESSION['company']);
    }

    function updateInvoices(){
        $db = new DbHandler;

        $result = $db->query("  SELECT      e.expedientID, i.ID as invoiceID, i.sequence_rectified, i.creationDate,
                                            e.client, c.brandName, c.name, c.surname, c.type as clientType, c.nif
                                FROM        Expedients e, Invoices i, Clients c
                                WHERE       e.leavingDate IS NULL AND
                                            e.expedientID = i.expedient AND
                                            i.leavingDate IS NULL AND
                                            e.client = c.clientID
                                ORDER BY    e.expedientID
        ");

        if(mysqli_num_rows($result) > 0){

            $invoicesClients = $db->resultToArray($result);

            foreach($invoicesClients as $item){

                $expedientID = $item['expedientID'];
                $invoiceID = $item['invoiceID'];

                // Client id
                $client = $item['client'];
                // Client name - brandname
                if($item['clientType'] == 1){
                    $clientName = $item['name'] . ' ' . $item['surname'];
                }else{
                    if($item['brandName'] == null || ($item['brandName'] == '')){
                        $clientName = $item['name'] . ' ' . $item['surname'];
                    }else{
                        $clientName = $item['brandName'];
                    }
                }
                // Client nif
                $clientNif = $item['nif'];

                $invoiceType = $item['sequence_rectified'] == null || $item['sequence_rectified'] == '' ? 1 : 2;
                $rectifiedType = $invoiceType == 2 ? 2 : 'null';
                $numHiring = $invoiceType == 2 ? 1 : 0;

                // Obtenemos la factura original asociada a la factura rectificada
                $originalInvoiceRectified = 'null';
                if($numHiring == 1){

                    $result = $db->query("  SELECT      i.ID
                                            FROM        Expedients e, Invoices i
                                            WHERE       e.leavingDate IS NULL AND
                                                        e.expedientID = i.expedient AND
                                                        i.leavingDate IS NULL AND
                                                        e.expedientID = $expedientID AND
                                                        i.sequence_rectified IS NULL
                                            ORDER BY    e.expedientID
                    ");

                    if(mysqli_num_rows($result) > 0){
                        $invoiceRectified = $db->resultToArray($result)[0];
                        $originalInvoiceRectified =  $invoiceRectified['ID'];
                    }else{
                        var_dump("Error obteniendo la factura original de la rectificada - Exp: " . $expedientID);
                    }
                }

                $createDate = date('Y-m-d H:i:s', $item['creationDate']);

                $result = $db->query("  UPDATE  Invoices 
                                        SET     client = $client,
                                                clientName = '$clientName',
                                                clientNif = '$clientNif',
                                                invoice_type = $invoiceType,
                                                rectified_type = $rectifiedType,
                                                num_hiring = $numHiring,
                                                original_invoice_rectified = $originalInvoiceRectified,
                                                createDate = '$createDate'
                                        WHERE   ID = $invoiceID
                ");

                if(!$result){
                    var_dump("Error actualizando la tabla de invoices -  ID: " . $invoiceID);
                }

                $result = $db->query("  UPDATE  Expedients 
                                        SET     next_invoice_status = 1
                                        WHERE   expedientID = $expedientID
                ");

                if(!$result){
                    var_dump("Error actualizando la tabla de Expedients -  expedientID: " . $expedientID);
                }
            }
        }else{
            var_dump("Error obteniendo los expedientes con facturas");
        }
    }

    function updateExpedientsHirings(){

        $db = new DbHandler;

        $result = $db->query("  SELECT      e.priceExp, e.expedientID
                                FROM        Expedients e
                                WHERE       e.leavingDate IS NULL AND
                                            e.priceExp IS NOT NULL
        ");

        if(mysqli_num_rows($result) > 0){

            $hirings = $db->resultToArray($result);

            foreach($hirings as $item){

                $expedientID = $item['expedientID'];
                $priceExp = $item['priceExp'];

                $result = $db->query("  UPDATE  Expedients_Hirings 
                                        SET     priceExp = $priceExp
                                        WHERE   expedient = $expedientID
                ");

                if(!$result){
                    var_dump("Error actualizando la tabla de Expedients Hirings -  Expedient: " . $expedientID);
                }
            }
        }
    }

    function updateExpedientsHiringsRectified(){

        $db = new DbHandler;

        $result = $db->query("  SELECT      ehr.*, e.priceExp,
                                            eh.amount as original_hiring_amount
                                FROM        (Expedients_Hirings_Rectified ehr, Expedients e)
                                LEFT JOIN   Expedients_Hirings eh ON eh.ID = ehr.old_hiring
                                WHERE       e.leavingDate IS NULL AND
                                            ehr.expedient = e.expedientID
        ");

        if(mysqli_num_rows($result) > 0){

            $hiringsRectified = $db->resultToArray($result);

            foreach($hiringsRectified as $hiring){

                $priceExp = $hiring['priceExp'];
                $expedient = $hiring['expedient'];

                // Calculate extraID
                $result = $db->query(" SELECT MAX(ID) as id FROM Expedients_Hirings");

                $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 7);
                $extraID .= ($maxID+1);

                if($hiring['template'] == null){
                    $hiring['template'] = 'null';
                }
                if($hiring['warehouse'] == null){
                    $hiring['warehouse'] = 'null';
                }

                // Create new row in hiring
                $response = $db->query(" 
                    INSERT INTO Expedients_Hirings(
                        expedient, template, product, model, supplier, retail, 
                        amount, texts, discount, total, `check`, extraID, 
                        warehouse, num_hiring, priceExp, rectified_type, old_hiring
                    )
                    VALUES ($expedient, " . $hiring['template'] . ", " . $hiring['product'] . ", " . $hiring['model'] . ", " . $hiring['supplier'] . ", " . $hiring['retail'] . ",
                            " . $hiring['amount'] . ", '', " . $hiring['discount'] . ", " . $hiring['total'] . ", " . $hiring['check'] . ", '$extraID',
                            " . $hiring['warehouse'] . ", 1, $priceExp, 2, " . $hiring['old_hiring'] . "
                    )
                ");

                if(!$response){
                    var_dump('Error insert in Expedients_Hirings');
                }
                $newHiringId = $db->getLastInsertId();

                // Search Texts
                $result = $db->query("  SELECT  *
                                        FROM    Expedients_Texts_Rectified et
                                        WHERE   et.hiring = " . $hiring['ID'] . "
                ");

                if(mysqli_num_rows($result) > 0){
                    $currentHiringsTexts = $db->resultToArray($result);

                    foreach($currentHiringsTexts as $hirText){

                        $response = $db->query("
                            INSERT INTO Expedients_Texts(
                                hiring, rowIndex, value, discount
                            ) VALUES (
                                $newHiringId, " . $hirText['rowIndex'] . ", '" . $hirText['value'] . "', " . $hirText['discount'] . "
                            )
                        ");

                        if(!$response){
                            var_dump('Error insert in Expedients_Texts');
                        }
                    }
                }     

                // Pre Orders
                $result = $db->query("  SELECT  *
                                        FROM    Pre_Orders_Rectified po
                                        WHERE   po.leavingDate IS NULL AND
                                                po.hiring = " . $hiring['ID'] . "
                ");

                if(mysqli_num_rows($result) > 0){
                    $currentHiringsPreOrders = $db->resultToArray($result);

                    foreach($currentHiringsPreOrders as $hirOrd){

                        if($hirOrd['order'] == null){
                            $hirOrd['order'] = 'null';
                        }

                        $response = $db->query("
                            INSERT INTO Pre_Orders(
                                hiring, `order`, sentEmail, sendCopy
                            ) VALUES (
                                $newHiringId, " . $hirOrd['order'] . ", '" . $hirOrd['sentEmail'] . "', '" . $hirOrd['sendCopy'] . "'
                            )
                        ");

                        if(!$response){
                            var_dump('Error insert in Pre_Orders');
                        }
                    }
                }

                // Service Auto
                $result = $db->query("  SELECT  *
                                        FROM    Services_Auto sa
                                        WHERE   sa.hiring = " . $hiring['old_hiring'] . "
                ");

                if(mysqli_num_rows($result) > 0){
                    $currentHiringsServiceAuto = $db->resultToArray($result);

                    foreach($currentHiringsServiceAuto as $hirServAuto){

                        if(
                            intval($hiring['original_hiring_amount']) != 0 &&
                            intval($hiring['amount']) != 0
                        ){
                            $response = $db->query("
                                INSERT INTO Services_Auto(
                                    service, model, action, value, status, hiring
                                ) VALUES (
                                   " . $hirServAuto['service'] . ", " . $hirServAuto['model'] . ", " . $hirServAuto['action'] . ", '" . $hirServAuto['value'] . "', " . $hirServAuto['status'] . ",  $newHiringId
                                )
                            ");
    
                            if(!$response){
                                var_dump('Error insert in Services_Auto');
                            }
                        }
                    }
                }
            }
        }
    }
?>