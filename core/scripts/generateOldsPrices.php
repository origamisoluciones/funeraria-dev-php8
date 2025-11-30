<?php
    return;

    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";

    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }

    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    // $_SESSION['company'] = 2;
    // removeDuplicateProductsPrices();

    function duplicateOldPrices(){
        $db = new DbHandler;

        // Generated new prices
        $yearReference = '2022';
        $yearToGenerate = '2017';
        
        $result = $db->query("  SELECT  p.*
                                FROM    Prices p
                                WHERE   p.year = '$yearReference'
                                    AND p.leavingDate IS NULL");

        if(mysqli_num_rows($result) != 0){
            $result = $db->resultToArray($result);
            foreach($result as $elem){

                //CREAMOS LA NUEVA TARIFA 

                // Cálculo del extraID
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
        
                $result = $db->query("  SELECT  * 
                                        FROM    Prices 
                                        WHERE   extraID = '" . $extraID . "'");
                
                while(mysqli_num_rows($result) > 0){
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
    
                    $result = $db->query("  SELECT  * 
                                            FROM    Prices 
                                            WHERE   extraID = '" . $extraID . "'");
                }
    
                $db->query("INSERT INTO Prices(name, year, leavingDate, extraID) 
                            VALUES('{$elem['name']}', $yearToGenerate, null, '$extraID')");
    
                //OBTENEMOS EL ID DE LA NUEVA TARIFA
                $result = $db->query("  SELECT  priceID
                                        FROM    Prices
                                        WHERE   extraID = '" . $extraID . "'");

                $newPrice = $db->resultToArray($result)[0]['priceID'];

                //ACTUALIZAMOS LAS PLANTILLAS QUE TENGAN DICHA TARIFA ASOCIADA
                // $db->query("    UPDATE  Templates
                //                 SET     price = $newPrice
                //                 WHERE   price = {$elem['priceID']}
                //                     AND leavingDate IS NULL");

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
                                        AND pr.year = $yearReference");
            
            if(mysqli_num_rows($result) != 0){
                $result = $db->resultToArray($result);
                foreach($result as $purchases){
                    $db->query("INSERT INTO Products_Retails(model, purchasePrice, year)
                                VALUES ({$purchases['productModelID']}, {$purchases['purchasePrice']}, $yearToGenerate)");
                }
            }
        }

        return true;
    }

    function removeDuplicateProductsPrices(){
        $db = new DbHandler;
       
        $result = $db->query("  SELECT      pm.productModelID
                                FROM        Products_Models pm
                                WHERE       pm.leavingDate IS NULL");

        if(mysqli_num_rows($result) != 0){
            $result = $db->resultToArray($result);
            foreach($result as $elem){
    
                // ELIMINAMOS DE PRODUCT RETAILS
                $result = $db->query("  SELECT      pr.ID
                                        FROM        Products_Retails pr
                                        WHERE       model = {$elem['productModelID']} AND
                                                    pr.year = '2023'
                                        ORDER BY    pr.ID");
                
                if(mysqli_num_rows($result) != 0){
                    $result = $db->resultToArray($result);

                    if(count($result) == 2){
                        $ID = $result[1]['ID'];
                        // $db->query("DELETE FROM Products_Retails WHERE ID = $ID");
                    }
                }

                // ELIMINAMOS DE PRODUCT PRICES
                // $db->query("DELETE FROM Products_Prices WHERE model = {$elem['productModelID']} AND price >= 143 AND price <= 154");
            }
        }

        return true;
    }
?>