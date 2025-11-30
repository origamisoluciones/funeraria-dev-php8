<?php
require_once(__DIR__ . '/../../resources/plugins/qrcode/qrlib.php');

class Verifactu
{
    /** Operation status*/
    private $operationStatus = [
        '1' => 'AceptadoConErrores',
        '2' => 'Aceptado',
        '3' => 'Incorrecto'
    ];

    /** Systen information */
    private $systemInformation = null;
    
    /** Systen information */
    private $mode = 0;

    /** Data */
    private $data;

    /** Construct */
    public function __construct()
    {
        $this->data = [];
    }

    /**
     * Creates system information
     * 
     */
    private function setSystemInformation($companyID) {
        $this->systemInformation = new stdClass();

        $this->systemInformation->NombreRazon = 'SOFTWARE & AUDIT SPECIALIST, S.L.U.';
        $this->systemInformation->NIF = 'B16936999';
        $this->systemInformation->NombreSistemaInformatico = 'GESMEMORI';
        $this->systemInformation->IdSistemaInformatico = 22;
        $this->systemInformation->Version = 1.0;
        $this->systemInformation->NumeroInstalacion = $companyID;
        $this->systemInformation->TipoUsoPosibleSoloVerifactu = 'S';
        $this->systemInformation->TipoUsoPosibleMultiOT = 'S';
        $this->systemInformation->IndicadorMultiplesOT = 'N';
    }
    
    /**
     * Creates system information
     * 
     */
    public function setMode($mode) {
        $this->mode = $mode;
    }

    /**
     * Create Foot print high
     * @param string $reference
     * $referencia nos trae el String con los datos necesarios para generar un SHA256 valido
     * 
     */
    private function createFootprintHigh($reference)
    {
        return strtoupper(hash('sha256', $reference));
    }

    /**
     * Create details array object
     * @param array $details
     * $details nos trae un array con los detalles de la factura para el desglose
     * 
     */
    private function createDetails($details, $taxType) {
        $DetalleDesglose = [];
        $totalImport = 0;
        $totalQuote = 0;
        $DettalleDesgloseIndex = 0;

        foreach($details as $index => $value) {
            $DetalleDesglose[$DettalleDesgloseIndex] = new stdClass();

            $DetalleDesglose[$DettalleDesgloseIndex]->Impuesto = $taxType;
            $DetalleDesglose[$DettalleDesgloseIndex]->ClaveRegimen = '01';
            $DetalleDesglose[$DettalleDesgloseIndex]->CalificacionOperacion = 'S1';
            $DetalleDesglose[$DettalleDesgloseIndex]->TipoImpositivo = floatval($value['iva']);
            $DetalleDesglose[$DettalleDesgloseIndex]->BaseImponibleOimporteNoSujeto = floatval($value['import']);
            $DetalleDesglose[$DettalleDesgloseIndex]->CuotaRepercutida = floatval($value['quote']);

            $totalImport += floatval($value['import']) + floatval($value['quote']);
            $totalQuote += floatval($value['quote']);
            $DettalleDesgloseIndex++;
        }

        $totalQ = $totalQuote;
        $totalI = $totalImport;

        return 
            [
                'details' => $DetalleDesglose,
                'totalImport' => $totalI,
                'totalQuote' => $totalQ
            ];
    }


