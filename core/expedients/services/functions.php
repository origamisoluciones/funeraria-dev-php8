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

    require_once($_SESSION['basePath'] . "model/expedients.php");
    require_once($_SESSION['basePath'] . "model/logs.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getServiceExpedient':
                echo json_encode(getServiceExpedient($_POST['expedientID']));
            break;
            case 'saveServiceExpedient':
                echo json_encode(saveServiceExpedient($_POST));
            break;
            case 'saveServiceExpedientTPV':
                echo json_encode(saveServiceExpedientTPV($_POST));
            break;
            case 'updateServiceLiterals':
                echo json_encode(updateServiceLiterals($_POST));
            break;
            case 'setPriest':
                echo json_encode(setPriest($_POST));
            break;
            case 'setCHoir':
                echo json_encode(setCHoir($_POST));
            break;
            case 'setBellringer':
                echo json_encode(setBellringer($_POST));
            break;
            case 'updatePriest':
                echo json_encode(updatePriest($_POST));
            break;
            case 'deletePriest':
                echo json_encode(deletePriest($_POST));
            break;
            case 'deleteChoir':
                echo json_encode(deleteChoir($_POST['choirID']));
            break;
            case 'deleteBellringer':
                echo json_encode(deleteBellringer($_POST['bellringerID']));
            break;
            case 'setGravedigger':
                echo json_encode(setGravedigger($_POST));
            break;
            case 'updateGravedigger':
                echo json_encode(updateGravedigger($_POST));
            break;
            case 'deleteGravedigger':
                echo json_encode(deleteGravedigger($_POST));
            break;
            case 'setCarrier':
                echo json_encode(setCarrier($_POST));
            break;
            case 'setCar':
                echo json_encode(setCar($_POST));
            break;
            case 'updateCarrier':
                echo json_encode(updateCarrier($_POST));
            break;
            case 'updateChoir':
                echo json_encode(updateChoir($_POST));
            break;
            case 'updateBellringer':
                echo json_encode(updateBellringer($_POST));
            break;
            case 'updateCar':
                if(isset($_POST['cars'])){
                    echo json_encode(updateCar($_POST['cars']));
                }else{
                    echo json_encode(true);
                }
            break;
            case 'deleteCarrier':
                echo json_encode(deleteCarrier($_POST));
            break;
            case 'deleteCar':
                echo json_encode(deleteCar($_POST));
            break;
            case 'updateOthersSection':
                echo json_encode(updateOthersSection($_POST));
            break;
            case 'getUserById':
                echo json_encode(getUserById($_POST));
            break;
            case 'getSummary':
                echo json_encode(getSummary($_POST['expedientID']));
            break;
            case 'setSummary':
                echo json_encode(setSummary($_POST));
            break;
            case 'readControl':
                echo json_encode(readControl($_POST));
            break;
            case 'updateControl':
                echo json_encode(updateControl($_POST));
            break;
            case 'updateControlSent':
                echo json_encode(updateControlSent($_POST));
            break;
            case 'sendControl':
                echo json_encode(sendControl($_POST));
            break;
            case 'getEmailsControl':
                echo json_encode(getEmailsControl($_POST['emails']));
            break;
            case 'getCars':
                echo json_encode(getCars($_POST));
            break;
            case 'setLogRead':
                echo json_encode(setLogRead($_POST['expedient']));
            break;
            case 'setLogUpdate':
                echo json_encode(setLogUpdate($_POST['expedient']));
            break;
            case 'getDeliveryPlace':
                echo json_encode(getDeliveryPlace($_POST['expedient']));
            break;
            case 'checkActPrep':
                echo json_encode(checkActPrep($_POST['expedient']));
            break;
            case 'checkBlockProduct':
                echo json_encode(checkBlockProduct($_POST['expedient']));
            break;
            case 'getDeceasedRoom':
                echo json_encode(getDeceasedRoom($_POST['expedient']));
            break;
            case 'getOthers':
                echo json_encode(getOthers($_POST['expedient']));
            break;
            case 'publish':
                echo json_encode(publish($_POST['expedient']));
            break;
            case 'unpublish':
                echo json_encode(unpublish($_POST['expedient']));
            break;
            case 'getExpedientInfo':
                echo json_encode(getExpedientInfo($_POST['expedientID']));
            break;
            case 'logCreateDocument':
                echo json_encode(logCreateDocument($_POST['expedient'], $_POST['doc']));
            break;
            case 'getNotesService':
                echo json_encode(getNotesService($_POST));
            break;
        }
    }

    /**
     * Obtiene los estados de los expedientes
     *
     * @param int $data
     * 
     * @return array
     */
    function getServiceExpedient($data){
        $expedients = new Expedients();
        return $expedients->getServiceExpedient($data);
    }

    /**
     * Guarda el servicio de un expediente
     *
     * @param array $data
     * 
     * @return bool
     */
    function saveServiceExpedient($data){
        $expedients = new Expedients();
        $logs = new Logs;

        $expedient = $data['expedientID'];
        
        if($expedients->saveServiceExpedient($data) === true){
            if(isset($data['logs']) && $data['logs'] != null){
                $logsData = $data['logs'];
        
                for ($i = 0; $i <= count($logsData)-1; $i++) { 
                    $logs->createExpedient("Expedientes", $expedient, "Expedientes - C. Servicio", "'" . $logsData[$i] ."'");
                }
            }
            return true;
        }else{
            return false;
        }
    }

    /**
     * Guarda el servicio de un expediente (solo literales)
     *
     * @param array $data
     * 
     * @return bool
     */
    function updateServiceLiterals($data){
        $expedient = $data['expedientID'];
        
        $expedients = new Expedients();
        if($expedients->updateServiceLiterals($data) === true){
            if(isset($data['logs']) && $data['logs'] != null){
                $logsData = $data['logs'];
        
                $logs = new Logs;
                for ($i = 0; $i <= count($logsData)-1; $i++) { 
                    $logs->createExpedient("Expedientes", $expedient, "Expedientes - C. Servicio", "'" . $logsData[$i] ."'");
                }
            }
            return true;
        }else{
            return false;
        }
    }

    /**
     * Guarda el servicio de un expediente
     *
     * @param array $data
     * 
     * @return bool
     */
    function saveServiceExpedientTPV($data){
        $expedient = $data['expedientID'];
        
        $expedients = new Expedients();
        if($expedients->saveServiceExpedientTPV($data) === true){
            if(isset($data['logs']) && $data['logs'] != null){
                $logsData = $data['logs'];
                
                $logs = new Logs;
                for($i = 0; $i <= count($logsData)-1; $i++) { 
                    $logs->createExpedient("Expedientes", $expedient, "Expedientes - C. Servicio", "'" . $logsData[$i] ."'");
                }
            }
            return true;
        }else{
            return false;
        }

    }

    /**
     * Añade un cura a un servicio
     *
     * @param array $data
     * 
     * @return bool
     */
    function setPriest($data){
        $expedients = new Expedients();

        require_once($_SESSION['basePath'] . "model/priests.php");
        $priest = new Priests();
        $priestName = $priest->getPriest($data['priest']);
        
        $logs = new Logs;
        $logs->createExpedient("Expedientes", $data['service'], "Expedientes - C. Servicio", "'" . 'Ha añadido el cura ' . $priestName ."'");

        if($expedients->checkPriest($data)){
            return true;
        }else{
            return $expedients->setPriest($data);
        }
    }

    /**
     * Añade un coro a un servicio
     *
     * @param array $data
     * @return bool
     */
    function setCHoir($data){
        $expedients = new Expedients();

        require_once($_SESSION['basePath'] . "model/choirs.php");
        $choirs = new Choirs();
        $choirName = $choirs->getChoir($data['choir']);
        
        $logs = new Logs;
        $logs->createExpedient("Expedientes", $data['service'], "Expedientes - C. Servicio", "'" . 'Ha añadido el coro ' . $choirName . "'");

        return $expedients->setCHoir($data);
    }

    /**
     * Añade un campanero a un servicio
     *
     * @param array $data
     * @return bool
     */
    function setBellringer($data){
        $expedients = new Expedients;
        return $expedients->setBellringer($data);
    }

    /**
     * Edita un cura de un servicio
     * 
     * @param array $data
     * 
     * @return bool
     */
    function updatePriest($data){
        $expedients = new Expedients();
        $servicePriest = $expedients->getServicePriest($data['servicePriest']);
        
        require_once($_SESSION['basePath'] . "model/priests.php");
        $priest = new Priests();
        $priestName = $priest->getPriest($servicePriest['priest']);
        
        $logs = new Logs;
        if($data['notified'] == 'true'){
            $logs->createExpedient("Expedientes", $servicePriest['service'], "Expedientes - C. Servicio", "'" . 'Ha avisado al cura ' . $priestName .  "'");
        }else{
            $logs->createExpedient("Expedientes", $servicePriest['service'], "Expedientes - C. Servicio", "'" . 'Ha quitado el aviso al cura ' . $priestName .  "'");
        }

        return $expedients->updatePriest($data) ? true : false;
    }

    /**
     * Elimina un cura de un servicio
     * 
     * @param array $data
     * 
     * @return bool
     */
    function deletePriest($data){
        $expedients = new Expedients();
        $servicePriest = $expedients->getServicePriest($data['servicePriest']);
        
        require_once($_SESSION['basePath'] . "model/priests.php");
        $priest = new Priests();
        $priestName = $priest->getPriest($servicePriest['priest']);
        
        $logs = new Logs;
        $logs->createExpedient("Expedientes", $servicePriest['service'], "Expedientes - C. Servicio", "'" . 'Ha eliminado al cura ' . $priestName .  "'");

        return $expedients->deletePriest($data) ? true : false;
    }

    /**
     * Elimina un coro de un servicio
     * 
     * @param array $data
     * 
     * @return bool
     */
    function deleteChoir($data){
        $expedients = new Expedients();
        $serviceChoir = $expedients->getServiceChoir($data['choirID']);

        require_once($_SESSION['basePath'] . "model/choirs.php");
        $choir = new Choirs();
        $choirName = $choir->getChoir($serviceChoir['choir']);

        $logs = new Logs;
        $logs->createExpedient("Expedientes", $serviceChoir['service'], "Expedientes - C. Servicio", "'" . 'Ha eliminado al coro ' . $choirName .  "'");

        return $expedients->deleteChoir($data) ? true : false;
    }

    /**
     * Elimina un campanero de un servicio
     * 
     * @param array $data ID del servicio
     * @return bool
     */
    function deleteBellringer($data){
        $expedients = new Expedients;
        return $expedients->deleteBellringer($data) ? true : false;
    }

    /**
     * Añade un enterrador a un servicio
     *
     * @param array $data
     * 
     * @return bool
     */
    function setGravedigger($data){
        require_once($_SESSION['basePath'] . "model/gravediggers.php");
        $gravediggers = new Gravediggers();
        $gravediggerName = $gravediggers->getGravedigger($data['gravedigger']);
        
        $logs = new Logs;
        $logs->createExpedient("Expedientes", $data['service'], "Expedientes - C. Servicio", "'" . 'Ha añadido el enterrador ' . $gravediggerName .  "'");
        
        $expedients = new Expedients();
        if($expedients->checkGravedigger($data)){
            return true;
        }else{
            return $expedients->setGravedigger($data);
        }
    }

    /**
     * Edita un enterrador de un servicio
     * 
     * @param array $data
     * 
     * @return bool
     */
    function updateGravedigger($data){
        $expedients = new Expedients();
        $serviceGravedigger = $expedients->getServiceGravedigger($data['serviceGravedigger']);
        
        require_once($_SESSION['basePath'] . "model/gravediggers.php");
        $gravediggers = new Gravediggers();
        $gravediggerName = $gravediggers->getGravedigger($serviceGravedigger['gravedigger']);
        
        $logs = new Logs;
        if($data['notified'] == 'true'){
            $logs->createExpedient("Expedientes", $serviceGravedigger['service'], "Expedientes - C. Servicio", "'" . 'Ha avisado al enterrador ' . $gravediggerName .  "'");
        }else{
            $logs->createExpedient("Expedientes", $serviceGravedigger['service'], "Expedientes - C. Servicio", "'" . 'Ha quitado el aviso al enterrador ' . $gravediggerName .  "'");
        }

        return $expedients->updateGravedigger($data) ? true : false;
    }

    /**
     * Elimina un enterrador de un servicio
     * 
     * @param array $data
     * 
     * @return bool
     */
    function deleteGravedigger($data){
        $expedients = new Expedients();
        $serviceGravedigger = $expedients->getServiceGravedigger($data['serviceGravedigger']);
        
        require_once($_SESSION['basePath'] . "model/gravediggers.php");
        $gravediggers = new Gravediggers();
        $gravediggerName = $gravediggers->getGravedigger($serviceGravedigger['gravedigger']);
        
        $logs = new Logs;
        $logs->createExpedient("Expedientes", $serviceGravedigger['service'], "Expedientes - C. Servicio", "'" . 'Ha eliminado al enterrador ' . $gravediggerName . "'");

        return $expedients->deleteGravedigger($data) ? true : false;
    }

    /**
     * Añade un porteador a un servicio
     *
     * @param array $data
     * 
     * @return bool
     */
    function setCarrier($data){
        $expedients = new Expedients();
        
        require_once($_SESSION['basePath'] . "model/carriers.php");
        $carriers = new Carriers();
        
        $carrierName = $carriers->getCarrier($data['carrier']);
        
        $logs = new Logs;
        $logs->createExpedient("Expedientes", $data['service'], "Expedientes - C. Servicio", "'" . 'Ha añadido el porteador ' . $carrierName .  "'");

        if($expedients->checkCarrier($data)){
            return true;
        }else{
            return $expedients->setCarrier($data);
        }
    }

    /**
     * Añade un coche a un servicio
     *
     * @param array $data
     * 
     * @return bool
     */
    function setCar($data){
        $expedients = new Expedients();

        require_once($_SESSION['basePath'] . "model/cars.php");
        $cars = new Cars();
        $carLicense = $cars->getPlateByVehicle($data['car']);
        
        if($expedients->checkCar($data)){
            return null;
        }else{
            $logs = new Logs;
            $logs->createExpedient("Expedientes", $data['service'], "Expedientes - C. Servicio", "'" . 'Ha añadido el coche ' . $carLicense . "'");
            return $expedients->setCar($data);
        }
    }

    /**
     * Edita un porteador de un servicio
     * 
     * @param array $data
     * 
     * @return bool
     */
    function updateCarrier($data){
        $expedients = new Expedients();
        $serviceCarrier = $expedients->getServiceCarrier($data);

        require_once($_SESSION['basePath'] . "model/carriers.php");
        $carriers = new Carriers();
        $carrierName = $carriers->getCarrier($serviceCarrier['carrier']);
        
        $logs = new Logs;
        if($data['confirmed'] == 'true'){
            $logs->createExpedient("Expedientes", $serviceCarrier['service'], "Expedientes - C. Servicio", "'" . 'Ha confirmado al porteador ' . $carrierName .  "'");
        }else{
            $logs->createExpedient("Expedientes", $serviceCarrier['service'], "Expedientes - C. Servicio", "'" . 'Ha desconfirmado al porteador ' . $carrierName .  "'");
        }

        return $expedients->updateCarrier($data) ? true : false;
    }

    /**
     * Edita un porteador de un servicio
     * 
     * @param array $data
     * 
     * @return bool
     */
    function updateChoir($data){
        $expedients = new Expedients();
        $serviceChoir = $expedients->getServiceChoir($data['expedientID']);

        require_once($_SESSION['basePath'] . "model/choirs.php");
        $choirs = new Choirs();
        $choirName = $choirs->getChoir($serviceChoir['choir']);
        
        $logs = new Logs;
        if($data['notified'] == 1){
            $logs->createExpedient("Expedientes", $serviceChoir['service'], "Expedientes - C. Servicio", "'" . 'Ha confirmado al coro ' . $choirName .  "'");
        }else{
            $logs->createExpedient("Expedientes", $serviceChoir['service'], "Expedientes - C. Servicio", "'" . 'Ha desconfirmado al coro ' . $choirName .  "'");
        }

        return $expedients->updateChoir($data['Service_Choir']) ? true : false;
    }

    /**
     * Edita un porteador de un servicio
     * 
     * @param array $data ID del servicio
     * @return bool
     */
    function updateBellringer($data){
        $expedients = new Expedients;
        return $expedients->updateBellringer($data) ? true : false;
    }

    /**
     * Edita un coche de un servicio
     * 
     * @param array $data
     * 
     * @return bool
     */
    function updateCar($data){
        $expedients = new Expedients;
        return $expedients->updateCar($data);
    }
    
    /**
     * Elimina un porteador de un servicio
     * 
     * @param array $data
     * 
     * @return bool
     */
    function deleteCarrier($data){
        $expedients = new Expedients();
        $serviceCarrier = $expedients->getServiceCarrier($data);

        $result = $expedients->deleteCarrier($data) ? true : false;
        if($result){

            require_once($_SESSION['basePath'] . "model/carriers.php");
            $carriers = new Carriers();
            $carrierName = $carriers->getCarrier($serviceCarrier['carrier']);

            $logs = new Logs;
            $logs->createExpedient("Expedientes", $serviceCarrier['service'], "Expedientes - C. Servicio", "'" . 'Ha eliminado al porteador ' . $carrierName .  "'");

            return $expedients->deleteCarrierForServiceCar($serviceCarrier['service'], $serviceCarrier['carrier']);
        }else{
            return false;
        }
    }
    
    /**
     * Elimina un coche de un servicio
     * 
     * @param array $data
     * 
     * @return bool
     */
    function deleteCar($data){
        $expedients = new Expedients();
        $serviceCar = $expedients->getServiceCar($data['serviceCar']);
        
        require_once($_SESSION['basePath'] . "model/cars.php");
        $cars = new Cars();
        $carLicense = $cars->getPlateByVehicle($serviceCar['car']);
        
        $logs = new Logs;
        $logs->createExpedient("Expedientes", $serviceCar['service'], "Expedientes - C. Servicio", "'" . 'Ha eliminado el coche ' . $carLicense .  "'");

        return $expedients->deleteCar($data) ? true : false;
    }

    /**
     * Elimina un coche de un servicio
     * 
     * @param array $data
     * 
     * @return bool
     */
    function logCreateDocument($expedient, $doc){
        $logs = new Logs;
        $logs->createExpedient("Expedientes", $expedient, "Expedientes - C. Servicio", "'" . 'Ha creado el documento ' . $doc .  "'");
        return true;
    }

    /**
     * Obtiene los datos de las contrataciones de un expediente
     * 
     * @param array $data
     * 
     * @return array
     */
    function updateOthersSection($data){
        $expedients = new Expedients();
        if(isset($data['products'])){
            return $expedients->updateProductOthersSection($data['expedientID'], $data['products']);
        }
        return true;
    }
    
    /**
     * Obtiene los datos de un usuario
     * 
     * @param int $data
     * 
     * @return array
     */
    function getUserById($data){
        $expedients = new Expedients();

        return $expedients->getUserById($data);
    }

    /**
     * Obtiene los datos del resumen del servicio
     * 
     * @param int ID del servicio
     * 
     * @return array
     */
    function getSummary($data){
        $expedients = new Expedients();

        return $expedients->getSummary($data);
    }

    /**
     * Obtiene los datos del resumen del servicio
     * 
     * @param int ID del servicio
     * 
     * @return array
     */
    function setSummary($data){
        $expedients = new Expedients();

        return $expedients->setSummary($data);
    }

    /**
     * Obtiene los datos de control del expediente
     * 
     * @param int $data ID del expediente
     * @return array
     */
    function readControl($data){
        $expedients = new Expedients;

        return $expedients->readControl($data);
    }

    /**
     * Modifica los datos de control del expediente
     * 
     * @param int $data Datos del control
     * @return bool
     */
    function updateControl($data){
        $expedients = new Expedients;

        return $expedients->updateControl($data);
    }

    /**
     * Modifica el estado del envío del email en el control del expediente
     * 
     * @param int $data ID del expediente
     * @return bool
     */
    function updateControlSent($data){
        $expedients = new Expedients;

        return $expedients->updateControlSent($data);
    }

    /**
     * Envía un email con los datos del control del expediente
     * 
     * @param int $data Datos del control
     * @return bool
     */
    function sendControl($data){
        $state = true;
        require_once($_SESSION['basePath'] . "model/obituaries.php");
        $expedients = new Obituaries;
        $expedientInfo =  $expedients->getTypeModelExpedient($data['expedient']);

        $type = 0;
        $model = 0;
        $firstResult = true;
        if($expedientInfo != null){
            foreach($expedientInfo as $info){
                if(is_file($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/". $data['expedient']."/obituary/".$info["type"]."/".$info["model"]."/files/esquela.pdf") && $firstResult){
                    $type = $info["type"];
                    $model = $info["model"];
                    $firstResult = false;
                }
            }
        }

        require_once($_SESSION['basePath'] . "core/tools/mailHandler.php");
        $mailHandler = new MailHandler;
        
        $emailsSent = 0;

        foreach($data['emails'][0] as $index => $email){
            if($email != ''){
                $emailsSent++;
                $flag = $mailHandler->sendControl($email, $data['body'], $data['expedient'], $type, $model, $index);
                if(!$flag){
                    $state = false;
                }
            }
        }

        if($data['emails'][1] != '' && $data['emails'][1] != null){
            $copy = explode(",", $data['emails'][1]);
            foreach($copy as $email){
                if($email != ''){
                    $emailsSent++;
                    $flag = $mailHandler->sendControl($email, $data['body'], $data['expedient'], $type, $model);
                    if(!$flag){
                        $state = false;
                    }
                }
            }
        }

        foreach($data['emails'][2] as $index => $email){
            if($email != ''){
                $emailsSent++;
                $flag = $mailHandler->sendControl($email, $data['body'], $data['expedient'], $type, $model, $index);
                if(!$flag){
                    $state = false;
                }
            }
        }

        return [$state, $emailsSent];
    }

    /**
     * Obtiene los correos para enviar al servicio
     * 
     * @param array $data IDs de los correos
     * @return array
     */
    function getEmailsControl($data){
        $expedients = new Expedients;
        return $expedients->getEmailsControl($data);
    }

    /**
     * Obtiene los coches del servicio
     * 
     * @param array $data ID del expediente
     * @return array
     */
    function getCars($data){
        $expedients = new Expedients;
        return $expedients->getCars($data);
    }

    /**
     * Logs
     *
     * @param int $expedient Id del expediente
     * @return bool
     */
    function setLogRead($expedient){
        $logs = new Logs;
        $logs->createExpedient("Expedientes", $expedient, "Expedientes - C. Servicio - Consulta", "'Ha consultado el servicio del expediente'");
    }

    /**
     * Logs
     *
     * @param int $expedient Id del expediente
     * @return bool
     */
    function setLogUpdate($expedient){
        $logs = new Logs;
        $logs->createExpedient("Expedientes", $expedient, "Expedientes - C. Servicio - Modificación", "'Ha modificado el servicio del expediente'");
    }

    /**
     * Obtiene el tanatorio del expediente
     * 
     * @param int $expedient Id del expediente
     * @return int|null
     */
    function getDeliveryPlace($expedient){
        $expedients = new Expedients;
        return $expedients->getDeliveryPlace($expedient);
    }
  
    /**
     * Comprueba si los productos de la contratacion están vinculados con Curas/Coros/Campaneros/Enterradores
     * 
     * @param int $expedient Id del expediente     * 
     * @return bool
     */
    function checkBlockProduct($expedient){
        $expedients = new Expedients;
        return $expedients->checkBlockProduct($expedient);
    }

    /**
     * Comprueba si el acta de preparación está creada para un expediente
     * 
     * @param int $expedient Id del expediente
     * @return bool
     */
    function checkActPrep($expedient){
        $expedients = new Expedients;
        return $expedients->checkActPrep($expedient);
    }

    /**
     * Obtiene la sala del expediente
     * 
     * @param int $expedient Id del expediente
     * @return bool
     */
    function getDeceasedRoom($expedient){
        $expedients = new Expedients;
        return $expedients->getDeceasedRoom($expedient);
    }

    /**
     * Obtiene la sección otros del servicio del expediente
     * 
     * @param int $expedient Expediente
     * @return array
     */
    function getOthers($expedient){
        $expedients = new Expedients;

        $servicesOrders = $expedients->getServicesOrders($expedient);
        $servicesNoOrders = $expedients->getServicesNoOrders($expedient);
        $servicesOrderType = $expedients->getServiceOrderType($expedient);

        return array($servicesOrders, $servicesNoOrders, $servicesOrderType);
    }

    /**
     * Publica la esquela en la web
     * 
     * @param int $expedient Expediente
     * @return bool
     */
    function publish($expedient){
        $expedients = new Expedients;
        if($expedients->publish($expedient)){
            return $expedients->getWebLink($expedient);
        }else{
            return false;
        }
    }

    /**
     * Quita la esquela en la web
     * 
     * @param int $expedient Expediente
     * @return bool
     */
    function unpublish($expedient){
        $expedients = new Expedients;
        return $expedients->unpublish($expedient);
    }

    /**
     * Obtiene los estados de los expedientes
     *
     * @param int $data
     * @return array
     */
    function getExpedientInfo($data){
        $expedients = new Expedients;
        return $expedients->getDataApiPanel($data);
    }

    /**
     * Obtiene los estados de los expedientes
     *
     * @param int $data
     * @return array
     */
    function getNotesService($data){
        require_once($_SESSION['basePath'] . "model/expedientsNotes.php");
        $expedientNotes = new ExpedientsNotes;
        $found = $expedientNotes->getByExpedient($data['expedient'], 1);

        return array($found, $_SESSION['user']);
    }
?>