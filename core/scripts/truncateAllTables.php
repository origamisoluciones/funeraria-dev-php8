<?php
    return;
    
    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";

    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }

    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    // $database = 'appeduardo';

    function doTask(){
        $db = new DbHandler;
        
        $result = $db->query("SELECT CONCAT('TRUNCATE TABLE ',table_schema,'.',TABLE_NAME, ';') as truncate FROM INFORMATION_SCHEMA.TABLES WHERE table_schema IN ('$database');");

        $db->query('SET FOREIGN_KEY_CHECKS=0');
        if(mysqli_num_rows($result) != 0){
            $result = $db->resultToArray($result);
            foreach($result as $elem){
                $db->query($elem['truncate']);
            }
        }
        $db->query('SET FOREIGN_KEY_CHECKS=1');
    }

    // doTask();
?>