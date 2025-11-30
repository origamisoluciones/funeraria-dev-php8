<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "model/expedients.php");
    require_once($_SESSION['basePath'] . "model/prices.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Products{

        /**
         * Comprueba si un producto existe
         * 
         * @param int $product Id del producto
         * @return bool
         */
        public function existsProduct($product){
            $db = new DbHandler;

            $product = cleanStr($product);

            $result = $db->query("  SELECT  p.productID
                                    FROM    Products p
                                    WHERE   p.productID = $product AND
                                            p.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? false : true;
        }

        /**
         * Comprueba si un producto existe con un nombre dado
         * 
         * @param int $product Nombre del producto
         * @return bool
         */
        public function existsProductName($productName, $productID = null){
            $db = new DbHandler;

            $productName = cleanStr($productName);

            if($productID != null){
                $productID = cleanStr($productID);

                $result = $db->query("  SELECT  COUNT(*) as row
                                        FROM    Products p
                                        WHERE   p.name = '$productName' AND p.productID != $productID
                                            AND p.leavingDate IS NULL");
            }else{
                $result = $db->query("  SELECT  COUNT(*) as row
                                        FROM    Products p
                                        WHERE   p.name = '$productName' AND
                                                p.leavingDate IS NULL");
            }
            $survey = $db->resultToArray($result)[0]['row'];

            if($survey == 0){
                return false;
            }else{
                return true;
            }   
        }

        /**
         * Obtiene los tipos de IVA
         * 
         * @return array
         */
        public function getIVATypes(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      *
                                    FROM        IVA_Types
                                    WHERE       leavingDate IS NULL AND 
                                                (name = 'Sin Iva' OR type = 1)
                                    ORDER BY    percentage ASC
            ");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene las clases de un producto
         * 
         * @return array
         */
        public function getClasses(){
            $db = new DbHandler;

            $result = $db->query("SELECT  * FROM    Products_Classes");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los tipos de productos
         * 
         * @return array
         */
        public function getTypes(){
            $db = new DbHandler;

            $result = $db->query("SELECT  * FROM    Products_Types");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Añade un producto
         *
         * @param array $data Información del producto
         * @return bool
         */
        public function createProduct($data){
            $db = new DbHandler;

            $data['orderType'] = cleanStr($data['orderType']);
            $data['blockBelow'] = cleanStr($data['blockBelow']);
            $data['serviceBelow'] = cleanStr($data['serviceBelow']);
            $data['orderBy'] = cleanStr($data['orderBy']);
            $data['productServiceType'] = cleanStr($data['productServiceType']);
            $data['type'] = cleanStr($data['type']);
            $data['class'] = cleanStr($data['class']);
            $data['IVA'] = cleanStr($data['IVA']);
            $data['name'] = cleanStr($data['name']);
            $data['press'] = cleanStr($data['press']);
            $data['supplied'] = cleanStr($data['supplied']);
            $data['isInvoiced'] = cleanStr($data['isInvoiced']);
            $data['checkCService'] = cleanStr($data['checkCService']);
            $data['amount'] = cleanStr($data['amount']);
            $data['texts'] = cleanStr($data['texts']);
            $data['preOrder'] = cleanStr($data['preOrder']);
            $data['editPrice'] = cleanStr($data['editPrice']);
            $data['timelineType'] = cleanStr($data['timelineType']);
            $data['isBus'] = cleanStr($data['isBus']);
            $data['isArca'] = cleanStr($data['isArca']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            // Calculate extraID
            $result = $db->query("  SELECT  MAX(productID) as id
                                    FROM    Products");
            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 2);
            $extraID .= ($maxID+1);

            if($data['orderType'] == 0){
                $blockBelow = $data['blockBelow'];
            }else{
                $blockBelow = 'null';
            }
            if($data['orderBy'] == ''){
                $orderBy = 'null';
            }else{
                $orderBy = $data['orderBy'];
            }
            if($data['productServiceType'] == ''){
                $productServiceType = 'null';
            }else{
                $productServiceType = $data['productServiceType']; 
            }

            if(!$this->existsProductName($data['name'])){
                $result = $db->query("  INSERT INTO Products(
                                            type, class, IVA, productService, name, 
                                            press, supplied, isInvoiced, amount, texts, 
                                            preOrder, editPrice, entryDate, blockBelow, checkCService, 
                                            serviceBelow, orderBy, orderType, timelineType, isBus, isArca, extraID
                                        ) 
                                        VALUES (
                                            " . $data['type'] . ", " . $data['class'] . ", " . $data['IVA'] . ", " . $productServiceType . ", '" . $data['name'] . "', 
                                            " . $data['press'] . ", " . $data['supplied'] . ", " . $data['isInvoiced'] . ", " . $data['amount'] . ", " . $data['texts'] . ", 
                                            " . $data['preOrder'] . ", " . $data['editPrice'] . ", '" . date('Y-m-d H:i:s') . "', $blockBelow,  " . $data['checkCService'] . ",  
                                            " . $data['serviceBelow'] . ", $orderBy, " . $data['orderType'] . ", " . $data['timelineType'] . ", " . $data['isBus'] . ", " . $data['isArca'] . ", '$extraID '
                                        )
                ");

                $result = $db->query("  SELECT  productID 
                                        FROM    Products 
                                        WHERE   extraID = '$extraID'");

                $product = $db->resultToArray($result)[0]['productID'];

                // Acciones asociadas a un producto
                $productsActions = $data['actions'];

                if($productsActions != ''){
                    foreach(explode(",", $productsActions) as $productAction){
                        $productAction = cleanStr($productAction);
                        $str = explode("-", $productAction);
    
                        $result = $db->query("  INSERT INTO Products_Actions(product, action, value, checked) 
                                                VALUES (" . $product . ", " . $str[0] . ", '', " . $str[1] . ")");
                    }
                }

                return true;
            }else{
                return "NAME_ERROR";
            }
        }

        /**
         * Añade un producto y devuelve su ID
         *
         * @param array $data Información del producto
         * @return array
         */
        public function createProductGetID($data){
            $db = new DbHandler;

            $data['orderType'] = cleanStr($data['orderType']);
            $data['orderBy'] = cleanStr($data['orderBy']);
            $data['type'] = cleanStr($data['type']);
            $data['class'] = cleanStr($data['class']);
            $data['IVA'] = cleanStr($data['IVA']);
            $data['name'] = cleanStr($data['name']);
            $data['press'] = cleanStr($data['press']);
            $data['supplied'] = cleanStr($data['supplied']);
            $data['isInvoiced'] = cleanStr($data['isInvoiced']);
            $data['amount'] = cleanStr($data['amount']);
            $data['texts'] = cleanStr($data['texts']);
            $data['preOrder'] = cleanStr($data['preOrder']);
            $data['editPrice'] = isset($data['editPrice']) ? cleanStr($data['editPrice']) : 0;

            // Calculate extraID
            $result = $db->query("SELECT  MAX(productID) as id FROM    Products");

            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 2);
            $extraID .= ($maxID+1);

            if($data['orderType'] == 0){
                $blockBelow = $data['blockBelow'];
            }else{
                $blockBelow = 'null';
            }
            
            if(isset($data['orderBy'])){
                if($data['orderBy'] == ''){
                    $orderBy = 'null';
                }else{
                    $orderBy = $data['orderBy'];
                }
            }else{
                $orderBy = 'null';
            }

            if(!$this->existsProductName($data['name'])){
               
                $result = $db->query("  INSERT INTO Products(type, class, IVA, name, press, supplied, 
                                            isInvoiced, amount, texts, preOrder, editPrice, entryDate,
                                            blockBelow, orderBy, orderType, extraID) 
                                        VALUES (" . $data['type'] . ", " . $data['class'] . ", 
                                            " . $data['IVA'] . ", '" . $data['name'] . "', 
                                            " . $data['press'] . ", " . $data['supplied'] . ", 
                                            " . $data['isInvoiced'] . ", 
                                            " . $data['amount'] . ", " . $data['texts'] . ", " . $data['preOrder'] . ", " . $data['editPrice'] . ", 
                                            '" . date('Y-m-d H:i:s') . "', $blockBelow, $orderBy,
                                            " . $data['orderType'] . ", '$extraID')");

                $result = $db->query("  SELECT  p.productID, p.name
                                        FROM    Products p
                                        WHERE   p.extraID = '$extraID'");

                return $db->resultToArray($result)[0];

            }else{
                return "NAME_ERROR";
            }
        }

        /**
         * Obtiene los datos de un producto
         *
         * @param array $data ID del producto
         * @return array
         */
        public function readProduct($data){
            $db = new DbHandler;

            $data['productID'] = cleanStr($data['productID']);

            $product = $db->query(" SELECT  DISTINCT p.productID, p.name as productName, p.press, p.supplied, p.checkCService,
                                                p.isInvoiced, p.amount, p.texts, p.entryDate, p.leavingDate, p.preOrder, p.editPrice, p.blockBelow, p.serviceBelow,
                                                p.orderBy, p.orderType, p.timelineType, p.isBus, p.isArca,
                                                pt.productTypeID, pt.name as productTypeName, 
                                                pc.productClassID, pc.name as productClassName,
                                                it.IVATypeID, it.name as IVATypeName, it.percentage, 
                                                it.leavingDate,  p.productService as productServiceType
                                   FROM         (Products p, Products_Classes pc, IVA_Types it, Products_Services ps)
                                   LEFT JOIN    Products_Types pt ON p.type = pt.productTypeID
                                   WHERE        p.class = pc.productClassID AND 
                                                p.IVA = it.IVATypeID AND                                                
                                                p.productID = " . $data['productID'] . "");

            if(mysqli_num_rows($product) == 0){
				return null;
			}else{
                $product = $db->resultToArray($product)[0];

                $actions = $db->query(" SELECT  a.ID, a.type, a.label
                                        FROM    Products_Actions pa, Actions a
                                        WHERE   pa.action = a.ID AND 
                                                product = " . $product['productID'] . " AND a.leavingDate IS NULL");

                mysqli_num_rows($actions) > 0 ? $actions = $db->resultToArray($actions) : $actions = null;

                $actionsChecked = $db->query("  SELECT  pa.product, pa.action, pa.value, pa.checked, a.type, a.label 
                                                FROM    Products_Actions pa, Actions a 
                                                WHERE   product = " . $product['productID'] . " AND 
                                                        pa.action = a.ID  AND a.leavingDate IS NULL");

                mysqli_num_rows($actionsChecked) > 0 ? $actionsChecked = $db->resultToArray($actionsChecked) : $actionsChecked = null;

                if($actions == null){
                    return array($product, "");
                }else{
                    return array($product, $actions, $actionsChecked);
                }
            }
        }

        /**
         * Modifica los datos de un producto
         *
         * @param array $data Información del producto
         * @return bool
         */
        public function updateProduct($data){
            $db = new DbHandler;

            $data['orderType'] = cleanStr($data['orderType']);
            $data['blockBelow'] = cleanStr($data['blockBelow']);
            $data['serviceBelow'] = cleanStr($data['serviceBelow']);
            $data['orderBy'] = cleanStr($data['orderBy']);
            $data['productServiceType'] = cleanStr($data['productServiceType']);
            $data['type'] = cleanStr($data['type']);
            $data['class'] = cleanStr($data['class']);
            $data['IVA'] = cleanStr($data['IVA']);
            $data['name'] = cleanStr($data['name']);
            $data['press'] = cleanStr($data['press']);
            $data['supplied'] = cleanStr($data['supplied']);
            $data['isInvoiced'] = cleanStr($data['isInvoiced']);
            $data['checkCService'] = cleanStr($data['checkCService']);
            $data['amount'] = cleanStr($data['amount']);
            $data['texts'] = cleanStr($data['texts']);
            $data['preOrder'] = cleanStr($data['preOrder']);
            $data['editPrice'] = cleanStr($data['editPrice']);
            $data['productID'] = cleanStr($data['productID']);
            $data['expedient'] = cleanStr($data['expedient']);
            $data['timelineType'] = cleanStr($data['timelineType']);
            $data['isBus'] = cleanStr($data['isBus']);
            $data['isArca'] = cleanStr($data['isArca']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            if($data['orderType'] == 0){
                $blockBelow = $data['blockBelow'];
            }else{
                $blockBelow = 'null';
            }

            if($data['orderBy'] == ''){
                $orderBy = 'null';
            }else{
                $orderBy = $data['orderBy'];
            }

            if($data['productServiceType'] == ''){
                $productServiceType = 'null';
            }else{
                $productServiceType = $data['productServiceType'];
            }

            if(!$this->existsProductName($data['name'], $data['productID'])){

                $result = $db->query("  UPDATE  Products
                                        SET     type = " . $data['type'] . ",
                                                class = " . $data['class'] . ",
                                                IVA = " . $data['IVA'] . ",
                                                productService = $productServiceType,
                                                name = '" . $data['name'] . "',
                                                press = " . $data['press'] . ",
                                                supplied = " . $data['supplied'] . ",
                                                isInvoiced = " . $data['isInvoiced'] . ",
                                                checkCService = " . $data['checkCService'] . ",
                                                amount = " . $data['amount'] . ",
                                                texts = " . $data['texts'] . ",
                                                preOrder = " . $data['preOrder'] . ",
                                                editPrice = " . $data['editPrice'] . ",
                                                orderType = " . $data['orderType'] . ",
                                                timelineType = " . $data['timelineType'] . ",
                                                blockBelow = $blockBelow,
                                                serviceBelow = " . $data['serviceBelow'] . ",
                                                isBus = " . $data['isBus'] . ",
                                                isArca = " . $data['isArca'] . ",
                                                orderBy = $orderBy
                                        WHERE   productID = " . $data['productID']);

                if($data['actionsExpedient'] != 'false'){
                    $result = $db->query("  SELECT  pm.productModelID
                                            FROM    Products_Models pm
                                            WHERE   pm.product = " . $data['productID'] ." AND pm.leavingDate IS NULL");
                                            
                    if(mysqli_num_rows($result) > 0){
                        $models = $db->resultToArray($result);

                        $result = $db->query("  SELECT  e.requestDate
                                                FROM    Expedients e
                                                WHERE   e.leavingDate IS NULL AND
                                                        e.expedientID = " . $data['expedient']);
                
                        $requestDate = $db->resultToArray($result)[0]['requestDate'];

                        $result = $db->query("  SELECT      e.expedientID, year(e.requestDate) as year, e.priceExp      
                                                FROM        Expedients e
                                                WHERE       e.leavingDate IS NULL AND
                                                            e.requestDate >= '" . $requestDate . "'
                                                ORDER BY    expNumYear, expNumSecuence");
                
                        $expedients = $db->resultToArray($result);

                        foreach($expedients as $index => $expedient){

                            $maxNumHiring = $this->getActiveHiring($expedient['expedientID']);

                            $result = $db->query("  SELECT  eh.ID, eh.model
                                                    FROM    Expedients_Hirings eh
                                                    WHERE   eh.product = " . $data['productID'] . " AND
                                                            eh.num_hiring = $maxNumHiring AND
                                                            eh.expedient = " . $expedient['expedientID']);
            
                            if(mysqli_num_rows($result) == 0){

                                // Calculate extraID
                                $result = $db->query("SELECT  MAX(ID) as id FROM Expedients_Hirings");
                                $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
                                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 2);
                                $extraID .= ($maxID+1);

                                // Get expedient hirings data
                                $result = $db->query("  SELECT  eh.num_hiring, eh.rectified_type
                                                        FROM    Expedients_Hirings eh
                                                        WHERE   eh.expedient = {$expedient['expedientID']} AND
                                                                eh.num_hiring = (
                                                                    SELECT  MAX(eh2.num_hiring)
                                                                    FROM    Expedients_Hirings eh2
                                                                    WHERE   eh2.expedient = eh.expedient
                                                                )
                                                        LIMIT   1
                                ");
                                $rectifiedType = 'null';
                                if(mysqli_num_rows($result) > 0){
                                    $result = $db->resultToArray($result);
                                    $rectifiedType = $result[0]['rectified_type'];
                                }
                                if($rectifiedType == null || $rectifiedType == ''){
                                    $rectifiedType = 'null';
                                }
            
                                $result = $db->query("  SELECT  productModelID, supplier 
                                                        FROM    Products_Models 
                                                        WHERE   product = " . $data['productID'] . " AND 
                                                                leavingDate IS NULL 
                                                        LIMIT   1
                                ");
            
                                if(mysqli_num_rows($result) > 0){
                                    $result = $db->resultToArray($result)[0];
                                    $model = $result['productModelID'];
                                    $supplier = $result['supplier'];
            
                                    $result = $db->query("  SELECT  ID 
                                                            FROM    Products_Retails
                                                            WHERE   model = $model AND year = {$expedient['year']}");
            
                                    if(mysqli_num_rows($result) > 0){                      
                                        $retail = $db->resultToArray($result)[0]['ID'];

                                        $priceExp = $expedient['priceExp'];
                                        if($priceExp == null || $priceExp == ''){
                                            $priceExp = 'null';
                                        }

                                        $db->query("INSERT INTO Expedients_Hirings (
                                                        expedient, template, product, model, supplier, retail, 
                                                        amount, texts, discount, total, `check`, extraID, num_hiring, rectified_type, priceExp
                                                    ) 
                                                    VALUES (" . $expedient['expedientID'] . ", null, " . $data['productID'] . ", " . $model . ", " . $supplier . ", " . $retail . ", 
                                                            1, '', 0, 0, 0, '$extraID', $maxNumHiring, $rectifiedType, $priceExp
                                                    )
                                        ");
                                    }else{
                                        $db->query("INSERT INTO Products_Retails (model, purchasePrice, year) 
                                                    VALUES ($model, 0, {$expedient['year']})
                                        ");

                                        $retail = $db->getLastInsertId();

                                        $db->query("INSERT INTO Expedients_Hirings (
                                                        expedient, template, product, model, supplier, retail, 
                                                        amount, texts, discount, total, `check`, extraID, num_hiring, rectified_type
                                                    ) 
                                                    VALUES (" . $expedient['expedientID'] . ", null, " . $data['productID'] . ", " . $model . ", " . $supplier . ", " . $retail . ", 
                                                            1, '', 0, 0, 0, '$extraID', $maxNumHiring, $rectifiedType
                                                    )
                                        ");
                                    }

                                    $result = $db->query("  SELECT  p.priceID
                                                            FROM    Prices p
                                                            WHERE   p.year = {$expedient['year']} AND
                                                                    p.leavingDate IS NULL
                                    ");

                                    if(mysqli_num_rows($result) > 0){                      
                                        $prices = $db->resultToArray($result);

                                        foreach($prices as $price){
                                            $result = $db->query("  SELECT  pp.model
                                                                    FROM    Products_Prices pp
                                                                    WHERE   pp.price = {$price['priceID']} AND
                                                                            pp.model = $model");

                                            if(mysqli_num_rows($result) == 0){                      
                                                $db->query("INSERT INTO Products_Prices(model, price, priceNoIVA) 
                                                            VALUES ($model, {$price['priceID']}, 0)
                                                ");
                                            }
                                        }
                                    }
                                }
                            }else{
                                $result = $db->resultToArray($result)[0];
                                $hiring = $result['ID'];
                                $model = $result['model'];
                                
                                $priceExp = $expedient['priceExp'];
                                if($priceExp == null || $priceExp == ''){
                                    $priceExp = 'null';
                                }

                                $result = $db->query("  UPDATE  Expedients_Hirings
                                                        SET     priceExp = $priceExp
                                                        WHERE   ID = $hiring
                                ");
        
                                $result = $db->query("  SELECT  productModelID, supplier 
                                                        FROM    Products_Models 
                                                        WHERE   productModelID = $model AND
                                                                leavingDate IS NULL");
        
                                if(mysqli_num_rows($result) == 0){
                                    $result = $db->query("  SELECT  pm.productModelID
                                                            FROM    Products_Models pm
                                                            WHERE   pm.product = " . $data['productID'] ." AND pm.leavingDate IS NULL");

                                    if(mysqli_num_rows($result) > 0){
                                        $productModelID = $db->resultToArray($result)[0]['productModelID'];
        
                                        $result = $db->query("  UPDATE  Expedients_Hirings
                                                                SET     model = $productModelID
                                                                WHERE   ID = $hiring");

                                        // Search in products retails
                                        $result = $db->query("  SELECT  ID 
                                                                FROM    Products_Retails
                                                                WHERE   model = $model AND
                                                                        year = {$expedient['year']}
                                        ");
            
                                        if(mysqli_num_rows($result) == 0){
                                            $db->query("INSERT INTO Products_Retails (model, purchasePrice, year) 
                                                        VALUES ($model, 0, {$expedient['year']})
                                            ");
                                        }

                                        // Search in products prices
                                        $result = $db->query("  SELECT  p.priceID
                                                                FROM    Prices p
                                                                WHERE   p.year = {$expedient['year']} AND
                                                                        p.leavingDate IS NULL");

                                        if(mysqli_num_rows($result) > 0){                      
                                            $prices = $db->resultToArray($result);

                                            foreach($prices as $price){
                                                $result = $db->query("  SELECT  pp.model
                                                                        FROM    Products_Prices pp
                                                                        WHERE   pp.price = {$price['priceID']} AND
                                                                                pp.model = $model");

                                                if(mysqli_num_rows($result) == 0){                      
                                                    $db->query("INSERT INTO Products_Prices(model, price, priceNoIVA) 
                                                                VALUES ($model, {$price['priceID']}, 0)
                                                    ");
                                                }
                                            }
                                        }
                                    }
                                }else{
                                    // Search in products retails
                                    $result = $db->query("  SELECT  ID 
                                                            FROM    Products_Retails
                                                            WHERE   model = $model AND
                                                                    year = {$expedient['year']}
                                    ");
        
                                    if(mysqli_num_rows($result) == 0){
                                        $db->query("INSERT INTO Products_Retails (model, purchasePrice, year) 
                                                    VALUES ($model, 0, {$expedient['year']})
                                        ");
                                    }

                                    // Search in products prices
                                    $result = $db->query("  SELECT  p.priceID
                                                            FROM    Prices p
                                                            WHERE   p.year = {$expedient['year']} AND
                                                                    p.leavingDate IS NULL");

                                    if(mysqli_num_rows($result) > 0){                      
                                        $prices = $db->resultToArray($result);

                                        foreach($prices as $price){
                                            $result = $db->query("  SELECT  pp.model
                                                                    FROM    Products_Prices pp
                                                                    WHERE   pp.price = {$price['priceID']} AND
                                                                            pp.model = $model");

                                            if(mysqli_num_rows($result) == 0){                      
                                                $db->query("INSERT INTO Products_Prices(model, price, priceNoIVA) 
                                                            VALUES ($model, {$price['priceID']}, 0)
                                                ");
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                                        
                // Acciones
                $productsActions = $data['actions'];
                if($productsActions != null && $productsActions != ''){
                    foreach(explode(",", $productsActions) as $productAction){
                        $productAction = cleanStr($productAction);
                        $str = explode("-", $productAction);

                        $db->query("UPDATE  Products_Actions 
                                    SET     checked = '$str[1]' 
                                    WHERE   product = " . $data['productID'] . " AND 
                                            action = $str[0]");

                        // if($data['actionsExpedient'] != 'false'){
                        //     $result = $db->query("  SELECT  pm.productModelID
                        //                             FROM    Products_Models pm
                        //                             WHERE   pm.product = " . $data['productID'] ." AND pm.leavingDate IS NULL");

                        //     if(mysqli_num_rows($result) > 0){
                        //         $models = $db->resultToArray($result);

                        //         $result = $db->query("  SELECT  e.expedientID, year(e.requestDate) as year      
                        //                                 FROM    Expedients e
                        //                                 WHERE   e.leavingDate IS NULL AND
                        //                                         e.expedientID >= " . $data['expedient']);

                        //         if(mysqli_num_rows($result) > 0){
                        //             $expedients = $db->resultToArray($result);
                        //             foreach($expedients as $expedient){
                        //                 foreach($models as $model){
                        //                     $result = $db->query("  SELECT  sa.ID
                        //                                             FROM    Services_Auto sa
                        //                                             WHERE   sa.service = " . $expedient['expedientID'] . " AND
                        //                                                     sa.model = " . $model['productModelID'] . " AND
                        //                                                     sa.action = $str[0]");

                        //                     if(mysqli_num_rows($result) == 0){
                        //                         $db->query("INSERT INTO Services_Auto(service, model, action, value, status)
                        //                                     VALUES (" . $expedient['expedientID'] . ", " . $model['productModelID'] . ", $str[0], '', $str[1])");
                        //                     }else{
                        //                         $saID = $db->resultToArray($result)[0]['ID'];

                        //                         $db->query("UPDATE  Services_Auto sa
                        //                                     SET     sa.status = $str[1]
                        //                                     WHERE   sa.ID = $saID");
                        //                     }
                        //                 }
                        //             }
                        //         }
                        //     }
                        // }
                    }
                }

                // Almacén - Si el producto pasa a ser de tipo stock se añade, sino se elimina
                require_once($_SESSION['basePath'] . "model/stock.php");
                $stock = new Stock;
                $stock->update($data['productID']);

                return true;
            }else{
                return "NAME_ERROR";
            }
        }

        /**
         * Elimina un producto
         *
         * @param array $data ID del producto
         * @return bool
         */
        public function deleteProduct($data){
            $db = new DbHandler;

            $data['productID'] = cleanStr($data['productID']);

            $flag = 0;
            $result = $db->query("  UPDATE Products
                                    SET   leavingDate = '" . date('Y-m-d H:i:s') . "'
                                    WHERE productID = " . $data['productID'] . "");

            if(!$result){
                $flag++;
            }

            $result =  $db->query(" UPDATE  Products_Models
                                    SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                                    WHERE   product = " . $data['productID'] . "");
            if(!$result){
                $flag++;
            }

            if($flag > 0){
                return false;
            }else{
                return true;
            }
        }

        /**
        * Obtiene los ID de los productos
        *
        * @return array
        */
        public function listProductsID(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  productID
                                    FROM    Products 
                                    WHERE   leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Obtiene los productos que pueden aparecen en la contratación del expediente
         * 
         * @return array
         */
        public function getProductsHiring(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      p.productID
                                    FROM        Products p
                                    WHERE       p.leavingDate IS NULL AND
                                                p.orderType = 0 OR p.orderType = 3
                                    ORDER BY    p.blockBelow, p.orderBy");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
        * Obtiene el nombre de un producto
        * 
        * @param int $data
        *
        * @return array
        */
        public function getProduct($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  name
                                    FROM    Products 
                                    WHERE   productID = " . $data . "");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de las acciones que puede tener un producto
        *
        * @return array
        */
        public function getProductsServices(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  ID, name 
                                    FROM    Products_Services 
                                    WHERE   status = 0");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
        * Añade una acción de producto
        *
        * @param array $data
        *
        * @return bool
        */
        public function createProductAction($data){
            $db = new DbHandler;

            $data['orderBy'] = cleanStr($data['orderBy']);
            $data['type'] = cleanStr($data['type']);
            $data['label'] = cleanStr($data['label']);
            $data['orderBy'] = cleanStr($data['orderBy']);

            // Calculate extraID
            $result = $db->query("SELECT  MAX(ID) as id FROM    Actions");
            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 2);
            $extraID .= ($maxID+1);

            if($data['orderBy'] == ''){
                $data['orderBy'] = 'null';
            }
            
            $result = $db->query("INSERT INTO Actions(type, label, extraID, orderBy) 
                                  VALUES ('" . $data['type'] . "', '" . $data['label'] . "', '" . $extraID . "', " . $data['orderBy'] . ")");

            if(!$result){
                return false;
            }else{
                $result = $db->query("SELECT ID 
                                      FROM   Actions 
                                      WHERE  extraID = '" . $extraID . "'");

                $action = $db->resultToArray($result)[0]['ID'];

                $products = $this->listProductsID();
                foreach($products as $product){
                    $result = $db->query("INSERT INTO Products_Actions(product, action, value, checked) 
                                          VALUES(" . $product['productID'] . ", " . $action . ", '', 0)");
                }
               
                if($data['type'] == 'staff'){  
                    $checks = $data['checksPost'];
                    
                    if(count($checks) == 0){
                        $checks = 'null';
                    }

                    if($checks != null){                        
                        foreach ($checks as $key => $value) {
                            $key = cleanStr($key);
                            $value = cleanStr($value);
                            $db->query("INSERT INTO Action_Personal(idAction, idPost, checked) 
                                        VALUES(". $action . ", ".$key.", ".$value.")");
                        }
                    }
                }
            }

            return true;
        }

        /**
        * Obtiene los datos de una acción de producto
        *
        * @param array $data
        *
        * @return bool
        */
        public function readProductAction($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $action = $db->query("  SELECT  *
                                    FROM    Actions
                                    WHERE   ID = " . $data['ID'] . "");

            if(mysqli_num_rows($action) == 0){
				return null;
			}else{
                return $db->resultToArray($action);
            }
        }

        /**
        * Modifica los datos de una acción de producto
        *
        * @param array $data
        *
        * @return bool
        */
        public function updateProductAction($data){
            $db = new DbHandler;

            $data['orderBy'] = cleanStr($data['orderBy']);
            $data['type'] = cleanStr($data['type']);
            $data['ID'] = cleanStr($data['ID']);
            $data['label'] = cleanStr($data['label']);

            if($data['orderBy'] == ''){
                $data['orderBy'] = 'null';
            }       

            if($data['type'] == 'staff'){  
                $actionsPersonalExists = $db->query("   SELECT  *
                                                        FROM    Action_Personal
                                                        WHERE   idAction = " . $data['ID']. " AND leavingDate IS NULL");

                $checks = $data['checksPostEdit'];                
                if(count($checks) == 0){
                    $checks = 'null';
                }

                if($checks != null){                        
                    foreach ($checks as $key => $value) {
                        $key = cleanStr($key);
                        $value = cleanStr($value);

                        if(mysqli_num_rows($actionsPersonalExists) == 0){ //Si se ha cambiado el tipo de accion a personal y no existe la tabla Action Personal 
                            $db->query("INSERT INTO Action_Personal(idAction, idPost, checked) 
                                        VALUES(". $data['ID'] . ", ".$key.", ".$value.")");
                        }else{
                            $db->query("UPDATE Action_Personal
                                        SET checked = $value 
                                        WHERE idAction = " . $data['ID']. " AND idPost = $key");
                        }
                    }
                }
            }

            return $db->query(" UPDATE  Actions 
                                SET     type = '" . $data['type'] . "', 
                                        label = '" . $data['label'] . "',
                                        orderBy = " . $data['orderBy'] . "
                                WHERE   ID = " . $data['ID'] . "");
        }

        /**
        * Elimina los datos de una acción de producto
        *
        * @param array $data
        *
        * @return bool
        */
        public function deleteProductAction($data, $type){
            $db = new DbHandler;

            $data = cleanStr($data);
            $type = cleanStr($type);

            $date = time(); 
            if($type == 'staff'){  
                $db->query("UPDATE  Action_Personal 
                            SET     leavingDate = $date
                            WHERE   idAction = " . $data . "");
            }

            return $db->query(" UPDATE  Actions 
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                                WHERE   ID = " . $data . "");
        }

        public function getProductActions(){
            $db = new DbHandler;

            $actions = $db->query("SELECT *
                                  FROM Actions
                                  WHERE leavingDate IS NULL");

            if(mysqli_num_rows($actions) == 0){
				return null;
			}else{
                return $db->resultToArray($actions);
            }
        }

        /**
         * Añade un modelo a un producto
         *
         * @param array $data Datos del modelo del producto
         * @return bool
         */
        public function createProductModel($data){
            $db = new DbHandler;

            $data['product'] = cleanStr($data['product']);
            $data['supplier'] = cleanStr($data['supplier']);
            $data['name'] = cleanStr($data['name']);
            $data['supplierReference'] = isset($data['supplierReference']) ? cleanStr($data['supplierReference']) : $data['name'];
            $data['purchasePrice'] = cleanStr($data['purchasePrice']);
            $data['year'] = cleanStr($data['year']);
            $data['visibleHiring'] = cleanStr($data['visibleHiring']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }
            if($data['supplierReference'] == ''){
                return false;
            }
            if($data['purchasePrice'] == ''){
                return false;
            }
            if($data['supplier'] == ''){
                $data['supplier'] = 2;
            }
            if($data['year'] == ''){
                return false;
            }

            // Calculate extraID
            $result = $db->query("  SELECT  MAX(productModelID) as id
                                    FROM    Products_Models");
            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 2);
            $extraID .= ($maxID+1);

            $db->query("INSERT INTO Products_Models(product, supplier, name, supplierReference, leavingDate, extraID, `default`, visibleHiring) 
                        VALUES (" . $data['product'] . ", " . $data['supplier'] . ", '" . $data['name'] . "', '" . $data['supplierReference'] . "', 
                            null, '" . $extraID . "', 0, " . $data['visibleHiring'] . ")");

            // ID del modelo
            $model = $db->query("   SELECT  productModelID 
                                    FROM    Products_Models 
                                    WHERE   extraID = '$extraID'");

            $model = $db->resultToArray($model)[0]['productModelID'];

            $db->query("INSERT INTO Products_Retails(model, purchasePrice, year) 
                        VALUES ($model, " . $data['purchasePrice'] . ", " . $data['year'] . ")");
            
            $retails = json_decode(stripslashes($data['modelPrices']));
           
            foreach($retails as $retail){
                $retail[0] = cleanStr($retail[0]);
                $retail[1] = cleanStr($retail[1]);
                $db->query("INSERT INTO Products_Prices(model, price, priceNoIVA) 
                            VALUES(" . $model . ", " . $retail[0] . ", " . $retail[1] . ")");
            }

            // Checks if the prices already generated for the new year
            $resultSettings = $db->query("  SELECT  s.value as pricesNextYear
                                    FROM    Settings s
                                    WHERE   s.settingsID = 37");

            if(mysqli_num_rows($resultSettings) != 0){
                $settings = $db->resultToArray($resultSettings);

                if(
                    isset($settings[0]) && 
                    isset($settings[0]['pricesNextYear']) && 
                    intval($settings[0]['pricesNextYear']) == 1
                ){
                    // Create model prices to next year

                    // Get prices for the next year
                    $currentYear = intval($data['year']);
                    $nextYear = $currentYear + 1;
                    $resultPrices = $db->query("    SELECT  p.*
                                                    FROM    Prices p
                                                    WHERE   p.year = $currentYear AND
                                                            p.leavingDate IS NULL");
                    
                    if(mysqli_num_rows($resultPrices) != 0){
                        $resultPrices = $db->resultToArray($resultPrices);
                        foreach($resultPrices as $elem){

                            //VAMOS A DUPLICAR EL PRECIO POR TARIFA PARA EL MODELO
                            $resultProductPrices = $db->query(" SELECT  pp.*
                                                                FROM    Products_Prices pp, Products_Models pm, Prices p
                                                                WHERE   pp.price = {$elem['priceID']} AND
                                                                        pp.model = pm.productModelID AND
                                                                        pm.productModelID = $model AND
                                                                        pm.leavingDate IS NULL AND
                                                                        pp.price = p.priceID AND
                                                                        p.leavingDate IS NULL");

                            if(mysqli_num_rows($resultProductPrices) != 0){
                                $resultProductPrices = $db->resultToArray($resultProductPrices);
                                foreach($resultProductPrices as $price){

                                    $resultPricesNext = $db->query("    SELECT  p.*
                                                                        FROM    Prices p
                                                                        WHERE   p.year = $nextYear AND
                                                                                p.leavingDate IS NULL AND
                                                                                p.name = '{$elem['name']}'");

                                    if(mysqli_num_rows($resultPricesNext) != 0){
                                        $resultPricesNext = $db->resultToArray($resultPricesNext);
                                        $nextPriceID = $resultPricesNext[0]['priceID'];

                                        $db->query("INSERT INTO Products_Prices(model, price, priceNoIVA)
                                                    VALUES ($model, $nextPriceID, {$price['priceNoIVA']})");
                                    }
                                }
                            }
                        }

                        //VAMOS A DUPLICAR EL PRECIO DE COMPRA PARA ESE MODELO
                        $resultProductRetails = $db->query("    SELECT  pm.*, pr.purchasePrice
                                                                FROM    Products_Models pm, Products_Retails pr, Products p
                                                                WHERE   pm.leavingDate IS NULL AND
                                                                        p.leavingDate IS NULL AND
                                                                        p.productID = pm.product AND
                                                                        pm.productModelID = pr.model AND
                                                                        pm.productModelID = $model AND
                                                                        pr.year = " . $data['year'] . "");

                        if(mysqli_num_rows($resultProductRetails) != 0){
                            $resultProductRetails = $db->resultToArray($resultProductRetails);
                            foreach($resultProductRetails as $purchases){
                                $db->query("INSERT INTO Products_Retails(model, purchasePrice, year)
                                    VALUES ($model, {$purchases['purchasePrice']}, $nextYear)");
                            }
                        }
                    }
                }
            }

            // Añade el producto al almacén si es de tipo stock
            $product = $db->query(" SELECT  type
                                    FROM    Products
                                    WHERE   productID = " . $data['product']);

            $type = $db->resultToArray($product)[0]['type'];

            if($type == '2' || $type == '4'){
                require_once($_SESSION['basePath'] . "model/stock.php");
                $stock = new Stock;
                $stock->add($model);
            }

            // Comprueba si es el primer modelo que se añade. Si es así, lo añade a todas las plantillas existentes
            $product = $db->query(" SELECT  COUNT(*) as amount
                                    FROM    Products_Models pm
                                    WHERE   pm.product = " . $data['product'] . " AND pm.leavingDate IS NULL");

            $amount = $db->resultToArray($product)[0]['amount'];
            if($amount == 1){
                $product = $data['product'];
                $supplier = $data['supplier'];
                $amount = 1;
                $texts = '';
                $discount = 0;
                $total = 0;
                $check = 0;
                $warehouse = 'null';

                $templates = $db->query("   SELECT  t.templateID
                                            FROM    Templates t
                                            WHERE   t.leavingDate IS NULL");

                if(mysqli_num_rows($templates) > 0){
                    $templates = $db->resultToArray($templates);
                    foreach($templates as $elem){
                        // Calculate extraID
                        $result = $db->query(" SELECT  MAX(ID) as id FROM    Templates_Products");
                        $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 2);
                        $extraID .= ($maxID+1);

                        $template = $elem['templateID'];

                        $db->query("INSERT INTO Templates_Products(template, product, model, supplier, amount, texts, discount, total, `check`, extraID, warehouse) 
                                    VALUES ($template, $product, $model, $supplier, $amount, '$texts', $discount, $total, $check, '$extraID', $warehouse)");
                    }
                }
            }

            return true;
        }

        /**
         * Obtiene los datos de un modelo de un producto
         *
         * @param array $data Datos del modelo
         * @return array
         */
        public function readProductModel($data){
            $db = new DbHandler;

            $data['product'] = cleanStr($data['product']);
            $data['model'] = cleanStr($data['model']);

            // Modelo del producto
            $model = $db->query("   SELECT      pm.productModelID, pm.name as productModelName, pm.supplierReference, pm.image, pm.visibleHiring,
                                                pm.leavingDate, s.supplierID, s.name as supplierName, pr.purchasePrice, pr.year
                                    FROM        (Products_Models pm, Products_Retails pr) 
                                    LEFT JOIN   Suppliers s ON s.supplierID = pm.supplier
                                    WHERE       pm.productModelID = pr.model AND
                                                pm.product = " . $data['product'] . " AND
                                                pm.productModelID = " . $data['model'] . " AND
                                                pr.year = " . date('Y'));

            if(mysqli_num_rows($model) == 0){
				return null;
			}else{
                // Modelos del producto - Precios por tarifa
                $price = $db->query("   SELECT      pp.model, pp.price, pp.priceNoIVA, p.name
                                        FROM        Products_Prices pp, Prices p 
                                        WHERE       p.year = " . date("Y") . " AND
                                                    p.priceID = pp.price AND 
                                                    pp.model = " . $data['model'] . " AND
                                                    p.leavingDate IS NULL
                                        ORDER BY    p.name");
    
                if(mysqli_num_rows($price) == 0){
                    return null;
                }

                // Obtenemos las tarifas para el año anterior
                $date = date('Y', strtotime('-1 years'));
                // Modelo del producto
                $purchasePrice = $db->query("   SELECT      pr.purchasePrice as lastPrice
                                                FROM        (Products_Models pm, Products_Retails pr) 
                                                LEFT JOIN   Suppliers s ON s.supplierID = pm.supplier
                                                WHERE       pm.productModelID = pr.model AND
                                                            pm.product = " . $data['product'] . " AND
                                                            pm.productModelID = " . $data['model'] . " AND
                                                            pr.year = " . $date ."");
        
                $lastPrice = $db->query("   SELECT      pp.model, pp.price, pp.priceNoIVA, p.name
                                            FROM        Products_Prices pp, Prices p 
                                            WHERE       p.year = " . $date . " AND
                                                        p.priceID = pp.price AND 
                                                        pp.model = " . $data['model'] . " AND
                                                        p.leavingDate IS NULL
                                            ORDER BY    p.name");

                
                // Obtenemos las tarifas para el año siguiente
                $flagNextPricesYear = false;

                $result = $db->query("  SELECT  value 
                                        FROM    Settings 
                                        WHERE   name = 'pricesNextYear'");
                
                if(mysqli_num_rows($result) > 0){
                    $resultAux = $db->resultToArray($result)[0]['value'];
                    if(intval($resultAux) == 1){
                        $flagNextPricesYear = true;
                    }
                }

                // Si están generadas las tarifas del año que viene, buscamos las tarifas para el modelo del producto
                if($flagNextPricesYear){

                    // Obtenemos las tarifas para el año anterior
                    $date = date('Y', strtotime('+1 years'));
                    // Modelo del producto
                    $purchasePriceNextYear = $db->query("   SELECT      pr.purchasePrice as nextPrice
                                                            FROM        (Products_Models pm, Products_Retails pr) 
                                                            LEFT JOIN   Suppliers s ON s.supplierID = pm.supplier
                                                            WHERE       pm.productModelID = pr.model AND
                                                                        pm.product = " . $data['product'] . " AND
                                                                        pm.productModelID = " . $data['model'] . " AND
                                                                        pr.year = " . $date ."");
            
                    $nextPrice = $db->query("   SELECT      pp.model, pp.price, pp.priceNoIVA, p.name, p.priceID as newPriceID
                                                FROM        Products_Prices pp, Prices p 
                                                WHERE       p.year = " . $date . " AND
                                                            p.priceID = pp.price AND 
                                                            pp.model = " . $data['model'] . " AND
                                                            p.leavingDate IS NULL
                                                ORDER BY    p.name");
                    
                    if(mysqli_num_rows($nextPrice) == 0){
                        return array(
                            $db->resultToArray($model),
                            $db->resultToArray($price),
                            null,
                            $db->resultToArray($lastPrice),
                            null,
                            $db->resultToArray($nextPrice)
                        );
                    }else{
                        $purchasePriceAux = $db->resultToArray($purchasePrice);
                        return array(
                            $db->resultToArray($model),
                            $db->resultToArray($price),
                            count($purchasePriceAux) > 0 ? $purchasePriceAux[0]['lastPrice'] : '0.000',
                            $db->resultToArray($lastPrice),
                            $db->resultToArray($purchasePriceNextYear)[0]['nextPrice'],
                            $db->resultToArray($nextPrice)
                        );
                    }
                }else{
                    if(mysqli_num_rows($lastPrice) == 0){
                        return array(
                            $db->resultToArray($model),
                            $db->resultToArray($price),
                            null,
                            $db->resultToArray($lastPrice)
                        );
                    }else{
                        $purchasePriceAux = $db->resultToArray($purchasePrice);
                        return array(
                            $db->resultToArray($model),
                            $db->resultToArray($price),
                            count($purchasePriceAux) > 0 ? $purchasePriceAux[0]['lastPrice'] : '0.000',
                            $db->resultToArray($lastPrice)
                        );
                    }
                }
			}
        }

        /**
         * Modifica los datos de un modelo de un producto
         *
         * @param array $data Datos del modelo del producto
         * @return array
         */
        public function updateProductModel($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['supplierReference'] = cleanStr($data['supplierReference']);
            $data['supplier'] = cleanStr($data['supplier']);
            $data['model'] = cleanStr($data['model']);
            $data['purchasePrice'] = cleanStr($data['purchasePrice']);
            $data['year'] = cleanStr($data['year']);
            $data['visibleHiring'] = cleanStr($data['visibleHiring']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }
            if($data['supplierReference'] == ''){
                return false;
            }
            if($data['purchasePrice'] == ''){
                return false;
            }
            if($data['supplier'] == ''){
                return false;
            }
            if($data['year'] == ''){
                return false;
            }

            if(isset($data['image'])){
                $db->query("    UPDATE  Products_Models 
                                SET     name = '" . $data['name'] . "',
                                        supplierReference = '" . $data['supplierReference'] . "',
                                        supplier = " . $data['supplier'] . ", 
                                        visibleHiring = " . $data['visibleHiring'] . ", 
                                        image = '" . $data['image'] . "'
                                WHERE   productModelID = " . $data['model'] . "");                
            }else{
                $db->query("    UPDATE  Products_Models 
                                SET     name = '" . $data['name'] . "',
                                        supplierReference = '" . $data['supplierReference'] . "',
                                        supplier = " . $data['supplier'] . ",
                                        visibleHiring = " . $data['visibleHiring'] . "
                                WHERE   productModelID = " . $data['model'] . "");   
            }

            // Update current price
            $retail = $db->query("  UPDATE  Products_Retails 
                                    SET     purchasePrice = " . $data['purchasePrice'] . "
                                    WHERE   model = " . $data['model'] . " AND
                                            year = " . $data['year']);

            $retails = json_decode(stripslashes($data['modelPrices']));

            foreach($retails as $retail){
                $retail[0] = cleanStr($retail[0]);
                $retail[1] = cleanStr($retail[1]);
                $retail[2] = cleanStr($retail[2]);

                $db->query("UPDATE  Products_Prices 
                            SET     priceNoIVA = " . $retail[2] . " 
                            WHERE   model = " . $retail[0] . " AND
                                    price = " . $retail[1]);
            }

            /**************** Update price for the next year ****************/
            if(isset($data['modelNewPrices'])){
                $newPrices = json_decode(stripslashes($data['modelNewPrices']));
                
                if(count($newPrices) > 0){

                    // Update price next year
                    $nextYear = intval($data['year']) + 1;
                    $retail = $db->query("  UPDATE  Products_Retails 
                                            SET     purchasePrice = " . $data['nextPurchasePrice'] . "
                                            WHERE   model = " . $data['model'] . " AND
                                                    year = " . $nextYear);

                    foreach($newPrices as $newPriceElem){
                        $newPriceElem[0] = cleanStr($newPriceElem[0]);
                        $newPriceElem[1] = cleanStr($newPriceElem[1]);
                        $newPriceElem[2] = cleanStr($newPriceElem[2]);

                        $db->query("UPDATE  Products_Prices 
                                    SET     priceNoIVA = " . $newPriceElem[2] . " 
                                    WHERE   model = " . $newPriceElem[0] . " AND
                                            price = " . $newPriceElem[1]);
                    }
                }
            }

            return true;
        }

        /**
        * Modifica la imagen de un modelo de un producto
        *
        * @param array $data
        *
        * @return bool
        */
        public function updateFileProductModel($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['productModelID'] = cleanStr($data['productModelID']);

            return $db->query("UPDATE   Products_Models 
                               SET      image = '" . $data['name'] . "' 
                               WHERE    productModelID = " . $data['productModelID'] . "");
        }

        /**
        * Elimina un modelo de un producto
        *
        * @param array $data
        *
        * @return bool
        */
        public function deleteProductModel($data){
            $db = new DbHandler;

            $data['model'] = cleanStr($data['model']);

            $db->query("UPDATE  Products_Models 
                        SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                        WHERE   productModelID = " . $data['model']);

            // Elimina el modelo de los almacenes
            require_once($_SESSION['basePath'] . "model/stock.php");
    
            $stock = new Stock;
            $stock->delete($data['model']);


            // Checks templates products
            $result = $db->query("  SELECT  COUNT(*) as amount
                                    FROM    Templates_Products 
                                    WHERE   model = " . $data['model'] . "");

            $existsProductsTemplate = $db->resultToArray($result)[0]['amount'];
            if(intval($existsProductsTemplate) > 0){
                // Si existe ese modelo en una plantilla, buscamos si ese producto tiene algún modelo más

                $result = $db->query("  SELECT  product
                                        FROM    Templates_Products 
                                        WHERE   model = " . $data['model'] . "");

                if(mysqli_num_rows($result) == 0){
                    return true;
                }

                $productID = $db->resultToArray($result)[0]['product'];
                $result = $db->query("  SELECT  pm.productModelID
                                        FROM    Products_Models pm 
                                        WHERE   pm.product = $productID AND
                                                pm.leavingDate IS NULL");

                if(mysqli_num_rows($result) == 0){
                    $db->query("DELETE FROM Templates_Products WHERE model = " . $data['model'] . "");
                }else{
                    $newProductModel = $db->resultToArray($result)[0]['productModelID'];
                    $db->query("    UPDATE  Templates_Products 
                                    SET     model = " . $newProductModel . ", 
                                            `check` = 0
                                    WHERE   model = " . $data['model'] . "");               
                }
            }

            return true;
        }

        /**
        * Obtiene el nombre de un modelo de un producto
        *
        * @param int $data
        *
        * @return array
        */
        public function getProductModelName($data){
            $db = new DbHandler;

            $data['model'] = cleanStr($data['model']);

            $result = $db->query("  SELECT  name 
                                    FROM    Products_Models 
                                    WHERE   productModelID = " . $data['model'] . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los modelos de un producto que están activos
        *
        * @param array $data
        *
        * @return array
        */
        public function getProductModelsNoDefault($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  COUNT(*) as total
                                    FROM    Products_Models 
                                    WHERE   product = " . $data . " AND 
                                            `default` = 0 AND 
                                            leavingDate is null");
            if(!$result){
                return null;
            }else{
                return $db->resultToArray($result)[0]['total'];
            }
        }

        /**
        * Obtiene los modelos de un producto
        *
        * @param array $data
        *
        * @return array
        */
        public function getProductModels($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("SELECT productModelID, name 
                                  FROM   Products_Models 
                                  WHERE  product = " . $data . "");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los modelos por nombre
        *
        * @param string $name
        *
        * @return array
        */  
        public function searchByNameModel($name, $product){
            $db = new DbHandler;

            $name = cleanStr($name);
            $product = cleanStr($product);
            
            $result = $db->query("  SELECT  productModelID, name
                                    FROM    Products_Models 
                                    WHERE   name LIKE '%". $name ."%' AND
                                            product = ". $product ." AND
                                            leavingDate IS NULL
                                    ORDER BY name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Obtiene la tarifa para el tipo de cliente del año actual
         * 
         * @param array $data
         * @return array
         */
        public function getPriceByTypeClient($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  priceID
                                    FROM    Prices
                                    WHERE   name LIKE '" . $data . "' AND
                                            year = " . date('Y'));

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['priceID'];
        }

        /**
        * Obtiene los modelos por nombre
        *
        * @param string $name
        *
        * @return array
        */  
        public function searchByNameModelAndSupplierExpedient($name, $product, $supplier, $expedient){
            $db = new DbHandler;

            $name = cleanStr($name);
            $product = cleanStr($product);
            $supplier = cleanStr($supplier);
            $expedient = cleanStr($expedient);

            //PROVEEADOR = 'NO PROVEEDOR'
            if($supplier == 127){

                if(
                    $product == null || $product == '' ||
                    $expedient == null || $expedient == ''
                ){
                    return [];
                }

                $result = $db->query("  SELECT      pm.productModelID, pm.name, priceNoIVA,
                                                    (pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) AS price
                                        FROM        (Products p, Products_Models pm, IVA_Types it, Expedients e, Products_Retails pr)
                                        LEFT JOIN   Products_Prices pp ON pp.price = e.client AND pm.productModelID = pp.model
                                        WHERE       p.productID = " . $product . " AND
                                                    pm.product = p.productID AND
                                                    pm.leavingDate IS NULL AND
                                                    e.expedientID = " . $expedient . " AND
                                                    pm.name LIKE '%". $name ."%' AND
                                                    pm.productModelID = pr.model AND
                                                    pr.year = year(e.entryDate) AND
                                                    it.IVATypeID = p.IVA AND
                                                    pm.visibleHiring = 1
                                        GROUP BY    pm.productModelID
                ");
            }else{

                if(
                    $product == null || $product == '' ||
                    $expedient == null || $expedient == '' ||
                    $supplier == null || $supplier == ''
                ){
                    return [];
                }

                $result = $db->query("  SELECT      pm.productModelID, pm.name, priceNoIVA,
                                                    (pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) AS price
                                        FROM        (Products p, Products_Models pm, IVA_Types it, Expedients e, Products_Retails pr)
                                        LEFT JOIN   Products_Prices pp ON pp.price = e.client AND pm.productModelID = pp.model
                                        WHERE       p.productID = " . $product . " AND
                                                    pm.product = p.productID AND
                                                    pm.supplier = " . $supplier . " AND
                                                    pm.leavingDate IS NULL AND
                                                    e.expedientID = " . $expedient . " AND
                                                    pm.name LIKE '%". $name ."%' AND
                                                    pm.productModelID = pr.model AND
                                                    pr.year = year(e.entryDate) AND
                                                    it.IVATypeID = p.IVA AND
                                                    pm.visibleHiring = 1
                                        GROUP BY    pm.productModelID
                ");
                
            }
            
            if(mysqli_num_rows($result) == 0){
                return [];
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los modelos por nombre
        *
        * @param string $name
        *
        * @return array
        */  
        public function searchByNameModelAndSupplier($name, $product, $supplier){
            $db = new DbHandler;

            $name = cleanStr($name);
            $product = cleanStr($product);
            $supplier = cleanStr($supplier);
            
            $result = $db->query("  SELECT      pm.productModelID, pm.name
                                    FROM        Products p, Products_Models pm, Products_Retails pr
                                    WHERE       p.productID = $product AND
                                                pm.product = p.productID AND
                                                pm.supplier = $supplier AND
                                                pm.leavingDate IS NULL AND                                         
                                                pm.name LIKE '%$name%' AND
                                                pm.productModelID = pr.model AND
                                                pr.year = " . date('Y') . "
                                    ORDER BY    pm.name");
            
            if(mysqli_num_rows($result) == 0){
                return [];
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los proveedores por nombre
        *
        * @param string $name
        *
        * @return array
        */  
        public function searchByNameSupplier($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT  supplierID, name
                                    FROM    Suppliers 
                                    WHERE   name LIKE '%". $name ."%'");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Obtiene los productos dado el proveedor
         * 
         * @param array $search
         * @param array $supplier
         * 
         * @return array
         */
        public function searchBySupplier($search, $supplier){
            $db = new DbHandler;

            $search = cleanStr($search);
            $supplier = cleanStr($supplier);

            $result = $db->query("  SELECT      DISTINCT(pm.product) as productID, p.name
                                    FROM        Products_Models pm, Products p
                                    WHERE       pm.product = p.productID AND
                                                pm.supplier = " . $supplier . " AND
                                                p.name LIKE '%" . $search . "%' AND
                                                p.leavingDate IS NULL AND
                                                pm.leavingDate IS NULL
                                    ORDER BY    p.name");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /*  Precios */
        /**
        * Obtiene el precio asociado al modelo del producto
        *
        * @param integer $model
        *
        * @return array
        */
        public function getPrice($data){
            $db = new DbHandler;

            $data['model'] = cleanStr($data['model']);
            $data['expedientID'] = cleanStr($data['expedientID']);

            if(isset($data['numHiring']) && $data['numHiring'] != null && $data['numHiring'] != ''){
                $result =  $db->query(" SELECT  eh.priceExp
                                        FROM    Expedients_Hirings eh
                                        WHERE   eh.expedient = {$data['expedientID']} AND
                                                eh.num_hiring = {$data['numHiring']}
                                        LIMIT   1
                ");

                if(mysqli_num_rows($result) > 0){
                    $priceHiringInfo = $db->resultToArray($result)[0]['priceExp'];

                    $priceRef = " " . $priceHiringInfo;
                }
            }else{
                $priceRef = " e.priceExp";
            }

            $result =  $db->query("SELECT   (pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) AS price, pp.priceNoIVA, p.supplied, p.name, p.editPrice, it.percentage
                                   FROM     Products p, Products_Models pm,Products_Prices pp, IVA_Types it, Expedients e
                                   WHERE    pm.productModelID = " . $data['model'] . " AND
                                            e.expedientID = " . $data['expedientID'] . " AND
                                            pp.model = pm.productModelID AND
                                            p.productID = pm.product AND p.IVA = it.IVATypeID AND
                                            $priceRef = pp.price");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result)[0];
            }
        }

        /**
        * Obtiene el precio asociado a un conjunto de productos
        *
        * @param integer $model
        *
        * @return array
        */
        public function getProductsPrices($data){
            $db = new DbHandler;

            $data['expedient'] = cleanStr($data['expedient']);
            $data['models'] = implode(", ", $data['models']);

            if(isset($data['numHiring']) && $data['numHiring'] != null && $data['numHiring'] != ''){
                $result =  $db->query(" SELECT  eh.priceExp
                                        FROM    Expedients_Hirings eh
                                        WHERE   eh.expedient = {$data['expedient']} AND
                                                eh.num_hiring = {$data['numHiring']}
                                        LIMIT   1
                ");

                if(mysqli_num_rows($result) > 0){
                    $priceHiringInfo = $db->resultToArray($result)[0]['priceExp'];

                    $priceRef = " " . $priceHiringInfo;
                }
            }else{
                $priceRef = " e.priceExp";
            }

            $result =  $db->query("SELECT   pm.productModelID, 
                                            (pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) AS price, 
                                            pp.priceNoIVA, 
                                            p.supplied, 
                                            p.name, 
                                            p.editPrice, 
                                            it.percentage
                                   FROM     Products p, Products_Models pm, Products_Prices pp, IVA_Types it, Expedients e
                                   WHERE    pm.productModelID IN (" . $data['models'] . ") AND
                                            e.expedientID = " . $data['expedient'] . " AND
                                            pp.model = pm.productModelID AND
                                            p.productID = pm.product AND p.IVA = it.IVATypeID AND
                                            $priceRef = pp.price
            "
            );
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }
        
        /**
        * Obtiene el precio asociado al modelo del producto
        *
        * @param integer $model
        *
        * @return array
        */
        public function getWarehousePpal($expedient){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);

            $result =  $db->query(" SELECT  c.ID, c.name
                                    FROM    Expedients e, Cost_Center c
                                    WHERE   e.deceasedMortuary = c.mortuary AND
                                            e.expedientID = $expedient AND
                                            e.leavingDate IS NULL AND
                                            c.leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
            
                $result =  $db->query(" SELECT  ID, name
                                        FROM    Cost_Center
                                        WHERE   leavingDate IS NULL
                                        ORDER BY warehousePpal DESC");

                if(mysqli_num_rows($result) == 0){
                    return null;
                }else{
                    return $db->resultToArray($result)[0];
                }
            }else{
                if(mysqli_num_rows($result) == 0){
                    return null;
                }else{
                    return $db->resultToArray($result)[0];
                }
            }
        }

        /**
        * Obtiene los products por nombre
        *
        * @param string $name
        *
        * @return array
        */  
        public function searchByNameProduct($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("  SELECT      productID, name
                                    FROM        Products 
                                    WHERE       name LIKE '%". $name ."%' AND
                                                leavingDate IS NULL
                                    ORDER BY    name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }
        
        /**
         * Obtiene los datos del stock de un model del producto
         * 
         * @param array $data
         *
         * @return array
         */
        public function getStock($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  minStock, currentStock
                                    FROM    Stock s, Products_Models pm
                                    WHERE   model = " . $data . " AND
                                            pm.productModelID = s.model AND
                                            pm.leavingDate IS NULL");

            return mysqli_num_rows($result) ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Obtiene el primer model del producto dado
         *
         * @param array $data
         * 
         * @return array
         */
        public function getFirstModelByProduct($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  productModelID
                                    FROM    Products_Models
                                    WHERE   product = " . $data . " AND
                                            leavingDate IS NULL
                                    LIMIT   1");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Obtiene el primer model del producto dado
         *
         * @param array $data
         * 
         * @return array
         */
        public function getProducts($year, $to, $from){
            $db = new DbHandler;

            $year = cleanStr($year);
            $to = cleanStr($to);
            $from = cleanStr($from);

            $result = $db->query("  SELECT      pm.productModelID AS modelID, p.name AS product, pm.name AS model
                                    FROM        (Products p)
                                    LEFT JOIN   Products_Models pm ON p.productID = pm.product
                                    WHERE       p.leavingDate IS NULL AND pm.leavingDate IS NULL");

            $result2 = $db->query(" SELECT      pm.productModelID AS modelID, 
                                                SUM(pp.priceNoIVA + ((pp.priceNoIVA * it.percentage) / 100)) AS cost, 
                                                pr.purchasePrice AS purchase,
                                                pp.priceNoIVA
                                    FROM        (Expedients e)
                                    LEFT JOIN   Expedients_Hirings eh ON e.expedientID = eh.expedient
                                    LEFT JOIN   Products p ON eh.product = p.productID
                                    LEFT JOIN   IVA_Types it ON it.IVATypeID = p.IVA
                                    LEFT JOIN   Products_Models pm ON eh.model = pm.productModelID
                                    LEFT JOIN   Products_Retails pr ON pm.productModelID = pr.model
                                    LEFT JOIN   Products_Prices pp ON e.priceExp = pp.price 
                                    WHERE       pm.leavingDate IS NULL AND
                                                pp.model = pm.productModelID AND UNIX_TIMESTAMP(e.entryDate) BETWEEN " . $to . " AND " . $from . "
                                    GROUP BY    pm.productModelID");

            $response['products'] = $db->resultToArray($result);
            $response['costs'] = $db->resultToArray($result2);

            return mysqli_num_rows($result) > 0 ? $response : null;
        }

        /**
         * Obtiene el precio de compra de un modelo
         *
         * @param int $model Id del modelo
         * @return int
         */
        public function getPurchasePrice($model){
            $db = new DbHandler;

            $model = cleanStr($model);

            $result = $db->query("  SELECT  pr.purchasePrice
                                    FROM    Products_Retails pr
                                    WHERE   pr.model = $model AND
                                            pr.year = " . date('Y'));

            return mysqli_num_rows($result) == 0 ? 0.00 : $db->resultToArray($result)[0]['purchasePrice'];
        }

        /**
         * Obtiene los productos de cafetería
         * 
         * @param string $search Producto a buscar
         * @return array
         */
        public function searchCafe($search){
            $db = new DbHandler;

            $search = cleanStr($search);

            $result = $db->query("  SELECT      p.productID, p.name
                                    FROM        Products p
                                    WHERE       p.orderType = 2
                                    ORDER BY    p.name");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene los puestos de trabajo para una acción de tipo personal
         * 
         * @param int $actionID id de la acción
         * @return array
         */
        public function getPostForAction($actionID){
            $db = new DbHandler;

            $actionID = cleanStr($actionID);

            $result = $db->query("  SELECT  ap.idPost
                                    FROM    Action_Personal ap
                                    WHERE   ap.checked = 1 AND 
                                            ap.idAction = $actionID AND 
                                            ap.leavingDate iS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene la referencia del proveedor de un modelo
         * 
         * @param int $model Modelo
         * @return string
         */
        public function getSupplierReference($model){
            $db = new DbHandler;

            $model = cleanStr($model);

            $result = $db->query("  SELECT  pm.supplierReference
                                    FROM    Products_Models pm
                                    WHERE   pm.productModelID = $model");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['supplierReference'];
        }

        /**
        * Obtiene los productos (NO LITERALES)
        *
        * @return array
        */
        public function listProductsDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  p.productID, p.name, pt.name,
                                            CASE
                                                WHEN p.blockBelow = 1 THEN 'Servicio fúnebre'
                                                WHEN p.blockBelow = 2 THEN 'Inhumación'
                                                WHEN p.blockBelow = 3 THEN 'Flores'
                                                WHEN p.blockBelow = 4 THEN 'Transporte'
                                                WHEN p.blockBelow = 5 THEN 'Velación'
                                                WHEN p.blockBelow = 6 THEN 'Crematorio'
                                                WHEN p.blockBelow = 7 THEN 'Servicio judicial'
                                                WHEN p.blockBelow = 8 THEN 'Prensa'
                                                WHEN p.blockBelow = 9 THEN 'Suplidos'
                                                WHEN p.blockBelow = 10 THEN 'Otros'
                                                ELSE '-'
                                            END,
                                            p.supplied, p.press
                                    FROM    Products p, Products_Types pt
                                    WHERE   p.type = pt.productTypeID AND 
                                            p.leavingDate IS NULL AND 
                                            p.name != 'Literales'");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }
        
        /**
        * Obtiene los productos
        *
        * @return array
        */
        public function listProductsActionsDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  a.ID, a.type, a.label, a.orderBy
                                    FROM    Actions a
                                    WHERE   a.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
        * Obtiene los modelos de un producto
        *
        * @return array
        */
        public function listProductsModelsDatatables($productID){
            $db = new DbHandler;

            $result = $db->query("SELECT    pm.productModelID, pm.name, pr.purchasePrice, pp.priceNoIVA, s.name
                                  FROM      (Products_Models pm, Products_Retails pr, Products_Prices pp, Prices p)
                                  LEFT JOIN Suppliers s ON pm.supplier = s.supplierID
                                  WHERE     pm.product = " . $productID." AND
                                            pm.leavingDate IS NULL AND
                                            pm.productModelID = pr.model AND
                                            pr.year = " . date('Y') . " AND
                                            pp.model = pm.productModelID AND
                                            pp.price = p.priceID AND
                                            p.name LIKE 'Particulares' AND
                                            p.leavingDate IS NULL AND
                                            p.year = " . date('Y') . "
                                GROUP BY    pm.productModelID ");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
        * Obtiene todos los productos que figuran en un expediente
        *
        * @param string $name
        *
        * @return array
        */
        public function listProductsExpedients($name=null){
            $db = new DbHandler;
            
            $name = cleanStr($name);

            if($name == null){
                $result = $db->query("  SELECT      p.productID, p.name
                                        FROM        Products p
                                        WHERE       p.leavingDate IS NULL
                                        ORDER BY    p.name");
            }else{
                $result = $db->query("  SELECT      p.productID, p.name
                                        FROM        Products p
                                        WHERE       p.leavingDate IS NULL AND p.name LIKE '%$name%'
                                        ORDER BY    p.name");
            }

            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Comprueba si existe la factura
        *
        * @param array $data
        */
        public function getFirstOrderDate(){
            $db = new DbHandler;

            $result =  $db->query(" SELECT  MIN(o.date) AS firtsDate
                                    FROM    Orders o
                                    WHERE   o.leavingDate IS NULL");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['firtsDate'] : null;
        }

        /**
         * Devuelve la ultima contratacion
         * 
         * @return int
         */
        public function getActiveHiring($expedientID){
            $db = new DbHandler;

            $result = $db->query("  SELECT  COALESCE(MAX(eh.num_hiring), 0) as num_hiring
                                    FROM    Expedients_Hirings eh
                                    WHERE   eh.expedient = $expedientID");

            if(mysqli_num_rows($result) > 0){
                $maxNumHiring = $db->resultToArray($result)[0]['num_hiring'];
                return $maxNumHiring;
            }else{
                return 0;
            }
        }
    }
?>