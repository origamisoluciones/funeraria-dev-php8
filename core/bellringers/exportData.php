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
    require_once($_SESSION['basePath'] . "model/bellringers.php");

    $bellringers = new Bellringers();

    $result = $bellringers->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/bellringers/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'Apellidos', 'NIF', 'Dirección', 'Provincia', 'Localidad', 'Código postal', 'Zona', 'Parroquia', 'Email', 'Teléfono', 'Teléfono Móvil', 'Otro Teléfono', 'Iglesias');
    fputcsv($f, $fields, $delimiter);

    foreach($result["bellringer"] as $bellringer){
        $churchs = "";
        foreach($result["bellringerChurch"] as $bellringerChurch){
            if($bellringer["ID"] == $bellringerChurch["bellringer"]){
                if($churchs == ""){
                    $churchs = $bellringerChurch["name"];
                } else{
                    $churchs .= "#".$bellringerChurch["name"];
                }
            }
        }

        $bellringer['ID'] = str_replace (',', " ", $bellringer['ID']);
        $bellringer['name'] = str_replace (',', " ", $bellringer['name']);
        $bellringer['surname'] = str_replace (',', " ", $bellringer['surname']);
        $bellringer['nif'] = str_replace (',', " ", $bellringer['nif']);
        $bellringer['address'] = str_replace (',', " ", $bellringer['address']);
        $bellringer['province'] = str_replace (',', " ", $bellringer['province']);
        $bellringer['locationName'] = str_replace (',', " ", $bellringer['locationName']);
        $bellringer['postalCode'] = str_replace (',', " ", $bellringer['postalCode']);
        $bellringer['area'] = str_replace (',', " ", $bellringer['area']);
        $bellringer['parish'] = str_replace (',', " ", $bellringer['parish']);
        $bellringer['email'] = str_replace (',', " ", $bellringer['email']);
        $bellringer['homePhone'] = str_replace (',', " ", $bellringer['homePhone']);
        $bellringer['mobilePhone'] = str_replace (',', " ", $bellringer['mobilePhone']);
        $bellringer['otherPhone'] = str_replace (',', " ", $bellringer['otherPhone']);
        $churchs = str_replace (',', " ", $churchs);
        $bellringer['ID'] = str_replace (';', " ", $bellringer['ID']);
        $bellringer['name'] = str_replace (';', " ", $bellringer['name']);
        $bellringer['surname'] = str_replace (';', " ", $bellringer['surname']);
        $bellringer['nif'] = str_replace (';', " ", $bellringer['nif']);
        $bellringer['address'] = str_replace (';', " ", $bellringer['address']);
        $bellringer['province'] = str_replace (';', " ", $bellringer['province']);
        $bellringer['locationName'] = str_replace (';', " ", $bellringer['locationName']);
        $bellringer['postalCode'] = str_replace (';', " ", $bellringer['postalCode']);
        $bellringer['area'] = str_replace (';', " ", $bellringer['area']);
        $bellringer['parish'] = str_replace (';', " ", $bellringer['parish']);
        $bellringer['email'] = str_replace (';', " ", $bellringer['email']);
        $bellringer['homePhone'] = str_replace (';', " ", $bellringer['homePhone']);
        $bellringer['mobilePhone'] = str_replace (';', " ", $bellringer['mobilePhone']);
        $bellringer['otherPhone'] = str_replace (';', " ", $bellringer['otherPhone']);

        $lineData = array(
            $bellringer['ID'],
            $bellringer['name'],
            $bellringer['surname'],
            $bellringer['nif'],
            $bellringer['address'],
            $bellringer['province'],
            $bellringer['locationName'],
            $bellringer['postalCode'],
            $bellringer['area'],
            $bellringer['parish'],
            $bellringer['email'],
            $bellringer['homePhone'],
            $bellringer['mobilePhone'],
            $bellringer['otherPhone'],
            $churchs
        );
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Campaneros - Exportar datos", "'Ha exportado los datos de los campaneros'");
?>