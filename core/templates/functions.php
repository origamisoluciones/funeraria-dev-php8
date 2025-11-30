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
    require_once($_SESSION['basePath'] . "model/suppliers.php");
    require_once($_SESSION['basePath'] . "model/templates.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getTemplate':
                echo json_encode(getTemplate($_POST['templateID']));
            break;
            case 'getTemplates':
                echo json_encode(getTemplates());
            break;
            case 'getProduct':
                echo json_encode(getProduct($_POST['product']));
            break;
            case 'getProducts':
                echo json_encode(getProducts($_POST));
            break;
            case 'getProductsSupplied':
                echo json_encode(getProductsSupplied($_POST));
            break;
            case 'getProductsByTemplateForHirings':
                echo json_encode(getProductsByTemplateForHirings($_POST));
            break;
            case 'getProductsByTemplateSuppliedForHirings':
                echo json_encode(getProductsByTemplateSuppliedForHirings($_POST));
            break;
            case 'getProductModels':
                echo json_encode(getProductModels($_POST['product']));
            break;
            case 'getSupplier':
                echo json_encode(getSupplier($_POST['supplier']));
            break;
            case 'getPrice':
                echo json_encode(getPrice($_POST));
            break;
            case 'removeProduct':
                echo json_encode(removeProduct($_POST['ID']));
            break;
            case 'getTexts':
                echo json_encode(getTexts($_POST));
            break;
            case 'existsTemplate':
                echo json_encode(existsTemplate($_POST['template']));
            break;
        }
    }

    /**
    * Obtiene los datos de la plantilla en cuestión
    *
    * @return array
    */
    function removeProduct($data){
        $template = new Templates();
        return $template->removeProduct($data);
    }
    /**
    * Obtiene los datos de la plantilla en cuestión
    *
    * @return array
    */
    function getTemplate($data){
        $template = new Templates();
        return $template->getTemplate($data);
    }

    /**
    * Obtiene los datos de las plantillas
    *
    * @return array
    */
    function getTemplates(){
        $template = new Templates();
        return $template->getTemplates();
    }

    /**
    * Obtiene los datos del producto en cuestión
    *
    * @return array
    */
    function getProduct($data){
        $product = new Products();
        return $product->getProduct($data);
    }
    /**
    * Obtiene los datos del producto en cuestión
    *
    * @return array
    */
    function getProductsByTemplateForHirings($data){
        $product = new Templates();
        return $product->getProductsByTemplateForHirings($data);
    }
    /**
     * Obtiene los datos del producto en cuestión
     *
     * @param array
     * @return array
     */
    function getProductsByTemplateSuppliedForHirings($data){
        $product = new Templates();
        return $product->getProductsByTemplateSuppliedForHirings($data);
    }

    /**
    * Obtiene los datos del producto en cuestión
    *
    * @return array
    */
    function getProducts($data){
        $products = new Templates();
        return $products->getProducts($data);
    }
    /**
    * Obtiene los datos del producto en cuestión
    *
    * @return array
    */
    function getProductsSupplied($data){
        $products = new Templates();
        return $products->getProductsSupplied($data);
    }
    
    /**
    * Obtiene los datos de los modelos del producto
    *
    * @return array
    */
    function getProductModels($data){
        $products = new Products();
        return $products->getProductModels($data);
    }

    /**
    * Obtiene los datos del proveedor para un modelo de producto dado
    *
    * @return array
    */
    function getSupplier($data){
        $supplier = new Suppliers();
        return $supplier->getSupplier($data);
    }

    /**
    * Obtiene los datos del precio de este modelo de producto concreto
    *
    * @return array
    */
    function getPrice($data){
        $product = new Templates();
        return $product->getPrice($data);
    }

    /**
     * Obtiene los textos de un producto de la plantilla
     * 
     * @param array $data ID de la línea de producto de la plantilla
     * @return array
     */
    function getTexts($data){
        $templates = new Templates();
        return $templates->getTexts($data);
    }

    /**
     * Comprueba si una plantilla existe
     * 
     * @param array $template ID de la plantilla
     * @return bool
     */
    function existsTemplate($template){
        $templates = new Templates;
        return $templates->existsTemplate($template);
    }
?>