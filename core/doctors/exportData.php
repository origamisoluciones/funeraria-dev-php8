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
    require_once($_SESSION['basePath'] . "model/doctors.php");

    $doctors = new Doctors();

    $result = $doctors->listToExport();
    $delimiter = ";";
    $filename = "template.csv";

    //create a file pointer
    $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/configuration/doctors/template.csv";
    $f = fopen($path, 'w');

    //set column headers
    $fields = array('ID', 'Nombre', 'Colegio', 'Email');
    fputcsv($f, $fields, $delimiter);

    foreach($result["doctors"] as $docto){
        
        $docto['ID'] = str_replace (',', " ", $docto['ID']);
        $docto['name'] = str_replace (',', " ", $docto['name']);
        $docto['college'] = str_replace (',', " ", $docto['college']);
        $docto['email'] = str_replace (',', " ", $docto['email']);
        $docto['ID'] = str_replace (';', " ", $docto['ID']);
        $docto['name'] = str_replace (';', " ", $docto['name']);
        $docto['college'] = str_replace (';', " ", $docto['college']);
        $docto['email'] = str_replace (';', " ", $docto['email']);
       
        $lineData = array($docto['ID'], $docto['name'], $docto['college'], $docto['email']);
        fputcsv($f, $lineData, $delimiter);
    }

    fclose($f);
    $logs = new Logs;
    $logs->createSimple("Configuración", "Doctores - Exportar datos", "'Ha exportado los datos de los doctores'");
?>