<?php
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

        $result = $db->query("  SELECT  e.expedientID, ev.start, ev.end
                                FROM    (Expedients e, Events ev)
                                WHERE   e.cremation = 1 AND
                                        e.crematoriumEvent = ev.ID AND 
                                        e.leavingDate IS NULL AND
                                        e.entryDate >= '2022-01-01'
        ");
       
        if(mysqli_num_rows($result) > 0){
            $expedients = $db->resultToArray($result);

            foreach($expedients as $expedient){

                $expedientID = $expedient['expedientID'];
                $dateStart = strtotime($expedient['start']);
                $dateEnd = strtotime($expedient['end']);

                $db->query("UPDATE  Expedients e
                            SET     e.smokeOpacityDateStart = $dateStart,
                                    e.smokeOpacityTimeStart = $dateStart,
                                    e.smokeOpacityDateEnd = $dateEnd,
                                    e.smokeOpacityTimeEnd = $dateEnd,
                                    e.smokeOpacityDateReading = $dateStart,
                                    e.smokeOpacityTimeReading = $dateStart
                            WHERE   e.expedientID = $expedientID");
            }
        }
    }
?>