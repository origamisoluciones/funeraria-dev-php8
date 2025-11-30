<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
    }

    if(empty($_POST) || !isset($_POST['type'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "core/tools/security.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        if($type != 'getUserType' && $type != 'checkSession'){
            if(!isset($_SESSION['user'])){
                http_response_code(403);
                return;
            }
        }

        switch($type){
            case 'getEvents':
                echo json_encode(getEvents());
                break;
            case 'getEventsUpkeep':
                echo json_encode(getEventsUpkeep());
                break;
            case 'getNumReminders':
                echo json_encode(getNumReminders());
                break;
            case 'checkStock':
                echo json_encode(checkStock());
                break;
            case 'referer':
                echo json_encode(referer());
                break;
            case 'getUserType':
                echo json_encode(getUserType($_POST['cookie']));
                break;
            case 'getUserTypeID':
                echo json_encode($_SESSION['type']);
                break;
            case 'getEventCalendarReminder':
                echo json_encode(getEventCalendarReminder());
                break;
            case 'getEventCremationReminder':
                echo json_encode(getEventCremationReminder());
                break;
            case 'getEventUpkeepReminder':
                echo json_encode(getEventUpkeepReminder());
                break;
            case 'getEventGarageReminder':
                echo json_encode(getEventGarageReminder());
                break;
            case 'getStockReminder':
                echo json_encode(getStockReminder());
                break;
            case 'getEventItvReminder':
                echo json_encode(getEventItvReminder());
                break;
            case 'getVisitsControlReminder':
                echo json_encode(getVisitsControlReminder());
                break;
            case 'getCompany':
                echo isset($_SESSION['company']) ? json_encode($_SESSION['company']) : null;
            break;
            case 'getMainSupplier':
                echo json_encode(getMainSupplier());
            break;
            case 'checkSession':
                if(isset($_SESSION['user'])){
                    echo json_encode(true);
                }else{
                    $_SESSION['errorTimeOut'] = true;
                    echo json_encode(false);
                }
            break;
        }
    }

    /**
     * Obtiene los tareas (servicios) de un expediente
     * 
     * @return array
     */
    function checkStock(){
        require_once($_SESSION['basePath'] . "model/stock.php");
        $stock = new Stock();
        return $stock->checkStock();
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
     * Obtiene los eventos de la agenda de mantenimiento
     * 
     * @return array
     */
    function getNumReminders(){
        require_once($_SESSION['basePath'] . "model/events.php");
        $events = new Events();
        return $events->getNumReminders();
    }
    
    /**
     * Obtiene parámetros del servidor
     * 
     * @return array
     */
    function referer(){
        return $_SERVER;
    }

    /**
     * Desencripta una cookie para obtener el tipo de usuario
     * 
     * @param string $cookie Cookie
     * @return string Tipo de usuario
     */
    function getUserType($cookie){
        if(!isset($_COOKIE['user'])){
            setcookie('user', 'false', time() + 60 * 60 * 24 * 30, '/', '', false, false);
        }
        require_once($_SESSION['basePath'] . 'core/tools/security.php');
        $cookie = toCrypt($_COOKIE['user'], 'd');
        return $cookie;
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
     * Obtiene el proveedor principal de "configuración"
     * 
     * @return array
     */
    function getMainSupplier(){
        require_once($_SESSION['basePath'] . "model/settings.php");
        $settings = new Settings();
        return $settings->getCompany();
    }
?>