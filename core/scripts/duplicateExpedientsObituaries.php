<?php
    // Script para eliminar el bug de que haya dos esquelas seleccionadas por expediente (bug que se corrigió el 19 de abril)
    return;
    
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
    // foreach($listCompanies as $comp){
    //     $_SESSION['company'] = $comp['id'];
        
    //     doTask();
    // }

    function doTask(){
        $db = new DbHandler;

        $result = $db->query("  SELECT  eo.ID, eo.expedient, eo.model, eo.type
                                FROM    `Expedients_Obituaries` eo 
                                WHERE   eo.selected = 1 AND 
                                        eo.type = 0 AND 
                                        eo.model = 0 AND 
                                        (
                                            SELECT  COUNT(*) 
                                            FROM    Expedients_Obituaries eo2 
                                            WHERE   eo2.expedient = eo.expedient AND eo2.selected = 1 
                                        ) > 1
                                ORDER BY eo.expedient DESC");

        if(mysqli_num_rows($result) > 0){
            $obituaries = $db->resultToArray($result);
            
            foreach($obituaries as $obituary){

                $id = $obituary['ID'];
 
                $db->query("UPDATE  Expedients_Obituaries eo
                            SET     selected = 0
                            WHERE   ID = $id");
            }
        }
    }
?>