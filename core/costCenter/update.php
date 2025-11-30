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
    require_once($_SESSION['basePath'] . "model/mortuaries.php");

    $costCenter = new Mortuaries();
    $logs = new Logs;

    if(!$costCenter->updateCostCenter($_POST)){
        $logs->createSimple("Configuración", "Centros de Coste - Modificación", "'Error! No ha podido modificar el centro de coste'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Centros de Coste - Modificación", "'Ha modificado un centro de coste'");

        echo json_encode(true);
    }
?>