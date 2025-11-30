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
    
    require_once($_SESSION['basePath'] . "model/products.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getProductActions':
                echo json_encode(getProductActions());
            break;
            case 'getProductsServices':
                echo json_encode(getProductsServices());
            break;
            case 'existsImage':
                echo json_encode(existsImage($_POST['productID'],$_POST['productModelID']));
            break;
            case 'getPrice':
                echo json_encode(getPrice($_POST));
            break;
            case 'getProductsPrices':
                echo json_encode(getProductsPrices($_POST));
            break;
            case 'getStock':
                echo json_encode(getStock($_POST['model']));
            break;
            case 'getPriceByTypeClient':
                echo json_encode(getPriceByTypeClient($_POST['clientType']));
            break;
            case 'getIVATypes':
                echo json_encode(getIVATypes());
            break;
            case 'getClasses':
                echo json_encode(getClasses());
            break;
            case 'getTypes':
                echo json_encode(getTypes());
            break;
            case 'getPostForAction':
                echo json_encode(getPostForAction($_POST['actionID']));
            break;
            case 'existsProduct':
                echo json_encode(existsProduct($_POST['product']));
            break;
        }
    }
    
    /**
    * Obtiene los datos de las acciones que puede tener un producto
    *
    * @return array
    */
    function getProductActions(){
        $actions = new Products();
        return $actions->getProductActions();
    }
    
    /**
    * Obtiene los datos de las acciones que puede tener un producto
    *
    * @return array
    */
    function getProductsServices(){
        $products = new Products();
        return $products->getProductsServices();
    }

    /**
    * Obtiene el nombre del modelo de un producto
    *
    * @return array
    */
    function existsImage($product, $model){

        $path = "resources/files/{$_SESSION['company']}/products/". $product ."/models/". $model . "/";
        $files = glob($_SESSION['basePath'] . $path . "*"); // get all file names
        return count($files);
    }
    
    /**
    * Obtiene el nombre del modelo de un producto
    *
    * @return array
    */
    function getPrice($data){
        $price = new Products();
        return $price->getPrice($data);
    }

    /**
    * Obtiene la información asociada a los productos asociados
    *
    * @return array
    */
    function getProductsPrices($data){
        $price = new Products();
        return $price->getProductsPrices($data);
    }

    /**
     * Obtiene los datos del stock de un model del producto
     * 
     * @param array $data
     *
     * @return array
     */
    function getStock($data){
        $products = new Products();
        return $products->getStock($data);
    }

    /**
     * Obtiene la tarifa para el tipo de cliente del año actual
     * 
     * @param array $data
     * @return array
     */
    function getPriceByTypeClient($data){
        $model = new Products();
        return $model->getPriceByTypeClient($data);
    }

    /**
     * Obtiene los tipos de IVA
     * 
     * @return array
     */
    function getIVATypes(){
        $products = new Products;
        return $products->getIVATypes();
    }

    /**
     * Obtiene las clases de un producto
     * 
     * @return array
     */
    function getClasses(){
        $products = new Products;
        return $products->getClasses();
    }

    /**
     * Obtiene los tipos de productos
     * 
     * @return array
     */
    function getTypes(){
        $products = new Products;
        return $products->getTypes();
    }

    /**
     * Obtiene los puestos de trabajo para una acción de tipo personal
     * 
     * @return array
     */
    function getPostForAction($actionID){
        $products = new Products;
        return $products->getPostForAction($actionID);
    }

    /**
     * Comprueba si un producto existe
     * 
     * @param int $product Id del producto
     * @return bool
     */
    function existsProduct($product){
        $products = new Products;
        return $products->existsProduct($product);
    }
?>