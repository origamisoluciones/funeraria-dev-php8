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

    if(empty($_POST)){
        http_response_code(405);
        return;
    }

    define('JWT_KEY', 'Api-fun.21#');

    require_once($_SESSION['basePath'] . "resources/plugins/jwt/JWT.php");
    require_once($_SESSION['basePath'] . "resources/plugins/jwt/SignatureInvalidException.php");
    require_once($_SESSION['basePath'] . "resources/plugins/jwt/BeforeValidException.php");
    require_once($_SESSION['basePath'] . "resources/plugins/jwt/ExpiredException.php");
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");

    use \Firebase\JWT\JWT;
    use \Firebase\JWT\SignatureInvalidException;
    use \Firebase\JWT\BeforeValidException;
    use \Firebase\JWT\ExpiredException;

    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/expedients.php");
    require_once($_SESSION['basePath'] . "model/expedientsPolls.php");
    require_once($_SESSION['basePath'] . "model/smsUp.php");
    require_once($_SESSION['basePath'] . "model/settings.php");

    $expedients = new Expedients();
    $expedientsPolls = new ExpedientsPolls();
    $smsUp = new SmsUp();
    $settings = new Settings();
    $utils = new Utils();

    $data = array();
    foreach($_POST as $name => $value){
        $aux = array($name => cleanStr($value));
        $data = array_merge($data, $aux);
    }

    if(!$expedients->updateExpedientSurvey($data)){
        $logs = new Logs;
        $logs->createSimple("Expedientes", "C.Servicio - Enviar encuesta", "'Error! No ha podido enviar la encuesta'");

        echo json_encode(array(false));
    }else{

        $phones = $expedientsPolls->getPhonesNotSendedByExpedient($data);

        if(count($phones) == 0){
            $logs = new Logs;
            $logs->createSimple("Expedientes", "C.Servicio - Enviar encuesta", "'No existen teléfonos pendientes de enviar la encuesta'");

            echo json_encode(array(false));
        }else{
            $smsBalance = $smsUp->getBalance();
            if($smsBalance->status == 'ok'){
                $balance = intval($smsBalance->result->balance);
                if($balance < count($phones)){
                    $logs = new Logs;
                    $logs->createSimple("Expedientes", "C.Servicio - Enviar encuesta", "'Ha ocurrido un error al enviar la encuesta (no se ha podido obtener el saldo pendiente)'");

                    echo json_encode(array('noBalance', $balance, count($phones)));
                }else{

                    $currentSession = $_SESSION['company'];
                    $_SESSION['company'] = '0';
            
                    require_once($_SESSION['basePath'] . "model/companies.php");
                    $companies = new Companies;
                    $smsResponse = $companies->getSmsUp($currentSession);
            
                    $_SESSION['company'] = $currentSession;
            
                    if($smsResponse == null || $smsResponse['sms_api_key'] == null){
                        return false;
                    }
                    $smsApiKey = $smsResponse['sms_api_key'];

                    $companyName = $settings->getCompanyName();
                   
                    $from = 'Gesmemori'; // Máximo 11 caracteres
                    $text = 'Valore nuestros servicios a través de la siguiente encuesta {LINK}'; // Máximo 160 caracteres
                    switch(intval($_SESSION['company'])){
                        case 1:
                            $from = 'PPFFA';
                            $text = 'En Pompas Funebres de Arosa nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 2:
                            $from = 'Fun. Golpe';
                            $text = 'En Funeraria Golpe nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 3:
                            $from = 'Origami Sol';
                            $text = 'En Origami Soluciones nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 4:
                            $from = 'Garrido';
                            $text = 'En Funeraria Garrido nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 5:
                            $from = 'San Antonio';
                            $text = 'En Funeraria San Antonio nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 6:
                            $from = 'Fun. Miñor';
                            $text = 'En Pompas Fúnebres del Miñor nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 7:
                            $from = 'Fun. Abrisa';
                            $text = 'En Funeraria Abrisa nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 8:
                            $from = 'Gesmemori';
                            $text = 'En Gesmemori nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 9:
                            $from = 'Fun Colodro';
                            $text = 'En Funeraria Colodro nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 10:
                            $from = 'Barbanza';
                            $text = 'En Servicios Fun. do Barbanza nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 11:
                            $from = 'PPFFI';
                            $text = 'En Pompas Funebres Ibiza nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 12:
                            $from = 'San Marcos';
                            $text = 'En San Marcos nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 13:
                            $from = 'Sra Prado';
                            $text = 'En Ntra Sra del Prado nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 14:
                            $from = 'Valdepeñas';
                            $text = 'En Servicios Fun. Valdepeñas nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 15:
                            $from = 'Oliver';
                            $text = 'En Servicios Fun. Oliver nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 16:
                            $from = 'San Juan';
                            $text = 'En Funeraria Gerardo San Juan nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 17:
                            $from = 'La Estrella';
                            $text = 'En Tanatorio La Estrella nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 18:
                            $from = 'Esp. Funer.';
                            $text = 'En Espacio Funerario nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 19:
                            $from = 'Glez. Avila';
                            $text = 'En González Ávila nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 20:
                            $from = 'Santa Tegra';
                            $text = 'En Santa Tegra nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 21:
                            $from = 'Fun. Bahía';
                            $text = 'En Funeraria Bahía nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 22:
                            $from = 'San José';
                            $text = 'En Funeraria San José nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 23:
                            $from = 'Valderrama';
                            $text = 'En Funeraria Valderrama nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 24:
                            $from = 'Iglesias';
                            $text = 'En el Grupo Iglesias nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 25:
                            $from = 'Occidente';
                            $text = 'En Funeraria del Occidente nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 26:
                            $from = 'AndresyForn';
                            $text = 'En Andrés y Forner nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 27:
                            $from = 'Fun. ICOD';
                            $text = 'En Funeraria ICOD nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 28:
                            $from = 'Fun. Mtnez';
                            $text = 'En Funeraria Martínez nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 29:
                            $from = 'MEC';
                            $text = 'En MEC Servicios Funerarios nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 30:
                            $from = 'Fun. Jávea';
                            $text = 'En Funeraria Jávea nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 31:
                            $from = 'Cardelle';
                            $text = 'En Servicios Fun. Cardelle nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                        case 32:
                            $from = 'Fun Mariña';
                            $text = 'En Funerarias Mariña nos preocupa la satisfaccion de nuestros clientes, por ello agradecemos que conteste a la siguiente encuesta {LINK}';
                        break;
                    }
                    $messages = '';
                    foreach($phones as $phone){

                        $payload = array(
                            'company' => $_SESSION['company'],
                            'expedient' => $phone['expedient'],
                            'survey' => $phone['survey'],
                            'expedient_poll' => $phone['ID']
                        );
                        $jwt = JWT::encode($payload, JWT_KEY);
                        // var_dump($jwt);
                        // try{
                        //     JWT::$leeway = 60;
                        //     $decoded = JWT::decode($jwt, JWT_KEY, array('HS256'));
                        // }catch(Exception $e){
                        //     $decoded = null;
                        // }

                        $messages = '{
                            "from": "'.$from.'",
                            "to": "34'.$phone['phone'].'",
                            "text": "'.$text.'",
                            "send_at":"'.date('Y-m-d H:i:s', time()+5).'",
                            "custom": "'.$phone['ID'].'"
                        }';

                        // Send sms
                        // Get api request for sms check
                        $curl = curl_init();
                        $headers = array(
                            'Content-Type: application/json',
                            'Accept: application/json'
                        );
                        $data = '{
                            "api_key": "' . $smsApiKey . '",
                            "report_url": "' . $utils->getRoute() . 'core/tools/smsup/sendSms' . $_SESSION['company'] . '.php",
                            "link":"https://pompasfunebres.digital/'.$jwt.'",
                            "messages": [' . $messages . ']
                        }';
                        curl_setopt_array($curl, array(
                            CURLOPT_URL => "https://api.gateway360.com/api/3.0/sms/send-link",
                            CURLOPT_RETURNTRANSFER => true,
                            CURLOPT_CUSTOMREQUEST => 'POST',
                            CURLOPT_HTTPHEADER => $headers,
                            CURLOPT_POSTFIELDS => $data
                        ));
                        
                        $response = curl_exec($curl);
                        $err = curl_error($curl);

                        curl_close($curl);
                        
                        $response = json_decode($response);
                        if($response->status == 'ok'){
                            $expedientsPolls->updateStatus($phone['ID'], 1);
                        }else{
                            $logs = new Logs;
                            $logs->createSimple("Expedientes", "C.Servicio - Enviar encuesta", "'Error al enviar la encuesta al teléfono ". $phone['phone']);
                        }
                    }

                    $logs = new Logs;
                    $logs->createSimple("Expedientes", "C.Servicio - Enviar encuesta", "'La encuesta se ha enviado'");
            
                    echo json_encode(array(true));
                }
            }else{
                $logs = new Logs;
                $logs->createSimple("Expedientes", "C.Servicio - Enviar encuesta", "'Ha ocurrido un error al enviar la encuesta (no se ha podido obtener el saldo pendiente)'");

                echo json_encode(array(false));
            }
        }
    }
?>