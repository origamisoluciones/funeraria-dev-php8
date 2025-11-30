<?php
    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";
    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }
    
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "model/visitsControl.php");

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

        if($comp['id'] == 1 || $comp['id'] == 2 || $comp['id'] == 3){
            $_SESSION['user'] = 100;
        }else{
            $_SESSION['user'] = 1;
        }
        
        completeVisits();
    }

    function completeVisits(){

        $db = new DbHandler;
        $visitsControls = new VisitsControl; 
        $visitsList = $visitsControls->listVisitsControlDatatablesScript();
        foreach($visitsList as $visit){

            $visitID = $visit[0];
            
            $result2 = $db->query(" SELECT      Visits.ID
                                    FROM        (VisitsControl, Visits)
                                    LEFT JOIN   Users ON Visits.user = Users.userID
                                    WHERE       Visits.visitControl = VisitsControl.ID AND 
                                                VisitsControl.ID = $visitID AND 
                                                Visits.leavingDate IS NULL
            ");

            if(mysqli_num_rows($result2) > 0){
                $visitsItems = $db->resultToArray($result2);
                $completedVisitsCount = 0;
                
                foreach($visitsItems as $indexVisit=>$item){

                    $visitControlID = $item['ID'];

                    if($indexVisit == 0){
                        $flag = $visitsControls->isFirstVisitCompleted($visitControlID);
                        if($flag){
                            $completedVisitsCount++;                       
                        }
                    }else if($indexVisit == count($visitsItems)-1){
                        $flag = $visitsControls->isLastVisitCompleted($visitControlID);
                        if($flag){                        
                            $completedVisitsCount++;                  
                        }
                    }else{
                        $flag = $visitsControls->isMiddleVisitCompleted($visitControlID);
                        if($flag){
                            $completedVisitsCount++;                                                           
                        }
                    }

                    //If all visits are completed, completed visit
                    if($indexVisit == count($visitsItems)-1){
                        if($completedVisitsCount == count($visitsItems)){
                            $visitsControls->updateVisitControl($visitID, 'Completo');
                        }
                    }
                }
            }
        }
    }
?>

