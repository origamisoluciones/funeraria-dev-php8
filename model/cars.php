<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Cars{
        /**
         * Comprueba si un vehículo existe
         * 
         * @param int $vehicle Id del vehículo
         * @return bool
         */
        function existsVehicle($vehicle){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);

            $result = $db->query("  SELECT  c.ID
                                    FROM    Cars c
                                    WHERE   c.ID = $vehicle AND
                                            c.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? false : true;
        }

        /**
         * Añade un coche
         *
         * @param array $data Datos del coche
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['licensePlate'] = cleanStr($data['licensePlate']);
            $data['imei'] = cleanStr($data['imei']);
            $data['brand'] = cleanStr($data['brand']);
            $data['model'] = cleanStr($data['model']);
            $data['kms'] = cleanStr($data['kms']);
            $data['maintenance'] = cleanStr($data['maintenance']);
            $data['chassis'] = cleanStr($data['chassis']);
            $data['type'] = cleanStr($data['type']);
            $data['external'] = cleanStr($data['external']);
            $data['showService'] = cleanStr($data['showService']);
            $data['drivingService'] = cleanStr($data['drivingService']);
           
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Cars 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Cars 
                                        WHERE   extraID = '" . $extraID . "'");
            }

            $result = $db->query("  INSERT INTO Cars(licensePlate, imei, brand, model, kms, maintenance,
                                                        chassis, type, external, showService, drivingService, entryDate, extraID) 
                                    VALUES( '" . $data['licensePlate'] . "', '" . $data['imei'] ."', '" . $data['brand'] ."', 
                                            '" . $data['model'] . "', '" . $data['kms'] . "', 
                                            " . $data['maintenance'] . ", '" . $data['chassis'] . "',
                                            " . $data['type'] . ", " . $data['external'] . ", " . $data['showService'] . ", " . $data['drivingService'] . ",
                                            '" . date('Y-m-d H:i:s') . "', '" . $extraID . "')");

            if($result){
                require_once($_SESSION['basePath'] . "model/upkeeps.php");

                $result = $db->query("  SELECT  ID
                                        FROM    Cars
                                        WHERE   extraID = '" . $extraID . "'");
                
                $car = $db->resultToArray($result)[0]['ID'];
                $date = time();                

                $res = $db->query(" INSERT INTO Cars_Km( car, kms, date) 
                                    VALUES(" . $car . ", '" . $data['kms'] . "', " . $date . " ) ");               

                $upkeeps = new Upkeeps();
                $upkeeps->createInterval(array('vehicle' => $car));

                return true;
            }
        }

        /**
         * Obtiene los datos de un coche
         *
         * @param array $data ID del coche
         * @return array
         */
        public function read($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            $result = $db->query("  SELECT    *
                                    FROM      Cars
                                    WHERE     ID = " . $data['ID']);

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
        * Obtiene los coches por matricula
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByName($name){
            $db = new DbHandler;

            $name = cleanStr($name);
            
            $result = $db->query("SELECT ID, licensePlate, brand, model
                                  FROM Cars 
                                  WHERE external = 0 AND leavingDate IS NULL AND (licensePlate LIKE '%". $name ."%' OR brand LIKE '%". $name ."%' OR model LIKE '%". $name ."%')
                                  ORDER BY brand");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
         * Obtiene los datos de un coche
         *
         * @param array $data ID del coche
         * @return array
         */
        public function readCar($vehicleID){
            $db = new DbHandler;

            $vehicleID = cleanStr($vehicleID);

            $result = $db->query("  SELECT    c.licensePlate, c.brand, c.model, ck.kms
                                    FROM      Cars c, Cars_Km ck
                                    WHERE     ck.car = c.ID AND c.ID = " . $vehicleID ."
                                    ORDER BY ck.kms DESC
                                    LIMIT 1");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }


        /**
         * Modifica los datos de un coche
         *
         * @param array $data Datos del coche
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['licensePlate'] = cleanStr($data['licensePlate']);
            $data['imei'] = cleanStr($data['imei']);
            $data['brand'] = cleanStr($data['brand']);
            $data['model'] = cleanStr($data['model']);
            $data['maintenance'] = cleanStr($data['maintenance']);
            $data['chassis'] = cleanStr($data['chassis']);
            $data['type'] = cleanStr($data['type']);
            $data['external'] = cleanStr($data['external']);
            $data['showService'] = cleanStr($data['showService']);
            $data['drivingService'] = cleanStr($data['drivingService']);
            $data['ID'] = cleanStr($data['ID']);

            return $db->query(" UPDATE  Cars
                                SET     licensePlate = '" . $data['licensePlate'] . "',
                                        imei = '" . $data['imei'] . "',
                                        brand = '" . $data['brand'] . "',
                                        model = '" . $data['model'] . "',                                        
                                        maintenance = " . $data['maintenance'] . ",
                                        chassis = '" . $data['chassis'] . "',
                                        type = " . $data['type'] . ",
                                        external = " . $data['external'] . ",
                                        showService = " . $data['showService'] . ",
                                        drivingService = " . $data['drivingService'] . "
                                WHERE   ID = " . $data['ID']);
        }

        /**
         * Elimina un coche
         *
         * @param array $data ID del coche
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data['ID'] = cleanStr($data['ID']);

            //Eliminamos los eventos para ese coche
            $db->query(" UPDATE  Events 
                         SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                         WHERE   car = " . $data['ID']);


            //Eliminamos los mantenimientos para ese coche
            $db->query(" UPDATE  Upkeeps 
                        SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                        WHERE   car = " . $data['ID']);

            //Eliminamos los intervalos de mantenimiento para ese coche
            $db->query(" UPDATE  Upkeep_Intervals 
                         SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                         WHERE   car = " . $data['ID']);

            //Eliminamos las averias para ese coche
            $db->query(" UPDATE  Failures 
                         SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                         WHERE   car = " . $data['ID']);


            return $db->query(" UPDATE  Cars 
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "' 
                                WHERE   ID = " . $data['ID']);
        }

        /**
        * Obtiene los coches
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $result = $db->query("SELECT *
                                  FROM Cars 
                                  WHERE Cars.leavingDate = null");
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Obtiene los coches por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByLicensePlate($data){
            $db = new DbHandler;

            $data = cleanStr($data);
            
            $result = $db->query("SELECT ID, licensePlate, brand, model
                                  FROM Cars
                                  WHERE leavingDate IS NULL AND (licensePlate LIKE '%". $data ."%' OR
                                        brand LIKE '%". $data ."%' OR 
                                        model LIKE '%". $data ."%')
                                ORDER BY brand");
            
            if(mysqli_num_rows($result) == 0){
                return [];
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene los coches por nombre
        *
        * @param string $name
        *
        * @return array
        */
        public function searchByLicensePlatev2($data, $expedient){
            $db = new DbHandler;

            $data = cleanStr($data);
            $expedient = cleanStr($expedient);

            require_once($_SESSION['basePath'] . "model/expedients.php");

            $expedients = new Expedients;

            $funeralDate = $expedients->getFuneralDate($expedient);
            $funeralTime = $expedients->getFuneralTime($expedient);
            
            $result = $db->query("  SELECT      c.ID, c.licensePlate, c.brand, c.model
                                    FROM        Cars as c
                                    LEFT JOIN   Services_Cars as sc ON sc.car = c.ID
                                    WHERE       c.leavingDate IS NULL AND (c.licensePlate LIKE '%". $data ."%' OR
                                                c.brand LIKE '%". $data ."%' OR 
                                                c.model LIKE '%". $data ."%') 
                                                AND NOT EXISTS(
                                                    SELECT  sc.car
                                                    FROM    Services_Cars sc 
                                                    WHERE   c.ID = sc.car AND
                                                            sc.service = " . $expedient . "
                                                ) AND c.showService = 1
                                    ORDER BY c.brand");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                $cars = $db->resultToArray($result);

                $toShow = array();
                foreach($cars as $car){
                    $result = $db->query("  SELECT  e.number, c.ID, c.licensePlate, c.brand, c.model
                                            FROM    Services_Cars sc, Expedients e, Cars c
                                            WHERE   sc.service = e.expedientID
                                                AND sc.car = c.ID
                                                AND e.funeralDate = '$funeralDate'
                                                AND sc.car = {$car['ID']}
                                                AND (UNIX_TIMESTAMP(TIME('$funeralTime')) BETWEEN UNIX_TIMESTAMP(TIME(e.funeralTime)) AND (UNIX_TIMESTAMP(TIME(e.funeralTime)) + TIME(3) * 60 * 60)
                                                OR  (UNIX_TIMESTAMP(TIME('$funeralTime')) + TIME(3) * 60 * 60) BETWEEN UNIX_TIMESTAMP(TIME(e.funeralTime)) AND (UNIX_TIMESTAMP(TIME(e.funeralTime)) + TIME(3) * 60 * 60))");

                    if(mysqli_num_rows($result) == 0){
                        $car['busy'] = 0;
                        $car['number'] = '';
                    }else{
                        $car['busy'] = 1;
                        $number = $db->resultToArray($result)[0]['number'];
                        $car['number'] = ' - ' . $number;
                    }

                    array_push($toShow, $car);
                }

                foreach($toShow as $key => $value){
                    foreach($toShow as $key2 => $value2){
                        if($value['ID'] == $value2['ID'] && $key != $key2){
                            unset($toShow[$key]);
                        }
                    }
                }

                return $toShow;
                // return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene el historial de KMS de un coche
        *
        * @param string $name
        *
        * @return array
        */
        public function listKms($id){
            $db = new DbHandler;

            $id = cleanStr($id);
            
            $result = $db->query("SELECT ID, kms, date
                                  FROM Cars_Km
                                  WHERE $id = car AND leavingDate IS NULL
                                  ORDER BY date DESC, kms DESC");
            
            if(mysqli_num_rows($result) == 0){
                return null;
            }else{
                return $db->resultToArray($result);
            }
        }

        /**
        * Obtiene el historial de KMS de un coche
        *
        * @param string $name
        *
        * @return array
        */
        public function updateKms($id, $kms){
            $db = new DbHandler;

            $id = cleanStr($id);
            $kms = cleanStr($kms);

            $date = time();
            $result = $db->query("  INSERT INTO Cars_Km(car, kms, date) 
                                    VALUES (" . $id . ", '" . $kms . "', " . $date . " ) ");   
            
            if($result){
                return true;
            }else{
                return null;
            }
        }

        /**
         * Comprueba que los kilómetros a introducir son superiores al último kilometraje registrado
         * 
         * @param int $vehicle Vehículo
         * @param int $kms Kilómetros
         * @return bool
         */
        function checkKms($vehicle, $kms = null){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);
            $kms = cleanStr($kms);

            $result = $db->query("  SELECT      MAX(ck.kms) as kms
                                    FROM        Cars_Km ck
                                    WHERE       ck.car = $vehicle AND leavingDate IS NULL
                                    ORDER BY    ck.kms DESC");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['kms'];
        }

        /**
         * Obtiene los kms por categoría de mantenimiento
         * 
         * @param int $vehicle Vehículo
         * @return array
         */
        public function getKmsByUpkeep($vehicle){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);

            $result = $db->query("  SELECT  ui.engineOilKm, ui.oilFilterKm, ui.airFilterKm, ui.fuelFilterKm, ui.otherFiltersKm, ui.coolingLiquidKm, ui.brakesLiquidKm,
                                            ui.timingBeltKm, ui.otherBeltsKm, ui.frontBrakesKm, ui.rearBrakesKm, ui.boxATFKm, ui.converterATFKm, ui.differentialATFKm,
                                            ui.sparkPlugKm, ui.oilingKm, ui.batteryKm
                                    FROM    Upkeep_Intervals ui
                                    WHERE   ui.car = $vehicle");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        
        /**
         * Obtiene los kms del último mantenimiento para un vehículo y una categoría
         * 
         * @param int $vehicle Vehículo
         * @param string $category Categoría
         * @return int
         */
        public function getLastUpkeepByCategory($vehicle, $category){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);
            $category = cleanStr($category);

            $result = $db->query("  SELECT      ui.".$category." as kms
                                    FROM        Upkeep_Intervals ui
                                    WHERE       ui.car = $vehicle AND
                                                ui.leavingDate IS NULL
                                    LIMIT       1");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['kms'];
        }

        /**
         * Obtiene los kms del último mantenimiento para un vehículo y una categoría
         * 
         * @param int $vehicle Vehículo
         * @param string $category Categoría
         * @return int
         */
        public function getLastUpkeepByCategoryV2($vehicle, $category){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);
            $category = cleanStr($category);

            // $result = $db->query("  SELECT      u.kms
            //                         FROM        Upkeeps u
            //                         WHERE       u.car = $vehicle AND
            //                                     u.$category = 1 AND
            //                                     u.leavingDate IS NULL AND
            //                                     u.kms IS NOT NULL
            //                         ORDER BY    u.kms DESC
            //                         LIMIT       1");

            $result = $db->query("  SELECT      u.kms
                                    FROM        Upkeeps u, Events e
                                    WHERE       u.car = $vehicle AND
                                                e.upkeeps = u.ID AND
                                                u.$category = 1 AND 
                                                e.leavingDate IS NULL AND
                                                u.leavingDate IS NULL
                                    GROUP BY    u.ID
                                    ORDER BY    u.kms DESC
                                    LIMIT       1");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['kms'];
        }


        public function searchManualUpkeepByDay($car, $start, $end, $cat){
            $db = new DbHandler;

            $car = cleanStr($car);
            $start = cleanStr($start);
            $end = cleanStr($end);
            $cat = cleanStr($cat);
            $cat = substr($cat, 0, -2);

            $result = $db->query(" SELECT ID 
                                    FROM Upkeeps 
                                    WHERE car = $car 
                                        AND date BETWEEN $start AND $end
                                        AND leavingDate IS NULL
                                        AND $cat = 1
                                        AND event IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['ID'];
        }
        /**
         * Obtiene los kms del último mantenimiento para un vehículo y una categoría
         * 
         * @param int $vehicle Vehículo
         * @param string $category Categoría
         * @return int
         */
        public function getLastUpkeepTimeByCategory($vehicle, $category){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);
            $category = cleanStr($category);

            $result = $db->query("  SELECT      u.date
                                    FROM        Upkeeps u
                                    WHERE       u.car = $vehicle AND
                                                u.$category = 1 AND
                                                u.leavingDate IS NULL
                                    ORDER BY    u.date DESC
                                    LIMIT       1");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['date'];
        }

        /**
         * Obtiene los intervalos de mantenimiento
         * 
         * @return array
         */
        public function getDateByUpkeep(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  ui.car, ui.engineOilTime, ui.oilFilterTime, ui.airFilterTime, ui.fuelFilterTime, ui.otherFiltersTime, ui.coolingLiquidTime, ui.brakesLiquidTime,
                                            ui.timingBeltTime, ui.otherBeltsTime, ui.frontBrakesTime, ui.rearBrakesTime, ui.boxATFTime, ui.converterATFTime, ui.differentialATFTime,
                                            ui.sparkPlugTime, ui.oilingTime
                                    FROM    Upkeep_Intervals ui, Cars c
                                    WHERE   ui.car = c.ID AND
                                            c.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Comprueba si se hay un evento para un mantenimiento de un coche
         * 
         * @param int $vehicle Vehículo
         * @param string $category Categoría
         * @return bool
         */
        public function checkEvent($vehicle, $category){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);
            $category = cleanStr($category);

            $category = substr($category, 0, -2);

            $result = $db->query("  SELECT      u.ID, e.start
                                    FROM        Upkeeps u, Events e
                                    WHERE       u.car = $vehicle AND
                                                u.event = e.ID AND
                                                u.$category = 1 AND 
                                                e.leavingDate IS NULL
                                    ORDER BY    u.date DESC
                                    LIMIT       1");
            if($result != false){
                if(mysqli_num_rows($result) > 0){
                    $upkeepsID = $db->resultToArray($result)[0]['ID'];
                
                    $currentDate = date("Y-m-d");
                    $db->query("UPDATE  Events
                                SET     leavingDate = '$currentDate'
                                WHERE   type = 9 
                                    AND car = $vehicle
                                    AND upkeeps =  $upkeepsID");
        
                    $db->query("UPDATE  Upkeeps
                                SET     leavingDate = '$currentDate'
                                WHERE   ID = $upkeepsID");                
            
                }
            }
            return true;
        }

        /**
         * Comprueba si se hay un evento para un mantenimiento de un coche
         * 
         * @param int $vehicle Vehículo
         * @param string $category Categoría
         * @return bool
         */
        public function existsUpkeepPendingForCategory($vehicle, $category){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);
            $category = cleanStr($category);

            $result = $db->query("  SELECT      u.ID
                                    FROM        Upkeeps u, Events e
                                    WHERE       u.car = $vehicle AND
                                                e.upkeeps = u.ID AND
                                                e.status = 1 AND
                                                u.$category = 1 AND 
                                                e.leavingDate IS NULL AND
                                                u.leavingDate IS NULL
                                    ORDER BY    u.date DESC
                                    LIMIT       1");
               
            if(mysqli_num_rows($result) > 0){
                return false;
            }else{
                return true;
            }
        }

        /**
         * Crea un mantenimiento
         * 
         * @param int $vehicle Vehículo
         * @return bool
         */
        public function createUpkeep($vehicle, $category = null){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);

            // Cálculo del extraID
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Upkeeps 
                                    WHERE   extraID = '$extraID'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Upkeeps 
                                        WHERE   extraID = '$extraID'");
            }

            $date = time();
            if($category != null){
                $result = $db->query("  SELECT  * 
                                        FROM    Upkeeps 
                                        WHERE   car = $vehicle AND $category = 1 AND kms IS NULL
                                            AND leavingDate IS NULL");

                if(mysqli_num_rows($result) == 0){
                    $db->query("INSERT INTO Upkeeps(car, date, $category, extraID)
                                VALUES ($vehicle, $date, 1,'$extraID')");
                }else{
                    return null;
                }
            }else{
                $db->query("INSERT INTO Upkeeps(car, date, extraID)
                            VALUES ($vehicle, $date, '$extraID')");
            }

            $result = $db->query("  SELECT  u.ID
                                    FROM    Upkeeps u
                                    WHERE   u.extraID = '$extraID'");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['ID'];
        }



        public function createUpkeep2($vehicle, $date, $category = null){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);
            $date = cleanStr($date);

            // Cálculo del extraID
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Upkeeps 
                                    WHERE   extraID = '$extraID'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Upkeeps 
                                        WHERE   extraID = '$extraID'");
            }

            $result = $db->query("  SELECT  * 
                                    FROM    Upkeeps 
                                    WHERE   car = $vehicle AND $category = 1 AND kms IS NULL
                                            AND leavingDate IS NULL");

            if(mysqli_num_rows($result) == 0){
                $db->query("INSERT INTO Upkeeps(car, date, extraID)
                            VALUES ($vehicle, $date, '$extraID')");
    
                $result = $db->query("  SELECT  u.ID
                                        FROM    Upkeeps u
                                        WHERE   u.extraID = '$extraID'");
    
                return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['ID'];
                
            }else{
                return null;
            }
        }

        /**
         * Actualiza el mantenimiento
         * 
         * @param int $id Mantenimiento
         * @param string $category Categoría
         * @return bool
         */
        public function updateUpkeep($id, $category){
            $db = new DbHandler;

            $id = cleanStr($id);
            $category = cleanStr($category);

            return $db->query(" UPDATE  Upkeeps u
                                SET     u.$category = 1
                                WHERE   u.ID = $id");
        }

        /**
         * Actualiza el mantenimiento
         * 
         * @param int $id Mantenimiento
         * @param string $event Evento
         * @return bool
         */
        public function updateUpkeepEvent($id, $event){
            $db = new DbHandler;

            $id = cleanStr($id);
            $event = cleanStr($event);

            return $db->query(" UPDATE  Upkeeps u
                                SET     u.event = $event
                                WHERE   u.ID = $id"); 
        }

        /**
         * Actualiza el mantenimiento
         * 
         * @param int $id Mantenimiento
         * @param string $event Evento
         * @return bool
         */
        public function updateUpkeepEvent2($id, $event, $kmsExceded = null){
            $db = new DbHandler;

            $id = cleanStr($id);
            $event = cleanStr($event);
            $kmsExceded = cleanStr($kmsExceded);

            $result = $db->query("  SELECT  e.ID
                                    FROM    Events e
                                    WHERE   e.extraID = '$event' ");
                                    
            if(mysqli_num_rows($result) > 0){
                $eventID = $db->resultToArray($result)[0]['ID'];

                if($kmsExceded == 0){
                    $kmsExceded = "0";
                }
                $notes = "(mantenimiento excedido por $kmsExceded kms)";
                return $db->query(" UPDATE  Upkeeps u
                                    SET     u.event = $eventID,
                                            u.notes = '$notes'
                                    WHERE   u.ID = $id"); 
            }
        }

        /**
         * Actualiza el mantenimiento
         * 
         * @param int $id Mantenimiento
         * @param string $event Evento
         * @return bool
         */
        public function checkLastKmsUpkeepCategory($car, $cat){
            $db = new DbHandler;

            $car = cleanStr($car);
            $cat = cleanStr($cat);

            $cat = substr($cat, 0, -2);

            $result = $db->query("  SELECT  u.kms
                                    FROM    Upkeeps u
                                    WHERE   u.car = $car 
                                        AND u.$cat = 1 
                                        AND u.leavingDate IS NULL
                                    ORDER BY u.ID DESC");
            
            if(mysqli_num_rows($result) > 0){
                $kms = $db->resultToArray($result)[0]['kms'];
                return $kms == null ? '0' : $kms;
            }else{
                return null;
            }  
        }

        /**
         * Actualiza el mantenimiento
         * 
         * @param int $id Mantenimiento
         * @param string $event Evento
         * @return bool
         */
        public function checkLastKmsUpkeepCategoryv2($car, $cat){
            $db = new DbHandler;

            $car = cleanStr($car);
            $cat = cleanStr($cat);

            $cat = substr($cat, 0, -2);

            $result = $db->query("  SELECT  u.kms
                                    FROM    Upkeeps u
                                    WHERE   u.car = $car 
                                        AND u.$cat = 1 
                                        AND u.leavingDate IS NULL
                                        AND u.kms IS NOT NULL
                                    ORDER BY u.ID DESC");
            
            if(mysqli_num_rows($result) > 0){
                $kms = $db->resultToArray($result)[0]['kms'];
                return $kms == null ? '0' : $kms;
            }else{
                return null;
            }  
        }

        /**
         * Actualiza el mantenimiento
         * 
         * @param int $id Mantenimiento
         * @param string $event Evento
         * @return bool
         */
        public function updateIntervalCategory($id, $category){
            $db = new DbHandler;

            $id = cleanStr($id);
            $category = cleanStr($category);


            $result = $db->query("  SELECT  $category
                                    FROM    Upkeep_Intervals
                                    WHERE   car = $id AND leavingDate IS NULL");
            $valueCategory = $db->resultToArray($result)[0][$category];
            $valueCategory += floatval($valueCategory);   

            $db->query("UPDATE Upkeep_Intervals
                                    SET $category = $valueCategory
                                    WHERE car = $id AND leavingDate IS NULL");
        }

        /**
         * Obtiene la matrícula de un vehículo
         * 
         * @param int $vehicle Vehicle ID
         * @return string
         */
        public function getPlateByVehicle($vehicle){
            $db = new DbHandler;

            $vehicle = cleanStr($vehicle);

            $result = $db->query("  SELECT  c.licensePlate
                                    FROM    Cars c
                                    WHERE   c.ID = $vehicle");

            return mysqli_num_rows($result) == 0 ? '' : $db->resultToArray($result)[0]['licensePlate'];
        }

        /**
         * Crea el evento para el mantenimiento
         * 
         * @param array $data Datos
         * @return bool
         */
        public function createEvent($data, $type= null, $car = null){
            $db = new DbHandler;

            $data[0] = cleanStr($data[0]);
            $data[1] = cleanStr($data[1]);
            $data[2] = cleanStr($data[2]);
            $data[3] = cleanStr($data[3]);
            $data[5] = cleanStr($data[5]);

            // Cálculo del extraID
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("SELECT * 
                                  FROM Events 
                                  WHERE extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("SELECT * 
                                      FROM Events 
                                      WHERE extraID = '" . $extraID . "'");
            }

            if($type == null){
                $type = 3;
            }

            $currentDate = strtotime("today");
            if($car == null){
                $db->query("INSERT INTO Events(status, user, type, name, start, end, reminder, cremation, extraID, dischargeDay)
                            VALUES (" . $data[5] . ", " . $data[3] . ", " . $type . ", '" . $data[0] . "',
                                    '" . $data[1] . "', '" . $data[2] . "', 1, 0, '$extraID', '$currentDate')");
            }else{
                $db->query("INSERT INTO Events(status, user, type, name, start, end, reminder, cremation, car, extraID, dischargeDay)
                            VALUES (" . $data[5] . ", " . $data[3] . ", " . $type . ", '" . $data[0] . "',
                                    '" . $data[1] . "', '" . $data[2] . "', 1, 0, " . $car . ",  '$extraID', '$currentDate')");
            }

            $result = $db->query("  SELECT  e.ID
                                    FROM    Events e
                                    WHERE   e.extraID = '$extraID'");
                
            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['ID'];
        }

        /**
         * Obtiene el id del vehículo dada la matrícula
         * 
         * @param string $plate Matrícula
         * @return int
         */
        public function getIdByPlateAPI($plate){
            $db = new DbHandler;

            $plate = cleanStr($plate);

            $result = $db->query("  SELECT  c.ID
                                    FROM    Cars c
                                    WHERE   c.licensePlate = '$plate' AND
                                            c.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['ID'];
        }

        /**
         * Añade kilometraje a un vehículo
         * 
         * @param int $id Vehículo
         * @param int $kms Kilometraje
         * @param int $date Fecha
         * @return bool
         */
        public function addkmsAPI($id, $kms, $date){
            $db = new DbHandler;

            $id = cleanStr($id);
            $kms = cleanStr($kms);
            $date = cleanStr($date);

            return $db->query(" INSERT INTO Cars_Km(car, kms, date)
                                VALUES ($id, $kms, $date)");
        }

        /**
         * Añade un vehículo
         * 
         * @param string $plate Matrícula
         * @param string $imei IMEI
         * @return int
         */
        public function addVehicleAPI($plate, $imei){
            $db = new DbHandler;

            $plate = cleanStr($plate);
            $imei = cleanStr($imei);

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Cars 
                                    WHERE   extraID = '$extraID'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Cars 
                                        WHERE   extraID = '$extraID'");
            }

            $db->query("INSERT INTO Cars(licensePlate, imei, brand, model, kms, maintenance, chassis, type, external, extraID)
                        VALUES ('$plate', '$imei', '', '', 0, 0, '', 0, 0, '$extraID')");

            $result = $db->query("  SELECT  c.ID
                                    FROM    Cars c
                                    WHERE   c.extraID = '$extraID'");

            if(mysqli_num_rows($result)){
                $id = $db->resultToArray($result)[0]['ID'];

                require_once($_SESSION['basePath'] . "model/upkeeps.php");

                $upkeeps = new Upkeeps;
                $upkeeps->createInterval(array('vehicle' => $id));

                return $id;
            }else{
                return null;
            }
        }

        /**
         * Comprueba si el kilometraje ya ha sido añadido para un vehículo en una fecha
         * 
         * @param int $id Vehículo
         * @param int $date Fecha
         * @return bool
         */
        public function checkKmsAddedAPI($id, $date){
            $db = new DbHandler;

            $id = cleanStr($id);
            $date = cleanStr($date);

            $result = $db->query("  SELECT  ck.ID
                                    FROM    Cars_Km ck
                                    WHERE   ck.car = $id AND
                                            ck.date = $date");

            return mysqli_num_rows($result) == 0 ? true : false;
        }

        /**
         * Obtiene el kilometraje actual de un vehículo
         * 
         * @param int $id Vehículo
         * @return int Kms
         */
        public function getLastKms($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT      ck.kms
                                    FROM        Cars_Km ck
                                    WHERE       ck.car = $id
                                    ORDER BY    ck.date DESC");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['kms'];
        }

        /**
         * Obtiene información del vehículo procedente de la API
         * 
         * @param string $plate Matrícula
         * @param int $start Fecha de inicio
         * @param int $end Fecha de fin
         * @return array
         */
        public function getInfoAPI($plate, $start, $end){
            $plate = cleanStr($plate);
            $start = cleanStr($start);
            $end = cleanStr($end);

            $fmsData = array();

            $start = explode('/', $start);
            $start = $start[1] . '/' . $start[0] . '/' . $start[2];
            $start = gmdate("Y-m-d\TH:i:s", strtotime("$start UTC"));

            $end = explode('/', $end);
            $end = $end[1] . '/' . $end[0] . '/' . $end[2];
            $end = gmdate("Y-m-d\TH:i:s", strtotime("$end UTC"));

            $curl = curl_init();

            $post = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <getFMSData xmlns=\"http://ws.movildata.com/ws/wsUsers\">\r\n      <apikey>8A89BEFF-0788-40C8-B0BE-890FE01FA17C</apikey>\r\n      <matricula>$plate</matricula>\r\n      <desde>$start</desde>\r\n      <hasta>$end</hasta>\r\n    </getFMSData>\r\n  </soap12:Body>\r\n</soap12:Envelope>";

            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://ws.movildata.com/wsUsers.asmx",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => $post,
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/soap+xml; charset=utf-8",
                    "Host: ws.movildata.com"
                )
            ));

            $response = curl_exec($curl);
            $err = curl_error($curl);

            curl_close($curl);

            if($err){
                return null;
            }else{
                $domDocument = new DOMDocument;
                $domDocument->loadXML($response);

                $tables = $domDocument->getElementsByTagName('getFMSDataResult');
                foreach($tables as $elem){
                    $response = $elem->nodeValue;
                }
                
                $response = explode("\n", $response);
                array_shift($response);
                array_pop($response);

                if(empty($response) || $response[0] == ''){
                    return null;
                }else{
                    foreach($response as $line){
                        $row = explode("\t", $line);
    
                        array_push($fmsData, array('date' => $row[1], 'distance' => $row[2], 'litters' => $row[3], 'fuel' => $row[4], 'rpm' => $row[7]));
                    }

                    return $fmsData;
                }
            }
        }

        /**
         * Obtiene información del vehículo procedente de la API
         * 
         * @param string $plate Matrícula
         * @param int $start Fecha de inicio
         * @param int $end Fecha de fin
         * @return array
         */
        public function getInfoSenseAPI($plate, $start, $end){
            $plate = cleanStr($plate);
            $start = cleanStr($start);
            $end = cleanStr($end);

            $temperatureData = array();

            $start = explode('/', $start);
            $start = $start[1] . '/' . $start[0] . '/' . $start[2];
            $start = gmdate("Y-m-d\TH:i:s", strtotime("$start UTC"));

            $end = explode('/', $end);
            $end = $end[1] . '/' . $end[0] . '/' . $end[2];
            $end = gmdate("Y-m-d\TH:i:s", strtotime("$end UTC"));

            $curl = curl_init();

            $data = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\r\n  <soap12:Body>\r\n    <getTemperatureData xmlns=\"http://ws.movildata.com/ws/wsUsers\">\r\n      <apikey>8A89BEFF-0788-40C8-B0BE-890FE01FA17C</apikey>\r\n      <matricula>$plate</matricula>\r\n      <desde>$start</desde>\r\n      <hasta>$end</hasta>\r\n    </getTemperatureData>\r\n  </soap12:Body>\r\n</soap12:Envelope>";

            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://ws.movildata.com/wsUsers.asmx",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => $data,
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/soap+xml; charset=utf-8",
                    "Host: ws.movildata.com"
                )
            ));

            $response = curl_exec($curl);
            $err = curl_error($curl);

            curl_close($curl);

            if($err){
                echo "cURL Error #:" . $err;
            }else{
                $domDocument = new DOMDocument;
                $domDocument->loadXML($response);

                $tables = $domDocument->getElementsByTagName('getTemperatureDataResult');
                foreach($tables as $elem){
                    $response = $elem->nodeValue;
                }
                
                $response = explode("\n", $response);
                array_shift($response);
                array_pop($response);

                if($response[0] == ''){
                    return null;
                }else{
                    foreach($response as $line){
                        $row = explode("\t", $line);
    
                        array_push($temperatureData, array( 'date' => $row[2],
                                                            'position' => $row[3],
                                                            'speed' => $row[5],
                                                            'engine' => $row[6],
                                                            'doors' => array($row[7], $row[8]),
                                                            'temperature' => array($row[9], $row[10])
                                                        ));
                    }

                    return $temperatureData;
                }
            }
        }

        /**
         * Modifica una itv
         * 
         * @param array $data Datos
         * @return bool
         */
        public function updateItv($data){
            $db = new DbHandler;

            $id = cleanStr($data['id']);
            $datePrev = cleanStr($data['datePrev']);
            $dateNext = cleanStr($data['dateNext']);
            $cost = cleanStr($data['cost']);

            return $db->query(" UPDATE  Cars_ITV
                                SET     datePrev = $datePrev,
                                        dateNext = $dateNext,
                                        cost = $cost
                                WHERE   id = $id");
        }

        /**
         * Modifica el histórico de kilometros de un coche
         * 
         * @param array $data Datos
         * @return bool
         */
        public function updateHistoricKms($id, $date, $kms){
            $db = new DbHandler;

            $id = cleanStr($id);
            $date = cleanStr($date);
            $kms = cleanStr($kms);

            return $db->query(" UPDATE  Cars_Km
                                SET     date = $date,
                                        kms = $kms
                                WHERE   ID = $id");
        }

        /**
         * Elimina un registro del histórico de kilómetros de un coche
         * 
         * @param array $data Datos
         * @return bool
         */
        public function deleteHistoricKms($id){
            $db = new DbHandler;

            $id = cleanStr($id);
            $leavingDate = date("Y-m-d H:i:s");

            return $db->query(" UPDATE  Cars_Km
                                SET     leavingDate = '$leavingDate'
                                WHERE   ID = $id");
        }

        /**
         * Devuelve el/los eventos de taller más cercanos a la fecha actual en el pasado cuyo estado es resuelto
         * 
         * @param array $vehicleID Identificador del vehículo
         * @return bool
         */
        public function getLastEventAccomplished($vehicleID){
            $db = new DbHandler;

            $vehicleID = cleanStr($vehicleID);
            $date =  date("Y-m-d") . ' 00:00:00';

            $result = $db->query("  SELECT  MAX(e.start) as date
                                    FROM    Events e
                                    WHERE   car =  $vehicleID AND  e.start <= '". $date."' AND  e.status = 4 AND leavingDate IS NULL
                                    ORDER BY e.start DESC 
                                    LIMIT 1");
           
            $date = $db->resultToArray($result)[0]['date'];

            $result = $db->query("  SELECT  e.name, e.start, e.type
                                    FROM    Events e
                                    WHERE   car =  $vehicleID AND  e.start = '". $date."' AND  e.status = 4 AND leavingDate IS NULL
                                    GROUP BY e.start  ORDER BY e.start DESC");
            
            $events = $db->resultToArray($result);
          
            if(mysqli_num_rows($result) != 0){
                foreach($events as $event){
                    if($event["type"] == 8){
                         $result = $db->query("  SELECT  e.name, e.start
                                                        FROM    Events e
                                                        WHERE   car =  $vehicleID AND  e.start = '". $date."' AND  e.status = 4 AND leavingDate IS NULL
                                                        ORDER BY e.start DESC");
                        return $db->resultToArray($result);
                    }
                }
            }
            return $events;
        }

        /**
         * Devuelve el/los eventos de taller más próximo en el futuro a la fecha actual cuyo estado es pendiente
         * 
         * @param array $vehicleID Identificador del vehículo
         * @return bool
         */

        public function getNextEvent($vehicleID){
            $db = new DbHandler;

            $vehicleID = cleanStr($vehicleID);
            $date =  date("Y-m-d") . ' 00:00:00';

            $result = $db->query("  SELECT  MAX(e.start) as date
                                    FROM    Events e
                                    WHERE   car =  $vehicleID AND  e.start > '". $date."' AND  e.status = 1 AND leavingDate IS NULL
                                    ORDER BY e.start DESC 
                                    LIMIT 1");
           
            $date = $db->resultToArray($result)[0]['date'];

            $result = $db->query("  SELECT  e.name, e.start, e.type
                                    FROM    Events e
                                    WHERE   car =  $vehicleID AND  e.start = '". $date."' AND  e.status = 1 AND leavingDate IS NULL
                                    GROUP BY e.start  ORDER BY e.start DESC");
            
            $events = $db->resultToArray($result);
            
            if(mysqli_num_rows($result) != 0){
                foreach($events as $event){
                    if($event["type"] == 8){
                        $result = $db->query("  SELECT  e.name, e.start
                                                       FROM    Events e
                                                        WHERE   car =  $vehicleID AND  e.start = '". $date."' AND  e.status = 1 AND leavingDate IS NULL
                                                        ORDER BY e.start DESC");

                        return $db->resultToArray($result);
                        }
                }
            }
            return $events;
        }

        /**
         * Obtiene el imei del vehículo
         * 
         * @param int $id Id del vehículo
         * @return int
         */
        public function getImei($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT  c.imei
                                    FROM    Cars c
                                    WHERE   c.ID = $id");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0]['imei'];
        }

        /**
         * Obtiene el imei del vehículo
         * 
         * @param int $id Id del vehículo
         * @return int
         */
        public function listItvDatatables($year, $month, $trimester, $vehicle){
            $db = new DbHandler;

            $year = cleanStr($year);
            $month = cleanStr($month);
            $trimester = cleanStr($trimester);
            $vehicle = cleanStr($vehicle);

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

            $result = $db->query("  SELECT  citv.ID, CONCAT(c.brand, ' ', c.model), c.licensePlate, citv.datePrev, citv.kms, citv.cost
                                    FROM    Cars_ITV citv, Cars c
                                    WHERE   citv.leavingDate IS NULL AND citv.car = c.ID AND c.leavingDate IS NULL $where");

            return mysqli_num_rows($result) > 0 ? $db->resultToArrayValue($result) : array();
        }

        /**
         * Obtiene el imei del vehículo
         * 
         * @param int $id Id del vehículo
         * @return int
         */
        public function listInsuranceDatatables($year, $month, $trimester, $vehicle){
            $db = new DbHandler;

            $year = cleanStr($year);
            $month = cleanStr($month);
            $trimester = cleanStr($trimester);
            $vehicle = cleanStr($vehicle);

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

            $result = $db->query("  SELECT  ci.ID, CONCAT(c.brand, ' ', c.model), c.licensePlate, ci.createDate, ci.finalDate, ci.amount
                                    FROM    Cars_Insurance ci, Cars c
                                    WHERE   ci.leavingDate IS NULL AND ci.car = c.ID AND c.leavingDate IS NULL $where");

            return mysqli_num_rows($result) > 0 ? $db->resultToArrayValue($result) : array();
        }

        /**
         * Obtiene el imei del vehículo
         * 
         * @param int $id Id del vehículo
         * @return int
         */
        public function listRefuelDatatables($year, $month, $trimester, $vehicle){
            $db = new DbHandler;

            $year = cleanStr($year);
            $month = cleanStr($month);
            $trimester = cleanStr($trimester);
            $vehicle = cleanStr($vehicle);

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

            $result = $db->query("  SELECT  r.ID, CONCAT(c.brand, ' ', c.model), c.licensePlate, r.date, r.gasStation, r.liters, r.totalCost
                                    FROM    Refuel r, Cars c
                                    WHERE   r.leavingDate IS NULL AND r.car = c.ID AND c.leavingDate IS NULL $where");

            return mysqli_num_rows($result) > 0 ? $db->resultToArrayValue($result) : array();
        }
    }
?>