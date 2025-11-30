<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
    }

    if(!isset($_SESSION['user'])){
        http_response_code(403);
        return;
    }

    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    // New DB
    $newDB = new DbHandler;

    /**
     * Obtiene el ID de una localidad dado el nombre. Si no existe, la crea
     * 
     * @param string nombre de la localidad
     * @return int ID de la localidad
     */
    function getLocation($data){
        global $newDB;

        $location = $newDB->query(" SELECT  locationID
                                    FROM    Locations
                                    WHERE   name = '$data' AND
                                            leavingDate IS NULL
                                    LIMIT   1");

        if(mysqli_num_rows($location) > 0){
            $location = $newDB->resultToArray($location)[0]['locationID'];
        }else{
            $newDB->query(" INSERT INTO Locations(name, postalCode, province, leavingDate)
                            VALUES ('$data', null, null, 1)");

            $location = $newDB->query(" SELECT  locationID
                                        FROM    Locations
                                        WHERE   name = '$data'");

            $location = $newDB->resultToArray($location)[0]['locationID'];
        }

        return $location;
    }

    /**
     * Obtiene el ID de un fallecido en dado el nombre. Si no existe, lo crea
     * 
     * @param string nombre del fallecido en
     * @return int ID del fallecido en
     */
    function getDeceasedIn($data){
        global $newDB;

        $deceasedIn = $newDB->query("   SELECT  deceasedInID
                                        FROM    DeceasedIn
                                        WHERE   name = '$data' AND
                                                leavingDate IS NULL
                                        LIMIT   1");

        if(mysqli_num_rows($deceasedIn) > 0){
            $deceasedIn = $newDB->resultToArray($deceasedIn)[0]['deceasedInID'];
        }else{
            $newDB->query(" INSERT INTO DeceasedIn(location, name, text)
                            VALUES (null, '$data', 0)");

            $deceasedIn = $newDB->query("   SELECT  deceasedInID
                                            FROM    DeceasedIn
                                            WHERE   name = '$data'");

            $deceasedIn = $newDB->resultToArray($deceasedIn)[0]['deceasedInID'];
        }

        return $deceasedIn;
    }

    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "model/clients.php");
    require_once($_SESSION['basePath'] . "model/prices.php");
    require_once($_SESSION['basePath'] . "model/locations.php");
    require_once($_SESSION['basePath'] . "model/doctors.php");
    require_once($_SESSION['basePath'] . "model/churches.php");
    require_once($_SESSION['basePath'] . "model/cemeteries.php");
    require_once($_SESSION['basePath'] . "model/funeralHomes.php");
    require_once($_SESSION['basePath'] . "model/crematoriums.php");
    require_once($_SESSION['basePath'] . "model/expedients.php");

    $clients = new Clients;
    $prices = new Prices;
    $locations = new Locations;
    $doctors = new Doctors;
    $churches = new Churches;
    $cemeteries = new Cemeteries;
    $funeralHomes = new FuneralHomes;
    $crematoriums = new Crematoriums;
    $expedients = new Expedients;

    if(($fileManager = fopen('./abrisa_2012_exp.csv', "r")) !== FALSE){
        $i = 0;
        while(($line = fgetcsv($fileManager, 100000, ";")) !== FALSE){
            if($i > 0){
                $capital = cleanStr($line[1]);
                $lossNumber = cleanStr($line[4]);
                $policy = cleanStr($line[5]);
                $requestDate = cleanStr($line[6]);
                $requestTime = cleanStr($line[7]);
                $entryDate = cleanStr($line[8]);
                $applicantName = cleanStr($line[9]);
                $applicantSurnameA = cleanStr($line[10]);
                $applicantSurnameB = cleanStr($line[11]);
                $applicantNIF = cleanStr($line[12]);
                $applicantAddress = cleanStr($line[13]);
                $applicantMail = cleanStr($line[14]);
                $applicantPhone = cleanStr($line[15]);
                $applicantMobilePhone = cleanStr($line[17]);
                $familyContactName = cleanStr($line[18]);
                $familyContactSurnameA = cleanStr($line[19]);
                $familyContactSurnameB = cleanStr($line[20]);
                $familyContactNIF = cleanStr($line[21]);
                $familyContactAddress = cleanStr($line[22]);
                $familyContactMail = cleanStr($line[23]);
                $familyContactPhone = cleanStr($line[24]);
                $familyContactMobilePhone = cleanStr($line[26]);
                $deceasedMortuary = cleanStr($line[27]);
                $deceasedMortuaryAddress = cleanStr($line[28]);
                $deceasedRoom = cleanStr($line[29]);
                $churchLabel = cleanStr($line[30]);
                $church = cleanStr($line[31]);
                $cemeteryLabel = cleanStr($line[32]);
                $cemetery = cleanStr($line[33]);
                $funeralNicheNumber = cleanStr($line[34]);
                $niche = cleanStr($line[35]);
                $funeralBusyNiche = cleanStr($line[36]);
                $funeralDate = cleanStr($line[37]);
                $funeralTime = cleanStr($line[38]);
                $crematorium = cleanStr($line[39]);
                $crematoriumName = cleanStr($line[40]);
                $crematoriumStart = cleanStr($line[41]);
                $crematoriumEnd = cleanStr($line[42]);
                $deceasedDoctor = cleanStr($line[43]);
                $doctorCollege = cleanStr($line[44]);
                $deceasedDoctorCertificate = cleanStr($line[45]);
                $deceasedTribunalNumber = cleanStr($line[47]);
                $deceasedTribunal = cleanStr($line[48]);
                $funeralHomeEntryTime = cleanStr($line[50]);
                $funeralHomeEntryDate = cleanStr($line[51]);
                $funeralHome = cleanStr($line[52]);
                $exhumation = cleanStr($line[56]);
                $moveFuneralHome = cleanStr($line[57]);
                $moveFuneralHomeCif = cleanStr($line[58]);
                $moveFuneralHomePhone = cleanStr($line[59]);
                $moveFuneralHomeFax = cleanStr($line[60]);
                $moveLeavingDate = cleanStr($line[63]);
                $moveLeavingTime = cleanStr($line[64]);
                $moveDestination = cleanStr($line[65]);
                $moveDestinationProvince = cleanStr($line[66]);
                $tanatologicalPractice = cleanStr($line[68]);
                $responsibleUser = cleanStr($line[69]);
                $deceasedName = cleanStr($line[70]);
                $deceasedSurnameA = cleanStr($line[71]);
                $deceasedSurnameB = cleanStr($line[72]);
                $deceasedNIF = cleanStr($line[73]);
                $deceasedGender = cleanStr($line[74]);
                $deceasedChildOfFather = cleanStr($line[75]);
                $deceasedChildOfMother = cleanStr($line[76]);
                $deceasedMaritalStatus = cleanStr($line[77]);
                $deceasedFirstNuptials = cleanStr($line[78]);
                $deceasedSecondNuptials = cleanStr($line[79]);
                $deceasedNationality = cleanStr($line[80]);
                $deceasedBirthday = cleanStr($line[81]);
                $deceasedBirthdayLocation = cleanStr($line[82]);
                $deceasedUsualAddress = cleanStr($line[83]);
                $deceasedLocation = cleanStr($line[87]);
                $deceasedLocationName = cleanStr($line[88]);
                $deceasedLocationProvince = cleanStr($line[89]);
                $deceasedDate = cleanStr($line[90]);
                $deceasedTime = cleanStr($line[91]);
                $clientName = cleanStr($line[105]);
                $clientSurnameA = cleanStr($line[106]);
                $clientSurnameB = cleanStr($line[107]);
                $clientBrandName = cleanStr($line[108]);
                $clientNif = cleanStr($line[109]);
                $clientPhoneA = cleanStr($line[110]);
                $clientPhoneB = cleanStr($line[111]);
                $clientFax = cleanStr($line[112]);
                $clientEmail = cleanStr($line[113]);
                $clientAddress = cleanStr($line[114]);
                $startingDate = cleanStr($line[115]);
                $leavingDate = cleanStr($line[116]);

                $clientSurname = '';
                if($clientSurnameA != ''){
                    $clientSurname .= $clientSurnameA;
                }
                if($clientSurnameB != ''){
                    if($clientSurname != ''){
                        $clientSurname .= " $clientSurnameB";
                    }else{
                        $clientSurname .= $clientSurnameB;
                    }
                }
                // Cliente
                $client = $clients->searchByNameSurname2($clientName, $clientSurname);
                if($client == null){
                    // Tipo
                    if($clientBrandName != '' && $clientBrandName != 'Ppffa'){
                        $clientType = 2;
                    }else if($clientBrandName != '' && $clientBrandName == 'Ppffa'){
                        $clientType = 3;
                    }else{
                        $clientType = 1;
                    }

                    // Tarifa asociada
                    switch(strtolower($clientBrandName)){
                        case 'ocaso':
                            $price = $prices->searchByName($clientBrandName)[0]['priceID'];
                            break;
                            
                        case 'dkv - seguros':
                            $price = $prices->searchByName('dkv')[0]['priceID'];
                            break;

                        case 'santalucia':
                            $price = $prices->searchByName('santa')[0]['priceID'];
                            break;

                        case 'preventiva':
                            $price = $prices->searchByName($clientBrandName)[0]['priceID'];
                            break;

                        case 'mapfre':
                            $price = $prices->searchByName($clientBrandName)[0]['priceID'];
                            break;

                        case 'ppffa':
                            $price = $prices->searchByName('Empresas')[0]['priceID'];
                            break;

                        case '':
                            $price = $prices->searchByName('Particulares')[0]['priceID'];
                            break;

                        default:
                            $price = $prices->searchByName('Particulares')[0]['priceID'];
                            break;
                    }
                    if($price == null){
                        $price = 'null';
                    }

                    // Teléfonos
                    $clientPhones = '';
                    if($clientPhoneA != 'NULL'){
                        $clientPhones .= "$clientPhoneA-";
                    }
                    if($clientPhoneB != 'NULL'){
                        $clientPhones .= "$clientPhoneB-";
                    }
                    if($clientPhones != ''){
                        $clientPhones = substr($clientPhones, 0, -1);
                    }

                    $data = array(
                        'type' => $clientType,
                        'location' => 'null',
                        'price' => $price,
                        'brandName' => $clientBrandName,
                        'nif' => $clientNif,
                        'name' => $clientName,
                        'surname' => $clientSurname,
                        'address' => $clientAddress,
                        'mail' => $clientEmail,
                        'phones' => $clientPhones
                    );

                    $clients->create($data);
                    $clientId = $clients->searchByNameSurname2($clientName, $clientSurname)[0]['clientID'];
                }else{
                    $clientId = $client[0]['clientID'];
                    $clientType = $client[0]['type'];
                }

                // Fecha nacimiento
                $deceasedBirthday = strtotime($deceasedBirthday) ? $deceasedBirthday : '';
                
                // Fecha de fallecimiento
                $deceasedDate = strtotime($deceasedDate) ? $deceasedDate : '';
                
                // Hora de fallecimiento
                $deceasedTime = strtotime($deceasedTime) ? $deceasedTime : '';
                
                // Fecha inhumación
                $funeralDate = strtotime($funeralDate) ? $funeralDate : '';
                
                // Hora inhumación
                $funeralTime = strtotime($funeralTime) ? $funeralTime : '';
                
                // Fecha de entrada
                $funeralHomeEntryDate = strtotime($funeralHomeEntryDate) ? $funeralHomeEntryDate : '';
                
                // Hora de entrada
                $funeralHomeEntryTime = strtotime($funeralHomeEntryTime) ? $funeralHomeEntryTime : '';
                
                // Fecha de salida
                $moveLeavingDate = strtotime($moveLeavingDate) ? $moveLeavingDate : '';
                
                // Hora de salida
                $moveLeavingTime = strtotime($moveLeavingTime) ? $moveLeavingTime : '';
                
                // Hora de solicitud
                $requestTime = strtotime($requestTime) ? $requestTime : '';
                
                // Fecha de solicitud
                $requestDate = strtotime($requestDate) ? $requestDate : '';

                // Cremación (check)
                $cremationCheck = $crematoriumName == '' ? 0 : 1;

                // Traslado (check)
                $moveCheck = $moveFuneralHome == 'Funeraria Golpe' ? 0 : 1;

                // Genero fallecido
                switch($deceasedGender){
                    case 'hombre':
                        $deceasedGender = 'Hombre';
                        break;

                    case 'mujer':
                        $deceasedGender = 'Mujer';
                        break;

                    default:
                        $deceasedGender = 'Hombre';
                        break;
                }

                // Estado civil fallecido
                switch($deceasedMaritalStatus){
                    case '1':
                        $deceasedMaritalStatus = 'Soltero';
                        break;

                    case '2':
                        $deceasedMaritalStatus = 'Casado';
                        break;

                    case '3':
                        $deceasedMaritalStatus = 'Divorciado';
                        break;

                    case '4':
                        $deceasedMaritalStatus = 'Viudo';
                        break;

                    case '5':
                        $deceasedMaritalStatus = 'Otros';
                        break;
                }

                // Nacionalidad
                if(preg_match("/Esp/", $deceasedNationality)){
                    $deceasedNationality = 'España';
                }else{
                    $deceasedNationality = 'Otro';
                }

                // Lugar de nacimiento
                $deceasedBirthdayLocation = getLocation($deceasedBirthdayLocation);

                // Lugar de fallecimiento
                $deceasedLocation = getDeceasedIn($deceasedLocation);
                
                // Médico
                $deceasedDoctorId = $doctors->searchByName($deceasedDoctor);
                if($deceasedDoctorId == null){
                    $data = array(
                        'name' => $deceasedDoctor,
                        'college' => $doctorCollege
                    );

                    $doctors->create($data);

                    $deceasedDoctorId = $doctors->searchByName($deceasedDoctor)[0]['ID'];
                }else{
                    $deceasedDoctorId = $deceasedDoctorId[0]['ID'];
                }

                // Iglesia
                if(!empty($church)){
                    $churchId = $churches->searchByName($church);
                    if($churchId == null){
                        $data = array(
                            'location' => 'null',
                            'name' => $church,
                            'address' => '',
                            'phones' => '',
                            'latitude' => 'null',
                            'longitude' => 'null',
                            'priests' => null
                        );

                        $churches->create($data);

                        $churchId = $churches->searchByName($church)[0]['churchID'];
                    }else{
                        $churchId = $churchId[0]['churchID'];
                    }
                }else{
                    $churchId = '';
                }

                // Cementerio
                if(!empty($cemetery)){
                    $cemeteryId = $cemeteries->searchByName($cemetery);
                    if($cemeteryId == null){
                        $data = array(
                            'name' => $cemetery,
                            'address' => '',
                            'location' => 'null',
                            'latitude' => 'null',
                            'longitude' => 'null',
                            'mail' => '',
                            'phones' => ''
                        );

                        $cemeteries->create($data);

                        $cemeteryId = $cemeteries->searchByName($cemetery)[0]['cemeteryID'];
                    }else{
                        $cemeteryId = $cemeteryId[0]['cemeteryID'];
                    }
                }else{
                    $cemeteryId = '';
                }

                // Práctica tanatológica
                if(preg_match("/Tanatop/", $tanatologicalPractice)){
                    $tanatologicalPractice = 2;
                }else if(preg_match("/Tanatoest/", $tanatologicalPractice)){
                    $tanatologicalPractice = 1;
                }else{
                    $tanatologicalPractice = 0;
                }

                // Funeraria procedencia
                if($funeralHome != ''){
                    $funeralHomeId = $funeralHomes->searchByName($funeralHome);
                    if($funeralHomeId == null){
                        $data = array(
                            'name' => $funeralHome,
                            'nif' => '',
                            'address' => '',
                            'location' => 'null',
                            'mail' => '',
                            'phones' => '',
                            'fax' => '',
                            'person' => ''
                        );

                        $funeralHomes->create($data);

                        $funeralHomeId = $funeralHomes->searchByName($funeralHome)[0]['funeralHomeID'];
                    }else{
                        $funeralHomeId = $funeralHomeId[0]['funeralHomeID'];
                    }
                }else{
                    $funeralHomeId = '';
                }

                // Responsable
                if($responsibleUser != ''){
                    $responsibleUserId = 1;
                }else{
                    $responsibleUserId = '';
                }

                // Crematorio
                if($crematoriumName != ''){
                    $crematoriumId = $crematoriums->searchByName($crematoriumName);
                    if($crematoriumId == null){
                        $data = array(
                            'name' => $crematoriumName,
                            'address' => '',
                            'location' => 'null',
                            'latitude' => 'null',
                            'longitude' => 'null',
                            'mail' => '',
                            'phones' => '',
                            'isYourOwn' => 0
                        );

                        $crematoriums->create($data);

                        $crematoriumId = $crematoriums->searchByName($crematoriumName)[0]['crematoriumID'];
                    }else{
                        $crematoriumId = $crematoriumId[0]['crematoriumID'];
                    }

                    $crematoriumCheck = 1;
                    $crematoriumClientId = '';
                    $crematoriumContactPersonPhone = '';
                    $crematoriumContactPerson = '';
                    $crematoriumIntroduction = 0;
                    $crematoriumWaitOnRoom = 0;
                    $crematoriumVaseBio = 0;
                    $crematoriumPacemaker = 0;
                    $crematoriumTechnical = '';
                    $crematoriumContactPhonePerson = '';
                    $crematoriumStatus = 6;
                    $crematoriumEntryDate = $crematoriumStart;
                    $crematoriumEntryTime = '';
                    $crematoriumLeavingDate = $crematoriumEnd;
                    $crematoriumLeavingTime = '';
                }else{
                    $crematoriumCheck = 0;
                    $crematoriumId = 'null';
                    $crematoriumClientId = '';
                    $crematoriumContactPersonPhone = '';
                    $crematoriumContactPerson = '';
                    $crematoriumIntroduction = 0;
                    $crematoriumWaitOnRoom = 0;
                    $crematoriumVaseBio = 0;
                    $crematoriumPacemaker = 0;
                    $crematoriumTechnical = '';
                    $crematoriumContactPhonePerson = '';
                    $crematoriumStatus = 6;
                    $crematoriumEntryDate = $crematoriumStart;
                    $crematoriumEntryTime = '';
                    $crematoriumLeavingDate = $crematoriumEnd;
                    $crematoriumLeavingTime = '';
                }

                // Funeraria destino
                if($moveFuneralHome != '' && $moveFuneralHome != 'NULL'){
                    $moveFuneralHomeId = $funeralHomes->searchByName($moveFuneralHome);
                    if($moveFuneralHomeId == null){
                        $data = array(
                            'name' => $moveFuneralHome,
                            'nif' => $moveFuneralHomeCif,
                            'address' => '',
                            'location' => 'null',
                            'mail' => '',
                            'phones' => $moveFuneralHomePhone,
                            'fax' => $moveFuneralHomeFax,
                            'person' => ''
                        );

                        $funeralHomes->create($data);

                        $moveFuneralHomeId = $funeralHomes->searchByName($moveFuneralHome)[0]['funeralHomeID'];
                    }else{
                        $moveFuneralHomeId = $moveFuneralHomeId[0]['funeralHomeID'];
                    }
                }else{
                    $moveFuneralHomeId = '';
                }

                $data = array(
                    'expType' => '1',
                    'clientType' => (string)$clientType,
                    'deceasedBirthday' => $deceasedBirthday,
                    'deceasedDate' => $deceasedDate,
                    'deceasedTime' => $deceasedTime,
                    'funeralDateNiche' => '',
                    'funeralDate' => $funeralDate,
                    'funeralTime' => $funeralTime,
                    'funeralHomeEntryDate' => $funeralHomeEntryDate,
                    'funeralHomeEntryTime' => $funeralHomeEntryTime,
                    'moveLeavingDate' => $moveLeavingDate,
                    'moveLeavingTime' => $moveLeavingTime,
                    'requestTime' => $requestTime,
                    'requestDate' => $requestDate,
                    'policy' => $policy,
                    'capital' => $capital,
                    'status' => 5,
                    'room' => 0,
                    'cremation' => $cremationCheck,
                    'move' => $moveCheck,
                    'lossNumber' => $lossNumber,
                    'literal' => 0,
                    'applicantName' => $applicantName,
                    'applicantSurname' => "$applicantSurnameA $applicantSurnameB",
                    'applicantAddress' => $applicantAddress,
                    'applicantNIF' => $applicantNIF,
                    'applicantLocation' => '',
                    'applicantMail' => $applicantMail,
                    'applicantPhone' => $applicantPhone,
                    'applicantMobilePhone' => $applicantMobilePhone,
                    'familyContactName' => $familyContactName,
                    'familyContactSurname' => "$familyContactSurnameA $familyContactSurnameB",
                    'familyContactAddress' => $familyContactAddress,
                    'familyContactNIF' => $familyContactNIF,
                    'familyContactLocation' => '',
                    'familyContactMail' => $familyContactMail,
                    'familyContactPhone' => $familyContactPhone,
                    'familyContactMobilePhone' => $familyContactMobilePhone,
                    'otherContactName' => '',
                    'otherContactPhone' => '',
                    'otherContactRelationship' => '',
                    'client' => $clientId,
                    'deceasedName' => $deceasedName,
                    'deceasedSurname' => "$deceasedSurnameA $deceasedSurnameB",
                    'deceasedNIF' => $deceasedNIF,
                    'deceasedGender' => $deceasedGender,
                    'deceasedMaritalStatus' => $deceasedMaritalStatus,
                    'deceasedMaritalStatusDescription' => '',
                    'deceasedChildOfFather' => $deceasedChildOfFather,
                    'deceasedChildOfMother' => $deceasedChildOfMother,
                    'deceasedFirstNuptials' => $deceasedFirstNuptials,
                    'deceasedSecondNuptials' => $deceasedSecondNuptials,
                    'deceasedNationality' => $deceasedNationality,
                    'deceasedNationalityName' => '',
                    'deceasedNationalityProvince' => '',
                    'deceasedBirthdayLocation' => $deceasedBirthdayLocation,
                    'deceasedUsualAddress' => $deceasedUsualAddress,
                    'deceasedLocation' => $deceasedLocation,
                    'deceasedDoctor' => $deceasedDoctorId,
                    'deceasedDoctorCertificate' => $deceasedDoctorCertificate,
                    'deceasedTribunal' => $deceasedTribunal,
                    'deceasedTribunalNumber' => $deceasedTribunalNumber,
                    'deceasedMortuary' => 1,
                    'deceasedRoom' => (int)$deceasedRoom,
                    'deceasedPanel' => 0,
                    'church' => $churchId,
                    'cemetery' => $cemeteryId,
                    'niche' => $niche,
                    'funeralNicheNumber' => $funeralNicheNumber,
                    'funeralBusyNiche' => $funeralBusyNiche,
                    'regime' => 0,
                    'propertyName' => '',
                    'deceasedNiche' => '',
                    'exhumation' => '',
                    'nicheHeight' => 0,
                    'mortuaryReg' => 1,
                    'funeralReg' => 1,
                    'personalReg' => 1,
                    'crematoriumReg' => 1,
                    'tanatologicalPractice' => $tanatologicalPractice,
                    'funeralHome' => $funeralHomeId,
                    'coffin' => 0,
                    'responsibleUser' => $responsibleUserId,
                    'responsibleName' => '',
                    'responsibleNIF' => '',
                    'crematorium' => $crematoriumId,
                    'crematoriumClient' => $crematoriumClientId,
                    'crematoriumContactPersonPhone' => $crematoriumContactPersonPhone,
                    'crematoriumContactPerson' => $crematoriumContactPerson,
                    'crematoriumIntroduction' => $crematoriumIntroduction,
                    'crematoriumWaitOnRoom' => $crematoriumWaitOnRoom,
                    'crematoriumVaseBio' => $crematoriumVaseBio,
                    'moveFuneralHome' => $moveFuneralHomeId,
                    'moveClient' => '',
                    'moveCollection' => '',
                    'moveDestination' => '',
                    'moveVia' => 0,
                    'moveNotes' => '',
                    'moveJudicial' => 0,
                    'ecologicCoffin' => 0,
                    'authName' => '',
                    'authDni' => '',
                    'otherCoffin' => '',
                    'churchLabel' => 'Iglesia Parroquial',
                    'cemeteryLabel' => 'Cementerio',
                    'authDate' => '',
                    'authTime' => '',
                    'authPlace' => '',
                    'crematoriumPacemaker' => $crematoriumPacemaker,
                    'crematoriumTechnical' => $crematoriumTechnical,
                    'moveContactPhone' => '',
                    'moveContactPerson' => '',
                    'moveDestinationAddress' => '',
                    'moveCollectionAddress' => '',
                    'moveFinalDestination' => '',
                    'crematoriumContactPhonePerson' => $crematoriumContactPhonePerson,
                    'authContactPhone' => '',
                    'flightNumber' => '',
                    'airportOrigin' => '',
                    'departureTime' => '',
                    'arrivalAirport' => '',
                    'arrivalTime' => '',
                    'otherCeremony' => '',
                    'otherInhumation' => '',
                    'deceasedNationalityLocation' => '',
                    'familyContactNationality' => 1,
                    'familyContactOtherCountry' => '',
                    'familyContactOtherProvince' => '',
                    'familyContactOtherLocation' => '',
                    'arriveTime' => '',
                    'cremation' => $crematoriumCheck,
                    'crematoriumStatus' => $crematoriumStatus,
                    'crematoriumEntryDate' => $crematoriumEntryDate,
                    'crematoriumEntryTime' => $crematoriumEntryTime,
                    'crematoriumLeavingDate' => $crematoriumLeavingDate,
                    'crematoriumLeavingTime' => $crematoriumLeavingTime,
                    'deceasedMortuaryAddress' => ''
                );
                echo "<pre>{$data['requestDate']}</pre>";
                $expedients->createExpedient($data);
            }

            /*if($i == 1){
                break;
            }*/

            $i++;
        }
    }
?>