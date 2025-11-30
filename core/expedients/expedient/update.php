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

    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/expedients.php");

    $expedients = new Expedients;
    $logs = new Logs;

    $data = $_POST;

    $result = $expedients->updateExpedient($data);
    
    if(!$result){
        echo json_encode(false);
        
        $logs->createExpedient("Expedientes", $data['expedientID'], "Expedientes - Modificación", "'Error! No ha podido modificar el expediente'");
    }else{
        echo json_encode(true);

        if($data['changeTrazabilityID'] === 'true'){
            $previousValue = $data['defaultTrazabilityID'];
            $newValue = $data['trazabilityId'];
            $logs->createExpedient("Expedientes", $data['expedientID'], "Expedientes - Modificación ID Trazabilidad", "'Ha modificado el ID Trazabilidad de $previousValue a $newValue'");
        }

        if($data['hasChanges'] === 'true'){
            $logs->createExpedient("Expedientes", $data['expedientID'], "Expedientes - Modificación", "'Ha modificado el expediente'");
        }
    }
?>