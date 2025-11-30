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
            case 'getOwnMortuaries':
                echo json_encode(getOwnMortuaries());
            break;
            case 'getDepartureTodayInfo':
                echo json_encode(getDepartureTodayInfo($_POST['expedient']));
            break;
            case 'getCremationInfo':
                echo json_encode(getCremationInfo($_POST['expedient']));
            break;
            case 'getPendingTaskInfo':
                echo json_encode(getPendingTaskInfo($_POST['expedient']));
            break;
            case 'getPersonalTaskInfo':
                echo json_encode(getPersonalTaskInfo($_POST['taskType'], $_POST['id']));
            break;
        }
    }

    /**
     * Obtiene todos los tanatorios propios
     *  
     * @return bool
     */
    function getOwnMortuaries(){
        require_once($_SESSION['basePath'] . "model/mortuaries.php");
        $mortuaries = new Mortuaries;
        return $mortuaries->getOwnMortuariesSelect2();
    }

    /**
     * Obtiene los datos para las tareas pendientes de un expediente
     *
     * @param array $data
     * 
     * @return array
     */
    function getPendingTaskInfo($expedient){
        require_once($_SESSION['basePath'] . "model/timeline.php");
        $timeline = new Timeline();
        return $timeline->getTasksByExpedient($expedient);
    }

    /**
     * Obtiene los datos para una salida de hoy
     *
     * @param array $data
     * 
     * @return array
     */
    function getDepartureTodayInfo($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients();
        return $expedients->getDepartureTodayInfo($expedient);
    }

    /**
     * Obtiene los datos para una cremación
     *
     * @param array $data
     * 
     * @return array
     */
    function getCremationInfo($expedient){
        require_once($_SESSION['basePath'] . "model/expedients.php");
        $expedients = new Expedients();
        return $expedients->getCremationInfo($expedient);
    }

    /**
     * Obtiene los datos para una tarea de personal
     *
     * @param array $data
     * 
     * @return array
     */
    function getPersonalTaskInfo($type, $id){
        require_once($_SESSION['basePath'] . "model/timeline.php");
        $timeline = new Timeline();

        $info = null;
        switch($type){
            case 'ashes':
                $info = $timeline->getDeliveryAshesInfo($id);
            break;
            case 'installation':
                $info = $timeline->getInstallationInfo($id);
            break;
            case 'freeTask':
                $info = $timeline->getFreeTaskInfo($id);
            break;
            case 'garageTask':
                $info = $timeline->getGarageTaskInfo($id);
                if(intval($info['total_upkeeps']) > 0){
                    require_once($_SESSION['basePath'] . "model/timelineGarageTasks.php");
                    $timelineGarageTasks = new TimelineGarageTasks;
                    $info['upkeeps'] = $timelineGarageTasks->listUpkeeps($info['upkeepID']);
                }else{
                    $info['upkeeps'] = [];
                }
            break;
        }

        return $info;
    }
?>