<?php
    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";
    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }
    
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "model/events.php");

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

        $dateLimit = date('Y-m-d', strtotime(date('Y-m-d'). ' -9 month'));
        $expedientsParticulars = [];
        $expedientsEnterprises = [];
        $expedientsInsurances = [];

        $db = new DbHandler;

        // Checks if reminder option is activated
        $result = $db->query("  SELECT  s.value as activateObituaryAnniversaryReminder
                                FROM    Settings s
                                WHERE   s.name = 'activateObituaryAnniversaryReminder'");

        if(mysqli_num_rows($result) > 0){
            $settingsOptions = $db->resultToArray($result);

            if(intval($settingsOptions[0]['activateObituaryAnniversaryReminder']) == 0){
                return;
            }

            /******************* PARTICULARES *******************/
            // Checks if reminder option for particulars clients is activated
            $result = $db->query("  SELECT  s.value as reminderObituaryAnniversaryParticulars
                                    FROM    Settings s
                                    WHERE   s.name = 'reminderObituaryAnniversaryParticulars'");

            if(mysqli_num_rows($result) > 0){
                $settingsOptions = $db->resultToArray($result);

                if(intval($settingsOptions[0]['reminderObituaryAnniversaryParticulars']) == 1){
                    $result = $db->query("  SELECT  e.expedientID, e.number
                                            FROM    Expedients e
                                            WHERE   e.leavingDate IS NULL AND
                                                    e.type = 1 AND 
                                                    e.clientType = 1 AND 
                                                    (
                                                        e.funeralDateNew IS NOT NULL AND e.funeralDateNew = '$dateLimit' 
                                                            OR
                                                        e.funeralDate IS NOT NULL AND e.funeralDate = '$dateLimit'
                                                    )");
    
                    if(mysqli_num_rows($result) > 0){
                        $expedientsParticulars = $db->resultToArray($result);
                    }
                }
            }

            /******************* EMPRESAS *******************/
            // Checks if reminder option for particulars clients is activated
            $result = $db->query("  SELECT  s.value as reminderObituaryAnniversaryEnterprises
                                    FROM    Settings s
                                    WHERE   s.name = 'reminderObituaryAnniversaryEnterprises'");

            if(mysqli_num_rows($result) > 0){
                $settingsOptions = $db->resultToArray($result);

                if(intval($settingsOptions[0]['reminderObituaryAnniversaryEnterprises']) == 1){
                    $result = $db->query("  SELECT  e.expedientID, e.number
                                            FROM    Expedients e, Clients c
                                            WHERE   e.leavingDate IS NULL AND
                                                    e.type = 1 AND 
                                                    e.clientType = 3 AND
                                                    e.client = c.clientID AND
                                                    c.obituaryAnniversaryReminder = 1 AND
                                                    (
                                                        e.funeralDateNew IS NOT NULL AND e.funeralDateNew = '$dateLimit' 
                                                            OR
                                                        e.funeralDate IS NOT NULL AND e.funeralDate = '$dateLimit'
                                                    )");
    
                    if(mysqli_num_rows($result) > 0){
                        $expedientsEnterprises = $db->resultToArray($result);
                    }
                }
            }

            /******************* SEGUROS *******************/
            // Checks if reminder option for particulars clients is activated
            $result = $db->query("  SELECT  s.value as reminderObituaryAnniversaryInsurances
                                    FROM    Settings s
                                    WHERE   s.name = 'reminderObituaryAnniversaryInsurances'");

            if(mysqli_num_rows($result) > 0){
                $settingsOptions = $db->resultToArray($result);

                if(intval($settingsOptions[0]['reminderObituaryAnniversaryInsurances']) == 1){
                    $result = $db->query("  SELECT  e.expedientID, e.number
                                            FROM    Expedients e, Clients c
                                            WHERE   e.leavingDate IS NULL AND
                                                    e.type = 1 AND 
                                                    e.clientType = 2 AND
                                                    e.client = c.clientID AND
                                                    c.obituaryAnniversaryReminder = 1 AND
                                                    (
                                                        e.funeralDateNew IS NOT NULL AND e.funeralDateNew = '$dateLimit' 
                                                            OR
                                                        e.funeralDate IS NOT NULL AND e.funeralDate = '$dateLimit'
                                                    )");
    
                    if(mysqli_num_rows($result) > 0){
                        $expedientsInsurances = $db->resultToArray($result);
                    }
                }
            }

            // Create events
            $events = new Events;
            $expedientsList = array_merge($expedientsParticulars, $expedientsEnterprises, $expedientsInsurances);
            foreach($expedientsList as $expedient){
                $data = [];
             
                $data['name'] = 'Esquela Aniversario ' . $expedient['number'];
                $data['expedient'] = $expedient['expedientID'];
                $data['status'] = 15;
                $data['type'] = 10;

                $data['start'] = date('Y-m-d') . ' 09:00:00';
                $data['end'] = date('Y-m-d') . ' 10:00:00';
                $data['allDay'] = 0;

                $events->create($data);
            }
        }
    }
?>

