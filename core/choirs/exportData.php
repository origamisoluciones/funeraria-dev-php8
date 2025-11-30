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
    require_once($_SESSION['basePath'] . "model/choirs.php");

    $choirs = new Choirs();

    $result = $choirs->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/choirs/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'NIF', 'Dirección', 'Provincia', 'Localidad', 'Código postal', 'Email', 'Teléfono', 'Teléfono Móvil', 'Otro Teléfono');
    fputcsv($f, $fields, $delimiter);

    foreach($result["choirs"] as $choir){

        $choir['choirID'] = str_replace (',', " ", $choir['choirID']);
        $choir['name'] = str_replace (',', " ", $choir['name']);
        $choir['nif'] = str_replace (',', " ", $choir['nif']);
        $choir['address'] = str_replace (',', " ", $choir['address']);
        $choir['province'] = str_replace (',', " ", $choir['province']);
        $choir['locationName'] = str_replace (',', " ", $choir['locationName']);
        $choir['postalCode'] = str_replace (',', " ", $choir['postalCode']);
        $choir['mail'] = str_replace (',', " ", $choir['mail']);
        $choir['homePhone'] = str_replace (',', " ", $choir['homePhone']);
        $choir['mobilePhone'] = str_replace (',', " ", $choir['mobilePhone']);
        $choir['otherPhone'] = str_replace (',', " ", $choir['otherPhone']);
        $choir['choirID'] = str_replace (';', " ", $choir['choirID']);
        $choir['name'] = str_replace (';', " ", $choir['name']);
        $choir['nif'] = str_replace (';', " ", $choir['nif']);
        $choir['address'] = str_replace (';', " ", $choir['address']);
        $choir['province'] = str_replace (';', " ", $choir['province']);
        $choir['locationName'] = str_replace (';', " ", $choir['locationName']);
        $choir['postalCode'] = str_replace (';', " ", $choir['postalCode']);
        $choir['mail'] = str_replace (';', " ", $choir['mail']);
        $choir['homePhone'] = str_replace (';', " ", $choir['homePhone']);
        $choir['mobilePhone'] = str_replace (';', " ", $choir['mobilePhone']);
        $choir['otherPhone'] = str_replace (';', " ", $choir['otherPhone']);

        $lineData = array(
            $choir['choirID'],
            $choir['name'],
            $choir['nif'],
            $choir['address'],
            $choir['province'],
            $choir['locationName'],
            $choir['postalCode'],
            $choir['mail'],
            $choir['homePhone'],
            $choir['mobilePhone'],
            $choir['otherPhone']
        );
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Coros - Exportar datos", "'Ha exportado los datos de los coros'");
?>