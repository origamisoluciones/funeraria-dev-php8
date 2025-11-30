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
            case 'getStaffMembers':
                echo json_encode(getStaffMembers($_GET['q'], $_GET['start'], $_GET['end']));
            break;
        }
    }

    /**
     * Obtiene a los miembros del staff disponibles para añadir un evento
     * 
     *
     * @param array $data
     * 
     * @return array
     */
    function getStaffMembers($search, $start, $end){
        require_once($_SESSION['basePath'] . "model/timelineFreeTasks.php");
        $timelineFreeTasks = new TimelineFreeTasks();

        $data = $timelineFreeTasks->getStaffMembers($search, $start, $end);

        $json = array();
        if($data != null){
            foreach($data as $item){
                array_push(
                    $json, 
                    array(
                        'ID' => $item['ID'],
                        'name' => $item['name'],
                        'busy' => $item['busy']
                    )
                );
            }
        }

        return array('incomplete_results' => false,'items' => $json,'total' => count($data));
    }
?>