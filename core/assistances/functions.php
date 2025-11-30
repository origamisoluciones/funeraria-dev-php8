<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath']) || !isset($_SESSION['user'])){
        http_response_code(403);
        return;
    }

    if(empty($_POST) || !isset($_POST['type'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/assistances.php");
    
    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getYears':
                echo json_encode(getYears());
            break;
            case 'getExpedientID':
                echo json_encode(getExpedientID($_POST['assistance']));
            break;
            case 'getDataChart':
                echo json_encode(getDataChart());
            break;
            case 'existsAssistance':
                echo json_encode(existsAssistance($_POST['assistance']));
            break;
            case 'getSurvey':
                echo json_encode(getSurvey($_POST['assistance']));
            break;
        }
    }
    
    /**
     * Obtiene los distintos años de la limpieza
     * 
     * @return array
     */
    function getYears(){
        $assistances = new Assistances;
        return $assistances->getYears();
    }

    /**
     * Obtiene el ID del expediente
     * 
     * @return array
     */
    function getExpedientID($data){
        $assistances = new Assistances;
        return $assistances->getExpedientID($data);
    }

    /**
     * Obtiene los datos que se utilizarán para el gráfico
     * 
     * @return array
     */
    function getDataChart(){
        $data = [['Particulares',27.83],['Amparo',24.2]];
        return $data;
    }

    /**
     * Comprueba si una asistencia existe
     * 
     * @param int $assistance Id de la asistencia
     * @return bool
     */
    function existsAssistance($assistance){
        $assistances = new Assistances;
        return $assistances->existsAssistance($assistance);
    }

    /**
     * Obtiene la encuesta de satisfacción
     * 
     * @param int $assistance Asistencia
     * @return array
     */
    function getSurvey($assistance){
        require_once($_SESSION['basePath'] . "model/survey.php");

        $survey = new Survey;

        return $survey->getSurveyByAssistance($assistance);
    }
?>