<?php
    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";
    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }
    
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "model/expedients.php");
    
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

        $result = $db->query("  SELECT  e.expedientID
                                FROM    Expedients e, Invoices i
                                WHERE   e.leavingDate IS NULL AND
                                        i.expedient = e.expedientID AND
                                        i.leavingDate IS NULL AND
                                        e.status != '5' AND
                                        (
                                                SELECT  COUNT(*)
                                                FROM    Invoices i
                                                WHERE   i.leavingDate IS NULL
                                                    AND i.expedient = e.expedientID
                                        ) > 0 AND
                                        (
                                            SELECT  COUNT(*)
                                            FROM    Expedients_Services es
                                            WHERE   es.expedient = e.expedientID
                                            AND (
                                                    (
                                                        es.literalReceived = '1' AND 
                                                        es.literalRequest = '1' AND 
                                                        es.literalNoFinished = '0'
                                                    ) OR 
                                                    es.literalNotApply = '1'
                                                )
                                        ) = 1 ");
       
        if(mysqli_num_rows($result) > 0){
            $expedientsList = $db->resultToArray($result);
            $expedients = new Expedients; 
            foreach($expedientsList as $expedient){

                $pendingTasks = $expedients->getTasksByExpedientAmount($expedient['expedientID']);
                if($pendingTasks == 0){
                  
                    $result = $db->query("  UPDATE  Expedients 
                                            SET     status = 5
                                            WHERE   expedientID = ".$expedient['expedientID']."");
                }
            }
        }
    }
?>

