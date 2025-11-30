<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "model/expedients.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Templates{

        /**
         * Comprueba si una plantilla existe
         * 
         * @param array $template ID de la plantilla
         * @return bool
         */
        function existsTemplate($template){
            $db = new DbHandler;

            $template = cleanStr($template);

            // Validación de campos
            if($template == ''){
                return false;
            }

            $result = $db->query("  SELECT  t.templateID
                                    FROM    Templates t
                                    WHERE   t.templateID = $template AND
                                            t.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? false : true;
        }

        /**
        * Añade una plantilla
        *
        * @param array $data
        */
        public function create($data){
            $db = new DbHandler;
            $expedients = new Expedients();

            $data['name'] = cleanStr($data['name']);
            $data['client'] = cleanStr($data['client']);
            $data['price'] = cleanStr($data['price']);

            // Calculate extraID
            $result = $db->query("  SELECT  MAX(templateID) as id
                                    FROM    Templates");
            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 2);
            $extraID .= ($maxID+1);
            
            $template = $db->query("INSERT INTO Templates(clientType, name, price, total, extraID)
                                    VALUES(" . $data['client'] . ", '" . $data['name'] . "', '" . $data['price'] . "', 
                                           0, '" . $extraID . "')");

            if(!$template){
                return false;
            }else{
                // Busca la plantilla creada
                $template = $db->query("SELECT  templateID 
                                        FROM    Templates 
                                        WHERE    extraID = '" . $extraID . "'");

                $template = $db->resultToArray($template)[0]['templateID'];

                if(!$expedients->createHiringsFirstTemplate($template)){
                    return false;
                }else{
                    return true;
                }
            }
        }

        /**
        * Obtiene los datos de una plantilla
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['templateID'] = cleanStr($data['templateID']);

            $result = $db->query("  SELECT  *
                                    FROM    Templates 
                                    WHERE   templateID = " . $data['templateID'] . "");

            // Obtener servicios, prensa y suplidos
            $expedients = new Expedients();
            $expedients->readHiringsByTemplate($data['templateID']);
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Modifica los datos de una plantilla
        *
        * @param array $data
        */
        public function update($templateID, $clientType, $priceTmpl, $name, $total, $data){
            $db = new DbHandler;

            $templateID = cleanStr($templateID);
            $clientType = cleanStr($clientType);
            $priceTmpl = cleanStr($priceTmpl);
            $name = cleanStr($name);
            $total = cleanStr($total);

            if(count($data) > 0){
                foreach($data as $row){
                    if($row[0] != ""){
                        $row[0] = cleanStr($row[0]);
                        $row[1] = cleanStr($row[1]);
                        $row[2] = cleanStr($row[2]);
                        $row[3] = cleanStr($row[3]);
                        $row[4] = cleanStr($row[4]);
                        $row[5] = cleanStr($row[5]);
                        $row[6] = cleanStr($row[6]);
                        $row[8] = cleanStr($row[8]);
                        $row[9] = cleanStr($row[9]);
                        $row[10] = cleanStr($row[10]);

                        $db->query("UPDATE  Templates_Products
                                    SET     `check` = " . $row[1] . ",
                                            product = " . $row[3] . ",
                                            model = " . $row[4] . ",
                                            supplier = " . $row[5] . ",                                
                                            amount = " . $row[6] . ",
                                            discount = " . $row[8] . ",
                                            total = " . $row[9] . ",
                                            warehouse = " . $row[10] . "
                                    WHERE   ID = " . $row[0]);
                        
                        if($row[7] != ''){
                            foreach($row[7] as $elem){
                                $elem[0] = cleanStr($elem[0]);
                                $elem[1] = cleanStr($elem[1]);
                                $elem[2] = cleanStr($elem[2]);

                                $result = $db->query("  SELECT  ID
                                                        FROM    Templates_Texts
                                                        WHERE   tp = $row[0] AND
                                                                rowIndex = $elem[0]");

                                if(mysqli_num_rows($result) == 0){
                                    $db->query("INSERT INTO Templates_Texts(tp, rowIndex, value, discount)
                                                VALUES ($row[0], $elem[0], '$elem[1]', $elem[2])");
                                }else{
                                    $db->query("UPDATE  Templates_Texts
                                                SET     value = '$elem[1]',
                                                        discount = $elem[2]
                                                WHERE   tp = $row[0] AND
                                                        rowIndex = $elem[0]");
                                }
                            }
                        }
                    }else{
                        // Calculate extraID
                        $result = $db->query("  SELECT  MAX(ID) as id
                                                FROM    Templates_Products");
                        $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 2);
                        $extraID .= ($maxID+1);

                        $db->query("INSERT INTO Templates_Products (`check`, template, product, model, supplier, amount, discount, total, extraID, warehouse)
                                    VALUES (" . $row[1] . ", " . $templateID . ", " . $row[3] . ", " . $row[4] . ", " . $row[5] . ", 
                                            " . $row[6] . ", " . $row[8] . ", " . $row[9] . ", '$extraID', " . $row[10] . ")");

                        $result = $db->query("  SELECT  ID
                                                FROM    Templates_Products
                                                WHERE   extraID = '$extraID'");

                        $tpID = $db->resultToArray($result)[0]['ID'];

                        if($row[7] != ''){
                            foreach($row[7] as $elem){
                                $elem[0] = cleanStr($elem[0]);
                                $elem[1] = cleanStr($elem[1]);
                                $elem[2] = cleanStr($elem[2]);

                                $db->query("INSERT INTO Templates_Texts(tp, rowIndex, value, discount)
                                            VALUES ($tpID, $elem[0], '$elem[1]', $elem[2])");
                            }
                        }
                    }
                }
            }

            if(intval($total) == 0){
                $total = 0;
            }
            
            return $db->query(" UPDATE  Templates 
                                SET     clientType = " . $clientType . ", 
                                        name = '" . $name . "',  
                                        total = " . $total . ",
                                        price = $priceTmpl
                                WHERE   templateID = " . $templateID);
        }

        /**
        * Elimina una plantilla
        *
        * @param array $data
        */
        public function delete($data){
            $db = new DbHandler;

            $data['templateID'] = cleanStr($data['templateID']);

            return $db->query(" UPDATE  Templates
                                SET     leavingDate = " . time() . "
                                WHERE   templateID = " . $data['templateID'] . "");
        }

        /**
        * Obtiene los datos de las plantillas
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("SELECT * FROM Templates");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los IDs de las plantillas
        *
        * @return array
        */
        public function getTemplates(){
            $db = new DbHandler;

            $result = $db->query(" SELECT  templateID, name FROM Templates");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los IDs de las plantillas
        *
        * @return array
        */
        public function searchByName($expedient, $data){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);

            $priceExp = $db->query("    SELECT  e.priceExp
                                        FROM    Expedients e
                                        WHERE   e.expedientID = $expedient");

            $priceExp = $db->resultToArray($priceExp)[0]['priceExp'];

            $result = $db->query("SELECT   t.templateID, t.name 
                                  FROM     Templates t
                                  WHERE    t.leavingDate IS NULL AND
                                           t.price = $priceExp
                                  ORDER BY t.name");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArray($result);
			}
        }
        
        /**
        * Obtenemos los datos de la plantilla
        *
        * @param array $data
        *
        * @return bool
        */
        public function getTemplate($data){
            $db = new DbHandler;

            $data = cleanStr($data);
            
            $result = $db->query("  SELECT  t.*, p.name as priceName
                                    FROM    Templates t, Prices p
                                    WHERE   t.price = p.priceID AND
                                            t.templateID = " . $data
            );

                        
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtenemos los datos de la plantilla
        *
        * @param array $data
        *
        * @return bool
        */
        public function removeProduct($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $db->query(" DELETE FROM Templates_Texts WHERE tp = " . $data . "");

            return $db->query(" DELETE FROM Templates_Products WHERE ID = " . $data . "");
        }

        /**
         * Obtenemos los productos de la plantilla que no son supplidos
         *
         * @param array $data
         * @return array
         */
        public function getProducts($data){
            $db = new DbHandler;

            $data['client'] = cleanStr($data['client']);
            $data['template'] = cleanStr($data['template']);

            $result = $db->query("  (
                                        SELECT      tp.check, tp.template, tp.product, tp.model, pm.supplier, tp.amount, tp.texts, tp.discount, tp.ID, tp.warehouse,
                                                    cc.name as warehouseName,
                                                    p.name AS prodName, p.texts AS withText, p.amount AS contable, p.supplied, p.type, p.blockBelow, p.orderType, p.orderBy, p.editPrice,
                                                    s.name AS suppName, 
                                                    pm.name AS modelName, tp.total as valueEditPrice, it.percentage as percentageEdit,
                                                    pp.priceNoIVA, 
                                                    (pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) AS priceIVA, 
                                                    ((pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) - ((pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) * tp.discount / 100) )* tp.amount  AS priceIVATotal
                                        FROM        (Products p) 
                                        LEFT JOIN   Templates_Products tp ON p.productID = tp.product 
                                        LEFT JOIN   Products_Prices pp ON pp.model = tp.model 
                                        LEFT JOIN   IVA_Types it ON it.IVATypeID = p.IVA 
                                        LEFT JOIN   Products_Models pm ON tp.model = pm.productModelID
                                        LEFT JOIN   Suppliers s ON pm.supplier = s.supplierID 
                                        LEFT JOIN   Cost_Center cc ON tp.warehouse = cc.ID
                                        LEFT JOIN   Mortuaries m ON cc.warehouse = m.mortuaryID
                                        WHERE       p.leavingDate IS NULL AND pm.leavingDate IS NULL AND
                                                    pp.price = " . $data['client'] . " AND 
                                                    tp.template = " . $data['template'] . " AND
                                                    p.supplied = 0 AND p.orderType = 0 AND tp.check = 0 
                                    )
                                    UNION
                                    (
                                        SELECT      tp.check, tp.template, tp.product, tp.model, pm.supplier, tp.amount, tp.texts, tp.discount, tp.ID, tp.warehouse,
                                                    cc.name as warehouseName,
                                                    p.name AS prodName, p.texts AS withText, p.amount AS contable, p.supplied, p.type, p.blockBelow, p.orderType, p.orderBy, p.editPrice,
                                                    s.name AS suppName, 
                                                    pm.name AS modelName, tp.total as valueEditPrice, it.percentage as percentageEdit,
                                                    pp.priceNoIVA,
                                                    (pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) AS priceIVA, 
                                                    ((pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) - ((pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) * tp.discount / 100) )* tp.amount  AS priceIVATotal
                                        FROM        (Products p) 
                                        LEFT JOIN   Templates_Products tp ON p.productID = tp.product 
                                        LEFT JOIN   Products_Prices pp ON pp.model = tp.model 
                                        LEFT JOIN   IVA_Types it ON it.IVATypeID = p.IVA 
                                        LEFT JOIN   Products_Models pm ON tp.model = pm.productModelID
                                        LEFT JOIN   Suppliers s ON pm.supplier = s.supplierID 
                                        LEFT JOIN   Cost_Center cc ON tp.warehouse = cc.ID
                                        LEFT JOIN   Mortuaries m ON cc.warehouse = m.mortuaryID
                                        WHERE       p.leavingDate IS NULL AND pm.leavingDate IS NULL AND 
                                                    pp.price = " . $data['client'] . " AND 
                                                    tp.template = " . $data['template'] . " AND
                                                    p.supplied = 0 AND p.orderType = 0 AND tp.check = 1
                                    )
                                    ORDER BY    blockBelow, orderBy, prodName"
            );

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Obtiene los datos para el pdf factura
         * 
         * @param int $data
         * 
         * @return array
        */
        public function getTemplatePDF($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  t.*, p.name as priceName, ct.name as clientName, p.year as priceYear
                                    FROM    (Templates t, Prices p, Clients_Types ct)
                                    WHERE   t.clientType = ct.clientTypeID AND 
                                            t.price = p.priceID AND 
                                            p.leavingDate IS NULL AND
                                            t.templateID = " . $data . "");

            $result = $db->resultToArray($result)[0];

            $templateID = $result['templateID'];
            $priceID = $result['price'];
            $priceYear = $result['priceYear'];
           
            //Obtener el id de la tarifa de particulares para el año de solicitud del expediente

            $particularPrice = $db->query(" SELECT   p.priceID
                                            FROM     Prices p
                                            WHERE    p.name = 'Particulares'
                                                AND  p.leavingDate IS NULL
                                                AND  p.year = $priceYear");

            $particularPrice = $db->resultToArray($particularPrice)[0]['priceID'];

            $result2 = $db->query(" SELECT      eh.ID as hiringID, eh.amount, eh.discount, eh.total as totalEditPrice, eh.template as expedient, 
                                                pr.productID as productID, pr.name as productName, pr.supplied, pr.texts,
                                                pm.productModelID as modelID, pm.name as modelName, pr.editPrice,
                                                pp.priceNoIVA,
                                                it.percentage,
                                                (
                                                SELECT pp2.priceNoIVA
                                                FROM   Products_Prices pp2
                                                WHERE  pp2.price = $particularPrice AND pp2.model = pm.productModelID
                                                ) as particularPrice,
                                                et.discount as multipleDiscount
                                    FROM        (Templates_Products eh, Products_Prices pp, Products pr, IVA_Types it, Products_Models pm)
                                    LEFT JOIN   Templates_Texts et ON et.tp = eh.ID
                                    WHERE       eh.template = " . $templateID . " AND 
                                                eh.check = 1 AND 
                                                $priceID = pp.price AND
                                                eh.model = pm.productModelID AND
                                                eh.product = pr.productID AND
                                                pr.IVA = it.IVATypeID AND
                                                pr.leavingDate IS NULL AND
                                                pr.supplied = 0 AND 
                                                pr.isInvoiced = 0 AND
                                                pp.model = pm.productModelID
                                    ORDER BY    pr.blockBelow, pr.orderBy, pr.name, eh.ID");

            if(mysqli_num_rows($result2) > 0){
                $result2 = $db->resultToArray($result2);
                $i = 0;
                foreach($result2 as $key => $value){
                    $texts =  $db->query("  SELECT  REPLACE(et.value, '\\\', '') as value
                                            FROM    Templates_Texts et
                                            WHERE   et.tp = {$value['hiringID']}");
                                        
                    if(mysqli_num_rows($texts) > 0){
                        $result2[$i]['texts'] = $db->resultToArray($texts);
                    }else{
                        $result2[$i]['texts'] = '';
                    }
                    $i++;
                }
                $result['factura'] = $result2;
            }

            //Contratación suplidos
            $result2 = $db->query(" SELECT      eh.ID as hiringID, eh.amount, eh.discount,
                                                pr.productID as productID, pr.name as productName, pr.supplied, pr.texts, pr.editPrice,
                                                pm.productModelID as modelID, pm.name as modelName,
                                                it.percentage,
                                                et.discount as multipleDiscount,
                                                eh.total as cost
                                    FROM        (Templates_Products eh, Products pr, IVA_Types it, Products_Models pm)
                                    LEFT JOIN   Templates_Texts et ON et.tp = eh.ID
                                    WHERE       eh.template = " . $templateID . " AND 
                                                eh.check = 1 AND 
                                                eh.model = pm.productModelID AND
                                                eh.product = pr.productID AND
                                                pr.IVA = it.IVATypeID AND
                                                pr.leavingDate IS NULL AND
                                                pr.supplied = 1 AND
                                                pr.isInvoiced = 0
                                    ORDER BY    pr.blockBelow, pr.orderBy, pr.name, eh.ID");

            if(mysqli_num_rows($result2) > 0){
                $result2 = $db->resultToArray($result2);
                $i = 0;
                foreach($result2 as $key => $value){
                    $texts =  $db->query("  SELECT  REPLACE(et.value, '\\\', '') as value
                                            FROM    Templates_Texts et
                                            WHERE   et.tp = {$value['hiringID']}");
                                        
                    if(mysqli_num_rows($texts) > 0){
                        $result2[$i]['texts'] = $db->resultToArray($texts);
                    }else{
                        $result2[$i]['texts'] = '';
                    }
                    $i++;
                }
                $result['suplidos'] = $result2;
            }

            return $result;
        }  

        /**
         * Obtenemos los productos de la plantilla que son supplidos
         *
         * @param array $data
         * @return array
         */
        public function getProductsSupplied($data){
            $db = new DbHandler;

            $data['client'] = cleanStr($data['client']);
            $data['template'] = cleanStr($data['template']);

            $result = $db->query(" SELECT       tp.check, tp.template, tp.product, tp.model, pm.supplier, tp.amount, tp.texts, tp.discount, tp.ID, tp.warehouse,
                                                cc.name as warehouseName,
                                                p.name AS prodName, p.texts AS withText, p.amount AS contable, p.supplied, p.type, p.blockBelow, p.orderType, p.editPrice,
                                                s.name AS suppName, 
                                                pm.name AS modelName, 
                                                tp.total as priceNoIVA, tp.total as valueEditPrice, it.percentage as percentageEdit,
                                                (tp.total - (tp.total * tp.discount / 100)) * tp.amount  AS priceNoIVATotal
			                        FROM        (Products p) 
                                    LEFT JOIN   Templates_Products tp ON p.productID = tp.product 
                                    LEFT JOIN   Products_Prices pp ON pp.model = tp.model 
                                    LEFT JOIN   IVA_Types it ON it.IVATypeID = p.IVA 
                                    LEFT JOIN   Products_Models pm ON tp.model = pm.productModelID 
                                    LEFT JOIN   Suppliers s ON pm.supplier = s.supplierID 
                                    LEFT JOIN   Cost_Center cc ON tp.warehouse = cc.ID
                                    LEFT JOIN   Mortuaries m ON cc.warehouse = m.mortuaryID
			                        WHERE       p.leavingDate IS NULL AND pm.leavingDate IS NULL AND 
                                                pp.price = " . $data['client'] . " AND 
                                                tp.template = " . $data['template'] . " AND
                                                p.supplied = 1 AND p.orderType = 0
                                    ORDER BY    p.blockBelow, p.orderBy, p.name");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

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
            $data['client'] = cleanStr($data['client']);

            $result =  $db->query("SELECT (pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) AS price, pp.priceNoIVA, p.supplied, p.name, p.editPrice, it.percentage
                                   FROM Products p, Products_Models pm,Products_Prices pp, IVA_Types it
                                   WHERE pm.productModelID = " . $data['model'] . " AND
                                         pp.model = pm.productModelID AND
                                         p.productID = pm.product AND p.IVA = it.IVATypeID AND
                                         pp.price =  {$data['client']}");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result)[0];
            }
        }

        /**
        * Obtenemos los datos de la plantilla
        *
        * @param array $data
        *
        * @return bool
        */
        public function getProductsByTemplateForHirings($data){
            $db = new DbHandler;

            $data['price'] = cleanStr($data['price']);
            $data['template'] = cleanStr($data['template']);
            
            $result = $db->query("  
                (
                    SELECT     tp.check, tp.template, tp.product, tp.model, pm.supplier, tp.amount, tp.texts, tp.discount, tp.ID, tp.warehouse,
                                cc.name as warehouseName,
                                p.name AS prodName, p.texts AS withText, p.amount AS contable, p.supplied, p.type, p.blockBelow, p.orderType, p.orderBy, p.editPrice,
                                s.name AS suppName, 
                                pm.name AS modelName, tp.total as valueEditPrice, it.percentage as percentageEdit, pm.leavingDate as pm_delete,
                                pp.priceNoIVA, 
                                (pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) AS priceIVA, 
                                ((pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) - ((pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) * tp.discount / 100) )* tp.amount  AS priceIVATotal
                    FROM        (Products p) 
                    LEFT JOIN   Templates_Products tp ON p.productID = tp.product 
                    LEFT JOIN   Products_Prices pp ON pp.model = tp.model 
                    LEFT JOIN   IVA_Types it ON it.IVATypeID = p.IVA 
                    LEFT JOIN   Products_Models pm ON tp.model = pm.productModelID
                    LEFT JOIN   Suppliers s ON pm.supplier = s.supplierID 
                    LEFT JOIN   Cost_Center cc ON tp.warehouse = cc.ID
                    LEFT JOIN   Mortuaries m ON cc.warehouse = m.mortuaryID
                    WHERE       p.leavingDate IS NULL AND pm.leavingDate IS NULL AND
                                pp.price = " . $data['price'] . " AND 
                                tp.template = " . $data['template'] . " AND
                                p.supplied = 0 AND 
                                p.orderType = 0 AND 
                                tp.check = 0 
                )
                UNION
                (
                    SELECT     tp.check, tp.template, tp.product, tp.model, pm.supplier, tp.amount, tp.texts, tp.discount, tp.ID, tp.warehouse,
                                cc.name as warehouseName,
                                p.name AS prodName, p.texts AS withText, p.amount AS contable, p.supplied, p.type, p.blockBelow, p.orderType, p.orderBy, p.editPrice,
                                s.name AS suppName, 
                                pm.name AS modelName, tp.total as valueEditPrice, it.percentage as percentageEdit, pm.leavingDate as pm_delete,
                                pp.priceNoIVA,
                                (pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) AS priceIVA, 
                                ((pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) - ((pp.priceNoIVA * it.percentage / 100 + pp.priceNoIVA) * tp.discount / 100) )* tp.amount  AS priceIVATotal
                    FROM        (Products p) 
                    LEFT JOIN   Templates_Products tp ON p.productID = tp.product 
                    LEFT JOIN   Products_Prices pp ON pp.model = tp.model 
                    LEFT JOIN   IVA_Types it ON it.IVATypeID = p.IVA 
                    LEFT JOIN   Products_Models pm ON tp.model = pm.productModelID
                    LEFT JOIN   Suppliers s ON pm.supplier = s.supplierID 
                    LEFT JOIN   Cost_Center cc ON tp.warehouse = cc.ID
                    LEFT JOIN   Mortuaries m ON cc.warehouse = m.mortuaryID
                    WHERE       p.leavingDate IS NULL AND 
                                pp.price = " . $data['price'] . " AND 
                                tp.template = " . $data['template'] . " AND
                                p.supplied = 0 AND 
                                p.orderType = 0 AND 
                                tp.check = 1
                )
                ORDER BY   blockBelow, orderBy, prodName, ID
            ");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }
        
        /**
        * Obtenemos los datos de la plantilla
        *
        * @param array $data
        *
        * @return bool
        */
        public function getProductsByTemplateSuppliedForHirings($data){
            $db = new DbHandler;

            $data['price'] = cleanStr($data['price']);
            $data['template'] = cleanStr($data['template']);
            
            $result = $db->query(" 
                (  
                    SELECT      tp.check, tp.template, tp.product, tp.model, pm.supplier, tp.amount, tp.texts, tp.discount, tp.ID, tp.warehouse,
                                cc.name as warehouseName,
                                p.name AS prodName, p.texts AS withText, p.amount AS contable, p.supplied, p.type, p.blockBelow, p.orderType, p.editPrice, p.orderBy,
                                s.name AS suppName, 
                                pm.name AS modelName, 
                                tp.total as priceNoIVA, tp.total as valueEditPrice, it.percentage as percentageEdit, pm.leavingDate as pm_delete,
                                (tp.total - (tp.total * tp.discount / 100)) * tp.amount  AS priceNoIVATotal
                    FROM        (Products p) 
                    LEFT JOIN   Templates_Products tp ON p.productID = tp.product 
                    LEFT JOIN   Products_Prices pp ON pp.model = tp.model 
                    LEFT JOIN   IVA_Types it ON it.IVATypeID = p.IVA 
                    LEFT JOIN   Products_Models pm ON tp.model = pm.productModelID 
                    LEFT JOIN   Suppliers s ON pm.supplier = s.supplierID 
                    LEFT JOIN   Cost_Center cc ON tp.warehouse = cc.ID
                    LEFT JOIN   Mortuaries m ON cc.warehouse = m.mortuaryID
                    WHERE       p.leavingDate IS NULL AND pm.leavingDate IS NULL AND 
                                pp.price = " . $data['price'] . " AND 
                                tp.template = " . $data['template'] . " AND
                                p.supplied = 1 AND 
                                p.orderType = 0 AND 
                                tp.check = 0
                )
                UNION
                (   
                    SELECT      tp.check, tp.template, tp.product, tp.model, tp.supplier, tp.amount, tp.texts, tp.discount, tp.ID, tp.warehouse,
                                cc.name as warehouseName,
                                p.name AS prodName, p.texts AS withText, p.amount AS contable, p.supplied, p.type, p.blockBelow, p.orderType, p.editPrice, p.orderBy,
                                s.name AS suppName, 
                                pm.name AS modelName, 
                                tp.total as priceNoIVA, tp.total as valueEditPrice, it.percentage as percentageEdit, pm.leavingDate as pm_delete,
                                (tp.total - (tp.total * tp.discount / 100)) * tp.amount  AS priceNoIVATotal
                    FROM        (Products p) 
                    LEFT JOIN   Templates_Products tp ON p.productID = tp.product 
                    LEFT JOIN   Products_Prices pp ON pp.model = tp.model 
                    LEFT JOIN   IVA_Types it ON it.IVATypeID = p.IVA 
                    LEFT JOIN   Suppliers s ON tp.supplier = s.supplierID 
                    LEFT JOIN   Products_Models pm ON tp.model = pm.productModelID 
                    LEFT JOIN   Cost_Center cc ON tp.warehouse = cc.ID
                    LEFT JOIN   Mortuaries m ON cc.warehouse = m.mortuaryID
                    WHERE       p.leavingDate IS NULL AND pm.leavingDate IS NULL AND 
                                pp.price = " . $data['price'] . " AND 
                                tp.template = " . $data['template'] . " AND
                                p.supplied = 1 AND 
                                p.orderType = 0 AND 
                                tp.check = 1 
                )
                ORDER BY        blockBelow, orderBy, prodName, ID
            ");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }
        
        /**
         * Obtiene los textos de un producto de la plantilla
         * 
         * @param array $data ID de la línea de producto de la plantilla
         * @return array
         */
        public function getTexts($data){
            $db = new DbHandler;

            $data['tp'] = cleanStr($data['tp']);

            $result = $db->query("  SELECT  value, discount
                                    FROM    Templates_Texts
                                    WHERE   tp = " . $data['tp']);

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
        * Obtiene las plantillas
        *
        * @return array
        */
        public function listTemplatesDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  t.templateID, t.name
                                    FROM    Templates t
                                    WHERE   t.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }
    }
?>