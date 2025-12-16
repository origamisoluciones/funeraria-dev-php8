<?php
    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);

    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json; charset=UTF-8');
    header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE');
    header('Access-Control-Max-Age: 3600');
    // header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");

    define('JWT_KEY', 'Api-fun.21#');

    require_once(__DIR__ . "/../resources/plugins/jwt/JWT.php");
    require_once(__DIR__ . "/../resources/plugins/jwt/SignatureInvalidException.php");
    require_once(__DIR__ . "/../resources/plugins/jwt/BeforeValidException.php");
    require_once(__DIR__ . "/../resources/plugins/jwt/ExpiredException.php");
    require_once(__DIR__ . "/../core/db/dbHandler.php");

    use \Firebase\JWT\JWT;
    use \Firebase\JWT\SignatureInvalidException;
    use \Firebase\JWT\BeforeValidException;
    use \Firebase\JWT\ExpiredException;

    // Generate payload test
    // if($_SERVER['HTTP_X_FORWARDED_FOR'] == '81.0.61.70'){
    //     $payload = array(
    //         'access' => 'api-sanjose'
    //     );
    //     $jwt = JWT::encode($payload, JWT_KEY);
    //     var_dump($jwt);
    //     return;
    // }
    // try{
    //     JWT::$leeway = 60;
    //     $decoded = JWT::decode($jwt, JWT_KEY, array('HS256'));
    // }catch(Exception $e){
    //     $decoded = null;
    // }
    // var_dump($decoded);
    // return;

    switch($_SERVER['REQUEST_METHOD']){
        case 'GET':
            if(empty($_GET)){
                $data = json_decode(urldecode(file_get_contents('php://input')));
            }else{
                $data = $_GET;
            }
        break;
        case 'POST':
            if(empty($_POST)){
                $data = json_decode(urldecode(file_get_contents('php://input')));
            }else{
                $data = isset($_POST) ? $_POST : null;
            }
        break;
        case 'PUT':
            $data = json_decode(urldecode(file_get_contents('php://input')));
        break;
        case 'DELETE':
            $data = json_decode(urldecode(file_get_contents('php://input')));
        break;
    }

    try{
        $jwt = null;
        if(isset($_SERVER["HTTP_AUTHORIZATION"])){
            $jwt = explode(':', substr($_SERVER["HTTP_AUTHORIZATION"], 7))[0];
            JWT::$leeway = 60;
            $decoded = (array) JWT::decode($jwt, JWT_KEY, array('HS256'));
        }elseif(isset($data['bearer'])){
            $jwt = $data['bearer'];
            JWT::$leeway = 60;
            $decoded = (array) JWT::decode($jwt, JWT_KEY, array('HS256'));
        }else{
            $decoded = null;
        }
    }catch(Exception $e){
        $decoded = null;
    }

    if(!isset($decoded['access'])){
        var_dump('error access');
        // header('HTTP/1.1 403 Forbidden');
        return;
    }

    switch($decoded['access']){
        case 'api-arosa':
            $dbName = 'apparosa';
        break;
        case 'api-minor':
            $dbName = 'appbaiona';
        break;
        case 'api-colodro':
            $dbName = 'appcolodro';
        break;
        case 'api-abrisa':
            $dbName = 'appabrisa';
        break;
        case 'api-gonzalez-avila':
            $dbName = 'appgonzalezavila';
        break;
        case 'api-santa-tegra':
            $dbName = 'appsantategra';
        break;
        case 'api-bahia':
            $dbName = 'appbahia';
        break;
        case 'api-ibiza':
            $dbName = 'appibiza';
        break;
        case 'api-sanjose':
            $dbName = 'appsanjose';
        break;
        case 'api-martinez':
            $dbName = 'appmartinez';
        break;
        case 'api-mejorenelcielo':
            $dbName = 'appmejorenelcielo';
        break;
        case 'api-javea':
            $dbName = 'appjavea';
        break;
        case 'api-cardelle':
            $dbName = 'appcardelle';
        break;
        case 'api-marina':
            $dbName = 'appmarina';
        break;
        case 'encuesta':
            switch($data->company){
                case '1':
                    $dbName = 'apparosa';
                break;
                case '2':
                    $dbName = 'appabrisa';
                break;
                case '3':
                    $dbName = 'apporigami';
                break;
                case '4':
                    $dbName = 'appgarrido';
                break;
                case '5':
                    $dbName = 'appantonio';
                break;
                case '6':
                    $dbName = 'appbaiona';
                break;
                case '7':
                    $dbName = 'appmabegondo';
                break;
                case '8':
                    $dbName = 'appeduardo';
                break;
                case '9':
                    $dbName = 'appcolodro';
                break;
                case '10':
                    $dbName = 'appbarbanza';
                break;
                case '11':
                    $dbName = 'appibiza';
                break;
                case '12':
                    $dbName = 'appsanmarcos';
                break;
                case '13':
                    $dbName = 'appsraprado';
                break;
                case '14':
                    $dbName = 'appvaldepena';
                break;
                case '15':
                    $dbName = 'appoliver';
                break;
                case '16':
                    $dbName = 'appsanjuan';
                break;
                case '17':
                    $dbName = 'applaestrella';
                break;
                case '18':
                    $dbName = 'appespaciofunerario';
                break;
                case '19':
                    $dbName = 'appgonzalezavila';
                break;
                case '20':
                    $dbName = 'appsantategra';
                break;
                case '21':
                    $dbName = 'appbahia';
                break;
                case '22':
                    $dbName = 'appsanjose';
                break;
                case '23':
                    $dbName = 'appvalderrama';
                break;
                case '24':
                    $dbName = 'appgrupoiglesias';
                break;
                case '25':
                    $dbName = 'appoccidenteasturias';
                break;
                case '26':
                    $dbName = 'appandresforner';
                break;
                case '27':
                    $dbName = 'appicod';
                break;
                case '28':
                    $dbName = 'appmartinez';
                break;
                case '29':
                    $dbName = 'appmejorenelcielo';
                break;
                case '30':
                    $dbName = 'appjavea';
                break;
                case '31':
                    $dbName = 'appcardelle';
                break;
                case '32':
                    $dbName = 'appmarina';
                break;
                default:
                    header('HTTP/1.1 403 Forbidden');
                    return;
                break;
            }
        break;
        default:
            header('HTTP/1.1 403 Forbidden');
            return;
        break;
    }

    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = substr($uri, 1);
    $uri = str_replace('apiv2/', '', $uri);

    $ids = array();
    $elems = explode('/', $uri);
    $item = null;
    $uri = '';
    foreach($elems as $elem){
        if(is_numeric($elem)){
            array_push($ids, $elem);
        }else{
            $uri .= "$elem/";
        }
    }
    $uri = substr($uri, 0, -1);

    switch($uri){
        case 'mortuaries':
            switch($_SERVER['REQUEST_METHOD']){
                case 'GET':
                    echo json_encode(getMortuaries($dbName));
                break;
            }
        break;
        case 'expedients':
            switch($_SERVER['REQUEST_METHOD']){
                case 'GET':
                    echo json_encode(getDeceased($dbName, $data));
                break;
            }
        break;
        case 'expedients-aniversary':
            switch($_SERVER['REQUEST_METHOD']){
                case 'GET':
                    echo json_encode(getDeceasedBirthday($dbName, $data));
                break;
            }
        break;
        case 'expedients/search':
            switch($_SERVER['REQUEST_METHOD']){
                case 'GET':
                    echo json_encode(getDeceasedSearch($dbName, $data));
                break;
            }
        break;
        case 'expedients-aniversary/search':
            switch($_SERVER['REQUEST_METHOD']){
                case 'GET':
                    echo json_encode(getDeceasedSearchBirthday($dbName, $data));
                break;
            }
        break;
        case 'deceased':
            switch($_SERVER['REQUEST_METHOD']){
                case 'GET':
                    echo json_encode(getDeceasedInfo($dbName, $data));
                break;
            }
        break;
        case 'deceased/header':
            switch($_SERVER['REQUEST_METHOD']){
                case 'GET':
                    echo json_encode(getDeceasedHeaderInfo($dbName, $data));
                break;
            }
        break;
        case 'deceased/name':
            switch($_SERVER['REQUEST_METHOD']){
                case 'GET':
                    echo json_encode(getDeceasedName($dbName, $data));
                break;
            }
        break;
        case 'deceased/funeral':
            switch($_SERVER['REQUEST_METHOD']){
                case 'GET':
                    echo json_encode(getDeceasedDate($dbName, $data));
                break;
            }
        break;
        case 'condolences':
            switch($_SERVER['REQUEST_METHOD']){
                case 'POST':
                    echo json_encode(createCondolence($dbName, $data));
                break;
            }
        break;
        case 'company/logo':
            switch($_SERVER['REQUEST_METHOD']){
                case 'GET':
                    echo json_encode(getCompanyLogo($dbName));
                break;
            }
        break;
        case 'encuestas/ver':
            switch($_SERVER['REQUEST_METHOD']){
                case 'GET':
                    echo json_encode(getSurvey($dbName, $data));
                break;
            }
        break;
        case 'encuestas/enviar':
            switch($_SERVER['REQUEST_METHOD']){
                case 'POST':
                    echo json_encode(sendSurvey($dbName, $data));
                break;
            }
        break;
        case 'vivoRecuerdo':
            switch($_SERVER['REQUEST_METHOD']){
                case 'GET':
                    echo json_encode(getVivoRecuerdo($dbName, $data));
                break;
            }
        break;
    }

    /**
     * Gets mortuaries
     *
     * @param string $dbName Database name
     * @return array
     */
    function getMortuaries($dbName){
        $db = new DbHandler(true, $dbName);

        $result = $db->query("  SELECT  m.mortuaryID as id, m.name as text
                                FROM    Mortuaries m
                                WHERE   m.leavingDate IS NULL AND
                                        m.mortuaryID != 0 AND
                                        m.isYourOwn = 1");

        return $result === false ? array() : (mysqli_num_rows($result) == 0 ? array() : $db->resultToArray($result));
    }

    /**
     * Obtiene los difuntos y sus esquelas desde dos días antes hasta el día actual
     * 
     * @param string $dbName Database name
     * @param array $data Data
     */
    function getDeceased($dbName, $data){
        $db = new DbHandler(true, $dbName);

        $where = '';

        $deceasedName = $data->deceasedName;
        $deceasedSurname = $data->deceasedSurname;
        $deceasedMortuary = $data->deceasedMortuary;

        if($deceasedMortuary != '0' && $deceasedMortuary != ''){
            $where .= " AND e.deceasedMortuary = $deceasedMortuary";
        }

        // Current time less 2 days
        $days = 2;
        if($dbName == 'appabrisa'){
            $days = 15;
        }
        $currentTime = time() - $days * 24 * 60 * 60;

        $whereExpType = ' AND e.type != 2';
        if($dbName == 'appibiza'){
            $whereExpType = '';
        }

        $result = $db->query("  SELECT      e.expedientID, e.deceasedName, e.deceasedSurname, e.deceasedBirthday, e.deceasedDate, e.deceasedRoom,
                                            e.funeralDate, e.funeralTime, e.deceasedMortuaryAddress, e.ceremonyDate, e.ceremonyTime, es.showAgeObituaryWeb,
                                            m.name as mortuary, e.deceasedLocality, e.startVelacionDate, e.startVelacionTime, e.funeralHomeEntryDate,
                                            e.funeralHomeEntryTime,
                                            es.showFinalDestinationWeb, es.showVelationWeb, es.showCeremonyWeb,
                                            ch.name as churchName
                                FROM        (Expedients e, Expedients_Services es, Mortuaries m)
                                LEFT JOIN   Churches ch ON e.church = ch.churchID
                                WHERE       e.leavingDate IS NULL AND
                                            e.expedientID = es.expedient AND
                                            es.webLink IS NOT NULL AND
                                            e.deceasedMortuary = m.mortuaryID AND
                                            e.deceasedName LIKE '%$deceasedName%' AND
                                            e.deceasedSurname LIKE '%$deceasedSurname%' AND
                                            e.funeralDate IS NOT NULL AND e.funeralTime IS NOT NULL AND
                                            e.ceremonyDate IS NOT NULL AND e.ceremonyTime IS NOT NULL AND
                                            UNIX_TIMESTAMP(CONCAT(e.ceremonyDate, ' ', e.ceremonyTime)) > $currentTime
                                            $whereExpType
                                            $where
                                ORDER BY    m.isYourOwn DESC, m.name ASC, e.funeralDate DESC, e.funeralTime DESC");

        if(mysqli_num_rows($result) == 0){
            return array();
        }else{
            return $db->resultToArray($result);
        }
    }

    /**
     * Obtiene los difuntos y sus esquelas desde dos días antes hasta el día actual
     * 
     * @param string $dbName Database name
     * @param array $data Data
     */
    function getDeceasedBirthday($dbName, $data){
        $db = new DbHandler(true, $dbName);
        
        // $data = json_decode($data['data']);
        $deceasedName = $data->deceasedName;
        $deceasedSurname = $data->deceasedSurname;
        $deceasedMortuary = $data->deceasedMortuary;
        
        $where = '';
        if($deceasedMortuary != '0' && $deceasedMortuary != ''){
            $where .= " AND e.deceasedMortuary = $deceasedMortuary";
        }

        $whereExpType = ' AND e.type != 2';
        if($dbName == 'appibiza'){
            $whereExpType = '';
        }

        $currentTime = time();

        $result = $db->query("  SELECT      e.expedientID, e.deceasedName, e.deceasedSurname, e.deceasedBirthday, e.deceasedDate, e.deceasedRoom,
                                            e.funeralDate, e.funeralTime, e.deceasedMortuaryAddress, e.ceremonyDate, e.ceremonyTime, es.showAgeObituaryWeb,
                                            m.name as mortuary, e.deceasedLocality, e.startVelacionDate, e.startVelacionTime, e.funeralHomeEntryDate,
                                            e.funeralHomeEntryTime,
                                            es.dateAniversaryWeb as dateAniversary, es.timeAniversaryWeb as timeAniversary,
                                            es.showFinalDestinationWeb, es.showVelationWeb, es.showCeremonyWeb,
                                            ch.name as churchName
                                FROM        (Expedients e, Mortuaries m, Expedients_Services es)
                                LEFT JOIN   Churches ch ON es.churchAniversaryWeb = ch.churchID
                                WHERE       e.leavingDate IS NULL AND
                                            e.expedientID = es.expedient AND
                                            es.webLink IS NOT NULL AND
                                            e.deceasedMortuary = m.mortuaryID AND
                                            e.deceasedName LIKE '%$deceasedName%' AND
                                            e.deceasedSurname LIKE '%$deceasedSurname%' AND
                                            es.sinceAniversaryWeb != '' AND 
                                            es.sinceAniversaryWeb IS NOT NULL AND 
                                            es.untilAniversaryWeb != '' AND 
                                            es.untilAniversaryWeb IS NOT NULL AND
                                            $currentTime BETWEEN UNIX_TIMESTAMP(CONCAT(es.sinceAniversaryWeb, ' 00:00:00')) AND UNIX_TIMESTAMP(CONCAT(es.untilAniversaryWeb, ' 23:59:59')) AND
                                            e.funeralDate IS NOT NULL AND e.funeralTime IS NOT NULL AND
                                            e.ceremonyDate IS NOT NULL AND e.ceremonyTime IS NOT NULL
                                            $whereExpType
                                            $where
                                ORDER BY    es.dateAniversaryWeb ASC, m.name ASC");

        if(mysqli_num_rows($result) == 0){
            return array();
        }else{
            return $db->resultToArray($result);
        }
    }

    /**
     * Obtiene los difuntos y sus esquelas desde dos días antes hasta el día actual
     * 
     * @param string $dbName Database name
     * @param array $data Data
     */
    function getDeceasedSearch($dbName, $data){
        $db = new DbHandler(true, $dbName);

        $where = '';

        $deceasedName = $data->deceasedName;
        $deceasedSurname = $data->deceasedSurname;
        $deceasedMortuary = $data->deceasedMortuary;

        if($deceasedMortuary != '0' && $deceasedMortuary != ''){
            $where .= " AND e.deceasedMortuary = $deceasedMortuary";
        }

        $whereExpType = ' AND e.type != 2';
        if($dbName == 'appibiza'){
            $whereExpType = '';
        }

        $result = $db->query("  SELECT      e.expedientID, e.deceasedName, e.deceasedSurname, e.deceasedBirthday, e.deceasedDate, e.deceasedRoom,
                                            e.funeralDate, e.funeralTime, e.deceasedMortuaryAddress, e.ceremonyDate, e.ceremonyTime, e.funeralHomeEntryDate,
                                            e.funeralHomeEntryTime, e.startVelacionDate, e.startVelacionTime, e.funeralHomeEntryDate,
                                            es.showAgeObituaryWeb, es.showFinalDestinationWeb, es.showVelationWeb, es.showCeremonyWeb,
                                            m.name as mortuary, e.deceasedLocality,
                                            ch.name as churchName
                                FROM        (Expedients e, Expedients_Services es, Mortuaries m)
                                LEFT JOIN   Churches ch ON e.church = ch.churchID
                                WHERE       e.leavingDate IS NULL AND
                                            e.expedientID = es.expedient AND
                                            es.webLink IS NOT NULL AND
                                            e.deceasedMortuary = m.mortuaryID AND
                                            e.deceasedName LIKE '%$deceasedName%' AND
                                            e.deceasedSurname LIKE '%$deceasedSurname%' AND
                                            e.funeralDate IS NOT NULL AND e.funeralTime IS NOT NULL AND
                                            e.ceremonyDate IS NOT NULL AND e.ceremonyTime IS NOT NULL
                                            $whereExpType
                                            $where
                                ORDER BY    m.name ASC, e.requestDate DESC");

        if(mysqli_num_rows($result) == 0){
            return array();
        }else{
            return $db->resultToArray($result);
        }
    }

     /**
     * Obtiene los difuntos y sus esquelas desde dos días antes hasta el día actual
     * 
     * @param string $dbName Database name
     * @param array $data Data
     */
    function getDeceasedSearchBirthday($dbName, $data){
        $db = new DbHandler(true, $dbName);

        $where = '';

        $deceasedName = $data->deceasedName;
        $deceasedSurname = $data->deceasedSurname;
        $deceasedMortuary = $data->deceasedMortuary;

        if($deceasedMortuary != '0' && $deceasedMortuary != ''){
            $where .= " AND e.deceasedMortuary = $deceasedMortuary";
        }

        $whereExpType = ' AND e.type != 2';
        if($dbName == 'appibiza'){
            $whereExpType = '';
        }

        $currentTime = time();
        $result = $db->query("  SELECT      e.expedientID, e.deceasedName, e.deceasedSurname, e.deceasedBirthday, e.deceasedDate, e.deceasedRoom,
                                            e.funeralDate, e.funeralTime, e.deceasedMortuaryAddress, e.ceremonyDate, e.ceremonyTime, es.showAgeObituaryWeb,
                                            m.name as mortuary, e.deceasedLocality,
                                            es.dateAniversaryWeb as dateAniversary, es.timeAniversaryWeb as timeAniversary,
                                            es.showFinalDestinationWeb, es.showVelationWeb, es.showCeremonyWeb,
                                            ch.name as churchName
                                FROM        (Expedients e, Mortuaries m, Expedients_Services es)
                                LEFT JOIN   Churches ch ON es.churchAniversaryWeb = ch.churchID
                                WHERE       e.leavingDate IS NULL AND
                                            e.expedientID = es.expedient AND
                                            es.webLink IS NOT NULL AND
                                            e.deceasedMortuary = m.mortuaryID AND
                                            e.deceasedName LIKE '%$deceasedName%' AND
                                            e.deceasedSurname LIKE '%$deceasedSurname%' AND
                                            es.sinceAniversaryWeb != '' AND es.sinceAniversaryWeb IS NOT NULL AND 
                                            es.untilAniversaryWeb != '' AND es.untilAniversaryWeb IS NOT NULL AND 
                                            $currentTime BETWEEN UNIX_TIMESTAMP(CONCAT(es.sinceAniversaryWeb, ' 00:00:00')) AND UNIX_TIMESTAMP(CONCAT(es.untilAniversaryWeb, ' 23:59:59')) AND
                                            e.funeralDate IS NOT NULL AND e.funeralTime IS NOT NULL AND
                                            e.ceremonyDate IS NOT NULL AND e.ceremonyTime IS NOT NULL
                                            $whereExpType
                                            $where
                                ORDER BY    m.name ASC, e.requestDate DESC");

        if(mysqli_num_rows($result) == 0){
            return array();
        }else{
            return $db->resultToArray($result);
        }
    }

    /**
     * Obtiene los difuntos y sus esquelas desde dos días antes hasta el día actual
     * 
     * @param string $dbName Database name
     * @param array $data Data
     */
    function getDeceasedInfo($dbName, $data){
        $db = new DbHandler(true, $dbName);

        $expedient = $data->expedient;

        $result = $db->query("  SELECT      e.expedientID, e.deceasedName, e.deceasedSurname, e.deceasedDate, e.deceasedBirthday, e.deceasedRoom,
                                            e.funeralDate, e.funeralTime, e.ceremonyDate, e.ceremonyTime,
                                            e.churchLabel, e.otherCeremony, c.name as church,
                                            e.cemeteryLabel, e.otherInhumation, ce.name as cemetery,
                                            m.name as mortuary, l3.name as mortuaryLocation, m.vivo_recuerdo_client, m.vivo_recuerdo_key,
                                            IF(m.latitude IS NOT NULL, m.latitude, c.latitude) as latitude,
                                            IF(m.longitude IS NOT NULL, m.longitude, c.longitude) as longitude,
                                            c.latitude as churchLatitude, c.longitude as churchLongitude,
                                            ce.latitude as cemeteryLatitude, ce.longitude as cemeteryLongitude,
                                            l.name as deceasedBirthdayLocation,
                                            l2.name as deceasedLocation,
                                            e.crematorium, e.deceasedLocality, e.startVelacionDate, e.startVelacionTime,
                                            es.showAgeObituaryWeb, es.dateAniversaryWeb as dateAniversary, es.timeAniversaryWeb as timeAniversary, es.webLink,
                                            es.showFinalDestinationWeb, es.showVelationWeb, es.showCeremonyWeb,
                                            ch2.name as churchName
                                FROM        (Expedients e, Expedients_Services es)
                                LEFT JOIN   Mortuaries m ON e.deceasedMortuary = m.mortuaryID
                                LEFT JOIN   Locations l ON e.deceasedBirthdayLocation = l.locationID
                                LEFT JOIN   DeceasedIn di ON e.deceasedLocation = di.deceasedInID
                                LEFT JOIN   Locations l2 ON di.location = l2.locationID
                                LEFT JOIN   Locations l3 ON m.location = l3.locationID
                                LEFT JOIN   Churches c ON e.church = c.churchID
                                LEFT JOIN   Cemeteries ce ON e.cemetery = ce.cemeteryID
                                LEFT JOIN   Crematoriums cr ON e.crematorium = cr.crematoriumID
                                LEFT JOIN   Churches ch2 ON es.churchAniversaryWeb = ch2.churchID
                                WHERE       e.expedientID = $expedient AND
                                            e.leavingDate IS NULL AND
                                            e.expedientID = es.expedient");

        if(mysqli_num_rows($result) == 0){
            return array();
        }else{
            $deceased = $db->resultToArray($result);

            $host = 'https://pompasfunebres.app/';

            $company = '';
            switch($dbName){
                case 'apparosa':
                    $company = 1;
                break;
                case 'appbaiona':
                    $company = 6;
                break;
                case 'appcolodro':
                    $company = 9;
                break;
                case 'appabrisa':
                    $company = 2;
                break;
                case 'appgonzalezavila':
                    $company = 19;
                break;
                case 'appsantategra':
                    $company = 20;
                break;
                case 'appbahia':
                    $company = 21;
                break;
                case 'appibiza':
                    $company = 11;
                break;
                case 'appsanjose':
                    $company = 22;
                break;
                case 'appmartinez':
                    $company = 28;
                break;
            }

            foreach($deceased as $index => $elem){
                $deceased[$index]['obituary'] = array();
                
                $expedientID = $elem['expedientID'];

                if($company == 9){
                    $dir = __DIR__ . "/../resources/files/$company/expedients/$expedientID/obituary-images";
                    $deceased[$index]['obituary']['main'] = null;
                    $deceased[$index]['obituary']['other'] = array();
                    
                    if(is_dir($dir)){
                        $result = $db->query("  SELECT  eoi.id, eoi.name, eoi.main
                                                FROM    Expedients_Obituaries_Images eoi
                                                WHERE   eoi.delete_date IS NULL AND
                                                        eoi.expedient = $expedientID");

                        if(mysqli_num_rows($result) > 0){
                            $foundObituaries = $db->resultToArray($result);

                            foreach($foundObituaries as $item){
                                if($item['main'] == '1'){
                                    if(file_exists(__DIR__ . "/../resources/files/$company/expedients/$expedientID/obituary-images/{$item['name']}")){
                                        $deceased[$index]['obituary']['main'] = "{$host}resources/files/$company/expedients/$expedientID/obituary-images/{$item['name']}";
                                    }
                                }else{
                                    if(file_exists(__DIR__ . "/../resources/files/$company/expedients/$expedientID/obituary-images/{$item['name']}")){
                                        array_push(
                                            $deceased[$index]['obituary']['other'],
                                            "{$host}resources/files/$company/expedients/$expedientID/obituary-images/{$item['name']}"
                                        );
                                    }
                                }
                            }
                        }
                    }
                }else{
                    $dir = __DIR__ . "/../resources/files/$company/expedients/$expedientID/obituary";
                    if(is_dir($dir)){
                        $dirList = scandir($dir);
                        array_shift($dirList);
                        array_shift($dirList);
                        
                        $result = $db->query("  SELECT  eo.type, eo.model
                                                FROM    Expedients_Obituaries eo
                                                WHERE   eo.expedient = $expedientID AND 
                                                        eo.selected = 1");
    
                        if(mysqli_num_rows($result) > 0){
                            $result = $db->resultToArray($result)[0];
    
                            $type = $result['type'];
                            $model = $result['model'];
    
                            
                            if(file_exists(__DIR__ . "/../resources/files/$company/expedients/$expedientID/obituary/$type/$model/files/img.png")){
                                array_push($deceased[$index]['obituary'], "{$host}resources/files/$company/expedients/$expedientID/obituary/$type/$model/files/img.png");
                                array_push($deceased[$index]['obituary'], $type);
                            }
                        }
                    }
                }
            }

            return $deceased;
        }
    }

    /**
     * Obtiene los datos del difunto
     * 
     * @param string $dbName Database name
     * @param array $data Data
     */
    function getDeceasedHeaderInfo($dbName, $data){
        $db = new DbHandler(true, $dbName);

        $expedient = $data->expedient;

        $result = $db->query("  SELECT      e.deceasedName, e.deceasedSurname, e.deceasedBirthday, e.funeralDate, e.deceasedRoom, e.ceremonyDate, e.deceasedDate,
                                            l.name as deceasedBirthdayLocation,
                                            l3.name as mortuaryLocation,
                                            m.name as mortuary,
                                            es.showAgeObituaryWeb,
                                            eo.extraText
                                FROM        (Expedients e, Expedients_Services es)
                                LEFT JOIN   Mortuaries m ON e.deceasedMortuary = m.mortuaryID
                                LEFT JOIN   Locations l ON e.deceasedBirthdayLocation = l.locationID
                                LEFT JOIN   Locations l3 ON m.location = l3.locationID
                                LEFT JOIN   Expedients_Obituaries eo ON eo.expedient = e.expedientID AND eo.selected = 1
                                WHERE       e.expedientID = $expedient AND
                                            e.leavingDate IS NULL AND
                                            es.expedient = e.expedientID");

        if(mysqli_num_rows($result) == 0){
            return array();
        }else{
            return $db->resultToArray($result)[0];
        }
    }

    /**
     * Obtiene los datos del difunto
     * 
     * @param string $dbName Database name
     * @param array $data Data
     */
    function getDeceasedName($dbName, $data){
        $db = new DbHandler(true, $dbName);

        $expedient = $data->expedient;

        $result = $db->query("  SELECT  e.deceasedName, e.deceasedSurname
                                FROM    Expedients e
                                WHERE   e.expedientID = $expedient AND
                                        e.leavingDate IS NULL");

        if(mysqli_num_rows($result) == 0){
            return array();
        }else{
            return $db->resultToArray($result)[0];
        }
    }

    /**
     * Obtiene los datos del difunto
     * 
     * @param string $dbName Database name
     * @param array $data Data
     */
    function getDeceasedDate($dbName, $data){
        $db = new DbHandler(true, $dbName);

        $deceasedName = $data->deceasedName;
        $deceasedSurname = $data->deceasedSurname;

        $whereExpType = '(e.type = 1 OR e.type = 3) AND';
        if($dbName == 'appibiza'){
            $whereExpType = '';
        }

        $result = $db->query("  SELECT      e.funeralDate, e.funeralTime
                                FROM        Expedients e
                                WHERE       e.deceasedName = '$deceasedName' AND
                                            e.deceasedSurname = '$deceasedSurname' AND
                                            e.leavingDate IS NULL AND
                                            $whereExpType
                                            e.funeralDate IS NOT NULL AND
                                            e.funeralDate != '' AND
                                            e.funeralTime IS NOT NULL AND
                                            e.funeralTime != ''
                                ORDER BY    e.funeralDate DESC, e.funeralTime DESC
                                LIMIT       1");

        if(mysqli_num_rows($result) == 0){
            return array();
        }else{
            return $db->resultToArray($result)[0];
        }
    }

    /**
     * Añade un nuevo pésame
     * 
     * @param string $dbName Database name
     * @param array $data Datos del pésame
     * @return bool
     */
    function createCondolence($dbName, $data){
        $db = new DbHandler(true, $dbName);

        $expedient = $data->expedient;
        $name = $data->name;
        $phone = $data->phone;
        $address = $data->address;
        $city = $data->city;
        $condolence = $data->condolence;
        $date = time();
        
        $expedient = cleanStr($expedient, $dbName);
        $name = cleanStr($name, $dbName);
        $phone = cleanStr($phone, $dbName);
        $address = cleanStr($address, $dbName);
        $city = cleanStr($city, $dbName);
        $condolence = cleanStr($condolence, $dbName);
        $condolence = str_replace('~~', '\n', $condolence);
        $condolence = str_replace('~', '\n', $condolence);

        if(count($_FILES) == 0){
            $doc = '';
        }else{
            $doc = $_FILES['file']['name'];
        }

        $company = '';
        switch($dbName){
            case 'apparosa':
                $company = 1;
            break;
            case 'appabrisa':
                $company = 2;
            break;
            case 'appbaiona':
                $company = 6;
            break;
            case 'appcolodro':
                $company = 9;
            break;
            case 'appibiza':
                $company = 11;
            break;
            case 'appgonzalezavila':
                $company = 19;
            break;
            case 'appsantategra':
                $company = 20;
            break;
            case 'appbahia':
                $company = 21;
            break;
        }

        $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

        $result = $db->query("  SELECT  * 
                                FROM    Condolences 
                                WHERE   extraID = '" . $extraID . "'");
        
        while(mysqli_num_rows($result) > 0){
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);

            $result = $db->query("  SELECT  * 
                                    FROM    Condolences 
                                    WHERE   extraID = '" . $extraID . "'");
        }

        $host = 'https://pompasfunebres.app/';

        $file = fopen(__DIR__ . '/../test/prueba/condolences.txt', 'w');

        fwrite($file, "INSERT INTO Condolences(expedient, name, phone, address, city, condolence, date, extraID)
        VALUES ($expedient, '$name', '$phone', '$address', '$city', '$condolence', $date, '$extraID')");

        fclose($file);

        $db->query("INSERT INTO Condolences(expedient, name, phone, address, city, condolence, date, extraID)
                    VALUES ($expedient, '$name', '$phone', '$address', '$city', '$condolence', $date, '$extraID')");

        $result = $db->query("  SELECT  c.ID
                                FROM    Condolences c
                                WHERE   c.extraID = '$extraID'");

        if(mysqli_num_rows($result) == 0){
            return false;
        }else{
            $id = $db->resultToArray($result)[0]['ID'];

            if(count($_FILES) > 0){
                $file = $_FILES['file'];

                if(!is_dir(__DIR__ . "/../resources/files/$company/condolences/$expedient/$id/")){
                    mkdir(__DIR__ . "/../resources/files/$company/condolences/$expedient/$id/", 0777);
                }

                $ext = explode('.', $doc)[count(explode('.', $doc)) - 1];
                if($ext != 'pdf' && $ext != 'jpg' && $ext != 'mp3' && $ext != 'mp4'){
                    $db->query("DELETE FROM Condolences
                                WHERE ID = $id");
                    return false;
                }else{
                    if(move_uploaded_file($file['tmp_name'], __DIR__ . "/../resources/files/$company/condolences/$expedient/$id/" . $file['name'])){
                        $db->query("UPDATE  Condolences c
                                    SET     c.doc = '" . $host . "resources/files/$company/condolences/$expedient/$id/" . $doc . "'
                                    WHERE   c.ID = $id");

                        return true;
                    }else{
                        $db->query("DELETE FROM Condolences
                                    WHERE ID = $id");
                        return false;
                    }
                }
            }else{
                return true;
            }
        }
    }

    /**
     * Gets mortuaries
     *
     * @param string $dbName Database name
     * @return array
     */
    function getCompanyLogo($dbName){
        $db = new DbHandler(true, $dbName);

        $result = $db->query("  SELECT  s.value
                                FROM    Settings s
                                WHERE   s.name = 'logo'");

        return $result === false ? array() : (mysqli_num_rows($result) == 0 ? array() : $db->resultToArray($result));
    }

    /**
     * Gets survey
     *
     * @param string $dbName Database name
     * @param array $data Parametros de la encuestra
     * @return array
     */
    function getSurvey($dbName, $data){
        $db = new DbHandler(true, $dbName);

        $poll = $data->survey;
        $expedientPoll = $data->expedient_poll;

        // Checks if the user just make the poll
        $result = $db->query("  SELECT  COUNT(*) as total
                                FROM    Expedients_Polls_Results epr
                                WHERE   epr.expedient_poll = $expedientPoll
                                    AND epr.leavingDate IS NULL");
        
        if($result === false || mysqli_num_rows($result) == 0){
            return 'error';
        }else{
            $result = $db->resultToArray($result)[0]['total'];
        }
       
        if(intval($result) > 0){
            return 'exists';
        }

        $info = array();

        // Gets poll info
        $result = $db->query("  SELECT  p.title
                                FROM    Polls p
                                WHERE   p.ID = $poll");

        if(mysqli_num_rows($result) == 0){
            return array();
        }
        $result = $db->resultToArray($result);
        $info['info'] = $result[0];
        
        // Gets poll items
        $result = $db->query("  SELECT      pit.ID, pit.question
                                FROM        Polls_Items pit
                                WHERE       pit.poll = $poll AND
                                            pit.leavingDate IS NULL
                                ORDER BY    pit.order_question");

        if(mysqli_num_rows($result) == 0){
            return array();
        }
        $result = $db->resultToArray($result);
        $info['items'] = $result;

        return $info;
    }

    /**
     * Sends survey
     *
     * @param string $dbName Database name
     * @param array $data Parametros de la encuesta
     * @return array
     */
    function sendSurvey($dbName, $data){
        $db = new DbHandler(true, $dbName);

        $expedientPoll = $data->expedient_poll;

        // Obtenemos el telefono
        $result = $db->query("  SELECT  ep.phone, ep.expedient
                                FROM    Expedients_Polls ep
                                WHERE   ep.ID = $expedientPoll");

        if(mysqli_num_rows($result) == 0){
            return array();
        }
        $result = $db->resultToArray($result);
        $currentPhone = $result[0]['phone'];
        $currentExpedient = $result[0]['expedient'];

        // Consultamos si ese telefono tiene más de una tupla
        $result = $db->query("  SELECT  ep.ID
                                FROM    Expedients_Polls ep
                                WHERE   ep.phone = '$currentPhone'
                                    AND ep.expedient = $currentExpedient
                                    AND ep.sent = 1
                                    AND leavingDate IS NULL");

        if(mysqli_num_rows($result) == 0){
            return array();
        }
        $result = $db->resultToArray($result);

        // Eliminarar los resultados si existen para ese telefóno
        if(count($result) > 1){
            $currentExpedientPoll = $result[0]['ID'];

            $deleteTime = date("Y-m-d H:i:s");
            $db->query("UPDATE  Expedients_Polls_Results epr
                        SET     epr.leavingDate = '$deleteTime'
                        WHERE   epr.expedient_poll = $currentExpedientPoll");

            $deleteTime = time();
            $db->query("UPDATE  Expedients_Polls ep
                        SET     ep.leavingDate = $deleteTime
                        WHERE   ep.ID = $currentExpedientPoll");
        }
        
        foreach($data->scores as $item){
            
            $pollItem = $item->id;
            $score = $item->score;
            $notes = $item->notes;
            $creationDate = time();
            
            $db->query(" INSERT INTO Expedients_Polls_Results(expedient_poll, poll_item, score, notes, creationDate) 
                         VALUES (" . $expedientPoll . ", '" . $pollItem . "', '" . $score . "', '" . $notes . "', ".$creationDate.")"
            );
        }

        return true;
    }

    /**
     * Gets Vivo Recuerdo info
     *
     * @param string $dbName Database name
     * @param object $data Parametros de la encuesta
     * @return array
     */
    function getVivoRecuerdo($dbName, $data){

        $db = new DbHandler(true, $dbName);

        $expedient = $data['expedient'];

        $result = $db->query("  SELECT  es.vivoSent,
                                        m.vivo_recuerdo_client as api_client, m.vivo_recuerdo_key as api_key,
                                        e.deceasedName, e.deceasedSurname
                                FROM    Mortuaries m, Expedients e, Expedients_Services es
                                WHERE   m.leavingDate IS NULL AND
                                        m.mortuaryID = e.deceasedMortuary AND
                                        es.expedient = e.expedientID AND
                                        e.expedientID = $expedient");

        if(mysqli_num_rows($result) == 0){
            return false;
        }else{
            $mortuaryInfo = $db->resultToArray($result);
            $mortuaryInfo = $mortuaryInfo[0];

            if(intval($mortuaryInfo['vivoSent']) == 1){
                $clientKey = $mortuaryInfo['api_client'];
                $secretKey = $mortuaryInfo['api_key'];
                $deceasedName = $mortuaryInfo['deceasedName'];
                $deceasedSurname = $mortuaryInfo['deceasedSurname'];
    
                $response = vivoRecuerdoLogin($clientKey, $secretKey);
                $token = null;
                if($response['status']){
                    $dataResponse = json_decode($response['data']);
                    if(isset($dataResponse->token)){
                        $token = $dataResponse->token;
                    }
                }
                
                if($token == null){
                    return false;
                }
    
                $response = vivoRecuerdoGet($token);
                if($response['status'] === false){
                    return false;
                }
                $response['data'] = json_decode($response['data']);
    
                $urlQR = null;
                foreach($response['data'] as $elem){
                    if(mb_strtolower($elem->nombre) == mb_strtolower($deceasedName) && mb_strtolower($elem->apellidos) == mb_strtolower($deceasedSurname)){
                        $urlQR = $elem->url_corta;
                        break;
                    }
                }
    
                return $urlQR == null ? false : $urlQR;
            }else{
                return false;
            }
        }
    }

    /**
     * Log in Vivo Recuerdo
     * 
     * @param string $clientKey Client key
     * @param string $secretKey Secret key
     * @return array JWT
     */
    function vivoRecuerdoLogin($clientKey, $secretKey){
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.vivorecuerdo.es/v1/login",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => '{"client_key":"' . $clientKey . '", "secret_key": "' . $secretKey . '"}',
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if($err){
            return array('status' => false, 'data' => $err);
        }else{
            return array('status' => true, 'data' => $response);
        }
    }

    /**
     * Get "velatorios" in Vivo Recuerdo
     * 
     * @param string $token Token
     * @return array
     */
    function vivoRecuerdoGet($token){
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.vivorecuerdo.es/v1/velatorios",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Authorization: Bearer $token",
                "Content-Type: application/json"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if($err){
            return array('status' => false, 'data' => $err);
        }else{
            return array('status' => true, 'data' => $response);
        }
    }

    /**
     * Cleans a string
     * 
     * @param string $string String
     * @param string $dbName Database name
     * @return string
     */
    function cleanStr($string, $dbName){
        $db = new DbHandler(true, $dbName);

        return addslashes(trim(htmlspecialchars(mysqli_real_escape_string($db->getConnection(), strip_tags($string)))));
    }
?>