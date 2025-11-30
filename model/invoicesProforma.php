<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class InvoicesProforma{
        
        /**
         * Crea una factura proforma
         *
         * @param array $data
         */
        public function create($data){
            $db = new DbHandler;

            $data['expedient'] = cleanStr($data['expedient']);
            $data['bruto'] = cleanStr($data['bruto']);
            $data['supplieds'] = cleanStr($data['supplieds']);
            $data['total'] = cleanStr($data['total']);
            $data['listIvas'] = (isset($data['listIvas']) && is_array($data['listIvas']) ? $data['listIvas'] : []);

            // Obtiene informacion del expediente
            $exp = $db->query(" SELECT  c.type as clientType,
                                        e.client,
                                        c.brandName,
                                        c.name,
                                        c.surname,
                                        e.deceasedName,
                                        e.deceasedSurname
                                FROM    Expedients e, Clients c
                                WHERE   e.client = c.clientID AND
                                        e.expedientID = " . $data['expedient']
            ); 
            $expedientInfo = $db->resultToArray($exp)[0]; 
            
            // Client name - brandname
            if($expedientInfo['clientType'] == 1){
                $clientName = $expedientInfo['name'];
            }else{
                if($expedientInfo['brandName'] == null || ($expedientInfo['brandName'] == '')){
                    $clientName = $expedientInfo['name'];
                }else{
                    $clientName = $expedientInfo['brandName'];
                }
            }

            // Client surname
            $clientSurname = null;
            if($expedientInfo['surname'] != null && $expedientInfo['surname'] != ''){
                $clientSurname = $expedientInfo['surname'];
            }

            // Deceased info
            $deceasedName = null;
            if($expedientInfo['deceasedName'] != null && $expedientInfo['deceasedName'] != ''){
                $deceasedName = $expedientInfo['deceasedName'];
            }
            $deceasedSurname = null;
            if($expedientInfo['deceasedSurname'] != null && $expedientInfo['deceasedSurname'] != ''){
                $deceasedSurname = $expedientInfo['deceasedSurname'];
            }
            
            $createYear = date('Y');
            $fecha = new DateTime();

            $result = $db->query("  SELECT  COUNT(*) as num
                                    FROM    Invoices_Proforma invprf
                                    WHERE   YEAR(FROM_UNIXTIME(invprf.creationDate)) = $createYear
            ");

            $numInvoice = 'PROF_';
            $resultInfo = $db->resultToArray($result);
            $numInvoice .= ($resultInfo[0]['num'] == 0 ? 1 : intval($resultInfo[0]['num']) + 1) . '/'. $createYear;

            $response = $db->query(
                "INSERT INTO Invoices_Proforma (
                    expedient, clientName, clientSurname, deceasedName, deceasedSurname,
                    user, creationDate,
                    supplieds, bruto, total,
                    numInvoice
                )
                VALUES(
                    " . $data['expedient'] . ", '" . $clientName . "', '" . $clientSurname . "', '" . $deceasedName . "', '" . $deceasedSurname . "',
                    " . $_SESSION['user'] . ", " . $fecha->getTimestamp() . ",
                    " . $data['supplieds'] . ", " . $data['bruto'] . ", '" . $data['total'] . "', 
                    '" . $numInvoice . "'
                )
            ");

            if($response){
                $expedientID = $data['expedient'];
                $invoiceProformaID = $db->getLastInsertId();

                $expedientDocsPath = "{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/expedients/$expedientID/docs/invoicesProforma/";
                if(!is_dir($expedientDocsPath)){
                    mkdir($expedientDocsPath, 0777, true);
                }

                $createDate = time();
                foreach($data['listIvas'] as $item){

                    $typeIva = floatval($item['type_iva']);
                    $base = floatval($item['base']);
                    $iva = floatval($item['iva']);

                    $response = $db->query(
                        "INSERT INTO Invoices_Proforma_Ivas(
                            expedient, invoice_proforma, typeIva, base, iva, createDate
                        )
                        VALUES(
                            " . $expedientID . ", " . $invoiceProformaID . ", " . $typeIva . ", " . $base . ", " . $iva . ", $createDate
                        )
                    ");
                    
                    if(!$response){
                        return [false];
                    }
                }

                return [true, $expedientID, $invoiceProformaID, $numInvoice];
            }else{
                return [false];
            }
        }

        /**
        * Obtiene el desglose de ivas de una factura proforma
        *
        * @param array $data
        */
        public function getInvoiceInfoEconomic($expedient, $invoiceID = null){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);

            $where = '';
            if($invoiceID != null){
                $where = " AND invprf.id = $invoiceID";
            }
            
            $result =  $db->query(" SELECT  invprf.*
                                    FROM    Invoices_Proforma invprf
                                    WHERE   invprf.expedient = " . $expedient .
                                            $where
            );

            if(mysqli_num_rows($result) > 0){
                $infoInvoice = $db->resultToArray($result)[0];

                $invoiceID = $infoInvoice['id'];

                $result =  $db->query(" SELECT  iv.typeIva as type_iva, iv.base, iv.iva
                                        FROM    Invoices_Proforma_Ivas iv
                                        WHERE   iv.deleteDate IS NULL AND
                                                iv.invoice_proforma = " . $invoiceID
                );

                $totalBases = 0;
                $totalIva = 0;
                if(mysqli_num_rows($result) > 0){
                    $listIvas = $db->resultToArray($result);
                    
                    foreach($listIvas as $index=> $elem){

                        $totalBases += floatval($elem['base']);
                        $totalIva += floatval($elem['iva']);

                        $listIvas[$index]['base'] = number_format(floatval($elem['base']), 2);
                        $listIvas[$index]['iva'] = number_format(floatval($elem['iva']), 2);
                    }
                }else{
                    $listIvas = [];
                }

                return ([
                    'bruto'=> number_format($infoInvoice['bruto'], 2), 
                    "suplidos"=> number_format($infoInvoice['supplieds'], 2), 
                    "listIvas" => $listIvas,
                    "total"=> number_format($infoInvoice['total'], 2),
                    "totalBases"=> number_format($totalBases, 2),
                    "totalIva"=> number_format($totalIva, 2),
                ]);
            }else{
                return ([
                    'bruto'=> number_format(0, 2), 
                    "suplidos"=> number_format(0, 2), 
                    "listIvas" => [],
                    "total"=> number_format(0, 2),
                    "totalBases"=> number_format(0, 2),
                    "totalIva"=> number_format(0, 2)
                ]);
            }
        }

        /**
         * Gets invoices proforma
         *
         * @return array
         */
        public function listDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      e.expedientID,
                                                ip.numInvoice, 
                                                e.number, 
                                                ip.creationDate,
                                                CONCAT(ip.clientName, ' ', IF(ip.clientSurname IS NULL, '', ip.clientSurname)),
                                                IF(
                                                    ip.deceasedName IS NULL OR ip.deceasedName = '',
                                                    '-',
                                                    CONCAT(ip.deceasedName, ' ', IF(ip.deceasedSurname IS NULL, '', ip.deceasedSurname))
                                                ),
                                                ip.total, 
                                                u.username, 
                                                ip.id, 
                                                e.tpv
                                    FROM        (Invoices_Proforma ip, Expedients e)
                                    LEFT JOIN   Users u ON ip.user = u.userID
                                    WHERE       ip.expedient = e.expedientID AND
                                                e.leavingDate IS NULL
            ");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }
    }
?>