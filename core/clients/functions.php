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

    require_once($_SESSION['basePath'] . "model/clients.php");
    require_once($_SESSION['basePath'] . "model/prices.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getLocations':
                echo json_encode(getLocationsClient($_POST['clientID']));
            break;
            case 'getClient':
                echo json_encode(getClient($_POST['clientID']));
            break;
            case 'getClients':
                echo json_encode(getClient($_POST['clientID']));
            break;
            case 'getClientTypes':
                echo json_encode(getClientTypes());
            break; 
            case 'getPriceByType':
                echo json_encode(getPriceByType($_POST));
                break;
            case 'getActualPriceParticular':
                echo json_encode(getActualPriceParticular());
            break;
            case 'getPriceByTypeForTmpl':
                echo json_encode(getPriceByTypeForTmpl($_POST));
            break;
            case 'searchByID':
                echo json_encode(searchByID($_POST['priceID']));
            break;
            case 'getInfo':
                echo json_encode(getInfo($_POST['client']));
            break;
            case 'getSurveys':
                echo json_encode(getSurveys($_POST['client']));
            break;
            case 'createSurvey':
                echo json_encode(createSurvey($_POST['client']));
            break;
            case 'getSurvey':
                echo json_encode(getSurvey($_POST['survey']));
            break;
            case 'saveSurvey':
                echo json_encode(saveSurvey($_POST['survey'], $_POST['surveyInfo'], $_POST['notes']));
            break;
        }
    }

    /**
    * Obtiene los datos del Cliente
    *
    * @return array
    */
    function getClient($data){
        $clients = new Clients();
        return $clients->getClient($data);
    }

    /**
    * Obtiene los datos de los clientes
    *
    * @return array
    */
    function getClientTypes(){
        $clients = new Clients();
        return $clients->getClientTypes();
    }

    /**
    * Obtiene los datos de los clientes
    *
    * @return array
    */
    function getPriceByType($data){
        $clients = new Clients();
        return $clients->getPriceByType($data);
    }

    /**
    * Obtiene la tarifa del año actual para los particulares
    *
    * @return array
    */
    function getActualPriceParticular(){
        $clients = new Clients();
        return $clients->getActualPriceParticular();
    }
    /**
    * Obtiene los datos de los clientes
    *
    * @return array
    */
    function getPriceByTypeForTmpl($data){
        $clients = new Clients();
        return $clients->getPriceByTypeForTmpl($data);
    }

    /**
    * Obtiene los datos de la localidad para un cliente dado
    *
    * @return array
    */
    function getLocationsClient($data){
        $clients = new Clients();
        return $clients->getLocations($data);
    }

    /**
    * Obtiene los datos de la localidad para un cliente dado
    *
    * @return array
    */
    function searchByID($data){
        $prices = new Prices();
        return $prices->searchByID($data);
    }    

    /**
     * Obtiene información del cliente
     *
     * @param int $data ID del cliente
     * @return array
     */
    function getInfo($data){
        $clients = new Clients();
        return $clients->getInfo($data);
    }

    /**
     * Obtiene las encuestas de satisfacción del cliente
     * 
     * @param int $client Cliente
     * @return array
     */
    function getSurveys($client){
        $clients = new Clients;
        return $clients->getSurveys($client);
    }

    /**
     * Crea una encuesta de satisfacción para un cliente dado
     * 
     * @param int $client Client
     * @return bool
     */
    function createSurvey($client){
        $clients = new Clients;
        return $clients->createSurvey($client);
    }

    /**
     * Obtiene una encuesta
     * 
     * @param int $survey Survey
     * @return array
     */
    function getSurvey($survey){
        $clients = new Clients;
        return $clients->getSurvey($survey);
    }

    /**
     * Obtiene una encuesta
     * 
     * @param int $survey Survey
     * @param array $surveyInfo Survey info
     * @param string $notes Notes
     * @return array
     */
    function saveSurvey($survey, $surveyInfo, $notes){
        $clients = new Clients;
        return $clients->saveSurvey($survey, $surveyInfo, $notes);
    }
?>