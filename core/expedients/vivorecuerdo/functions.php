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

    if(isset($_POST['type'])){
        switch($_POST['type']){
            case 'get':
                $response = get();
                $response['data'] = json_decode($response['data']);
                echo json_encode($response);
            break;
            case 'create':
                echo json_encode(create($_POST));
            break;
            case 'update':
                echo json_encode(update($_POST['expedient']));
            break;
            case 'delete':
                echo json_encode(delete($_POST['expedient']));
            break;
        }
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
     * Creates a panel
     * 
     * @param int $expedient Expedient
     * @return array
     */
    function create($expedientData){
        global $clientKey;
        global $secretKey;
        global $token;

        if($expedientData['deceasedDate'] == null || $expedientData['deceasedDate'] == ''){
            return array('status' => false, 'data' => 'Falta la fecha de fallecimiento');
        }else{
            $deceasedDate = $expedientData['deceasedDate'];
        }
        if($expedientData['deceasedLocation'] == null || $expedientData['deceasedLocation'] == ''){
            return array('status' => false, 'data' => 'Falta la localidad de fallecimiento');
        }else{
            $deceasedLocation = $expedientData['deceasedLocation'];
        }
        if($expedientData['deceasedName'] == null || $expedientData['deceasedName'] == ''){
            return array('status' => false, 'data' => 'Falta el nombre del difunto');
        }else{
            $deceasedName = $expedientData['deceasedName'];
        }
        if($expedientData['deceasedSurname'] == null || $expedientData['deceasedSurname'] == ''){
            return array('status' => false, 'data' => 'Faltan los apellidos del difunto');
        }else{
            $deceasedSurname = $expedientData['deceasedSurname'];
        }
        $extraText = $expedientData['extraText'] == null || $expedientData['extraText'] == '' ? 'null' : '"' . $expedientData['extraText'] . '"';
        if($expedientData['deceasedBirthday'] == null || $expedientData['deceasedBirthday'] == ''){
            return array('status' => false, 'data' => 'Falta la fecha de nacimiento del difunto');
        }else{
            $deceasedBirthday = $expedientData['deceasedBirthday'];
        }
        if($expedientData['deceasedBirthdayLocationName'] == null ||$expedientData['deceasedBirthdayLocationName'] == ''){
            return array('status' => false, 'data' => 'Falta el lugar de nacimiento del difunto');
        }else{
            $deceasedBirthdayLocationName = $expedientData['deceasedBirthdayLocationName'];
        }
        if($expedientData['deceasedBirthdayLocationProvince'] == null || $expedientData['deceasedBirthdayLocationProvince'] == ''){
            return array('status' => false, 'data' => 'Falta la provincia de nacimiento del difunto');
        }else{
            $deceasedBirthdayLocationProvince = $expedientData['deceasedBirthdayLocationProvince'];
        }
        if($expedientData['funeralDate'] == null || $expedientData['funeralDate'] == ''){
            $expedientData['funeralDate'] = 'null';
        }else{
            $funeralDate = '"' . $expedientData['funeralDate'] . '"';
        }
        $churchName = $expedientData['churchName'] == null || $expedientData['churchName'] == '' ? 'null' : '"' . $expedientData['churchName']. '"';
        $churchLocationName = $expedientData['churchLocationName'] == null || $expedientData['churchLocationName'] == '' ? 'null' : '"' . $expedientData['churchLocationName'] . '"';
        $funeralTime = $expedientData['funeralTime'] == null || $expedientData['funeralTime'] == '' ? 'null' : '"' . $expedientData['funeralTime'] . '"';
        if($expedientData['destination'] == 'cementerio'){
            $destination = 'cementerio';
            $destinationLabel = 'Cementerio ';
        }else{
            $destination = 'crematorio';
            $destinationLabel = 'Crematorio ';
        }
        $destinationName = $expedientData['destinationName'] == '' ? 'null' : '"'. $expedientData['destinationName'] . '"';
        
        $destinationLocation = $expedientData['destinationLocation'] == '' ? 'null' : '"' . $expedientData['destinationLocation'] . '"';
        if($expedientData['deceasedRoom'] == null || $expedientData['deceasedRoom'] == ''){
            return array('status' => false, 'data' => 'Falta la sala');
        }else{   
            $deceasedRoom = $expedientData['deceasedRoom'];
        }
        if($expedientData['phone1'] == null || $expedientData['phone1'] == ''){
            return array('status' => false, 'data' => 'Falta el teléfono del familiar contacto');
        }else{
            $phone1 = $expedientData['phone1'];
        }
        $phone2 = $expedientData['phone2'] == null || $expedientData['phone2'] == '' ? 'null' : '"' . $expedientData['phone2'] . '"';
        $phone3 = $expedientData['phone3'] == null || $expedientData['phone3'] == '' ? 'null' : '"' . $expedientData['phone3'] . '"';
        $phone4 = $expedientData['phone4'] == null || $expedientData['phone4'] == '' ? 'null' : '"' . $expedientData['phone4'] . '"';
        $phone5 = $expedientData['phone5'] == null || $expedientData['phone5'] == '' ? 'null' : '"' . $expedientData['phone5'] . '"';

        $data = '{
            "fecha_defuncion": "' . $deceasedDate . '",
            "localidad": "' . $deceasedLocation . '",
            "nombre": "' . $deceasedName . '",
            "apellidos": "' . $deceasedSurname . '",
            "sobrenombre": ' . $extraText . ',
            "fecha_nacimiento": "' . $deceasedBirthday . '",
            "lugar_nacimiento": "' . $deceasedBirthdayLocationName . '",
            "provincia_pais_nacimiento": "' . $deceasedBirthdayLocationProvince . '",
            "fecha_ceremonia": ' . $funeralDate . ',
            "lugar_ceremonia": ' . $churchName . ',
            "poblacion_ceremonia": ' . $churchLocationName . ',
            "hora_ceremonia": ' . $funeralTime . ',
            "cementerio_crematorio": "' . $destination . '",
            "poblacion_cementerio_crematorio": ' . $destinationLocation . ',
            "nombre_sala": "Sala ' . $deceasedRoom . '",
            "nombre_opcional_cementerio_crematorio": ' . $destinationName . ',
            "idioma_velatorio": "es_ES",
            "tlf_admin_1": "' . $phone1 . '",
            "tlf_admin_2": ' . $phone2 . ',
            "tlf_admin_3": ' . $phone3 . ',
            "tlf_admin_4": ' . $phone4 . ',
            "tlf_admin_5": ' . $phone5;

        $data .= '}';

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.vivorecuerdo.es/v1/velatorios",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $data,
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
     * Updates data
     * 
     * @param int $expedient Expedient
     * @return array
     */
    function update($expedient){
        global $clientKey;
        global $secretKey;
        global $token;

        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;

        $expedientData = $expedients->getDataApiPanel($expedient);
        if($expedientData == null){
            return array('status' => false, 'data' => $expedientData);
        }else{
            $deceasedDate = $expedientData[0]['deceasedDate'] == null ? '' : $expedientData[0]['deceasedDate'];
            if($expedientData[0]['deceasedDate'] != null){
                $aux = explode('-', $expedientData[0]['deceasedDate']);
                $deceasedDate = "{$aux[2]}/{$aux[1]}/{$aux[0]}";
            }
            $deceasedLocation = $expedientData[0]['deceasedLocation'] == null ? '' : $expedientData[0]['deceasedLocation'];
            $deceasedName = $expedientData[0]['deceasedName'];
            $deceasedSurname = $expedientData[0]['deceasedSurname'];
            $extraText = $expedientData[0]['extraText'];
            $deceasedBirthday = $expedientData[0]['deceasedBirthday'] == null ? '' : $expedientData[0]['deceasedBirthday'];
            if($expedientData[0]['deceasedBirthday'] != null){
                $aux = explode('-', $expedientData[0]['deceasedBirthday']);
                $deceasedBirthday = "{$aux[2]}/{$aux[1]}/{$aux[0]}";
            }
            $deceasedBirthdayLocationName = $expedientData[0]['deceasedBirthdayLocationName'] == null ? '' : $expedientData[0]['deceasedBirthdayLocationName'];
            $deceasedBirthdayLocationProvince = $expedientData[0]['deceasedBirthdayLocationProvince'] == null ? '' : $expedientData[0]['deceasedBirthdayLocationProvince'];
            $funeralDate = $expedientData[0]['funeralDate'] == null ? '' : $expedientData[0]['funeralDate'];
            if($expedientData[0]['funeralDate'] != null){
                $aux = explode('-', $expedientData[0]['funeralDate']);
                $funeralDate = "{$aux[2]}/{$aux[1]}/{$aux[0]}";
            }
            $churchName = $expedientData[0]['churchName'] == null ? '' : $expedientData[0]['churchName'];
            $churchLocationName = $expedientData[0]['churchLocationName'] == null ? '' : $expedientData[0]['churchLocationName'];
            $funeralTime = $expedientData[0]['funeralTime'] == null ? '' : substr($expedientData[0]['funeralTime'], 0, -3);
            if($expedientData[0]['cremation'] == 0){
                $destination = 'cementerio';
                $destinationName = $expedientData[0]['cemeteryName'] == null ? '' : $expedientData[0]['cemeteryName'];
                $destinationLocation = $expedientData[0]['cemeteryLocationName'] == null ? '' : $expedientData[0]['cemeteryLocationName'];
            }else{
                $destination = 'crematorio';
                $destinationName = $expedientData[0]['cemeteryName'] == null ? '' : $expedientData[0]['cemeteryName'];
                $destinationLocation = $expedientData[0]['crematoriumLocationName'] == null ? '' : $expedientData[0]['crematoriumLocationName'];
            }
            $deceasedRoom = $expedientData[0]['deceasedRoom'];
            $phone1 = $expedientData[0]['familyContactPhone'];
            $phone2 = $expedientData[0]['familyContactMobilePhone'];

            if($deceasedDate == ''){
                return array('status' => false, 'data' => 'Falta la fecha de fallecimiento');
            }
            if($deceasedLocation == ''){
                return array('status' => false, 'data' => 'Falta la localidad de fallecimiento');
            }
            if($deceasedName == ''){
                return array('status' => false, 'data' => 'Falta el nombre del difunto');
            }
            if($deceasedSurname == ''){
                return array('status' => false, 'data' => 'Faltan los apellidos del difunto');
            }
            if($funeralDate == ''){
                return array('status' => false, 'data' => 'Falta la fecha de la ceremonia');
            }
            if($churchName == ''){
                return array('status' => false, 'data' => 'Falta el lugar de la ceremonia (iglesia)');
            }
            if($churchLocationName == ''){
                return array('status' => false, 'data' => 'Falta la población de la ceremonia (iglesia)');
            }
            if($funeralTime == ''){
                return array('status' => false, 'data' => 'Falta la hora de la ceremonia');
            }
            if($destinationLocation == ''){
                return array('status' => false, 'data' => 'Falta la población del cementerio o crematorio');
            }
            if($deceasedRoom == ''){
                return array('status' => false, 'data' => 'Falta la sala');
            }
            if($phone1 == ''){
                return array('status' => false, 'data' => 'Falta el teléfono fijo del familiar de contacto');
            }
            if($phone2 == ''){
                return array('status' => false, 'data' => 'Falta el teléfono móvil del familiar de contacto');
            }
            if($phone1 == $phone2){
                return array('status' => false, 'data' => 'Los teléfonos del familiar de contacto tienen que ser diferentes');
            }

            $data = '{
                "fecha_defuncion": "' . $deceasedDate . '",
                "localidad": "' . $deceasedLocation . '",
                "nombre": "' . $deceasedName . '",
                "apellidos": "' . $deceasedSurname . '",
                "fecha_nacimiento": "' . $deceasedBirthday . '",
                "lugar_nacimiento": "' . $deceasedBirthdayLocationName . '",
                "provincia_pais_nacimiento": "' . $deceasedBirthdayLocationProvince . '",
                "fecha_ceremonia": "' . $funeralDate . '",
                "lugar_ceremonia": "' . $churchName . '",
                "poblacion_ceremonia": "' . $churchLocationName . '",
                "hora_ceremonia": "' . $funeralTime . '",
                "cementerio_crematorio": "' . $destination . '",
                "poblacion_cementerio_crematorio": "' . $destinationLocation . '",
                "nombre_sala": "Sala ' . $deceasedRoom . '",
                "idioma_velatorio": "es_ES",
                "tlf_admin_1": "' . $phone1 . '",
                "tlf_admin_2": "' . $phone2 . '",';

            if($extraText != ''){
                $data .= '"sobrenombre": "' . $extraText . '"';
                if($destinationName != ''){
                    $data .= ',"nombre_opcional_cementerio_crematorio": "' . $destinationName . '"';
                }
            }else{
                if($destinationName != ''){
                    $data .= '"nombre_opcional_cementerio_crematorio": "' . $destinationName . '"';
                }
            }

            $data .= '}';
                    
            $curl = curl_init();
    
            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://api.vivorecuerdo.es/v1/velatorios/$id",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => "PUT",
                CURLOPT_POSTFIELDS => $data,
                CURLOPT_HTTPHEADER => array(
                    "Authorization: Bearer $token->token"
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
    }

    /**
     * Delete velatorio
     * 
     * @param int $expedient Expedient
     * @return array
     */
    function delete(){
        global $clientKey;
        global $secretKey;
        global $token;

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.vivorecuerdo.es/v1/velatorios/$id",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => "DELETE",
            CURLOPT_HTTPHEADER => array(
                "Authorization: Bearer $token->token"
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