<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    require_once($_SESSION['basePath'] . "resources/plugins/jwt/JWT.php");
    require_once($_SESSION['basePath'] . "resources/plugins/jwt/SignatureInvalidException.php");
    require_once($_SESSION['basePath'] . "resources/plugins/jwt/BeforeValidException.php");
    require_once($_SESSION['basePath'] . "resources/plugins/jwt/ExpiredException.php");

    use \Firebase\JWT\JWT;
    use \Firebase\JWT\SignatureInvalidException;
    use \Firebase\JWT\BeforeValidException;
    use \Firebase\JWT\ExpiredException;

    class Tellmebye{
        /** @var string $urlApi Url API*/
        private $urlApi;

        /** @var string $clientKey Client key */
        private $clientKey;
        
        /** @var string $secretKey Secret key */
        private $secretKey;
        
        /** @var string $jwt JWT */
        private $jwt;

        /** @var string $jwtAppKey jwtAppKey */
        private $jwtAppKey;

        /** Constructor */
        public function __construct($delegation = null){
            switch($_SESSION['company']){
                case 1:
                    $this->urlApi = 'https://api.tellmebye.com/api/v1/';
                    $this->clientKey = 'wWt&@9%%i3YJY2MEhzwLaZo@ZgYzb*N9MMmq%kcUXVcYdQpXosSk7JNW55@7YRMw';
                    $this->secretKey = 'ZJf#CyeY&dcDvGWibT7zyUqYa7u!QgvttxqZ8otyvQ$QkLBnhmot7sXaTnP%qAUBt!hD!8Qir7GZk%W4bo7CeFVpZWo!rGrWfXS#smsHUoov#4*G9qvNYevn!mk$Y^@T';
                break;
                case 2:
                    $this->urlApi = 'https://api.tellmebye.com/api/v1/';
                    $this->clientKey = '2#E5KJem8F5khkXiVKc$tn3n8PFE$kbjsg7RGsmieR&UX3A#eFi$dEdh$GKHo8aG';
                    $this->secretKey = 'bNYZmpnHepDmE4$mX!8ghV!*$ALGRJj*E#NCVe7j^GeP!CcQNgtvEZ7p7#k!zMVo6@8qz9t2rvU6xuj3z9ZohzsmAMcu#tdx9gWGk%Ntz#9WFra#SWFVg*epgB5bquxA';
                break;
                case 3:
                    $this->urlApi = 'https://sandbox.api.tellmebye.com/api/v1/';
                    $this->clientKey = 'BWTZjhu1Gp9cqRYyJsn84bAa_ENxwmIDfdHoX-gPiQKeOvrS7LMtUC3k6l2zV05F';
                    $this->secretKey = 'U3OwTBjeEydcu1hLsR2_KiWk7YI4XAa8QHZbCtgFGxq5moPz6rfD-JnVNMpvl9S0DfhleBvxubXnpwikoJPE12YK7S3NHOa9tTQI08ZscL56CMmGqyVUAr4gdFRz_-Wj';
                break;
                // case 8:
                //     $this->urlApi = 'https://sandbox.api.tellmebye.com/api/v1/';
                //     $this->clientKey = 'BWTZjhu1Gp9cqRYyJsn84bAa_ENxwmIDfdHoX-gPiQKeOvrS7LMtUC3k6l2zV05F';
                //     $this->secretKey = 'U3OwTBjeEydcu1hLsR2_KiWk7YI4XAa8QHZbCtgFGxq5moPz6rfD-JnVNMpvl9S0DfhleBvxubXnpwikoJPE12YK7S3NHOa9tTQI08ZscL56CMmGqyVUAr4gdFRz_-Wj';
                // break;
                case 8:
                    $this->urlApi = 'https://api.tellmebye.com/api/v1/';
                    $this->clientKey = 'YeyHd6LowMTvKtH^eqCHMDLRg8EFp#Mykqbg67AXnv2iLkke#Ex!6ngByFXeT@o3';
                    $this->secretKey = 'j&&8W*Dk7DHN&zy$y5skm46buJc8v$i&xjVreanhrWa*y4gDYpdbRnu!dNsqeqHMf5fzAA7TqnXEXhvLvJ@Bis7$Jz4d&@&Q#jJeaeZ4D@CYiHE*acS!pcbiLF%iAAvX';
                break;
                default:
                    $this->urlApi = '';
                    $this->clientKey = '';
                    $this->secretKey = '';
                break;
            }

            $currentTime = (new DateTime());
            $iat = (clone $currentTime)->add(new \DateInterval("PT10H"))->getTimestamp();
            $exp = (clone $currentTime)->getTimestamp();

            $payload = array(
                'exp' => $iat,
                'iat' => $exp,
                'iss' => 'https://sandbox.api.tellmebye.com/',
                'key' => $this->clientKey
            );
            if($delegation != null){
                $payload['data'] = array(
                    'delegation' => $delegation
                );
            }else{
                $payload['data'] = array(
                    'delegation' => null
                );
            }
            $this->jwt = JWT::encode($payload, $this->secretKey, 'HS256');

            $this->jwtAppKey = 'ORIKEY__EWFwF81ipaYTvD0YtNyd4KFtknJw11IYupTho64A';
        }

        /**
         * Gets tellmebye info for datasheet from expedient
         *
         * @param array $info Infoinfo
         * @return array
         */
        public function getDataSheetInfoFromExpedient($info){
            $db = new DbHandler;

            $expedient = cleanStr($info['ID']);

            $result = $db->query("  SELECT      e.number, e.deceasedGender, e.deceasedName, e.deceasedSurname, e.deceasedBirthday,
                                                e.deceasedDate, e.deceasedTime, e.familyContactName, e.familyContactSurname, e.familyContactNIF,
                                                e.familyContactRelationship, e.familyContactPhone, e.familyContactMobilePhone, e.familyContactMail,
                                                e.familyContactAddress, e.deceasedMortuary, e.funeralDate, e.funeralTime, e.funeralDateBurial,
                                                e.funeralTimeBurial, e.ceremonyDate, e.ceremonyTime, e.funeralDateNew, e.funeralTimeNew,
                                                e.deceasedMortuaryAddress as deceasedMortuaryAddressOther, e.otherInhumation,
                                                e.startVelacionDate, e.startVelacionTime, e.funeralHomeEntryDate, e.funeralHomeEntryTime,
                                                e.tellmebyeRoom, e.tellmebyeRoomName,
                                                CONCAT(st.name, ' ', st.surname) as familyAssistance,
                                                eo.extraText,
                                                m.name as deceasedMortuaryName, m.address as deceasedMortuaryAddress,
                                                m.tellmebye as tellmebyeMortuary, m.tellmebyeName as tellmebyeMortuaryName,
                                                l.name as deceasedMortuaryLocation,
                                                ch.name as churchName,
                                                ch.address as churchAddress,
                                                l2.name as churchLocation,
                                                cr.name as crematoriumName,
                                                cr.address as crematoriumAddress,
                                                l3.name as crematoriumLocation,
                                                ev.start as crematoriumStart,
                                                ev.end as crematoriumEnd,
                                                ce.name as cemeteryName,
                                                ce.address as cemeteryAddress,
                                                l4.name as cemeteryLocationName
                                    FROM        (Expedients e, Expedients_Services es)
                                    LEFT JOIN   Expedients_Obituaries eo ON e.expedientID = eo.expedient AND eo.selected = 1
                                    LEFT JOIN   Mortuaries m ON e.deceasedMortuary = m.mortuaryID
                                    LEFT JOIN   Locations l ON m.location = l.locationID
                                    LEFT JOIN   Churches ch ON e.church = ch.churchID
                                    LEFT JOIN   Locations l2 ON ch.location = l2.locationID
                                    LEFT JOIN   Crematoriums cr ON e.crematorium = cr.crematoriumID
                                    LEFT JOIN   Locations l3 ON cr.location = l3.locationID
                                    LEFT JOIN   Events ev ON e.crematoriumEvent = ev.ID AND ev.leavingDate IS NULL
                                    LEFT JOIN   Cemeteries ce ON e.cemetery = ce.cemeteryID
                                    LEFT JOIN   Staff st ON es.familyAssistance = st.ID
                                    LEFT JOIN   Locations l4 ON ce.location = l4.locationID
                                    WHERE       e.expedientID = $expedient AND
                                                e.expedientID = es.expedient");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                return $db->resultToArray($result)[0];
            }
        }

        /**
         * Gets tellmebye info for datasheet from tell me bye data
         *
         * @param array $info Infoinfo
         * @return array
         */
        public function getDataSheetInfoFromTellMeByeData($info){
            $db = new DbHandler;

            $expedient = cleanStr($info['ID']);

            $info = array();

            // General info
            $result = $db->query("  SELECT      e.number, e.deceasedName as deceasedNameExpedient, e.deceasedSurname as deceasedSurnameExpedient,
                                                e.tellmebyeRoom as expedientTellmebyeRoom,
                                                CONCAT(st.name, ' ', st.surname) as familyAssistance,
                                                et.id, et.idTellmebye, et.showTvInfo, et.showServiceRoom, et.createWallReminder,
                                                et.supervised, et.private, et.tellmebyeMortuary, et.tellmebyeRoom, et.tellmebyeRoomName,
                                                et.tellmebyeWallUrl, et.deceasedGender, et.deceasedTitle, et.deceasedName, et.deceasedSurname,
                                                et.deceasedAlias, et.deceasedBirthdate, et.deceasedDeceasedDate, et.deceasedPicture, et.wallPassword,
                                                m.tellmebye as mortuaryTellmebyeMortuary
                                    FROM        (Expedients_Tellmebye et, Expedients e, Expedients_Services es)
                                    LEFT JOIN   Staff st ON es.familyAssistance = st.ID
                                    LEFT JOIN   Mortuaries m ON e.deceasedMortuary = m.mortuaryID
                                    WHERE       et.deleteDate IS NULL AND
                                                et.expedient = e.expedientID AND
                                                e.expedientID = es.expedient AND
                                                e.expedientID = " . $expedient);

            if(mysqli_num_rows($result) == 0){
				$info['general'] = null;
			}else{
                $info['general'] = $db->resultToArray($result)[0];

                try{
                    JWT::$leeway = 60;
                    $info['general']['wallPassword'] = JWT::decode($info['general']['wallPassword'], $this->jwtAppKey, array('HS256'))->password;
                }catch(Exception $e){
                    $info['general']['wallPassword'] = null;
                }
            }

            // Hiring info
            $result = $db->query("  SELECT  eth.id, eth.idTellmebye, eth.name, eth.surname, eth.nif, eth.relationship, eth.phone, eth.mobilePhone,
                                            eth.email, eth.address
                                    FROM    Expedients_Tellmebye_Hiring eth
                                    WHERE   eth.deleteDate IS NULL AND
                                            eth.expedient = " . $expedient);

            if(mysqli_num_rows($result) == 0){
				$info['hiring'] = array();
			}else{
                $info['hiring'] = $db->resultToArray($result);
            }

            // Events info
            $result = $db->query("  SELECT  ete.id, ete.idTellmebye, ete.type, ete.name, ete.place, ete.room, ete.roomName, ete.address, ete.city,
                                            ete.camera, ete.cameraName, ete.startDate, ete.endDate
                                    FROM    Expedients_Tellmebye_Events ete
                                    WHERE   ete.deleteDate IS NULL AND
                                            ete.expedient = " . $expedient);

            if(mysqli_num_rows($result) == 0){
				$info['events'] = array();
			}else{
                $info['events'] = $db->resultToArray($result);
            }

            // Deceased image
            $info['deceasedImage'] = null;

            $imagesDir = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/tellmebye/img";
            if(is_dir($imagesDir)){
                foreach(scandir($imagesDir) as $index => $elem){
                    if($elem != '.' && $elem != '..' && $elem != '.htaccess'){
                        $info['deceasedImage'] = "resources/files/{$_SESSION['company']}/expedients/$expedient/tellmebye/img/$elem";
                    }
                }
            }

            return $info;
        }

        /**
         * Saves data sheet
         *
         * @param array $info Infoinfo
         * @return array
         */
        public function saveDataSheet($info){
            $db = new DbHandler;

            $checkBusy = cleanStr($info['checkBusy']);
            $expedient = cleanStr($info['expedient']);
            $showTvInfo = cleanStr($info['showTvInfo']);
            $showServiceRoom = cleanStr($info['showServiceRoom']);
            $createWallReminder = cleanStr($info['createWallReminder']);
            $supervised = cleanStr($info['supervised']);
            $private = cleanStr($info['private']);
            $wallPassword = cleanStr($info['wallPassword']);
            $tellmebyeMortuary = cleanStr($info['tellmebyeMortuary']);
            $tellmebyeRoom = cleanStr($info['tellmebyeRoom']);
            $tellmebyeRoomName = cleanStr($info['tellmebyeRoomName']);
            $deceasedGender = cleanStr($info['deceasedGender']);
            $deceasedTitle = cleanStr($info['deceasedTitle']);
            $deceasedName = cleanStr($info['deceasedName']);
            $deceasedSurname = cleanStr($info['deceasedSurname']);
            $deceasedAlias = cleanStr($info['deceasedAlias']);
            $deceasedBirthdate = cleanStr($info['deceasedBirthdate']);
            $deceasedDeceasedDate = cleanStr($info['deceasedDeceasedDate']);
            $deceasedPicture = cleanStr($info['deceasedPicture']);
            $time = time();

            foreach($info['hiringData'] as $index => $elem){
                foreach($elem as $i => $item){
                    $info['hiringData'][$index][$i] = cleanStr($item);
                }
            }
            foreach($info['eventsData'] as $index => $elem){
                foreach($elem as $i => $item){
                    $info['eventsData'][$index][$i] = cleanStr($item);
                }
            }

            // General data
            $result = $db->query("  SELECT  et.id
                                    FROM    Expedients_Tellmebye et
                                    WHERE   et.deleteDate IS NULL AND
                                            et.expedient = $expedient
            ");

            $id = null;
            if(mysqli_num_rows($result) > 0){
                $id = $db->resultToArray($result)[0]['id'];
            }

            if($id == null){ // Update from expedient data
                // Check busy room and camera events
                if($checkBusy == '1'){
                    $busy = array();
                    foreach($info['eventsData'] as $index => $elem){
                        if($elem['status'] == 'keep' && $elem['room'] != ''){
                            // Find events with overlaped dates
                            $cameraWhere = '';
                            if($elem['camera'] != ''){
                                $cameraWhere = "OR ete.camera = {$elem['camera']}";
                            }

                            $result = $db->query("  SELECT  e.number,
                                                            et.deceasedTitle, et.deceasedName, et.deceasedSurname,
                                                            ete.type, ete.name, ete.startDate, ete.endDate
                                                    FROM    Expedients_Tellmebye_Events ete, Expedients_Tellmebye et, Expedients e
                                                    WHERE   ete.expedient = et.expedient AND
                                                            ete.deleteDate IS NULL AND
                                                            et.deleteDate IS NULL AND
                                                            (
                                                                ete.startDate BETWEEN {$elem['startDate']} AND {$elem['endDate']} OR
                                                                ete.endDate BETWEEN {$elem['startDate']} AND {$elem['endDate']}
                                                            ) AND
                                                            (
                                                                ete.room = {$elem['room']}
                                                                $cameraWhere
                                                            ) AND
                                                            ete.expedient = e.expedientID AND
                                                            ete.activeRoom = 1 AND
                                                            ete.type = 'velation'
                            ");
        
                            if(mysqli_num_rows($result) > 0){
                                $elem['index'] = $index;
    
                                array_push(
                                    $busy,
                                    array(
                                        'event' => $elem,
                                        'overlaped' => $db->resultToArray($result)
                                    )
                                );
                            }
                        }
                    }
    
                    if(!empty($busy)){
                        return [true, $busy];
                    }
                }

                // General data
                $payload = array(
                    'password' => $wallPassword,
                );
                $wallPasswordCrypted = JWT::encode($payload, $this->jwtAppKey, 'HS256');

                $created = $db->query(" INSERT INTO Expedients_Tellmebye(
                                            expedient, idTellmebye, showTvInfo, showServiceRoom, createWallReminder, supervised, private,
                                            tellmebyeMortuary, tellmebyeRoom, tellmebyeRoomName, tellmebyeWallUrl, deceasedGender, deceasedTitle,
                                            deceasedName, deceasedSurname, deceasedAlias, deceasedBirthdate, deceasedDeceasedDate, deceasedPicture,
                                            wallPassword, createDate
                                        )
                                        VALUES(
                                            $expedient, '', $showTvInfo, $showServiceRoom, $createWallReminder, $supervised, $private,
                                            $tellmebyeMortuary, '$tellmebyeRoom', '$tellmebyeRoomName', '', '$deceasedGender', '$deceasedTitle',
                                            '$deceasedName', '$deceasedSurname', '$deceasedAlias', $deceasedBirthdate, $deceasedDeceasedDate,
                                            $deceasedPicture, '$wallPasswordCrypted', $time
                                        )
                ");

                if(!$created){
                    return [false];
                }

                $memorialWall = array(
                    'id' => null,
                    'idApp' => $db->getLastInsertId(),
                    'idTellmebye' => '',
                    'delegation' => $tellmebyeMortuary,
                    'firstname' => $deceasedName,
                    'lastname' => $deceasedSurname,
                    'gender' => $deceasedGender == 'Hombre' ? 'Male' : 'Female',
                    'title' => $deceasedTitle,
                    'visibleWall' => $showTvInfo == '0' ? false : true,
                    'visibleDevice' => $showServiceRoom == '0' ? false : true,
                    'memorialWall' => $createWallReminder == '0' ? false : true,
                    'supervision' => $supervised == '0' ? false : true,
                    'public' => $private == '0' ? true : false,
                    'birthDate' => date('Y-m-d', $deceasedBirthdate),
                    'deathDate' => date('Y-m-d', $deceasedDeceasedDate) . ' 00:00:00',
                    'slug' => '',
                    'alias' => $deceasedAlias,
                    'dni' => '',
                    'create' => true,
                    'room' => null,
                    'legados' => false,
                    'code' => $wallPassword
                );

                // Hiring data
                $contacts = array();
                foreach($info['hiringData'] as $elem){
                    if($elem['status'] == 'keep'){
                        $db->query("INSERT INTO Expedients_Tellmebye_Hiring(
                                        expedient, name, surname, nif, relationship, phone, mobilePhone, email, address, createDate
                                    )
                                    VALUES(
                                        $expedient, '{$elem['name']}', '{$elem['surname']}', '{$elem['nif']}', '{$elem['relationship']}',
                                        '{$elem['phone']}', '{$elem['mobilePhone']}', '{$elem['email']}', '{$elem['address']}', $time
                                    )
                        ");

                        array_push(
                            $contacts,
                            array(
                                'id' => null,
                                'idApp' => $db->getLastInsertId(),
                                'idTellmebye' => '',
                                'name' => $elem['name'] . ' ' . $elem['surname'],
                                'email' => $elem['email'],
                                'address' => $elem['address'],
                                'phone' => $elem['phone'],
                                'mobile' => $elem['mobilePhone'],
                                'relationship' => $elem['relationship'],
                                'dni' => $elem['nif']
                            )
                        );
                    }
                }

                // Events data
                $events = array();
                foreach($info['eventsData'] as $elem){
                    if($elem['status'] == 'keep'){
                        $name = isset($elem['name']) ? $elem['name'] : '';
                        $room = $elem['room'] == '' ? 'null' : $elem['room'];
                        $camera = $elem['camera'] == '' ? 'null' : $elem['camera'];
                        $endDate = $elem['endDate'] == '' ? 'null' : $elem['endDate'];

                        $activeRoom = 0;
                        if($elem['freeRoom'] == 'true'){
                            // Set active to 0 from other expedients with this room
                            $db->query("UPDATE  Expedients_Tellmebye_Events
                                        SET     activeRoom = 0,
                                                updateDate = $time
                                        WHERE   deleteDate IS NULL AND
                                                room = $room AND
                                                activeRoom = 1 AND
                                                expedient != $expedient AND
                                                type = 'velation'
                            ");

                            $activeRoom = 1;
                        }

                        $db->query("INSERT INTO Expedients_Tellmebye_Events(
                                        expedient, type, name, place, room, roomName, address, city, camera, cameraName,
                                        startDate, endDate, activeRoom, createDate
                                    )
                                    VALUES(
                                        $expedient, '{$elem['type']}', '$name', '{$elem['place']}', $room, '{$elem['roomName']}',
                                        '{$elem['address']}', '{$elem['city']}', $camera, '{$elem['cameraName']}', {$elem['startDate']},
                                        $endDate, $activeRoom, $time
                                    )
                        ");

                        $title = '';
                        $icon = '';
                        if(isset($elem['name'])){
                            $title = $elem['name'];
                            $icon = 'fas fa-info-circle';
                        }else{
                            switch($elem['type']){
                                case 'velation':
                                    $title = 'Velación';
                                    $icon = 'fas fa-users';
                                break;
                                case 'ceremony':
                                    $title = 'Ceremonia';
                                    $icon = 'fas fa-microphone';
                                break;
                                case 'funeral':
                                    $title = 'Funeral';
                                    $icon = 'fas fa-info-circle';
                                break;
                                case 'cremation':
                                    $title = 'Cremación';
                                    $icon = 'fas fa-burn';
                                break;
                                case 'burial':
                                    $title = 'Inhumación';
                                    $icon = 'fas fa-cross';
                                break;
                            }
                        }

                        array_push(
                            $events,
                            array(
                                'id' => null,
                                'idApp' => $db->getLastInsertId(),
                                'idTellmebye' => '',
                                'title' => $title,
                                'address' => $elem['address'] == '' || $elem['address'] == null ? '-' : $elem['address'],
                                'city' => $elem['city'] == '' || $elem['city'] == null ? '-' : $elem['city'],
                                'location' => $elem['place'],
                                'dateStart' => date('Y-m-d H:i:s', $elem['startDate']),
                                'dateEnd' => $elem['endDate'] == '' ? "" : date('Y-m-d H:i:s', $elem['endDate']),
                                'icon' => $icon,
                                'camera' => $elem['camera'] == '' ? null : $elem['camera'],
                                'room' => $elem['room'] == '' ? null : $elem['room'],
                                'freeRoom' => $elem['freeRoom'] == 'true' ? true : false,
                                'freeCamera' => $elem['freeCamera'] == 'true' ? true : false
                            )
                        );
                    }
                }

                $created = $this->saveDataSheetTellmebye($memorialWall, $events, $contacts);
                if(!$created[0]){
                    // Remove created on expedients tellmebye
                    $time = time();

                    $db->query("UPDATE  Expedients_Tellmebye
                                SET     deleteDate = $time
                                WHERE   expedient = $expedient AND
                                        deleteDate IS NULL");

                    $db->query("UPDATE  Expedients_Tellmebye_Hiring
                                SET     deleteDate = $time
                                WHERE   expedient = $expedient AND
                                        deleteDate IS NULL");

                    $db->query("UPDATE  Expedients_Tellmebye_Events
                                SET     deleteDate = $time
                                WHERE   expedient = $expedient AND
                                        deleteDate IS NULL");

                    return [false];
                }

                $memorialWall = $created[1];

                // Update on expedients tellmebye
                $db->query("UPDATE  Expedients_Tellmebye
                            SET     idTellmebye = {$memorialWall['idTellmebye']},
                                    tellmebyeWallUrl = '{$memorialWall['slug']}'
                            WHERE   id = {$memorialWall['idApp']}
                ");

                foreach($memorialWall['contacts'] as $elem){
                    $db->query("UPDATE  Expedients_Tellmebye_Hiring
                                SET     idTellmebye = {$elem['idTellmebye']}
                                WHERE   id = {$elem['idApp']}");
                }
                
                foreach($memorialWall['events'] as $elem){
                    $db->query("UPDATE  Expedients_Tellmebye_Events
                                SET     idTellmebye = {$elem['idTellmebye']}
                                WHERE   id = {$elem['idApp']}");
                }
            }else{ // Update from Tellmebye data
                // Check busy room and camera events
                if($checkBusy == '1'){
                    $busy = array();
                    foreach($info['eventsData'] as $index => $elem){
                        if($elem['status'] == 'keep' && $elem['room'] != ''){
                            // Find events with overlaped dates
                            $cameraWhere = '';
                            if($elem['camera'] != ''){
                                $cameraWhere = "OR ete.camera = {$elem['camera']}";
                            }
    
                            $result = $db->query("  SELECT  e.number,
                                                            et.deceasedTitle, et.deceasedName, et.deceasedSurname,
                                                            ete.type, ete.name, ete.startDate, ete.endDate
                                                    FROM    Expedients_Tellmebye_Events ete, Expedients_Tellmebye et, Expedients e
                                                    WHERE   ete.expedient = et.expedient AND
                                                            ete.deleteDate IS NULL AND
                                                            et.deleteDate IS NULL AND
                                                            (
                                                                ete.startDate BETWEEN {$elem['startDate']} AND {$elem['endDate']} OR
                                                                ete.endDate BETWEEN {$elem['startDate']} AND {$elem['endDate']}
                                                            ) AND
                                                            (
                                                                ete.room = {$elem['room']}
                                                                $cameraWhere
                                                            ) AND
                                                            ete.expedient = e.expedientID AND
                                                            ete.expedient != $expedient AND
                                                            ete.activeRoom = 1 AND
                                                            ete.type = 'velation'
                            ");
        
                            if(mysqli_num_rows($result) > 0){
                                $elem['index'] = $index;
    
                                array_push(
                                    $busy,
                                    array(
                                        'event' => $elem,
                                        'overlaped' => $db->resultToArray($result)
                                    )
                                );
                            }
                        }
                    }

                    if(!empty($busy)){
                        return [true, $busy];
                    }
                }

                // General data
                $payload = array(
                    'password' => $wallPassword,
                );
                $wallPasswordCrypted = JWT::encode($payload, $this->jwtAppKey, 'HS256');

                $updated = $db->query(" UPDATE  Expedients_Tellmebye
                                        SET     showTvInfo = $showTvInfo,
                                                showServiceRoom = $showServiceRoom,
                                                createWallReminder = $createWallReminder,
                                                supervised = $supervised,
                                                private = $private,
                                                tellmebyeMortuary = $tellmebyeMortuary,
                                                tellmebyeRoom = '$tellmebyeRoom',
                                                tellmebyeRoomName = '$tellmebyeRoomName',
                                                deceasedGender = '$deceasedGender',
                                                deceasedTitle = '$deceasedTitle',
                                                deceasedName = '$deceasedName',
                                                deceasedSurname = '$deceasedSurname',
                                                deceasedAlias = '$deceasedAlias',
                                                deceasedBirthdate = $deceasedBirthdate,
                                                deceasedDeceasedDate = $deceasedDeceasedDate,
                                                deceasedPicture = $deceasedPicture,
                                                wallPassword = '$wallPasswordCrypted',
                                                updateDate = $time
                                        WHERE   expedient = $expedient AND
                                                deleteDate IS NULL
                ");

                if(!$updated){
                    return [false];
                }

                // Hiring data
                foreach($info['hiringData'] as $elem){
                    switch($elem['status']){
                        case 'keep':
                            if($elem['id'] != ''){
                                $db->query("UPDATE  Expedients_Tellmebye_Hiring
                                            SET     name = '{$elem['name']}',
                                                    surname = '{$elem['surname']}',
                                                    nif = '{$elem['nif']}',
                                                    relationship = '{$elem['relationship']}',
                                                    phone = '{$elem['phone']}',
                                                    mobilePhone = '{$elem['mobilePhone']}',
                                                    email = '{$elem['email']}',
                                                    address = '{$elem['address']}',
                                                    updateDate = $time
                                            WHERE   id = {$elem['id']}");
                            }else{
                                $db->query("INSERT INTO Expedients_Tellmebye_Hiring(
                                                expedient, name, surname, nif, relationship, phone, mobilePhone, email, address, createDate
                                            )
                                            VALUES(
                                                $expedient, '{$elem['name']}', '{$elem['surname']}', '{$elem['nif']}', '{$elem['relationship']}',
                                                '{$elem['phone']}', '{$elem['mobilePhone']}', '{$elem['email']}', '{$elem['address']}', $time
                                            )
                                ");
                            }
                        break;
                        case 'delete':
                            if($elem['id'] != ''){
                                $db->query("UPDATE  Expedients_Tellmebye_Hiring
                                            SET     deleteDate = $time
                                            WHERE   id = {$elem['id']}");
                            }
                        break;
                    }
                }

                // Events data
                $activeRoom = 0;
                foreach($info['eventsData'] as $elem){
                    $name = isset($elem['name']) ? $elem['name'] : '';
                    $room = $elem['room'] == '' ? 'null' : $elem['room'];
                    $camera = $elem['camera'] == '' ? 'null' : $elem['camera'];
                    $endDate = $elem['endDate'] == '' ? 'null' : $elem['endDate'];

                    if(isset($elem['freeRoom']) && $elem['freeRoom'] == 'true' && $elem['type'] == 'velation'){
                        // Set active to 0 from other expedients with this room
                        $db->query("UPDATE  Expedients_Tellmebye_Events
                                    SET     activeRoom = 0,
                                            updateDate = $time
                                    WHERE   deleteDate IS NULL AND
                                            room = $room AND
                                            activeRoom = 1 AND
                                            expedient != $expedient AND
                                            type = 'velation'
                        ");

                        $activeRoom = 1;
                    }
                    
                    switch($elem['status']){
                        case 'keep':
                            if($elem['id'] != ''){
                                $db->query("UPDATE  Expedients_Tellmebye_Events
                                            SET     name = '$name',
                                                    place = '{$elem['place']}',
                                                    room = $room,
                                                    address = '{$elem['address']}',
                                                    city = '{$elem['city']}',
                                                    camera = $camera,
                                                    startDate = {$elem['startDate']},
                                                    endDate = $endDate,
                                                    updateDate = $time
                                            WHERE   id = {$elem['id']}");
                            }else{
                                $db->query("INSERT INTO Expedients_Tellmebye_Events(
                                                expedient, type, name, place, room, address, city, camera, startDate, endDate, activeRoom, createDate
                                            )
                                            VALUES(
                                                $expedient, '{$elem['type']}', '$name', '{$elem['place']}', $room, '{$elem['address']}',
                                                '{$elem['city']}', $camera, {$elem['startDate']}, $endDate, $activeRoom, $time
                                            )
                                ");
                            }
                        break;
                        case 'delete':
                            if($elem['id'] != ''){
                                $db->query("UPDATE  Expedients_Tellmebye_Events
                                            SET     deleteDate = $time
                                            WHERE   id = {$elem['id']}");
                            }
                        break;
                    }
                }

                $stored = $this->getDataSheetInfoFromTellMeByeData(array('ID' => $expedient));

                $memorialWall = array(
                    'id' => $stored['general']['idTellmebye'],
                    'delegation' => $stored['general']['tellmebyeMortuary'],
                    'firstname' => $stored['general']['deceasedName'],
                    'lastname' => $stored['general']['deceasedSurname'],
                    'gender' => $stored['general']['deceasedGender'] == 'Hombre' ? 'Male' : 'Female',
                    'title' => $stored['general']['deceasedTitle'],
                    'visibleWall' => $stored['general']['showTvInfo'] == '0' ? false : true,
                    'visibleDevice' => $stored['general']['showServiceRoom'] == '0' ? false : true,
                    'memorialWall' => $stored['general']['createWallReminder'] == '0' ? false : true,
                    'public' => $stored['general']['private'] == '0' ? true : false,
                    'supervision' => $stored['general']['supervised'] == '0' ? false : true,
                    'birthDate' => date('Y-m-d', $stored['general']['deceasedBirthdate']),
                    'deathDate' => date('Y-m-d', $stored['general']['deceasedDeceasedDate']) . ' 00:00:00',
                    'slug' => '',
                    'alias' => $stored['general']['deceasedAlias'],
                    'dni' => '',
                    'create' => true,
                    'room' => null,
                    'legados' => false,
                    'code' => $wallPassword
                );
                
                $memorialWall['contacts'] = array();
                foreach($stored['hiring'] as $elem){
                    array_push(
                        $memorialWall['contacts'],
                        array(
                            'id' => $elem['idTellmebye'],
                            'name' => $elem['name'] . ' ' . $elem['surname'],
                            'email' => $elem['email'],
                            'address' => $elem['address'],
                            'phone' => $elem['phone'],
                            'mobile' => $elem['mobilePhone'],
                            'relationship' => $elem['relationship'],
                            'dni' => $elem['nif'],
                            'idApp' => $elem['id']
                        )
                    );
                }

                $memorialWall['events'] = array();
                foreach($stored['events'] as $elem){
                    $title = '';
                    $icon = '';
                    if($elem['name'] != ''){
                        $title = $elem['name'];
                        $icon = 'fas fa-info-circle';
                    }else{
                        switch($elem['type']){
                            case 'velation':
                                $title = 'Velación';
                                $icon = 'fas fa-users';
                            break;
                            case 'ceremony':
                                $title = 'Ceremonia';
                                $icon = 'fas fa-microphone';
                            break;
                            case 'funeral':
                                $title = 'Funeral';
                                $icon = 'fas fa-info-circle';
                            break;
                            case 'cremation':
                                $title = 'Cremación';
                                $icon = 'fas fa-burn';
                            break;
                            case 'burial':
                                $title = 'Inhumación';
                                $icon = 'fas fa-cross';
                            break;
                        }
                    }

                    $freeRoom = $activeRoom == 1 && $elem['type'] == 'velation' ? true : false;
                    $freeCamera = $activeRoom == 1 && $elem['type'] == 'velation' ? true : false;
                    
                    array_push(
                        $memorialWall['events'],
                        array(
                            'id' => $elem['idTellmebye'],
                            'title' => $title,
                            'address' => $elem['address'] == '' || $elem['address'] == null ? '-' : $elem['address'],
                            'city' => $elem['city'] == '' || $elem['city'] == null ? '-' : $elem['city'],
                            'location' => $elem['place'],
                            'dateStart' => date('Y-m-d H:i:s', $elem['startDate']),
                            'dateEnd' => $elem['endDate'] == null ? "" : date('Y-m-d H:i:s', $elem['endDate']),
                            'icon' => $icon,
                            'camera' => $elem['camera'],
                            'room' => $elem['room'],
                            'freeRoom' => $freeRoom,
                            'freeCamera' => $freeCamera,
                            'idApp' => $elem['id']
                        )
                    );
                }

                $updated = $this->updateDataSheetTellmebye($memorialWall);
                if(!$updated){
                    return [false];
                }

                $memorialWall = $updated[1];

                // Update on expedients tellmebye
                $db->query("UPDATE  Expedients_Tellmebye
                            SET     tellmebyeWallUrl = '{$memorialWall['slug']}'
                            WHERE   id = {$memorialWall['idTellmebye']}
                ");

                foreach($memorialWall['contacts'] as $elem){
                    $db->query("UPDATE  Expedients_Tellmebye_Hiring
                                SET     idTellmebye = {$elem['idTellmebye']}
                                WHERE   id = {$elem['idApp']}");
                }
                
                foreach($memorialWall['events'] as $elem){
                    $db->query("UPDATE  Expedients_Tellmebye_Events
                                SET     idTellmebye = {$elem['idTellmebye']}
                                WHERE   id = {$elem['idApp']}");
                }

                // Picture
                if($deceasedPicture == '0'){
                    // Remove image
                    $imagesDir = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/tellmebye/img";
                    if(is_dir($imagesDir)){
                        foreach(scandir($imagesDir) as $index => $elem){
                            if($elem != '.' && $elem != '..' && $elem != '.htaccess'){
                                unlink($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/tellmebye/img/$elem");
                            }
                        }
                    }

                    // Remove from Tellmebye
                    $this->deleteImage($stored['general']['idTellmebye']);
                }
            }

            return [true, []];
        }

        /**
         * Saves data sheet on tellmebye
         * 
         * @param array $memorialWall Memorial wall info
         * @param array $events Events
         * @param array $contacts Contacts
         * @return boolean
         */
        function saveDataSheetTellmebye($memorialWall, $events, $contacts){
            $memorialWall['events'] = $events;
            $memorialWall['contacts'] = $contacts;

            // var_dump('-- CREATE --');
            // var_dump($this->jwt);
            // var_dump(json_encode($memorialWall));
            
            $curl = curl_init();
            
            curl_setopt_array($curl, array(
                CURLOPT_URL => $this->urlApi . 'memorialwall',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => json_encode($memorialWall),
                CURLOPT_HTTPHEADER => array(
                    "Accept: application/json",
                    "Content-Type: application/x-www-form-urlencoded",
                    "Authorization: Bearer $this->jwt"
                )
            ));

            $response = curl_exec($curl);
            // var_dump($response);
            $error = curl_error($curl);

            curl_close($curl);

            if($error != ''){
                return array(false, null);
            }

            $response = json_decode($response);
            // var_dump($response);
            if(!isset($response->message) || $response->message != 'Successfully added'){
                return array(false, null);
            }

            $memorialWall['idTellmebye'] = $response->item->id;
            $memorialWall['slug'] = $response->item->slug;
            foreach($memorialWall['events'] as $index => $elem){
                $memorialWall['events'][$index]['idTellmebye'] = $response->item->events[$index]->id;
            }
            foreach($memorialWall['contacts'] as $index => $elem){
                $memorialWall['contacts'][$index]['idTellmebye'] = $response->item->contacts[$index]->id;
            }

            return array(true, $memorialWall);
        }

        /**
         * Saves data sheet on tellmebye
         * 
         * @param array $memorialWall Memorial wall info
         * @param array $events Events
         * @param array $contacts Contacts
         * @return boolean
         */
        function updateDataSheetTellmebye($memorialWall){
            $curl = curl_init();

            // var_dump('-- UPDATE --');
            // var_dump($this->jwt);
            // var_dump(json_encode($memorialWall));
           
            curl_setopt_array($curl, array(
                CURLOPT_URL => $this->urlApi . "memorialwall/{$memorialWall['id']}",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => "PUT",
                CURLOPT_POSTFIELDS => json_encode($memorialWall),
                CURLOPT_HTTPHEADER => array(
                    "Accept: application/json",
                    "Content-Type: application/x-www-form-urlencoded",
                    "Authorization: Bearer $this->jwt"
                )
            ));

            $response = curl_exec($curl);
            // var_dump($response);
            $error = curl_error($curl);

            curl_close($curl);

            if($error != ''){
                return array(false, null);
            }

            $response = json_decode($response);
            // var_dump($response);
            if(!isset($response->message) || ($response->message != 'Successfully added' && $response->message != 'Successfully updated')){
                return array(false, null);
            }

            $memorialWall['idTellmebye'] = $response->item->id;
            $memorialWall['slug'] = $response->item->slug;
            foreach($memorialWall['events'] as $index => $elem){
                $memorialWall['events'][$index]['idTellmebye'] = $response->item->events[$index]->id;
            }

            foreach($memorialWall['contacts'] as $index => $elem){
                $memorialWall['contacts'][$index]['idTellmebye'] = $response->item->contacts[$index]->id;
            }

            return array(true, $memorialWall);
        }

        /**
         * Reloads data sheet
         *
         * @param array $info Infoinfo
         * @return array
         */
        public function reloadDataSheet($info){
            $expedient = cleanStr($info['expedient']);

            $expedientInfo = $this->getDataSheetInfoFromExpedient(array('ID' => $expedient));

            return $expedientInfo;
        }

        /**
         * Updates image on tellmebye
         * 
         * @param string $file_get_contents Tellmebye id
         * @param string $imageSrc Image src
         * @return boolean
         */
        function updateImage($idTellmebye, $imageSrc){
            $curl = curl_init();

            $name = explode('/', $imageSrc)[count(explode('/', $imageSrc)) - 1];
            $contentType = mime_content_type($imageSrc);

            $file = new \CURLFile($imageSrc, $contentType, $name);

            curl_setopt_array($curl, array(
                CURLOPT_URL => $this->urlApi . "memorialwall/$idTellmebye/image",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => ['image' => $file],
                CURLOPT_HTTPHEADER => array(
                    "Accept: application/json",
                    "Content-Type: multipart/form-data",
                    "Authorization: Bearer $this->jwt"
                )
            ));

            $response = curl_exec($curl);
            $error = curl_error($curl);

            curl_close($curl);

            if($error != ''){
                return false;
            }

            $response = json_decode($response);
            if(!isset($response->message) || $response->message != 'Image file upload successfully'){
                return false;
            }

            return true;
        }

        /**
         * Gets tellmebye info for datasheet from expedient
         *
         * @param array $id Id
         * @return array
         */
        public function updateDeceasedPicture($id){
            $db = new DbHandler;

            return $db->query(" UPDATE  Expedients_Tellmebye
                                SET     deceasedPicture = 1,
                                        updateDate = " . time() . "
                                WHERE   id = $id");
        }

        /**
         * Gets tellmebye mortuary by expedient
         *
         * @param array $info Infoinfo
         * @return array
         */
        public function getTellmebyeMortuaryByExpedient($info){
            $db = new DbHandler;

            $expedient = cleanStr($info['expedient']);

            $result = $db->query("  SELECT  et.tellmebyeMortuary
                                    FROM    Expedients_Tellmebye et
                                    WHERE   et.deleteDate IS NULL AND
                                            et.expedient = $expedient
            ");

            if(mysqli_num_rows($result) == 0){
				return null;
			}else{
                return $db->resultToArray($result)[0];
            }
        }

        /**
         * Deletes image on tellmebye
         * 
         * @param string $file_get_contents Tellmebye id
         * @return boolean
         */
        function deleteImage($idTellmebye){
            $curl = curl_init();

            // var_dump('-- DELETE IMAGE --');
            // var_dump($this->jwt);
            // var_dump($idTellmebye);

            curl_setopt_array($curl, array(
                CURLOPT_URL => $this->urlApi . "memorialwall/$idTellmebye/image",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => "DELETE",
                CURLOPT_HTTPHEADER => array(
                    "Accept: application/json",
                    "Content-Type: application/x-www-form-urlencoded",
                    "Authorization: Bearer $this->jwt"
                )
            ));

            $response = curl_exec($curl);
            $error = curl_error($curl);

            curl_close($curl);

            if($error != ''){
                return false;
            }

            $response = json_decode($response);
            // var_dump($response);
            if(!isset($response->message) || $response->message != 'Image deleted successfully'){
                return false;
            }

            return true;
        }
    }
?>