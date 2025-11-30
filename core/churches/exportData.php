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
    require_once($_SESSION['basePath'] . "model/churches.php");

    $churches = new Churches();

    $result = $churches->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/churches/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'Dirección', 'Provincia', 'Localidad', 'Código Postal', 'Latitude', 'Longitud', 'Email', 'Teléfonos', 'Curas');
    fputcsv($f, $fields, $delimiter);

    foreach($result["churchs"] as $church){
        $priests = "";
        foreach($result["priestChurch"] as $priestChurch){
            if($church["churchID"] == $priestChurch["church"]){
                if($priests == ""){
                    $priests = $priestChurch["name"];
                } else{
                    $priests .= "#".$priestChurch["name"];
                }
            }
        }

        $church['churchID'] = str_replace (',', " ", $church['churchID']);
        $church['name'] = str_replace (',', " ", $church['name']);
        $church['address'] = str_replace (',', " ", $church['address']);
        $church['email'] = str_replace (',', " ", $church['email']);
        $church['province'] = str_replace (',', " ", $church['province']);
        $church['locationName'] = str_replace (',', " ", $church['locationName']);
        $church['postalCode'] = str_replace (',', " ", $church['postalCode']);
        $church['latitude'] = str_replace (',', " ", $church['latitude']);
        $church['longitude'] = str_replace (',', " ", $church['longitude']);
        $church['phones'] = str_replace (',', " ", $church['phones']);
        $church['churchID'] = str_replace (';', " ", $church['churchID']);
        $church['name'] = str_replace (';', " ", $church['name']);
        $church['address'] = str_replace (';', " ", $church['address']);
        $church['email'] = str_replace (';', " ", $church['email']);
        $church['province'] = str_replace (';', " ", $church['province']);
        $church['latitude'] = str_replace (';', " ", $church['latitude']);
        $church['longitude'] = str_replace (';', " ", $church['longitude']);
        $church['phones'] = str_replace (';', " ", $church['phones']);
        $priests = str_replace (';', " ",  $priests);

        $lineData = array($church['churchID'], $church['name'], $church['address'],$church['province'], $church['locationName'], $church['postalCode'], $church['latitude'], $church['longitude'], $church['email'], $church['phones'], $priests);
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Iglesias - Exportar datos", "'Ha exportado los datos de las iglesias'");
?>