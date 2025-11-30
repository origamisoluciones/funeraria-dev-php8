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

    if(!isset($_POST['type']) && !isset($_GET['type'])){
        http_response_code(405);
        return;
    }
    
    if(isset($_POST['type']) || isset($_GET['type'])){
        $type = isset($_POST['type']) ? $_POST['type'] : $_GET['type'];
        switch($type){
            case 'getGarageEvents':
                echo json_encode(getGarageEvents($_GET['q']));
            break;
            case 'getUpkeeps':
                echo json_encode(getUpkeeps($_POST['upkeep']));
            break;
        }
    }

    /**
     * Obtiene los eventos de taller que no han sido asignados a una tarea de mantenimiento
     *
     * @param array $data
     * 
     * @return array
     */
    function getGarageEvents($search){
        require_once($_SESSION['basePath'] . "model/timelineGarageTasks.php");
        $timelineGarageTasks = new TimelineGarageTasks();

        $data = $timelineGarageTasks->getGarageEvents($search);

        $json = array();
        if($data != null){
            foreach($data as $item){
                array_push(
                    $json, 
                    array(
                        'ID' => $item['id'],
                        'name' => $item['text'],
                        'upkeepID' => $item['upkeepID'],
                        'upkeeps' => $item['total_upkeeps']
                    )
                );
            }
        }

        return array('incomplete_results' => false,'items' => $json,'total' => count($data));
    }

    /**
     * Obtiene los mantenimientos
     *  
     * @return bool
     */
    function getUpkeeps($upkeep){
        require_once($_SESSION['basePath'] . "model/timelineGarageTasks.php");
        $timelineGarageTasks = new TimelineGarageTasks;
        return $timelineGarageTasks->listUpkeeps($upkeep);
    }
?>