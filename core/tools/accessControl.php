<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
    }

    if(empty($_POST) || !isset($_POST['action'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/accessControl.php");
    require_once($_SESSION['basePath'] . "model/accessPages.php");
    require_once($_SESSION['basePath'] . "model/companies.php");

    if(isset($_POST['action'])){
        $action = $_POST['action'];
        switch($action){
            case 'checkAccess':
                echo json_encode(checkAccess($_POST['userType'], $_POST['url']));
            break;
            case 'dropAccess':
                echo json_encode(dropAccess());
            break;
            case 'checkSessionExpedient':
                echo json_encode(checkSessionExpedient($_POST['path']));
            break;
            case 'getPlanHired':
                echo json_encode(getPlanHired());
            break;
            case 'getUserLimit':
                echo json_encode(getUserLimit());
            break;
            case 'checkViaFirmaApiKeys':
                echo json_encode(checkViaFirmaApiKeys());
            break;
            case 'checkVivaRecuerdoApiKeys':
                echo json_encode(checkVivaRecuerdoApiKeys($_POST['expedient']));
            break;
            case 'checkSessionExpedientNoCurrent':
                echo json_encode(checkSessionExpedientNoCurrent($_POST['path']));
            break;
            case 'checkSmsUp':
                echo json_encode(checkSmsUp());
            break;
            case 'getSmsUp':
                echo json_encode(getSmsUp());
            break;
        }
    }

    /**
     * Comprueba si el tipo de usuario tiene permiso para acceder a la url
     * 
     * @param int $userType Tipo de usuario
     * @param string $url Url
     * @return bool
     */
    function checkAccess($userType, $url){
        if(!isset($_SESSION['company'])){
            return null;
        }

        $currentSession = $_SESSION['company'];
        $_SESSION['company'] = '0';

        $accessPages = new AccessPages;
        $response = $accessPages->checkPlanUrlAccess($currentSession, $url);

        $_SESSION['company'] = $currentSession;

        if(!$response){
            return 'no-plan-access';
        }

        $accessControl = new AccessControl;
        return $accessControl->check($userType, $url);
    }

    /**
     * Modifica la cookie con un valor a false para echar al usuario de la sesión
     * 
     * @return bool
     */
    function dropAccess(){
        require_once($_SESSION['basePath'] . "core/tools/security.php");
        return setcookie('user', 'false', time() + 60 * 60 * 24 * 30, '/', '', false, false);
    }

    /**
     * Comprueba si hay ya un usuario en una zona del expediente
     * 
     * @param string $page Página actual
     * @return bool
     */
    function checkSessionExpedient($page){
        require_once($_SESSION['basePath'] . "model/users.php");

        $users = new Users;
        return $users->userOnExpedient($page);
    }

    /**
     * Comprueba si hay ya un usuario en una zona del expediente
     * 
     * @param string $page Página actual
     * @return bool
     */
    function checkSessionExpedientNoCurrent($page){
        require_once($_SESSION['basePath'] . "model/users.php");

        $users = new Users;
        return $users->userOnExpedientNoCurrent($page);
    }

    /**
     * Obtiene el plan contratado por la compañia
     * 
     * @return bool
     */
    function getPlanHired(){
        if(!isset($_SESSION['company'])){
            return null;
        }

        $currentSession = $_SESSION['company'];
        $_SESSION['company'] = '0';

        $companies = new Companies;
        $plan = $companies->getPlanHired($currentSession);

        $_SESSION['company'] = $currentSession;
        
        return $plan[0]['plan'];
    }

    /**
     * Obtiene numero de usuarios máximos por empresa
     * 
     * @return bool
     */
    function getUserLimit(){
        if(!isset($_SESSION['company'])){
            return null;
        }

        $currentSession = $_SESSION['company'];
        $_SESSION['company'] = '0';

        $companies = new Companies;
        $userLimit = $companies->getUserLimit($currentSession);

        $_SESSION['company'] = $currentSession;
        
        return $userLimit[0]['limit_users'];
    }

    /**
     * Comprueba si la compañía tiene claves para firmar documentos
     * 
     * @return bool
     */
    function checkViaFirmaApiKeys(){
        if(!isset($_SESSION['company'])){
            return null;
        }

        $currentSession = $_SESSION['company'];
        $_SESSION['company'] = '0';

        $companies = new Companies;
        $existsAPIKeys = $companies->checkViaFirmaApiKeys($currentSession);

        $_SESSION['company'] = $currentSession;
        
        return $existsAPIKeys;
    }

    /**
     * Comprueba si la compañía tiene claves para firmar documentos
     * 
     * @return bool
     */
    function checkSmsUp(){
        if(!isset($_SESSION['company'])){
            return null;
        }

        $currentSession = $_SESSION['company'];
        $_SESSION['company'] = '0';

        $companies = new Companies;
        $existsAPIKeys = $companies->checkSmsUp($currentSession);

        $_SESSION['company'] = $currentSession;
        
        return $existsAPIKeys;
    }

    /**
     * Obtiene los sms disponibles de un subcuenta
     * 
     * @return bool
     */
    function getSmsUp(){
        require($_SESSION['basePath'] . "model/smsUp.php");
        $smsUp = new SmsUp;
        return $smsUp->getBalance();
    }

    /**
     * Comprueba si la compañía tiene claves para vivo recuerdo
     * 
     * @return bool
     */
    function checkVivaRecuerdoApiKeys($expedient){
        if(!isset($_SESSION['company'])){
            return null;
        }

        $existsAPIKeys = false;
        
        require_once($_SESSION['basePath'] . "model/mortuaries.php");
        $mortuaries = new Mortuaries();
        $checkCredentials = $mortuaries->checkVivaRecuerdoApiKeys($expedient);
        if($checkCredentials){
            if(
                $checkCredentials[0]['api_client'] != null && $checkCredentials[0]['api_key'] != null
                && $checkCredentials[0]['api_client'] != '' && $checkCredentials[0]['api_key'] != ''
            ){
                $existsAPIKeys = true;
            }
        }else{
            $existsAPIKeys = false;
        }
     
        
        return $existsAPIKeys;
    }
?>