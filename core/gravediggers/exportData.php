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
    require_once($_SESSION['basePath'] . "model/gravediggers.php");

    $gravediggers = new Gravediggers();

    $result = $gravediggers->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/gravediggers/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'Apellidos', 'NIF', 'Dirección', 'Provincia', 'Localidad', 'Código postal', 'Email', 'Teléfono', 'Teléfono Móvil', 'Otro Teléfono', 'Cementerios');
    fputcsv($f, $fields, $delimiter);

    foreach($result["gravedigger"] as $gravedigger){
        $cemeterys = "";
        foreach($result["gravediggerCemetery"] as $gravediggerCemetery){
            if($gravedigger["gravediggerID"] == $gravediggerCemetery["gravedigger"]){
                if($cemeterys == ""){
                    $cemeterys = $gravediggerCemetery["name"];
                } else{
                    $cemeterys .= "#".$gravediggerCemetery["name"];
                }
            }
        }

        $gravedigger['gravediggerID'] = str_replace (',', " ", $gravedigger['gravediggerID']);
        $gravedigger['name'] = str_replace (',', " ", $gravedigger['name']);
        $gravedigger['surname'] = str_replace (',', " ", $gravedigger['surname']);
        $gravedigger['nif'] = str_replace (',', " ", $gravedigger['nif']);
        $gravedigger['address'] = str_replace (',', " ", $gravedigger['address']);
        $gravedigger['province'] = str_replace (',', " ", $gravedigger['province']);
        $gravedigger['locationName'] = str_replace (',', " ", $gravedigger['locationName']);
        $gravedigger['postalCode'] = str_replace (',', " ", $gravedigger['postalCode']);
        $gravedigger['mail'] = str_replace (',', " ", $gravedigger['mail']);
        $gravedigger['homePhone'] = str_replace (',', " ", $gravedigger['homePhone']);
        $gravedigger['mobilePhone'] = str_replace (',', " ", $gravedigger['mobilePhone']);
        $gravedigger['otherPhone'] = str_replace (',', " ", $gravedigger['otherPhone']);
        $gravedigger['gravediggerID'] = str_replace (';', " ", $gravedigger['gravediggerID']);
        $gravedigger['name'] = str_replace (';', " ", $gravedigger['name']);
        $gravedigger['surname'] = str_replace (';', " ", $gravedigger['surname']);
        $gravedigger['nif'] = str_replace (';', " ", $gravedigger['nif']);
        $gravedigger['address'] = str_replace (';', " ", $gravedigger['address']);
        $gravedigger['province'] = str_replace (';', " ", $gravedigger['province']);
        $gravedigger['locationName'] = str_replace (';', " ", $gravedigger['locationName']);
        $gravedigger['postalCode'] = str_replace (';', " ", $gravedigger['postalCode']);
        $gravedigger['mail'] = str_replace (';', " ", $gravedigger['mail']);
        $gravedigger['homePhone'] = str_replace (';', " ", $gravedigger['homePhone']);
        $gravedigger['mobilePhone'] = str_replace (';', " ", $gravedigger['mobilePhone']);
        $gravedigger['otherPhone'] = str_replace (';', " ", $gravedigger['otherPhone']);
        $cemeterys = str_replace (',', " ", $cemeterys);

        $lineData = array(
            $gravedigger['gravediggerID'],
            $gravedigger['name'],
            $gravedigger['surname'],
            $gravedigger['nif'],
            $gravedigger['address'],
            $gravedigger['province'],
            $gravedigger['locationName'],
            $gravedigger['postalCode'],
            $gravedigger['mail'],
            $gravedigger['homePhone'],
            $gravedigger['mobilePhone'],
            $gravedigger['otherPhone'],
            $cemeterys
        );
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Enterradores - Exportar datos", "'Ha exportado los datos de los enterradores'");
?>