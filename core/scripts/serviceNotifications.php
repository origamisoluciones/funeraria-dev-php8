<?php
    // ESTE SCRIPT SE TIENE QUE EJECUTAR CADA MINUTO

    //$_SERVER['DOCUMENT_ROOT'] = "/home/funerariaorigamisoluciones/www";
    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";
    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }
    
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/mailHandler.php");

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

        // Obtenemos el correo de la compañía al que se envían las alertas
        $mailToNotices = '';
        $result = $db->query("SELECT value FROM Settings WHERE name = 'mailTo'");
        if(mysqli_num_rows($result) > 0){
            $mailToNotices = $db->resultToArray($result)[0]['value'];
        }

        //Obtener las horas de antelacion para avisar, definidas en configuracion
        $hours = $db->query("SELECT name, value FROM Settings WHERE settingsID IN(13,14,15,16,17,18,19,20,21,22,23,24,25)");
        if(mysqli_num_rows($hours) > 0){
            $hours = $db->resultToArray($hours);
            foreach ($hours as $key => $value) {           
                $array_hours[$value['name']] = $value['value'];
            }
        }else{
            $array_hours = null;
        }
        
        $currentTime = time();
        $currentDatetime = date('Y-m-d', time());
    
        echo "\n Fecha actual: " . date('Y-m-d', $currentTime);
        echo "\n Hora actual: " . date('H:i', $currentTime);

        // Curas
        $result = $db->query("  SELECT  es.expedient, es.priestTime,
                                        e.funeralDate, e.funeralTime, e.number,
                                        p.name, p.surname
                                FROM    Expedients_Services es, Expedients e, Services_Priests sp, Priests p
                                WHERE   es.expedient = e.expedientID AND sp.service = e.expedientID AND sp.priest = p.priestID AND
                                        e.funeralDate = '$currentDatetime' AND sp.notified = 0 AND es.priestTimeCheck = 1 AND
                                        es.priestsNotification IS NULL
                                ORDER BY e.number");
    
        if(mysqli_num_rows($result) > 0){
            $priestsEvents = $db->resultToArray($result);
    
            echo "\n\n CURAS para HOY: ";
    
            $priestsToSend = [];
            $number = 0;
           
            foreach($priestsEvents AS $key => $event){
                $number = $event['number'];
                $funeralDate = date("d-m-Y", strtotime($event['funeralDate'])) . " " . $event['funeralTime'] ;
                $priestTime = strtotime($event['funeralDate'] . " " . $event['priestTime']);
                echo "\n\n EXPEDIENTE: " . $event['expedient'];
                echo "\n FECHA Y HORA actual: " . date("Y-m-d H:i", $currentTime);
                echo "\n FECHA Y HORA inhumación: " . date("Y-m-d H:i", $priestTime);
                echo $priestTime;
                $a = new DateTime();
                $a->setTimestamp($currentTime);
                $b = new DateTime();
                $b->setTimestamp($priestTime);
                $diff = $a->diff($b);
                echo "\n diff: " . $diff->format('%R%h horas y %i minutos');
                if($array_hours != null){
                    $hour = $array_hours['Curas'];   
                    if($hour == null){
                        $hour = 1;
                    }       
                   
                    if($diff -> format('%R') == '+' && $diff -> h < $hour){
                        echo "\n SendNotification";
                        array_push($priestsToSend, array("name" => $event['name'], "surname" => $event['surname']));
                        $db->query("UPDATE Expedients_Services es SET es.priestsNotification = 1 WHERE es.expedient = " .$event['expedient']);
                    }else{
                        echo "\n NO - SendNotification";
                    }
        
                    if(($key + 1) < count($priestsEvents)){
                        if($priestsEvents[$key + 1]['number'] != $number){
                            if(count($priestsToSend) > 0){
                                if($mailToNotices != '' && $mailToNotices != null){
                                    $mailHandler = new MailHandler();
                                    $mailHandler->sendNotificationServicePriests($event['number'], $funeralDate, $event['priestTime'], $priestsToSend, $mailToNotices);
                                }
                            }
                            $priestsToSend = [];
                        }
                    }else{
                        if(count($priestsToSend) > 0){
                            if($mailToNotices != '' && $mailToNotices != null){
                                $mailHandler = new MailHandler();
                                $mailHandler->sendNotificationServicePriests($event['number'], $funeralDate, $event['priestTime'], $priestsToSend, $mailToNotices);
                            }
                        }
                    }
                }
            }
        }
    
        // Coro
        $result = $db->query("  SELECT  es.expedient, e.funeralDate, e.funeralTime, e.number, e.funeralTime as choirTime, c.name
                                FROM    Expedients_Services es, Expedients e, Services_Choirs sc, Choirs c
                                WHERE   es.expedient = e.expedientID AND e.funeralDate = '$currentDatetime' AND sc.service = e.expedientID
                                        AND sc.choir = c.choirID  AND sc.notified = 0 AND
                                        es.choirsNotification IS NULL AND e.leavingDate IS NULL ");
    
        if(mysqli_num_rows($result) > 0){
            $choirsEvents = $db->resultToArray($result);
    
            echo "\n\n COROS para HOY: ";
    
            $choirsToSend = [];
            $number = 0;
            foreach($choirsEvents AS $key => $event){
                $number = $event['number'];
                $funeralDate = date("d-m-Y", strtotime($event['funeralDate'])) . " " . $event['funeralTime'] ;
                $choirTime = strtotime($event['funeralDate'] . " " . $event['funeralTime']);
                echo "\n\n EXPEDIENTE: " . $event['expedient'];
                echo "\n FECHA Y HORA actual: " . date("Y-m-d H:i", $currentTime);
                echo "\n FECHA Y HORA inhumación: " . date("Y-m-d H:i", $choirTime);
    
                $a = new DateTime();
                $a->setTimestamp($currentTime);
                $b = new DateTime();
                $b->setTimestamp($choirTime);
                $diff = $a->diff($b);
                echo "\n diff: " . $diff->format('%R%h horas y %i minutos');
    
                if($diff -> format('%R') == '+' && $diff -> h < 2){
                    echo "\n SendNotification";
                    array_push($choirsToSend, array("name" => $event['name'], "surname" => ""));
                    $db->query("UPDATE Expedients_Services es SET es.choirsNotification = 1 WHERE es.expedient = " .$event['expedient']);
                }else{
                    echo "\n NO - SendNotification";
                }
    
                if(($key + 1) < count($choirsEvents)){
                    if($choirsEvents[$key + 1]['number'] != $number){
                        if(count($choirsToSend) > 0){
                            if($mailToNotices != '' && $mailToNotices != null){
                                $mailHandler = new MailHandler();
                                $mailHandler->sendNotificationServiceChoirs($event['number'], $funeralDate, $event['choirTime'], $choirsToSend, $mailToNotices);
                            }
                        }
                        $choirsToSend = [];
                    }
                }else{
                    if(count($choirsToSend) > 0){
                        if($mailToNotices != '' && $mailToNotices != null){
                            $mailHandler = new MailHandler();
                            $mailHandler->sendNotificationServiceChoirs($event['number'], $funeralDate, $event['choirTime'], $choirsToSend, $mailToNotices);
                        }
                    }
                }
            }
        }
    
        // Campaneros
        $result = $db->query("  SELECT  es.expedient, e.funeralTime AS bellringerTime,
                                        e.funeralDate, e.funeralTime, e.number, b.name
                                FROM    Expedients_Services es, Expedients e, Services_Bellringers sb, BellRingers b
                                WHERE   es.expedient = e.expedientID AND sb.service = e.expedientID AND sb.bellringer = b.ID AND
                                        e.funeralDate = '$currentDatetime' AND sb.notified = 0 AND
                                        es.bellringersNotification IS NULL AND e.leavingDate IS NULL");
    
        if(mysqli_num_rows($result) > 0){
            $bellringersEvents = $db->resultToArray($result);
    
            echo "\n\n CAMPANEROS para HOY: ";
    
            $bellringersToSend = [];
            $number = 0;
            foreach($bellringersEvents AS $key => $event){
                $number = $event['number'];
                $funeralDate = date("d-m-Y", strtotime($event['funeralDate'])) . " " . $event['funeralTime'] ;
                $bellringerTime = strtotime($event['funeralDate'] . " " . $event['funeralTime']);
                echo "\n\n EXPEDIENTE: " . $event['expedient'];
                echo "\n FECHA Y HORA actual: " . date("Y-m-d H:i", $currentTime);
                echo "\n FECHA Y HORA inhumación: " . date("Y-m-d H:i", $bellringerTime);
    
                $a = new DateTime();
                $a->setTimestamp($currentTime);
                $b = new DateTime();
                $b->setTimestamp($bellringerTime);
                $diff = $a->diff($b);
                echo "\n diff: " . $diff->format('%R%h horas y %i minutos');
    
                if($diff -> format('%R') == '+' && $diff -> h < 2){
                    echo "\n SendNotification";
                    array_push($bellringersToSend, array("name" => $event['name'], "surname" => ""));
                    $db->query("UPDATE Expedients_Services es SET es.bellringersNotification = 1 WHERE es.expedient = " .$event['expedient']);
                }else{
                    echo "\n NO - SendNotification";
                }
    
                if(($key + 1) < count($bellringersEvents)){
                    if($bellringersEvents[$key + 1]['number'] != $number){
                        if(count($bellringersToSend) > 0){
                            if($mailToNotices != '' && $mailToNotices != null){
                                $mailHandler = new MailHandler();
                                $mailHandler->sendNotificationServiceBellringers($event['number'], $funeralDate, $event['bellringerTime'], $bellringersToSend, $mailToNotices);
                            }
                        }
                        $bellringersToSend = [];
                    }
                }else{
                    if(count($bellringersToSend) > 0){
                        if($mailToNotices != '' && $mailToNotices != null){
                            $mailHandler = new MailHandler();
                            $mailHandler->sendNotificationServiceBellringers($event['number'], $funeralDate, $event['bellringerTime'], $bellringersToSend, $mailToNotices);
                        }
                    }
                }
            }
        }
    
        // Enterradores
        $result = $db->query("  SELECT  es.expedient, e.funeralDate AS gravediggerTime,
                                        e.funeralDate, e.funeralTime, e.number,
                                        g.name, g.surname
                                FROM    Expedients_Services es, Expedients e, Services_Gravediggers sg, Gravediggers g
                                WHERE   es.expedient = e.expedientID AND sg.gravedigger = g.gravediggerID AND es.gravediggersCheck = 1 AND
                                        e.funeralDate = '$currentDatetime' AND sg.service = e.expedientID AND sg.notified = 0 AND
                                        es.gravediggersNotification IS NULL AND e.leavingDate IS NULL");
    
        if(mysqli_num_rows($result) > 0){
            $gravediggersEvents = $db->resultToArray($result);
            
            echo "\n\n ENTERRADORES para HOY: ";
    
            $gravediggersToSend = [];
            $number = 0;
            foreach($gravediggersEvents AS $key => $event){
                $number = $event['number'];
                $funeralDate = date("d-m-Y", strtotime($event['funeralDate'])) . " " . $event['funeralTime'] ;
                $gravediggerTime = strtotime($event['funeralDate'] . " " . $event['funeralTime']);
                echo "\n\n EXPEDIENTE: " . $event['expedient'];
                echo "\n FECHA Y HORA actual: " . date("Y-m-d H:i", $currentTime);
                echo "\n FECHA Y HORA inhumación: " . date("Y-m-d H:i", $gravediggerTime);
    
                $a = new DateTime();
                $a->setTimestamp($currentTime);
                $b = new DateTime();
                $b->setTimestamp($gravediggerTime);
                $diff = $a->diff($b);
                echo "\n diff: " . $diff->format('%R%h horas y %i minutos');
                if($array_hours != null){
                    $hour = $array_hours['Enterradores'];   
                    if($hour == null){
                        $hour = 1;                   
                    }   
                    
                    if($diff -> format('%R') == '+' && $diff -> h < $hour){
                        echo "\n SendNotification";
                        array_push($gravediggersToSend, array("name" => $event['name'], "surname" => $event['surname']));
                        $db->query("UPDATE Expedients_Services es SET es.gravediggersNotification = 1 WHERE es.expedient = " .$event['expedient']);
                    }else{
                        echo "\n NO - SendNotification";
                    }
        
                    if(($key + 1) < count($gravediggersEvents)){
                        if($gravediggersEvents[$key + 1]['number'] != $number){
                            if(count($gravediggersToSend) > 0){
                                if($mailToNotices != '' && $mailToNotices != null){
                                    $mailHandler = new MailHandler();
                                    $mailHandler->sendNotificationServiceGravediggers($event['number'], $funeralDate, $event['gravediggerTime'], $gravediggersToSend, $mailToNotices);
                                }
                            }
                            $gravediggersToSend = [];
                        }
                    }else{
                        if(count($gravediggersToSend) > 0){
                            if($mailToNotices != '' && $mailToNotices != null){
                                $mailHandler = new MailHandler();
                                $mailHandler->sendNotificationServiceGravediggers($event['number'], $funeralDate, $event['gravediggerTime'], $gravediggersToSend, $mailToNotices);
                            }
                        }
                    }
                }
            }
        }
    
        // Porteadores
        $result = $db->query("  SELECT  es.expedient, es.carriersTime,
                                        e.funeralDate, e.funeralTime, e.number,
                                        c.name, c.surname
                                FROM    Expedients_Services es, Expedients e, Services_Carriers sc, Carriers c
                                WHERE   es.expedient = e.expedientID AND sc.carrier = c.carrierID AND sc.confirmed = 0 AND es.carriersTimeCheck = 1 AND
                                        e.funeralDate = '$currentDatetime' AND sc.service = e.expedientID AND
                                        es.carriersNotification IS NULL AND e.leavingDate IS NULL");
    
        if(mysqli_num_rows($result) > 0){
            $carriersEvents = $db->resultToArray($result);
    
            echo "\n\n PORTEADORES para HOY: ";
    
            $carriersToSend = [];
            $number = 0;
            foreach($carriersEvents AS $key => $event){
                $number = $event['number'];
                $funeralDate = date("d-m-Y", strtotime($event['funeralDate'])) . " " . $event['funeralTime'] ;
                $carriersTime = strtotime($event['funeralDate'] . " " . $event['carriersTime']);
                echo "\n\n EXPEDIENTE: " . $event['expedient'];
                echo "\n FECHA Y HORA actual: " . date("Y-m-d H:i", $currentTime);
                echo "\n FECHA Y HORA inhumación: " . date("Y-m-d H:i", $carriersTime);
    
                $a = new DateTime();
                $a->setTimestamp($currentTime);
                $b = new DateTime();
                $b->setTimestamp($carriersTime);
                $diff = $a->diff($b);
                echo "\n diff: " . $diff->format('%R%h horas y %i minutos');
                if($array_hours != null){
                    $hour = $array_hours['Porteadores'];   
                    if($hour == null){
                        $hour = 1;                   
                    }   
                    
                    if($diff -> format('%R') == '+' && $diff -> h < $hour){
                        echo "\n SendNotification";
                        array_push($carriersToSend, array("name" => $event['name'], "surname" => $event['surname']));
                        $db->query("UPDATE Expedients_Services es SET es.carriersNotification = 1 WHERE es.expedient = " .$event['expedient']);
                    }else{
                        echo "\n NO - SendNotification";
                    }
        
                    if(($key + 1) < count($carriersEvents)){
                        if($carriersEvents[$key + 1]['number'] != $number){
                            if(count($carriersToSend) > 0){
                                if($mailToNotices != '' && $mailToNotices != null){
                                    $mailHandler = new MailHandler();
                                    $mailHandler->sendNotificationServiceCarriers($event['number'], $funeralDate, $event['carriersTime'], $carriersToSend, $mailToNotices);
                                }
                            }
                            $carriersToSend = [];
                        }
                    }else{
                        if(count($carriersToSend) > 0){
                            if($mailToNotices != '' && $mailToNotices != null){
                                $mailHandler = new MailHandler();
                                $mailHandler->sendNotificationServiceCarriers($event['number'], $funeralDate, $event['carriersTime'], $carriersToSend, $mailToNotices);
                            }
                        }
                    }
                }
            }
        }
    
        // Flores
        $result = $db->query("  
            SELECT	e.expedientID, p.name as product, pm.name as model, e.funeralDate, e.funeralTime, e.number
            FROM	Expedients e, Expedients_Hirings eh, Products p, Products_Models pm, Services_Auto sa, Expedients_Services es
            WHERE	e.funeralDate = '$currentDatetime' AND
                    e.leavingDate IS NULL AND
                    e.status != 5 AND
                    es.expedient = e.expedientID AND
                    eh.expedient = e.expedientID AND
                    eh.check = 1 AND
                    eh.product = p.productID AND
                    p.blockBelow = 3 AND
                    eh.model = pm.productModelID AND
                    sa.service = e.expedientID AND
                    sa.model = pm.productModelID AND
                    sa.action = 7 AND
                    sa.value = 0 AND 
                    es.flowerNotification IS NULL
                                
        ");
    
        if(mysqli_num_rows($result) > 0){
            $flowersEvents = $db->resultToArray($result);
            
            echo "\n\n FLORES para HOY: ";
    
            $flowersToSend = [];
            $number = 0;
            foreach($flowersEvents AS $key => $event){
                $number = $event['number'];
                $funeralDate = date("d-m-Y", strtotime($event['funeralDate'])) ;
                $flowerTime = strtotime($event['funeralDate'] . " " . $event['funeralTime']);
                echo "\n\n EXPEDIENTE: " . $event['expedientID'];
                echo "\n FECHA Y HORA actual: " . date("Y-m-d H:i", $currentTime);
                echo "\n FECHA Y HORA inhumación: " . date("Y-m-d H:i", $flowerTime);
    
                $a = new DateTime();
                $a->setTimestamp($currentTime);
                $b = new DateTime();
                $b->setTimestamp($flowerTime);
                $diff = $a->diff($b);
                echo "\n diff: " . $diff->format('%R%h horas y %i minutos');
                if($array_hours != null){
                    $hour = $array_hours['Flores'];   
                    if($hour == null){
                        $hour = 1;                   
                    }   
                    
                    if($diff -> format('%R') == '+' && $diff -> h < $hour){
                        echo "\n SendNotification";
                        array_push($flowersToSend, array("product" => $event['product'], "model" => $event['model']));
                        $db->query("UPDATE Expedients_Services es SET es.flowerNotification = 1 WHERE es.expedient = " .$event['expedientID']);
                    }else{
                        echo "\n NO - SendNotification";
                    }
        
                    if(($key + 1) < count($flowersEvents)){
                        if($flowersEvents[$key + 1]['number'] != $number){
                            if(count($flowersToSend) > 0){
                                if($mailToNotices != '' && $mailToNotices != null){
                                    $mailHandler = new MailHandler();
                                    $mailHandler->sendNotificationServiceFlower($event['number'], $funeralDate, $event['funeralTime'], $flowersToSend, $mailToNotices);
                                }
                            }
                            $flowersToSend = [];
                        }
                    }else{
                        if(count($flowersToSend) > 0){
                            if($mailToNotices != '' && $mailToNotices != null){
                                $mailHandler = new MailHandler();
                                $mailHandler->sendNotificationServiceFlower($event['number'], $funeralDate, $event['funeralTime'], $flowersToSend, $mailToNotices);
                            }
                        }
                    }
                }
            }
        }

        // Certificado Médico
        $result = $db->query("  SELECT  es.expedient, e.funeralDate, e.funeralTime, e.number 
                                FROM    Expedients_Services es, Expedients e
                                WHERE   es.expedient = e.expedientID  AND
                                        e.funeralDate = '$currentDatetime' AND 
                                        e.leavingDate IS NULL AND
                                        es.doctorNotApply IN (NULL, 0) AND
                                        es.doctorDone IN (NULL, 0) AND 
                                        es.doctorNotification IS NULL");
    
        if(mysqli_num_rows($result) > 0){
            $webEvents = $db->resultToArray($result);
    
            echo "\n\n CERTIFICADOS MÉDICOS para HOY: ";
    
            $number = 0;
            foreach($webEvents AS $key => $event){
                $number = $event['number'];
                $funeralDate = date("d-m-Y", strtotime($event['funeralDate']));
                $webTime = strtotime($event['funeralDate'] . " " . $event['funeralTime']);
                echo "\n\n EXPEDIENTE: " . $event['expedient'];
                echo "\n FECHA Y HORA actual: " . date("Y-m-d H:i", $currentTime);
                echo "\n FECHA Y HORA inhumación: " . date("Y-m-d H:i", $webTime);
    
                $a = new DateTime();
                $a->setTimestamp($currentTime);
                $b = new DateTime();
                $b->setTimestamp($webTime);
                $diff = $a->diff($b);
                echo "\n diff: " . $diff->format('%R%h horas y %i minutos');   
                if($array_hours != null){
                    $hour = $array_hours['Certificado Médico'];   
                    if($hour == null){
                        $hour = 1;                   
                    }   
                    echo $hour;
                    if($diff -> format('%R') == '+' && $diff -> h < $hour){
                        echo "\n SendNotification";                  
                        $db->query("UPDATE Expedients_Services es SET es.doctorNotification = 1 WHERE es.expedient = " .$event['expedient']);
                        
                        if($mailToNotices != '' && $mailToNotices != null){
                            $mailHandler = new MailHandler();
                            $mailHandler->sendNotificationServiceDoctor($event['number'], $funeralDate, $event['funeralTime'], $mailToNotices); 
                        }
                    }else{
                        echo "\n NO - SendNotification";
                    }                 
                }  
            }
        }
    
        // Juzgado
        $result = $db->query("  SELECT  es.expedient, e.funeralDate, e.funeralTime, e.number 
                                FROM    Expedients_Services es, Expedients e
                                WHERE   es.expedient = e.expedientID  AND
                                        e.funeralDate = '$currentDatetime' AND 
                                        e.leavingDate IS NULL AND
                                        es.tribunalNotApply IN (NULL, 0) AND
                                        es.tribunalDeliver IN (NULL, 0) AND 
                                        es.tribunalNotification IS NULL");
    
        if(mysqli_num_rows($result) > 0){
            $webEvents = $db->resultToArray($result);
    
            echo "\n\n JUZGADO para HOY: ";
    
            $number = 0;
            foreach($webEvents AS $key => $event){
                $number = $event['number'];
                $funeralDate = date("d-m-Y", strtotime($event['funeralDate']));
                $webTime = strtotime($event['funeralDate'] . " " . $event['funeralTime']);
                echo "\n\n EXPEDIENTE: " . $event['expedient'];
                echo "\n FECHA Y HORA actual: " . date("Y-m-d H:i", $currentTime);
                echo "\n FECHA Y HORA inhumación: " . date("Y-m-d H:i", $webTime);
    
                $a = new DateTime();
                $a->setTimestamp($currentTime);
                $b = new DateTime();
                $b->setTimestamp($webTime);
                $diff = $a->diff($b);
                echo "\n diff: " . $diff->format('%R%h horas y %i minutos');   
                if($array_hours != null){
                    $hour = $array_hours['Juzgado'];   
                    if($hour == null){
                        $hour = 1;                   
                    }   
                    echo $hour;
                    if($diff -> format('%R') == '+' && $diff -> h < $hour){
                        echo "\n SendNotification";                  
                        $db->query("UPDATE Expedients_Services es SET es.tribunalNotification = 1 WHERE es.expedient = " .$event['expedient']);

                        if($mailToNotices != '' && $mailToNotices != null){
                            $mailHandler = new MailHandler();
                            $mailHandler->sendNotificationServiceTribunal($event['number'], $funeralDate, $event['funeralTime'], $mailToNotices); 
                        }
                    }else{
                        echo "\n NO - SendNotification";
                    }                 
                }  
            }
        }
    
        // Control
        $result = $db->query("  SELECT  es.expedient, e.funeralDate, e.funeralTime, e.number 
                                FROM    Expedients_Services es, Expedients e
                                WHERE   es.expedient = e.expedientID  AND
                                        e.funeralDate = '$currentDatetime' AND 
                                        e.leavingDate IS NULL AND
                                        es.revReqCheck = 1 AND
                                        es.control = 0 AND 
                                        es.controlNotification IS NULL");
    
        if(mysqli_num_rows($result) > 0){
            $webEvents = $db->resultToArray($result);
    
            echo "\n\n CONTROL para HOY: ";
    
            $number = 0;
            foreach($webEvents AS $key => $event){
                $number = $event['number'];
                $funeralDate = date("d-m-Y", strtotime($event['funeralDate']));
                $webTime = strtotime($event['funeralDate'] . " " . $event['funeralTime']);
                echo "\n\n EXPEDIENTE: " . $event['expedient'];
                echo "\n FECHA Y HORA actual: " . date("Y-m-d H:i", $currentTime);
                echo "\n FECHA Y HORA inhumación: " . date("Y-m-d H:i", $webTime);
    
                $a = new DateTime();
                $a->setTimestamp($currentTime);
                $b = new DateTime();
                $b->setTimestamp($webTime);
                $diff = $a->diff($b);
                echo "\n diff: " . $diff->format('%R%h horas y %i minutos');   
                if($array_hours != null){
                    $hour = $array_hours['Control'];   
                    if($hour == null){
                        $hour = 1;                   
                    }   
                    echo $hour;
                    if($diff -> format('%R') == '+' && $diff -> h < $hour){
                        echo "\n SendNotification";                  
                        $db->query("UPDATE Expedients_Services es SET es.controlNotification = 1 WHERE es.expedient = " .$event['expedient']);

                        if($mailToNotices != '' && $mailToNotices != null){
                            $mailHandler = new MailHandler();
                            $mailHandler->sendNotificationServiceControl($event['number'], $funeralDate, $event['funeralTime'], $mailToNotices); 
                        }
                    }else{
                        echo "\n NO - SendNotification";
                    }                 
                }  
            }
        }
    
        // Autobús
        $result = $db->query("  
            SELECT	e.expedientID, p.name as product, pm.name as model, e.funeralDate, e.funeralTime, e.number
            FROM	Expedients e, Expedients_Hirings eh, Products p, Products_Models pm, Services_Auto sa, Expedients_Services es
            WHERE	e.funeralDate = '$currentDatetime' AND
                    e.leavingDate IS NULL AND
                    e.status != 5 AND
                    es.expedient = e.expedientID AND
                    eh.expedient = e.expedientID AND
                    eh.check = 1 AND
                    eh.product = p.productID AND
                    p.blockBelow = 4 AND
                    eh.model = pm.productModelID AND
                    sa.service = e.expedientID AND
                    sa.model = pm.productModelID AND
                    p.name LIKE '%bus%' AND
                    sa.action = 7 AND
                    sa.value = 0 AND 
                    es.busNotification IS NULL
        ");
    
        if(mysqli_num_rows($result) > 0){
            $busEvents = $db->resultToArray($result);
            
            echo "\n\n BUSES para HOY: ";
    
            $busToSend = [];
            $number = 0;
            foreach($busEvents AS $key => $event){
                $number = $event['number'];
                $funeralDate = date("d-m-Y", strtotime($event['funeralDate'])) ;
                $busTime = strtotime($event['funeralDate'] . " " . $event['funeralTime']);
                echo "\n\n EXPEDIENTE: " . $event['expedientID'];
                echo "\n FECHA Y HORA actual: " . date("Y-m-d H:i", $currentTime);
                echo "\n FECHA Y HORA inhumación: " . date("Y-m-d H:i", $busTime);
    
                $a = new DateTime();
                $a->setTimestamp($currentTime);
                $b = new DateTime();
                $b->setTimestamp($busTime);
                $diff = $a->diff($b);
                echo "\n diff: " . $diff->format('%R%h horas y %i minutos');
                if($array_hours != null){
                    $hour = $array_hours['Autobús'];   
                    if($hour == null){
                        $hour = 1;                   
                    }   
                    
                    if($diff -> format('%R') == '+' && $diff -> h < $hour){
                        echo "\n SendNotification";
                        array_push($busToSend, array("product" => $event['product'], "model" => $event['model']));
                        $db->query("UPDATE Expedients_Services es SET es.busNotification = 1 WHERE es.expedient = " .$event['expedientID']);
                    }else{
                        echo "\n NO - SendNotification";
                    }
        
                    if(($key + 1) < count($busEvents)){
                        if($busEvents[$key + 1]['number'] != $number){
                            if(count($busToSend) > 0){
                                if($mailToNotices != '' && $mailToNotices != null){
                                    $mailHandler = new MailHandler();
                                    $mailHandler->sendNotificationServiceBus($event['number'], $funeralDate, $event['funeralTime'], $busToSend, $mailToNotices);
                                }
                            }
                            $busToSend = [];
                        }
                    }else{
                        if(count($busToSend) > 0){
                            if($mailToNotices != '' && $mailToNotices != null){
                                $mailHandler = new MailHandler();
                                $mailHandler->sendNotificationServiceBus($event['number'], $funeralDate, $event['funeralTime'], $busToSend, $mailToNotices);
                            }
                        }
                    }
                }
            }
        }
    
        // Taxis
        $result = $db->query("  
            SELECT	e.expedientID, p.name as product, pm.name as model, e.funeralDate, e.funeralTime, e.number
            FROM	Expedients e, Expedients_Hirings eh, Products p, Products_Models pm, Services_Auto sa, Expedients_Services es
            WHERE	e.funeralDate = '$currentDatetime' AND
                    e.leavingDate IS NULL AND
                    e.status != 5 AND
                    es.expedient = e.expedientID AND
                    eh.expedient = e.expedientID AND
                    eh.check = 1 AND
                    eh.product = p.productID AND
                    p.blockBelow = 4 AND
                    eh.model = pm.productModelID AND
                    sa.service = e.expedientID AND
                    sa.model = pm.productModelID AND
                    p.name LIKE '%taxi%' AND
                    sa.action = 1 AND
                    sa.value = 0 AND 
                    es.taxiNotification IS NULL
        ");
    
        if(mysqli_num_rows($result) > 0){
            $taxiEvents = $db->resultToArray($result);
            
            echo "\n\n TAXIS para HOY: ";
    
            $taxiToSend = [];
            $number = 0;
            foreach($taxiEvents AS $key => $event){
                $number = $event['number'];
                $funeralDate = date("d-m-Y", strtotime($event['funeralDate'])) ;
                $taxiTime = strtotime($event['funeralDate'] . " " . $event['funeralTime']);
                echo "\n\n EXPEDIENTE: " . $event['expedientID'];
                echo "\n FECHA Y HORA actual: " . date("Y-m-d H:i", $currentTime);
                echo "\n FECHA Y HORA inhumación: " . date("Y-m-d H:i", $taxiTime);
    
                $a = new DateTime();
                $a->setTimestamp($currentTime);
                $b = new DateTime();
                $b->setTimestamp($taxiTime);
                $diff = $a->diff($b);
                echo "\n diff: " . $diff->format('%R%h horas y %i minutos');
                if($array_hours != null){
                    $hour = $array_hours['Taxis'];   
                    if($hour == null){
                        $hour = 1;                   
                    }   
                    
                    if($diff -> format('%R') == '+' && $diff -> h < $hour){
                        echo "\n SendNotification";
                        array_push($taxiToSend, array("product" => $event['product'], "model" => $event['model']));
                        $db->query("UPDATE Expedients_Services es SET es.taxiNotification = 1 WHERE es.expedient = " .$event['expedientID']);
                    }else{
                        echo "\n NO - SendNotification";
                    }
        
                    if(($key + 1) < count($taxiEvents)){
                        if($taxiEvents[$key + 1]['number'] != $number){
                            if(count($taxiToSend) > 0){
                                if($mailToNotices != '' && $mailToNotices != null){
                                    $mailHandler = new MailHandler();
                                    $mailHandler->sendNotificationServiceTaxi($event['number'], $funeralDate, $event['funeralTime'], $taxiToSend, $mailToNotices);
                                }
                            }
                            $taxiToSend = [];
                        }
                    }else{
                        if(count($taxiToSend) > 0){
                            if($mailToNotices != '' && $mailToNotices != null){
                                $mailHandler = new MailHandler();
                                $mailHandler->sendNotificationServiceTaxi($event['number'], $funeralDate, $event['funeralTime'], $taxiToSend, $mailToNotices);
                            }
                        }
                    }
                }
            }
        }
    
        // WEB
        $result = $db->query("  SELECT  es.expedient, e.funeralDate, e.funeralTime, e.number 
                                FROM    Expedients_Services es, Expedients e
                                WHERE   es.expedient = e.expedientID  AND
                                        e.funeralDate = '$currentDatetime' AND 
                                        e.leavingDate IS NULL AND
                                        es.webNotApply IN (NULL, 0) AND
                                        es.webConfirm IN (NULL, 0) AND 
                                        es.webNotification IS NULL");
    
        if(mysqli_num_rows($result) > 0){
            $webEvents = $db->resultToArray($result);
    
            echo "\n\n WEB para HOY: ";
            
            $number = 0;
            foreach($webEvents AS $key => $event){
                $number = $event['number'];
                $funeralDate = date("d-m-Y", strtotime($event['funeralDate']));
                $webTime = strtotime($event['funeralDate'] . " " . $event['funeralTime']);
                echo "\n\n EXPEDIENTE: " . $event['expedient'];
                echo "\n FECHA Y HORA actual: " . date("Y-m-d H:i", $currentTime);
                echo "\n FECHA Y HORA inhumación: " . date("Y-m-d H:i", $webTime);
    
                $a = new DateTime();
                $a->setTimestamp($currentTime);
                $b = new DateTime();
                $b->setTimestamp($webTime);
                $diff = $a->diff($b);
                echo "\n diff: " . $diff->format('%R%h horas y %i minutos');   
                if($array_hours != null){
                    $hour = $array_hours['WEB'];   
                    if($hour == null){
                        $hour = 1;                   
                    }   
                    echo $hour;
                    if($diff -> format('%R') == '+' && $diff -> h < $hour){
                        echo "\n SendNotification";                  
                        $db->query("UPDATE Expedients_Services es SET es.webNotification = 1 WHERE es.expedient = " .$event['expedient']);

                        if($mailToNotices != '' && $mailToNotices != null){
                            $mailHandler = new MailHandler();
                            $mailHandler->sendNotificationServiceWeb($event['number'], $funeralDate, $event['funeralTime'], $mailToNotices); 
                        }
                    }else{
                        echo "\n NO - SendNotification";
                    }                 
                }  
            }
        }
    
        // Policía
        $result = $db->query("  SELECT  es.expedient, e.funeralDate, e.funeralTime, e.number 
                                FROM    Expedients_Services es, Expedients e
                                WHERE   es.expedient = e.expedientID  AND
                                        e.funeralDate = '$currentDatetime' AND 
                                        e.leavingDate IS NULL AND
                                        es.policeNotApply IN (NULL, 0) AND
                                        es.policeNotified IN (NULL, 0) AND 
                                        es.policeNotification IS NULL");
    
        if(mysqli_num_rows($result) > 0){
            $policeEvents = $db->resultToArray($result);
    
            echo "\n\n POLICÍA para HOY: ";
            
            $number = 0;
            foreach($policeEvents AS $key => $event){
                $number = $event['number'];
                $funeralDate = date("d-m-Y", strtotime($event['funeralDate']));
                $policeTime = strtotime($event['funeralDate'] . " " . $event['funeralTime']);
                echo "\n\n EXPEDIENTE: " . $event['expedient'];
                echo "\n FECHA Y HORA actual: " . date("Y-m-d H:i", $currentTime);
                echo "\n FECHA Y HORA inhumación: " . date("Y-m-d H:i", $policeTime);
    
                $a = new DateTime();
                $a->setTimestamp($currentTime);
                $b = new DateTime();
                $b->setTimestamp($policeTime);
                $diff = $a->diff($b);
                echo "\n diff: " . $diff->format('%R%h horas y %i minutos');   
                if($array_hours != null){
                    $hour = $array_hours['Policía'];   
                    if($hour == null){
                        $hour = 1;                   
                    }   
                    echo $hour;
                    if($diff -> format('%R') == '+' && $diff -> h < $hour){
                        echo "\n SendNotification";                  
                        $db->query("UPDATE Expedients_Services es SET es.policeNotification = 1 WHERE es.expedient = " .$event['expedient']);

                        if($mailToNotices != '' && $mailToNotices != null){
                            $mailHandler = new MailHandler();
                            $mailHandler->sendNotificationServicePolice($event['number'], $funeralDate, $event['funeralTime'], $mailToNotices); 
                        }
                    }else{
                        echo "\n NO - SendNotification";
                    }                 
                }        
            }
        }
    
        // Recordatorio
        $result = $db->query("  SELECT  e.funeralDate, e.funeralTime, e.number,  ed.expedient
                                FROM    Expedients e, Expedients_Documents ed, Expedients_Services es
                                WHERE   ed.name = 'Recordatorio' AND
                                        ed.nameFile = '' AND
                                        ed.expedient = e.expedientID AND
                                        e.funeralDate = '$currentDatetime' AND
                                        es.expedient = e.expedientID AND
                                        es.reminderNotifications IS NULL AND
                                        e.leavingDate IS NULL");
    
        if(mysqli_num_rows($result) > 0){
            $webEvents = $db->resultToArray($result);
    
            echo "\n\n RECORDATORIOS para HOY: ";
    
            $number = 0;
            foreach($webEvents AS $key => $event){
                $number = $event['number'];
                $funeralDate = date("d-m-Y", strtotime($event['funeralDate']));
                $webTime = strtotime($event['funeralDate'] . " " . $event['funeralTime']);
                echo "\n\n EXPEDIENTE: " . $event['expedient'];
                echo "\n FECHA Y HORA actual: " . date("Y-m-d H:i", $currentTime);
                echo "\n FECHA Y HORA inhumación: " . date("Y-m-d H:i", $webTime);
    
                $a = new DateTime();
                $a->setTimestamp($currentTime);
                $b = new DateTime();
                $b->setTimestamp($webTime);
                $diff = $a->diff($b);
                echo "\n diff: " . $diff->format('%R%h horas y %i minutos');   
                if($array_hours != null){
                    $hour = $array_hours['Recordatorio'];   
                    if($hour == null){
                        $hour = 1;                   
                    }   
                    echo $hour;
                    if($diff -> format('%R') == '+' && $diff -> h < $hour){
                        echo "\n SendNotification";                  
                        $db->query("UPDATE Expedients_Services es SET es.reminderNotifications = 1 WHERE es.expedient = " .$event['expedient']);

                        if($mailToNotices != '' && $mailToNotices != null){
                            $mailHandler = new MailHandler();
                            $mailHandler->sendNotificationServiceReminder($event['number'], $funeralDate, $event['funeralTime'], $mailToNotices); 
                        }
                    }else{
                        echo "\n NO - SendNotification";
                    }                 
                }  
            }
        }
    
        // Certificado de preparación
        $result = $db->query("  SELECT  es.expedient, e.funeralDate, e.funeralTime, e.number 
                                FROM    Expedients_Services es, Expedients e
                                WHERE   es.expedient = e.expedientID  AND
                                        e.funeralDate = '$currentDatetime' AND 
                                        e.leavingDate IS NULL AND
                                        es.preparationNotApply IN (NULL, 0) AND
                                        es.preparationConfirm IN (NULL, 0) AND 
                                        es.preparationNotification IS NULL");
    
        if(mysqli_num_rows($result) > 0){
            $webEvents = $db->resultToArray($result);
    
            echo "\n\n ACTAS PREPARACIÓN para HOY: ";
    
            $number = 0;
            foreach($webEvents AS $key => $event){
                $number = $event['number'];
                $funeralDate = date("d-m-Y", strtotime($event['funeralDate']));
                $webTime = strtotime($event['funeralDate'] . " " . $event['funeralTime']);
                echo "\n\n EXPEDIENTE: " . $event['expedient'];
                echo "\n FECHA Y HORA actual: " . date("Y-m-d H:i", $currentTime);
                echo "\n FECHA Y HORA inhumación: " . date("Y-m-d H:i", $webTime);
    
                $a = new DateTime();
                $a->setTimestamp($currentTime);
                $b = new DateTime();
                $b->setTimestamp($webTime);
                $diff = $a->diff($b);
                echo "\n diff: " . $diff->format('%R%h horas y %i minutos');   
                if($array_hours != null){
                    $hour = $array_hours['Certificado de preparación'];   
                    if($hour == null){
                        $hour = 1;                   
                    }   
                    echo $hour;
                    if($diff -> format('%R') == '+' && $diff -> h < $hour){
                        echo "\n SendNotification";                  
                        $db->query("UPDATE Expedients_Services es SET es.preparationNotification = 1 WHERE es.expedient = " .$event['expedient']);

                        if($mailToNotices != '' && $mailToNotices != null){
                            $mailHandler = new MailHandler();
                            $mailHandler->sendNotificationServicePreparation($event['number'], $funeralDate, $event['funeralTime'], $mailToNotices); 
                        }
                    }else{
                        echo "\n NO - SendNotification";
                    }                 
                }  
            }
        }
    }
?>