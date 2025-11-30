<?php
    // ESTE SCRIPT SE TIENE QUE EJECUTAR CADA MINUTO
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
        $dbSettings = new DbHandler;

        $contact = [];
        $mailToNotices = '';
        $result = $dbSettings->query("SELECT value FROM Settings WHERE name = 'mailToCC'");
        if(mysqli_num_rows($result) > 0){
            $mailToNotices = $dbSettings->resultToArray($result)[0]['value'];
        }
        if($mailToNotices != ''){
            $mailToNotices = explode(";", $mailToNotices);
           
            foreach($mailToNotices as $itemCC){
                array_push($contact, $itemCC);
            }
        }
        
        doTask();
    }

    function doTask(){
        require_once($_SESSION['basePath'] . "core/tools/mailHandler.php");
    
        $db = new DbHandler;
        $mailHandler = new MailHandler;
    
        $result = $db->query("  SELECT  e.*
                                FROM    Events e
                                WHERE   e.leavingDate IS NULL AND
                                        e.mailSend = 1 AND
                                        e.mailSent = 0");    
    
        if(mysqli_num_rows($result) > 0){
            $events = $db->resultToArray($result);
            
            foreach($events as $event){
                $eventId = $event['ID'];
                $time = $event['mailDate'];
    
                $currentTime = time();            
                $intime = intval($time,10);
                
                if($intime > $currentTime - 60 && $intime < $currentTime + 60){
                    
                    if(!empty($contact)){
                        foreach($contact as $item){
                            $mailHandler->eventNotification($item, $event);                
                        }
                    }
                    if($event['mailTo'] != ''){
                        $mailHandler->eventNotification($event['mailTo'], $event);
                    }
    
                    $db->query("UPDATE  Events e
                                SET     e.mailSent = 1
                                WHERE   e.ID = $eventId");
                }
            }
        }
    }
?>