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

    if(empty($_POST)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/events.php");

    $events = new Events();
    $logs = new Logs;

    $data = $_POST;
    if(!$events->close($data)){
        $logs->createSimple("Events", "Eventos - Modificación", "'Error! No ha podido modificar el evento " . $data['name'] . "'");

        echo json_encode(false);
    }else{
        // Creación del evento de nuevo en caso de que sea periódico
        $event = $events->read($data)[0];
        
        if($event['regularity'] != 0){
            switch($event['regularity']){
                // Semanal
                case 1:
                    $startTime = explode(" ", $event['start'])[1];
                    $endTime = explode(" ", $event['end'])[1];
                    $event['start'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['start'])) . " +1 week")) . ' ' . $startTime;
                    $event['end'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['end'])) . " +1 week")) . ' ' . $endTime;
                break;
                // Quincenal
                case 2:
                    $startTime = explode(" ", $event['start'])[1];
                    $endTime = explode(" ", $event['end'])[1];
                    $event['start'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['start'])) . " +2 week")) . ' ' . $startTime;
                    $event['end'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['end'])) . " +2 week")) . ' ' . $endTime; 
                break;
                // Mensual
                case 3:
                    $startTime = explode(" ", $event['start'])[1];
                    $endTime = explode(" ", $event['end'])[1];
                    $event['start'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['start'])) . " +1 month")) . ' ' . $startTime;
                    $event['end'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['end'])) . " +1 month")) . ' ' . $endTime;
                break;
                // Bimensual
                case 4:
                    $startTime = explode(" ", $event['start'])[1];
                    $endTime = explode(" ", $event['end'])[1];
                    $event['start'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['start'])) . " +2 month")) . ' ' . $startTime;
                    $event['end'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['end'])) . " +2 month")) . ' ' . $endTime;
                break;
                // Trimestral
                case 5:
                    $startTime = explode(" ", $event['start'])[1];
                    $endTime = explode(" ", $event['end'])[1];
                    $event['start'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['start'])) . " +3 month")) . ' ' . $startTime;
                    $event['end'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['end'])) . " +3 month")) . ' ' . $endTime;
                break;
                // Cuatrimestral
                case 6:
                    $startTime = explode(" ", $event['start'])[1];
                    $endTime = explode(" ", $event['end'])[1];
                    $event['start'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['start'])) . " +4 month")) . ' ' . $startTime;
                    $event['end'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['end'])) . " +4 month")) . ' ' . $endTime;
                break;
                // Semestral
                case 7:
                    $startTime = explode(" ", $event['start'])[1];
                    $endTime = explode(" ", $event['end'])[1];
                    $event['start'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['start'])) . " +6 month")) . ' ' . $startTime;
                    $event['end'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['end'])) . " +6 month")) . ' ' . $endTime;
                break;
                // Anual
                case 8:
                    $startTime = explode(" ", $event['start'])[1];
                    $endTime = explode(" ", $event['end'])[1];
                    $event['start'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['start'])) . " +1 year")) . ' ' . $startTime;
                    $event['end'] = date('Y-m-d', strtotime(date('Y-m-d', strtotime($event['end'])) . " +1 year")) . ' ' . $endTime;
                break;
            }

            $event['status'] = 5;

            $events->create($event);
        }

        $logs->createSimple("Agenda", "Eventos - Modificación", "'Ha modificado el evento'");

        echo json_encode(true);
    }
?>