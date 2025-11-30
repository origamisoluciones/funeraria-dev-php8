<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
    }

    if(!isset($_SESSION['user'])){
        http_response_code(403);
        return;
    }
    
    require_once($_SESSION['basePath'] . "model/expedients.php");
    require_once($_SESSION['basePath'] . "model/templates.php");
    require_once($_SESSION['basePath'] . "model/invoices.php");
    require_once($_SESSION['basePath'] . "model/clients.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){            
            case 'getAlbaran':
                echo json_encode(getAlbaran($_POST['deliveryNote']));
            break;
            case 'getAlbaranes':
                echo json_encode(getAlbaranes());
            break;
            case 'getAsistencia':
                echo json_encode(getAsistencia($_POST['service']));
            break;
            case 'getActaIncineracion':
                echo json_encode(getActaIncineracion($_POST['service']));
            break;
            case 'getActaJuzgado':
                echo json_encode(getActaJuzgado($_POST['service']));
            break;
            case 'getActaPreparacion':
                echo json_encode(getActaPreparacion($_POST['service']));
            break;
            case 'getAutoCremacion':
                echo json_encode(getAutoCremacion($_POST['service']));
            break;
            case 'getAutoPubliEsquela':
                echo json_encode(getAutoPubliEsquela($_POST['service']));
            break;
            case 'getCartaFlores':
                echo json_encode(getCartaFlores($_POST['service']));
            break;
            case 'getCartaFloresRegistro':
                echo json_encode(getCartaFloresRegistro($_POST['service']));
            break;
            case 'getConservTemporal':
                echo json_encode(getConservTemporal($_POST['service']));
            break;
            case 'getConservEmbalsamiento':
                echo json_encode(getConservEmbalsamiento($_POST['service']));
            break;
            case 'getContratoServiciosCompañias':
                echo json_encode(getContratoServiciosCompañias($_POST['service']));
            break;
            case 'getContratoServiciosFunerarios':
                echo json_encode(getContratoServiciosFunerarios($_POST['service']));
            break;
            case 'getCuestionarioSatisfaccion':
                echo json_encode(getCuestionarioSatisfaccion($_POST['service']));
            break;
            case 'getDatosIglesia':
                echo json_encode(getDatosIglesia($_POST['service']));
            break;
            case 'getDepositarCenizas':
                echo json_encode(getDepositarCenizas($_POST['service']));
            break;
            case 'getDistribution':
                echo json_encode(getDistribution($_POST['service']));
            break;
            case 'getExhumacionJudicial':
                echo json_encode(getExhumacionJudicial($_POST['service']));
            break;
            case 'getEsquela':
                echo json_encode(getEsquela($_POST['service']));
            break;
            case 'getFactura':
                echo json_encode(getFactura(
                    $_POST['service'], 
                    (isset($_POST['numHiring']) && $_POST['numHiring'] != '' && $_POST['numHiring'] != 'null' ? $_POST['numHiring'] : null),
                    (isset($_POST['rectifiedType']) ? $_POST['rectifiedType'] : null)
                ));
            break;
            case 'getFacturaRecivida':
                echo json_encode(getFacturaRecivida($_POST));
            break;
            case 'getReceivedInvoiceIvas':
                echo json_encode(getReceivedInvoiceIvas($_POST));
            break;
            case 'getIncTanatorioBoisaca':
                echo json_encode(getIncTanatorioBoisaca($_POST['service']));
            break;
            case 'getIncVigoMemorial':
                echo json_encode(getIncVigoMemorial($_POST['service']));
            break;
            case 'getJustificanteSepelio':
                echo json_encode(getJustificanteSepelio($_POST['service']));
            break;
            case 'getLapidaProvisional':
                echo json_encode(getLapidaProvisional($_POST));
            break;   
            case 'getLibroCrematorio':
                echo json_encode(getLibroCrematorio($_POST));
            break;
            case 'getLibroFuneraria':
                echo json_encode(getLibroFuneraria($_POST));
            break;
            case 'getLibroPersonal':
                echo json_encode(getLibroPersonal($_POST));
            break;
            case 'getLibroTanatorio':
                echo json_encode(getLibroTanatorio($_POST));
            break;
            case 'getLibroVisitas':
                echo json_encode(getLibroVisitas($_POST['service']));
            break;
            case 'getLiteralesPendientes':
                echo json_encode(getLiteralesPendientes());
            break;
            case 'getPrecintadoFeretro':
                echo json_encode(getPrecintadoFeretro($_POST['service']));
            break;
            case 'getPedido':
                echo json_encode(getPedido($_POST));
            break;
            case 'getPesameWeb':
                echo json_encode(getPesameWeb($_POST['service']));
            break;
            case 'getRecibis':
                echo json_encode(getRecibis($_POST['service']));
            break;
            case 'getRecibisIglesia':
                echo json_encode(getRecibisIglesia($_POST['service']));
            break;
            case 'getRecordatorio':
                echo json_encode(getRecordatorio($_POST['service']));
            break;
            case 'getRecordatorioSobre':
                echo json_encode(getRecordatorioSobre($_POST['service']));
            break;
            case 'getResumenServicio':
                echo json_encode(getResumenServicio($_POST['service']));
            break;
            case 'getResumenHoy':
                echo json_encode(getResumenHoy());
            break;
            case 'getRetirarCenizas':
                echo json_encode(getRetirarCenizas($_POST['service']));
            break;
            case 'getActaExtraccionDispositivos':
                echo json_encode(getActaExtraccionDispositivos($_POST['service']));
            break;
            case 'getRecibisCampanerosLaFE':
                echo json_encode(getRecibisCampanerosLaFE($_POST['service']));
            break;
            case 'getSituacionNichoJudicial':
                echo json_encode(getSituacionNichoJudicial($_POST['service']));
            break;                
            case 'getSolicitudLiterales':
                echo json_encode(getSolicitudLiterales($_POST['service']));
            break;                
            case 'getSolicitudNecropsia':
                echo json_encode(getSolicitudNecropsia($_POST['service']));
            break;                
            case 'getTrasladoCenizasCadaver':
                echo json_encode(getTrasladoCenizasCadaver($_POST['service']));
            break;                
            case 'countPdfs':
                echo json_encode(countPdfs($_POST));
            break;
            case 'savePDF':
                echo json_encode(savePDF($_POST));
            break;
            case 'setServiceValue':
                echo json_encode(setServiceValue($_POST));
            break;
            case 'setLogRead':
                echo json_encode(setLogRead($_POST['expedient']));
            break;               
            case 'getClientsCompany':
                echo json_encode(getClientsCompany());
            break;               
            case 'fillCartaFlores':
                echo json_encode(fillCartaFlores($_POST['expedient']));
            break;               
            case 'setCartaFlores':
                echo json_encode(setCartaFlores($_POST['expedient'], $_POST['data']));
            break;               
            case 'getStaffFuner':
                echo json_encode(getStaffFuner());
            break;               
            case 'getFamilyContact':
                echo json_encode(getFamilyContact($_POST['expedient']));
            break;               
            case 'getHojaPedido':
                echo json_encode(getHojaPedido($_POST['expedient']));
            break;
            case 'getMandatoExpreso':
                echo json_encode(getMandatoExpreso($_POST['expedient']));
            break;
            case 'getCrematoriumSummary':
                echo json_encode(getCrematoriumSummary($_POST['expedient']));
            break;
            case 'updateFirstSummaryDoc':
                echo json_encode(updateFirstSummaryDoc($_POST['expedient']));
            break;
            case 'getNotesTarifa':
                echo json_encode(getNotesTarifa($_POST['expedient']));
            break;
            case 'getFinanciacion':
                echo json_encode(getFinanciacion($_POST));
            break;
            case 'getFacturaProforma':
                echo json_encode(getFacturaProforma($_POST));
            break;
        }
    }
    
    /**
    * Obtiene los datos para el acta de incineración
    *
    * @return array
    */
    function getAlbaran($data){
        $albaran = new Expedients();
        return $albaran->getAlbaran($data);
    }

    /**
    * Obtiene los datos para el acta de incineración
    *
    * @return array
    */
    function getAlbaranes(){
        $albaran = new Expedients();
        return $albaran->getAlbaranes();
    }

    /**
    * Obtiene los datos para el acta de incineración
    *
    * @return array
    */
    function getAsistencia($data){
        $asistencia = new Expedients();
        return $asistencia->getAsistencia($data);
    }

    /**
    * Obtiene los datos para el acta de incineración
    *
    * @return array
    */
    function getActaIncineracion($data){
        $actaIncineracion = new Expedients();
        return $actaIncineracion->getActaIncineracion($data);
    }

    /**
    * Obtiene los datos para el acta de juzgado
    *
    * @return array
    */
    function getActaJuzgado($data){
        $actaJuzgado = new Expedients();
        return $actaJuzgado->getActaJuzgado($data);
    }

    /**
    * Obtiene los datos para el acta de preparacion
    *
    * @return array
    */
    function getActaPreparacion($data){
        $actaPreparacion = new Expedients();
        return $actaPreparacion->getActaPreparacion($data);
    }

    /**
    * Obtiene los datos para la autorización de cremación
    *
    * @return array
    */
    function getAutoCremacion($data){
        $autoCremacion = new Expedients();
        return $autoCremacion->getAutoCremacion($data);
    }

    /**
    * Obtiene los datos para la autorización d epublicación de esquela
    *
    * @return array
    */
    function getAutoPubliEsquela($data){
        $autoPubliEsquela = new Expedients();
        return $autoPubliEsquela->getAutoPubliEsquela($data);
    }

    /**
    * Obtiene los datos para la carta de flores
    *
    * @return array
    */
    function getCartaFlores($data){
        $cartaFlores = new Expedients();
        return $cartaFlores->getCartaFlores($data);
    }

    /**
    * Obtiene los datos para la carta de flores registro
    *
    * @return array
    */
    function getCartaFloresRegistro($data){
        $cartaFloresRegistro = new Expedients();
        return $cartaFloresRegistro->getCartaFloresRegistro($data);
    }

    /**
    * Obtiene los datos para la conservación temporal
    *
    * @return array
    */
    function getConservTemporal($data){
        $conservTemporal = new Expedients();
        return $conservTemporal->getConservTemporal($data);
    }

    /**
    * Obtiene los datos para la conservación embalsamiento
    *
    * @return array
    */
    function getConservEmbalsamiento($data){
        $conservEmbalsamiento = new Expedients();
        return $conservEmbalsamiento->getConservEmbalsamiento($data);
    }

    /**
    * Obtiene los datos para el contrato de servicios de compañías
    *
    * @return array
    */
    function getContratoServiciosCompañias($data){
        $contratoServiciosCompañias = new Expedients();
        return $contratoServiciosCompañias->getContratoServiciosCompañias($data);
    }

    /**
    * Obtiene los datos para el contrato de servicios funerarios
    *
    * @return array
    */
    function getContratoServiciosFunerarios($data){
        $contratoServiciosFuner = new Expedients();
        return $contratoServiciosFuner->getContratoServiciosFunerarios($data);
    }

    /**
     * Obtiene el cuestionario de satisfacción de un cliente para un año
     * 
     * @param int $survey Encuesta
     * @return array
     */
    function getCuestionarioCliente($survey){
        $clients = new Clients;
        return $clients->getSurveyPdf($survey);
    }

    /**
    * Obtiene los datos para el cuestionario de satisfacción
    *
    * @return array
    */
    function getCuestionarioSatisfaccion($data){
        $cuestionarioSatisfaccion = new Expedients();
        return $cuestionarioSatisfaccion->getCuestionarioSatisfaccion($data);
    }

    /**
    * Obtiene los datos para la iglesia
    *
    * @return array
    */
    function getDatosIglesia($data){
        $datosIglesia = new Expedients();
        return $datosIglesia->getDatosIglesia($data);
    }

    /**
    * Obtiene los datos para la deposición de cenizas
    *
    * @return array
    */
    function getDepositarCenizas($data){
        $depositarCenizas = new Expedients();
        return $depositarCenizas->getDepositarCenizas($data);
    }

    /**
    * Obtiene los datos para la deposición de cenizas
    *
    * @return array
    */
    function getDistribution($data){
        $distribution = new Expedients();
        return $distribution->getDistribution($data);
    }

    /**
    * Obtiene los datos para la exhumación del cadaver
    *
    * @return array
    */
    function getExhumacionJudicial($data){
        $exhumacionJudicial = new Expedients();
        return $exhumacionJudicial->getExhumacionJudicial($data);
    }

    /**
    * Obtiene los datos para la esquela
    *
    * @return array
    */
    function getEsquela($data){
        $expedients = new Expedients();
        return $expedients->getEsquela($data);
    }

    /**
    * Obtiene los datos para la factura
    *
    * @return array
    */
    function getFactura($data, $numHiring = null, $rectifiedType = null){
        $expedients = new Expedients();
        return $expedients->getFactura($data, $numHiring, $rectifiedType);
    }

    /**
    * Obtiene los datos para el presupuesto
    *
    * @return array
    */
    function getPresupuesto($data){
        $expedients = new Expedients();
        return $expedients->getPresupuesto($data);
    }
    
    /**
    * Obtiene los datos para una plantilla PDF
    *
    * @return array
    */
    function getTemplatePDF($data){
        $templates = new Templates();
        return $templates->getTemplatePDF($data);
    }

    /**
    * Obtiene los datos para la factura recibida
    *
    * @return array
    */
    function getFacturaRecivida($data){
        $expedients = new Expedients();
        return $expedients->getFacturaRecivida($data);
    }

    /**
    * Obtiene los datos para el desglose de ivas de una factura
    *
    * @return array
    */
    function getReceivedInvoiceIvas($data){
        $expedients = new Expedients();
        return $expedients->getReceivedInvoiceIvas($data);
    }

    /**
    * Obtiene los datos para la incieracion tanatorio boisaca
    *
    * @return array
    */
    function getIncTanatorioBoisaca($data){
        $incTanatorioBoisaca = new Expedients();
        return $incTanatorioBoisaca->getIncTanatorioBoisaca($data);
    }

    /**
    * Obtiene los datos para la incineracion vigo memorial
    *
    * @return array
    */
    function getIncVigoMemorial($data){
        $incVigoMemorial = new Expedients();
        return $incVigoMemorial->getIncVigoMemorial($data);
    }


    /**
    * Obtiene los datos para la exhumación judicial
    *
    * @return array
    */
    function getJustificanteSepelio($data){
        $justificanteSepelio = new Expedients();
        return $justificanteSepelio->getJustificanteSepelio($data);
    }
    
    /**
     * Obtiene los datos para el libro de visitas
     *
     * @param array $data ID del expediente
     * @return array
     */
    function getLapidaProvisional($data){
        $lapidaProvisional = new Expedients;
        return $lapidaProvisional->getLapidaProvisional($data);
    }

    /**
    * Obtiene los datos para el libro de visitas
    *
    * @return array
    */
    function getLibroCrematorio($data){
        $libroCrematorio = new Expedients();
        return $libroCrematorio->getLibroCrematorio($data);
    }

    /**
    * Obtiene los datos para el libro de visitas
    *
    * @return array
    */
    function getLibroFuneraria($data){
        $libroFuneraria = new Expedients();
        return $libroFuneraria->getLibroFuneraria($data);
    }

    /**
    * Obtiene los datos para el libro de visitas
    *
    * @return array
    */
    function getLibroPersonal($data){
        $libroPersonal = new Expedients();
        return $libroPersonal->getLibroPersonal($data);
    }

    /**
    * Obtiene los datos para el libro de visitas
    *
    * @return array
    */
    function getLibroTanatorio($data){
        $libroTanatorio = new Expedients();
        return $libroTanatorio->getLibroTanatorio($data);
    }

    /**
    * Obtiene los datos para el libro de visitas
    *
    * @return array
    */
    function getLibroVisitas($data){
        $libroVisitas = new Expedients();
        return $libroVisitas->getLibroVisitas($data);
    }

    /**
    * Obtiene los datos para el libro de visitas
    *
    * @return array
    */
    function getLiteralesPendientes(){
        $literalesPendientes = new Expedients();
        return $literalesPendientes->getLiteralesPendientes();
    }

    /**
    * Obtiene los datos para el precintado del feretro
    *
    * @return array
    */
    function getPrecintadoFeretro($data){
        $precintadoFeretro = new Expedients();
        return $precintadoFeretro->getPrecintadoFeretro($data);
    }

    /**
    * Obtiene los datos para el pesameWeb
    *
    * @return array
    */
    function getPedido($data){
        $pedido = new Expedients();
        return $pedido->getPedido($data);
    }

    /**
     * Obtiene los datos de un pedido no conforme para pdf de no conformidad
     * 
     * @param int $order Pedido
     * @return array
     */
    function getPedidoNoConformidad($order){
        $expedient = new Expedients;
        return $expedient->getOrderNonApproval($order);
    }

    /**
    * Obtiene los datos para el pesameWeb
    *
    * @return array
    */
    function getPesameWeb($data){
        $pesameWeb = new Expedients();
        return $pesameWeb->getPesameWeb($data);
    }

    /**
    * Obtiene los datos para el pesameWeb
    *
    * @return array
    */
    function getPlantillaTarifa($data){
        require_once($_SESSION['basePath'] . "model/prices.php");
        $prices = new Prices;
        return $prices->getPlantillaTarifa($data);
    }

    /**
    * Obtiene los datos para el recibis
    *
    * @return array
    */
    function getRecibis($data){
        $recibis = new Expedients();
        return $recibis->getRecibis($data);
    }

    /**
    * Obtiene los datos para el recibis iglesia
    *
    * @return array
    */
    function getRecibisIglesia($data){
        $recibisIglesia = new Expedients();

        //Si el cliente es Albia, cogemos los datos de Sta Lucia -> Modificación solicitada por Pesy el 27/10/2020
        if($recibisIglesia->getClientByExpedient($data) == '409' && $_SESSION['company'] == '1'){
            return $recibisIglesia->getRecibisIglesia($data, "17");
        }else{
            return $recibisIglesia->getRecibisIglesia($data);
        }
    }

    /**
    * Obtiene los datos para los recordatorios
    *
    * @return array
    */
    function getRecordatorioSobre($data){
        $recibisIglesia = new Expedients();
        return $recibisIglesia->getRecordatorioSobre($data);
    }

    /**
     * Obtiene los datos para los recordatorios
     *
     * @return array
     */
    function getRecordatorio($data){
        $recibisIglesia = new Expedients;
        return $recibisIglesia->getRecordatorio($data);
    }

    /**
    * Obtiene los datos para los registros literales
    *
    * @return array
    */
    // function getRegistroLiterales($month, $year){
    //     $registroLiterales = new Expedients();
    //     return $registroLiterales->getRegistroLiterales($month, $year);
    // }

    /**
    * Obtiene los datos para los recordatorios
    *
    * @return array
    */
    function getResumenServicio($data){
        $retirarCenizas = new Expedients();
        return $retirarCenizas->getResumenServicio($data);
    }

    /**
    * Obtiene los datos para los recordatorios
    *
    * @return array
    */
    function getSearchSummary($data){
        $retirarCenizas = new Expedients();
        return $retirarCenizas->getSearchSummary($data);
    }

    /**
    * Obtiene los datos para los recordatorios
    *
    * @return array
    */
    function getResumenHoy(){
        $retirarCenizas = new Expedients();
        return $retirarCenizas->listTodayExpedients();
    }

    /**
    * Obtiene los datos para los recordatorios
    *
    * @return array
    */
    function getResumenManhana(){
        $retirarCenizas = new Expedients();
        return $retirarCenizas->listTomorrowExpedients();
    }

    /**
    * Obtiene los datos para los recordatorios
    *
    * @return array
    */
    function getRetirarCenizas($data){
        $retirarCenizas = new Expedients();
        return $retirarCenizas->getRetirarCenizas($data);
    }

    /**
    * Obtiene los datos para los recordatorios
    *
    * @return array
    */
    function getActaExtraccionDispositivos($data){
        $retirarCenizas = new Expedients();
        return $retirarCenizas->getActaExtraccionDispositivos($data);
    }

    /**
    * Obtiene los datos para los recordatorios
    *
    * @return array
    */
    function getRecibisCampanerosLaFE($data){
        $retirarCenizas = new Expedients();
        return $retirarCenizas->getRecibisCampanerosLaFE($data);
    }

    /**
    * Obtiene los datos para situación nicho judicial
    *
    * @return array
    */
    function getSituacionNichoJudicial($data){
        $situacionNichoJudicial = new Expedients();
        return $situacionNichoJudicial->getSituacionNichoJudicial($data);
    }

    /**
    * Obtiene los datos para solicitud de literales
    *
    * @return array
    */
    function getSolicitudLiterales($data){
        $solicitudLiterales = new Expedients();
        return $solicitudLiterales->getSolicitudLiterales($data);
    }

    /**
    * Obtiene los datos para solicitud de necropsia
    *
    * @return array
    */
    function getSolicitudNecropsia($data){
        $solicitudNecropsia = new Expedients();
        return $solicitudNecropsia->getSolicitudNecropsia($data);
    }

    /**
    * Obtiene los datos para traslado cenizas cadaver
    *
    * @return array
    */
    function getTrasladoCenizasCadaver($data){
        $trasladoCenizasCadaver = new Expedients();
        return $trasladoCenizasCadaver->getTrasladoCenizasCadaver($data);
    }   

    /**
     * Obtiene el número de pdfs (documentación) de un tipo para un expediente
     *
     * @param array Contiene el ID del expediente y el nombre del documento a buscar
     * 
     * @return int
     */
    function countPdfs($data){
        $expedients = new Expedients();
        return $expedients->countPdfs($data);
    }

    /**
     * Modifica el valor de services_auto para un pdf creado
     * 
     * @param array $data Datos del expediente, el modelo y la acción
     * @return bool
     */
    function setServiceValue($data){
        $expedients = new Expedients;
        return $expedients->setServiceValue($data);
    }

    /**
     * Guarda el libro de visitas como html
     * 
     * @param string $data Libro de visitas
     * @return bool
     */
    function savePDF($data){
        $expedients = new Expedients;
        return $expedients->savePDF($data);
    }

    /**
     * Logs
     *
     * @param int $expedient Id del expediente
     * @return bool
     */
    function setLogRead($expedient){
        require_once($_SESSION['basePath'] . "model/logs.php");

        $expedients = new Expedients;

        $logs = new Logs;
        $logs->createExpedient("Expedientes", $expedient, "Expedientes - Documentación - Consulta", "'Ha consultado la documentación'");
    }

    /**
    * Obtiene los clientes de tipo Empresa
    *
    * @return array
    */
    function getClientsCompany(){
        $clients = new Clients();
        return $clients->getClientsCompany();
    }

    /**
    * Obtiene los datos para la orden de cremación
    *
    * @return array
    */
    function getCremationData($expedient){
        $clients = new Expedients();
        return $clients->getCremationData($expedient);
    }

    /**
     * Obtiene los datos de la carta de flores para la ventana modal
     * 
     * @param int $expedient Expediente
     * @return array
     */
    function fillCartaFlores($expedient){
        $expedients = new Expedients;
        return $expedients->fillCartaFlores($expedient);
    }

    /**
     * Guarda los valores de la carta de flores
     * 
     * @param int $expedient Expediente
     * @param array $data Datos
     * @return bool
     */
    function setCartaFlores($expedient, $data){
        $expedients = new Expedients;
        return $expedients->setCartaFlores($expedient, $data);
    }

    /**
     * Obtiene el personal de tipo funerario
     * 
     * @return array
     */
    function getStaffFuner(){
        require_once($_SESSION['basePath'] . "model/staff.php");

        $staff = new Staff;
        return $staff->getStaffFuner();
    }
    /**
     * Obtiene el personal de tipo funerario
     * 
     * @return array
     */
    function getFamilyContact($expedient){
        require_once($_SESSION['basePath'] . "model/staff.php");

        $staff = new Staff;
        return $staff->getFamilyContact($expedient);
    }
    /**
     * Obtiene el personal de tipo funerario
     * 
     * @return array
     */
    function getSolicitudModificacion($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getSolicitudModificacion($expedient);
    }
    /**
     * Obtiene el personal de tipo funerario
     * 
     * @return array
     */
    function getRecibidoConformePoliza($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getRecibidoConformePoliza($expedient);
    }
    /**
     * Obtiene el personal de tipo funerario
     * 
     * @return array
     */
    function getAutorizacionPreventiva($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getAutorizacionPreventiva($expedient);
    }
    /**
     * Obtiene el personal de tipo funerario
     * 
     * @return array
     */
    function getPrestacionServicio($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getPrestacionServicio($expedient);
    }

    /**
     * Obtiene el personal de tipo funerario
     * 
     * @return array
     */
    function getAutoPrestacionServicio($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getAutoPrestacionServicio($expedient);
    }
    /**
     * Obtiene el personal de tipo funerario
     * 
     * @return array
     */
    function getFichaAsistencia($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getFichaAsistencia($expedient);
    }
    /**
     * Obtiene el personal de tipo funerario
     * 
     * @return array
     */
    function getHojaDatosServicio($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getHojaDatosServicio($expedient);
    }

    /**
     * Obtiene el personal de tipo funerario
     * 
     * @return array
     */
    function getFormularioPedido($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getFormularioPedido($expedient);
    }

    /**
     * Obtiene el personal de tipo funerario
     * 
     * @return array
     */
    function getHojaPedido($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getHojaPedido($expedient);
    }

    /**
     * Obtiene el personal de tipo funerario
     * 
     * @return array
     */
    function getAutoSepultura($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getAutoSepultura($expedient);
    }

    /**
     * Obtiene los datos del mandatos expreso
     * 
     * @return array
     */
    function getMandatoExpreso($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getMandatoExpreso($expedient);
    }

    /**
     * Obtiene los datos del mandatos expreso
     * 
     * @return array
     */
    function getCrematoriumSummary($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getCrematoriumSummary($expedient);
    }

    /**
     * Obtiene los datos del mandatos expreso
     * 
     * @return array
     */
    function updateFirstSummaryDoc($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->updateFirstSummaryDoc($expedient);
    }
    
    /**
     * Obtiene los datos del reconocimiento previo incineración
     * 
     * @return array
     */
    function getReconocPrevioIncineracion($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getReconocPrevioIncineracion($expedient);
    }
    
    /**
     * Obtiene los datos de la solicitud de modificación en el servicio funerario contratado
     * 
     * @return array
     */
    function getModificacionServicioFunerario($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getModificacionServicioFunerario($expedient);
    }
    
    /**
     * Obtiene los datos del modelo de hoja de datos
     * 
     * @return array
     */
    function getModeloHojaDeDatos($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getModeloHojaDeDatos($expedient);
    }
    
    /**
     * Obtiene los datos del modelo de hoja de datos
     * 
     * @return array
     */
    function getNotesTarifa($expedient){
        require_once($_SESSION['basePath'] . "model/prices.php");

        $prices = new Prices;
        return $prices->getNotes($expedient);
    }
    
    /**
     * Obtiene los datos para el documento 'Recepción de cadáveres de otras funerarias'
     * 
     * @return array
     */
    function getRecepcionCadaveresOtrasFunerarias($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getRecepcionCadaveresOtrasFunerarias($expedient);
    }

    /**
     * Obtiene los datos de un pedido no conforme para pdf de no conformidad
     * 
     * @param int $order Pedido
     * @return array
     */
    function getHojaCementerio($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getHojaCementerio($expedient);
    }

    /**
     * Obtiene los datos para el documento 'Recepción de cadáveres de otras funerarias'
     * 
     * @return array
     */
    function getConservacionAutorizacionFamiliar($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getConservacionAutorizacionFamiliar($expedient);
    }

    /**
     * Obtiene los datos de la financiación
     *
     * @return array
     */
    function getFinanciacion($data){
        require_once($_SESSION['basePath'] . 'model/financing.php');

        $financing = new Financings;
        return $financing->getFinanciacion($data);
    }

    /**
     * Obtiene los datos para el documento parte defuncion
     * 
     * @param int $order Pedido
     * @return array
     */
    function getParteDefuncion($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;
        return $expedients->getParteDefuncion($expedient);
    }

    /**
     * Obtiene los datos para la factura proforma
     *
     * @return array
     */
    function getFacturaProforma($data){
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients();
        return $expedients->getFacturaProforma($data);
    }
?>