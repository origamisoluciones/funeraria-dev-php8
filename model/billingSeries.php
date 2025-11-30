<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class BillingSeries{

        /**
        * Obtiene las series de facturacion
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  bs.id, 
                                            bs.name, 
                                            bs.letter,
                                            (
                                                SELECT  GROUP_CONCAT(et.name SEPARATOR ', ')
                                                FROM    Billing_Series_Expedients_Types bset, Expedients_Types et
                                                WHERE   bset.billingSerie = bs.id AND
                                                        bset.leavingDate IS NULL AND
                                                        bset.expedientType = et.expedientTypeID 
                                            ) as expedients_types,
                                            (
                                                SELECT  COUNT(*)
                                                FROM    Invoices i
                                                WHERE   i.leavingDate IS NULL AND
                                                        i.billingSerie = bs.id
                                            ) as total_invoices_serie
                                    FROM    Billing_Series bs
                                    WHERE   bs.leavingDate IS NULL AND
                                            bs.serie_rectified IS NOT NULL
            ");
            
            if(mysqli_num_rows($result) == 0){
                return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
         * Añade una nueva serie de facturacion
         * 
         * @param string $name Nombre de la serie
         * @param string $letter Letra de la serie
         * @param array $types Letra de la serie
         * @param int $serieRectified Id de la serie original
         * @param string $verficatuCode Code VERIFACTU
         * 
         * @return bool
         */
        public function create($name, $letter, $types, $serieRectified, $verficatuCode){
            $db = new DbHandler;

            $name = cleanStr($name);
            $letter = cleanStr($letter);
            
            // Validación de campos
            if($name == ''){
                return [false];
            }
            if($letter == ''){
                return [false];
            }
            if(count($types) == 0){
                return [false];
            }

            if($serieRectified == null){
                $letterB = $letter . 'R';
                $result = $db->query("  SELECT  *
                                        FROM    Billing_Series bs
                                        WHERE   (bs.letter = '$letter' OR bs.letter = '$letterB') AND
                                                bs.leavingDate IS NULL
                ");
    
                if(mysqli_num_rows($result) > 0){
                    return [false, 'exists_letter'];
                }
            }

            $result = $db->query("INSERT INTO Billing_Series(name, letter, verifactu_code) VALUES ('$name', '$letter', '$verficatuCode')");

            if($result){
                $billingSerieId = $db->getLastInsertId();

                if($serieRectified != null){
                    $db->query("UPDATE  Billing_Series
                                SET     serie_rectified = $billingSerieId
                                WHERE   id = " . $serieRectified . "");
                }

                foreach($types as $item){
                    $item = cleanStr($item);
                    $db->query("INSERT INTO Billing_Series_Expedients_Types(billingSerie, expedientType)
                                VALUES ($billingSerieId, $item)
                    ");
                }

                return [true, $billingSerieId];

            }else{
                return [false];
            }
        }

        /**
         * Edita una nueva serie de facturacion
         * 
         * @param string $id Id de la serie
         * @param string $name Nombre de la serie
         * @param string $letter Letra de la serie
         * @param array $types Letra de la serie
         * 
         * @return bool
         */
        public function update($id, $name, $letter, $types){
            $db = new DbHandler;

            $id = cleanStr($id);
            $name = cleanStr($name);
            $letter = cleanStr($letter);
            
            // Validación de campos
            if($id == ''){
                return [false];
            }
            if($name == ''){
                return [false];
            }
            if($letter == ''){
                return [false];
            }
            if(count($types) == 0){
                return [false];
            }

            $result = $db->query("  UPDATE  Billing_Series
                                    SET     name = '$name',
                                            letter = '$letter'
                                    WHERE   id = " . $id . ""
            );

            if($result){

                $idsNotDeleted = '';
                foreach($types as $item){
                    $item = cleanStr($item);

                    $result = $db->query("  SELECT      bset.id
                                            FROM        Billing_Series_Expedients_Types bset
                                            WHERE       bset.leavingDate IS NULL AND
                                                        bset.billingSerie = $id AND
                                                        bset.expedientType = " . $item );
                    if(mysqli_num_rows($result) > 0){
                        $idsNotDeleted .=  $db->resultToArray($result)[0]['id'] . ',';
                    }else{
                        $db->query("INSERT INTO Billing_Series_Expedients_Types(billingSerie, expedientType)
                                    VALUES ($id, $item)
                        ");

                        $idsNotDeleted .= $db->getLastInsertId() . ',';
                    }
                }

                // Delete old
                if($idsNotDeleted != ''){
                    $idsNotDeleted = substr($idsNotDeleted, 0, -1);

                    $db->query("UPDATE  Billing_Series_Expedients_Types
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                                WHERE   leavingDate IS NULL AND
                                        id NOT IN ($idsNotDeleted) AND
                                        billingSerie  = " . $id . "");
                }


                $result = $db->query("  SELECT      bs.serie_rectified
                                        FROM        Billing_Series bs
                                        WHERE       bs.id = " . $id );

                if(mysqli_num_rows($result) > 0){
                    $billingSerieRectified = $db->resultToArray($result)[0]['serie_rectified'];
                    return [true, $billingSerieRectified];
                }else{
                    return [true];
                }
            }else{
                return [false];
            }
        }

        /**
         * Obtiene la información de una serie de facturación
         * 
         * @param int $id Billing Serie id
         * 
         * @return array
         */
        public function read($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  bs.name, bs.letter
                                    FROM    Billing_Series bs
                                    WHERE   bs.id = " . $id);

            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                $serieInfo = $db->resultToArray($result)[0];

                $info = array();
                $info['serie'] = $serieInfo;

                $result = $db->query(" SELECT   bset.expedientType as id, et.name as text
                                        FROM    Billing_Series_Expedients_Types bset, Expedients_Types et
                                        WHERE   bset.leavingDate IS NULL AND
                                                bset.billingSerie = $id AND
                                                bset.expedientType = et.expedientTypeID
                ");

                if(mysqli_num_rows($result) == 0){
                    $info['types'] = [];
                }else{
                    $info['types'] = $db->resultToArray($result);
                }

                return $info;
            }
        }

        /**
        * Eliminar una serie de facturacion
        *
        * @param int $id Billing Serie id
        *
        * @return bool
        */
        public function delete($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $db->query("UPDATE  Billing_Series
                        SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                        WHERE   id = " . $id . "");

            $db->query(" UPDATE  Billing_Series_Expedients_Types
                        SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                        WHERE   billingSerie  = " . $id . "");

            // Delete serie rectified
            $result = $db->query("  SELECT      bs.serie_rectified
                                    FROM        Billing_Series bs
                                    WHERE       bs.id = " . $id );

            if(mysqli_num_rows($result) > 0){
                $billingSerieRectified = $db->resultToArray($result)[0]['serie_rectified'];
                
                $id = intval($id) + 1;
                $db->query(" UPDATE  Billing_Series
                            SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                            WHERE   id = " . $billingSerieRectified . "");
    
                $db->query(" UPDATE  Billing_Series_Expedients_Types
                            SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                            WHERE   billingSerie  = " . $billingSerieRectified . "");
            }
            
            return true;
        }

        /**
        * Lista los ids de series de facturación para los selectores
        *
        * @param string $search Name billing serie to search
        * @param int $expedientType Expedient type to search
        * @param int $isRectified If invoice to generate is FR
        * @param int $isContado If invoice to generate is FS
        *
        * @return array
        */
        public function searchByName($search, $expedientType, $isRectified, $isContado){
            $db = new DbHandler;

            $search = cleanStr($search);
            $expedientType = cleanStr($expedientType);
            $isRectified = cleanStr($isRectified);
            $isContado = cleanStr($isContado);

            $where = '';
            if($isRectified == 0){
                $where .= " AND bs.serie_rectified IS NOT NULL";
            }
            if($isContado == 0){
                $where .= " AND bs.serie_simplified IS NULL";
            }

            $result = $db->query("  SELECT   bs.id, CONCAT(bs.name, ' - ', bs.letter) as name 
                                    FROM     Billing_Series bs
                                    WHERE    bs.leavingDate IS NULL AND
                                             bs.name LIKE '%". $search ."%' AND
                                            (
                                                    SELECT  COUNT(*)
                                                    FROM    Billing_Series_Expedients_Types bset
                                                    WHERE   bset.leavingDate IS NULL AND
                                                            bset.expedientType = $expedientType AND
                                                            bset.billingSerie = bs.id
                                            ) > 0
                                            $where
                                    ORDER BY bs.name
            ");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene las series de facturacion disponible para un expediente
        *
        * @return array
        */
        public function getForExpedient($expedient, $isClientContado, $expedientType, $expedientNextStatus){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);
            $expedientType = cleanStr($expedientType);
            $expedientNextStatus = cleanStr($expedientNextStatus);

            $where = '';
            if($isClientContado == 0){
                $where .= " AND bs.serie_simplified IS NULL AND bs.serie_rectified IS NOT NULL";
            }else{
                $where .= " AND bs.serie_simplified IS NOT NULL";
            }

            if($expedientNextStatus == 0){ // Factura normal
                $result = $db->query("  SELECT   bs.id, CONCAT(bs.name, ' - ', bs.letter) as text 
                                        FROM     Billing_Series bs
                                        WHERE    bs.leavingDate IS NULL AND
                                                (
                                                        SELECT  COUNT(*)
                                                        FROM    Billing_Series_Expedients_Types bset
                                                        WHERE   bset.leavingDate IS NULL AND
                                                                bset.expedientType = $expedientType AND
                                                                bset.billingSerie = bs.id
                                                ) > 0
                                                $where
                                        ORDER BY bs.name
                ");
            }else if($expedientNextStatus == 1){ // Factura rectificada

                $result = $db->query("  SELECT      bs.id,
                                                    bs.serie_rectified
                                        FROM        Invoices i, Billing_Series bs
                                        WHERE       i.leavingDate IS NULL AND
                                                    i.billingSerie = bs.id AND 
                                                    i.expedient = $expedient AND 
                                                    bs.id != 7
                                        ORDER BY    i.ID DESC
                ");

                if(mysqli_num_rows($result) > 0){
                    $invoiceBillingSerieInfo = $db->resultToArray($result)[0];
                    
                     /**
                     * Si la factura anterior ya es rectificada, mantenemos la serie de rectificada
                     */
                    if($invoiceBillingSerieInfo['serie_rectified'] != null){
                        $invoiceBillingSerie = $invoiceBillingSerieInfo['serie_rectified'];
                    }else{
                        $invoiceBillingSerie = $invoiceBillingSerieInfo['id'];
                    }

                    $result = $db->query("  SELECT      bs.id, CONCAT(bs.name, ' - ', bs.letter) as text 
                                            FROM        Billing_Series bs
                                            WHERE       bs.leavingDate IS NULL AND
                                                        bs.id = $invoiceBillingSerie
                                            ORDER BY    bs.name
                    ");
                }
            }else{
                return array();
            }
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene la fecha minima para facturar una serie
        *
        * @return array
        */
        public function checkSerieAndDate($expedient, $billingSerie, $invoiceYear){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);
            $billingSerie = cleanStr($billingSerie);
            $invoiceYear = cleanStr($invoiceYear);

            $result = $db->query("  SELECT  MAX(i.creationDate) as min_invoice_date
                                    FROM	Invoices i
                                    WHERE	i.leavingDate IS NULL AND
                                            i.anuledDate IS NULL AND
                                            i.generatedInvoiceNumber LIKE '%/$invoiceYear' AND
                                            i.billingSerie = $billingSerie
            ");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Obtiene las series de facturacion
         * 
         * @return array
         */
        public function listBillingSeries(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  bs.id, 
                                            CONCAT('Serie ', bs.letter) as text
                                    FROM    Billing_Series bs
                                    WHERE   leavingDate IS NULL
            ");

            $list = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : [];

            $listFR = [];
            if(date('Y') <= 2025){

                $result = $db->query("  SELECT  bs.id, 
                                                CONCAT('Serie ', bs.letter) as text
                                        FROM    Billing_Series bs
                                        WHERE   bs.id = 7
                ");

                $listFR = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : [];
            }

            $list = array_merge($list, $listFR);

            return $list;
        }
    }
?>