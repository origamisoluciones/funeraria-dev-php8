<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Financings{
        /**
         * Añade una nueva financiación
         * 
         * @param array $data Datos de la financiación
         * @return int|null ID de la financiación
         */
        public function create($data){
            $data['amortization'] = cleanStr($data['amortization']);
            $data['initialCapital'] = cleanStr($data['initialCapital']);
            $data['destination'] = cleanStr($data['destination']);
            $data['type'] = cleanStr($data['type']);
            $data['providerEntity'] = cleanStr($data['providerEntity']);
            $data['startDate'] = cleanStr($data['startDate']);
            $data['endDate'] = cleanStr($data['endDate']);
            $data['term'] = cleanStr($data['term']);
            $data['initialCapital'] = cleanStr($data['initialCapital']);
            $data['openingCommission'] = cleanStr($data['openingCommission']);
            $data['closeCommission'] = cleanStr($data['closeCommission']);
            $data['amortizationCommission'] = cleanStr($data['amortizationCommission']);
            $data['payMethod'] = cleanStr($data['payMethod']);
            $data['financeCenter'] = cleanStr($data['financeCenter']);
            $data['comments'] = cleanStr($data['comments']);
            $data['name'] = cleanStr($data['name']);
            $data['interest'] = cleanStr($data['interest']);
            $data['diferencial'] = cleanStr($data['diferencial']);
            $data['euribor'] = cleanStr($data['euribor']);

            $db = new DbHandler;

            // Cálculo del extraID
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Financing 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Financing 
                                        WHERE   extraID = '" . $extraID . "'");
            }

            $pendingCapital = floatval($data['amortization'] - $data['initialCapital']);
            $amortization = $pendingCapital;

            $result = $db->query("  INSERT INTO Financing(  
                                        destination, type, providerEntity, startDate, 
                                        endDate, term, initialCapital, pendingCapital, 
                                        pendingFee, amortization, openingCommission, closeCommission, 
                                        amortizationCommission, payMethod, financeCenter, comments, 
                                        extraID, name, interest, diferencial, euribor
                                    )
                                    VALUES (
                                        " . $data['destination'] . ", " . $data['type'] . ", '" . $data['providerEntity'] . "', " . $data['startDate'] . ", 
                                        " . $data['endDate'] . ", " . $data['term'] . ", " . $data['initialCapital'] . ",  " . $pendingCapital . ",  
                                        " . $data['term'] . ", " . $amortization . ",  " . $data['openingCommission'] . ", " . $data['closeCommission'] . ", 
                                        " . $data['amortizationCommission'] . ", " . $data['payMethod'] . ", " . $data['financeCenter'] . ", '" . $data['comments'] . "', 
                                        '" . $extraID . "', '" . $data['name'] . "', " . $data['interest'] . ", " . floatval($data['diferencial']) . ", " . floatval($data['euribor']) . "
                                    )
            ");
            
            if($result){
                $result = $db->query("  SELECT  f.ID
                                        FROM    Financing f
                                        WHERE   f.extraID = '" . $extraID . "'");
                
                return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['ID'] : false;
            }
        }

        /**
         * Añade una nueva financiación
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function createCuota($data){
            $db = new DbHandler;

            $data['financing'] = cleanStr($data['financing']);
            $data['interest'] = cleanStr($data['interest']);
            $data['cuote'] = cleanStr($data['cuote']);
            $data['amortization'] = cleanStr($data['amortization']);
            $data['pendingCapital'] = cleanStr($data['pendingCapital']);
            $data['startDate'] = cleanStr($data['startDate']);
            $data['endDate'] = cleanStr($data['endDate']);
            $data['event'] = cleanStr($data['event']);

            return $db->query(" INSERT INTO Financing_Cuotas(financing, interest, cuote, amortization, pendingCapital, startDate, endDate, event)
                                VALUES(" . $data['financing'] . ", " . $data['interest'] . ", " . $data['cuote'] . ", " . $data['amortization'] . ", 
                                       " . $data['pendingCapital'] . ", " . $data['startDate'] . ", " . $data['endDate'] . ", " . $data['event'] . ")");
        }

        /**
         * Obtiene los datos de una financiación en base al ID
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function read($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      f.*, fd.name AS destinationName, fm.name AS payMethodName, m.name AS financeCenterName 
                                    FROM        (Financing f)
                                    LEFT JOIN   Financing_Destinations fd ON f.destination = fd.ID
                                    LEFT JOIN   Financing_Methods fm ON f.payMethod = fm.ID
                                    LEFT JOIN   Mortuaries m ON f.financeCenter = m.mortuaryID
                                        WHERE   f.ID = " . $data);

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Actualiza una financiación
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['destination'] = cleanStr($data['destination']);
            $data['type'] = cleanStr($data['type']);
            $data['providerEntity'] = cleanStr($data['providerEntity']);
            $data['startDate'] = cleanStr($data['startDate']);
            $data['endDate'] = cleanStr($data['endDate']);
            $data['term'] = cleanStr($data['term']);
            $data['initialCapital'] = cleanStr($data['initialCapital']);
            $data['amortizedCapital'] = cleanStr($data['amortizedCapital']);
            $data['pendingCapital'] = cleanStr($data['pendingCapital']);
            $data['pendingFee'] = cleanStr($data['pendingFee']);
            $data['amortization'] = cleanStr($data['amortization']);
            $data['payMethod'] = cleanStr($data['payMethod']);
            $data['financeCenter'] = cleanStr($data['financeCenter']);
            $data['comments'] = cleanStr($data['comments']);
            $data['interest'] = cleanStr($data['interest']);
            $data['interestType'] = cleanStr($data['interestType']);
            $data['euribor'] = cleanStr($data['euribor']);
            $data['diferencial'] = cleanStr($data['diferencial']);
            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Financing f
                                SET     f.destination = " . $data['destination'] . ", f.type = " . $data['type'] . ", 
                                        f.providerEntity = '" . $data['providerEntity'] . "', f.startDate = " . $data['startDate'] . ", f.endDate = " . $data['endDate'] . ", 
                                        f.term = " . $data['term'] . ",
                                        f.initialCapital = " . $data['initialCapital'] . ", f.amortizedCapital = " . $data['amortizedCapital'] . ",
                                        f.pendingCapital = " . $data['pendingCapital'] . ", f.pendingFee = " . $data['pendingFee'] . ",
                                        f.amortization = " . $data['amortization'] . ", f.payMethod = " . $data['payMethod'] . ",
                                        f.financeCenter = " . $data['financeCenter'] . ", f.comments = '" . $data['comments'] . "',
                                        f.interest = " . $data['interest'] . ", f.interestType = " . $data['interestType'] . ",
                                        f.euribor = " . $data['euribor'] . ", f.diferencial = " . $data['diferencial'] . "
                                WHERE   f.ID= " . $data['ID']);
        }

        /**
         * Actualiza una financiación
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updatePayments($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            return $db->query(" UPDATE  Financing_Cuotas fc
                                SET     fc.payDate = " . time() . "
                                WHERE   fc.ID= " . $data . "");
        }

        /**
         * Actualiza las cuotas 
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateCuota($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['interest'] = cleanStr($data['interest']);
            $data['cuote'] = cleanStr($data['cuote']);
            $data['pendingCapital'] = cleanStr($data['pendingCapital']);
            $data['amortization'] = cleanStr($data['amortization']);
            $data['startDate'] = cleanStr($data['startDate']);
            $data['endDate'] = cleanStr($data['endDate']);

            return $db->query(" UPDATE  Financing_Cuotas
                                SET     interest = " . $data['interest'] . ", 
                                        cuote = " . $data['cuote'] . ", 
                                        pendingCapital = " . $data['pendingCapital']. ",
                                        amortization = " . $data['amortization'] . ", 
                                        startDate = ".$data['startDate'].", 
                                        endDate = ".$data['endDate']."
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Actualiza  los eventos de las cuotas
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateFinancingEvent($data){
            $db = new DbHandler;

            $data['start'] = cleanStr($data['start']);
            $data['end'] = cleanStr($data['end']);
            $data['financingEvent'] = cleanStr($data['financingEvent']);

            return $db->query(" UPDATE  Financing_Events
                                SET     start = ".$data['start'].", end = ".$data['end']."
                                WHERE   ID = " . $data['financingEvent']);
        }
        
        /**
         * Elimina una financiación
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $leavingDate = time();
            $result = $db->query("  UPDATE  Financing f
                                    SET     f.leavingDate = '" . $leavingDate . "'
                                    WHERE   f.ID= " . $data . "");     
            if($result){
                return  $db->query("    UPDATE  Financing_Events fe
                                        SET     fe.leavingDate = '" . $leavingDate . "'
                                        WHERE   fe.financingID= " . $data . "");
            }else{
                return $result;
            }       
        }

        /**
         *Elimina una financiación
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function deleteCuota($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            return $db->query(" DELETE FROM Financing_Cuotas WHERE ID = $data");
        }

        /**
         * Actualiza una financiación
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function getCuotas($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      * 
                                    FROM        Financing_Cuotas fc
                                    WHERE       fc.financing = " . $data . "
                                    ORDER BY    fc.startDate");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Actualiza una financiación
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function getCuota($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  * 
                                    FROM    Financing_Cuotas fc
                                    WHERE   fc.ID = " . $data . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Busca los destinos por el nombre
         * 
         * @param string $data
         * 
         * @return array
         */
        public function searchDestinationByName($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      fd.ID, fd.name
                                    FROM        Financing_Destinations fd
                                    WHERE       fd.name LIKE '%". $data ."%'
                                    ORDER BY    fd.name");
            
            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Busca los métodos de pago por el nombre
         * 
         * @param string $data
         * 
         * @return array
         */
        public function searchPayMethodsByName($data){
            $db = new DbHandler;
            
            $data = cleanStr($data);

            $result = $db->query("  SELECT  fd.ID, fd.name
                                    FROM    Financing_Methods fd
                                    WHERE   fd.name LIKE '%". $data ."%'");
            
            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }
        
        /**
         * Busca los métodos de pago por el nombre
         * 
         * @param string $data
         * 
         * @return array
         */
        public function searchFinanceCentersByName($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      m.ID, m.name
                                    FROM        Cost_Center m
                                    WHERE       m.name LIKE '%". $data ."%' AND m.leavingDate IS NULL
                                    ORDER BY    m.name");
            
            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
        * Lista los eventos
        *
        * @return array
        */
        public function listEvents(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  fe.ID as id, fe.name as title, from_unixtime(fe.start, '%Y-%m-%d %H:%i:%s') as start, from_unixtime(fe.start + 3600, '%Y-%m-%d %H:%i:%s') as end,
                                            es.ID as statusID, es.name as statusName, es.borderColor, es.backgroundColor,
                                            fc.financing AS financingID, f.type
                                    FROM    Financing_Events fe, Events_Status es, Financing_Cuotas fc, Financing f
                                    WHERE   fe.status = es.ID AND 
                                            fe.ID = fc.event AND
                                            fe.leavingDate IS NULL AND
                                            fc.financing = f.ID");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }
        /**
        * Lista los eventos de las financiaciones y facturas recibidas
        *
        * @return array
        */
        public function listPaymentEvents(){
            $db = new DbHandler;

            $result1 = $db->query(" SELECT  fe.ID as id, fe.name as title, from_unixtime(fe.start, '%Y-%m-%d %H:%i:%s') as start, from_unixtime(fe.start + 3600, '%Y-%m-%d %H:%i:%s') as end,
                                            es.ID as statusID, es.name as statusName, es.borderColor, es.backgroundColor,
                                            fc.financing AS financingID, f.type, '0' as eventype
                                    FROM    Financing_Events fe, Events_Status es, Financing_Cuotas fc, Financing f
                                    WHERE   fe.status = es.ID AND 
                                            fe.ID = fc.event AND
                                            fe.leavingDate IS NULL AND
                                            fc.financing = f.ID ");
            if(mysqli_num_rows($result1) == 0){
				$financing = null;
			}else{
				$financing = $db->resultToArray($result1);
			}

            $result2 = $db->query(" SELECT  rie.ID as id, rie.name as title, from_unixtime(rie.start, '%Y-%m-%d %H:%i:%s') as start, from_unixtime(rie.start + 3600, '%Y-%m-%d %H:%i:%s') as end, 
                                            es.ID as statusID, es.name as statusName, es.borderColor, es.backgroundColor, rie.invoice AS financingID, '4' as type, '1' as eventype,
                                            DATE(from_unixtime(rie.start, '%Y-%m-%d %H:%i:%s')) AS ALGO,
                                            ri.invoiceNumber as item_search,
                                            ri.date as item_date_search
                                    FROM    Received_Invoices_Events rie, Events_Status es, Received_Invoices ri
                                    WHERE   rie.status = es.ID AND 
                                            rie.invoice = ri.ID AND
                                            rie.leavingDate IS NULL AND
                                            DATE(from_unixtime(rie.start, '%Y-%m-%d %H:%i:%s')) != '1970-01-01' AND
                                            DATE(from_unixtime(rie.start + 3600, '%Y-%m-%d %H:%i:%s')) != '1970-01-01'");

            if(mysqli_num_rows($result2) == 0){
                $invoices = null;
            }else{
                $invoices = $db->resultToArray($result2);
            }
            
            $res = array(); 
            if($financing != null && $invoices != null){
                $res = array_merge($financing, $invoices);
            }else{
                if($financing != null){
                    $res = $financing;
                }else{
                    $res = $invoices;
                }
            }

            return $res;
        }

        /**
        * Lista los eventos
        *
        * @return array
        */
        public function countByThisYear(){
            $db = new DbHandler;

            $result = $db->query("SELECT COUNT(*) AS numFinancings
                                    FROM Financing
                                   WHERE YEAR(FROM_UNIXTIME(startDate)) = " . date("Y"). "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result)[0]['numFinancings'];
			}
        }

        /**
        * Obtiene los expedientes facturados en el rango de fechas para el cliente(Particulaes, distintas empresas)
        *
        * @param array $data
        */
        public function getFinancingsCash($from, $to){
            $db = new DbHandler;

            $from = cleanStr($from);
            $to = cleanStr($to);

            $result = $db->query("  SELECT      f.name AS name, f.startDate AS date, f.endDate AS expiration, 'Financiación' AS description, 
                                                f.initialCapital + f.initialCapital * SUM(fc.interest)/COUNT(fc.interest) / 100 AS import, fm.name AS pago
                                    FROM        Financing f, Financing_Cuotas fc, Financing_Methods fm
                                    WHERE       f.ID = fc.financing AND 
                                                f.payMethod = fm.ID AND f.startDate BETWEEN " . $from . " AND " . $to . "
                                    GROUP BY    f.ID");            
            $res = $db->resultToArray($result);

            return mysqli_num_rows($result) > 0 ? $res : null;
        }

        /**
         * Obtiene los datos de la financiación para generar el pdf
         * 
         * @param int $id ID de la financiación
         * @return array
         */
        public function getFinanciacion($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  f.*, fd.name as fdName, fm.name as fmName, m.name as mName
                                    FROM    Financing f, Financing_Destinations fd, Financing_Methods fm, Mortuaries m
                                    WHERE   f.destination = fd.ID AND
                                            f.payMethod = fm.ID AND
                                            f.financeCenter = m.mortuaryID AND
                                            f.ID = $id");

            mysqli_num_rows($result) == 0 ? $financing = null : $financing = $db->resultToArray($result)[0];

            $result = $db->query("  SELECT  interest, startDate, endDate, payDate, cuote, amortization, pendingCapital, payDate
                                    FROM    Financing_Cuotas
                                    WHERE   financing = $id");

            mysqli_num_rows($result) == 0 ? $financingFees = null : $financingFees = $db->resultToArray($result);

            return array($financing, $financingFees);
        }

        /**
         * Actualiza  el capital pendiente de una financiacion y el capital amortizado
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateFinancingPendingCapital($data){
            $db = new DbHandler;

            $data['pendingCapital'] = cleanStr($data['pendingCapital']);
            $data['amortization'] = cleanStr($data['amortization']);
            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Financing
                                SET     pendingCapital = ".$data['pendingCapital'].",
                                        amortizedCapital = ".$data['amortization']."
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Actualiza  la cantidad amortizada manualmente en una cuota
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateExtraAmortization($data){
            $db = new DbHandler;

            $data['extraAmortization'] = cleanStr($data['extraAmortization']);
            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Financing_Cuotas
                                SET     extraAmortization = ".$data['extraAmortization']."                                 
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Obtener la ultima cuota pagada
         * 
         * @param int $idFinancing
         * 
         * @return int
         */
        public function getLAstCuotaPayed($idFinancing){
            $db = new DbHandler;

            $idFinancing = cleanStr($idFinancing);

            $result =  $db->query(" SELECT  MAX(ID) AS ID
                                    FROM    Financing_Cuotas
                                    WHERE   financing = $idFinancing AND payDate IS NOT NULL");

            mysqli_num_rows($result) == 0 ? $cuota = null : $cuota = $db->resultToArray($result)[0]['ID'];
            return $cuota;
        }

        /**
         * Actualizar el capital pendiente en la ultima cuota pagada
         * 
         * @param int $lastPayedCuote, $pendingCapital
         * 
         * @return bool
         */
        public function updatePendingCapitalLastCuote($lastPayedCuote, $pendingCapital){
            $db = new DbHandler;

            $lastPayedCuote = cleanStr($lastPayedCuote);
            $pendingCapital = cleanStr($pendingCapital);

            return $db->query(" UPDATE  Financing_Cuotas
                                SET     pendingCapital = $pendingCapital                                 
                                WHERE   ID = $lastPayedCuote");
        }

        /*
        * Obtiene la financiación
        *
        * @return array
        */
        public function listFinancingDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      f.ID, f.name, f.providerEntity, fd.name, f.startDate, f.endDate, f.term, f.pendingFee, f.amortization, 
                                                f.initialCapital, f.amortizedCapital, f.pendingCapital, fm.name, m.name
                                    FROM        Financing f
                                    LEFT JOIN   Financing_Destinations fd ON f.destination = fd.ID
                                    LEFT JOIN   Financing_Methods fm ON f.payMethod = fm.ID
                                    LEFT JOIN   Mortuaries m ON f.financeCenter = m.mortuaryID
                                    WHERE       f.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }
    }
?>