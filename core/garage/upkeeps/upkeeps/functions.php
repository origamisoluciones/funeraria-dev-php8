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

    require_once($_SESSION['basePath'] . "model/upkeeps.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
              
        switch($type){
            case 'getITV':                
                echo json_encode(getITV($_POST['ID']));
            break;            
            case 'updateITV':                
                echo json_encode(updateITV($_POST['ID'], $_POST['datePrevItv'], $_POST['dateNextItv'], $_POST['firstDay'], $_POST['cost'], $_POST['kms']));
            break;
            case 'getInsurance':                
                echo json_encode(getInsurance($_POST['ID']));
            break;
            case 'updateInsurance':                
                echo json_encode(updateInsurance($_POST['ID'], $_POST['paymentDate'], $_POST['amountInsurance'], $_POST['createDate'], $_POST['finalDate'], $_POST['insurancePolicy'], $_POST['company'], $_POST['phone']));
            break;
            case 'checkKms':                
                echo json_encode(checkKms($_POST['id'], $_POST['kms']));
            break;
            case 'getPendingUpkeeps':                
                echo json_encode(getPendingUpkeeps($_POST['vehicle']));
            break;
            case 'getPendingUpkeepsV2':                
                echo json_encode(getPendingUpkeepsV2($_POST['vehicle']));
            break;
            case 'setInsurance':                
                echo json_encode(setInsurance($_POST['data']));
            break;
            case 'updateItvSaved':                
                echo json_encode(updateItvSaved($_POST['data']));
            break;
            case 'deleteItv':                
                echo json_encode(deleteItv($_POST['data']));
            break;
        }
    }   

    /**
    * Obtiene el historial de ITV de un coche
    *
    * @return array
    */
    function getITV($id){
        $vehicles = new Upkeeps();
        return $vehicles->getITV($id);
    }

    /**
    * Actualiza el historial de ITV de un coche
    *
    * @return array
    */
    function updateITV($id, $datePrev, $dateNext, $fistDay, $cost, $kms){
        $vehicles = new Upkeeps();
        return $vehicles->updateITV($id, $datePrev, $dateNext, $fistDay, $cost, $kms);
    }

    /**
    * Obtiene el historial de pagos del seguro de un coche
    *
    * @return array
    */
    function getInsurance($id){
        $vehicles = new Upkeeps();
        return $vehicles->getInsurance($id);
    }

    /**
    * Actualiza el historial de pagos del seguro de un coche
    *
    * @return array
    */
    function updateInsurance($id, $date, $amount, $createDate, $finalDate, $insurancePolicy, $company, $phone){
        $vehicles = new Upkeeps();
        return $vehicles->updateInsurance($id, $date, $amount, $createDate, $finalDate, $insurancePolicy, $company, $phone);
    }

    /**
     * Comprueba si los kms son mayores que los del último mantenimiento
     * 
     * @param int $id Mantenimiento
     * @param int $kms Kilómetros
     * @return bool
     */
    function checkKms($id, $kms){
        $upkeeps = new Upkeeps;
        return $upkeeps->checkKms($id, $kms);
    }

    /**
     * Obtiene los mantenimientos pendientes del vehículo
     * 
     * @param int $vehicle Vehículo
     * @return array
     */
    function getPendingUpkeeps($vehicle){
        $upkeeps = new Upkeeps;
        return $upkeeps->getPendingUpkeeps($vehicle);
    }

    /**
     * Obtiene los mantenimientos pendientes del vehículo
     * 
     * @param int $vehicle Vehículo
     * @return array
     */
    function getPendingUpkeepsV2($vehicle){
        $upkeeps = new Upkeeps;
        return $upkeeps->getPendingUpkeepsV2($vehicle);
    }
    
    /**
     * Modifica los datos de un seguro
     * 
     * @param array $data Datos
     * @return array
     */
    function setInsurance($data){
        $upkeeps = new Upkeeps;
        return $upkeeps->setInsurance($data);
    }

    /**
     * Modifica los datos de una itv
     * 
     * @param array $data Datos
     * @return array
     */
    function updateItvSaved($data){
        $upkeeps = new Upkeeps;
        return $upkeeps->updateItvSaved($data);
    }

    /**
     * Deletes an ITV
     * 
     * @param array $data Datos
     * @return array
     */
    function deleteItv($data){
        $upkeeps = new Upkeeps;
        return $upkeeps->deleteItv($data);
    }
?>