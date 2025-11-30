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
   
    require_once($_SESSION['basePath'] . "model/tellmebye.php");
    require_once($_SESSION['basePath'] . "model/tellmebyeDelegations.php");
    require_once($_SESSION['basePath'] . "model/logs.php");

    $tellmebye = new Tellmebye;
    $tellmebyeDelegations = new TellmebyeDelegations;
    $logs = new Logs;

    $data = $_POST;
    $info = null;

    $tellmebyeData = $tellmebye->getDataSheetInfoFromTellMeByeData($data);
    if($tellmebyeData['general'] == null){
        $expedient = $tellmebye->getDataSheetInfoFromExpedient($data);
        if($expedient != null){
            $info = $expedient;
            $info['loadedFrom'] = 'expedient';
        }
    }else{
        $info = $tellmebyeData;
        $info['loadedFrom'] = 'tellmebye';
    }

    $info['delegations'] = $tellmebyeDelegations->get();

    if($info != null){
        $logs->createExpedient("Expedientes", $data['ID'], "Expedientes - Tellmebye - Consulta", "'Ha consultado la ficha de Telmebye del expediente'");
    }
    
    echo json_encode($info);
?>