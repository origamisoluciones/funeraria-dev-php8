<?php
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

        $result = $db->query("  SELECT      e.expedientID, e.number, vi.ID, vi.date, vi.time
                                FROM        VisitsControl v, Expedients e, Mortuaries m, Visits vi
                                WHERE       e.deceasedMortuary = m.mortuaryID AND
                                            v.expedient = e.expedientID AND
                                            e.leavingDate IS NULL AND
                                            v.leavingDate IS NULL AND
                                            e.type != 2 AND
                                            e.status != 5 AND
                                            vi.visitControl = v.ID AND
                                            vi.leavingDate IS NULL
                                ORDER BY    e.expedientID DESC, vi.date, vi.time, vi.ID");

        if(mysqli_num_rows($result) > 0){
            $result = $db->resultToArray($result);
            
            $currentExpedient = null;
            $currentDate = null;
            $currentTime = null;
            foreach($result as $elem){
                if($currentExpedient != $elem['expedientID']){
                    $currentExpedient = $elem['expedientID'];
                    $currentDate = null;
                    $currentTime = null;
                }

                if($currentDate == $elem['date'] && $currentTime == $elem['time']){
                    // Delete visit
                    $db->query("UPDATE  Visits
                                SET     leavingDate = '" . date('Y-m-d H:i:s') . "'
                                WHERE   ID = {$elem['ID']}");
                }

                $currentDate = $elem['date'];
                $currentTime = $elem['time'];
            }
        }
    }
?>