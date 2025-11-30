<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class DeliveryNotes{
        /**
         * Comprueba si existe un albarán
         * 
         * @param int $deliveryNote Id del albarán
         * @return bool
         */
        public function existsDeliveryNote($deliveryNote){
            $db = new DbHandler;

            $deliveryNote = cleanStr($deliveryNote);

            $result = $db->query("  SELECT  dn.ID
                                    FROM    DeliveryNotes dn
                                    WHERE   dn.ID = $deliveryNote AND
                                            dn.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? false : true;
        }

        /**
         * Crea un albarán
         * 
         * @param array $data Datos del albarán
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['order'] = cleanStr($data['order']);
            $data['date'] = cleanStr($data['date']);
            $data['order'] = cleanStr($data['order']);

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    DeliveryNotes 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    DeliveryNotes 
                                        WHERE   extraID = '" . $extraID . "'");
            }

            $order = $data['order'];
            $number = null;
            $date = $data['date'];
            $notes = null;
            $inAgreement = 'null';
            $received = 0;
            $nonconformityDescription = null;
            $nonconformitySolution = null;
            $leavingDate = 'null';
            
            $db->query("INSERT INTO DeliveryNotes(  `order`, number, date, notes, inAgreement, received, nonconformityDescription,
                                                    nonconformitySolution, leavingDate, extraID)
                        VALUES ($order, '$number', $date, '$notes', $inAgreement, $received, '$nonconformityDescription',
                                '$nonconformitySolution', $leavingDate, '$extraID')");

            $result = $db->query("  SELECT  dn.ID
                                    FROM    DeliveryNotes dn
                                    WHERE   dn.extraID = '$extraID'");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                $deliveryNote = $db->resultToArray($result)[0]['ID'];

                $lines = $data['lines'];

                foreach($lines as $line){
                    $line[0] = cleanStr($line[0]);
                    $line[1] = cleanStr($line[1]);
                    $line[2] = cleanStr($line[2]);

                    $model = $line[0];
                    $amount = $line[1];
                    $price = $line[2];
                    $receivedAmount = 0;
                    $pendingAmount = $amount;
                    $canceled = 0;
                    $hasInvoice = 0;

                    $db->query("INSERT INTO DeliveryNotes_Lines(deliveryNote, model, amount, price, receivedAmount, pendingAmount, canceled, hasInvoice)
                                VALUES ($deliveryNote, $model, $amount, $price, $receivedAmount, $pendingAmount, $canceled, $hasInvoice)");
                }
            }

            return true;
        }

        /**
         * Obtiene los datos de un albarán y sus líneas
         * 
         * @param int $id Id del albarán
         * @return array
         */
        public function read($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT      dn.ID, dn.number, dn.date, dn.notes, dn.inAgreement, dn.received, dn.nonconformityDescription, dn.nonconformitySolution,
                                                s.supplierID, s.name as supplierName, s.phones as supplierPhones, s.mail as supplierEmail,
                                                m.mortuaryID as deliveryPlaceId, m.name as deliveryPlace,
                                                o.otherDeliveryPlace, o.gasoil
                                    FROM        (DeliveryNotes dn)
                                    LEFT JOIN   Orders o ON dn.order = o.ID
                                    LEFT JOIN   Mortuaries m ON o.deliveryPlace = m.mortuaryID
                                    LEFT JOIN   Suppliers s ON o.supplier = s.supplierID
                                    WHERE       dn.ID = $id");

            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                $deliveryNote = $db->resultToArray($result)[0];

                $result = $db->query("  SELECT      dnl.ID, dnl.amount, dnl.price, dnl.receivedAmount, dnl.pendingAmount, dnl.canceled, dnl.discount,
                                                    pm.productModelID as modelID, pm.name as modelName, pm.supplierReference,
                                                    p.productID, p.name as productName, it.percentage as iva
                                        FROM        DeliveryNotes_Lines dnl, Products_Models pm, Products p, IVA_Types it
                                        WHERE       dnl.deliveryNote = $id AND
                                                    dnl.model = pm.productModelID AND
                                                    pm.product = p.productID AND
                                                    p.IVA = it.IVATypeID
                                        ORDER BY    p.name");

                if(mysqli_num_rows($result) == 0){
                    $deliveryNoteLines = null;
                }else{
                    $deliveryNoteLines = $db->resultToArray($result);
                }

                $result = $db->query("  SELECT      ol.model, ol.amount, ol.price,
                                                    olp.amount as lastPurchaseAmount, olp.price as lastPurchasePrice, olp.date as lastPurchaseDate,
                                                    pm.name as modelName, pm.supplierReference,
                                                    p.productID, p.name as productName
                                        FROM        Orders_Lines ol, Products_Models pm, Products p, DeliveryNotes dn, Orders_Last_Purchases olp
                                        WHERE       ol.model = pm.productModelID AND
                                                    ol.model = olp.model AND
                                                    pm.product = p.productID AND
                                                    dn.order = ol.order AND
                                                    dn.ID = $id
                                        ORDER BY    p.name");

                if(mysqli_num_rows($result) == 0){
                    $orderLines = null;
                }else{
                    $orderLines = $db->resultToArray($result);
                }

                $total = $this->getTotal($id);

                return array($deliveryNote, $deliveryNoteLines, $orderLines, $total);
            }
        }

        /**
         * Modifica los datos de un albarán
         * 
         * @param array $data
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            if(isset($data['ID'])){
                $data['ID'] = cleanStr($data['ID']);
            }
            if(isset($data['number'])){
                $data['number'] = cleanStr($data['number']);
            }
            if(isset($data['date'])){
                $data['date'] = cleanStr($data['date']);
            }
            if(isset($data['inAgreement'])){
                $data['inAgreement'] = cleanStr($data['inAgreement']);
            }
            if(isset($data['nonconformityDescription'])){
                $data['nonconformityDescription'] = cleanStr($data['nonconformityDescription']);
            }
            if(isset($data['nonconformitySolution'])){
                $data['nonconformitySolution'] = cleanStr($data['nonconformitySolution']);
            }
            if(isset($data['deceasedInID'])){
                $data['deceasedInID'] = cleanStr($data['deceasedInID']);
            }
            
            $id = $data['ID'];
            $number = $data['number'];
            $date = $data['date'];
            $inAgreement = $data['inAgreement'] == '-' ? 'null' : $data['inAgreement'];
            $nonconformityDescription = $data['nonconformityDescription'];
            $nonconformitySolution = $data['nonconformitySolution'];
            $notes = $data['notes'];

            $db->query("UPDATE  DeliveryNotes dn
                        SET     dn.number = '$number',
                                dn.date = $date,
                                dn.inAgreement = $inAgreement,
                                dn.nonconformityDescription = '$nonconformityDescription',
                                dn.nonconformitySolution = '$nonconformitySolution',
                                dn.notes = '$notes'
                        WHERE   dn.ID = $id");


            if(isset($data['lines'])){
                require_once($_SESSION['basePath'] . "model/stock.php");

                $stock = new Stock;

                $deliveryPlace = $data['deliveryPlace'];
                $lines = $data['lines'];

                $closeDeliveryNote = true;
                foreach($lines as $line){
                    $line[0] = cleanStr($line[0]);
                    $line[1] = cleanStr($line[1]);
                    $line[2] = cleanStr($line[2]);
                    $line[3] = cleanStr($line[3]);
                    $line[4] = cleanStr($line[4]);
                    $line[5] = cleanStr($line[5]);
                    $line[6] = cleanStr($line[6]);

                    $lineId = $line[0];
                    $model = $line[1];
                    $price = $line[2];
                    $receivedAmount = $line[3];
                    $pendingAmount = $line[4];
                    $canceled = $line[5];
                    $discount = $line[6];

                    $result = $db->query("  SELECT  dnl.receivedAmount
                                            FROM    DeliveryNotes_Lines dnl
                                            WHERE   dnl.ID = $lineId");

                    $previousAmount = $db->resultToArray($result)[0]['receivedAmount'];

                    $db->query("UPDATE  DeliveryNotes_Lines dnl
                                SET     dnl.price = $price,
                                        dnl.receivedAmount = $receivedAmount,
                                        dnl.pendingAmount =  $pendingAmount,
                                        dnl.canceled = $canceled,
                                        dnl.discount = $discount
                                WHERE   dnl.ID = $lineId");
                    
                    if($deliveryPlace != ''){
                        $stock->addStock($deliveryPlace, $model, ($receivedAmount - $previousAmount));
                    }

                    $result = $db->query("  SELECT  dnl.receivedAmount, dnl.pendingAmount, dnl.canceled
                                            FROM    DeliveryNotes_Lines dnl
                                            WHERE   dnl.ID = $lineId");

                    $amounts = $db->resultToArray($result)[0];

                    if($amounts['pendingAmount'] > 0 && $amounts['canceled'] == 0){
                        $closeDeliveryNote = false;
                    }
                }

                if($closeDeliveryNote){
                    $db->query("UPDATE  DeliveryNotes dn
                                SET     dn.received = 1
                                WHERE   dn.ID = $id");
                }
            }
            return true;
        }

         /**
         * Modifica los datos de un albarán
         * 
         * @param array $data
         * @return bool
         */
        public function updateGasoil($data){
            $db = new DbHandler;

            if(isset($data[''])){
                $data['ID'] = cleanStr($data['ID']);
            }
            if(isset($data[''])){
                $data['number'] = cleanStr($data['number']);
            }
            if(isset($data[''])){
                $data['date'] = cleanStr($data['date']);
            }
            if(isset($data[''])){
                $data['inAgreement'] = cleanStr($data['inAgreement']);
            }
            if(isset($data[''])){
                $data['nonconformityDescription'] = cleanStr($data['nonconformityDescription']);
            }
            if(isset($data[''])){
                $data['nonconformitySolution'] = cleanStr($data['nonconformitySolution']);
            }
            if(isset($data[''])){
                $data['deceasedInID'] = cleanStr($data['deceasedInID']);
            }
            
            $id = $data['ID'];
            $number = $data['number'];
            $date = $data['date'];
            $inAgreement = $data['inAgreement'] == '-' ? 'null' : $data['inAgreement'];
            $nonconformityDescription = $data['nonconformityDescription'];
            $nonconformitySolution = $data['nonconformitySolution'];
            $notes = $data['notes'];

            $result = $db->query("  SELECT  g.litres
                                    FROM    DeliveryNotes dn, Orders o, Gasoil g
                                    WHERE   dn.order = o.ID AND o.gasoil = g.gasoilID
                                            AND dn.ID = $id");

            $litres = $db->resultToArray($result)[0]['litres'];

            if(floatval($data['litresReceived']) >= floatval($litres)){
                $received = 1;
            }else{
                $received = 0;
            }

            $survey = $db->query("UPDATE  DeliveryNotes dn
                        SET     dn.number = '$number',
                                dn.date = $date,
                                dn.received = $received,
                                dn.inAgreement = $inAgreement,
                                dn.nonconformityDescription = '$nonconformityDescription',
                                dn.nonconformitySolution = '$nonconformitySolution',
                                dn.notes = '$notes'
                        WHERE   dn.ID = $id");

            if($survey){

                $data['litresReceived'] = cleanStr($data['litresReceived']);
                $data['priceLiter'] = cleanStr($data['priceLiter']);
                $data['net'] = cleanStr($data['net']);
                $data['total'] = cleanStr($data['total']);

                $litresReceived = $data['litresReceived'];
                $priceLiter = $data['priceLiter'];
                $net = $data['net'];
                $total = $data['total'];
  
                return $db->query("UPDATE   DeliveryNotes_Lines_Gasoil dlg
                                    SET     dlg.litresReceived = $litresReceived,
                                            dlg.priceLiter = $priceLiter,
                                            dlg.neto = '$net',
                                            dlg.total = '$total'
                                    WHERE   dlg.deliveryNote = $id");
            }
        }

        /**
         * Obtiene los datos de una linea de albarán para gasoil
         * 
         * @param array $data
         * 
         * @return array
         */
        public function readGasoilLines($data){
            $db = new DbHandler;

            if(isset($data['ID'])){
                $data = cleanStr($data['ID']);
            } else{
                $data = cleanStr($data); 
            }

            $result = $db->query("  SELECT  dlg.*, g.litres as litersRequest, it.name as ivaName
                                    FROM    DeliveryNotes_Lines_Gasoil dlg, DeliveryNotes dn, Orders o, Gasoil g, IVA_Types as it
                                    WHERE   g.gasoilID = o.gasoil
                                        AND o.ID = dn.order 
                                        AND dn.ID = dlg.deliveryNote 
                                        AND dlg.iva = it.IvaTypeID
                                        AND dlg.deliveryNote = " . $data . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Obtiene el total del albarán
         *
         * @param int $id Id de la línea de albarán
         * @return array
         */
        public function getDeliveryNotesLinesPending($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  dnlp.*
                                    FROM    DeliveryNotes_Lines_Pending dnlp
                                    WHERE   dnlp.deliveryNoteLine = $id");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Añade entregas pendientes en una línea de albarán
         * 
         * @param array $lines Entregas
         * @return bool
         */
        public function addPending($lines, $receivedAmount, $pendingAmount){
            $db = new DbHandler;

            $receivedAmount = cleanStr($receivedAmount);
            $pendingAmount = cleanStr($pendingAmount);

            $received = $receivedAmount;
            $pending = $pendingAmount;

            foreach($lines as $line){
                $deliveryNoteLine = $line[1];
                $date = $line[2];
                $amount = $line[3];

                $db->query("INSERT INTO DeliveryNotes_Lines_Pending(deliveryNoteLine, amount, date)
                            VALUES ($deliveryNoteLine, $amount, $date)");

                $received += $amount;
                $pending -= $amount;
            }

            if($pending < 0){
                $pending = 0;
            }

            return array($pending, $received);
        }

        /**
         * Genera una factura de un albarán
         *
         * @param int $id Id del albarán
         * @return array
         */
        public function genInvoice($id){
            require_once($_SESSION['basePath'] . "model/expenses.php");

            $id = cleanStr($id);
            
            $db = new DbHandler;
            $expenses = new Expenses;

            $result = $db->query("  SELECT  dn.ID, dn.date, dn.number,
                                            o.supplier, o.deliveryPlace
                                    FROM    DeliveryNotes dn, Orders o
                                    WHERE   dn.ID = $id AND
                                            dn.order = o.ID");

            $deliveryNote = $db->resultToArray($result)[0];

            $result = $db->query("  SELECT  ROUND(SUM((dnl.receivedAmount - dnl.hasInvoice) * dnl.price)) as total
                                    FROM    DeliveryNotes_Lines dnl, DeliveryNotes dn
                                    WHERE   dnl.deliveryNote = dn.ID AND
                                            dn.ID = $id");

            $total = $db->resultToArray($result)[0]['total'];

            if($total == 0){
                return false;
            }else{
                if($deliveryNote['deliveryPlace'] == null){
                    $deliveryPlace = 'null';
                }else{
                    $deliveryPlace = $deliveryNote['deliveryPlace'];
                }

                $data = array(  
                    'bankAccount' => 'null',
                    'creditCard' => 'null',
                    'expenseFixed' => 'null',
                    'expenseVariable' => 'null',
                    'costCenter' => $deliveryPlace,
                    'supplier' => $deliveryNote['supplier'],
                    'deliveryNote' => $id,
                    'date' => $deliveryNote['date'],
                    'dueDate' => 'null',
                    'paymentDate' => 'null',
                    'shipper' => null,
                    'nif' => null,
                    'taxBase' => 'null',
                    'withholding' => 'null',
                    'feeHoldIva' => 'null',
                    'supplied' => 'null',
                    'total' => $total,
                    'paymentMethod' => 'null',
                    'expenseType' => 'null',
                    'cashOut' => 'null',
                    'concept' => null,
                    'comments' => null,
                    'regularity' => 'null',
                    'invoiceNumber' => $deliveryNote['number']
                );
    
                $expenses->createReceivedInvoice($data);

                $db->query("UPDATE  DeliveryNotes_Lines dnl
                            SET     dnl.hasInvoice = dnl.receivedAmount
                            WHERE   deliveryNote = $id");
            }

            return true;
        }

        /**
         * Modifica la cantidad facturada para adecuarla a la cantidad recibida
         * 
         * @param int $deliveryNote Id del albarán
         * @return bool
         */
        function updateHasInvoice($deliveryNote){
            $db = new DbHandler;

            $deliveryNote = cleanStr($deliveryNote);

            return $db->query(" UPDATE  DeliveryNotes_Lines dnl
                                SET     dnl.hasInvoice = dnl.receivedAmount
                                WHERE   deliveryNote = $deliveryNote");
        }

        /**
         * Elimina un albarán
         * 
         * @param array $data
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  DeliveryNotes
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Obtiene el precio de compra de un modelo
         * 
         * @param array $data
         * 
         * @return array
         */
        public function getPurchasePrice($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  purchasePrice
                                    FROM    Products_Retails
                                    WHERE   model = " . $data . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Obtiene el total del albarán
         * 
         * @param array $data
         * 
         * @return array
         */
        public function getTotal($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  (SUM(dnl.amount * (dnl.price - dnl.discount * dnl.price/100))) as total,
                                            (SUM(dnl.receivedAmount * (dnl.price - dnl.discount * dnl.price/100))) as totalReceived
                                    FROM    DeliveryNotes dn, DeliveryNotes_Lines dnl
                                    WHERE   dn.ID = dnl.deliveryNote 
                                        AND dn.ID = $data");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Obtiene el total del albarán
         * 
         * @param array $data
         * 
         * @return array
         */
        public function getTotalGasoil($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  g.total, dnl.total as totalReceived        
                                    FROM    Gasoil g, DeliveryNotes_Lines_Gasoil dnl, DeliveryNotes as dn, Orders o
                                    WHERE   dn.ID = dnl.deliveryNote 
                                        AND o.gasoil = g.gasoilID 
                                        AND  dn.ID =  $data");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /* ******************************** Líneas de albarán ******************************** */
        /**
         * Crea una nueva línea de albarán
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function createLine($data){
            $db = new DbHandler;

            $data['deliveryNote'] = cleanStr($data['deliveryNote']);
            $data['product'] = cleanStr($data['product']);
            $data['model'] = cleanStr($data['model']);
            $data['amount'] = cleanStr($data['amount']);

            $result = $db->query("  INSERT INTO DeliveryNotes_Lines(deliveryNote, product, model, amount)
                                    VALUES(" . $data['deliveryNote'] . ", " . $data['product'] . ",
                                            " . $data['model'] . ", " . $data['amount'] . ")");

            if($result){
                // Modifica el producto del stock
                $result = $db->query("  SELECT  currentStock
                                        FROM    Stock
                                        WHERE   model = " . $data['model'] . "");

                $currentStock = $db->resultToArray($result)[0]['currentStock'];
                
                require_once($_SESSION['basePath'] . "model/stock.php");
                $stock = new Stock;
                return $stock->update(array('model' => $data['model'], 'amount' => ($data['amount'] + $currentStock)));
            }
        }

        /**
         * Obtiene los datos de una línea de albarán
         * 
         * @param array $data
         * 
         * @return array
         */
        public function readLine($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  dnl.ID, p.productID, p.name as productName, pm.productModelID,pm.name as productModelName, pr.purchasePrice, dnl.amount,
                                            dnl.amount * pr.purchasePrice as costNoIVA, 
                                            dnl.amount * (pr.purchasePrice + pr.purchasePrice * it.percentage / 100) as IVA,
                                            dnl.amount * pr.purchasePrice + (pr.purchasePrice + pr.purchasePrice * it.percentage / 100) as total
                                    FROM    DeliveryNotes_Lines dnl, Products p, Products_Models pm, Products_Retails pr, IVA_Types it
                                    WHERE   dnl.ID = " . $data['ID'] . " AND
                                            dnl.product = p.productID AND
                                            pm.product = p.productID AND
                                            pr.model = pm.productModelID AND
                                            p.IVA = it.IVATypeID AND 
                                            pm.productModelID = dnl.model");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Modifica los datos de una línea de albarán
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateLine($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['product'] = cleanStr($data['product']);
            $data['model'] = cleanStr($data['model']);
            $data['amount'] = cleanStr($data['amount']);

            $result = $db->query("  SELECT  amount
                                    FROM    DeliveryNotes_Lines
                                    WHERE   ID = " . $data['ID'] . "");

            $oldAmount = $db->resultToArray($result)[0]['amount'];

            $result = $db->query("  UPDATE  DeliveryNotes_Lines
                                    SET     product = " . $data['product'] . ",
                                            model = " . $data['model'] . ",
                                            amount = " . $data['amount'] . "
                                    WHERE   ID = " . $data['ID'] . "");

            if($result){
                // Modifica el producto del stock
                $result = $db->query("  SELECT  currentStock
                                        FROM    Stock
                                        WHERE   model = " . $data['model'] . "");

                $currentStock = $db->resultToArray($result)[0]['currentStock'];

                $newStock = $currentStock - $oldAmount + $data['amount'];
                
                require_once($_SESSION['basePath'] . "model/stock.php");
                $stock = new Stock;
                return $stock->update(array('model' => $data['model'], 'amount' => $newStock));
            }
        }

        /**
         * Elimina una línea de albarán
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function deleteLine($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            // Modifica el producto del stock
            $result = $db->query("  SELECT  amount, model
                                    FROM    DeliveryNotes_Lines
                                    WHERE   ID = " . $data['ID']);

            $result = $db->resultToArray($result)[0];

            $oldAmount = $result['amount'];
            $model = $result['model'];

            $result = $db->query("  SELECT  currentStock
                                    FROM    Stock
                                    WHERE   model = " . $model);

            $currentStock = $db->resultToArray($result)[0]['currentStock'];

            $newStock = $currentStock - $oldAmount;
            
            require_once($_SESSION['basePath'] . "model/stock.php");

            $stock = new Stock;

            return $stock->update(array('model' => $model, 'amount' => $newStock));
        }

        /**
         * Elimina todas las líneas de un albarán
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function deleteAllLines($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            return $db->query(" DELETE FROM DeliveryNotes_Lines WHERE deliveryNote = " . $data);
        }

        /**
         * Obtiene las líneas de albarán
         * 
         * @param array ID del albarán
         * @return array Las líneas de albarán
         */
        public function listLines($data){
            $db = new DbHandler;

            $data['deliveryNoteID'] = cleanStr($data['deliveryNoteID']);

            $date = $db->query("    SELECT  date
                                    FROM    DeliveryNotes
                                    WHERE   ID = " . $data['deliveryNoteID']);

            $date = $db->resultToArray($date)[0]['date'];
            $year = date('Y', $date);

            $result = $db->query("  SELECT  dl.ID, dl.product, dl.model, dl.amount,
                                            pr.purchasePrice,
                                            p.name as productName, pm.name as productModelName,
                                            dl.amount * pr.purchasePrice as cost,
                                            dl.amount * (pr.purchasePrice * it.percentage / 100) as iva,
                                            dl.amount * pr.purchasePrice + dl.amount * (pr.purchasePrice * it.percentage / 100) as subtotal,
                                            o.status
                                    FROM    DeliveryNotes_Lines dl, Products_Retails pr, Products p, IVA_Types it, Products_Models pm, DeliveryNotes dn, Orders o
                                    WHERE   dl.deliveryNote = " . $data['deliveryNoteID'] . " AND
                                            pr.model = dl.model AND
                                            pr.year = $year AND
                                            dl.product = p.productID AND
                                            p.IVA = it.IVATypeID AND
                                            pm.productModelID = dl.model AND
                                            dl.deliveryNote = dn.ID AND
                                            dn.order = o.ID");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Modifica las fechas de recibido de un producto
         * 
         * @param array Línea de producto con la fecha de recibido y la cantidad
         * @return bool
         */
        public function updateLineReceived($data){
            $db = new DbHandler;

            if(count($data) > 0){
                foreach($data as $elem){
                    $elem[0] = cleanStr($elem[0]);
                    $elem[1] = cleanStr($elem[1]);
                    $elem[2] = cleanStr($elem[2]);
                    $elem[3] = cleanStr($elem[3]);
                    $elem[4] = cleanStr($elem[4]);
                    
                    require_once($_SESSION['basePath'] . "model/stock.php");
                    $stock = new Stock;

                    if($elem[0] == ""){
                        $db->query("INSERT INTO DeliveryNotes_Lines_Checked(deliveryNoteLine, received, date)
                                    VALUES ($elem[1], $elem[2], $elem[3])");

                        $currentStock = $stock->read($elem[4]);
                        $stock->update(array("amount" => $elem[2] + $currentStock, "model" => $elem[4]));
                    }else{
                        $oldReceived = $db->query(" SELECT  received
                                                    FROM    DeliveryNotes_Lines_Checked
                                                    WHERE   ID = $elem[0]");

                        $oldReceived = $db->resultToArray($oldReceived)[0]['received'];

                        $db->query("UPDATE  DeliveryNotes_Lines_Checked
                                    SET     received = $elem[2],
                                            date = $elem[3]
                                    WHERE   ID = $elem[0]");

                        $currentStock = $stock->read($elem[4]);
                        $stock->update(array("amount" => $elem[2] - $oldReceived + $currentStock, "model" => $elem[4]));
                    }
                }
            }

            return true;
        }

        /**
         * Obtiene las fechas y la cantidad de recibido de un producto
         * 
         * @param array Línea de albarán
         * @return array Datos de recibido
         */
        public function listLineReceived($data){
            $db = new DbHandler;

            $data['lineID'] = cleanStr($data['lineID']);

            $result = $db->query("  SELECT  *
                                    FROM    DeliveryNotes_Lines_Checked
                                    WHERE   deliveryNoteLine = " . $data['lineID']);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los datos del albarán para almacenarlos en lfa factura
         * 
         * @param int $deliveryNote Id del albarán
         * @return array
         */
        public function getDataInvoice($deliveryNote){
            $db = new DbHandler;

            $deliveryNote = cleanStr($deliveryNote);

            $result = $db->query("  SELECT	(dnl.receivedAmount - dnl.hasInvoice) as amount, dnl.price, it.percentage as iva
                                    FROM	DeliveryNotes_Lines dnl, Products_Models pm, Products p, IVA_Types it
                                    WHERE	dnl.deliveryNote = $deliveryNote AND
                                            dnl.model = pm.productModelID AND
                                            pm.product = p.productID AND
                                            p.IVA = it.IVATypeID");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los datos del albarán para almacenarlos en lfa factura
         * 
         * @param int $deliveryNote Id del albarán
         * @return array
         */
        public function getDataInvoiceDelivery($deliveryNote){
            $db = new DbHandler;

            $deliveryNote = cleanStr($deliveryNote);

            $result = $db->query("  SELECT	p.productID as productID, pm.productModelID as modelID, p.name as product, pm.name as model, (dnl.receivedAmount - dnl.hasInvoice) as amount, dnl.price, it.percentage as iva, dnl.discount
                                    FROM	DeliveryNotes_Lines dnl, Products_Models pm, Products p, IVA_Types it
                                    WHERE	dnl.deliveryNote = $deliveryNote AND
                                            dnl.model = pm.productModelID AND
                                            pm.product = p.productID AND
                                            p.IVA = it.IVATypeID");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los datos del albarán (Gasoil) para almacenarlos en lfa factura
         * 
         * @param int $deliveryNote Id del albarán
         * @return array
         */
        public function getDataInvoiceDeliveryGasoil($deliveryNote){
            $db = new DbHandler;

            $deliveryNote = cleanStr($deliveryNote);

            $result = $db->query("  SELECT	p.productID as productID, pm.productModelID as modelID, p.name as product, pm.name as model, (dnl.receivedAmount - dnl.hasInvoice) as amount, dnl.price, it.percentage as iva 
                                    FROM	DeliveryNotes_Lines dnl, Products_Models pm, Products p, IVA_Types it
                                    WHERE	dnl.deliveryNote = $deliveryNote AND
                                            dnl.model = pm.productModelID AND
                                            pm.product = p.productID AND
                                            p.IVA = it.IVATypeID");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los proveedores que cuyos albaranes están en estado "no conforme"
         * 
         * @param string $name Nombre
         * @return array
         */
        public function getSuppliersNoAgreement($name){
            $db = new DbHandler;

            $name = cleanStr($name);

            $result = $db->query("  SELECT      s.supplierID, s.name
                                    FROM        Suppliers s, Orders o, DeliveryNotes dn
                                    WHERE       s.leavingDate IS NULL AND
                                                s.name LIKE '%". $name ."%' AND
                                                s.supplierID = o.supplier AND
                                                o.ID = dn.order AND
                                                dn.leavingDate IS NULL AND
                                                dn.inAgreement = 0
                                    GROUP BY    s.supplierID");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /*
        * Obtiene los albaranes para el datatables
        *
        * @return array
        */
        public function listDeliveryNotesDatatables(){
            $db = new DbHandler;
    
            $result = $db->query("  SELECT      g.ID, g.number, g.date, s.name, s.name, g.received, g.inAgreement
                                    FROM        DeliveryNotes g
                                    LEFT JOIN   Orders o ON g.order = o.ID
                                    LEFT JOIN   Suppliers s ON o.supplier = s.supplierID
                                    WHERE       g.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
                return array();
            }else{
                $data = $db->resultToArrayValue($result);

                $deliveryNotes = new DeliveryNotes();
                foreach($data as $index => $elem){
                    $deliveryData = $deliveryNotes->getTotal($elem[0]);
                
                    if($deliveryData["total"] == NULL){
                        $data[$index][4] = $deliveryNotes->getTotalGasoil($elem[0]);
                    }else{
                        $data[$index][4] = $deliveryData;
                    }
                }
                return $data;
            }
        }

        /**
        * Obtiene el listado de acciones correctivas para albaranes
        *
        * @return array
        */
        public function listActionsCorrectivesDatatables($where){
            $db = new DbHandler;
    
            $result = $db->query("  SELECT      g.ID, g.date, g.number, s.name, s.name, g.received, g.inAgreement
                                    FROM        DeliveryNotes g
                                    LEFT JOIN   Orders o ON g.order = o.ID
                                    LEFT JOIN   Suppliers s ON o.supplier = s.supplierID
                                    WHERE       g.leavingDate IS NULL AND g.inAgreement = 0 $where");
            
            if(mysqli_num_rows($result) == 0){
                return array();
            }else{
                return $db->resultToArrayValue($result);
            }
        }
    }
?>