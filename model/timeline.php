<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Timeline{

        /**
         * Obtiene la configuración del timeline
         * 
         * @return array Datos del timeline
         */
        public function getSettings(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  pendingTasksColor, 
                                            departuresTodayOwnColor, departuresTodayExternalColor, departuresTodayWidth, 
                                            cremationsOwnColor, cremationsExternalColor, 
                                            personalTasksAdvance    
                                    FROM    Timeline_Settings");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Obtiene la configuración del timeline
         * 
         * @return array Datos del timeline
         */
        public function read(){
            $db = new DbHandler;

            $result = $db->query("SELECT * FROM Timeline_Settings");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];
        }

        /**
         * Añade los datos de configuración del timeline
         * 
         * @param array Datos del timeline
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['id'] = cleanStr($data['id']);

            // Validación de campos
            if($data['pendingTasksColor'] == ''){
                return false;
            }else{
                $data['pendingTasksColor'] = cleanStr($data['pendingTasksColor']);
            }
            if($data['departuresTodayOwnColor'] == ''){
                return false;
            }else{
                $data['departuresTodayOwnColor'] = cleanStr($data['departuresTodayOwnColor']);
            }
            if($data['departuresTodayExternalColor'] == ''){
                return false;
            }else{
                $data['departuresTodayExternalColor'] = cleanStr($data['departuresTodayExternalColor']);
            }
            if($data['departuresTodayWidth'] == ''){
                return false;
            }else{
                $data['departuresTodayWidth'] = cleanStr($data['departuresTodayWidth']);
            }
            if($data['cremationsOwnColor'] == ''){
                return false;
            }else{
                $data['cremationsOwnColor'] = cleanStr($data['cremationsOwnColor']);
            }
            if($data['cremationsExternalColor'] == ''){
                return false;
            }else{
                $data['cremationsExternalColor'] = cleanStr($data['cremationsExternalColor']);
            }
            if($data['personalTasksAdvance'] == ''){
                return false;
            }else{
                $data['personalTasksAdvance'] = cleanStr($data['personalTasksAdvance']);
            }
            
            return $db->query("
                INSERT INTO Timeline_Settings
                    (
                        pendingTasksColor, 
                        departuresTodayOwnColor, departuresTodayExternalColor, departuresTodayWidth, 
                        cremationsOwnColor, cremationsExternalColor, 
                        personalTasksAdvance
                    ) 
                    VALUES(
                        " . $data['pendingTasksColor'] . ", 
                        '" . $data['departuresTodayOwnColor'] . "', '" . $data['departuresTodayExternalColor'] . "', " . $data['departuresTodayWidth'] . ", 
                        '" . $data['cremationsOwnColor'] . "', '" . $data['cremationsExternalColor'] . "',
                        " . $data['personalTasksAdvance']
                );
        }

        /**
         * Modifica los datos de configuración del timeline
         * 
         * @param array Datos del timeline
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['id'] = cleanStr($data['id']);

            // Validación de campos
            if($data['pendingTasksColor'] == ''){
                return false;
            }else{
                $data['pendingTasksColor'] = cleanStr($data['pendingTasksColor']);
            }
            if($data['departuresTodayOwnColor'] == ''){
                return false;
            }else{
                $data['departuresTodayOwnColor'] = cleanStr($data['departuresTodayOwnColor']);
            }
            if($data['departuresTodayExternalColor'] == ''){
                return false;
            }else{
                $data['departuresTodayExternalColor'] = cleanStr($data['departuresTodayExternalColor']);
            }
            if($data['departuresTodayWidth'] == ''){
                return false;
            }else{
                $data['departuresTodayWidth'] = cleanStr($data['departuresTodayWidth']);
            }
            if($data['cremationsOwnColor'] == ''){
                return false;
            }else{
                $data['cremationsOwnColor'] = cleanStr($data['cremationsOwnColor']);
            }
            if($data['cremationsExternalColor'] == ''){
                return false;
            }else{
                $data['cremationsExternalColor'] = cleanStr($data['cremationsExternalColor']);
            }
            if($data['personalTasksAdvance'] == ''){
                return false;
            }else{
                $data['personalTasksAdvance'] = cleanStr($data['personalTasksAdvance']);
            }
            
            return $db->query(" UPDATE  Timeline_Settings
                                SET     pendingTasksColor = '" . $data['pendingTasksColor'] . "',
                                        departuresTodayOwnColor = '" . $data['departuresTodayOwnColor'] . "',
                                        departuresTodayExternalColor = '" . $data['departuresTodayExternalColor'] . "',
                                        departuresTodayWidth = " . $data['departuresTodayWidth'] . ",
                                        cremationsOwnColor = '" . $data['cremationsOwnColor'] . "',
                                        cremationsExternalColor = '" . $data['cremationsExternalColor'] . "',
                                        personalTasksAdvance = " . $data['personalTasksAdvance'] . "
                                WHERE   id = " . $data['id']);
        }

        /**
         * Obtiene las tareas pendientes
         *
         * @return array
         */
        public function getPendingTasks($start, $end, $mortuary){
            $db = new DbHandler;

            $where = $mortuary == null ? '' : " AND e.deceasedMortuary = $mortuary";

            $result = $db->query("  SELECT      e.expedientID, e.number, e.deceasedGender, e.deceasedName, e.deceasedSurname, CONCAT(e.funeralDate, ' ', e.funeralTime) as funeralDatetime
                                    FROM        Expedients e
                                    WHERE       CONCAT(e.funeralDate, ' ', e.funeralTime) BETWEEN '$start' AND '$end' AND
                                                e.type != 2 AND
                                                e.leavingDate IS NULL AND
                                                e.status != 5 AND
                                                e.funeralDate IS NOT NULL AND e.funeralDate != '' AND
                                                e.funeralTime IS NOT NULL AND e.funeralTime != ''
                                                $where
                                    ORDER BY    e.funeralDate, e.funeralTime
            ");
            
            if(mysqli_num_rows($result) == 0){
                return array();
			}else{

                // Get settings times
                $settings = $db->query("    SELECT  s.name, s.value
                                            FROM    Settings s
                                            WHERE   s.settingsID BETWEEN 13 AND 25");

                $settings = mysqli_num_rows($settings) == 0 ? null : $db->resultToArray($settings);

                $values = $db->resultToArray($result);
                $pendingTask = array();
                $pos = 0;
                foreach($values as $value){
                    $amount = $this->getTasksByExpedientAmount($value['expedientID'], $settings);
                    if($amount[0] > 0){
                        $pendingTask[$pos]['expedientID'] = $value['expedientID'];
                        $pendingTask[$pos]['number'] = $value['number'];
                        $pendingTask[$pos]['deceasedGender'] = $value['deceasedGender'];
                        $pendingTask[$pos]['deceasedName'] = $value['deceasedName'];
                        $pendingTask[$pos]['deceasedSurname'] = $value['deceasedSurname'];
                        $pendingTask[$pos]['funeralDatetime'] = $value['funeralDatetime'];
                        $pendingTask[$pos]['amount'] = $amount[0];
                        $pendingTask[$pos]['advance'] = $amount[1];
                        $pendingTask[$pos]['startEvent'] = strtotime('-'.$amount[0].' hours', strtotime($value['funeralDatetime']));
                        $pos++;
                    }
                }

                usort($pendingTask, 'sortByStartEvent');

                return $pendingTask;
			}
        }

        /**
         * Calcula el total de tareas de pendientes por expediente y las horas de antelación para notificar
         *
         * @return array
         */
        public function getTasksByExpedientAmount($data, $settings){
            $db = new DbHandler;

            $data = cleanStr($data);

            $amount = 0;
            $advance = 0;
            $printDebug = false;

            $service = $db->query(" SELECT  es.revReqCheck, es.control, 
                                            es.priestTimeCheck, es.priestInspected, es.priestPayed,
                                            es.gravediggersCheck, es.gravediggersNotApply, es.gravediggersCheckPrinted, es.gravediggersCheckSigned, 
                                            e.funeralDateNew, e.funeralTimeNew
                                    FROM    (Expedients_Services es, Expedients e)
                                    WHERE   es.expedient = $data AND es.expedient = e.expedientID");

            if(mysqli_num_rows($service) == 0){
                return $amount;
            }
            $service = $db->resultToArray($service)[0];

            /**
             *  Check FIXED pending tasks
             *  
             *  Control, Porteadores, Certificado medico, Juzgado, Web, Policía, Actividades de preparación
            */

            // Control
            if(intval($service['revReqCheck']) != 0 && intval($service['control']) == 0){
                // Calculate total pending
                $amount++;

                // Get advance hours 
                if(($advanceItem = intval($this->searchValue($settings, 'Control'))) > $advance){
                    $advance = $advanceItem;
                }
            }

            // Porteadores
            $result = $db->query("  SELECT  sc.ID,
                                            c.name, c.phones
                                    FROM    Services_Carriers sc, Carriers c
                                    WHERE   sc.carrier = c.carrierID AND
                                            sc.service = $data AND
                                            sc.confirmed = 0");

            if(mysqli_num_rows($result) > 0){
                // Calculate total pending
                $amount++;

                // Get advance hours 
                if(($advanceItem = intval($this->searchValue($settings, 'Porteadores'))) > $advance){
                    $advance = $advanceItem;
                }
            }

            // Certificado medico, Juzgado, Web, Policía, Actividades de preparación
            $result = $db->query("  SELECT  es.policeNotified, es.webConfirm, 
                                            es.doctorDone, es.doctorDeliver, es.doctorInProgress, 
                                            es.tribunalDeliver, es.tribunalInProgress,
                                            es.tombstone, es.tombstonePrint, es.tombstoneNotApply,
                                            es.preparationConfirm, 
                                            es.surveySend, es.surveyNotApply, 
                                            es.vivoSent, 
                                            e.cremation, es.crematoriumProgramOven, es.crematoriumControlDeliversAshes
                                    FROM    Expedients_Services es, Expedients e
                                    WHERE   es.expedient = $data AND
                                            es.expedient = e.expedientID
            ");

            if(mysqli_num_rows($result) > 0){
                $result = $db->resultToArray($result)[0];

                // Policía
                if($result['policeNotified'] == null || intval($result['policeNotified']) == 0){
                    // Calculate total pending
                    $amount++;

                    // Get advance hours 
                    if(($advanceItem = intval($this->searchValue($settings, 'Policía'))) > $advance){
                        $advance = $advanceItem;
                    }
                }
                
                // Web
                if($result['webConfirm'] == null || intval($result['webConfirm']) == 0){
                    // Calculate total pending
                    $amount++;

                    // Get advance hours 
                    if(($advanceItem = intval($this->searchValue($settings, 'WEB'))) > $advance){
                        $advance = $advanceItem;
                    }
                }
                
                // Certificado Médico
                if(
                    $result['doctorDone'] == null || intval($result['doctorDone']) == 0 || 
                    $result['doctorInProgress'] == null || intval($result['doctorInProgress']) == 0
                ){

                    // Calculate total pending
                    if($result['doctorDone'] == null || intval($result['doctorDone']) == 0){
                        $amount++;
                    }
                    if($result['doctorInProgress'] == null || intval($result['doctorInProgress']) == 0){
                        $amount++;
                    }

                    // Get advance hours 
                    if(($advanceItem = intval($this->searchValue($settings, 'Certificado Médico'))) > $advance){
                        $advance = $advanceItem;
                    }
                }
                
                // Juzgado
                if(
                    $result['tribunalInProgress'] == null || intval($result['tribunalInProgress']) == 0 ||
                    $result['tribunalDeliver'] == null || intval($result['tribunalDeliver']) == 0
                ){
                    // Calculate total pending
                    if($result['tribunalInProgress'] == null || intval($result['tribunalInProgress']) == 0){
                        $amount++;
                    }
                    if($result['tribunalDeliver'] == null || intval($result['tribunalDeliver']) == 0){
                        $amount++;
                    }
                    
                    // Get advance hours 
                    if(($advanceItem = intval($this->searchValue($settings, 'Juzgado'))) > $advance){
                        $advance = $advanceItem;
                    }
                }
                
                // Actividades preparación
                if($result['preparationConfirm'] == null || $result['preparationConfirm'] == 0){
                    // Calculate total pending
                    $amount++;

                    // Get advance hours 
                    if(($advanceItem = intval($this->searchValue($settings, 'Certificado de preparación'))) > $advance){
                        $advance = $advanceItem;
                    }
                }
                
                // // Lapida
                // if(($result['tombstonePrint'] == '0' || $result['tombstonePrint'] == null) && $result['tombstoneNotApply'] != '1'){
                //     $amount++;
                // }
                
                // // Encuesta de satisfacción
                // if(($result['surveySend'] == '0' || $result['surveySend'] == null) && $result['surveyNotApply'] != '1'){
                //     $amount++;
                // }
                
                // // Vivo Recuerdo
                // if($result['vivoSent'] == null || $result['vivoSent'] == '0'){
                //     $amount++;
                // }

                // // Programación del horno y entrega de cenizas
                // if($result['cremation'] == '1' && ($result['crematoriumProgramOven'] == '0' || $result['crematoriumControlDeliversAshes'] == '0')){
                //     $amount++;
                // }
            }

            /**
             *  Check VARIABLES pending tasks
             *  
             *  Autobús, Curas, Enterradores, Flores, Recordatorios y Taxi
            */

            $maxNumHiring = $this->getActiveHiring($data);

            // Curas
            $result2 = $db->query(" SELECT	p.name
                                    FROM	Expedients_Hirings eh, Products p
                                    WHERE   eh.product = p.productID AND
                                            eh.check = 1 AND
                                            eh.expedient = $data AND
                                            p.timelineType = 2 AND
                                            eh.num_hiring = $maxNumHiring
            ");
            $priestSection = mysqli_num_rows($result2) > 0 ? true : false; 

            if($priestSection){
                $result = $db->query("  SELECT  sp.ID,
                                                p.name, p.parish, p.homePhone, p.mobilePhone, p.otherPhone
                                        FROM    Services_Priests sp, Priests p
                                        WHERE   sp.priest = p.priestID AND
                                                sp.service = $data AND
                                                sp.notified = 0");
                $amount += mysqli_num_rows($result);

                // Calculate total pending
                if($service['priestTimeCheck'] == null || intval($service['priestTimeCheck']) == 0){
                    $amount++;
                }
                if($service['funeralDateNew'] != null && $service['funeralTimeNew'] != null){
                    if(intval($service['priestInspected']) == 0){
                        $amount++;
                    }
                    if(intval($service['priestPayed']) == 0){
                        $amount++;
                    }
                }

                // Get advance hours 
                if(($advanceItem = intval($this->searchValue($settings, 'Curas'))) > $advance){
                    $advance = $advanceItem;
                }
            }

            // Enterradores
            $result2 = $db->query(" SELECT	p.name
                                    FROM	Expedients_Hirings eh, Products p
                                    WHERE   eh.product = p.productID AND
                                            eh.check = 1 AND
                                            eh.expedient = $data AND
                                            p.timelineType = 3 AND
                                            eh.num_hiring = $maxNumHiring
            ");

            $gravediggersSection = mysqli_num_rows($result2) > 0 ? true : false; 
            if($gravediggersSection){
                $result = $db->query("  SELECT  sg.ID,
                                                g.name, g.homePhone, g.mobilePhone, g.otherPhone
                                        FROM    Services_Gravediggers sg, Gravediggers g
                                        WHERE   sg.gravedigger = g.gravediggerID AND
                                                sg.service = $data AND
                                                sg.notified = 0");
                $amount += mysqli_num_rows($result);
            
                if($service['gravediggersCheck'] == null || intval($service['gravediggersCheck']) == 0){
                    $amount++;
                }
                
                if(intval($service['gravediggersNotApply']) == 0){
                    if($service['gravediggersCheckPrinted'] == null || intval($service['gravediggersCheckPrinted']) == 0){
                        $amount++;
                    }
                    if($service['gravediggersCheckSigned'] == null || intval($service['gravediggersCheckSigned']) == 0){
                        $amount++;
                    }
                }

                // Get advance hours 
                if(($advanceItem = intval($this->searchValue($settings, 'Enterradores'))) > $advance){
                    $advance = $advanceItem;
                }
            }

            // Otros - Autobús, Flores, Recordatorios y Taxi
            $result = $db->query("  SELECT      p.timelineType
                                    FROM        Services_Auto sa, Actions a, Products_Models pm, Products p, Expedients_Hirings eh
                                    WHERE       sa.service = $data AND 
                                                sa.status = 1 AND 
                                                sa.value = '0' AND 
                                                sa.action = a.ID AND 
                                                a.type = 'checkbox' AND 
                                                sa.model = pm.productModelID AND
                                                pm.product = p.productID AND
                                                a.label != 'No aplica' AND
                                                a.label != 'No finalizar' AND
                                                eh.expedient = sa.service AND
                                                eh.check = 1 AND
                                                p.productID = eh.product AND
                                                eh.model = pm.productModelID AND
                                                p.checkCService = 1 AND
                                                p.timelineType IN (1,4,5,6) AND
                                                eh.num_hiring = $maxNumHiring
                                    ORDER BY    p.timelineType
            ");

            if(mysqli_num_rows($result) > 0){
                $amount += mysqli_num_rows($result);
                $others = $db->resultToArray($result);

                // Get advance hours 
                foreach($others as $item){
                    switch($item['timelineType']){
                        case '1':
                            if(($advanceItem = intval($this->searchValue($settings, 'Autobús'))) > $advance){
                                $advance = $advanceItem;
                            }
                        break;
                        case '4':
                            if(($advanceItem = intval($this->searchValue($settings, 'Flores'))) > $advance){
                                $advance = $advanceItem;
                            }
                        break;
                        case '5':
                            if(($advanceItem = intval($this->searchValue($settings, 'Recordatorio'))) > $advance){
                                $advance = $advanceItem;
                            }
                        break;
                        case '6':
                            if(($advanceItem = intval($this->searchValue($settings, 'Taxis'))) > $advance){
                                $advance = $advanceItem;
                            }
                        break;
                    }
                }
            }

            return [$amount, $advance];
        }

        public function searchValue($array, $key){

            $filtered = array_filter($array, function ($var) use ($key) {
                return ($var['name'] == $key);
            });
            return $filtered[array_keys($filtered)[0]]['value'];
        }

        /**
         * Devuelve la ultima contratacion
         * 
         * @return int
         */
        public function getActiveHiring($expedientID){
            $db = new DbHandler;

            $result = $db->query("  SELECT  COALESCE(MAX(eh.num_hiring), 0) as num_hiring
                                    FROM    Expedients_Hirings eh
                                    WHERE   eh.expedient = $expedientID");

            if(mysqli_num_rows($result) > 0){
                $maxNumHiring = $db->resultToArray($result)[0]['num_hiring'];
                return $maxNumHiring;
            }else{
                return 0;
            }
        }

        /**
        * Obtiene los expedientes para SALIDAS HOY
        *
        * @return array
        */
        public function getDeparturesToday($start, $end, $mortuary){
            $db = new DbHandler;

            $where = $mortuary == null ? '' : " AND e.deceasedMortuary = $mortuary";

            $result = $db->query("  SELECT      e.expedientID, e.number, e.deceasedGender, e.deceasedName, e.deceasedSurname, e.funeralDate, e.funeralTime, ess.funeralHomeService, e.deceasedRoom
                                    FROM        Expedients e, Expedients_Services ess
                                    WHERE       CONCAT(e.funeralDate, ' ', e.funeralTime) BETWEEN '$start' AND '$end' AND
                                                e.leavingDate IS NULL AND
                                                e.type != 2 AND
                                                e.expedientID = ess.expedient AND
                                                e.funeralDate IS NOT NULL AND e.funeralDate != '' AND
                                                e.funeralTime IS NOT NULL AND e.funeralTime != ''
                                                $where
                                    ORDER BY    e.funeralDate, e.funeralTime
            ");

            $result = $db->resultToArray($result);

            return $result;
        }

        /**
        * Obtiene los expedientes para CREMACIONES
        *
        * @return array
        */
        public function getCremations($start, $end, $mortuary){
            $db = new DbHandler;

            $startPrevious = date_create($start);
            date_sub($startPrevious, date_interval_create_from_date_string("4 hours"));
            $startPrevious = date_format($startPrevious,"Y-m-d H:i:s");

            $where = $mortuary == null ? '' : " AND e.deceasedMortuary = $mortuary";

            $result = $db->query("  SELECT      e.expedientID, e.number, e.deceasedGender, e.deceasedName, e.deceasedSurname, e.trazabilityId, e.crematoriumClient,
                                                ev.start, ev.end
                                    FROM        (Expedients e, Events ev)
                                    WHERE       e.cremation = 1 AND
                                                e.crematoriumEvent = ev.ID AND 
                                                (
                                                    ev.start BETWEEN '$start' AND '$end' OR
                                                    ev.start BETWEEN '$startPrevious' AND '$end'
                                                ) AND
                                                e.leavingDate IS NULL AND
                                                ev.status = 7 AND
                                                ev.start IS NOT NULL AND ev.start != '' AND
                                                ev.end IS NOT NULL AND ev.end != ''
                                                $where
                                    ORDER BY    ev.start
            ");

            $result = $db->resultToArray($result);

            return $result;
        }

        /**
        * Obtiene los expedientes para TAREAS DE PERSONAL
        *
        * @return array
        */
        public function getPersonalTasks($start, $end, $mortuary){
            $db = new DbHandler;
            
            // Delivery of ashes
            $where = $mortuary == null ? '' : " AND e.deceasedMortuary = $mortuary";
            $result = $db->query("  SELECT      'Entrega de Cenizas' as `type_name`,
                                                'ashes' as type,
                                                '#f52b2b' as color, 
                                                e.expedientID as id,
                                                CONCAT(s.name, ' ', s.surname) as designated,
                                                CONCAT(DATE_FORMAT(FROM_UNIXTIME(e.authDate), '%Y-%m-%d'), ' ', DATE_FORMAT(FROM_UNIXTIME(e.authTime), '%H:%i:%s')) as start,
                                                CONCAT(DATE_FORMAT(FROM_UNIXTIME(e.authDate), '%Y-%m-%d'), ' ', DATE_FORMAT(FROM_UNIXTIME(e.authTime), '%H:%i:%s')) as end,
                                                UNIX_TIMESTAMP(CONCAT(DATE_FORMAT(FROM_UNIXTIME(e.authDate), '%Y-%m-%d'), ' ', DATE_FORMAT(FROM_UNIXTIME(e.authTime), '%H:%i:%s'))) as startEvent
                                    FROM        (Expedients e, Expedients_Services es)
                                    LEFT JOIN   Staff s ON es.crematoriumWhoDelivered = s.ID
                                    WHERE       e.cremation = 1 AND
                                                e.leavingDate IS NULL AND
                                                e.authDate IS NOT NULL AND e.authDate != '' AND
                                                e.authTime IS NOT NULL AND e.authTime != '' AND
                                                CONCAT(DATE_FORMAT(FROM_UNIXTIME(e.authDate), '%Y-%m-%d'), ' ', DATE_FORMAT(FROM_UNIXTIME(e.authTime), '%H:%i:%s')) BETWEEN '$start' AND '$end' AND
                                                e.expedientID = es.expedient
                                                $where
            ");
            $deliveryOfAshes = $db->resultToArray($result);

            // Facility maintenance
            $where = $mortuary == null ? '' : " AND e.cleaningMortuary = $mortuary";
            $result = $db->query("  SELECT      'Tarea de Mantenimiento de Instalaciones' as `type_name`,
                                                'installation' as type,
                                                '#088A08' as color, 
                                                e.ID as id,
                                                CONCAT(s.name, ' ', s.surname) as designated,
                                                e.start, 
                                                e.end,
                                                UNIX_TIMESTAMP(e.start) as startEvent
                                    FROM        (Events e)
                                    LEFT JOIN   Staff s ON e.cleaningUser = s.ID
                                    WHERE       e.leavingDate IS NULL AND
                                                e.type = 2 AND 
                                                e.status = 5 AND
                                                (
                                                    e.end BETWEEN '$start' AND '$end' OR
                                                    e.start BETWEEN '$start' AND '$end' OR
                                                    e.start <= '$start' AND e.end >= '$end'
                                                )
                                                $where
            ");
            $installation = $db->resultToArray($result);

            // Free tasks
            $where = $mortuary == null ? '' : " AND tft.mortuary = $mortuary";
            $startAux = strtotime($start);
            $endAux = strtotime($end);
            $result = $db->query("  SELECT      'Tarea Libre' as `type_name`,
                                                'freeTask' as type,
                                                '#002490' as color, 
                                                tft.id as id,
                                                CONCAT(s.name, ' ', s.surname) as designated,
                                                DATE_FORMAT(FROM_UNIXTIME(tft.start), '%Y-%m-%d %H:%i:%s') as start,
                                                DATE_FORMAT(FROM_UNIXTIME(tft.end), '%Y-%m-%d %H:%i:%s') as end,
                                                tft.start as startEvent
                                    FROM        Timeline_Free_Tasks tft
                                    LEFT JOIN   Staff s ON tft.staffDesignated = s.ID
                                    WHERE       tft.leavingDate IS NULL AND
                                                tft.status = 0 AND
                                                (
                                                    tft.end BETWEEN $startAux AND $endAux OR
                                                    tft.start BETWEEN $startAux AND $endAux OR
                                                    tft.start <= $startAux AND tft.end >= $endAux
                                                )
                                                $where
            ");
            $freeTasks = $db->resultToArray($result);

            // Garage tasks
            $where = $mortuary == null ? '' : " AND tgt.mortuary = $mortuary";
            $startAux = strtotime(explode(" ", $start)[0] . ' 09:00:00');
            $endAux = strtotime($end);
            $result = $db->query("  SELECT      'Tarea de Mantenimiento de Vehículos' as `type_name`,
                                                'garageTask' as type,
                                                '#c97b00' as color, 
                                                tgt.id as id,
                                                CONCAT(s.name, ' ', s.surname) as designated,
                                                DATE_FORMAT(FROM_UNIXTIME(tgt.start), '%Y-%m-%d %H:%i:%s') as start,
                                                DATE_FORMAT(FROM_UNIXTIME(tgt.end), '%Y-%m-%d %H:%i:%s') as end,
                                                tgt.start as startEvent
                                    FROM        Timeline_Garage_Tasks tgt
                                    LEFT JOIN   Staff s ON tgt.staffDesignated = s.ID
                                    WHERE       tgt.leavingDate IS NULL AND
                                                tgt.status = 0 AND
                                                (
                                                    tgt.end BETWEEN $startAux AND $endAux OR
                                                    tgt.start BETWEEN $startAux AND $endAux OR
                                                    tgt.start <= $startAux AND tgt.end >= $endAux
                                                )
                                                $where
            ");
            $garageTasks = $db->resultToArray($result);

            $tasks = array_merge($deliveryOfAshes, $installation, $freeTasks, $garageTasks);

            usort($tasks, 'sortByStartEvent');

            return $tasks;
        }

        /**
         * Obtiene las tareas pendientes de un servicio
         * 
         * @param array $data ID del expediente
         * @return array
         */
        public function getTasksByExpedient($data){
            $db = new DbHandler;

            $data = cleanStr($data);
            
            $maxNumHiring = $this->getActiveHiring($data);

            $sections = array();

            $service = $db->query(" SELECT  e.number, e.deceasedName, e.deceasedSurname, e.deceasedGender, e.funeralDateNew, e.funeralTimeNew,
                                            es.revReqCheck, es.control, 
                                            es.priestTimeCheck, es.priestPayed, es.priestTime,  es.priestInspected, 
                                            es.gravediggersNotApply, es.gravediggersCheck, es.gravediggersCheckPrinted,es.gravediggersCheckSigned, 
                                            es.carriersTimeCheck, es.carriersTime
                                    FROM    (Expedients_Services es, Expedients e)
                                    WHERE   es.expedient = $data AND
                                            es.expedient = e.expedientID");

            $service = $db->resultToArray($service)[0];
            
            // Detalles del servicio
            $details = array();
            array_push($details, $service['revReqCheck']);
            array_push($details, $service['control']);
            array_push($details, $service['deceasedName']);
            array_push($details, $service['deceasedSurname']);
            array_push($details, $service['deceasedGender']);
            array_push($details, $service['number']);
            
            $sections['details'] = $details;

            // Porteadores
            $result = $db->query("  SELECT  sc.ID,
                                            c.name, c.surname, c.phones
                                    FROM    Services_Carriers sc, Carriers c
                                    WHERE   sc.carrier = c.carrierID AND
                                            sc.service = $data AND
                                            sc.confirmed = 0");

            $result = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
            
            $carriers = array();
            array_push($carriers, $service['carriersTimeCheck']);
            array_push($carriers, $result);
            array_push($carriers, $service['carriersTime']);

            $sections['carriers'] = $carriers;

            $result = $db->query("  SELECT  es.policeNotified, es.webConfirm, 
                                            es.doctorDone, es.doctorDeliver, es.doctorInProgress, 
                                            es.tribunalDeliver, es.tribunalInProgress,
                                            es.tombstone, es.tombstonePrint, es.tombstoneNotApply,
                                            es.preparationConfirm, 
                                            es.surveySend, es.surveyNotApply, 
                                            es.vivoSent, 
                                            e.cremation, es.crematoriumProgramOven, es.crematoriumControlDeliversAshes
                                    FROM    Expedients_Services es, Expedients e
                                    WHERE   es.expedient = $data AND
                                            es.expedient = e.expedientID");

            $result = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
            $sections['others2'] = $result;

            // Curas
            $priests = array();

            $result = $db->query("  SELECT  sp.ID,
                                            p.name, p.surname, p.parish, p.homePhone, p.mobilePhone, p.otherPhone
                                    FROM    Services_Priests sp, Priests p
                                    WHERE   sp.priest = p.priestID AND
                                            sp.service = $data AND
                                            sp.notified = 0");
            $result = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
           
            $result2 = $db->query(" SELECT	p.name
                                    FROM	Expedients_Hirings eh, Products p
                                    WHERE   eh.product = p.productID AND
                                            eh.check = 1 AND
                                            eh.expedient = $data AND
                                            p.timelineType = 2 AND
                                            eh.num_hiring = $maxNumHiring
            ");

            $priestSection = mysqli_num_rows($result2) > 0 ? true : false; 
            if($priestSection){
                array_push($priests, $service['priestTimeCheck']);            
                array_push($priests, $result);
                array_push($priests, $service['priestTime']);
                array_push($priests, array());
                if($service['funeralDateNew'] != null && $service['funeralTimeNew'] != null){
                    if($service['priestInspected'] == '0'){
                        $priests[3]['priestInspected'] = $service['priestInspected'];
                    }
                    if($service['priestPayed'] == '0'){
                        $priests[3]['priestPayed'] = $service['priestPayed'];
                    }
                }
            }
            $sections['priests'] = $priests;

            // Enterradores
            $gravediggers = array();

            $result = $db->query("  SELECT  sg.ID, g.name, g.surname, g.homePhone, g.mobilePhone, g.otherPhone
                                    FROM    Services_Gravediggers sg, Gravediggers g
                                    WHERE   sg.gravedigger = g.gravediggerID AND
                                            sg.service = $data AND
                                            sg.notified = 0");

            $result = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;

            $result2 = $db->query(" SELECT	p.name
                                    FROM	Expedients_Hirings eh, Products p
                                    WHERE   eh.product = p.productID AND
                                            eh.check = 1 AND
                                            eh.expedient = $data AND
                                            p.timelineType = 3 AND
                                            eh.num_hiring = $maxNumHiring
            ");

            $gravediggersSection = mysqli_num_rows($result2) > 0 ? true : false;
            if($gravediggersSection){
                array_push($gravediggers, $service['gravediggersCheck']);
            }else{
                array_push($gravediggers, 1);
            }

            if(intval($service['gravediggersNotApply']) == 0){
                if($gravediggersSection){
                    array_push($gravediggers, $service['gravediggersCheckPrinted'], $service['gravediggersCheckSigned']);
                }else{
                    array_push($gravediggers, 1, 1);
                }
            }else{
                array_push($gravediggers, 1, 1);
            }

            if($gravediggersSection){
                array_push($gravediggers, $result);
            }else{
                array_push($gravediggers, []);
            }
            $sections['gravediggers'] = $gravediggers;

            // Otros
            $result = $db->query("  SELECT      sa.action, sa.value, 
                                                a.type, a.label, 
                                                pm.productModelID, pm.name,
                                                p.name as productName, s.name as supplierName, s.phones as supplierPhones
                                    FROM        Services_Auto sa, Actions a, Products_Models pm, Products p, Expedients_Hirings eh, Suppliers s
                                    WHERE       sa.service = $data AND 
                                                sa.status = 1 AND 
                                                sa.value = '0' AND 
                                                sa.action = a.ID AND 
                                                a.type = 'checkbox' AND 
                                                sa.model = pm.productModelID AND
                                                pm.product = p.productID AND
                                                a.label != 'No aplica' AND
                                                a.label != 'No finalizar' AND
                                                eh.expedient = sa.service AND
                                                eh.check = 1 AND
                                                p.productID = eh.product AND
                                                eh.model = pm.productModelID AND
                                                eh.supplier = s.supplierID AND
                                                p.checkCService = 1 AND
                                                p.timelineType IN (1,4,5,6) AND
                                                eh.num_hiring = $maxNumHiring
                                    ORDER BY    pm.productModelID
            ");
            $result = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;

            $sections['others'] = $result;

            return $sections;
        }

        /**
         * Obtiene la información para una tarea de personal - ENTREGA DE CENIZAS
         * 
         * @param int $expedient Id del expediente
         * @return bool
         */
        public function getDeliveryAshesInfo($expedient){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);

            $result = $db->query("   SELECT     e.number, e.deceasedGender, e.deceasedName, e.deceasedSurname, e.trazabilityId, 
                                                e.authDate, e.authTime, e.authPlace, e.authName,
                                                CONCAT(s.name, ' ' , s.surname) as crematoriumWhoDelivered
                                    FROM        (Expedients e, Expedients_Services es)
                                    LEFT JOIN   Staff s ON es.crematoriumWhoDelivered = s.ID
                                    WHERE       e.expedientID = $expedient AND
                                                e.expedientID = es.expedient");

            if(mysqli_num_rows($result) > 0){
                $expedientInfo = $db->resultToArray($result)[0];                           
            }else{
                $expedientInfo = null;
            }

            return $expedientInfo;
        }

        /**
         * Obtiene la información para una tarea de personal - MANTENIMIENTO DE INSTALACIONES
         * 
         * @param int $id Id del evento
         * @return bool
         */
        public function getInstallationInfo($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("  SELECT      e.name, e.start, e.end, 
                                                CASE
                                                    WHEN e.regularity = 1 THEN 'Semanal'
                                                    WHEN e.regularity = 2 THEN 'Quincenal'
                                                    WHEN e.regularity = 3 THEN 'Mensual'
                                                    WHEN e.regularity = 4 THEN 'Bimensual'
                                                    WHEN e.regularity = 5 THEN 'Trimestral'
                                                    WHEN e.regularity = 6 THEN 'Cuatrimestral'
                                                    WHEN e.regularity = 7 THEN 'Semestral'
                                                    WHEN e.regularity = 8 THEN 'Anual'
                                                    ELSE '-'
                                                END as regularity,
                                                IF(e.allDay = 1, 'Sí', 'No') as allDay, 
                                                IF(e.reminder = 1, 'Sí', 'No') as reminder, 
                                                ct.name as cleaningType,
                                                m.name as mortuary,
                                                CONCAT(s.name, ' ', s.surname) as designed,
                                                e.description,
                                                CONCAT(u.name, ' ', u.surname) as userName
                                    FROM        (Events e, Events_Status es, Users u)
                                    LEFT JOIN   Cleaning_Types ct ON e.cleaningType = ct.ID
                                    LEFT JOIN   Mortuaries m ON e.cleaningMortuary = m.mortuaryID
                                    LEFT JOIN   Staff s ON e.cleaningUser = s.ID
                                    WHERE       e.status = es.ID AND 
                                                e.user = u.userID AND
                                                e.ID = $id
            ");

            if(mysqli_num_rows($result) > 0){
                $expedientInfo = $db->resultToArray($result)[0];                           
            }else{
                $expedientInfo = null;
            }

            return $expedientInfo;
        }

        /**
         * Obtiene la información para una tarea de personal - TAREA LIBRE
         * 
         * @param int $expedient Id del expediente
         * @return bool
         */
        public function getFreeTaskInfo($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("   SELECT     tft.start, tft.end, 
                                                CONCAT(s.name, ' ', s.surname) as staffDesignatedName,
                                                tft.description,
                                                m.name as mortuaryName
                                    FROM        (Timeline_Free_Tasks tft)
                                    LEFT JOIN   Staff s ON tft.staffDesignated = s.ID
                                    LEFT JOIN   Mortuaries m ON tft.mortuary = m.mortuaryID
                                    WHERE       tft.id = $id");

            if(mysqli_num_rows($result) > 0){
                $freeTaskInfo = $db->resultToArray($result)[0];                           
            }else{
                $freeTaskInfo = null;
            }

            return $freeTaskInfo;
        }

        /**
         * Obtiene la información para una tarea de personal - TAREA DE MANTENIMIENTO DE VEHÍCULOS
         * 
         * @param int $expedient Id del expediente
         * @return bool
         */
        public function getGarageTaskInfo($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $result = $db->query("   SELECT     IF(
                                                    e.type = 6, 
                                                    SUBSTRING(e.name, 14), 
                                                    IF(
                                                        e.upkeeps IS NOT NULL,
                                                        CONCAT('Mantenimientos del coche ', CONCAT(c.licensePlate, ' para el día ', DATE_FORMAT(e.start,'%d-%m-%Y'))),
                                                        CONCAT(e.name, ' para el día ', DATE_FORMAT(e.start,'%d-%m-%Y'))
                                                    )
                                                ) as name,
                                                tgt.start, 
                                                CONCAT(s.name, ' ', s.surname) as staffDesignatedName,
                                                m.name as mortuaryName,
                                                e.upkeeps as upkeepID,
                                                IF(
                                                    e.upkeeps IS NOT NULL,
                                                    (
                                                        SELECT  COUNT(*)
                                                        FROM    Events e2
                                                        WHERE   e2.upkeeps = e.upkeeps AND 
                                                                e2.`leavingDate` IS NULL AND 
                                                                e2.status = 1
                                                    ),
                                                    0
                                                ) as total_upkeeps
                                    FROM        (Staff s, Mortuaries m, Timeline_Garage_Tasks tgt, Events e)
                                    LEFT JOIN   Cars c ON c.ID = e.car AND c.leavingDate IS NULL AND c.external = 0
                                    WHERE       tgt.event = e.ID AND 
                                                tgt.staffDesignated = s.ID AND
                                                tgt.mortuary = m.mortuaryID AND
                                                tgt.id = $id");

            if(mysqli_num_rows($result) > 0){
                $freeTaskInfo = $db->resultToArray($result)[0];                           
            }else{
                $freeTaskInfo = null;
            }

            return $freeTaskInfo;
        }
    }

    function sortByStartEvent($a, $b) {
        return $a['startEvent'] - $b['startEvent'];
    }
?>