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
    require_once($_SESSION['basePath'] . "model/deceasedIn.php");

    $deceasedIn = new DeceasedIn();

    $result = $deceasedIn->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/deceasedIn/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'Provincia', 'Localidad', 'Código postal', 'Texto');
    fputcsv($f, $fields, $delimiter);

    foreach($result["deceasedIn"] as $deceasedIn){
        if($deceasedIn['text'] == null || $deceasedIn['text'] == 0){
            $deceasedIn['text'] = "No";
        }else{
            $deceasedIn['text'] = "Sí";
        }

        $deceasedIn['deceasedInID'] = str_replace (',', " ", $deceasedIn['deceasedInID']);
        $deceasedIn['name'] = str_replace (',', " ", $deceasedIn['name']);
        $deceasedIn['province'] = str_replace (',', " ", $deceasedIn['province']);
        $deceasedIn['locationName'] = str_replace (',', " ", $deceasedIn['locationName']);
        $deceasedIn['text'] = str_replace (',', " ", $deceasedIn['text']);
        $deceasedIn['deceasedInID'] = str_replace (';', " ", $deceasedIn['deceasedInID']);
        $deceasedIn['name'] = str_replace (';', " ", $deceasedIn['name']);
        $deceasedIn['province'] = str_replace (';', " ", $deceasedIn['province']);
        $deceasedIn['locationName'] = str_replace (';', " ", $deceasedIn['locationName']);
        $deceasedIn['postalCode'] = str_replace (';', " ", $deceasedIn['postalCode']);
        $deceasedIn['text'] = str_replace (';', " ", $deceasedIn['text']);

        $lineData = array(
            $deceasedIn['deceasedInID'],
            $deceasedIn['name'],
            $deceasedIn['province'],
            $deceasedIn['locationName'],
            $deceasedIn['postalCode'],
            $deceasedIn['text']
        );
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Fallecido En - Exportar datos", "'Ha exportado los datos de los lugares de Fallecimiento'");
?>