    /**
     * Get Footprint High Reference
     * @param object $data
     * Genera un String a partir de la información
     * del objeto:
     * $data->cabecera->IDfactura->IDEmisorFactura: es el nif del emisor
     * $data->cabecera->IDfactura->NumSerieFactura: el numero de serie de la factura
     * $data->cabecera->IDfactura->FechaExpedicionFactura: la fecha que se expidió
     * $data->cabecera->TipoFactura -> tipo de factura
     * $data->cabecera->CuotaTotal -> cuota total
     * $data->cabecera->ImporteTotal -> Importe Total de la factura
     * $data->cabecera->Huella -> la huella de la factura anterior si no se queda en blanco
     * $data->cabecera->FechaHoraHusoGenRegistro -> fecha en la que se genera el registro
     * el string que genera servira para crear el Footprint de la nueva factura
     * @return string footprintReference
     */
    private function getFootprintHighReference($data)
    {
        if($this->mode == 0) {
            $rawMark = [
                "IDEmisorFactura" => empty($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->IDFactura->IDEmisorFactura) ? "" : trim($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->IDFactura->IDEmisorFactura),
                "NumSerieFactura" => empty($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->IDFactura->NumSerieFactura) ? "" : trim($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->IDFactura->NumSerieFactura),
                "FechaExpedicionFactura" => empty($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->IDFactura->FechaExpedicionFactura) ? "" : trim($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->IDFactura->FechaExpedicionFactura),
                "TipoFactura" => empty($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->TipoFactura) ? "" : trim($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->TipoFactura),
                "CuotaTotal" => empty($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->CuotaTotal) ? "" : trim($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->CuotaTotal),
                "ImporteTotal" => empty($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->ImporteTotal) ? "" : trim($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->ImporteTotal),
                "Huella" => empty($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Encadenamiento->RegistroAnterior->Huella) ? "" : trim($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Encadenamiento->RegistroAnterior->Huella),
                "FechaHoraHusoGenRegistro" => empty($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->FechaHoraHusoGenRegistro) ? "" : trim($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->FechaHoraHusoGenRegistro)
            ];
        } else {
            $rawMark = [
                "IDEmisorFacturaAnulada" => empty($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->IDFactura->IDEmisorFacturaAnulada) ? "" : trim($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->IDFactura->IDEmisorFacturaAnulada),
                "NumSerieFacturaAnulada" => empty($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->IDFactura->NumSerieFacturaAnulada) ? "" : trim($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->IDFactura->NumSerieFacturaAnulada),
                "FechaExpedicionFacturaAnulada" => empty($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->IDFactura->FechaExpedicionFacturaAnulada) ? "" : trim($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->IDFactura->FechaExpedicionFacturaAnulada),
                "Huella" => empty($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->Encadenamiento->RegistroAnterior->Huella) ? "" : trim($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->Encadenamiento->RegistroAnterior->Huella),
                "FechaHoraHusoGenRegistro" => empty($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->FechaHoraHusoGenRegistro) ? "" : trim($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->FechaHoraHusoGenRegistro)
            ];
        }

        $footprintReference = '';

        foreach ($rawMark as $name => $value) {
            $footprintReference .= $name . '=' . $value . '&';
        }

        $footprintReference = rtrim($footprintReference, '&');
        return $footprintReference;
    }

    /**
     * ValidateData
     * 
     * @param object $data toda la informacion
     * @throws string error de validacion
     * @return void 
     * 
     * Esta fucion solo verifica los datos son correctos
     */
    private function validateData($data)
    {
        $validate = 0;
        if($this->mode == 0) {
            $validate += $this->checksMaxLenght($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->IDFactura->IDEmisorFactura, 100);
            $validate += $this->checksMaxLenght($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->IDFactura->NumSerieFactura, 100);
            $validate += $this->checksMaxLenght($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->IDFactura->FechaExpedicionFactura, 100);
            $validate += $this->checksMaxLenght($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->TipoFactura, 100);
            $validate += $this->checksMaxLenght($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->CuotaTotal, 100);
            $validate += $this->checksMaxLenght($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->ImporteTotal, 100);
            $validate += $this->checksMaxLenght($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Huella, 100);
            $validate += $this->checksMaxLenght($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->FechaHoraHusoGenRegistro, 100);
        } else {
            $validate += $this->checksMaxLenght($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->IDFactura->IDEmisorFacturaAnulada, 100);
            $validate += $this->checksMaxLenght($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->IDFactura->NumSerieFacturaAnulada, 100);
            $validate += $this->checksMaxLenght($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->IDFactura->FechaExpedicionFacturaAnulada, 100);
            $validate += $this->checksMaxLenght($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->Huella, 100);
            $validate += $this->checksMaxLenght($data->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->FechaHoraHusoGenRegistro, 100);
        }
        
        if ($validate > 0) {
            return ['status' => false, 'data' => 'validate'];
        }
        return ['status' => true, 'data' => true];
    }

