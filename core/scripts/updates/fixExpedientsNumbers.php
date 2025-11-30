<?php   

    return;
    
    /* Script updated invoices ivas */
    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";
    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }
    
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    $_SESSION['company'] = 27;
    updateExpedientsNumbers();

    function updateExpedientsNumbers(){

        $db = new DbHandler;

        $result = $db->query("  SELECT  expedientID, number, expNumLetter, expNumSecuence, expNumYear, expNumType
                                FROM    Expedients 
                                WHERE   leavingDate IS NULL AND
                                        clientType = 3 AND type = 1 AND
                                        entryDate >= '2025-01-01 00:00:00' AND 
                                        entryDate <= '2025-12-31 23:59:59'
                                ORDER BY expNumSecuence ASC;
        ");
       
        if(mysqli_num_rows($result) > 0){
            $expedients = $db->resultToArray($result);

            foreach($expedients as $index=>$item){
                $expNumSec = $item['expNumSecuence'];
                $expNumLetter = $item['expNumLetter'];
                $expNumType = $index + 1;
                $expNumYear = $item['expNumYear'];
                $expNumYear = substr($expNumYear, -2);
                $ID = $item['expedientID'];

                $numberExp = $expNumSec . ' ' . $expNumLetter . $expNumType . '/' . $expNumYear;

                $result = $db->query("  UPDATE  Expedients 
                                        SET     number = '$numberExp',
                                                expNumType = $expNumType
                                        WHERE   expedientID = $ID
                ");
            }
        }
    }
?>

