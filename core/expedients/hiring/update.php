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

    require_once($_SESSION['basePath'] . "model/expedients.php");
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    $expedients = new Expedients;
    $logs = new Logs;
    $db = new DbHandler;

    $expedient = $_POST['expedient'];

    if(isset($_POST['template']) && $_POST['template'] != '' && $_POST['template'] != null){
        $expedients->deleteHirings($expedient);

        $expedients->updatePriceExp($expedient, $_POST['template']);
    }

    $resultCompany = $db->query("   SELECT  s.value
                                    FROM    Settings s
                                    WHERE   s.name = 'company'");

    $companyId = mysqli_num_rows($resultCompany) == 0 ? null : $db->resultToArray($resultCompany)[0]['value'];

    $resultExpedientInfo = $db->query(" SELECT  e.entryDate
                                        FROM    Expedients e
                                        WHERE   e.expedientID = $expedient");

    $entryDate = mysqli_num_rows($resultExpedientInfo) == 0 ? null : $db->resultToArray($resultExpedientInfo)[0]['entryDate'];

    foreach($_POST['datos'] as $row){
        $hiringId = $expedients->updateHirings($expedient, $row, $companyId);
        $expedients->updateServiceAuto($expedient, $row, $entryDate, $hiringId);
    }
    
    if(isset($_POST['notes'])){
        $expedients->updateNotes($expedient, $_POST['notes']);
    }

    if(isset($_POST['logs']) && $_POST['logs'] != null){
        $logsData = $_POST['logs'];
        $number = $expedients->getNumber($expedient);

        for ($i = 0; $i <= count($logsData)-1; $i++) { 
            $logs->createExpedient("Expedientes", $expedient, "Expedientes - Contratación", "'" . $logsData[$i] . "'");
        }
    }
    
    $logs->createExpedient("Expedientes", $expedient, "Expedientes - Contratación - Modificación", "'Ha modificado la contratación'");
    echo json_encode(true);
?>