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

        $result = $db->query("  SELECT  it.*
                                FROM    IVA_Types it
                                WHERE   it.name != 'Sin Iva' AND 
                                        it.leavingDate IS NULL
        ");

        if(mysqli_num_rows($result) > 0){

           $ivas = $db->resultToArray($result);
                
            foreach($ivas as $it){
                $id = $it['IVATypeID'];

                if(
                    floatval($it['percentage']) == '21' ||
                    floatval($it['percentage']) == '10'
                ){

                    // Mode - Products and Delivery notes
                    $db->query("UPDATE  IVA_Types
                                SET     type = 1
                                WHERE   IVATypeID = $id
                    ");

                    $name = $it['name'];
                    $percentage = $it['percentage'];

                    // Mode - Received invoices
                    $db->query("INSERT INTO IVA_Types(`name`, `percentage`, `type`)
                                VALUES ('$name', $percentage, 2)");
                }else{

                    // Mode - Received invoices
                    $db->query("UPDATE  IVA_Types
                                SET     type = 2
                                WHERE   IVATypeID = $id
                    ");
                }
            }
        }
    }
?>