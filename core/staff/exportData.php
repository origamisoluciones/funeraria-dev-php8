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
    require_once($_SESSION['basePath'] . "model/staff.php");

    $staff = new Staff();

    $result = $staff->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/staff/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Código', 'Nombre', 'Apellidos', 'NIF', 'NUSS', 'Dirección', 'Provincia', 'Localidad', 'Código postal', 'Email', 'Extensión Telefónica','Teléfonos', 'Núm. Cuenta','Usuario asociado', 'Puestos');
    fputcsv($f, $fields, $delimiter);

    foreach($result["staff"] as $staff){
        $puestos = "";
        foreach($result["posts"] as $posts){
            if($staff["ID"] == $posts["staff"]){
                if( $posts["value"] == '1'){
                    if($puestos == ""){
                        $puestos = $posts["name"];
                    } else{
                        $puestos .= "#".$posts["name"];
                    }
                }
            }
        }

        $staff['ID'] = str_replace (',', " ", $staff['ID']);
        $staff['code'] = str_replace (',', " ", $staff['code']);
        $staff['name'] = str_replace (',', " ", $staff['name']);
        $staff['surname'] = str_replace (',', " ", $staff['surname']);
        $staff['nif'] = str_replace (',', " ", $staff['nif']);
        $staff['nuss'] = str_replace (',', " ", $staff['nuss']);
        $staff['address'] = str_replace (',', " ", $staff['address']);
        $staff['province'] = str_replace (',', " ", $staff['province']);
        $staff['locationName'] = str_replace (',', " ", $staff['locationName']);
        $staff['postalCode'] = str_replace (',', " ", $staff['postalCode']);
        $staff['mail'] = str_replace (',', " ", $staff['mail']);
        $staff['extension'] = str_replace (',', " ", $staff['extension']);
        $staff['phones'] = str_replace (',', " ", $staff['phones']);
        $staff['accountNumber'] = str_replace (',', " ", $staff['accountNumber']);
        $staff['username'] = str_replace (',', " ", $staff['username']);
        $staff['ID'] = str_replace (';', " ", $staff['ID']);
        $staff['code'] = str_replace (';', " ", $staff['code']);
        $staff['name'] = str_replace (';', " ", $staff['name']);
        $staff['surname'] = str_replace (';', " ", $staff['surname']);
        $staff['nif'] = str_replace (';', " ", $staff['nif']);
        $staff['nuss'] = str_replace (';', " ", $staff['nuss']);
        $staff['address'] = str_replace (';', " ", $staff['address']);
        $staff['province'] = str_replace (';', " ", $staff['province']);
        $staff['locationName'] = str_replace (';', " ", $staff['locationName']);
        $staff['postalCode'] = str_replace (';', " ", $staff['postalCode']);
        $staff['mail'] = str_replace (';', " ", $staff['mail']);
        $staff['extension'] = str_replace (';', " ", $staff['extension']);
        $staff['phones'] = str_replace (';', " ", $staff['phones']);
        $staff['accountNumber'] = str_replace (';', " ", $staff['accountNumber']);
        $staff['username'] = str_replace (';', " ", $staff['username']);
        $puestos = str_replace (',', " ", $puestos);

        $lineData = array(
            $staff['ID'],
            $staff['code'],
            $staff['name'],
            $staff['surname'],
            $staff['nif'],
            $staff['nuss'],
            $staff['address'],
            $staff['province'],
            $staff['locationName'],
            $staff['postalCode'],
            $staff['mail'],
            $staff['extension'],
            $staff['phones'],
            $staff['accountNumber'],
            $staff['username'],
            $puestos
        );
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Personal - Exportar datos", "'Ha exportado los datos del personal'");
?>