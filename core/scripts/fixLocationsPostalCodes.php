<?php   
    return;

    /* Script to add 0 for postal codes with 4 digits */
    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";
    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }
    
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "model/expedients.php");
        
    // Run for 1 company
    // $_SESSION['company'] = 27;
    // doTask();

    function doTask(){

        $db = new DbHandler;

        $result = $db->query("  SELECT  l.postalCode, l.locationID
                                FROM    Locations l
                                WHERE   l.leavingDate IS NULL AND
                                        LENGTH(l.postalCode) = 4
        ");
       
        if(mysqli_num_rows($result) > 0){
            $locationsList = $db->resultToArray($result);

            foreach($locationsList as $item){
                $postalCode = '0' . $item['postalCode'];
                $locationId = $item['locationID'];

                $result = $db->query("  UPDATE  Locations 
                                        SET     postalCode = '" . $postalCode . "'
                                        WHERE   locationID = '" . $locationId . "'");
            }
        }
    }
?>

