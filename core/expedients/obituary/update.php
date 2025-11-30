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

    require_once($_SESSION['basePath'] . "model/expedients.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
    
    $expedients = new Expedients();
    $logs = new Logs;

    if(!$expedients->updateObituary($_POST)){
        $logs->createExpedient("Obituaries", $_POST['expedient'], "Esquelas - Modificación", "'Error! Ha ocurrido un error al modificar la esquela'");
        echo json_encode(false);
    }else{
        $logs->createExpedient("Obituaries", $_POST['expedient'], "Esquelas - Modificación", "'Ha modificado la esquela'");
        echo json_encode(true);
    }
?>