<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "model/events.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Expenses{
        /** **************************************** FACTURAS RECIBIDAS **************************************** */
        
        /**
         * Crea una factura
         * 
         * @param array $data Datos del factura
         * @return bool
         */
        public function createReceivedInvoice($data){
            $db = new DbHandler;

            $data['bankAccount'] = cleanStr($data['bankAccount']);
            $data['creditCard'] = cleanStr($data['creditCard']);
            $data['expenseFixed'] = cleanStr($data['expenseFixed']);
            $data['expenseVariable'] = cleanStr($data['expenseVariable']);
            $data['costCenter'] = cleanStr($data['costCenter']);
            $data['otherCostcenter'] = cleanStr($data['otherCostcenter']);
            $data['supplier'] = cleanStr($data['supplier']);
            $data['date'] = cleanStr($data['date']);
            $data['dueDate'] = cleanStr($data['dueDate']);
            $data['dueDate2'] = cleanStr($data['dueDate2']);
            $data['dueDate3'] = cleanStr($data['dueDate3']);
            $data['paymentDueDate'] = cleanStr($data['paymentDueDate']);
            $data['paymentDueDate2'] = cleanStr($data['paymentDueDate2']);
            $data['paymentDueDate3'] = cleanStr($data['paymentDueDate3']);
            $data['paymentDate'] = cleanStr($data['paymentDate']);
            $data['shipper'] = cleanStr($data['shipper']);
            $data['nif'] = cleanStr($data['nif']);
            $data['listIvas'] = (isset($data['listIvas']) && is_array($data['listIvas']) ? $data['listIvas'] : []);
            $data['withholding'] = cleanStr($data['withholding']);
            $data['supplied'] = cleanStr($data['supplied']);
            $data['total'] = cleanStr($data['total']);
            $data['paymentMethod'] = cleanStr($data['paymentMethod']);
            $data['expenseType'] = cleanStr($data['expenseType']);
            $data['cashOut'] = cleanStr($data['cashOut']);
            $data['concept'] = cleanTextArea($data['concept']);
            $data['comments'] = cleanTextArea($data['comments']);
            $data['regularity'] = cleanStr($data['regularity']);
            $data['invoiceNumber'] = cleanStr($data['invoiceNumber']);
            $data['isTicket'] = cleanStr($data['isTicket']);

            $result = $db->query("  SELECT  count(ID) as total
                                    FROM    Received_Invoices
                                    WHERE   YEAR(FROM_UNIXTIME(date)) = " . date('Y', time()) . "");

            $number = $db->resultToArray($result)[0]['total'] + 1;

            $data['bankAccount'] == '' ? $bankAccount = 'null' : $bankAccount = $data['bankAccount'];
            $data['creditCard'] == '' ? $creditCard = 'null' : $creditCard = $data['creditCard'];
            $data['expenseFixed'] == '' ? $expenseFixed = 'null' : $expenseFixed = $data['expenseFixed'];
            $data['expenseVariable'] == '' ? $expenseVariable = 'null' : $expenseVariable = $data['expenseVariable'];
            $costCenter = $data['costCenter'];
            $data['otherCostcenter'] == '' ? $otherCostcenter = 'null' : $otherCostcenter = $data['otherCostcenter'];            
            $supplier = $data['supplier'] == 0 ? 'null' : $data['supplier'];
            $deliveryNote = isset($data['deliveryNote']) ? $data['deliveryNote'] : 'null';
            $date = $data['date'];
            $data['dueDate'] == '' ? $dueDate = 'null' : $dueDate = $data['dueDate'];
            $data['dueDate2'] == '' ? $dueDate2 = 'null' : $dueDate2 = $data['dueDate2'];
            $data['dueDate3'] == '' ? $dueDate3 = 'null' : $dueDate3 = $data['dueDate3'];
            $data['paymentDueDate'] == '' ? $paymentDueDate = 'null' : $paymentDueDate = $data['paymentDueDate'];
            $data['paymentDueDate2'] == '' ? $paymentDueDate2 = 'null' : $paymentDueDate2 = $data['paymentDueDate2'];
            $data['paymentDueDate3'] == '' ? $paymentDueDate3 = 'null' : $paymentDueDate3 = $data['paymentDueDate3'];
            $data['paymentDate'] == '' ? $paymentDate = 'null' : $paymentDate = $data['paymentDate'];
            $shipper = $data['shipper'];
            $nif = $data['nif'];
            $withholding = $data['withholding'] == '' || $data['withholding'] == null ? 0 : $data['withholding'];
            $supplied = $data['supplied'] == '' || $data['supplied'] == null ? 0 : $data['supplied'];
            $total = $data['total'];
            $paymentMethod = $data['paymentMethod'];
            $expenseType = $data['expenseType'];
            $cashOut = $data['cashOut'];
            $concept = $data['concept'];
            $comments = $data['comments'];
            $regularity = $data['regularity'];
            $invoiceNumber = $data['invoiceNumber'];
            $leavingDate = 'null';
            $isTicket = $data['isTicket'];

            // Comprueba si existe otra factura con este número para este proveedor en ese año
            $yearInvoice = date('Y', $date);
            $yearInvoiceSince = strtotime($yearInvoice.'-'.'01-01 00:00:00');
            $yearInvoiceUntil = strtotime($yearInvoice.'-'.'12-31 23:59:59');
            $check = $db->query("   SELECT  COUNT(*) AS amount
                                    FROM    Received_Invoices ri                                  
                                    WHERE   ri.supplier = $supplier AND
                                            ri.invoiceNumber = '$invoiceNumber' AND
                                            ri.leavingDate IS NULL AND
                                            ri.date BETWEEN $yearInvoiceSince AND $yearInvoiceUntil");

            $check = $db->resultToArray($check)[0]['amount'] == 0 ? true : false;
            if(!$check){
                return 'invoice_number';
            }

            $db->query("INSERT INTO Received_Invoices(
                            bankAccount, creditCard, expenseFixed, expenseVariable, costCenter, supplier, deliveryNote,
                            number, date, dueDate, dueDate2, dueDate3, paymentDueDate, paymentDueDate2, paymentDueDate3, 
                            paymentDate, shipper, NIF, taxBase, taxBase2, taxBase3, withholding, feeHoldIVA, feeHoldIVA2, feeHoldIVA3,
                            supplied, total, paymentMethod, expenseType, cashOut, concept, comments, regularity, invoiceNumber, otherCostcenter,
                            leavingDate, isTicket
                        )
                        VALUES (
                            $bankAccount, $creditCard, $expenseFixed, $expenseVariable, $costCenter, $supplier, $deliveryNote, 
                            $number, $date, $dueDate, $dueDate2, $dueDate3, $paymentDueDate, $paymentDueDate2, $paymentDueDate3, 
                            $paymentDate, '$shipper', '$nif', 0, 0, 0, $withholding, 0, 0, 0, 
                            $supplied, $total, $paymentMethod, $expenseType, $cashOut, '$concept', '$comments', $regularity, '$invoiceNumber', '$otherCostcenter', 
                            $leavingDate, $isTicket
                        )
            ");
            
            //Obtener el ID de la factura creada
            $resID = $db->query("   SELECT      ri.ID                                    
                                    FROM        Received_Invoices ri                                  
                                    WHERE       ri.invoiceNumber = '$invoiceNumber' AND ri.leavingDate IS NULL
                                    ORDER BY    ID DESC LIMIT 1");

            $idInvoice =  mysqli_num_rows($resID) == 0 ? null : $db->resultToArray($resID)[0]['ID'];


            // Creamos el desglose de ivas
            $createDate = time();
            if(count($data['listIvas']) > 0){
                foreach($data['listIvas'] as $itIv){

                    $typeIva = floatval($itIv['type_iva']);
                    $base = floatval($itIv['base']);
                    $iva = floatval($itIv['iva']);

                    $db->query("INSERT INTO Received_Invoices_Ivas(
                                    received_invoice, typeIva, base, iva, createDate
                                )
                                VALUES (
                                    $idInvoice, $typeIva, $base, $iva, $createDate
                                )
                    ");
                }
            }

            //Crear el evento para que aparezca la factura en el calendario
            $events = new Events();
            
            // Payment due date 1
            if($dueDate != null && $dueDate != '' && $dueDate != 'null'){
                $nameEvent = "Factura Nº ". $invoiceNumber . ' - Pago: ' . $paymentDueDate;
                $events->createReceivedInvoiceEvent(array("name" => $nameEvent, "start" => $dueDate, "invoice" => $idInvoice));
            }

            // Payment due date 2
            if($dueDate2 != null && $dueDate2 != '' && $dueDate2 != 'null'){
                $nameEvent = "Factura Nº ". $invoiceNumber . ' - Pago: ' . $paymentDueDate2;
                $events->createReceivedInvoiceEvent(array("name" => $nameEvent, "start" => $dueDate2, "invoice" => $idInvoice));
            }

            // Payment due date 3
            if($dueDate3 != null && $dueDate3 != '' && $dueDate3 != 'null'){
                $nameEvent = "Factura Nº ". $invoiceNumber . ' - Pago: ' . $paymentDueDate3;
                $events->createReceivedInvoiceEvent(array("name" => $nameEvent, "start" => $dueDate3, "invoice" => $idInvoice));
            }

            if(isset($data['deliveryNote']) && isset($data['items'])){
                foreach($data['items'] as $item){
                    $productID = $item['productID'];
                    $modelID = $item['modelID'];
                    $amount = $item['amount'];
                    $price = $item['price'];
                    $iva = $item['iva'];
                    
                    $db->query("INSERT INTO Invoices_Items(invoiceID, productID, modelID, amount, price, iva)
                                VALUES ($idInvoice, $productID, $modelID, $amount, $price, $iva)");
                    }
            }

            return $idInvoice;
        }

        /**
         * Crea una factura
         * 
         * @param array $data Datos del factura
         * @return bool
         */
        public function createReceivedInvoiceDelivery($data){
            $db = new DbHandler;
         
            $data['bankAccount'] = cleanStr($data['bankAccount']);
            $data['creditCard'] = cleanStr($data['creditCard']);
            $data['costCenter'] = cleanStr($data['costCenter']);
            $data['supplier'] = cleanStr($data['supplier']);
            $data['feeHoldIva'] = isset($data['feeHoldIva']) ? cleanStr($data['feeHoldIva']) : '';
            $data['taxBase'] = isset($data['taxBase']) ? cleanStr($data['taxBase']) : '';
            $data['deliveryNote'] = cleanStr($data['deliveryNote']);
            $data['date'] = cleanStr($data['date']);
            $data['dueDate'] = cleanStr($data['dueDate']);
            $data['dueDate2'] = cleanStr($data['dueDate2']);
            $data['dueDate3'] = cleanStr($data['dueDate3']);
            $data['paymentDate'] = cleanStr($data['paymentDate']);
            $data['paymentDueDate'] = cleanStr($data['paymentDueDate']);
            $data['paymentDueDate2'] = cleanStr($data['paymentDueDate2']);
            $data['paymentDueDate3'] = cleanStr($data['paymentDueDate3']);
            $data['shipper'] = cleanStr($data['shipper']);
            $data['nif'] = cleanStr($data['nif']);
            $data['total'] = cleanStr($data['total']);
            $data['paymentMethod'] = cleanStr($data['paymentMethod']);
            $data['comments'] = cleanStr($data['comments']);
            $data['invoiceNumber'] = cleanStr($data['invoiceNumber']);

            $result = $db->query("  SELECT  count(ID) as total
                                    FROM    Received_Invoices
                                    WHERE   YEAR(FROM_UNIXTIME(date)) = " . date('Y', time()) . "");

            $number = $db->resultToArray($result)[0]['total'] + 1;
           
            $data['bankAccount'] == '' ? $bankAccount = 'null' : $bankAccount = $data['bankAccount'];
            $data['creditCard'] == '' ? $creditCard = 'null' : $creditCard = $data['creditCard'];
            $costCenter = $data['costCenter'];
            $supplier = $data['supplier'] == 0 ? 'null' : $data['supplier'];
            $deliveryNote = isset($data['deliveryNote']) ? $data['deliveryNote'] : 'null';
            $date = $data['date'];
            $data['dueDate'] == '' ? $dueDate = 'null' : $dueDate = $data['dueDate'];
            $data['dueDate2'] == '' ? $dueDate2 = 'null' : $dueDate2 = $data['dueDate2'];
            $data['dueDate3'] == '' ? $dueDate3 = 'null' : $dueDate3 = $data['dueDate3'];
            $data['paymentDueDate'] == '' ? $paymentDueDate = 'null' : $paymentDueDate = $data['paymentDueDate'];
            $data['paymentDueDate2'] == '' ? $paymentDueDate2 = 'null' : $paymentDueDate2 = $data['paymentDueDate2'];
            $data['paymentDueDate3'] == '' ? $paymentDueDate3 = 'null' : $paymentDueDate3 = $data['paymentDueDate3'];
            $data['paymentDate'] == '' ? $paymentDate = 'null' : $paymentDate = $data['paymentDate'];
            $shipper = $data['shipper'];
            $nif = $data['nif'];
            $data['taxBase'] == '' ? $taxBase = 'null' : $taxBase = $data['taxBase'];
            $data['feeHoldIva'] == '' ? $feeHoldIva = 'null' : $feeHoldIva = $data['feeHoldIva'];
            $total = $data['total'];
            $paymentMethod = $data['paymentMethod'];
            $comments = $data['comments'];
            $invoiceNumber = $data['invoiceNumber'];
            $leavingDate = 'null';

            if($feeHoldIva == 'Sin Iva'){
                $feeHoldIva = 0;
            }

            $db->query("INSERT INTO Received_Invoices(bankAccount, creditCard, costCenter, supplier, deliveryNote, number, date, dueDate, dueDate2, dueDate3, paymentDueDate, paymentDueDate2, paymentDueDate3, paymentDate, shipper, NIF,
                                    total, paymentMethod, comments, invoiceNumber, leavingDate, taxBase, feeHoldIva, withholding, supplied)
                        VALUES ($bankAccount, $creditCard, $costCenter, $supplier, $deliveryNote, $number, $date, $dueDate, $dueDate2, $dueDate3, $paymentDueDate, $paymentDueDate2, $paymentDueDate3, $paymentDate, '$shipper', '$nif', 
                                $total, $paymentMethod,'$comments', '$invoiceNumber', $leavingDate, $taxBase, $feeHoldIva, 0, 0)");
            
            //Obtener el ID de la factura creada
            $resID = $db->query("   SELECT ri.ID                                    
                                    FROM   Received_Invoices ri                                  
                                    WHERE  ri.invoiceNumber = '$invoiceNumber' AND ri.leavingDate IS NULL
                                    ORDER BY ID DESC LIMIT 1");

            $idInvoice =  mysqli_num_rows($resID) == 0 ? null : $db->resultToArray($resID)[0]['ID'];
 

            //Crear el evento para que aparezca la factura en el calendario
            $events = new Events();
            $nameEvent = "Factura Nº ". $invoiceNumber;
            $start = $dueDate == 'null' ? time() : $dueDate;
          
            $events->createReceivedInvoiceEvent(array("name" => $nameEvent, "start" => $start, "invoice" => $idInvoice));

            if(isset($data['deliveryNote']) && isset($data['items'])){

                if(isset($data['items']['litresReceived'])){

                    $litresReceived = $data['items']['litresReceived'];
                    $priceLiter = $data['items']['priceLiter'];
                    $net = $data['items']['net'];
                    $iva = $data['items']['iva'];
                    $total = $data['items']['total'];

                    $db->query("INSERT INTO Invoices_Items_Gasoil(invoiceID, litresReceived, priceLiter, net, iva, total)
                                    VALUES ($idInvoice, $litresReceived, $priceLiter, $net, $iva, $total)");
                        
                }else{
                    foreach($data['items'] as $item){
                        $productID = $item['productID'];
                        $modelID = $item['modelID'];
                        $amount = $item['amount'];
                        $price = $item['price'];
                        $iva = $item['iva'];
                        $discount = $item['discount'];
                        
                        $db->query("INSERT INTO Invoices_Items(invoiceID, productID, modelID, amount, price, iva, discount)
                                    VALUES ($idInvoice, $productID, $modelID, $amount, $price, $iva, $discount)");
                        }
                }
            }
            return true;
        }

        /**
         * Searchs invoice id in table Invoice_Items, to confirm if the invoice was generated for a delivery notes
         * 
         * @param int $id ID de la factura
         * @return int 
         */
        public function receivedInvoiceWasDelivery($id){
            $db = new DbHandler;

            $id = cleanStr($id);
            
            $result = $db->query("  SELECT  COUNT(*) as rows_num_items 
                                    FROM    Invoices_Items as ii 
                                    WHERE   ii.invoiceID = $id");

            $survey = $db->resultToArray($result)[0]['rows_num_items'];

            if($survey > 0){
                return 1;
            }else{
                $result = $db->query("  SELECT  COUNT(*) as rows_num_items 
                                        FROM    Invoices_Items_Gasoil as iig
                                        WHERE   iig.invoiceID = $id");

                $survey = $db->resultToArray($result)[0]['rows_num_items'];

                if($survey > 0){
                    return 2;
                }else {
                    return 0;
                }
            }
        }

        /**
         * Si la factura fue generada de un albarán, obtiene los items del albarán
         * 
         * @param int $id ID de la factura
         * @return array Items
         */
        public function getItems($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("SELECT ii.*, pm.name as modelName, p.name as productName 
                                  FROM Invoices_Items ii, Products_Models pm, Products p 
                                  WHERE ii.modelID = pm.productModelID 
                                    AND ii.productID = p.productID 
                                    AND ii.invoiceID = $id");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Si la factura fue generada de un albarán, obtiene los items del albarán
         * 
         * @param int $id ID de la factura
         * @return array Items
         */
        public function getItemsGasoil($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  iig.*, it.name as ivaName, g.litres as litresRequest
                                    FROM    Invoices_Items_Gasoil iig, IVA_Types it, Gasoil g, Orders o, Received_Invoices ri, DeliveryNotes dn
                                    WHERE   iig.iva = it.IVATypeID AND 
                                            g.gasoilID = o.gasoil AND 
                                            o.ID = dn.order AND 
                                            dn.ID = ri.deliveryNote AND 
                                            iig.invoiceID = $id");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Obtiene los datos de una factura recibida
         * 
         * @param int $id ID de la factura
         * @return array Datos de la factura
         */
        public function readReceivedInvoice($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT      ri.*,
                                                ba.owner as bankAccountOwner,
                                                cc.owner as creditCardOwner,
                                                ef.name as expenseFixedName,
                                                ev.name as expenseVariableName,
                                                cce.name as costCenterName,
                                                s.name as supplierName, s.nif as supplierNif
                                    FROM        (Received_Invoices ri)
                                    LEFT JOIN   Bank_Accounts ba ON ri.bankAccount = ba.ID
                                    LEFT JOIN   Credit_Cards cc ON ri.creditCard = cc.ID
                                    LEFT JOIN   Expenses_Fixed ef ON ri.expenseFixed = ef.ID
                                    LEFT JOIN   Expenses_Variable ev ON ri.expenseVariable = ev.ID
                                    LEFT JOIN   Cost_Center cce ON ri.costCenter = cce.ID
                                    LEFT JOIN   Suppliers s ON ri.supplier = s.supplierID
                                    WHERE       ri.ID = $id");
                                    
            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Obtiene los ivas de una factura recibida
         * 
         * @param int $id ID de la factura
         * @return array Datos de la factura
         */
        public function readReceivedInvoiceIvas($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT      riv.*
                                    FROM        Received_Invoices_Ivas riv
                                    WHERE       riv.received_invoice = $id AND
                                                riv.deleteDate IS NULL
            ");
            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArray($result);
        }

        /**
         * Modifica los datos de una factura recibida (asociada a un albarán)
         * 
         * @param array $data Datos de la factura
         * @return bool
         */
        public function updateReceivedInvoiceDelivery($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['bankAccount'] = cleanStr($data['bankAccount']);
            $data['creditCard'] = cleanStr($data['creditCard']);
            $data['costCenter'] = cleanStr($data['costCenter']);
            $data['supplier'] = cleanStr($data['supplier']);
            $data['date'] = cleanStr($data['date']);
            $data['dueDate'] = cleanStr($data['dueDate']);
            $data['dueDate2'] = cleanStr($data['dueDate2']);
            $data['dueDate3'] = cleanStr($data['dueDate3']);
            $data['paymentDueDate'] = cleanStr($data['paymentDueDate']);
            $data['paymentDueDate2'] = cleanStr($data['paymentDueDate2']);
            $data['paymentDueDate3'] = cleanStr($data['paymentDueDate3']);
            $data['paymentDate'] = cleanStr($data['paymentDate']);
            $data['nif'] = cleanStr($data['nif']);
            $data['total'] = cleanStr($data['total']);
            $data['paymentMethod'] = cleanStr($data['paymentMethod']);
            $data['comments'] = cleanEditor($data['comments']);
            $data['invoiceNumber'] = cleanStr($data['invoiceNumber']);
            
            $id = $data['ID'];
            $data['bankAccount'] == '' ? $bankAccount = 'null' : $bankAccount = $data['bankAccount'];
            $data['creditCard'] == '' ? $creditCard = 'null' : $creditCard = $data['creditCard'];
            $costCenter = $data['costCenter'];
            $supplier = $data['supplier'] == 0 ? 'null' : $data['supplier'];
            $date = $data['date'];
            $data['dueDate'] == '' ? $dueDate = 'null' : $dueDate = $data['dueDate'];
            $data['dueDate2'] == '' ? $dueDate2 = 'null' : $dueDate2 = $data['dueDate2'];
            $data['dueDate3'] == '' ? $dueDate3 = 'null' : $dueDate3 = $data['dueDate3'];
            $data['paymentDueDate'] == '' ? $paymentDueDate = 'null' : $paymentDueDate = $data['paymentDueDate'];
            $data['paymentDueDate2'] == '' ? $paymentDueDate2 = 'null' : $paymentDueDate2 = $data['paymentDueDate2'];
            $data['paymentDueDate3'] == '' ? $paymentDueDate3 = 'null' : $paymentDueDate3 = $data['paymentDueDate3'];
            $data['paymentDate'] == '' ? $paymentDate = 'null' : $paymentDate = $data['paymentDate'];
            $nif = $data['nif'];
            $total = $data['total'];
            $data['paymentMethod'] == '' ? $paymentMethod = 'null' : $paymentMethod = $data['paymentMethod'];
            $comments = $data['comments'];
            $data['invoiceNumber'] == '' ? $invoiceNumber = 'null' : $invoiceNumber = $data['invoiceNumber'];

            // Comprueba si existe otra factura con este número para este proveedor en ese año
            $yearInvoice = date('Y', $date);
            $yearInvoiceSince = strtotime($yearInvoice.'-'.'01-01 00:00:00');
            $yearInvoiceUntil = strtotime($yearInvoice.'-'.'12-31 23:59:59');
            $check = $db->query("   SELECT  COUNT(*) AS amount
                                    FROM    Received_Invoices ri                                  
                                    WHERE   ri.supplier = $supplier AND
                                            ri.invoiceNumber = '$invoiceNumber' AND
                                            ri.ID != $id AND
                                            ri.leavingDate IS NULL AND
                                            ri.date BETWEEN $yearInvoiceSince AND $yearInvoiceUntil");

            $check = $db->resultToArray($check)[0]['amount'];
            if($check != '0'){
                return 'invoice_number';
            }

            $res = $db->query(" UPDATE  Received_Invoices
                                SET     bankAccount = $bankAccount,
                                        creditCard = $creditCard,
                                        costCenter = $costCenter,
                                        date = $date,
                                        dueDate = $dueDate,
                                        dueDate2 = $dueDate2,
                                        dueDate3 = $dueDate3,
                                        paymentDueDate = $paymentDueDate,
                                        paymentDueDate2 = $paymentDueDate2,
                                        paymentDueDate3 = $paymentDueDate3,
                                        paymentDate = $paymentDate,
                                        paymentMethod = $paymentMethod,
                                        comments = '$comments',
                                        invoiceNumber = '$invoiceNumber' 
                                WHERE   ID = $id");

            //Actualizar el evento para que aparezca la factura en el calendario
            if($res){             
                $resID = $db->query("   SELECT rie.ID                                    
                                        FROM   Received_Invoices_Events rie                                  
                                        WHERE  rie.invoice = $id");

                $idEvent =  mysqli_num_rows($resID) == 0 ? null : $db->resultToArray($resID)[0]['ID'];
                $events = new Events();
                $nameEvent = "Factura Nº ". $invoiceNumber;
                $start = $dueDate == 'null' ? time() : $dueDate;

                $events->updateReceivedInvoiceEvent(array("name" => $nameEvent, "start" => $start, "idEvent" => $idEvent));
                return true;
            }else{
                return false;
            }
        }

        /**
         * Modifica los datos de una factura recibida
         * 
         * @param array $data Datos de la factura
         * @return bool
         */
        public function updateReceivedInvoice($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['bankAccount'] = cleanStr($data['bankAccount']);
            $data['creditCard'] = cleanStr($data['creditCard']);
            $data['expenseFixed'] = cleanStr($data['expenseFixed']);
            $data['expenseVariable'] = cleanStr($data['expenseVariable']);
            $data['otherCostcenter'] = cleanStr($data['otherCostcenter']);
            $data['costCenter'] = cleanStr($data['costCenter']);
            $data['supplier'] = cleanStr($data['supplier']);
            $data['date'] = cleanStr($data['date']);
            $data['dueDate'] = cleanStr($data['dueDate']);
            $data['dueDate2'] = cleanStr($data['dueDate2']);
            $data['dueDate3'] = cleanStr($data['dueDate3']);
            $data['paymentDueDate'] = cleanStr($data['paymentDueDate']);
            $data['paymentDueDate2'] = cleanStr($data['paymentDueDate2']);
            $data['paymentDueDate3'] = cleanStr($data['paymentDueDate3']);
            $data['paymentDate'] = cleanStr($data['paymentDate']);
            $data['shipper'] = cleanStr($data['shipper']);
            $data['nif'] = cleanStr($data['nif']);
            $data['listIvas'] = (isset($data['listIvas']) && is_array($data['listIvas']) ? $data['listIvas'] : []);
            $data['withholding'] = cleanStr($data['withholding']);
            $data['supplied'] = cleanStr($data['supplied']);
            $data['total'] = cleanStr($data['total']);
            $data['paymentMethod'] = cleanStr($data['paymentMethod']);
            $data['expenseType'] = cleanStr($data['expenseType']);
            $data['cashOut'] = cleanStr($data['cashOut']);
            $data['concept'] = cleanTextArea($data['concept']);
            $data['comments'] = cleanTextArea($data['comments']);
            $data['regularity'] = cleanStr($data['regularity']);
            $data['invoiceNumber'] = cleanStr($data['invoiceNumber']);
            $data['isTicket'] = cleanStr($data['isTicket']);
            
            $id = $data['ID'];
            $data['bankAccount'] == '' ? $bankAccount = 'null' : $bankAccount = $data['bankAccount'];
            $data['creditCard'] == '' ? $creditCard = 'null' : $creditCard = $data['creditCard'];
            $data['expenseFixed'] == '' ? $expenseFixed = 'null' : $expenseFixed = $data['expenseFixed'];
            $data['expenseVariable'] == '' ? $expenseVariable = 'null' : $expenseVariable = $data['expenseVariable'];
            $data['otherCostcenter'] == '' ? $otherCostcenter = 'null' : $otherCostcenter = $data['otherCostcenter'];
            $costCenter = $data['costCenter'];
            $supplier = $data['supplier'] == 0 ? 'null' : $data['supplier'];
            $date = $data['date'];
            $data['dueDate'] == '' ? $dueDate = 'null' : $dueDate = $data['dueDate'];
            $data['dueDate2'] == '' ? $dueDate2 = 'null' : $dueDate2 = $data['dueDate2'];
            $data['dueDate3'] == '' ? $dueDate3 = 'null' : $dueDate3 = $data['dueDate3'];
            $data['paymentDueDate'] == '' ? $paymentDueDate = 'null' : $paymentDueDate = $data['paymentDueDate'];
            $data['paymentDueDate2'] == '' ? $paymentDueDate2 = 'null' : $paymentDueDate2 = $data['paymentDueDate2'];
            $data['paymentDueDate3'] == '' ? $paymentDueDate3 = 'null' : $paymentDueDate3 = $data['paymentDueDate3'];
            $data['paymentDate'] == '' ? $paymentDate = 'null' : $paymentDate = $data['paymentDate'];
            $shipper = $data['shipper'];
            $nif = $data['nif'];
            $withholding = $data['withholding'] == '' || $data['withholding'] == null ? 0 : $data['withholding'];
            $supplied = $data['supplied'] == '' || $data['supplied'] == null ? 0 : $data['supplied'];
            $total = $data['total'];
            $data['paymentMethod'] == '' ? $paymentMethod = 'null' : $paymentMethod = $data['paymentMethod'];
            $data['expenseType'] == '' ? $expenseType = 'null' : $expenseType = $data['expenseType'];
            $data['cashOut'] == '' ? $cashOut = 'null' : $cashOut = $data['cashOut'];
            $concept = $data['concept'];
            $comments = $data['comments'];
            $data['regularity'] == '' ? $regularity = 'null' : $regularity = $data['regularity'];
            $data['invoiceNumber'] == '' ? $invoiceNumber = 'null' : $invoiceNumber = $data['invoiceNumber'];
            $isTicket = $data['isTicket'];

            // Comprueba si existe otra factura con este número para este proveedor en ese año
            $yearInvoice = date('Y', $date);
            $yearInvoiceSince = strtotime($yearInvoice.'-'.'01-01 00:00:00');
            $yearInvoiceUntil = strtotime($yearInvoice.'-'.'12-31 23:59:59');
            $check = $db->query("   SELECT  COUNT(*) AS amount
                                    FROM    Received_Invoices ri                                  
                                    WHERE   ri.supplier = $supplier AND
                                            ri.invoiceNumber = '$invoiceNumber' AND
                                            ri.ID != $id AND
                                            ri.leavingDate IS NULL AND
                                            ri.date BETWEEN $yearInvoiceSince AND $yearInvoiceUntil");

            $check = $db->resultToArray($check)[0]['amount'];
            if($check != '0'){
                return 'invoice_number';
            }

            $res = $db->query(" UPDATE  Received_Invoices
                                SET     bankAccount = $bankAccount,
                                        creditCard = $creditCard,
                                        expenseFixed = $expenseFixed,
                                        expenseVariable = $expenseVariable,
                                        costCenter = $costCenter,
                                        supplier = $supplier,
                                        date = $date,
                                        dueDate = $dueDate,
                                        dueDate2 = $dueDate2,
                                        dueDate3 = $dueDate3,
                                        paymentDueDate = $paymentDueDate,
                                        paymentDueDate2 = $paymentDueDate2,
                                        paymentDueDate3 = $paymentDueDate3,
                                        paymentDate = $paymentDate,
                                        shipper = '$shipper',
                                        nif = '$nif',
                                        taxBase = 0,
                                        taxBase2 = 0,
                                        taxBase3 = 0,
                                        withholding = $withholding,
                                        feeHoldIva = 0,
                                        feeHoldIva2 = 0,
                                        feeHoldIva3 = 0,
                                        supplied = $supplied,
                                        total = $total,
                                        paymentMethod = $paymentMethod,
                                        expenseType = $expenseType,
                                        cashOut = $cashOut,
                                        concept = '$concept',
                                        comments = '$comments',
                                        regularity = $regularity,
                                        invoiceNumber = '$invoiceNumber',
                                        otherCostcenter = '$otherCostcenter',
                                        isTicket = $isTicket
                                WHERE   ID = $id
            ");

            //Actualizar el evento para que aparezca la factura en el calendario
            if($res){
                
                // Actualizamos tabla de ivas
                $createDate = time();
                $idsNotDeleted = '';
                if(count($data['listIvas']) > 0){
                    foreach($data['listIvas'] as $itIv){

                        $typeIva = floatval($itIv['type_iva']);
                        $base = floatval($itIv['base']);
                        $iva = floatval($itIv['iva']);

                        if($itIv['id'] != '' && $itIv['id'] != null){

                            $db->query("UPDATE  Received_Invoices_Ivas
                                        SET     typeIva = $typeIva,
                                                base = $base,
                                                iva = $iva,
                                                updateDate = $createDate
                                        WHERE   id = {$itIv['id']}
                            ");

                            $idsNotDeleted .= $itIv['id'] . ',';

                        }else{
                            $db->query("INSERT INTO Received_Invoices_Ivas(
                                            received_invoice, typeIva, base, iva, createDate
                                        )
                                        VALUES (
                                            $id, $typeIva, $base, $iva, $createDate
                                        )
                            ");

                            $receivedInvoiceIvaId = $db->getLastInsertId();

                            $idsNotDeleted .= $receivedInvoiceIvaId . ',';
                        }
                    }
                }

                // Delete old ivas post updated
                $whereDelete = '';
                if($idsNotDeleted != ''){
                    $idsNotDeleted = substr($idsNotDeleted, 0, -1);
                    $whereDelete .= " AND id NOT IN ($idsNotDeleted)";
                }

                $db->query("UPDATE  Received_Invoices_Ivas
                            SET     deleteDate = $createDate
                            WHERE   received_invoice = $id
                                    $whereDelete
                ");
                
                $events = new Events();

                // Delete all payments
                $events->deleteReceivedInvoiceEventByInvoice($id);

                // Payment due date 1
                if($dueDate != null && $dueDate != '' && $dueDate != 'null'){
                    $nameEvent = "Factura Nº ". $invoiceNumber . ' - Pago 1: ' . $paymentDueDate;
                    $events->createReceivedInvoiceEvent(array("name" => $nameEvent, "start" => $dueDate, "invoice" => $id));
                }

                // Payment due date 2
                if($dueDate2 != null && $dueDate2 != '' && $dueDate2 != 'null'){
                    $nameEvent = "Factura Nº ". $invoiceNumber . ' - Pago 2: ' . $paymentDueDate2;
                    $events->createReceivedInvoiceEvent(array("name" => $nameEvent, "start" => $dueDate2, "invoice" => $id));
                }
    
                // Payment due date 3
                if($dueDate3 != null && $dueDate3 != '' && $dueDate3 != 'null'){
                    $nameEvent = "Factura Nº ". $invoiceNumber . ' - Pago 3: ' . $paymentDueDate3;
                    $events->createReceivedInvoiceEvent(array("name" => $nameEvent, "start" => $dueDate3, "invoice" => $id));
                }

                //Cambiar el estado de la factura a pago parcial o pago completo
                $payments = $this->getCurrentPaymentsAndTotal($id);
            
                $total = $payments[0]['total'];
                $pagos_actuales = $payments[0]['pago_actual'];

                if($pagos_actuales == NULL){
                    $pagos_actuales = 0.00;
                }
                
                if ($pagos_actuales >= $total){                    
                    //cambiar estado a pagada 
                    $db->query("    UPDATE  Received_Invoices_Events rie
                                    SET     rie.status = 13
                                    WHERE   rie.invoice = $id");  
                  
                }else if($pagos_actuales == 0){   
                    
                }else{                     
                    //cambiar estado a pago parcial  
                    $db->query("    UPDATE  Received_Invoices_Events rie
                                    SET     rie.status = 14
                                    WHERE   rie.invoice = $id");
                }

                return true;
            }else{
                return false;
            }
        }
        
        /**
         * Elimina una factura recibida
         * 
         * @param int $id Id del la factura
         * @return bool
         */
        public function deleteReceivedInvoice($id){
            $db = new DbHandler;

            $id = cleanStr($id);
            
            $res = $db->query(" UPDATE  Received_Invoices
                                SET     leavingDate = " . time() . "
                                WHERE   ID = $id
            ");
                                
            if($res){

                // Delete received invoices ivas
                $res = $db->query(" UPDATE  Received_Invoices_Ivas
                                    SET     deleteDate = " . time() . "
                                    WHERE   received_invoice  = $id AND
                                            deleteDate IS NULL
                ");

                // Delete all payments events
                $events = new Events();
                $events->deleteReceivedInvoiceEventByInvoice($id);
                
                return true;
            }else{

                return false;
            }
        }

        /**
         * Comprueba si una factura existe para un albarán
         * 
         * @param int $id Id del albarán
         * @return bool
         */
        public function existInvoiceByDeliveryNote($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  ri.ID
                                    FROM    Received_Invoices ri
                                    WHERE   ri.deliveryNote = $id");

            return mysqli_num_rows($result) == 0 ? false : true;
        }

        /**
         * Paga una factura
         *
         * @param array $id Id de la factura
         * @return bool
         */
        public function pay($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  ri.regularity, ri.date, ri.deliveryNote
                                    FROM    Received_Invoices ri
                                    WHERE   ri.ID = $id");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                $result = $db->resultToArray($result)[0];
                $regularity = $result['regularity'];
                $deliveryNote = $result['deliveryNote'];

                if($regularity > 0 && $deliveryNote == null){
                    $result = $db->query("  SELECT  ri.*
                                            FROM    Received_Invoices ri
                                            WHERE   ri.ID = $id");

                    $invoice = $db->resultToArray($result)[0];
                    $invoice['date'] = strtotime("+$regularity months", $invoice['date']);
                    if($invoice['dueDate'] != ''){
                        $invoice['dueDate'] = strtotime("+$regularity months", $invoice['dueDate']);
                    }
                    $invoice['paymentDate'] = '';

                    $this->createReceivedInvoice($invoice);
                }

                $time = time();
                return $db->query(" UPDATE  Received_Invoices ri
                                    SET     ri.paymentDate = $time
                                    WHERE   ri.ID = $id");   
            }
        }

        /**
         * Obtiene el nombre del proveedor
         * 
         * @param int $id Id de la factura
         * @return string
         */
        public function getSupplierName($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  ri.shipper, ri.nif
                                    FROM    Received_Invoices ri
                                    WHERE   ri.ID = $id");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Obtiene los pagos de una factura
         * 
         * @param int $invoice Id de la factura
         * @return array
         */
        public function getPayments($invoice){
            $db = new DbHandler;

            $invoice = cleanStr($invoice);

            $result = $db->query("  SELECT  rip.*
                                    FROM    Received_Invoices_Payments rip
                                    WHERE   rip.invoice = $invoice AND
                                            rip.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Paga una factura parcialmente
         * 
         * @param int $id_inv Id de la factura
         * @param int $amount Cantidad pagada
         * @return array
         */
        public function payPartialInvoice($id_inv, $amount, $date){
            $db = new DbHandler;      
            
            $id_inv = cleanStr($id_inv);
            $amount = cleanStr($amount);
            $date = cleanStr($date);

            $leavingDate = 'null';

            $db->query("  INSERT INTO Received_Invoices_Payments( invoice, date, amount, leavingDate)
                        VALUES( $id_inv, $date, $amount, $leavingDate)");

            //Cambiar el estado de la factura a pago parcial o pago completo
            $payments = getCurrentPaymentsAndTotal($id_inv);
           
            $total = $payments[0]['total'];
            $pagos_actuales = $payments[0]['pago_actual'];

            if($pagos_actuales == NULL){
                $pagos_actuales = 0.00;
            }
            
            if ($pagos_actuales >= $total){                    
                //cambiar estado a pagada 
                $db->query("    UPDATE  Received_Invoices_Events rie
                                SET     rie.status = 13
                                WHERE   rie.invoice = $id_inv");  

                $db->query("    UPDATE  Received_Invoices ri
                                SET     ri.paymentDate = $date
                                WHERE   ri.ID = $id_inv");  
            }else if($pagos_actuales == 0){   
                $db->query("    UPDATE  Received_Invoices_Events rie
                                SET     rie.status = 1
                                WHERE   rie.invoice = $id_inv");  
            }else{                     
                //cambiar estado a pago parcial  
                $db->query("    UPDATE  Received_Invoices_Events rie
                                SET     rie.status = 14
                                WHERE   rie.invoice = $id_inv");
            }
            return true;
        }

        /**
         * Paga una factura parcialmente
         * 
         * @param int $id_inv Id de la factura
         * @param int $amount Cantidad pagada
         * @return array
         */
        public function updatePayment($id, $amount, $date){
            $db = new DbHandler;      
            
            $id = cleanStr($id);
            $amount = cleanStr($amount);
            $date = cleanStr($date);

            $db->query(" UPDATE Received_Invoices_Payments
                         SET    date = $date, 
                                amount = $amount 
                         WHERE  ID = $id");

            $result = $db->query("  SELECT  invoice
                                    FROM    Received_Invoices_Payments rip
                                    WHERE   ID = $id");

            $idInvoice = $db->resultToArray($result)[0]["invoice"];

            //Cambiar el estado de la factura a pago parcial o pago completo
            $payments = getCurrentPaymentsAndTotal($idInvoice);
           
            $total = $payments[0]['total'];
            $pagos_actuales = $payments[0]['pago_actual'];

            if($pagos_actuales == NULL){
                $pagos_actuales = 0.00;
            }
            
            if ($pagos_actuales >= $total){                    
                //cambiar estado a pagada 
                $db->query("    UPDATE  Received_Invoices_Events rie
                                SET     rie.status = 13
                                WHERE   rie.invoice = $idInvoice");  
            }else if($pagos_actuales == 0){   
                $db->query("    UPDATE  Received_Invoices_Events rie
                                SET     rie.status = 1
                                WHERE   rie.invoice = $idInvoice");  
            }else{                     
                //cambiar estado a pago parcial  
                $db->query("    UPDATE  Received_Invoices_Events rie
                                SET     rie.status = 14
                                WHERE   rie.invoice = $idInvoice");
            }
            return true;
        }

        /**
         * Paga una factura parcialmente
         * 
         * @param int $id_inv Id de la factura
         * @param int $amount Cantidad pagada
         * @return array
         */
        public function deletePayment($id){
            $db = new DbHandler;      
            
            $id = cleanStr($id);
            $leavingDate = time();

            $db->query(" UPDATE Received_Invoices_Payments
                         SET    leavingDate = $leavingDate
                         WHERE  ID = $id");

            $result = $db->query("  SELECT  invoice
                                    FROM    Received_Invoices_Payments rip
                                    WHERE   ID = $id");

            $idInvoice = $db->resultToArray($result)[0]["invoice"];

            //Cambiar el estado de la factura a pago parcial o pago completo
            $payments = getCurrentPaymentsAndTotal($idInvoice);
           
            $total = $payments[0]['total'];
            $pagos_actuales = $payments[0]['pago_actual'];

            if($pagos_actuales == NULL){
                $pagos_actuales = 0.00;
            }
            
            if ($pagos_actuales >= $total){                    
                //cambiar estado a pagada 
                $db->query("    UPDATE  Received_Invoices_Events rie
                                SET     rie.status = 13
                                WHERE   rie.invoice = $idInvoice");  
            }else if($pagos_actuales == 0){   
                $db->query("    UPDATE  Received_Invoices_Events rie
                                SET     rie.status = 1
                                WHERE   rie.invoice = $idInvoice");  
            }else{                     
                //cambiar estado a pago parcial  
                $db->query("    UPDATE  Received_Invoices_Events rie
                                SET     rie.status = 14
                                WHERE   rie.invoice = $idInvoice");
            }
           
            return true;
        }

        /**
         * Obtiene la suma de los pagos realizados de una factura y el total
         * 
         * @param int $id_inv Id de la factura
         * @return array
         */
        public function getCurrentPaymentsAndTotal($id_inv){
            $db = new DbHandler;

            $id_inv = cleanStr($id_inv);

            $result = $db->query("  SELECT  SUM(rip.amount) AS 'pago_actual', ri.total 
                                    FROM    Received_Invoices_Payments rip, Received_Invoices ri 
                                    WHERE   ri.ID = rip.invoice AND
                                            rip.invoice = $id_inv AND rip.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene las facturas pendientes de pago
         * 
         * @return array
         */
        public function getPendingReceivedInvoices(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  ri.ID, ri.date, ri.invoiceNumber, ri.date, s.nif, s.name, ri.dueDate,
                                            ri.taxBase, ri.withholding, ri.feeHoldIva, ri.supplied, ri.total, ''
                                    FROM    Received_Invoices ri, Suppliers s
                                    WHERE   ri.supplier = s.supplierID AND ri.leavingDate IS NULL  AND
                                            YEAR(FROM_UNIXTIME(ri.date)) = " . date('Y'));

            if(mysqli_num_rows($result) == 0){
                return [];
            }else{
                $invoices = $db->resultToArrayValue($result);

                foreach($invoices as $index => $elem){
                    $state = $this->getCurrentPaymentsAndTotal($elem[0])[0];

                    $total = floatval($state['total']);
                    $payments = floatval($state['pago_actual']);

                    if($payments != null && $payments >= $total){
                        unset($invoices[$index]);
                    }
                }

                return array_values($invoices);
            }
        }

        /**
         * Obtiene las facturas pagadas
         * 
         * @return array
         */
        public function getReceivedInvoices(){
            $db = new DbHandler;

        $result = $db->query("  SELECT      ri.ID, ri.date, ri.invoiceNumber, ri.date, s.nif, s.name, ri.dueDate,
                                            ri.taxBase, ri.withholding, ri.feeHoldIva, ri.supplied, ri.total, ''
                                FROM        Received_Invoices ri
                                LEFT JOIN   Suppliers s ON s.supplierID = ri.supplier
                                WHERE       ri.leavingDate IS NULL AND
                                            YEAR(FROM_UNIXTIME(ri.date)) = " . date('Y'));

            if(mysqli_num_rows($result) == 0){
                return [];
            }else{
                $invoices = $db->resultToArrayValue($result);

                foreach($invoices as $index => $elem){
                    $state = $this->getCurrentPaymentsAndTotal($elem[0])[0];

                    $total = floatval($state['total']);
                    $payments = floatval($state['pago_actual']);

                    if($payments == null || $payments < $total){
                        unset($invoices[$index]);
                    }
                }

                return array_values($invoices);
            }
        }

        /** **************************************** SALARIOS **************************************** */
        /**
         * Añade un salario
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function createSalary($data){
            $db = new DbHandler;

            $data['startDay'] = cleanStr($data['startDay']);
            $data['endDay'] = cleanStr($data['endDay']);
            $data['paymentDay'] = cleanStr($data['paymentDay']);
            $data['user'] = cleanStr($data['user']);
            $data['costCenter'] = cleanStr($data['costCenter']);
            $data['taxBase'] = cleanStr($data['taxBase']);
            $data['IRPF'] = cleanStr($data['IRPF']);
            $data['liquid'] = cleanStr($data['liquid']);

            $currentMonth = date('m');
            $nextMonth = null;
            $nextMonthPayment = null;
            $currentYear = date('Y');
            $nextYear = null;
            $nextYearPayment = null;

            $startDate = strtotime($data['startDay'] . '-' . $currentMonth . '-' . $currentYear);

            if($data['startDay'] < $data['endDay']){
                $nextMonth = $currentMonth;
                $nextYear = $currentYear;
                $nextMonthPayment = $currentMonth;
                $nextYearPayment = $currentYear;
            }else{
                if($currentMonth < 12){
                    $nextMonth = $currentMonth + 1;
                    $nextYear = $currentYear;

                    if($data['paymentDay'] < $data['startDay']){
                        $nextMonthPayment = $currentMonth + 1;
                        $nextYearPayment = $currentYear;
                    }else{
                        $nextMonthPayment = $currentMonth;
                        $nextYearPayment = $currentYear; 
                    }
                }else{
                    $nextMonth = 1;
                    $nextYear = $currentYear + 1;

                    if($data['paymentDay'] < $data['startDay']){
                        $nextMonthPayment = 1;
                        $nextYearPayment = $currentYear + 1;
                    }else{
                        $nextMonthPayment = $currentMonth;
                        $nextYearPayment = $currentYear;
                    }
                }
            }

            switch($currentMonth){
                case '1':
                case '3':
                case '5':
                case '7':
                case '8':
                case '10':
                case '12':
                    $endDate = strtotime($data['endDay'] . '-' . $nextMonth . '-' . $nextYear);
                    $paymentDate = strtotime($data['paymentDay'] . '-' . $nextMonthPayment . '-' . $nextYearPayment);
                break;
                
                case '4':
                case '6':
                case '9':
                case '11':
                    if($data['endDay'] > 30){
                        $data['endDay'] = 30;
                    }
                    $endDate = strtotime($data['endDay'] . '-' . $nextMonth . '-' . $currentYear);
                    if($data['paymentDay'] > 30){
                        $data['paymentDay'] = 30;
                    }
                    $paymentDate = strtotime($data['paymentDay'] . '-' . $nextMonthPayment . '-' . $nextYearPayment);

                break;

                case '2':
                    // Comprueba si es año bisiesto
                    if($currentYear % 4 == 0 && ($currentYear % 100 != 0 || $currentYear % 400 == 0)){
                        if($data['endDay'] > 29){
                            $data['endDay'] = 29;
                        }
                        $endDate = strtotime($data['endDay'] . '-' . $nextMonth . '-' . $currentYear);
                        if($data['paymentDay'] > 29){
                            $data['paymentDay'] = 29;
                        }
                        $paymentDate = strtotime($data['paymentDay'] . '-' . $nextMonthPayment . '-' . $nextYearPayment);
                    }else{
                        if($data['endDay'] > 28){
                            $data['endDay'] = 28;
                        }
                        $endDate = strtotime($data['endDay'] . '-' . $nextMonth . '-' . $currentYear);
                        if($data['paymentDay'] > 28){
                            $data['paymentDay'] = 28;
                        }
                        $paymentDate = strtotime($data['paymentDay'] . '-' . $nextMonthPayment . '-' . $nextYearPayment);
                    }

                break;
            }

            return $db->query(" INSERT INTO Salaries(   user, costCenter, startDate, endDate, 
                                                        taxBase, IRPF, liquid, paymentDate)
                                VALUES( " . $data['user'] . ", " . $data['costCenter'] . ", 
                                        " . $startDate . ", " . $endDate . ",
                                        " . $data['taxBase'] . ", " . $data['IRPF'] . ",
                                        " . $data['liquid'] . ", " . $paymentDate . ")");
        }

        /**
         * Obtiene los datos de un salario
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function readSalary($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT      s.*, u.name as userName, u.surname as userSurname, 
                                                m.name as costCenterName
                                    FROM        (Salaries s)
                                    LEFT JOIN   Users u ON s.user = u.userID
                                    LEFT JOIN   Mortuaries m ON s.costCenter = m.mortuaryID
                                    WHERE       s.ID = " . $data['ID'] . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Modifica los datos de un salario
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateSalary($data){
            $db = new DbHandler;

            $data['costCenter'] = cleanStr($data['costCenter']);
            $data['startDate'] = cleanStr($data['startDate']);
            $data['endDate'] = cleanStr($data['endDate']);
            $data['taxBase'] = cleanStr($data['taxBase']);
            $data['IRPF'] = cleanStr($data['IRPF']);
            $data['liquid'] = cleanStr($data['liquid']);
            $data['paymentDate'] = cleanStr($data['paymentDate']);
            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Salaries
                                SET     costCenter = " . $data['costCenter'] . ",
                                        startDate = " . $data['startDate'] . ",
                                        endDate = " . $data['endDate'] . ",
                                        taxBase = " . $data['taxBase'] . ",
                                        IRPF = " . $data['IRPF'] . ",
                                        liquid = " . $data['liquid'] . ",
                                        paymentDate = " . $data['paymentDate'] . "
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Elimina un salario
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function deleteSalary($data){
            $db = new DbHandler;
            
            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Salaries
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Obtiene los usuarios que no se han añadido al listado de salarios
         * 
         * @param string $data
         * 
         * @return array
         */
        public function getUsers($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      u.userID, u.name, u.surname
                                    FROM        Users u
                                    LEFT JOIN   Salaries s ON u.userID = s.user
                                    WHERE       s.user IS NULL AND
                                                u.leavingDate IS NULL AND
                                                (u.name LIKE '%" .  $data . "%' OR 
                                                u.surname LIKE '%" .  $data . "%')
                                    ORDER BY    u.name" );

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /** **************************************** IMPUESTOS Y TASAS **************************************** */
        /*
         **
         * Obtiene la tasas
         *
         * @return array
         */
        public function listTaxesDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      t.ID, t.startDate, t.endDate, cc.name, t.settlementDate, t.paymentMethod, t.expenseType, s.name, t.taxBase
                                    FROM        Taxes t
                                    LEFT JOIN   Cost_Center cc ON t.costCenter = cc.ID
                                    LEFT JOIN   Bank_Accounts ba ON t.bankAccount = ba.ID
                                    LEFT JOIN   Shipper s ON t.shipperType = s.ID
                                    WHERE       t.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
                $dataTax = $db->resultToArrayValue($result);
                $index = 0;
                foreach($dataTax as $elem){
                    $id = $elem[0];

                    $dataTax[$index][9] = null;
                    if(is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/taxes/$id/")){
                        $scan = scandir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/taxes/$id/");
                        array_shift($scan);
                        array_shift($scan);
                        
                        foreach($scan as $elem){
                            if($elem != '.' && $elem != '..'){
                                if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/taxes/$id/$elem")){
                                    $dataTax[$index][9] = $elem;
                                }
                            }
                        }
                    }
                    
                    $index++;
                }
				return $dataTax;
			}
        }

        /**
         * Añade un impuesto
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function createTax($data){
            $db = new DbHandler;

            $data['costCenter'] = cleanStr($data['costCenter']);
            $data['bankAccount'] = cleanStr($data['bankAccount']);
            $data['creditCard'] = cleanStr($data['creditCard']);
            $data['shipperType'] = cleanStr($data['shipperType']);
            $data['tax_base'] = cleanStr($data['tax_base']);
            $data['startDate'] = cleanStr($data['startDate']);
            $data['endDate'] = cleanStr($data['endDate']);
            $data['settlementDate'] = cleanStr($data['settlementDate']);
            $data['paymentMethod'] = cleanStr($data['paymentMethod']);
            $data['creationDate'] = cleanStr($data['creationDate']);
            $data['expenseType'] = cleanStr($data['expenseType']);
            $data['expirationDate'] = cleanStr($data['expirationDate']);

            $created = $db->query(" INSERT INTO Taxes(  
                                        costCenter, bankAccount, creditCard, 
                                        shipperType, taxBase, concept, startDate, 
                                        endDate, settlementDate, paymentMethod, comments, 
                                        creationDate, expenseType, expirationDate
                                    )
                                    VALUES( 
                                        " . $data['costCenter'] . ", " . $data['bankAccount'] . ", " . $data['creditCard'] . ",
                                        " . $data['shipperType'] . ", " . $data['tax_base'] . ", '" . $data['concept'] . "', " . $data['startDate'] . ",
                                            " . $data['endDate'] . ", " . $data['settlementDate'] . ", " . $data['paymentMethod'] . ", '" . $data['comments'] . "',
                                            " . $data['creationDate'] . ", " . $data['expenseType'] . ", " . $data['expirationDate'] . "
                                    )
            ");

            if(!$created){
                return false;
            }

            $result = $db->query("  SELECT      t.ID
                                    FROM        Taxes t
                                    ORDER BY    t.ID DESC
                                    LIMIT       1");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                return $db->resultToArray($result)[0]['ID'];
            }
        }

        /**
         * Obtiene los datos de un impuesto
         * 
         * @param array $data
         * 
         * @return array
         */
        public function readTax($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT      t.ID, t.concept, t.startDate, t.endDate, t.settlementDate, t.paymentMethod, 
                                                t.costCenter as costCenter, cce.name as costCenterName, 
                                                ba.ID as bankAccount, ba.owner as bankAccountOwner, s.ID as shipperType, s.name as shipperTypeName,
                                                t.taxBase, t.comments, t.creationDate, t.expenseType, t.expirationDate, t.creditCard, cc.owner as creditCardOwner
                                    FROM        (Taxes t)
                                    LEFT JOIN   Cost_Center cce ON t.costCenter = cce.ID
                                    LEFT JOIN   Bank_Accounts ba ON t.bankAccount = ba.ID
                                    LEFT JOIN   Credit_Cards cc ON t.creditCard = cc.ID
                                    LEFT JOIN   Shipper s ON t.shipperType = s.ID
                                    WHERE       t.ID = " . $data['ID']);

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Modifica los datos de un impuesto
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateTax($data){
            $db = new DbHandler;

            $data['costCenter'] = cleanStr($data['costCenter']);
            $data['bankAccount'] = cleanStr($data['bankAccount']);
            $data['creditCard'] = cleanStr($data['creditCard']);
            $data['shipperType'] = cleanStr($data['shipperType']);
            $data['tax_base'] = cleanStr($data['tax_base']);
            $data['startDate'] = cleanStr($data['startDate']);
            $data['endDate'] = cleanStr($data['endDate']);
            $data['settlementDate'] = cleanStr($data['settlementDate']);
            $data['paymentMethod'] = cleanStr($data['paymentMethod']);
            $data['creationDate'] = cleanStr($data['creationDate']);
            $data['expenseType'] = cleanStr($data['expenseType']);
            $data['expirationDate'] = cleanStr($data['expirationDate']);
            $data['ID'] = cleanStr($data['ID']);

            $updated = $db->query(" UPDATE  Taxes
                                    SET     costCenter = " . $data['costCenter'] . ",
                                            bankAccount = " . $data['bankAccount'] . ",
                                            creditCard = " . $data['creditCard'] . ",
                                            shipperType = " . $data['shipperType'] . ",
                                            taxBase = " . $data['tax_base'] . ",
                                            concept = '" . $data['concept'] . "',
                                            startDate = " . $data['startDate'] . ",
                                            endDate = " . $data['endDate'] . ",
                                            settlementDate = " . $data['settlementDate'] . ",
                                            paymentMethod = " . $data['paymentMethod'] . ",
                                            comments = '" . $data['comments'] . "',
                                            creationDate = " . $data['creationDate'] . ",
                                            expenseType = " . $data['expenseType'] . ",
                                            expirationDate = " . $data['expirationDate'] . "
                                    WHERE   ID = " . $data['ID'] . "");

            if(!$updated){
                return $updated;
            }else{
                return $data;
            }
        }

        /**
         * Elimina un impuesto
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function deleteTax($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Taxes
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID'] . "");
        }

        /** **************************************** CONFIGURACIÓN **************************************** */
        /**
         * Crea un tipo de gasto fijo
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function createExpenseFixed($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            return $db->query(" INSERT INTO Expenses_Fixed(name) VALUES('" . $data['name'] . "')");
        }

        /**
         * Obtiene los datos de un tipo de gasto fijo
         * 
         * @param array $data
         * 
         * @return array
         */
        public function readExpenseFixed($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  *
                                    FROM    Expenses_Fixed
                                    WHERE   ID = " . $data['ID'] . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Modifica los datos de un tipo de gasto fijo
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateExpenseFixed($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['name'] = cleanStr($data['name']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            return $db->query(" UPDATE  Expenses_Fixed
                                SET     name = '" . $data['name'] . "'
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Elimina un tipo de gasto fijo
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function deleteExpenseFixed($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Expenses_Fixed
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Obtiene los tipos de gastos fijos
         * 
         * @param string $data
         * 
         * @return array
         */
        public function getExpensesFixed($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      ID, name
                                    FROM        Expenses_Fixed
                                    WHERE       leavingDate IS NULL AND
                                                name LIKE '%" .  $data . "%'
                                    ORDER BY    name");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Crea un tipo de gasto variable
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function createExpenseVariable($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            return $db->query(" INSERT INTO Expenses_Variable(name) VALUES('" . $data['name'] . "')");
        }

        /**
         * Obtiene los datos de un tipo de gasto variable
         * 
         * @param array $data
         * 
         * @return array
         */
        public function readExpenseVariable($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  *
                                    FROM    Expenses_Variable
                                    WHERE   ID = " . $data['ID'] . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Modifica los datos de un tipo de gasto variable
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateExpenseVariable($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['name'] = cleanStr($data['name']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            return $db->query(" UPDATE  Expenses_Variable
                                SET     name = '" . $data['name'] . "'
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Elimina un tipo de gasto variable
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function deleteExpenseVariable($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Expenses_Variable
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Obtiene los tipos de gastos variables
         * 
         * @param string $data
         * 
         * @return array
         */
        public function getExpensesVariable($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      ID, name
                                    FROM        Expenses_Variable
                                    WHERE       leavingDate IS NULL AND
                                                name LIKE '%" .  $data . "%'
                                    ORDER BY    name");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Obtiene los centros de coste (tanatorios propios)
         * 
         * @param string $data
         * 
         * @return array
         */
        public function getCostCenters($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      ID, name
                                    FROM        Cost_Center
                                    WHERE       leavingDate IS NULL AND
                                                name LIKE '%" .  $data . "%'
                                    ORDER BY    name");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Crea una cuenta bancaria
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function createBankAccount($data){
            $db = new DbHandler;

            $data['alias'] = cleanStr($data['alias']);
            $data['number'] = cleanStr($data['number']);
            $data['owner'] = cleanStr($data['owner']);
            $data['bank'] = cleanStr($data['bank']);

            // Validación de campos
            if($data['alias'] == ''){
                return false;
            }
            if($data['number'] == ''){
                return false;
            }
            if($data['owner'] == ''){
                return false;
            }
            if($data['bank'] == ''){
                return false;
            }
            $data['number'] = toCrypt($data['number']);

            // Checks if exists a number
            $result = $db->query("  SELECT  COUNT(*) AS AMOUNT
                                    FROM    Bank_Accounts
                                    WHERE   leavingDate IS NULL AND
                                            number = '{$data['number']}'");

            $found = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
            if($found != null && !empty($found) && intval($found[0]['AMOUNT']) > 0){
                return 'number_exists';
            }

            return $db->query(" INSERT INTO Bank_Accounts(alias, number, owner, bank)
                                VALUES('" . $data['alias'] . "', '" . $data['number'] . "', '" . $data['owner'] . "', '" . $data['bank'] . "')");
        }

        /**
         * Obtiene los datos de una cuenta bancaria
         * 
         * @param array $data
         * 
         * @return array
         */
        public function readBankAccount($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  *
                                    FROM    Bank_Accounts
                                    WHERE   ID = " . $data['ID'] . "");

            if(mysqli_num_rows($result) > 0){
                $result = $db->resultToArray($result)[0];
                $result['number'] = toCrypt($result['number'], 'd');

                return $result;
            }else{
                return null;
            }
        }

        /**
         * Modifica los datos de una cuenta bancaria
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateBankAccount($data){
            $db = new DbHandler;

            $data['alias'] = cleanStr($data['alias']);
            $data['owner'] = cleanStr($data['owner']);
            $data['number'] = cleanStr($data['number']);
            $data['bank'] = cleanStr($data['bank']);
            $data['ID'] = cleanStr($data['ID']);

            // Validación de campos
            if($data['alias'] == ''){
                return false;
            }
            if($data['number'] == ''){
                return false;
            }
            if($data['owner'] == ''){
                return false;
            }
            if($data['bank'] == ''){
                return false;
            }

            // Checks if exists a number
            $result = $db->query("  SELECT  COUNT(*) AS AMOUNT
                                    FROM    Bank_Accounts
                                    WHERE   leavingDate IS NULL AND
                                            number = '" . toCrypt($data['number']) . "' AND
                                            ID != {$data['ID']}");

            $found = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
            if($found != null && !empty($found) && intval($found[0]['AMOUNT']) > 0){
                return 'number_exists';
            }

            return $db->query(" UPDATE  Bank_Accounts
                                SET     owner = '" . $data['owner'] . "',
                                        number = '" . toCrypt($data['number']) . "',
                                        bank = '" . $data['bank'] . "',
                                        alias = '" . $data['alias'] . "'
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Elimina una cuenta bancaria
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function deleteBankAccount($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Bank_Accounts
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Obtiene las cuentas bancarias
         * 
         * @param string $data
         * 
         * @return array
         */
        public function getBankAccounts($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  ID, owner, alias
                                    FROM    Bank_Accounts
                                    WHERE   leavingDate IS NULL AND
                                            owner LIKE '%" .  $data . "%'
                                    ORDER BY owner");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Obtiene las cuentas bancarias
         * 
         * @return array
         */
        public function listBankAccounts(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  number, bank, alias
                                    FROM    Bank_Accounts
                                    WHERE   leavingDate IS NULL");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Obtiene los TPVs
         * 
         * @return array
         */
        public function listTPVs(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  name as id, 
                                            IF(
                                                numAccount IS NOT NULL,
                                                CONCAT(name, ' - ', numAccount),
                                                name
                                            ) as text
                                    FROM    TPVs
                                    WHERE   leavingDate IS NULL");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Obtiene las tarjetas de crédito
         * 
         * @return array
         */
        public function listCreditCards(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  number
                                    FROM    Credit_Cards
                                    WHERE   leavingDate IS NULL");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Crea una tarjeta de crédito
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function createCreditCard($data){
            $db = new DbHandler;

            $data['number'] = cleanStr($data['number']);
            $data['owner'] = cleanStr($data['owner']);

            // Validación de campos
            if($data['number'] == ''){
                return false;
            }
            if($data['owner'] == ''){
                return false;
            }

            $data['number'] = toCrypt($data['number']);

            return $db->query(" INSERT INTO Credit_Cards(number, owner)
                                VALUES('" . $data['number'] . "', '" . $data['owner'] . "')");
        }

        /**
         * Obtiene los datos de una tarjeta de crédito
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function readCreditCard($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  *
                                    FROM    Credit_Cards
                                    WHERE   ID = " . $data['ID'] . "");

            if(mysqli_num_rows($result) > 0){
                $result = $db->resultToArray($result)[0];
                $result['number'] = toCrypt($result['number'], 'd');

                return $result;
            }else{
                return null;
            }
        }

        /**
         * Modifica los datos de una tarjeta de crédito
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateCreditCard($data){
            $db = new DbHandler;
            
            $data['owner'] = cleanStr($data['owner']);
            $data['number'] = cleanStr($data['number']);
            $data['ID'] = cleanStr($data['ID']);

            // Validación de campos
            if($data['number'] == ''){
                return false;
            }
            if($data['owner'] == ''){
                return false;
            }

            return $db->query(" UPDATE  Credit_Cards
                                SET     owner = '" . $data['owner'] . "',
                                        number = '" . toCrypt($data['number']) . "'
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Elimina una tarjeta de crédito
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function deleteCreditCard($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Credit_Cards
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Obtiene las tarjetas de crédito/débito
         * 
         * @param string $data
         * 
         * @return array
         */
        public function getCreditCards($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      ID, owner
                                    FROM        Credit_Cards
                                    WHERE       leavingDate IS NULL AND
                                                owner LIKE '%" .  $data . "%'
                                    ORDER BY    owner");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Crea una plantilla de salario
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function createSalaryTemplate($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['costCenter'] = cleanStr($data['costCenter']);
            $data['startDay'] = cleanStr($data['startDay']);
            $data['endDay'] = cleanStr($data['endDay']);
            $data['taxBase'] = cleanStr($data['taxBase']);
            $data['IRPF'] = cleanStr($data['IRPF']);
            $data['liquid'] = cleanStr($data['liquid']);
            $data['paymentDay'] = cleanStr($data['paymentDay']);

            return $db->query(" INSERT INTO Salaries_Templates( 
                                    name, costCenter, startDay, 
                                    endDay, taxBase, IRPF,
                                    liquid, paymentDay, leavingDate
                                )
                                VALUES( 
                                    '" . $data['name'] . "', " . $data['costCenter'] . ", " . $data['startDay'] . ",
                                    " . $data['endDay'] . ", " . $data['taxBase'] . ", " . $data['IRPF'] . ", 
                                    " . $data['liquid'] . ", " . $data['paymentDay'] . ", null
                                )
            ");
        }

        /**
         * Obtiene los datos de una plantilla de salario
         * 
         * @param array $data
         * 
         * @return array
         */
        public function readSalaryTemplate($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT      st.*, m.name as costCenterName
                                    FROM        (Salaries_Templates st)
                                    LEFT JOIN   Mortuaries m ON st.costCenter = m.mortuaryID
                                    WHERE       st.ID = " . $data['ID'] . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Modifica los datos de una plantilla de salario
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateSalaryTemplate($data){
            $db = new DbHandler;

            $data['costCenter'] = cleanStr($data['costCenter']);
            $data['name'] = cleanStr($data['name']);
            $data['startDay'] = cleanStr($data['startDay']);
            $data['endDay'] = cleanStr($data['endDay']);
            $data['taxBase'] = cleanStr($data['taxBase']);
            $data['IRPF'] = cleanStr($data['IRPF']);
            $data['liquid'] = cleanStr($data['liquid']);
            $data['paymentDay'] = cleanStr($data['paymentDay']);
            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Salaries_Templates
                                SET     costCenter = " . $data['costCenter'] . ",
                                        name = '" . $data['name'] . "',
                                        startDay = " . $data['startDay'] . ",
                                        endDay = " . $data['endDay'] . ",
                                        taxBase = " . $data['taxBase'] . ",
                                        IRPF = " . $data['IRPF'] . ",
                                        liquid = " . $data['liquid'] . ",
                                        paymentDay = " . $data['paymentDay'] . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Elimina una plantilla de salario
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function deleteSalaryTemplate($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Salaries_Templates
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Obtiene las plantillas de salario
         * 
         * @param array $data
         * 
         * @return array
         */
        public function getTemplates($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  ID, name
                                    FROM    Salaries_Templates
                                    WHERE   leavingDate IS NULL AND
                                            name LIKE '%" .  $data . "%'
                                    ORDER BY name");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }
        
        /**
        * Obtiene los expedientes facturados en el rango de fechas para el cliente(Particulaes, distintas empresas)
        *
        * @param array $data
        */
        public function getSalariesCash($from, $to){
            $db = new DbHandler;

            $from = cleanStr($from);
            $to = cleanStr($to);

            $result = $db->query("  SELECT  u.name AS user, ut.name AS userType, s.paymentDate AS date, s.paymentDate AS expiration, 'Salario' AS description, s.taxBase AS import
                                    FROM    Salaries s, Users u, Users_Types ut
                                    WHERE   s.user = u.userID AND 
                                            u.type = ut.userTypeID AND 
                                            s.paymentDate BETWEEN " . $from . " AND " . $to . "");            
            $res = $db->resultToArray($result);

            return mysqli_num_rows($result) > 0 ? $res : null;
        }

        /**
        * Obtiene los expedientes facturados en el rango de fechas para el cliente(Particulaes, distintas empresas)
        *
        * @param array $data
        */
        public function getTaxesCash($from, $to){
            $db = new DbHandler;

            $from = cleanStr($from);
            $to = cleanStr($to);

            $result = $db->query("  SELECT  t.settlementDate AS date, t.concept AS description, t.taxBase AS import, t.settlementDate AS expiration
                                    FROM    Taxes t
                                    WHERE   t.leavingDate IS NULL AND 
                                            t.settlementDate BETWEEN " . $from . " AND " . $to . "");            
            $res = $db->resultToArray($result);

            return mysqli_num_rows($result) > 0 ? $res : null;
        }

        /**
         * Obtiene los expedidores
         * 
         * @return array
         */
        public function listShipper(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  name
                                    FROM    Shipper
                                    WHERE   leavingDate IS NULL");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Crea un expedidor
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function createShipper($name){
            $db = new DbHandler;

            $name = cleanStr($name);

            return $db->query(" INSERT INTO Shipper(name) VALUES('" . $name . "')");
        }

        /**
         * Obtiene los datos de un expedidor
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function readShipper($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  *
                                    FROM    Shipper
                                    WHERE   ID = " . $data['ID'] . "");

            if(mysqli_num_rows($result) > 0){
                return $db->resultToArray($result)[0];
            }else{
                return null;
            }
        }

        /**
         * Modifica los datos de un expedidor
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateShipper($id, $name){
            $db = new DbHandler;

            $id = cleanStr($id);
            $name = cleanStr($name);

            return $db->query(" UPDATE  Shipper
                                SET     name = '" . $name . "'
                                WHERE   ID = " . $id . "");
        }

        /**
         * Elimina una expedidor
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function deleteShipper($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Shipper
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Obtiene los expedidores
         * 
         * @param string $data
         * 
         * @return array
         */
        
        public function getShippers($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  ID, name
                                    FROM    Shipper
                                    WHERE   leavingDate IS NULL AND
                                            name LIKE '%" .  $data . "%'
                                    ORDER BY name");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /*
        * Obtiene lun listado de las cuentas bancarias
        *
        * @return array
        */
        public function listBankDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  ba.ID, ba.alias, ba.owner, ba.number, ba.bank
                                    FROM    Bank_Accounts ba
                                    WHERE   ba.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
        * Obtiene las cuentas bancarias por número o banco
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT  ID, bank, number
                                    FROM    Bank_Accounts 
                                    WHERE   (number LIKE '%". $name ."%' OR bank LIKE '%". $name ."%')  AND
                                            leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los TPV de cobro por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByNameTPV(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  name as id,
                                            name as text,
                                            numAccount
                                    FROM    TPVs
                                    WHERE   leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /*
        * Obtiene un listado de las tarjetas de crédito
        *
        * @return array
        */
        public function listCardDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  cc.ID, cc.owner, cc.number
                                    FROM    Credit_Cards cc
                                    WHERE   cc.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /*
        * Obtiene un listado de los gastos fijos
        *
        * @return array
        */
        public function listFixedDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  ef.ID, ef.name
                                    FROM    Expenses_Fixed ef
                                    WHERE   ef.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /*
        * Obtiene un listado de las plantillas de salarios
        *
        * @return array
        */
        public function listSalaryDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      st.ID, st.name
                                    FROM        Salaries_Templates st
                                    WHERE       st.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /*
        * Obtiene el listado de expedidores
        *
        * @return array
        */
        public function listShipperDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  s.ID, s.name
                                    FROM    Shipper s
                                    WHERE   s.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /*
        * Obtiene el listado de gastos variables
        *
        * @return array
        */
        public function listVariableDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  ev.ID, ev.name
                                    FROM    Expenses_Variable ev
                                    WHERE   ev.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /*
        * Obtiene el listado de facturas recibidas
        *
        * @return array
        */
        public function getPaidInfo($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  SUM(rip.amount) as totalPaid, ri.total, ri.invoiceNumber
                                    FROM    Received_Invoices ri, Received_Invoices_Payments rip
                                    WHERE   ri.ID = $id AND 
                                            rip.invoice = ri.ID AND 
                                            rip.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArray($result)[0];
			}
        }

        /**
         * Obtiene las facturas recibidas
         *
         * @return array
         */
        public function listReceivedInvoicedDatatables(
            $from, $to, $type, $deliveryNote = null, $status = null, $supplier = null, $costCenterFilter = null, 
            $cashOutFilter = null, $expenseTypeFilter = null, $paymentMethodFilter = null, $bankAccountFilter = null, $creditCardFilter = null
        ){
            $db = new DbHandler;

            $where = "ri.leavingDate IS NULL";

            if(isset($from) && isset($to) && $from != null && $to != null){
                $where .= " AND ri.date BETWEEN " . $from . " AND " . $to;
            }

            if($type != '0' && $type != 0){
                if($type == '1' || $type == 1){
                    $where .= ' AND ri.isTicket = 0';
                }else if($type == '2' || $type == 2){
                    $where .= ' AND ri.isTicket = 1';
                }
            }
            
            if($deliveryNote != null){
                $where .= " AND ri.deliveryNote = $deliveryNote";
            }

            if($status != null && $status != '-'){
                if(intval($status) === 1){ // Pagada

                    $where .= " AND
                                    (
                                        ABS(ROUND(ri.total, 2)) <= 
                                        ABS(
                                            (
                                                SELECT   COALESCE(SUM(rip.amount), 0)
                                                FROM    Received_Invoices_Payments rip
                                                WHERE   rip.leavingDate IS NULL
                                                    AND rip.invoice = ri.ID
                                            )
                                        )
                                )
                    ";
                    
                }else{ // Pendiente

                    $where .= " AND
                                ABS(ROUND(ri.total, 2)) > ABS((
                                    SELECT  COALESCE(SUM(rip.amount), 0)
                                    FROM    Received_Invoices_Payments rip
                                    WHERE   rip.leavingDate IS NULL
                                        AND rip.invoice = ri.ID
                                ))
                    ";
                }
            }

            if($supplier != null && $supplier != '-' && $supplier != "null"){
                $where .= " AND ri.supplier = $supplier";
            }

            if($costCenterFilter != null && $costCenterFilter != '' && $costCenterFilter != "null"){
                $where .= " AND ri.costCenter = $costCenterFilter";
            }

            if($cashOutFilter != null && $cashOutFilter != '0' && $cashOutFilter != "null"){
                $where .= " AND ri.cashOut = $cashOutFilter";
            }

            if($expenseTypeFilter != null && $expenseTypeFilter != '0' && $expenseTypeFilter != "null"){
                $where .= " AND ri.expenseType = $expenseTypeFilter";
            }

            if($paymentMethodFilter != null && $paymentMethodFilter != '0' && $paymentMethodFilter != "null"){
                $where .= " AND ri.paymentMethod = $paymentMethodFilter";
            }

            if($bankAccountFilter != null && $bankAccountFilter != '-' && $bankAccountFilter != "null"){
                $where .= " AND ri.bankAccount = $bankAccountFilter";
            }

            if($creditCardFilter != null && $creditCardFilter != '-' && $creditCardFilter != "null"){
                $where .= " AND ri.creditCard = $creditCardFilter";
            }

            // IVA_Types
            $ivasBD = [];
            $ivasColumns = '';
            $result = $db->query("  SELECT      *
                                    FROM        IVA_Types it
                                    WHERE       it.leavingDate IS NULL AND
                                                it.type = 2
                                    ORDER BY    it.percentage ASC
            ");
            if(mysqli_num_rows($result) > 0){
                $ivasAux = $db->resultToArray($result);
                $ivasColumns = '';
                foreach($ivasAux as $index=>$it){
                    array_push(
                        $ivasBD,
                        array(
                            'percentage' => $it['percentage'],
                            'total' => 0
                        )
                    );

                    $ivasColumns .= "0 as taxBase$index,";
                }
            }

            $result = $db->query("  SELECT      ri.ID, 
                                                ri.invoiceNumber, 
                                                ri.date, 
                                                s.nif, 
                                                IF(ri.supplier IS NULL, ri.shipper, s.name) as name, 
                                                ri.taxBase,
                                                ri.taxBase2,
                                                ri.taxBase3,
                                                $ivasColumns
                                                ri.withholding, 
                                                ri.supplied, 
                                                ri.total, 
                                                (   SELECT  SUM(rip.amount)
                                                    FROM    Received_Invoices_Payments rip
                                                    WHERE   rip.leavingDate IS NULL AND
                                                            rip.invoice = ri.ID 
                                                ) as pagado,
                                                ri.feeHoldIva, 
                                                ri.feeHoldIva2, 
                                                ri.feeHoldIva3,
                                                ri.paymentMethod
                                    FROM        (Received_Invoices ri)
                                    LEFT JOIN   Suppliers s ON ri.supplier = s.supplierID
                                    WHERE       $where
                                    ORDER BY    ri.ID DESC
            ");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
                $dataInvoice = $db->resultToArrayValue($result);
                $index = 0;
                foreach($dataInvoice as $elem){
                    $id = $elem[0];

                    $result = $db->query("  SELECT  SUM(rip.amount) as total
                                            FROM    Received_Invoices ri, Received_Invoices_Payments rip
                                            WHERE   ri.ID = $id AND rip.invoice = ri.ID AND rip.leavingDate IS NULL");
                           
                    $totalPaid = $db->resultToArrayValue($result)[0];

                    if($elem[5] == null){

                        $wasDelivery = $this->receivedInvoiceWasDelivery($id);
                        if($wasDelivery == 1){
                            $items = $this->getItems($id);

                            $ivasItem = $ivasBD;
                            foreach($items as $it){
                                if($it["price"] != null && $it["price"] != '' && floatval($it["price"] > 0)){
                                    if($it["iva"] != '' && $it["iva"] != null){

                                        $found = array_search($it["iva"], array_column($ivasItem, 'percentage'));
                                        if($found !== false){
                                            $newIndex = 8 + $found;
                                            $dataInvoice[$index][$newIndex] += (floatval($it["price"]) * (100 - floatval($it["discount"]))/100) * intval($it['amount']);
                                        }
                                    }
                                }
                            }
                        }else if($wasDelivery == 2){
                            $items = $this->getItemsGasoil($id);
                        }
                    }else{
                        $ivasItem = $ivasBD;

                        // Get invoice ivas
                        $resultInvoiceIvas = $db->query("SELECT    iniv.typeIva,
                                                                    iniv.base,
                                                                    iniv.iva
                                                        FROM        Received_Invoices_Ivas iniv
                                                        WHERE       iniv.deleteDate IS NULL AND
                                                                    iniv.received_invoice  = $id
                        ");
                        if(mysqli_num_rows($resultInvoiceIvas) > 0){
                            $invoiceIvas = $db->resultToArray($resultInvoiceIvas);
                            foreach($invoiceIvas as $invoiceIv){
                                $found = array_search($invoiceIv["typeIva"], array_column($ivasItem, 'percentage'));
                                if($found !== false){
                                    $newIndex = 8 + $found;
                                    $dataInvoice[$index][$newIndex] += $invoiceIv["base"];
                                }
                            }
                        }
                    }

                    // Delete taxes
                    array_splice($dataInvoice[$index], 5, 3);

                    $columItemPagada = 5 + count($ivasBD) + 7;
                    $columItemFormadePago = 5 + count($ivasBD) + 8;
                    switch($dataInvoice[$index][$columItemPagada]){
                        case '1':
                            $dataInvoice[$index][$columItemFormadePago] = 'Contado';
                        break;
                        case '2':
                            $dataInvoice[$index][$columItemFormadePago] = 'Transferencia bancaria';
                        break;
                        case '3':
                            $dataInvoice[$index][$columItemFormadePago] = 'Cargo en cuenta';
                        break;
                        case '4':
                            $dataInvoice[$index][$columItemFormadePago] = 'Tarjeta de crédito';
                        break;
                        default:
                            $dataInvoice[$index][$columItemFormadePago] = '-';
                        break;
                    }

                    $dataInvoice[$index][$columItemPagada] =  $totalPaid[0];

                    $columItemDocAttach = 5 + count($ivasBD) + 9;
                    $dataInvoice[$index][$columItemDocAttach] = null;
                    if(is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/receivedInvoices/{$dataInvoice[$index][0]}/")){
                        $scan = scandir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/receivedInvoices/{$dataInvoice[$index][0]}/");
                        array_shift($scan);
                        array_shift($scan);
                        
                        $items = array();
                        foreach($scan as $elem){
                            if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/receivedInvoices/{$dataInvoice[$index][0]}/$elem")){
                                $dataInvoice[$index][$columItemDocAttach] = $elem;
                                break;
                            }
                        }
                    }
                    
                    $index++;
                }
				return $dataInvoice;
			}
        }

        /**
         * Obtiene los totales para las facturas recibidas
         *
         * @return array
         */
        public function getTotals($from, $to, $type, $supplier = null, $costCenter = null, $cashOut = null, $expenseType = null, $paymentMethod = null, $bankAccount = null, $creditCard = null){
            $db = new DbHandler;

            $where = " ri.leavingDate IS NULL ";

            if(isset($from) && isset($to) && $from != null && $to != null){
                $where .= "AND ri.date BETWEEN " . $from . " AND " . $to;
            }

            if($type != '0' && $type != 0){
                if($type == '1' || $type == 1){
                    $where .= ' AND ri.isTicket = 0 ';
                }else if($type == '2' || $type == 2){
                    $where .= ' AND ri.isTicket = 1 ';
                }
            }
            
            if($supplier != null && $supplier != '-' && $supplier != "null"){
                $where .= " AND ri.supplier = $supplier";
            }

            if($costCenter != null && $costCenter != '-' && $costCenter != "null"){
                $where .= " AND ri.costCenter = $costCenter";
            }

            if($cashOut != null && $cashOut != '0'){
                $where .= " AND ri.cashOut = $cashOut";
            }

            if($expenseType != null && $expenseType != '0'){
                $where .= " AND ri.expenseType = $expenseType";
            }

            if($paymentMethod != null && $paymentMethod != '0'){
                $where .= " AND ri.paymentMethod = $paymentMethod";
            }

            if($bankAccount != null && $bankAccount != '-' && $bankAccount != "null"){
                $where .= " AND ri.bankAccount = $bankAccount";
            }
            if($creditCard != null && $creditCard != '-' && $creditCard != "null"){
                $where .= " AND ri.creditCard = $creditCard";
            }

            $result = $db->query("  SELECT      ri.ID,
                                                ri.total
                                    FROM        (Received_Invoices ri)
                                    LEFT JOIN   Suppliers s ON ri.supplier = s.supplierID
                                    WHERE       $where
            ");

            $totals = array();
            $totals['invoices'] = 0;
            $totals['paid'] = 0;

            if(mysqli_num_rows($result) == 0){
                return $totals;
            }else{
                $dataInvoice = $db->resultToArray($result);
                foreach($dataInvoice as $elem){
                    $id = $elem['ID'];

                    $result = $db->query("  SELECT  SUM(rip.amount) as total
                                            FROM    Received_Invoices ri, Received_Invoices_Payments rip
                                            WHERE   ri.ID = $id AND rip.invoice = ri.ID AND rip.leavingDate IS NULL
                    ");
                        
                    $totalPaid = $db->resultToArray($result)[0];

                    $totals['invoices'] += floatval($elem['total']);
                    $totals['paid'] += floatval($totalPaid['total']);
                }
            }

            return $totals;
        }

        /*
        * Obtiene un listado de los tpvs de cobro
        *
        * @return array
        */
        public function listTPVDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  tp.ID, tp.name, tp.numAccount
                                    FROM    TPVs tp
                                    WHERE   tp.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
         * Crea un TPV de cobro
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function createTPV($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['numAccount'] = cleanStr($data['numAccount']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            $numAccount = $data['numAccount'];
            if($numAccount == null || $numAccount == ''){
                $numAccount = 'null';
            }else{
                $numAccount = "'$numAccount'";
            }
            return $db->query(" INSERT INTO TPVs(name, numAccount)
                                VALUES('" . $data['name'] . "', $numAccount)");
        }

        /**
         * Modifica los datos de un TPV de cobro
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateTPV($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['name'] = cleanStr($data['name']);
            $data['numAccount'] = cleanStr($data['numAccount']);

            // Validación de campos
            if($data['ID'] == ''){
                return false;
            }
            if($data['name'] == ''){
                return false;
            }

            $numAccount = $data['numAccount'];
            if($numAccount == null || $numAccount == ''){
                $numAccount = 'null';
            }else{
                $numAccount = "'$numAccount'";
            }

            return $db->query(" UPDATE  TPVs
                                SET     name = '" . $data['name'] . "',
                                        numAccount = $numAccount
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Elimina un TPV de cobro
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function deleteTPV($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  TPVs
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Obtiene las facturas recibidas para el formato A3
         *
         * @return array
         */
        public function listReceivedInvoicedA3(
            $from, $to, $type, $deliveryNote = null, $status = null, $supplier = null, $costCenterFilter = null, 
            $cashOutFilter = null, $expenseTypeFilter = null, $paymentMethodFilter = null, $bankAccountFilter = null, $creditCardFilter = null
        ){
            $db = new DbHandler;

            $where = "  ri.leavingDate IS NULL AND 
                        riniv.deleteDate IS NULL AND
                        riniv.received_invoice = ri.ID AND
                        riniv.deleteDate IS NULL
            ";

            if(isset($from) && isset($to) && $from != null && $to != null){
                $where .= " AND ri.date BETWEEN " . $from . " AND " . $to;
            }

            if($type != '0' && $type != 0){
                if($type == '1' || $type == 1){
                    $where .= ' AND ri.isTicket = 0';
                }else if($type == '2' || $type == 2){
                    $where .= ' AND ri.isTicket = 1';
                }
            }
            
            if($deliveryNote != null){
                $where .= " AND ri.deliveryNote = $deliveryNote";
            }

            if($status != null && $status != '-'){
                if(intval($status) === 1){ // Pagada

                    $where .= " AND
                                ABS(ROUND(ri.total, 2)) <= ABS((
                                               SELECT   COALESCE(SUM(rip.amount), 0)
                                                FROM    Received_Invoices_Payments rip
                                                WHERE   rip.leavingDate IS NULL
                                                    AND rip.invoice = ri.ID
                                            ))
                    ";
                    
                }else{ // Pendiente

                    $where .= " AND
                                ABS(ROUND(ri.total, 2)) > ABS((
                                                SELECT  COALESCE(SUM(rip.amount), 0)
                                                FROM    Received_Invoices_Payments rip
                                                WHERE   rip.leavingDate IS NULL
                                                    AND rip.invoice = ri.ID
                                            ))
                    ";
                }
            }

            if($supplier != null && $supplier != '-' && $supplier != "null"){
                $where .= " AND ri.supplier = $supplier";
            }

            if($costCenterFilter != null && $costCenterFilter != '' && $costCenterFilter != "null"){
                $where .= " AND ri.costCenter = $costCenterFilter";
            }

            if($cashOutFilter != null && $cashOutFilter != '0' && $cashOutFilter != "null"){
                $where .= " AND ri.cashOut = $cashOutFilter";
            }

            if($expenseTypeFilter != null && $expenseTypeFilter != '0' && $expenseTypeFilter != "null"){
                $where .= " AND ri.expenseType = $expenseTypeFilter";
            }

            if($paymentMethodFilter != null && $paymentMethodFilter != '0' && $paymentMethodFilter != "null"){
                $where .= " AND ri.paymentMethod = $paymentMethodFilter";
            }

            if($bankAccountFilter != null && $bankAccountFilter != '-' && $bankAccountFilter != "null"){
                $where .= " AND ri.bankAccount = $bankAccountFilter";
            }

            if($creditCardFilter != null && $creditCardFilter != '-' && $creditCardFilter != "null"){
                $where .= " AND ri.creditCard = $creditCardFilter";
            }

            $result = $db->query("  SELECT      ri.ID,
                                                ri.invoiceNumber, 
                                                ri.date, 
                                                s.nif, 
                                                IF(ri.supplier IS NULL, ri.shipper, s.name) as name, 
                                                ri.supplied, 
                                                ri.withholding, 
                                                ri.total,
                                                riniv.typeIva,
                                                riniv.base,
                                                riniv.iva
                                    FROM        (Received_Invoices ri, Received_Invoices_Ivas riniv)
                                    LEFT JOIN   Suppliers s ON ri.supplier = s.supplierID
                                    WHERE       $where
                                    ORDER BY    ri.ID DESC
            ");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
                return $db->resultToArray($result);
			}
        }
    }
?>