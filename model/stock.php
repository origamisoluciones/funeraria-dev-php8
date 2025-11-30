<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Stock{
        /**
         * Obtiene el stock de un tanatorio
         * 
         * @param int $mortuary Tanatorio
         * @param string $search Búsqueda
         * @param int $productType Tipo de producto
         * @return array|null Stock del tanatorio
         */
        public function getStock($mortuary, $search, $productType){
            $db = new DbHandler;

            $mortuary = cleanStr($mortuary);
            $search = cleanStr($search);
            $productType = cleanStr($productType);

            $result = $db->query("  SELECT      s.ID, s.currentStock, s.minStock, s.maxStock,
                                                p.productID, p.name as productName,
                                                pm.productModelID as modelID, pm.name as modelName,
                                                su.name as supplierName, 
                                                (
                                                    SELECT	SUM(s2.currentStock)
                                                    FROM 	Stock s2
                                                    WHERE 	s2.model = pm.productModelID AND
                                                            s2.leavingDate IS NULL
                                                ) as total
                                    FROM        Stock s, Products_Models pm, Products p, Suppliers su, Products_Retails pr, Products_Prices pp, Prices pri
                                    WHERE       s.mortuary = $mortuary AND
                                                s.model = pm.productModelID AND
                                                s.leavingDate IS NULL AND
                                                pm.product = p.productID AND
                                                pm.supplier = su.supplierID AND
                                                (
                                                    p.name LIKE '%$search%' OR
                                                    pm.name LIKE '%$search%' OR
                                                    su.name LIKE '%$search%'
                                                ) AND
                                                p.leavingDate IS NULL AND
                                                p.type = $productType AND
                                                su.leavingDate IS NULL AND
                                                pm.leavingDate IS NULL AND
                                                pm.productModelID = pr.model AND
                                                pr.year = ".date('Y')." AND
                                                pp.model = pm.productModelID AND
                                                pp.price = pri.priceID AND
                                                pri.name LIKE 'Particulares' AND
                                                pri.year = ".date('Y')."
                                    GROUP BY    pm.productModelID
                                    ORDER BY    p.name, su.name, pm.name");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Guarda el stock para un almacén
         * 
         * @param int $mortuary Tanatorio
         * @param array $stock Datos del stock
         * @return bool
         */
        public function save($mortuary, $stock){
            $db = new DbHandler;

            if(!empty($stock)){
                foreach($stock as $elem){
                    $elem[0] = cleanStr($elem[0]);
                    $elem[1] = cleanStr($elem[1]);
                    $elem[2] = cleanStr($elem[2]);
                    $elem[3] = cleanStr($elem[3]);

                    $db->query("UPDATE  Stock
                                SET     currentStock = " . $elem[1] . ",
                                        minStock = " . $elem[2] . ",
                                        maxStock = " . $elem[3] . "
                                WHERE   ID = " . $elem[0]);
                }
            }

            return true;
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
        public function move($moveMortuary, $currentMortuary, $model, $amount){
            $db = new DbHandler;

            $moveMortuary = cleanStr($moveMortuary);
            $currentMortuary = cleanStr($currentMortuary);
            $model = cleanStr($model);
            $amount = cleanStr($amount);

            $result = $db->query("  SELECT  s.currentStock
                                    FROM    Stock s
                                    WHERE   mortuary = $currentMortuary AND
                                            model = $model");

            $currentCurrentStock = $db->resultToArray($result)[0]['currentStock'];

            $result = $db->query("  SELECT  s.currentStock
                                    FROM    Stock s
                                    WHERE   mortuary = $moveMortuary AND
                                            model = $model");

            $moveCurrentStock = $db->resultToArray($result)[0]['currentStock'];

            $newCurrentStock = $currentCurrentStock - $amount;
            $newMoveStock = $moveCurrentStock + $amount;

            $db->query("UPDATE  Stock
                        SET     currentStock = $newCurrentStock
                        WHERE   mortuary = $currentMortuary AND
                                model = $model");

            $db->query("UPDATE  Stock
                        SET     currentStock = $newMoveStock
                        WHERE   mortuary = $moveMortuary AND
                                model = $model");

            return true;
        }

        /**
         * Añade un producto a los almacenes
         * 
         * @param int $model Id del modelo del producto
         * @return bool
         */
        public function add($model){
            $db = new DbHandler;

            $model = cleanStr($model);

            $result = $db->query("  SELECT  cc.ID
                                    FROM    Cost_Center cc
                                    WHERE   cc.leavingDate IS NULL");

            if(mysqli_num_rows($result) > 0){
                $mortuaries = $db->resultToArray($result);

                foreach($mortuaries as $mortuary){
                    $m = $mortuary['ID'];

                    $result = $db->query("  SELECT  ID
                                            FROM    Stock
                                            WHERE   mortuary = $m AND
                                                    model = $model");

                    if(mysqli_num_rows($result) == 0){
                        $db->query("INSERT INTO Stock(mortuary, model, currentStock, minStock, maxStock)
                                    VALUES ($m, $model, 0, 1, 1)");
                    }
                }
            }
        }

        /**
         * Añade todos los productos a un almacén
         * 
         * @param int $mortuary Id del tanatorio
         * @return bool
         */
        public function addOne($mortuary){
            $db = new DbHandler;
            
            $mortuary = cleanStr($mortuary);

            $result = $db->query("  SELECT  s.ID
                                    FROM    Stock s
                                    WHERE   s.mortuary = $mortuary");

            if(mysqli_num_rows($result) == 0){
                $result = $db->query("  SELECT  pm.productModelID
                                        FROM    Products_Models pm, Products p
                                        WHERE   pm.product = p.productID AND
                                                pm.leavingDate IS NULL AND
                                                p.leavingDate IS NULL AND
                                                p.type = 2");

                if(mysqli_num_rows($result) > 0){
                    $models = $db->resultToArray($result);
                    foreach($models as $model){
                        $db->query("INSERT INTO Stock(mortuary, model, currentStock, minStock, maxStock)
                                    VALUES ($mortuary, " . $model['productModelID'] . ", 0, 1, 1)");
                    }
                }
            }else{
                $db->query("UPDATE  Stock
                            SET     leavingDate = null
                            WHERE   mortuary = $mortuary");
            }

            return true;
        }

        /**
         * Añade o elimina un producto de los almacenes
         * 
         * @param int $product Id del producto
         */
        public function update($product){
            $db = new DbHandler;

            $product = cleanStr($product);

            $result = $db->query("  SELECT  p.type
                                    FROM    Products p
                                    WHERE   productID = $product");

            $type = $db->resultToArray($result)[0]['type'];

            if($type == 2 || $type == 4){
                $result = $db->query("  SELECT  pm.productModelID
                                        FROM    Products_Models pm
                                        WHERE   pm.product = $product");

                if(mysqli_num_rows($result) > 0){
                    $models = $db->resultToArray($result);
                    foreach($models as $model){
                        $result = $db->query("  SELECT  ID
                                                FROM    Stock
                                                WHERE   model = " . $model['productModelID']);

                        if(mysqli_num_rows($result) == 0){
                            $this->add($model['productModelID']);
                        }else{
                            $db->query("UPDATE  Stock
                                        SET     leavingDate = null
                                        WHERE   model = " . $model['productModelID']);
                        }

                    }
                }
            }else{
                $result = $db->query("  SELECT  pm.productModelID
                                        FROM    Products_Models pm
                                        WHERE   pm.product = $product");

                if(mysqli_num_rows($result) > 0){
                    $models = $db->resultToArray($result);

                    foreach($models as $model){
                        $db->query("UPDATE  Stock
                                    SET     leavingDate = " . time() . "
                                    WHERE   model = " . $model['productModelID']);
                    }
                }
            }
        }

        /**
         * Elimina un modelo de los almacenes
         * 
         * @param array $model Id del modelo del producto
         * @return bool
         */
        public function delete($model){
            $db = new DbHandler;

            $model = cleanStr($model);

            return $db->query(" UPDATE  Stock
                                SET     leavingDate = " .time() . "
                                WHERE   model = $model");
        }

        /**
         * Añade stock a un modelo de un producto
         * 
         * @param int $mortuary Id del almacén
         * @param int $model Id del modelo
         * @param int $amount Cantidad
         * @return bool
         */
        public function addStock($mortuary, $model, $amount){
            $db = new DbHandler;

            $mortuary = cleanStr($mortuary);
            $model = cleanStr($model);
            $amount = cleanStr($amount);

            $result = $db->query("  SELECT  currentStock, minStock
                                    FROM    Stock
                                    WHERE   mortuary = $mortuary AND
                                            model = $model");

            if(mysqli_num_rows($result) > 0){
                $dataStock = $db->resultToArray($result)[0];
                $currentStock = $dataStock['currentStock'];
                $minStockData = $dataStock['minStock'];

                $newCurrentStock = $currentStock + $amount;

                $db->query("UPDATE  Stock
                            SET     currentStock = $newCurrentStock
                            WHERE   mortuary = $mortuary AND
                                    model = $model");

                if($newCurrentStock <= $minStockData){
                    $result = $db->query("  SELECT  p.name as productName,
                                                    pm.name as modelName,
                                                    cc.name as mortuaryName
                                            FROM    Stock s, Products_Models pm, Products p, Cost_Center cc
                                            WHERE   s.mortuary = cc.ID AND
                                                    s.model = pm.productModelID AND
                                                    pm.product = p.productID AND
                                                    s.mortuary = $mortuary AND
                                                    s.model = $model AND
                                                    s.maxStock != 0 AND
                                                    s.minStock != 0");

                    if(mysqli_num_rows($result) > 0){
                        $result = $db->resultToArray($result)[0];

                        $mortuaryName = $result['mortuaryName'];
                        $productName = $result['productName'];
                        $modelName = $result['modelName'];
                        
                        require_once($_SESSION['basePath'] . "core/tools/mailHandler.php");
    
                        $mailHandler = new MailHandler;
                        $mailHandler->stockAlert($mortuaryName, $productName, $modelName);
                    }
                }
            }

            return true;
        }

        /**
         * Elimina stock a un modelo de un producto
         * 
         * @param int $mortuary Id del almacén
         * @param int $model Id del modelo
         * @param int $amount Cantidad
         * @return bool
         */
        public function delStock($mortuary, $model, $amount){
            $db = new DbHandler;

            $mortuary = cleanStr($mortuary);
            $model = cleanStr($model);
            $amount = cleanStr($amount);

            $result = $db->query("  SELECT  currentStock, minStock
                                    FROM    Stock
                                    WHERE   mortuary = $mortuary AND
                                            model = $model");

            if(mysqli_num_rows($result) > 0){
                $dataStock = $db->resultToArray($result)[0];
                $currentStock = $dataStock['currentStock'];
                $minStockData = $dataStock['minStock'];

                $newCurrentStock = $currentStock - $amount;

                $db->query("UPDATE  Stock
                            SET     currentStock = $newCurrentStock
                            WHERE   mortuary = $mortuary AND
                                    model = $model");

                if($newCurrentStock <= $minStockData){

                    $result = $db->query("  SELECT  p.name as productName,
                                                    pm.name as modelName,
                                                    cc.name as mortuaryName
                                            FROM    Stock s, Products_Models pm, Products p, Cost_Center cc
                                            WHERE   s.mortuary = cc.ID AND
                                                    s.model = pm.productModelID AND
                                                    pm.product = p.productID AND
                                                    s.mortuary = $mortuary AND
                                                    s.model = $model AND
                                                    s.maxStock != 0 AND
                                                    s.minStock != 0");
                    
                    if(mysqli_num_rows($result) > 0){
                        $result = $db->resultToArray($result)[0];

                        $mortuaryName = $result['mortuaryName'];
                        $productName = $result['productName'];
                        $modelName = $result['modelName'];
                        
                        require_once($_SESSION['basePath'] . "core/tools/mailHandler.php");

                        $mailHandler = new MailHandler;
                        $mailHandler->stockAlert($mortuaryName, $productName, $modelName);
                    }
                }
            }

            return true;
        }

        /**
         * Obtiene el stock de un modelo para un tanatorio
         * 
         * @param int $mortuary Id del tanatorio
         * @param int $model Id del model
         * @return int Cantidad
         */
        public function getStockByModel($mortuary, $model){
            $db = new DbHandler;

            $mortuary = cleanStr($mortuary);
            $model = cleanStr($model);

            $result = $db->query("  SELECT  s.currentStock
                                    FROM    Stock s
                                    WHERE   s.mortuary = $mortuary AND
                                            s.model = $model");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['currentStock'];
        }

        /**
         * Obtiene las notificaciones del almacén
         * 
         * @return array
         */
        public function getStockReminder(){
            $db = new DbHandler;

            if(intval($_SESSION['company']) == 5){
                $result = $db->query("  SELECT      m.name as mortuaryName, m.ID as mortuaryID, s.ID,
                                                    p.name as productName,
                                                    pm.name as modelName
                                        FROM        Stock s, Cost_Center m, Products p, Products_Models pm, Mortuaries mm, Suppliers su
                                        WHERE       s.mortuary = m.ID AND
                                                    s.model = pm.productModelID AND
                                                    pm.product = p.productID AND
                                                    s.currentStock <= 0 AND
                                                    s.leavingDate IS NULL AND
                                                    p.leavingDate IS NULL AND
                                                    m.leavingDate IS NULL AND 
                                                    pm.leavingDate IS NULL AND 
                                                    mm.leavingDate IS NULL AND 
                                                    mm.mortuaryID = m.mortuary AND
                                                    mm.isYourOwn = 1 AND
                                                    p.type = 2 AND
                                                    pm.supplier = su.supplierID AND
                                                    su.leavingDate IS NULL
                                        ORDER BY    m.name");

            }else{
                $result = $db->query("  SELECT      m.name as mortuaryName, m.ID as mortuaryID, s.ID,
                                                    p.name as productName,
                                                    pm.name as modelName
                                        FROM        Stock s, Cost_Center m, Products p, Products_Models pm, Mortuaries mm, Suppliers su
                                        WHERE       s.mortuary = m.ID AND
                                                    s.model = pm.productModelID AND
                                                    pm.product = p.productID AND
                                                    s.currentStock < (s.minStock + 5) AND
                                                    s.leavingDate IS NULL AND
                                                    p.leavingDate IS NULL AND
                                                    m.leavingDate IS NULL AND 
                                                    pm.leavingDate IS NULL AND 
                                                    mm.leavingDate IS NULL AND 
                                                    mm.mortuaryID = m.mortuary AND
                                                    mm.isYourOwn = 1 AND
                                                    p.type = 2 AND
                                                    pm.supplier = su.supplierID AND
                                                    su.leavingDate IS NULL
                                        ORDER BY    m.name");
            }

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Obtiene el stock de un producto (modelo)
         * 
         * @param array Modelo del producto
         * @return int  Cantidad de stock
         */
        public function read($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  currentStock
                                    FROM    Stock
                                    WHERE   model = " . $data);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['currentStock'];
        }

        /**
         * Comprueba el stock
         * 
         * @param array $data
         * @return bool
         */
        public function checkStock(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  p.name AS product, pm.name AS model
                                    FROM    Stock s, Products p, Products_Models pm
                                    WHERE   s.currentStock <= s.minStock AND
                                            s.model = pm.productModelID AND
                                            pm.product = p.productID AND
                                            p.leavingDate IS NULL");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
        * Obtiene el nombre de un tanatorio
        *
        * @param string $id id del tanatorio
        * @return array
        */
       public function getMortuaryName($id){
           $db = new DbHandler;

           $id = cleanStr($id);
           
           $result = $db->query("  SELECT  m.name
                                   FROM    Mortuaries m
                                   WHERE   m.mortuaryID =" . $id . " AND
                                           m.leavingDate IS NULL");

           return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);           
           
       }

        /**
        * Obtiene el nombre de un tanatorio
        *
        * @param string $id id del tanatorio
        * @return array
        */
       public function getCostCenterName($id){
           $db = new DbHandler;

           $id = cleanStr($id);
           
           $result = $db->query("  SELECT  m.name
                                   FROM    Cost_Center m
                                   WHERE   m.ID =" . $id . " AND
                                           m.leavingDate IS NULL");

           return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);           
           
       }
        /**
         * Obtiene la suma del stock actual de todos los tanatorios para un producto 
         * 
         * @param int $mortuary Tanatorio
         * @return array|null Stock del tanatorio
         */
        public function getTotalStockByProdAndWarehouse($mortuary, $product){
            $db = new DbHandler;

            $mortuary = cleanStr($mortuary);
            $product = cleanStr($product);

            $result = $db->query("  SELECT      p.productID, p.name, s.mortuary, SUM(s.currentStock) as totalCurrentStock
                                    FROM        Stock s, Products_Models pm, Products p, Suppliers su
                                    WHERE       s.mortuary = $mortuary AND
                                                s.model = pm.productModelID AND
                                                s.leavingDate IS NULL AND
                                                pm.product = p.productID AND
                                                p.productID= $product AND
                                                pm.supplier = su.supplierID AND
                                                p.leavingDate IS NULL AND
                                                su.leavingDate IS NULL AND
                                                pm.leavingDate IS NULL AND
                                                (   
                                                    SELECT  COUNT(*)
                                                    FROM    Products_Retails pr, Products_Prices pp, Prices pri
                                                    WHERE   pp.model = pm.productModelID AND
                                                            pp.price = pri.priceID AND
                                                            pm.productModelID = pr.model AND
                                                            pr.year = ".date('Y')."
                                                ) > 0
                                    ORDER BY    p.productID");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los productos de del stock actual de todos los tanatorios para un producto 
         * 
         * @param int $mortuary Tanatorio
         * @return array|null Stock del tanatorio
         */
        public function getAllProducts($mortuary){
            $db = new DbHandler;

            $mortuary = cleanStr($mortuary);

            $result = $db->query("  SELECT      p.productID 
                                    FROM        Stock s, Products_Models pm, Products p, Suppliers su 
                                    WHERE       s.mortuary = $mortuary AND
                                                s.model = pm.productModelID AND
                                                s.leavingDate IS NULL AND
                                                pm.product = p.productID AND
                                                pm.supplier = su.supplierID AND
                                                p.leavingDate IS NULL AND
                                                su.leavingDate IS NULL AND
                                                pm.leavingDate IS NULL
                                    GROUP BY    p.productID");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
    }
?>