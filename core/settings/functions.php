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
        switch($type){
            case 'getCompany':
                echo json_encode($_SESSION['company']);
            break;
            case 'getObituaryAnniversary':
                echo json_encode(getObituaryAnniversary());
            break;
            case 'updateObituaryAnniversary':
                echo json_encode(updateObituaryAnniversary($_POST));
            break;
            case 'getIvaType':
                echo json_encode(getIvaType());
            break;
            case 'getVerifactu':
                echo json_encode(getVerifactu());
            break;
        }
    }

    /**
     * Obtiene la configuración de los recordatorios para esquelas de aniversario
     * 
     * @return array
     */
    function getObituaryAnniversary(){
        require_once($_SESSION['basePath'] . "model/settings.php");

        $settings = new Settings;
        return $settings->getObituaryAnniversary();
    }

    /**
     * Actualiza la configuración de los recordatorios para esquelas de aniversario
     * 
     * @return array
     */
    function updateObituaryAnniversary($data){
        require_once($_SESSION['basePath'] . "model/settings.php");

        $settings = new Settings;
        return $settings->updateObituaryAnniversary($data);
    }

    /**
     * Obtiene el tipo de IVA
     * 
     * @return array
     */
    function getIvaType(){
        require_once($_SESSION['basePath'] . "model/settings.php");
        $settings = new Settings;
        return $settings->getIvaType();
    }

    /**
     * Obtiene si verifactu esta activado
     * 
     * @return array
     */
    function getVerifactu(){
        require_once($_SESSION['basePath'] . "model/settings.php");
        $settings = new Settings;
        return $settings->getVerifactu();
    }
?>