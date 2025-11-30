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
    require_once($_SESSION['basePath'] . "model/mortuaries.php");

    $mortuaries = new Mortuaries();

    $result = $mortuaries->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/mortuaries/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'Dirección', 'Provincia', 'Localidad', 'Código postal', 'Email', 'Teléfonos', 'Compañía', 'Propio', 'Latitud', 'Longitud');
    fputcsv($f, $fields, $delimiter);

    foreach($result["mortuaries"] as $mortuaries){

        if($mortuaries['isYourOwn'] == '0'){
            $mortuaries['isYourOwn'] = 'No';
        }else{
            $mortuaries['isYourOwn'] = 'Sí';
        }

        $mortuaries['mortuaryID'] = str_replace (',', " ", $mortuaries['mortuaryID']);
        $mortuaries['name'] = str_replace (',', " ", $mortuaries['name']);
        $mortuaries['address'] = str_replace (',', " ", $mortuaries['address']);
        $mortuaries['province'] = str_replace (',', " ", $mortuaries['province']);
        $mortuaries['locationName'] = str_replace (',', " ", $mortuaries['locationName']);
        $mortuaries['postalCode'] = str_replace (',', " ", $mortuaries['postalCode']);
        $mortuaries['mail'] = str_replace (',', " ", $mortuaries['mail']);
        $mortuaries['phones'] = str_replace (',', " ", $mortuaries['phones']);
        $mortuaries['company'] = str_replace (',', " ", $mortuaries['company']);
        $mortuaries['isYourOwn'] = str_replace (',', " ", $mortuaries['isYourOwn']);
        $mortuaries['mortuaryID'] = str_replace (';', " ", $mortuaries['mortuaryID']);
        $mortuaries['name'] = str_replace (';', " ", $mortuaries['name']);
        $mortuaries['address'] = str_replace (';', " ", $mortuaries['address']);
        $mortuaries['province'] = str_replace (';', " ", $mortuaries['province']);
        $mortuaries['locationName'] = str_replace (';', " ", $mortuaries['locationName']);
        $mortuaries['postalCode'] = str_replace (';', " ", $mortuaries['postalCode']);
        $mortuaries['mail'] = str_replace (';', " ", $mortuaries['mail']);
        $mortuaries['phones'] = str_replace (';', " ", $mortuaries['phones']);
        $mortuaries['company'] = str_replace (';', " ", $mortuaries['company']);
        $mortuaries['isYourOwn'] = str_replace (';', " ", $mortuaries['isYourOwn']);
        $mortuaries['text'] = str_replace (';', " ", $mortuaries['text']);

        $lineData = array(
            $mortuaries['mortuaryID'], 
            $mortuaries['name'], 
            $mortuaries['address'], 
            $mortuaries['province'], 
            $mortuaries['locationName'], 
            $mortuaries['postalCode'],
            $mortuaries['mail'], 
            $mortuaries['phones'], 
            $mortuaries['company'], 
            $mortuaries['isYourOwn'], 
            $mortuaries['latitude'], 
            $mortuaries['longitude']
        );
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Tanatorios - Exportar datos", "'Ha exportado los datos de los tanatorios'");
?>