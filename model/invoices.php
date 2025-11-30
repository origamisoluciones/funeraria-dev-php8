<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/verifactu.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Invoices{
        
        /**
         * Crea una factura
         *
         * @param array $data
         */
        public function create($data){
            $db = new DbHandler;

            // Inicia la transacción
            $db->query("START TRANSACTION");

            try {
                $data['expedient'] = cleanStr($data['expedient']);
                $data['billingSerie'] = cleanStr($data['billingSerie']);
                $data['rectifiedType'] = isset($data['rectifiedType']) && $data['rectifiedType'] != '' ? cleanStr($data['rectifiedType']) : 'null';
                $data['paymentMethod'] = cleanStr($data['paymentMethod']);
                $data['date'] = cleanStr($data['date']);
                $data['accountNumber'] = cleanStr($data['accountNumber']);
                $data['comments'] = cleanEditor($data['comments']);
                $data['bruto'] = cleanStr($data['bruto']);
                $data['supplieds'] = cleanStr($data['supplieds']);
                $data['total'] = cleanStr($data['total']);
                $data['listIvas'] = (isset($data['listIvas']) && is_array($data['listIvas']) ? $data['listIvas'] : []);

                $number = 0;
                $expNumYear = date('Y', $data['date']);
            
                /**
                 * Obtenemos la información del cliente del expediente
                 */
                $result = $db->query("  SELECT  e.client, c.brandName, c.name, c.surname, c.type as clientType, c.nif,
                                                bs.letter,
                                                (
                                                    SELECT  COALESCE(MAX(i.numInvoice), 0)
                                                    FROM	Invoices i
                                                    WHERE	i.leavingDate IS NULL AND
                                                            i.generatedInvoiceNumber LIKE '%/$expNumYear' AND
                                                            i.billingSerie = bs.id 
                                                ) as last_number,
                                                (
                                                    SELECT  MAX(eh.num_hiring)
                                                    FROM    Expedients_Hirings eh
                                                    WHERE   eh.expedient = e.expedientID
                                                ) as max_num_hiring,
                                                st.value as verifactu_mode
                                        FROM    Expedients e, Clients c, Billing_Series bs, Settings st
                                        WHERE   e.expedientID = {$data['expedient']} AND 
                                                e.client = c.clientID AND
                                                bs.id = {$data['billingSerie']} AND
                                                st.name = 'verifactu'
                ");
            
                if(mysqli_num_rows($result) == 0){
                    throw new Exception('Error al obtener información para la factura');
                }
                $result = $db->resultToArray($result)[0];

                // Client id
                $client = $result['client'];
                // Client name - brandname
                if($result['clientType'] == 1){
                    $clientName = $result['name'] . ' ' . $result['surname'];
                }else{
                    if($result['brandName'] == null || ($result['brandName'] == '')){
                        $clientName = $result['name'] . ' ' . $result['surname'];
                    }else{
                        $clientName = $result['brandName'];
                    }
                }
                // Client nif
                $clientNif = $result['nif'];

                // Billing serie letter
                $letter = $result['letter'];
                $lastNumberInvoice = $result['last_number'];
                $number = intval($lastNumberInvoice) + 1;
                $genInvoiceNumber = "$letter-$number/$expNumYear";
                $verifactuActivated = intval($result['verifactu_mode']);
                $numHiringInvoice = intval($result['max_num_hiring']);

                if($lastNumberInvoice + 1 != $number) {
                    throw new Exception('Error en la secuencia de numeración');
                }

                // Obtener el tipo de impuesto de la compañía
                $resultSettings = $db->query("  SELECT  st.value as tax_type
                                                FROM    Settings st
                                                WHERE   st.name = 'ivaType'
                ");

                if(mysqli_num_rows($resultSettings) == 0){
                    throw new Exception('Error al obtener información del tipo de impuesto de la compañía');
                }
                $resultSettings = $db->resultToArray($resultSettings)[0];

                $taxType = intval($resultSettings['tax_type']);
                $taxTypeVerifactu = '01';
                if($taxType == '1'){ // IVA
                    $taxTypeVerifactu = '01';
                }else if($taxType == '2'){ // IGIC
                    $taxTypeVerifactu = '03';
                }else if($taxType == '3'){ // IPSI
                    $taxTypeVerifactu = '02';
                }

                // En base a la serie de facturación que viene, comprobamos si es una serie correspondiente a una factura rectificativa o a una factura normal
                $result = $db->query("  SELECT  bs.verifactu_code,
                                                bs.serie_rectified
                                        FROM    Billing_Series bs
                                        WHERE   bs.id = {$data['billingSerie']}
                ");

                if(mysqli_num_rows($result) == 0){
                    throw new Exception('Error al obtener información de la serie de facturacion');
                }
                $result = $db->resultToArray($result)[0];

                $verifactuInvoiceCode = $result['verifactu_code'];
                $isRectified = ($result['serie_rectified'] == null ? 1 : 0);

                /**
                 * En caso de que sea una factura rectificada, es buscar para su serie original la informacion de la factura
                 */
                $invoiceType = 1;
                $originalInvoice = 'null';
                $originalInvoiceNumber = null;
                $originalInvoiceNumHiring = null;
                if($isRectified){

                    if(intval($data['rectifiedType']) == 1){ // Sustitución -> Hace referencia a la anterior
                        $result = $db->query("  SELECT      i.ID, i.generatedInvoiceNumber, i.num_hiring
                                                FROM        Invoices i
                                                WHERE       i.expedient = {$data['expedient']} AND 
                                                            i.leavingDate IS NULL AND
                                                            i.invoice_type != 3
                                                ORDER BY    i.ID DESC

                        ");
                    }else{ // Diferencias -> Hace referencia a todas las facturas involucradas (Original + Diferencias o Ultima sustitutiva + Diferencias)
                        $result = $db->query("  SELECT      i.ID, i.generatedInvoiceNumber, i.num_hiring
                                                FROM        Invoices i
                                                WHERE       i.expedient = {$data['expedient']} AND 
                                                            i.leavingDate IS NULL AND
                                                            i.invoice_type != 3 AND
                                                            (i.rectified_type IS NULL OR i.rectified_type != 2)
                                                ORDER BY    i.ID DESC
                        ");
                    }

                    if(mysqli_num_rows($result) == 0){
                        throw new Exception('Error al obtener informacion de la factura original a rectificar');
                    }

                    $result = $db->resultToArray($result)[0];

                    $originalInvoice = $result['ID'];
                    $originalInvoiceNumber = $result['generatedInvoiceNumber'];
                    $originalInvoiceNumHiring = $result['num_hiring'];

                    $invoiceType = 2;
                }

                // Generate invoice
                $response = $db->query(
                    "INSERT INTO Invoices (
                        expedient, user, billingSerie, 
                        client, clientName, clientNif,
                        creationDate, paymentState, paymentDate, paymentMethod, 
                        base10, base21, iva10, iva21, supplieds, bruto, total,
                        comments, accountNumber, numInvoice, generatedInvoiceNumber, num_hiring,
                        original_invoice_rectified, rectified_type, invoice_type,
                        createDate
                    )
                    VALUES(
                        " . $data['expedient'] . ", " . $_SESSION['user'] . ", " . $data['billingSerie'] . ",
                        $client, '" . $clientName . "', '" . $clientNif . "',
                        " . $data['date'] . ", 0, null, '" . $data['paymentMethod'] . "', 
                        0,0,0,0," . $data['supplieds'] . ", " . $data['bruto'] . ", '" . $data['total'] . "',
                        '" . $data['comments'] . "', '" . $data['accountNumber'] . "', ".$number.",'".$genInvoiceNumber."', $numHiringInvoice,
                        $originalInvoice, " . $data['rectifiedType'] . ", $invoiceType,
                        '" . date('Y-m-d H:i:s') . "'
                    )
                ");
                
                if(!$response){
                    throw new Exception('Error al generar la factura en la BD');
                }

                $expedientID = $data['expedient'];
                $invoiceID = $db->getLastInsertId();
                $createDate = time();
                
                // Draw expedient note
                if($data['comments'] != null && $data['comments'] != ''){
                    $response = $db->query("  
                            INSERT INTO Expedients_Notes(user, expedient, section, note, create_date)
                            VALUES ({$_SESSION['user']}, $expedientID, 0, '{$data['comments']}', $createDate)");
    
                    if(!$response){
                        throw new Exception('Error al añadir la nota al Expediente');
                    }
                }

                // Generate Invoices IVAS
                foreach($data['listIvas'] as $indexIva=>$item){

                    $typeIva = floatval($item['type_iva']);
                    $base = floatval($item['base']);
                    $iva = floatval($item['iva']);

                    $response = $db->query(
                        "INSERT INTO Invoices_Ivas(
                            expedient, invoice, typeIva, base, iva, createDate
                        )
                        VALUES(
                            " . $expedientID . ", " . $invoiceID . ", " . $typeIva . ", " . $base . ", " . $iva . ", $createDate
                        )
                    ");
                }

                // Generate invoice folder to PDF
                $invoicePath = "{$_SESSION['basePath']}/resources/files/{$_SESSION['company']}/expedients/$expedientID/docs/invoices/$invoiceID/";
                if(!is_dir($invoicePath)){
                    mkdir($invoicePath, 0777, true);
                }

                // Generamos la información para el envio de facturas a VERIFACTU asi como la descripcion de la factura
                if($isRectified){ // FACTURA RECTIFICADA

                    $rectificateInvoice = null;
                    $rectificateTypeTexts = '';
                    $rectificateTypeVerifactu = '';

                    if($data['rectifiedType'] == 1){
                        $rectificateTypeTexts = 'sustitución';
                        $rectificateTypeVerifactu = 1;
                        
                        // Obtenemos la informacion de la factura a rectificar
                        $result = $db->query("  SELECT  i.generatedInvoiceNumber, i.total, i.creationDate,
                                                        i.verifactu_hash, i.verifactu_csv,
                                                        (
                                                            SELECT  COALESCE(SUM(iniv.iva), 0)
                                                            FROM    Invoices_Ivas iniv
                                                            WHERE   iniv.deleteDate IS NULL AND
                                                                    iniv.invoice = i.ID
                                                        ) as total_iva
                                                FROM	Invoices i
                                                WHERE   i.ID = $originalInvoice
                        ");

                        if(mysqli_num_rows($result) > 0){
                            $result = $db->resultToArray($result)[0];
                            $rectifiedInvoiceNum = $result['generatedInvoiceNumber'];
                            $rectifiedInvoiceDate = $result['creationDate'];
                            $rectifiedInvoiceHash = $result['verifactu_hash'];
                            $rectifiedInvoiceCsv = $result['verifactu_csv'];
                            $rectifiedInvoiceTotal = $result['total'];
                            $rectifiedInvoiceTotalIva = $result['total_iva'];

                            $rectificateInvoice = [
                                'billNumber' => $rectifiedInvoiceNum,
                                'date' => date('d-m-Y', $rectifiedInvoiceDate),
                                'hash' => $rectifiedInvoiceHash,
                                'import' => floatval($rectifiedInvoiceTotal),
                                'quote' => floatval($rectifiedInvoiceTotalIva),
                                'csv' => $rectifiedInvoiceCsv
                            ];

                            $descriptionVerifactu = 'Factura rectificativa por '.$rectificateTypeTexts.' de la factura '.$rectifiedInvoiceNum.' con fecha ' . date('d/m/Y', $rectifiedInvoiceDate);
                        }else{
                            throw new Exception('Error al obtener la información de la factura a rectificar');
                        }
                    }else{
                        $rectificateTypeTexts = 'diferencias';
                        $rectificateTypeVerifactu = 0;
                        
                        // Obtenemos la informacion de las factura a rectificar
                        $result = $db->query("  SELECT      i.generatedInvoiceNumber, i.total, i.creationDate,
                                                            i.verifactu_hash, i.verifactu_csv,
                                                            (
                                                                SELECT  COALESCE(SUM(iniv.iva), 0)
                                                                FROM    Invoices_Ivas iniv
                                                                WHERE   iniv.deleteDate IS NULL AND
                                                                        iniv.invoice = i.ID
                                                            ) as total_iva
                                                FROM	    Invoices i
                                                WHERE       i.expedient = $expedientID AND 
                                                            (i.ID = $originalInvoice OR i.original_invoice_rectified = $originalInvoice) AND
                                                            i.ID != $invoiceID AND
                                                            i.leavingDate IS NULL AND
                                                            i.invoice_type != 3
                                                ORDER BY    i.creationDate ASC
                        ");
                        
                        $descriptionVerifactu = 'Factura rectificativa por '.$rectificateTypeTexts;
                        if(mysqli_num_rows($result) > 0){
                            $invoicesRectifies = $db->resultToArray($result);

                            $rectificateInvoice = [];

                            if(count($invoicesRectifies) > 1){
                                $descriptionVerifactu .= ' (' . count($invoicesRectifies) . 'ª  rectificación)';
                            }

                            foreach($invoicesRectifies as $indexItemRecti => $itemRecti){
                                $rectifiedInvoiceNum = $itemRecti['generatedInvoiceNumber'];
                                $rectifiedInvoiceDate = $itemRecti['creationDate'];
                                $rectifiedInvoiceHash = $itemRecti['verifactu_hash'];
                                $rectifiedInvoiceCsv = $itemRecti['verifactu_csv'];
                                $rectifiedInvoiceTotal = $itemRecti['total'];
                                $rectifiedInvoiceTotalIva = $itemRecti['total_iva'];

                                $rectificateInvoice[$indexItemRecti] = [
                                    'billNumber' => $rectifiedInvoiceNum,
                                    'date' => date('d-m-Y', $rectifiedInvoiceDate),
                                    'hash' => $rectifiedInvoiceHash,
                                    'import' => floatval($rectifiedInvoiceTotal),
                                    'quote' => floatval($rectifiedInvoiceTotalIva),
                                    'csv' => $rectifiedInvoiceCsv
                                ];

                                if($indexItemRecti == 0){
                                    $descriptionVerifactu .= ' de la factura '.$rectifiedInvoiceNum.' con fecha ' . date('d/m/Y', $rectifiedInvoiceDate);
                                }
                            }
                        }else{
                            throw new Exception('Error al obtener la información de las facturas a rectificar');
                        }
                    }

                }else{ // FACTURA NORMAL
                    $descriptionVerifactu = 'Prestación de servicios funerarios.';
                }

                $response = $db->query("UPDATE  Invoices i
                                        SET     description = '" . $descriptionVerifactu . "'
                                        WHERE   ID = " . $invoiceID
                );
                if($response === false){
                    throw new Exception('Error al actualizar la descripción de la factura');
                }

                // Send to VERIFACTU
                if($verifactuActivated === 1){
                    $verifactuConnector = new Verifactu;

                    // Get company info
                    require_once($_SESSION['basePath'] . "model/settings.php");
                    $settings = new Settings;
                    $companyID = $_SESSION['company'];
                    $companyName = $settings->getCompanyName();
                    $companyNif = $settings->getCompanyNIF();

                    // Obtenemos el desglose de los IVAs
                    $verifactuDetails = array();
                    $result = $db->query("  SELECT      iv.typeIva as iva,
                                                        iv.base as import,
                                                        iv.iva as quote
                                            FROM        Invoices_Ivas iv
                                            WHERE       iv.expedient = $expedientID AND 
                                                        iv.invoice = $invoiceID AND
                                                        iv.deleteDate IS NULL
                                            ORDER BY    iv.typeIva ASC
                    ");
                    $verifactuDetails = $db->resultToArray($result);

                    // Send suppliers like IVA 0%
                    if($data['supplieds'] != null && $data['supplieds'] != '' && $data['supplieds'] > 0){
                        if(!empty($verifactuDetails) && intval($verifactuDetails[0]['iva']) === 0){
                            $verifactuDetails[0]['import'] += floatval($data['supplieds']);
                        }else{
                            array_unshift(
                                $verifactuDetails, 
                                [
                                    "iva" => 0,
                                    "import" => $data['supplieds'],
                                    "quote" => 0
                                ]
                            );
                        }
                    }

                    // Obtenemos informacion de la factura anterior para esa misma serie
                    $lastInvoice = null;
                    $result = $db->query("  SELECT      i.generatedInvoiceNumber, i.total, i.creationDate,
                                                        i.verifactu_hash, i.verifactu_csv,
                                                        (
                                                            SELECT  COALESCE(SUM(iniv.iva), 0)
                                                            FROM    Invoices_Ivas iniv
                                                            WHERE   iniv.deleteDate IS NULL AND
                                                                    iniv.invoice = i.ID
                                                        ) as total_iva
                                            FROM	    Invoices i
                                            WHERE       i.leavingDate IS NULL AND
                                                        i.verifactu_hash IS NOT NULL
                                            ORDER BY    i.ID DESC
                                            LIMIT 1
                    ");
                    
                    if(mysqli_num_rows($result) > 0){
                        $result = $db->resultToArray($result)[0];
                        $lastInvoiceNum = $result['generatedInvoiceNumber'];
                        $lastInvoiceDate = $result['creationDate'];
                        $lastInvoiceHash = $result['verifactu_hash'];
                        $lastInvoiceCsv = $result['verifactu_csv'];
                        $lastInvoiceTotal = $result['total'];
                        $lastInvoiceTotalIva = $result['total_iva'];

                        $lastInvoice = [
                            'billNumber' => $lastInvoiceNum,
                            'date' => date('d-m-Y', $lastInvoiceDate),
                            'hash' => $lastInvoiceHash,
                            'import' => floatval($lastInvoiceTotal),
                            'quote' => floatval($lastInvoiceTotalIva),
                            'csv' => $lastInvoiceCsv
                        ];
                    }

                    // Send info to VERIFACTU
                    if($isRectified){ // FACTURA RECTIFICADA
                        $response = $verifactuConnector->rectificateBill(
                            $companyID,
                            $companyName,
                            $companyNif,
                            $genInvoiceNumber,
                            $descriptionVerifactu,
                            $verifactuInvoiceCode,
                            $clientName,
                            $clientNif,
                            $verifactuDetails,
                            $invoicePath,
                            $data['date'],
                            0,
                            $taxTypeVerifactu,
                            $lastInvoice,
                            $rectificateInvoice,
                            $rectificateTypeVerifactu
                        );
                    }else{ // FACTURA NORMAL
                        $response = $verifactuConnector->createBill(
                            $companyID,
                            $companyName,
                            $companyNif,
                            $genInvoiceNumber,
                            $descriptionVerifactu,
                            $verifactuInvoiceCode,
                            $clientName,
                            $clientNif,
                            $verifactuDetails,
                            $invoicePath,
                            $data['date'],
                            0,
                            $taxTypeVerifactu,
                            $lastInvoice
                        );
                    }

                    if(isset($response['status']) && $response['status'] != null){

                        $errorVerifactu = null;
                        if($response['error'] != null && $response['error'] != ''){
                            $errorVerifactu = $response['error'];
                        }
                        $errorDescriptionVerifactu = null;
                        if($response['error_description'] != null && $response['error_description'] != ''){
                            $errorDescriptionVerifactu = $response['error_description'];
                        }
                        $xmlVerifactu = null;
                        if($response['xml'] != null){
                            $xmlVerifactu = $response['xml'];
                        }

                        $db->query("UPDATE  Invoices i
                                    SET     verifactu_hash = '" . $response['footprint'] . "',
                                            verifactu_csv = '" . $response['csv'] . "',
                                            verifactu_error = '" . $errorVerifactu . "',
                                            verifactu_error_description = '" . $errorDescriptionVerifactu . "',
                                            verifactu_xml = '" . $xmlVerifactu . "'
                                    WHERE   ID = " . $invoiceID
                        );
                    }else{
                        throw new Exception('Error al enviar la factura a la AET: ' . $response['error_description']);
                    }
                }

                // Update Expedient status to 'Facturado' and set new invoice status
                $nextInvoiceStatus = 1;
                $statusExpedient = 4;
                $db->query("UPDATE  Expedients
                            SET     next_invoice_status = $nextInvoiceStatus,
                                    status = $statusExpedient
                            WHERE   expedientID = " . $expedientID);

                // Confirma la transacción
                $db->query("COMMIT");

                return [
                    "status" => true,
                    "expedientID" => $expedientID,
                    "invoiceID" => $invoiceID,
                    "invoiceNumber" => str_replace("/", "-", $genInvoiceNumber),
                    "invoiceRectifiedID" => $originalInvoice,
                    "invoiceRectifiedNumber" => str_replace("/", "-", $originalInvoiceNumber),
                    "invoiceRectifiedNumHiring" => $originalInvoiceNumHiring,
                ];

            }catch (Exception $e) {
                $db->query("ROLLBACK");

                return [
                    "status" => false,
                    "error" => $e->getMessage()
                ];
            }
        }

        /**
         * Anular una factura en la AET
         *
         * @param array $data
         */
        public function anuled($data){
            $db = new DbHandler;

            // Inicia la transacción
            $db->query("START TRANSACTION");

            try {
                $expedientID = cleanStr($data['expedient']);
                $data['reason'] = cleanEditor($data['reason']);
            
                $result = $db->query("  SELECT      i.ID as invoiceID,
                                                    i.generatedInvoiceNumber as anuledInvoiceNumber,
                                                    i.creationDate, 
                                                    i.num_hiring,
                                                    i.billingSerie
                                        FROM        Invoices i
                                        WHERE       i.expedient = $expedientID AND 
                                                    i.leavingDate IS NULL AND
                                                    i.invoice_type != 3
                                        ORDER BY    i.ID DESC
                ");
            
                if(mysqli_num_rows($result) == 0){
                    throw new Exception('Error al obtener información para la factura');
                }
                $result = $db->resultToArray($result)[0];

                $anuledInvoiceNumber = $result['anuledInvoiceNumber'];
                $anuledInvoiceDate = $result['creationDate'];
                $invoiceID = $result['invoiceID'];
                $invoiceNumHiring = $result['num_hiring'];
                $billingSerie = $result['billingSerie'];

                // Get last invoice status
                $result = $db->query("  SELECT      COALESCE(i.invoice_type, 1) as invoice_type
                                        FROM        Invoices i
                                        WHERE       i.expedient = $expedientID AND 
                                                    i.leavingDate IS NULL AND 
                                                    i.invoice_type != 3
                                        ORDER BY    i.ID DESC
                ");
                if(mysqli_num_rows($result) == 0){
                    throw new Exception('Error al obtener información de la ultima factura');
                }
                $result = $db->resultToArray($result)[0];
                $invoice_type = $result['invoice_type'];

                // Update Expedient status to 'Facturado' and set new invoice status
                $nextInvoiceStatus = $invoice_type == 1 ? 0 : 1;
                $db->query("UPDATE  Expedients
                            SET     next_invoice_status = $nextInvoiceStatus
                            WHERE   expedientID = " . $expedientID);

                // Update cancel invoice data
                $cancelDate = time();
                $userCancel = $_SESSION['user'];
                $reasonCancel = $data['reason'];

                // Update cancel status
                $db->query("UPDATE  Invoices
                            SET     invoice_type = 3,
                                    anuledDate = $cancelDate,
                                    anuledUser = $userCancel,
                                    anuledReason = '" . $reasonCancel . "'
                            WHERE   ID = " . $invoiceID
                );

                // Draw expedient note
                $response = $db->query("  INSERT INTO Expedients_Notes(user, expedient, section, note, create_date)
                                    VALUES ({$_SESSION['user']}, $expedientID, 0, '$reasonCancel', $cancelDate)");

                if(!$response){
                    throw new Exception('Error al añadir la nota al Expediente');
                }

                $result = $db->query("      SELECT      st.value as verifactu_mode
                                            FROM        Settings st
                                            WHERE       st.name = 'verifactu'
                ");
                if(mysqli_num_rows($result) == 0){
                    throw new Exception('Error al obtener si VERIFACTU esta activado');
                }
                $result = $db->resultToArray($result)[0];
                $verifactuActivated = $result['verifactu_mode'];

                // Reset hiring stock
                require_once($_SESSION['basePath'] . "model/expedients.php");
                $expedients = new Expedients();
                $response = $expedients->updateHiringStock($expedientID, 0, $invoiceNumHiring);

                // Send to VERIFACTU
                if($verifactuActivated == 1){

                    $verifactuConnector = new Verifactu;
    
                    // Get company info
                    require_once($_SESSION['basePath'] . "model/settings.php");
                    $settings = new Settings;
                    $companyID = $_SESSION['company'];
                    $companyName = $settings->getCompanyName();
                    $companyNif = $settings->getCompanyNIF();
    
                    // Obtenemos informacion de la factura anterior para esa misma serie
                    $lastInvoice = null;
                    $result = $db->query("  SELECT      i.generatedInvoiceNumber, i.total, i.creationDate,
                                                        i.verifactu_hash, i.verifactu_csv,
                                                        (
                                                            SELECT  COALESCE(SUM(iniv.iva), 0)
                                                            FROM    Invoices_Ivas iniv
                                                            WHERE   iniv.deleteDate IS NULL AND
                                                                    iniv.invoice = i.ID
                                                        ) as total_iva
                                            FROM	    Invoices i
                                            WHERE       i.leavingDate IS NULL AND
                                                        i.verifactu_hash IS NOT NULL
                                            ORDER BY    i.ID DESC
                                            LIMIT 1
                    ");
                    
                    if(mysqli_num_rows($result) > 0){
                        $result = $db->resultToArray($result)[0];
                        $lastInvoiceNum = $result['generatedInvoiceNumber'];
                        $lastInvoiceDate = $result['creationDate'];
                        $lastInvoiceHash = $result['verifactu_hash'];
                        $lastInvoiceCsv = $result['verifactu_csv'];
                        $lastInvoiceTotal = $result['total'];
                        $lastInvoiceTotalIva = $result['total_iva'];
    
                        $lastInvoice = [
                            'billNumber' => $lastInvoiceNum,
                            'date' => date('d-m-Y', $lastInvoiceDate),
                            'hash' => $lastInvoiceHash,
                            'import' => floatval($lastInvoiceTotal),
                            'quote' => floatval($lastInvoiceTotalIva),
                            'csv' => $lastInvoiceCsv
                        ];
                    }
    
                    // Send info to VERIFACTU
                    $response = $verifactuConnector->cancelBill(
                        $companyID,
                        $companyName, 
                        $companyNif, 
                        $anuledInvoiceNumber, 
                        $data['reason'],
                        $anuledInvoiceDate, 
                        $lastInvoice
                    );

                    if(isset($response['status']) && $response['status'] != null){
    
                        $errorVerifactu = null;
                        if($response['error'] != null){
                            $errorVerifactu = $response['error'];
                        }
                        $errorDescriptionVerifactu = null;
                        if($response['error_description'] != null){
                            $errorDescriptionVerifactu = $response['error_description'];
                        }
                        $xmlVerifactu = null;
                        if($response['xml'] != null){
                            $xmlVerifactu = $response['xml'];
                        }
    
                        $db->query("UPDATE  Invoices i
                                    SET     verifactu_hash = '" . $response['footprint'] . "',
                                            verifactu_csv = '" . $response['csv'] . "',
                                            verifactu_error = '" . $errorVerifactu . "',
                                            verifactu_error_description = '" . $errorDescriptionVerifactu . "',
                                            verifactu_xml = '" . $xmlVerifactu . "'
                                    WHERE   ID = " . $invoiceID
                        );
                    }else{
                        throw new Exception('Error al anular la factura en la AET: ' . $response['error_description']);
                    }
                }

                // Confirma la transacción
                $db->query("COMMIT");

                return [
                    "status" => true,
                    "expedientID" => $expedientID,
                    "invoiceID" => $invoiceID,
                    "invoiceNumber" => str_replace("/", "-", $anuledInvoiceNumber)
                ];

            } catch (Exception $e) {
                $db->query("ROLLBACK");

                return [
                    "status" => false,
                    "error" => $e->getMessage()
                ];
            }
        }

        /**
        * Comprueba si existe la factura
        *
        * @param array $data
        */
        public function exist($data){
            $db = new DbHandler;

            if(!isset($data['expedient'])){
                $expedient = cleanStr($data);
            }else{
                $expedient = cleanStr($data['expedient']);
            }

            $numHiring = cleanStr($data['numHiring']);
                
            $result =  $db->query(" SELECT  i.*
                                    FROM    Invoices i
                                    WHERE   i.expedient = " . $expedient . " AND 
                                            i.leavingDate IS NULL AND
                                            i.num_hiring = $numHiring
            ");

            return mysqli_num_rows($result) > 0 ? true : false;
        } 

        /**
        * Actualiza una factura como cobrada
        *
        * @param array $data
        */
        public function update($data){
            $db = new DbHandler;

            $data['paymentMethod'] = cleanStr($data['paymentMethod']);
            $data['accountNumber'] = cleanStr($data['accountNumber']);
            $data['amountPay'] = cleanStr($data['amountPay']);
            $data['paymentDate'] = cleanStr($data['paymentDate']);
            $data['invoice'] = cleanStr($data['invoice']);
            $data['comments'] = cleanEditor($data['comments']);

            $result = $db->query("  INSERT INTO Invoices_Payments(invoice, date, amount)
                                    VALUES(" . $data['invoice'] . ", '" . $data['paymentDate'] . "', " . $data['amountPay'] . ")");

            if($result){
                $invoicePaymentID = $db->getLastInsertId();

                $items = $this->getPayments($data['invoice']);
                $totalPay = 0;
                foreach($items as $elem){
                    $totalPay += floatval($elem['amount']);
                }

                $result = $db->query("  SELECT  i.total
                                        FROM    Invoices i
                                        WHERE   i.ID = " . $data['invoice']);

                $totalInvoice = $db->resultToArray($result)[0]['total'];

                if(
                    abs($totalPay) >= abs(floatval($totalInvoice))
                ){
                    $paymentState = 1;
                    $db->query("UPDATE  Invoices
                                SET     paymentMethod = '" . $data['paymentMethod'] . "',
                                        accountNumber = '" . $data['accountNumber'] . "',
                                        paymentDate = " .  $data['paymentDate'] . ",
                                        paymentState =  $paymentState,
                                        comments = '" . $data['comments'] . "',
                                        pay = $totalPay
                                WHERE   ID = " . $data['invoice']);
                }else{
                    $paymentState = 0;
                    $paymentDate = "null";
                    $db->query("UPDATE  Invoices
                                SET     paymentMethod = '" . $data['paymentMethod'] . "',
                                        accountNumber = '" . $data['accountNumber'] . "',
                                        paymentDate =  $paymentDate,
                                        paymentState =  $paymentState,
                                        comments = '" . $data['comments'] . "',
                                        pay = $totalPay
                                WHERE   ID = " . $data['invoice']);
                }
                
                return $invoicePaymentID;
               
            }else{
                return false;
            }
        }

        /**
         * Modifica el estado de una factura
         * 
         * @param int $expedient Id del expediente
         * @return array
         */
        public function changeStatus($invoiceID){
            $db = new DbHandler;

            $invoiceID = cleanStr($invoiceID);

            $result = $db->query("  SELECT  i.paymentState
                                    FROM    Invoices i
                                    WHERE   i.ID = $invoiceID
            ");

            if(mysqli_num_rows($result) == 0){
                return [false, null];
            }else{
                $paymentState = $db->resultToArray($result)[0]['paymentState'];
                $paymentState = $paymentState == 0 ? 1 : 0;

                $response = $db->query("UPDATE  Invoices i
                                        SET     i.paymentState = $paymentState
                                        WHERE   i.ID = $invoiceID
                ");

                return [$response, $paymentState];
            }
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

            $result = $db->query("  SELECT  ip.*
                                    FROM    Invoices_Payments ip
                                    WHERE   ip.invoice = $invoice AND
                                            ip.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArray($result);
        }

        /**
        * Obtiene información sobre los pagos de de una factura
        *
        * @return array
        */
        public function getPaidInfo($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  COALESCE(SUM(ip.amount), 0) as totalPaid, 
                                            COALESCE(i.total, 0) as total, 
                                            i.generatedInvoiceNumber
                                    FROM    Invoices i, Invoices_Payments ip
                                    WHERE   i.ID = $id AND 
                                            ip.invoice = i.ID AND 
                                            ip.leavingDate IS NULL
            ");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArray($result)[0];
			}
        }

        /**
        * Devuelve la fecha de la última factura generada
        *
        * @param array $data
        */
        public function getInvoiceDate($data){
            $db = new DbHandler;

            if(!isset( $data['expedient'])){
                $expedient = cleanStr($data);
            }else{
                $expedient = cleanStr($data['expedient']);
            }
            
            $numHiring = cleanStr($data['numHiring']);

            $result =  $db->query(" SELECT      creationDate
                                    FROM        Invoices i
                                    WHERE       i.expedient = " . $expedient . " AND 
                                                i.leavingDate IS NULL AND
                                                i.num_hiring = $numHiring
                                    ORDER BY    i.ID
                                    LIMIT       1
            ");

            return mysqli_num_rows($result) > 0 ? $db->resultToArrayValue($result) : null;
        } 

        /**
        * Devuelve la fecha de la última factura generada
        *
        * @param array $data
        */
        public function getExpedientRequestDate($data){
            $db = new DbHandler;

            if(!isset( $data['expedient'])){
                $expedient = cleanStr($data);
            }else{
                $expedient = cleanStr($data['expedient']);
            }

            $result =  $db->query(" SELECT   requestDate
                                    FROM     Expedients e
                                    WHERE    e.expedientID = $expedient");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['requestDate'] : null;
        }        

        /**
        * Comprueba si existe la factura
        *
        * @param array $data
        */
        public function getFirstInvoiceDate(){
            $db = new DbHandler;

            $result =  $db->query(" SELECT  i.creationDate as firtsDate
                                    FROM    Invoices i, Expedients e
                                    WHERE   e.expedientID = i.expedient AND
                                            e.leavingDate IS NULL AND
                                            i.leavingDate IS NULL
            ");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['firtsDate'] : null;
        }    

        /**
        * Obtiene el desglose de ivas de una factura
        *
        * @param array $data
        */
        public function getInvoiceInfoEconomic($expedient, $invoiceID = null){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);

            $where = '';
            if($invoiceID != null){
                $where = " AND i.ID = $invoiceID";
            }
            
            $result =  $db->query(" SELECT  i.*
                                    FROM    Invoices i
                                    WHERE   i.leavingDate IS NULL AND 
                                            i.expedient = " . $expedient .
                                            $where
            );

            if(mysqli_num_rows($result) > 0){
                $infoInvoice = $db->resultToArray($result)[0];

                $invoiceID = $infoInvoice['ID'];

                $result =  $db->query(" SELECT  iv.typeIva as type_iva, iv.base, iv.iva
                                        FROM    Invoices_Ivas iv
                                        WHERE   iv.deleteDate IS NULL AND
                                                iv.invoice = " . $invoiceID
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
        * Comprueba si existe la factura
        *
        * @param array $data
        */
        public function getFirstReceivedInvoiceDate(){
            $db = new DbHandler;

            $result =  $db->query(" SELECT  MIN(ri.date) AS firtsDate, MAX(ri.date) as lastDate
                                    FROM    Received_Invoices ri
                                    WHERE   ri.leavingDate IS NULL");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }
        
        /**
        * Obtiene los expedientes facturados en el rango de fechas para el cliente(Particulaes, distintas empresas)
        *
        * @param array $data
        */
        public function getInvoices($from, $to, $client){
            $db = new DbHandler;

            $from = cleanStr($from);
            $to = cleanStr($to);
            $client = cleanStr($client);

            $whereClient = '';
            if($client == 0){
                $whereClient = " AND c.type = 1";
            }else{
                $whereClient = " AND c.clientID = $client ";
            }

            $result = $db->query("  SELECT  e.expedientID, 
                                            i.ID, 
                                            i.creationDate, 
                                            e.number, 
                                            CONCAT(e.deceasedName, ' ', e.deceasedSurname) as deceasedName, 
                                            CONCAT(c.name, ' ', c.surname) as clientName, 
                                            i.paymentState, 
                                            i.paymentDate, 
                                            i.total, 
                                            (
                                                SELECT  COALESCE(SUM(iniv.iva), 0)
                                                FROM    Invoices_Ivas iniv
                                                WHERE   iniv.deleteDate IS NULL AND
                                                        iniv.invoice = i.ID
                                            ) as ivaTotal,
                                            i.pay, 
                                            (i.total - i.pay) as pend
                                    FROM    Expedients e, Clients c, Invoices i
                                    WHERE   e.client = c.clientID AND
                                            e.expedientID = i.expedient AND
                                            i.creationDate BETWEEN " . $from . " AND " . $to . "
                                            $whereClient
            ");

            $res['data'] = $db->resultToArrayValue($result);

            return mysqli_num_rows($result) > 0 ? $res : null;
        }

        /**
        * Obtiene los expedientes facturados en el rango de fechas para el cliente(Particulaes, distintas empresas)
        *
        * @param array $data
        */
        public function getReceivedInvoices($from, $to){
            $db = new DbHandler;

            $from = cleanStr($from);
            $to = cleanStr($to);

            $result = $db->query("  SELECT      ri.*, m.name AS centerName
                                    FROM        (Received_Invoices ri)
                                    LEFT JOIN   Mortuaries m ON ri.costCenter = m.mortuaryID
                                    WHERE       ri.leavingDate IS NULL AND
                                                ri.date BETWEEN " . $from . " AND " . $to . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
        * Obtiene los expedientes facturados en el rango de fechas para el cliente(Particulaes, distintas empresas)
        *
        * @param array $data
        */
        public function getProducts(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  ef.ID, ef.name
                                    FROM    (Expenses_Fixed ef)
                                    WHERE   ef.leavingDate IS NULL");

            if(mysqli_num_rows($result)){
                $products['fixedProducts'] = $db->resultToArray($result);
            }

            $result = $db->query("  SELECT  ev.ID, ev.name
                                    FROM    (Expenses_Variable ev)
                                    WHERE   ev.leavingDate IS NULL");

            if(mysqli_num_rows($result)){
                $products['variableProducts'] = $db->resultToArray($result);
            }

            return count($result) > 0 ? $products : null;
        }

        /**
        * Obtiene los expedientes facturados en el rango de fechas para el cliente(Particulaes, distintas empresas)
        *
        * @param array $data
        */
        public function getPerformance($mortuary, $product, $from, $to){
            $db = new DbHandler;

            $from = cleanStr($from);
            $to = cleanStr($to);
            $mortuary = cleanStr($mortuary);
            $product = cleanStr($product);

            $performance = [];

            $result = $db->query("  SELECT      ef.ID, ef.name, SUM(ri.taxBase) AS total, ri.outCostCenter
                                    FROM        (Expenses_Fixed ef)
                                    LEFT JOIN   Received_Invoices ri ON ri.expenseFixed = ef.ID
                                    WHERE       ef.leavingDate IS NULL AND ri.date BETWEEN " . $from . " AND " . $to . " AND
                                                ri.outCostCenter = " . $mortuary . " AND ri.expenseFixed = " . $product . "
                                    GROUP BY    ef.ID    
                                    ORDER BY    ef.ID");

            if(mysqli_num_rows($result)){
                $performance['fixed'] = $db->resultToArray($result)[0];
            }

            $result = $db->query("  SELECT      ev.ID, ev.name, SUM(ri.taxBase) AS total, ri.outCostCenter
                                    FROM        (Expenses_Variable ev)
                                    LEFT JOIN   Received_Invoices ri ON ri.expenseVariable = ev.ID
                                    WHERE       ev.leavingDate IS NULL AND ri.date BETWEEN " . $from . " AND " . $to . " AND
                                                ri.outCostCenter = " . $mortuary . " AND ri.expenseVariable = " . $product . "
                                    GROUP BY    ev.ID    
                                    ORDER BY    ev.ID");

            if(mysqli_num_rows($result)){
                $performance['variable'] = $db->resultToArray($result)[0];
            }

            return count($result) > 0 ? $performance : null;
        }

        /**
        * Obtiene los expedientes facturados en el rango de fechas para el cliente(Particulaes, distintas empresas)
        *
        * @param array $data
        */
        public function getSalaries($mortuary, $from, $to){
            $db = new DbHandler;

            $from = cleanStr($from);
            $to = cleanStr($to);
            $mortuary = cleanStr($mortuary);

            $result = $db->query("  SELECT  SUM(s.taxBase) AS salarie
                                    FROM    Salaries s
                                    WHERE   s.leavingDate IS NULL AND 
                                            s.paymentDate BETWEEN " . $from . " AND " . $to . " AND
                                            s.costCenter = " . $mortuary . "");

            return mysqli_num_rows($result) ? $db->resultToArray($result)[0] : null;
        }

        /**
        * Obtiene los expedientes facturados en el rango de fechas para el cliente(Particulaes, distintas empresas)
        *
        * @param array $data
        */
        public function getFinancials($mortuary, $from, $to){
            $db = new DbHandler;

            $from = cleanStr($from);
            $to = cleanStr($to);
            $mortuary = cleanStr($mortuary);

            $result = $db->query("  SELECT  SUM(t.taxBase) AS financial
                                    FROM    Taxes t
                                    WHERE   t.leavingDate IS NULL AND 
                                            t.settlementDate BETWEEN " . $from . " AND " . $to . " AND
                                            t.costCenter = " . $mortuary . "");

            return mysqli_num_rows($result) ? $db->resultToArray($result)[0] : null;
        }

        /**
        * Obtiene los expedientes facturados en el rango de fechas para el cliente(Particulaes, distintas empresas)
        *
        * @param array $data
        */
        public function getInvoicedByCenter($mortuary, $from, $to){
            $db = new DbHandler;

            $from = cleanStr($from);
            $to = cleanStr($to);
            $mortuary = cleanStr($mortuary);

            $result = $db->query("  SELECT  SUM(ri.taxBase + ri.feeHoldIVA - ri.withholding + ri.supplied) AS result
                                    FROM    Received_Invoices ri
                                    WHERE   ri.leavingDate IS NULL AND 
                                            ri.date BETWEEN " . $from . " AND " . $to . " AND
                                            ri.outCostCenter = " . $mortuary . "");

            return mysqli_num_rows($result) ? $db->resultToArray($result)[0] : null;
        }

        /**
        * Obtiene los expedientes facturados en el rango de fechas para el cliente(Particulaes, distintas empresas)
        *
        * @param array $data
        */
        public function getRecievedInvoicesCash($from, $to){
            $db = new DbHandler;

            $from = cleanStr($from);
            $to = cleanStr($to);

            $result = $db->query("  SELECT  ri.ID AS invoiceID, ri.date AS date, ri.dueDate AS expiration, 
                                            (ri.taxBase + ri.feeHoldIVA - ri.withholding + ri.supplied) AS import, 
                                            'Factura recibida' AS description, ri.paymentMethod AS pago
                                    FROM    Received_Invoices ri
                                    WHERE   ri.date BETWEEN " . $from . " AND " . $to . "");            
            $res = $db->resultToArray($result);

            return mysqli_num_rows($result) > 0 ? $res : null;
        }        

        /**
        * Obtiene los expedientes facturados en el rango de fechas para el cliente(Particulaes, distintas empresas)
        *
        * @param array $data
        */
        public function getExpedients($from, $to, $client){
            $db = new DbHandler;

            $from = cleanStr($from);
            $to = cleanStr($to);
            $client = cleanStr($client);

            $whereClient = '';
            if($client == 0){
                $whereClient = " AND c.type = 1";
            }else{
                $whereClient = " AND c.clientID = $client ";
            }

            $result = $db->query("  SELECT  e.expedientID, e.number, e.requestDate, 
                                            CONCAT(e.deceasedName, ' ', e.deceasedSurname) as deceasedName, 
                                            CONCAT(c.name, ' ', c.surname) as clientName
                                    FROM    Expedients e, Clients c, Invoices i
                                    WHERE   e.client = c.clientID AND
                                            e.expedientID = i.expedient AND
                                            i.creationDate BETWEEN " . $from . " AND " . $to . "
                                            $whereClient
            ");
                                        
            $res['data'] = $db->resultToArrayValue($result);

            return mysqli_num_rows($result) > 0 ? $res : null;
        }        

        /**
        * Obtiene los expedientes facturados en el rango de fechas para el cliente(Particulaes, distintas empresas)
        *
        * @param array $data
        */
        public function getMortuaryPerformance($mortuary, $from, $to){
            $db = new DbHandler;

            $from = cleanStr($from);
            $to = cleanStr($to);
            $mortuary = cleanStr($mortuary);

            //Facturas emitidas
            $result = $db->query("  SELECT      SUM(i.total) as total,
                                                (
                                                    SELECT  COALESCE(SUM(iniv.iva), 0)
                                                    FROM    Invoices_Ivas iniv
                                                    WHERE   iniv.deleteDate IS NULL AND
                                                            iniv.invoice = i.ID
                                                ) as IVA,
                                                SUM(i.pay) as payed
                                    FROM        Invoices i, Expedients e
                                    WHERE       i.expedient = e.expedientID AND
                                                i.creationDate BETWEEN " . $from . " AND " . $to . " AND
                                                e.deceasedMortuary = " . $mortuary . "
            ");

            if(mysqli_num_rows($result) > 0){
                $res['invoiced'] = $db->resultToArray($result)[0];
            }
            
            //Facturas recibidas
            $result = $db->query("  SELECT  SUM(ri.taxBase + ri.feeHoldIVA - ri.withholding + ri.supplied) AS costs
                                    FROM    Received_Invoices ri
                                    WHERE   ri.outCostCenter = " . $mortuary . " AND 
                                            ri.date BETWEEN " . $from . " AND " . $to . "");
                 
            if(mysqli_num_rows($result) > 0){
                $res['cost'] = $db->resultToArray($result)[0];
            } 

            //Financiaciones
            $result = $db->query("  SELECT  SUM(f.initialCapital / f.term  + f.initialCapital * cuotas.interest / 100 / f.term) AS financing, 
                                            SUM(f.initialCapital * cuotas.interest / 100 / f.term) AS interest
                                    FROM    Financing f, Financing_Cuotas fc, 
                                            (
                                                SELECT Financing_Cuotas.financing AS financingID, Financing_Cuotas.interest, financing_Cuotas.ID
                                                FROM Financing_Cuotas
                                            ) AS cuotas
                                    WHERE   f.financeCenter = " . $mortuary . " AND 
                                            f.ID = fc.financing AND 
                                            fc.ID = cuotas.ID AND
                                            f.startDate BETWEEN " . $from . " AND " . $to . "");
                 
            if(mysqli_num_rows($result) > 0){
                $res['financing'] = $db->resultToArray($result)[0];
            } 

            //Amortización
            $result = $db->query("  SELECT  SUM(f.amortizedCapital) AS amortizedCapital
                                    FROM    Financing f, Financing_Cuotas fc, 
                                            (
                                                SELECT Financing_Cuotas.financing AS financingID, Financing_Cuotas.interest, financing_Cuotas.ID
                                                FROM Financing_Cuotas
                                                WHERE Financing_Cuotas.payDate IS NOT NULL AND Financing_Cuotas.payDate BETWEEN " . $from . " AND " . $to . " 
                                            ) AS cuotas
                                    WHERE   f.financeCenter = " . $mortuary . " AND 
                                            f.ID = cuotas.financingID AND 
                                            fc.ID = cuotas.ID");
                 
            if(mysqli_num_rows($result) > 0){
                $res['amortization'] = $db->resultToArray($result)[0];
            } 

            //Salarios a pagar
            $result = $db->query("  SELECT  SUM(s.taxBase) AS salaries
                                    FROM    Salaries s
                                    WHERE   s.leavingDate IS NULL AND 
                                            s.paymentDate BETWEEN " . $from . " AND " . $to . " AND
                                            s.costCenter = " . $mortuary . "");

            if(mysqli_num_rows($result) > 0){
                $res['salary'] = $db->resultToArray($result)[0];
            }                                    

            //Impuestos a liquidar
            $result = $db->query("  SELECT  SUM(t.taxBase) AS taxes
                                    FROM    Taxes t
                                    WHERE   t.leavingDate IS NULL AND 
                                            t.settlementDate BETWEEN " . $from . " AND " . $to . " AND
                                            t.costCenter = " . $mortuary . "");

            if(mysqli_num_rows($result) > 0){
                $res['taxe'] = $db->resultToArray($result)[0];
            }                                                                                  

            return count($res) > 0 ? $res : null;
        }   
        
        /**
        * Obtiene los expedientes facturados en el rango de fechas para el cliente(Particulaes, distintas empresas)
        *
        * @param array $data
        */
        public function getPayedPerformance($mortuary, $from, $to){
            $db = new DbHandler;

            $from = cleanStr($from);
            $to = cleanStr($to);
            $mortuary = cleanStr($mortuary);

            //Facturas recibidas pagadas
            $result = $db->query("  SELECT  SUM(ri.taxBase + ri.feeHoldIVA - ri.withholding + ri.supplied) AS costs
                                    FROM    Received_Invoices ri
                                    WHERE   ri.outCostCenter = " . $mortuary . " AND 
                                            ri.paymentDate BETWEEN " . $from . " AND " . $to . "");
                 
            if(mysqli_num_rows($result) > 0){
                $res['cost'] = $db->resultToArray($result)[0];
            } 

            //Cuotas de financiación pagadas
            $result = $db->query("  SELECT  SUM(f.initialCapital / f.term  + f.initialCapital * cuotas.interest / 100 / f.term) AS financing
                                    FROM    Financing f, Financing_Cuotas fc, 
                                            (
                                                SELECT  Financing_Cuotas.financing AS financingID, Financing_Cuotas.interest, financing_Cuotas.ID
                                                FROM    Financing_Cuotas
                                                WHERE   Financing_Cuotas.payDate IS NOT NULL AND 
                                                        Financing_Cuotas.payDate BETWEEN " . $from . " AND " . $to . " 
                                            ) AS cuotas
                                   WHERE    f.financeCenter = " . $mortuary . " AND 
                                            f.ID = cuotas.financingID AND 
                                            fc.ID = cuotas.ID");
                 
            if(mysqli_num_rows($result) > 0){
                $res['financing'] = $db->resultToArray($result)[0];
            } 

            //Impuestos liquidados
            $result = $db->query("  SELECT  SUM(t.taxBase) AS taxes
                                    FROM    Taxes t
                                    WHERE   t.leavingDate IS NULL AND 
                                            t.settlementDate BETWEEN " . $from . " AND " . $to . " AND
                                            t.costCenter = " . $mortuary . "");

            if(mysqli_num_rows($result) > 0){
                $res['taxe'] = $db->resultToArray($result)[0];
            } 

            //Salarios pagados
            $result = $db->query("  SELECT  SUM(s.taxBase) AS salaries
                                    FROM    Salaries s
                                    WHERE   s.leavingDate IS NULL AND 
                                            s.paymentDate BETWEEN " . $from . " AND " . $to . " AND
                                            s.costCenter = " . $mortuary . "");

            if(mysqli_num_rows($result) > 0){
                $res['salary'] = $db->resultToArray($result)[0];
            }
            
            return count($res) > 0 ? $res : null;
        }        

        /**
         * Obtiene datos de la factura
         * 
         * @param int $expedient Id del expediente
         * @return array
         */
        public function getInvoiceInfo($expedient, $invoice = null){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);

            $whereInvoice = '';
            if($invoice != null){
                $whereInvoice = " AND i.ID = $invoice";
            }

            $result = $db->query("  SELECT      i.ID as invoiceID, i.total, i.pay, i.paymentDate, i.comments, i.accountNumber, i.paymentMethod, 
                                                i.generatedInvoiceNumber, e.number as expedientNumber,
                                                IF(
                                                    tp.id IS NOT NULL, 
                                                    IF(
                                                        tp.numAccount IS NOT NULL, 
                                                        tp.numAccount,
                                                        ''
                                                    ),
                                                    ''
                                                ) as tpv_num_account
                                    FROM        (Invoices i, Expedients e)
                                    LEFT JOIN   TPVs tp ON tp.name = i.accountNumber
                                    WHERE       e.expedientID = i.expedient AND 
                                                e.expedientID = $expedient AND 
                                                i.leavingDate IS NULL AND 
                                                e.leavingDate IS NULL
                                                $whereInvoice
            ");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Obtiene las facturas pendientes de cobro
         * 
         * @return array
         */
        public function getPendingInvoices(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  i.ID, i.creationDate, e.number, i.generatedInvoiceNumber, i.creationDate as creationDate2, 
                                            CONCAT(c.name, ' ', c.surname) as client, CONCAT(e.deceasedName, ' ', e.deceasedSurname) as deceased, 
                                            i.total, i.pay, i.total - i.pay as pending, e.expedientID, e.tpv
                                    FROM    Invoices i, Expedients e, Clients c
                                    WHERE   i.expedient = e.expedientID AND
                                            e.client = c.clientID AND
                                            i.pay < i.total AND
                                            e.leavingDate IS NULL AND
                                            i.leavingDate IS NULL AND
                                            i.invoice_type != 3 AND
                                            (
                                                (
                                                    i.ID = (
                                                        SELECT  MAX(i2.ID)
                                                        FROM    Invoices i2
                                                        WHERE   i2.leavingDate IS NULL AND
                                                                i2.invoice_type != 3 AND
                                                                i2.expedient = i.expedient AND 
                                                                (
                                                                    i2.rectified_type IS NULL OR 
                                                                    (i2.rectified_type IS NOT NULL AND i2.rectified_type != 2)
                                                                )
                                                    )
                                                ) OR
                                                (
                                                    i.rectified_type = 2
                                                )
                                            ) AND
                                            YEAR(FROM_UNIXTIME(i.creationDate)) = " . date('Y') . "
            ");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArrayValue($result);
        }

        /**
         * Obtiene las facturas cobradas
         * 
         * @return array
         */
        public function getPaidInvoices(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  i.ID, i.creationDate, e.number, i.generatedInvoiceNumber, i.creationDate as creationDate2, 
                                            CONCAT(c.name, ' ', c.surname) as client, CONCAT(e.deceasedName, ' ', e.deceasedSurname) as deceased, 
                                            i.total, i.pay, i.total - i.pay as pending, e.expedientID, e.tpv
                                    FROM    Invoices i, Expedients e, Clients c
                                    WHERE   i.expedient = e.expedientID AND
                                            e.client = c.clientID AND
                                            i.pay >= i.total AND
                                            e.leavingDate IS NULL AND 
                                            i.leavingDate IS NULL AND
                                            i.invoice_type != 3 AND
                                            (
                                                (
                                                    i.ID = (
                                                        SELECT  MAX(i2.ID)
                                                        FROM    Invoices i2
                                                        WHERE   i2.leavingDate IS NULL AND
                                                                i2.invoice_type != 3 AND
                                                                i2.expedient = i.expedient AND 
                                                                (
                                                                    i2.rectified_type IS NULL OR 
                                                                    (i2.rectified_type IS NOT NULL AND i2.rectified_type != 2)
                                                                )
                                                    )
                                                ) OR
                                                (
                                                    i.rectified_type = 2
                                                )
                                            ) AND
                                            YEAR(FROM_UNIXTIME(i.creationDate)) = " . date('Y') . "
            ");

            return mysqli_num_rows($result) == 0 ? [] : $db->resultToArrayValue($result);
        }

        /**
        * Obtiene el listado de facturas
        *
        * @return array
        */
        public function listInvoicesDatatables(
            $from = null, $to = null, $type, $clientType, $client, $status, $invoiceType,
            $paymentMethod = null, $numAccount = null, $invoiceDateFilter = null, $invoicePaymentFilter = null
        ){
            $db = new DbHandler;

            if($type == "1" || $type == "3"){
                $type = " AND e.type = $type ";
            }else{
                $type = "  AND e.type != 2";
            }
            if($clientType == "1" || $clientType == "2" || $clientType == '3'){
                $clientType = " AND e.clientType = $clientType ";
            }else{
                $clientType = "";
            }
            $clientWhere = '';
            if($client != 'null' && $client != ''){
                $clientWhere .= " AND e.client = $client";
            }
            $statusWhere = '';
            if($status != '-'){
                if(intval($status) == 0){       // Pendiente
                    $statusWhere .= ' 
                        AND i.invoice_type != 3 
                        AND i.paymentState = 0 
                        AND i.ID = (
                            SELECT  MAX(i2.ID)
                            FROM    Invoices i2
                            WHERE   i2.expedient = i.expedient AND
                                    i2.leavingDate IS NULL
                        )
                    ';
                }else if(intval($status) == 1){ // Pagada
                    $statusWhere .= ' 
                        AND i.invoice_type != 3 
                        AND i.paymentState = 1 
                        AND i.ID = (
                            SELECT  MAX(i2.ID)
                            FROM    Invoices i2
                            WHERE   i2.expedient = i.expedient AND
                                    i2.leavingDate IS NULL AND
                                    (
                                        i2.rectified_type IS NULL OR
                                        i2.rectified_type != 2
                                    )
                        )
                    ';
                }else if(intval($status) == 2){ // Pago parcial
                    $statusWhere .= ' 
                        AND i.invoice_type != 3 
                        AND i.paymentState = 0 
                        AND i.pay > 0 
                        AND i.pay < i.total
                        AND i.ID = (
                            SELECT  MAX(i2.ID)
                            FROM    Invoices i2
                            WHERE   i2.expedient = i.expedient AND
                                    i2.leavingDate IS NULL AND
                                    (
                                        i2.rectified_type IS NULL OR
                                        i2.rectified_type != 2
                                    )
                        )
                    ';
                }else if(intval($status) == 3){ // Rectificada
                    $statusWhere .= ' 
                        AND (i.rectified_type IS NULL OR i.rectified_type != 2)
                        AND 
                            i.ID != (
                                SELECT  MAX(i2.ID)
                                FROM    Invoices i2
                                WHERE   i2.expedient = i.expedient AND
                                        i2.leavingDate IS NULL AND
                                        (
                                            i2.rectified_type IS NULL OR
                                            i2.rectified_type != 2
                                        )
                            )
                    ';
                }else if(intval($status) == 4){ // Anulada
                    $statusWhere .= ' AND i.invoice_type = 3 AND i.anuledDate IS NOT NULL';
                }
            }
            $invoiceTypeWhere = '';
            if($invoiceType != 'null' && $invoiceType != '-' && $invoiceType != ''){
                $invoiceTypeWhere .= " AND i.billingSerie = $invoiceType";
            }

            $paymentMethodWhere = '';
            if($paymentMethod != 'null' && $paymentMethod != '' && $paymentMethod != '-'){
                $paymentMethodWhere .= " AND i.paymentMethod = '$paymentMethod'";
            }

            if($numAccount != 'null' && $numAccount != '' && $numAccount != '-'){
                $paymentMethodWhere .= " AND i.accountNumber = '$numAccount'";
            }

            $where = "  e.leavingDate IS NULL
                        AND i.leavingDate IS NULL 
                        AND i.expedient = e.expedientID 
                        AND u.userID = i.user 
                        $type $clientType $clientWhere $statusWhere $invoiceTypeWhere $paymentMethodWhere";
                       
            if(isset($from) && isset($to) && $from != null && $from != '' && $to != null && $to != ''){
                if($invoiceDateFilter == null || $invoicePaymentFilter == null){
                    $where .= " AND i.creationDate BETWEEN " . $from . " AND " . $to;
                }else{
                    if($invoiceDateFilter == '0' && $invoicePaymentFilter == '0'){
                        $where .= " AND i.creationDate BETWEEN " . $from . " AND " . $to;
                    }elseif($invoiceDateFilter == '0' && $invoicePaymentFilter == '1'){
                        $where .= " AND 
                            (
                                SELECT  COUNT(*)
                                FROM    Invoices_Payments ip
                                WHERE   ip.leavingDate IS NULL AND
                                        ip.invoice = i.id AND
                                        ip.date BETWEEN " . $from . " AND " . $to . "
                            ) > 0
                        ";
                    }elseif($invoiceDateFilter == '1' && $invoicePaymentFilter == '0'){
                        $where .= " AND i.creationDate BETWEEN " . $from . " AND " . $to;
                    }elseif($invoiceDateFilter == '1' && $invoicePaymentFilter == '1'){
                        $where .= " AND (
                            (i.creationDate BETWEEN " . $from . " AND " . $to . ") OR
                            (
                                (
                                    SELECT  COUNT(*)
                                    FROM    Invoices_Payments ip
                                    WHERE   ip.leavingDate IS NULL AND
                                            ip.invoice = i.id AND
                                            ip.date BETWEEN " . $from . " AND " . $to . "
                                ) > 0
                            )
                        )";
                    }
                }
            }

            $result = $db->query("  SELECT      e.expedientID, 
                                                i.ID, 
                                                e.number, 
                                                i.creationDate, 
                                                i.generatedInvoiceNumber,
                                                IF(c.brandName IS NULL or c.brandName = '', CONCAT(c.name, ' ', c.surname), c.brandName) as name,
                                                IF(e.deceasedName IS NULL OR e.deceasedName = '', '-', CONCAT(e.deceasedName, ' ', e.deceasedSurname)),
                                                IF(e.deceasedNIF IS NULL OR e.deceasedNIF = '', '-', e.deceasedNIF),
                                                i.total, 
                                                i.pay, 
                                                i.pay,
                                                i.paymentState, 
                                                i.paymentDate, 
                                                i.paymentMethod,  
                                                IF(i.accountNumber IS NULL OR i.accountNumber = '', '-', i.accountNumber), 
                                                u.username, 
                                                i.comments,
                                                i.accountNumber, 
                                                e.expNumYear, 
                                                i.numInvoice, 
                                                '',
                                                '', 
                                                '', 
                                                '', 
                                                e.lossNumber,
                                                e.policy, 
                                                e.capital, 
                                                e.deceasedMortuary,
                                                i.createDate,
                                                i.invoice_type,
                                                (
                                                    SELECT  MAX(i2.ID)
                                                    FROM    Invoices i2
                                                    WHERE   i2.expedient = i.expedient AND
                                                            i2.leavingDate IS NULL AND
                                                            (
                                                                i2.rectified_type IS NULL OR
                                                                i2.rectified_type != 2
                                                            )
                                                ) as last_invoice_id_expedient,
                                                i.rectified_type
                                    FROM        (Invoices i, Users u, Expedients e)
                                    LEFT JOIN   Clients c ON c.clientId = e.client 
                                    WHERE       $where");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
        * Obtiene el listado de facturas
        *
        * @return array
        */
        public function getTotalInvoicesDatatables(
            $from = null, $to = null, $type, $clientType, $client, $status, $invoiceType,
            $paymentMethod = null, $numAccount = null, $invoiceDateFilter = null, $invoicePaymentFilter = null
        ){
            $db = new DbHandler;

            if($type == "1" || $type == "3"){
                $type = " AND e.type = $type ";
            }else{
                $type = "  AND e.type != 2";
            }
            if($clientType == "1" || $clientType == "2" || $clientType == '3'){
                $clientType = " AND e.clientType = $clientType ";
            }else{
                $clientType = "";
            }
            $clientWhere = '';
            if($client != 'null' && $client != ''){
                $clientWhere .= " AND e.client = $client";
            }
            $statusWhere = '';
            if($status != '-'){
                if(intval($status) == 0){       // Pendiente
                    $statusWhere .= ' 
                        AND i.invoice_type != 3 
                        AND i.paymentState = 0 
                        AND i.ID = (
                            SELECT  MAX(i2.ID)
                            FROM    Invoices i2
                            WHERE   i2.expedient = i.expedient AND
                                    i2.leavingDate IS NULL
                        )
                    ';
                }else if(intval($status) == 1){ // Pagada
                    $statusWhere .= ' 
                        AND i.invoice_type != 3 
                        AND i.paymentState = 1 
                        AND i.ID = (
                            SELECT  MAX(i2.ID)
                            FROM    Invoices i2
                            WHERE   i2.expedient = i.expedient AND
                                    i2.leavingDate IS NULL AND
                                    (
                                        i2.rectified_type IS NULL OR
                                        i2.rectified_type != 2
                                    )
                        )
                    ';
                }else if(intval($status) == 2){ // Pago parcial
                    $statusWhere .= ' 
                        AND i.invoice_type != 3 
                        AND i.paymentState = 0 
                        AND i.pay > 0 
                        AND i.pay < i.total
                        AND i.ID = (
                            SELECT  MAX(i2.ID)
                            FROM    Invoices i2
                            WHERE   i2.expedient = i.expedient AND
                                    i2.leavingDate IS NULL AND
                                    (
                                        i2.rectified_type IS NULL OR
                                        i2.rectified_type != 2
                                    )
                        )
                    ';
                }else if(intval($status) == 3){ // Rectificada
                    $statusWhere .= ' 
                        AND (i.rectified_type IS NULL OR i.rectified_type != 2)
                        AND 
                            i.ID != (
                                SELECT  MAX(i2.ID)
                                FROM    Invoices i2
                                WHERE   i2.expedient = i.expedient AND
                                        i2.leavingDate IS NULL AND
                                        (
                                            i2.rectified_type IS NULL OR
                                            i2.rectified_type != 2
                                        )
                            )
                    ';
                }else if(intval($status) == 4){ // Anulada
                    $statusWhere .= ' AND i.invoice_type = 3 AND i.anuledDate IS NOT NULL';
                }
            }
            $invoiceTypeWhere = '';
            if($invoiceType != 'null' && $invoiceType != '-' && $invoiceType != ''){
                $invoiceTypeWhere .= " AND i.billingSerie = $invoiceType";
            }

            $paymentMethodWhere = '';
            if($paymentMethod != 'null' && $paymentMethod != '' && $paymentMethod != '-'){
                $paymentMethodWhere .= " AND i.paymentMethod = '$paymentMethod'";
            }

            if($numAccount != 'null' && $numAccount != '' && $numAccount != '-'){
                $paymentMethodWhere .= " AND i.accountNumber = '$numAccount'";
            }

            $where = "  e.leavingDate IS NULL
                        AND i.leavingDate IS NULL 
                        AND i.expedient = e.expedientID 
                        AND u.userID = i.user 
                        AND i.invoice_type != 3
                        $type $clientType $clientWhere $statusWhere $invoiceTypeWhere $paymentMethodWhere";
                       
            if(isset($from) && isset($to) && $from != null && $from != '' && $to != null && $to != ''){
                if($invoiceDateFilter == null || $invoicePaymentFilter == null){
                    $where .= " AND i.creationDate BETWEEN " . $from . " AND " . $to;
                }else{
                    if($invoiceDateFilter == '0' && $invoicePaymentFilter == '0'){
                        $where .= " AND i.creationDate BETWEEN " . $from . " AND " . $to;
                    }elseif($invoiceDateFilter == '0' && $invoicePaymentFilter == '1'){
                        $where .= " AND 
                            (
                                SELECT  COUNT(*)
                                FROM    Invoices_Payments ip
                                WHERE   ip.leavingDate IS NULL AND
                                        ip.invoice = i.id AND
                                        ip.date BETWEEN " . $from . " AND " . $to . "
                            ) > 0
                        ";
                    }elseif($invoiceDateFilter == '1' && $invoicePaymentFilter == '0'){
                        $where .= " AND i.creationDate BETWEEN " . $from . " AND " . $to;
                    }elseif($invoiceDateFilter == '1' && $invoicePaymentFilter == '1'){
                        $where .= " AND (
                            (i.creationDate BETWEEN " . $from . " AND " . $to . ") OR
                            (
                                (
                                    SELECT  COUNT(*)
                                    FROM    Invoices_Payments ip
                                    WHERE   ip.leavingDate IS NULL AND
                                            ip.invoice = i.id AND
                                            ip.date BETWEEN " . $from . " AND " . $to . "
                                ) > 0
                            )
                        )";
                    }
                }
            }

            $result = $db->query("  SELECT t.ID, t.total
                                    FROM
                                    (
                                        (
                                            -- Ultima factura para cada expediente que no sea por diferencias y no esté anulada
                                            SELECT      i.ID, i.total
                                            FROM        Invoices i
                                            JOIN        Users u ON u.userID = i.user
                                            JOIN        Expedients e ON i.expedient = e.expedientID
                                            LEFT JOIN   Clients c ON c.clientId = e.client
                                            WHERE       $where
                                                    AND i.ID = (
                                                        SELECT  MAX(i2.ID)
                                                        FROM    Invoices i2
                                                        WHERE   i2.leavingDate IS NULL
                                                            AND i2.invoice_type != 3
                                                            AND i2.expedient = i.expedient
                                                            AND (
                                                                i2.rectified_type IS NULL OR 
                                                                (i2.rectified_type IS NOT NULL AND i2.rectified_type != 2)
                                                            )
                                                    )
                                        )
                                        UNION ALL
                                        (
                                            -- Facturas rectificativas por diferencias: todas
                                            SELECT      i.ID, i.total
                                            FROM        Invoices i
                                            JOIN        Users u ON u.userID = i.user
                                            JOIN        Expedients e ON i.expedient = e.expedientID
                                            LEFT JOIN   Clients c ON c.clientId = e.client
                                            WHERE       $where
                                                    AND i.invoice_type != 3
                                                    AND i.rectified_type = 2
                                            )
                                    ) as t 
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

                    $result = $db->query("  SELECT  SUM(ip.amount) as total
                                            FROM    Invoices ri, Invoices_Payments ip
                                            WHERE   ri.ID = $id AND ip.invoice = ri.ID AND ip.leavingDate IS NULL
                    ");
                        
                    $totalPaid = $db->resultToArray($result)[0];

                    $totals['invoices'] += floatval($elem['total']);
                    $totals['paid'] += floatval($totalPaid['total']);
                }
            }

            return $totals;
        }

        /**
        * Obtiene el listado de facturas para descargar
        *
        * @return array
        */
        public function listInvoicesDatatablesDownload(
            $from = null, $to = null, $type, $clientType, $client, $search, $status, $invoiceType,
            $paymentMethod = null, $numAccount = null, $invoiceDateFilter = null, $invoicePaymentFilter = null
        ){
            $db = new DbHandler;

            if($type == "1" || $type == "3"){
                $type = " AND e.type = $type ";
            }else{
                $type = "  AND e.type != 2";
            }
            if($clientType == "1" || $clientType == "2" || $clientType == '3'){
                $clientType = " AND e.clientType = $clientType ";
            }else{
                $clientType = "";
            }
            $clientWhere = '';
            if($client != 'null' && $client != ''){
                $clientWhere .= " AND e.client = $client";
            }
            $statusWhere = '';
            if($status != '-'){
                if(intval($status) == 0){       // Pendiente
                    $statusWhere .= ' 
                        AND i.invoice_type != 3 
                        AND i.paymentState = 0 
                        AND i.ID = (
                            SELECT  MAX(i2.ID)
                            FROM    Invoices i2
                            WHERE   i2.expedient = i.expedient AND
                                    i2.leavingDate IS NULL
                        )
                    ';
                }else if(intval($status) == 1){ // Pagada
                    $statusWhere .= ' 
                        AND i.invoice_type != 3 
                        AND i.paymentState = 1 
                        AND i.ID = (
                            SELECT  MAX(i2.ID)
                            FROM    Invoices i2
                            WHERE   i2.expedient = i.expedient AND
                                    i2.leavingDate IS NULL AND
                                    (
                                        i2.rectified_type IS NULL OR
                                        i2.rectified_type != 2
                                    )
                        )
                    ';
                }else if(intval($status) == 2){ // Pago parcial
                    $statusWhere .= ' 
                        AND i.invoice_type != 3 
                        AND i.paymentState = 0 
                        AND i.pay > 0 
                        AND i.pay < i.total
                        AND i.ID = (
                            SELECT  MAX(i2.ID)
                            FROM    Invoices i2
                            WHERE   i2.expedient = i.expedient AND
                                    i2.leavingDate IS NULL AND
                                    (
                                        i2.rectified_type IS NULL OR
                                        i2.rectified_type != 2
                                    )
                        )
                    ';
                }else if(intval($status) == 3){ // Rectificada
                    $statusWhere .= ' 
                        AND (i.rectified_type IS NULL OR i.rectified_type != 2)
                        AND 
                            i.ID != (
                                SELECT  MAX(i2.ID)
                                FROM    Invoices i2
                                WHERE   i2.expedient = i.expedient AND
                                        i2.leavingDate IS NULL AND
                                        (
                                            i2.rectified_type IS NULL OR
                                            i2.rectified_type != 2
                                        )
                            )
                    ';
                }else if(intval($status) == 4){ // Anulada
                    $statusWhere .= ' AND i.invoice_type = 3 AND i.anuledDate IS NOT NULL';
                }
            }
            $invoiceTypeWhere = '';
            if($invoiceType != 'null' && $invoiceType != '-' && $invoiceType != ''){
                $invoiceTypeWhere .= " AND i.billingSerie = $invoiceType";
            }

            $paymentMethodWhere = '';
            if($paymentMethod != 'null' && $paymentMethod != '' && $paymentMethod != '-'){
                $paymentMethodWhere .= " AND i.paymentMethod = '$paymentMethod'";
            }

            if($numAccount != 'null' && $numAccount != '' && $numAccount != '-'){
                $paymentMethodWhere .= " AND i.accountNumber = '$numAccount'";
            }

            $where = "  e.leavingDate IS NULL
                        AND i.leavingDate IS NULL 
                        AND i.expedient = e.expedientID 
                        AND u.userID = i.user 
                        $type $clientType $clientWhere $statusWhere $invoiceTypeWhere $paymentMethodWhere";
                       
            if(isset($from) && isset($to) && $from != null && $from != '' && $to != null && $to != ''){
                if($invoiceDateFilter == null || $invoicePaymentFilter == null){
                    $where .= " AND i.creationDate BETWEEN " . $from . " AND " . $to;
                }else{
                    if($invoiceDateFilter == '0' && $invoicePaymentFilter == '0'){
                        $where .= " AND i.creationDate BETWEEN " . $from . " AND " . $to;
                    }elseif($invoiceDateFilter == '0' && $invoicePaymentFilter == '1'){
                        $where .= " AND 
                            (
                                SELECT  COUNT(*)
                                FROM    Invoices_Payments ip
                                WHERE   ip.leavingDate IS NULL AND
                                        ip.invoice = i.id AND
                                        ip.date BETWEEN " . $from . " AND " . $to . "
                            ) > 0
                        ";
                    }elseif($invoiceDateFilter == '1' && $invoicePaymentFilter == '0'){
                        $where .= " AND i.creationDate BETWEEN " . $from . " AND " . $to;
                    }elseif($invoiceDateFilter == '1' && $invoicePaymentFilter == '1'){
                        $where .= " AND (
                            (i.creationDate BETWEEN " . $from . " AND " . $to . ") OR
                            (
                                (
                                    SELECT  COUNT(*)
                                    FROM    Invoices_Payments ip
                                    WHERE   ip.leavingDate IS NULL AND
                                            ip.invoice = i.id AND
                                            ip.date BETWEEN " . $from . " AND " . $to . "
                                ) > 0
                            )
                        )";
                    }
                }
            }

            $result = $db->query("  SELECT      e.expedientID, 
                                                e.number, 
                                                REPLACE(i.generatedInvoiceNumber, '/', '-') as number_invoice,
                                                i.ID as invoiceID
                                    FROM        (Invoices i, Users u, Expedients e)
                                    LEFT JOIN   Clients c ON c.clientId = e.client 
                                    WHERE       $where
            ");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene el listado de facturas para descargar en formato A3
        *
        * @return array
        */
        public function listInvoicesDatatablesDownloadA3(
            $from = null, $to = null, $type, $clientType, $client, $search, $status, $invoiceType,
            $paymentMethod = null, $numAccount = null, $invoiceDateFilter = null, $invoicePaymentFilter = null
        ){
            $db = new DbHandler;

            if($type == "1" || $type == "3"){
                $type = " AND e.type = $type ";
            }else{
                $type = "  AND e.type != 2";
            }
            if($clientType == "1" || $clientType == "2" || $clientType == '3'){
                $clientType = " AND e.clientType = $clientType ";
            }else{
                $clientType = "";
            }
            $clientWhere = '';
            if($client != 'null' && $client != ''){
                $clientWhere .= " AND e.client = $client";
            }
            $statusWhere = '';
            if($status != '-'){
                if(intval($status) == 0){       // Pendiente
                    $statusWhere .= ' 
                        AND i.invoice_type != 3 
                        AND i.paymentState = 0 
                        AND i.ID = (
                            SELECT  MAX(i2.ID)
                            FROM    Invoices i2
                            WHERE   i2.expedient = i.expedient AND
                                    i2.leavingDate IS NULL
                        )
                    ';
                }else if(intval($status) == 1){ // Pagada
                    $statusWhere .= ' 
                        AND i.invoice_type != 3 
                        AND i.paymentState = 1 
                        AND i.ID = (
                            SELECT  MAX(i2.ID)
                            FROM    Invoices i2
                            WHERE   i2.expedient = i.expedient AND
                                    i2.leavingDate IS NULL AND
                                    (
                                        i2.rectified_type IS NULL OR
                                        i2.rectified_type != 2
                                    )
                        )
                    ';
                }else if(intval($status) == 2){ // Pago parcial
                    $statusWhere .= ' 
                        AND i.invoice_type != 3 
                        AND i.paymentState = 0 
                        AND i.pay > 0 
                        AND i.pay < i.total
                        AND i.ID = (
                            SELECT  MAX(i2.ID)
                            FROM    Invoices i2
                            WHERE   i2.expedient = i.expedient AND
                                    i2.leavingDate IS NULL AND
                                    (
                                        i2.rectified_type IS NULL OR
                                        i2.rectified_type != 2
                                    )
                        )
                    ';
                }else if(intval($status) == 3){ // Rectificada
                    $statusWhere .= ' 
                        AND (i.rectified_type IS NULL OR i.rectified_type != 2)
                        AND 
                            i.ID != (
                                SELECT  MAX(i2.ID)
                                FROM    Invoices i2
                                WHERE   i2.expedient = i.expedient AND
                                        i2.leavingDate IS NULL AND
                                        (
                                            i2.rectified_type IS NULL OR
                                            i2.rectified_type != 2
                                        )
                            )
                    ';
                }else if(intval($status) == 4){ // Anulada
                    $statusWhere .= ' AND i.invoice_type = 3 AND i.anuledDate IS NOT NULL';
                }
            }
            $invoiceTypeWhere = '';
            if($invoiceType != 'null' && $invoiceType != '-' && $invoiceType != ''){
                $invoiceTypeWhere .= " AND i.billingSerie = $invoiceType";
            }

            $paymentMethodWhere = '';
            if($paymentMethod != 'null' && $paymentMethod != '' && $paymentMethod != '-'){
                $paymentMethodWhere .= " AND i.paymentMethod = '$paymentMethod'";
            }

            if($numAccount != 'null' && $numAccount != '' && $numAccount != '-'){
                $paymentMethodWhere .= " AND i.accountNumber = '$numAccount'";
            }

            if($search != ''){
                $search = trim($search);

                $searchWhere = " AND (
                            e.number LIKE '%$search%'
                            OR i.generatedInvoiceNumber LIKE '%$search%'
                            OR c.brandName LIKE '%$search%'
                            OR c.name LIKE '%$search%'
                            OR c.surname LIKE '%$search%'
                            OR e.deceasedName LIKE '%$search%'
                            OR e.deceasedSurname LIKE '%$search%'
                            OR e.deceasedNIF LIKE '%$search%'
                            OR i.paymentMethod LIKE '%$search%'
                            OR IF(i.accountNumber IS NULL OR i.accountNumber = '', '-', i.accountNumber) LIKE '%$search%'
                            OR DATE_FORMAT(FROM_UNIXTIME(i.paymentDate), '%d/%m/%Y') LIKE '%$search%'
                            OR IF(i.paymentState = 0, 'Pendiente', 'Pagada') LIKE '%$search%'
                            OR u.username LIKE '%$search%'
                        )";
            }else{
                $searchWhere = '';
            }

            $where = "  AND i.expedient = e.expedientID 
                        AND u.userID = i.user 
                        $type $clientType $clientWhere $statusWhere $invoiceTypeWhere $searchWhere $paymentMethodWhere";

            if(isset($from) && isset($to) && $from != null && $from != '' && $to != null && $to != ''){
                if($invoiceDateFilter == null || $invoicePaymentFilter == null){
                    $where .= " AND i.creationDate BETWEEN " . $from . " AND " . $to;
                }else{
                    if($invoiceDateFilter == '0' && $invoicePaymentFilter == '0'){
                        $where .= " AND i.creationDate BETWEEN " . $from . " AND " . $to;
                    }elseif($invoiceDateFilter == '0' && $invoicePaymentFilter == '1'){
                        $where .= " AND 
                            (
                                SELECT  COUNT(*)
                                FROM    Invoices_Payments ip
                                WHERE   ip.leavingDate IS NULL AND
                                        ip.invoice = i.id AND
                                        ip.date BETWEEN " . $from . " AND " . $to . "
                            ) > 0
                        ";
                    }elseif($invoiceDateFilter == '1' && $invoicePaymentFilter == '0'){
                        $where .= " AND i.creationDate BETWEEN " . $from . " AND " . $to;
                    }elseif($invoiceDateFilter == '1' && $invoicePaymentFilter == '1'){
                        $where .= " AND (
                            (i.creationDate BETWEEN " . $from . " AND " . $to . ") OR
                            (
                                (
                                    SELECT  COUNT(*)
                                    FROM    Invoices_Payments ip
                                    WHERE   ip.leavingDate IS NULL AND
                                            ip.invoice = i.id AND
                                            ip.date BETWEEN " . $from . " AND " . $to . "
                                ) > 0
                            )
                        )";
                    }
                }
            }

            $result = $db->query("  SELECT      t.expedientID, 
                                                t.expedientNumber, 
                                                t.invoiceNumber, 
                                                t.invoiceDate, 
                                                t.clientName, 
                                                t.nif as clientNif, 
                                                t.deceasedName, 
                                                t.deceasedNIF,
                                                t.supplieds as supplied, 
                                                t.total as totalInvoice, 
                                                t.totalBruto, 
                                                t.numInvoice,
                                                t.invoiceID,
                                                t.typeIva,
                                                t.base,
                                                t.iva
                                    FROM        (
                                                    SELECT      e.expedientID, 
                                                                e.number as expedientNumber, 
                                                                i.generatedInvoiceNumber as invoiceNumber, 
                                                                i.creationDate as invoiceDate,
                                                                IF(c.brandName IS NOT NULL AND c.brandName != '', 
                                                                c.brandName, 
                                                                CONCAT(c.name, ' ' , c.surname)) as clientName,
                                                                c.nif, 
                                                                CONCAT(e.deceasedName, ' ' , e.deceasedSurname) as deceasedName, 
                                                                e.deceasedNIF,
                                                                i.supplieds, 
                                                                i.total, 
                                                                i.bruto as totalBruto,
                                                                i.numInvoice,
                                                                i.ID as invoiceID,
                                                                iniv.typeIva,
                                                                iniv.base,
                                                                iniv.iva
                                                    FROM        (Invoices i, Expedients e, Users u, Invoices_Ivas iniv)
                                                    LEFT JOIN   Clients c ON c.clientId = e.client 
                                                    WHERE       i.leavingDate IS NULL AND
                                                                iniv.expedient = e.expedientID AND
                                                                iniv.invoice = i.ID AND
                                                                iniv.deleteDate IS NULL
                                                                $where
                                                ) t 
                                    ORDER BY    t.invoiceDate, t.numInvoice
            ");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{

                $listInvoices = $db->resultToArray($result);

                // Get iva types
                $ivaTypes = [];
                $result = $db->query("  SELECT      it.percentage,
                                                    0 as base,
                                                    0 as iva
                                        FROM        IVA_Types it
                                        WHERE       it.leavingDate IS NULL AND
                                                    (it.type IS NULL OR it.type = 1)
                                        ORDER BY    it.percentage ASC 
                ");
                if(mysqli_num_rows($result) > 0){
                    $ivaTypes = $db->resultToArray($result);
                }

                foreach($listInvoices as $index=>$item){

                    $listInvoices[$index]['basesIvas'] = $ivaTypes;

                    $invoiceID = $item['invoiceID'];

                    // Get invoice ivas
                    $resultInvoiceIvas = $db->query(" SELECT    iniv.typeIva,
                                                                iniv.base,
                                                                iniv.iva
                                                    FROM        Invoices_Ivas iniv
                                                    WHERE       iniv.deleteDate IS NULL AND
                                                                iniv.invoice = $invoiceID
                    ");
                    if(mysqli_num_rows($resultInvoiceIvas) > 0){
                        $invoiceIvas = $db->resultToArray($resultInvoiceIvas);
                        foreach($invoiceIvas as $invoiceIv){
                            $keys = array_column($listInvoices[$index]['basesIvas'], 'percentage');
                            $indexAux = array_search($invoiceIv['typeIva'], $keys);

                            if($indexAux !== false) {
                                $listInvoices[$index]['basesIvas'][$indexAux]['base'] += floatval($invoiceIv['base']);
                                $listInvoices[$index]['basesIvas'][$indexAux]['iva'] += floatval($invoiceIv['iva']);
                            }
                        }
                    }
                }

                return $listInvoices;
			}
        }

        /**
         * Obtiene los totales para la tabla
         *
         * @return array
         */
        public function getTotals($from, $to, $type, $clientType, $search, $client, $status, $invoiceType){
            $db = new DbHandler;

            if($type == "1" || $type == "3"){
                $type = " AND e.type = $type ";
            }else{
                $type = "  AND e.type != 2";
            }
            if($clientType == "1" || $clientType == "2" || $clientType == '3'){
                $clientType = " AND e.clientType = $clientType ";
            }else{
                $clientType = "";
            }
            $clientWhere = '';
            if($client != 'null' && $client != ''){
                $clientWhere .= " AND e.client = $client";
            }
            $statusWhere = '';
            if($status != '-'){
                if(intval($status) == 0){       // Pendiente
                    $statusWhere .= ' 
                        AND i.invoice_type != 3 
                        AND i.paymentState = 0 
                        AND i.ID = (
                            SELECT  MAX(i2.ID)
                            FROM    Invoices i2
                            WHERE   i2.expedient = i.expedient AND
                                    i2.leavingDate IS NULL
                        )
                    ';
                }else if(intval($status) == 1){ // Pagada
                    $statusWhere .= ' 
                        AND i.invoice_type != 3 
                        AND i.paymentState = 1 
                        AND i.ID = (
                            SELECT  MAX(i2.ID)
                            FROM    Invoices i2
                            WHERE   i2.expedient = i.expedient AND
                                    i2.leavingDate IS NULL AND
                                    (
                                        i2.rectified_type IS NULL OR
                                        i2.rectified_type != 2
                                    )
                        )
                    ';
                }else if(intval($status) == 2){ // Pago parcial
                    $statusWhere .= ' 
                        AND i.invoice_type != 3 
                        AND i.paymentState = 0 
                        AND i.pay > 0 
                        AND i.pay < i.total
                        AND i.ID = (
                            SELECT  MAX(i2.ID)
                            FROM    Invoices i2
                            WHERE   i2.expedient = i.expedient AND
                                    i2.leavingDate IS NULL AND
                                    (
                                        i2.rectified_type IS NULL OR
                                        i2.rectified_type != 2
                                    )
                        )
                    ';
                }else if(intval($status) == 3){ // Rectificada
                    $statusWhere .= ' 
                        AND (i.rectified_type IS NULL OR i.rectified_type != 2)
                        AND 
                            i.ID != (
                                SELECT  MAX(i2.ID)
                                FROM    Invoices i2
                                WHERE   i2.expedient = i.expedient AND
                                        i2.leavingDate IS NULL AND
                                        (
                                            i2.rectified_type IS NULL OR
                                            i2.rectified_type != 2
                                        )
                            )
                    ';
                }else if(intval($status) == 4){ // Anulada
                    $statusWhere .= ' AND i.invoice_type = 3 AND i.anuledDate IS NOT NULL';
                }
            }
            $invoiceTypeWhere = '';
            if($invoiceType != 'null' && $invoiceType != '-' && $invoiceType != ''){
                $invoiceTypeWhere .= " AND i.billingSerie = $invoiceType";
            }

            if($search != ''){
                $searchWhere = " AND (e.number LIKE '%$search%'
                            OR i.generatedInvoiceNumber LIKE '%$search%'
                            OR c.brandName LIKE '%$search%'
                            OR c.name LIKE '%$search%'
                            OR c.surname LIKE '%$search%'
                            OR e.deceasedName LIKE '%$search%'
                            OR e.deceasedSurname LIKE '%$search%'
                            OR e.deceasedNIF LIKE '%$search%'
                            OR u.username LIKE '%$search%')";
            }else{
                $searchWhere = '';
            }

            $where = " $type $clientType $clientWhere $statusWhere $invoiceTypeWhere $searchWhere";
            
            if(isset($from) && isset($to)){
                $where .= " AND i.creationDate BETWEEN " . $from . " AND " . $to;
            }

            $result = $db->query("      SELECT      SUM(i.total) as total, SUM(i.pay) as pay, SUM(i.total - i.pay) as notPay
                                        FROM        (Invoices i, Expedients e, Users u)
                                        LEFT JOIN   Clients c ON c.clientId = e.client 
                                        WHERE       i.leavingDate IS NULL AND
                                                    i.expedient = e.expedientID AND
                                                    u.userID = i.user 
                                                    $where
            ");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArray($result)[0];
			}
        }

        /**
         * Actualiza el pago de una factura parcialmente
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

            $db->query(" UPDATE Invoices_Payments
                         SET    date = $date, 
                                amount = $amount 
                         WHERE  ID = $id");

            $result = $db->query("  SELECT  invoice
                                    FROM    Invoices_Payments
                                    WHERE   ID = $id");

            $idInvoice = $db->resultToArray($result)[0]["invoice"];

            //Cambiar el estado de la factura a pago parcial o pago completo
            $payments = $this->getCurrentPaymentsAndTotal($idInvoice);
           
            $total = $payments[0]['total'];
            $pagos_actuales = $payments[0]['pago_actual'];

            $items = $this->getPayments($idInvoice);
            $totalPay = 0;
            $maxDate = 0;
            foreach($items as $elem){
                if($maxDate < $elem['date']){
                    $maxDate = $elem['date'];
                }

                $totalPay += floatval($elem['amount']);
            }

            $db->query("    UPDATE  Invoices i
                            SET     i.pay = $totalPay
                            WHERE   i.ID = $idInvoice
            ");

            if ($pagos_actuales >= $total){                    
                //cambiar estado a pagada 
                $db->query("    UPDATE  Invoices i
                                SET     i.paymentState = 1
                                WHERE   i.ID = $idInvoice
                ");

                $db->query("    UPDATE  Invoices
                                SET     paymentDate = $maxDate
                                WHERE   ID = $idInvoice
                ");
            }else{                        
                //cambiar estado a pago parcial  
                $db->query("    UPDATE  Invoices i
                                SET     i.paymentState = 0
                                WHERE   i.ID = $idInvoice
                ");

                $db->query("    UPDATE  Invoices
                                SET     paymentDate = null
                                WHERE   ID = $idInvoice
                ");
            }
            return true;
        }

        /**
         * Elimina el pago de una factura parcialmente
         * 
         * @param int $id_inv Id de la factura
         * @param int $amount Cantidad pagada
         * @return array
         */
        public function deletePayment($id){
            $db = new DbHandler;      
            
            $id = cleanStr($id);
            $leavingDate = time();
          
            $db->query(" UPDATE Invoices_Payments
                         SET    leavingDate = $leavingDate
                         WHERE  ID = $id");

            $result = $db->query("  SELECT  invoice
                                    FROM    Invoices_Payments
                                    WHERE   ID = $id");

            $idInvoice = $db->resultToArray($result)[0]["invoice"];

            //Cambiar el estado de la factura a pago parcial o pago completo
            $payments = $this->getCurrentPaymentsAndTotal($idInvoice);
           
            $total = $payments[0]['total'];
            $pagos_actuales = $payments[0]['pago_actual'];

            $items = $this->getPayments($idInvoice);
            $totalPay = 0;
            foreach($items as $elem){
                $totalPay += floatval($elem['amount']);
            }

            if (
                abs(floatval($pagos_actuales)) >= abs(floatval($total)) &&
                floatval($pagos_actuales) != 0
            ){  
                                  
                $db->query("    UPDATE  Invoices i
                                SET     i.paymentState = 1,
                                        i.pay = $totalPay
                                WHERE   i.ID = $idInvoice");  
            }else{  
                //cambiar estado a pago parcial  
                $db->query("    UPDATE  Invoices i
                                SET     i.paymentState = 0,
                                        i.paymentDate  = null,
                                        i.pay = $totalPay
                                WHERE   i.ID = $idInvoice");                      
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

            $result = $db->query("  SELECT  COALESCE(SUM(ip.amount), 0) AS 'pago_actual', 
                                            COALESCE(i.total, 0) as total 
                                    FROM    Invoices_Payments ip, Invoices i 
                                    WHERE   i.ID = ip.invoice AND
                                            ip.invoice = $id_inv AND ip.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene la suma de los pagos realizados de una factura y el total
         * 
         * @param int $id Id de la factura
         * @param int $numHiring Referencia de la contratacion
         * 
         * @return array
         */
        public function getTotalInvoice($id, $numHiring){
            $db = new DbHandler;

            $id = cleanStr($id);
            $numHiring = cleanStr($numHiring);

            $result = $db->query("  SELECT  i.total
                                    FROM    Invoices i
                                    WHERE   i.expedient = $id AND 
                                            i.leavingDate IS NULL AND
                                            i.num_hiring = $numHiring
            ");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['total'];
        }

        /**
         * Descarga las facturas seleccionadas
         *
         * @param string $selected Facturas seleccionadas
         * @return array
         */
        public function listInvoicesDatatablesDownloadSelected($selected){
            $db = new DbHandler;

            $result = $db->query("  SELECT      e.expedientID, 
                                                e.number, 
                                                REPLACE(i.generatedInvoiceNumber, '/', '-') as number_invoice,
                                                i.ID as invoiceID
                                    FROM        (Invoices i, Users u, Expedients e)
                                    LEFT JOIN   Clients c ON c.clientId = e.client 
                                    WHERE       e.expedientID IN ($selected)
            ");

            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Actualiza una factura de un expediente al borrarlo
         *
         * @param array $data
         */
        public function updateOnDeleteExpedient($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            // Reseteamos las contrataciones
            $db->query("UPDATE  Expedients_Hirings
                        SET     `check` = 0
                        WHERE   expedient = " . $data);

            return true;
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
         * Devuelve información de la factura
         * 
         * @return int
         */
        public function getPaymentInfo($paymentId){
            $db = new DbHandler;

            $result = $db->query("  SELECT  iv.expedient, ivp.amount
                                    FROM    Invoices iv, Invoices_Payments ivp
                                    WHERE   ivp.ID = $paymentId AND
                                            ivp.invoice = iv.ID
            ");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Devuelve información de la factura
         * 
         * @return int
         */
        public function getInvoiceExpedient($invoiceID){
            $db = new DbHandler;

            $result = $db->query("  SELECT  iv.expedient
                                    FROM    Invoices iv
                                    WHERE   iv.ID = $invoiceID
            ");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Devuelve el numero de la factura para su descarga
         * 
         * @return int
         */
        public function getInvoiceInfoToDownload($invoiceID = null, $expedientID = null, $isRectified = null){
            $db = new DbHandler;

            $where = '';
            if($invoiceID != null){
                $where .= " AND iv.ID = $invoiceID";
            }else if($expedientID != null){
                $where .= "
                    AND iv.expedient = $expedientID 
                ";
            }else{
                return null;
            }

            $result = $db->query("  SELECT      iv.ID,
                                                REPLACE(iv.generatedInvoiceNumber, '/', '-') as number
                                    FROM        Invoices iv
                                    WHERE       iv.leavingDate IS NULL
                                                $where
                                    ORDER BY    iv.ID DESC
            ");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        private function deleteDir($dir){
            foreach(scandir($dir) as $elem){
                if($elem != '.' && $elem != '..'){
                    if(is_file("$dir/$elem")){
                        unlink("$dir/$elem");
                    }else if(is_dir("$dir/$elem")){
                        deleteDir("$dir/$elem");
                        rmdir("$dir/$elem");
                    }
                }
            }

            rmdir($dir);
        }
    }
?>