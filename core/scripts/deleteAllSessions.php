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

        $result = $db->query("  SELECT  t.value
                                FROM    Settings t
                                WHERE   t.name = 'ttl'");

        if(mysqli_num_rows($result) > 0){
            $ttl = $db->resultToArray($result)[0]['value'];
            $ttl += 180;

            $result = $db->query("  SELECT  u.userID, u.lastActivity as date
                                    FROM    Users u, Users_Pages up
                                    WHERE   u.userID = up.user AND
                                            u.lastActivity != u.lastLogout AND
                                            u.leavingDate IS NULL");

            if(mysqli_num_rows($result) > 0){
                $users = $db->resultToArray($result);
                
                foreach($users as $user){
                    $id = $user['userID'];
                    $lastActivity = strtotime($user['date']);
                    $currentTime = time();

                    // Delete from User_Pages
                    $db->query("DELETE FROM Users_Pages
                                WHERE user = $id");

                    $newDate = date('Y-m-d H:i:s', $lastActivity - 1);

                    // Set last logout and last activity
                    $currentDate = date('Y-m-d H:i:s', $currentTime);
                    $db->query("UPDATE  Users u
                                SET     u.lastLogout = '$newDate',
                                        u.lastActivity = '$newDate'
                                WHERE   u.userID = $id");

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
    }
?>