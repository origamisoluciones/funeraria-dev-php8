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
    require_once($_SESSION['basePath'] . "model/priests.php");

    $priests = new Priests();

    $result = $priests->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/priests/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'Apellidos', 'NIF', 'Dirección', 'Provincia', 'Localidad', 'Código postal', 'Zona', 'Parroquia', 'Email', 'Teléfono', 'Teléfono Móvil', 'Otro Teléfono', 'Iglesias');
    fputcsv($f, $fields, $delimiter);

    foreach($result["priest"] as $priest){
        $churchs = "";
        foreach($result["priestChurch"] as $priestChurch){
            if($priest["priestID"] == $priestChurch["priest"]){
                if($churchs == ""){
                    $churchs = $priestChurch["name"];
                } else{
                    $churchs .= "#".$priestChurch["name"];
                }
            }
        }

        $priest['priestID'] = str_replace (',', " ", $priest['priestID']);
        $priest['name'] = str_replace (',', " ", $priest['name']);
        $priest['surname'] = str_replace (',', " ", $priest['surname']);
        $priest['nif'] = str_replace (',', " ", $priest['nif']);
        $priest['address'] = str_replace (',', " ", $priest['address']);
        $priest['province'] = str_replace (',', " ", $priest['province']);
        $priest['locationName'] = str_replace (',', " ", $priest['locationName']);
        $priest['postalCode'] = str_replace (',', " ", $priest['postalCode']);
        $priest['area'] = str_replace (',', " ", $priest['area']);
        $priest['parish'] = str_replace (',', " ", $priest['parish']);
        $priest['email'] = str_replace (',', " ", $priest['email']);
        $priest['homePhone'] = str_replace (',', " ", $priest['homePhone']);
        $priest['mobilePhone'] = str_replace (',', " ", $priest['mobilePhone']);
        $priest['otherPhone'] = str_replace (',', " ", $priest['otherPhone']);
        $priest['priestID'] = str_replace (';', " ", $priest['priestID']);
        $priest['name'] = str_replace (';', " ", $priest['name']);
        $priest['surname'] = str_replace (';', " ", $priest['surname']);
        $priest['nif'] = str_replace (';', " ", $priest['nif']);
        $priest['address'] = str_replace (';', " ", $priest['address']);
        $priest['province'] = str_replace (';', " ", $priest['province']);
        $priest['locationName'] = str_replace (';', " ", $priest['locationName']);
        $priest['postalCode'] = str_replace (';', " ", $priest['postalCode']);
        $priest['area'] = str_replace (';', " ", $priest['area']);
        $priest['parish'] = str_replace (';', " ", $priest['parish']);
        $priest['email'] = str_replace (';', " ", $priest['email']);
        $priest['homePhone'] = str_replace (';', " ", $priest['homePhone']);
        $priest['mobilePhone'] = str_replace (';', " ", $priest['mobilePhone']);
        $priest['otherPhone'] = str_replace (';', " ", $priest['otherPhone']);
        $churchs = str_replace (',', " ", $churchs);

        $lineData = array(
            $priest['priestID'],
            $priest['name'],
            $priest['surname'],
            $priest['nif'],
            $priest['address'],
            $priest['province'],
            $priest['locationName'],
            $priest['postalCode'],
            $priest['area'],
            $priest['parish'],
            $priest['email'],
            $priest['homePhone'],
            $priest['mobilePhone'],
            $priest['otherPhone'],
            $churchs
        );
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Curas - Exportar datos", "'Ha exportado los datos de los curas'");
?>