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
    require_once($_SESSION['basePath'] . "model/orders.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'deleteAllLines':
                echo json_encode(deleteAllLines($_POST['ID']));
            break;
            case 'getFirstModelByProduct':
                echo json_encode(getFirstModelByProduct($_POST['product']));
            break;
        }
    }

    /**
    * Obtiene los datos de la localidad para un cementerio dado
    *
    * @return array
    */
    function deleteAllLines($data){
        $orders = new Orders();
        return $orders->deleteAllLines($data);
    }

    /**
     * Obtiene el primer model del producto dado
     *
     * @param array $data
     * 
     * @return array
     */
    function getFirstModelByProduct($data){
        $products = new Products();
        return $products->getFirstModelByProduct($data);
    }
?>