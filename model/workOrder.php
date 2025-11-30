<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class WorkOrder{

        /**
         * Obtiene los datos de una orden de trabajo
         * 
         * @param array ID del expediente
         * @return array Datos de la orden de trabajo
         */
        public function getWorkOrderInfo($data){
            $db = new DbHandler;

            $info = array();

            $expedient = cleanStr($data['ID']);

            $result = $db->query("  SELECT      ex.number,
                                                ex.internalRef,
                                                CASE
                                                    WHEN ex.clientType = 1 THEN 'Particulares'
                                                    WHEN ex.clientType = 2 THEN 'Seguros'
                                                    ELSE 'Empresas'
                                                END as client_type_name,
                                                CASE
                                                    WHEN ex.clientType = 1 THEN IF(cl.surname IS NOT NULL, CONCAT(cl.name, ' ', cl.surname), cl.name)
                                                    ELSE IF(cl.brandName IS NOT NULL, CONCAT(cl.name, ' - ', cl.brandName), cl.name)
                                                END as client_name,
                                                IF(st1.surname IS NOT NULL, CONCAT(st1.name, ' ', st1.surname), st1.name) as family_assistance,
                                                ex.funeralDate, ex.funeralTime,
                                                ex.deceasedName, ex.deceasedSurname, ex.deceasedNIF, ex.deceasedBirthday, ex.deceasedDate, ex.deceasedTime,
                                                CONCAT(l1.name, ', ', l1.province) AS deceasedLocation, ex.deceasedCause, ex.moveJudicial,
                                                IF(ex.familyContactSurname IS NOT NULL, CONCAT(ex.familyContactName, ' ', ex.familyContactSurname), ex.familyContactName) as family_contact,
                                                ex.familyContactRelationship, ex.familyContactPhone,
                                                m.name AS deceasedMortuaryName, ex.deceasedRoom,
                                                IF(ex.startVelacionDate IS NULL, ex.funeralHomeEntryDate, ex.startVelacionDate) as start_velacion_date_v1,
                                                IF(ex.startVelacionTime IS NULL, ex.funeralHomeEntryTime, ex.startVelacionTime) as start_velacion_time_v1,
                                                IF(ex.endVelacionDate IS NULL, ex.funeralDate, ex.endVelacionDate) as end_velacion_date_v1,
                                                IF(ex.endVelacionTime IS NULL, ex.funeralTime, ex.endVelacionTime) as end_velacion_time_v1,
                                                ex.startVelacionDate2 as start_velacion_date_v2,
                                                ex.startVelacionTime2 as start_velacion_time_v2,
                                                IF(ex.endVelacionDate2 IS NULL AND ex.startVelacionDate2 IS NOT NULL, ex.funeralDate, ex.endVelacionDate2) as end_velacion_date_v2,
                                                IF(ex.endVelacionTime2 IS NULL AND ex.endVelacionTime IS NOT NULL, ex.funeralTime, ex.endVelacionTime2) as end_velacion_time_v2,
                                                ex.churchLabel, ch.name AS churchName, ex.otherCeremony,
                                                ex.ceremonyDate, ex.ceremonyTime,
                                                cr.name as crematoriumName, ev.start as crematoriumEntry, ev.end as crematoriumLeaving,
                                                ex.trazabilityId, IF(st2.surname IS NOT NULL, CONCAT(st2.name, ' ', st2.surname), st2.name) as crematorium_technical,
                                                ex.cremation,
                                                ex.crematoriumContactPerson, ex.crematoriumContactPhonePerson, ex.crematoriumIntroduction, ex.crematoriumArriveTime, ex.crematoriumWaitOnRoom, ex.crematoriumVaseBio,
                                                ex.authName, ex.authDni, ex.authContactPhone, ex.authDate, ex.authTime, ex.authPlace,
                                                ex.cemeteryLabel, ex.otherInhumation,
                                                cem.name AS cemeteryName,
                                                ex.funeralDateBurial, ex.funeralTimeBurial, nch.name as niche,
                                                CASE
                                                    WHEN ex.regime = 1 THEN 'Propiedad'
                                                    WHEN ex.regime = 2 THEN 'Alquiler'
                                                    WHEN ex.regime = 3 THEN 'Concesión'
                                                    WHEN ex.regime = 4 THEN 'Cesión Temporal'
                                                    ELSE ''
                                                END as niche_regime,
                                                ex.funeralNicheNumber, 
                                                CASE
                                                    WHEN ex.nicheHeight = 1 THEN '1º'
                                                    WHEN ex.nicheHeight = 2 THEN '2º'
                                                    WHEN ex.nicheHeight = 3 THEN '3º'
                                                    WHEN ex.nicheHeight = 4 THEN '4º'
                                                    WHEN ex.nicheHeight = 5 THEN '5º'
                                                    WHEN ex.nicheHeight = 6 THEN '6º'
                                                    WHEN ex.nicheHeight = 7 THEN '7º'
                                                    WHEN ex.nicheHeight = 8 THEN '8º'
                                                    ELSE ''
                                                END as nicheHeight,
                                                ex.deceasedNiche as exhumation1, ex.funeralDateNiche as exhumationDate1,
                                                ex.deceasedNiche2 as exhumation2, ex.funeralDateNiche2 as exhumationDate2,
                                                ex.deceasedNiche3 as exhumation3, ex.funeralDateNiche3 as exhumationDate3,
                                                ex.exhumation,
                                                fh.name as moveFuneralHome,
                                                fh.phones as moveFuneralHomePhone,
                                                ex.moveContactPerson,
                                                ex.moveContactPhone,
                                                l2.province as moveCollectionProvince,
                                                l2.name as moveCollectionLocality,
                                                ex.moveCollectionAddress,
                                                ex.moveDestinationAddress,
                                                l3.province as moveDestinationProvince,
                                                l3.name as moveDestinationLocality,
                                                ex.moveVia,
                                                car.licensePlate as carCollection2,
                                                IF(st3.surname IS NOT NULL, CONCAT(st3.name, ' ', st3.surname), st3.name) as staffTransfer1,
                                                IF(st4.surname IS NOT NULL, CONCAT(st4.name, ' ', st4.surname), st4.name) as staffTransfer2,
                                                ex.moveLeavingDate,
                                                ex.moveLeavingTime,
                                                ex.agency,
                                                ex.agencyContact,
                                                ex.agencyContactPhone,
                                                ex.departureDate,
                                                ex.departureTime,
                                                ex.arrivalDate,
                                                ex.arrivalTime,
                                                ex.airportOrigin,
                                                ex.arrivalAirport,
                                                ex.flightNumber,
                                                es.webConfirm, es.showAgeObituaryWeb, es.showFinalDestinationWeb, es.showVelationWeb, es.showCeremonyWeb
                                    FROM        (Expedients ex, Expedients_Services es)
                                    LEFT JOIN   Clients cl ON ex.client = cl.clientID
                                    LEFT JOIN   Staff st1 ON es.familyAssistance = st1.ID
                                    LEFT JOIN   DeceasedIn di ON di.deceasedInID = ex.deceasedLocation
                                    LEFT JOIN   Locations l1 ON l1.locationID = di.location
                                    LEFT JOIN   Mortuaries m ON ex.deceasedMortuary = m.mortuaryID
                                    LEFT JOIN   Churches ch ON ch.churchID = ex.church
                                    LEFT JOIN   Crematoriums cr ON cr.crematoriumID = ex.crematorium
                                    LEFT JOIN   Events ev ON ex.crematoriumEvent = ev.ID AND ev.leavingDate IS NULL
                                    LEFT JOIN   Staff st2 ON ex.crematoriumTechnical = st2.ID
                                    LEFT JOIN   Cemeteries cem ON ex.cemetery = cem.cemeteryID
                                    LEFT JOIN   Niches nch ON ex.niche = nch.nicheID
                                    LEFT JOIN   FuneralHomes fh ON ex.moveFuneralHome = fh.funeralHomeID
                                    LEFT JOIN   Locations l2 ON ex.moveCollection = l2.locationID
                                    LEFT JOIN   Locations l3 ON ex.moveDestination = l3.locationID
                                    LEFT JOIN   Cars car ON es.carCollection2 = car.ID
                                    LEFT JOIN   Staff st3 ON es.staffTransfer1 = st3.ID
                                    LEFT JOIN   Staff st4 ON es.staffTransfer2 = st4.ID
                                    WHERE       ex.expedientID = es.expedient AND
                                                ex.expedientID = " . $expedient
            );

            $info['expedient'] = mysqli_num_rows($result) == 0 ? null : $db->resultToArray($result)[0];

            // Get suppliers cars
            $cars = $db->query("    SELECT      IF(ca.surname IS NOT NULL, CONCAT(ca.name, ' ', ca.surname), ca.name) as driver_name,
                                                c.licensePlate as car
                                    FROM        (Cars c, Services_Cars sc, Expedients e)
                                    LEFT JOIN   Carriers ca ON sc.driver = ca.carrierID
                                    LEFT JOIN   Services_Carriers sca ON ca.carrierID = sca.carrier AND sca.service = e.expedientID
                                    WHERE       e.expedientID = sc.service AND
                                                c.ID = sc.car AND
                                                sc.service = " . $expedient
            );

            if(mysqli_num_rows($cars) > 0){
                $info['cars'] = $db->resultToArray($cars);
            }else{
                $info['cars'] = array();
            }

            // Get arca
            $arca = $db->query("    SELECT  CONCAT(s.name, ' - ', pm.name) as name
                                    FROM    Expedients_Hirings eh, Products p, Products_Models pm, Suppliers s
                                    WHERE   eh.expedient = " . $expedient . " AND
                                            eh.check = 1 AND
                                            eh.product = p.productID AND
                                            p.isArca = 1 AND
                                            eh.model = pm.productModelID AND
                                            eh.supplier = s.supplierID
            ");

            if(mysqli_num_rows($arca) > 0){
                $resultArks = $db->resultToArray($arca);
                
                $arkName = '';
                foreach($resultArks as $item){
                    $arkName .= $item['name'] . ' + ';
                }
                if($arkName != ''){
                    $arkName = substr($arkName, 0, -3);
                }

                $info['expedient']['arkName'] = $arkName;
            }else{
                $info['expedient']['arkName'] = null;
            }

            // Get work order info
            $workOrder = $db->query("   SELECT      exwo.*,
                                                    CONCAT(st1.name, ' ', st1.surname) as translationResponsibleSealedName
                                        FROM        Expedients_Work_Orders exwo
                                        LEFT JOIN   Staff st1 ON exwo.translationResponsibleSealed = st1.ID
                                        WHERE       exwo.expedient = " . $expedient . "
            ");

            if(mysqli_num_rows($workOrder) > 0){
                $info['workOrder'] = $db->resultToArray($workOrder)[0];
            }else{
                $info['workOrder'] = null;
            }

            // Get communication items
            $whereCommunication = '';
            if($info['workOrder'] != null){
                $whereCommunication = " AND exwoc.workOrder = {$info['workOrder']['ID']}";
            }
            $communication = $db->query("   SELECT      eh.ID, 
                                                        p.name as product_name, 
                                                        pm.name as model_name,
                                                        exwoc.ID as work_order_communication_id,
                                                        exwoc.date,
                                                        exwoc.photo
                                            FROM        (Expedients_Hirings eh, Products p, Products_Models pm, Suppliers s)
                                            LEFT JOIN   Expedients_Work_Orders_Communication exwoc ON exwoc.hiring = eh.ID AND exwoc.leavingDate IS NULL $whereCommunication
                                            WHERE       eh.expedient = " . $expedient . " AND
                                                        eh.check = 1 AND
                                                        eh.product = p.productID AND
                                                        p.blockBelow = 8 AND
                                                        eh.model = pm.productModelID AND
                                                        eh.supplier = s.supplierID
                                                        
            ");

            if(mysqli_num_rows($communication) > 0){
                $info['communication'] = $db->resultToArray($communication);
            }else{
                $info['communication'] = array();
            }

            // Get flowers items
            $whereFlowers = '';
            if($info['workOrder'] != null){
                $whereFlowers = " AND exwof.workOrder = {$info['workOrder']['ID']}";
            }
            $flowers = $db->query(" SELECT      eh.ID,
                                                s.name as supplier_name,
                                                p.name as product_name, 
                                                pm.name as model_name, 
                                                REPLACE(et.value, '\\\', '') as texts,
                                                exwof.ID as work_order_flowers_id,
                                                exwof.date,
                                                exwof.time
                                    FROM        (Expedients_Hirings eh, Products p, Products_Models pm, Suppliers s, Expedients_Texts et)
                                    LEFT JOIN   Expedients_Work_Orders_Flowers exwof ON exwof.hiring = eh.ID $whereFlowers
                                    WHERE       eh.expedient = " . $expedient . " AND
                                                eh.check = 1 AND
                                                eh.product = p.productID AND
                                                p.blockBelow = 3 AND
                                                eh.model = pm.productModelID AND
                                                eh.supplier = s.supplierID AND
                                                et.hiring = eh.ID AND
                                                exwof.leavingDate IS NULL
                                    GROUP BY    s.name, p.name, pm.name, et.value
            ");

            if(mysqli_num_rows($flowers) > 0){
                $info['flowers'] = $db->resultToArray($flowers);
            }else{
                $info['flowers'] = array();
            }

            // Works orders documents generated
            $info['workOrdersDocsGenerated'] = [];
            if($info['workOrder'] != null){
                $workOrderDir = $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/'. $expedient . '/workOrders/';
                if(is_dir($workOrderDir)){
                    foreach(scandir($workOrderDir) as $elem){
                        if($elem != '.' && $elem != '..'){
                            array_push($info['workOrdersDocsGenerated'], [filemtime($workOrderDir . '/' . $elem), $elem]);
                        }
                    }
                }
            }

            return $info;
        }

        /**
         * Genera una orden de trabajo para un expediente
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;
            
            $data['expedient'] = cleanStr($data['expedient']);
            
            $data['clientTracing'] = cleanStr($data['clientTracing']);
            $clientTracing = $data['clientTracing'] == '' ? 'null' : "'" . $data['clientTracing'] . "'";

            $data['carrierRoom'] = cleanStr($data['carrierRoom']);
            $carrierRoom = $data['carrierRoom'] == '' ? 'null' : "'" . $data['carrierRoom'] . "'";

            $data['arkCross'] = cleanStr($data['arkCross']);
            $data['arkJesus'] = cleanStr($data['arkJesus']);
            $data['arkOther'] = cleanStr($data['arkOther']);
            $data['arkOtherName'] = cleanStr($data['arkOtherName']);
            $arkOtherName = $data['arkOtherName'] == '' ? 'null' : "'" . $data['arkOtherName'] . "'";
            $data['arkAesthetics'] = cleanStr($data['arkAesthetics']);
            $arkAesthetics = $data['arkAesthetics'] == '' ? 'null' : "'" . $data['arkAesthetics'] . "'";
            $data['arkClothes'] = cleanStr($data['arkClothes']);
            $arkClothes = $data['arkClothes'] == '' ? 'null' : "'" . $data['arkClothes'] . "'";
            $data['arkClothesPhoto'] = cleanStr($data['arkClothesPhoto']);
            $data['arkClothesRosary'] = cleanStr($data['arkClothesRosary']);
            $data['arkClothesOwn'] = cleanStr($data['arkClothesOwn']);
            $data['arkClothesYes'] = cleanStr($data['arkClothesYes']);
            $data['arkClothesNo'] = cleanStr($data['arkClothesNo']);
            $data['arkPersonalItems'] = cleanStr($data['arkPersonalItems']);
            $arkPersonalItems = $data['arkPersonalItems'] == '' ? 'null' : "'" . $data['arkPersonalItems'] . "'";
            $data['arkPersonalItemsPacemaker'] = cleanStr($data['arkPersonalItemsPacemaker']);
            $data['arkPersonalItemsShroud'] = cleanStr($data['arkPersonalItemsShroud']);
            $data['arkThanatoplasty'] = cleanStr($data['arkThanatoplasty']);
            $data['arkThanatoplastyDate'] = isset($data['arkThanatoplastyDate']) ? cleanStr($data['arkThanatoplastyDate']) : '';
            $arkThanatoplastyDate = $data['arkThanatoplastyDate'] == '' ? 'null' : $data['arkThanatoplastyDate'];
            $data['arkThanatoplastyTime'] = isset($data['arkThanatoplastyTime']) ? cleanStr($data['arkThanatoplastyTime']) : '';
            $arkThanatoplastyTime = $data['arkThanatoplastyTime'] == '' ? 'null' : $data['arkThanatoplastyTime'];
            $data['arkThanatopraxy'] = cleanStr($data['arkThanatopraxy']);
            $data['arkThanatopraxyDate'] = isset($data['arkThanatopraxyDate']) ? cleanStr($data['arkThanatopraxyDate']) : '';
            $arkThanatopraxyDate = $data['arkThanatopraxyDate'] == '' ? 'null' : $data['arkThanatopraxyDate'];
            $data['arkThanatopraxyTime'] = isset($data['arkThanatopraxyTime']) ? cleanStr($data['arkThanatopraxyTime']) : '';
            $arkThanatopraxyTime = $data['arkThanatopraxyTime'] == '' ? 'null' : $data['arkThanatopraxyTime'];
            $data['arkCTransient'] = cleanStr($data['arkCTransient']);
            $data['arkCTransientDate'] = isset($data['arkCTransientDate']) ? cleanStr($data['arkCTransientDate']) : '';
            $arkCTransientDate = $data['arkCTransientDate'] == '' ? 'null' : $data['arkCTransientDate'];
            $data['arkCTransientTime'] = isset($data['arkCTransientTime']) ? cleanStr($data['arkCTransientTime']) : '';
            $arkCTransientTime = $data['arkCTransientTime'] == '' ? 'null' : $data['arkCTransientTime'];
            $data['arkEmbalmment'] = cleanStr($data['arkEmbalmment']);
            $data['arkEmbalmmentDate'] = isset($data['arkEmbalmmentDate']) ? cleanStr($data['arkEmbalmmentDate']) : '';
            $arkEmbalmmentDate = $data['arkEmbalmmentDate'] == '' ? 'null' : $data['arkEmbalmmentDate'];
            $data['arkEmbalmmentTime'] = isset($data['arkEmbalmmentTime']) ? cleanStr($data['arkEmbalmmentTime']) : '';
            $arkEmbalmmentTime = $data['arkEmbalmmentTime'] == '' ? 'null' : $data['arkEmbalmmentTime'];
            $data['arkMortuaryPractitioner'] = cleanStr($data['arkMortuaryPractitioner']);
            $arkMortuaryPractitioner = $data['arkMortuaryPractitioner'] == '' ? 'null' : "'" . $data['arkMortuaryPractitioner'] . "'";
            $data['arkMortuaryPractitionerNif'] = cleanStr($data['arkMortuaryPractitionerNif']);
            $arkMortuaryPractitionerNif = $data['arkMortuaryPractitionerNif'] == '' ? 'null' : "'" . $data['arkMortuaryPractitionerNif'] . "'";
            $data['velationCatering'] = cleanStr($data['velationCatering']);
            $data['velationMemoriesScreen'] = cleanStr($data['velationMemoriesScreen']);
            $data['velationPrivate'] = cleanStr($data['velationPrivate']);
            $data['velationArkClosed'] = cleanStr($data['velationArkClosed']);
            $data['velationPhotoFrame'] = cleanStr($data['velationPhotoFrame']);
            $data['ceremonyResponse'] = cleanStr($data['ceremonyResponse']);
            $data['ceremonyResponsePlace'] = cleanStr($data['ceremonyResponsePlace']);
            $ceremonyResponsePlace = $data['ceremonyResponsePlace'] == '' ? 'null' : "'" . $data['ceremonyResponsePlace'] . "'";
            $data['ceremonyFamilyWaitChurch'] = cleanStr($data['ceremonyFamilyWaitChurch']);
            $data['ceremonyMusicalService'] = cleanStr($data['ceremonyMusicalService']);
            $ceremonyMusicalService = $data['ceremonyMusicalService'] == '' ? 'null' : "'" . $data['ceremonyMusicalService'] . "'";
            $data['ceremonyBodyPresent'] = cleanStr($data['ceremonyBodyPresent']);
            $data['ceremonyUrn'] = cleanStr($data['ceremonyUrn']);
            $data['ceremonyWhoTakesUrn'] = cleanStr($data['ceremonyWhoTakesUrn']);
            $ceremonyWhoTakesUrn = $data['ceremonyWhoTakesUrn'] == '' ? 'null' : "'" . $data['ceremonyWhoTakesUrn'] . "'";
            $data['ceremonyChurchPayment'] = cleanStr($data['ceremonyChurchPayment']);
            $ceremonyChurchPayment = $data['ceremonyChurchPayment'] == '' ? 'null' : "'" . $data['ceremonyChurchPayment'] . "'";
            $data['crematoryCollectingAshesDate'] = cleanStr($data['crematoryCollectingAshesDate']);
            $crematoryCollectingAshesDate = $data['crematoryCollectingAshesDate'] == '' ? 'null' : $data['crematoryCollectingAshesDate'];
            $data['crematoryCollectingAshesTime'] = cleanStr($data['crematoryCollectingAshesTime']);
            $crematoryCollectingAshesTime = $data['crematoryCollectingAshesTime'] == '' ? 'null' : $data['crematoryCollectingAshesTime'];
            $data['crematoryUrn'] = cleanStr($data['crematoryUrn']);
            $crematoryUrn = $data['crematoryUrn'] == '' ? 'null' : "'" . $data['crematoryUrn'] . "'";
            $data['crematoryNotes'] = cleanTextArea($data['crematoryNotes']);
            $crematoryNotes = $data['crematoryNotes'] == '' ? 'null' : "'" . $data['crematoryNotes'] . "'";
            $data['inhumationStreet'] = cleanStr($data['inhumationStreet']);
            $inhumationStreet = $data['inhumationStreet'] == '' ? 'null' : "'" . $data['inhumationStreet'] . "'";
            $data['inhumationBlock'] = cleanStr($data['inhumationBlock']);
            $inhumationBlock = $data['inhumationBlock'] == '' ? 'null' : "'" . $data['inhumationBlock'] . "'";
            $data['inhumationAttendOpening'] = cleanStr($data['inhumationAttendOpening']);
            $data['inhumationDeclarant'] = cleanStr($data['inhumationDeclarant']);
            $inhumationDeclarant = $data['inhumationDeclarant'] == '' ? 'null' : "'" . $data['inhumationDeclarant'] . "'";
            $data['inhumationDeclarantPhone'] = cleanStr($data['inhumationDeclarantPhone']);
            $inhumationDeclarantPhone = $data['inhumationDeclarantPhone'] == '' ? 'null' : "'" . $data['inhumationDeclarantPhone'] . "'";
            $data['inhumationDeclarantDate'] = cleanStr($data['inhumationDeclarantDate']);
            $inhumationDeclarantDate = $data['inhumationDeclarantDate'] == '' ? 'null' : $data['inhumationDeclarantDate'];
            $data['inhumationDeclarantTime'] = cleanStr($data['inhumationDeclarantTime']);
            $inhumationDeclarantTime = $data['inhumationDeclarantTime'] == '' ? 'null' : $data['inhumationDeclarantTime'];
            $data['inhumationIronCross'] = cleanStr($data['inhumationIronCross']);
            $data['inhumationIronCrossOther'] = cleanStr($data['inhumationIronCrossOther']);
            $inhumationIronCrossOther = $data['inhumationIronCrossOther'] == '' ? 'null' : "'" . $data['inhumationIronCrossOther'] . "'";
            $data['inhumationReburial1'] = cleanStr($data['inhumationReburial1']);
            $data['inhumationNotes1'] = isset($data['inhumationNotes1']) ? cleanStr($data['inhumationNotes1']) : '';
            $inhumationNotes1 = $data['inhumationNotes1'] == '' ? 'null' : "'" . $data['inhumationNotes1'] . "'";
            $data['inhumationReburial2'] = cleanStr($data['inhumationReburial2']);
            $data['inhumationNotes2'] = isset($data['inhumationNotes2']) ? cleanStr($data['inhumationNotes2']) : '';
            $inhumationNotes2 = $data['inhumationNotes2'] == '' ? 'null' : "'" . $data['inhumationNotes2'] . "'";
            $data['inhumationReburial3'] = cleanStr($data['inhumationReburial3']);
            $data['inhumationNotes3'] = isset($data['inhumationNotes3']) ? cleanStr($data['inhumationNotes3']) : '';
            $inhumationNotes3 = $data['inhumationNotes3'] == '' ? 'null' : "'" . $data['inhumationNotes3'] . "'";
            $data['inhumationRemoveTombstone'] = cleanStr($data['inhumationRemoveTombstone']);
            $data['inhumationRemoveTombstoneNote'] = cleanStr($data['inhumationRemoveTombstoneNote']);
            $inhumationRemoveTombstoneNote = $data['inhumationRemoveTombstoneNote'] == '' ? 'null' : "'" . $data['inhumationRemoveTombstoneNote'] . "'";
            $data['inhumationNotes'] = cleanTextArea($data['inhumationNotes']);
            $inhumationNotes = $data['inhumationNotes'] == '' ? 'null' : "'" . $data['inhumationNotes'] . "'";
            $data['translationMoveContactEmail'] = cleanStr($data['translationMoveContactEmail']);
            $translationMoveContactEmail = $data['translationMoveContactEmail'] == '' ? 'null' : "'" . $data['translationMoveContactEmail'] . "'";
            $data['translationMoveDestinationCountry'] = cleanStr($data['translationMoveDestinationCountry']);
            $translationMoveDestinationCountry = $data['translationMoveDestinationCountry'] == '' ? 'null' : "'" . $data['translationMoveDestinationCountry'] . "'";
            $data['translationDepositAirport'] = cleanStr($data['translationDepositAirport']);
            $translationDepositAirport = $data['translationDepositAirport'] == '' ? 'null' : "'" . $data['translationDepositAirport'] . "'";
            $data['translationDepositDate'] = cleanStr($data['translationDepositDate']);
            $translationDepositDate = $data['translationDepositDate'] == '' ? 'null' : $data['translationDepositDate'];
            $data['translationDepositTime'] = cleanStr($data['translationDepositTime']);
            $translationDepositTime = $data['translationDepositTime'] == '' ? 'null' : $data['translationDepositTime'];
            $data['translationDepositWeight'] = cleanStr($data['translationDepositWeight']);
            $translationDepositWeight = $data['translationDepositWeight'] == '' ? 'null' : "'" . $data['translationDepositWeight'] . "'";
            $data['translationResponsibleSealed'] = cleanStr($data['translationResponsibleSealed']);
            $translationResponsibleSealed = $data['translationResponsibleSealed'] == '' ? 'null' : $data['translationResponsibleSealed'];
            $data['translationLTA'] = isset($data['translationLTA']) ? cleanStr($data['translationLTA']) : '';
            $translationLTA = $data['translationLTA'] == '' ? 'null' : "'" . $data['translationLTA'] . "'";
            $data['translationNotes'] = cleanTextArea($data['translationNotes']);
            $translationNotes = $data['translationNotes'] == '' ? 'null' : "'" . $data['translationNotes'] . "'";
            $data['notes'] = cleanTextArea($data['notes']);
            $notes = $data['notes'] == '' ? 'null' : "'" . $data['notes'] . "'";

            $communicationItems = isset($data['communicationItems']) ? $data['communicationItems'] : [];
            $flowersItems = isset($data['flowersItems']) ? $data['flowersItems'] : [];

            if($data['expedient'] == ''){
                return false;
            }

            $result = $db->query("INSERT INTO Expedients_Work_Orders(
                            expedient, 
                            clientTracing, 
                            carrierRoom, 
                            arkCross, arkJesus, arkOther, arkOtherName, 
                            arkAesthetics, 
                            arkClothes, arkClothesPhoto, arkClothesRosary, arkClothesOwn, arkClothesYes, arkClothesNo,
                            arkPersonalItems, arkPersonalItemsPacemaker, arkPersonalItemsShroud,
                            arkThanatoplasty, arkThanatoplastyDate, arkThanatoplastyTime,
                            arkThanatopraxy, arkThanatopraxyDate, arkThanatopraxyTime,
                            arkCTransient, arkCTransientDate, arkCTransientTime,
                            arkEmbalmment, arkEmbalmmentDate, arkEmbalmmentTime,
                            arkMortuaryPractitioner, arkMortuaryPractitionerNif,
                            velationCatering, velationMemoriesScreen, velationPrivate, velationArkClosed, velationPhotoFrame,
                            ceremonyResponse, ceremonyResponsePlace, ceremonyFamilyWaitChurch, ceremonyMusicalService,
                            ceremonyBodyPresent, ceremonyUrn, ceremonyWhoTakesUrn, ceremonyChurchPayment, 
                            crematoryCollectingAshesDate, crematoryCollectingAshesTime, crematoryUrn, crematoryNotes,
                            inhumationStreet, inhumationBlock, inhumationAttendOpening,
                            inhumationDeclarant, inhumationDeclarantPhone, inhumationDeclarantDate, inhumationDeclarantTime,
                            inhumationIronCross, inhumationIronCrossOther,
                            inhumationReburial1, inhumationNotes1,
                            inhumationReburial2, inhumationNotes2,
                            inhumationReburial3, inhumationNotes3,
                            inhumationRemoveTombstone, inhumationRemoveTombstoneNote, inhumationNotes,
                            translationMoveContactEmail, translationMoveDestinationCountry, translationDepositAirport,
                            translationDepositDate, translationDepositTime, translationDepositWeight,
                            translationResponsibleSealed,
                            translationLTA,
                            translationNotes,
                            notes
                        ) 
                        VALUES (
                            " . $data['expedient'] . ",
                            $clientTracing, 
                            $carrierRoom,
                            " . $data['arkCross'] . ", " . $data['arkJesus'] . ", " . $data['arkOther'] . ", $arkOtherName, 
                            $arkAesthetics, 
                            $arkClothes, " . $data['arkClothesPhoto'] . ", " . $data['arkClothesRosary'] . ", " . $data['arkClothesOwn'] . ", " . $data['arkClothesYes'] . ", " . $data['arkClothesNo'] . ",
                            $arkPersonalItems, " . $data['arkPersonalItemsPacemaker'] . ", " . $data['arkPersonalItemsShroud'] . ",
                            " . $data['arkThanatoplasty'] . ", $arkThanatoplastyDate, $arkThanatoplastyTime,
                            " . $data['arkThanatopraxy'] . ", $arkThanatopraxyDate, $arkThanatopraxyTime,
                            " . $data['arkCTransient'] . ", $arkCTransientDate, $arkCTransientTime,
                            " . $data['arkEmbalmment'] . ", $arkEmbalmmentDate, $arkEmbalmmentTime,
                            $arkMortuaryPractitioner, $arkMortuaryPractitionerNif,
                            " . $data['velationCatering'] . ", " . $data['velationMemoriesScreen'] . ", " . $data['velationPrivate'] . ", " . $data['velationArkClosed'] . ", " . $data['velationPhotoFrame'] . ",
                            " . $data['ceremonyResponse'] . ", $ceremonyResponsePlace, " . $data['ceremonyFamilyWaitChurch'] . ", $ceremonyMusicalService,
                            " . $data['ceremonyBodyPresent'] . ", " . $data['ceremonyUrn'] . ", $ceremonyWhoTakesUrn, $ceremonyChurchPayment,
                            $crematoryCollectingAshesDate, $crematoryCollectingAshesTime, $crematoryUrn, $crematoryNotes,
                            $inhumationStreet,  $inhumationBlock, " . $data['inhumationAttendOpening'] . ",
                            $inhumationDeclarant,  $inhumationDeclarantPhone, $inhumationDeclarantDate,  $inhumationDeclarantTime,
                            " . $data['inhumationIronCross'] . ", $inhumationIronCrossOther,
                            " . $data['inhumationReburial1'] . ", $inhumationNotes1,
                            " . $data['inhumationReburial2'] . ", $inhumationNotes2,
                            " . $data['inhumationReburial3'] . ", $inhumationNotes3,
                            " . $data['inhumationRemoveTombstone'] . ", $inhumationRemoveTombstoneNote, $inhumationNotes,
                            $translationMoveContactEmail, $translationMoveDestinationCountry, $translationDepositAirport,
                            $translationDepositDate, $translationDepositTime, $translationDepositWeight,
                            $translationResponsibleSealed,
                            $translationLTA,
                            $translationNotes,
                            $notes
                        )
            ");

            if($result){
                $workOrderId = $db->getLastInsertId();

                // Communication items
                foreach($communicationItems as $value){
                    $hiringID = cleanStr($value['hiringID']);

                    $date = cleanStr($value['date']);
                    $date = $value['date'] == '' ? 'null' : $value['date'];

                    $photo = cleanStr($value['photo']);
                    $photo = $value['photo'] == '' ? 'null' : $value['photo'];

                    $result = $db->query("  INSERT INTO Expedients_Work_Orders_Communication(hiring, workOrder, date, photo) 
                                            VALUES ($hiringID, $workOrderId, $date, $photo)
                    ");

                    if(!$result){
                        return false;
                    }
                }

                // Flowers items
                foreach($flowersItems as $value){
                    $hiringID = cleanStr($value['hiringID']);

                    $date = cleanStr($value['date']);
                    $date = $value['date'] == '' ? 'null' : $value['date'];

                    $time = cleanStr($value['time']);
                    $time = $value['time'] == '' ? 'null' : $value['time'];

                    $result = $db->query("  INSERT INTO Expedients_Work_Orders_Flowers(hiring, workOrder, date, time) 
                                            VALUES ($hiringID, $workOrderId, $date, $time)
                    ");

                    if(!$result){
                        return false;
                    }
                }

                return true;
            }else{
                return false;
            }
        }

        /**
         * Actualiza la información de una orden de trabajo de une expediente
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;
            
            $data['workOrderId'] = cleanStr($data['workOrderId']);
            
            $data['clientTracing'] = cleanStr($data['clientTracing']);
            $clientTracing = $data['clientTracing'] == '' ? 'null' : "'" . $data['clientTracing'] . "'";

            $data['carrierRoom'] = cleanStr($data['carrierRoom']);
            $carrierRoom = $data['carrierRoom'] == '' ? 'null' : "'" . $data['carrierRoom'] . "'";

            $data['arkCross'] = cleanStr($data['arkCross']);
            $data['arkJesus'] = cleanStr($data['arkJesus']);
            $data['arkOther'] = cleanStr($data['arkOther']);
            $data['arkOtherName'] = cleanStr($data['arkOtherName']);
            $arkOtherName = $data['arkOtherName'] == '' ? 'null' : "'" . $data['arkOtherName'] . "'";
            $data['arkAesthetics'] = cleanStr($data['arkAesthetics']);
            $arkAesthetics = $data['arkAesthetics'] == '' ? 'null' : "'" . $data['arkAesthetics'] . "'";
            $data['arkClothes'] = cleanStr($data['arkClothes']);
            $arkClothes = $data['arkClothes'] == '' ? 'null' : "'" . $data['arkClothes'] . "'";
            $data['arkClothesPhoto'] = cleanStr($data['arkClothesPhoto']);
            $data['arkClothesRosary'] = cleanStr($data['arkClothesRosary']);
            $data['arkClothesOwn'] = cleanStr($data['arkClothesOwn']);
            $data['arkClothesYes'] = cleanStr($data['arkClothesYes']);
            $data['arkClothesNo'] = cleanStr($data['arkClothesNo']);
            $data['arkPersonalItems'] = cleanStr($data['arkPersonalItems']);
            $arkPersonalItems = $data['arkPersonalItems'] == '' ? 'null' : "'" . $data['arkPersonalItems'] . "'";
            $data['arkPersonalItemsPacemaker'] = cleanStr($data['arkPersonalItemsPacemaker']);
            $data['arkPersonalItemsShroud'] = cleanStr($data['arkPersonalItemsShroud']);
            $data['arkThanatoplasty'] = cleanStr($data['arkThanatoplasty']);
            $data['arkThanatoplastyDate'] = isset($data['arkThanatoplastyDate']) ? cleanStr($data['arkThanatoplastyDate']) : '';
            $arkThanatoplastyDate = $data['arkThanatoplastyDate'] == '' ? 'null' : $data['arkThanatoplastyDate'];
            $data['arkThanatoplastyTime'] = isset($data['arkThanatoplastyTime']) ? cleanStr($data['arkThanatoplastyTime']) : '';
            $arkThanatoplastyTime = $data['arkThanatoplastyTime'] == '' ? 'null' : $data['arkThanatoplastyTime'];
            $data['arkThanatopraxy'] = cleanStr($data['arkThanatopraxy']);
            $data['arkThanatopraxyDate'] = isset($data['arkThanatopraxyDate']) ? cleanStr($data['arkThanatopraxyDate']) : '';
            $arkThanatopraxyDate = $data['arkThanatopraxyDate'] == '' ? 'null' : $data['arkThanatopraxyDate'];
            $data['arkThanatopraxyTime'] = isset($data['arkThanatopraxyTime']) ? cleanStr($data['arkThanatopraxyTime']) : '';
            $arkThanatopraxyTime = $data['arkThanatopraxyTime'] == '' ? 'null' : $data['arkThanatopraxyTime'];
            $data['arkCTransient'] = cleanStr($data['arkCTransient']);
            $data['arkCTransientDate'] = isset($data['arkCTransientDate']) ? cleanStr($data['arkCTransientDate']) : '';
            $arkCTransientDate = $data['arkCTransientDate'] == '' ? 'null' : $data['arkCTransientDate'];
            $data['arkCTransientTime'] = isset($data['arkCTransientTime']) ? cleanStr($data['arkCTransientTime']) : '';
            $arkCTransientTime = $data['arkCTransientTime'] == '' ? 'null' : $data['arkCTransientTime'];
            $data['arkEmbalmment'] = cleanStr($data['arkEmbalmment']);
            $data['arkEmbalmmentDate'] = isset($data['arkEmbalmmentDate']) ? cleanStr($data['arkEmbalmmentDate']) : '';
            $arkEmbalmmentDate = $data['arkEmbalmmentDate'] == '' ? 'null' : $data['arkEmbalmmentDate'];
            $data['arkEmbalmmentTime'] = isset($data['arkEmbalmmentTime']) ? cleanStr($data['arkEmbalmmentTime']) : '';
            $arkEmbalmmentTime = $data['arkEmbalmmentTime'] == '' ? 'null' : $data['arkEmbalmmentTime'];
            $data['arkMortuaryPractitioner'] = cleanStr($data['arkMortuaryPractitioner']);
            $arkMortuaryPractitioner = $data['arkMortuaryPractitioner'] == '' ? 'null' : "'" . $data['arkMortuaryPractitioner'] . "'";
            $data['arkMortuaryPractitionerNif'] = cleanStr($data['arkMortuaryPractitionerNif']);
            $arkMortuaryPractitionerNif = $data['arkMortuaryPractitionerNif'] == '' ? 'null' : "'" . $data['arkMortuaryPractitionerNif'] . "'";
            $data['velationCatering'] = cleanStr($data['velationCatering']);
            $data['velationMemoriesScreen'] = cleanStr($data['velationMemoriesScreen']);
            $data['velationPrivate'] = cleanStr($data['velationPrivate']);
            $data['velationArkClosed'] = cleanStr($data['velationArkClosed']);
            $data['velationPhotoFrame'] = cleanStr($data['velationPhotoFrame']);
            $data['ceremonyResponse'] = cleanStr($data['ceremonyResponse']);
            $data['ceremonyResponsePlace'] = cleanStr($data['ceremonyResponsePlace']);
            $ceremonyResponsePlace = $data['ceremonyResponsePlace'] == '' ? 'null' : "'" . $data['ceremonyResponsePlace'] . "'";
            $data['ceremonyFamilyWaitChurch'] = cleanStr($data['ceremonyFamilyWaitChurch']);
            $data['ceremonyMusicalService'] = cleanStr($data['ceremonyMusicalService']);
            $ceremonyMusicalService = $data['ceremonyMusicalService'] == '' ? 'null' : "'" . $data['ceremonyMusicalService'] . "'";
            $data['ceremonyBodyPresent'] = cleanStr($data['ceremonyBodyPresent']);
            $data['ceremonyUrn'] = cleanStr($data['ceremonyUrn']);
            $data['ceremonyWhoTakesUrn'] = cleanStr($data['ceremonyWhoTakesUrn']);
            $ceremonyWhoTakesUrn = $data['ceremonyWhoTakesUrn'] == '' ? 'null' : "'" . $data['ceremonyWhoTakesUrn'] . "'";
            $data['ceremonyChurchPayment'] = cleanStr($data['ceremonyChurchPayment']);
            $ceremonyChurchPayment = $data['ceremonyChurchPayment'] == '' ? 'null' : "'" . $data['ceremonyChurchPayment'] . "'";
            $data['crematoryCollectingAshesDate'] = cleanStr($data['crematoryCollectingAshesDate']);
            $crematoryCollectingAshesDate = $data['crematoryCollectingAshesDate'] == '' ? 'null' : $data['crematoryCollectingAshesDate'];
            $data['crematoryCollectingAshesTime'] = cleanStr($data['crematoryCollectingAshesTime']);
            $crematoryCollectingAshesTime = $data['crematoryCollectingAshesTime'] == '' ? 'null' : $data['crematoryCollectingAshesTime'];
            $data['crematoryUrn'] = cleanStr($data['crematoryUrn']);
            $crematoryUrn = $data['crematoryUrn'] == '' ? 'null' : "'" . $data['crematoryUrn'] . "'";
            $data['crematoryNotes'] = cleanTextArea($data['crematoryNotes']);
            $crematoryNotes = $data['crematoryNotes'] == '' ? 'null' : "'" . $data['crematoryNotes'] . "'";
            $data['inhumationStreet'] = cleanStr($data['inhumationStreet']);
            $inhumationStreet = $data['inhumationStreet'] == '' ? 'null' : "'" . $data['inhumationStreet'] . "'";
            $data['inhumationBlock'] = cleanStr($data['inhumationBlock']);
            $inhumationBlock = $data['inhumationBlock'] == '' ? 'null' : "'" . $data['inhumationBlock'] . "'";
            $data['inhumationAttendOpening'] = cleanStr($data['inhumationAttendOpening']);
            $data['inhumationDeclarant'] = cleanStr($data['inhumationDeclarant']);
            $inhumationDeclarant = $data['inhumationDeclarant'] == '' ? 'null' : "'" . $data['inhumationDeclarant'] . "'";
            $data['inhumationDeclarantPhone'] = cleanStr($data['inhumationDeclarantPhone']);
            $inhumationDeclarantPhone = $data['inhumationDeclarantPhone'] == '' ? 'null' : "'" . $data['inhumationDeclarantPhone'] . "'";
            $data['inhumationDeclarantDate'] = cleanStr($data['inhumationDeclarantDate']);
            $inhumationDeclarantDate = $data['inhumationDeclarantDate'] == '' ? 'null' : $data['inhumationDeclarantDate'];
            $data['inhumationDeclarantTime'] = cleanStr($data['inhumationDeclarantTime']);
            $inhumationDeclarantTime = $data['inhumationDeclarantTime'] == '' ? 'null' : $data['inhumationDeclarantTime'];
            $data['inhumationIronCross'] = cleanStr($data['inhumationIronCross']);
            $data['inhumationIronCrossOther'] = cleanStr($data['inhumationIronCrossOther']);
            $inhumationIronCrossOther = $data['inhumationIronCrossOther'] == '' ? 'null' : "'" . $data['inhumationIronCrossOther'] . "'";
            $data['inhumationReburial1'] = cleanStr($data['inhumationReburial1']);
            $data['inhumationNotes1'] = isset($data['inhumationNotes1']) ? cleanStr($data['inhumationNotes1']) : '';
            $inhumationNotes1 = $data['inhumationNotes1'] == '' ? 'null' : "'" . $data['inhumationNotes1'] . "'";
            $data['inhumationReburial2'] = cleanStr($data['inhumationReburial2']);
            $data['inhumationNotes2'] = isset($data['inhumationNotes2']) ? cleanStr($data['inhumationNotes2']) : '';
            $inhumationNotes2 = $data['inhumationNotes2'] == '' ? 'null' : "'" . $data['inhumationNotes2'] . "'";
            $data['inhumationReburial3'] = cleanStr($data['inhumationReburial3']);
            $data['inhumationNotes3'] = isset($data['inhumationNotes3']) ? cleanStr($data['inhumationNotes3']) : '';
            $inhumationNotes3 = $data['inhumationNotes3'] == '' ? 'null' : "'" . $data['inhumationNotes3'] . "'";
            $data['inhumationRemoveTombstone'] = cleanStr($data['inhumationRemoveTombstone']);
            $data['inhumationRemoveTombstoneNote'] = cleanStr($data['inhumationRemoveTombstoneNote']);
            $inhumationRemoveTombstoneNote = $data['inhumationRemoveTombstoneNote'] == '' ? 'null' : "'" . $data['inhumationRemoveTombstoneNote'] . "'";
            $data['inhumationNotes'] = cleanTextArea($data['inhumationNotes']);
            $inhumationNotes = $data['inhumationNotes'] == '' ? 'null' : "'" . $data['inhumationNotes'] . "'";
            $data['translationMoveContactEmail'] = cleanStr($data['translationMoveContactEmail']);
            $translationMoveContactEmail = $data['translationMoveContactEmail'] == '' ? 'null' : "'" . $data['translationMoveContactEmail'] . "'";
            $data['translationMoveDestinationCountry'] = cleanStr($data['translationMoveDestinationCountry']);
            $translationMoveDestinationCountry = $data['translationMoveDestinationCountry'] == '' ? 'null' : "'" . $data['translationMoveDestinationCountry'] . "'";
            $data['translationDepositAirport'] = cleanStr($data['translationDepositAirport']);
            $translationDepositAirport = $data['translationDepositAirport'] == '' ? 'null' : "'" . $data['translationDepositAirport'] . "'";
            $data['translationDepositDate'] = cleanStr($data['translationDepositDate']);
            $translationDepositDate = $data['translationDepositDate'] == '' ? 'null' : $data['translationDepositDate'];
            $data['translationDepositTime'] = cleanStr($data['translationDepositTime']);
            $translationDepositTime = $data['translationDepositTime'] == '' ? 'null' : $data['translationDepositTime'];
            $data['translationDepositWeight'] = cleanStr($data['translationDepositWeight']);
            $translationDepositWeight = $data['translationDepositWeight'] == '' ? 'null' : "'" . $data['translationDepositWeight'] . "'";
            $data['translationResponsibleSealed'] = cleanStr($data['translationResponsibleSealed']);
            $translationResponsibleSealed = $data['translationResponsibleSealed'] == '' ? 'null' : $data['translationResponsibleSealed'];
            $data['translationLTA'] = isset($data['translationLTA']) ? cleanStr($data['translationLTA']) : '';
            $translationLTA = $data['translationLTA'] == '' ? 'null' : "'" . $data['translationLTA'] . "'";
            $data['translationNotes'] = cleanTextArea($data['translationNotes']);
            $translationNotes = $data['translationNotes'] == '' ? 'null' : "'" . $data['translationNotes'] . "'";
            $data['notes'] = cleanTextArea($data['notes']);
            $notes = $data['notes'] == '' ? 'null' : "'" . $data['notes'] . "'";
            $hasChanges = cleanStr($data['existsChanges']);

            $communicationItems = isset($data['communicationItems']) ? $data['communicationItems'] : [];
            $flowersItems = isset($data['flowersItems']) ? $data['flowersItems'] : [];

            if($data['workOrderId'] == ''){
                return false;
            }

            $result = $db->query("  UPDATE  Expedients_Work_Orders
                                    SET     clientTracing = $clientTracing,
                                            carrierRoom = $carrierRoom,
                                            arkCross = " . $data['arkCross'] . ",
                                            arkJesus = " . $data['arkJesus'] . ",
                                            arkOther = " . $data['arkOther'] . ",
                                            arkOtherName = $arkOtherName,
                                            arkAesthetics = $arkAesthetics,
                                            arkClothes = $arkClothes,
                                            arkClothesPhoto = " . $data['arkClothesPhoto'] . ",
                                            arkClothesRosary = " . $data['arkClothesRosary'] . ",
                                            arkClothesOwn = " . $data['arkClothesOwn'] . ",
                                            arkClothesYes = " . $data['arkClothesYes'] . ",
                                            arkClothesNo = " . $data['arkClothesNo'] . ",
                                            arkPersonalItems = $arkPersonalItems,
                                            arkPersonalItemsPacemaker = " . $data['arkPersonalItemsPacemaker'] . ",
                                            arkPersonalItemsShroud = " . $data['arkPersonalItemsShroud'] . ",
                                            arkThanatoplasty = " . $data['arkThanatoplasty'] . ",
                                            arkThanatoplastyDate = $arkThanatoplastyDate,
                                            arkThanatoplastyTime = $arkThanatoplastyTime,
                                            arkThanatopraxy = " . $data['arkThanatopraxy'] . ",
                                            arkThanatopraxyDate = $arkThanatopraxyDate,
                                            arkThanatopraxyTime = $arkThanatopraxyTime,
                                            arkCTransient = " . $data['arkCTransient'] . ",
                                            arkCTransientDate = $arkCTransientDate,
                                            arkCTransientTime = $arkCTransientTime,
                                            arkEmbalmment = " . $data['arkEmbalmment'] . ",
                                            arkEmbalmmentDate = $arkEmbalmmentDate,
                                            arkEmbalmmentTime = $arkEmbalmmentTime,
                                            arkMortuaryPractitioner = $arkMortuaryPractitioner,
                                            arkMortuaryPractitionerNif = $arkMortuaryPractitionerNif,
                                            velationCatering = " . $data['velationCatering'] . ",
                                            velationMemoriesScreen = " . $data['velationMemoriesScreen'] . ",
                                            velationPrivate = " . $data['velationPrivate'] . ",
                                            velationArkClosed = " . $data['velationArkClosed'] . ",
                                            velationPhotoFrame = " . $data['velationPhotoFrame'] . ",
                                            ceremonyResponse = " . $data['ceremonyResponse'] . ",
                                            ceremonyResponsePlace = $ceremonyResponsePlace,
                                            ceremonyFamilyWaitChurch = " . $data['ceremonyFamilyWaitChurch'] . ",
                                            ceremonyMusicalService = $ceremonyMusicalService,
                                            ceremonyBodyPresent = " . $data['ceremonyBodyPresent'] . ",
                                            ceremonyUrn = " . $data['ceremonyUrn'] . ",
                                            ceremonyWhoTakesUrn = $ceremonyWhoTakesUrn,
                                            ceremonyChurchPayment = $ceremonyChurchPayment,
                                            crematoryCollectingAshesDate = $crematoryCollectingAshesDate,
                                            crematoryCollectingAshesTime = $crematoryCollectingAshesTime,
                                            crematoryUrn = $crematoryUrn,
                                            crematoryNotes = $crematoryNotes,
                                            inhumationStreet = $inhumationStreet,
                                            inhumationBlock = $inhumationBlock,
                                            inhumationAttendOpening = " . $data['inhumationAttendOpening'] . ",
                                            inhumationDeclarant = $inhumationDeclarant,
                                            inhumationDeclarantPhone = $inhumationDeclarantPhone,
                                            inhumationDeclarantDate = $inhumationDeclarantDate,
                                            inhumationDeclarantTime = $inhumationDeclarantTime,
                                            inhumationIronCross = " . $data['inhumationIronCross'] . ",
                                            inhumationIronCrossOther = $inhumationIronCrossOther,
                                            inhumationReburial1 = " . $data['inhumationReburial1'] . ",
                                            inhumationNotes1 = $inhumationNotes1,
                                            inhumationReburial2 = " . $data['inhumationReburial2'] . ",
                                            inhumationNotes2 = $inhumationNotes2,
                                            inhumationReburial3 = " . $data['inhumationReburial3'] . ",
                                            inhumationNotes3 = $inhumationNotes3,
                                            inhumationRemoveTombstone = " . $data['inhumationRemoveTombstone'] . ",
                                            inhumationRemoveTombstoneNote = $inhumationRemoveTombstoneNote,
                                            inhumationNotes = $inhumationNotes,
                                            translationMoveContactEmail = $translationMoveContactEmail,
                                            translationMoveDestinationCountry = $translationMoveDestinationCountry,
                                            translationDepositAirport = $translationDepositAirport,
                                            translationDepositDate = $translationDepositDate,
                                            translationDepositTime = $translationDepositTime,
                                            translationDepositWeight = $translationDepositWeight,
                                            translationResponsibleSealed = $translationResponsibleSealed,
                                            translationLTA = $translationLTA,
                                            translationNotes = $translationNotes,
                                            notes = $notes,
                                            hasChanges = $hasChanges
                                    WHERE   ID = ".$data['workOrderId']."
            ");

            if($result){

                // Communication items
                $communicationIdNotDelete = '';
                foreach($communicationItems as $value){

                    $hiringID = cleanStr($value['hiringID']);
                    $communicationID = cleanStr($value['communicationID']);

                    $date = cleanStr($value['date']);
                    $date = $value['date'] == '' ? 'null' : $value['date'];

                    $photo = cleanStr($value['photo']);
                    $photo = $value['photo'] == '' ? 'null' : $value['photo'];

                    
                    if($communicationID == ''){ // Create new communciation item
                        $result = $db->query("  INSERT INTO Expedients_Work_Orders_Communication(hiring, workOrder, date, photo) 
                                                VALUES ($hiringID, ".$data['workOrderId'].", $date, $photo)
                        ");

                        if($result){
                            $communicationIdNotDelete .= $db->getLastInsertId() . ',';
                        }else{
                            return false;
                        }
                    }else{ // Update communication item
                        $result = $db->query("  UPDATE  Expedients_Work_Orders_Communication
                                                SET     date = $date,
                                                        photo = $photo
                                                WHERE   ID = $communicationID
                        ");

                        if($result){
                            $communicationIdNotDelete .= $communicationID . ',';
                        }else{
                            return false;
                        }
                    }
                }

                // Delete old communication items
                $whereDeleteCommunicationItems = '';
                if($communicationIdNotDelete != ''){
                    $communicationIdNotDelete = substr($communicationIdNotDelete, 0, -1);
                    $whereDeleteCommunicationItems = " AND ID NOT IN ($communicationIdNotDelete)";
                }

                $deleteTime = time();
                $result = $db->query("  UPDATE  Expedients_Work_Orders_Communication
                                        SET     leavingDate = $deleteTime
                                        WHERE   workOrder = ".$data['workOrderId']." AND
                                                leavingDate IS NULL
                                                $whereDeleteCommunicationItems
                ");

                if(!$result){
                    return false;
                }

                // Flowers items
                $flowersIdNotDelete = '';
                foreach($flowersItems as $value){

                    $hiringID = cleanStr($value['hiringID']);
                    $flowerID = cleanStr($value['flowerID']);

                    $date = cleanStr($value['date']);
                    $date = $value['date'] == '' ? 'null' : $value['date'];

                    $time = cleanStr($value['time']);
                    $time = $value['time'] == '' ? 'null' : $value['time'];

                    
                    if($flowerID == ''){ // Create new flower item
                        $result = $db->query("  INSERT INTO Expedients_Work_Orders_Flowers(hiring, workOrder, date, time) 
                                                VALUES ($hiringID, ".$data['workOrderId'].", $date, $time)
                        ");

                        if($result){
                            $flowersIdNotDelete .= $db->getLastInsertId() . ',';
                        }else{
                            return false;
                        }
                    }else{ // Update flower item
                        $result = $db->query("  UPDATE  Expedients_Work_Orders_Flowers
                                                SET     date = $date,
                                                        time = $time
                                                WHERE   ID = $flowerID
                        ");

                        if($result){
                            $flowersIdNotDelete .= $flowerID . ',';
                        }else{
                            return false;
                        }
                    }
                }

                // Delete old flowers items
                $whereDeleteFlowersItems = '';
                if($flowersIdNotDelete != ''){
                    $flowersIdNotDelete = substr($flowersIdNotDelete, 0, -1);
                    $whereDeleteFlowersItems = " AND ID NOT IN ($flowersIdNotDelete)";
                }

                $deleteTime = time();
                $result = $db->query("  UPDATE  Expedients_Work_Orders_Flowers
                                        SET     leavingDate = $deleteTime
                                        WHERE   workOrder = ".$data['workOrderId']." AND
                                                leavingDate IS NULL
                                                $whereDeleteFlowersItems
                ");

                if(!$result){
                    return false;
                }

                return true;
            }else{
                return false;
            }
        }
    }
?>