<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Failures{
        /**
         * Añade una nueva avería
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['car'] = cleanStr($data['car']);
            $data['garage'] = cleanStr($data['garage']);
            $data['failureDate'] = cleanStr($data['failureDate']);
            $data['kms'] = cleanStr($data['kms']);
            $data['repairDate'] = cleanStr($data['repairDate']);
            $data['cost'] = cleanStr($data['cost']);
            $data['deliveryNote'] = cleanEditor($data['deliveryNote']);
            $data['receipt'] = cleanStr($data['receipt']);
            $data['repairWarranty'] = cleanStr($data['repairWarranty']);
            $data['repairMaterial'] = cleanStr($data['repairMaterial']);
            $data['failureDescription'] = cleanStr($data['failureDescription']);
            $data['repairDescription'] = cleanStr($data['repairDescription']);
            $data['usedMaterials'] = cleanStr($data['usedMaterials']);

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Failures 
                                    WHERE   extraID = '$extraID'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Failures 
                                        WHERE   extraID = '$extraID'");
            }

            if(strlen($data['repairWarranty']) == 0){
                $data['repairWarranty'] = 'null';
            }

            if(strlen($data['repairMaterial']) == 0){
                $data['repairMaterial'] = 'null';
            }

            $db->query("INSERT INTO Failures(   car, garage, failureDate, kms, repairDate, cost, 
                                                deliveryNote, receipt, repairWarranty, repairMaterial,
                                                failureDescription, repairDescription, usedMaterials,
                                                extraID)
                        VALUES( " . $data['car'] . ", " . $data['garage'] . ", 
                                " . $data['failureDate'] . ", " . $data['kms'] . ", 
                                " . $data['repairDate'] . ", " . $data['cost'] . ", 
                                '" . $data['deliveryNote'] . "', '" . $data['receipt'] . "', 
                                " . $data['repairWarranty'] . ", " . $data['repairMaterial'] . ",
                                '" . $data['failureDescription'] . "', '" . $data['repairDescription'] . "',
                                '" . $data['usedMaterials'] . "', '$extraID')");

            $result = $db->query("  SELECT  f.ID
                                    FROM    Failures f
                                    WHERE   f.extraID = '$extraID'");

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                $failure = $db->query("  SELECT  c.licensePlate, f.failureDate as date, f.ID
                                        FROM    Failures f, Cars c
                                        WHERE   f.car = c.ID AND
                                                f.extraID = '$extraID'");

                $failure = $db->resultToArray($failure)[0];
                $name = $failure['licensePlate'];
                $start = date("Y-m-d", $failure['date']) . " 00:00:00";
                $end = date("Y-m-d", $failure['date']) . " 23:59:59";

                require_once($_SESSION['basePath'] . "model/events.php");
                $events = new Events;

                $carID = $data['car'];
                $eventExtraID = $events->create(array("status" => 4, "name" => "Avería matrícula " . $name, "start" => $start,
                                            "end" => $end, "car" => $carID, "reminder" => 1, "cremation" => 0, "type" => 3, "allDay" => 1))[1];

                $event = $db->query("   SELECT  ID
                                        FROM    Events
                                        WHERE   extraID = '$eventExtraID'");

                $event = $db->resultToArray($event)[0]['ID'];

                $result = $db->query("  UPDATE  Failures
                                        SET     event = $event
                                        WHERE   ID = " . $failure['ID']);

                return $result;
            }
        }

        /**
         * Obtiene los datos de una avería
         * 
         * @param array $data
         * 
         * @return array
         */
        public function read($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT  f.*, g.name as garageName
                                    FROM    Failures f, Garages g
                                    WHERE   f.garage = g.ID AND
                                            f.ID = " . $data['ID'] . "");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Modifica los datos de una avería
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);
            $data['garage'] = cleanStr($data['garage']);
            $data['failureDate'] = cleanStr($data['failureDate']);
            $data['kms'] = cleanStr($data['kms']);
            $data['repairDate'] = cleanStr($data['repairDate']);
            $data['cost'] = cleanStr($data['cost']);
            $data['deliveryNote'] = cleanEditor($data['deliveryNote']);
            $data['receipt'] = cleanStr($data['receipt']);
            $data['repairWarranty'] = cleanStr($data['repairWarranty']);
            $data['repairMaterial'] = cleanStr($data['repairMaterial']);
            $data['failureDescription'] = cleanStr($data['failureDescription']);
            $data['repairDescription'] = cleanStr($data['repairDescription']);
            $data['usedMaterials'] = cleanStr($data['usedMaterials']);

            if(strlen($data['repairWarranty']) == 0){
                $data['repairWarranty'] = 'null';
            }

            if(strlen($data['repairMaterial']) == 0){
                $data['repairMaterial'] = 'null';
            }

            $db->query("UPDATE  Failures
                        SET     garage = " . $data['garage'] . ",
                                failureDate = " . $data['failureDate'] . ",
                                kms = " . $data['kms'] . ",
                                repairDate = " . $data['repairDate'] . ",
                                cost = " . $data['cost'] . ",
                                deliveryNote = '" . $data['deliveryNote'] . "',
                                receipt = '" . $data['receipt'] . "',
                                repairWarranty = " . $data['repairWarranty'] . ",
                                repairMaterial = " . $data['repairMaterial'] . ",
                                failureDescription = '" . $data['failureDescription'] . "',
                                repairDescription = '" . $data['repairDescription'] . "',
                                usedMaterials = '" . $data['usedMaterials'] . "'
                        WHERE   ID = " . $data['ID']);

           
            $result = $db->query("  SELECT  f.event
                                    FROM    Failures f
                                    WHERE   f.ID = " . $data['ID']);

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                $event = $db->resultToArray($result)[0]['event'];

                $start = date('Y-m-d', $data['failureDate']) . ' 00:00:00';
                $end = date('Y-m-d', $data['failureDate']) . ' 23:59:59';

                $db->query("UPDATE  Events e
                            SET     e.start = '$start',
                                    e.end = '$end',
                                    e.status = 4
                            WHERE   e.ID = $event");

                return true;
            }
        }

        /**
         * Elimina una avería
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $db->query("UPDATE  Failures
                        SET     leavingDate = " . time() . "
                        WHERE   ID = " . $data['ID']);

            
            $result = $db->query("  SELECT  f.event
                                    FROM   Failures f
                                    WHERE  f.ID = " . $data['ID']);

            if(mysqli_num_rows($result) == 0){
                return false;
            }else{
                $event = $db->resultToArray($result)[0]['event'];

                $db->query("UPDATE  Events e
                            SET     e.leavingDate = '" . date('Y-m-d H:i:s') . "'
                            WHERE   e.ID = $event");

                return true;
            }
        }

        /**
         * Obtiene los años de los mantenimientos
         * 
         * @return array
         */
        public function getYears(){
            $db = new DbHandler;

            $result = $db->query("  SELECT DISTINCT (FROM_UNIXTIME(date, '%Y')) as year
                                    FROM             Upkeeps
                                    WHERE            cost IS NOT NULL AND leavingDate IS NULL
                                    ORDER BY         year DESC");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Obtiene los años de los mantenimientos
         * 
         * @return array
         */
        public function getTotalImports($year, $month, $trimester, $vehicle){
            $db = new DbHandler;

            $year = cleanStr($year);
            $month = cleanStr($month);
            $trimester = cleanStr($trimester);
            $vehicle = cleanStr($vehicle);

            $totalResult = array();
            
            $where = "";
            //FAILURES
            if($year > 0){
                $where .= " AND FROM_UNIXTIME(f.failureDate, '%Y') = " . $year;
            }
            if($month > 0){
                $where .= " AND FROM_UNIXTIME(f.failureDate, '%m') = " . $month;
            }
        
            switch($trimester){
                case 1:
                    $where .= " AND FROM_UNIXTIME(f.failureDate, '%m') > 0 AND FROM_UNIXTIME(f.failureDate, '%m') < 4";
                break;
                case 2:
                    $where .= " AND FROM_UNIXTIME(f.failureDate, '%m') > 3 AND FROM_UNIXTIME(f.failureDate, '%m') < 7";
                break;
                case 3:
                    $where .= " AND FROM_UNIXTIME(f.failureDate, '%m') > 6 AND FROM_UNIXTIME(f.failureDate, '%m') < 10";
                break;
                case 4:
                    $where .= " AND FROM_UNIXTIME(f.failureDate, '%m') > 9 AND FROM_UNIXTIME(f.failureDate, '%m') < 13";
                break;
            }

            if($vehicle > 0){
                $where .= " AND c.ID = $vehicle";
            }

            $result = $db->query("  SELECT  SUM(f.cost) as total
                                    FROM    Failures f, Garages g, Cars c
                                    WHERE   f.leavingDate IS NULL AND f.car = c.ID AND f.garage = g.ID AND c.leavingDate IS NULL $where");
            
            if(mysqli_num_rows($result) > 0){
                $totalFailures = $db->resultToArray($result)[0]['total'];
                if($totalFailures == null){
                    $totalFailures = 0;
                }
            }else{
                $totalFailures = 0;
            }

            $totalResult['failures'] = $totalFailures;

            //UPKEEPS
            $where = '';
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

            $result = $db->query("  SELECT SUM(u.cost) as total
                                    FROM Upkeeps u, Cars c  
                                    WHERE u.leavingDate IS NULL AND u.car = c.ID AND c.leavingDate IS NULL AND u.kms IS NOT NULL AND u.cost IS NOT NULL $where");

            if(mysqli_num_rows($result) > 0){
                $totalUpkeeps = $db->resultToArray($result)[0]['total'];
                if($totalUpkeeps == null){
                    $totalUpkeeps = 0;
                }
            }else{
                $totalUpkeeps = 0;
            }

            $totalResult['upkeeps'] = $totalUpkeeps;

            //ITV
            $where = "";
            if($year > 0){
                $where .= " AND FROM_UNIXTIME(citv.datePrev, '%Y') = " . $year;
            }
            if($month > 0){
                $where .= " AND FROM_UNIXTIME(citv.datePrev, '%m') = " . $month;
            }
        
            switch($trimester){
                case 1:
                    $where .= " AND FROM_UNIXTIME(citv.datePrev, '%m') > 0 AND FROM_UNIXTIME(citv.datePrev, '%m') < 4";
                break;
                case 2:
                    $where .= " AND FROM_UNIXTIME(citv.datePrev, '%m') > 3 AND FROM_UNIXTIME(citv.datePrev, '%m') < 7";
                break;
                case 3:
                    $where .= " AND FROM_UNIXTIME(citv.datePrev, '%m') > 6 AND FROM_UNIXTIME(citv.datePrev, '%m') < 10";
                break;
                case 4:
                    $where .= " AND FROM_UNIXTIME(citv.datePrev, '%m') > 9 AND FROM_UNIXTIME(citv.datePrev, '%m') < 13";
                break;
            }

            if($vehicle > 0){
                $where .= " AND c.ID = $vehicle";
            }

            $result = $db->query("  SELECT SUM(citv.cost) as total
                                    FROM Cars_ITV citv, Cars c
                                    WHERE citv.leavingDate IS NULL AND citv.car = c.ID AND c.leavingDate IS NULL $where");

            if(mysqli_num_rows($result) > 0){
                $totalITV = $db->resultToArray($result)[0]['total'];
                if($totalITV == null){
                    $totalITV = 0;
                }
            }else{
                $totalITV = 0;
            }
            $totalResult['itv'] = $totalITV;

            //INSURANCE
            $where = "";
            if($year > 0){
                $where .= " AND FROM_UNIXTIME(ci.createDate, '%Y') = " . $year;
            }
            if($month > 0){
                $where .= " AND FROM_UNIXTIME(ci.createDate, '%m') = " . $month;
            }
        
            switch($trimester){
                case 1:
                    $where .= " AND FROM_UNIXTIME(ci.createDate, '%m') > 0 AND FROM_UNIXTIME(ci.createDate, '%m') < 4";
                break;
                case 2:
                    $where .= " AND FROM_UNIXTIME(ci.createDate, '%m') > 3 AND FROM_UNIXTIME(ci.createDate, '%m') < 7";
                break;
                case 3:
                    $where .= " AND FROM_UNIXTIME(ci.createDate, '%m') > 6 AND FROM_UNIXTIME(ci.createDate, '%m') < 10";
                break;
                case 4:
                    $where .= " AND FROM_UNIXTIME(ci.createDate, '%m') > 9 AND FROM_UNIXTIME(ci.createDate, '%m') < 13";
                break;
            }

            if($vehicle > 0){
                $where .= " AND c.ID = $vehicle";
            }

            $result = $db->query("  SELECT SUM(ci.amount) as total
                                    FROM Cars_Insurance ci, Cars c
                                    WHERE ci.leavingDate IS NULL AND ci.car = c.ID AND c.leavingDate IS NULL $where");

            if(mysqli_num_rows($result) > 0){
                $totalInsurance = $db->resultToArray($result)[0]['total'];
                if($totalInsurance == null){
                    $totalInsurance = 0;
                }
                if($totalInsurance == null){
                    $totalInsurance = 0;
                }
            }else{
                $totalInsurance = 0;
            }

            $totalResult['insurance'] = $totalInsurance;

            //REFUEL
            $where = "";
            if($year > 0){
                $where .= " AND FROM_UNIXTIME(r.date, '%Y') = " . $year;
            }
            if($month > 0){
                $where .= " AND FROM_UNIXTIME(r.date, '%m') = " . $month;
            }

            switch($trimester){
                case 1:
                    $where .= " AND FROM_UNIXTIME(r.date, '%m') > 0 AND FROM_UNIXTIME(r.date, '%m') < 4";
                break;
                case 2:
                    $where .= " AND FROM_UNIXTIME(r.date, '%m') > 3 AND FROM_UNIXTIME(r.date, '%m') < 7";
                break;
                case 3:
                    $where .= " AND FROM_UNIXTIME(r.date, '%m') > 6 AND FROM_UNIXTIME(r.date, '%m') < 10";
                break;
                case 4:
                    $where .= " AND FROM_UNIXTIME(r.date, '%m') > 9 AND FROM_UNIXTIME(r.date, '%m') < 13";
                break;
            }

            if($vehicle > 0){
                $where .= " AND c.ID = $vehicle";
            }

            $result = $db->query("  SELECT SUM(r.totalCost) as total
                                    FROM Refuel r, Cars c
                                    WHERE r.leavingDate IS NULL AND r.car = c.ID AND c.leavingDate IS NULL $where");

            if(mysqli_num_rows($result) > 0){
                $totalRefuel = $db->resultToArray($result)[0]['total'];
                if($totalRefuel == null){
                    $totalRefuel = 0;
                }
            }else{
                $totalRefuel = 0;
            }
            $totalResult['refuel'] = $totalRefuel;

            return $totalResult;
        }

        /**
         * Obtiene los años de los mantenimientos
         * 
         * @return array
         */
        public function listFailuresDatatables($year, $month, $trimester, $vehicle){
            $db = new DbHandler;

            $year = cleanStr($year);
            $month = cleanStr($month);
            $trimester = cleanStr($trimester);
            $vehicle = cleanStr($vehicle);

            $where = "";
            if($year > 0){
                $where .= " AND FROM_UNIXTIME(f.failureDate, '%Y') = " . $year;
            }
            
            if($month > 0){
                $where .= " AND FROM_UNIXTIME(f.failureDate, '%m') = " . $month;
            }
        
            switch($trimester){
                case 1:
                    $where .= " AND FROM_UNIXTIME(f.failureDate, '%m') > 0 AND FROM_UNIXTIME(f.failureDate, '%m') < 4";
                break;
                case 2:
                    $where .= " AND FROM_UNIXTIME(f.failureDate, '%m') > 3 AND FROM_UNIXTIME(f.failureDate, '%m') < 7";
                break;
                case 3:
                    $where .= " AND FROM_UNIXTIME(f.failureDate, '%m') > 6 AND FROM_UNIXTIME(f.failureDate, '%m') < 10";
                break;
                case 4:
                    $where .= " AND FROM_UNIXTIME(f.failureDate, '%m') > 9 AND FROM_UNIXTIME(f.failureDate, '%m') < 13";
                break;
            }

            if($vehicle > 0){
                $where .= " AND c.ID = $vehicle";
            }

            $result = $db->query("  SELECT  f.ID, CONCAT(c.brand, ' ', c.model) as car, c.licensePlate, g.name, f.failureDate, f.repairDate, f.kms, f.cost 
                                    FROM    Failures f, Garages g, Cars c
                                    WHERE   f.leavingDate IS NULL AND f.car = c.ID AND f.garage = g.ID AND c.leavingDate IS NULL $where");

            return mysqli_num_rows($result) > 0 ? $db->resultToArrayValue($result) : array();
        }
    }
?>