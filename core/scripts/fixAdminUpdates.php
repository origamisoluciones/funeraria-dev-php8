<?php 
    return;

    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";
    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }
    
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    // $_SESSION['company'] = 3;
    // $adminUpdates = getAdminUpdates();

    function getAdminUpdates(){

        $db = new DbHandler;
        $result = $db->query("SELECT * FROM Updates");

        if(mysqli_num_rows($result) > 0){
            return $db->resultToArray($result);
        }else{
            return [];
        }
    }

    function generateAdminUpdates($adminUpdates){

        $db = new DbHandler;

        foreach($adminUpdates as $data){

            if($data['leavingDate'] == null || $data['leavingDate'] == ''){
                $db->query("    INSERT INTO Updates(title, message, status, publishDate, createDate)
                                VALUES ('" . $data['title'] . "', '" . $data['message'] . "', '" . $data['status'] . "', '" . $data['publishDate'] . "', '" . $data['createDate'] . "')");

            }else{
                $db->query("    INSERT INTO Updates(title, message, status, publishDate, createDate, leavingDate)
                                VALUES ('" . $data['title'] . "', '" . $data['message'] . "', '" . $data['status'] . "', '" . $data['publishDate'] . "', '" . $data['createDate'] . "', '" . $data['leavingDate'] . "')");
            }
            $updateId = $db->getLastInsertId();

            // If the update is published, set for all users
            if(intval($data['status']) == 1){
                $result = $db->query("  SELECT  u.userID
                                        FROM    Users u
                                        WHERE   u.leavingDate IS NULL");

                if(mysqli_num_rows($result) == 0){
                    return false;
                }else{
                    $usersCompany = $db->resultToArray($result);
                }

                foreach($usersCompany as $user){
                    $userID = $user['userID'];

                    $db->query("    INSERT INTO Updates_Users(updateID, userID, readed)
                                    VALUES ($updateId, $userID, 1)");
                }
            }
        }
    }

?>