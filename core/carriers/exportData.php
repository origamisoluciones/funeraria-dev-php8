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
    require_once($_SESSION['basePath'] . "model/carriers.php");

    $carriers = new Carriers();

    $result = $carriers->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/carriers/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'Apellidos', 'NIF', 'Dirección', 'Provincia', 'Localidad', 'Código postal', 'Email', 'Teléfonos', 'Conduce', 'Fecha de Entrada');
    fputcsv($f, $fields, $delimiter);

    foreach($result["carriers"] as $carrier){
       
        $carrier['carrierID'] = str_replace (',', " ", $carrier['carrierID']);
        $carrier['name'] = str_replace (',', " ", $carrier['name']);
        $carrier['surname'] = str_replace (',', " ", $carrier['surname']);
        $carrier['nif'] = str_replace (',', " ", $carrier['nif']);
        $carrier['address'] = str_replace (',', " ", $carrier['address']);
        $carrier['province'] = str_replace (',', " ", $carrier['province']);
        $carrier['locationName'] = str_replace (',', " ", $carrier['locationName']);
        $carrier['postalCode'] = str_replace (',', " ", $carrier['postalCode']);
        $carrier['mail'] = str_replace (',', " ", $carrier['mail']);
        $carrier['phones'] = str_replace (',', " ", $carrier['phones']);
        $carrier['drives'] = str_replace (',', " ", $carrier['drives']);
        $carrier['entryDate'] = str_replace (',', " ", $carrier['entryDate']);
        $carrier['carrierID'] = str_replace (';', " ", $carrier['carrierID']);
        $carrier['name'] = str_replace (';', " ", $carrier['name']);
        $carrier['surname'] = str_replace (';', " ", $carrier['surname']);
        $carrier['nif'] = str_replace (';', " ", $carrier['nif']);
        $carrier['address'] = str_replace (';', " ", $carrier['address']);
        $carrier['province'] = str_replace (';', " ", $carrier['province']);
        $carrier['locationName'] = str_replace (';', " ", $carrier['locationName']);
        $carrier['postalCode'] = str_replace (';', " ", $carrier['postalCode']);
        $carrier['mail'] = str_replace (';', " ", $carrier['mail']);
        $carrier['phones'] = str_replace (';', " ", $carrier['phones']);
        $carrier['drives'] = str_replace (';', " ", $carrier['drives']);
        $carrier['entryDate'] = str_replace (';', " ", $carrier['entryDate']);

        $lineData = array(
            $carrier['carrierID'],
            $carrier['name'],
            $carrier['surname'],
            $carrier['nif'],
            $carrier['address'],
            $carrier['province'],
            $carrier['locationName'],
            $carrier['postalCode'],
            $carrier['mail'],
            $carrier['phones'],
            $carrier['drives'],
            $carrier['entryDate']
        );
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Porteadores - Exportar datos", "'Ha exportado los datos de los porteadores'");
?>