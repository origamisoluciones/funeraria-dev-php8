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

    if(isset($_POST['type'])){
        $type = $_POST['type'];
       
        $array_return = Array();
        switch($type){
            case 'getAllNotifications':
                $array_return = array(
                    "getVisitsControlReminder" => getVisitsControlReminder(),
                    "getEventCalendarReminder" => getEventCalendarReminder(),
                    "getEventCremationReminder" => getEventCremationReminder(),
                    "getEventUpkeepReminder" => getEventUpkeepReminder(), 
                    "getEventGarageReminder" => getEventGarageReminder(),
                    "getEventItvReminder" => getEventItvReminder(),
                    "getStockReminder" => getStockReminder(),
                    "getEvents" => getEvents(),
                    "getEventsUpkeep" => getEventsUpkeep(),
                    "isPriestNotified" => isPriestNotified(),
                    "isGravediggerNotified" => isGravediggerNotified(),
                    "isCarrierNotified" => isCarrierNotified(),
                    "isChoirNotified" => isChoirNotified(),
                    "isBellringerNotified" => isBellringerNotified(),
                    "isPoliceNotified" => isPoliceNotified(),
                    "isWebNotified" => isWebNotified(),
                    "isPreparationNotified" => isPreparationNotified(),
                    "isDoctorNotified" => isDoctorNotified(),
                    "isTribunalNotified" => isTribunalNotified(),
                    "isControlNotified" => isControlNotified(),
                    "isReminderNotified" => isReminderNotified(),
                    "isFlowerNotified" => isFlowerNotified(),
                    "isBusNotified" => isBusNotified(),
                    "isTaxiNotified" => isTaxiNotified(),
                    "getExpedientStatusPendingInvoices" => getExpedientStatusPendingInvoices(),
                    "expedientsNotes" => getExpedientsNotes()
                );
                
                echo json_encode($array_return);
            break;
        }
    }
   
    /**
     * Obtiene las notificaciones para el control de visitas
     * 
     * @return array
     */
    function getVisitsControlReminder(){
        require_once($_SESSION['basePath'] . "model/visitsControl.php");

        $visitsControl = new VisitsControl;
       
        return $visitsControl->getVisitsControlReminder();
    }
    
    /**
     * Obtiene las notificaciones de la agenda general
     * 
     * @return array
     */
    function getEventCalendarReminder(){
        require_once($_SESSION['basePath'] . "model/events.php");

        $events = new Events;
        return $events->getEventCalendarReminder();
    }

    /**
     * Obtiene las notificaciones de la agenda de las cremaciones
     * 
     * @return array
     */
    function getEventCremationReminder(){
        require_once($_SESSION['basePath'] . "model/events.php");

        $events = new Events;
       
        return $events->getEventCremationReminder();
    }

    /**
     * Obtiene las notificaciones de la agenda de mantenimiento
     * 
     * @return array
     */
    function getEventUpkeepReminder(){
        require_once($_SESSION['basePath'] . "model/events.php");

        $events = new Events;
        return $events->getEventUpkeepReminder();
    }

    /**
     * Obtiene las notificaciones de la agenda del taller
     * 
     * @return array
     */
    function getEventGarageReminder(){
        require_once($_SESSION['basePath'] . "model/events.php");

        $events = new Events;
        return $events->getEventGarageReminder();
    }

    /**
     * Obtiene las notificaciones de la agenda del taller de la ITV
     * 
     * @return array
     */
    function getEventItvReminder(){
        require_once($_SESSION['basePath'] . "model/events.php");

        $events = new Events;
        return $events->getEventItvReminder();
    }

    /**
     * Obtiene las notificaciones del almacén
     * 
     * @return array
     */
    function getStockReminder(){
        require_once($_SESSION['basePath'] . "model/stock.php");

        $stock = new Stock;
        return $stock->getStockReminder();
    }

    /**
     * Obtiene los eventos de la agenda
     * 
     * @return array
     */
    function getEvents(){
        require_once($_SESSION['basePath'] . "model/events.php");
        $events = new Events();
        return $events->getNumEvents();
    }

    /**
     * Obtiene los eventos de la agenda de mantenimiento
     * 
     * @return array
     */
    function getEventsUpkeep(){
        require_once($_SESSION['basePath'] . "model/events.php");
        $events = new Events();
        return $events->getNumEventsUpkeep();
    }

    /**
     * Comprueba si se ha notificado al cura
     * 
     * @param array $expedient Expediente
     * @return bool
     */
    function isPriestNotified(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
        return $expedients->isPriestNotified();
    }
    /**
     * Comprueba si se ha notificado al enterrador
     * 
     * @param array $expedient Expediente
     * @return bool
     */
    function isGravediggerNotified(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
        return $expedients->isGravediggerNotified();
    }

    /**
     * Comprueba si se ha notificado al porteador
     * 
     * @param array $expedient Expediente
     * @return bool
     */
    function isCarrierNotified(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
        return $expedients->isCarrierNotified();
    }
     /**
     * Comprueba si se ha notificado al coro
     * 
     * @param array $expedient Expediente
     * @return bool
     */
    function isChoirNotified(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
        return $expedients->isChoirNotified();
    }
     /**
     * Comprueba si se ha notificado al campanero
     * 
     * @param array $expedient Expediente
     * @return bool
     */
    function isBellringerNotified(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
        return $expedients->isBellringerNotified();
    }

    /**
     * Comprueba si se ha notificado a la policia
     * 
     * @param array $expedient Expediente
     * @return bool
     */
    function isPoliceNotified(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
        return $expedients->isPoliceNotified();
    }
     /**
     * Comprueba si la web se ha confirmado
     * 
     * @param array $expedient Expediente
     * @return bool
     */
    function isWebNotified(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
        return $expedients->isWebNotified();
    }

    /**
     * Comprueba si el acta de preparacion se ha confirmado
     *     
     * @return array
     */
    function isPreparationNotified(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
        return $expedients->isPreparationNotified();
    }
     /**
     * Comprueba si el certificado medico se ha entregado
     *     
     * @return array
     */
    function isDoctorNotified(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
        return $expedients->isDoctorNotified();
    }
     /**
     * Comprueba si el juzgado se ha entregado
     *     
     * @return array
     */
    function isTribunalNotified(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
        return $expedients->isTribunalNotified();
    }
     /**
     * Comprueba si el control  se ha realizado
     *     
     * @return array
     */
    function isControlNotified(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
        return $expedients->isControlNotified();
    }

     /**
     * Comprueba si el recordatorio  se ha creado
     *     
     * @return array
     */
    function isReminderNotified(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
      

        return $expedients->isReminderNotified();
    }
     /**
     * Comprueba si flroes  se han confirmado
     *     
     * @return array
     */
    function isFlowerNotified(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
        return $expedients->isFlowerNotified();
    }
     /**
     * Comprueba si los autobuses  se han confirmado
     *     
     * @return array
     */
    function isBusNotified(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
        return $expedients->isBusNotified();
    }
     /**
     * Comprueba si los taxis  se han avisado
     *     
     * @return array
     */
    function isTaxiNotified(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
        return $expedients->isTaxiNotified();
    }
    
    /**
     * obtiene los expedientes con estado pendiente de facturacion
     *     
     * @return array
     */
    function getExpedientStatusPendingInvoices(){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients;
        return $expedients->getExpedientStatusPendingInvoices();
    }
   
    /**
     * Gets expedients notes
     *     
     * @return array
     */
    function getExpedientsNotes(){
        require_once($_SESSION['basePath'] . "model/expedientsNotes.php");
        $expedientsNotes = new ExpedientsNotes;
        return $expedientsNotes->getExpedientsNotes();
    }
?>