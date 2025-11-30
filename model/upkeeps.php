<?php
	require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

	class Upkeeps{
        /**
         * Añade un nuevo mantenimiento
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['car'] = cleanStr($data['car']);
            $data['date'] = cleanStr($data['date']);
            $data['kms'] = cleanStr($data['kms']);
            $data['cost'] = cleanStr($data['cost']);
            $data['engineOil'] = cleanStr($data['engineOil']);
            $data['oilFilter'] = cleanStr($data['oilFilter']);
            $data['airFilter'] = cleanStr($data['airFilter']);
            $data['fuelFilter'] = cleanStr($data['fuelFilter']);
            $data['otherFilters'] = cleanStr($data['otherFilters']);
            $data['coolingLiquid'] = cleanStr($data['coolingLiquid']);
            $data['brakesLiquid'] = cleanStr($data['brakesLiquid']);
            $data['timingBelt'] = cleanStr($data['timingBelt']);
            $data['otherBelts'] = cleanStr($data['otherBelts']);
            $data['frontBrakes'] = cleanStr($data['frontBrakes']);
            $data['rearBrakes'] = cleanStr($data['rearBrakes']);
            $data['boxATF'] = cleanStr($data['boxATF']);
            $data['converterATF'] = cleanStr($data['converterATF']);
            $data['differentialATF'] = cleanStr($data['differentialATF']);
            $data['sparkPlug'] = cleanStr($data['sparkPlug']);
            $data['battery'] = cleanStr($data['battery']);
            $data['airConditioner'] = cleanStr($data['airConditioner']);
            $data['notes'] = cleanEditor($data['notes']);
            $data['garage'] = cleanStr($data['garage']);
            
            if(isset($data['oldUpkeeps']) && count($data['oldUpkeeps']) > 0){
                foreach($data['oldUpkeeps'] as $oldUpkeep){
                    $id = cleanStr($oldUpkeep);

                    $db->query("UPDATE    Upkeeps
                                SET       kms = ".$data['kms']."       
                                WHERE     ID = $id ");
                    
                    $result = $db->query("SELECT    ID
                                          FROM      Events 
                                          WHERE     upkeeps = $id ");

                    if(mysqli_num_rows($result) != 0){
                        $eventID = $db->resultToArray($result)[0]['ID'];

                        $db->query("UPDATE    Events
                                    SET       leavingDate = '" . date('Y-m-d H:i:s') . "'        
                                    WHERE     ID = $eventID ");
                    }
                }
            }

            // Cálculo del extraID
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("SELECT * 
                                  FROM   Upkeeps 
                                  WHERE  extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("SELECT * 
                                      FROM   Upkeeps 
                                      WHERE  extraID = '" . $extraID . "'");
            }
            
            $result = $db->query("  INSERT INTO Upkeeps(car, date, kms, cost, engineOil, oilFilter, airFilter, fuelFilter, 
                                                        otherFilters, coolingLiquid, brakesLiquid, timingBelt, otherBelts,
                                                        frontBrakes, rearBrakes, boxATF, converterATF, differentialATF,
                                                        sparkPlug, oiling, battery, airConditioner, notes, garage, extraID)
                                    VALUES(" . $data['car'] . ", " . $data['date'] . ", " . $data['kms'] . ", " . $data['cost'] . ", " . $data['engineOil'] . ", " . $data['oilFilter'] . ", 
                                            " . $data['airFilter'] . ", " . $data['fuelFilter'] . ", " . $data['otherFilters'] . ", 
                                            " . $data['coolingLiquid'] . ", " . $data['brakesLiquid'] . ", " . $data['timingBelt'] . ", 
                                            " . $data['otherBelts'] . ", " . $data['frontBrakes'] . ", " . $data['rearBrakes'] . ", 
                                            " . $data['boxATF'] . ", " . $data['converterATF'] . ", " . $data['differentialATF'] . ", 
                                            " . $data['sparkPlug'] . ", " . $data['oiling'] . ", " . $data['battery'] . ", 
                                            " . $data['airConditioner'] . ", '" . $data['notes'] . "', " . $data['garage'] . ", '$extraID')");

            if($result){

                $upkeep = $db->query("  SELECT  c.licensePlate, u.date, u.ID
                                        FROM    Upkeeps u, Cars c
                                        WHERE   u.car = c.ID AND
                                                u.extraID = '$extraID'");

                $upkeep = $db->resultToArray($upkeep)[0];
                $name = $upkeep['licensePlate'];
                $start = date("Y-m-d", $upkeep['date']) . " 00:00:00";
                $end = date("Y-m-d", $upkeep['date']) . " 23:59:59";

                require_once($_SESSION['basePath'] . "model/events.php");
                $events = new Events;
             
                if($data['engineOil'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de aceite matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }

                if($data['oilFilter'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de filtro de aceite matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }

                if($data['airFilter'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de filtro de aire matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }

                if($data['fuelFilter'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de filtro de combustible matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }


                if($data['otherFilters'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Alineado de dirección matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }


                if($data['coolingLiquid'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de líquido refrigerante matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }

                if($data['brakesLiquid'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de líquido de frenos matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }

                if($data['timingBelt'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de correa de distribución matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }

                if($data['otherBelts'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de otras correas matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }

                if($data['frontBrakes'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de frenos delateros matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'],"reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }

                if($data['rearBrakes'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de frenos traseros matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'],"reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }


                if($data['boxATF'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de filtro de cabina " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }

                if($data['converterATF'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de ruedas traseras matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }

                if($data['differentialATF'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de ruedas delanteras matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }


                if($data['sparkPlug'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de bujías/calendatores matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }

                if($data['oiling'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de engrase matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'],"reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }


                if($data['battery'] == '1'){
                    $carID = $data['car'];
                    $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de batería matrícula " . $name, "start" => $start,
                                                        "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'],"reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                }

                return true;
            }
        }

        /**
         * Obtiene los datos de un mantenimiento
         * 
         * @param array $data
         * 
         * @return array
         */
        public function read($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT      u.*, g.ID as garage, g.name as garageName
                                    FROM        Upkeeps u
                                    LEFT JOIN   Garages g ON u.garage = g.ID
                                    WHERE       u.ID = " . $data['ID']);

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Obtiene los datos de un mantenimiento
         * 
         * @param array $data
         * 
         * @return array
         */
        public function readByDate($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  date, car
                                    FROM    Upkeeps
                                    WHERE   ID = " . $data['ID'] . "");

            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                $data =  $db->resultToArray($result)[0];
                $date = $data['date'];
                $car = $data['car'];
                $result = $db->query("  SELECT  *
                                        FROM    Upkeeps
                                        WHERE   date = " . $date . " AND car = $car AND leavingDate IS NULL");

                return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
            }
        }

        /**
         * Modifica los datos de un mantenimiento
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['garage'] = cleanStr($data['garage']);
            $data['date'] = cleanStr($data['date']);
            $data['kms'] = cleanStr($data['kms']);
            $data['cost'] = cleanStr($data['cost']);
            $data['engineOil'] = cleanStr($data['engineOil']);
            $data['oilFilter'] = cleanStr($data['oilFilter']);
            $data['airFilter'] = cleanStr($data['airFilter']);
            $data['fuelFilter'] = cleanStr($data['fuelFilter']);
            $data['otherFilters'] = cleanStr($data['otherFilters']);
            $data['coolingLiquid'] = cleanStr($data['coolingLiquid']);
            $data['brakesLiquid'] = cleanStr($data['brakesLiquid']);
            $data['timingBelt'] = cleanStr($data['timingBelt']);
            $data['otherBelts'] = cleanStr($data['otherBelts']);
            $data['frontBrakes'] = cleanStr($data['frontBrakes']);
            $data['rearBrakes'] = cleanStr($data['rearBrakes']);
            $data['boxATF'] = cleanStr($data['boxATF']);
            $data['converterATF'] = cleanStr($data['converterATF']);
            $data['differentialATF'] = cleanStr($data['differentialATF']);
            $data['sparkPlug'] = cleanStr($data['sparkPlug']);
            $data['oiling'] = cleanStr($data['oiling']);
            $data['battery'] = cleanStr($data['battery']);
            $data['airConditioner'] = cleanStr($data['airConditioner']);
            $data['notes'] = cleanEditor($data['notes']);
            $data['ID'] = cleanStr($data['ID']);

            $db->query("UPDATE  Upkeeps
                        SET     garage = " . $data['garage'] . ",
                                date = " . $data['date'] . ", 
                                kms = " . $data['kms'] . ",
                                cost = " . $data['cost'] . ",
                                engineOil = " . $data['engineOil'] . ",
                                oilFilter = " . $data['oilFilter'] . ",
                                airFilter = " . $data['airFilter'] . ",
                                fuelFilter = " . $data['fuelFilter'] . ",
                                otherFilters = " . $data['otherFilters'] . ",
                                coolingLiquid = " . $data['coolingLiquid'] . ",
                                brakesLiquid = " . $data['brakesLiquid'] . ",
                                timingBelt = " . $data['timingBelt'] . ",
                                otherBelts = " . $data['otherBelts'] . ",
                                frontBrakes = " . $data['frontBrakes'] . ",
                                rearBrakes = " . $data['rearBrakes'] . ",
                                boxATF = " . $data['boxATF'] . ",
                                converterATF = " . $data['converterATF'] . ",
                                differentialATF = " . $data['differentialATF'] . ",
                                sparkPlug = " . $data['sparkPlug'] . ",
                                oiling = " . $data['oiling'] . ",
                                battery = " . $data['battery'] . ",
                                airConditioner = " . $data['airConditioner'] . ",
                                notes = '" . $data['notes'] . "'
                        WHERE   ID = " . $data['ID']);

            //Eliminamos los eventos anteriores
            $db->query("UPDATE  Events e
                        SET     e.leavingDate = '" . date('Y-m-d H:i:s') . "'
                        WHERE   e.upkeeps = " . $data['ID']);

            $upkeep = $db->query("  SELECT  c.licensePlate, u.date, u.ID, c.ID as carID
                                    FROM    Upkeeps u, Cars c
                                    WHERE   u.car = c.ID AND
                                            u.ID = " . $data['ID']);

            $upkeep = $db->resultToArray($upkeep)[0];
            $name = $upkeep['licensePlate'];
            $start = date("Y-m-d", $upkeep['date']) . " 00:00:00";
            $end = date("Y-m-d", $upkeep['date']) . " 23:59:59";

            require_once($_SESSION['basePath'] . "model/events.php");
            $events = new Events;

            if($data['engineOil'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de aceite matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }

            if($data['oilFilter'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de filtro de aceite matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }

            if($data['airFilter'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de filtro de aire matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }

            if($data['fuelFilter'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de filtro de combustible matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }


            if($data['otherFilters'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Alineado de dirección matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }


            if($data['coolingLiquid'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de líquido refrigerante matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }

            if($data['brakesLiquid'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de líquido de frenos matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }

            if($data['timingBelt'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de correa de distribución matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }

            if($data['otherBelts'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de otras correas matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }

            if($data['frontBrakes'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de frenos delateros matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'],"reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }

            if($data['rearBrakes'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de frenos traseros matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'],"reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }


            if($data['boxATF'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de filtro de cabina " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }

            if($data['converterATF'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de ruedas traseras matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }

            if($data['differentialATF'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de ruedas delanteras matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }


            if($data['sparkPlug'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de bujías/calendatores matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'], "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }

            if($data['oiling'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de engrase matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'],"reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }


            if($data['battery'] == '1'){
                $carID = $upkeep['carID'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Cambio de batería matrícula " . $name, "start" => $start,
                                "end" => $end, "car" => $carID, "upkeeps" => $upkeep['ID'],"reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
            }

            return true;
        }

        /**
         * Elimina un mantenimiento
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT DATE_FORMAT(FROM_UNIXTIME(`date`), '%Y-%m-%d') as date, car
                                    FROM    Upkeeps 
                                    WHERE   ID = " .$data['ID']."");
            

            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                $dataAux =  $db->resultToArray($result)[0];
                $date = $dataAux['date'];
                $car = $dataAux['car'];

                $result = $db->query("  SELECT  date
                                        FROM    Upkeeps 
                                        WHERE   ID = " .$data['ID']."");

                $dateTimeStamp =  $db->resultToArray($result)[0]['date'];

                $db->query("UPDATE  Upkeeps e
                            SET     e.leavingDate = '" . date('Y-m-d H:i:s') . "'
                            WHERE   car = $car AND date = $dateTimeStamp");

                $db->query("UPDATE  Events e
                            SET     e.leavingDate = '" . date('Y-m-d H:i:s') . "'
                            WHERE   car = $car AND start LIKE  '%" .$date."%' AND type = 9");

                return true;
            }
        }

        /**
         * Elimina un mantenimiento
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function delete2($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            //Actualizamos los eventos relacionados con ese mantenimiento
            $result = $db->query(" SELECT event as ID 
                                    FROM    Upkeeps 
                                    WHERE   leavingDate IS NULL 
                                        AND ID = " .$data['ID']."");

            $db->query("UPDATE  Upkeeps
                        SET     leavingDate = " . time() . "
                        WHERE   ID = " . $data['ID']);

        
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                $events =  $db->resultToArray($result);
            }

            foreach($events as $event){
                $db->query("UPDATE  Events e
                            SET     e.leavingDate = '" . date('Y-m-d H:i:s') . "'
                            WHERE   e.ID = " .$event['ID']."");
            }

            return true;
        }


        /**
         * Comprueba si los kms son mayores que los del último mantenimiento
         * 
         * @param int $id Mantenimiento
         * @param int $kms Kilómetros
         * @return bool
         */
        public function checkKms($id, $kms){
            $db = new DbHandler;

            $id = cleanStr($id);
            $kms = cleanStr($kms);

            $result = $db->query("  SELECT  u.car
                                    FROM    Upkeeps u
                                    WHERE   u.ID = $id");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                $vehicle = $db->resultToArray($result)[0]['car'];

                $result = $db->query("  SELECT      u.kms
                                        FROM        Upkeeps u
                                        WHERE       u.car = $vehicle AND
                                                    u.kms IS NOT NULL
                                        ORDER BY    u.kms DESC
                                        LIMIT       1");

                if(mysqli_num_rows($result) == 0){
                    return true;
                }else{
                    $lastKms = $db->resultToArray($result)[0]['kms'];

                    if($kms <= $lastKms){
                        return false;
                    }else{
                        return true;
                    }
                }
            }
        }

        /**
         * Obtiene los mantenimientos pendientes del vehículo
         * 
         * @param int $vehicle Vehículo
         * @return array
         */
        public function getPendingUpkeeps($vehicle){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);

            $dateLimit = strtotime("+2 week");

            $result = $db->query("  SELECT  u.*
                                    FROM    Upkeeps u
                                    WHERE   u.car = $vehicle AND
                                            u.date < $dateLimit AND
                                            u.kms IS NULL AND
                                            u.cost IS NULL AND
                                            u.leavingDate IS NULL
                                    ORDER BY u.date ASC");

            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                $upkeeps = $db->resultToArray($result);

                foreach($upkeeps as $index => $elem){
                    $upkeeps[$index]['engineOilExceed'] = null;
                    if($elem['engineOil'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.engineOil = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.engineOilKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $engineOilKm = $db->resultToArray($result)[0]['engineOilKm'];

                                    if($engineOilKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($engineOilKm) > 0){
                                            $upkeeps[$index]['engineOilExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($engineOilKm);
                                        }else{
                                            $upkeeps[$index]['engineOilExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $upkeeps[$index]['oilFilterExceed'] = null;
                    if($elem['oilFilter'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.oilFilter = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.oilFilterKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $oilFilterKm = $db->resultToArray($result)[0]['oilFilterKm'];

                                    if($oilFilterKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($oilFilterKm) > 0){
                                            $upkeeps[$index]['oilFilterExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($oilFilterKm);
                                        }else{
                                            $upkeeps[$index]['oilFilterExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $upkeeps[$index]['airFilterExceed'] = null;
                    if($elem['airFilter'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.airFilter = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.airFilterKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $airFilterKm = $db->resultToArray($result)[0]['airFilterKm'];

                                    if($airFilterKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($airFilterKm) > 0){
                                            $upkeeps[$index]['airFilterExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($airFilterKm);
                                        }else{
                                            $upkeeps[$index]['airFilterExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $upkeeps[$index]['fuelFilterExceed'] = null;
                    if($elem['fuelFilter'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.fuelFilter = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.fuelFilterKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $fuelFilterKm = $db->resultToArray($result)[0]['fuelFilterKm'];

                                    if($fuelFilterKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($fuelFilterKm) > 0){
                                            $upkeeps[$index]['fuelFilterExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($fuelFilterKm);
                                        }else{
                                            $upkeeps[$index]['fuelFilterExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $upkeeps[$index]['otherFiltersExceed'] = null;
                    if($elem['otherFilters'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.otherFilters = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.otherFiltersKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $otherFiltersKm = $db->resultToArray($result)[0]['otherFiltersKm'];

                                    if($otherFiltersKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($otherFiltersKm) > 0){
                                            $upkeeps[$index]['otherFiltersExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($otherFiltersKm);
                                        }else{
                                            $upkeeps[$index]['otherFiltersExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $upkeeps[$index]['coolingLiquidExceed'] = null;
                    if($elem['coolingLiquid'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.coolingLiquid = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.coolingLiquidKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $coolingLiquidKm = $db->resultToArray($result)[0]['coolingLiquidKm'];

                                    if($coolingLiquidKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($coolingLiquidKm) > 0){
                                            $upkeeps[$index]['coolingLiquidExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($coolingLiquidKm);
                                        }else{
                                            $upkeeps[$index]['coolingLiquidExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $upkeeps[$index]['brakesLiquidExceed'] = null;
                    if($elem['brakesLiquid'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.brakesLiquid = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.brakesLiquidKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $brakesLiquidKm = $db->resultToArray($result)[0]['brakesLiquidKm'];

                                    if($brakesLiquidKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($brakesLiquidKm) > 0){
                                            $upkeeps[$index]['brakesLiquidExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($brakesLiquidKm);
                                        }else{
                                            $upkeeps[$index]['brakesLiquidExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $upkeeps[$index]['timingBeltExceed'] = null;
                    if($elem['timingBelt'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.timingBelt = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.timingBeltKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $timingBeltKm = $db->resultToArray($result)[0]['timingBeltKm'];

                                    if($timingBeltKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($timingBeltKm) > 0){
                                            $upkeeps[$index]['timingBeltExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($timingBeltKm);
                                        }else{
                                            $upkeeps[$index]['timingBeltExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $upkeeps[$index]['otherBeltsExceed'] = null;
                    if($elem['otherBelts'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.otherBelts = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.otherBeltsKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $otherBeltsKm = $db->resultToArray($result)[0]['otherBeltsKm'];

                                    if($otherBeltsKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($otherBeltsKm) > 0){
                                            $upkeeps[$index]['otherBeltsExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($otherBeltsKm);
                                        }else{
                                            $upkeeps[$index]['otherBeltsExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $upkeeps[$index]['frontBrakesExceed'] = null;
                    if($elem['frontBrakes'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.frontBrakes = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.frontBrakesKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $frontBrakesKm = $db->resultToArray($result)[0]['frontBrakesKm'];

                                    if($frontBrakesKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($frontBrakesKm) > 0){
                                            $upkeeps[$index]['frontBrakesExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($frontBrakesKm);
                                        }else{
                                            $upkeeps[$index]['frontBrakesExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $upkeeps[$index]['rearBrakesExceed'] = null;
                    if($elem['rearBrakes'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.rearBrakes = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.rearBrakesKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $rearBrakesKm = $db->resultToArray($result)[0]['rearBrakesKm'];

                                    if($rearBrakesKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($rearBrakesKm) > 0){
                                            $upkeeps[$index]['rearBrakesExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($rearBrakesKm);
                                        }else{
                                            $upkeeps[$index]['rearBrakesExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $upkeeps[$index]['boxATFExceed'] = null;
                    if($elem['boxATF'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.boxATF = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.boxATFKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $boxATFKm = $db->resultToArray($result)[0]['boxATFKm'];

                                    if($boxATFKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($boxATFKm) > 0){
                                            $upkeeps[$index]['boxATFExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($boxATFKm);
                                        }else{
                                            $upkeeps[$index]['boxATFExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $upkeeps[$index]['converterATFExceed'] = null;
                    if($elem['converterATF'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.converterATF = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.converterATFKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $converterATFKm = $db->resultToArray($result)[0]['converterATFKm'];

                                    if($converterATFKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($converterATFKm) > 0){
                                            $upkeeps[$index]['converterATFExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($converterATFKm);
                                        }else{
                                            $upkeeps[$index]['converterATFExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $upkeeps[$index]['differentialATFExceed'] = null;
                    if($elem['differentialATF'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.differentialATF = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.differentialATFKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $differentialATFKm = $db->resultToArray($result)[0]['differentialATFKm'];

                                    if($differentialATFKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($differentialATFKm) > 0){
                                            $upkeeps[$index]['differentialATFExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($differentialATFKm);
                                        }else{
                                            $upkeeps[$index]['differentialATFExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $upkeeps[$index]['sparkPlugExceed'] = null;
                    if($elem['sparkPlug'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.sparkPlug = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.sparkPlugKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $sparkPlugKm = $db->resultToArray($result)[0]['sparkPlugKm'];

                                    if($sparkPlugKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($sparkPlugKm) > 0){
                                            $upkeeps[$index]['sparkPlugExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($sparkPlugKm);
                                        }else{
                                            $upkeeps[$index]['sparkPlugExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $upkeeps[$index]['oilingExceed'] = null;
                    if($elem['oiling'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.oiling = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.oilingKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $oilingKm = $db->resultToArray($result)[0]['oilingKm'];

                                    if($oilingKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($oilingKm) > 0){
                                            $upkeeps[$index]['oilingExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($oilingKm);
                                        }else{
                                            $upkeeps[$index]['oilingExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }



                    $upkeeps[$index]['batteryExceed'] = null;
                    if($elem['battery'] == 1){
                        $result = $db->query("  SELECT      u.kms
                                                FROM        Upkeeps u
                                                WHERE       u.battery = 1 AND
                                                            u.car = $vehicle AND
                                                            u.leavingDate IS NULL AND
                                                            u.kms IS NOT NULL
                                                ORDER BY    u.date DESC
                                                LIMIT       1");

                        if(mysqli_num_rows($result) > 0){
                            $kmsLastUpkeep = $db->resultToArray($result)[0]['kms'];

                            $result = $db->query("  SELECT      ck.kms
                                                    FROM        Cars_Km ck
                                                    WHERE       ck.car = $vehicle AND
                                                                ck.leavingDate IS NULL
                                                    ORDER BY    ck.date DESC");

                            if(mysqli_num_rows($result) > 0){
                                $currentKms = $db->resultToArray($result)[0]['kms'];

                                $result = $db->query("  SELECT  ui.batteryKm
                                                        FROM    Upkeep_Intervals ui
                                                        WHERE   ui.car = $vehicle AND
                                                                ui.leavingDate IS NULL");

                                if(mysqli_num_rows($result) > 0){
                                    $batteryKm = $db->resultToArray($result)[0]['batteryKm'];

                                    if($batteryKm != null){
                                        if(floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($batteryKm) > 0){
                                            $upkeeps[$index]['batteryExceed'] = floatval($currentKms) - floatval($kmsLastUpkeep) - floatval($batteryKm);
                                        }else{
                                            $upkeeps[$index]['batteryExceed'] = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                return $upkeeps;
            }
        }

        /**
         * Obtiene los mantenimientos pendientes del vehículo
         * 
         * @param int $vehicle Vehículo
         * @return array
         */
        public function getPendingUpkeepsV2($vehicle){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);

            $result = $db->query("  SELECT      u.*
                                    FROM        Upkeeps u
                                    WHERE       u.car = $vehicle AND
                                                u.kms IS NULL AND
                                                u.cost IS NULL AND
                                                u.leavingDate IS NULL
                                    ORDER BY    u.date ASC");

            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);    
            }

        }

        /* **************** MANTENIMIENTO ITV ************************* */
        /**
         * Actualiza la ITV
         * 
         * @param int $id
         * 
         * @return bool
         */
        public function updateITV($id, $datePrev, $dateNext, $firstDay, $cost, $kms){           
            $db = new DbHandler;

            $id = cleanStr($id);
            $datePrev = cleanStr($datePrev);
            $dateNext = cleanStr($dateNext);
            $firstDay = cleanStr($firstDay);
            $cost = cleanStr($cost);
            $kms = cleanStr($kms);

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("SELECT * 
                                  FROM Cars_ITV 
                                  WHERE extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("SELECT * 
                                      FROM Cars_ITV 
                                      WHERE extraID = '" . $extraID . "'");
            }

            $result = $db->query("  INSERT INTO Cars_ITV(car, datePrev, dateNext, cost, kms, extraID)
                                    VALUES(" . $id . ", " . $datePrev . ", " . $dateNext . ", $cost, $kms, '$extraID')");
            if($result){
                $car = $db->query(" SELECT  c.licensePlate
                                    FROM    Cars c
                                    WHERE   c.ID = ". $id . "");

                $car = $db->resultToArray($car)[0];                
                $name = $car['licensePlate'];      

                //Searchs the preview events (ITV) and checks like success
                $resultPreviewEvent = $db->query("  SELECT      * 
                                                    FROM        Events 
                                                    WHERE       car = $id AND leavingDate IS NULL AND type = 6
                                                    ORDER BY    ID DESC
                                                    LIMIT       1");

                if(mysqli_num_rows($resultPreviewEvent) > 0){
                    $previewEvent = $db->resultToArray($resultPreviewEvent)[0]["ID"];   
                    
                    $result = $db->query("  UPDATE  Events e
                                            SET     e.status = 4
                                            WHERE   e.ID = $previewEvent");

                }

                $nextDay =  $day15 = date("d-m-Y",$dateNext);
               
                $day15 = date("Y-m-d",strtotime($firstDay."-15 day"));
                $start = $day15 . " 00:00:00";
                $end = $day15 . " 23:59:59";         

                $mailDate = strtotime($day15);                          
                
                require_once($_SESSION['basePath'] . "model/events.php");
                $events = new Events;

                $events->create(array(  "status" => 1, "name" => "Recordatorio ITV del coche " . $name . " para el día " . $nextDay, "start" => $start,
                                        "end" => $end, "car" => $id, "reminder" => 1, "cremation" => 0, "type" => 6, "allDay" => 0, 
                                        "reminderEmail" => 1, "reminderDate" => $mailDate))[1];

                return true;
            }
            return $result;
        }

        /**
         * Modifica los datos de una itv
         * 
         * @param array $data Datos
         * @return array
         */
        public function updateItvSaved($data){
            $db = new DbHandler;

            $id = cleanStr($data['id']);
            $datePrev = cleanStr($data['datePrev']);
            $dateNext = cleanStr($data['dateNext']);
            $cost = cleanStr($data['cost']);
            $kms = cleanStr($data['kms']);
      
            $result = $db->query("  SELECT  ci.car, ci.dateNext, c.licensePlate
                                    FROM    Cars_ITV ci, Cars c
                                    WHERE   ci.ID = $id AND c.ID=ci.car");

            //Change event day
            if(mysqli_num_rows($result) > 0){
                $carData = $db->resultToArray($result)[0];

                $dateNextOld = $carData['dateNext'];
                $dateNextOld = date('Y-m-d', $dateNextOld);

                $licensePlate = $carData['licensePlate'];
                $car = $carData['car'];


                $currentDate = date("Y-m-d");
                // $day15 = date("Y-m-d",strtotime($dateNextOld."-15 day"));
                $day15 = $dateNextOld;
        
                $db->query("UPDATE  Events
                            SET     leavingDate = '$currentDate'
                            WHERE   car = $car 
                                AND type ='6' 
                                AND start = '$day15' 
                                AND leavingDate IS NULL");

                // $day15 = date("Y-m-d",strtotime(date("Y-m-d", $dateNext)."-15 day"));
                $day15 = date("Y-m-d", $dateNext);
                $start = $day15 . " 00:00:00";
                $end = $day15 . " 23:59:59";         
                $mailDate = strtotime($day15);                          
                $dateName = date("d-m-Y", $dateNext);

                require_once($_SESSION['basePath'] . "model/events.php");
                $events = new Events;     
                  
                $events->create(array("status" => 1, "name" => "Recordatorio ITV del coche " . $licensePlate . " para el día " . $dateName, "start" => $start,
                                                    "end" => $end, "car" => $car, "reminder" => 1, "cremation" => 0, "type" => 6, "allDay" => 0, 
                                                    "reminderEmail" => 1, "reminderDate" => $mailDate));
            }
           
            $db->query("UPDATE  Cars_ITV
                        SET     datePrev = $datePrev,
                                dateNext = $dateNext,
                                cost = $cost,
                                kms = $kms
                        WHERE   ID = $id");
                                        
            $result = $db->query("  SELECT  MAX(ck.kms) as kms
                                    FROM    Cars_Km ck
                                    WHERE   ck.car = $car");

            if(mysqli_num_rows($result) == 0){
                return true;
            }else{
                $maxKms = $db->resultToArray($result)[0]['kms'];
            
                if($maxKms < $kms){
                    $date = time();
                    $db->query("INSERT INTO Cars_Km(car, kms, date)
                                VALUES ($car, $kms, $date)");

                    require_once($_SESSION['basePath'] . "model/cars.php");

                    $vehicles = new Cars;

                    $toUpkeep = array();
                    $categories = $vehicles->getKmsByUpkeep($car);
                    
                    foreach($categories as $key => $interval){
                        if($interval != null){
                            $cat = substr($key, 0, -2);
                            $kmLastUpkeep = $vehicles->getLastUpkeepByCategoryV2($id, $cat);
                            if($kmLastUpkeep == null){
                                if($kms >= $interval && $vehicles->existsUpkeepPendingForCategory($id, $cat)){
                                    array_push($toUpkeep, $cat);
                                }
                            }else{
                                if(($kmLastUpkeep + $interval) >= $kms  && $vehicles->existsUpkeepPendingForCategory($id, $cat)){
                                    array_push($toUpkeep, $cat);
                                }
                            }
                        }
                    }
                     
                    //Comprobamos si es necesario crear un nuevo mantenimiento (mantenimiento sin kms ni importe, necesario para los avisos)
                    if(count($toUpkeep) > 0){
                        $upkeep = $vehicles->createUpkeep($car);
                    }

                    //Comprobamos que tipo de mantenimiento es para crear el evento asociado y lo vinculamos con el mantenimiento que acabamos de crear
                    foreach($toUpkeep as $key=> $elem){

                        if($elem == 'engineOil'){
                            if($upkeep != null){
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de aceite matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }

                        if($elem == 'oilFilter'){
                            if($upkeep != null){                                                                            
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de filtro de aceite matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }

                        if($elem == 'airFilter'){
                            if($upkeep != null){                                                                            
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de filtro de aire matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }

                        if($elem == 'fuelFilter'){
                            if($upkeep != null){                                                                            
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de filtro de combustible matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }

                        if($elem == 'otherFilters'){
                            if($upkeep != null){                                                                            
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Alineado de dirección matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }


                        if($elem == 'coolingLiquid'){
                            if($upkeep != null){                                                                            
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de líquido refrigerante matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }

                        if($elem == 'brakesLiquid'){
                            if($upkeep != null){                                                                            
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de líquido de frenos matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }

                        if($elem == 'timingBelt'){
                            if($upkeep != null){                                                                            
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de correa de distribución matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }

                        if($elem == 'otherBelts'){
                            if($upkeep != null){                                                                            
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de otras correas matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }

                        if($elem == 'frontBrakes'){
                            if($upkeep != null){                                                                            
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de frenos delateros matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep,"reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }

                        if($elem == 'rearBrakes'){
                            if($upkeep != null){                                                                            
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de frenos traseros matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep,"reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }

                        if($elem == 'boxATF'){
                            if($upkeep != null){                                                                            
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de caja ATF matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }

                        if($elem == 'converterATF'){
                            if($upkeep != null){                                                                            
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de ruedas traseras matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }

                        if($elem == 'differentialATF'){
                            if($upkeep != null){                                                                            
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de ruedas delanteras matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }

                        if($elem == 'sparkPlug'){
                            if($upkeep != null){                                                                            
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de bujías/calendatores matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep, "reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }

                        if($elem == 'battery'){
                            if($upkeep != null){                                                                            
                                $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de batería matrícula " . $licensePlate, "start" => $start,
                                                                        "end" => $end, "car" => $car, "upkeeps" => $upkeep,"reminder" => 1, "cremation" => 0, "type" => 9, "allDay" => 1))[1];
                                $vehicles->updateUpkeep($upkeep, $elem);
                            }
                        }
                    }
                }
            }
            return true;
        }

        /**
         * Obtiene las ITV de un coche
         * 
         * @param int $id
         * 
         * @return bool
         */
        public function getITV($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT      ci.ID, ci.datePrev, ci.dateNext, ci.cost, ci.kms
                                    FROM        Cars_ITV ci
                                    WHERE       ci.car = " . $id. " AND ci.leavingDate IS NULL
                                    ORDER BY    dateNext DESC");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /* **************** MANTENIMIENTO SEGURO DEL COCHE ************************* */
        /**
         * Actualiza los pagos del seguro
         * 
         * @param int $id
         * 
         * @return bool
         */
        public function updateInsurance($id, $paymentDate, $amount, $createDate, $finalDate, $insurancePolicy, $company, $phone){           
            $db = new DbHandler;

            $id = cleanStr($id);
            $paymentDate = cleanStr($paymentDate);
            $amount = cleanStr($amount);
            $createDate = cleanStr($createDate);
            $finalDate = cleanStr($finalDate);
            $insurancePolicy = cleanStr($insurancePolicy);
            $company = cleanStr($company);
            $phone = cleanStr($phone);

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Cars_Insurance 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Cars_Insurance 
                                        WHERE   extraID = '" . $extraID . "'");
            }

            $result = $db->query("  INSERT INTO Cars_Insurance(car, paymentDate, amount, createDate, finalDate, insurancePolicy, company, phone, extraID)
                                    VALUES(" . $id . ", " . $paymentDate . ", '" . $amount . "', ".$createDate.", ".$finalDate.", '".$insurancePolicy."', '".$company."', '".$phone."', '$extraID')");
            if($result){
                $car = $db->query(" SELECT  c.licensePlate
                                    FROM    Cars c
                                    WHERE   c.ID = $id");

                $car = $db->resultToArray($car)[0];                
                $name = $car['licensePlate'];
                $fecha = date("Y-m-d", $paymentDate);                  
                $nextyear = date("Y-m-d", strtotime($fecha."+ 1 year"));                         
                $start = $nextyear . " 00:00:00";                
                $end = $nextyear . " 23:59:59";
                
                $day45 = date("Y-m-d",strtotime($nextyear."-45 day"));                
                $mailDate = strtotime($day45); 
                
                require_once($_SESSION['basePath'] . "model/events.php");
                $events = new Events;

                $events->create(array(  "status" => 1, "name" => "Seguro del coche " . $name, "start" => $start,
                                        "end" => $end, "car"=> $id, "reminder" => 1, "cremation" => 0, "type" => 7, "allDay" => 0,
                                        "reminderEmail" => 1, "reminderDate" => $mailDate))[1];
                            
                return true;
            }
            return $result;
        }

        /**
         * Obtiene los pagos del seguro de un coche
         * 
         * @param int $id
         * 
         * @return bool
         */
        public function getInsurance($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query(" SELECT ID, paymentDate, amount, createDate, finalDate, insurancePolicy, company, phone
                                FROM Cars_Insurance
                                WHERE car = " . $id. " AND leavingDate IS NULL
                                ORDER  BY paymentDate DESC");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /* **************** Intervalo de mantenimiento **************** */
        /**
         * Crear un intervalo de mantenimiento
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function createInterval($data){
            $db = new DbHandler;

            $data['vehicle'] = cleanStr($data['vehicle']);

            return $db->query(" INSERT INTO Upkeep_Intervals(car)
                                VALUES(" . $data['vehicle'] . ")");
        }

        /**
         * Obtiene los datos de un intervalo de mantenimiento
         * 
         * @param array $data
         * 
         * @return array
         */
        public function readInterval($data){
            $db = new DbHandler;

            $data['vehicle'] = cleanStr($data['vehicle']);

            $result = $db->query("  SELECT  *
                                    FROM    Upkeep_Intervals
                                    WHERE   car = " . $data['vehicle'] . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Modifica los datos de un intervalo de mantenimiento
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateInterval($data){
            $db = new DbHandler;

            $data['engineOilKm'] = cleanStr($data['engineOilKm']);
            $data['engineOilTime'] = cleanStr($data['engineOilTime']);
            $data['oilFilterKm'] = cleanStr($data['oilFilterKm']);
            $data['oilFilterTime'] = cleanStr($data['oilFilterTime']);
            $data['airFilterKm'] = cleanStr($data['airFilterKm']);
            $data['airFilterTime'] = cleanStr($data['airFilterTime']);
            $data['fuelFilterKm'] = cleanStr($data['fuelFilterKm']);
            $data['fuelFilterTime'] = cleanStr($data['fuelFilterTime']);
            $data['otherFiltersKm'] = cleanStr($data['otherFiltersKm']);
            $data['otherFiltersTime'] = cleanStr($data['otherFiltersTime']);
            $data['coolingLiquidKm'] = cleanStr($data['coolingLiquidKm']);
            $data['coolingLiquidTime'] = cleanStr($data['coolingLiquidTime']);
            $data['brakesLiquidKm'] = cleanStr($data['brakesLiquidKm']);
            $data['brakesLiquidTime'] = cleanStr($data['brakesLiquidTime']);
            $data['timingBeltKm'] = cleanStr($data['timingBeltKm']);
            $data['timingBeltTime'] = cleanStr($data['timingBeltTime']);
            $data['otherBeltsKm'] = cleanStr($data['otherBeltsKm']);
            $data['otherBeltsTime'] = cleanStr($data['otherBeltsTime']);
            $data['frontBrakesKm'] = cleanStr($data['frontBrakesKm']);
            $data['frontBrakesTime'] = cleanStr($data['frontBrakesTime']);
            $data['rearBrakesKm'] = cleanStr($data['rearBrakesKm']);
            $data['rearBrakesTime'] = cleanStr($data['rearBrakesTime']);
            $data['boxATFKm'] = cleanStr($data['boxATFKm']);
            $data['boxATFTime'] = cleanStr($data['boxATFTime']);
            $data['converterATFKm'] = cleanStr($data['converterATFKm']);
            $data['converterATFTime'] = cleanStr($data['converterATFTime']);
            $data['differentialATFKm'] = cleanStr($data['differentialATFKm']);
            $data['differentialATFTime'] = cleanStr($data['differentialATFTime']);
            $data['sparkPlugKm'] = cleanStr($data['sparkPlugKm']);
            $data['sparkPlugTime'] = cleanStr($data['sparkPlugTime']);
            $data['oilingKm'] = cleanStr($data['oilingKm']);
            $data['oilingTime'] = cleanStr($data['oilingTime']);
            $data['batteryKm'] = cleanStr($data['batteryKm']);
            $data['batteryTime'] = cleanStr($data['batteryTime']);
            $data['notes'] = cleanEditor($data['notes']);
            $data['vehicleID'] = cleanStr($data['vehicleID']);


            // Cálculo del extraID
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("SELECT * 
                                  FROM Upkeep_Intervals 
                                  WHERE extraID = '" . $extraID . "'");
            
            if($result != false){
                while(mysqli_num_rows($result) > 0){
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
    
                    $result = $db->query("SELECT * 
                                          FROM Upkeep_Intervals 
                                          WHERE extraID = '" . $extraID . "'");
                }
            }
            
            //Actualizamos los intervalos de tiempo y kilometros
            $result = $db->query(" UPDATE  Upkeep_Intervals
                                    SET     engineOilKm = " . $data['engineOilKm'] . ",
                                            engineOilTime = " . $data['engineOilTime'] . ",
                                            oilFilterKm = " . $data['oilFilterKm'] . ",
                                            oilFilterTime = " . $data['oilFilterTime'] . ",
                                            airFilterKm = " . $data['airFilterKm'] . ",
                                            airFilterTime = " . $data['airFilterTime'] . ",
                                            fuelFilterKm = " . $data['fuelFilterKm'] . ",
                                            fuelFilterTime = " . $data['fuelFilterTime'] . ",
                                            otherFiltersKm = " . $data['otherFiltersKm'] . ",
                                            otherFiltersTime = " . $data['otherFiltersTime'] . ",
                                            coolingLiquidKm = " . $data['coolingLiquidKm'] . ",
                                            coolingLiquidTime = " . $data['coolingLiquidTime'] . ",
                                            brakesLiquidKm = " . $data['brakesLiquidKm'] . ",
                                            brakesLiquidTime = " . $data['brakesLiquidTime'] . ",
                                            timingBeltKm = " . $data['timingBeltKm'] . ",
                                            timingBeltTime = " . $data['timingBeltTime'] . ",
                                            otherBeltsKm = " . $data['otherBeltsKm'] . ",
                                            otherBeltsTime = " . $data['otherBeltsTime'] . ",
                                            frontBrakesKm = " . $data['frontBrakesKm'] . ",
                                            frontBrakesTime = " . $data['frontBrakesTime'] . ",
                                            rearBrakesKm = " . $data['rearBrakesKm'] . ",
                                            rearBrakesTime = " . $data['rearBrakesTime'] . ",
                                            boxATFKm = " . $data['boxATFKm'] . ",
                                            boxATFTime = " . $data['boxATFTime'] . ",
                                            converterATFKm = " . $data['converterATFKm'] . ",
                                            converterATFTime = " . $data['converterATFTime'] . ",
                                            differentialATFKm = " . $data['differentialATFKm'] . ",
                                            differentialATFTime = " . $data['differentialATFTime'] . ",
                                            sparkPlugKm = " . $data['sparkPlugKm'] . ",
                                            sparkPlugTime = " . $data['sparkPlugTime'] . ",
                                            oilingKm = " . $data['oilingKm'] . ",
                                            oilingTime = " . $data['oilingTime'] . ",
                                            batteryKm = " . $data['batteryKm'] . ",
                                            batteryTime = " . $data['batteryTime'] . ",
                                            notes = '" . $data['notes'] . "',
                                            extraID = '". $extraID . "'
                                    WHERE   car = " . $data['vehicleID'] . "");

            if($result){
                return true;
            }else{
                return false;
            }
        }


        /**
         * Modifica los datos de un intervalo de mantenimiento
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateIntervalKms($data){
            $db = new DbHandler;


            if(!isset($data['engineOilKm'])){
                $data['engineOilKm'] = 'null';
            }

            if(!isset($data['oilFilterKm'])){
                $data['oilFilterKm'] = 'null';
            }

            if(!isset($data['airFilterKm'])){
                $data['airFilterKm'] = 'null';
            }

            if(!isset($data['fuelFilterKm'])){
                $data['fuelFilterKm'] = 'null';
            }

            if(!isset($data['otherFiltersKm'])){
                $data['otherFiltersKm'] = 'null';
            }

            if(!isset($data['coolingLiquidKm'])){
                $data['coolingLiquidKm'] = 'null';
            }

            if(!isset($data['brakesLiquidKm'])){
                $data['brakesLiquidKm'] = 'null';
            }

            if(!isset($data['timingBeltKm'])){
                $data['timingBeltKm'] = 'null';
            }

            if(!isset($data['otherBeltsKm'])){
                $data['otherBeltsKm'] = 'null';
            }

            if(!isset($data['frontBrakesKm'])){
                $data['frontBrakesKm'] = 'null';
            }

            if(!isset($data['rearBrakesKm'])){
                $data['rearBrakesKm'] = 'null';
            }

            if(!isset($data['boxATFKm'])){
                $data['boxATFKm'] = 'null';
            }

            if(!isset($data['converterATFKm'])){
                $data['converterATFKm'] = 'null';
            }

            if(!isset($data['differentialATFKm'])){
                $data['differentialATFKm'] = 'null';
            }

            if(!isset($data['sparkPlugKm'])){
                $data['sparkPlugKm'] = 'null';
            }

            if(!isset($data['oilingKm'])){
                $data['oilingKm'] = 'null';
            }

            if(!isset($data['batteryKm'])){
                $data['batteryKm'] = 'null';
            }

            $data['engineOilKm'] = cleanStr($data['engineOilKm']);
            $data['oilFilterKm'] = cleanStr($data['oilFilterKm']);
            $data['airFilterKm'] = cleanStr($data['airFilterKm']);
            $data['fuelFilterKm'] = cleanStr($data['fuelFilterKm']);
            $data['otherFiltersKm'] = cleanStr($data['otherFiltersKm']);
            $data['coolingLiquidKm'] = cleanStr($data['coolingLiquidKm']);
            $data['brakesLiquidKm'] = cleanStr($data['brakesLiquidKm']);
            $data['timingBeltKm'] = cleanStr($data['timingBeltKm']);
            $data['otherBeltsKm'] = cleanStr($data['otherBeltsKm']);
            $data['frontBrakesKm'] = cleanStr($data['frontBrakesKm']);
            $data['rearBrakesKm'] = cleanStr($data['rearBrakesKm']);
            $data['boxATFKm'] = cleanStr($data['boxATFKm']);
            $data['converterATFKm'] = cleanStr($data['converterATFKm']);
            $data['differentialATFKm'] = cleanStr($data['differentialATFKm']);
            $data['sparkPlugKm'] = cleanStr($data['sparkPlugKm']);
            $data['oilingKm'] = cleanStr($data['oilingKm']);
            $data['batteryKm'] = cleanStr($data['batteryKm']);
            $data['vehicleID'] = cleanStr($data['vehicleID']);


            // Cálculo del extraID
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("SELECT * 
                                  FROM Upkeep_Intervals 
                                  WHERE extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("SELECT * 
                                      FROM Upkeep_Intervals 
                                      WHERE extraID = '" . $extraID . "'");
            }

            //Obtenemos el id del evento al que está asociado el intervalo
            $resultInterval = $db->query("SELECT event
                                          FROM  Upkeep_Intervals 
                                          WHERE car = " . $data['vehicleID'] . "");
            if(mysqli_num_rows($resultInterval) > 0){
                $eventUpkeep = $db->resultToArray($resultInterval)[0]['event'];
            }else{
                $eventUpkeep = null;
            }

        
           
            if($data['engineOilKm'] != null && $data['engineOilKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     engineOilKm = " . $data['engineOilKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }

            if($data['oilFilterKm'] != null && $data['oilFilterKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     oilFilterKm = " . $data['oilFilterKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }

            if($data['airFilterKm'] != null && $data['airFilterKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     airFilterKm = " . $data['airFilterKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }

            if($data['fuelFilterKm'] != null && $data['fuelFilterKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     fuelFilterKm = " . $data['fuelFilterKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }

            if($data['otherFiltersKm'] != null && $data['otherFiltersKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     otherFiltersKm = " . $data['otherFiltersKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }

            if($data['brakesLiquidKm'] != null && $data['brakesLiquidKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     brakesLiquidKm = " . $data['brakesLiquidKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }

            if($data['timingBeltKm'] != null && $data['timingBeltKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     timingBeltKm = " . $data['timingBeltKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }

            if($data['otherBeltsKm'] != null && $data['otherBeltsKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     otherBeltsKm = " . $data['otherBeltsKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }

            if($data['frontBrakesKm'] != null && $data['frontBrakesKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     frontBrakesKm = " . $data['frontBrakesKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }

            if($data['rearBrakesKm'] != null && $data['rearBrakesKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     rearBrakesKm = " . $data['rearBrakesKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }

            if($data['boxATFKm'] != null && $data['boxATFKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     boxATFKm = " . $data['boxATFKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }


            if($data['converterATFKm'] != null && $data['converterATFKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     converterATFKm = " . $data['converterATFKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }

            if($data['differentialATFKm'] != null && $data['differentialATFKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     differentialATFKm = " . $data['differentialATFKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }

            if($data['sparkPlugKm'] != null && $data['sparkPlugKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     sparkPlugKm = " . $data['sparkPlugKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }

            if($data['oilingKm'] != null && $data['oilingKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     oilingKm = " . $data['oilingKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }

            if($data['batteryKm'] != null && $data['batteryKm'] != 'null'){
                $result = $db->query(" UPDATE  Upkeep_Intervals
                                        SET     batteryKm = " . $data['batteryKm'] . ",
                                                extraID = '". $extraID . "'
                                        WHERE   car = " . $data['vehicleID'] . "");
            }


            if($result){

                //Dependiendo del tipo de mantenimiento, creamos un evento u otro
                //CAMBIO DE ACEITE
                if($data['engineOilKm'] !== null && $data['engineOilKm'] !== '' && $data['engineOilKm'] != 'null' ){
                
                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de aceite matrícula " . $name . " por superar los " .$data['engineOilKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, engineOil, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");

                }

                //CAMBIO DE FILTRO DE ACEITE
                if($data['oilFilterKm'] !== null && $data['oilFilterKm'] !== '' && $data['oilFilterKm'] != 'null' ){
                
                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio del filtro de aceite matrícula " . $name . " por superar los " .$data['oilFilterKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, oilFilter, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");

                }

                //CAMBIO DE FILTRO DE AIRE
                if($data['airFilterKm'] !== null && $data['airFilterKm'] !== '' && $data['airFilterKm'] != 'null' ){
                
                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio del filtro de aire matrícula " . $name . " por superar los " .$data['airFilterKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, airFilter, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");

                }

                //CAMBIO DE FILTRO DE COMBUSTIBLE
                if($data['fuelFilterKm'] !== null && $data['fuelFilterKm'] !== '' && $data['fuelFilterKm'] != 'null' ){
                
                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio del filtro de combustible matrícula " . $name . " por superar los " .$data['fuelFilterKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, fuelFilter, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");
                }

                //CAMBIO DE OTROS FILTROS
                if($data['otherFiltersKm'] !== null && $data['otherFiltersKm'] !== '' && $data['otherFiltersKm'] != 'null' ){
            
                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Alineado de dirección matrícula " . $name . " por superar los " .$data['otherFiltersKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, otherFilters, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");

                }

                //CAMBIO DE LIQUIDO REFRIGERANTE
                if($data['coolingLiquidKm'] !== null && $data['coolingLiquidKm'] !== '' && $data['coolingLiquidKm'] != 'null' ){
        
                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de líquido refrigerante matrícula" . $name . " por superar los " .$data['coolingLiquidKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, coolingLiquid, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");
                }

                //CAMBIO DE LIQUIDO DE FRENOS
                if($data['brakesLiquidKm'] !== null && $data['brakesLiquidKm'] !== '' && $data['brakesLiquidKm'] != 'null' ){
    
                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de líquido de frenos matrícula " . $name . " por superar los " .$data['brakesLiquidKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, brakesLiquid, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");

                }

                //CAMBIO DE CORREA DE DISTRIBUCIÓN
                if($data['timingBeltKm'] !== null && $data['timingBeltKm'] !== '' && $data['timingBeltKm'] != 'null' ){
    
                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de correa de distribución matrícula " . $name . " por superar los " .$data['timingBeltKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, timingBelt, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");

                }

                //CAMBIO DE OTRAS CORREAS 
                if($data['otherBeltsKm'] !== null && $data['otherBeltsKm'] !== '' && $data['otherBeltsKm'] != 'null' ){

                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de otras correas matrícula " . $name . " por superar los " .$data['otherBeltsKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, otherBelts, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");

                }

                //CAMBIO DE FRENOS DELANTEROS
                if($data['frontBrakesKm'] !== null && $data['frontBrakesKm'] !== '' && $data['frontBrakesKm'] != 'null' ){

                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de frenos delanteros matrícula " . $name . " por superar los " .$data['frontBrakesKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, frontBrakes, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");

                }

                //CAMBIO DE FRENOS TRASEROS
                if($data['rearBrakesKm'] !== null && $data['rearBrakesKm'] !== '' && $data['rearBrakesKm'] != 'null' ){

                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de frenos traseros matrícula " . $name . " por superar los " .$data['rearBrakesKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, rearBrakes, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");
                }

                //CAMBIO DE ATF CAJA
                if($data['boxATFKm'] !== null && $data['boxATFKm'] !== '' && $data['boxATFKm'] != 'null' ){

                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de filtro de cabina " . $name . " por superar los " .$data['boxATFKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, boxATF, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");

                }

                //CAMBIO DE CONVERTIDOR ATF 
                if($data['converterATFKm'] !== null && $data['converterATFKm'] !== '' && $data['converterATFKm'] != 'null' ){

                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de ruedas traseras matrícula " . $name . " por superar los " .$data['converterATFKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, converterATF, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");

                }

                //CAMBIO DE CONVERTIDOR ATF DIFERENCIAL
                if($data['differentialATFKm'] !== null && $data['differentialATFKm'] !== '' && $data['differentialATFKm'] != 'null' ){

                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de ruedas traseras diferencial matrícula " . $name . " por superar los " .$data['differentialATFKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, differentialATF, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");

                }

                //CAMBIO DE BUJIAS/CALENTADORES
                if($data['sparkPlugKm'] !== null && $data['sparkPlugKm'] !== '' && $data['sparkPlugKm'] != 'null' ){

                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de bujías/calendatores matrícula " . $name . " por superar los " .$data['sparkPlugKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, sparkPlug, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");
                }
                //CAMBIO DE ENGRASE
                if($data['oilingKm'] !== null && $data['oilingKm'] !== '' && $data['oilingKm'] != 'null' ){

                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de engrase matrícula " . $name . " por superar los " .$data['oilingKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                                                            
                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, oiling, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");

                }

                //CAMBIO DE ENGRASE
                if($data['batteryKm'] !== null && $data['batteryKm'] !== '' && $data['batteryKm'] != 'null' ){

                    //Obtenemos los datos para generar el nuevo evento
                    $upkeep = $db->query("  SELECT c.licensePlate, ui.ID 
                                            FROM Cars c, Upkeep_Intervals ui  
                                            WHERE c.ID = '" . $data['vehicleID'] . "' AND c.ID = ui.car");

                    $name = $db->resultToArray($upkeep)[0]['licensePlate'];
                    $start = date("Y-m-d") . " 00:00:00";
                    $end = date("Y-m-d") . " 23:59:59";

                    require_once($_SESSION['basePath'] . "model/events.php");
                    $events = new Events;

                    //Añadimos el nuevo evento y lo vinculamos a Upkeep_Intervals
                    $carID = $data['vehicleID'];
                    $eventExtraID = $events->create(array("status" => 1, "name" => "Cambio de batería matrícula " . $name . " por superar los " .$data['batteryKm']/2 . " kms", "start" => $start,
                                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 8, "allDay" => 1))[1];

                    //CREAMOS EL MANTENIMIENTO CON LA FECHA DEL NUEVO EVENTO
                    //Cálculo del extraID
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                    $result = $db->query("  SELECT * 
                                            FROM Upkeeps 
                                            WHERE extraID = '" . $extraID . "'");
                    
                    while(mysqli_num_rows($result) > 0){
                        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                        $result = $db->query("  SELECT * 
                                                FROM Upkeeps 
                                                WHERE extraID = '" . $extraID . "'");
                    }

                    $event = $db->query("   SELECT  ID
                                            FROM    Events
                                            WHERE   extraID = '$eventExtraID'");
                    $event = $db->resultToArray($event)[0]['ID'];
                    

                    $upkeepDate = strtotime($start);
                    $result =  $db->query(" INSERT INTO Upkeeps(car, event, date, battery, extraID)
                                            VALUES($carID, $event, $upkeepDate, 1, '$extraID')");

                }

            }else{
                return false;
            }
            
            return true;
        }
    

        /**
         * Elimina un intervalo de mantenimiento
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function deleteInterval($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Upkeep_Intervals
                                SET     leavingDate = " . time() . "
                                WHERE   ID = " . $data['ID'] . "");
        }

        /* ******************************** Agenda ******************************** */
        /**
         * Lista los eventos
         * 
         * @return @array
         */
        public function listEvents(){
            $db = new DbHandler;

            $result = $db->query("SELECT e.ID as id, e.name as title, e.start as start, e.end as end,
                                        e.reminder,
                                        e.type,
                                        e.expedient as vehicle,
                                        e.upkeeps,
                                        es.ID as statusID, es.name as statusName, es.borderColor, es.backgroundColor, 
                                        u.name as userName 
                                FROM Events e, Events_Status es, Users u 
                                WHERE e.status = es.ID AND 
                                    e.user = u.userID AND
                                    e.leavingDate IS NULL AND 
                                    e.type IN(3,6,7)
                                UNION
                                SELECT  e.ID as id, CONCAT('Mantenimiento matrícula ', ca.licensePlate) as title, e.start as start, e.end as end,
                                        e.reminder,
                                        e.type,
                                        ca.ID as vehicle,
                                        e.upkeeps,
                                        es.ID as statusID, es.name as statusName, es.borderColor, es.backgroundColor, 
                                        u.name as userName 
                                FROM        (Events e, Events_Status es)
                                LEFT JOIN   Users u ON e.user = u.userID
                                LEFT JOIN   Cars ca ON e.car = ca.ID
                                WHERE e.status = es.ID AND 
                                      e.leavingDate IS NULL AND
                                      e.status = 4
                                    AND (e.type = 9 || e.type = 8)
                                GROUP BY e.start, e.car, e.status

                                UNION
                                SELECT  e.ID as id, CONCAT('Mantenimiento matrícula ', ca.licensePlate) as title, e.start as start, e.end as end,
                                        e.reminder,
                                        e.type,
                                        ca.ID as vehicle,
                                        e.upkeeps,
                                        es.ID as statusID, es.name as statusName, es.borderColor, es.backgroundColor, 
                                        u.name as userName 
                                FROM        (Events e, Events_Status es)
                                LEFT JOIN   Users u ON e.user = u.userID
                                LEFT JOIN   Cars ca ON e.car = ca.ID
                                WHERE e.status = es.ID AND 
                                      e.leavingDate IS NULL
                                    AND (e.type = 9 || e.type = 8)
                                    AND e.status = 1
                                GROUP BY e.start, e.car, e.status");
                            

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }


        /**
         * Lista los eventos
         * 
         * @return @array
         */
        public function listUpkeeps($upkeeps, $car, $date){
            $db = new DbHandler;

            $upkeeps = cleanStr($upkeeps);
            $car = cleanStr($car);
            $date = cleanStr($date);


            $result = $db->query("SELECT e.name
                                  FROM Events e, Upkeeps u
                                  WHERE e.car = $car  
                                    AND e.start LIKE '%$date%'
                                    AND e.type IN (9,8)
                                    AND e.leavingDate IS NULL
                                    AND e.upkeeps = u.ID
                                    AND u.ID = $upkeeps
                                    AND u.leavingDate IS NULL");

            $events = $db->resultToArray($result);
            $data['events'] = $events;

            $result = $db->query("SELECT u.*, e.status
                                  FROM  Upkeeps u, Events e
                                  WHERE e.upkeeps = u.ID AND u.ID = $upkeeps");
            
            $upkeep = $db->resultToArray($result)[0];
            $data['upkeep'] = $upkeep;

            return mysqli_num_rows($result) == 0 ? null :  $data;
        }

        /**
         * Lista los eventos (intervalos)
         * 
         * @return @array
         */
        public function listUpkeepsIntervals($vehicle, $start){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);
            $start = cleanStr($start);
      
            $result = $db->query("SELECT e.name
                                  FROM Events e
                                  WHERE e.car = " . $vehicle . " AND e.leavingDate IS NULL AND e.start = '$start' 
                                  GROUP BY e.name");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }


        /**
         * Modifica los datos del evento y del mantenimiento asociado
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateEvent($data){
            $db = new DbHandler;

            /* 
            *  If $data['event'] is not null, the event is a normal event
            *  If exists $data['upkeepsID'], the event is a "normal" upkeeps event
            *  If exists $data['vehicleID'], the event is a interval upkeeps event
            */
            
            $data['reminder'] = cleanStr($data['reminder']);
            $data['status'] = cleanStr($data['status']);
            $data['event'] = cleanStr($data['event']);
            $data['upkeepsID'] = cleanStr($data['upkeepsID']);
            $data['vehicleID'] = cleanStr($data['vehicleID']);
           
            if($data['event'] != null && $data['event'] != '' && $data['event'] != 'null'){
                $resultResponse = $db->query("  UPDATE  Events
                                                SET     reminder = " . $data['reminder'] . ",
                                                        status = " . $data['status'] . "
                                                WHERE   ID = " . $data['event'] . "");

            }else if($data['upkeepsID'] != null && $data['upkeepsID'] != '' && $data['upkeepsID'] != 'null'){

                $result = $db->query("SELECT * FROM `Events` WHERE upkeeps = " . $data['upkeepsID'] . " AND type = 9");

                if(mysqli_num_rows($result) == 0){
                    return null;
                }else{
                    $events =  $db->resultToArray($result);
                }
                
                foreach($events as $event){
                    $id = $event['ID'];
                    $resultResponse = $db->query("  UPDATE  Events
                                                    SET     reminder = " . $data['reminder'] . ",
                                                            status = " . $data['status'] . "
                                                    WHERE   ID = " . $id);
                } 
            }else{
                $result = $db->query("  SELECT  ID
                                        FROM    Events
                                        WHERE   leavingDate IS NULL AND
                                                car = " . $data['vehicleID'] . " AND
                                                type = 8");

                if(mysqli_num_rows($result) == 0){
                    return null;
                }else{
                    $events =  $db->resultToArray($result);
                }
    
                foreach($events as $event){
                    $result = $db->query("  UPDATE  Events
                                            SET     reminder = " . $data['reminder'] . ",
                                                    status = " . $data['status'] . "
                                            WHERE   ID = " . $event['ID'] . "");
                    if($result){
                        $resultResponse = $result;
                    }else{
                        $resultResponse = false;
                    }
                }
            }

            if($resultResponse){
                return true;
            }else{
                return false;
            }
        }

        /**
         * Modifica los datos de un seguro
         * 
         * @param array $data Datos
         * @return array
         */
        public function setInsurance($data){
            $db = new DbHandler;

            $id = cleanStr($data['id']);
            $paymentDate = cleanStr($data['paymentDate']);
            $amount = cleanStr($data['amount']);
            $createDate = cleanStr($data['createDate']);
            $finalDate = cleanStr($data['finalDate']);
            $insurancePolicy = cleanStr($data['insurancePolicy']);
            $company = cleanStr($data['company']);
            $phone = cleanStr($data['phone']);

            return $db->query(" UPDATE  Cars_Insurance
                                SET     paymentDate = $paymentDate,
                                        amount = $amount,
                                        createDate = $createDate,
                                        finalDate = $finalDate,
                                        insurancePolicy = '$insurancePolicy',
                                        company = '$company',
                                        phone = '$phone'
                                WHERE   ID = $id");
        }

        /**
         * Lista los eventos
         * 
         * @return @array
         */
        public function listUpkeepsDatatables($car){
            $db = new DbHandler;

            $car = cleanStr($car);

            $result = $db->query("SELECT u.ID, u.date, u.kms, u.cost, u.engineOil,  u.oilFilter, u.fuelFilter, u.airFilter, u.boxATF, u.sparkPlug, u.coolingLiquid, u.brakesLiquid, u.battery,
                                         u.frontBrakes, u.rearBrakes, u.timingBelt, u.converterATF, u.differentialATF, u.otherFilters
                                    FROM Upkeeps u
                                    WHERE u.car = $car AND u.leavingDate IS NULL
                                        AND u.kms IS NOT NULL AND u.cost IS NOT NULL");
            return mysqli_num_rows($result) == 0 ? array() : $db->resultToArrayValue($result);
        }

        /**
         * Lista los eventos
         * 
         * @return @array
         */
        public function listUpkeepsDatatablesGeneralExpenses($year, $month, $trimester){
            $db = new DbHandler;
            $year = cleanStr($year);
            $month = cleanStr($month);
            $trimester = cleanStr($trimester);

            $where = "u.leavingDate IS NULL AND u.car = c.ID AND c.leavingDate IS NULL AND u.kms IS NOT NULL AND u.cost IS NOT NULL";

            if($year > 0){
                $where .= " AND FROM_UNIXTIME(u.date, '%Y') = " . $year;
            }
            
            if($month > 0){
                $where .= " AND FROM_UNIXTIME(u.date, '%m') = " . $month;
            }
        
            switch($trimester){
                case 1:
                    $where .= " AND FROM_UNIXTIME(u.date, '%m') > 0 AND FROM_UNIXTIME(u.date, '%m') < 4";
                    break;
                case 2:
                    $where .= " AND FROM_UNIXTIME(u.date, '%m') > 3 AND FROM_UNIXTIME(u.date, '%m') < 7";
                    break;
                case 3:
                    $where .= " AND FROM_UNIXTIME(u.date, '%m') > 6 AND FROM_UNIXTIME(u.date, '%m') < 10";
                    break;
                case 4:
                    $where .= " AND FROM_UNIXTIME(u.date, '%m') > 9 AND FROM_UNIXTIME(u.date, '%m') < 13";
                    break;
            }

            $result = $db->query("SELECT u.ID, c.brand, c.licensePlate, u.date, u.kms, u.cost, u.engineOil,  u.oilFilter, u.fuelFilter, u.airFilter, u.boxATF, u.sparkPlug, u.coolingLiquid, u.brakesLiquid, u.battery,
                                         u.frontBrakes, u.rearBrakes, u.timingBelt, u.converterATF, u.differentialATF, u.otherFilters
                                    FROM Upkeeps u, Cars c  
                                    WHERE $where
                                    GROUP BY u.date
                                    ORDER BY u.date ASC");
            return mysqli_num_rows($result) == 0 ? array() : $db->resultToArrayValue($result);
        }

        /**
         * Lista los eventos
         * 
         * @return @array
         */
        public function listUpkeepsDatatablesGenExpenses($year, $month, $trimester, $vehicle){
            $db = new DbHandler;

            $year = cleanStr($year);
            $month = cleanStr($month);
            $trimester = cleanStr($trimester);
            $vehicle = cleanStr($vehicle);

            $where = "";

            if($year > 0){
                $where .= " AND FROM_UNIXTIME(u.date, '%Y') = " . $year;
            }
            
            if($month > 0){
                $where .= " AND FROM_UNIXTIME(u.date, '%m') = " . $month;
            }
        
            switch($trimester){
                case 1:
                    $where .= " AND FROM_UNIXTIME(u.date, '%m') > 0 AND FROM_UNIXTIME(u.date, '%m') < 4";
                    break;
                case 2:
                    $where .= " AND FROM_UNIXTIME(u.date, '%m') > 3 AND FROM_UNIXTIME(u.date, '%m') < 7";
                    break;
                case 3:
                    $where .= " AND FROM_UNIXTIME(u.date, '%m') > 6 AND FROM_UNIXTIME(u.date, '%m') < 10";
                    break;
                case 4:
                    $where .= " AND FROM_UNIXTIME(u.date, '%m') > 9 AND FROM_UNIXTIME(u.date, '%m') < 13";
                    break;
            }

            if($vehicle > 0){
                $where .= " AND c.ID = $vehicle";
            }

            $result = $db->query("  SELECT  u.ID, CONCAT(c.brand, ' ', c.model) as car, c.licensePlate, u.date, u.kms, u.cost, u.engineOil, u.oilFilter, u.fuelFilter, u.airFilter, u.boxATF, u.sparkPlug, u.coolingLiquid, u.brakesLiquid, u.battery, u.frontBrakes, u.rearBrakes, u.timingBelt, u.converterATF, u.differentialATF, u.otherFilters
                                    FROM    Upkeeps u, Cars c  
                                    WHERE   u.leavingDate IS NULL AND u.car = c.ID AND c.leavingDate IS NULL AND u.kms IS NOT NULL AND u.cost IS NOT NULL $where");
            
            return mysqli_num_rows($result) > 0 ? $db->resultToArrayValue($result) : array();
        }
        
        /**
         * Deletes an ITV
         * 
         * @param array $data Datos
         * @return array
         */
        public function deleteItv($data){
            $db = new DbHandler;

            $id = cleanStr($data['id']);
            $deleteDate = date('Y-m-d H:i:s');
      
            $result = $db->query("  SELECT  ci.car, ci.dateNext
                                    FROM    Cars_ITV ci
                                    WHERE   ci.ID = $id
            ");

            if(mysqli_num_rows($result) > 0){
                $found = $db->resultToArray($result)[0];

                $car = $found['car'];
                $dateNext = $found['dateNext'];

                $eventDate = date('Y-m-d H:i:s', strtotime('-15 days', $dateNext));

                $db->query("UPDATE  Events
                            SET     leavingDate = '$deleteDate'
                            WHERE   car = $car AND
                                    type ='6' AND
                                    start = '$eventDate' AND
                                    leavingDate IS NULL
                ");

                $db->query("UPDATE  Cars_ITV
                            SET     leavingDate = '$deleteDate'
                            WHERE   ID = $id
                ");
            }
            
            return true;
        }
    }
?>