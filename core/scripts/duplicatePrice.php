<?php
    return;
    
    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";

    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }

    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    // $_SESSION['company'] = 1;
    // duplicatePrice();
    // deleteProductsModels();

    function duplicatePrice(){

        // $priceID = 73; //PRICE ID TO DUPLICATE
        // $newPriceName = 'Avantia'; //NEW PRICE NAME
        // $year = date('Y');

        $db = new DbHandler;

        // Generated new prices
        $result = $db->query("  SELECT  p.*
                                FROM    Prices p
                                WHERE   p.priceID = $priceID");

        if(mysqli_num_rows($result) != 0){
            $result = $db->resultToArray($result);
            
            //CREAMOS LA NUEVA TARIFA 

            // Cálculo del extraID
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
    
            $result = $db->query("SELECT * 
                                FROM Prices 
                                WHERE extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("SELECT * 
                                    FROM Prices 
                                    WHERE extraID = '" . $extraID . "'");
            }

            $db->query("INSERT INTO Prices(name, year, leavingDate, extraID) 
                        VALUES('$newPriceName', $year, null, '$extraID')");

            //OBTENEMOS EL ID DE LA NUEVA TARIFA
            $result = $db->query("  SELECT  priceID
                                    FROM    Prices
                                    WHERE   extraID = '" . $extraID . "'");

            $newPrice = $db->resultToArray($result)[0]['priceID'];

            //VAMOS A DUPLICAR EL PRECIO POR TARIFA
            $result = $db->query("  SELECT  pp.*
                                    FROM    Products_Prices pp, Products_Models pm, Prices p
                                    WHERE   pp.price = $priceID
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

        return true;
    }

    function deleteProductsModels(){

        $db = new DbHandler;

        $year = date('Y');

        $result = $db->query("      SELECT  pm.extraID
                                    FROM    Products_Models pm, Products_Retails pr, Products p
                                    WHERE   pm.leavingDate IS NULL
                                        AND p.leavingDate IS NULL
                                        AND p.productID = pm.product 
                                        AND pm.productModelID = pr.model
                                        AND pr.year = $year
                                    ORDER BY extraID");

        if(mysqli_num_rows($result) != 0){
            $result = $db->resultToArray($result);

            foreach($result as $retails){

                $extraID = $retails['extraID'];

                $resultAux = $db->query("       SELECT   pr.ID
                                                FROM     Products_Models pm, Products_Retails pr, Products p
                                                WHERE    pm.leavingDate IS NULL
                                                    AND  p.leavingDate IS NULL
                                                    AND  p.productID = pm.product 
                                                    AND  pm.productModelID = pr.model
                                                    AND  pr.year = $year
                                                    AND  pm.extraID = '$extraID'
                                                ORDER BY pr.ID");

                if(mysqli_num_rows($resultAux) != 0){
                    $resultAux = $db->resultToArray($resultAux);
                    foreach($resultAux as $indexRetail => $retailsDelete){
                        if($indexRetail != 0){
                            $retailID = $retailsDelete['ID'];
                            $db->query("DELETE FROM Products_Retails
                                        WHERE  ID = $retailID");
                        }
                    }
                }
            }
        }

    }
?>