    /**
     * Get Params 
     * @return Object $datos
     * Recupera la informacion de $_POST (F)
     * (*) De momento recoge la informacion 
     * necesaria para todo el desarrollo
     */
    private function getParamsInsert($companyID, $emisor, $emisorNIF, $billNumber, $description, $serieLetter, $client, $clientNif, $details, $date, $subsanacion = 0, $taxType, $prevBill = null, $recBill = null, $rectificativeType = null)
    {
        $date = new DateTime($date, new DateTimeZone('Europe/Madrid'));
        $stringDateCreate = date('Y-m-d H:i', time());
        $dateCreate = new DateTime($stringDateCreate, new DateTimeZone('Europe/Madrid'));

        $datos = new stdClass();
        $datos->RegFactuSistemaFacturacion = new stdClass();

        // Cabecera
        $datos->RegFactuSistemaFacturacion->Cabecera = new stdClass();
        $datos->RegFactuSistemaFacturacion->Cabecera->ObligadoEmision = new stdClass();
        $datos->RegFactuSistemaFacturacion->Cabecera->ObligadoEmision->NombreRazon = $emisor;
        $datos->RegFactuSistemaFacturacion->Cabecera->ObligadoEmision->NIF = $emisorNIF;
        // Cabecera

        // Registro factura / Registro Alta
        $datos->RegFactuSistemaFacturacion->RegistroFactura = new stdClass();
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta = new stdClass();
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->IDVersion = "1.0";
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->IDFactura = new stdClass();
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->IDFactura->IDEmisorFactura = $emisorNIF;
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->IDFactura->NumSerieFactura = $billNumber;
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->IDFactura->FechaExpedicionFactura = $date->format('d-m-Y');
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->NombreRazonEmisor = $emisor;
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Subsanacion = $subsanacion == 0 ? 'N' : 'S';
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->TipoFactura = $serieLetter;
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->DescripcionOperacion = $description;

        // Destinatarios
        if($serieLetter != 'R5' && $serieLetter != 'F2') {
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Destinatarios = new stdClass();
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Destinatarios->IDDestinatario = new stdClass();
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Destinatarios->IDDestinatario->NombreRazon = $client;
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Destinatarios->IDDestinatario->NIF = $clientNif;
        }
        // Destinatarios

        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Desglose = new stdClass();

        switch($serieLetter) {
            case 'R1':
            case 'R2':
            case 'R3':
            case 'R4':
            case 'R5':
                $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->TipoRectificativa = ($rectificativeType == 1 ? 'S' : 'I');
                if($rectificativeType == 1) {
                    $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->FechaOperacion = $recBill['date'];
                    $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->ImporteRectificacion = new stdClass();
                    $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->ImporteRectificacion->BaseRectificada = $recBill['import'];
                    $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->ImporteRectificacion->CuotaRectificada = $recBill['quote'];
                    
                    $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->FacturasRectificadas = new stdClass;
                    $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->FacturasRectificadas->IDFacturaRectificada = new stdClass;
    
                    $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->FacturasRectificadas->IDFacturaRectificada->IDEmisorFactura = $emisorNIF; 
                    $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->FacturasRectificadas->IDFacturaRectificada->NumSerieFactura = $recBill['billNumber'];
                    $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->FacturasRectificadas->IDFacturaRectificada->FechaExpedicionFactura = $recBill['date']; 
                }else{
                    $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->FacturasRectificadas = new stdClass();
                    $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->FacturasRectificadas->IDFacturaRectificada = [];
    
                    foreach ($recBill as $factura) {
                        $idRectificada = new stdClass();
                        $idRectificada->IDEmisorFactura = $emisorNIF;
                        $idRectificada->NumSerieFactura = $factura['billNumber'];
                        $idRectificada->FechaExpedicionFactura = $factura['date'];
    
                        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->FacturasRectificadas->IDFacturaRectificada[] = $idRectificada;
                    }
                }

                if($serieLetter == 'R5') {
                    $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->FacturaSinIdentifDestinatarioArt61d = 'S';
                }
            break;
            case 'F2':
                $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->FacturaSinIdentifDestinatarioArt61d = 'S';
            break;
        }
        // Desglose
        $infoDetails = $this->createDetails($details, $taxType);

        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Desglose->DetalleDesglose = $infoDetails['details'];
        // Desglose

        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->CuotaTotal = $infoDetails['totalQuote'];
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->ImporteTotal = $infoDetails['totalImport'];
        
        // Encadenamiento
        if($prevBill != null) {
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Encadenamiento = new stdClass();
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Encadenamiento->RegistroAnterior = new stdClass();
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Encadenamiento->RegistroAnterior->IDEmisorFactura = $emisorNIF;
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Encadenamiento->RegistroAnterior->NumSerieFactura = $prevBill['billNumber'];
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Encadenamiento->RegistroAnterior->FechaExpedicionFactura = $prevBill['date'];
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Encadenamiento->RegistroAnterior->Huella = $prevBill['hash'];
        } else {
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Encadenamiento = new stdClass();
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Encadenamiento->PrimerRegistro = 'S';
        }
        // Encadenamiento

        // Sistema informatico
        $this->setSystemInformation($companyID);
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->SistemaInformatico = $this->systemInformation;
        // Sistema informatico
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->FechaHoraHusoGenRegistro = $dateCreate->format('c');
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->TipoHuella = '01';
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Huella = '';
        // Registro factura / Registro Alta
        return $datos;
    }

