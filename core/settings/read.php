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
    
    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/settings.php");
    
    $settings = new Settings;
    $logs = new Logs;

    $logs->createSimple("Configuración", "Ajustes - Consulta", "'Ha consultado los ajustes de la compañía'");

    echo json_encode(
        array(
            'info' => $settings->getInfo(),
            'hasVerifactuInvoice' => $settings->checkVerifactuInvoice(),
            'companies' => $settings->getCompaniesSettings(),
            'company' => $settings->getCompany(),
        )
    );
?>