<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Prices{

        /**
        * Añade una tarifa
        *
        * @param array $data
        */
        public function create($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['year'] = cleanStr($data['year']);

            // Validación de campos
            if($data['name'] == ''){
                return false;
            }

            /******* Create price for CURRENT year *********/

            // Calculate extraID
            $result = $db->query("  SELECT  MAX(priceID) as id
                                    FROM    Prices");
            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 7);
            $extraID .= ($maxID+1);

            $db->query("INSERT INTO Prices(name, year, leavingDate, extraID) 
                        VALUES('" . $data['name'] . "', " . $data['year'] . ", null, '" . $extraID . "')");

            $result = $db->query("  SELECT  priceID
                                    FROM    Prices
                                    WHERE   extraID = '" . $extraID . "'");

            $price = $db->resultToArray($result)[0]['priceID'];

            $result = $db->query("  SELECT  pm.productModelID as model
                                    FROM    Products_Models pm
                                    WHERE   pm.leavingDate IS NULL");
            
            if(mysqli_num_rows($result) > 0){
                $models = $db->resultToArray($result);

                foreach($models as $model){
                    $model['model'] = cleanStr($model['model']);
                    $db->query("INSERT INTO Products_Prices(model, price, priceNoIVA)
                                VALUES(" . $model['model'] . ", " . $price . ", 0)");
                }
            }

            /******* Create price for NEXT year *********/

            // Checks if prices next year are generated
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

            // Si están generadas las tarifas del año siguiente, creamos la nueva tarifa también para el año que viene
            if($flagNextPricesYear){

                $nextYear = intval($data['year']) + 1;

                // Calculate extraID
                $result = $db->query("  SELECT  MAX(priceID) as id
                                        FROM    Prices");
                $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 7);
                $extraID .= ($maxID+1);

                $db->query("INSERT INTO Prices(name, year, leavingDate, extraID) 
                            VALUES('" . $data['name'] . "', " . $nextYear . ", null, '" . $extraID . "')");

                $result = $db->query("  SELECT  priceID
                                        FROM    Prices
                                        WHERE   extraID = '" . $extraID . "'");

                $price = $db->resultToArray($result)[0]['priceID'];

                $result = $db->query("  SELECT  pm.productModelID as model
                                        FROM    Products_Models pm
                                        WHERE   pm.leavingDate IS NULL");
                
                if(mysqli_num_rows($result) > 0){
                    $models = $db->resultToArray($result);

                    foreach($models as $model){
                        $model['model'] = cleanStr($model['model']);
                        $db->query("INSERT INTO Products_Prices(model, price, priceNoIVA)
                                    VALUES(" . $model['model'] . ", " . $price . ", 0)");
                    }
                }

            }

            return true;
        }

        /**
        * Obtiene los datos de una tarifa
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['priceID'] = cleanStr($data['priceID']);

            $result = $db->query("SELECT p.priceID, p.name, p.year
                                  FROM   Prices p
                                  WHERE  priceID = " . $data['priceID'] . "");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result)[0];
			}
        }

        /**
        * Modifica los datos de una tarifa
        *
        * @param array $data
        */
        public function update($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['priceID'] = cleanStr($data['priceID']);

            if($data['name'] == ''){
                return false;
            }

            // Checks if prices next year are generated
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

            // Si están generados, buscamos la tarifa del año que viene para actualizarla
            if($flagNextPricesYear){
                $result = $db->query("  SELECT  name, year
                                        FROM    Prices 
                                        WHERE   priceID = " . $data['priceID'] . "");

                if(mysqli_num_rows($result) > 0){
                    $resultAux = $db->resultToArray($result)[0];
                    $priceName = $resultAux['name'];
                    $priceYear = $resultAux['year'];

                    // Actualizamos la tarifa tanto del año actual como la del año siguiente
                    return $db->query(" UPDATE  Prices p
                                        SET     p.name = '" . $data['name'] . "' 
                                        WHERE   p.leavingDate IS NULL AND p.name = '" . $priceName . "' AND p.year >= " . $priceYear . "");
                }
            }else{
                // Actualizamos la tarifa del año actual
                return $db->query(" UPDATE Prices p
                                    SET   p.name = '" . $data['name'] . "' 
                                    WHERE p.priceID = " .$data['priceID']. "");
            }
        }

        /**
        * Elimina una tarifa
        *
        * @param array $data
        */
        public function delete($data){
            $db = new DbHandler;

            $data['priceID'] = cleanStr($data['priceID']);

            // Checks if prices next year are generated
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

            // Si están generados, buscamos la tarifa del año que viene para eliminarla
            if($flagNextPricesYear){
                $result = $db->query("  SELECT  name, year
                                        FROM    Prices 
                                        WHERE   priceID = " . $data['priceID'] . "");

                if(mysqli_num_rows($result) > 0){
                    $resultAux = $db->resultToArray($result)[0];
                    $priceName = $resultAux['name'];
                    $priceYear = $resultAux['year'];

                    // Eliminamos la tarifa tanto del año actual como la del año siguiente
                    return $db->query(" UPDATE  Prices
                                        SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                                        WHERE   leavingDate IS NULL AND name = '" . $priceName . "' AND year >= " . $priceYear . "");

                }
            }else{
                // Eliminamos la tarifa del año actual
                return $db->query(" UPDATE  Prices
                                    SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                                    WHERE   priceID = " . $data['priceID'] . "");
            }
        }

        /**
        * Obtiene los datos de las tarifas
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("  SELECT   *
                                    FROM     Prices 
                                    WHERE    year = " . date('Y') . " AND 
                                             leavingDate IS NULL
                                    ORDER BY name");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de las tarifas
        *
        * @return array
        */
        public function getParticularPrice(){
            $db = new DbHandler;

            $result = $db->query("SELECT priceID FROM `Prices` WHERE name = 'Particulares' AND year = " . date('Y'));
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result)[0]['priceID'];
			}
        }

        /**
        * Obtiene los datos de las tarifas de empresas
        *
        * @return array
        */
        public function getPricesCompanies($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("SELECT    *
                                  FROM      Prices 
                                  WHERE     year = " . date('Y') . " AND 
                                            leavingDate IS NULL AND 
                                            name LIKE '%" . $data . "%'
                                ORDER BY    name");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los datos de las tarifas
        *
        * @return array
        */
        public function listByYear($year){
            $db = new DbHandler;

            $year = cleanStr($year);

            $result = $db->query("SELECT priceID
                                  FROM   Prices 
                                  WHERE  year = " . $year . " AND 
                                         leavingDate IS NULL");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene las tarifas por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("SELECT    priceID, name
                                  FROM      Prices 
                                  WHERE     name LIKE '%". $name ."%' AND year = " . date('Y') . "
                                  ORDER BY  name");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene las tarifas por ID
        *
        * @param string $data
        *
        * @return array
        */
        public function searchByID($data){
            $db = new DbHandler;

            $data = cleanStr($data);
            
            $result = $db->query("SELECT priceID, name
                                  FROM   Prices 
                                  WHERE  priceID = ". $data ."");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Update las nuevas tarifas
         * 
         * @param int $price Tarifa
         * @param int $year Año
         * @param float $percent Porcentaje
         */
        public function updatePrices($percent, $price, $year){
            $db = new DbHandler;

            $percent = cleanStr($percent);
            $price = cleanStr($price);
            // $currentYear = date('Y');
            $currentYear = $year;

            $result = $db->query("  SELECT  p.*
                                    FROM    Prices p
                                    WHERE   p.year = '$currentYear'
                                        AND p.leavingDate IS NULL
                                        AND p.priceID = $price");
                                    
            if(mysqli_num_rows($result) != 0){
                $result = $db->resultToArray($result);
                foreach($result as $elem){
    
                    //OBTENEMOS TODOS LOS PRECIOS DE PRODUCTO PARA EL AÑO ACTUAL
                    $result = $db->query("  SELECT  pp.*
                                            FROM    Products_Prices pp, Products_Models pm, Prices p
                                            WHERE   pp.price = {$elem['priceID']}
                                                AND pp.model = pm.productModelID
                                                AND pm.leavingDate IS NULL
                                                AND pp.price = p.priceID
                                                AND p.leavingDate IS NULL");
                    
                    //MODIFICAMOS EL PRECIO SIN IVA DE TODOS LOS PRODUCTOS ASOCIADOS A LA TARIFA
                    if(mysqli_num_rows($result) != 0){
                        $result = $db->resultToArray($result);
                        foreach($result as $price){
                            $priceNoIVA = round($price['priceNoIVA'] * $percent / 100 + $price['priceNoIVA'], 2);

                            $db->query("UPDATE  Products_Prices pp
                                        SET     pp.priceNoIVA = $priceNoIVA
                                        WHERE   pp.model = {$price['model']} AND
                                                pp.price = {$elem['priceID']}");
                        }
                    }
    
                }
            }
            return true;
        }

        /**
         * Comprueba si ya existe una tarifa con el nombre dado
         * 
         * @param string $name Nombre
         * @return bool
         */
        public function checkPrice($name){
            $db = new DbHandler;

            $name = cleanStr($name);

            $result = $db->query("  SELECT  p.priceID
                                    FROM    Prices p
                                    WHERE   p.name = '$name' AND
                                            p.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? true : false;
        }

        /**
         * Comprueba si ya existe una tarifa con el nombre dado
         * 
         * @param int $price Tarifa
         * @param string $name Nombre
         * @return bool
         */
        public function checkPriceEdit($price, $name, $year){
            $db = new DbHandler;

            $price = cleanStr($price);
            $name = cleanStr($name);
            $year = cleanStr($year);

            $result = $db->query("  SELECT  p.priceID
                                    FROM    Prices p
                                    WHERE   p.name = '$name' AND
                                            p.priceID != $price AND
                                            p.year = $year AND
                                            p.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? true : false;
        }

        /**
         * Obtiene los modelos
         * 
         * @param int $price Id de la tarifa
         * @return array
         */
        public function getModels($price){
            $db = new DbHandler;

            $price = cleanStr($price);

            $result = $db->query("  SELECT      p.productID, p.name as productName, pm.productModelID, pm.name as modelName, pp.priceNoIVA
                                    FROM        Products_Prices pp, Products_Models pm, Products p
                                    WHERE       pp.model = pm.productModelID AND
                                                pp.price = $price AND
                                                pm.leavingDate IS NULL AND
                                                pm.product = p.productID AND
                                                p.leavingDate IS NULL
                                    ORDER BY    p.name, p.productID");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Comprueba si existe una plantilla
         * 
         * @param int $price Id de la tarifa
         * @return array
         */
        public function existsTemplate($price){
            $db = new DbHandler;

            $price = cleanStr($price);

            $result = $db->query("  SELECT  p.priceID
                                    FROM    Prices p
                                    WHERE   p.priceID = $price AND
                                            p.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? false : true;
        }

        /**
         * Guarda la plantilla
         * 
         * @param array $data Información a guardar
         * @return bool
         */
        public function saveTemplate($data, $notes){
            $db = new DbHandler;

            if(is_array($data)){
                $db->query("DELETE FROM Prices_Templates
                            WHERE price = " . $data[0][1]);

                foreach($data as $elem){
                    $elem[0] = cleanStr($elem[0]);
                    $elem[1] = cleanStr($elem[1]);

                    $model = $elem[0];
                    $price = $elem[1];

                    $db->query("INSERT INTO Prices_Templates(price, model)
                                VALUES ($price, $model)");
                }

                $db->query("DELETE FROM Prices_Templates_Notes
                            WHERE price = {$data[0][1]}");

                $db->query("INSERT INTO Prices_Templates_Notes(price, notes)
                            VALUES ({$data[0][1]}, '$notes')");
            }else{
                $data = cleanStr($data);

                $db->query("DELETE FROM Prices_Templates
                            WHERE price = $data");

                $db->query("DELETE FROM Prices_Templates_Notes
                            WHERE price = $data");

                $db->query("INSERT INTO Prices_Templates_Notes(price, notes)
                            VALUES ($data, '$notes')");
            }
            return true;
        }

        /**
         * Obtiene los modelos seleccionados
         * 
         * @param int $price Id de la tarifa
         * @return array
         */
        function getModelsChecked($price){
            $db = new DbHandler;

            $price = cleanStr($price);

            $result = $db->query("  SELECT  pt.model
                                    FROM    Prices_Templates pt
                                    WHERE   pt.price = $price");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Exporta la plantilla a csv
         * 
         * @param int $price Tarifa
         * @return bool
         */
        function exportCsv($price){
            $db = new DbHandler;

            $price = cleanStr($price);

            $result = $db->query("  SELECT      p.name as productName, pm.name as modelName, pp.priceNoIVA
                                    FROM        Products_Prices pp, Products_Models pm, Products p, Prices_Templates pt
                                    WHERE       pp.model = pm.productModelID AND
                                                pp.price = $price AND
                                                pm.leavingDate IS NULL AND
                                                pm.product = p.productID AND
                                                p.leavingDate IS NULL AND
                                                pt.model = pp.model AND
                                                pt.price = pp.price
                                    ORDER BY    p.name, p.productID");

            $delimiter = ";";
            if(mysqli_num_rows($result) == 0){
                $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/pricesTemplates/plantilla.csv', 'w');
                fputcsv($f, ['Modelo', 'Precio'], $delimiter);
                fclose($f);
            }else{
                $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/configuration/pricesTemplates/plantilla.csv', 'w');
                // fputcsv($f, ['Modelo', 'Precio'], $delimiter);
                $models = $db->resultToArray($result);
                $lastProduct = null;
                foreach($models as $model){
                    $product = $model['productName'];
                    if($lastProduct != null){
                        if($lastProduct == $product){
                            fputcsv($f, [$model['modelName'], $model['priceNoIVA']], $delimiter);
                        }else{
                        
                            $lastProduct = $product;
                            fputcsv($f, [$product], $delimiter);
                            fputcsv($f, ['Modelo', 'Precio'], $delimiter);
                            fputcsv($f, [$model['modelName'], $model['priceNoIVA']], $delimiter);
                        }
                    }else{
                        $lastProduct = $product;
                        fputcsv($f, [$product], $delimiter);
                        fputcsv($f, ['Modelo', 'Precio'], $delimiter);
                        fputcsv($f, [$model['modelName'], $model['priceNoIVA']], $delimiter);
                    }
                }
                fclose($f);
            }

            return 'resources/files/' . $_SESSION['company'] . '/configuration/pricesTemplates/plantilla.csv';
        }

        /**
         * Obtiene los datos de una plantilla
         * 
         * @param int $price Tarifa
         * @return array
         */
        function getPlantillaTarifa($price){
            $db = new DbHandler;

            $price = cleanStr($price);

            $result = $db->query("  SELECT      p.name as productName, pm.name as modelName, pp.priceNoIVA, pr.name as priceName, pr.year as priceYear
                                    FROM        Products_Prices pp, Products_Models pm, Products p, Prices_Templates pt, Prices pr
                                    WHERE       pp.model = pm.productModelID AND
                                                pp.price = $price AND
                                                pm.leavingDate IS NULL AND
                                                pm.product = p.productID AND
                                                p.leavingDate IS NULL AND
                                                pt.model = pp.model AND
                                                pp.price = pr.priceID AND 
                                                pt.price = pp.price
                                    ORDER BY    p.name, p.productID");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
        * Obtiene las tarifas
        *
        * @return array
        */
        public function listPricesDatatables(){
            $db = new DbHandler;

            if(isset($_GET['year']) && $_GET['year'] != null){
                $where = " p.leavingDate IS NULL AND year = " . $_GET['year'];
            }else{
                $where = " p.leavingDate IS NULL AND year = " . date('Y');
            }

            $result = $db->query("  SELECT  p.priceID, 
                                            p.name, 
                                            p.year,
                                            (
                                                SELECT  COUNT(*)
                                                FROM    Clients cl
                                                WHERE   cl.leavingDate IS NULL AND
                                                        cl.price = p.priceID
                                            ) as total_clients
                                    FROM    Prices p
                                    WHERE  $where ");
            
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

         /**
         * Obtiene los tipos de cliente por nombre
         *
         * @param string $name
         *
         * @return array
         */
        public function searchByNameImport($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            $year =date('Y');

            $result = $db->query("  SELECT  priceID
                                    FROM    Prices 
                                    WHERE   name LIKE '%$name%' AND year = " . date('Y') ." AND leavingDate IS NULL");
            
            $result = $db->resultToArray($result);

            if(count($result) == 0){
                return null;
            }else{
                return $result[0]['priceID'];
            }
        }

        /**
        * Obtiene las notas de una plantilla de tarifa
        *
        * @param array $data
        *
        * @return array
        */
        public function getNotes($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("SELECT ptn.notes
                                  FROM   Prices_Templates_Notes ptn
                                  WHERE  ptn.price = " . $data);
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result)[0]['notes'];
			}
        }

        /**
        * Genera las tarifas para el año próximo con un incremento sobre las actuales
        *
        * @param array $data
        *
        * @return array
        */
        public function generateNextPrices($data){
            $db = new DbHandler;

            $currentYear = intval(date('Y'));
            $nextYear = intval(date('Y')) + 1;

            foreach($data as $index=>$value){
                // Clean data
                $data[$index]['priceID'] = cleanStr($value['priceID']);
                $data[$index]['pricename'] = cleanStr($value['pricename']);
                $data[$index]['increment'] = cleanStr($value['increment']);
            
                //CREAMOS LAS NUEVAS TARIFAS
                $result = $db->query("  SELECT  MAX(priceID) as id
                                        FROM    Prices");
                                        
                $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 7);
                $extraID .= ($maxID+1);
    
                $db->query("INSERT INTO Prices(name, year, leavingDate, extraID) 
                            VALUES('{$value['pricename']}', $nextYear, null, '$extraID')");
    
                //OBTENEMOS EL ID DE LA NUEVA TARIFA
                $result = $db->query("  SELECT  priceID
                                        FROM    Prices
                                        WHERE   extraID = '" . $extraID . "'");

                $newPrice = $db->resultToArray($result)[0]['priceID'];

                //VAMOS A DUPLICAR EL PRECIO POR TARIFA
                $result = $db->query("  SELECT  pp.*
                                        FROM    Products_Prices pp, Products_Models pm, Prices p
                                        WHERE   pp.price = {$value['priceID']}
                                            AND pp.model = pm.productModelID
                                            AND pm.leavingDate IS NULL
                                            AND pp.price = p.priceID
                                            AND p.leavingDate IS NULL");
                
                if(mysqli_num_rows($result) != 0){
                    $result = $db->resultToArray($result);
                    foreach($result as $price){

                        // Apply increment percentage
                        $priceNoIVA = round($price['priceNoIVA'] * floatval($value['increment']) / 100 + $price['priceNoIVA'], 2);

                        $db->query("INSERT INTO Products_Prices(model, price, priceNoIVA)
                                    VALUES ({$price['model']}, $newPrice, $priceNoIVA)");
                    }
                }
            }

            //VAMOS A DUPLICAR EL PRECIO DE COMPRA
            $result = $db->query("  SELECT  pm.*, pr.purchasePrice
                                    FROM    Products_Models pm, Products_Retails pr, Products p
                                    WHERE   pm.leavingDate IS NULL
                                        AND p.leavingDate IS NULL
                                        AND p.productID = pm.product 
                                        AND pm.productModelID = pr.model
                                        AND pr.year = $currentYear");
            
            if(mysqli_num_rows($result) != 0){
                $result = $db->resultToArray($result);
                foreach($result as $purchases){
                    $db->query("INSERT INTO Products_Retails(model, purchasePrice, year)
                                VALUES ({$purchases['productModelID']}, {$purchases['purchasePrice']}, $nextYear)");
                }
            }

            // Change next prices flag
            $result = $db->query("  UPDATE  Settings
                                    SET     value = 1
                                    WHERE   name = 'pricesNextYear'");

            return true;
        }

        /**
         * Obtiene los modelos
         * 
         * @param int $price Id de la tarifa
         * @return array
         */
        public function getModelsPrices($price){
            $db = new DbHandler;

            $price = cleanStr($price);

            $result = $db->query("  
                SELECT      p.productID, 
                            pm.productModelID, 
                            p.name as productName,
                            pm.name as modelName,
                            pp.priceNoIVA as current_price,
                            (
                                SELECT  COALESCE(pp.priceNoIVA, 0)
                                FROM    Products_Prices pp, Prices pr2 
                                WHERE   pr2.year = (pr.year - 1) AND
                                        pr2.priceID = pp.price AND 
                                        pp.model = pm.productModelID AND
                                        pr2.leavingDate IS NULL
                                LIMIT   1
                            ) as last_price
                FROM        Products_Prices pp, Products_Models pm, Products p, Prices pr
                WHERE       pp.model = pm.productModelID AND
                            pp.price = pr.priceID AND
                            pr.priceID = $price AND
                            pm.leavingDate IS NULL AND
                            pm.product = p.productID AND
                            p.leavingDate IS NULL
                ORDER BY    p.name, pm.name
            ");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Actualiza los precios de los modelos de productos para una tarifa
         * 
         * @param array $data Información a guardar
         * @return bool
         */
        public function saveTemplatePrices($data, $price){
            $db = new DbHandler;

            $price = cleanStr($price);

            foreach($data as $item){

                $model = cleanStr($item[0]);
                $priceNoIVA = cleanStr($item[1]);

                $db->query("    UPDATE  Products_Prices
                                SET     priceNoIVA = $priceNoIVA
                                WHERE   model = $model AND
                                        price = $price
                ");

            }

            return true;
        }
    }
?>