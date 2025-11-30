<?php
    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";
    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }
    
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/mailHandler.php");

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

        $date = date('Y-m-d');

        $result = $db->query("  SELECT      e.name, e.start, e.end,
                                            ct.name as cleaningType,
                                            m.name as mortuary,
                                            CONCAT(s.name, ' ', s.surname) as staffName, s.email as staffEmail
                                FROM        (Events e, Staff s)
                                LEFT JOIN   Cleaning_Types ct ON e.cleaningType = ct.ID
                                LEFT JOIN   Mortuaries m ON e.cleaningMortuary = m.mortuaryID
                                WHERE       e.type = 2 AND
                                            e.cleaningUser = s.ID AND
                                            e.start LIKE '%$date%'");

        if(mysqli_num_rows($result) > 0){
            $result = $db->resultToArray($result);
            
            foreach($result as $elem){
                $mailHandler = new MailHandler();
                $mailHandler->sendNotificationCleaningEvent($elem);
            }
        }
    }
?>