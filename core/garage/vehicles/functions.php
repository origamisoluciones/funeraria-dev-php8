<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
    }

    if(!isset($_SESSION['user'])){
        http_response_code(403);
        return;
    }

    if(empty($_POST) || !isset($_POST['type'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/cars.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getVehicle':
                echo json_encode(getVehicle($_POST['vehicle']));
            break;
            case 'getDocs':
                echo json_encode(getDocs($_POST['vehicleID']));
            break;
            case 'getVehicleEvents':
                echo json_encode(getVehicleEvents($_POST['vehicleID']));
            break;
            case 'deleteDoc':
                echo json_encode(deleteDoc($_POST['docName'], $_POST['vehicleID']));
            break;
            case 'getKms':
                echo json_encode(getKms($_POST['carID']));
            break;
            case 'updateKms':
                echo json_encode(updateKms($_POST['ID'], $_POST['kms']));
            break;
            case 'checkKms':
                echo json_encode(checkKms($_POST['id'], $_POST['kms']));
            break;
            case 'getInfo':
                echo json_encode(getInfo($_POST['plate'], $_POST['start'], $_POST['end']));
            break;
            case 'getInfoSense':
                echo json_encode(getInfoSense($_POST['plate'], $_POST['start'], $_POST['end']));
            break;
            case 'existsVehicle':
                echo json_encode(existsVehicle($_POST['vehicle']));
            break;
            case 'updateItv':
                echo json_encode(updateItv($_POST['data']));
            break;
            case 'updateHistoricKms':
                echo json_encode(updateHistoricKms($_POST['ID'],$_POST['date'], $_POST['kms']));
            break;
            case 'deleteHistoricKms':
                echo json_encode(deleteHistoricKms($_POST['ID']));
            break;
            case 'getImei':
                echo json_encode(getImei($_POST['id']));
            break;
            case 'updateSateliumToken':
                echo json_encode(updateSateliumToken($_POST['token']));
            break;
        }
    }

    /**
    * Obtiene los datos de la localidad para una funeraria
    *
    * @return array
    */
    function getVehicle($data){
        $vehicles = new Cars();
        
        return $vehicles->read(array("ID" => $data));
    }

    /**
    * Obtiene los datos de la localidad para una funeraria
    *
    * @return array
    */
    function getDocs($vehicleID){
        $dir = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/garage/vehicles/' . $vehicleID . '/docs';
        if(file_exists($dir)){
            $docs  = scandir($dir);
            return $docs;
        }else{
            return null;
        }
    }

    /**
    * Obtiene los datos del ultimo evento realizado y el siguiente a la fecha actual
    *
    * @return array
    */
    function getVehicleEvents($vehicleID){
        $vehicles = new Cars;
        $lastEvent = $vehicles->getLastEventAccomplished($vehicleID);
        $nextEvent = $vehicles->getNextEvent($vehicleID);
        $response = ["lastEvent" =>  $lastEvent, "nextEvent" => $nextEvent];
        return $response;
    }

    /**
    * Obtiene los datos de la localidad para una funeraria
    *
    * @return array
    */
    function deleteDoc($docName, $vehicleID){
        $dir = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/garage/vehicles/' . $vehicleID . '/docs';
        $dir2 = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/garage/vehicles/' . $vehicleID;
        if(file_exists($dir)){
            unlink($dir."/".$docName);
            return true;
        }else{
            return "No existe el directorio";
        }
    }

    /**
    * Obtiene el historial de kilometros de un coche
    *
    * @return array
    */
    function getKms($id){
        $vehicles = new Cars();
        return $vehicles->listKms($id);
    }

    /**
     * 
     */
    function translateUpkeep($text){
        $translate = '';
        switch($text){
            case 'engineOil':
                $translate = 'Aceite motor';
                break;
            case 'oilFilter':
                $translate = 'Filtro de aceite';
                break;
            case 'airFilter':
                $translate = 'Filtro de aire';
                break;
            case 'fuelFilter':
                $translate = 'Filtro de combustible';
                break;
            case 'otherFilters':
                $translate = 'Otros filtros';
                break;
            case 'coolingLiquid':
                $translate = 'Líquido refrigerante';
                break;
            case 'brakesLiquid':
                $translate = 'Líquido de frenos';
                break;
            case 'timingBelt':
                $translate = 'Correa de distribución';
                break;
            case 'otherBelts':
                $translate = 'Otras correas';
                break;
            case 'frontBrakes':
                $translate = 'Frenos delanteros';
                break;
            case 'rearBrakes':
                $translate = 'Frenos traseros';
                break;
            case 'boxATF':
                $translate = 'ATF caja';
                break;
            case 'converterATF':
                $translate = 'ATF convertidor';
                break;
            case 'differentialATF':
                $translate = 'ATF diferencial';
                break;
            case 'sparkPlug':
                $translate = 'Bujías/Calentadores';
                break;
            case 'oiling':
                $translate = 'Engrase';
                break;
        }
        return $translate;
    }

    /**
    * Obtiene el historial de kilometros de un coche
    *
    * @return array
    */
    function updateKms($id, $kms){
        require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
        $db = new DbHandler;

        $vehicles = new Cars;
        $vehicles->updateKms($id, $kms);
        $toUpkeep = array();
        $categories = $vehicles->getKmsByUpkeep($id);
        $car = $id;

        foreach($categories as $key => $interval){
            if($interval != null){
                $cat = substr($key, 0, -2);
                $kmLastUpkeep = $vehicles->getLastUpkeepByCategoryV2($id, $cat);

                if($kmLastUpkeep == null){
                    if($kms >= $interval && $vehicles->existsUpkeepPendingForCategory($id, $cat)){
                        array_push($toUpkeep, $cat);
                    }
                }else{
                    if($kms >= ($kmLastUpkeep + $interval)  && $vehicles->existsUpkeepPendingForCategory($id, $cat)){
                        array_push($toUpkeep, $cat);
                    }
                }
            }
        }

        require_once($_SESSION['basePath'] . "model/events.php");
        $events = new Events;       
        $start = date('Y-m-d', time()) . ' 00:00:00';
        $end = date('Y-m-d', time()) . ' 23:59:59';

        $result = $db->query("  SELECT  c.licensePlate
                                FROM    Cars c
                                WHERE   c.ID = $car");

        $licensePlate = $db->resultToArray($result)[0]["licensePlate"];

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
        return true;
    }

    /**
     * Comprueba que los kilómetros a introducir son superiores al último kilometraje registrado
     * 
     * @param int $vehicle Vehículo
     * @param int $kms Kilómetros
     * @return bool
     */
    function checkKms($vehicle, $kms){
        $vehicles = new Cars;
        $lastKms = $vehicles->checkKms($vehicle, $kms);
        if($lastKms == null){
            return true;
        }else{
            return $lastKms < $kms ? true : false;
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
    function getInfo($plate, $start, $end){
        $vehicles = new Cars;
        return $vehicles->getInfoAPI($plate, $start, $end);
    }

    /**
     * Obtiene información del vehículo procedente de la API
     * 
     * @param string $plate Matrícula
     * @param int $start Fecha de inicio
     * @param int $end Fecha de fin
     * @return array
     */
    function getInfoSense($plate, $start, $end){
        $vehicles = new Cars;
        return $vehicles->getInfoSenseAPI($plate, $start, $end);
    }

    /**
     * Comprueba si un vehículo existe
     * 
     * @param int $vehicle Id del vehículo
     * @return bool
     */
    function existsVehicle($vehicle){
        $vehicles = new Cars;
        return $vehicles->existsVehicle($vehicle);
    }

    /**
     * Modifica una itv
     * 
     * @param array $data Datos
     * @return bool
     */
    function updateItv($data){
        $vehicles = new Cars;
        return $vehicles->updateItv($data);
    }

    /**
     * Modifica el histórico de kilometros
     * 
     * @param array $data Datos
     * @return bool
     */
    function updateHistoricKms($id, $date, $kms){
        $vehicles = new Cars;
        return $vehicles->updateHistoricKms($id, $date, $kms);
    }
    
    /**
     * Modifica el histórico de kilometros
     * 
     * @param array $data Datos
     * @return bool
     */
    function deleteHistoricKms($id){
        $vehicles = new Cars;
        return $vehicles->deleteHistoricKms($id);
    }

    /**
     * Obtiene el imei del vehículos
     * 
     * @param int $id Id
     * @return string
     */
    function getImei($data){
        $vehicles = new Cars;
        $carImei = $vehicles->getImei($data);

        require_once($_SESSION['basePath'] . "model/settings.php");
        $settings = new Settings;
        $sateliumToken = $settings->getSateliumToken();

        return [$sateliumToken, $carImei];
    }

    /**
     * Actualiza el token de Satelium
     * 
     * @param int $id Id
     * @return string
     */
    function updateSateliumToken($token){
        require_once($_SESSION['basePath'] . "model/settings.php");
        $settings = new Settings;
        return $settings->setInfo('sateliumToken', $token);
    }
?>