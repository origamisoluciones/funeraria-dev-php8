<?php
    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";
    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }
    
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "model/cars.php");
    require_once($_SESSION['basePath'] . "model/events.php");

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

    // Run for all companies
    foreach($listCompanies as $comp){
        $_SESSION['company'] = $comp['id'];
        
        if($comp['id'] == 1 || $comp['id'] == 2 || $comp['id'] == 3){
            $_SESSION['user'] = 100;
        }else{
            $_SESSION['user'] = 1;
        }

        checkUpkeeps();
    }

    function checkUpkeeps(){

        $db = new DbHandler;
        $start = strtotime(date("Y-m-d") . " 00:00:00");
        
        $vehicles = new Cars; 
        $toUpkeep = array();
        $categoriesArray = ['engineOil', 'oilFilter', 'airFilter', 'fuelFilter', 'otherFilters', 'coolingLiquid', 'brakesLiquid', 'timingBelt', 'otherBelts', 'frontBrakes', 'rearBrakes', 'boxATF', 'converterATF', 'differentialATF', 'sparkPlug', 'battery'];

        $result = $db->query("  SELECT      *
                                FROM        Cars c
                                WHERE       c.leavingDate IS NULL AND
                                            c.external = 0 AND
                                            c.ID = 166
                                ORDER BY    c.ID DESC");

        if(mysqli_num_rows($result) > 0){
            $carsList = $db->resultToArray($result);
            foreach($carsList as $upkeep){

                $carID =  $upkeep['ID'];
                $result = $db->query("  SELECT * 
                                        FROM `Upkeep_Intervals` 
                                        WHERE car =  $carID");

                $intervals = $db->resultToArray($result)[0];

                foreach($categoriesArray as $cat){

                    // Gets cars intervals (Dates and KMS)
                    $result = $db->query("  SELECT      u.date, u.kms
                                            FROM        Upkeeps u, Events e
                                            WHERE       u.car = $carID AND
                                                        e.upkeeps = u.ID AND
                                                        u.$cat = 1 AND 
                                                        u.kms IS NOT NULL AND
                                                        e.leavingDate IS NULL AND
                                                        u.leavingDate IS NULL
                                            GROUP BY    u.ID
                                            ORDER BY    u.date DESC
                                            LIMIT       1
                    ");
            
                    if(mysqli_num_rows($result) > 0){
            
                        $alreadyToGenerated = false;
                        $lastUpkeepInfo = $db->resultToArray($result)[0];

                        // Checks intervals times
                        $catTime = $cat . "Time";
                        if($intervals[$catTime] != null){
                            $lastUpkeepDate = $lastUpkeepInfo['date'];
                            $intervalDate = (int)$intervals[$catTime] * (30*24*60*60);
            
                            if(($start -  $lastUpkeepDate) >= $intervalDate && $vehicles->existsUpkeepPendingForCategory($carID, $cat)){
                                array_push($toUpkeep, [$carID, $cat]);

                                $alreadyToGenerated = true;
                            }
                        }

                        // Checks intervals kms
                        $catKm = $cat . "Km";
                        if($intervals[$catKm] != null && !$alreadyToGenerated){
                            $lastUpkeepKm = $lastUpkeepInfo['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $carID AND
                                                                ck.leavingDate IS NULL 
                                                    ORDER BY    ck.kms DESC
                                                    LIMIT       1
                            ");

                            if(mysqli_num_rows($result) > 0){
                                $carsKmsInfo = $db->resultToArray($result)[0]['kms'];

                                // var_dump("Intervalo: " . floatval($intervals[$catKm]));
                                // var_dump("Ultimo mantenimiento: " . $lastUpkeepKm);
                                // var_dump("Kms coche: " . $carsKmsInfo);

                                if((floatval($carsKmsInfo) -  floatval($lastUpkeepKm)) >= floatval($intervals[$catKm])){
                                    array_push($toUpkeep, [$carID, $cat]);

                                    $alreadyToGenerated = true;
                                }
                            }
                        }
                    }
                }
            }
        }

        $events = new Events;       
        $start = date('Y-m-d', time()) . ' 00:00:00';
        $end = date('Y-m-d', time()) . ' 23:59:59';

        $previousCar = 0;

        //Comprobamos que tipo de mantenimiento es para crear el evento asociado y lo vinculamos con el mantenimiento que acabamos de crear
        foreach($toUpkeep as $key=> $elem){
            
            $result = $db->query("  SELECT  c.licensePlate
                                    FROM    Cars c
                                    WHERE   c.ID = {$elem[0]}");

            $licensePlate = $db->resultToArray($result)[0]["licensePlate"];

            if($previousCar != $elem[0]){
                $upkeep = $vehicles->createUpkeep($elem[0]);
            }

            //case : engineOil
            if($elem[1] == 'engineOil'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de aceite matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }

            //case : oilFilter
            if($elem[1] == 'oilFilter'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de filtro de aceite matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }

            //case : airFilter
            if($elem[1] == 'airFilter'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de filtro de aire matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }

            //case : fuelFilter
            if($elem[1] == 'fuelFilter'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de filtro de combustible matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }

            //case : otherFilters
            if($elem[1] == 'otherFilters'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Alineado de dirección matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }

            //case : coolingLiquid
            if($elem[1] == 'coolingLiquid'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de líquido refrigerante matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }

            //case : brakesLiquid
            if($elem[1] == 'brakesLiquid'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de líquido de frenos matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }

            //case : timingBelt
            if($elem[1] == 'timingBelt'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de correa de distribución matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }

            //case : otherBelts
            if($elem[1] == 'otherBelts'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de otras correas matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }

            //case : frontBrakes
            if($elem[1] == 'frontBrakes'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de frenos delateros matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }

            //case : rearBrakes
            if($elem[1] == 'rearBrakes'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de frenos traseros matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }

            //case : boxATF
            if($elem[1] == 'boxATF'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de caja ATF matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }

            //case : converterATF
            if($elem[1] == 'converterATF'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de ruedas traseras matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }

            //case : differentialATF
            if($elem[1] == 'differentialATF'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de ruedas delanteras matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }

            //case : sparkPlug
            if($elem[1] == 'sparkPlug'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de bujías/calendatores matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }

            //case : battery
            if($elem[1] == 'battery'){
                if($upkeep != null){
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de batería matrícula " . $licensePlate, "start" => $start,
                                                            "end" => $end, "car" => $elem[0], "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                    $vehicles->updateUpkeep($upkeep, $elem[1])[1];
                }
            }
            $previousCar = $elem[0];
        }
    }
?>