    /**
     * Get Params 
     * @return Object $datos
     * Recupera la informacion de $_POST (F)
     * (*) De momento recoge la informacion 
     * necesaria para todo el desarrollo
     */
    private function getParamsCancel($companyID, $emisor, $emisorNIF, $billNumber, $description, $date, $prevBill = null)
    {
        $date = new DateTime($date, new DateTimeZone('Europe/Madrid'));
        $stringDateCreate = date('Y-m-d H:i', time());
        $dateCreate = new DateTime($stringDateCreate, new DateTimeZone('Europe/Madrid'));

        $datos = new stdClass();
        $datos->RegFactuSistemaFacturacion = new stdClass();

        // Cabecera
        $datos->RegFactuSistemaFacturacion->Cabecera = new stdClass();
        $datos->RegFactuSistemaFacturacion->Cabecera->ObligadoEmision = new stdClass();
        $datos->RegFactuSistemaFacturacion->Cabecera->ObligadoEmision->NombreRazon = $emisor;
        $datos->RegFactuSistemaFacturacion->Cabecera->ObligadoEmision->NIF = $emisorNIF;
        // Cabecera

        // Registro factura / Registro Alta
        $datos->RegFactuSistemaFacturacion->RegistroFactura = new stdClass();
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion = new stdClass();
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->IDVersion = "1.0";
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->IDFactura = new stdClass();
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->IDFactura->IDEmisorFacturaAnulada = $emisorNIF;
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->IDFactura->NumSerieFacturaAnulada = $billNumber;
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->IDFactura->FechaExpedicionFacturaAnulada = $date->format('d-m-Y');
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->NombreRazonEmisor = $emisor;
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->DescripcionOperacion = $description;

        // Encadenamiento
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->Encadenamiento = new stdClass();
        if($prevBill != null) {
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->Encadenamiento->RegistroAnterior = new stdClass();
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->Encadenamiento->RegistroAnterior->IDEmisorFactura = $emisorNIF;
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->Encadenamiento->RegistroAnterior->NumSerieFactura = $prevBill['billNumber'];
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->Encadenamiento->RegistroAnterior->FechaExpedicionFactura = $prevBill['date'];
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->Encadenamiento->RegistroAnterior->Huella = $prevBill['hash'];
        } else {
            $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->Encadenamiento->PrimerRegistro = 'S';
        }
        // Encadenamiento

        // Sistema informatico
        $this->setSystemInformation($companyID);
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->SistemaInformatico = $this->systemInformation;
        // Sistema informatico
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->FechaHoraHusoGenRegistro = $dateCreate->format('c');
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->TipoHuella = '01';
        $datos->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->Huella = '';
        // Registro factura / Registro Alta

        return $datos;
    }

