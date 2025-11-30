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

    require_once($_SESSION['basePath'] . "model/products.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getProducts':
                echo json_encode(getProducts($_POST['year'], $_POST['from'], $_POST['to']));
                break;
        }
    }
    
    /**
     * Obtiene los años para los cuáles ha habido al menos una cremación
     * 
     * @return array
     */
    function getProducts($year, $from, $to){
        $products = new Products;
        return $products->getProducts($year, $from, $to);
    }
?>