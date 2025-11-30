<?php
    // Script para eliminar la carpeta tmp de cada instalación. Tiene que ejecutarse todos los días a las 06:00
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
        $dir = $_SESSION['basePath'] . 'resources/files/'.$_SESSION['company'].'/tmp';
        if(is_dir($dir)){
            deleteDir($dir);
        }
    }

    function deleteDir($dir){
        foreach(scandir($dir) as $elem){
            if($elem != '.' && $elem != '..'){
                if(is_file("$dir/$elem")){
                    unlink("$dir/$elem");
                }else if(is_dir("$dir/$elem")){
                    deleteDir("$dir/$elem");
                    rmdir("$dir/$elem");
                }
            }
        }
    }
?>