    /**
     * Send To Verification 
     * 
     * Es donde se inicia el cliente SOAP y 
     * finalmente hacer la petición a un WS
     *  
     * @return void 
     */
    private function sendToVerifactu($params)
    {
        $wsdl = "https://prewww2.aeat.es/static_files/common/internet/dep/aplicaciones/es/aeat/tikeV1.0/cont/ws/SistemaFacturacion.wsdl";
        $client = new SoapClient($wsdl, array(
            'location' => URL_VERIFACTU_DEV,
            'soap_version' => SOAP_1_1,
            'trace' => true,
            'exceptions' => true,
            'cache_wsdl' => WSDL_CACHE_NONE,
            'stream_context' => stream_context_create([
                'ssl' => [
                    'verify_peer' => true,
                    'verify_peer_name' => true,
                    'allow_self_signed' => false,
                    'local_cert' => CERTIFICATE_RPJ_PEM,
                    'local_pk' => CERTIFICATE_RPJ_KEY,
                    'passphrase' => CERTIFICATE_PASS
                ],
                'http' => [
                    'timeout' => 30
                ]
            ])
        ));

        $this->data['status'] = null;
        $this->data['error'] = null;
        $this->data['error_description'] = null;
        $this->data['csv'] =  null;
        $this->data['xml'] =  null;

        try {
            $data = json_decode(json_encode($params), true);
            $response = $client->__soapCall("RegFactuSistemaFacturacion", $data);

            $this->data['status'] =  $response->RespuestaLinea->EstadoRegistro;
            if ($this->data['status'] == $this->operationStatus['3']) {
                $this->data['error'] = $response->RespuestaLinea->CodigoErrorRegistro;
                $this->data['error_description'] = $response->RespuestaLinea->DescripcionErrorRegistro;
            } else if ($this->data['status'] == $this->operationStatus['1']) {
                $this->data['error'] = $response->RespuestaLinea->CodigoErrorRegistro;
                $this->data['error_description'] = $response->RespuestaLinea->DescripcionErrorRegistro;
                $this->data['csv'] =  $response->CSV;
            } else {
                $this->data['csv'] =  $response->CSV;
                $this->data['xml'] = $client->__getLastRequest();
            }
            return true;
        } catch (SoapFault $e) {
            // $this->data['status'] = $this->operationStatus['3'];
            $this->data['error'] = explode(']' ,explode('Codigo[', $e->getMessage())[1])[0];
            $this->data['error_description'] = $e->getMessage();
            $this->data['xml'] = $client->__getLastResponse();
            return false;
        }
    }

    /**
     * Creates QR code
     * 
     */
    private function createQrCode($nif, $numFactura, $date, $price, $filePath = null)
    {
        if($filePath == null) {
            return ['status' => false, 'data' => ''];
        }

        $urlQr = URL_QR_VERIFACTU_DEV . "?nif=$nif&numserie=$numFactura&fecha=$date&importe=$price";

        if(!is_dir($filePath)) {
            mkdir($filePath, 0777);
        }

        $fileURL = $filePath . 'qr_verifactu.png';

        QRcode::png($urlQr, $fileURL);

        return ['status' => true, 'data' => $fileURL];
    }

    /**
     * Inserts normal bill
     * 
     * @param string $emisor Name
     * @param string $emisorNif Nif
     * @param string $billNumber Bill number
     * @param string $description Description
     * @param string $serieLetter Bill type
     * @param string $client client
     * @param string $clientNif Nif client
     * @param array $details Details
     * @param string $filePath File path
     * @param string $date Date
     * @param string $subsanacion Subsanacion
     * @param array $prevBill prevBill
     * 
     * @return array data
     */
    public function createBill($companyID, $emisor, $emisorNIF, $billNumber, $description, $serieLetter, $client, $clientNif, $details, $filePath, $date, $subsanacion = 0, $taxType, $prevBill = null) {
        $stringDate = date('Y-m-d H:i', $date);
        $this->setMode(0);

        $params = new stdClass();
        //primero tendriamos que ir a buscar el footprint anterior
        $params = $this->getParamsInsert($companyID, $emisor, $emisorNIF, $billNumber, $description, $serieLetter, $client, $clientNif, $details, $stringDate, $subsanacion, $taxType, $prevBill);
        $validate = $this->validateData($params);

        if (!$validate['status']) {
            return ['status' => true, 'data' => 'validate'];
        }

        $rawFootprint = $this->getFootprintHighReference($params);
        //aqui generar y guardar el nuevo en la base de datos;
        $footprint = $this->createFootprintHigh($rawFootprint);
        $params->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Huella = $footprint;

        $this->data['footprint'] = $footprint;
        $this->data['import'] = $params->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->ImporteTotal;
        $this->data['quote'] = $params->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->CuotaTotal;

        $responseVerifactu = $this->sendToVerifactu($params);
        if($responseVerifactu) {
            $urlQR = $this->createQrCode($emisorNIF, $billNumber, date('d-m-Y', $date), $this->data['import'], $filePath);
            if($urlQR['status']) {
                $this->data['urlQr'] = $urlQR['data'];
            }
        }
        return $this->data;
    }

