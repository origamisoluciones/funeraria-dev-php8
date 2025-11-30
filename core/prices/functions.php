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

    require_once($_SESSION['basePath'] . "model/prices.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getInfoPage':
                echo json_encode(getInfoPage());
            break;
            case 'getPrices':
                echo json_encode(getPrices());
            break;
            case 'getParticularPrice':
                echo json_encode(getParticularPrice());
            break;
            case 'updatePrices':
                echo json_encode(updatePrices($_POST['percent'], $_POST['price'], $_POST['year']));
            break;
            case 'checkPrice':
                echo json_encode(checkPrice($_POST['name']));
            break;
            case 'checkPriceEdit':
                echo json_encode(checkPriceEdit($_POST['price'], $_POST['name'], $_POST['year']));
            break;
            case 'generateNextPrices':
                echo json_encode(generateNextPrices($_POST['prices']));
            break;
            case 'getClientsByPrice':
                echo json_encode(getClientsByPrice($_POST['price']));
            break;
            case 'exportClientsByPrice':
                echo json_encode(exportClientsByPrice($_POST['price']));
            break;
        }
    }

    // Funciones
    function getInfoPage(){
        $info = array();

        $settings = new Settings();
        $info['logo'] = $settings->getLogo();

        $info['pricesNextYear'] = $settings->getPricesNextYear();

        return $info;
    }

    // Funciones
    function getPrices(){
        $prices = new Prices();
        return $prices->list();
    }

    // Funciones
    function getParticularPrice(){
        $prices = new Prices();
        return $prices->getParticularPrice();
    }

    /**
     * Genera las nuevas tarifas
     * 
     * @param int $price Tarifa
     * @param int $year Año
     * @param float $percent Porcentaje
     */
    function updatePrices($percent, $price, $year){
        $prices = new Prices;
        return $prices->updatePrices($percent, $price, $year);
    }

    /**
     * Comprueba si ya existe una tarifa con el nombre dado
     * 
     * @param string $name Nombre
     * @return bool
     */
    function checkPrice($name){
        $prices = new Prices;
        return $prices->checkPrice($name);
    }

    /**
     * Comprueba si ya existe una tarifa con el nombre dado
     * 
     * @param int $price Tarifa
     * @param string $name Nombre
     * @return bool
     */
    function checkPriceEdit($price, $name, $year){
        $prices = new Prices;
        return $prices->checkPriceEdit($price, $name, $year);
    }

    /**
     * Genera las tarifas para el año próximo
     * 
     * @param array $prices Prices list
     * @return bool
     */
    function generateNextPrices($pricesParam){
        $prices = new Prices;

        return $prices->generateNextPrices($pricesParam);
    }

    /**
     * Obtiene un listado de clientes asociados a una tarifa
     * 
     * @param int $priceID Prices ID
     * @return bool
     */
    function getClientsByPrice($priceID){
        require_once($_SESSION['basePath'] . "model/clients.php");
        $clients = new Clients;

        return $clients->getClientsByPrice($priceID);
    }

    /**
     * Exporta un listado de clientes asociados a una tarifa
     * 
     * @param int $priceID Prices ID
     * @return bool
     */
    function exportClientsByPrice($priceID){
        require_once($_SESSION['basePath'] . "model/clients.php");
        $clients = new Clients;
        $clientsList = $clients->getClientsByPrice($priceID);

        $delimiter = ";";
    
        //create a file pointer
        $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/prices/plantilla.csv";
        $f = fopen($path, 'w');
    
        //set column headers
        $fields = array('Nombre y apellidos', 'Nombre Comercial', 'NIF');
        fputcsv($f, $fields, $delimiter);
    
        foreach($clientsList as $client){
            
            $client['name'] = str_replace (',', " ", $client['name']) . str_replace (',', " ", $client['surname']);
            $client['brandName'] = str_replace (',', " ", $client['brandName']);
            $client['nif'] = str_replace (',', " ", $client['nif']);
    
            $lineData = array($client['name'], $client['brandName'], $client['nif']);
            fputcsv($f, $lineData, $delimiter);
        }
    
        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/configuration/prices/plantilla.csv';
    }
?>