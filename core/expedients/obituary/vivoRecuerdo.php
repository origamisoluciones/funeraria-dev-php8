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

    require_once($_SESSION['basePath'] . "model/mortuaries.php");
    $mortuaries = new Mortuaries();
    $checkCredentials = $mortuaries->checkVivaRecuerdoApiKeys($_POST['expedient']);
    $clientKey = $checkCredentials[0]['api_client'];
    $secretKey = $checkCredentials[0]['api_key'];

    $response = login();
    $token = null;
    if($response['status']){
        $token = json_decode($response['data']);
    }

    if($token == null){
        echo json_encode('token');
        return;
    }

    // Get active velatorios
    $response = get();
    $response['data'] = json_decode($response['data']);
   
    $expedient = $_POST['expedient'];
    require_once($_SESSION['basePath'] . "model/expedients.php");
    $expedients = new Expedients;
    $expedientInfo = $expedients->getDeceasedInfo($expedient);
    $deceasedName = $expedientInfo[0]['deceasedName'];
    $deceasedSurname = $expedientInfo[0]['deceasedSurname'];

    $urlQR = null;
    $vivoRecuerdoID = null;
    foreach($response['data'] as $elem){
        if(mb_strtolower($elem->nombre) == mb_strtolower($deceasedName) && mb_strtolower($elem->apellidos) == mb_strtolower($deceasedSurname)){
            $urlQR = $elem->url_corta;
            $vivoRecuerdoID = $elem->id;
        }
    }

    if($vivoRecuerdoID != null){
        $type = $_POST['type'];
        $model = $_POST['model'];

        $qr = getQR($vivoRecuerdoID);
        $imageName = 'image_'.$_POST['contImages'];
        $file = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/obituary/' . $type . '/' . $model . '/img/' . $imageName . '.png', 'w');
        fwrite($file, $qr['data']);
        fclose($file);

        $response = array($urlQR, 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/obituary/' . $type . '/' . $model . '/img/' . $imageName . '.png');
        echo json_encode($response);
    }else{
        echo json_encode(false);
    }

    /**
     * Log in Vivo Recuerdo
     * 
     * @return array JWT
     */
    function login(){
        global $clientKey;
        global $secretKey;

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
     * Get "velatorios"
     * 
     * @return array
     */
    function get(){
        global $clientKey;
        global $secretKey;
        global $token;

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.vivorecuerdo.es/v1/velatorios",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Authorization: Bearer $token->token",
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
     * Get velatorio qr
     * 
     * @return array
     */
    function getQR($id){
        global $clientKey;
        global $secretKey;
        global $token;

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.vivorecuerdo.es/v1/velatorios/$id/qr",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Authorization: Bearer $token->token",
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
?>