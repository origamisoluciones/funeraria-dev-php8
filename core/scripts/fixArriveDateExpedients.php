<?php   

    /* Script to add 0 for postal codes with 4 digits */
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

        $result = $db->query("  SELECT  e.expedientID as expedient, e.requestDate
                                FROM    Expedients_Services es, Expedients e
                                WHERE   e.expedientID = es.expedient
                                    AND e.leavingDate IS NULL
                                    AND es.arriveDate IS NULL
                                    AND e.requestDate IS NOT NULL 
                                    AND e.requestDate != ''
        ");
       
        if(mysqli_num_rows($result) > 0){
            $expedients = $db->resultToArray($result);

            foreach($expedients as $item){
                $id = $item['expedient'];
                $requestDate = $item['requestDate'];

                $result = $db->query("  UPDATE  Expedients_Services 
                                        SET     arriveDate = '" . $requestDate . "'
                                        WHERE   expedient = '" . $id . "'");
            }
        }
    }
?>