    /**
     * Cancels bills
     * 
     * @param string $emisor Name
     * @param string $emisorNif Nif
     * @param string $billNumber Bill number
     * @param string $description Description
     * @param string $date Date
     * @param array $prevBill prevBill
     * 
     * @return array data
     */
    public function cancelBill($companyID, $emisor, $emisorNIF, $billNumber, $description, $date, $prevBill = null) {
        $stringDate = date('Y-m-d H:i', $date);
        $this->setMode(1);

        $params = new stdClass();
        //primero tendriamos que ir a buscar el footprint anterior
        $params = $this->getParamsCancel($companyID,$emisor, $emisorNIF, $billNumber, $description, $stringDate, $prevBill);
        $validate = $this->validateData($params);

        if (!$validate['status']) {
            return ['status' => true, 'data' => 'validate'];
        }

        $rawFootprint = $this->getFootprintHighReference($params);
        //aqui generar y guardar el nuevo en la base de datos;
        $footprint = $this->createFootprintHigh($rawFootprint);
        $params->RegFactuSistemaFacturacion->RegistroFactura->RegistroAnulacion->Huella = $footprint;

        $this->data['footprint'] = $footprint;

        $this->sendToVerifactu($params);

        return $this->data;
    }
    
    /**
     * Inserts normal bill
     * 
     * @param string $emisor Name
     * @param string $emisorNif Nif
     * @param string $billNumber Bill number
     * @param string $description Description
     * @param string $serieLetter Bill type
     * @param string $client client
     * @param string $clientNif Nif client
     * @param array $details Details
     * @param string $filePath File path
     * @param string $date Date
     * @param string $subsanacion Subsanacion
     * @param array $prevBill prevBill
     * @param array $recBill recBill
     * @param int $rectificativeType rectificativeType
     * 
     * @return array data
     */
    public function rectificateBill($companyID, $emisor, $emisorNIF, $billNumber, $description, $serieLetter, $client, $clientNif, $details, $filePath, $date, $subsanacion = 0, $taxType, $prevBill = null, $recBill = null, $rectificativeType = 1) {
        $stringDate = date('Y-m-d H:i', $date);
        $this->setMode(0);

        $params = new stdClass();
        //primero tendriamos que ir a buscar el footprint anterior
        $params = $this->getParamsInsert($companyID, $emisor, $emisorNIF, $billNumber, $description, $serieLetter, $client, $clientNif, $details, $stringDate, $subsanacion, $taxType, $prevBill, $recBill, $rectificativeType);
        $validate = $this->validateData($params);

        if (!$validate['status']) {
            return ['status' => true, 'data' => 'validate'];
        }

        $rawFootprint = $this->getFootprintHighReference($params);
        //aqui generar y guardar el nuevo en la base de datos;
        $footprint = $this->createFootprintHigh($rawFootprint);
        $params->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->Huella = $footprint;

        $this->data['footprint'] = $footprint;
        $this->data['import'] = $params->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->ImporteTotal;
        $this->data['quote'] = $params->RegFactuSistemaFacturacion->RegistroFactura->RegistroAlta->CuotaTotal;
    
        $responseVerifactu = $this->sendToVerifactu($params);
        if($responseVerifactu) {
            $urlQR = $this->createQrCode($emisorNIF, $billNumber, date('d-m-Y', $date), $this->data['import'], $filePath);
            if($urlQR['status']) {
                $this->data['urlQr'] = $urlQR['data'];
            }
        }

        return $this->data;
    }

    /**
     * Checks a field max lenght
     * 
     * @param string $value Value
     * @param int $length Length
     * @return int
     */
    public function checksMaxLenght($value, $length){
        return mb_strlen($value) > $length ? 1 : 0;
    }
}