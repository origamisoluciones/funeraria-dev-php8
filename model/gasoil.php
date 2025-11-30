<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Gasoil{
        /**
         * Añade un nuevo taller
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['supplier'] = cleanStr($data['supplier']);
            $data['date'] = cleanStr($data['date']);
            $data['litres'] = cleanStr($data['litres']);
            $data['priceLitre'] = cleanStr($data['priceLitre']);
            $data['net'] = cleanStr($data['net']);
            $data['iva'] = cleanStr($data['iva']);
            $data['total'] = cleanStr($data['total']);
           
            // Validación de campos
            if(strlen($data['supplier'] == 0)){
                return false;
            }
            if(strlen($data['date'] == 0)){
                return false;
            }
            if(strlen($data['litres'] == 0)){
                return false;
            }
            if(strlen($data['priceLitre']) == 0){
                return false;
            }
            if(strlen($data['net'] == 0)){
                return false;
            }
            if(strlen($data['iva'] == 0)){
                return false;
            }
            if(strlen($data['total'] == 0)){
                return false;
            }

            return $db->query(" INSERT INTO Gasoil(supplier, date, litres, priceLitre, net, ivaID, total)
                                VALUES(" . $data['supplier'] . ", '" . $data['date'] . "', 
                                        '" . $data['litres'] . "', '" . $data['priceLitre'] . "', 
                                        '" . $data['net'] . "', 
                                        '" . $data['iva'] . "', '" . $data['total'] . "')");
        }

        /**
         * Obtiene los datos de un gasoil
         * 
         * @param array $data
         * 
         * @return array
         */
        public function read($data){
            $db = new DbHandler;

            $data['gasoilID'] = cleanStr($data['gasoilID']);

            $result = $db->query("  SELECT  g.*, s.name as supplierName, i.name as ivaName
                                    FROM    Gasoil g, Suppliers s, IVA_Types i
                                    WHERE   s.supplierID = g.supplier AND 
                                            i.IVATypeID = g.ivaID AND
                                            g.gasoilID = " . $data['gasoilID'] . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Modifica los datos de un gasoil
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['gasoilID'] = cleanStr($data['gasoilID']);
            $data['supplier'] = cleanStr($data['supplier']);
            $data['date'] = cleanStr($data['date']);
            $data['litres'] = cleanStr($data['litres']);
            $data['priceLitre'] = cleanStr($data['priceLitre']);
            $data['net'] = cleanStr($data['net']);
            $data['iva'] = cleanStr($data['iva']);
            $data['total'] = cleanStr($data['total']);
           
            // Validación de campos
            if(strlen($data['supplier'] == 0)){
                return false;
            }
            if(strlen($data['date'] == 0)){
                return false;
            }
            if(strlen($data['litres'] == 0)){
                return false;
            }
            if(strlen($data['priceLitre']) == 0){
                return false;
            }
            if(strlen($data['net'] == 0)){
                return false;
            }
            if(strlen($data['iva'] == 0)){
                return false;
            }
            if(strlen($data['total'] == 0)){
                return false;
            }

            return $db->query(" UPDATE  Gasoil
                                SET     supplier = " . $data['supplier'] . ",
                                        date= '" . $data['date'] . "',
                                        litres = '" . $data['litres'] . "',
                                        priceLitre = '" . $data['priceLitre'] . "',
                                        net = '" . $data['net'] . "',
                                        ivaID = '" . $data['iva'] . "',
                                        total = '" . $data['total'] . "'
                                WHERE   gasoilID = " . $data['gasoilID'] . "");
        }

        /**
         * Elimina un gasoil
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['gasoilID'] = cleanStr($data['gasoilID']);
            
            return $db->query(" UPDATE  Gasoil
                                SET     leavingDate = " . time() . "
                                WHERE    gasoilID = " . $data['gasoilID'] . "");
        }

        /**
         * Añade un gasoil a un pedido
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function addOrder($data){
            $db = new DbHandler;

            $data['gasoilID'] = cleanStr($data['gasoilID']);
           
            // Validación de campos
            if(strlen($data['gasoilID'] == 0)){
                return false;
            } else{
                $gasoilID = $data['gasoilID'];
            }

            $gasoilData = $this->read($data);
            
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Orders 
                                    WHERE   extraID = '" . $extraID . "'");
           
            while(mysqli_num_rows($result) > 0){
               $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

               $result = $db->query("  SELECT  * 
                                       FROM    Orders 
                                       WHERE   extraID = '" . $extraID . "'");
            }

            $newOrder = $db->query(" INSERT INTO Orders(supplier, gasoil, date, type, extraID)
                                    VALUES(" . $gasoilData['supplier'] . ", '" . $gasoilID . "', 
                                        '" . $gasoilData['date'] . "', 1, '$extraID')");
            
            if($newOrder){
               $updateGasoil =  $db->query("    UPDATE  Gasoil
                                                SET     hasOrder = 1
                                                WHERE   gasoilID = " .  $gasoilID . "");

                if($updateGasoil){
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
        
                    $order = $this->getOrderGasoil($data);
                    $number = null;
                    $date = $gasoilData['date'];
                    $notes = null;
                    $inAgreement = 'null';
                    $received = 0;
                    $nonconformityDescription = null;
                    $nonconformitySolution = null;
                    $leavingDate = 'null';
                    
                    $newDelivery =  $db->query("INSERT INTO DeliveryNotes(`order`, number, date, notes, inAgreement, received, nonconformityDescription,
                                                            nonconformitySolution, leavingDate, extraID)
                                                VALUES ($order, '$number', $date, '$notes', $inAgreement, $received, '$nonconformityDescription',
                                                        '$nonconformitySolution', $leavingDate, '$extraID')");
                    
                    $deliveryNote = $this->getDeliveryNoteGasoil($order);
                    if($newDelivery){
                        
                       return  $db->query("INSERT INTO DeliveryNotes_Lines_Gasoil(deliveryNote, litresReceived, priceLiter, neto, iva, total)
                                            VALUES($deliveryNote, 0, '" . $gasoilData['priceLitre'] . "',  '" . $gasoilData['net'] . "', '" . $gasoilData['ivaID'] . "',  '" . $gasoilData['total'] . "')");
                    }
                }
            }
        }

        /**
         * Obtiene el id del pedido al que está asociado el gasoil
         * 
         * @param array $data
         * 
         * @return array
         */
        public function getOrderGasoil($data){
            $db = new DbHandler;

            $data['gasoilID'] = cleanStr($data['gasoilID']);

            $result = $db->query("  SELECT  o.ID as ID
                                    FROM    Orders o
                                    WHERE   o.gasoil = " . $data['gasoilID'] . "");

            return $db->resultToArray($result)[0]['ID'];
        }

        /**
         * Obtiene el id del pedido al que está asociado el gasoil
         * 
         * @param array $data
         * 
         * @return array
         */
        public function getDeliveryNoteGasoil($order){
            $db = new DbHandler;

            $result = $db->query("  SELECT  dn.ID as ID
                                    FROM    DeliveryNotes dn
                                    WHERE   dn.order = " . $order . "");

            return $db->resultToArray($result)[0]['ID'];
        }

        /*
        * Obtiene los curas
        *
        * @return array
        */
        public function listGasoilDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      g.gasoilID, g.hasOrder, s.name, g.date, g.priceLitre, g.litres, it.name, g.total
                                    FROM        Gasoil g
                                    LEFT JOIN   IVA_Types it ON g.ivaID = it.IVATypeID
                                    LEFT JOIN   Suppliers s ON g.supplier = s.supplierID
                                    WHERE       g.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }
    }
?>