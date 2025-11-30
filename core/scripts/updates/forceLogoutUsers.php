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

        $result = $db->query("  SELECT  u.*
                                FROM    Users u
                                WHERE   u.leavingDate IS NULL
        ");

        if(mysqli_num_rows($result) > 0){

           $users = $db->resultToArray($result);
                
            foreach($users as $it){
                $id = $it['userID'];
                $lastActivity = $it['lastActivity'];

                $db->query("UPDATE  Users
                            SET     lastLogout = '$lastActivity'
                            WHERE   userID = $id
                ");

                // Delete from User_Pages
                $db->query("DELETE FROM Users_Pages WHERE user = $id");

                // Close editors
                $db->query("UPDATE  Expedients_Obituaries
                            SET     isOpen = 0,
                                    user = null
                            WHERE   user = $id");

                $db->query("UPDATE  Expedients_Press
                            SET     isOpen = 0,
                                    user = null
                            WHERE   user = $id");

                $db->query("UPDATE  Expedients_Tombstones
                            SET     isOpen = 0,
                                    user = null
                            WHERE   user = $id");

                $db->query("UPDATE  Expedients_Closed_Death
                            SET     isOpen = 0,
                                    user = null
                            WHERE   user = $id");

                $db->query("UPDATE  Expedients_Duel_Received
                            SET     isOpen = 0,
                                    user = null
                            WHERE   user = $id");

                $db->query("UPDATE  Expedients_Reminder
                            SET     isOpen = 0,
                                    user = null
                            WHERE   user = $id");

                $db->query("UPDATE  Expedients_Reminder_Packet
                            SET     isOpen = 0,
                                    user = null
                            WHERE   user = $id");

                $db->query("UPDATE  Expedients_Reminder_Packet_Cross
                            SET     isOpen = 0,
                                    user = null
                            WHERE   user = $id");
            }
        }
    }
?>