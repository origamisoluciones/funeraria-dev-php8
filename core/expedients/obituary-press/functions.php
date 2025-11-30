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

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getSelectedObituary':
                echo json_encode(getSelectedObituary($_POST['expedient']));
            break;
            case 'checkExistObituary':
                echo json_encode(checkExistObituary($_POST['expedient'], $_POST['obituaryType']));
            break;
            case 'getNewObituary':
                echo json_encode(getNewObituary($_POST['expedient']));
            break;
            case 'getSavedObituary':
                echo json_encode(getSavedObituary($_POST['expedient'], $_POST['obituaryType']));
            break;
            case 'saveObituary':
                echo json_encode(saveObituary($_POST['obituary']));
            break;
            case 'getObituaryExpedient':
                echo json_encode(getObituaryExpedient($_POST['expedientID']));
            break;
            case 'createPdfObituary';
                echo createPdfObituary($_POST['svg'], $_POST['expedientID'], $_POST['obituaryModel'], $_POST['obituaryType']);
            break;
            case 'setObituaryPreview':
                echo json_encode(setObituaryPreview($_POST));
            break;
        }
    }

    /**
     * Obtiene la esquela por defecto
     *
     * @param int $data
     * 
     * @return bool
     */
    function getSelectedObituary($expedient){
        $expedients = new Expedients();
        return $expedients->getSelectedObituaryPress($expedient);
    }
    
    /**
     * Setea el campo urlXml para controlar el previsualizado de la esquela
     *
     * @param int $data
     * 
     * @return bool
     */
    function checkExistObituary($expedient, $obituaryType){
        $expedients = new Expedients();
        return $expedients->checkExistObituary($expedient, $obituaryType);
    }

    /**
     * Setea el campo urlXml para controlar el previsualizado de la esquela
     *
     * @param int $data
     * 
     * @return bool
     */
    function getNewObituary($expedient){
        $expedients = new Expedients();
        return $expedients->getNewObituary($expedient);
    }

    /**
     * Setea el campo urlXml para controlar el previsualizado de la esquela
     *
     * @param int $data
     * 
     * @return bool
     */
    function getSavedObituary($expedient, $type){
        $expedients = new Expedients();
        return $expedients->getSavedObituary($expedient, $type);
    }

    /**
     * Setea el campo urlXml para controlar el previsualizado de la esquela
     *
     * @param int $data
     * 
     * @return bool
     */
    function saveObituary($obituary){
        $expedients = new Expedients();
        $data = array();
        foreach($obituary as $name => $value){
            $aux = array($name => cleanStr($value));
            $data = array_merge($data, $aux);
        }
        return $expedients->saveObituary($data);
    }

    /**
     * Setea el campo urlXml para controlar el previsualizado de la esquela
     *
     * @param int $data
     * 
     * @return bool
     */
    function setObituaryPreview(){
        $expedients = new Expedients();
        return $expedients->setObituaryPreview($_POST);
    }
    
    
    /**
     * Obtiene los estados de los expedientes
     *
     * @param int $data
     * 
     * @return array
     */
    function getObituaryExpedient($data){
        $expedients = new Expedients();
        return $expedients->getObituaryExpedient($data);
    }
    
    /**
     * Crea un PDF para la esquela asociada al expediente en cuestión
     *
     * @return bolean
     */
    function createPdfObituary($svg, $expedientID, $obituaryModel, $obituaryType){
        //Guardamos la cadena svg en nuestro fichero de esquela en formato SVG
        $svgPath = $_SESSION['basePath'].'resources/files/' . $_SESSION['company'] . '/expedients/'.$expedientID.'/obituary-press/'.$obituaryModel.$obituaryType.'.svg';
        
        $file=fopen($svgPath,"w");
        fwrite($file, $svg);
        fclose($file);
        
        // Librería MPDF
        require_once($_SESSION['basePath'] ."core/libraries/pdfs/tools/mpdf60/mpdf.php");
        
        //$utils = new Utils();
        
        //Configuramos MPDF para crear nuestra esquela en formato PDF, tamaño A4
        //Tamaño del documento
        $pdf = new mPDF('UTF-8','A4', 0, '', 5, 5, 5, 5, 0, 0);

        $svg = file_get_contents($svgPath);
        $im = new Imagick();
        //var_dump($svg);

        $im->readImageBlob($svg);

        /*png settings*/
        $im->setImageFormat("png24");
        $im->resizeImage(720, 445, imagick::FILTER_LANCZOS, 1);  /*Optional, if you need to resize*/

        /*jpeg*/
        $im->setImageFormat("jpeg");
        $im->adaptiveResizeImage(720, 445); /*Optional, if you need to resize*/

        $im->writeImage($_SESSION['basePath'].'resources/files/' . $_SESSION['company'] . '/expedients/'.$expedientID.'/obituary-press/'.$obituaryModel.$obituaryType.'.png');/*(or .jpg)*/
        $im->clear();
        $im->destroy();
    }
?>