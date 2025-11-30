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
    require_once($_SESSION['basePath'] . "model/suppliers.php");

    $suppliers = new Suppliers();

    $result = $suppliers->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/suppliers/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'NIF', 'Dirección', 'Provincia', 'Localidad', 'Código Postal', 'Email', 'Teléfonos', 'Fax', 'Descripción', 'Fecha Entrada', 'Enviar Esquela', 'Persona de Contacto');
    fputcsv($f, $fields, $delimiter);

    foreach($result["supplier"] as $supplier){
        $people = "";
        foreach($result["supplierContact"] as $supplierContact){
            if($supplier["supplierID"] == $supplierContact["supplier"]){
                if($people == ""){
                    $people = $supplierContact["person"];
                } else{
                    $people .= "#".$supplierContact["person"];
                }
            }
        }

        $supplier['supplierID'] = str_replace (',', " ", $supplier['supplierID']);
        $supplier['name'] = str_replace (',', " ", $supplier['name']);
        $supplier['nif'] = str_replace (',', " ", $supplier['nif']);
        $supplier['address'] = str_replace (',', " ", $supplier['address']);
        $supplier['province'] = str_replace (',', " ", $supplier['province']);
        $supplier['mail'] = explode(';', $supplier['mail'])[0];
        $supplier['phones'] = str_replace (',', " ", $supplier['phones']);
        $supplier['fax'] = str_replace (',', " ", $supplier['fax']);
        $supplier['description'] = str_replace (',', " ", $supplier['description']);
        $supplier['entryDate'] = str_replace (',', " ", $supplier['entryDate']);
        $supplier['sentObituary'] = str_replace (',', " ", $supplier['sentObituary']);
        $supplier['supplierID'] = str_replace (';', " ", $supplier['supplierID']);
        $supplier['name'] = str_replace (';', " ", $supplier['name']);
        $supplier['nif'] = str_replace (';', " ", $supplier['nif']);
        $supplier['address'] = str_replace (';', " ", $supplier['address']);
        $supplier['province'] = str_replace (';', " ", $supplier['province']);
        $supplier['locationName'] = str_replace (';', " ", $supplier['locationName']);
        $supplier['postalCode'] = str_replace (';', " ", $supplier['postalCode']);
        $supplier['mail'] = explode(';', $supplier['mail'])[0];
        $supplier['phones'] = str_replace (';', " ", $supplier['phones']);
        $supplier['fax'] = str_replace (';', " ", $supplier['fax']);
        $supplier['description'] = str_replace (';', " ", $supplier['description']);
        $supplier['entryDate'] = str_replace (';', " ", $supplier['entryDate']);
        $supplier['entryDate'] = ($supplier['entryDate'] != null && $supplier['entryDate'] != '' ? date('Y-m-d', strtotime($supplier['entryDate'])) : $supplier['entryDate']);
        $supplier['sentObituary'] = str_replace (';', " ", $supplier['sentObituary']);
         $people = str_replace (',', " ",  $people);

        if($supplier['sentObituary'] == '0'){
            $supplier['sentObituary'] = "No";
        }else{
            $supplier['sentObituary'] = "Sí";
        }

        $lineData = array($supplier['supplierID'], $supplier['name'], $supplier['nif'], $supplier['address'],$supplier['province'], $supplier['locationName'], $supplier['postalCode'], $supplier['mail'], $supplier['phones'], $supplier['fax'], $supplier['description'], $supplier['entryDate'],$supplier['sentObituary'], $people);
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Proveedores - Exportar datos", "'Ha exportado los datos de los proveedores'");
?>