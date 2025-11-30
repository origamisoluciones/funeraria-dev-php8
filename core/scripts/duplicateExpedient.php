<?php
    /*
        Tabla	                                Asociación	                                    Notas       COMPLETADO
        --------------------------------------------------------------------------------------------------------------
        Assistances	                            Vinculado a Expedients	                                    SI
        Condolences	                            Vinculado a Expedients	                                    SI
        Events	                                Vinculado a Expedients	                                    SI
        Expedients		                                                                                    SI
        Expedients_Closed_Death	                Vinculado a Expedients	                        FILES       SI
        Expedients_Documents	                Vinculado a Expedients	                        FILES       SI
        Expedients_Documents_Editor	            Vinculado a Expedients	                        FILES       SI
        Expedients_Duel_Received                Vinculado a Expedients	                        FILES       SI
        Expedients_Hirings	                    Vinculado a Expedients	                                    SI
        Expedients_History_Docs_Sent	        Vinculado a Expedients	                                    SI
        Expedients_History_Docs_Sent_Emails	    Vinculado a Expedients_History_Docs_Sent	                SI
        Expedients_Notes	                    Vinculado a Expedients	                                    SI
        Expedients_Notes_Users	                Vinculado a Expedients_Notes	                            SI
        Expedients_Obituaries	                Vinculado a Expedients	                        FILES       SI
        Expedients_Obituaries_Images	        Vinculado a Expedients	                        FILES       SI
        Expedients_Polls	                    Vinculado a Expedients	                                    SI
        Expedients_Polls_Results	            Vinculado a Expedients_Polls	                            SI
        Expedients_Press	                    Vinculado a Expedients	                        FILES       SI
        Expedients_Reminder	                    Vinculado a Expedients	                        FILES       SI
        Expedients_Reminder_Packet	            Vinculado a Expedients	                        FILES       SI
        Expedients_Reminder_Packet_Cross	    Vinculado a Expedients	                        FILES       SI
        Expedients_Services	                    Vinculado a Expedients	                                    SI
        Expedients_Texts	                    Vinculado a Expedients_Hirings	                            SI
        Expedients_Tombstones	                Vinculado a Expedients	                        FILES       SI
        Flowers_Letters	                        Vinculado a Expedients	                                    SI
        Incidents	                            Vinculado a Visits_Descriptions	                            SI
        Pre_Orders	                            Vinculado a Expedients_Hirings	                            SI
        Satisfaction_Survey		                                                                            SI
        Services_Auto	                        Vinculado a Expedients_Services	                            SI
        Services_Bellringers	                Vinculado a Expedients_Services	                            SI
        Services_Carriers	                    Vinculado a Expedients_Services	                            SI
        Services_Cars	                        Vinculado a Expedients_Services	                            SI
        Services_Choirs	                        Vinculado a Expedients_Services	                            SI
        Services_Control	                    Vinculado a Expedients_Services	                            SI
        Services_Control_Emails	                Vinculado a Expedients_Services	                            SI
        Services_Gravediggers	                Vinculado a Expedients_Services	                            SI
        Services_Hirings	                    Vinculado a Expedients_Services	                            NO SE USA
        Services_Priests	                    Vinculado a Expedients_Services	                            SI
        Survey_Assistance	                    Vinculado a Assistances	                                    SI
        Survey_Clients_Info	                    Vinculado a Expedients_Services	                            SI
        Visits	                                Vinculado a VisitsControl	                                SI
        VisitsControl	                        Vinculado a Expedients	                                    SI
        Visits_Descriptions	                    Vinculado a Visits	                                        SI
        Visits_Descriptions_Cafe	            Vinculado a Visits_Descriptions                             SI
    */
    
    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";
    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }
    
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    $db = new DbHandler;

    // Start - Params
    $expedientId = 3258;
    $clientType = 2;
    $clientId = 213;
    $expedientBaseDir = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/$expedientId";
    // End - Params

    $db->query("START TRANSACTION");

    try{
        $time = time();

        // Start table: Expedients
        // Current data
        $query = "  SELECT  associate, type, status, user, clientType, applicantLocation, familyContactLocation, client, deceasedBirthdayLocation,
                            deceasedLocation, otherDeceasedLocation, deceasedMortuary, deceasedDoctor, church, cemetery, niche, crematorium, crematoriumEvent,
                            crematoriumClient, funeralHome, moveFuneralHome, moveClient, moveCollection, moveDestination, number, entryDate, leavingDate, requestTime,
                            requestDate, policy, lossNumber, capital, move, room, literal, cremation, applicantName, applicantSurname, applicantNIF, applicantNifType,
                            applicantAddress, applicantMail, applicantPhone, applicantMobilePhone, familyContactName, familyContactSurname, familyContactNIF,
                            familyContactNifType, familyContactAddress, familyContactRelationship, familyContactMail, familyContactPhone, familyContactMobilePhone,
                            familyContactNationality, familyContactOtherCountry, familyContactOtherProvince, familyContactOtherLocation, otherContactName, otherContactPhone,
                            otherContactRelationship, deceasedName, deceasedSurname, deceasedNIF, deceasedNifType, deceasedGender, deceasedMaritalStatus, deceasedMaritalStatusDescription,
                            deceasedChildOfFather, deceasedChildOfMother, deceasedFirstNuptials, deceasedSecondNuptials, deceasedNationality, deceasedNationalityName,
                            deceasedNationalityProvince, deceasedNationalityLocation, deceasedBirthday, deceasedUsualAddress, deceasedDate, deceasedTime, deceasedRoom,
                            deceasedPanel, deceasedMortuaryAddress, deceasedDoctorCertificate, deceasedCause, deceasedTribunal, deceasedTribunalNumber, churchLabel,
                            cemeteryLabel, funeralDate, funeralTime, ceremonyDate, ceremonyTime, regime, propertyName, funeralNicheNumber, funeralBusyNiche, deceasedNiche,
                            funeralDateNiche, exhumation, nicheHeight, cremationServiceLocation, ecologicCoffin, crematoriumContactPerson, crematoriumContactPersonPhone,
                            crematoriumArriveTime, crematoriumIntroduction, crematoriumWaitOnRoom, crematoriumVaseBio, crematoriumPacemaker, crematoriumTechnical,
                            crematoriumContactPhonePerson, authContactPhone, authName, authDni, authDate, authTime, authPlace, funeralHomeEntryDate, funeralHomeEntryTime,
                            coffin, otherCoffin, crematoriumReg, funeralReg, personalReg, mortuaryReg, tanatologicalPractice, responsibleUser, responsibleName, responsibleNIF,
                            moveLeavingDate, moveLeavingTime, moveVia, moveJudicial, moveNotes, moveContactPhone, moveContactPerson, moveDestinationAddress, moveCollectionAddress,
                            moveFinalDestination, notesHiring, flightNumber, airportOrigin, departureTime, arrivalAirport, arrivalTime, otherCeremony, otherInhumation, expNumLetter,
                            expNumSecuence, expNumYear, expNumType, changeStatusAuto, priceExp, extraID, covid, deceasedLocality, deceasedProvince, moveTraslado, moveDevolucion,
                            trazabilityId, funeralDateNew, funeralTimeNew, funeralDateBurial, funeralTimeBurial, tpv, authDniType, velatorioEntryDate, velatorioEntryTime,
                            startVelacionDate, startVelacionTime, hearse, placeDestinationMiddle, placeDestinationFinal, placeDestinationFinalCemetery, hiring_rectified,
                            smokeOpacityDateStart, smokeOpacityTimeStart, smokeOpacityDateEnd, smokeOpacityTimeEnd, smokeOpacityLoadWeight, smokeOpacityBacharachScale,
                            smokeOpacityDateReading, smokeOpacityTimeReading, smokeOpacityIncidents, smokeOpacityIncidentsNotes, notesExpedient, tellmebyeRoom, tellmebyeRoomName,
                            entryDateBarrow, entryTimeBarrow, internalRef, endVelacionDate, endVelacionTime, startVelacionDate2, startVelacionTime2, endVelacionDate2, endVelacionTime2,
                            deceasedNiche2, funeralDateNiche2, deceasedNiche3, funeralDateNiche3, agency, agencyContact, agencyContactPhone, departureDate, arrivalDate,
                            carCollection1LicensePlate, carCollection1Brand, carCollection1Model, hearseLicensePlate, hearseBrand, hearseModel, mortuaryRegNotes, next_invoice_status,
                            duplicate_origin, duplicate_user, duplicate_date
                    FROM    Expedients
                    WHERE   expedientID = $expedientId
        ";
        $result = $db->query($query);

        $currentExpedientData = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;

        if($currentExpedientData == null){
            throw new Exception('Get current expedient data');
        }

        // Create year
        $createYear = explode('-', $currentExpedientData['requestDate'])[0];

        // Calculate extraID
        $result = $db->query("  SELECT  MAX(expedientID) as id
                                FROM    Expedients
        ");
        $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
        $extraID .= ($maxID+1);

        // Get client price
        if($currentExpedientData['client'] != null && $currentExpedientData['client'] != ''){
            $result = $db->query("  SELECT   p.name
                                    FROM     Clients c, Prices p
                                    WHERE    c.clientID = {$currentExpedientData['client']} 
                                        AND  p.leavingDate IS NULL
                                        AND  p.priceID = c.price");
                                    
            if(mysqli_num_rows($result) > 0){
                $priceName = $db->resultToArray($result)[0]['name'];

                $result = $db->query("  SELECT   p.priceID
                                        FROM     Prices p
                                        WHERE    p.name = '$priceName'
                                            AND  p.leavingDate IS NULL
                                            AND  p.year = $createYear");

                if(mysqli_num_rows($result) > 0){
                    $priceClient = $db->resultToArray($result)[0]['priceID'];
                }else{
                    $result = $db->query("  SELECT   c.price
                                            FROM     Clients c
                                            WHERE    c.clientID = {$currentExpedientData['client']}");
                                        
                    if(mysqli_num_rows($result) > 0){
                        $priceClient = $db->resultToArray($result)[0]['price'];
                    }else{
                        $priceClient = 'null';
                    }
                }
            }else{
                $priceClient = 'null';
            }
        }else{
            $priceClient = 'null'; 
        }

        // Cálculo del número de secuencia expediente
        $result = $db->query("  SELECT  COUNT(expedientID) as total 
                                FROM    Expedients 
                                WHERE   leavingDate IS NULL AND
                                        expNumYear = '" . $createYear . "'
        ");
        if(mysqli_num_rows($result) > 0){
            $numExp = $db->resultToArray($result)[0]['total'] + 1;
        }else{
            $numExp = 1;
        }

        //Tipo de expediente
        switch($currentExpedientData['type']){
            case '1': //DEFUNCION
                switch($currentExpedientData['clientType']){
                    case '1': //PARTICULARES

                        $expNumLetter = 'P';

                        $expNumYear = $createYear;
                        //Calcular el numero de secuencia del expediente par tipo DEFUNCION
                        $result = $db->query("  SELECT  COALESCE(MAX(expNumSecuence), 0) as total 
                                                FROM    Expedients 
                                                WHERE   leavingDate IS NULL AND type = 1 AND                                                           
                                                        expNumYear = '" . $expNumYear . "'"
                        );

                        if(mysqli_num_rows($result) > 0){
                            $expNumSec = $db->resultToArray($result)[0]['total'] + 1;
                        }else{
                            $expNumSec = 1;
                        }

                        //Calcular el numero de secuencia del expediente para Particulares
                        $result = $db->query("  SELECT  COALESCE(MAX(expNumType), 0) as total 
                                                FROM    Expedients 
                                                WHERE   leavingDate IS NULL AND
                                                        clientType = 1 AND type = 1 AND
                                                        expNumYear = '" . $expNumYear . "'"
                        );
                        
                        if(mysqli_num_rows($result) > 0){
                            $expNumType = $db->resultToArray($result)[0]['total'] + 1;
                        }else{
                            $expNumType = 1;
                        }

                        $expNumYear = substr($expNumYear, -2);
                        $numberExp = $expNumSec . ' ' . $expNumLetter . $expNumType . '/' . $expNumYear;

                    break;

                    case '2': //SEGUROS
                        $expNumLetter = 'S';

                        $expNumYear = $createYear;

                        //Calcular el numero de secuencia del expediente para tipo DEFUNCION
                        $result = $db->query("  SELECT  COALESCE(MAX(expNumSecuence), 0) as total 
                                                FROM    Expedients 
                                                WHERE   leavingDate IS NULL AND type = 1 AND                                                           
                                                        expNumYear = '" . $expNumYear . "'"
                        );
                        
                        if(mysqli_num_rows($result) > 0){
                            $expNumSec = $db->resultToArray($result)[0]['total'] + 1;
                        }else{
                            $expNumSec = 1;
                        }


                        //Calcular el numero de secuencia del expediente para seguros
                        $result = $db->query("  SELECT  COALESCE(MAX(expNumType), 0) as total 
                                                FROM    Expedients 
                                                WHERE   leavingDate IS NULL AND
                                                        clientType = 2 AND type = 1 AND
                                                        expNumYear = '" . $expNumYear . "'"
                        );
                        
                        if(mysqli_num_rows($result) > 0){
                            $expNumType = $db->resultToArray($result)[0]['total'] + 1;
                        }else{
                            $expNumType = 1;
                        }
                        $expNumYear = substr($expNumYear, -2);

                        //  $numberExp = $expNumLetter . '-' . $expNumSec . '/' . $expNumYear . ' ' . $expNumType;
                        $numberExp = $expNumSec . ' ' . $expNumLetter . $expNumType . '/' . $expNumYear;
                        break;

                    case '3': //EMPRESAS
                        $expNumLetter = 'E';

                        $expNumYear = $createYear;
                        //Calcular el numero de secuencia del expediente par tipo DEFUNCION
                        $result = $db->query("  SELECT  COALESCE(MAX(expNumSecuence), 0) as total 
                                                FROM    Expedients 
                                                WHERE   leavingDate IS NULL AND type = 1 AND                                                           
                                                        expNumYear = '" . $expNumYear . "'"
                        );

                        if(mysqli_num_rows($result) > 0){
                            $expNumSec = $db->resultToArray($result)[0]['total'] + 1;
                        }else{
                            $expNumSec = 1;
                        }

                        //Calcular el numero de secuencia del expediente para empresas
                        $result = $db->query("  SELECT  COALESCE(MAX(expNumType), 0) as total 
                                                FROM    Expedients 
                                                WHERE   leavingDate IS NULL AND
                                                        clientType = 3 AND type = 1 AND
                                                        expNumYear = '" . $expNumYear . "'"
                        );
                        
                        if(mysqli_num_rows($result) > 0){
                            $expNumType = $db->resultToArray($result)[0]['total'] + 1;
                        }else{
                            $expNumType = 1;
                        }

                        $expNumYear = substr($expNumYear, -2);
                        // $numberExp = $expNumLetter . '-' . $expNumSec . '/' . $expNumYear . ' ' . $expNumType;
                        $numberExp = $expNumSec . ' ' . $expNumLetter . $expNumType . '/' . $expNumYear;
                        break;
                }
            break;

            case '2': //PRESUPUESTO

                $expNumYear = $createYear;

                $expNumLetter = 'PR';
                //Calcular el numero de secuencia del expediente par tipo PRESUPUESTO
                $result = $db->query("  SELECT  COALESCE(MAX(expNumSecuence), 0) as total 
                                        FROM    Expedients 
                                        WHERE   leavingDate IS NULL AND type = 2 AND                                                           
                                                expNumYear = '" . $expNumYear . "'"
                );

                if(mysqli_num_rows($result) > 0){
                    $expNumSec = $db->resultToArray($result)[0]['total'] + 1;
                }else{
                    $expNumSec = 1;
                }
                $expNumYear = $createYear;
                $expNumYear = substr($expNumYear, -2);
                //$expNumYear = 2012;
                $expNumType = 0;
                $numberExp = $expNumLetter . '-' . $expNumSec . '/' . $expNumYear;
            break;

            case '3': //VARIOS
                $expNumYear = $createYear;
                
                $expNumLetter = 'V';
                //Calcular el numero de secuencia del expediente par tipo VARIOS
                $result = $db->query("  SELECT  COALESCE(MAX(expNumSecuence), 0) as total 
                                        FROM    Expedients 
                                        WHERE   leavingDate IS NULL AND type = 3 AND                                                           
                                                expNumYear = '" . $expNumYear . "'"
                );
                
                if(mysqli_num_rows($result) > 0){
                    $expNumSec = $db->resultToArray($result)[0]['total'] + 1;
                }else{
                    $expNumSec = 1;
                }
                $expNumYear = $createYear;
                //$expNumYear = 2012;
                $expNumYear = substr($expNumYear, -2);
                $expNumType = 0;
                $numberExp = $expNumLetter . '-' . $expNumSec . '/' . $expNumYear;
            break;
        }
        
        // Get next trazability ID
        if($currentExpedientData['cremation'] === 'true'){
            $result = $db->query("  SELECT  COALESCE(MAX(e.trazabilityId), 0) as max_id_trazability 
                                    FROM    Expedients e
                                    WHERE   e.leavingDate IS NULL AND
                                            e.cremation = 1  AND 
                                            e.trazabilityId != 'false' AND e.trazabilityId != ''
            ");
            if(mysqli_num_rows($result) > 0){
                $currentExpedientData['trazabilityId'] = intval($db->resultToArray($result)[0]['max_id_trazability']) + 1;
            }else{
                $currentExpedientData['trazabilityId'] = 1;
            }
        }

        $expNumYear = $createYear;

        $associate = $currentExpedientData['associate'] == null ? 'null' : $currentExpedientData['associate'];
        $type = $currentExpedientData['type'] == null ? 'null' : $currentExpedientData['type'];
        $status = $currentExpedientData['status'] == null ? 'null' : $currentExpedientData['status'];
        $user = $currentExpedientData['user'] == null ? 'null' : $currentExpedientData['user'];
        $applicantLocation = $currentExpedientData['applicantLocation'] == null ? 'null' : $currentExpedientData['applicantLocation'];
        $familyContactLocation = $currentExpedientData['familyContactLocation'] == null ? 'null' : $currentExpedientData['familyContactLocation'];
        $client = $clientId;
        $deceasedBirthdayLocation = $currentExpedientData['deceasedBirthdayLocation'] == null ? 'null' : $currentExpedientData['deceasedBirthdayLocation'];
        $deceasedLocation = $currentExpedientData['deceasedLocation'] == null ? 'null' : $currentExpedientData['deceasedLocation'];
        $otherDeceasedLocation = $currentExpedientData['otherDeceasedLocation'];
        $deceasedMortuary = $currentExpedientData['deceasedMortuary'] == null ? 'null' : $currentExpedientData['deceasedMortuary'];
        $deceasedDoctor = $currentExpedientData['deceasedDoctor'] == null ? 'null' : $currentExpedientData['deceasedDoctor'];
        $church = $currentExpedientData['church'] == null ? 'null' : $currentExpedientData['church'];
        $cemetery = $currentExpedientData['cemetery'] == null ? 'null' : $currentExpedientData['cemetery'];
        $niche = $currentExpedientData['niche'] == null ? 'null' : $currentExpedientData['niche'];
        $crematorium = $currentExpedientData['crematorium'] == null ? 'null' : $currentExpedientData['crematorium'];
        $crematoriumEvent = $currentExpedientData['crematoriumEvent'] == null ? 'null' : $currentExpedientData['crematoriumEvent'];
        $crematoriumClient = $currentExpedientData['crematoriumClient'] == null ? 'null' : $currentExpedientData['crematoriumClient'];
        $funeralHome = $currentExpedientData['funeralHome'] == null ? 'null' : $currentExpedientData['funeralHome'];
        $moveFuneralHome = $currentExpedientData['moveFuneralHome'] == null ? 'null' : $currentExpedientData['moveFuneralHome'];
        $moveClient = $currentExpedientData['moveClient'] == null ? 'null' : $currentExpedientData['moveClient'];
        $moveCollection = $currentExpedientData['moveCollection'] == null ? 'null' : $currentExpedientData['moveCollection'];
        $moveDestination = $currentExpedientData['moveDestination'] == null ? 'null' : $currentExpedientData['moveDestination'];
        $number = $numberExp;
        $entryDate = $currentExpedientData['entryDate'] == null ? 'null' : "'" . $currentExpedientData['entryDate'] . "'";
        $leavingDate = $currentExpedientData['leavingDate'] == null ? 'null' : "'" . $currentExpedientData['leavingDate'] . "'";
        $requestTime = $currentExpedientData['requestTime'] == null ? 'null' : "'" . $currentExpedientData['requestTime'] . "'";
        $requestDate = $currentExpedientData['requestDate'] == null ? 'null' : "'" . $currentExpedientData['requestDate'] . "'";
        $policy = $currentExpedientData['policy'];
        $lossNumber = $currentExpedientData['lossNumber'];
        $capital = $currentExpedientData['capital'];
        $move = $currentExpedientData['move'] == null ? 0 : $currentExpedientData['move'];
        $room = $currentExpedientData['room'] == null ? 0 : $currentExpedientData['room'];
        $literal = $currentExpedientData['literal'] == null ? 0 : $currentExpedientData['literal'];
        $cremation = $currentExpedientData['cremation'] == null ? 0 : $currentExpedientData['cremation'];
        $applicantName = $currentExpedientData['applicantName'];
        $applicantSurname = $currentExpedientData['applicantSurname'];
        $applicantNIF = $currentExpedientData['applicantNIF'];
        $applicantNifType = $currentExpedientData['applicantNifType'] == null ? 1 : $currentExpedientData['applicantNifType'];
        $applicantAddress = $currentExpedientData['applicantAddress'];
        $applicantMail = $currentExpedientData['applicantMail'];
        $applicantPhone = $currentExpedientData['applicantPhone'];
        $applicantMobilePhone = $currentExpedientData['applicantMobilePhone'];
        $familyContactName = $currentExpedientData['familyContactName'];
        $familyContactSurname = $currentExpedientData['familyContactSurname'];
        $familyContactNIF = $currentExpedientData['familyContactNIF'];
        $familyContactNifType = $currentExpedientData['familyContactNifType'] == null ? 1 : $currentExpedientData['familyContactNifType'];
        $familyContactAddress = $currentExpedientData['familyContactAddress'];
        $familyContactRelationship = $currentExpedientData['familyContactRelationship'];
        $familyContactMail = $currentExpedientData['familyContactMail'];
        $familyContactPhone = $currentExpedientData['familyContactPhone'];
        $familyContactMobilePhone = $currentExpedientData['familyContactMobilePhone'];
        $familyContactNationality = $currentExpedientData['familyContactNationality'] == null ? 1 : $currentExpedientData['familyContactNationality'];
        $familyContactOtherCountry = $currentExpedientData['familyContactOtherCountry'];
        $familyContactOtherProvince = $currentExpedientData['familyContactOtherProvince'];
        $familyContactOtherLocation = $currentExpedientData['familyContactOtherLocation'];
        $otherContactName = $currentExpedientData['otherContactName'];
        $otherContactPhone = $currentExpedientData['otherContactPhone'];
        $otherContactRelationship = $currentExpedientData['otherContactRelationship'];
        $deceasedName = $currentExpedientData['deceasedName'];
        $deceasedSurname = $currentExpedientData['deceasedSurname'];
        $deceasedNIF = $currentExpedientData['deceasedNIF'];
        $deceasedNifType = $currentExpedientData['deceasedNifType'] == null ? 1 : $currentExpedientData['deceasedNifType'];
        $deceasedGender = $currentExpedientData['deceasedGender'];
        $deceasedMaritalStatus = $currentExpedientData['deceasedMaritalStatus'];
        $deceasedMaritalStatusDescription = $currentExpedientData['deceasedMaritalStatusDescription'];
        $deceasedChildOfFather = $currentExpedientData['deceasedChildOfFather'];
        $deceasedChildOfMother = $currentExpedientData['deceasedChildOfMother'];
        $deceasedFirstNuptials = $currentExpedientData['deceasedFirstNuptials'];
        $deceasedSecondNuptials = $currentExpedientData['deceasedSecondNuptials'];
        $deceasedNationality = $currentExpedientData['deceasedNationality'];
        $deceasedNationalityName = $currentExpedientData['deceasedNationalityName'];
        $deceasedNationalityProvince = $currentExpedientData['deceasedNationalityProvince'];
        $deceasedNationalityLocation = $currentExpedientData['deceasedNationalityLocation'];
        $deceasedBirthday = $currentExpedientData['deceasedBirthday'] == null ? 'null' : "'" . $currentExpedientData['deceasedBirthday'] . "'";
        $deceasedUsualAddress = $currentExpedientData['deceasedUsualAddress'];
        $deceasedDate = $currentExpedientData['deceasedDate'] == null ? 'null' : "'" . $currentExpedientData['deceasedDate'] . "'";
        $deceasedTime = $currentExpedientData['deceasedTime'] == null ? 'null' : "'" . $currentExpedientData['deceasedTime'] . "'";
        $deceasedRoom = $currentExpedientData['deceasedRoom'];
        $deceasedPanel = $currentExpedientData['deceasedPanel'] == null ? 0 : $currentExpedientData['deceasedPanel'];
        $deceasedMortuaryAddress = $currentExpedientData['deceasedMortuaryAddress'];
        $deceasedDoctorCertificate = $currentExpedientData['deceasedDoctorCertificate'];
        $deceasedCause = $currentExpedientData['deceasedCause'];
        $deceasedTribunal = $currentExpedientData['deceasedTribunal'];
        $deceasedTribunalNumber = $currentExpedientData['deceasedTribunalNumber'];
        $churchLabel = $currentExpedientData['churchLabel'];
        $cemeteryLabel = $currentExpedientData['cemeteryLabel'];
        $funeralDate = $currentExpedientData['funeralDate'] == null ? 'null' : "'" . $currentExpedientData['funeralDate'] . "'";
        $funeralTime = $currentExpedientData['funeralTime'] == null ? 'null' : "'" . $currentExpedientData['funeralTime'] . "'";
        $ceremonyDate = $currentExpedientData['ceremonyDate'] == null ? 'null' : "'" . $currentExpedientData['ceremonyDate'] . "'";
        $ceremonyTime = $currentExpedientData['ceremonyTime'] == null ? 'null' : "'" . $currentExpedientData['ceremonyTime'] . "'";
        $regime = $currentExpedientData['regime'] == null ? 'null' : $currentExpedientData['regime'];
        $propertyName = $currentExpedientData['propertyName'];
        $funeralNicheNumber = $currentExpedientData['funeralNicheNumber'];
        $funeralBusyNiche = $currentExpedientData['funeralBusyNiche'] == null ? 'null' : $currentExpedientData['funeralBusyNiche'];
        $deceasedNiche = $currentExpedientData['deceasedNiche'];
        $funeralDateNiche = $currentExpedientData['funeralDateNiche'] == null ? 'null' : $currentExpedientData['funeralDateNiche'];
        $exhumation = $currentExpedientData['exhumation'];
        $nicheHeight = $currentExpedientData['nicheHeight'] == null ? 'null' : $currentExpedientData['nicheHeight'];
        $cremationServiceLocation = $currentExpedientData['cremationServiceLocation'] == null ? 'null' : $currentExpedientData['cremationServiceLocation'];
        $ecologicCoffin = $currentExpedientData['ecologicCoffin'] == null ? 'null' : $currentExpedientData['ecologicCoffin'];
        $crematoriumContactPerson = $currentExpedientData['crematoriumContactPerson'];
        $crematoriumContactPersonPhone = $currentExpedientData['crematoriumContactPersonPhone'];
        $crematoriumArriveTime = $currentExpedientData['crematoriumArriveTime'] == null ? 'null' : "'" . $currentExpedientData['crematoriumArriveTime'] . "'";
        $crematoriumIntroduction = $currentExpedientData['crematoriumIntroduction'];
        $crematoriumWaitOnRoom = $currentExpedientData['crematoriumWaitOnRoom'];
        $crematoriumVaseBio = $currentExpedientData['crematoriumVaseBio'] == null ? 'null' : $currentExpedientData['crematoriumVaseBio'];
        $crematoriumPacemaker = $currentExpedientData['crematoriumPacemaker'] == null ? 'null' : $currentExpedientData['crematoriumPacemaker'];
        $crematoriumTechnical = $currentExpedientData['crematoriumTechnical'];
        $crematoriumContactPhonePerson = $currentExpedientData['crematoriumContactPhonePerson'];
        $authContactPhone = $currentExpedientData['authContactPhone'];
        $authName = $currentExpedientData['authName'];
        $authDni = $currentExpedientData['authDni'];
        $authDate = $currentExpedientData['authDate'] == null ? 'null' : $currentExpedientData['authDate'];
        $authTime = $currentExpedientData['authTime'] == null ? 'null' : $currentExpedientData['authTime'];
        $authPlace = $currentExpedientData['authPlace'];
        $funeralHomeEntryDate = $currentExpedientData['funeralHomeEntryDate'] == null ? 'null' : "'" . $currentExpedientData['funeralHomeEntryDate'] . "'";
        $funeralHomeEntryTime = $currentExpedientData['funeralHomeEntryTime'] == null ? 'null' : "'" . $currentExpedientData['funeralHomeEntryTime'] . "'";
        $coffin = $currentExpedientData['coffin'] == null ? 0 : $currentExpedientData['coffin'];
        $otherCoffin = $currentExpedientData['otherCoffin'];
        $crematoriumReg = $currentExpedientData['crematoriumReg'] == null ? 'null' : $currentExpedientData['crematoriumReg'];
        $funeralReg = $currentExpedientData['funeralReg'] == null ? 'null' : $currentExpedientData['funeralReg'];
        $personalReg = $currentExpedientData['personalReg'] == null ? 'null' : $currentExpedientData['personalReg'];
        $mortuaryReg = $currentExpedientData['mortuaryReg'] == null ? 'null' : $currentExpedientData['mortuaryReg'];
        $tanatologicalPractice = $currentExpedientData['tanatologicalPractice'] == null ? 'null' : $currentExpedientData['tanatologicalPractice'];
        $responsibleUser = $currentExpedientData['responsibleUser'] == null ? 'null' : $currentExpedientData['responsibleUser'];
        $responsibleName = $currentExpedientData['responsibleName'];
        $responsibleNIF = $currentExpedientData['responsibleNIF'];
        $moveLeavingDate = $currentExpedientData['moveLeavingDate'] == null ? 'null' : "'" . $currentExpedientData['moveLeavingDate'] . "'";
        $moveLeavingTime = $currentExpedientData['moveLeavingTime'] == null ? 'null' : "'" . $currentExpedientData['moveLeavingTime'] . "'";
        $moveVia = $currentExpedientData['moveVia'] == null ? 0 : $currentExpedientData['moveVia'];
        $moveJudicial = $currentExpedientData['moveJudicial'] == null ? 0 : $currentExpedientData['moveJudicial'];
        $moveNotes = $currentExpedientData['moveNotes'];
        $moveContactPhone = $currentExpedientData['moveContactPhone'];
        $moveContactPerson = $currentExpedientData['moveContactPerson'];
        $moveDestinationAddress = $currentExpedientData['moveDestinationAddress'];
        $moveCollectionAddress = $currentExpedientData['moveCollectionAddress'];
        $moveFinalDestination = $currentExpedientData['moveFinalDestination'];
        $notesHiring = $currentExpedientData['notesHiring'];
        $flightNumber = $currentExpedientData['flightNumber'];
        $airportOrigin = $currentExpedientData['airportOrigin'];
        $departureTime = $currentExpedientData['departureTime'] == null ? 'null' : $currentExpedientData['departureTime'];
        $arrivalAirport = $currentExpedientData['arrivalAirport'];
        $arrivalTime = $currentExpedientData['arrivalTime'] == null ? 'null' : $currentExpedientData['arrivalTime'];
        $otherCeremony = $currentExpedientData['otherCeremony'];
        $otherInhumation = $currentExpedientData['otherInhumation'];
        $expNumLetter = $expNumLetter;
        $expNumSecuence = $expNumSec;
        $expNumYear = $expNumYear;
        $expNumType = $expNumType;
        $changeStatusAuto = $currentExpedientData['changeStatusAuto'] == null ? 1 : $currentExpedientData['changeStatusAuto'];
        $priceExp = $priceClient;
        $extraID = $extraID;
        $covid = $currentExpedientData['covid'] == null ? 'null' : $currentExpedientData['covid'];
        $deceasedLocality = $currentExpedientData['deceasedLocality'];
        $deceasedProvince = $currentExpedientData['deceasedProvince'];
        $moveTraslado = $currentExpedientData['moveTraslado'] == null ? 'null' : $currentExpedientData['moveTraslado'];
        $moveDevolucion = $currentExpedientData['moveDevolucion'] == null ? 'null' : $currentExpedientData['moveDevolucion'];
        $trazabilityId = $currentExpedientData['trazabilityId'];
        $funeralDateNew = $currentExpedientData['funeralDateNew'] == null ? 'null' : "'" . $currentExpedientData['funeralDateNew'] . "'";
        $funeralTimeNew = $currentExpedientData['funeralTimeNew'] == null ? 'null' : "'" . $currentExpedientData['funeralTimeNew'] . "'";
        $funeralDateBurial = $currentExpedientData['funeralDateBurial'] == null ? 'null' : "'" . $currentExpedientData['funeralDateBurial'] . "'";
        $funeralTimeBurial = $currentExpedientData['funeralTimeBurial'] == null ? 'null' : "'" . $currentExpedientData['funeralTimeBurial'] . "'";
        $tpv = $currentExpedientData['tpv'] == null ? 0 : $currentExpedientData['tpv'];
        $authDniType = $currentExpedientData['authDniType'] == null ? 1 : $currentExpedientData['authDniType'];
        $velatorioEntryDate = $currentExpedientData['velatorioEntryDate'] == null ? 'null' : "'" . $currentExpedientData['velatorioEntryDate'] . "'";
        $velatorioEntryTime = $currentExpedientData['velatorioEntryTime'] == null ? 'null' : "'" . $currentExpedientData['velatorioEntryTime'] . "'";
        $startVelacionDate = $currentExpedientData['startVelacionDate'] == null ? 'null' : "'" . $currentExpedientData['startVelacionDate'] . "'";
        $startVelacionTime = $currentExpedientData['startVelacionTime'] == null ? 'null' : "'" . $currentExpedientData['startVelacionTime'] . "'";
        $hearse = $currentExpedientData['hearse'] == null ? 'null' : $currentExpedientData['hearse'];
        $placeDestinationMiddle = $currentExpedientData['placeDestinationMiddle'] == null ? 'null' : $currentExpedientData['placeDestinationMiddle'];
        $placeDestinationFinal = $currentExpedientData['placeDestinationFinal'] == null ? 'null' : $currentExpedientData['placeDestinationFinal'];
        $placeDestinationFinalCemetery = $currentExpedientData['placeDestinationFinalCemetery'] == null ? 'null' : $currentExpedientData['placeDestinationFinalCemetery'];
        $hiring_rectified = 0;
        $smokeOpacityDateStart = $currentExpedientData['smokeOpacityDateStart'] == null ? 'null' : $currentExpedientData['smokeOpacityDateStart'];
        $smokeOpacityTimeStart = $currentExpedientData['smokeOpacityTimeStart'] == null ? 'null' : $currentExpedientData['smokeOpacityTimeStart'];
        $smokeOpacityDateEnd = $currentExpedientData['smokeOpacityDateEnd'] == null ? 'null' : $currentExpedientData['smokeOpacityDateEnd'];
        $smokeOpacityTimeEnd = $currentExpedientData['smokeOpacityTimeEnd'] == null ? 'null' : $currentExpedientData['smokeOpacityTimeEnd'];
        $smokeOpacityLoadWeight = $currentExpedientData['smokeOpacityLoadWeight'] == null ? 'null' : $currentExpedientData['smokeOpacityLoadWeight'];
        $smokeOpacityBacharachScale = $currentExpedientData['smokeOpacityBacharachScale'] == null ? 'null' : $currentExpedientData['smokeOpacityBacharachScale'];
        $smokeOpacityDateReading = $currentExpedientData['smokeOpacityDateReading'] == null ? 'null' : $currentExpedientData['smokeOpacityDateReading'];
        $smokeOpacityTimeReading = $currentExpedientData['smokeOpacityTimeReading'] == null ? 'null' : $currentExpedientData['smokeOpacityTimeReading'];
        $smokeOpacityIncidents = $currentExpedientData['smokeOpacityIncidents'] == null ? 0 : $currentExpedientData['smokeOpacityIncidents'];
        $smokeOpacityIncidentsNotes = $currentExpedientData['smokeOpacityIncidentsNotes'];
        $notesExpedient = $currentExpedientData['notesExpedient'];
        $tellmebyeRoom = $currentExpedientData['tellmebyeRoom'];
        $tellmebyeRoomName = $currentExpedientData['tellmebyeRoomName'];
        $entryDateBarrow = $currentExpedientData['entryDateBarrow'] == null ? 'null' : "'" . $currentExpedientData['entryDateBarrow'] . "'";
        $entryTimeBarrow = $currentExpedientData['entryTimeBarrow'] == null ? 'null' : "'" . $currentExpedientData['entryTimeBarrow'] . "'";
        $internalRef = $currentExpedientData['internalRef'];
        $endVelacionDate = $currentExpedientData['endVelacionDate'] == null ? 'null' : "'" . $currentExpedientData['endVelacionDate'] . "'";
        $endVelacionTime = $currentExpedientData['endVelacionTime'] == null ? 'null' : "'" . $currentExpedientData['endVelacionTime'] . "'";
        $startVelacionDate2 = $currentExpedientData['startVelacionDate2'] == null ? 'null' : "'" . $currentExpedientData['startVelacionDate2'] . "'";
        $startVelacionTime2 = $currentExpedientData['startVelacionTime2'] == null ? 'null' : "'" . $currentExpedientData['startVelacionTime2'] . "'";
        $endVelacionDate2 = $currentExpedientData['endVelacionDate2'] == null ? 'null' : "'" . $currentExpedientData['endVelacionDate2'] . "'";
        $endVelacionTime2 = $currentExpedientData['endVelacionTime2'] == null ? 'null' : "'" . $currentExpedientData['endVelacionTime2'] . "'";
        $deceasedNiche2 = $currentExpedientData['deceasedNiche2'];
        $funeralDateNiche2 = $currentExpedientData['funeralDateNiche2'] == null ? 'null' : $currentExpedientData['funeralDateNiche2'];
        $deceasedNiche3 = $currentExpedientData['deceasedNiche3'];
        $funeralDateNiche3 = $currentExpedientData['funeralDateNiche3'] == null ? 'null' : $currentExpedientData['funeralDateNiche3'];
        $agency = $currentExpedientData['agency'];
        $agencyContact = $currentExpedientData['agencyContact'];
        $agencyContactPhone = $currentExpedientData['agencyContactPhone'];
        $departureDate = $currentExpedientData['departureDate'] == null ? 'null' : "'" . $currentExpedientData['departureDate'] . "'";
        $arrivalDate = $currentExpedientData['arrivalDate'] == null ? 'null' : "'" . $currentExpedientData['arrivalDate'] . "'";
        $carCollection1LicensePlate = $currentExpedientData['carCollection1LicensePlate'];
        $carCollection1Brand = $currentExpedientData['carCollection1Brand'];
        $carCollection1Model = $currentExpedientData['carCollection1Model'];
        $hearseLicensePlate = $currentExpedientData['hearseLicensePlate'];
        $hearseBrand = $currentExpedientData['hearseBrand'];
        $hearseModel = $currentExpedientData['hearseModel'];
        $mortuaryRegNotes = $currentExpedientData['mortuaryRegNotes'];
        $next_invoice_status = $currentExpedientData['next_invoice_status'];
        $duplicate_origin = $expedientId;
        $duplicate_user = $_SESSION['user'];
        $duplicate_date = $time;

        $query = "  INSERT INTO Expedients(
                        associate, type, status, user, clientType, applicantLocation, familyContactLocation, client, deceasedBirthdayLocation,
                        deceasedLocation, otherDeceasedLocation, deceasedMortuary, deceasedDoctor, church, cemetery, niche, crematorium, crematoriumEvent,
                        crematoriumClient, funeralHome, moveFuneralHome, moveClient, moveCollection, moveDestination, number, entryDate, leavingDate, requestTime,
                        requestDate, policy, lossNumber, capital, move, room, literal, cremation, applicantName, applicantSurname, applicantNIF, applicantNifType,
                        applicantAddress, applicantMail, applicantPhone, applicantMobilePhone, familyContactName, familyContactSurname, familyContactNIF,
                        familyContactNifType, familyContactAddress, familyContactRelationship, familyContactMail, familyContactPhone, familyContactMobilePhone,
                        familyContactNationality, familyContactOtherCountry, familyContactOtherProvince, familyContactOtherLocation, otherContactName, otherContactPhone,
                        otherContactRelationship, deceasedName, deceasedSurname, deceasedNIF, deceasedNifType, deceasedGender, deceasedMaritalStatus, deceasedMaritalStatusDescription,
                        deceasedChildOfFather, deceasedChildOfMother, deceasedFirstNuptials, deceasedSecondNuptials, deceasedNationality, deceasedNationalityName,
                        deceasedNationalityProvince, deceasedNationalityLocation, deceasedBirthday, deceasedUsualAddress, deceasedDate, deceasedTime, deceasedRoom,
                        deceasedPanel, deceasedMortuaryAddress, deceasedDoctorCertificate, deceasedCause, deceasedTribunal, deceasedTribunalNumber, churchLabel,
                        cemeteryLabel, funeralDate, funeralTime, ceremonyDate, ceremonyTime, regime, propertyName, funeralNicheNumber, funeralBusyNiche, deceasedNiche,
                        funeralDateNiche, exhumation, nicheHeight, cremationServiceLocation, ecologicCoffin, crematoriumContactPerson, crematoriumContactPersonPhone,
                        crematoriumArriveTime, crematoriumIntroduction, crematoriumWaitOnRoom, crematoriumVaseBio, crematoriumPacemaker, crematoriumTechnical,
                        crematoriumContactPhonePerson, authContactPhone, authName, authDni, authDate, authTime, authPlace, funeralHomeEntryDate, funeralHomeEntryTime,
                        coffin, otherCoffin, crematoriumReg, funeralReg, personalReg, mortuaryReg, tanatologicalPractice, responsibleUser, responsibleName, responsibleNIF,
                        moveLeavingDate, moveLeavingTime, moveVia, moveJudicial, moveNotes, moveContactPhone, moveContactPerson, moveDestinationAddress, moveCollectionAddress,
                        moveFinalDestination, notesHiring, flightNumber, airportOrigin, departureTime, arrivalAirport, arrivalTime, otherCeremony, otherInhumation, expNumLetter,
                        expNumSecuence, expNumYear, expNumType, changeStatusAuto, priceExp, extraID, covid, deceasedLocality, deceasedProvince, moveTraslado, moveDevolucion,
                        trazabilityId, funeralDateNew, funeralTimeNew, funeralDateBurial, funeralTimeBurial, tpv, authDniType, velatorioEntryDate, velatorioEntryTime,
                        startVelacionDate, startVelacionTime, hearse, placeDestinationMiddle, placeDestinationFinal, placeDestinationFinalCemetery, hiring_rectified,
                        smokeOpacityDateStart, smokeOpacityTimeStart, smokeOpacityDateEnd, smokeOpacityTimeEnd, smokeOpacityLoadWeight, smokeOpacityBacharachScale,
                        smokeOpacityDateReading, smokeOpacityTimeReading, smokeOpacityIncidents, smokeOpacityIncidentsNotes, notesExpedient, tellmebyeRoom, tellmebyeRoomName,
                        entryDateBarrow, entryTimeBarrow, internalRef, endVelacionDate, endVelacionTime, startVelacionDate2, startVelacionTime2, endVelacionDate2, endVelacionTime2,
                        deceasedNiche2, funeralDateNiche2, deceasedNiche3, funeralDateNiche3, agency, agencyContact, agencyContactPhone, departureDate, arrivalDate,
                        carCollection1LicensePlate, carCollection1Brand, carCollection1Model, hearseLicensePlate, hearseBrand, hearseModel, mortuaryRegNotes, next_invoice_status,
                        duplicate_origin, duplicate_user, duplicate_date
                    )
                    VALUES (
                        $associate, $type, $status, $user, $clientType, $applicantLocation, $familyContactLocation, $client, $deceasedBirthdayLocation,
                        $deceasedLocation, '$otherDeceasedLocation', $deceasedMortuary, $deceasedDoctor, $church, $cemetery, $niche, $crematorium, $crematoriumEvent,
                        $crematoriumClient, $funeralHome, $moveFuneralHome, $moveClient, $moveCollection, $moveDestination, '$number', $entryDate, $leavingDate, $requestTime,
                        $requestDate, '$policy', '$lossNumber', '$capital', $move, $room, $literal, $cremation, '$applicantName', '$applicantSurname', '$applicantNIF', $applicantNifType,
                        '$applicantAddress', '$applicantMail', '$applicantPhone', '$applicantMobilePhone', '$familyContactName', '$familyContactSurname', '$familyContactNIF',
                        $familyContactNifType, '$familyContactAddress', '$familyContactRelationship', '$familyContactMail', '$familyContactPhone', '$familyContactMobilePhone',
                        $familyContactNationality, '$familyContactOtherCountry', '$familyContactOtherProvince', '$familyContactOtherLocation', '$otherContactName', '$otherContactPhone',
                        '$otherContactRelationship', '$deceasedName', '$deceasedSurname', '$deceasedNIF', $deceasedNifType, '$deceasedGender', '$deceasedMaritalStatus', '$deceasedMaritalStatusDescription',
                        '$deceasedChildOfFather', '$deceasedChildOfMother', '$deceasedFirstNuptials', '$deceasedSecondNuptials', '$deceasedNationality', '$deceasedNationalityName',
                        '$deceasedNationalityProvince', '$deceasedNationalityLocation', $deceasedBirthday, '$deceasedUsualAddress', $deceasedDate, $deceasedTime, '$deceasedRoom',
                        $deceasedPanel, '$deceasedMortuaryAddress', '$deceasedDoctorCertificate', '$deceasedCause', '$deceasedTribunal', '$deceasedTribunalNumber', '$churchLabel',
                        '$cemeteryLabel', $funeralDate, $funeralTime, $ceremonyDate, $ceremonyTime, $regime, '$propertyName', '$funeralNicheNumber', $funeralBusyNiche, '$deceasedNiche',
                        $funeralDateNiche, '$exhumation', $nicheHeight, $cremationServiceLocation, $ecologicCoffin, '$crematoriumContactPerson', '$crematoriumContactPersonPhone',
                        $crematoriumArriveTime, '$crematoriumIntroduction', '$crematoriumWaitOnRoom', $crematoriumVaseBio, $crematoriumPacemaker, '$crematoriumTechnical',
                        '$crematoriumContactPhonePerson', '$authContactPhone', '$authName', '$authDni', $authDate, $authTime, '$authPlace', $funeralHomeEntryDate, $funeralHomeEntryTime,
                        $coffin, '$otherCoffin', $crematoriumReg, $funeralReg, $personalReg, $mortuaryReg, $tanatologicalPractice, $responsibleUser, '$responsibleName', '$responsibleNIF',
                        $moveLeavingDate, $moveLeavingTime, $moveVia, $moveJudicial, '$moveNotes', '$moveContactPhone', '$moveContactPerson', '$moveDestinationAddress', '$moveCollectionAddress',
                        '$moveFinalDestination', '$notesHiring', '$flightNumber', '$airportOrigin', $departureTime, '$arrivalAirport', $arrivalTime, '$otherCeremony', '$otherInhumation', '$expNumLetter',
                        $expNumSecuence, $expNumYear, $expNumType, $changeStatusAuto, $priceExp, '$extraID', $covid, '$deceasedLocality', '$deceasedProvince', $moveTraslado, $moveDevolucion,
                        '$trazabilityId', $funeralDateNew, $funeralTimeNew, $funeralDateBurial, $funeralTimeBurial, $tpv, $authDniType, $velatorioEntryDate, $velatorioEntryTime,
                        $startVelacionDate, $startVelacionTime, $hearse, $placeDestinationMiddle, $placeDestinationFinal, $placeDestinationFinalCemetery, $hiring_rectified,
                        $smokeOpacityDateStart, $smokeOpacityTimeStart, $smokeOpacityDateEnd, $smokeOpacityTimeEnd, $smokeOpacityLoadWeight, $smokeOpacityBacharachScale,
                        $smokeOpacityDateReading, $smokeOpacityTimeReading, $smokeOpacityIncidents, '$smokeOpacityIncidentsNotes', '$notesExpedient', '$tellmebyeRoom', '$tellmebyeRoomName',
                        $entryDateBarrow, $entryTimeBarrow, '$internalRef', $endVelacionDate, $endVelacionTime, $startVelacionDate2, $startVelacionTime2, $endVelacionDate2, $endVelacionTime2,
                        '$deceasedNiche2', $funeralDateNiche2, '$deceasedNiche3', $funeralDateNiche3, '$agency', '$agencyContact', '$agencyContactPhone', $departureDate, $arrivalDate,
                        '$carCollection1LicensePlate', '$carCollection1Brand', '$carCollection1Model', '$hearseLicensePlate', '$hearseBrand', '$hearseModel', '$mortuaryRegNotes', $next_invoice_status,
                        $duplicate_origin, $duplicate_user, $duplicate_date
                    )
        ";

        $result = $db->query($query);
        if(!$result){
            throw new Exception($query);
        }

        $newExpedientId = $db->getLastInsertId();

        $newExpedientBaseDir = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/$newExpedientId";
        $created = mkdir($newExpedientBaseDir, 0777, true);
        if(!$created){
            throw new Exception("Create folder: $newExpedientBaseDir");
        }
        // End table: Expedients

        // Start table: Expedients_Services
        $query = "  SELECT  choir, bellringer, funeralHomeService, corpseCollection1, corpseCollection2, familyAssistance,
                            carCollection, arriveTime, arriveDate, revReqCheck, control, dni, priestTime, priestTimeCheck, gravediggersCheck,
                            gravediggersCheckPrinted, gravediggersCheckSigned, gravediggersNotApply, notifiedChoir, notifiedBellringer,
                            carriersTime, carriersTimeCheck, notes, routeSummary, notesSummary, churchSummary, licenseSummary, reminderSummary,
                            deliveryReceiptSummary, priestsNotification, gravediggersNotification, carriersNotification, choirsNotification,
                            bellringersNotification, carsNotification, policeNotified, policeNotApply, policeLocation, webNotApply, webConfirm,
                            webLink, doctorDone, doctorDeliver, doctorNotApply, doctorInProgress, tribunalDeliver, tribunalNotApply, tribunalInProgress,
                            tribunalLocation, tribunalUser, literalReceived, literalNoFinished, literalRequest, literalVolumePage, literalWhoTakes,
                            literalCivilRegister, literalDateExit, literalTimeExit, literalNotApply, tombstone, preparationNotApply, preparationConfirm,
                            policeNotification, webNotification, preparationNotification, doctorNotification, tribunalNotification, controlNotification,
                            reminderNotifications, flowerNotification, busNotification, taxiNotification, notApplyAll, tombstoneNotApply, tombstonePrint,
                            vivoSent, vivoNotApply, crematoriumWhoDelivered, crematoriumNotes, crematoriumProgramOven, crematoriumControlDeliversAshes,
                            crematoriumWhoProgramOven, crematoriumFirstGenerateDocDate, crematoriumFirstGenerateDocUser, priestInspected, priestPayed,
                            priestNotes, sinceAniversaryWeb, untilAniversaryWeb, showAgeObituaryWeb, churchAniversaryWeb, dateAniversaryWeb,
                            timeAniversaryWeb, poll, carCollection2, staffTransfer1, staffTransfer2, surveyNotApply, surveySend,
                            showFinalDestinationWeb, showVelationWeb, showCeremonyWeb
                    FROM    Expedients_Services
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current expedient service data');
        }

        $currentExpedientServiceData = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        if($currentExpedientServiceData == null){
            throw new Exception('Get current expedient service data');
        }

        $choir = $currentExpedientServiceData['choir'] == null ? 'null' : $currentExpedientServiceData['choir'];
        $bellringer = $currentExpedientServiceData['bellringer'] == null ? 'null' : $currentExpedientServiceData['bellringer'];
        $funeralHomeService = $currentExpedientServiceData['funeralHomeService'] == null ? 'null' : $currentExpedientServiceData['funeralHomeService'];
        $corpseCollection1 = $currentExpedientServiceData['corpseCollection1'] == null ? 'null' : $currentExpedientServiceData['corpseCollection1'];
        $corpseCollection2 = $currentExpedientServiceData['corpseCollection2'] == null ? 'null' : $currentExpedientServiceData['corpseCollection2'];
        $familyAssistance = $currentExpedientServiceData['familyAssistance'] == null ? 'null' : $currentExpedientServiceData['familyAssistance'];
        $carCollection = $currentExpedientServiceData['carCollection'] == null ? 'null' : $currentExpedientServiceData['carCollection'];
        $arriveTime = $currentExpedientServiceData['arriveTime'] == null ? 'null' : "'" . $currentExpedientServiceData['arriveTime'] . "'";
        $arriveDate = $currentExpedientServiceData['arriveDate'] == null ? 'null' : "'" . $currentExpedientServiceData['arriveDate'] . "'";
        $revReqCheck = $currentExpedientServiceData['revReqCheck'] == null ? 0 : $currentExpedientServiceData['revReqCheck'];
        $control = $currentExpedientServiceData['control'] == null ? 0 : $currentExpedientServiceData['control'];
        $dni = $currentExpedientServiceData['dni'];
        $priestTime = $currentExpedientServiceData['priestTime'] == null ? 'null' : "'" . $currentExpedientServiceData['priestTime'] . "'";
        $priestTimeCheck = $currentExpedientServiceData['priestTimeCheck'] == null ? 0 : $currentExpedientServiceData['priestTimeCheck'];
        $gravediggersCheck = $currentExpedientServiceData['gravediggersCheck'] == null ? 0 : $currentExpedientServiceData['gravediggersCheck'];
        $gravediggersCheckPrinted = $currentExpedientServiceData['gravediggersCheckPrinted'] == null ? 0 : $currentExpedientServiceData['gravediggersCheckPrinted'];
        $gravediggersCheckSigned = $currentExpedientServiceData['gravediggersCheckSigned'] == null ? 0 : $currentExpedientServiceData['gravediggersCheckSigned'];
        $gravediggersNotApply = $currentExpedientServiceData['gravediggersNotApply'] == null ? 0 : $currentExpedientServiceData['gravediggersNotApply'];
        $notifiedChoir = $currentExpedientServiceData['notifiedChoir'] == null ? 0 : $currentExpedientServiceData['notifiedChoir'];
        $notifiedBellringer = $currentExpedientServiceData['notifiedBellringer'] == null ? 0 : $currentExpedientServiceData['notifiedBellringer'];
        $carriersTime = $currentExpedientServiceData['carriersTime'] == null ? 'null' : "'" . $currentExpedientServiceData['carriersTime'] . "'";
        $carriersTimeCheck = $currentExpedientServiceData['carriersTimeCheck'] == null ? 0 : $currentExpedientServiceData['carriersTimeCheck'];
        $notes = $currentExpedientServiceData['notes'];
        $routeSummary = $currentExpedientServiceData['routeSummary'];
        $notesSummary = $currentExpedientServiceData['notesSummary'];
        $churchSummary = $currentExpedientServiceData['churchSummary'] == null ? 0 : $currentExpedientServiceData['churchSummary'];
        $licenseSummary = $currentExpedientServiceData['licenseSummary'] == null ? 0 : $currentExpedientServiceData['licenseSummary'];
        $reminderSummary = $currentExpedientServiceData['reminderSummary'] == null ? 0 : $currentExpedientServiceData['reminderSummary'];
        $deliveryReceiptSummary = $currentExpedientServiceData['deliveryReceiptSummary'] == null ? 0 : $currentExpedientServiceData['deliveryReceiptSummary'];
        $priestsNotification = $currentExpedientServiceData['priestsNotification'] == null ? 0 : $currentExpedientServiceData['priestsNotification'];
        $gravediggersNotification = $currentExpedientServiceData['gravediggersNotification'] == null ? 0 : $currentExpedientServiceData['gravediggersNotification'];
        $carriersNotification = $currentExpedientServiceData['carriersNotification'] == null ? 0 : $currentExpedientServiceData['carriersNotification'];
        $choirsNotification = $currentExpedientServiceData['choirsNotification'] == null ? 0 : $currentExpedientServiceData['choirsNotification'];
        $bellringersNotification = $currentExpedientServiceData['bellringersNotification'] == null ? 0 : $currentExpedientServiceData['bellringersNotification'];
        $carsNotification = $currentExpedientServiceData['carsNotification'] == null ? 0 : $currentExpedientServiceData['carsNotification'];
        $policeNotified = $currentExpedientServiceData['policeNotified'] == null ? 0 : $currentExpedientServiceData['policeNotified'];
        $policeNotApply = $currentExpedientServiceData['policeNotApply'] == null ? 0 : $currentExpedientServiceData['policeNotApply'];
        $policeLocation = $currentExpedientServiceData['policeLocation'];
        $webNotApply = $currentExpedientServiceData['webNotApply'] == null ? 0 : $currentExpedientServiceData['webNotApply'];
        $webConfirm = $currentExpedientServiceData['webConfirm'] == null ? 0 : $currentExpedientServiceData['webConfirm'];
        $webLink = $currentExpedientServiceData['webLink'];
        $doctorDone = $currentExpedientServiceData['doctorDone'] == null ? 0 : $currentExpedientServiceData['doctorDone'];
        $doctorDeliver = $currentExpedientServiceData['doctorDeliver'] == null ? 'null' : $currentExpedientServiceData['doctorDeliver'];
        $doctorNotApply = $currentExpedientServiceData['doctorNotApply'] == null ? 0 : $currentExpedientServiceData['doctorNotApply'];
        $doctorInProgress = $currentExpedientServiceData['doctorInProgress'] == null ? 0 : $currentExpedientServiceData['doctorInProgress'];
        $tribunalDeliver = $currentExpedientServiceData['tribunalDeliver'] == null ? 0 : $currentExpedientServiceData['tribunalDeliver'];
        $tribunalNotApply = $currentExpedientServiceData['tribunalNotApply'] == null ? 0 : $currentExpedientServiceData['tribunalNotApply'];
        $tribunalInProgress = $currentExpedientServiceData['tribunalInProgress'] == null ? 0 : $currentExpedientServiceData['tribunalInProgress'];
        $tribunalLocation = $currentExpedientServiceData['tribunalLocation'];
        $tribunalUser = $currentExpedientServiceData['tribunalUser'] == null ? 'null' : $currentExpedientServiceData['tribunalUser'];
        $literalReceived = $currentExpedientServiceData['literalReceived'] == null ? 0 : $currentExpedientServiceData['literalReceived'];
        $literalNoFinished = $currentExpedientServiceData['literalNoFinished'] == null ? 0 : $currentExpedientServiceData['literalNoFinished'];
        $literalRequest = $currentExpedientServiceData['literalRequest'] == null ? 0 : $currentExpedientServiceData['literalRequest'];
        $literalVolumePage = $currentExpedientServiceData['literalVolumePage'];
        $literalWhoTakes = $currentExpedientServiceData['literalWhoTakes'];
        $literalCivilRegister = $currentExpedientServiceData['literalCivilRegister'];
        $literalDateExit = $currentExpedientServiceData['literalDateExit'] == null ? 'null' : "'" . $currentExpedientServiceData['literalDateExit'] . "'";
        $literalTimeExit = $currentExpedientServiceData['literalTimeExit'];
        $literalNotApply = $currentExpedientServiceData['literalNotApply'] == null ? 0 : $currentExpedientServiceData['literalNotApply'];
        $tombstone = $currentExpedientServiceData['tombstone'];
        $preparationNotApply = $currentExpedientServiceData['preparationNotApply'] == null ? 0 : $currentExpedientServiceData['preparationNotApply'];
        $preparationConfirm = $currentExpedientServiceData['preparationConfirm'] == null ? 0 : $currentExpedientServiceData['preparationConfirm'];
        $policeNotification = $currentExpedientServiceData['policeNotification'] == null ? 0 : $currentExpedientServiceData['policeNotification'];
        $webNotification = $currentExpedientServiceData['webNotification'] == null ? 0 : $currentExpedientServiceData['webNotification'];
        $preparationNotification = $currentExpedientServiceData['preparationNotification'] == null ? 0 : $currentExpedientServiceData['preparationNotification'];
        $doctorNotification = $currentExpedientServiceData['doctorNotification'] == null ? 0 : $currentExpedientServiceData['doctorNotification'];
        $tribunalNotification = $currentExpedientServiceData['tribunalNotification'] == null ? 0 : $currentExpedientServiceData['tribunalNotification'];
        $controlNotification = $currentExpedientServiceData['controlNotification'] == null ? 0 : $currentExpedientServiceData['controlNotification'];
        $reminderNotifications = $currentExpedientServiceData['reminderNotifications'] == null ? 0 : $currentExpedientServiceData['reminderNotifications'];
        $flowerNotification = $currentExpedientServiceData['flowerNotification'] == null ? 0 : $currentExpedientServiceData['flowerNotification'];
        $busNotification = $currentExpedientServiceData['busNotification'] == null ? 0 : $currentExpedientServiceData['busNotification'];
        $taxiNotification = $currentExpedientServiceData['taxiNotification'] == null ? 0 : $currentExpedientServiceData['taxiNotification'];
        $notApplyAll = $currentExpedientServiceData['notApplyAll'] == null ? 0 : $currentExpedientServiceData['notApplyAll'];
        $tombstoneNotApply = $currentExpedientServiceData['tombstoneNotApply'] == null ? 0 : $currentExpedientServiceData['tombstoneNotApply'];
        $tombstonePrint = $currentExpedientServiceData['tombstonePrint'] == null ? 0 : $currentExpedientServiceData['tombstonePrint'];
        $vivoSent = $currentExpedientServiceData['vivoSent'] == null ? 0 : $currentExpedientServiceData['vivoSent'];
        $vivoNotApply = $currentExpedientServiceData['vivoNotApply'] == null ? 0 : $currentExpedientServiceData['vivoNotApply'];
        $crematoriumWhoDelivered = $currentExpedientServiceData['crematoriumWhoDelivered'] == null ? 'null' : $currentExpedientServiceData['crematoriumWhoDelivered'];
        $crematoriumNotes = $currentExpedientServiceData['crematoriumNotes'];
        $crematoriumProgramOven = $currentExpedientServiceData['crematoriumProgramOven'] == null ? 0 : $currentExpedientServiceData['crematoriumProgramOven'];
        $crematoriumControlDeliversAshes = $currentExpedientServiceData['crematoriumControlDeliversAshes'] == null ? 0 : $currentExpedientServiceData['crematoriumControlDeliversAshes'];
        $crematoriumWhoProgramOven = $currentExpedientServiceData['crematoriumWhoProgramOven'] == null ? 'null' : $currentExpedientServiceData['crematoriumWhoProgramOven'];
        $crematoriumFirstGenerateDocDate = $currentExpedientServiceData['crematoriumFirstGenerateDocDate'] == null ? 'null' : $currentExpedientServiceData['crematoriumFirstGenerateDocDate'];
        $crematoriumFirstGenerateDocUser = $currentExpedientServiceData['crematoriumFirstGenerateDocUser'] == null ? 'null' : $currentExpedientServiceData['crematoriumFirstGenerateDocUser'];
        $priestInspected = $currentExpedientServiceData['priestInspected'] == null ? 0 : $currentExpedientServiceData['priestInspected'];
        $priestPayed = $currentExpedientServiceData['priestPayed'] == null ? 0 : $currentExpedientServiceData['priestPayed'];
        $priestNotes = $currentExpedientServiceData['priestNotes'];
        $sinceAniversaryWeb = $currentExpedientServiceData['sinceAniversaryWeb'] == null ? 'null' : "'" . $currentExpedientServiceData['sinceAniversaryWeb'] . "'";
        $untilAniversaryWeb = $currentExpedientServiceData['untilAniversaryWeb'] == null ? 'null' : "'" . $currentExpedientServiceData['untilAniversaryWeb'] . "'";
        $showAgeObituaryWeb = $currentExpedientServiceData['showAgeObituaryWeb'] == null ? 0 : $currentExpedientServiceData['showAgeObituaryWeb'];
        $churchAniversaryWeb = $currentExpedientServiceData['churchAniversaryWeb'] == null ? 'null' : $currentExpedientServiceData['churchAniversaryWeb'];
        $dateAniversaryWeb = $currentExpedientServiceData['dateAniversaryWeb'] == null ? 'null' : "'" . $currentExpedientServiceData['dateAniversaryWeb'] . "'";
        $timeAniversaryWeb = $currentExpedientServiceData['timeAniversaryWeb'] == null ? 'null' : "'" . $currentExpedientServiceData['timeAniversaryWeb'] . "'";
        $poll = $currentExpedientServiceData['poll'] == null ? 'null' : $currentExpedientServiceData['poll'];
        $carCollection2 = $currentExpedientServiceData['carCollection2'] == null ? 'null' : $currentExpedientServiceData['carCollection2'];
        $staffTransfer1 = $currentExpedientServiceData['staffTransfer1'] == null ? 'null' : $currentExpedientServiceData['staffTransfer1'];
        $staffTransfer2 = $currentExpedientServiceData['staffTransfer2'] == null ? 'null' : $currentExpedientServiceData['staffTransfer2'];
        $surveyNotApply = $currentExpedientServiceData['surveyNotApply'] == null ? 0 : $currentExpedientServiceData['surveyNotApply'];
        $surveySend = $currentExpedientServiceData['surveySend'] == null ? 0 : $currentExpedientServiceData['surveySend'];
        $showFinalDestinationWeb = $currentExpedientServiceData['showFinalDestinationWeb'] == null ? 0 : $currentExpedientServiceData['showFinalDestinationWeb'];
        $showVelationWeb = $currentExpedientServiceData['showVelationWeb'] == null ? 0 : $currentExpedientServiceData['showVelationWeb'];
        $showCeremonyWeb = $currentExpedientServiceData['showCeremonyWeb'] == null ? 0 : $currentExpedientServiceData['showCeremonyWeb'];

        $query = "  INSERT INTO Expedients_Services(
                        expedient, choir, bellringer, funeralHomeService, corpseCollection1, corpseCollection2, familyAssistance,
                        carCollection, arriveTime, arriveDate, revReqCheck, control, dni, priestTime, priestTimeCheck, gravediggersCheck,
                        gravediggersCheckPrinted, gravediggersCheckSigned, gravediggersNotApply, notifiedChoir, notifiedBellringer,
                        carriersTime, carriersTimeCheck, notes, routeSummary, notesSummary, churchSummary, licenseSummary, reminderSummary,
                        deliveryReceiptSummary, priestsNotification, gravediggersNotification, carriersNotification, choirsNotification,
                        bellringersNotification, carsNotification, policeNotified, policeNotApply, policeLocation, webNotApply, webConfirm,
                        webLink, doctorDone, doctorDeliver, doctorNotApply, doctorInProgress, tribunalDeliver, tribunalNotApply, tribunalInProgress,
                        tribunalLocation, tribunalUser, literalReceived, literalNoFinished, literalRequest, literalVolumePage, literalWhoTakes,
                        literalCivilRegister, literalDateExit, literalTimeExit, literalNotApply, tombstone, preparationNotApply, preparationConfirm,
                        policeNotification, webNotification, preparationNotification, doctorNotification, tribunalNotification, controlNotification,
                        reminderNotifications, flowerNotification, busNotification, taxiNotification, notApplyAll, tombstoneNotApply, tombstonePrint,
                        vivoSent, vivoNotApply, crematoriumWhoDelivered, crematoriumNotes, crematoriumProgramOven, crematoriumControlDeliversAshes,
                        crematoriumWhoProgramOven, crematoriumFirstGenerateDocDate, crematoriumFirstGenerateDocUser, priestInspected, priestPayed,
                        priestNotes, sinceAniversaryWeb, untilAniversaryWeb, showAgeObituaryWeb, churchAniversaryWeb, dateAniversaryWeb,
                        timeAniversaryWeb, poll, carCollection2, staffTransfer1, staffTransfer2, surveyNotApply, surveySend,
                        showFinalDestinationWeb, showVelationWeb, showCeremonyWeb
                    )
                    VALUES (
                        $newExpedientId, $choir, $bellringer, $funeralHomeService, $corpseCollection1, $corpseCollection2, $familyAssistance,
                        $carCollection, $arriveTime, $arriveDate, $revReqCheck, $control, '$dni', $priestTime, $priestTimeCheck, $gravediggersCheck,
                        $gravediggersCheckPrinted, $gravediggersCheckSigned, $gravediggersNotApply, $notifiedChoir, $notifiedBellringer,
                        $carriersTime, $carriersTimeCheck, '$notes', '$routeSummary', '$notesSummary', $churchSummary, $licenseSummary, $reminderSummary,
                        $deliveryReceiptSummary, $priestsNotification, $gravediggersNotification, $carriersNotification, $choirsNotification,
                        $bellringersNotification, $carsNotification, $policeNotified, $policeNotApply, '$policeLocation', $webNotApply, $webConfirm,
                        '$webLink', $doctorDone, $doctorDeliver, $doctorNotApply, $doctorInProgress, $tribunalDeliver, $tribunalNotApply, $tribunalInProgress,
                        '$tribunalLocation', $tribunalUser, $literalReceived, $literalNoFinished, $literalRequest, '$literalVolumePage', '$literalWhoTakes',
                        '$literalCivilRegister', $literalDateExit, '$literalTimeExit', $literalNotApply, '$tombstone', $preparationNotApply, $preparationConfirm,
                        $policeNotification, $webNotification, $preparationNotification, $doctorNotification, $tribunalNotification, $controlNotification,
                        $reminderNotifications, $flowerNotification, $busNotification, $taxiNotification, $notApplyAll, $tombstoneNotApply, $tombstonePrint,
                        $vivoSent, $vivoNotApply, $crematoriumWhoDelivered, '$crematoriumNotes', $crematoriumProgramOven, $crematoriumControlDeliversAshes,
                        $crematoriumWhoProgramOven, $crematoriumFirstGenerateDocDate, $crematoriumFirstGenerateDocUser, $priestInspected, $priestPayed,
                        '$priestNotes', $sinceAniversaryWeb, $untilAniversaryWeb, $showAgeObituaryWeb, $churchAniversaryWeb, $dateAniversaryWeb,
                        $timeAniversaryWeb, $poll, $carCollection2, $staffTransfer1, $staffTransfer2, $surveyNotApply, $surveySend,
                        $showFinalDestinationWeb, $showVelationWeb, $showCeremonyWeb
                    )
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception($query);
        }
        // End table: Expedients_Services

        // Start table: Expedients_Hirings + Expedients Texts + Services_Auto
        $query = "  SELECT  ID, template, product, model, supplier, retail, amount, texts, discount, total,
                            `check`, extraID, warehouse, num_hiring, old_hiring, priceExp
                    FROM    Expedients_Hirings
                    WHERE   expedient = $expedientId AND
                            num_hiring = (SELECT MAX(eh2.num_hiring) FROM Expedients_Hirings eh2 WHERE eh2.expedient = $expedientId)
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current expedient hirings data');
        }

        $currentExpedientServiceData = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        if($currentExpedientServiceData == null){
            throw new Exception('Get current expedient hirings data');
        }

        // Services auto
        $query = "  SELECT  service, model, action, value, status, hiring
                    FROM    Services_Auto
                    WHERE   service = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current services auto data');
        }

        $currentServiceAutoData = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentServiceAutoData as $item){
            $model = $item['model'] == null ? 'null' : $item['model'];
            $action = $item['action'] == null ? 'null' : $item['action'];
            $value = $item['value'] == null ? '' : $item['value'];
            $status = $item['status'] == null ? 0 : $item['status'];
            $hiring = 'null';

            $query = "  INSERT INTO Services_Auto(
                            service, model, action, value, status, hiring
                        )
                        VALUES (
                            $newExpedientId, $model, $action, '$value', $status, $hiring
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }
        }

        foreach($currentExpedientServiceData as $index => $elem){
            $hiringId = $elem['ID'];
            $template = $elem['template'] == null ? 'null' : $elem['template'];
            $product = $elem['product'] == null ? 'null' : $elem['product'];
            $model = $elem['model'] == null ? 'null' : $elem['model'];
            $supplier = $elem['supplier'] == null ? 'null' : $elem['supplier'];
            $retail = $elem['retail'] == null ? 'null' : $elem['retail'];
            $amount = $elem['amount'] == null ? 0 : $elem['amount'];
            $texts = $elem['texts'] == null ? '' : $elem['texts'];
            $discount = $elem['discount'] == null ? 0 : $elem['discount'];
            $total = $elem['total'] == null ? 0 : $elem['total'];
            $check = $elem['check'] == null ? 0 : $elem['check'];
            $warehouse = $elem['warehouse'] == null ? 'null' : $elem['warehouse'];
            $num_hiring = $elem['num_hiring'] == null ? 0 : $elem['num_hiring'];
            $priceExp = $elem['priceExp'] == null ? 'null' : $elem['priceExp'];

            $result = $db->query("  SELECT  MAX(ID) as id
                                    FROM    Expedients_Hirings
            ");

            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
            $extraID = $maxID.$index;

            $query = "  INSERT INTO Expedients_Hirings(
                            expedient, template, product, model, supplier, retail, amount, texts, discount, total,
                            `check`, extraID, warehouse, num_hiring, priceExp
                        )
                        VALUES (
                            $newExpedientId, $template, $product, $model, $supplier, $retail, $amount, '$texts', $discount, $total,
                            $check, '$extraID', $warehouse, $num_hiring, $priceExp
                        )
            ";
            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }
            $newHiringId = $db->getLastInsertId();

            // Get current texts associated
            $query = "  SELECT  hiring, rowIndex, value, discount
                        FROM    Expedients_Texts
                        WHERE   hiring = $hiringId
            ";
            $result = $db->query($query);
            if(!$result){
                throw new Exception('Get current expedient texts data');
            }

            $currentExpedientTextsData = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
            foreach($currentExpedientTextsData as $item){
                $rowIndex = $item['rowIndex'] == null ? 0 : $item['rowIndex'];
                $value = $item['value'] == null ? '' : $item['value'];
                $discount = $item['discount'] == null ? 0 : $item['discount'];

                $query = "  INSERT INTO Expedients_Texts(
                                hiring, rowIndex, value, discount
                            )
                            VALUES (
                                $newHiringId, $rowIndex, '$value', $discount
                            )
                ";

                $result = $db->query($query);
                if(!$result){
                    throw new Exception($query);
                }
            }

            $query = "  SELECT  ID
                        FROM    Services_Auto
                        WHERE   service = $newExpedientId AND
                                model = $model
            ";
            $result = $db->query($query);
            if(!$result){
                throw new Exception('Get services auto data');
            }

            $serviceAutoId = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
            foreach($serviceAutoId as $item){
                $query = "  UPDATE  Services_Auto
                            SET     hiring = $newHiringId
                            WHERE   ID = {$item['ID']}
                ";
                $result = $db->query($query);
                if(!$result){
                    throw new Exception($query);
                }
            }

            // Gets pre orders
            $query = "  SELECT  hiring, `order`, sentEmail, sendCopy, leavingDate
                        FROM    Pre_Orders
                        WHERE   hiring = $hiringId
            ";
            $result = $db->query($query);
            if(!$result){
                throw new Exception('Get pre orders data');
            }
            $currentPreOrdersInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();

            foreach($currentPreOrdersInfo as $item){
                $order = 'null';
                $sentEmail = 0;
                $sendCopy = 'null';
                $leavingDate = $item['leavingDate'] == null ? 'null' : $item['leavingDate'];

                $query = "  INSERT INTO Pre_Orders(
                                hiring, `order`, sentEmail, sendCopy, leavingDate
                            )
                            VALUES (
                                $newHiringId, $order, $sentEmail, $sendCopy, $leavingDate
                            )
                ";

                $result = $db->query($query);
                if(!$result){
                    throw new Exception($query);
                }
            }
        }
        // End table: Expedients_Hirings + Expedients Texts + Services_Auto

        // Start table: Services_Bellringers
        $query = "  SELECT  service, bellringer, notified, day, fromTime, toTime
                    FROM    Services_Bellringers
                    WHERE   service = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current services bellringers data');
        }

        $currentServiceBellringers = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentServiceBellringers as $elem){
            $bellringer = $elem['bellringer'] == null ? 'null' : $elem['bellringer'];
            $notified = $elem['notified'] == null ? 0 : $elem['notified'];
            $day = $elem['day'] == null ? 'null' : "'" . $elem['day'] . "'";
            $fromTime = $elem['fromTime'] == null ? 'null' : "'" . $elem['fromTime'] . "'";
            $toTime = $elem['toTime'] == null ? 'null' : "'" . $elem['toTime'] . "'";

            $query = "  INSERT INTO Services_Bellringers(
                            service, bellringer, notified, day, fromTime, toTime
                        )
                        VALUES (
                            $newExpedientId, $bellringer, $notified, $day, $fromTime, $toTime
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }   
        }
        // End table: Services_Bellringers

        // Start table: Services_Carriers
        $query = "  SELECT  service, carrier, confirmed, day, fromTime, toTime
                    FROM    Services_Carriers
                    WHERE   service = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current services carriers data');
        }

        $currentServiceCarriers = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentServiceCarriers as $elem){
            $carrier = $elem['carrier'] == null ? 'null' : $elem['carrier'];
            $confirmed = $elem['confirmed'] == null ? 0 : $elem['confirmed'];
            $day = $elem['day'] == null ? 'null' : "'" . $elem['day'] . "'";
            $fromTime = $elem['fromTime'] == null ? 'null' : "'" . $elem['fromTime'] . "'";
            $toTime = $elem['toTime'] == null ? 'null' : "'" . $elem['toTime'] . "'";

            $query = "  INSERT INTO Services_Carriers(
                            service, carrier, confirmed, day, fromTime, toTime
                        )
                        VALUES (
                            $newExpedientId, $carrier, $confirmed, $day, $fromTime, $toTime
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }   
        }
        // End table: Services_Carriers

        // Start table: Services_Cars
        $query = "  SELECT  service, car, driver, cleanBefore, cleanAfter
                    FROM    Services_Cars
                    WHERE   service = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current services carriers data');
        }

        $currentServiceCars = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentServiceCars as $elem){
            $car = $elem['car'] == null ? 'null' : $elem['car'];
            $driver = $elem['driver'] == null ? 'null' : $elem['driver'];
            $cleanBefore = $elem['cleanBefore'] == null ? 'null' : $elem['cleanBefore'];
            $cleanAfter = $elem['cleanAfter'] == null ? 'null' : $elem['cleanAfter'];

            $query = "  INSERT INTO Services_Cars(
                            service, car, driver, cleanBefore, cleanAfter
                        )
                        VALUES (
                            $newExpedientId, $car, $driver, $cleanBefore, $cleanAfter
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }   
        }
        // End table: Services_Cars

        // Start table: Services_Choirs
        $query = "  SELECT  service, choir, notified, day, fromTime, toTime
                    FROM    Services_Choirs
                    WHERE   service = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current services choirs data');
        }

        $currentServiceChoirs = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentServiceChoirs as $elem){
            $choir = $elem['choir'] == null ? 'null' : $elem['choir'];
            $notified = $elem['notified'] == null ? 0 : $elem['notified'];
            $day = $elem['day'] == null ? 'null' : "'" . $elem['day'] . "'";
            $fromTime = $elem['fromTime'] == null ? 'null' : "'" . $elem['fromTime'] . "'";
            $toTime = $elem['toTime'] == null ? 'null' : "'" . $elem['toTime'] . "'";

            $query = "  INSERT INTO Services_Choirs(
                            service, choir, notified, day, fromTime, toTime
                        )
                        VALUES (
                            $newExpedientId, $choir, $notified, $day, $fromTime, $toTime
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }   
        }
        // End table: Services_Choirs

        // Start table: Services_Gravediggers
        $query = "  SELECT  service, gravedigger, notified, day, fromTime, toTime
                    FROM    Services_Gravediggers
                    WHERE   service = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current services gravediggers data');
        }

        $currentServiceGravediggers = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentServiceGravediggers as $elem){
            $gravedigger = $elem['gravedigger'] == null ? 'null' : $elem['gravedigger'];
            $notified = $elem['notified'] == null ? 0 : $elem['notified'];
            $day = $elem['day'] == null ? 'null' : "'" . $elem['day'] . "'";
            $fromTime = $elem['fromTime'] == null ? 'null' : "'" . $elem['fromTime'] . "'";
            $toTime = $elem['toTime'] == null ? 'null' : "'" . $elem['toTime'] . "'";

            $query = "  INSERT INTO Services_Gravediggers(
                            service, gravedigger, notified, day, fromTime, toTime
                        )
                        VALUES (
                            $newExpedientId, $gravedigger, $notified, $day, $fromTime, $toTime
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }   
        }
        // End table: Services_Gravediggers

        // Start table: Services_Priests
        $query = "  SELECT  service, priest, notified, day, fromTime, toTime
                    FROM    Services_Priests
                    WHERE   service = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current services priests data');
        }

        $currentServicePriests = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentServicePriests as $elem){
            $priest = $elem['priest'] == null ? 'null' : $elem['priest'];
            $notified = $elem['notified'] == null ? 0 : $elem['notified'];
            $day = $elem['day'] == null ? 'null' : "'" . $elem['day'] . "'";
            $fromTime = $elem['fromTime'] == null ? 'null' : "'" . $elem['fromTime'] . "'";
            $toTime = $elem['toTime'] == null ? 'null' : "'" . $elem['toTime'] . "'";

            $query = "  INSERT INTO Services_Priests(
                            service, priest, notified, day, fromTime, toTime
                        )
                        VALUES (
                            $newExpedientId, $priest, $notified, $day, $fromTime, $toTime
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }   
        }
        // End table: Services_Priests

        // Start table: Services_Control
        $query = "  SELECT  assistance, notes, mailTo, send, sent
                    FROM    Services_Control
                    WHERE   service = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current services control data');
        }
        $currentServiceControl = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentServiceControl as $elem){
            $assistance = $elem['assistance'] == null ? 'null' : "'" . $elem['assistance'] . "'";
            $notes = $elem['notes'] == null ? 'null' : "'" . $elem['notes'] . "'";
            $mailTo = $elem['mailTo'] == null ? 'null' : "'" . $elem['mailTo'] . "'";
            $send = $elem['send'] == null ? 'null' : "'" . $elem['send'] . "'";
            $sent = $elem['sent'] == null ? 0 : $elem['sent'];

            $query = "  INSERT INTO Services_Control(
                            service, assistance, notes, mailTo, send, sent
                        )
                        VALUES (
                            $newExpedientId, $assistance, $notes, $mailTo, $send, $sent
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }   
        }
        // End table: Services_Control

        // Start table: Services_Control_Emails
        $query = "  SELECT  email
                    FROM    Services_Control_Emails
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current services control emails data');
        }
        $currentServiceControlEmails = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentServiceControlEmails as $elem){
            $email = $elem['email'] == null ? 1 : $elem['email'];

            $query = "  INSERT INTO Services_Control_Emails(
                            expedient, email
                        )
                        VALUES (
                            $newExpedientId, $email
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }   
        }
        // End table: Services_Control_Emails

        // Start table: Survey_Clients_Info
        $query = "  SELECT  survey, service, value, notes
                    FROM    Survey_Clients_Info
                    WHERE   service = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current survey clients info data');
        }
        $currentSurveyClientsInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentSurveyClientsInfo as $elem){
            $survey = $elem['survey'] == null ? 'null' : $elem['survey'];
            $value = $elem['value'] == null ? 'null' : $elem['value'];
            $notes = $elem['notes'] == null ? 'null' : "'" . $elem['notes'] . "'";

            $query = "  INSERT INTO Survey_Clients_Info(
                            survey, service, value, notes
                        )
                        VALUES (
                            $survey, $newExpedientId, $value, $notes
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }   
        }
        // End table: Survey_Clients_Info

        // Start table: Satisfaction_Survey
        $query = "  SELECT  expedient, attention, advice, time, cafe, room, building, crematorium, cleaning, organization, doubt,
                            attentionText, adviceText, timeText, cafeText, roomText, buildingText, crematoriumText, cleaningText,
                            organizationText, doubtText, aspects, date, relationship, name
                    FROM    Satisfaction_Survey
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current satisfaction survey data');
        }
        $currentSatifactionSurveyInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentSatifactionSurveyInfo as $elem){
            $attention = $elem['attention'] == null ? 'null' : $elem['attention'];
            $advice = $elem['advice'] == null ? 'null' : $elem['advice'];
            $time = $elem['time'] == null ? 'null' : $elem['time'];
            $cafe = $elem['cafe'] == null ? 'null' : $elem['cafe'];
            $room = $elem['room'] == null ? 'null' : $elem['room'];
            $building = $elem['building'] == null ? 'null' : $elem['building'];
            $crematorium = $elem['crematorium'] == null ? 'null' : $elem['crematorium'];
            $cleaning = $elem['cleaning'] == null ? 'null' : $elem['cleaning'];
            $organization = $elem['organization'] == null ? 'null' : $elem['organization'];
            $doubt = $elem['doubt'] == null ? 'null' : $elem['doubt'];
            $attentionText = $elem['attentionText'] == null ? 'null' : "'" . $elem['attentionText'] . "'";
            $adviceText = $elem['adviceText'] == null ? 'null' : "'" . $elem['adviceText'] . "'";
            $timeText = $elem['timeText'] == null ? 'null' : "'" . $elem['timeText'] . "'";
            $cafeText = $elem['cafeText'] == null ? 'null' : "'" . $elem['cafeText'] . "'";
            $roomText = $elem['roomText'] == null ? 'null' : "'" . $elem['roomText'] . "'";
            $buildingText = $elem['buildingText'] == null ? 'null' : "'" . $elem['buildingText'] . "'";
            $crematoriumText = $elem['crematoriumText'] == null ? 'null' : "'" . $elem['crematoriumText'] . "'";
            $cleaningText = $elem['cleaningText'] == null ? 'null' : "'" . $elem['cleaningText'] . "'";
            $organizationText = $elem['organizationText'] == null ? 'null' : "'" . $elem['organizationText'] . "'";
            $doubtText = $elem['doubtText'] == null ? 'null' : "'" . $elem['doubtText'] . "'";
            $aspects = $elem['aspects'] == null ? 'null' : "'" . $elem['aspects'] . "'";
            $date = $elem['date'] == null ? 'null' : $elem['date'];
            $relationship = $elem['relationship'] == null ? 'null' : "'" . $elem['relationship'] . "'";
            $name = $elem['name'] == null ? 'null' : "'" . $elem['name'] . "'";

            $query = "  INSERT INTO Satisfaction_Survey(
                            expedient, attention, advice, time, cafe, room, building, crematorium, cleaning, organization, doubt,
                            attentionText, adviceText, timeText, cafeText, roomText, buildingText, crematoriumText, cleaningText,
                            organizationText, doubtText, aspects, date, relationship, name
                        )
                        VALUES (
                            $newExpedientId, $attention, $advice, $time, $cafe, $room, $building, $crematorium, $cleaning, $organization, $doubt,
                            $attentionText, $adviceText, $timeText, $cafeText, $roomText, $buildingText, $crematoriumText, $cleaningText,
                            $organizationText, $doubtText, $aspects, $date, $relationship, $name
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }   
        }
        // End table: Satisfaction_Survey

        // Start table: Condolences
        $query = "  SELECT  expedient, name, phone, address, city, condolence, doc, date, delivered, extraID
                    FROM    Condolences
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current condolences data');
        }
        $currentCondolencesInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentCondolencesInfo as $elem){
            $name = $elem['name'] == null ? 'null' : "'" . $elem['name'] . "'";
            $phone = $elem['phone'] == null ? 'null' : "'" . $elem['phone'] . "'";
            $address = $elem['address'] == null ? 'null' : "'" . $elem['address'] . "'";
            $city = $elem['city'] == null ? 'null' : "'" . $elem['city'] . "'";
            $condolence = $elem['condolence'] == null ? 'null' : "'" . $elem['condolence'] . "'";
            $doc = $elem['doc'] == null ? 'null' : "'" . $elem['doc'] . "'";
            $date = $elem['date'] == null ? 'null' : $elem['date'];
            $delivered = $elem['delivered$delivered'] == null ? 0 : $elem['delivered$delivered'];

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
            $result = $db->query("  SELECT  * 
                                    FROM    Condolences 
                                    WHERE   extraID = '" . $extraID . "'"
            );
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
                $result = $db->query("  SELECT  * 
                                        FROM    Condolences 
                                        WHERE   extraID = '" . $extraID . "'"
                );
            }

            $query = "  INSERT INTO Condolences(
                            expedient, name, phone, address, city, condolence, doc, date, delivered, extraID
                        )
                        VALUES (
                            $newExpedientId, $name, $phone, $address, $city, $condolence, $doc, $date, $delivered, '$extraID'
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }   
        }
        // End table: Condolences

        // Start table: Events
        $query = "  SELECT  status, user, cleaningType, cleaningMortuary, cleaningUser, type, expedient, car, upkeeps,
                            name, start, end, regularity, reminder, cremation, success, allDay, leavingDate, mailSend,
                            mailDate, mailTo, mailSent, description, dischargeDay, extraID
                    FROM    Events
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current events data');
        }
        $currentEventsInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentEventsInfo as $elem){
            $status = $elem['status'] == null ? 1 : $elem['status'];
            $user = $elem['user'] == null ? 'null' : $elem['user'];
            $cleaningType = $elem['cleaningType'] == null ? 'null' : $elem['cleaningType'];
            $cleaningMortuary = $elem['cleaningMortuary'] == null ? 'null' : $elem['cleaningMortuary'];
            $cleaningUser = $elem['cleaningUser'] == null ? 'null' : $elem['cleaningUser'];
            $car = $elem['car'] == null ? 'null' : $elem['car'];
            $upkeeps = $elem['upkeeps'] == null ? 'null' : $elem['upkeeps'];
            $name = $elem['name'] == null ? 'null' : "'" . $elem['name'] . "'";
            $start = $elem['start'] == null ? 'null' : "'" . $elem['start'] . "'";
            $end = $elem['end'] == null ? 'null' : "'" . $elem['end'] . "'";
            $regularity = $elem['regularity'] == null ? 'null' : $elem['regularity'];
            $reminder = $elem['reminder'] == null ? 'null' : $elem['reminder'];
            $cremation = $elem['cremation'] == null ? 0 : $elem['cremation'];
            $success = $elem['success'] == null ? 0 : $elem['success'];
            $allDay = $elem['allDay'] == null ? 0 : $elem['allDay'];
            $leavingDate = $elem['leavingDate'] == null ? 'null' : "'" . $elem['leavingDate'] . "'";
            $mailSend = $elem['mailSend'] == null ? 0 : $elem['mailSend'];
            $mailDate = $elem['mailDate'] == null ? 'null' : $elem['mailDate'];
            $mailTo = $elem['mailTo'] == null ? 'null' : "'" . $elem['mailTo'] . "'";
            $mailSent = $elem['mailSent'] == null ? 0 : $elem['mailSent'];
            $description = $elem['description'] == null ? 'null' : "'" . $elem['description'] . "'";
            $dischargeDay = $elem['dischargeDay'] == null ? 0 : $elem['dischargeDay'];

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
            $result = $db->query("  SELECT  * 
                                    FROM    Events 
                                    WHERE   extraID = '" . $extraID . "'"
            );
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
                $result = $db->query("  SELECT  * 
                                        FROM    Events 
                                        WHERE   extraID = '" . $extraID . "'"
                );
            }

            $query = "  INSERT INTO Events(
                            status, user, cleaningType, cleaningMortuary, cleaningUser, type, expedient, car, upkeeps,
                            name, start, end, regularity, reminder, cremation, success, allDay, leavingDate, mailSend,
                            mailDate, mailTo, mailSent, description, dischargeDay, extraID
                        )
                        VALUES (
                            $newExpedientId, $status, $user, $cleaningType, $cleaningMortuary, $cleaningUser, $type, $expedient, $car, $upkeeps,
                            $name, $start, $end, $regularity, $reminder, $cremation, $success, $allDay, $leavingDate, $mailSend,
                            $mailDate, $mailTo, $mailSent, $description, $dischargeDay, $extraID
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }   
        }
        // End table: Events

        // Start table: Expedients_History_Docs_Sent + Expedients_History_Docs_Sent_Emails
        $query = "  SELECT  id, doc_name, user_create, create_date
                    FROM    Expedients_History_Docs_Sent
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current history documents sent data');
        }
        $currentHistoryDocumentsSentInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentHistoryDocumentsSentInfo as $elem){
            $historyDocId = $elem['id'];
            $docName = $elem['doc_name'] == null ? 'null' : "'" . $elem['doc_name'] . "'";
            $userCreate = $elem['user_create'] == null ? 'null' : $elem['user_create'];
            $createDate = $elem['create_date'] == null ? 'null' : $elem['create_date'];

            $query = "  INSERT INTO Expedients_History_Docs_Sent(
                            expedient, doc_name, user_create, create_date
                        )
                        VALUES (
                            $newExpedientId, $docName, $userCreate, $createDate
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }
            $newDocId = $db->getLastInsertId();

            $query = "  SELECT  assistant, bellringer, cemetery, client, choir, priest, gravedigger, church, doctor, staff,
                                carrier, supplier, email, create_date
                        FROM    Expedients_History_Docs_Sent_Emails
                        WHERE   expedient_history_doc_sent = $historyDocId
            ";
            $result = $db->query($query);
            if(!$result){
                throw new Exception('Get current history documents sent emails data');
            }
            $currentHistoryDocumentsSentEmailsInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
            foreach($currentHistoryDocumentsSentEmailsInfo as $elem){
                $assistant = $elem['assistant'] == null ? 'null' : $elem['assistant'];
                $bellringer = $elem['bellringer'] == null ? 'null' : $elem['bellringer'];
                $cemetery = $elem['cemetery'] == null ? 'null' : $elem['cemetery'];
                $client = $elem['client'] == null ? 'null' : $elem['client'];
                $choir = $elem['choir'] == null ? 'null' : $elem['choir'];
                $priest = $elem['priest'] == null ? 'null' : $elem['priest'];
                $gravedigger = $elem['gravedigger'] == null ? 'null' : $elem['gravedigger'];
                $church = $elem['church'] == null ? 'null' : $elem['church'];
                $doctor = $elem['doctor'] == null ? 'null' : $elem['doctor'];
                $staff = $elem['staff'] == null ? 'null' : $elem['staff'];
                $carrier = $elem['carrier'] == null ? 'null' : $elem['carrier'];
                $supplier = $elem['supplier'] == null ? 'null' : $elem['supplier'];
                $email = $elem['email'] == null ? 'null' : "'" . $elem['email'] . "'";
                $createDate = $elem['create_date'] == null ? 'null' : $elem['create_date'];

                $query = "  INSERT INTO Expedients_History_Docs_Sent_Emails(
                                expedient_history_doc_sent, assistant, bellringer, cemetery, client, choir, priest, gravedigger,
                                church, doctor, staff, carrier, supplier, email, create_date
                            )
                            VALUES (
                                $newDocId, $assistant, $bellringer, $cemetery, $client, $choir, $priest, $gravedigger,
                                $church, $doctor, $staff, $carrier, $supplier, $email, $createDate
                            )
                ";

                $result = $db->query($query);
                if(!$result){
                    throw new Exception($query);
                }   
            }
        }
        // End table: Expedients_History_Docs_Sent + Expedients_History_Docs_Sent_Emails

        // Start table: Expedients_Polls + Expedients_Polls_Results
        $query = "  SELECT  id, phone, sent, admin_notes, leavingDate
                    FROM    Expedients_Polls
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current expedients polls data');
        }
        $currentExpedientPollInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentExpedientPollInfo as $elem){
            $expedientPollId = $elem['id'];
            $phone = $elem['phone'] == null ? 'null' : "'" . $elem['phone'] . "'";
            $sent = $elem['sent'] == null ? 0 : $elem['sent'];
            $adminNotes = $elem['admin_notes'] == null ? 'null' : "'" . $elem['admin_notes'] . "'";
            $leavingDate = $elem['leavingDate'] == null ? 'null' : $elem['leavingDate'];

            $query = "  INSERT INTO Expedients_Polls(
                            expedient, phone, sent, admin_notes, leavingDate
                        )
                        VALUES (
                            $newExpedientId, $phone, $sent, $adminNotes, $createDate
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }
            $newPollId = $db->getLastInsertId();

            $query = "  SELECT  poll_item, score, notes, creationDate, leavingDate
                        FROM    Expedients_Polls_Results
                        WHERE   expedientPool = $expedientPollId
            ";
            $result = $db->query($query);
            if(!$result){
                throw new Exception('Get current history documents sent emails data');
            }
            $currentHistoryDocumentsSentEmailsInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
            foreach($currentHistoryDocumentsSentEmailsInfo as $elem){
                $pollItem = $elem['poll_item'] == null ? 1 : $elem['poll_item'];
                $score = $elem['score'] == null ? 0 : $elem['score'];
                $notes = $elem['notes'] == null ? 'null' : "'" . $elem['notes'] . "'";
                $creationDate = $elem['creationDate'] == null ? 'null' : $elem['creationDate'];
                $leavingDate = $elem['leavingDate'] == null ? 'null' : $elem['leavingDate'];

                $query = "  INSERT INTO Expedients_Polls_Results(
                                expedient_poll, poll_item, score, notes, creationDate, leavingDate
                            )
                            VALUES (
                                $newPollId, $pollItem, $score, $notes, $creationDate, $leavingDate
                            )
                ";

                $result = $db->query($query);
                if(!$result){
                    throw new Exception($query);
                }   
            }
        }
        // End table: Expedients_Polls + Expedients_Polls_Results

        // Start table: Expedients_Notes + Expedients_Notes_Users
        $query = "  SELECT  id, user, section, note, create_date, update_date, delete_date
                    FROM    Expedients_Notes
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current expedients notes data');
        }
        $currentExpedientNotesInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentExpedientNotesInfo as $elem){
            $expedientNoteId = $elem['id'];
            $user = $elem['user'] == null ? 'null' : $elem['user'];
            $section = $elem['section'] == null ? 'null' : $elem['section'];
            $note = $elem['note'] == null ? 'null' : "'" . $elem['note'] . "'";
            $createDate = $elem['create_date'] == null ? 'null' : $elem['create_date'];
            $updateDate = $elem['update_date'] == null ? 'null' : $elem['update_date'];
            $deleteDate = $elem['delete_date'] == null ? 'null' : $elem['delete_date'];

            $query = "  INSERT INTO Expedients_Notes(
                            user, expedient, section, note, create_date, update_date, delete_date
                        )
                        VALUES (
                            $user, $newExpedientId, $section, $note, $createDate, $updateDate, $deleteDate
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }
            $newNoteId = $db->getLastInsertId();

            $query = "  SELECT  note, user, date, seen, create_date, update_date, delete_date
                        FROM    Expedients_Notes_Users
                        WHERE   note = $expedientNoteId
            ";
            $result = $db->query($query);
            if(!$result){
                throw new Exception('Get current history documents sent emails data');
            }
            $currentNotesUsersInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
            foreach($currentNotesUsersInfo as $elem){
                $note = $elem['note'] == null ? 'null' : $elem['note'];
                $user = $elem['user'] == null ? 'null' : $elem['user'];
                $date = $elem['date'] == null ? 'null' : $elem['date'];
                $seen = $elem['seen'] == null ? 'null' : $elem['seen'];
                $createDate = $elem['create_date'] == null ? 'null' : $elem['create_date'];
                $updateDate = $elem['update_date'] == null ? 'null' : $elem['update_date'];
                $deleteDate = $elem['delete_date'] == null ? 'null' : $elem['delete_date'];

                $query = "  INSERT INTO Expedients_Notes_Users(
                                note, user, date, seen, create_date, update_date, delete_date
                            )
                            VALUES (
                                $newNoteId, $user, $date, $seen, $createDate, $updateDate, $deleteDate
                            )
                ";

                $result = $db->query($query);
                if(!$result){
                    throw new Exception($query);
                }   
            }
        }
        // End table: Expedients_Notes + Expedients_Notes_Users

        // Start table: Assistances + Survey_Assistance
        $query = "  SELECT  ID, attendanceDate, address, location, phone1, phone2, phone3, literalDate, receiptDate, ssDateStartCheck,
                            ssDateStart, ssDateEndCheck, ssDateEnd, spanishPension, foreignPension, inssDateStartCheck, inssDateStart,
                            inssDateEndCheck, inssDateEnd, ismDateStartCheck, ismDateStart, ismDateEndCheck, ismDateEnd, socialDateStartCheck,
                            socialDateStart, socialDateEndCheck, socialDateEnd, passiveDateStartCheck, passiveDateStart, passiveDateEndCheck,
                            passiveDateEnd, isfasDateStartCheck, isfasDateStart, isfasDateEndCheck, isfasDateEnd, lastWishDateStartCheck,
                            lastWishDateStart, lastWishDateEndCheck, lastWishDateEnd, insuranceCoverageStartCheck, insuranceCoverageStart,
                            insuranceCoverageEndCheck, insuranceCoverageEnd, dniDateGStartCheck, dniDateGStart, dniDateGEndCheck, dniDateGEnd,
                            familyBookDateGStartCheck, familyBookDateGStart, familyBookDateGEndCheck, familyBookDateGEnd, literalMarriageDateGStartCheck,
                            literalMarriageDateGStart, literalMarriageDateGEndCheck, literalMarriageDateGEnd, literalBirthdayDateGStartCheck,
                            literalBirthdayDateGStart, literalBirthdayDateGEndCheck, literalBirthdayDateGEnd, registrationDateGStartCheck,
                            registrationDateGStart, registrationDateGEndCheck, registrationDateGEnd, several, dniDateRStartCheck, dniDateRStart,
                            dniDateREndCheck, dniDateREnd, familyBookDateRStartCheck, familyBookDateRStart, familyBookDateREndCheck, familyBookDateREnd,
                            literalMarriageDateRStartCheck, literalMarriageDateRStart, literalMarriageDateREndCheck, literalMarriageDateREnd,
                            literalBirthdayDateRStartCheck, literalBirthdayDateRStart, literalBirthdayDateREndCheck, literalBirthdayDateREnd,
                            registrationDateRStartCheck, registrationDateRStart, registrationDateREndCheck, registrationDateREnd, km, successions,
                            deathReport, production, notes, extraID, leavingDate
                    FROM    Assistances
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);
        if(!$result){
            throw new Exception('Get current assistances data');
        }
        $currentAssistantesInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        foreach($currentAssistantesInfo as $elem){
            $assistanceId = $elem['ID'];
            $attendanceDate = $elem['attendanceDate'] == null ? 'null' : $elem['attendanceDate'];
            $address = $elem['address'] == null ? 'null' : "'" . $elem['address'] . "'";
            $location = $elem['location'] == null ? 'null' : $elem['location'];
            $phone1 = $elem['phone1'] == null ? 'null' : "'" . $elem['phone1'] . "'";
            $phone2 = $elem['phone2'] == null ? 'null' : "'" . $elem['phone2'] . "'";
            $phone3 = $elem['phone3'] == null ? 'null' : "'" . $elem['phone3'] . "'";
            $literalDate = $elem['literalDate'] == null ? 'null' : $elem['literalDate'];
            $receiptDate = $elem['receiptDate'] == null ? 'null' : $elem['receiptDate'];
            $ssDateStartCheck = $elem['ssDateStartCheck'] == null ? 0 : $elem['ssDateStartCheck'];
            $ssDateStart = $elem['ssDateStart'] == null ? 'null' : $elem['ssDateStart'];
            $ssDateEndCheck = $elem['ssDateEndCheck'] == null ? 0 : $elem['ssDateEndCheck'];
            $ssDateEnd = $elem['ssDateEnd'] == null ? 'null' : $elem['ssDateEnd'];
            $spanishPension = $elem['spanishPension'] == null ? 0 : $elem['spanishPension'];
            $foreignPension = $elem['foreignPension'] == null ? 0 : $elem['foreignPension'];
            $inssDateStartCheck = $elem['inssDateStartCheck'] == null ? 0 : $elem['inssDateStartCheck'];
            $inssDateStart = $elem['inssDateStart'] == null ? 'null' : $elem['inssDateStart'];
            $inssDateEndCheck = $elem['inssDateEndCheck'] == null ? 0 : $elem['inssDateEndCheck'];
            $inssDateEnd = $elem['inssDateEnd'] == null ? 'null' : $elem['inssDateEnd'];
            $ismDateStartCheck = $elem['ismDateStartCheck'] == null ? 0 : $elem['ismDateStartCheck'];
            $ismDateStart = $elem['ismDateStart'] == null ? 'null' : $elem['ismDateStart'];
            $ismDateEndCheck = $elem['ismDateEndCheck'] == null ? 0 : $elem['ismDateEndCheck'];
            $ismDateEnd = $elem['ismDateEnd'] == null ? 'null' : $elem['ismDateEnd'];
            $socialDateStartCheck = $elem['socialDateStartCheck'] == null ? 0 : $elem['socialDateStartCheck'];
            $socialDateStart = $elem['socialDateStart'] == null ? 'null' : $elem['socialDateStart'];
            $socialDateEndCheck = $elem['socialDateEndCheck'] == null ? 0 : $elem['socialDateEndCheck'];
            $socialDateEnd = $elem['socialDateEnd'] == null ? 'null' : $elem['socialDateEnd'];
            $passiveDateStartCheck = $elem['passiveDateStartCheck'] == null ? 0 : $elem['passiveDateStartCheck'];
            $passiveDateStart = $elem['passiveDateStart'] == null ? 'null' : $elem['passiveDateStart'];
            $passiveDateEndCheck = $elem['passiveDateEndCheck'] == null ? 0 : $elem['passiveDateEndCheck'];
            $passiveDateEnd = $elem['passiveDateEnd'] == null ? 'null' : $elem['passiveDateEnd'];
            $isfasDateStartCheck = $elem['isfasDateStartCheck'] == null ? 0 : $elem['isfasDateStartCheck'];
            $isfasDateStart = $elem['isfasDateStart'] == null ? 'null' : $elem['isfasDateStart'];
            $isfasDateEndCheck = $elem['isfasDateEndCheck'] == null ? 0 : $elem['isfasDateEndCheck'];
            $isfasDateEnd = $elem['isfasDateEnd'] == null ? 'null' : $elem['isfasDateEnd'];
            $lastWishDateStartCheck = $elem['lastWishDateStartCheck'] == null ? 0 : $elem['lastWishDateStartCheck'];
            $lastWishDateStart = $elem['lastWishDateStart'] == null ? 'null' : $elem['lastWishDateStart'];
            $lastWishDateEndCheck = $elem['lastWishDateEndCheck'] == null ? 0 : $elem['lastWishDateEndCheck'];
            $lastWishDateEnd = $elem['lastWishDateEnd'] == null ? 'null' : $elem['lastWishDateEnd'];
            $insuranceCoverageStartCheck = $elem['insuranceCoverageStartCheck'] == null ? 0 : $elem['insuranceCoverageStartCheck'];
            $insuranceCoverageStart = $elem['insuranceCoverageStart'] == null ? 'null' : $elem['insuranceCoverageStart'];
            $insuranceCoverageEndCheck = $elem['insuranceCoverageEndCheck'] == null ? 0 : $elem['insuranceCoverageEndCheck'];
            $insuranceCoverageEnd = $elem['insuranceCoverageEnd'] == null ? 'null' : $elem['insuranceCoverageEnd'];
            $dniDateGStartCheck = $elem['dniDateGStartCheck'] == null ? 0 : $elem['dniDateGStartCheck'];
            $dniDateGStart = $elem['dniDateGStart'] == null ? 'null' : $elem['dniDateGStart'];
            $dniDateGEndCheck = $elem['dniDateGEndCheck'] == null ? 0 : $elem['dniDateGEndCheck'];
            $dniDateGEnd = $elem['dniDateGEnd'] == null ? 'null' : $elem['dniDateGEnd'];
            $familyBookDateGStartCheck = $elem['familyBookDateGStartCheck'] == null ? 0 : $elem['familyBookDateGStartCheck'];
            $familyBookDateGStart = $elem['familyBookDateGStart'] == null ? 'null' : $elem['familyBookDateGStart'];
            $familyBookDateGEndCheck = $elem['familyBookDateGEndCheck'] == null ? 0 : $elem['familyBookDateGEndCheck'];
            $familyBookDateGEnd = $elem['familyBookDateGEnd'] == null ? 'null' : $elem['familyBookDateGEnd'];
            $literalMarriageDateGStartCheck = $elem['literalMarriageDateGStartCheck'] == null ? 0 : $elem['literalMarriageDateGStartCheck'];
            $literalMarriageDateGStart = $elem['literalMarriageDateGStart'] == null ? 'null' : $elem['literalMarriageDateGStart'];
            $literalMarriageDateGEndCheck = $elem['literalMarriageDateGEndCheck'] == null ? 0 : $elem['literalMarriageDateGEndCheck'];
            $literalMarriageDateGEnd = $elem['literalMarriageDateGEnd'] == null ? 'null' : $elem['literalMarriageDateGEnd'];
            $literalBirthdayDateGStartCheck = $elem['literalBirthdayDateGStartCheck'] == null ? 0 : $elem['literalBirthdayDateGStartCheck'];
            $literalBirthdayDateGStart = $elem['literalBirthdayDateGStart'] == null ? 'null' : $elem['literalBirthdayDateGStart'];
            $literalBirthdayDateGEndCheck = $elem['literalBirthdayDateGEndCheck'] == null ? 0 : $elem['literalBirthdayDateGEndCheck'];
            $literalBirthdayDateGEnd = $elem['literalBirthdayDateGEnd'] == null ? 'null' : $elem['literalBirthdayDateGEnd'];
            $registrationDateGStartCheck = $elem['registrationDateGStartCheck'] == null ? 0 : $elem['registrationDateGStartCheck'];
            $registrationDateGStart = $elem['registrationDateGStart'] == null ? 'null' : $elem['registrationDateGStart'];
            $registrationDateGEndCheck = $elem['registrationDateGEndCheck'] == null ? 0 : $elem['registrationDateGEndCheck'];
            $registrationDateGEnd = $elem['registrationDateGEnd'] == null ? 'null' : $elem['registrationDateGEnd'];
            $several = $elem['several'] == null ? 'null' : "'" . $elem['several'] . "'";
            $dniDateRStartCheck = $elem['dniDateRStartCheck'] == null ? 0 : $elem['dniDateRStartCheck'];
            $dniDateRStart = $elem['dniDateRStart'] == null ? 'null' : $elem['dniDateRStart'];
            $dniDateREndCheck = $elem['dniDateREndCheck'] == null ? 0 : $elem['dniDateREndCheck'];
            $dniDateREnd = $elem['dniDateREnd'] == null ? 'null' : $elem['dniDateREnd'];
            $familyBookDateRStartCheck = $elem['familyBookDateRStartCheck'] == null ? 0 : $elem['familyBookDateRStartCheck'];
            $familyBookDateRStart = $elem['familyBookDateRStart'] == null ? 'null' : $elem['familyBookDateRStart'];
            $familyBookDateREndCheck = $elem['familyBookDateREndCheck'] == null ? 0 : $elem['familyBookDateREndCheck'];
            $familyBookDateREnd = $elem['familyBookDateREnd'] == null ? 'null' : $elem['familyBookDateREnd'];
            $literalMarriageDateRStartCheck = $elem['literalMarriageDateRStartCheck'] == null ? 0 : $elem['literalMarriageDateRStartCheck'];
            $literalMarriageDateRStart = $elem['literalMarriageDateRStart'] == null ? 'null' : $elem['literalMarriageDateRStart'];
            $literalMarriageDateREndCheck = $elem['literalMarriageDateREndCheck'] == null ? 0 : $elem['literalMarriageDateREndCheck'];
            $literalMarriageDateREnd = $elem['literalMarriageDateREnd'] == null ? 'null' : $elem['literalMarriageDateREnd'];
            $literalBirthdayDateRStartCheck = $elem['literalBirthdayDateRStartCheck'] == null ? 0 : $elem['literalBirthdayDateRStartCheck'];
            $literalBirthdayDateRStart = $elem['literalBirthdayDateRStart'] == null ? 'null' : $elem['literalBirthdayDateRStart'];
            $literalBirthdayDateREndCheck = $elem['literalBirthdayDateREndCheck'] == null ? 0 : $elem['literalBirthdayDateREndCheck'];
            $literalBirthdayDateREnd = $elem['literalBirthdayDateREnd'] == null ? 'null' : $elem['literalBirthdayDateREnd'];
            $registrationDateRStartCheck = $elem['registrationDateRStartCheck'] == null ? 0 : $elem['registrationDateRStartCheck'];
            $registrationDateRStart = $elem['registrationDateRStart'] == null ? 'null' : $elem['registrationDateRStart'];
            $registrationDateREndCheck = $elem['registrationDateREndCheck'] == null ? 0 : $elem['registrationDateREndCheck'];
            $registrationDateREnd = $elem['registrationDateREnd'] == null ? 'null' : $elem['registrationDateREnd'];
            $km = $elem['km'] == null ? 'null' : $elem['km'];
            $successions = $elem['successions'] == null ? 'null' : "'" . $elem['successions'] . "'";
            $deathReport = $elem['deathReport'] == null ? 'null' : "'" . $elem['deathReport'] . "'";
            $production = $elem['production'] == null ? 'null' : "'" . $elem['production'] . "'";
            $notes = $elem['notes'] == null ? 'null' : "'" . $elem['notes'] . "'";
            $leavingDate = $elem['leavingDate'] == null ? 'null' : $elem['leavingDate'];

            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
            $result = $db->query("  SELECT    * 
                                    FROM      Assistances 
                                    WHERE     extraID = '" . $extraID . "'");
            while(mysqli_num_rows($result) > 0){
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
                $result = $db->query("  SELECT    * 
                                        FROM      Assistances 
                                        WHERE     extraID = '" . $extraID . "'");
            }
            
            $query = "  INSERT INTO Assistances(
                            expedient, attendanceDate, address, location, phone1, phone2, phone3, literalDate, receiptDate, ssDateStartCheck,
                            ssDateStart, ssDateEndCheck, ssDateEnd, spanishPension, foreignPension, inssDateStartCheck, inssDateStart,
                            inssDateEndCheck, inssDateEnd, ismDateStartCheck, ismDateStart, ismDateEndCheck, ismDateEnd, socialDateStartCheck,
                            socialDateStart, socialDateEndCheck, socialDateEnd, passiveDateStartCheck, passiveDateStart, passiveDateEndCheck,
                            passiveDateEnd, isfasDateStartCheck, isfasDateStart, isfasDateEndCheck, isfasDateEnd, lastWishDateStartCheck,
                            lastWishDateStart, lastWishDateEndCheck, lastWishDateEnd, insuranceCoverageStartCheck, insuranceCoverageStart,
                            insuranceCoverageEndCheck, insuranceCoverageEnd, dniDateGStartCheck, dniDateGStart, dniDateGEndCheck, dniDateGEnd,
                            familyBookDateGStartCheck, familyBookDateGStart, familyBookDateGEndCheck, familyBookDateGEnd, literalMarriageDateGStartCheck,
                            literalMarriageDateGStart, literalMarriageDateGEndCheck, literalMarriageDateGEnd, literalBirthdayDateGStartCheck,
                            literalBirthdayDateGStart, literalBirthdayDateGEndCheck, literalBirthdayDateGEnd, registrationDateGStartCheck,
                            registrationDateGStart, registrationDateGEndCheck, registrationDateGEnd, several, dniDateRStartCheck, dniDateRStart,
                            dniDateREndCheck, dniDateREnd, familyBookDateRStartCheck, familyBookDateRStart, familyBookDateREndCheck, familyBookDateREnd,
                            literalMarriageDateRStartCheck, literalMarriageDateRStart, literalMarriageDateREndCheck, literalMarriageDateREnd,
                            literalBirthdayDateRStartCheck, literalBirthdayDateRStart, literalBirthdayDateREndCheck, literalBirthdayDateREnd,
                            registrationDateRStartCheck, registrationDateRStart, registrationDateREndCheck, registrationDateREnd, km, successions,
                            deathReport, production, notes, extraID, leavingDate
                        )
                        VALUES (
                            $newExpedientId, $attendanceDate, $address, $location, $phone1, $phone2, $phone3, $literalDate, $receiptDate, $ssDateStartCheck,
                            $ssDateStart, $ssDateEndCheck, $ssDateEnd, $spanishPension, $foreignPension, $inssDateStartCheck, $inssDateStart,
                            $inssDateEndCheck, $inssDateEnd, $ismDateStartCheck, $ismDateStart, $ismDateEndCheck, $ismDateEnd, $socialDateStartCheck,
                            $socialDateStart, $socialDateEndCheck, $socialDateEnd, $passiveDateStartCheck, $passiveDateStart, $passiveDateEndCheck,
                            $passiveDateEnd, $isfasDateStartCheck, $isfasDateStart, $isfasDateEndCheck, $isfasDateEnd, $lastWishDateStartCheck,
                            $lastWishDateStart, $lastWishDateEndCheck, $lastWishDateEnd, $insuranceCoverageStartCheck, $insuranceCoverageStart,
                            $insuranceCoverageEndCheck, $insuranceCoverageEnd, $dniDateGStartCheck, $dniDateGStart, $dniDateGEndCheck, $dniDateGEnd,
                            $familyBookDateGStartCheck, $familyBookDateGStart, $familyBookDateGEndCheck, $familyBookDateGEnd, $literalMarriageDateGStartCheck,
                            $literalMarriageDateGStart, $literalMarriageDateGEndCheck, $literalMarriageDateGEnd, $literalBirthdayDateGStartCheck,
                            $literalBirthdayDateGStart, $literalBirthdayDateGEndCheck, $literalBirthdayDateGEnd, $registrationDateGStartCheck,
                            $registrationDateGStart, $registrationDateGEndCheck, $registrationDateGEnd, $several, $dniDateRStartCheck, $dniDateRStart,
                            $dniDateREndCheck, $dniDateREnd, $familyBookDateRStartCheck, $familyBookDateRStart, $familyBookDateREndCheck, $familyBookDateREnd,
                            $literalMarriageDateRStartCheck, $literalMarriageDateRStart, $literalMarriageDateREndCheck, $literalMarriageDateREnd,
                            $literalBirthdayDateRStartCheck, $literalBirthdayDateRStart, $literalBirthdayDateREndCheck, $literalBirthdayDateREnd,
                            $registrationDateRStartCheck, $registrationDateRStart, $registrationDateREndCheck, $registrationDateREnd, $km, $successions,
                            $deathReport, $production, $notes, '$extraID', $leavingDate
                        )
            ";

            $result = $db->query($query);
            if(!$result){
                throw new Exception($query);
            }
            $newAssistanceId = $db->getLastInsertId();

            // Gets current assistance survey data
            $query = "  SELECT  survey, value, notes
                        FROM    Survey_Assistance
                        WHERE   assistance = $assistanceId
            ";
            $result = $db->query($query);
            if(!$result){
                throw new Exception('Get current survey assistance data');
            }
            $currentSurveyAssistanteInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
            foreach($currentSurveyAssistanteInfo as $item){
                $survey = $item['survey'] == null ? 'null' : $item['survey'];
                $value = $item['value'] == null ? 'null' : $item['value'];
                $notes = $item['notes'] == null ? 'null' : "'" . $item['notes'] . "'";

                $query = "  INSERT INTO Survey_Assistance(
                                survey, assistance, value, notes
                            )
                            VALUES (
                                $survey, $newAssistanceId, $value, $notes
                            )
                ";

                $result = $db->query($query);
                if(!$result){
                    throw new Exception($query);
                }
            }
        }
        // End table: Assistances + Survey_Assistance

        // Start table: Flowers_Letters
        $result = $db->query("  SELECT  category, value
                                FROM    Flowers_Letters
                                WHERE   expedient = $expedientId
        ");

        $currentFlowersInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        if($currentFlowersInfo != null){
            $category = $currentFlowersInfo['category'] == null ? 'null' : "'" . $currentFlowersInfo['category'] . "'";
            $value = $currentFlowersInfo['value'] == null ? 'null' : "'" . $currentFlowersInfo['value'] . "'";

            $query = "  INSERT INTO Flowers_Letters(expedient, category, value)
                                    VALUES ($newExpedientId, $category, $value)
            ";
            $result = $db->query($query);

            if(!$result){
                throw new Exception('INSERT INTO Flowers_Letters');
            }
        }
        // End table: Flowers_Letters

        // Start table: Visits + VisitsControl + Visits_Descriptions + Visits_Descriptions_Cafe + Incidents
        $result = $db->query("  SELECT  ID, control, leavingDate
                                FROM    VisitsControl
                                WHERE   expedient = $expedientId
        ");

        if(!$result){
            throw new Exception('Get current visits control data');
        }

        $currentVisitsControlInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        if($currentVisitsControlInfo != null){
            $visitControlId = $currentVisitsControlInfo['ID'];
            $control = $currentVisitsControlInfo['control'] == null ? 'null' : "'" . $currentVisitsControlInfo['control'] . "'";
            $leavingDate = $currentVisitsControlInfo['leavingDate'] == null ? 'null' : $currentVisitsControlInfo['leavingDate'];

            $result = $db->query("  SELECT  MAX(ID) as id
                                    FROM    VisitsControl
            ");
            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 2);
            $extraID .= ($maxID+1);

            $query = "  INSERT INTO VisitsControl(expedient, control, extraID, leavingDate)
                        VALUES ($newExpedientId, $control, '$extraID', $leavingDate)
            ";
            $result = $db->query($query);

            if(!$result){
                throw new Exception('INSERT INTO VisitsControl');
            }
            $newVisitsControlId = $db->getLastInsertId();

            // Gets current visits
            $query = "  SELECT  ID, visitControl, user, date, time, name, updateTime, leavingDate, extraID
                        FROM    Visits
                        WHERE   visitControl = $visitControlId
            ";
            $result = $db->query($query);

            if(!$result){
                throw new Exception('Get current visits data');
            }

            $currentVisitsInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
            foreach($currentVisitsInfo as $item){
                $visitId = $item['ID'];
                $user = $item['user'] == null ? 'null' : $item['user'];
                $date = $item['date'] == null ? 'null' : "'" . $item['date'] . "'";
                $time = $item['time'] == null ? 'null' : "'" . $item['time'] . "'";
                $name = $item['name'] == null ? 'null' : "'" . $item['name'] . "'";
                $updateTime = $item['updateTime'] == null ? 'null' : "'" . $item['updateTime'] . "'";
                $leavingDate = $item['leavingDate'] == null ? 'null' : "'" . $item['leavingDate'] . "'";

                $result = $db->query("  SELECT  MAX(ID) as id
                                        FROM    Visits");
                $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
                $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 2);
                $extraID .= ($maxID+1);

                $query = "  INSERT INTO Visits(visitControl, user, date, time, name, updateTime, leavingDate, extraID)
                            VALUES ($newVisitsControlId, $user, $date, $time, $name, $updateTime, $leavingDate, '$extraID')
                ";
                $result = $db->query($query);

                if(!$result){
                    throw new Exception('INSERT INTO Visits');
                }
                $newVisitId = $db->getLastInsertId();

                // Gets current visits descriptions
                $query = "  SELECT  startCoffeShopCheck, startCoffeShopUser, startCoffeShopTime, startCoffeShopResolved, deliveryKeysCheck,
                                    deliveryKeysUser, deliveryKeysTo, deliveryKeysTime, deliveryKeysResolved, courtesyQuestionCheck, courtesyQuestionUser,
                                    courtesyQuestionTime, courtesyQuestionResolved, roomReviewCheck, roomReviewUser, roomReviewTime, roomReviewResolved,
                                    roomHandkerchiefReviewCheck, roomHandkerchiefReviewUser, roomHandkerchiefReviewTime, roomHandkerchiefReviewResolved,
                                    toiletReviewCheck, toiletReviewUser, toiletReviewTime, toiletReviewResolved, toiletPaperReviewCheck, toiletPaperReviewUser,
                                    toiletPaperReviewTime, toiletPaperReviewResolved, roomBurialReviewCheck, roomBurialReviewUser, roomBurialReviewTime,
                                    roomBurialReviewResolved, roomTempCheck, roomTempUser, roomTempTime, roomTempResolved, burialTemp, burialTempCheck,
                                    burialTempUser, burialTempTime, burialTempResolved, thanatopraxieTempCheck, thanatopraxieTempUser, thanatopraxieTempTime,
                                    thanatopraxieTempResolved, controlProductsCoffeShopCheck, controlProductsCoffeShopUser, controlProductsCoffeShopTime,
                                    controlProductsCoffeShopResolved, offeringCheck, offeringUser, offeringTime, offeringResolved, commonBathroomsCleaningCheck,
                                    commonBathroomsCleaningUser, commonBathroomsCleaningTime, commonBathroomsCleaningResolved, roomBathroomsCleaningCheck,
                                    roomBathroomsCleaningUser, roomBathroomsCleaningTime, roomBathroomsCleaningResolved, roomCleaningCheck, roomCleaningUser,
                                    roomCleaningTime, roomCleaningResolved, thanatopraxieCleaningCheck, thanatopraxieCleaningUser, thanatopraxieCleaningTime,
                                    thanatopraxieCleaningResolved, commonZonesCleaningCheck, commonZonesCleaningUser, commonZonesCleaningTime,
                                    commonZonesCleaningResolved, burialCleaningCheck, burialCleaningUser, burialCleaningTime, burialCleaningResolved, notes
                            FROM    Visits_Descriptions
                            WHERE   visit = $visitId
                ";
                $result = $db->query($query);

                if(!$result){
                    throw new Exception('Get current visits descriptions data');
                }
                $currentVisitsDescriptionsInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();

                foreach($currentVisitsDescriptionsInfo as $value){
                    $startCoffeShopCheck = $value['startCoffeShopCheck'] == null ? 0 : $value['startCoffeShopCheck'];
                    $startCoffeShopUser = $value['startCoffeShopUser'] == null ? 'null' : $value['startCoffeShopUser'];
                    $startCoffeShopTime = $value['startCoffeShopTime'] == null ? 'null' : $value['startCoffeShopTime'];
                    $startCoffeShopResolved = $value['startCoffeShopResolved'] == null ? 0 : $value['startCoffeShopResolved'];
                    $deliveryKeysCheck = $value['deliveryKeysCheck'] == null ? 0 : $value['deliveryKeysCheck'];
                    $deliveryKeysUser = $value['deliveryKeysUser'] == null ? 'null' : $value['deliveryKeysUser'];
                    $deliveryKeysTo = $value['deliveryKeysTo'] == null ? 'null' : "'" . $value['deliveryKeysTo'] . "'";
                    $deliveryKeysTime = $value['deliveryKeysTime'] == null ? 'null' : $value['deliveryKeysTime'];
                    $deliveryKeysResolved = $value['deliveryKeysResolved'] == null ? 0 : $value['deliveryKeysResolved'];
                    $courtesyQuestionCheck = $value['courtesyQuestionCheck'] == null ? 0 : $value['courtesyQuestionCheck'];
                    $courtesyQuestionUser = $value['courtesyQuestionUser'] == null ? 'null' : $value['courtesyQuestionUser'];
                    $courtesyQuestionTime = $value['courtesyQuestionTime'] == null ? 'null' : $value['courtesyQuestionTime'];
                    $courtesyQuestionResolved = $value['courtesyQuestionResolved'] == null ? 0 : $value['courtesyQuestionResolved'];
                    $roomReviewCheck = $value['roomReviewCheck'] == null ? 0 : $value['roomReviewCheck'];
                    $roomReviewUser = $value['roomReviewUser'] == null ? 'null' : $value['roomReviewUser'];
                    $roomReviewTime = $value['roomReviewTime'] == null ? 'null' : $value['roomReviewTime'];
                    $roomReviewResolved = $value['roomReviewResolved'] == null ? 0 : $value['roomReviewResolved'];
                    $roomHandkerchiefReviewCheck = $value['roomHandkerchiefReviewCheck'] == null ? 0 : $value['roomHandkerchiefReviewCheck'];
                    $roomHandkerchiefReviewUser = $value['roomHandkerchiefReviewUser'] == null ? 'null' : $value['roomHandkerchiefReviewUser'];
                    $roomHandkerchiefReviewTime = $value['roomHandkerchiefReviewTime'] == null ? 'null' : $value['roomHandkerchiefReviewTime'];
                    $roomHandkerchiefReviewResolved = $value['roomHandkerchiefReviewResolved'] == null ? 0 : $value['roomHandkerchiefReviewResolved'];
                    $toiletReviewCheck = $value['toiletReviewCheck'] == null ? 0 : $value['toiletReviewCheck'];
                    $toiletReviewUser = $value['toiletReviewUser'] == null ? 'null' : $value['toiletReviewUser'];
                    $toiletReviewTime = $value['toiletReviewTime'] == null ? 'null' : $value['toiletReviewTime'];
                    $toiletReviewResolved = $value['toiletReviewResolved'] == null ? 0 : $value['toiletReviewResolved'];
                    $toiletPaperReviewCheck = $value['toiletPaperReviewCheck'] == null ? 0 : $value['toiletPaperReviewCheck'];
                    $toiletPaperReviewUser = $value['toiletPaperReviewUser'] == null ? 'null' : $value['toiletPaperReviewUser'];
                    $toiletPaperReviewTime = $value['toiletPaperReviewTime'] == null ? 'null' : $value['toiletPaperReviewTime'];
                    $toiletPaperReviewResolved = $value['toiletPaperReviewResolved'] == null ? 0 : $value['toiletPaperReviewResolved'];
                    $roomBurialReviewCheck = $value['roomBurialReviewCheck'] == null ? 0 : $value['roomBurialReviewCheck'];
                    $roomBurialReviewUser = $value['roomBurialReviewUser'] == null ? 'null' : $value['roomBurialReviewUser'];
                    $roomBurialReviewTime = $value['roomBurialReviewTime'] == null ? 'null' : $value['roomBurialReviewTime'];
                    $roomBurialReviewResolved = $value['roomBurialReviewResolved'] == null ? 0 : $value['roomBurialReviewResolved'];
                    $roomTempCheck = $value['roomTempCheck'] == null ? 0 : $value['roomTempCheck'];
                    $roomTempUser = $value['roomTempUser'] == null ? 'null' : $value['roomTempUser'];
                    $roomTempTime = $value['roomTempTime'] == null ? 'null' : $value['roomTempTime'];
                    $roomTempResolved = $value['roomTempResolved'] == null ? 0 : $value['roomTempResolved'];
                    $burialTemp = $value['burialTemp'] == null ? 'null' : $value['burialTemp'];
                    $burialTempCheck = $value['burialTempCheck'] == null ? 0 : $value['burialTempCheck'];
                    $burialTempUser = $value['burialTempUser'] == null ? 'null' : $value['burialTempUser'];
                    $burialTempTime = $value['burialTempTime'] == null ? 'null' : $value['burialTempTime'];
                    $burialTempResolved = $value['burialTempResolved'] == null ? 0 : $value['burialTempResolved'];
                    $thanatopraxieTempCheck = $value['thanatopraxieTempCheck'] == null ? 0 : $value['thanatopraxieTempCheck'];
                    $thanatopraxieTempUser = $value['thanatopraxieTempUser'] == null ? 'null' : $value['thanatopraxieTempUser'];
                    $thanatopraxieTempTime = $value['thanatopraxieTempTime'] == null ? 'null' : $value['thanatopraxieTempTime'];
                    $thanatopraxieTempResolved = $value['thanatopraxieTempResolved'] == null ? 0 : $value['thanatopraxieTempResolved'];
                    $controlProductsCoffeShopCheck = $value['controlProductsCoffeShopCheck'] == null ? 0 : $value['controlProductsCoffeShopCheck'];
                    $controlProductsCoffeShopUser = $value['controlProductsCoffeShopUser'] == null ? 'null' : $value['controlProductsCoffeShopUser'];
                    $controlProductsCoffeShopTime = $value['controlProductsCoffeShopTime'] == null ? 'null' : $value['controlProductsCoffeShopTime'];
                    $controlProductsCoffeShopResolved = $value['controlProductsCoffeShopResolved'] == null ? 0 : $value['controlProductsCoffeShopResolved'];
                    $offeringCheck = $value['offeringCheck'] == null ? 0 : $value['offeringCheck'];
                    $offeringUser = $value['offeringUser'] == null ? 'null' : $value['offeringUser'];
                    $offeringTime = $value['offeringTime'] == null ? 'null' : $value['offeringTime'];
                    $offeringResolved = $value['offeringResolved'] == null ? 0 : $value['offeringResolved'];
                    $commonBathroomsCleaningCheck = $value['commonBathroomsCleaningCheck'] == null ? 0 : $value['commonBathroomsCleaningCheck'];
                    $commonBathroomsCleaningUser = $value['commonBathroomsCleaningUser'] == null ? 'null' : $value['commonBathroomsCleaningUser'];
                    $commonBathroomsCleaningTime = $value['commonBathroomsCleaningTime'] == null ? 'null' : $value['commonBathroomsCleaningTime'];
                    $commonBathroomsCleaningResolved = $value['commonBathroomsCleaningResolved'] == null ? 0 : $value['commonBathroomsCleaningResolved'];
                    $roomBathroomsCleaningCheck = $value['roomBathroomsCleaningCheck'] == null ? 0 : $value['roomBathroomsCleaningCheck'];
                    $roomBathroomsCleaningUser = $value['roomBathroomsCleaningUser'] == null ? 'null' : $value['roomBathroomsCleaningUser'];
                    $roomBathroomsCleaningTime = $value['roomBathroomsCleaningTime'] == null ? 'null' : $value['roomBathroomsCleaningTime'];
                    $roomBathroomsCleaningResolved = $value['roomBathroomsCleaningResolved'] == null ? 0 : $value['roomBathroomsCleaningResolved'];
                    $roomCleaningCheck = $value['roomCleaningCheck'] == null ? 0 : $value['roomCleaningCheck'];
                    $roomCleaningUser = $value['roomCleaningUser'] == null ? 'null' : $value['roomCleaningUser'];
                    $roomCleaningTime = $value['roomCleaningTime'] == null ? 'null' : $value['roomCleaningTime'];
                    $roomCleaningResolved = $value['roomCleaningResolved'] == null ? 0 : $value['roomCleaningResolved'];
                    $thanatopraxieCleaningCheck = $value['thanatopraxieCleaningCheck'] == null ? 0 : $value['thanatopraxieCleaningCheck'];
                    $thanatopraxieCleaningUser = $value['thanatopraxieCleaningUser'] == null ? 'null' : $value['thanatopraxieCleaningUser'];
                    $thanatopraxieCleaningTime = $value['thanatopraxieCleaningTime'] == null ? 'null' : $value['thanatopraxieCleaningTime'];
                    $thanatopraxieCleaningResolved = $value['thanatopraxieCleaningResolved'] == null ? 0 : $value['thanatopraxieCleaningResolved'];
                    $commonZonesCleaningCheck = $value['commonZonesCleaningCheck'] == null ? 0 : $value['commonZonesCleaningCheck'];
                    $commonZonesCleaningUser = $value['commonZonesCleaningUser'] == null ? 'null' : $value['commonZonesCleaningUser'];
                    $commonZonesCleaningTime = $value['commonZonesCleaningTime'] == null ? 'null' : $value['commonZonesCleaningTime'];
                    $commonZonesCleaningResolved = $value['commonZonesCleaningResolved'] == null ? 0 : $value['commonZonesCleaningResolved'];
                    $burialCleaningCheck = $value['burialCleaningCheck'] == null ? 0 : $value['burialCleaningCheck'];
                    $burialCleaningUser = $value['burialCleaningUser'] == null ? 'null' : $value['burialCleaningUser'];
                    $burialCleaningTime = $value['burialCleaningTime'] == null ? 'null' : $value['burialCleaningTime'];
                    $burialCleaningResolved = $value['burialCleaningResolved'] == null ? 0 : $value['burialCleaningResolved'];
                    $notes = $value['notes'] == null ? 'null' : "'" . $value['notes'] . "'";

                    $query = "  INSERT INTO Visits_Descriptions(
                                    visit, startCoffeShopCheck, startCoffeShopUser, startCoffeShopTime, startCoffeShopResolved, deliveryKeysCheck,
                                    deliveryKeysUser, deliveryKeysTo, deliveryKeysTime, deliveryKeysResolved, courtesyQuestionCheck, courtesyQuestionUser,
                                    courtesyQuestionTime, courtesyQuestionResolved, roomReviewCheck, roomReviewUser, roomReviewTime, roomReviewResolved,
                                    roomHandkerchiefReviewCheck, roomHandkerchiefReviewUser, roomHandkerchiefReviewTime, roomHandkerchiefReviewResolved,
                                    toiletReviewCheck, toiletReviewUser, toiletReviewTime, toiletReviewResolved, toiletPaperReviewCheck, toiletPaperReviewUser,
                                    toiletPaperReviewTime, toiletPaperReviewResolved, roomBurialReviewCheck, roomBurialReviewUser, roomBurialReviewTime,
                                    roomBurialReviewResolved, roomTempCheck, roomTempUser, roomTempTime, roomTempResolved, burialTemp, burialTempCheck,
                                    burialTempUser, burialTempTime, burialTempResolved, thanatopraxieTempCheck, thanatopraxieTempUser, thanatopraxieTempTime,
                                    thanatopraxieTempResolved, controlProductsCoffeShopCheck, controlProductsCoffeShopUser, controlProductsCoffeShopTime,
                                    controlProductsCoffeShopResolved, offeringCheck, offeringUser, offeringTime, offeringResolved, commonBathroomsCleaningCheck,
                                    commonBathroomsCleaningUser, commonBathroomsCleaningTime, commonBathroomsCleaningResolved, roomBathroomsCleaningCheck,
                                    roomBathroomsCleaningUser, roomBathroomsCleaningTime, roomBathroomsCleaningResolved, roomCleaningCheck, roomCleaningUser,
                                    roomCleaningTime, roomCleaningResolved, thanatopraxieCleaningCheck, thanatopraxieCleaningUser, thanatopraxieCleaningTime,
                                    thanatopraxieCleaningResolved, commonZonesCleaningCheck, commonZonesCleaningUser, commonZonesCleaningTime,
                                    commonZonesCleaningResolved, burialCleaningCheck, burialCleaningUser, burialCleaningTime, burialCleaningResolved, notes
                                )
                                VALUES (
                                    $newVisitId, $startCoffeShopCheck, $startCoffeShopUser, $startCoffeShopTime, $startCoffeShopResolved, $deliveryKeysCheck,
                                    $deliveryKeysUser, $deliveryKeysTo, $deliveryKeysTime, $deliveryKeysResolved, $courtesyQuestionCheck, $courtesyQuestionUser,
                                    $courtesyQuestionTime, $courtesyQuestionResolved, $roomReviewCheck, $roomReviewUser, $roomReviewTime, $roomReviewResolved,
                                    $roomHandkerchiefReviewCheck, $roomHandkerchiefReviewUser, $roomHandkerchiefReviewTime, $roomHandkerchiefReviewResolved,
                                    $toiletReviewCheck, $toiletReviewUser, $toiletReviewTime, $toiletReviewResolved, $toiletPaperReviewCheck, $toiletPaperReviewUser,
                                    $toiletPaperReviewTime, $toiletPaperReviewResolved, $roomBurialReviewCheck, $roomBurialReviewUser, $roomBurialReviewTime,
                                    $roomBurialReviewResolved, $roomTempCheck, $roomTempUser, $roomTempTime, $roomTempResolved, $burialTemp, $burialTempCheck,
                                    $burialTempUser, $burialTempTime, $burialTempResolved, $thanatopraxieTempCheck, $thanatopraxieTempUser, $thanatopraxieTempTime,
                                    $thanatopraxieTempResolved, $controlProductsCoffeShopCheck, $controlProductsCoffeShopUser, $controlProductsCoffeShopTime,
                                    $controlProductsCoffeShopResolved, $offeringCheck, $offeringUser, $offeringTime, $offeringResolved, $commonBathroomsCleaningCheck,
                                    $commonBathroomsCleaningUser, $commonBathroomsCleaningTime, $commonBathroomsCleaningResolved, $roomBathroomsCleaningCheck,
                                    $roomBathroomsCleaningUser, $roomBathroomsCleaningTime, $roomBathroomsCleaningResolved, $roomCleaningCheck, $roomCleaningUser,
                                    $roomCleaningTime, $roomCleaningResolved, $thanatopraxieCleaningCheck, $thanatopraxieCleaningUser, $thanatopraxieCleaningTime,
                                    $thanatopraxieCleaningResolved, $commonZonesCleaningCheck, $commonZonesCleaningUser, $commonZonesCleaningTime,
                                    $commonZonesCleaningResolved, $burialCleaningCheck, $burialCleaningUser, $burialCleaningTime, $burialCleaningResolved, $notes
                                )
                    ";
                    $result = $db->query($query);

                    if(!$result){
                        throw new Exception('INSERT INTO Visits');
                    }
                }

                // Gets visits descriptions cafe
                $query = "  SELECT  product, model, user, amount
                            FROM    Visits_Descriptions_Cafe
                            WHERE   visitDescription = $visitId
                ";
                $result = $db->query($query);

                if(!$result){
                    throw new Exception('Get current visits descriptions data');
                }
                $currentVisitsDescriptionsCafeInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();

                foreach($currentVisitsDescriptionsCafeInfo as $value){
                    $product = $value['product'] == null ? 'null' : $value['product'];
                    $model = $value['model'] == null ? 'null' : $value['model'];
                    $user = $value['user'] == null ? 'null' : $value['user'];
                    $amount = $value['amount'] == null ? 0 : $value['amount'];

                    $query = "  INSERT INTO Visits_Descriptions_Cafe(
                                    visitDescription, product, model, user, amount
                                )
                                VALUES (
                                    $newVisitId, $product, $model, $user, $amount
                                )
                    ";
                    $result = $db->query($query);

                    if(!$result){
                        throw new Exception('INSERT INTO Visits_Descriptions_Cafe');
                    }
                }

                // Gets current incidents
                $query = "  SELECT  visit, type, name, description, date
                            FROM    Incidents
                            WHERE   visit = $visitId
                ";
                $result = $db->query($query);

                if(!$result){
                    throw new Exception('Get current incidents data');
                }
                $currentIncidentsInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
                foreach($currentIncidentsInfo as $value){
                    $type = $value['type'] == null ? "''" : "'" . $value['type'] . "'";
                    $name = $value['name'] == null ? 'null' : "'" . $value['name'] . "'";
                    $description = $value['description'] == null ? 'null' : "'" . $value['description'] . "'";
                    $date = $value['date'] == null ? 'null' : "'" . $value['date'] . "'";

                    $query = "  INSERT INTO Incidents(
                                    visit, type, name, description, date
                                )
                                VALUES (
                                    $newVisitId, $type, $name, $description, $date
                                )
                    ";
                    $result = $db->query($query);

                    if(!$result){
                        throw new Exception('INSERT INTO Incidents');
                    }
                }
            }
        }
        // End table: Visits + VisitsControl + Visits_Descriptions + Visits_Descriptions_Cafe + Incidents

        // Start table: Expedients_Closed_Death
        $query = "  SELECT  type, model, isOpen, user
                    FROM    Expedients_Closed_Death
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);

        $currentClosedDeathInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        if(count($currentClosedDeathInfo) > 0){
            foreach($currentClosedDeathInfo as $elem){
                $type = $elem['type'] == null ? 'null' : $elem['type'];
                $model = $elem['model'] == null ? 'null' : $elem['model'];
                $isOpen = $elem['isOpen'] == null ? 0 : $elem['isOpen'];
                $user = $elem['user'] == null ? 'null' : $elem['user'];

                $query = "  INSERT INTO Expedients_Closed_Death(expedient, type, model, isOpen, user)
                            VALUES ($newExpedientId, $type, $model, $isOpen, $user)
                ";
                $result = $db->query($query);

                if(!$result){
                    throw new Exception('INSERT INTO Expedients_Closed_Death');
                }
            }

            exec("cp -r $expedientBaseDir/closed-death $newExpedientBaseDir/closed-death", $output, $code);
            if(!empty($output) || $code != 0){
                throw new Exception("Copy folder: $newExpedientBaseDir/closed-death");
            }
        }
        // End table: Expedients_Closed_Death

        // Start table: Expedients_Duel_Received
        $query = "  SELECT  type, model, isOpen, user
                    FROM    Expedients_Duel_Received
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);

        $currentDuelReceivedInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        if(count($currentDuelReceivedInfo) > 0){
            foreach($currentDuelReceivedInfo as $elem){
                $type = $elem['type'] == null ? 'null' : $elem['type'];
                $model = $elem['model'] == null ? 'null' : $elem['model'];
                $isOpen = $elem['isOpen'] == null ? 0 : $elem['isOpen'];
                $user = $elem['user'] == null ? 'null' : $elem['user'];

                $query = "  INSERT INTO Expedients_Duel_Received(expedient, type, model, isOpen, user)
                            VALUES ($newExpedientId, $type, $model, $isOpen, $user)
                ";
                $result = $db->query($query);

                if(!$result){
                    throw new Exception('INSERT INTO Expedients_Duel_Received');
                }
            }

            exec("cp -r $expedientBaseDir/no-duel-received $newExpedientBaseDir/no-duel-received", $output, $code);
            if(!empty($output) || $code != 0){
                throw new Exception("Copy folder: $newExpedientBaseDir/no-duel-received");
            }
        }
        // End table: Expedients_Duel_Received

        // Start table: Expedients_Reminder
        $query = "  SELECT  type, model, isOpen, user
                    FROM    Expedients_Reminder
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);

        $currentReminderInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        if(count($currentReminderInfo) > 0){
            foreach($currentReminderInfo as $elem){
                $type = $elem['type'] == null ? 'null' : $elem['type'];
                $model = $elem['model'] == null ? 'null' : $elem['model'];
                $isOpen = $elem['isOpen'] == null ? 0 : $elem['isOpen'];
                $user = $elem['user'] == null ? 'null' : $elem['user'];

                $query = "  INSERT INTO Expedients_Reminder(expedient, type, model, isOpen, user)
                                        VALUES ($newExpedientId, $type, $model, $isOpen, $user)
                ";
                $result = $db->query($query);

                if(!$result){
                    throw new Exception('INSERT INTO Expedients_Reminder');
                }
            }

            exec("cp -r $expedientBaseDir/reminder $newExpedientBaseDir/reminder", $output, $code);
            if(!empty($output) || $code != 0){
                throw new Exception("Copy folder: $newExpedientBaseDir/reminder");
            }
        }
        // End table: Expedients_Reminder

        // Start table: Expedients_Reminder_Packet
        $query = "  SELECT  type, model, isOpen, user
                    FROM    Expedients_Reminder_Packet
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);

        $currentReminderPacketInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        if(count($currentReminderPacketInfo) > 0){
            foreach($currentReminderPacketInfo as $elem){
                $type = $elem['type'] == null ? 'null' : $elem['type'];
                $model = $elem['model'] == null ? 'null' : $elem['model'];
                $isOpen = $elem['isOpen'] == null ? 0 : $elem['isOpen'];
                $user = $elem['user'] == null ? 'null' : $elem['user'];

                $query = "  INSERT INTO Expedients_Reminder_Packet(expedient, type, model, isOpen, user)
                                        VALUES ($newExpedientId, $type, $model, $isOpen, $user)
                ";
                $result = $db->query($query);

                if(!$result){
                    throw new Exception('INSERT INTO Expedients_Reminder_Packet');
                }
            }

            exec("cp -r $expedientBaseDir/reminder-packet $newExpedientBaseDir/reminder-packet", $output, $code);
            if(!empty($output) || $code != 0){
                throw new Exception("Copy folder: $newExpedientBaseDir/reminder-packet");
            }
        }
        // End table: Expedients_Reminder_Packet

        // Start table: Expedients_Reminder_Packet_Cross
        $query = "  SELECT  type, model, isOpen, user
                    FROM    Expedients_Reminder_Packet_Cross
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);

        $currentReminderPacketCrossInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        if(count($currentReminderPacketCrossInfo) > 0){
            foreach($currentReminderPacketCrossInfo as $elem){
                $type = $elem['type'] == null ? 'null' : $elem['type'];
                $model = $elem['model'] == null ? 'null' : $elem['model'];
                $isOpen = $elem['isOpen'] == null ? 0 : $elem['isOpen'];
                $user = $elem['user'] == null ? 'null' : $elem['user'];

                $query = "  INSERT INTO Expedients_Reminder_Packet_Cross(expedient, type, model, isOpen, user)
                                        VALUES ($newExpedientId, $type, $model, $isOpen, $user)
                ";
                $result = $db->query($query);

                if(!$result){
                    throw new Exception('INSERT INTO Expedients_Reminder_Packet_Cross');
                }
            }

            exec("cp -r $expedientBaseDir/reminder-packet-cross $newExpedientBaseDir/reminder-packet-cross", $output, $code);
            if(!empty($output) || $code != 0){
                throw new Exception("Copy folder: $newExpedientBaseDir/reminder-packet-cross");
            }
        }
        // End table: Expedients_Reminder_Packet_Cross

        // Start table: Expedients_Tombstones
        $query = "  SELECT  type, model, isOpen, user
                    FROM    Expedients_Tombstones
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);

        $currentTombstoneInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        if(count($currentTombstoneInfo) > 0){
            foreach($currentTombstoneInfo as $elem){
                $type = $elem['type'] == null ? 'null' : $elem['type'];
                $model = $elem['model'] == null ? 'null' : $elem['model'];
                $isOpen = $elem['isOpen'] == null ? 0 : $elem['isOpen'];
                $user = $elem['user'] == null ? 'null' : $elem['user'];

                $query = "  INSERT INTO Expedients_Tombstones(expedient, type, model, isOpen, user)
                            VALUES ($newExpedientId, $type, $model, $isOpen, $user)
                ";
                $result = $db->query($query);

                if(!$result){
                    throw new Exception('INSERT INTO Expedients_Tombstones');
                }
            }

            exec("cp -r $expedientBaseDir/tombstone $newExpedientBaseDir/tombstone", $output, $code);
            if(!empty($output) || $code != 0){
                throw new Exception("Copy folder: $newExpedientBaseDir/tombstone");
            }
        }
        // End table: Expedients_Tombstones

        // Start table: Expedients_Press
        $query = "  SELECT  type, model, isOpen, selected, user
                    FROM    Expedients_Press
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);

        $currentPressInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        if(count($currentPressInfo) > 0){
            foreach($currentPressInfo as $elem){
                $type = $elem['type'] == null ? 'null' : $elem['type'];
                $model = $elem['model'] == null ? 'null' : $elem['model'];
                $isOpen = $elem['isOpen'] == null ? 0 : $elem['isOpen'];
                $selected = $elem['selected'] == null ? 0 : $elem['selected'];
                $user = $elem['user'] == null ? 'null' : $elem['user'];

                $query = "  INSERT INTO Expedients_Press(expedient, type, model, isOpen, selected, user)
                            VALUES ($newExpedientId, $type, $model, $isOpen, $selected, $user)
                ";
                $result = $db->query($query);

                if(!$result){
                    throw new Exception('INSERT INTO Expedients_Press');
                }
            }

            exec("cp -r $expedientBaseDir/obituary-press $newExpedientBaseDir/obituary-press", $output, $code);
            if(!empty($output) || $code != 0){
                throw new Exception("Copy folder: $newExpedientBaseDir/obituary-press");
            }
        }
        // End table: Expedients_Press

        // Start table: Expedients_Obituaries
        $query = "  SELECT  ID, namePre, name, surname, extraText, died, prayForCheck, prayForText,
                            prayForGenre, dep, spousePre, spouseName, childrenPre, childrenNames, childrenInLawPre,
                            childrenInLawNames, grandchildrenPre, grandchildrenNames, grandchildrenInLawPre,
                            grandchildrenInLawNames, greatGrandchildrenPre, greatGrandchildrenNames, parentsPre,
                            parentsNames, parentsInLawPre, parentsInLawNames, paternalGrandfathersPre,
                            paternalGrandfathersNames, paternalGrandmotherPre, paternalGrandmotherNames, siblingsPre,
                            siblingsNames, politicalSiblingsPre, politicalSiblingsNames, siblings, politicalSiblings,
                            grandchildren, politicalGrandchildren, greatGrandchildren, uncles, nephews, cousins,
                            restFamily, pray, funeral, mourning, deliverObituariesIn, busRoute, type, model, selected,
                            mortuary, location, roomNumber, html, `update`, obituary, isOpen, user
                    FROM    Expedients_Obituaries
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);

        $currentObituaryInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        if(count($currentObituaryInfo) > 0){
            foreach($currentObituaryInfo as $elem){
                $namePre = $elem['namePre'] == null ? 'null' : "'" . $elem['namePre'] . "'";
                $name = $elem['name'] == null ? "''" : "'" . $elem['name'] . "'";
                $surname = $elem['surname'] == null ? "''" : "'" . $elem['surname'] . "'";
                $extraText = $elem['extraText'] == null ? 'null' : "'" . $elem['extraText'] . "'";
                $died = $elem['died'] == null ? 'null' : "'" . $elem['died'] . "'";
                $prayForCheck = $elem['prayForCheck'] == null ? 0 : $elem['prayForCheck'];
                $prayForText = $elem['prayForText'] == null ? 'null' : "'" . $elem['prayForText'] . "'";
                $prayForGenre = $elem['prayForGenre'] == null ? 'null' : "'" . $elem['prayForGenre'] . "'";
                $dep = $elem['dep'] == null ? 0 : $elem['dep'];
                $spousePre = $elem['spousePre'] == null ? 'null' : "'" . $elem['spousePre'] . "'";
                $spouseName = $elem['spouseName'] == null ? 'null' : "'" . $elem['spouseName'] . "'";
                $childrenPre = $elem['childrenPre'] == null ? 'null' : "'" . $elem['childrenPre'] . "'";
                $childrenNames = $elem['childrenNames'] == null ? 'null' : "'" . $elem['childrenNames'] . "'";
                $childrenInLawPre = $elem['childrenInLawPre'] == null ? 'null' : "'" . $elem['childrenInLawPre'] . "'";
                $childrenInLawNames = $elem['childrenInLawNames'] == null ? 'null' : "'" . $elem['childrenInLawNames'] . "'";
                $grandchildrenPre = $elem['grandchildrenPre'] == null ? 'null' : "'" . $elem['grandchildrenPre'] . "'";
                $grandchildrenNames = $elem['grandchildrenNames'] == null ? 'null' : "'" . $elem['grandchildrenNames'] . "'";
                $grandchildrenInLawPre = $elem['grandchildrenInLawPre'] == null ? 'null' : "'" . $elem['grandchildrenInLawPre'] . "'";
                $grandchildrenInLawNames = $elem['grandchildrenInLawNames'] == null ? 'null' : "'" . $elem['grandchildrenInLawNames'] . "'";
                $greatGrandchildrenPre = $elem['greatGrandchildrenPre'] == null ? 'null' : "'" . $elem['greatGrandchildrenPre'] . "'";
                $greatGrandchildrenNames = $elem['greatGrandchildrenNames'] == null ? 'null' : "'" . $elem['greatGrandchildrenNames'] . "'";
                $parentsPre = $elem['parentsPre'] == null ? 'null' : "'" . $elem['parentsPre'] . "'";
                $parentsNames = $elem['parentsNames'] == null ? 'null' : "'" . $elem['parentsNames'] . "'";
                $parentsInLawPre = $elem['parentsInLawPre'] == null ? 'null' : "'" . $elem['parentsInLawPre'] . "'";
                $parentsInLawNames = $elem['parentsInLawNames'] == null ? 'null' : "'" . $elem['parentsInLawNames'] . "'";
                $paternalGrandfathersPre = $elem['paternalGrandfathersPre'] == null ? 'null' : "'" . $elem['paternalGrandfathersPre'] . "'";
                $paternalGrandfathersNames = $elem['paternalGrandfathersNames'] == null ? 'null' : "'" . $elem['paternalGrandfathersNames'] . "'";
                $paternalGrandmotherPre = $elem['paternalGrandmotherPre'] == null ? 'null' : "'" . $elem['paternalGrandmotherPre'] . "'";
                $paternalGrandmotherNames = $elem['paternalGrandmotherNames'] == null ? 'null' : "'" . $elem['paternalGrandmotherNames'] . "'";
                $siblingsPre = $elem['siblingsPre'] == null ? 'null' : "'" . $elem['siblingsPre'] . "'";
                $siblingsNames = $elem['siblingsNames'] == null ? 'null' : "'" . $elem['siblingsNames'] . "'";
                $politicalSiblingsPre = $elem['politicalSiblingsPre'] == null ? 'null' : "'" . $elem['politicalSiblingsPre'] . "'";
                $politicalSiblingsNames = $elem['politicalSiblingsNames'] == null ? 'null' : "'" . $elem['politicalSiblingsNames'] . "'";
                $siblings = $elem['siblings'] == null ? 0 : $elem['siblings'];
                $politicalSiblings = $elem['politicalSiblings'] == null ? 0 : $elem['politicalSiblings'];
                $grandchildren = $elem['grandchildren'] == null ? 0 : $elem['grandchildren'];
                $politicalGrandchildren = $elem['politicalGrandchildren'] == null ? 0 : $elem['politicalGrandchildren'];
                $greatGrandchildren = $elem['greatGrandchildren'] == null ? 0 : $elem['greatGrandchildren'];
                $uncles = $elem['uncles'] == null ? 0 : $elem['uncles'];
                $nephews = $elem['nephews'] == null ? 0 : $elem['nephews'];
                $cousins = $elem['cousins'] == null ? 0 : $elem['cousins'];
                $restFamily = $elem['restFamily'] == null ? 'null' : "'" . $elem['restFamily'] . "'";
                $pray = $elem['pray'] == null ? 'null' : "'" . $elem['pray'] . "'";
                $funeral = $elem['funeral'] == null ? 'null' : "'" . $elem['funeral'] . "'";
                $mourning = $elem['mourning'] == null ? 0 : $elem['mourning'];
                $deliverObituariesIn = $elem['deliverObituariesIn'] == null ? 'null' : "'" . $elem['deliverObituariesIn'] . "'";
                $busRoute = $elem['busRoute'] == null ? 'null' : "'" . $elem['busRoute'] . "'";
                $type = $elem['type'] == null ? 0 : $elem['type'];
                $model = $elem['model'] == null ? 0 : $elem['model'];
                $selected = $elem['selected'] == null ? 0 : $elem['selected'];
                $mortuary = $elem['mortuary'] == null ? "''" : "'" . $elem['mortuary'] . "'";
                $location = $elem['location'] == null ? "''" : "'" . $elem['location'] . "'";
                $roomNumber = $elem['roomNumber'] == null ? 'null' : "'" . $elem['roomNumber'] . "'";
                $html = $elem['html'] == null ? 'null' : "'" . $elem['html'] . "'";
                $update = $elem['update'] == null ? $time : "'" . $elem['update'] . "'";
                $obituary = $elem['obituary'] == null ? 'null' : "'" . $elem['obituary'] . "'";
                $isOpen = $elem['isOpen'] == null ? 0 : $elem['isOpen'];
                $user = $elem['user'] == null ? 'null' : $elem['user'];

                $query = "  INSERT INTO Expedients_Obituaries(
                                expedient, namePre, name, surname, extraText, died, prayForCheck, prayForText,
                                prayForGenre, dep, spousePre, spouseName, childrenPre, childrenNames, childrenInLawPre,
                                childrenInLawNames, grandchildrenPre, grandchildrenNames, grandchildrenInLawPre,
                                grandchildrenInLawNames, greatGrandchildrenPre, greatGrandchildrenNames, parentsPre,
                                parentsNames, parentsInLawPre, parentsInLawNames, paternalGrandfathersPre,
                                paternalGrandfathersNames, paternalGrandmotherPre, paternalGrandmotherNames, siblingsPre,
                                siblingsNames, politicalSiblingsPre, politicalSiblingsNames, siblings, politicalSiblings,
                                grandchildren, politicalGrandchildren, greatGrandchildren, uncles, nephews, cousins,
                                restFamily, pray, funeral, mourning, deliverObituariesIn, busRoute, type, model, selected,
                                mortuary, location, roomNumber, html, `update`, obituary, isOpen, user
                            )
                            VALUES (
                                $newExpedientId, $namePre, $name, $surname, $extraText, $died, $prayForCheck, $prayForText,
                                $prayForGenre, $dep, $spousePre, $spouseName, $childrenPre, $childrenNames, $childrenInLawPre,
                                $childrenInLawNames, $grandchildrenPre, $grandchildrenNames, $grandchildrenInLawPre,
                                $grandchildrenInLawNames, $greatGrandchildrenPre, $greatGrandchildrenNames, $parentsPre,
                                $parentsNames, $parentsInLawPre, $parentsInLawNames, $paternalGrandfathersPre,
                                $paternalGrandfathersNames, $paternalGrandmotherPre, $paternalGrandmotherNames, $siblingsPre,
                                $siblingsNames, $politicalSiblingsPre, $politicalSiblingsNames, $siblings, $politicalSiblings,
                                $grandchildren, $politicalGrandchildren, $greatGrandchildren, $uncles, $nephews, $cousins,
                                $restFamily, $pray, $funeral, $mourning, $deliverObituariesIn, $busRoute, $type, $model, $selected,
                                $mortuary, $location, $roomNumber, $html, $update, $obituary, $isOpen, $user
                            )
                ";
                $result = $db->query($query);

                if(!$result){
                    throw new Exception('INSERT INTO Expedients_Obituaries');
                }
            }

            exec("cp -r $expedientBaseDir/obituary $newExpedientBaseDir/obituary", $output, $code);
            if(!empty($output) || $code != 0){
                throw new Exception("Copy folder: $newExpedientBaseDir/obituary");
            }
        }
        // End table: Expedients_Obituaries

        // Start table: Expedients_Obituaries_Images
        $query = "  SELECT  name, main, create_date, update_date, delete_date
                    FROM    Expedients_Obituaries_Images
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);

        $currentObituaryImagesInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        if(count($currentObituaryImagesInfo) > 0){
            foreach($currentObituaryImagesInfo as $elem){
                $name = $elem['name'] == null ? 'null' : "'" . $elem['name'] . "'";
                $main = $elem['main'] == null ? 0 : $elem['main'];
                $createDate = $elem['create_date'] == null ? 'null' : $elem['create_date'];
                $updateDate = $elem['update_date'] == null ? 'null' : $elem['update_date'];
                $deleteDate = $elem['delete_date'] == null ? 'null' : $elem['delete_date'];

                $query = "  INSERT INTO Expedients_Obituaries_Images(
                                expedient, name, main, create_date, update_date, delete_date
                            )
                            VALUES (
                                $newExpedientId, $name, $main, $createDate, $updateDate, $deleteDate
                            )
                ";
                $result = $db->query($query);

                if(!$result){
                    throw new Exception('INSERT INTO Expedients_Obituaries_Images');
                }
            }
        }
        // End table: Expedients_Obituaries_Images

        // Start table: Expedients_Documents
        $query = "  SELECT  user, type, date, name, file, nameFile
                    FROM    Expedients_Documents
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);

        $currentDocumentsInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        if(count($currentDocumentsInfo) > 0){
            foreach($currentDocumentsInfo as $elem){
                $user = $elem['user'] == null ? 'null' : $elem['user'];
                $type = $elem['type'] == null ? 1 : $elem['type'];
                $date = $elem['date'] == null ? 'null' : "'" . $elem['date'] . "'";
                $name = $elem['name'] == null ? "''" : "'" . $elem['name'] . "'";
                $file = $elem['file'] == null ? 'null' : "'" . $elem['file'] . "'";
                $nameFile = $elem['nameFile'] == null ? 'null' : "'" . $elem['nameFile'] . "'";

                $query = "  INSERT INTO Expedients_Documents(
                                expedient, user, type, date, name, file, nameFile
                            )
                            VALUES (
                                $newExpedientId, $user, $type, $date, $name, $file, $nameFile
                            )
                ";
                $result = $db->query($query);

                if(!$result){
                    throw new Exception('INSERT INTO Expedients_Documents');
                }
            }

            exec("cp -r $expedientBaseDir/docs $newExpedientBaseDir/docs", $output, $code);
            if(!empty($output) || $code != 0){
                throw new Exception("Copy folder: $newExpedientBaseDir/docs");
            }
        }
        // End table: Expedients_Documents

        // Start table: Expedients_Documents_Editor
        $query = "  SELECT  ID, document, user, userOpen, documentName, date, isOpen, leavingDate, isSigned
                    FROM    Expedients_Documents_Editor
                    WHERE   expedient = $expedientId
        ";
        $result = $db->query($query);

        $currentDocumentsInfo = mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : array();
        if(count($currentDocumentsInfo) > 0){
            foreach($currentDocumentsInfo as $elem){
                $documentId = $elem['ID'] == null ? 'null' : $elem['ID'];
                $document = $elem['document'] == null ? 'null' : $elem['document'];
                $user = $elem['user'] == null ? 'null' : $elem['user'];
                $userOpen = $elem['userOpen'] == null ? 'null' : $elem['userOpen'];
                $documentName = $elem['documentName'] == null ? 'null' : "'" . $elem['documentName'] . "'";
                $date = $elem['date'] == null ? 'null' : $elem['date'];
                $isOpen = $elem['isOpen'] == null ? 0 : $elem['isOpen'];
                $leavingDate = $elem['leavingDate'] == null ? 'null' : $elem['leavingDate'];
                $isSigned = $elem['isSigned'] == null ? 'null' : $elem['isSigned'];

                $query = "  INSERT INTO Expedients_Documents_Editor(
                                expedient, document, user, userOpen, documentName, date, isOpen, leavingDate, isSigned
                            )
                            VALUES (
                                $newExpedientId, $document, $user, $userOpen, $documentName, $date, $isOpen, $leavingDate, $isSigned
                            )
                ";
                $result = $db->query($query);

                if(!$result){
                    throw new Exception('INSERT INTO Expedients_Documents_Editor');
                }
                $newDocumentId = $db->getLastInsertId();

                mkdir("$newExpedientBaseDir/documentsEditor/$newDocumentId", 0777, true);

                exec("cp -r $expedientBaseDir/documentsEditor/$documentId/files $newExpedientBaseDir/documentsEditor/$newDocumentId", $output, $code);
                if(!empty($output) || $code != 0){
                    throw new Exception("Copy folder: $expedientBaseDir/documentsEditor/$documentId/files $newExpedientBaseDir/documentsEditor/$newDocumentId");
                }
                exec("cp -r $expedientBaseDir/documentsEditor/$documentId/img $newExpedientBaseDir/documentsEditor/$newDocumentId", $output, $code);
                if(!empty($output) || $code != 0){
                    throw new Exception("Copy folder: $expedientBaseDir/documentsEditor/$documentId/img $newExpedientBaseDir/documentsEditor/$newDocumentId");
                }
            }
        }
        // End table: Expedients_Documents_Editor

        $db->query("COMMIT");
    }catch (Exception $e) {
        $db->query("ROLLBACK");

        var_dump($e->getMessage());
        // return [
        //     "status" => false,
        //     "error" => $e->getMessage()
        // ];
    }
?>