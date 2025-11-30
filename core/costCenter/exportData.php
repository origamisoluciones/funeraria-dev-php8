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

    $costCenter = new Mortuaries();

    $result = $costCenter->listToExportCostCenter();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/costCenter/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'Dirección', 'Email', 'Teléfono', 'Provincia', 'Localidad', 'Código postal', 'Tanatorio asociado', 'Compañia', 'Principal');
    fputcsv($f, $fields, $delimiter);

    foreach($result["costCenter"] as $costCenter){
        if($costCenter['principal'] == null || $costCenter['principal'] == 0){
            $costCenter['principal'] = "No";
        }else{
            $costCenter['principal'] = "Sí";
        }

        $costCenter['ID'] = str_replace (',', " ", $costCenter['ID']);
        $costCenter['name'] = str_replace (',', " ", $costCenter['name']);
        $costCenter['address'] = str_replace (',', " ", $costCenter['address']);
        $costCenter['mail'] = str_replace (',', " ", $costCenter['mail']);
        $costCenter['phones'] = str_replace (',', " ", $costCenter['phones']);
        $costCenter['province'] = str_replace (',', " ", $costCenter['province']);
        $costCenter['locationName'] = str_replace (',', " ", $costCenter['locationName']);
        $costCenter['postalCode'] = str_replace (',', " ", $costCenter['postalCode']);
        $costCenter['mortuaryName'] = str_replace (',', " ", $costCenter['mortuaryName']);
        $costCenter['company'] = str_replace (',', " ", $costCenter['company']);
        $costCenter['principal'] = str_replace (',', " ", $costCenter['principal']);
        $costCenter['ID'] = str_replace (';', " ", $costCenter['ID']);
        $costCenter['name'] = str_replace (';', " ", $costCenter['name']);
        $costCenter['address'] = str_replace (';', " ", $costCenter['address']);
        $costCenter['mail'] = str_replace (';', " ", $costCenter['mail']);
        $costCenter['phones'] = str_replace (';', " ", $costCenter['phones']);
        $costCenter['province'] = str_replace (';', " ", $costCenter['province']);
        $costCenter['locationName'] = str_replace (';', " ", $costCenter['locationName']);
        $costCenter['postalCode'] = str_replace (';', " ", $costCenter['postalCode']);
        $costCenter['mortuaryName'] = str_replace (';', " ", $costCenter['mortuaryName']);
        $costCenter['company'] = str_replace (';', " ", $costCenter['company']);
        $costCenter['principal'] = str_replace (';', " ", $costCenter['principal']);
       
        $lineData = array(
            $costCenter['ID'],
            $costCenter['name'],
            $costCenter['address'],
            $costCenter['mail'],
            $costCenter['phones'],
            $costCenter['province'],
            $costCenter['locationName'],
            $costCenter['postalCode'],
            $costCenter['mortuaryName'],
            $costCenter['company'],
            $costCenter['principal']
        );
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Centros de Coste - Exportar datos", "'Ha exportado los datos de los centros de coste'");
?>