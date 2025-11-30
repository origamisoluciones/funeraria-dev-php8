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

    require_once($_SESSION['basePath'] . "model/suppliers.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getLocation':
                echo json_encode(getLocation($_POST['supplierID']));
            break;
            case 'getSupplier':
                echo json_encode(getSupplier($_POST['supplierID']));
            break;
            case 'getSuppliers':
                echo json_encode(getSuppliers());
            break;
            case 'readContactPeople':
                echo json_encode(readContactPeople($_POST['supplierID']));
            break;
            case 'getDefaultSupplier':
                echo json_encode(getDefaultSupplier($_POST));
            break;
            case 'getSupplierByProducts':
                echo json_encode(getSupplierByProducts("", $_POST['product']));
            break;
            case 'getCurrentCompany':
                echo json_encode(getCurrentCompany());
            break;
            case 'existsSupplier':
                echo json_encode(existsSupplier($_POST['supplier']));
            break;
        }
    }

    // Funciones
    function getSupplier($data){
        $suppliers = new Suppliers();
        return $suppliers->getSupplier($data);
    }
    function getSuppliers(){
        $suppliers = new Suppliers();
        return $suppliers->listNames();
    }

    /**
    * Obtiene los datos de la localidad para un proveedor dado
    *
    * @return array
    */
    function getLocation($data){
        $suppliers = new Suppliers();
        return $suppliers->getLocation($data);
    }

    /**
    * Obtiene los datos de los contactos para un proveedor dado
    *
    * @return array
    */
    function readContactPeople($data){
        $suppliers = new Suppliers();
        return $suppliers->readContactPeople($data);
    }

    /**
    * Obtiene los datos de la localidad para un cementerio dado
    *
    * @return array
    */
    function getDefaultSupplier($data){
        $supplier = new Suppliers();
        return $supplier->getDefaultSupplier($data);
    }
    
    /**
    * Obtiene información de contacto del proveedor
    *
    * @return array
    */
    function getSupplierByProducts($name, $product){
        $suppliers = new Suppliers();
        return $suppliers->searchByProduct($name, $product);
    }
    /**
    * Obtiene la empresa actual
    *
    * @return array
    */
    function getCurrentCompany(){
        $suppliers = new Suppliers();
        return $suppliers->getCurrentCompany();
    }

    /**
     * Comprueba si un proveedor existe
     * 
     * @param int $supplier Id del proveedor
     * @return bool
     */
    function existsSupplier($supplier){
        $suppliers = new Suppliers;
        return $suppliers->existsSupplier($supplier);
    }
?>