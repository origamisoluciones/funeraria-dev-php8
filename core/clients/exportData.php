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
    require_once($_SESSION['basePath'] . "model/clients.php");

    $clients = new Clients();

    $result = $clients->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/clients/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'Apellidos', 'Nombre Comercial', 'Tipo de Usuario', 'Tipo Tarifa', 'NIF', 'Tipo NIF', 'Dirección', 'Provincia', 'Localidad', 'Código Postal', 'Email', 'Teléfonos');
    fputcsv($f, $fields, $delimiter);

    foreach($result["clients"] as $client){
        
        $client['clientID'] = str_replace (',', " ", $client['clientID']);
        $client['name'] = str_replace (',', " ", $client['name']);
        $client['surname'] = str_replace (',', " ", $client['surname']);
        $client['brandName'] = str_replace (',', " ", $client['brandName']);
        $client['type'] = str_replace (',', " ", $client['type']);
        $client['price'] = str_replace (',', " ", $client['price']);
        $client['nif'] = str_replace (',', " ", $client['nif']);
        $client['nifType'] = str_replace (',', " ", $client['nifType']);
        $client['address'] = str_replace (',', " ", $client['address']);
        $client['province'] = str_replace (',', " ", $client['province']);
        $client['mail'] = str_replace (',', " ", $client['mail']);
        $client['phones'] = str_replace (',', " ", $client['phones']);
        $client['protocol'] = str_replace (',', " ", $client['protocol']);
        $client['clientID'] = str_replace (';', " ", $client['clientID']);
        $client['name'] = str_replace (';', " ", $client['name']);
        $client['surname'] = str_replace (';', " ", $client['surname']);
        $client['brandName'] = str_replace (';', " ", $client['brandName']);
        $client['type'] = str_replace (';', " ", $client['type']);
        $client['price'] = str_replace (';', " ", $client['price']);
        $client['nif'] = str_replace (';', " ", $client['nif']);
        $client['address'] = str_replace (';', " ", $client['address']);
        $client['province'] = str_replace (';', " ", $client['province']);
        $client['locationName'] = str_replace (';', " ", $client['locationName']);
        $client['postalCode'] = str_replace (';', " ", $client['postalCode']);
        $client['mail'] = str_replace (';', " ", $client['mail']);
        $client['phones'] = str_replace (';', " ", $client['phones']);
        $client['protocol'] = str_replace (';', " ", $client['protocol']);

        $nifType = '';
        switch($client['nifType']){
            case '0':
            case null:
            case '1':
                $nifType = 'NIF';
            break;
            case '2':
                $nifType = 'NIE';
            break;
            case '3':
                $nifType = 'Pasaporte';
            break;
            case '4':
                $nifType = 'Otro';
            break;
        }

        $lineData = array(
            $client['clientID'],
            $client['name'],
            $client['surname'],
            $client['brandName'],
            $client['type'],
            $client['price'],
            $client['nif'],
            $nifType,
            $client['address'],
            $client['province'] ,$client['locationName'],
            $client['postalCode'],
            $client['mail'],
            $client['phones']
        );
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Clients - Exportar datos", "'Ha exportado los datos de los clientes'");
?>