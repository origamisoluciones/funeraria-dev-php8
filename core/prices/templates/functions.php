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
            case 'getModels':
                echo json_encode(getModels($_POST['price']));
            break;
            case 'getModelsChecked':
                echo json_encode(getModelsChecked($_POST['price']));
            break;
            case 'existsTemplate':
                echo json_encode(existsTemplate($_POST['price']));
            break;
            case 'saveTemplate':
                echo json_encode(saveTemplate($_POST['save'], $_POST['notes']));
            break;
            case 'exportCsv':
                echo json_encode(exportCsv($_POST['price']));
            break;
            case 'getNotes':
                echo json_encode(getNotes($_POST['template']));
            break;
            case 'getModelsPrices':
                echo json_encode(getModelsPrices($_POST['price']));
            break;
            case 'saveTemplatePrices':
                echo json_encode(saveTemplatePrices($_POST['save'], $_POST['price']));
            break;
        }
    }

    /**
     * Obtiene los modelos
     * 
     * @param int $price Id de la tarifa
     * @return array
     */
    function getModels($price){
        $prices = new Prices;
        return $prices->getModels($price);
    }

    /**
     * Obtiene los modelos seleccionados
     * 
     * @param int $price Id de la tarifa
     * @return array
     */
    function getModelsChecked($price){
        $prices = new Prices;
        return $prices->getModelsChecked($price);
    }

    /**
     * Comprueba si existe una plantilla
     * 
     * @param int $price Id de la tarifa
     * @return array
     */
    function existsTemplate($price){
        $prices = new Prices;
        return $prices->existsTemplate($price);
    }

    /**
     * Guarda la plantilla
     * 
     * @param array $data Información a guardar
     * @return bool
     */
    function saveTemplate($data, $notes){
        $prices = new Prices;
        return $prices->saveTemplate($data, $notes);
    }

    /**
     * Exporta la plantilla a csv
     * 
     * @param int $price Tarifa
     * @return bool
     */
    function exportCsv($price){
        $prices = new Prices;
        return $prices->exportCsv($price);
    }

    /**
     * Exporta la plantilla a csv
     * 
     * @param int $price Tarifa
     * @return bool
     */
    function getNotes($template){
        $prices = new Prices;
        return $prices->getNotes($template);
    }

    /**
     * Obtiene los modelos
     * 
     * @param int $price Id de la tarifa
     * @return array
     */
    function getModelsPrices($price){
        $prices = new Prices;
        return $prices->getModelsPrices($price);
    }

    /**
     * Guarda la plantilla
     * 
     * @param array $data Información a guardar
     * @return bool
     */
    function saveTemplatePrices($data, $price){
        $prices = new Prices;
        return $prices->saveTemplatePrices($data, $price);
    }
?>