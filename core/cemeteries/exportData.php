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
    require_once($_SESSION['basePath'] . "model/cemeteries.php");

    $cemeteries = new Cemeteries();

    $result = $cemeteries->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/cemeteries/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'Dirección', 'Provincia', 'Localidad', 'Código postal', 'Latitud', 'Longitud', 'Email', 'Teléfonos');
    fputcsv($f, $fields, $delimiter);

    foreach($result["cemetery"] as $cemetery){
        
        $cemetery['cemeteryID'] = str_replace (',', " ", $cemetery['cemeteryID']);
        $cemetery['name'] = str_replace (',', " ", $cemetery['name']);
        $cemetery['address'] = str_replace (',', " ", $cemetery['address']);
        $cemetery['province'] = str_replace (',', " ", $cemetery['province']);
        $cemetery['locationName'] = str_replace (',', " ", $cemetery['locationName']);
        $cemetery['postalCode'] = str_replace (',', " ", $cemetery['postalCode']);
        $cemetery['latitude'] = str_replace (',', " ", $cemetery['latitude']);
        $cemetery['longitude'] = str_replace (',', " ", $cemetery['longitude']);
        $cemetery['phones'] = str_replace (',', " ", $cemetery['phones']);
        $cemetery['mail'] = str_replace (',', " ", $cemetery['mail']);
        $cemetery['cemeteryID'] = str_replace (';', " ", $cemetery['cemeteryID']);
        $cemetery['name'] = str_replace (';', " ", $cemetery['name']);
        $cemetery['address'] = str_replace (';', " ", $cemetery['address']);
        $cemetery['province'] = str_replace (';', " ", $cemetery['province']);
        $cemetery['locationName'] = str_replace (';', " ", $cemetery['locationName']);
        $cemetery['postalCode'] = str_replace (';', " ", $cemetery['postalCode']);
        $cemetery['latitude'] = str_replace (';', " ", $cemetery['latitude']);
        $cemetery['longitude'] = str_replace (';', " ", $cemetery['longitude']);
        $cemetery['phones'] = str_replace (';', " ", $cemetery['phones']);
        $cemetery['mail'] = str_replace (';', " ", $cemetery['mail']);
        
        $lineData = array(
            $cemetery['cemeteryID'],
            $cemetery['name'],
            $cemetery['address'],
            $cemetery['province'],
            $cemetery['locationName'],
            $cemetery['postalCode'],
            $cemetery['latitude'],
            $cemetery['longitude'],
            $cemetery['phones'],
            $cemetery['mail']
        );
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Cementerios - Exportar datos", "'Ha exportado los datos de los cementerios'");
?>