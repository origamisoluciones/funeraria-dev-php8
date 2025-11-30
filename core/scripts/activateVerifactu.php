<?php
    // ESTE SCRIPT TIENE QUE EJECUTARSE EL 1 DE ENERO DE 2026 A LAS 00:00
    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";

    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }

    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    // Get all companies
    $dbSettings = new DbHandler;
    $result = $dbSettings->query("  SELECT  c.id
                                    FROM    Companies c
                                    WHERE   c.leaving_date IS NULL
    ");
    $listCompanies = [];
    if(mysqli_num_rows($result) > 0){
        $listCompanies = $dbSettings->resultToArray($result);
    }

    // Run for all companies
    foreach($listCompanies as $comp){
        $_SESSION['company'] = $comp['id'];
        
        doTask();
    }

    function doTask(){
        $db = new DbHandler;

        $db->query("    UPDATE  Settings
                        SET     value = 1
                        WHERE   name = 'verifactu'
        ");

        return true;
    }
?>