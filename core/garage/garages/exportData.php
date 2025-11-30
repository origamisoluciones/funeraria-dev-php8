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
    require_once($_SESSION['basePath'] . "model/garages.php");

    $garages = new Garages();

    $result = $garages->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/garages/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'Dirección', 'Provincia', 'Localidad', 'Email', 'Teléfono', 'Proveedor asociado');
    fputcsv($f, $fields, $delimiter);

    foreach($result["garages"] as $garage){

        $garage['ID'] = str_replace (',', " ", $garage['ID']);
        $garage['name'] = str_replace (',', " ", $garage['name']);
        $garage['address'] = str_replace (',', " ", $garage['address']);
        $garage['province'] = str_replace (',', " ", $garage['province']);
        $garage['locationName'] = str_replace (',', " ", $garage['locationName']);
        $garage['postalCode'] = str_replace (',', " ", $garage['postalCode']);
        $garage['mail'] = str_replace (',', " ", $garage['mail']);
        $garage['phone'] = str_replace (',', " ", $garage['phone']);
        $garage['supplierName'] = str_replace (',', " ", $garage['supplierName']);

        $lineData = array(
            $garage['ID'],
            $garage['name'],
            $garage['address'],
            $garage['province'],
            $garage['locationName'],
            $garage['postalCode'],
            $garage['mail'],
            $garage['phone'],
            $garage['supplierName']
        );
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Talleres - Exportar datos", "'Ha exportado los datos de los talleres'");
?>