<?php
    // FIX PRICES
    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";

    session_start();
    session_destroy();

    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }

    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    // Get all companies
    $db = new DbHandler;
    $result = $db->query("  SELECT  c.id
                            FROM    Companies c
                            WHERE   c.leaving_date IS NULL AND
                                    c.id = 2
    ");
    $listCompanies = [];
    if(mysqli_num_rows($result) > 0){
        $listCompanies = $db->resultToArray($result);
    }

    foreach($listCompanies as $comp){
        $_SESSION['company'] = $comp['id'];

        $db = new DbHandler;

        // OBTIENE LAS TARIFAS DEL AÑO ACTUAL
        $result = $db->query("  SELECT  *
                                FROM    Prices p
                                WHERE   p.leavingDate IS NULL AND
                                        p.year = 2026
        ");

        if(mysqli_num_rows($result) > 0){
            $listPrices = $db->resultToArray($result);

            foreach($listPrices as $price){
                // PARA CADA TARIFA DEL AÑO ACTUAL BUSCA SU PAREJA EN EL AÑO ANTERIOR
                $result = $db->query("  SELECT  *
                                        FROM    Prices p
                                        WHERE   p.leavingDate IS NULL AND
                                                p.year = 2025 AND
                                                p.name = '{$price['name']}'
                ");

                if(mysqli_num_rows($result) == 0){
                    var_dump('PAREJA AÑO ANTERIOR NO ENCONTRADA - TARIFA ACTUAL: ' . $price['name']);
                    continue;
                }

                $pricePreviousYear = $db->resultToArray($result)[0]['priceID'];
                var_dump("TARIFA AÑO ANTERIOR: $pricePreviousYear, TARIFA AÑO ACTUAL: {$price['priceID']}");

                // OBTIENE LOS MODELOS QUE NO TIENEN TARIFA ASOCIADA PARA LA TARIFA DEL AÑO ACTUAL
                $result = $db->query("  SELECT  *
                                        FROM    Products_Models pm
                                        WHERE   pm.leavingDate IS NULL AND
                                                (
                                                    SELECT  COUNT(*)
                                                    FROM    Products_Prices pp
                                                    WHERE   pp.price = {$price['priceID']} AND
                                                            pp.model = pm.productModelID
                                                ) = 0
                ");

                if(mysqli_num_rows($result) > 0){
                    $listProductsModels = $db->resultToArray($result);

                    foreach($listProductsModels as $model){
                        // PARA CADA MODELO, BUSCAR EL PRECIO DE LA TARIFA DEL AÑO ANTERIOR PARA ASIGNÁRSELA AL AÑO ACTUAL
                        $result = $db->query("  SELECT  *
                                                FROM    Products_Prices pp
                                                WHERE   pp.price = $pricePreviousYear AND
                                                        pp.model = {$model['productModelID']}
                        ");

                        if(mysqli_num_rows($result) == 0){
                            var_dump("Precio no encontrado. Modelo: {$model['productModelID']}, Tarifa añor anterior: $pricePreviousYear");
                            continue;
                        }

                        $priceNoIva = $db->resultToArray($result)[0]['priceNoIVA'];
                        var_dump("Modelo: {$model['productModelID']}, Tarifa: $pricePreviousYear, Precio: $priceNoIva");

                        // ASOCIA EL PRECIO DEL AÑO ANTERIOR CON LA NUEVA TARIFA PARA EL MODELO
                        // $db->query("INSERT INTO Products_Prices(model, price, priceNoIVA)
                        //             VALUES ({$model['productModelID']}, {$price['priceID']}, $priceNoIva)");
                    }
                    var_dump(count($listProductsModels));

                    if(count($listProductsModels) > 0){
                        var_dump($listProductsModels);
                    }
                }
            }
        }
    }
?>