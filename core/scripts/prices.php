<?php
    // ESTE SCRIPT TIENE QUE EJECUTARSE CADA 1 DE ENERO A LAS 00:00
    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";

    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }

    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    // Get all companies
    $dbSettings = new DbHandler;
    $result = $dbSettings->query("  SELECT  c.id
                                    FROM    Companies c
                                    WHERE   c.leaving_date IS NULL
    ");
    $listCompanies = [];
    if(mysqli_num_rows($result) > 0){
        $listCompanies = $dbSettings->resultToArray($result);
    }

    /**  
     * Comprobamos si ya se han generado las tarifas para el año próximo (en ese caso, doTask() retorna false). De ser así, actualizamos las plantillas con las nuevas tarifas.
     * En caso de que no se hayan generado las tarifas para el año próximo, las creamos, duplicamos el precio por tarifa, el precio por compra y para finalizar actualizamos los 
     * clientes existentes con las nuevas tarifas.
    */
    foreach($listCompanies as $comp){
        $_SESSION['company'] = $comp['id'];
        
        $response = doTask();
        updateClients();
        if($response === false){
            updateTemplates();
        }
    }

    function doTask(){
        $db = new DbHandler;

        // Checks if the prices already generated for the new year
        $result = $db->query("  SELECT  s.value as pricesNextYear
                                FROM    Settings s
                                WHERE   s.settingsID = 37");

        if(mysqli_num_rows($result) != 0){
            $settings = $db->resultToArray($result);

            // Reset prices next year flag
            $result = $db->query("  UPDATE  Settings
                                    SET     value = 0
                                    WHERE   settingsID = 37");
                    
            if(isset($settings[0]) && isset($settings[0]['pricesNextYear']) && intval($settings[0]['pricesNextYear']) == 1){
                return false;
            }
        }

        // Generated new prices
        $oldYear = date('Y') - 1;
        $currentYear = date('Y');
        
        $result = $db->query("  SELECT  p.*
                                FROM    Prices p
                                WHERE   p.year = '$oldYear'
                                    AND p.leavingDate IS NULL");

        if(mysqli_num_rows($result) != 0){
            $result = $db->resultToArray($result);
            foreach($result as $elem){

                //CREAMOS LA NUEVA TARIFA 

                // Cálculo del extraID
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
        
                $result = $db->query("  SELECT * 
                                        FROM Prices 
                                        WHERE extraID = '" . $extraID . "'");
                
                while(mysqli_num_rows($result) > 0){
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
    
                    $result = $db->query("  SELECT * 
                                            FROM Prices 
                                            WHERE extraID = '" . $extraID . "'");
                }
    
                $db->query("INSERT INTO Prices(name, year, leavingDate, extraID) 
                            VALUES('{$elem['name']}', $currentYear, null, '$extraID')");
    
                //OBTENEMOS EL ID DE LA NUEVA TARIFA
                $result = $db->query("  SELECT  priceID
                                        FROM    Prices
                                        WHERE   extraID = '" . $extraID . "'");

                $newPrice = $db->resultToArray($result)[0]['priceID'];

                //ACTUALIZAMOS LAS PLANTILLAS QUE TENGAN DICHA TARIFA ASOCIADA
                $db->query("    UPDATE  Templates
                                SET     price = $newPrice
                                WHERE   price = {$elem['priceID']}
                                    AND leavingDate IS NULL");

                //VAMOS A DUPLICAR EL PRECIO POR TARIFA
                $result = $db->query("  SELECT  pp.*
                                        FROM    Products_Prices pp, Products_Models pm, Prices p
                                        WHERE   pp.price = {$elem['priceID']}
                                            AND pp.model = pm.productModelID
                                            AND pm.leavingDate IS NULL
                                            AND pp.price = p.priceID
                                            AND p.leavingDate IS NULL");
                
                if(mysqli_num_rows($result) != 0){
                    $result = $db->resultToArray($result);
                    foreach($result as $price){
                        $db->query("INSERT INTO Products_Prices(model, price, priceNoIVA)
                                    VALUES ({$price['model']}, $newPrice, {$price['priceNoIVA']})");
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
                                        AND pr.year = $oldYear");
            
            if(mysqli_num_rows($result) != 0){
                $result = $db->resultToArray($result);
                foreach($result as $purchases){
                    $db->query("INSERT INTO Products_Retails(model, purchasePrice, year)
                                VALUES ({$purchases['productModelID']}, {$purchases['purchasePrice']}, $currentYear)");
                }
            }
        }

        return true;
    }

    function updateClients(){
        $db = new DbHandler;
        $currentYear = date('Y');

        $result = $db->query("  SELECT  c.*
                                FROM    Clients c
                                WHERE   c.leavingDate IS NULL");

        $clients = $db->resultToArray($result);

        foreach($clients as $client){
            $price = $client['price'];
            $clientID = $client['clientID'];

            $result = $db->query("  SELECT  p.name
                                    FROM    Prices p
                                    WHERE   p.priceID = $price");

            $priceName = $db->resultToArray($result)[0]['name'];

            $result = $db->query("  SELECT  p.priceID
                                    FROM    Prices p
                                    WHERE   p.name = '$priceName' AND p.year = $currentYear");
            
            $newPriceID = $db->resultToArray($result)[0]['priceID'];

            $result = $db->query("  UPDATE  Clients
                                    SET     price = $newPriceID
                                    WHERE   clientID = $clientID");
        }
    }

    function updateTemplates(){
        
        $db = new DbHandler;
        
        $oldYear = date('Y') - 1;
        $currentYear = date('Y');
        
        $result = $db->query("  SELECT  p.*
                                FROM    Prices p
                                WHERE   p.year = '$oldYear'
                                    AND p.leavingDate IS NULL");

        $oldPrices = $db->resultToArray($result);

        foreach($oldPrices as $price){
            $oldPriceID = $price['priceID'];
            $oldPriceName = $price['name'];

            $result = $db->query("  SELECT  p.priceID
                                    FROM    Prices p
                                    WHERE   p.year = '$currentYear'
                                        AND p.name = '$oldPriceName'
                                        AND p.leavingDate IS NULL");
                        
            $newPriceID = $db->resultToArray($result)[0]['priceID'];

            $db->query("    UPDATE  Templates
                            SET     price = $newPriceID
                            WHERE   price = $oldPriceID
                                AND leavingDate IS NULL");

        }
    }
?>