<?php
	require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

	class Refuel{
        /**
         * Añade un nuevo repostaje
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['car'] = cleanStr($data['car']);
            $data['gasStation'] = cleanStr($data['gasStation']);
            $data['totalCost'] = cleanStr($data['totalCost']);
            $data['kms'] = cleanStr($data['kms']);
            $data['date'] = cleanStr($data['date']);
            $data['liters'] = cleanStr($data['liters']);
            $data['kmsTravelled'] = cleanStr($data['kmsTravelled']);
            $data['car'] = cleanStr($data['car']);

            if($data['date'] == null ||  $data['date'] == ''){
                $date = time();
            }else{
                $date = $data['date'];
                $currentDate = time();
            }

            $db->query("INSERT INTO Refuel( 
                            car, date, gasStation, totalCost, kmsRefuel, 
                            liters, kmsTravelled, pricePerLiter, consumptionLKM, costPerKm,leavingDate, currentDate
                        )
                        VALUES (
                            " . $data['car'] . ", ". $date .", '" . $data['gasStation'] . "', " . $data['totalCost'] . ", " . $data['kms'] . ", " 
                            . $data['liters'] . ", ". $data['kmsTravelled'].", null, null, null, null, ".$currentDate."
                        )
            ");

            return true;
        }

        /**
         * Obtiene los datos de la última vez que repostó
         * 
         * @param int $id
         * 
         * @return array $lastRefuel
         */
        public function getLastRefuel($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT      *
                                    FROM        Refuel
                                    WHERE       car = " . $id . " AND 
                                                leavingDate is NULL 
                                    ORDER BY    currentDate DESC 
                                    LIMIT       1");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;           
        }        

        /**
         * Obtiene el total por mes
         * 
         * @param int $vehicle Vehículo
         * @param int $year Año
         * @param int $month Mes
         * @return array $lastRefuel
         */
        public function getMonthTotal($vehicle, $year, $month){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);
            $year = cleanStr($year);
            $month = cleanStr($month);

            $result = $db->query("  SELECT  SUM(r.totalCost) as totalCost, SUM(r.liters) as liters, SUM(r.kmsTravelled) as kmsTravelled 
                                    FROM    Refuel r
                                    WHERE   r.car = $vehicle AND
                                            YEAR(FROM_UNIXTIME(r.date)) = $year AND
                                            MONTH(FROM_UNIXTIME(r.date)) = $month AND
                                            r.leavingDate IS NULL");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;           
        }
        
        /**
         * Obtiene el ultimo km
         * 
         * @param int $vehicle Vehículo
         * @param int $year Año
         * @param int $month Mes
         * @return array $lastRefuel
         */
        public function getlLastKmRefuel($vehicle, $year, $month){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);
            $year = cleanStr($year);
            $month = cleanStr($month);

            $result = $db->query("  SELECT  r.kmsRefuel
                                    FROM    Refuel r
                                    WHERE   r.car = $vehicle AND
                                            YEAR(FROM_UNIXTIME(r.date)) = $year AND
                                            MONTH(FROM_UNIXTIME(r.date)) = $month AND
                                            r.leavingDate IS NULL ORDER BY currentDate DESC LIMIT  1 ");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;           
        }     

        /**
         * Obtiene los datos de un repostaje
         * 
         * @param int $id
         * 
         * @return array $lastRefuel
         */
        public function read($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  *
                                    FROM    Refuel
                                    WHERE   ID = " . $id . " AND 
                                            leavingDate is NULL");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;           
        }

        /**
         * Modifica los datos de un repostaje
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['gasStation'] = cleanStr($data['gasStation']);
            $data['totalCost'] = cleanStr($data['totalCost']);
            $data['liters'] = cleanStr($data['liters']);
            $data['date'] = cleanStr($data['date']);
            $data['ID'] = cleanStr($data['ID']);

            $db->query(" UPDATE  Refuel
                        SET     gasStation = '" . $data['gasStation'] . "',
                                totalCost = " . $data['totalCost'] . ",                                        
                                liters = " . $data['liters'] . ",                                        
                                date = '" . $data['date'] . "'                                        
                        WHERE   ID = " . $data['ID'] . "");

            return true;
        }

        /**
         * Elimina un mantenimiento
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function delete($id,$vehicle){
            $db = new DbHandler;            

            $id = cleanStr($id);
            $vehicle = cleanStr($vehicle);

            $resultDelete = $db->query("    UPDATE  Refuel
                                            SET     leavingDate = " . time() . "
                                            WHERE   ID = " . $id . "");
            if($resultDelete){
                //obtener los KM al repostar del último repostaje antes de la fecha de baja del  actual
                $lastKm = $db->query("  SELECT      kmsRefuel FROM Refuel 
                                        WHERE       car = $vehicle AND 
                                                    currentDate < (  
                                                        SELECT  currentDate 
                                                        FROM    Refuel 
                                                        WHERE   ID = $id
                                                    ) AND
                                                    leavingDate IS NULL 
                                        ORDER BY    currentDate DESC 
                                        LIMIT       1");
                if(mysqli_num_rows($lastKm) > 0){
                    $lastKm = $db->resultToArray($lastKm);
                }else{
                    $lastKm = null;
                }                    
                
                if($lastKm == null){
                    $lastKm =  $db->query(" SELECT  kms as kmsRefuel 
                                            FROM    Cars
                                            WHERE   ID = $vehicle AND 
                                                    leavingDate is NULL");
                    
                    if(mysqli_num_rows($lastKm) > 0){
                        $lastKm = $db->resultToArray($lastKm);                        
                    }
                }

                //Obtener los repostajes posteriores a la fecha de baja del actual
                $array_nextKms = $db->query("   SELECT  ID, kmsRefuel 
                                                FROM    Refuel 
                                                WHERE   car = $vehicle AND 
                                                        currentDate > (
                                                            SELECT  currentDate 
                                                            FROM    Refuel 
                                                            WHERE   ID = $id
                                                        ) AND
                                                        leavingDate IS NULL"); 

                if(mysqli_num_rows($array_nextKms) > 0){
                    $array_nextKms = $db->resultToArray($array_nextKms);
                }else{
                    $array_nextKms = null;
                }

                if($array_nextKms != null){
                    for($i = 0; $i < count($array_nextKms); $i++){
                        $id_row = $array_nextKms[$i]['ID'];                        
                        $kmr = $array_nextKms[$i]['kmsRefuel']; //kilometros repostaje
                        $kmTrav = $kmr - $lastKm[0]['kmsRefuel']; //km recorridos
                        $db->query(" UPDATE  Refuel SET kmsTravelled = $kmTrav WHERE   ID = $id_row");
                        $lastKm[0]['kmsRefuel'] = $kmr;                        
                    }
                }

                return true;
            }else{
                return false;
            }
        }

        /**
         * Obtiene el primer repostaje
         * 
         * @param int $vehicle Vehículo
         * @return int Año
         */
        public function getFirstRefuel($vehicle){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);

            $result = $db->query("  SELECT      r.date
                                    FROM        Refuel r
                                    WHERE       r.car = $vehicle AND
                                                r.leavingDate IS NULL
                                    ORDER BY    r.date ASC");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['date'] : null;    
        }

        /**
         * Obtiene todos los repostajes de un coche en un mes
         * 
         * @param int $vehicle Vehículo
         * @param int $year Año
         * @param int $month Mes
         * @return array $lastRefuel
         */
        public function getAllRefuelbyMonth($vehicle, $year, $month){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);
            $year = cleanStr($year);
            $month = cleanStr($month);

            $result = $db->query("  SELECT  totalCost, liters, kmsTravelled
                                    FROM    Refuel 
                                    WHERE   car = $vehicle AND
                                            YEAR(FROM_UNIXTIME(date)) = $year AND
                                            MONTH(FROM_UNIXTIME(date)) = $month AND
                                            leavingDate IS NULL");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;           
        }   
        
        /**
         * Obtiene el total acumulado de gasto y litros de un coche
         * 
         * @param int $vehicle Vehículo
         * @param int $year Año
         * @param int $month Mes
         * @return array $lastRefuel
         */
        public function getTotalAcumulate($vehicle){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);
            
            $result = $db->query("  SELECT  SUM(r.totalCost) as totalCostAcum, SUM(r.liters) as litersAcum 
                                    FROM    Refuel r
                                    WHERE   r.car = $vehicle AND
                                            r.leavingDate IS NULL");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;           
        }
    }
?>