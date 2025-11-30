<?php
    return;
    // Script para migrar las notas de Expedients_Services y Expedients al nuevo sistema de hilo de notas

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
        
        // Gets Expedients_Services notes
        $result = $db->query("  SELECT  es.notes as note, e.expedientID as expedient, 1 as section, e.user
                                FROM    Expedients_Services es, Expedients e
                                WHERE   e.expedientID = es.expedient
                                    AND e.leavingDate IS NULL
                                    AND es.notes IS NOT NULL
                                    AND es.notes != ''");

        if(mysqli_num_rows($result) != 0){
            $commentsServices = $db->resultToArray($result);

            foreach($commentsServices as $comment){
                $db->query("INSERT INTO Expedients_Notes(user, expedient, section, note)
                            VALUES ({$comment['user']}, {$comment['expedient']}, {$comment['section']}, '{$comment['note']}')");
            }
        }

        // Gets Expedients_Hiring notes
        $result = $db->query("  SELECT  e.notesHiring as note, e.expedientID as expedient, 0 as section, e.user
                                FROM    Expedients e
                                WHERE   e.leavingDate IS NULL
                                    AND e.notesHiring IS NOT NULL
                                    AND e.notesHiring != ''");

        if(mysqli_num_rows($result) != 0){
            $commentsHirings = $db->resultToArray($result);

            foreach($commentsHirings as $comment){
                $db->query("INSERT INTO Expedients_Notes(user, expedient, section, note)
                            VALUES ({$comment['user']}, {$comment['expedient']}, {$comment['section']}, '{$comment['note']}')");
            }
        }
    }
?>