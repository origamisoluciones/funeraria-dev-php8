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

    require_once($_SESSION['basePath'] . "model/stock.php");
    require_once($_SESSION['basePath'] . "model/mortuaries.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getStock':
                echo json_encode(getStock($_POST['mortuary'], $_POST['search'], $_POST['productType']));

                require_once($_SESSION['basePath'] . "model/logs.php");

                $logs = new Logs;
                $logs->createSimple("Almacén", "Productos - Consulta", "'Ha consultado los productos'");
            break;
            case 'save':
                echo json_encode(save($_POST['mortuary'], $_POST['stock']));

                require_once($_SESSION['basePath'] . "model/logs.php");

                $logs = new Logs;
                $logs->createSimple("Almacén", "Productos - Modificación", "'Ha modificado los productos'");
            break;
            case 'move':
                echo json_encode(move($_POST['moveMortuary'], $_POST['currentMortuary'], $_POST['model'], $_POST['amount']));

                require_once($_SESSION['basePath'] . "model/logs.php");

                $logs = new Logs;
                $logs->createSimple("Almacén", "Productos - Modificación", "'Ha movido un producto de almacén'");
            break;
            case 'getMortuaryName':
                echo json_encode(getMortuaryName($_POST['mortuary']));
                require_once($_SESSION['basePath'] . "model/logs.php");
            break;
            case 'getCostCenterName':
                echo json_encode(getCostCenterName($_POST['mortuary']));
                require_once($_SESSION['basePath'] . "model/logs.php");
            break;
            case 'getTotalStockByProdAndWarehouse':
                echo json_encode(getTotalStockByProdAndWarehouse($_POST['mortuary'],$_POST['prodID']));
                require_once($_SESSION['basePath'] . "model/logs.php");
            break;
            case 'getOwnMortuaries':
                echo json_encode(getOwnMortuaries());
                require_once($_SESSION['basePath'] . "model/logs.php");
            break;
            case 'getCostCenter':
                echo json_encode(getCostCenter());
                require_once($_SESSION['basePath'] . "model/logs.php");
            break;
            case 'getAllProducts':
                echo json_encode(getAllProducts($_POST['mortuary']));
                require_once($_SESSION['basePath'] . "model/logs.php");
            break;
        }
    }

    /**
     * Obtiene el stock de un tanatorio
     * 
     * @param int $mortuary Tanatorio
     * @param string $search Búsqueda
     * @return array|null Stock del tanatorio
     */
    function getStock($mortuary, $search, $productType){
        $stock = new Stock;
        return $stock->getStock($mortuary, $search, $productType);
    }

    /**
     * Guarda el stock para un almacén
     * 
     * @param int $mortuary Tanatorio
     * @param array $stock Datos del stock
     * @return bool
     */
    function save($mortuary, $data){
        $stock = new Stock;
        return $stock->save($mortuary, $data);
    }

    /**
     * Mueve el stock de almacén
     * 
     * @param int $moveMortuary Almacén a mover el stock
     * @param int $currentMortuary Almacén de donde procede el stock
     * @param int $model Modelo a mover
     * @param int $amount Cantidad a mover
     * @return bool
     */
    function move($moveMortuary, $currentMortuary, $model, $amount){
        $stock = new Stock;
        return $stock->move($moveMortuary, $currentMortuary, $model, $amount);
    }
    /**
     * Obtiene el nombre de un Almacén
     * 
     * @param int $moveMortuary Almacén a mover el stock
     * @return bool
     */
    function getMortuaryName($mortuary){
        $stock = new Stock;
        return $stock->getMortuaryName($mortuary);
    }

    /**
     * Obtiene el nombre de un Almacén
     * 
     * @param int $moveMortuary Almacén a mover el stock
     * @return bool
     */
    function getCostCenterName($mortuary){
        $stock = new Stock;
        return $stock->getCostCenterName($mortuary);
    }
    
    /**
     * Obtiene el total de stock segun el producto y el alamacen
     * 
     * @param int $moveMortuary Almacén a mover el stock
     * @return bool
     */
    function getTotalStockByProdAndWarehouse($mortuary, $product){
        $stock = new Stock;
        return $stock->getTotalStockByProdAndWarehouse($mortuary, $product);
    }
    /**
     * Obtiene todos los almacenes propios
     *  
     * @return bool
     */
    function getOwnMortuaries(){
        $stock = new Mortuaries;
        return $stock->getOwnMortuaries();
    }

    /**
     * Obtiene todos los almacenes propios
     *  
     * @return bool
     */
    function getCostCenter(){
        $stock = new Mortuaries;
        return $stock->getCostCenter();
    }
    /**
     * Obtiene todos los almacenes propios
     *  
     * @return bool
     */
    function getAllProducts($mortuary){
        $stock = new Stock;
        return $stock->getAllProducts($mortuary);
    }
?>