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

    if(empty($_POST) || !isset($_POST['type'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/statistics.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'filterGasoil':
                echo json_encode(filterGasoil($_POST['data']));
            break;
            case 'filterGasoilByYear':
                echo json_encode(filterGasoilByYear($_POST['data']));
            break;
            case 'filterMaking':
                echo json_encode(filterMaking($_POST['data']));
            break;
            case 'exportMaking':
                echo json_encode(exportMaking($_POST['data']));
            break;
            case 'exportGeneralStatistics':
                echo json_encode(exportGeneralStatistics($_POST['data']));
            break;
            case 'exportGeneralStatisticsClient':
                echo json_encode(exportGeneralStatisticsClient($_POST['data']));
            break;
            case 'filterDeceasedDestination':
                echo json_encode(filterDeceasedDestination($_POST['data']));
            break;
            case 'exportDeceasedDestination':
                echo json_encode(exportDeceasedDestination($_POST['data']));
            break;
            case 'filterAge':
                echo json_encode(filterAge($_POST['data']));
            break;
            case 'exportAge':
                echo json_encode(exportAge($_POST['data']));
            break;
            case 'exportMortuaryUse':
                echo json_encode(exportMortuaryUse($_POST['data']));
            break;
            case 'exportGasoil':
                echo json_encode(exportGasoil($_POST['data']));
            break;
            case 'exportServiceTimes':
                echo json_encode(exportServiceTimes($_POST['data']));
            break;
            case 'exportCremationsYear':
                echo json_encode(exportCremationsYear($_POST['data']));
            break;
            case 'filterMortuaryUse':
                echo json_encode(filterMortuaryUse($_POST['data']));
            break;
            case 'getServicesInfoDestination':
                echo json_encode(getServicesInfoDestination());
            break;
            case 'fillSelectsGeneral':
                echo json_encode(fillSelectsGeneral());
            break;
            case 'getSummaryGeneral':
                echo json_encode(getSummaryGeneral($_POST['year']));
            break;
            case 'getGeneralStatistics':
                echo json_encode(getGeneralStatistics($_POST['dateStart'], $_POST['dateEnd'], $_POST['products'], $_POST['mortuaries']));
            break;
            case 'getGeneralStatisticsClientInsurance':
                echo json_encode(getGeneralStatisticsClientInsurance($_POST['clientID'], $_POST['dateStart'], $_POST['dateEnd'], $_POST['products'], $_POST['mortuaries']));
            break;
            case 'getGeneralStatisticsClientType':
                echo json_encode(getGeneralStatisticsClientType($_POST['clientType'], $_POST['dateStart'], $_POST['dateEnd'], $_POST['products'], $_POST['mortuaries']));
            break;
            case 'getTotalDeceased':
                echo json_encode(getTotalDeceased($_POST['since'], $_POST['until']));
            break;
            case 'getDeceasedByYear':
                echo json_encode(getDeceasedByYear());
            break;
            case 'deceasedByYearDay':
                echo json_encode(deceasedByYearDay());
            break;
            case 'deceasedByYearNight':
                echo json_encode(deceasedByYearNight());
            break;
            case 'dayvsnight':
                echo json_encode(dayvsnight());
            break;
            case 'nightvsday':
                echo json_encode(nightvsday());
            break;
            case 'getCrematoriums':
                echo json_encode(getCrematoriums($_POST['data']));
            break;
            case 'getCrematoriumsOwnServices':
                echo json_encode(getCrematoriumOwnService($_POST['data']));
            break;
            case 'getCrematoriumsOutServices':
                echo json_encode(getCrematoriumOutService($_POST['data']));
            break;
            case 'getCrematoriumsMonthsDays': // Esta funcion se utiliza para las dos tablas de Estadisticas > Generales > Cremaciones
                echo json_encode(getCrematoriumsMonthsDays($_POST['year'], $_POST['month']));
            break;
            case 'getJudicialesMonthsDays': // Esta funcion se utiliza para las dos tablas de Estadisticas > Generales > Judiciales
                echo json_encode(getJudicialesMonthsDays($_POST['year'], $_POST['month'], $_POST['departure'], $_POST['return'] ));
            break;
            case 'exportDestinationInfo':
                echo json_encode(exportDestinationInfo($_POST['data']));
            break;
            case 'exportDestinationCost':
                echo json_encode(exportDestinationCost($_POST['data']));
            break;
            case 'exportDataTotalDeceasedWeek':
                echo json_encode(exportDataTotalDeceasedWeek($_POST['data']));
            break;
            case 'exportDataTotalDeceasedTotal':
                echo json_encode(exportDataTotalDeceasedTotal($_POST['data']));
            break;
            case 'exportDataTotalDeceasedByYear':
                echo json_encode(exportDataTotalDeceasedByYear($_POST['data']));
            break;
            case 'exportDataTotalDeceasedDay':
                echo json_encode(exportDataTotalDeceasedDay($_POST['data']));
            break;
            case 'exportDataTotalDeceasedNight':
                echo json_encode(exportDataTotalDeceasedNight($_POST['data']));
            break;
            case 'exportDataTotalDayvsnight':
                echo json_encode(exportDataTotalDayvsnight($_POST['data']));
            break;
            case 'exportDataTotalNightvsday':
                echo json_encode(exportDataTotalNightvsday($_POST['data']));
            break;
            case 'exportDataTotalCrematoriums':
                echo json_encode(exportDataTotalCrematoriums($_POST['data']));
            break;
            case 'exportDataTotalCrematoriumsOwnServices':
                echo json_encode(exportDataTotalCrematoriumsOwnServices($_POST['data']));
            break;
            case 'exportDataTotalCrematoriumsOutServices':
                echo json_encode(exportDataTotalCrematoriumsOutServices($_POST['data']));
            break;
            case 'exportDataTotalCrematoriumsMonthsDays':
                echo json_encode(exportDataTotalCrematoriumsMonthsDays($_POST['data']));
            break;
            case 'exportDataTotalCrematoriumsWeek':
                echo json_encode(exportDataTotalCrematoriumsWeek($_POST['data']));
            break;
            case 'exportDataTotalJudicialesMonthsDays':
                echo json_encode(exportDataTotalJudicialesMonthsDays($_POST['data']));
            break;
            case 'exportDataTotalJudicialesWeek':
                echo json_encode(exportDataTotalJudicialesWeek($_POST['data']));
            break;
            case 'exportDataSummaryDays':
                echo json_encode(exportDataSummaryDays($_POST['data']));
            break;
            case 'exportDataSummaryTotal':
                echo json_encode(exportDataSummaryTotal($_POST['data']));
            break;
            case 'getControlPanel':
                echo json_encode(getControlPanel($_POST['data']));
            break;
            case 'exportControlPanelSummary':
                echo json_encode(exportControlPanelSummary($_POST['data']['sumary']));
            break;
            case 'exportControlPanelSummaryClient':
                echo json_encode(exportControlPanelSummaryClient($_POST['data'], $_POST['clientName']));
            break;
            case 'exportControlPanelSummaryFacturado':
                echo json_encode(exportControlPanelSummaryFacturado($_POST['data'], $_POST['clientName']));
            break;
            case 'exportControlPanelSummaryCobrado':
                echo json_encode(exportControlPanelSummaryCobrado($_POST['data'], $_POST['clientName']));
            break;
            case 'exportControlPanelSummaryPending':
                echo json_encode(exportControlPanelSummaryPending($_POST['data'], $_POST['clientName']));
            break;
            case 'exportControlPanelCremations':
                echo json_encode(exportControlPanelCremations($_POST['data']));
            break;
            case 'exportControlPanelCashflow':
                echo json_encode(exportControlPanelCashflow($_POST['data']));
            break;
            case 'exportControlPanelAccount':
                echo json_encode(exportControlPanelAccount($_POST['data']));
            break;
            case 'getEconomicPerformance':
                echo json_encode(getEconomicPerformance($_POST['data']));
            break;
            case 'getEconomicPerformanceInvoices':
                echo json_encode(getEconomicPerformanceInvoices($_POST));
            break;
            case 'getEconomicPerformanceFinancing':
                echo json_encode(getEconomicPerformanceFinancing($_POST));
            break;
            case 'getServicesTimes':
                echo json_encode(getServicesTimes($_POST['data']));
            break;
            case 'getControlPanelExpedients':
                echo json_encode(getControlPanelExpedients($_POST['data']));
            break;
            case 'getControlPanelFacturacion':
                echo json_encode(getControlPanelFacturacion($_POST['data']));
            break;
            case 'getControlPanelPayInvoices':
                echo json_encode(getControlPanelPayInvoices($_POST['data']));
            break;
            case 'getExpedientsPolls':
                echo json_encode(getExpedientsPolls($_POST['data']));
            break;
        }
    }
    
    /**
     * Obtiene las estadísticas de las confecciones
     * 
     * @param array $data Filtros
     * @return array
     */
    function filterMaking($data){
        $statistics = new Statistics;
        return $statistics->filterMaking($data);
    }    

     /**
     * Obtiene las estadísticas de los pedidos de gasoil
     * 
     * @param array $data Gasoil
     * @return array
     */
    function filterGasoil($data){
        $statistics = new Statistics;
        return $statistics->filterGasoil($data);
    }    

     /**
     * Obtiene las estadísticas de los pedidos de gasoil
     * 
     * @param array $data Gasoil
     * @return array
     */
    function filterGasoilByYear($data){
        $statistics = new Statistics;
        return $statistics->filterGasoilByYear($data);
    }    

    /**
     * Exporta a csv las estadísticas de las confecciones
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportMaking($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/confeccion.csv', 'w');
        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }
        fclose($f);
        return 'resources/files/' . $_SESSION['company'] . '/statistics/confeccion.csv';
    }

     /**
     * Exporta a csv las estadísticas generales
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportGeneralStatistics($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/generalStatistics.csv', 'w');
        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }
        fclose($f);
        return 'resources/files/' . $_SESSION['company'] . '/statistics/generalStatistics.csv';
    }

     /**
     * Exporta a csv las estadísticas generales de un cliente
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportGeneralStatisticsClient($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/generalStatistics1.csv', 'w');
        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }
        fclose($f);
        return 'resources/files/' . $_SESSION['company'] . '/statistics/generalStatistics1.csv';
    }

    /**
     * Obtiene las estadísticas del destino final de los difuntos
     * 
     * @param array $data Filtros
     * @return array
     */
    function filterDeceasedDestination($data){
        $statistics = new Statistics;
        return $statistics->filterDeceasedDestination($data);
    }

    /**
     * Exporta a csv las estadísticas del destino final de los difuntos
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDeceasedDestination($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/destinoFinalDifunto.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/destinoFinalDifunto.csv';
    }

    /**
     * Exporta a csv las estadísticas del destino final de los difuntos
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDestinationInfo($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/destinoFinalDifuntoInfo.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/destinoFinalDifuntoInfo.csv';
    }

    /**
     * Exporta a csv las estadísticas del destino final de los difuntos
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDestinationCost($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/destinoFinalDifuntoPrecios.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/destinoFinalDifuntoPrecios.csv';
    }

    
    /**
     * Obtiene las estadísticas de la edad media
     * 
     * @param array $data Filtros
     * @return array
     */
    function filterAge($data){
        $statistics = new Statistics;
        return $statistics->filterAge($data);
    }   
     /**
     * Exporta a csv las estadísticas de la edad media
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportAge($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/edades.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/edades.csv';
    }
    
    /**
    * Exporta a csv las estadísticas del uso de tanatorios
    * 
    * @param array $data Estadísticas
    * @return string
    */
    function exportMortuaryUse($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/usoTanatorio.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/usoTanatorio.csv';
    }

    /**
    * Exporta a csv las estadísticas de los datos de cremaciones
    * @param array $data Estadísticas
    * @return string
    */
    function exportGasoil($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/pedidosGasoil.csv', 'w');

        foreach($data as $elem){
            $elemAux = str_replace("<strong>", "", $elem);
            $elemAux = str_replace("</strong>", "", $elemAux);
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elemAux), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/pedidosGasoil.csv';
    }

    /**
    * Exporta a csv las estadísticas de horarios de servicios
    * 
    * @param array $data Estadísticas
    * @return string
    */
    function exportServiceTimes($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/horariosServicios.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/horariosServicios.csv';
    }

    /**
    * Exporta a csv las estadísticas del uso de tanatorios
    * 
    * @param array $data Estadísticas
    * @return string
    */
    function exportCremationsYear($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/registroPorAnho.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }
        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/registroPorAnho.csv';
    }

    /**
     * Obtiene las estadísticas del uso de tanatorios
     * 
     * @param array $data Filtros
     * @return array
     */
    function filterMortuaryUse($data){
        $statistics = new Statistics;
        return $statistics->filterMortuaryUse($data);
    }

    /**
     * Obtiene información de los servicios para un cliente, un lugar de fallecimiento y un tanatorio en concreto
     * 
     * @param int $client Cliente
     * @param int $deceasedLocation Lugar de fallecimiento
     * @param int $mortuary Tanatorio
     * @param string $destination Destino
     * @return array
     */
    function getServicesInfoDestination(){
        $statistics = new Statistics;
        return $statistics->getServicesInfoDestination($_POST);
    }

    /**
     * Obtiene los datos de los select para la estadística general
     */
    function fillSelectsGeneral(){
        $statistics = new Statistics;
        
        $data = array();

        // Total
        $data['yearsTotal'] = $statistics->getYearsTotal();

        return $data;
    }

    /**
     * Obtiene el resumen de la estadística general
     * 
     * @param int $year Año
     * @return array
     */
    function getSummaryGeneral($year){
        $statistics = new Statistics;
        if($year == '-'){
            $year = null;
        }
        return $statistics->getSummaryGeneral($year);
    }

    /**
     * Obtiene el resumen estadística generales
     * 
     * @param int $year Año
     * @return array
     */
    function getGeneralStatistics($dateStart, $dateEnd, $products, $mortuaries){
        $statistics = new Statistics;
        return $statistics->getGeneralStatistics($dateStart, $dateEnd, $products, $mortuaries);
    }
    
    /**
     * Obtiene el resumen estadística generales
     * 
     * @param int $year Año
     * @return array
     */
    function getGeneralStatisticsClientInsurance($insuranceID, $dateStart, $dateEnd, $products, $mortuaries){
        $statistics = new Statistics;
        return $statistics->getGeneralStatisticsClientInsurance($insuranceID, $dateStart, $dateEnd, $products, $mortuaries);
    }

    /**
     * Obtiene el resumen estadística generales
     * 
     * @param int $year Año
     * @return array
     */
    function getGeneralStatisticsClientType($clientType, $dateStart, $dateEnd, $products, $mortuaries){
        $statistics = new Statistics;
        return $statistics->getGeneralStatisticsClientType($clientType, $dateStart, $dateEnd, $products, $mortuaries);
    }

    /**
     * Obtiene las defunciones totales de la estadística general
     * 
     * @param int $since Desde
     * @param int $until Hasta
     * @return array
     */
    function getTotalDeceased($since, $until){
        $statistics = new Statistics;
        return $statistics->getTotalDeceased($since, $until);
    }

    /**
     * Obtiene las defunciones por año de la estadística general
     * 
     * @return array
     */
    function getDeceasedByYear(){
        $statistics = new Statistics;
        return $statistics->getDeceasedByYear();
    }

    /**
     * Obtiene las defunciones por año (día) de la estadística general
     * 
     * @return array
     */
    function deceasedByYearDay(){
        $statistics = new Statistics;
        return $statistics->deceasedByYearDay();
    }

    /**
     * Obtiene las defunciones por año (noche) de la estadística general
     * 
     * @return array
     */
    function deceasedByYearNight(){
        $statistics = new Statistics;
        return $statistics->deceasedByYearNight();
    }

    /**
     * Obtiene las defunciones por año (día vs noche) de la estadística general
     * 
     * @return array
     */
    function dayvsnight(){
        $statistics = new Statistics;
        return $statistics->dayvsnight();
    }

    /**
     * Obtiene las defunciones por año (noche vs día) de la estadística general
     * 
     * @return array
     */
    function nightvsday(){
        $statistics = new Statistics;
        return $statistics->nightvsday();
    }

    /**
     * Obtiene los datos de los crematorios de la estadística general
     * 
     * @return array
     */
    function getCrematoriums($crematorium){
        $statistics = new Statistics;
        return $statistics->getCrematoriums($crematorium);
    }

    /**
     * Obtiene los datos de los crematorios de servicios propios de la estadística general
     * 
     * @return array
     */
    function getCrematoriumOwnService($crematorium){
        $statistics = new Statistics;
        return $statistics->getCrematoriumOwnService($crematorium);
    }

    /**
     * Obtiene los datos de los crematorios de servicios propios de la estadística general
     * 
     * @return array
     */
    function getCrematoriumOutService($crematorium){
        $statistics = new Statistics;
        return $statistics->getCrematoriumOutService($crematorium);
    }

    /**
     * Obtiene los datos cremaciones de la estadística general
     * 
     * @return array
     */
    function getCrematoriumsMonthsDays($year, $month){
        $statistics = new Statistics;
        return $statistics->getCrematoriumsMonthsDays($year, $month);
    }

    /**
     * Obtiene los datos de las judiciales de la estadística general
     * 
     * @return array
     */
    function getJudicialesMonthsDays($year, $month, $departure, $return){
        $statistics = new Statistics;
        return $statistics->getJudicialesMonthsDays($year, $month, $departure, $return);
    }

    /**
     * Exporta a csv las estadísticas del uso de tanatorios
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataTotalDeceasedWeek($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_totales_semana.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_totales_semana.csv';
    }

    /**
     * Exporta a csv las estadísticas del uso de tanatorios
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataTotalDeceasedTotal($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_totales.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_totales.csv';
    }

    /**
     * Exporta a csv las estadísticas del uso de tanatorios
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataTotalDeceasedByYear($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_por_ano.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_por_ano.csv';
    }

    /**
     * Exporta a csv las estadísticas del uso de tanatorios
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataTotalDeceasedDay($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_dia.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_dia.csv';
    }

    /**
     * Exporta a csv las estadísticas del uso de tanatorios
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataTotalDeceasedNight($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_noche.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_noche.csv';
    }

    /**
     * Exporta a csv las estadísticas del uso de tanatorios
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataTotalDayvsnight($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_diaVSnoche.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_diaVSnoche.csv';
    }

    /**
     * Exporta a csv las estadísticas del uso de tanatorios
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataTotalNightvsday($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_nocheVSdia.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_nocheVSdia.csv';
    }

    /**
     * Exporta a csv las estadísticas del uso de tanatorios
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataSummaryDays($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_crematorios.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_defunciones_crematorios.csv';
    }

    /**
     * Exporta a csv las estadísticas del uso de tanatorios
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataTotalCrematoriums($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_resumen_dias.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_resumen_dias.csv';
    }

    /**
     * Exporta a csv las estadísticas del uso de tanatorios
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataTotalCrematoriumsOwnServices($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_crematorios_propios.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_crematorios_propios.csv';
    }

    /**
     * Exporta a csv las estadísticas del uso de tanatorios
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataTotalCrematoriumsOutServices($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_crematorios_externos.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_crematorios_externos.csv';
    }

    /**
     * Exporta a csv las estadísticas de cremaciones por dia de mes
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataTotalCrematoriumsMonthsDays($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_cremaciones_mes_anho.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_cremaciones_mes_anho.csv';
    }

    /**
     * Exporta a csv las estadísticas de cremaciones por dia de semana
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataTotalCrematoriumsWeek($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_cremaciones_semana.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_cremaciones_semana.csv';
    }

    /**
     * Exporta a csv las estadísticas judiciales por dia de mes
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataTotalJudicialesMonthsDays($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_judiciales_mes_anho.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_judiciales_mes_anho.csv';
    }

    /**
     * Exporta a csv las estadísticas judiciales por dia de semana
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataTotalJudicialesWeek($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_judiciales_semana.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_judiciales_semana.csv';
    }

    /**
     * Exporta a csv las estadísticas del uso de tanatorios
     * 
     * @param array $data Estadísticas
     * @return string
     */
    function exportDataSummaryTotal($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/datos_resumen_total.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/statistics/datos_resumen_total.csv';
    }

    /**
     * Obtiene los datos para la estadística de cuadro de mando
     * 
     * @param array $data Filtros
     * @return array
     */
    function getControlPanel($data){
        $statistics = new Statistics;

        $date = $data['date'];
        $dateSince = $data['dateSince'];
        $dateUntil = $data['dateUntil'];
        $mortuary = $data['mortuary'];
        $clientType = $data['clientType'];
        $client = $data['client'];

        // Resumen facturación
        $summary = $statistics->getControlPanelSummary($date, $dateSince, $dateUntil, $mortuary, $clientType, $client);

        // Cremaciones
        $cremations = $statistics->getControlPanelCremations($date, $dateSince, $dateUntil, $mortuary, $clientType, $client);

        // Cash flow
        $cashflow = $statistics->getControlPanelCashFlow($date, $dateSince, $dateUntil, $mortuary);

        // Cuenta de resultados provisional sin Amort.
        $account = $statistics->getControlPanelProvisional($date, $dateSince, $dateUntil, $mortuary);

        // Para el gráfico
        $graff = $statistics->getControlPanelGrafico($date, $dateSince, $dateUntil, $mortuary, $clientType, $client);

        return array(
            'summary' => $summary,
            'cremations' => $cremations,
            'cashflow' => $cashflow,
            'account' => $account,
            'dataGraff' => $graff
        );
    }

    /**
     * Obtiene los datos para la estadística de encuestas de satisfacción
     * 
     * @param array $data Filtros
     * @return array
     */
    function getExpedientsPolls($data){
        $statistics = new Statistics;

        $dateSince = $data['dateSince'];
        $dateUntil = $data['dateUntil'];
        $mortuary = $data['mortuary'];
        $clientType = $data['clientType'];
        $client = $data['client'];
        $poll = $data['poll'];

        // Resumen encuestas de satisfacción
        $expedientsPolls = $statistics->getExpedientsPolls($dateSince, $dateUntil, $mortuary, $clientType, $client, $poll);

        return array(
            'expedients_polls' => $expedientsPolls
        );
    }

    /**
     * Exporta los datos del cuadro de mando - Resumen facturación
     * 
     * @param array $data Datos
     * @return string Ruta
     */
    function exportControlPanelSummary($summary){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/cm_resumen_facturacion.csv', 'w');
        foreach($summary as $index=>$elem){
            if($elem != null && $elem != ''){
                fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
                fseek($f, -1, SEEK_CUR); 
                fwrite($f, "\r\n");
            }
        }
        fclose($f);
        return 'statistics/cm_resumen_facturacion.csv';
    }

    /**
     * Exporta los datos del cuadro de mando - Resumen facturación
     * 
     * @param array $data Datos
     * @return string Ruta
     */
    function exportControlPanelSummaryClient($data, $clientName){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/cm_resumen_client.csv', 'w');
        
        $elemName = [' ',' ','Defunciones de ' .$clientName];
        fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elemName), ";");

        fseek($f, -1, SEEK_CUR); 
        fwrite($f, "\r\n");

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }
        fclose($f);
        return 'statistics/cm_resumen_client.csv';
    }

    /**
     * Exporta los datos del cuadro de mando - Resumen facturación
     * 
     * @param array $data Datos
     * @return string Ruta
     */
    function exportControlPanelSummaryFacturado($data, $clientName){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/cm_facturado.csv', 'w');
        
        $elemName = [' ',' ',' ','Facturación de ' .$clientName];
        fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elemName), ";");
        fseek($f, -1, SEEK_CUR); 
        fwrite($f, "\r\n");

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }
        fclose($f);
        return 'statistics/cm_facturado.csv';
    }

    /**
     * Exporta los datos del cuadro de mando - Resumen facturación
     * 
     * @param array $data Datos
     * @return string Ruta
     */
    function exportControlPanelSummaryCobrado($data, $clientName){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/cm_cobrado.csv', 'w');
        
        $elemName = [' ',' ',' ','Facturas cobradas de ' .$clientName];
        fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elemName), ";");
        fseek($f, -1, SEEK_CUR); 
        fwrite($f, "\r\n");

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }
        fclose($f);
        return 'statistics/cm_cobrado.csv';
    }

    /**
     * Exporta los datos del cuadro de mando - Resumen facturación
     * 
     * @param array $data Datos
     * @return string Ruta
     */
    function exportControlPanelSummaryPending($data, $clientName){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/cm_pendiente_cobro.csv', 'w');
       
        $elemName = [' ',' ',' ','Facturas pendientes de ' .$clientName];
        fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elemName), ";");
        fseek($f, -1, SEEK_CUR); 
        fwrite($f, "\r\n");

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }
        fclose($f);
        return 'statistics/cm_pendiente_cobro.csv';
    }

    /**
     * Exporta los datos del cuadro de mando - Cremaciones
     * 
     * @param array $data Datos
     * @return string Ruta
     */
    function exportControlPanelCremations($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/cm_cremaciones.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'statistics/cm_cremaciones.csv';
    }

    /**
     * Exporta los datos del cuadro de mando - Cash flow
     * 
     * @param array $data Datos
     * @return string Ruta
     */
    function exportControlPanelCashflow($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/cm_cash_flow.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'statistics/cm_cash_flow.csv';
    }

    /**
     * Exporta los datos del cuadro de mando - Cash flow
     * 
     * @param array $data Datos
     * @return string Ruta
     */
    function exportControlPanelAccount($data){
        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/statistics/cm_cuenta_sin_amort.csv', 'w');

        foreach($data as $elem){
            fputcsv($f, array_map(fn($valor) => mb_convert_encoding($valor, 'UTF-8', 'auto'), $elem), ";");
            fseek($f, -1, SEEK_CUR); 
            fwrite($f, "\r\n");
        }

        fclose($f);

        return 'statistics/cm_cuenta_sin_amort.csv';
    }

    /**
     * Obtiene los datos para mostrar en la estadísticas Rendimiento económico
     * 
     * @param array $data Datos
     * @return array
     */
    function getEconomicPerformance($data){
        $statistics = new Statistics;

        $date = $data['date'];
        $dateSince = $data['dateSince'];
        $dateUntil = $data['dateUntil'];

        return $statistics->getEconomicPerformance($date, $dateSince, $dateUntil);
    }

    /**
     * Obtiene los datos para mostrar en la estadísticas Rendimiento económico en la modal de facturas
     * 
     * @param array $data Datos
     * @return array
     */
    function getEconomicPerformanceInvoices($data){
        $statistics = new Statistics;

        $date = $data['date'];
        $dateSince = $data['dateSince'];
        $dateUntil = $data['dateUntil'];
        $mortuary = $data['mortuary'];
        $concept = $data['concept'];
        $expense = $data['expense'];

        return $statistics->getEconomicPerformanceInvoices($date, $dateSince, $dateUntil, $mortuary, $concept, $expense);
    }

    /**
     * Obtiene los datos para mostrar en la estadísticas Rendimiento económico en la modal de financiación
     * 
     * @param array $data Datos
     * @return array
     */
    function getEconomicPerformanceFinancing($data){
        $statistics = new Statistics;

        $date = $data['date'];
        $dateSince = $data['dateSince'];
        $dateUntil = $data['dateUntil'];
        $mortuary = $data['mortuary'];

        return $statistics->getEconomicPerformanceFinancing($date, $dateSince, $dateUntil, $mortuary);
    }

    /**
     * Obtiene los datos para mostrar en la estadísticas Horarios de servicios
     * 
     * @param array $data Datos
     * @return array
     */
    function getServicesTimes($data){
        $statistics = new Statistics;

        $staff = $data['staff'];
        $carriers = $data['carriers'];
        $dateSince = $data['dateSince'];
        $dateUntil = $data['dateUntil'];

        return $statistics->getServicesTimes($staff, $carriers, $dateSince, $dateUntil);
    }

    /**
     * Obtiene los expedientes asociados a un cliente
     * 
     * @param array $data Datos
     * @return array
     */
    function getControlPanelExpedients($data){
        $statistics = new Statistics;

        $client = $data['client'];
        $type = $data['type'];
        $costCenter = isset($data['costCenter']) && $data['costCenter'] != null ? $data['costCenter'] : '';
        $date = $data['date'];
        $dateSince = $data['dateSince'];
        $dateUntil = $data['dateUntil'];
        $cremation = isset($data['cremation']) ? $data['cremation'] : 0;
        $clientTypeFilter = isset($data['clientTypeFilter']) ? $data['clientTypeFilter'] : 0;
        $clientFilter = isset($data['clientFilter']) ? $data['clientFilter'] : 0;
        $expedientType = isset($data['expedientType']) ? $data['expedientType'] : 1;
        $isTotals = isset($data['isTotals']) ? $data['isTotals'] : 0;

        return $statistics->getControlPanelExpedients($client, $type, $costCenter, $date, $dateSince, $dateUntil, $cremation, $clientTypeFilter, $clientFilter, $expedientType, $isTotals);
    }

    /**
     * Obtiene los expedientes asociados a un cliente
     * 
     * @param array $data Datos
     * @return array
     */
    function getControlPanelFacturacion($data){
        $statistics = new Statistics;

        $client = $data['client'];
        $type = $data['type'];
        $costCenter = isset($data['costCenter']) && $data['costCenter'] != null ? $data['costCenter'] : '';
        $date = $data['date'];
        $dateSince = $data['dateSince'];
        $dateUntil = $data['dateUntil'];
        $mortuary = $data['mortuary'];
        $cremation = isset($data['cremation']) ? $data['cremation'] : 0;
        $clientTypeFilter = isset($data['clientTypeFilter']) ? $data['clientTypeFilter'] : 0;
        $clientFilter = isset($data['clientFilter']) ? $data['clientFilter'] : 0;
        $expedientType = isset($data['expedientType']) ? $data['expedientType'] : null;
        $isTotals = isset($data['isTotals']) ? $data['isTotals'] : 0;

        return $statistics->getControlPanelFacturacion($client, $type, $costCenter, $date, $dateSince, $dateUntil, $mortuary, $cremation, $clientTypeFilter, $clientFilter, $expedientType, $isTotals);
    }
    /**
     * Obtiene los expedientes asociados a un cliente
     * 
     * @param array $data Datos
     * @return array
     */
    function getControlPanelPayInvoices($data){
        $statistics = new Statistics;

        $client = $data['client'];
        $type = $data['type'];
        $costCenter = isset($data['costCenter']) && $data['costCenter'] != null ? $data['costCenter'] : '';
        $date = $data['date'];
        $dateSince = $data['dateSince'];
        $dateUntil = $data['dateUntil'];
        $mortuary = $data['mortuary'];
        $paid = $data['paid'];
        $clientTypeFilter = isset($data['clientTypeFilter']) ? $data['clientTypeFilter'] : 0;
        $clientFilter = isset($data['clientFilter']) ? $data['clientFilter'] : 0;
        $expedientType = isset($data['expedientType']) ? $data['expedientType'] : 1;

        return $statistics->getControlPanelPayInvoices($client, $type, $costCenter, $date, $dateSince, $dateUntil, $mortuary, $paid, $clientTypeFilter, $clientFilter, $expedientType);
    }
?>