<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Orders{

        /**
         * Comprueba si un pedido existe
         * 
         * @param int $order Id del pedido
         * @return bool
         */
        public function existsOrder($order){
            $db = new DbHandler;

            $order = cleanStr($order);

            $result = $db->query("  SELECT  o.ID
                                    FROM    Orders o
                                    WHERE   o.ID = $order AND
                                            o.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? false : true;
        }

        /**
         * Crea un nuevo pedido
         * 
         * @param array $data
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['supplier'] = cleanStr($data['supplier']);
            $data['expedient'] = cleanStr($data['expedient']);
            $data['deliveryPlace'] = cleanStr($data['deliveryPlace']);
            $data['type'] = cleanStr($data['type']);
            $data['date'] = cleanStr($data['date']);
            $data['deliveryPlaceOther'] = cleanStr($data['deliveryPlaceOther']);
            $data['deliveryDate'] = cleanStr($data['deliveryDate']);
            $data['notes'] = cleanEditor($data['notes']);

            if(isset($data['deceasedRoom'])){
                $data['deceasedRoom'] = cleanStr($data['deceasedRoom']);
            }
           
            // Calculate extraID
            $result = $db->query("  SELECT  MAX(ID) as id
                                    FROM    Orders");
            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 2);
            $extraID .= ($maxID+1);

            $supplier = $data['supplier'];
            $expedient = $data['expedient'] == '' ? 'null' : $data['expedient'];
            $deliveryPlace = $data['deliveryPlace'] == 0 || $data['deliveryPlace'] == '' || $data['deliveryPlace'] == null ? 'null': $data['deliveryPlace'];
            
            $sendTo = 'null';

            $type = $data['type'];
            $date = $data['date'];
            $otherDeliveryPlace = $data['deliveryPlaceOther'];
            $deliveryDate = $data['deliveryDate'] == 0 ? 'null': $data['deliveryDate'];
            $notes = $data['notes'];
            $sendCopy = null;
            $leavingDate = 'null';
            
            $deceasedRoom = isset($data['deceasedRoom']) ? "'" . $data['deceasedRoom'] . "'" : 'null';

            if(isset($data['expedient']) && $data['expedient'] != null && $data['expedient'] != ''){
                $result = $db->query("      SELECT  e.deceasedMortuary
                                            FROM    Expedients e
                                            WHERE   e.expedientID = " .$data['expedient']);

                if(mysqli_num_rows($result) > 0){
                    $deliveryPlace = $db->resultToArray($result)[0]['deceasedMortuary'];
                }else{
                    $deliveryPlace = 'null';
                }
            }else{
                $result = $db->query("  SELECT  c.ID 
                                        FROM    Cost_Center c
                                        WHERE   c.mortuary = $deliveryPlace");
                if(mysqli_num_rows($result) > 0){
                    $deliveryPlace = $db->resultToArray($result)[0]['ID'];
                }else{
                    $result = $db->query("  SELECT  c.ID 
                                            FROM    Cost_Center c
                                            WHERE   c.warehousePpal = 1");
    
                    $deliveryPlace = $db->resultToArray($result)[0]['ID'];
                }
            }
            if($deliveryPlace == null){
                return 'deliveryPlace';
            }

            $db->query("INSERT INTO Orders( supplier, expedient, deliveryPlace, sendTo, type, date,
                            otherDeliveryPlace, deliveryDate, notes, sendCopy, leavingDate, extraID, deceasedRoom)
                        VALUES ($supplier, $expedient, $deliveryPlace, $sendTo, $type, $date,
                                '$otherDeliveryPlace', $deliveryDate, '$notes', '$sendCopy', $leavingDate, '$extraID', $deceasedRoom)");

            $order = $db->query("   SELECT  o.ID
                                    FROM    Orders o
                                    WHERE   o.extraID = '$extraID'");

            if(mysqli_num_rows($order) == 0){
                return false;
            }else{
                $order = $db->resultToArray($order)[0]['ID'];

                if(isset($data['preOrder'])){
                    $data['preOrder'] = cleanStr($data['preOrder']);
                    $preOrder = $data['preOrder'];

                    $maxNumHiring = $this->getActiveHiring($expedient);

                    $db->query("UPDATE  Pre_Orders po
                                SET     po.order = $order
                                WHERE   ID = $preOrder");

                    $result = $db->query("  SELECT  eh.ID
                                            FROM    Expedients_Hirings eh
                                            WHERE   eh.expedient = $expedient AND
                                                    eh.supplier = $supplier AND
                                                    eh.num_hiring = $maxNumHiring
                    ");

                    if(mysqli_num_rows($result) > 0){
                        $hirings = $db->resultToArray($result);

                        foreach($hirings as $hiring){
                            $db->query("UPDATE  Pre_Orders po
                                        SET     po.order = $order
                                        WHERE   po.hiring = " . $hiring['ID'] . " AND
                                                po.leavingDate IS NULL
                            ");
                        }
                    }
                }

                $lines = isset($data['lines']) ? $data['lines'] : null;

                if($lines != null){
                    $toDeliveryNote = array();
                    foreach($lines as $line){
                        $line[0] = cleanStr($line[0]);
                        $line[1] = cleanStr($line[1]);
                        $line[2] = cleanStr($line[2]);

                        $model = $line[0];
                        $amount = $line[1];
                        $price = $line[2];

                        $db->query("INSERT INTO Orders_Lines(`order`, model, amount, price)
                                    VALUES ($order, $model, $amount, $price)");

                        $lastPurchase = $db->query("SELECT  olp.ID
                                                    FROM    Orders_Last_Purchases olp
                                                    WHERE   olp.model = $model");
                        
                        if(mysqli_num_rows($lastPurchase) == 0){
                            $db->query("INSERT INTO Orders_Last_Purchases(model, amount, price, date)
                                        VALUES ($model, $amount, $price, $date)");
                        }else{
                            $db->query("UPDATE  Orders_Last_Purchases
                                        SET     amount = $amount,
                                                price = $price,
                                                date = $date
                                        WHERE   model = $model");
                        }
                        
                        $result = $db->query("  SELECT  p.productID
                                                FROM    Products_Models pm, Products p
                                                WHERE   pm.product = p.productID AND
                                                        (p.type = 2 OR p.type = 4) AND
                                                        pm.productModelID = $model");

                        if(mysqli_num_rows($result) > 0){
                            array_push($toDeliveryNote, array($model, $amount, $price));
                        }
                    }
                }

                if(isset($toDeliveryNote) && count($toDeliveryNote) > 0){
                    require_once($_SESSION['basePath'] . 'model/deliveryNotes.php');
                    $deliveryNotes = new DeliveryNotes;
                    $deliveryNotes->create(array('order' => $order, 'date' => $date, 'lines' => $toDeliveryNote));
                }

                return $order;
            }
        }

        /**
         * Obtiene los datos de un pedido
         * 
         * @param int $order Id del pedido
         * @return array
         */
        public function read($order){
            $db = new DbHandler;

            $order = cleanStr($order);

            $result = $db->query("  SELECT DISTINCT o.*,  m1.name as deliveryPlaceName,  e.deceasedMortuary, e.deceasedMortuaryAddress, m.name as mortuaryName,  dn.received, s.supplierID, s.name as supplierName, s.phones as supplierPhones, 
                                                    s.mail as supplierEmail, po.sentEmail, em.email as sendToEmail, e.number as expedientNumber, e.expedientID, e.tpv
                                    FROM            (Orders o, Suppliers s)                                  
                                    LEFT JOIN       DeliveryNotes dn ON dn.order = o.ID
                                    LEFT JOIN       Pre_Orders po ON o.ID = po.order AND po.leavingDate IS NULL
                                    LEFT JOIN       Emails em ON o.sendTo = em.ID
                                    LEFT JOIN       Expedients e ON o.expedient = e.expedientID
                                    LEFT JOIN       Mortuaries m ON e.deceasedMortuary = m.mortuaryID
                                    LEFT JOIN       Mortuaries m1 ON o.deliveryPlace = m1.mortuaryID
                                    WHERE           o.ID = $order 
                                        AND         o.supplier = s.supplierID");
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                $orderData = $db->resultToArray($result)[0];
                $result = $db->query("  SELECT      ol.*,
                                                    olp.amount as lastPurchaseAmount, olp.price as lastPurchasePrice, olp.date as lastPurchaseDate,
                                                    p.productID, p.name as productName,
                                                    pm.name as modelName, pm.supplierReference, pm.productModelID, o.expedient
                                        FROM        (Orders_Lines ol, Products p, Products_Models pm, Orders o)
                                        LEFT JOIN   Orders_Last_Purchases olp ON ol.model = olp.model
                                        WHERE       ol.order = $order AND
                                                    ol.order = o.ID AND
                                                    ol.model = pm.productModelID AND
                                                    pm.product = p.productID");

                if(mysqli_num_rows($result) == 0){
                    return array($orderData, null);
                }else{
                    $lines = $db->resultToArray($result);
                    $i = 0;
                    $currentHiringID = array();
                    foreach($lines as $key => $value){
                        if(strlen($value['expedient'] > 0)){
                            $where = '';
                            if(count($currentHiringID) > 0){
                                $whereIn = implode(',', $currentHiringID);
                                $where .= " AND eh.ID NOT IN ($whereIn)";
                            }

                            $maxNumHiring = $this->getActiveHiring($value['expedient']);

                            $hiring = $db->query("  SELECT  eh.ID
                                                    FROM    Expedients_Hirings eh
                                                    WHERE   eh.model = " . $value['productModelID'] . " AND
                                                            eh.num_hiring = $maxNumHiring AND
                                                            eh.expedient = " . $value['expedient'] . " $where");

                            if(mysqli_num_rows($hiring) > 0){
                                $hiring = $db->resultToArray($hiring)[0]['ID'];
                                array_push($currentHiringID, $hiring);

                                $texts =  $db->query("  SELECT  et.value
                                                        FROM    Expedients_Texts et
                                                        WHERE   et.hiring = $hiring");
                                                    
                                if(mysqli_num_rows($texts) > 0){
                                    $lines[$i]['texts'] = $db->resultToArray($texts);
                                }else{
                                    $lines[$i]['texts'] = '';
                                }
                                $i++;
                            }
                        }
                    }
                    $orderLines = mysqli_num_rows($result) == 0 ? null : $lines;
                    return array($orderData, $orderLines);
                }
            }
        }

        /**
         * Modifica los datos de un pedido
         * 
         * @param array $data
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['id'] = cleanStr($data['id']);
            $data['type'] = cleanStr($data['type']);
            $data['expedient'] = cleanStr($data['expedient']);
            $data['date'] = cleanStr($data['date']);
            $data['supplier'] = cleanStr($data['supplier']);
            $data['deliveryPlace'] = cleanStr($data['deliveryPlace']);
            $data['deliveryPlaceOther'] = cleanStr($data['deliveryPlaceOther']);
            $data['deliveryDate'] = cleanStr($data['deliveryDate']);
            $data['inAgreement'] = cleanStr($data['inAgreement']);
            $data['nonApproval'] = cleanEditor($data['nonApproval']);
            $data['correctiveAction'] = cleanEditor($data['correctiveAction']);
            $data['notes'] = cleanEditor($data['notes']);

            $id = $data['id'];
            $type = $data['type'];
            $expedient = $data['expedient'] == '' ? 'null' : $data['expedient'];
            $date = $data['date'];
            $supplier = $data['supplier'];
            $deliveryPlace = $data['deliveryPlace'] == 0 ? 'null' : $data['deliveryPlace'];
            $otherDeliveryPlace = $data['deliveryPlaceOther'];
            $deliveryDate = $data['deliveryDate'];
            $inAgreement = $data['inAgreement'];
            $nonApproval = $data['nonApproval'];
            $notes = $data['notes'];
            $correctiveAction = $data['correctiveAction'];

            if(isset($data['deceasedRoom'])){
                $data['deceasedRoom'] = cleanStr($data['deceasedRoom']);
                if($data['deceasedRoom'] == ''){
                    $deceasedRoom = 'null';
                }else{
                    $deceasedRoom = $data['deceasedRoom'];
                }
            }else{
                $deceasedRoom = 'null';
            }
            /*$sendTo = $data['sendTo'] == '' ? 'null' : $data['sendTo'];
            $sendCopy = $data['sendCopy'];*/

            if($otherDeliveryPlace == ''){
                $otherDeliveryPlace = 'null';
            }else{
                $otherDeliveryPlace = "'".$otherDeliveryPlace. "'";
            }

            $db->query("UPDATE  Orders
                        SET     type = $type,
                                expedient = $expedient,
                                date = $date,
                                supplier = $supplier,
                                deliveryPlace = $deliveryPlace,
                                otherDeliveryPlace = $otherDeliveryPlace,
                                deceasedRoom = '$deceasedRoom',
                                deliveryDate = $deliveryDate,                               
                                notes = '$notes',
                                inAgreement = $inAgreement,
                                nonApproval = '$nonApproval',
                                correctiveAction = '$correctiveAction'
                        WHERE   ID = $id");


            $result = $db->query("  SELECT  dn.ID
                                    FROM    DeliveryNotes dn
                                    WHERE   dn.order = $id");

            $deliveryNoteId = mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['ID'];

         
            if($data["gasoilID"] == null || $data["gasoilID"] == ''){
                if(isset($data['lines'])){
                    $lines = $data['lines'];
        
                    foreach($lines as $line){
                        $line[0] = cleanStr($line[0]);
                        $line[1] = cleanStr($line[1]);
                        $line[2] = cleanStr($line[2]);
                        $line[3] = cleanStr($line[3]);

                        $lineId = $line[0];
                        $model = $line[1];
                        $amount = $line[2];
                        $price = $line[3];

                        if($lineId == ''){
                            $db->query("INSERT INTO Orders_Lines(`order`, model, amount, price)
                                        VALUES ($id, $model, $amount, $price)");

                            $result = $db->query("  SELECT  p.type
                                                    FROM    Products p, Products_Models pm
                                                    WHERE   pm.product = p.productID AND
                                                            pm.productModelID = $model");
                                                        
                            $productType = $db->resultToArray($result)[0]['type'];

                            if($productType == 2){
                                if($deliveryNoteId == null){
                                    $dnNumber = 'null';
                                    $dnDate = $date;
                                    $dnNotes = null;
                                    $dnInAgreement = 'null';
                                    $dnReceived = 0;
                                    $dnNonconformityDescription = null;
                                    $dnNonconformitySolution = null;
                                    $leavingDate = 'null';

                                    // Calculate extraID
                                    $result = $db->query("  SELECT  MAX(ID) as id
                                                            FROM    DeliveryNotes");
                                    $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
                                    $dnExtraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 2);
                                    $dnExtraID .= ($maxID+1);
                                    
                                    $db->query("INSERT INTO DeliveryNotes(  `order`, number, date, notes, inAgreement, received, nonconformityDescription,
                                                                            nonconformitySolution, leavingDate, extraID)
                                                VALUES ($id, $dnNumber, $dnDate, '$dnNotes', $dnInAgreement, $dnReceived, '$dnNonconformityDescription',
                                                        '$dnNonconformitySolution', $leavingDate, '$dnExtraID')");

                                    $result = $db->query("  SELECT  dn.ID
                                                            FROM    DeliveryNotes dn
                                                            WHERE   dn.extraID = '$dnExtraID'");

                                    $deliveryNoteId = $db->resultToArray($result)[0]['ID'];
                                }
                                $db->query("INSERT INTO DeliveryNotes_Lines(deliveryNote, model, amount, price, receivedAmount, pendingAmount, canceled)
                                            VALUES ($deliveryNoteId, $model, $amount, $price, 0, $amount, 0)");
                            }

                        }else{
                            $db->query("UPDATE  Orders_Lines
                                        SET     model = $model,
                                                amount = $amount,
                                                price = $price
                                        WHERE   ID = $lineId");

                            $result = $db->query("  SELECT  p.type
                                                    FROM    Products p, Products_Models pm
                                                    WHERE   pm.product = p.productID AND
                                                            pm.productModelID = $model");
                                
                            $productType = $db->resultToArray($result)[0]['type'];

                            if($productType == 2){
                                if($deliveryNoteId == null){
                                    $dnNumber = 'null';
                                    $dnDate = $date;
                                    $dnNotes = null;
                                    $dnInAgreement = 'null';
                                    $dnReceived = 0;
                                    $dnNonconformityDescription = null;
                                    $dnNonconformitySolution = null;
                                    $leavingDate = 'null';

                                    // Calculate extraID
                                    $result = $db->query("  SELECT  MAX(ID) as id
                                                            FROM    DeliveryNotes");
                                    $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
                                    $dnExtraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 2);
                                    $dnExtraID .= ($maxID+1);
                                    
                                    $db->query("INSERT INTO DeliveryNotes(  `order`, number, date, notes, inAgreement, received, nonconformityDescription,
                                                                            nonconformitySolution, leavingDate, extraID)
                                                VALUES ($id, $dnNumber, $dnDate, '$dnNotes', $dnInAgreement, $dnReceived, '$dnNonconformityDescription',
                                                        '$dnNonconformitySolution', $leavingDate, '$dnExtraID')");

                                    $result = $db->query("  SELECT  dn.ID
                                                            FROM    DeliveryNotes dn
                                                            WHERE   dn.extraID = '$dnExtraID'");

                                    $deliveryNoteId = $db->resultToArray($result)[0]['ID'];

                                    $db->query("INSERT INTO DeliveryNotes_Lines(deliveryNote, model, amount, price, receivedAmount, pendingAmount, canceled)
                                                VALUES ($deliveryNoteId, $model, $amount, $price, 0, $amount, 0)");
                                }

                                $result = $db->query("  SELECT  dnl.ID, dnl.amount, dnl.pendingAmount
                                                        FROM    DeliveryNotes_Lines dnl, DeliveryNotes dn
                                                        WHERE   dn.ID = $deliveryNoteId AND
                                                                dnl.deliveryNote = dn.ID AND
                                                                dnl.model = $model");

                                if(mysqli_num_rows($result) == 0){
                                    $db->query("INSERT INTO DeliveryNotes_Lines(deliveryNote, model, amount, price, receivedAmount, pendingAmount, canceled)
                                                VALUES ($deliveryNoteId, $model, $amount, $price, 0, $amount, 0)");

                                    $result = $db->query("  SELECT  dnl.ID, dnl.amount, dnl.pendingAmount
                                                            FROM    DeliveryNotes_Lines dnl, DeliveryNotes dn
                                                            WHERE   dn.ID = $deliveryNoteId AND
                                                                    dnl.deliveryNote = dn.ID AND
                                                                    dnl.model = $model");
                                }

                                $deliveryNoteData = $db->resultToArray($result)[0];

                                $deliveryNoteLineId = $deliveryNoteData['ID'];
                                $oldAmount = $deliveryNoteData['amount'];
                                $oldPendingAmount = $deliveryNoteData['pendingAmount'];
                                $newPendingAmount = ($amount - $oldAmount) + $oldPendingAmount;
                                if($newPendingAmount < 0){
                                    $newPendingAmount = 0;
                                }

                                $db->query("UPDATE  DeliveryNotes_Lines dnl
                                            SET     dnl.amount = $amount,
                                                    dnl.price = $price,
                                                    dnl.pendingAmount = $newPendingAmount
                                            WHERE   dnl.ID = $deliveryNoteLineId");
                            }
                        }

                        $result = $db->query("  SELECT  olp.date
                                                FROM    Orders_Last_Purchases olp
                                                WHERE   olp.model = $model");

                        if(mysqli_num_rows($result) == 0){
                            $db->query("INSERT INTO Orders_Last_Purchases(model, amount, price, date)
                                        VALUES ($model, $amount, $price, $date)");
                        }else{
                            $lastPurchaseDate = $db->resultToArray($result)[0]['date'];
        
                            if($lastPurchaseDate < $date){
                                $db->query("UPDATE  Orders_Last_Purchases
                                            SET     amount = $amount,
                                                    price = $price,
                                                    date = $date
                                            WHERE   model = $model");
                            }
                        }
                    }
                }
            }

            if(isset($data['toDelete'])){
                $toDelete = $data['toDelete'];
                foreach($toDelete as $elem){
                    $elem = cleanStr($elem);
                    $result = $db->query("  SELECT  olp.date, o.date as orderDate, ol.model
                                            FROM    Orders_Last_Purchases olp, Orders_Lines ol, Orders o
                                            WHERE   olp.model = ol.model AND
                                                    ol.order = o.ID AND
                                                    ol.ID = $elem");

                    $result = $db->resultToArray($result)[0];

                    $lastPurchaseDate = $result['date'];
                    $orderDate = $result['orderDate'];
                    $model = $result['model'];

                    if($lastPurchaseDate == $orderDate){
                        $result = $db->query("  SELECT  MAX(o.date) as date, ol.model, ol.amount, ol.price
                                                FROM    Orders o, Orders_Lines ol, Orders_Last_Purchases olp
                                                WHERE   o.ID = ol.order AND
                                                        ol.model = olp.model AND
                                                        o.date != $orderDate");

                        if(mysqli_num_rows($result) == 0){
                            $db->query("DELETE FROM Orders_Last_Purchases
                                        WHERE model = $model");
                        }else{
                            $result = $db->resultToArray($result)[0];

                            $newDate = $result['date'];
                            $newModel = $result['model'];
                            $newAmount = $result['amount'];
                            $newPrice = $result['price'];

                            $db->query("UPDATE  Orders_Last_Purchases
                                        SET     amount = $newAmount,
                                                price = $newPrice,
                                                date = $newDate
                                        WHERE   model = $newModel");
                        }
                    }

                    $db->query("DELETE FROM Orders_Lines
                                WHERE ID = $elem");

                    if($deliveryNoteId != null){
                        $result = $db->query("  SELECT  dnl.ID
                                                FROM    DeliveryNotes_Lines dnl
                                                WHERE   dnl.deliveryNote = $deliveryNoteId");
    
                        $deliveryNoteLineId = $db->resultToArray($result)[0]['ID'];

                        $db->query("DELETE FROM DeliveryNotes_Lines_Pending
                                    WHERE deliveryNoteLine = $deliveryNoteLineId");

                        $db->query("DELETE FROM DeliveryNotes_Lines
                                    WHERE ID = $deliveryNoteLineId");
                    }
                }
            }

            $lines = isset($data['lines']) ? $data['lines'] : null;

            if($data["gasoilID"] == null || $data["gasoilID"] == ''){
                if($lines != null){
                    $toDeliveryNote = array();

                    $db->query("DELETE FROM Orders_Lines
                                WHERE `order` = $id");

                    foreach($lines as $line){
                        $line[0] = cleanStr($line[0]);
                        $line[1] = cleanStr($line[1]);
                        $line[2] = cleanStr($line[2]);
                        $line[3] = cleanStr($line[3]);
                    
                        $model = $line[1];
                        $amount = $line[2];
                        $price = $line[3];

                        $db->query("INSERT INTO Orders_Lines(`order`, model, amount, price)
                                    VALUES ($id, $model, $amount, $price)");

                        $lastPurchase = $db->query("SELECT  olp.ID
                                                    FROM    Orders_Last_Purchases olp
                                                    WHERE   olp.model = $model");
                        
                        if(mysqli_num_rows($lastPurchase) == 0){
                            $db->query("INSERT INTO Orders_Last_Purchases(model, amount, price, date)
                                        VALUES ($model, $amount, $price, $date)");
                        }else{
                            $db->query("UPDATE  Orders_Last_Purchases
                                        SET     amount = $amount,
                                                price = $price,
                                                date = $date
                                        WHERE   model = $model");
                        }
                        
                        $result = $db->query("  SELECT  p.productID
                                                FROM    Products_Models pm, Products p
                                                WHERE   pm.product = p.productID AND
                                                        (p.type = 2 OR p.type = 4) AND
                                                        pm.productModelID = $model");

                        if(mysqli_num_rows($result) > 0){
                            array_push($toDeliveryNote, array($model, $amount, $price));
                        }
                    }
                }
            }

            // Elimina el albarán si no hay productos de tipo stock en el pedido
            $result = $db->query("  SELECT  p.productID
                                    FROM    Orders o, Orders_Lines ol, Products p, Products_Models pm
                                    WHERE   o.ID = $id AND
                                            o.ID = ol.order AND
                                            ol.model = pm.productModelID AND
                                            pm.product = p.productID AND
                                            p.type = 2");

            if(mysqli_num_rows($result) == 0){
                $result = $db->query("  SELECT  dn.ID
                                        FROM    DeliveryNotes dn
                                        WHERE   dn.order = $id");

                if(mysqli_num_rows($result) > 0){
                    $deliveryNoteId = $db->resultToArray($result)[0]['ID'];
                
                    $result = $db->query("  SELECT  dnl.ID, dnl.model, dnl.receivedAmount
                                            FROM    DeliveryNotes_Lines dnl
                                            WHERE   dnl.deliveryNote = $deliveryNoteId");

                    if(mysqli_num_rows($result) > 0){
                        $deliveryNoteLines = $db->resultToArray($result);

                        foreach($deliveryNoteLines as $deliveryNoteLine){
                            $dnlId = $deliveryNoteLine['ID'];
                            $dnlModel = $deliveryNoteLine['model'];
                            $dnlReceivedAmount = $deliveryNoteLine['receivedAmount'];

                            $db->query("DELETE FROM DeliveryNotes_Lines_Pending
                                        WHERE deliveryNoteLine = $dnlId");

                            $db->query("DELETE FROM DeliveryNotes_Lines
                                        WHERE ID = $dnlId");

                            $db->query("DELETE FROM DeliveryNotes
                                        WHERE ID = $deliveryNoteId");

                            $result = $db->query("  SELECT  s.currentStock
                                                    FROM    Stock s
                                                    WHERE   s.model = $dnlModel");

                            if(mysqli_num_rows($result) > 0){
                                $currentStock = $db->resultToArray($result)[0]['currentStock'];

                                $newStock = $currentStock - $dnlReceivedAmount;

                                $db->query("UPDATE  Stock s
                                            SET     s.currentStock = $newStock
                                            WHERE   s.model = $dnlModel");
                            }
                        }
                    }
                }
            }

            return true;
        }

        /** 
         * Elimina un pedido
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $db->query("UPDATE  Orders
                        SET     leavingDate = " . time() . "
                        WHERE   ID = " . $data['ID'] . "");

            $db->query("UPDATE  DeliveryNotes
                        SET     leavingDate = " . time() . "
                        WHERE   `order` = " . $data['ID'] . "");

            $db->query("UPDATE  Pre_Orders po
                        SET     po.sentEmail = 0,
                                po.order = null
                        WHERE   po.order = " . $data['ID']);
            
            $db->query("UPDATE  Pre_Orders_Rectified po
                        SET     po.sentEmail = 0,
                                po.order = null
                        WHERE   po.order = " . $data['ID']);

            return true;
        }

        /**
         * Obtiene el lugar de entrega alternativo
         *
         * @param int $order Id del pedido
         * @return string
         */
        public function getOtherDeliveryPlace($order){
            $db = new DbHandler;

            $order = cleanStr($order);
            
            $result = $db->query("  SELECT  o.otherDeliveryPlace
                                    FROM    Orders o
                                    WHERE   o.ID = $order");

            return mysqli_num_rows($result) == 0 ? '-' : $db->resultToArray($result)[0]['otherDeliveryPlace'];
        }

        /**
         * Crea una línea de pedido
         * 
         * @param array $data
         * 
         * @return array
         */
        public function createLine($data){
            $db = new DbHandler;

            $data['order'] = cleanStr($data['ID']);
            $data['product'] = cleanStr($data['product']);
            $data['model'] = cleanStr($data['model']);
            $data['amount'] = cleanStr($data['amount']);

            return $db->query(" INSERT INTO Orders_Lines(`order`, product, model, amount)
                                VALUES( " . $data['order'] . ", " . $data['product'] . ",
                                        " . $data['model'] . ", " . $data['amount'] . ")");
        }

        /**
         * Obtiene los datos de una línea de pedido
         * 
         * @param array $data
         * 
         * @return array
         */
        public function readLine($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  ol.ID, ol.order, ol.amount, 
                                            p.productID, p.name as productName, 
                                            pm.productModelID, pm.name productModelName
                                    FROM    Orders_Lines ol, Products p, Products_Models pm
                                    WHERE   ol.product = p.productID AND
                                            ol.model = pm.productModelID AND
                                            ID = " . $data['ID'] . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Modifica los datos de una línea de pedido
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

            return $db->query(" UPDATE  Orders_Lines
                                SET     product = " . $data['product'] . ",
                                        model = " . $data['model'] . ",
                                        amount = " . $data['amount'] . "
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
         * Elimina una línea de pedido
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function deleteLine($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" DELETE FROM Orders_Lines
                                WHERE       ID = " . $data['ID'] . "");
        }

        /**
         * Elimina todas las líneas de un pedido
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function deleteAllLines($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            return $db->query(" DELETE FROM Orders_Lines
                                WHERE       `order` = " . $data . "");
        }

        /**
         * Obtiene las líneas de pedido
         * 
         * @param array ID del pedido
         * @return array Líneas de pedido
         */
        public function listLines($data){
            $db = new DbHandler;

            $data['order'] = cleanStr($data['order']);

            $result = $db->query("  SELECT  ol.*, p.name as productName, pm.name as modelName
                                    FROM    Orders_Lines ol, Products p, Products_Models pm
                                    WHERE   `order` = " . $data['order'] . " AND
                                            ol.product = p.productID AND
                                            ol.model = pm.productModelID");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene el último precio de compra y cantidad de un modelo
         * 
         * @param int $model Id del modelo
         * @return array
         */
        public function getLastPurchase($model){
            $db = new DbHandler;

            $model = cleanStr($model);

            $result = $db->query("  SELECT  olp.amount, olp.price, olp.date
                                    FROM    Orders_Last_Purchases olp
                                    WHERE   model = $model");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * 
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function getDescriptions($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result =  $db->query(" SELECT  o.notes
                                    FROM    Orders o
                                    WHERE   ID = " . $data . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Obtiene los datos de un pedido
         * 
         * @param array $data ID del pedido
         * @return array Datos del pedido
         */
        public function getInfo($data){
            $db = new DbHandler;

            $data['order'] = cleanStr($data['order']);

            $result = $db->query("  SELECT      o.*,
                                                e.deceasedName, e.deceasedSurname, e.deceasedGender, e.number,
                                                s.name as supplierName, s.mail, s.phones, s.fax,
                                                po.sentEmail, m.name as deliveryPlaceName
                                    FROM        (Orders o, Expedients e, Suppliers s, Pre_Orders po)
                                    LEFT JOIN   Mortuaries m ON  m.mortuaryID = deliveryPlace
                                    WHERE       o.ID = " . $data['order'] . " AND
                                                o.expedient = e.expedientID AND
                                                o.supplier = s.supplierID AND
                                                o.ID = po.order AND
                                                po.leavingDate IS NULL AND
                                                o.leavingDate IS NULL
                                    LIMIT       1");

            $order = mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
           
            if($order == null){
                $result = $db->query("  SELECT      o.*, s.name as supplierName, s.mail, s.phones, s.fax, m.name as deliveryPlaceName
                                        FROM        Orders o, Suppliers s, Mortuaries m
                                        WHERE       o.ID = " . $data['order'] . " AND
                                                    o.deliveryPlace = m.mortuaryID AND
                                                    o.supplier = s.supplierID AND
                                                    o.leavingDate IS NULL
                                        LIMIT       1");

                $order = mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
            }

            $result = $db->query("  SELECT  ol.amount, p.name AS productName, pm.name AS modelName, pm.supplierReference, pm.productModelID, 
                                            o.expedient
                                    FROM    Orders_Lines ol, Products p, Products_Models pm, Orders o
                                    WHERE   ol.model = pm.productModelID AND
                                            pm.product = p.productID AND
                                            ol.order = " . $data['order'] . " AND
                                            ol.order = o.ID");

            if(mysqli_num_rows($result) > 0 && $order["gasoil"] == NULL){
                $lines = $db->resultToArray($result);
                $i = 0;
                $currentModel = null;
                $currentModelIndex = 0;
                foreach($lines as $key => $value){
                    if(strlen($value['expedient'] > 0)){
                        
                        $maxNumHiring = $this->getActiveHiring($value['expedient']);

                        $hiring = $db->query("  SELECT  eh.ID
                                                FROM    Expedients_Hirings eh
                                                WHERE   eh.model = " . $value['productModelID'] . " AND
                                                        eh.num_hiring = $maxNumHiring AND
                                                        eh.expedient = " . $value['expedient']);

                        if(mysqli_num_rows($hiring) > 0){

                            if($currentModel != $value['productModelID']){
                                $currentModelIndex = 0;
                            }else{
                                $currentModelIndex++;
                            }

                            $hiring = $db->resultToArray($hiring)[$currentModelIndex]['ID'];

                            $texts =  $db->query("  SELECT  et.value
                                                    FROM    Expedients_Texts et
                                                    WHERE   et.hiring = $hiring");
                                                
                            if(mysqli_num_rows($texts) > 0){
                                $lines[$i]['texts'] = $db->resultToArray($texts);
                            }else{
                                $lines[$i]['texts'] = '';
                            }

                            $i++;

                            $currentModel = $value['productModelID'];
                        }
                    }
                }
            }else{
                $gasoil = $order["gasoil"];
                $result = $db->query("  SELECT      g.*, s.name as supplierName, i.name as ivaName
                                        FROM        Gasoil g, Suppliers s, IVA_Types i
                                        WHERE       s.supplierID = g.supplier AND i.IVATypeID = g.ivaID 
                                                    AND gasoilID = " . $gasoil . "");

            $lines = $db->resultToArray($result)[0];
        
            }

            $orderLines = mysqli_num_rows($result) == 0 ? null : $lines;

            return array($order, $orderLines);
        }

        /* **************** PRE-ORDERS **************** */
        /**
         * Obtiene los pre-pedidos de un expediente
         * 
         * @param array $data ID del expediente
         * @return array Pre-pedidos
         */
        public function getPreOrders($data){
            $db = new DbHandler;

            $data['expedient'] = cleanStr($data['expedient']);

            $maxNumHiring = $this->getActiveHiring($data['expedient']);

            $preOrders = $db->query("   SELECT      po.ID, po.order, po.sentEmail,
                                                    s.supplierID, s.name as supplierName,
                                                    s.phones as suplierPhone,
                                                    p.productID, p.name as productName,
                                                    pm.productModelID as modelID, pm.name as modelName,
                                                    eh.amount, eh.ID as eh, o.date AS dateOrder,
                                                    pr.purchasePrice as price
                                        FROM        (
                                                        Pre_Orders po, Expedients_Hirings eh, Expedients e,
                                                        Suppliers s, Products p, Products_Models pm, Products_Retails pr
                                                    )
                                        LEFT JOIN   Orders o ON po.order = o.ID AND o.leavingDate IS NULL
                                        WHERE       po.leavingDate IS NULL AND
                                                    po.hiring = eh.ID AND
                                                    eh.expedient = e.expedientID AND
                                                    eh.supplier = s.supplierID AND
                                                    eh.product = p.productID AND
                                                    eh.model = pm.productModelID AND
                                                    eh.num_hiring = $maxNumHiring AND
                                                    pm.productModelID = pr.model AND
                                                    pr.year = " . date('Y') . " AND
                                                    e.expedientID = " . $data['expedient'] . "
                                        ORDER BY    s.supplierID");


            $preOrders = $db->resultToArray($preOrders);
            $i = 0;
            foreach($preOrders as $key => $preOrder){
                $texts = $db->query("SELECT et.value FROM Expedients_Texts et WHERE et.hiring = " . $preOrder['eh']);
                if(mysqli_num_rows($texts) != 0){
                    $preOrders[$key]['texts'] = $db->resultToArray($texts);
                }
                $i++;
            }

            return count($preOrders) == 0 ? null : $preOrders;
        }

        /**
         * Modifica un pre-pedido
         * 
         * @param array $data ID del pedido
         * @return bool
         */
        public function setPreOrders($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['order'] = cleanStr($data['order']);

            return $db->query(" UPDATE  Pre_Orders
                                SET     `order` = " . $data['order'] . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Enviar un email al proveedor con el pedido
         * 
         * @param array $data Datos del pedido
         * @return bool
         */
        public function sendEmail($data){
            $db = new DbHandler;
            
            $data['notes'] = cleanEditor($data['notes']);
            $data['order'] = cleanStr($data['order']);

            if(isset($data['sendCopy'])){
                $data['sendCopy'] = cleanStr($data['sendCopy']);
            } 

            if(isset($data['expedient'])){
                $data['expedient'] = cleanStr($data['expedient']);
            } 

            $notes = $data['notes'];
            $order = $data['order'];
            $sendCopy = $data['sendCopy'];

            $dataExpedient = null;
            if(isset($data['expedient'])){
                $result = $db->query("  SELECT      ep.type, ep.model
                                        FROM        Expedients_Press ep
                                        WHERE       ep.expedient =  " . $data['expedient'] . " AND ep.selected = 1");

                $dataExpedient = mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
                if($dataExpedient !== null){
                    $type = $dataExpedient["type"];
                    $model = $dataExpedient["model"];

                    $resultAux = $db->query("   SELECT  COUNT(*) as totalPress
                                                FROM    Orders o, Orders_Lines ol, Products p, Products_Models pm
                                                WHERE   ol.order = o.ID AND 
                                                        ol.model = pm.productModelID AND 
                                                        pm.product = p.productID AND 
                                                        p.blockBelow = 8 AND 
                                                        o.id = " . $data['order'] . "");
                    $totalPress = mysqli_num_rows($resultAux) == 0 ? 0 : $db->resultToArray($resultAux)[0]['totalPress']; 
                    if($totalPress >= 1){
                        $press = 1;
                    }else{
                        $press = 0;
                    }
                }else{
                    $press = 0;
                }
            }else{
                $press = 0;
            } 

            $db->query("UPDATE  Orders
                        SET     notes = '" .  $notes . "'
                        WHERE   ID = " . $order);

            require_once($_SESSION['basePath'] . "core/tools/mailHandler.php");

           
            $orderInfo = $this->getInfo($data);

            $result = $db->query("  SELECT  s.name
                                    FROM    Suppliers s, Orders o
                                    WHERE   s.supplierID = o.supplier AND
                                            o.ID = $order");

            $supplierName = mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['name'];
            $orderInfo['supplierName'] = $supplierName;

            if($orderInfo[0]["gasoil"] != NULL){
                $mailHandler = new MailHandler;
                $sent = $mailHandler->sendSupplierGasoil(array($orderInfo, $sendCopy));
            }else{
                if(intval($press) == 1 && $dataExpedient != null){
                    $mailHandler = new MailHandler;
                    $sent = $mailHandler->sendSupplierPress(array($orderInfo, $sendCopy, $type, $model, $data['expedient']));
                }else{
                    $result = $db->query("  SELECT  s.sentObituary
                                            FROM    Orders o, Suppliers s 
                                            WHERE   o.ID = $order AND o.supplier = s.supplierID");

                    $sentObituary = mysqli_num_rows($result) == 0 ? 0 : $db->resultToArray($result)[0]['sentObituary'];  
                    $orderInfo['sentObituary'] = $sentObituary;

                    require_once($_SESSION['basePath'] . "model/obituaries.php");
                    $expedients = new Obituaries;
                    $expedientInfo =  $expedients->getTypeModelExpedient($data['expedient']);
            
                    $type = 0;
                    $model = 0;
                    $firstResult = true;
                    if($expedientInfo != null){
                        foreach($expedientInfo as $info){
                            if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/". $data['expedient']."/obituary/".$info["type"]."/".$info["model"]."/files/esquela.pdf") && $firstResult){
                                $type = $info["type"];
                                $model = $info["model"];
                                $firstResult = false;
                            }
                        }
                    }
                    $orderInfo['type'] = $type;
                    $orderInfo['model'] =  $model;
                    $orderInfo['expedientID'] =  $data['expedient'];

                    $mailHandler = new MailHandler;
                    $sent = $mailHandler->sendSupplier(array($orderInfo, $sendCopy));
                }
            }
            if($sent){
                $db->query("UPDATE  Pre_Orders po
                            SET     po.sentEmail = 1
                            WHERE   po.order = " . $data['order']);
            }
            return true;
        }

        /**
         * Obtiene los proveedores que cuyos pedidos están en estado "no conforme"
         * 
         * @param string $name Nombre
         * @return array
         */
        public function getSuppliersNoAgreement($name){
            $db = new DbHandler;

            $name = cleanStr($name);

            $result = $db->query("  SELECT      s.supplierID, s.name
                                    FROM        (Suppliers s, Orders o)
                                    LEFT JOIN   Expedients e ON o.expedient = e.expedientID
                                    WHERE       s.leavingDate IS NULL AND
                                                s.name LIKE '%". $name ."%' AND
                                                s.supplierID = o.supplier AND
                                                o.leavingDate IS NULL AND
                                                e.leavingDate IS NULL AND
                                                o.inAgreement = 0
                                    GROUP BY    s.supplierID");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene la no conformidad de un pedido
         * 
         * @param int $order Pedido
         * @return array
         */
        public function getNonApproval($order){
            $db = new DbHandler;

            $order = cleanStr($order);

            $result = $db->query("  SELECT  o.nonApproval, o.correctiveAction
                                    FROM    Orders o
                                    WHERE   o.ID = $order");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /*
        * Obtiene los pedidos
        *
        * @return array
        */
        public function listOrdersDatatables($type, $agreement, $from, $to){
            $db = new DbHandler;

            $where = " o.leavingDate IS NULL AND o.type = $type ";

            switch($agreement){
                case 1:
                    $where .= ' AND o.inAgreement = 1';
                break;
                case 2:
                    $where .= ' AND o.inAgreement = 0';
                break;
                case 3:
                    $where .= ' AND (o.inAgreement = 1 OR o.inAgreement = 0)';
                break;
            }

            $result = $db->query("  SELECT      o.ID, e.number, o.date, s.name, m.name, o.deliveryDate, d.ID, o.inAgreement
                                    FROM        Orders o
                                    LEFT JOIN   Suppliers s ON o.supplier = s.supplierID
                                    LEFT JOIN   Mortuaries m ON o.deliveryPlace = m.mortuaryID
                                    LEFT JOIN   Expedients e ON o.expedient = e.expedientID
                                    LEFT JOIN   DeliveryNotes d ON d.order = o.ID
                                    WHERE       $where AND o.date BETWEEN $from AND $to");
            

            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
        * Obtiene el listado de acciones correctivas para pedidos
        *
        * @return array
        */
        public function listCorrectiveActionsDatatables($where){
            $db = new DbHandler;

            $result = $db->query("  SELECT      o.ID, e.number, o.date, s.name, m.name, o.deliveryDate, d.ID, o.inAgreement
                                    FROM        Orders o
                                    LEFT JOIN   Suppliers s ON o.supplier = s.supplierID
                                    LEFT JOIN   Mortuaries m ON o.deliveryPlace = m.mortuaryID
                                    LEFT JOIN   Expedients e ON o.expedient = e.expedientID
                                    LEFT JOIN   DeliveryNotes d ON d.order = o.ID
                                    WHERE       o.leavingDate IS NULL AND 
                                                e.leavingDate IS NULL AND
                                                (
                                                    o.inAgreement = 0 OR
                                                    o.inAgreement = 2
                                                ) $where");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
         * Devuelve la ultima contratacion
         * 
         * @return int
         */
        public function getActiveHiring($expedientID){
            $db = new DbHandler;

            $result = $db->query("  SELECT  COALESCE(MAX(eh.num_hiring), 0) as num_hiring
                                    FROM    Expedients_Hirings eh
                                    WHERE   eh.expedient = $expedientID");

            if(mysqli_num_rows($result) > 0){
                $maxNumHiring = $db->resultToArray($result)[0]['num_hiring'];
                return $maxNumHiring;
            }else{
                return 0;
            }
        }

        /**
         * Modifica la conformidad de un pedido
         * 
         * @param array $data
         * @return bool
         */
        public function updateConformity($data){
            $db = new DbHandler;

            $data['id'] = cleanStr($data['id']);
            $data['inAgreement'] = cleanStr($data['inAgreement']);
            $data['nonApproval'] = cleanEditor($data['nonApproval']);
            $data['correctiveAction'] = cleanEditor($data['correctiveAction']);
            $data['notes'] = cleanEditor($data['notes']);

            $id = $data['id'];
            $inAgreement = $data['inAgreement'];
            $nonApproval = $data['nonApproval'];
            $notes = $data['notes'];
            $correctiveAction = $data['correctiveAction'];

            $db->query("UPDATE  Orders
                        SET     notes = '$notes',
                                inAgreement = $inAgreement,
                                nonApproval = '$nonApproval',
                                correctiveAction = '$correctiveAction'
                        WHERE   ID = $id");

            return true;
        }
    }
?>