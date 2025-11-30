<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Events{

        /**
        * Añade un evento
        *
        * @param array $data
        *
        * @return bool
        */
        public function create($data){
            $db = new DbHandler;

            // Cálculo del extraID
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("SELECT * 
                                  FROM Events 
                                  WHERE extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("SELECT * 
                                      FROM Events 
                                      WHERE extraID = '" . $extraID . "'");
            }

            if(!isset($data['cleaningType'])){
                $data['cleaningType'] = 'null';
            }

            if(!isset($data['cleaningMortuary'])){
                $data['cleaningMortuary'] = 'null';
            }

            if(!isset($data['cleaningUser'])){
                $data['cleaningUser'] = 'null';
            }

            if(!isset($data['cremation'])){
                $data['cremation'] = 0;
            }

            if(!isset($data['regularity'])){
                $data['regularity'] = 0;
            }

            if(!isset($data['expedient'])){
                $data['expedient'] = 'null';
            }
            if(!isset($data['reminder'])){
                $data['reminder'] = 0;
            }

            if(!isset($data['reminderEmail'])){
                $data['reminderEmail'] = 0;
            }
            if(!isset($data['reminderDate'])){
                $data['reminderDate'] = 0;
            }

            if(!isset($data['reminderSendTo'])){
                $data['reminderSendTo'] = 0;
            }

            if(!isset($data['car'])){
                $data['car'] = 'null';
            }

            if(!isset($data['upkeeps'])){
                $data['upkeeps'] = 'null';
            }

            if(!isset($data['description'])){
                $description = 'null';
            }else{
                $description = "'" . $data['description'] . "'";
            }

            $data['cleaningType'] = cleanStr($data['cleaningType']);
            $data['cleaningMortuary'] = cleanStr($data['cleaningMortuary']);
            $data['cleaningUser'] = cleanStr($data['cleaningUser']);
            $data['cremation'] = cleanStr($data['cremation']);
            $data['regularity'] = cleanStr($data['regularity']);
            $data['expedient'] = cleanStr($data['expedient']);
            $data['car'] = cleanStr($data['car']);
            $data['upkeeps'] = cleanStr($data['upkeeps']);
            $data['reminder'] = cleanStr($data['reminder']);
            $data['reminderEmail'] = cleanStr($data['reminderEmail']);
            $data['reminderDate'] = cleanStr($data['reminderDate']);
            $data['reminderSendTo'] = cleanStr($data['reminderSendTo']);
            $data['status'] = cleanStr($data['status']);
            $data['name'] = cleanStr($data['name']);
            $data['start'] = cleanStr($data['start']);
            $data['end'] = cleanStr($data['end']);
            $data['type'] = cleanStr($data['type']);
            $data['allDay'] = cleanStr($data['allDay']);

            $currentUser = isset($_SESSION['user']) ? $_SESSION['user'] : 'null';
            
            $currentDate = strtotime("today");

            $result = $db->query("  INSERT INTO Events( status, user, name, cleaningType, cleaningMortuary, 
                                        cleaningUser, start, end, type, regularity,
                                        reminder, cremation, leavingDate, extraID, expedient, car, upkeeps, allDay,
                                        mailSend, mailDate, mailTo, description, dischargeDay) 
                                    VALUES( " . $data['status'] . ", $currentUser,
                                        '" . $data['name'] . "', " . $data['cleaningType'] . ", 
                                        " . $data['cleaningMortuary'] . ", 
                                        " . $data['cleaningUser'] . ", '" . $data['start'] . "', 
                                        '" . $data['end'] . "', " . $data['type'] . ", 
                                        " . $data['regularity'] . ", " . $data['reminder'] . ", 
                                        " . $data['cremation'] . ", null, '" . $extraID . "', 
                                        " . $data['expedient'] . ",  " . $data['car'] . "," . $data['upkeeps'] . ",
                                        " . $data['allDay'] . ", " . $data['reminderEmail'] . ", " . $data['reminderDate'] . ",
                                        '" . $data['reminderSendTo'] . "',   $description, " . $currentDate . ")");

            return array(true, $extraID);
        }

        /**
        * Añade un evento
        *
        * @param array $data
        *
        * @return bool
        */
        public function createFinancingEvent($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['start'] = cleanStr($data['start']);
            $data['end'] = cleanStr($data['end']);
            $data['status'] = cleanStr($data['status']);
            $data['financingID'] = cleanStr($data['financingID']);

            // Cálculo del extraID
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("SELECT * 
                                  FROM Financing_Events 
                                  WHERE extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("SELECT * 
                                      FROM Financing_Events 
                                      WHERE extraID = '" . $extraID . "'");
            }

            $result = $db->query("  INSERT INTO Financing_Events(name, start, end, status, extraID, financingID) 
                                    VALUES( '" . $data['name'] . "', " . $data['start'] . ", " . $data['end'] . ", 
                                            " . $data['status'] . ", '" . $extraID . "', ".$data['financingID'].")");

            if($result){
                $result = $db->query("  SELECT fe.ID FROM Financing_Events fe WHERE extraID = '$extraID'");
                if(mysqli_num_rows($result) > 0){
                    return $db->resultToArray($result)[0]['ID'];
                }
            }
            return false;
        }

        /**
        * Obtiene los datos de un evento
        *
        * @param array $data
        *
        * @return array
        */
        public function read($data){
            $db = new DbHandler;

            $data['eventID'] = cleanStr($data['eventID']);

            $result = $db->query("  SELECT  * 
                                    FROM    Events 
                                    WHERE   ID = " . $data['eventID']);
            
            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
        * Modifica los datos de un evento
        *
        * @param array $data
        */
        public function update($data){
            $db = new DbHandler;

            if(!isset($data['cleaningType'])){
                $data['cleaningType'] = 'null';
            }

            if(!isset($data['cleaningMortuary'])){
                $data['cleaningMortuary'] = 'null';
            }

            if(!isset($data['cleaningUser'])){
                $data['cleaningUser'] = 'null';
            }

            if(!isset($data['description'])){
                $description = 'null';
            }else{
                $description = "'" . $data['description'] . "'";
            }
            
            if(!isset($data['regularity'])){
                $data['regularity'] = 0;
            }
            if(!isset($data['allDay'])){
                $data['allDay'] = 0;
            }
            if(!isset($data['reminderEmail'])){
                $data['reminderEmail'] = 0;
            }           
            if(!isset($data['reminderDate']) || $data['reminderDate'] == 'null'){
                $data['reminderDate'] = 0;
            }
            if(!isset($data['reminderSendTo'])){
                $data['reminderSendTo'] = 0;
            }

            $data['event'] = cleanStr($data['event']);
            $data['status'] = cleanStr($data['status']);
            $data['name'] = cleanStr($data['name']);
            $data['start'] = cleanStr($data['start']);
            $data['end'] = cleanStr($data['end']);
            $data['reminder'] = cleanStr($data['reminder']);
            $data['cleaningType'] = cleanStr($data['cleaningType']);
            $data['cleaningMortuary'] = cleanStr($data['cleaningMortuary']);
            $data['cleaningUser'] = cleanStr($data['cleaningUser']);
            $data['regularity'] = cleanStr($data['regularity']);
            $data['allDay'] = cleanStr($data['allDay']);
            $data['reminderEmail'] = cleanStr($data['reminderEmail']);
            $data['reminderDate'] = cleanStr($data['reminderDate']);
            $data['reminderSendTo'] = cleanStr($data['reminderSendTo']);

            // Eventos de tipo limpieza
            $result = $db->query("  SELECT  e.success
                                    FROM    Events e
                                    WHERE   e.ID = " . $data['event']);

            if(mysqli_num_rows($result) > 0){
                $success = $db->resultToArray($result)[0]['success'];
                if($success == 1){
                    $data['status'] = 4;
                }
            }

            return $db->query(" UPDATE  Events
                                SET     status = " . $data['status'] . ", 
                                        name = '" . $data['name'] . "', 
                                        start = '" . $data['start'] . "', 
                                        end = '" . $data['end'] . "', 
                                        reminder = " . $data['reminder'] . ",
                                        cleaningType = " . $data['cleaningType'] . ",
                                        cleaningMortuary = " . $data['cleaningMortuary'] . ",
                                        cleaningUser = " . $data['cleaningUser'] . ",
                                        regularity = " . $data['regularity'] . ",
                                        allDay = " . $data['allDay'] . ",
                                        mailSend = " . $data['reminderEmail'] . ",
                                        mailDate = " . $data['reminderDate'] . ",
                                        description = $description,
                                        mailTo = '" . $data['reminderSendTo'] . "'
                                WHERE   ID = " . $data['event']);
        }

        /**
         * Cierra un evento
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function close($data){
            $db = new DbHandler;

            $data['status'] = cleanStr($data['status']);
            $data['eventID'] = cleanStr($data['eventID']);

            return $db->query(" UPDATE  Events
                                SET     status = " . $data['status'] . ",
                                        success = 1
                                WHERE   ID = " . $data['eventID']);
        }

        /**
        * Elimina un evento
        *
        * @param array $data
        *
        * @return bool
        */
        public function delete($data){
            $db = new DbHandler;

            $data['eventID'] = cleanStr($data['eventID']);

            return $db->query("UPDATE Events
                               SET leavingDate = '" . date('Y-m-d H:i:s') . "' 
                               WHERE ID = " . $data['eventID']);
        }

        /**
        * Lista los eventos
        *
        * @return array
        */
        public function list(){
            $db = new DbHandler;

            $where = '';
            if($_GET['start'] != null && $_GET['end'] != null){
                $start = $_GET['start'];
                $end = $_GET['end'];

                $where = " AND e.start >= '$start' AND e.end <= '$end'";
            }   

            $result = $db->query(" SELECT       e.allDay, e.ID as id, e.name as title, e.start, e.start as start2, e.end, e.end AS end2, e.reminder, e.cremation, e.type, e.cleaningType, e.cleaningMortuary,e.description,
                                                e.success, e.cleaningUser, e.regularity, e.mailSend, e.mailDate, e.mailTo, e.mailSent, e.upkeeps, ex.tpv,
                                                s2.name as cleaningUserName, s2.surname as cleaningUserSurname,
                                                ct.name AS cleaningTypeName,
                                                m.name AS cleaningMortuaryName,
                                                m.name AS cleaningMortuaryName,
                                                es.ID as statusID, es.name as statusName, es.borderColor, es.backgroundColor, 
                                                u.name as userName,
                                                ex.crematoriumClient, ex.deceasedName, ex.deceasedSurname, ex.deceasedNIF, ex.number,
                                                l.locationID as vehicle,
                                                ex.familyContactName, ex.familyContactSurname, ex.familyContactPhone,
                                                ex.crematoriumArriveTime, ex.crematoriumIntroduction, ex.crematoriumWaitOnRoom,
                                                ex.crematoriumVaseBio, ex.clientType, ex.expedientID, ex.crematoriumContactPerson, ex.crematoriumContactPhonePerson,
                                                ex.crematoriumContactPersonPhone, ex.authName, ex.authDni, ex.authDate, ex.authTime, ex.authPlace,
                                                ex.ecologicCoffin, ex.cremationServiceLocation, ex.crematoriumPacemaker, ex.crematoriumContactPhonePerson, ex.authContactPhone,
                                                l.name AS cremationServiceLocationName, l.province AS cremationServiceProvinceName,
                                                fh.funeralHomeID as clientID, fh.nif as clientNif, fh.name as clientName, fh.phones as clientPhones,
                                                st.ID as crematoriumTechnical, st.name as crematoriumTechnicalName, st.surname as crematoriumTechnicalSurname,
                                                ex.crematorium as crematoriumID, cr.name AS crematoriumName
                                    FROM        (Events e, Events_Status es)
                                    LEFT JOIN   Expedients ex ON e.expedient = ex.expedientID
                                    LEFT JOIN   Users u ON e.user = u.userID
                                    LEFT JOIN   Staff s2 ON s2.ID = e.cleaningUser
                                    LEFT JOIN   FuneralHomes fh ON ex.crematoriumClient = fh.funeralHomeID
                                    LEFT JOIN   Cleaning_Types ct ON e.cleaningType = ct.ID
                                    LEFT JOIN   Mortuaries m ON e.cleaningMortuary = m.mortuaryID
                                    LEFT JOIN   Locations l ON ex.cremationServiceLocation = l.locationID
                                    LEFT JOIN   Staff st ON ex.crematoriumTechnical = st.ID
                                    LEFT JOIN   Crematoriums cr  ON ex.crematorium = cr.crematoriumID
                                    WHERE       e.status = es.ID AND
                                                e.type IN(1,2,3,4,5,6,7,10) AND
                                                e.leavingDate IS NULL $where
                                    UNION 
                                    SELECT      e.allDay, e.ID as id, CONCAT('Mantenimiento matrícula ', ca.licensePlate) as title, e.start, e.start as start2, e.end, e.end AS end2, e.reminder, e.cremation, e.type, e.cleaningType, e.cleaningMortuary, e.description,
                                                e.success, e.cleaningUser, e.regularity, e.mailSend, e.mailDate, e.mailTo, e.mailSent, e.upkeeps, ex.tpv,
                                                s2.name as cleaningUserName, s2.surname as cleaningUserSurname,
                                                ct.name AS cleaningTypeName,
                                                m.name AS cleaningMortuaryName,
                                                m.name AS cleaningMortuaryName,
                                                es.ID as statusID, es.name as statusName, es.borderColor, es.backgroundColor, 
                                                u.name as userName,
                                                ex.crematoriumClient, ex.deceasedName, ex.deceasedSurname, ex.deceasedNIF, ex.number,
                                                ca.ID as vehicle,
                                                ex.familyContactName, ex.familyContactSurname, ex.familyContactPhone,
                                                ex.crematoriumArriveTime, ex.crematoriumIntroduction, ex.crematoriumWaitOnRoom,
                                                ex.crematoriumVaseBio, ex.clientType, ex.expedientID, ex.crematoriumContactPerson, ex.crematoriumContactPhonePerson,
                                                ex.crematoriumContactPersonPhone, ex.authName, ex.authDni, ex.authDate, ex.authTime, ex.authPlace,
                                                ex.ecologicCoffin, ex.cremationServiceLocation, ex.crematoriumPacemaker, ex.crematoriumContactPhonePerson, ex.authContactPhone,
                                                l.name AS cremationServiceLocationName, l.province AS cremationServiceProvinceName,
                                                fh.funeralHomeID as clientID, fh.nif as clientNif, fh.name as clientName, fh.phones as clientPhones,
                                                st.ID as crematoriumTechnical, st.name as crematoriumTechnicalName, st.surname as crematoriumTechnicalSurname,
                                                ex.crematorium as crematoriumID, cr.name AS crematoriumName
                                    FROM        (Events e, Events_Status es)
                                    LEFT JOIN   Expedients ex ON e.expedient = ex.expedientID
                                    LEFT JOIN   Users u ON e.user = u.userID
                                    LEFT JOIN   Staff s2 ON s2.ID = e.cleaningUser
                                    LEFT JOIN   FuneralHomes fh ON ex.crematoriumClient = fh.funeralHomeID
                                    LEFT JOIN   Cars ca ON e.car = ca.ID
                                    LEFT JOIN   Cleaning_Types ct ON e.cleaningType = ct.ID
                                    LEFT JOIN   Mortuaries m ON e.cleaningMortuary = m.mortuaryID
                                    LEFT JOIN   Locations l ON ex.cremationServiceLocation = l.locationID
                                    LEFT JOIN   Staff st ON ex.crematoriumTechnical = st.ID
                                    LEFT JOIN   Crematoriums cr  ON ex.crematorium = cr.crematoriumID
                                    WHERE       e.status = es.ID AND 
                                                e.leavingDate IS NULL AND
                                                (e.type = 9 || e.type = 8) $where
                                    GROUP BY    e.start, e.car
            ");

            return mysqli_num_rows($result) == 0 ? array() : $db->resultToArray($result);
        }

        /**
         * Obtiene los productos asociados a una cremación
         *
         * @param int $expedient ID del expediente
         * @return array
         */
        public function getProducts($expedient){
            $db = new DbHandler;

            $expedient = cleanStr($expedient);

            $maxNumHiring = $this->getActiveHiring($expedient);

            $result = $db->query("  SELECT  p.name productName, pm.name as modelName, s.name as supplierName, eh.amount
                                    FROM    Expedients_Hirings eh, Products p, Products_Models pm, Suppliers s
                                    WHERE   eh.expedient = $expedient AND
                                            eh.check = 1 AND
                                            eh.product = p.productID AND
                                            eh.model = pm.productModelID AND
                                            eh.supplier = s.supplierID AND
                                            p.blockBelow = 6 AND
                                            eh.num_hiring = $maxNumHiring
            ");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
        * Modifica los datos de un evento
        *
        * @param array $data
        */
        public function updateCremation($data){
            $db = new DbHandler;

            $data['status'] = cleanStr($data['status']);
            $data['start'] = cleanStr($data['start']);
            $data['end'] = cleanStr($data['end']);
            $data['reminder'] = cleanStr($data['reminder']);
            $data['event'] = cleanStr($data['event']);
            $data['crematoriumArriveTime'] = cleanStr($data['crematoriumArriveTime']);
            $data['cremationServiceLocation'] = cleanStr($data['cremationServiceLocation']);
            $data['client'] = cleanStr($data['client']);
            $data['contactPerson'] = cleanStr($data['contactPerson']);
            $data['contactPersonPhone'] = cleanStr($data['contactPersonPhone']);
            $data['familyContactName'] = cleanStr($data['familyContactName']);
            $data['familyContactSurname'] = cleanStr($data['familyContactSurname']);
            $data['familyContactPhone'] = cleanStr($data['familyContactPhone']);
            $data['crematoriumIntroduction'] = cleanStr($data['crematoriumIntroduction']);
            $data['crematoriumWaitOnRoom'] = cleanStr($data['crematoriumWaitOnRoom']);
            $data['crematoriumVaseBio'] = cleanStr($data['crematoriumVaseBio']);
            $data['authDni'] = cleanStr($data['authDni']);
            $data['authName'] = cleanStr($data['authName']);
            $data['ecologicCoffin'] = cleanStr($data['ecologicCoffin']);
            $data['authDate'] = cleanStr($data['authDate']);
            $data['authTime'] = cleanStr($data['authTime']);
            $data['authPlace'] = cleanStr($data['authPlace']);
            $data['crematoriumPacemaker'] = cleanStr($data['crematoriumPacemaker']);
            $data['crematoriumTechnical'] = cleanStr($data['crematoriumTechnical']);
            $data['crematoriumId'] = cleanStr($data['crematoriumId']);
            $data['authContactPhone'] = cleanStr($data['authContactPhone']);
            $data['crematoriumContactPhonePerson'] = cleanStr($data['crematoriumContactPhonePerson']);
            $data['expedientID'] = cleanStr($data['expedientID']);

            $db->query("UPDATE  Events
                        SET     status = " . $data['status'] . ", 
                                start = '" . $data['start'] . "', 
                                end = '" . $data['end'] . "', 
                                reminder = " . $data['reminder'] . "
                        WHERE   ID = " . $data['event']);

            if($data['crematoriumArriveTime'] == ''){
                $crematoriumArriveTime = 'null';
            }else{
                $crematoriumArriveTime = "'" . $data['crematoriumArriveTime'] . "'";
            }
            if($data['cremationServiceLocation'] == ''){
                $cremationServiceLocation = 'null';
            }else{
                $cremationServiceLocation = "'" . $data['cremationServiceLocation'] . "'";
            }

            if($data['authDate'] == ''){
                $data['authDate'] = 'null';
            }

            if($data['authTime'] == ''){
                $data['authTime'] = 'null';
            }
            if($data['authContactPhone'] == ''){
                $data['authContactPhone'] = 'null';
            }
            if($data['crematoriumContactPhonePerson'] == ''){
                $data['crematoriumContactPhonePerson'] = 'null';
            }

            if($data['crematoriumTechnical'] == ''){
                $data['crematoriumTechnical'] = 'null';
            }

            if($data['crematorium'] == ""){
                $data['crematorium'] = 'null';
            }

            return $db->query(" UPDATE  Expedients
                                SET     crematoriumClient = " . $data['client'] . ",
                                        crematoriumContactPerson = '" . $data['contactPerson'] . "',
                                        crematoriumContactPersonPhone = '" . $data['contactPersonPhone'] . "',
                                        familyContactName = '" . $data['familyContactName'] . "',
                                        familyContactSurname = '" . $data['familyContactSurname'] . "',
                                        familyContactPhone = '" . $data['familyContactPhone'] . "',
                                        crematoriumArriveTime = $crematoriumArriveTime,
                                        crematoriumIntroduction = '" . $data['crematoriumIntroduction'] . "',
                                        crematoriumWaitOnRoom = '" . $data['crematoriumWaitOnRoom'] . "',
                                        crematoriumVaseBio = " . $data['crematoriumVaseBio'] . ",
                                        authDni = '" . $data['authDni'] . "',
                                        authName = '" . $data['authName'] . "',
                                        cremationServiceLocation = $cremationServiceLocation,
                                        ecologicCoffin = " . $data['ecologicCoffin'] . ",
                                        authDate = " . $data['authDate'] . ",
                                        authTime = " . $data['authTime'] . ",
                                        authPlace = '" . $data['authPlace'] . "',
                                        crematoriumPacemaker = " . $data['crematoriumPacemaker'] . ",
                                        crematoriumTechnical = " . $data['crematoriumTechnical'] . ",
                                        authContactPhone = ".$data['authContactPhone'].",
                                        crematorium = ".$data['crematoriumId'].",
                                        crematoriumContactPhonePerson = ".$data['crematoriumContactPhonePerson']."
                                WHERE   expedientID = " . $data['expedientID']);
        }

        /**
         * Elimina una cremación
         * 
         * @param int $id Id de la cremación
         * @return bool
         */
        public function deleteCremation($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $date = date('Y-m-d H:i:s');

            $db->query("UPDATE  Events e
                        SET     e.leavingDate = '$date'
                        WHERE   e.ID = $id");

            $result = $db->query("  SELECT  e.expedient
                                    FROM    Events e
                                    WHERE   e.ID = $id");

            if(mysqli_num_rows($result) > 0){
                $expedient = $db->resultToArray($result)[0]['expedient'];

                $db->query("UPDATE  Expedients e
                            SET     e.cremation = 0
                            WHERE   e.expedientID = $expedient");
            }

            return true;
        }

        /**
         * Añade un evento de tipo "Cremación"
         * 
         * @param array $data Datos de la cremación
         * @return bool
         */
        public function createCremation($data){
            $db = new DbHandler;

            $data['state'] = cleanStr($data['state']);
            $data['user'] = cleanStr($data['user']);
            $data['expedient'] = cleanStr($data['expedient']);
            $data['name'] = cleanStr($data['name']);
            $data['start'] = cleanStr($data['start']);
            $data['end'] = cleanStr($data['end']);
            $data['reminder'] = cleanStr($data['reminder']);
            $data['crematoriumArriveTime'] = cleanStr($data['crematoriumArriveTime']);
            $data['cremationServiceLocation'] = cleanStr($data['cremationServiceLocation']);
            $data['crematorium'] = cleanStr($data['crematorium']);
            $data['client'] = cleanStr($data['client']);
            $data['contactPerson'] = cleanStr($data['contactPerson']);
            $data['contactPersonPhone'] = cleanStr($data['contactPersonPhone']);
            $data['introduction'] = cleanStr($data['introduction']);
            $data['waitOnRoom'] = cleanStr($data['waitOnRoom']);
            $data['vaseBio'] = cleanStr($data['vaseBio']);
            $data['familyContactName'] = cleanStr($data['familyContactName']);
            $data['familyContactSurname'] = cleanStr($data['familyContactSurname']);
            $data['familyContactPhone'] = cleanStr($data['familyContactPhone']);
            $data['authDni'] = cleanStr($data['authDni']);
            $data['authName'] = cleanStr($data['authName']);
            $data['ecologicCoffin'] = cleanStr($data['ecologicCoffin']);
            $data['authDate'] = cleanStr($data['authDate']);
            $data['authTime'] = cleanStr($data['authTime']);
            $data['authPlace'] = cleanStr($data['authPlace']);
            $data['crematoriumPacemaker'] = cleanStr($data['crematoriumPacemaker']);
            $data['crematoriumTechnical'] = cleanStr($data['crematoriumTechnical']);
            $data['authContactPhone'] = cleanStr($data['authContactPhone']);
            $data['crematoriumContactPhonePerson'] = cleanStr($data['crematoriumContactPhonePerson']);

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Events 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Events 
                                        WHERE   extraID = '" . $extraID . "'");
                }

            $currentDate = strtotime("today");
            $db->query("INSERT INTO Events(status, user, type, expedient, name,
                                            start, end, reminder, cremation, extraID, dischargeDay)
                        VALUES (" . $data['state'] . ", " . $_SESSION['user'] . ",
                                1, " . $data['expedient'] . ", '" . $data['name'] . "',
                                '" . $data['start'] . "', '" . $data['end'] . "',
                                " . $data['reminder'] . ", 1, '$extraID', '$currentDate')");

            $event = $db->query("   SELECT  ID
                                    FROM    Events
                                    WHERE   extraID = '$extraID'");

            $event = $db->resultToArray($event)[0]['ID'];

            if($data['crematoriumArriveTime'] == ''){
                $crematoriumArriveTime = 'null';
            }else{
                $crematoriumArriveTime = "'" . $data['crematoriumArriveTime'] . "'";
            }
            if($data['cremationServiceLocation'] == ''){
                $cremationServiceLocation = 'null';
            }else{
                $cremationServiceLocation = "'" . $data['cremationServiceLocation'] . "'";
            }

            if($data['authDate'] == ''){
                $data['authDate'] = 'null';
            }

            if($data['authTime'] == ''){
                $data['authTime'] = 'null';
            }

            if($data['crematoriumTechnical'] == ""){
                $data['crematoriumTechnical'] = 'null';
            }
            if($data['authContactPhone'] == ""){
                $data['authContactPhone'] = 'null';
            }
            if($data['crematoriumContactPhonePerson'] == ""){
                $data['crematoriumContactPhonePerson'] = 'null';
            }

            if($data['crematorium'] == ""){
                $data['crematorium'] = 'null';
            }
            if($data['crematoriumPacemaker'] == ""){
                $data['crematoriumPacemaker'] = 0;            
            }
           
            $db->query("UPDATE  Expedients
                        SET     cremation = 1,
                                crematorium = " . $data['crematorium'] . ",
                                crematoriumEvent = " . $event . ",
                                crematoriumClient = " . $data['client'] . ",
                                crematoriumContactPerson = '" . $data['contactPerson'] . "',
                                crematoriumContactPersonPhone = '" . $data['contactPersonPhone'] . "',
                                crematoriumArriveTime = $crematoriumArriveTime,
                                crematoriumIntroduction = '" . $data['introduction'] . "',
                                crematoriumWaitOnRoom = '" . $data['waitOnRoom'] . "',
                                crematoriumVaseBio = " . $data['vaseBio'] . ",
                                familyContactName = '" . $data['familyContactName'] . "',
                                familyContactSurname = '" . $data['familyContactSurname'] . "',
                                familyContactPhone = '" . $data['familyContactPhone'] . "',
                                authDni = '" . $data['authDni'] . "',
                                authName = '" . $data['authName'] . "',
                                cremationServiceLocation = $cremationServiceLocation,
                                ecologicCoffin = " . $data['ecologicCoffin'] . ",
                                authDate = " . $data['authDate'] . ",
                                authTime = " . $data['authTime'] . ",
                                authPlace = '" . $data['authPlace'] . "',
                                crematoriumPacemaker = " . $data['crematoriumPacemaker'] . ",
                                crematoriumTechnical = " . $data['crematoriumTechnical'] . ",
                                authContactPhone = ".$data['authContactPhone'].",
                                crematoriumContactPhonePerson = ".$data['crematoriumContactPhonePerson']."
                        WHERE   expedientID = " . $data['expedient']);

            return true;
        }

        /**
         * Lista las cremaciones
         * 
         * @return array
         */
        public function listCremations(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      e.ID as id, e.name as title, e.start AS start, e.end as end, e.reminder,
                                                es.ID as statusID, es.name as statusName, es.borderColor, es.backgroundColor, 
                                                u.name as userName,
                                                ex.crematoriumClient, ex.deceasedName, ex.deceasedSurname, ex.deceasedNIF, ex.number,
                                                ex.familyContactName, ex.familyContactSurname, ex.familyContactPhone, ex.deceasedGender,
                                                ex.crematoriumArriveTime, ex.crematoriumIntroduction, ex.crematoriumWaitOnRoom,
                                                ex.crematoriumVaseBio, ex.clientType, ex.expedientID, ex.crematoriumContactPerson, 
                                                ex.crematoriumContactPersonPhone, ex.authName, ex.authDni, ex.authDate, ex.authTime, ex.authPlace,
                                                ex.ecologicCoffin, ex.cremationServiceLocation, ex.crematoriumPacemaker, ex.authContactPhone, ex.crematoriumContactPhonePerson,
                                                l.name AS cremationServiceLocationName, l.province AS cremationServiceProvinceName,
                                                fh.funeralHomeID as clientID, fh.nif as clientNif, fh.name as clientName, fh.phones as clientPhones,
                                                st.ID as crematoriumTechnical, st.name as crematoriumTechnicalName, st.surname as crematoriumTechnicalSurname,
                                                ex.crematorium as crematoriumID, cr.name AS crematoriumName
                                    FROM        (Events e, Events_Status es, Users u, Expedients ex)
                                    LEFT JOIN   FuneralHomes fh ON ex.crematoriumClient = fh.funeralHomeID
                                    LEFT JOIN   Locations l ON ex.cremationServiceLocation = l.locationID
                                    LEFT JOIN   Staff st ON ex.crematoriumTechnical = st.ID
                                    LEFT JOIN   Crematoriums cr  ON ex.crematorium = cr.crematoriumID
                                    WHERE       e.status = es.ID AND 
                                                e.user = u.userID AND
                                                e.leavingDate IS NULL AND 
                                                e.type = 1 AND
                                                e.expedient = ex.expedientID AND
                                                ex.leavingDate IS NULL AND
                                                e.start IS NOT NULL AND
                                                e.end IS NOT NULL");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Obtiene el número actual de eventos
         * 
         * @return int
         */
        public function getNumEvents(){
            $db = new DbHandler;

            $date = date('Y-m-d', strtotime(date('Y-m-d') . ' +15 days'));

            $result = $db->query("  SELECT  COUNT(e.ID) as num
                                    FROM    Events e
                                    WHERE   e.leavingDate IS NULL AND
                                            e.status = 1 AND
                                            e.start <= '$date'");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['num'] : null;
        }

        /**
         * Obtiene el número actual de eventos de mantenimiento
         * 
         * @return int
         */
        public function getNumEventsUpkeep(){
            $db = new DbHandler;

            $date = date('Y-m-d', strtotime(date('Y-m-d') . ' +15 days'));

            $result = $db->query("  SELECT  COUNT(e.ID) as num
                                    FROM    Events e
                                    WHERE   e.type = 2 AND
                                            e.leavingDate IS NULL AND 
                                            e.status = 5 AND
                                            e.start <= '$date'");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['num'] : null;
        }

        /**
         * Obtiene el número actual de eventos de mantenimiento
         * 
         * @return int
         */
        public function getNumReminders(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  e.name
                                    FROM    Events e
                                    WHERE   e.leavingDate IS NULL AND 
                                            e.reminder = 1 AND e.status != 6");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Obtiene las notificaciones de la agenda general
         * 
         * @return array
         */
        public function getEventCalendarReminder(){
            $db = new DbHandler;

            $date = date('Y-m-d', strtotime(date('Y-m-d') . ' +15 days'));

            $result = $db->query("  SELECT      e.name, e.start, e.end
                                    FROM        Events e
                                    WHERE       e.status = 1 AND
                                                e.type NOT IN(3,6,7,8,9) AND
                                                e.start <= '$date' AND
                                                e.leavingDate IS NULL
                                    ORDER BY    e.start");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene las notificaciones de la agenda de cremaciones
         * 
         * @return array
         */
        public function getEventCremationReminder(){
            $db = new DbHandler;

            $date = date('Y-m-d', strtotime(date('Y-m-d') . ' +15 days'));

            $result = $db->query("  SELECT      e.name, e.start, e.end, ex.tpv
                                    FROM        Events e, Expedients ex
                                    WHERE       e.type = 1 AND
                                                e.status = 6 AND
                                                e.start <= '$date' AND
                                                e.start IS NOT NULL AND
                                                e.end IS NOT NULL AND
                                                e.leavingDate IS NULL AND
                                                e.expedient = ex.expedientID AND
                                                ex.leavingDate IS NULL AND
                                                ex.cremation = 1 AND
                                                ex.crematorium IS NOT NULL
                                    ORDER BY    e.start");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene las notificaciones de la agenda de mantenimiento
         * 
         * @return array
         */
        public function getEventUpkeepReminder(){
            $db = new DbHandler;

            $date = date('Y-m-d', strtotime("+15 days"));

            $result = $db->query("  SELECT      e.name, e.start, e.end
                                    FROM        Events e, Upkeeps u
                                    WHERE       e.type = 2 AND
                                                e.start <= '$date' AND
                                                e.status = 5 AND
                                                e.leavingDate IS NULL AND
                                                e.upkeeps = u.ID AND
                                                u.leavingDate IS NULL
                                    ORDER BY    e.start");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }

        /**
         * Obtiene las notificaciones de la agenda del taller
         * 
         * @return array
         */
        public function getEventGarageReminder(){
            $db = new DbHandler;

            $date = date('Y-m-d', strtotime("+10 days"));

            $result = $db->query("  SELECT      c.ID, c.licensePlate, e.start, e.type, e.name
                                    FROM        Events e
                                    LEFT JOIN   Upkeeps u ON e.upkeeps = u.ID AND u.leavingDate IS NULL AND u.cost IS NULL AND u.kms IS NULL
                                    LEFT JOIN   Cars c ON c.ID = e.car AND c.leavingDate IS NULL AND c.external = 0
                                    WHERE       e.reminder = 1 AND
                                                e.type IN(3,7,8,9) AND
                                                e.start <= '$date' AND                                               
                                                e.leavingDate IS NULL AND
                                                e.status = 1
                                    ORDER BY    e.start");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);

            return null;
        }

        /**
         * Obtiene las notificaciones de la agenda del taller de las ITV 15 dias antes
         * 
         * @return array
         */
        public function getEventItvReminder(){
            $db = new DbHandler;

            $date=date('Y-m-d', strtotime("+15 days"));

            $result = $db->query("  SELECT      e.name, e.start, e.end
                                    FROM        Events e, Cars c
                                    WHERE       e.reminder = 1 AND
                                                e.type = 6 AND
                                                e.start <= '$date' AND                                    
                                                e.leavingDate IS NULL AND
                                                e.status = 1 AND
                                                e.car = c.ID AND 
                                                c.leavingDate IS NULL AND
                                                c.external = 0
                                    GROUP BY    e.name
                                    ORDER BY    e.start");

            return mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result);
        }
       
        /**
         * Crea un evento para que aparezcan las facturas recibidas en el calendario de pagos
         * 
         * @return array
         */
        public function createReceivedInvoiceEvent($data){
            $db = new DbHandler;
            
            $data['name'] = cleanStr($data['name']);
            $data['start'] = cleanStr($data['start']);
            $data['invoice'] = cleanStr($data['invoice']);

            // Cálculo Fdel extraID
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Received_Invoices_Events 
                                    WHERE   extraID = '" . $extraID . "'");
            
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

                $result = $db->query("  SELECT  * 
                                        FROM    Received_Invoices_Events 
                                        WHERE   extraID = '" . $extraID . "'");
            }

            $result = $db->query("  INSERT INTO Received_Invoices_Events(name, status, start, end, invoice, leavingDate, extraID) 
                                    VALUES( '" . $data['name'] . "', 1, " . $data['start'] . ", " . $data['start'] . ", '" . $data['invoice'] . "', null, '" . $extraID . "')");

            if($result){
                $res = $db->query("  SELECT fe.ID FROM Received_Invoices_Events fe WHERE extraID = '$extraID'");
                if(mysqli_num_rows($res) > 0){
                    return $db->resultToArray($res)[0]['ID'];
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }      

        /**
         * Actualiza un evento para que aparezcan las facturas recibidas en el calendario de pagos
         * 
         * @return array
         */
        public function updateReceivedInvoiceEvent($data){
            $db = new DbHandler;

            $data['name'] = cleanStr($data['name']);
            $data['start'] = cleanStr($data['start']);

            return $db->query(" UPDATE  Received_Invoices_Events 
                                SET     name = '".$data['name']."',
                                        start = " . $data['start'] . ",                                            
                                        end = " . $data['start'] . "                                            
                                WHERE   ID = " . $data['idEvent']);
        }    

        /**
         * Actualiza leavingDate al eliminar una factura
         * 
         * @return array
         */
        public function deleteReceivedInvoiceEvent($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $today = time();
            return $db->query(" UPDATE  Received_Invoices_Events 
                                SET     leavingDate = $today                                                                                            
                                WHERE   ID = $id");
        }

        /**
         * Actualiza leavingDate al eliminar una factura
         * 
         * @return array
         */
        public function deleteReceivedInvoiceEventByInvoice($id){
            $db = new DbHandler;

            $id = cleanStr($id);

            $today = time();
            return $db->query(" UPDATE  Received_Invoices_Events 
                                SET     leavingDate = $today                                                                                            
                                WHERE   invoice = $id");
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
                                    WHERE   eh.expedient = $expedientID AND 
                                            eh.num_hiring = (
                                                SELECT  COALESCE(MAX(i2.num_hiring), 0) 
                                                FROM    Invoices i2 
                                                WHERE   i2.expedient = $expedientID AND
                                                        i2.leavingDate IS NULL AND
                                                        i2.invoice_type != 3
                                            )
            ");

            if(mysqli_num_rows($result) > 0){
                $maxNumHiring = $db->resultToArray($result)[0]['num_hiring'];
                return $maxNumHiring;
            }else{
                return 0;
            }
        }
    }
?>