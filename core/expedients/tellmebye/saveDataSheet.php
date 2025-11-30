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

    $data = $_POST;
    $tellmebyeMortuary = cleanStr($data['tellmebyeMortuary']);

    require_once($_SESSION['basePath'] . "model/tellmebye.php");
    require_once($_SESSION['basePath'] . "model/logs.php");

    // Gets current tellmebye mortuary
    $tellmebye = new Tellmebye;
    $found = $tellmebye->getTellmebyeMortuaryByExpedient(array('expedient' => $data['expedient']));
    if($found != null){
        $tellmebye = new Tellmebye($found['tellmebyeMortuary']);
    }else{
        $tellmebye = new Tellmebye($tellmebyeMortuary);
    }
    $logs = new Logs;

    $updated = $tellmebye->saveDataSheet($data);
    if($updated[0]){
        if(empty($updated[1])){
            $logs->createExpedient("Expedientes", $data['expedient'], "Expedientes - Tellmebye - Guardado", "'Ha guardado la ficha de Telmebye del expediente'");
            echo json_encode([true, []]);
        }else{
            echo json_encode([true, $updated[1]]);
        }
    }else{
        echo json_encode([false]);
    }
?>