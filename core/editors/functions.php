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
    
    require_once($_SESSION['basePath'] . "model/editors.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'unlockEsquela':
                echo json_encode(unlockEsquela($_POST['ID']));
            break;
            case 'unlockEsquelaPrensa':
                echo json_encode(unlockEsquelaPrensa($_POST['ID']));
            break;
            case 'unlockLapidaProvisional':
                echo json_encode(unlockLapidaProvisional($_POST['ID']));
            break;
            case 'unlockCerradoDefuncion':
                echo json_encode(unlockCerradoDefuncion($_POST['ID']));
            break;
            case 'unlockNoDuel':
                echo json_encode(unlockNoDuel($_POST['ID']));
            break;
            case 'unlockReminder':
                echo json_encode(unlockReminder($_POST['ID']));
            break;
            case 'unlockReminderPacket':
                echo json_encode(unlockReminderPacket($_POST['ID']));
            break;
            case 'unlockReminderPacketCross':
                echo json_encode(unlockReminderPacketCross($_POST['ID']));
            break;
            case 'unlockExpedientTab':
                echo json_encode(unlockExpedientTab($_POST['ID']));
            break;
            case 'unlockHiringTab':
                echo json_encode(unlockHiringTab($_POST['ID']));
            break;
            case 'unlockObituaryTab':
                echo json_encode(unlockObituaryTab($_POST['ID']));
            break;
            case 'unlockServiceTab':
                echo json_encode(unlockServiceTab($_POST['ID']));
            break;
            case 'unlockDocTab':
                echo json_encode(unlockDocTab($_POST['ID']));
            break;
        }
    }

    /**
     * Desbloquea el editor de una esquela
     * 
     * @param int $id Id
     * @return bool
     */
    function unlockEsquela($id){
        $editors = new Editors;
        return $editors->unlockEsquela($id);
    }

    /**
     * Desbloquea el editor de una esquela en prensa
     * 
     * @param int $id Id
     * @return bool
     */
    function unlockEsquelaPrensa($id){
        $editors = new Editors;
        return $editors->unlockEsquelaPrensa($id);
    }

    /**
     * Desbloquea el editor de una lápida
     * 
     * @param int $id Id
     * @return bool
     */
    function unlockLapidaProvisional($id){
        $editors = new Editors;
        return $editors->unlockLapidaProvisional($id);
    }

    /**
     * Desbloquea el editor de una lápida
     * 
     * @param int $id Id
     * @return bool
     */
    function unlockCerradoDefuncion($id){
        $editors = new Editors;
        return $editors->unlockCerradoDefuncion($id);
    }

    /**
     * Desbloquea el editor de una lápida
     * 
     * @param int $id Id
     * @return bool
     */
    function unlockNoDuel($id){
        $editors = new Editors;
        return $editors->unlockNoDuel($id);
    }

    /**
     * Desbloquea el editor de una lápida
     * 
     * @param int $id Id
     * @return bool
     */
    function unlockReminder($id){
        $editors = new Editors;
        return $editors->unlockReminder($id);
    }

    /**
     * Desbloquea el editor de una lápida
     * 
     * @param int $id Id
     * @return bool
     */
    function unlockReminderPacket($id){
        $editors = new Editors;
        return $editors->unlockReminderPacket($id);
    }

    /**
     * Desbloquea el editor de una lápida
     * 
     * @param int $id Id
     * @return bool
     */
    function unlockReminderPacketCross($id){
        $editors = new Editors;
        return $editors->unlockReminderPacketCross($id);
    }

    /**
     * Desbloquea la pestaña 'Expediente'
     * 
     * @param int $id Id
     * @return bool
     */
    function unlockExpedientTab($id){
        $editors = new Editors;
        return $editors->unlockExpedientTab($id);
    }

    /**
     * Desbloquea la pestaña 'Contratación'
     * 
     * @param int $id Id
     * @return bool
     */
    function unlockHiringTab($id){
        $editors = new Editors;
        return $editors->unlockHiringTab($id);
    }

    /**
     * Desbloquea la pestaña 'Esquela'
     * 
     * @param int $id Id
     * @return bool
     */
    function unlockObituaryTab($id){
        $editors = new Editors;
        return $editors->unlockObituaryTab($id);
    }

    /**
     * Desbloquea la pestaña 'C. Servicio'
     * 
     * @param int $id Id
     * @return bool
     */
    function unlockServiceTab($id){
        $editors = new Editors;
        return $editors->unlockServiceTab($id);
    }

    /**
     * Desbloquea la pestaña 'Documentación'
     * 
     * @param int $id Id
     * @return bool
     */
    function unlockDocTab($id){
        $editors = new Editors;
        return $editors->unlockDocTab($id);
    }
?>