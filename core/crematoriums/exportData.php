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
    require_once($_SESSION['basePath'] . "model/crematoriums.php");

    $crematoriums = new Crematoriums();

    $result = $crematoriums->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/crematoriums/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'Compañía', 'Dirección', 'Provincia', 'Localidad', 'Código postal', 'Latitud', 'Longitud', 'Email', 'Teléfonos', 'Propio');
    fputcsv($f, $fields, $delimiter);

    foreach($result["crematoriums"] as $crematorium){
    
        if($crematorium['isYourOwn'] == null || $crematorium['isYourOwn'] == 0){
            $crematorium['isYourOwn'] = "No";
        }else{
            $crematorium['isYourOwn'] = "Sí";
        }

        $crematorium['crematoriumID'] = str_replace (',', " ", $crematorium['crematoriumID']);
        $crematorium['name'] = str_replace (',', " ", $crematorium['name']);
        $crematorium['company'] = str_replace (',', " ", $crematorium['company']);
        $crematorium['address'] = str_replace (',', " ", $crematorium['address']);
        $crematorium['province'] = str_replace (',', " ", $crematorium['province']);
        $crematorium['locationName'] = str_replace (',', " ", $crematorium['locationName']);
        $crematorium['postalCode'] = str_replace (',', " ", $crematorium['postalCode']);
        $crematorium['latitude'] = str_replace (',', " ", $crematorium['latitude']);
        $crematorium['longitude'] = str_replace (',', " ", $crematorium['longitude']);
        $crematorium['mail'] = str_replace (',', " ", $crematorium['mail']);
        $crematorium['phones'] = str_replace (',', " ", $crematorium['phones']);
        $crematorium['isYourOwn'] = str_replace (',', " ", $crematorium['isYourOwn']);
        $crematorium['crematoriumID'] = str_replace (';', " ", $crematorium['crematoriumID']);
        $crematorium['name'] = str_replace (';', " ", $crematorium['name']);
        $crematorium['company'] = str_replace (';', " ", $crematorium['company']);
        $crematorium['address'] = str_replace (';', " ", $crematorium['address']);
        $crematorium['province'] = str_replace (';', " ", $crematorium['province']);
        $crematorium['locationName'] = str_replace (';', " ", $crematorium['locationName']);
        $crematorium['postalCode'] = str_replace (';', " ", $crematorium['postalCode']);
        $crematorium['latitude'] = str_replace (';', " ", $crematorium['latitude']);
        $crematorium['longitude'] = str_replace (';', " ", $crematorium['longitude']);
        $crematorium['mail'] = str_replace (';', " ", $crematorium['mail']);
        $crematorium['phones'] = str_replace (';', " ", $crematorium['phones']);
        $crematorium['isYourOwn'] = str_replace (';', " ", $crematorium['isYourOwn']);

        $lineData = array(
            $crematorium['crematoriumID'],
            $crematorium['name'],
            $crematorium['company'],
            $crematorium['address'],
            $crematorium['province'],
            $crematorium['locationName'],
            $crematorium['postalCode'],
            $crematorium['latitude'],
            $crematorium['longitude'],
            $crematorium['mail'],
            $crematorium['phones'],
            $crematorium['isYourOwn']
        );
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Curas - Exportar datos", "'Ha exportado los datos de los curas'");
?>