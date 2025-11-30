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
    require_once($_SESSION['basePath'] . "model/funeralHomes.php");

    $funeralHome = new FuneralHomes();

    $result = $funeralHome->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/funeralHomes/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'NIF', 'Dirección', 'Provincia', 'Localidad', 'Código postal', 'Email', 'Teléfonos', 'Fax', 'Contacto');
    fputcsv($f, $fields, $delimiter);

    foreach($result["funeralHomes"] as $funeralHome){
        $contacts = "";
        foreach($result["contactFuneralHome"] as $contact){
            if($funeralHome["funeralHomeID"] == $contact["funeralHome"]){
                if($contacts == ""){
                    $contacts = $contact["person"] . " - " . $contact["post"];
                } else{
                    $contacts .= "#".$contact["person"]. " - " . $contact["post"];
                }
            }
        }
       
        $funeralHome['funeralHomeID'] = str_replace (',', " ", $funeralHome['funeralHomeID']);
        $funeralHome['name'] = str_replace (',', " ", $funeralHome['name']);
        $funeralHome['nif'] = str_replace (',', " ", $funeralHome['nif']);
        $funeralHome['address'] = str_replace (',', " ", $funeralHome['address']);
        $funeralHome['province'] = str_replace (',', " ", $funeralHome['province']);
        $funeralHome['locationName'] = str_replace (',', " ", $funeralHome['locationName']);
        $funeralHome['postalCode'] = str_replace (',', " ", $funeralHome['postalCode']);
        $funeralHome['mail'] = str_replace (',', " ", $funeralHome['mail']);
        $funeralHome['phones'] = str_replace (',', " ", $funeralHome['phones']);
        $funeralHome['fax'] = str_replace (',', " ", $funeralHome['fax']);
        $funeralHome['funeralHomeID'] = str_replace (';', " ", $funeralHome['funeralHomeID']);
        $funeralHome['name'] = str_replace (';', " ", $funeralHome['name']);
        $funeralHome['nif'] = str_replace (';', " ", $funeralHome['nif']);
        $funeralHome['address'] = str_replace (';', " ", $funeralHome['address']);
        $funeralHome['province'] = str_replace (';', " ", $funeralHome['province']);
        $funeralHome['locationName'] = str_replace (';', " ", $funeralHome['locationName']);
        $funeralHome['postalCode'] = str_replace (';', " ", $funeralHome['postalCode']);
        $funeralHome['mail'] = str_replace (';', " ", $funeralHome['mail']);
        $funeralHome['phones'] = str_replace (';', " ", $funeralHome['phones']);
        $funeralHome['fax'] = str_replace (';', " ", $funeralHome['fax']);
        $contacts = str_replace (',', " ", $contacts);

        $lineData = array(
            $funeralHome['funeralHomeID'],
            $funeralHome['name'],
            $funeralHome['nif'],
            $funeralHome['address'],
            $funeralHome['province'],
            $funeralHome['locationName'],
            $funeralHome['postalCode'],
            $funeralHome['mail'],
            $funeralHome['phones'],
            $funeralHome['fax'],
            $contacts
        );
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Funerarias - Exportar datos", "'Ha exportado los datos de las funerarias'");
?>