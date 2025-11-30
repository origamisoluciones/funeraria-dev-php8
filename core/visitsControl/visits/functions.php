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
    
    require_once($_SESSION['basePath'] . "model/visitsControl.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getExpedientByVisit':                 
                echo json_encode(getExpedientByVisit($_POST['visitID']));
            break;
            case 'getVisitControlByVisit':
                echo json_encode(getVisitControlByVisit($_POST['visitID']));
            break;
            case 'getVisitsIDs':
                echo json_encode(getVisitsIDs($_POST['visitID']));
            break;
            case 'existsVisit':
                echo json_encode(existsVisit($_POST['visit']));
            break;
            case 'existsVisitEdit':
                echo json_encode(existsVisitEdit($_POST['visit']));
            break;
            case 'isVisitCompleted':
                echo json_encode(isVisitCompleted($_POST['visitID'], $_POST['position']));
            break;
            case 'changeVisitExpedientStatus':
                echo json_encode(changeVisitExpedientStatus($_POST['visitID'], $_POST['status']));
            break;
            case 'getStaffByUserID':
                echo json_encode(getStaffByUserID( $_POST['id']));
            break;
        }
    }

    function getExpedientByVisit($data){
        $visitsExpedient = new VisitsControl();
        return $visitsExpedient->getExpedientByVisit($data);
    }

    function getVisitControlByVisit($data){
        $visitsControlID = new VisitsControl();
        return $visitsControlID->getVisitControlByVisit($data);
    }

    function getVisitsIDs($data){
        $visitsIDs = new VisitsControl();
        return $visitsIDs->getVisitsIDs($data);
    }

    /**
     * Comprueba si una visita existe
     * 
     * @param int $visit Id de la visita
     * @return bool
     */
    function existsVisit($visit){
        $visitsControl = new VisitsControl;
        return $visitsControl->existsVisit($visit);
    }

    /**
     * Comprueba si una descripción de una visita existe
     * 
     * @param int $visit Id de la visita
     * @return bool
     */
    function existsVisitEdit($visit){
        $visitsControl = new VisitsControl;
        return $visitsControl->existsVisitEdit($visit);
    }
    /**
     * Cambia el estado de una visita
     * 
     * @param int $visit Id de la visita
     * @return bool
     */
    function changeVisitExpedientStatus($visit, $status){
        $visitsControl = new VisitsControl;
        return $visitsControl->updateVisitControl($visit,$status);
    }
    /**
     * Obtiene el nombre de personal en sesion
     * 
     * @param int $visit Id de la visita
     * @return bool
     */
    function getStaffByUserID($id){
        $visitsControl = new VisitsControl;
        return $visitsControl->getStaffByUserID($id);
    }
    /**
     * Comprueba si el el control de una visita esta completado o no
     * 
     * @param int $visit Id de la visita
     * @param string $position posicion de la visita
     * @return bool
     */
    function isVisitCompleted($visitID, $position){
        $visitsControl = new VisitsControl;
        switch ($position) {
            case 'first':
                $ret = $visitsControl->isFirstVisitCompleted($visitID);
            break;            
            case 'last':
                $ret = $visitsControl->isLastVisitCompleted($visitID);
            break;            
            case 'middle':
                $ret = $visitsControl->isMiddleVisitCompleted($visitID);
            break;            
            default:
                $ret = $visitsControl->isMiddleVisitCompleted($visitID);
            break;
        }
        return $ret;
    }
?>