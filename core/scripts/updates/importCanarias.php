<?php
    
    return;

    $_SERVER['DOCUMENT_ROOT'] = "/var/www/html/";
    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'];
    }
    
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "model/expedients.php");

    $_SESSION['company'] = 27;
    
    /** Import mortuaries ------- COMPROBAR SI YA EXISTEN SE METEN A MANO */
    // importMortuaries();

    /** Import vehicles ------- COMPROBAR SI YA EXISTEN SE METEN A MANO */
    // importVehicles();
   
    /** Import suppliers ------- COMPROBAR SI YA EXISTEN SE METEN A MANO 
     * 
     * CREAR PRIMERO SIN PROVEEDOR
    */
    importSuppliers();

    /** Import clients */
    // importClients();

    /** Import expedient */
    // importExpedientes();

    /** Import expedient info */
    // updateExpedientesDatos();

    /** Prepare Locations and Deceased In */
    // prepareLocationsAndDeceasedIn();

    /** Import expedient info 2 */
    // updateExpedientesDifuntos();
    
    /** Update expedient info 3 */
    // updateExpedientAssociates();

    /** Add documents to expedients */
    // addDocuments();

    /** 
        UPDATE `Locations` SET postalCode = null WHERE postalCode = 'NULL'
        DELETE FROM `Locations` WHERE name = '';
        UPDATE `Locations` SET postalCode = null WHERE postalCode = 'null' 
    */

    function importMortuaries(){
        $db = new DbHandler;

        $mortuariesList = [];
        array_push($mortuariesList, [1, 'Tanatorio 1', null]);
        array_push($mortuariesList, [2, 'Tanatorio 2', null]);
        array_push($mortuariesList, [3, 'Casa Particular', null]);
        array_push($mortuariesList, [4, 'Otro', null]);
        array_push($mortuariesList, [5, 'SAN FERNANDO', null]);
        array_push($mortuariesList, [6, 'LA VEGA', null]);
        array_push($mortuariesList, [7, 'EL TANQUE', null]);
        array_push($mortuariesList, [8, 'GARACHICO', null]);
        array_push($mortuariesList, [9, 'LA CALETA', null]);
        array_push($mortuariesList, [10, 'LA CULATA', null]);
        array_push($mortuariesList, [11, 'SANTO DOMINGO', null]);
        array_push($mortuariesList, [12, 'LA GUANCHA', null]);
        array_push($mortuariesList, [13, 'LOS SILOS', null]);
        array_push($mortuariesList, [14, 'CEMENTERIO ICOD', null]);
        array_push($mortuariesList, [15, 'GENOVES', null]);
        array_push($mortuariesList, [16, 'RUIGOMEZ', null]);
        array_push($mortuariesList, [17, 'ERJOS', null]);
        array_push($mortuariesList, [18, 'LA MONTAÑETA', null]);
        array_push($mortuariesList, [19, 'EL PIAR LOS REALEJOS', null]);
        array_push($mortuariesList, [20, 'LA CRUZ DEL CAMINO', null]);
        array_push($mortuariesList, [21, 'SANTIAGO DEL TEIDE', null]);
        array_push($mortuariesList, [22, 'CRIPTA DE LA VEGA', null]);
        array_push($mortuariesList, [23, 'SAN JUAN DE LA RAMBLA', null]);
        array_push($mortuariesList, [24, 'SAN JOSE', null]);
        array_push($mortuariesList, [25, 'CRIPTA LAS CANALES', null]);
        array_push($mortuariesList, [26, 'TANATORIO SAN JODE DE LOS LLANOS', null]);
        array_push($mortuariesList, [27, 'CRIPTA LA CUESTA (Bº LA CANDELARIA)', null]);
        array_push($mortuariesList, [28, 'SANTA LASTENIA', '922620311']);

        foreach($mortuariesList as $item){

            $mortuaryId = $item[0];
            $mortuaryName = "'".$item[1] . "'";
            if($item[2] == null){
                $mortuaryPhone = 'null';
            }else{
                $mortuaryPhone = "'".$item[2] . "'";
            }

            // Calculate extraID
            $result = $db->query("  SELECT  MAX(mortuaryID) as id
                                    FROM    Mortuaries");
            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 8);
            $extraID .= ($maxID+1);

            $res = $db->query(" 
                INSERT INTO Mortuaries(mortuaryID , name, phones, extraID) VALUES($mortuaryId, " . $mortuaryName . ", " . $mortuaryPhone . ", '" . $extraID . "')"
            );
    
            if(!$res){
                var_dump('ERROR - id_mortuary: ' . $mortuaryId);
    
                var_dump("INSERT INTO Mortuaries(mortuaryID , name, phones, extraID) VALUES($mortuaryId, " . $mortuaryName . ", " . $mortuaryPhone . ", '" . $extraID . "')");
            }
        }
    }

    function importVehicles(){
        $db = new DbHandler;

        $vehiclesList = [];
        array_push($vehiclesList, [1, '4507BD', 'Mercedes']);
        array_push($vehiclesList, [2, '0590AU', 'Mercedes']);
        array_push($vehiclesList, [3, '2357CPK', 'Mercedes']);
        array_push($vehiclesList, [4, 'FTN', 'Furgon']);
        array_push($vehiclesList, [5, '5803 DHL', 'Mercedes']);
        array_push($vehiclesList, [6, '7222FFT', 'Mercedes']);

        foreach($vehiclesList as $item){

            $carId = $item[0];
            $carLicensePlate = "'".$item[1] . "'";
            $carBrand = "'".$item[2] . "'";

            // Calculate extraID
            $result = $db->query("  SELECT  MAX(ID) as id
                                    FROM    Cars");
            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 8);
            $extraID .= ($maxID+1);

            $res = $db->query(" 
                INSERT INTO Cars(ID, licensePlate, brand, extraID) VALUES($carId, " . $carLicensePlate . ", " . $carBrand . ", '" . $extraID . "')"
            );
    
            if(!$res){
                var_dump('ERROR - id_car: ' . $carId);
    
                var_dump("INSERT INTO Cars(ID, licensePlate, brand, extraID) VALUES($carId, " . $carLicensePlate . ", " . $carBrand . ", '" . $extraID . "')");
            }
        }
    }

    function importSuppliers(){
        $db = new DbHandler;

        $suppliersList = [];
        array_push($suppliersList, [null, 'Floristería Katuxa']);
        array_push($suppliersList, [null, 'Floristería Lola']);
        array_push($suppliersList, [null, 'Pereira Autobuses']);
        array_push($suppliersList, [null, 'Faro de Vigo']);
        array_push($suppliersList, [null, 'El Correo Gallego']);
        array_push($suppliersList, ['A15000649', 'La Voz de Galicia,SA']);
        array_push($suppliersList, [null, 'Diario de Arousa']);
        array_push($suppliersList, [null, 'El Mundo']);
        array_push($suppliersList, [null, 'ABC Prensa']);
        array_push($suppliersList, [null, 'Ataúdes Carlos Pinal']);
        array_push($suppliersList, ['B46263745', 'ARTICULOS FUNERARIOS RAMÓN CHAO, SL']);
        array_push($suppliersList, ['B36025765', 'Tanatorio de Arosa']);
        array_push($suppliersList, [null, 'Tanatorio del Salnés']);
        array_push($suppliersList, [null, 'Tanatorio de Catoira']);
        array_push($suppliersList, [null, 'Radio Arosa']);
        array_push($suppliersList, [null, 'Taxi Radio Taxi']);
        array_push($suppliersList, [null, 'mi proveedor']);
        array_push($suppliersList, [null, 'Encuadernaciones Quatro']);
        array_push($suppliersList, [null, 'Arosa Bus s.l. (Nuñez Barros)']);
        array_push($suppliersList, [null, 'Diario de Arousa']);
        array_push($suppliersList, [null, 'Diario de Pontevedra']);
        array_push($suppliersList, [null, 'Diario La Región']);
        array_push($suppliersList, [null, 'Diario El Progreso']);
        array_push($suppliersList, [null, 'Taxi Francisco Vieites']);
        array_push($suppliersList, [null, 'Taxi Juan José Catoira']);
        array_push($suppliersList, [null, 'Taxi Manuel Paz Carballo']);
        array_push($suppliersList, [null, 'Taxi José Luis Cores Otero']);
        array_push($suppliersList, [null, 'Coros y Organistas']);
        array_push($suppliersList, [null, 'Tanatorio de Boiro']);
        array_push($suppliersList, [null, 'Empresa Flora']);
        array_push($suppliersList, ['B70232970', 'FLORES DANS, S.L.']);
        array_push($suppliersList, ['B15162068', 'Editorial la capital,sl. - Ideal Gallego']);
        array_push($suppliersList, ['A32024507', 'ATAUDES JANEIRO Y CIA S.A.']);
        array_push($suppliersList, ['B32412801', 'GRUPO ATAÚDES GALLEGO,SL']);
        array_push($suppliersList, ['B70144704', 'ARCAS ARGALYA,S.L.']);
        array_push($suppliersList, ['B-3836530', 'Ataudes Canarias']);
        array_push($suppliersList, ['F46025979', 'COOPERATIVA OBRERA SAN JOSE']);
        array_push($suppliersList, [null, 'Autocares Gilsanz']);
        array_push($suppliersList, [null, 'Autocares Vazquez']);
        array_push($suppliersList, ['A11001450', 'Servicios Especiales, s.a. - SERVISA']);
        array_push($suppliersList, ['32441927J', 'PAPELERIA LIBRERIA - JERONIMO GONZALEZ VAZQUEZ']);
        array_push($suppliersList, ['B97177646', 'NOVARCAS, SL.']);
        array_push($suppliersList, ['B36422202', 'CONFECCIONES CAL PEP, SL.']);
        array_push($suppliersList, ['B-3807694', 'La Calera']);
        array_push($suppliersList, ['4336143S', 'Funerarte']);
        array_push($suppliersList, ['A-3801162', 'Diarios de Avisos']);
        array_push($suppliersList, ['A38017844', 'El Dia']);
        array_push($suppliersList, ['B98590193', 'Maderarte Innova S.L.']);
        array_push($suppliersList, ['E38807392', 'Floristerias Salena']);

        foreach($suppliersList as $item){

            if($item[0] == null){
                $supplierNif = 'null';
            }else{
                $supplierNif = "'".$item[0] . "'";
            }
            $supplierName = "'".$item[1] . "'";

            // Calculate extraID
            $result = $db->query("  SELECT  MAX(supplierID ) as id
                                    FROM    Suppliers");
            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 8);
            $extraID .= ($maxID+1);

            $res = $db->query(" 
                INSERT INTO Suppliers(nif, name, extraID) VALUES($supplierNif, " . $supplierName . ", '" . $extraID . "')"
            );
    
            if(!$res){
                var_dump('ERROR - supplier_name: ' . $supplierName);
    
                var_dump("INSERT INTO Suppliers(nif, name, extraID) VALUES($supplierNif, " . $supplierName . ", '" . $extraID . "')");
            }
        }
    }

    function importClients(){
        $db = new DbHandler;

        if(($file = fopen("tb_clientes.csv", "r")) !== false){
            while(($line = fgetcsv($file, 1000, ',')) !== false){
                
                if($line[0] != 'id_cliente'){

                    $idCliente = str_replace ('"', "",$line[0]);
                    $idTipo = str_replace ('"', "",$line[1]);
                    $idTarifa = str_replace ('"', "",$line[2]);
                    $nombre = str_replace ('"', "",$line[3]);
                    $apellido1 = str_replace ('"', "",$line[4]);
                    $apellido2 = str_replace ('"', "",$line[5]);
                    $nombreComer = str_replace ('"', "",$line[6]);
                    $dni = str_replace ('"', "",$line[7]);
                    $telefono = str_replace ('"', "",$line[8]);
                    $movil = str_replace ('"', "",$line[9]);
                    $fax = str_replace ('"', "",$line[10]);
                    $email = str_replace ('"', "",$line[11]);
                    $direccion = str_replace ('"', "",$line[12]);
                    $fechaAlta = str_replace ('"', "",$line[13]);
                    $fechaBaja = str_replace ('"', "",$line[14]);

                    //Evaluamos si los campos vienen con un caracter sin codear ('�') (excel los guarda sin codificación) y en ese caso los codeamos
                    if(!preg_match('!!u', $idCliente)){
                        $idCliente = utf8_encode($idCliente);
                    }
                    if(!preg_match('!!u', $idTipo)){
                        $idTipo = utf8_encode($idTipo);
                    }
                    if(!preg_match('!!u', $idTarifa)){
                        $idTarifa = utf8_encode($idTarifa);
                    }
                    if(!preg_match('!!u', $nombre)){
                        $nombre = utf8_encode($nombre);
                    }
                    if(!preg_match('!!u', $apellido1)){
                        $apellido1 = utf8_encode($apellido1);
                    }
                    if(!preg_match('!!u', $apellido2)){
                        $apellido2 = utf8_encode($apellido2);
                    }
                    if(!preg_match('!!u', $nombreComer)){
                        $nombreComer = utf8_encode($nombreComer);
                    }
                    if(!preg_match('!!u', $dni)){
                        $dni = utf8_encode($dni);
                    }
                    if(!preg_match('!!u', $telefono)){
                        $telefono = utf8_encode($telefono);
                    }
                    if(!preg_match('!!u', $movil)){
                        $movil = utf8_encode($movil);
                    }
                    if(!preg_match('!!u', $fax)){
                        $fax = utf8_encode($fax);
                    }
                    if(!preg_match('!!u', $email)){
                        $email = utf8_encode($email);
                    }
                    if(!preg_match('!!u', $direccion)){
                        $direccion = utf8_encode($direccion);
                    }
                    if(!preg_match('!!u', $fechaAlta)){
                        $fechaAlta = utf8_encode($fechaAlta);
                    }
                    if(!preg_match('!!u', $fechaBaja)){
                        $fechaBaja = utf8_encode($fechaBaja);
                    }

                    // Tipo cliente
                    switch($idTipo){
                        case 0:
                        case 1:
                            $clientType = 3;
                            $priceId = 3;
                        break;
                        case 2:
                            $clientType = 1;
                            $priceId = 1;
                        break;
                    }

                    // Apellidos
                    $surname = $apellido1 . ' ' . $apellido2;

                    // Telefonos
                    $phones = '';
                    if(
                        $telefono != null && $telefono != '' && $telefono != 'null' && $telefono != 'NULL' 
                    ){
                        $phones = $telefono;
                    }
                    if(
                        $movil != null && $movil != '' && $movil != 'null' && $movil != 'NULL' 
                    ){
                        if($phones != ''){
                            $phones .= '-' . $movil;
                        }else{
                            $phones .= $movil;
                        }
                    }

                    $createDate = strtotime(str_replace("/", "-", $fechaAlta));
                    $leavingDate = ($fechaBaja != null && $fechaBaja != 'null' && $fechaBaja != 'NULL'  && $fechaBaja != '' ? "'" . str_replace("/", "-", $fechaBaja) . "'": 'null');

                    $res = $db->query(" 
                        INSERT INTO Clients(
                            clientID, type, price, brandName, nif, name, surname, address, mail, 
                            phones, startingDate, leavingDate, nifType) 
                        VALUES($idCliente, " . $clientType . ", " . $priceId . ", '" . $nombreComer . "', '" . $dni . "', 
                            '" . $nombre . "', '" . $surname . "', '" . $direccion . "', '" . $email . "',
                            '" . $phones . "', " . $createDate . ", $leavingDate, '" . 1 . "')"
                    );

                    if(!$res){
                        var_dump('ERROR - id_cliente: ' . $idCliente);

                        var_dump(" 
                            INSERT INTO Clients(
                                clientID, type, price, brandName, nif, name, surname, address, mail, 
                                phones, startingDate, leavingDate, nifType) 
                            VALUES($idCliente, " . $clientType . ", " . $priceId . ", '" . $nombreComer . "', '" . $dni . "', 
                                '" . $nombre . "', '" . $surname . "', '" . $direccion . "', '" . $email . "',
                                '" . $phones . "', " . $createDate . ", $leavingDate, '" . 1 . "')");
                    }
                }
            }
            fclose($file);
        }
    }

    function importExpedientes(){

        $db = new DbHandler;

        if(($file = fopen("tb_expedientes.csv", "r")) !== false){
            while(($line = fgetcsv($file, 1000, ',')) !== false){
                
                if($line[0] != 'id_expediente'){

                    $idExpediente = str_replace ('"', "",$line[0]);
                    $numExpediente = str_replace ('"', "",$line[1]);
                    $numOrder = str_replace ('"', "",$line[2]);
                    $idTipo = str_replace ('"', "",$line[3]);
                    $idExpAsociado = str_replace ('"', "",$line[4]);
                    $idTipoCliente = str_replace ('"', "",$line[5]);
                    $idEstado = str_replace ('"', "",$line[6]);
                    $capital = str_replace ('"', "",$line[7]);
                    $agencia = str_replace ('"', "",$line[8]);
                    $agenciaNum = str_replace ('"', "",$line[9]);
                    $siniestroNum = str_replace ('"', "",$line[10]);
                    $traslado = str_replace ('"', "",$line[11]);
                    $literalesNo = str_replace ('"', "",$line[12]);
                    $polizaNum = str_replace ('"', "",$line[13]);
                    $fechaSolicitud = str_replace ('"', "",$line[14]);
                    $horaSolicitud = str_replace ('"', "",$line[15]);
                    $idCliente = str_replace ('"', "",$line[16]);
                    $fechaAlta = str_replace ('"', "",$line[18]);
                    $fechaBaja = str_replace ('"', "",$line[19]);

                    //Evaluamos si los campos vienen con un caracter sin codear ('�') (excel los guarda sin codificación) y en ese caso los codeamos
                    if(!preg_match('!!u', $idExpediente)){
                        $idExpediente = utf8_encode($idExpediente);
                    }
                    if(!preg_match('!!u', $numExpediente)){
                        $numExpediente = utf8_encode($numExpediente);
                    }
                    if(!preg_match('!!u', $numOrder)){
                        $numOrder = utf8_encode($numOrder);
                    }
                    if(!preg_match('!!u', $idTipo)){
                        $idTipo = utf8_encode($idTipo);
                    }
                    if(!preg_match('!!u', $idExpAsociado)){
                        $idExpAsociado = utf8_encode($idExpAsociado);
                    }
                    if(!preg_match('!!u', $idTipoCliente)){
                        $idTipoCliente = utf8_encode($idTipoCliente);
                    }
                    if(!preg_match('!!u', $idEstado)){
                        $idEstado = utf8_encode($idEstado);
                    }
                    if(!preg_match('!!u', $capital)){
                        $capital = utf8_encode($capital);
                    }
                    if(!preg_match('!!u', $agencia)){
                        $agencia = utf8_encode($agencia);
                    }
                    if(!preg_match('!!u', $agenciaNum)){
                        $agenciaNum = utf8_encode($agenciaNum);
                    }
                    if(!preg_match('!!u', $siniestroNum)){
                        $siniestroNum = utf8_encode($siniestroNum);
                    }
                    if(!preg_match('!!u', $traslado)){
                        $traslado = utf8_encode($traslado);
                    }
                    if(!preg_match('!!u', $literalesNo)){
                        $literalesNo = utf8_encode($literalesNo);
                    }
                    if(!preg_match('!!u', $polizaNum)){
                        $polizaNum = utf8_encode($polizaNum);
                    }
                    if(!preg_match('!!u', $fechaSolicitud)){
                        $fechaSolicitud = utf8_encode($fechaSolicitud);
                    }
                    if(!preg_match('!!u', $horaSolicitud)){
                        $horaSolicitud = utf8_encode($horaSolicitud);
                    }
                    if(!preg_match('!!u', $idCliente)){
                        $idCliente = utf8_encode($idCliente);
                    }
                    if(!preg_match('!!u', $fechaAlta)){
                        $fechaAlta = utf8_encode($fechaAlta);
                    }
                    if(!preg_match('!!u', $fechaBaja)){
                        $fechaBaja = utf8_encode($fechaBaja);
                    }
                    
                    // Tipo cliente
                    switch($idTipoCliente){
                        case 0:
                        case 2:
                            $clientType = 1;
                        break;
                        case 1:
                            $clientType = 3;
                        break;
                    }

                    if($idTipo == 1){ // Defuncion

                        // Letter
                        if($clientType == 1){
                            $expNumLetter = 'P';
                        }else if($clientType == 3){
                            $expNumLetter = 'E';
                        }

                        // Year
                        $expNumYear = explode("/", $numExpediente)[1];

                        // Num secuence
                        $expNumSec = explode("/", $numExpediente)[0];

                        //Calcular el numero de secuencia del expediente para Particulares
                        $result = $db->query("  SELECT  COUNT(expedientID) as total 
                                                FROM    Expedients 
                                                WHERE   leavingDate IS NULL AND
                                                        clientType = 1 AND type = $clientType AND
                                                        entryDate >= '" .  $expNumYear . "-01-01 00:00:00' AND 
                                                        entryDate <= '" . $expNumYear . "-12-31 23:59:59'" );
                        
                        if(mysqli_num_rows($result) > 0){
                            $expNumType = $db->resultToArray($result)[0]['total'] + 1;
                        }else{
                            $expNumType = 1;
                        }

                        $expNumYearPartial = substr($expNumYear, -2);
                        $number = $expNumSec . ' ' . $expNumLetter . $expNumType . '/' . $expNumYearPartial;
                      
                    }else if($idTipo == 2){ // Presupuesto
                        $expNumLetter = 'PR';

                        // Year
                        $expNumYear = explode("/", $numExpediente)[1];

                        // Num secuence
                        $expNumSec = explode(" ", explode("/", $numExpediente)[0])[1];

                        $expNumYearPartial = substr($expNumYear, -2);

                        $expNumType = 0;
                        $number = $expNumLetter . '-' . $expNumSec . '/' . $expNumYearPartial;
                    }else{ // Varios
                        $expNumLetter = 'V';

                        // Year
                        $expNumYear = explode("/", $numExpediente)[1];

                        // Num secuence
                        $expNumSec = explode(" ", explode("/", $numExpediente)[0])[1];

                        $expNumYearPartial = substr($expNumYear, -2);

                        $expNumType = 0;
                        $number = $expNumLetter . '-' . $expNumSec . '/' . $expNumYearPartial;
                    }

                    if($idEstado == 1 || $idEstado == '1'){
                        $idEstado = 2;
                    }
                    $polizaNum = $polizaNum == null || $polizaNum == 'NULL' || $polizaNum == '' ? 'null' : "'" . $polizaNum . "'";
                    $capital = $capital == null || $capital == 'NULL' || $capital == '' ? 'null' : "'" . $capital . "'";
                    $move = $traslado == null || $traslado == 'NULL' || $traslado == '' ? 'null' : "'" . $traslado . "'";
                    $agencia = $agencia == null || $agencia == 'NULL' || $agencia == '' ? 'null' : "'" . $agencia . "'";
                    $agenciaNum = $agenciaNum == null || $agenciaNum == 'NULL' || $agenciaNum == '' ? 'null' : "'" . $agenciaNum . "'";
                    $siniestroNum = $siniestroNum == null || $siniestroNum == 'NULL' || $siniestroNum == '' ? 'null' : "'" . $siniestroNum . "'";

                    // Request date
                    $requestDate = $fechaSolicitud;
                    $requestTime = $horaSolicitud == null || $horaSolicitud == 'NULL' || $horaSolicitud == '' ? '00:00:00' : $horaSolicitud;

                    // Request time
                    $entryDate = str_replace("/", "-", $fechaAlta) . ' 00:00:00';
                    $leavingDate = ($fechaBaja != null && $fechaBaja != 'null'  && $fechaBaja != 'NULL' && $fechaBaja != '' ? "'" .(str_replace("/", "-", $fechaBaja) . "'") : 'null');

                    // Calculate extraID
                    $result = $db->query("  SELECT  MAX(expedientID) as id
                                            FROM    Expedients");
                    $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
                    $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
                    $extraID .= ($maxID+1);

                    $idCliente = $idCliente == 0 ? 'null' : $idCliente;

                    $res = $db->query(" 
                        INSERT INTO Expedients( 
                            expedientID, number, expNumLetter, expNumSecuence, expNumYear, expNumType, type, clientType, status, capital, move, literal, policy, agency, agencyContact, lossNumber,
                            requestDate, requestTime, client, entryDate, leavingDate, extraID)
                        VALUES (
                            $idExpediente, '$number', '$expNumLetter', '$expNumSec',  '$expNumYear', '$expNumType', $idTipo, $clientType, $idEstado, $capital, $move, $literalesNo, $polizaNum, $agencia, $agenciaNum, $siniestroNum,
                            '$requestDate', '$requestTime', $idCliente, '$entryDate', $leavingDate, '$extraID'
                        )"
                    );

                    if(!$res){
                        var_dump('ERROR - id_expediente: ' . $idExpediente);

                        var_dump(" 
                            INSERT INTO Expedients( 
                                expedientID, number, expNumLetter, expNumSecuence, expNumYear, expNumType, type, clientType, status, capital, move, literal, policy, agency, agencyContact, lossNumber,
                                requestDate, requestTime, client, entryDate, leavingDate, extraID)
                            VALUES (
                                $idExpediente, '$number', '$expNumLetter', '$expNumSec',  '$expNumYear', '$expNumType', $idTipo, $clientType, $idEstado, $capital, $move, $literalesNo, $polizaNum, $agencia, $agenciaNum, $siniestroNum,
                                '$requestDate', '$requestTime', $idCliente, '$entryDate', $leavingDate, '$extraID'
                            )
                        ");
                    }else{

                        $result = $db->query("  SELECT  expedientID AS expedient, funeralHomeEntryDate AS fechaInicio, funeralHomeEntryTime AS horaInicio,
                                                        funeralDate AS fechaFin, funeralTime AS horaFin, number
                                                FROM    Expedients
                                                WHERE   extraID = '" . $extraID . "'");
                
                        if(mysqli_num_rows($result) > 0){
                            $expedient = $db->resultToArray($result)[0];

                            $expedientModel = new Expedients;

                            // Create Service
                            if(!$expedientModel->createService($expedient['expedient'])){
                                var_dump("Error create service - Expedient id: " . $idExpediente);
                            }

                            // Creación de la documentación asociada al expediente
                            if(!$expedientModel->createDocs($expedient['expedient'])){
                                var_dump("Error create docs - Expedient id: " . $idExpediente);
                            }

                            // Creación las contrataciones asociadas al expediente en base a los productos existentes (sin checkear)
                            if(!$expedientModel->createHiringsFirst($expedient['expedient'])){
                                var_dump("Error create hirings - Expedient id: " . $idExpediente);
                            }
                        }
                    }
                }
            }

            fclose($file);
        }

    }

    function updateExpedientesDatos(){
        $db = new DbHandler;

        if(($file = fopen("tb_expediente_datos.csv", "r")) !== false){
            while(($line = fgetcsv($file, 1000, ',')) !== false){
                
                if($line[0] != 'id_expediente_dato'){

                    $idExpedienteDatos = str_replace ('"', "",$line[0]);
                    $idExpediente = str_replace ('"', "",$line[1]);
                    $applicantName = str_replace ('"', "",$line[2]);
                    $applicantSurname1 = str_replace ('"', "",$line[3]);
                    $applicantSurname2 = str_replace ('"', "",$line[4]);
                    $applicantNif = str_replace ('"', "",$line[5]);
                    $applicantAddress = str_replace ('"', "",$line[6]);
                    $applicantMail = str_replace ('"', "",$line[7]);
                    $applicantPhone = str_replace ('"', "",$line[8]);
                    $applicantParentesco = str_replace ('"', "",$line[9]);
                    $applicantMobilePhone = str_replace ('"', "",$line[10]);
                    $familyContactName = str_replace ('"', "",$line[11]);
                    $familyContactSurname1 = str_replace ('"', "",$line[12]);
                    $familyContactSurname2 = str_replace ('"', "",$line[13]);
                    $familyContactNif = str_replace ('"', "",$line[14]);
                    $familyContactAddress = str_replace ('"', "",$line[15]);
                    $familyContactMail = str_replace ('"', "",$line[16]);
                    $familyContactPhone = str_replace ('"', "",$line[17]);
                    $familyContactRelationship = str_replace ('"', "",$line[18]);
                    $familyContactMobilePhone = str_replace ('"', "",$line[19]);
                    $deceasedMortuary = str_replace ('"', "",$line[20]);
                    $deceasedMortuaryAddress = str_replace ('"', "",$line[21]);
                    $deceasedRoom = str_replace ('"', "",$line[22]);
                    $churchLabel = str_replace ('"', "",$line[23]);
                    $church = str_replace ('"', "",$line[24]);
                    $cemeteryLabel = str_replace ('"', "",$line[25]);
                    $cemetery = str_replace ('"', "",$line[26]);
                    $funeralNicheNumber = str_replace ('"', "",$line[27]);
                    $idTipoNicho = str_replace ('"', "",$line[28]);
                    $funeralBusyNiche = str_replace ('"', "",$line[29]);
                    $funeralDateBurial = str_replace ('"', "",$line[30]);
                    $funeralTimeBurial = str_replace ('"', "",$line[31]);
                    $crematoryLabel = str_replace ('"', "",$line[32]);
                    $crematory = str_replace ('"', "",$line[33]);
                    $crematoriumEntryDate = str_replace ('"', "",$line[34]);
                    $crematoriumEntryTime = str_replace ('"', "",$line[35]);
                    $doctor = str_replace ('"', "",$line[36]);
                    $doctorCollegeNum = str_replace ('"', "",$line[37]);
                    $deceasedDoctorCertificate = str_replace ('"', "",$line[38]);
                    $deceasedCause = str_replace ('"', "",$line[39]);
                    $deceasedTribunalNumber = str_replace ('"', "",$line[40]);
                    $deceasedTribunal = str_replace ('"', "",$line[41]);
                    $notesExpedient = str_replace ('"', "",$line[42]);
                    $funeralHomeEntryTime = str_replace ('"', "",$line[43]);
                    $funeralHomeEntryDate = str_replace ('"', "",$line[44]);
                    $funeralHome = str_replace ('"', "",$line[45]);
                    $funeralHomeCif = str_replace ('"', "",$line[46]);
                    $funeralHomePhone = str_replace ('"', "",$line[47]);
                    $funeralHomeFax = str_replace ('"', "",$line[48]);
                    $idPlantilla = str_replace ('"', "",$line[49]);
                    $idNichoPropiedad = str_replace ('"', "",$line[50]);
                    $idNichoPropiedadDe = str_replace ('"', "",$line[51]);
                    $moveFuneralHome = str_replace ('"', "",$line[52]);
                    $moveFuneralHomeCif = str_replace ('"', "",$line[53]);
                    $moveFuneralHomePhone = str_replace ('"', "",$line[54]);
                    $moveFuneralHomeFax = str_replace ('"', "",$line[55]);
                    $ceremonyDate = str_replace ('"', "",$line[56]);
                    $ceremonyTime = str_replace ('"', "",$line[57]);
                    $funeralDate = str_replace ('"', "",$line[58]);
                    $funeralTime = str_replace ('"', "",$line[59]);

                    //Evaluamos si los campos vienen con un caracter sin codear ('�') (excel los guarda sin codificación) y en ese caso los codeamos
                    if(!preg_match('!!u', $idExpedienteDatos)){
                        $idExpedienteDatos = utf8_encode($idExpedienteDatos);
                    }
                    if(!preg_match('!!u', $idExpediente)){
                        $idExpediente = utf8_encode($idExpediente);
                    }
                    if(!preg_match('!!u', $applicantName)){
                        $applicantName = utf8_encode($applicantName);
                    }
                    if(!preg_match('!!u', $applicantSurname1)){
                        $applicantSurname1 = utf8_encode($applicantSurname1);
                    }
                    if(!preg_match('!!u', $applicantSurname2)){
                        $applicantSurname2 = utf8_encode($applicantSurname2);
                    }
                    if(!preg_match('!!u', $applicantNif)){
                        $applicantNif = utf8_encode($applicantNif);
                    }
                    if(!preg_match('!!u', $applicantAddress)){
                        $applicantAddress = utf8_encode($applicantAddress);
                    }
                    if(!preg_match('!!u', $applicantMail)){
                        $applicantMail = utf8_encode($applicantMail);
                    }
                    if(!preg_match('!!u', $applicantPhone)){
                        $applicantPhone = utf8_encode($applicantPhone);
                    }
                    if(!preg_match('!!u', $applicantParentesco)){
                        $applicantParentesco = utf8_encode($applicantParentesco);
                    }
                    if(!preg_match('!!u', $applicantMobilePhone)){
                        $applicantMobilePhone = utf8_encode($applicantMobilePhone);
                    }
                    if(!preg_match('!!u', $familyContactName)){
                        $familyContactName = utf8_encode($familyContactName);
                    }
                    if(!preg_match('!!u', $familyContactSurname1)){
                        $familyContactSurname1 = utf8_encode($familyContactSurname1);
                    }
                    if(!preg_match('!!u', $familyContactSurname2)){
                        $familyContactSurname2 = utf8_encode($familyContactSurname2);
                    }
                    if(!preg_match('!!u', $familyContactNif)){
                        $familyContactNif = utf8_encode($familyContactNif);
                    }
                    if(!preg_match('!!u', $familyContactAddress)){
                        $familyContactAddress = utf8_encode($familyContactAddress);
                    }
                    if(!preg_match('!!u', $familyContactMail)){
                        $familyContactMail = utf8_encode($familyContactMail);
                    }
                    if(!preg_match('!!u', $familyContactPhone)){
                        $familyContactPhone = utf8_encode($familyContactPhone);
                    }
                    if(!preg_match('!!u', $familyContactRelationship)){
                        $familyContactRelationship = utf8_encode($familyContactRelationship);
                    }
                    if(!preg_match('!!u', $familyContactMobilePhone)){
                        $familyContactMobilePhone = utf8_encode($familyContactMobilePhone);
                    }
                    if(!preg_match('!!u', $deceasedMortuary)){
                        $deceasedMortuary = utf8_encode($deceasedMortuary);
                    }
                    if(!preg_match('!!u', $deceasedMortuaryAddress)){
                        $deceasedMortuaryAddress = utf8_encode($deceasedMortuaryAddress);
                    }
                    if(!preg_match('!!u', $deceasedRoom)){
                        $deceasedRoom = utf8_encode($deceasedRoom);
                    }
                    if(!preg_match('!!u', $churchLabel)){
                        $churchLabel = utf8_encode($churchLabel);
                    }
                    if(!preg_match('!!u', $church)){
                        $church = utf8_encode($church);
                    }
                    if(!preg_match('!!u', $cemeteryLabel)){
                        $cemeteryLabel = utf8_encode($cemeteryLabel);
                    }
                    if(!preg_match('!!u', $cemetery)){
                        $cemetery = utf8_encode($cemetery);
                    }
                    if(!preg_match('!!u', $funeralNicheNumber)){
                        $funeralNicheNumber = utf8_encode($funeralNicheNumber);
                    }
                    if(!preg_match('!!u', $idTipoNicho)){
                        $idTipoNicho = utf8_encode($idTipoNicho);
                    }
                    if(!preg_match('!!u', $funeralBusyNiche)){
                        $funeralBusyNiche = utf8_encode($funeralBusyNiche);
                    }
                    if(!preg_match('!!u', $funeralDateBurial)){
                        $funeralDateBurial = utf8_encode($funeralDateBurial);
                    }
                    if(!preg_match('!!u', $funeralTimeBurial)){
                        $funeralTimeBurial = utf8_encode($funeralTimeBurial);
                    }
                    if(!preg_match('!!u', $crematoryLabel)){
                        $crematoryLabel = utf8_encode($crematoryLabel);
                    }
                    if(!preg_match('!!u', $crematory)){
                        $crematory = utf8_encode($crematory);
                    }
                    if(!preg_match('!!u', $crematoriumEntryDate)){
                        $crematoriumEntryDate = utf8_encode($crematoriumEntryDate);
                    }
                    if(!preg_match('!!u', $crematoriumEntryTime)){
                        $crematoriumEntryTime = utf8_encode($crematoriumEntryTime);
                    }
                    if(!preg_match('!!u', $doctor)){
                        $doctor = utf8_encode($doctor);
                    }
                    if(!preg_match('!!u', $doctorCollegeNum)){
                        $doctorCollegeNum = utf8_encode($doctorCollegeNum);
                    }
                    if(!preg_match('!!u', $deceasedDoctorCertificate)){
                        $deceasedDoctorCertificate = utf8_encode($deceasedDoctorCertificate);
                    }
                    if(!preg_match('!!u', $deceasedCause)){
                        $deceasedCause = utf8_encode($deceasedCause);
                    }
                    if(!preg_match('!!u', $deceasedTribunalNumber)){
                        $deceasedTribunalNumber = utf8_encode($deceasedTribunalNumber);
                    }
                    if(!preg_match('!!u', $deceasedTribunal)){
                        $deceasedTribunal = utf8_encode($deceasedTribunal);
                    }
                    if(!preg_match('!!u', $notesExpedient)){
                        $notesExpedient = utf8_encode($notesExpedient);
                    }
                    if(!preg_match('!!u', $funeralHomeEntryTime)){
                        $funeralHomeEntryTime = utf8_encode($funeralHomeEntryTime);
                    }
                    if(!preg_match('!!u', $funeralHomeEntryDate)){
                        $funeralHomeEntryDate = utf8_encode($funeralHomeEntryDate);
                    }
                    if(!preg_match('!!u', $funeralHome)){
                        $funeralHome = utf8_encode($funeralHome);
                    }
                    if(!preg_match('!!u', $funeralHomeCif)){
                        $funeralHomeCif = utf8_encode($funeralHomeCif);
                    }
                    if(!preg_match('!!u', $funeralHomePhone)){
                        $funeralHomePhone = utf8_encode($funeralHomePhone);
                    }
                    if(!preg_match('!!u', $funeralHomeFax)){
                        $funeralHomeFax = utf8_encode($funeralHomeFax);
                    }
                    if(!preg_match('!!u', $idPlantilla)){
                        $idPlantilla = utf8_encode($idPlantilla);
                    }
                    if(!preg_match('!!u', $idNichoPropiedad)){
                        $idNichoPropiedad = utf8_encode($idNichoPropiedad);
                    }
                    if(!preg_match('!!u', $idNichoPropiedadDe)){
                        $idNichoPropiedadDe = utf8_encode($idNichoPropiedadDe);
                    }
                    if(!preg_match('!!u', $moveFuneralHome)){
                        $moveFuneralHome = utf8_encode($moveFuneralHome);
                    }
                    if(!preg_match('!!u', $moveFuneralHomeCif)){
                        $moveFuneralHomeCif = utf8_encode($moveFuneralHomeCif);
                    }
                    if(!preg_match('!!u', $moveFuneralHomePhone)){
                        $moveFuneralHomePhone = utf8_encode($moveFuneralHomePhone);
                    }
                    if(!preg_match('!!u', $moveFuneralHomeFax)){
                        $moveFuneralHomeFax = utf8_encode($moveFuneralHomeFax);
                    }
                    if(!preg_match('!!u', $ceremonyDate)){
                        $ceremonyDate = utf8_encode($ceremonyDate);
                    }
                    if(!preg_match('!!u', $ceremonyTime)){
                        $ceremonyTime = utf8_encode($ceremonyTime);
                    }
                    if(!preg_match('!!u', $funeralDate)){
                        $funeralDate = utf8_encode($funeralDate);
                    }
                    if(!preg_match('!!u', $funeralTime)){
                        $funeralTime = utf8_encode($funeralTime);
                    }

                    // Applicant
                    $applicantName = $applicantName != null && $applicantName != '' && $applicantName != 'NULL' && $applicantName != 'null' ? "'" . $applicantName . "'" : 'null';
                    $applicantSurname = '';
                    if($applicantSurname1 != null && $applicantSurname1 != '' && $applicantSurname1 != 'NULL' && $applicantSurname1 != 'null'){
                        $applicantSurname = $applicantSurname1;
                    }
                    if($applicantSurname2 != null && $applicantSurname2 != '' && $applicantSurname2 != 'NULL' && $applicantSurname2 != 'null'){
                        $applicantSurname .= ' ' . $applicantSurname2;
                    }
                    $applicantSurname = $applicantSurname != '' ? "'" . $applicantSurname . "'" : 'null';
                    $applicantNif = $applicantNif != null && $applicantNif != '' && $applicantNif != 'NULL' && $applicantNif != 'null' ? "'" . $applicantNif . "'" : 'null';
                    $applicantAddress = $applicantAddress != null && $applicantAddress != '' && $applicantAddress != 'NULL' && $applicantAddress != 'null' ? "'" . $applicantAddress . "'" : 'null';
                    $applicantMail = $applicantMail != null && $applicantMail != '' && $applicantMail != 'NULL' && $applicantMail != 'null' ? "'" . $applicantMail . "'" : 'null';
                    $applicantPhone = $applicantPhone != null && $applicantPhone != '' && $applicantPhone != 'NULL' && $applicantPhone != 'null' ? "'" . $applicantPhone . "'" : 'null';
                    $applicantMobilePhone = $applicantMobilePhone != null && $applicantMobilePhone != '' && $applicantMobilePhone != 'NULL' && $applicantMobilePhone != 'null' ? "'" . $applicantMobilePhone . "'" : 'null';

                    // Family
                    $familyContactName = $familyContactName != null && $familyContactName != '' && $familyContactName != 'NULL' && $familyContactName != 'null' ? "'" . $familyContactName . "'" : 'null';
                    $familyContactSurname = '';
                    if($familyContactSurname1 != null && $familyContactSurname1 != '' && $familyContactSurname1 != 'NULL' && $familyContactSurname1 != 'null'){
                        $familyContactSurname = $familyContactSurname1;
                    }
                    if($familyContactSurname2 != null && $familyContactSurname2 != '' && $familyContactSurname2 != 'NULL' && $familyContactSurname2 != 'null'){
                        $familyContactSurname .= ' ' . $familyContactSurname2;
                    }
                    $familyContactSurname = $familyContactSurname != '' ? "'" . $familyContactSurname . "'" : 'null';
                    $familyContactNif = $familyContactNif != null && $familyContactNif != '' && $familyContactNif != 'NULL' && $familyContactNif != 'null' ? "'" . $familyContactNif . "'" : 'null';
                    $familyContactAddress = $familyContactAddress != null && $familyContactAddress != '' && $familyContactAddress != 'NULL' && $familyContactAddress != 'null' ? "'" . $familyContactAddress . "'" : 'null';
                    $familyContactMail = $familyContactMail != null && $familyContactMail != '' && $familyContactMail != 'NULL' && $familyContactMail != 'null' ? "'" . $familyContactMail . "'" : 'null';
                    $familyContactPhone = $familyContactPhone != null && $familyContactPhone != '' && $familyContactPhone != 'NULL' && $familyContactPhone != 'null' ? "'" . $familyContactPhone . "'" : 'null';
                    $familyContactMobilePhone = $familyContactMobilePhone != null && $familyContactMobilePhone != '' && $familyContactMobilePhone != 'NULL' && $familyContactMobilePhone != 'null' ? "'" . $familyContactMobilePhone . "'" : 'null';

                    // Mortuary
                    if($deceasedMortuary == null || $deceasedMortuary == '' || $deceasedMortuary == 'null' || $deceasedMortuary == 'NULL' || $deceasedMortuary == 0){
                        $deceasedMortuary = 'null';
                    }
                    $deceasedMortuaryAddress = $deceasedMortuaryAddress != null && $deceasedMortuaryAddress != '' && $deceasedMortuaryAddress != 'NULL' && $deceasedMortuaryAddress != 'null' ? "'" . $deceasedMortuaryAddress . "'" : 'null';
                    $deceasedRoom = $deceasedRoom != null && $deceasedRoom != '' && $deceasedRoom != 'NULL' && $deceasedRoom != 'null' ? "'" . $deceasedRoom . "'" : 'null';

                    // Church
                    if($churchLabel == 'Iglesia Parroquial de '){
                        $churchLabel = 'Iglesia Parroquial';
                        $otherCeremony = 'null';
                    }else{
                        $churchLabel = 'Otro';
                        $otherCeremony = "'" . $churchLabel . "'";
                    }

                    if($church == null || $church == '' || $church == 'null' || $church == 'NULL'){
                        $church = 'null';
                    }else{

                        $result = $db->query("  SELECT  c.churchID
                                                FROM    Churches c
                                                WHERE   c.name = '" . $church . "'"
                        );
        
                        if(mysqli_num_rows($result) == 0){

                            // Calculate extraID
                            $result = $db->query("  SELECT  MAX(churchID) as id
                                                    FROM    Churches
                            ");
                            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
                            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 5);
                            $extraID .= ($maxID+1);
    
                            $resp = $db->query(" INSERT INTO Churches(name, extraID) VALUES ('" . $church . "', '$extraID')");

                            if(!$resp){
                                var_dump(" INSERT INTO Churches(name, extraID) VALUES ('" . $church . "', '$extraID')");
                            }
    
                            $result = $db->query("  SELECT  c.churchID
                                                    FROM    Churches c
                                                    WHERE   c.name = '" . $church . "'");
    
                            $church = mysqli_num_rows($result) == 0 ? 'null' : $db->resultToArray($result)[0]['churchID'];
                        }else{
                            $church = $db->resultToArray($result)[0]['churchID'];
                        }
                    }

                    // Cementerio
                    if($cemeteryLabel == 'Cementerio de ' || $cemeteryLabel == 'Cementerio ' || $cemeteryLabel == 'CEMENTERIO'){
                        $cemeteryLabel = 'Cementerio';
                        $otherInhumation = 'null';
                    }else{
                        $cemeteryLabel = 'Otro';
                        $otherInhumation = "'" . $cemeteryLabel . "'";
                    }
                    if($cemetery == null || $cemetery == '' || $cemetery == 'null' || $cemetery == 'NULL'){
                        $cemetery = 'null';
                    }else{
                        $result = $db->query("  SELECT  c.cemeteryID
                                                FROM    Cemeteries c
                                                WHERE   c.name = '" . $cemetery . "'");

                        if(mysqli_num_rows($result) == 0){
                            $resp = $db->query(" INSERT INTO Cemeteries(name) VALUES ('" . $cemetery . "')");

                            if(!$resp){
                                var_dump(" INSERT INTO Cemeteries(name) VALUES ('" . $cemetery . "')");
                            }

                            $result = $db->query("  SELECT  c.cemeteryID
                                                    FROM    Cemeteries c
                                                    WHERE   c.name = '" . $cemetery . "'");

                            $cemetery = mysqli_num_rows($result) == 0 ? 'null' : $db->resultToArray($result)[0]['cemeteryID'];
                        }else{
                            $cemetery = $db->resultToArray($result)[0]['cemeteryID'];
                        }
                    }

                    // Niche
                    $funeralNicheNumber = $funeralNicheNumber != null && $funeralNicheNumber != '' && $funeralNicheNumber != 'NULL' && $funeralNicheNumber != 'null' ? "'" . $funeralNicheNumber . "'" : 'null';
                    // $niche = $idTipoNicho == 0 ? 'null' : $idTipoNicho;
                    if(intval($idNichoPropiedad) == 1){
                        $idNichoPropiedadDe = $idNichoPropiedadDe != null && $idNichoPropiedadDe != '' && $idNichoPropiedadDe != 'NULL' && $idNichoPropiedadDe != 'null' ? "'" . $idNichoPropiedadDe . "'" : 'null';
                    }else{
                        $idNichoPropiedadDe = 'null';
                    }
                     $idNichoPropiedad = $idNichoPropiedad != null && $idNichoPropiedad != '' && $idNichoPropiedad != 'NULL' && $idNichoPropiedad != 'null' ? "'" . $idNichoPropiedad . "'" : 'null';

                    $funeralDateBurial = $funeralDateBurial == '0000-00-00' ? 'null' : "'" . $funeralDateBurial. "'";
                    $funeralTimeBurial = $funeralTimeBurial != null && $funeralTimeBurial != '' && $funeralTimeBurial != 'NULL' && $funeralTimeBurial != 'null' ? "'" . $funeralTimeBurial . "'" : 'null';

                    // Crematorium
                    $isCremation = 0;
                    if($crematory == null || $crematory == '' || $crematory == 'null' || $crematory == 'NULL'){
                        $crematory = 'null';
                    }else{
                        $result = $db->query("  SELECT  c.crematoriumID
                                                FROM    Crematoriums c
                                                WHERE   c.name = '" . $crematory . "'");

                        if(mysqli_num_rows($result) == 0){
                            $resp = $db->query(" INSERT INTO Crematoriums(name) VALUES ('" . $crematory . "')");

                            if(!$resp){
                                var_dump(" INSERT INTO Crematoriums(name) VALUES ('" . $crematory . "')");
                            }

                            $result = $db->query("  SELECT  c.crematoriumID
                                                    FROM    Crematoriums c
                                                    WHERE   c.name = '" . $crematory . "'");

                            $crematory = mysqli_num_rows($result) == 0 ? 'null' : $db->resultToArray($result)[0]['crematoriumID'];
                        }else{
                            $crematory = $db->resultToArray($result)[0]['crematoriumID'];
                        }

                        $isCremation = 1;
                    }

                    // Doctor
                    if($doctor == null || $doctor == '' || $doctor == 'null' || $doctor == 'NULL'){
                        $doctor = 'null';
                    }else{
                        $result = $db->query("  SELECT  d.ID
                                                FROM    Doctors d
                                                WHERE   d.name = '" . $doctor . "'");
    
                        if(mysqli_num_rows($result) == 0){

                            $doctorCollegeNum = $doctorCollegeNum != null && $doctorCollegeNum != '' && $doctorCollegeNum != 'NULL' && $doctorCollegeNum != 'null' ? "'" . $doctorCollegeNum . "'" : 'null';

                            $db->query(" INSERT INTO Doctors(name, college, leavingDate) VALUES ('" . $doctor . "', $doctorCollegeNum, null)");
    
                            $result = $db->query("  SELECT  d.ID
                                                    FROM    Doctors d
                                                    WHERE   d.name = '" . $doctor . "'");
    
                            $doctor = mysqli_num_rows($result) == 0 ? 'null' : $db->resultToArray($result)[0]['ID'];
                        }else{
                            $doctor = $db->resultToArray($result)[0]['ID'];
                        }
                    }
                    $deceasedDoctorCertificate = $deceasedDoctorCertificate != null && $deceasedDoctorCertificate != '' && $deceasedDoctorCertificate != 'NULL' && $deceasedDoctorCertificate != 'null' ? "'" . $deceasedDoctorCertificate . "'" : 'null';
                    $deceasedCause = $deceasedCause != null && $deceasedCause != '' && $deceasedCause != 'NULL' && $deceasedCause != 'null' ? "'" . $deceasedCause . "'" : 'null';
                    $deceasedTribunalNumber = $deceasedTribunalNumber != null && $deceasedTribunalNumber != '' && $deceasedTribunalNumber != 'NULL' && $deceasedTribunalNumber != 'null' ? "'" . $deceasedTribunalNumber . "'" : 'null';
                    $deceasedTribunal = $deceasedTribunal != null && $deceasedTribunal != '' && $deceasedTribunal != 'NULL' && $deceasedTribunal != 'null' ? "'" . $deceasedTribunal . "'" : 'null';
                    $notesExpedient = $notesExpedient != null && $notesExpedient != '' && $notesExpedient != 'NULL' && $notesExpedient != 'null' ? "'" . $notesExpedient . "'" : 'null';

                    // Funeral home
                    $funeralHomeEntryDate = $funeralHomeEntryDate == '0000-00-00' ? 'null' : "'" . $funeralHomeEntryDate. "'";
                    $funeralHomeEntryTime = $funeralHomeEntryTime != null && $funeralHomeEntryTime != '' && $funeralHomeEntryTime != 'NULL' && $funeralHomeEntryTime != 'null' ? "'" . $funeralHomeEntryTime . "'" : 'null';
                    if($funeralHome == null || $funeralHome == '' || $funeralHome == 'null' || $funeralHome == 'NULL'){
                        $funeralHome = 'null';
                    }else{

                        $result = $db->query("  SELECT  fh.funeralHomeID
                                                FROM    FuneralHomes fh
                                                WHERE   fh.name = '" . $funeralHome . "'");
    
                        if(mysqli_num_rows($result) == 0){

                            // Calculate extraID
                            $result = $db->query("  SELECT  MAX(funeralHomeID) as id
                                                    FROM    FuneralHomes
                            ");
                            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
                            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 5);
                            $extraID .= ($maxID+1);

                            $funeralHomeCif = $funeralHomeCif != null && $funeralHomeCif != '' && $funeralHomeCif != 'NULL' && $funeralHomeCif != 'null' ? "'" . $funeralHomeCif . "'" : 'null';
                            $funeralHomePhone = $funeralHomePhone != null && $funeralHomePhone != '' && $funeralHomePhone != 'NULL' && $funeralHomePhone != 'null' ? "'" . $funeralHomePhone . "'" : 'null';
                            $funeralHomeFax = $funeralHomeFax != null && $funeralHomeFax != '' && $funeralHomeFax != 'NULL' && $funeralHomeFax != 'null' ? "'" . $funeralHomeFax . "'" : 'null';
                          
                            $resp = $db->query(" INSERT INTO FuneralHomes(nif, name, phones, fax, extraID) VALUES ($funeralHomeCif, '" . $funeralHome . "', $funeralHomePhone, $funeralHomeFax, '$extraID')");
                            if(!$resp){
                                var_dump(" INSERT INTO FuneralHomes(nif, name, phones, fax, extraID) VALUES ($funeralHomeCif, '" . $funeralHome . "', $funeralHomePhone, $funeralHomeFax, '$extraID')");
                            }

                            $result = $db->query("  SELECT  fh.funeralHomeID
                                                    FROM    FuneralHomes fh
                                                    WHERE   fh.name = '" . $funeralHome . "'");
    
                            $funeralHome = mysqli_num_rows($result) == 0 ? 'null' : $db->resultToArray($result)[0]['funeralHomeID'];
                        }else{
                            $funeralHome = $db->resultToArray($result)[0]['funeralHomeID'];
                        }
                    }

                    // Move funeral home
                    if($moveFuneralHome == null || $moveFuneralHome == '' || $moveFuneralHome == 'null' || $moveFuneralHome == 'NULL'){
                        $moveFuneralHome = 'null';
                    }else{

                        $result = $db->query("  SELECT  fh.funeralHomeID
                                                FROM    FuneralHomes fh
                                                WHERE   fh.name = '" . $moveFuneralHome . "'");
    
                        if(mysqli_num_rows($result) == 0){

                            // Calculate extraID
                            $result = $db->query("  SELECT  MAX(funeralHomeID) as id
                                                    FROM    FuneralHomes
                            ");
                            $maxID = mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['id'] : '1';
                            $extraID = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 5);
                            $extraID .= ($maxID+1);

                            $moveFuneralHomeCif = $moveFuneralHomeCif != null && $moveFuneralHomeCif != '' && $moveFuneralHomeCif != 'NULL' && $moveFuneralHomeCif != 'null' ? "'" . $moveFuneralHomeCif . "'" : 'null';
                            $moveFuneralHomePhone = $moveFuneralHomePhone != null && $moveFuneralHomePhone != '' && $moveFuneralHomePhone != 'NULL' && $moveFuneralHomePhone != 'null' ? "'" . $moveFuneralHomePhone . "'" : 'null';
                            $moveFuneralHomeFax = $moveFuneralHomeFax != null && $moveFuneralHomeFax != '' && $moveFuneralHomeFax != 'NULL' && $moveFuneralHomeFax != 'null' ? "'" . $moveFuneralHomeFax . "'" : 'null';
                          
                            $resp = $db->query(" INSERT INTO FuneralHomes(nif, name, phones, fax, extraID) VALUES ($moveFuneralHomeCif, '" . $funeralHome . "', $moveFuneralHomePhone, $moveFuneralHomeFax, '$extraID')");
                            if(!$resp){
                                var_dump(" INSERT INTO FuneralHomes(nif, name, phones, fax, extraID) VALUES ($moveFuneralHomeCif, '" . $funeralHome . "', $moveFuneralHomePhone, $moveFuneralHomeFax, '$extraID')");
                            }

                            $result = $db->query("  SELECT  fh.funeralHomeID
                                                    FROM    FuneralHomes fh
                                                    WHERE   fh.name = '" . $moveFuneralHome . "'");
    
                            $moveFuneralHome = mysqli_num_rows($result) == 0 ? 'null' : $db->resultToArray($result)[0]['funeralHomeID'];
                        }else{
                            $moveFuneralHome = $db->resultToArray($result)[0]['funeralHomeID'];
                        }
                    }
                    
                    $ceremonyDate = $ceremonyDate == '0000-00-00' ? 'null' : "'" . $ceremonyDate. "'";
                    $ceremonyTime = $ceremonyTime != null && $ceremonyTime != '' && $ceremonyTime != 'NULL' && $ceremonyTime != 'null' ? "'" . $ceremonyTime . "'" : 'null';

                    // $funeralDate = $funeralDate == '0000-00-00' ? 'null' : "'" . $ceremonyDate. "'";
                    // $funeralTime = $funeralTime != null && $funeralTime != '' && $funeralTime != 'NULL' && $funeralTime != 'null' ? "'" . $funeralTime . "'" : 'null';

                    $res = $db->query("  
                                UPDATE  Expedients e
                                SET     e.applicantName = $applicantName,
                                        e.applicantSurname = $applicantSurname,
                                        e.applicantNif = $applicantNif,
                                        e.applicantAddress = $applicantAddress,
                                        e.applicantMail = $applicantMail,
                                        e.applicantPhone = $applicantPhone,
                                        e.applicantMobilePhone = $applicantMobilePhone,
                                        e.familyContactName = $familyContactName,
                                        e.familyContactSurname = $familyContactSurname,
                                        e.familyContactNIF = $familyContactNif,
                                        e.familyContactAddress = $familyContactAddress,
                                        e.familyContactMail = $familyContactMail,
                                        e.familyContactPhone = $familyContactPhone,
                                        e.familyContactMobilePhone = $familyContactMobilePhone,
                                        e.deceasedMortuary = $deceasedMortuary,
                                        e.deceasedMortuaryAddress = $deceasedMortuaryAddress,
                                        e.deceasedRoom = $deceasedRoom,
                                        e.churchLabel = '$churchLabel',
                                        e.otherCeremony = $otherCeremony,
                                        e.church = $church,
                                        e.cemeteryLabel = '$cemeteryLabel',
                                        e.otherInhumation = $otherInhumation,
                                        e.cemetery = $cemetery,
                                        e.funeralNicheNumber = $funeralNicheNumber,
                                        e.funeralBusyNiche = $funeralBusyNiche,
                                        e.funeralDateBurial = $funeralDateBurial,
                                        e.funeralTimeBurial = $funeralTimeBurial,
                                        e.cremation = $isCremation,
                                        e.crematorium = $crematory,
                                        e.deceasedDoctor = $doctor,
                                        e.deceasedDoctorCertificate = $deceasedDoctorCertificate,
                                        e.deceasedTribunalNumber = $deceasedTribunalNumber,
                                        e.deceasedTribunal = $deceasedTribunal,
                                        e.deceasedCause = $deceasedCause,
                                        e.funeralHomeEntryDate = $funeralHomeEntryDate,
                                        e.funeralHomeEntryTime = $funeralHomeEntryTime,
                                        e.funeralHome = $funeralHome,
                                        e.notesExpedient = $notesExpedient,
                                        e.regime = $idNichoPropiedad,
                                        e.exhumation = $idNichoPropiedadDe,
                                        e.moveFuneralHome = $moveFuneralHome,
                                        e.ceremonyDate = $ceremonyDate,
                                        e.ceremonyTime = $ceremonyTime
                                WHERE   e.expedientID = $idExpediente"
                    );

                    if(!$res){
                        var_dump('ERROR - id_expediente: ' . $idExpediente);

                        var_dump("  
                                UPDATE  Expedients e
                                SET     e.applicantName = $applicantName,
                                        e.applicantSurname = $applicantSurname,
                                        e.applicantNif = $applicantNif,
                                        e.applicantAddress = $applicantAddress,
                                        e.applicantMail = $applicantMail,
                                        e.applicantPhone = $applicantPhone,
                                        e.applicantMobilePhone = $applicantMobilePhone,
                                        e.familyContactName = $familyContactName,
                                        e.familyContactSurname = $familyContactSurname,
                                        e.familyContactNIF = $familyContactNif,
                                        e.familyContactAddress = $familyContactAddress,
                                        e.familyContactMail = $familyContactMail,
                                        e.familyContactPhone = $familyContactPhone,
                                        e.familyContactMobilePhone = $familyContactMobilePhone,
                                        e.deceasedMortuary = $deceasedMortuary,
                                        e.deceasedMortuaryAddress = $deceasedMortuaryAddress,
                                        e.deceasedRoom = $deceasedRoom,
                                        e.churchLabel = '$churchLabel',
                                        e.otherCeremony = $otherCeremony,
                                        e.church = $church,
                                        e.cemeteryLabel = '$cemeteryLabel',
                                        e.otherInhumation = $otherInhumation,
                                        e.cemetery = $cemetery,
                                        e.funeralNicheNumber = $funeralNicheNumber,
                                        e.funeralBusyNiche = $funeralBusyNiche,
                                        e.funeralDate = $funeralDateBurial,
                                        e.funeralTime = $funeralTimeBurial,
                                        e.crematorium = $crematory,
                                        e.deceasedDoctor = $doctor,
                                        e.deceasedDoctorCertificate = $deceasedDoctorCertificate,
                                        e.deceasedTribunalNumber = $deceasedTribunalNumber,
                                        e.deceasedTribunal = $deceasedTribunal,
                                        e.deceasedCause = $deceasedCause,
                                        e.funeralHomeEntryDate = $funeralHomeEntryDate,
                                        e.funeralHomeEntryTime = $funeralHomeEntryTime,
                                        e.funeralHome = $funeralHome,
                                        e.notesExpedient = $notesExpedient,
                                        e.regime = $idNichoPropiedad,
                                        e.exhumation = $idNichoPropiedadDe,
                                        e.moveFuneralHome = $moveFuneralHome,
                                        e.ceremonyDate = $ceremonyDate,
                                        e.ceremonyTime = $ceremonyTime
                                WHERE   e.expedientID = $idExpediente"
                        );
                    }
                }
            }
            fclose($file);
        }
    }

    function prepareLocationsAndDeceasedIn(){

        $db = new DbHandler;

        if(($file = fopen("tb_expediente_difuntos.csv", "r")) !== false){
            while(($line = fgetcsv($file, 1000, ',')) !== false){
                
                if($line[0] != 'id_difunto'){

                    $locality = str_replace ('"', "",$line[16]);
                    $postalCode = str_replace ('"', "",$line[17]);
                    $province = str_replace ('"', "",$line[18]);
                    $deceasedInName = str_replace ('"', "",$line[19]);
                    $deceasedInLocality = str_replace ('"', "",$line[20]);
                    $deceasedInProvince = str_replace ('"', "",$line[21]);

                    if(!preg_match('!!u', $locality)){
                        $locality = utf8_encode($locality);
                    }
                    if(!preg_match('!!u', $postalCode)){
                        $postalCode = utf8_encode($postalCode);
                    }
                    if(!preg_match('!!u', $province)){
                        $province = utf8_encode($province);
                    }

                    if(!preg_match('!!u', $deceasedInName)){
                        $deceasedInName = utf8_encode($deceasedInName);
                    }
                    if(!preg_match('!!u', $deceasedInLocality)){
                        $deceasedInLocality = utf8_encode($deceasedInLocality);
                    }
                    if(!preg_match('!!u', $deceasedInProvince)){
                        $deceasedInProvince = utf8_encode($deceasedInProvince);
                    }

                    // Locations
                    if(
                        $province != '' && $province != 'null' && $province != 'NULL'
                    ){
                        if(
                            strpos($province, 'S/C') !== false ||
                            strpos($province, 'Tenerife') !== false ||
                            strpos($province, 'TENERIFE') !== false ||
                            strpos($province, 'CRUZ') !== false ||
                            strpos($province, 'SC') !== false ||
                            strpos($province, 'St cruz') !== false ||
                            strpos($province, 'St Cruz') !== false ||
                            strpos($province, 'tenerife') !== false
                        ){
                            $province = 'Santa Cruz de Tenerife';
                        }

                        $location = $db->query(" 
                            SELECT  locationID
                            FROM    Locations
                            WHERE   name = '$locality' AND
                                    postalCode = '$postalCode' AND
                                    province = '$province'
                            LIMIT   1
                        ");
    
                        if(mysqli_num_rows($location) == 0){
                            $resp = $db->query(" INSERT INTO Locations(name, postalCode, province, leavingDate) VALUES ('$locality', '$postalCode', '$province', 1)");
                            
                            if(!$resp){
                                var_dump(" INSERT INTO Locations(name, postalCode, province, leavingDate) VALUES ('$locality', '$postalCode', '$province', 1)");
                            }
                        }
                    }

                    // Deceased In
                    if(
                        $deceasedInName != '' && $deceasedInName != 'null' && $deceasedInName != 'NULL' &&
                        $deceasedInLocality != '' && $deceasedInLocality != 'null' && $deceasedInLocality != 'NULL' &&
                        $deceasedInProvince != '' && $deceasedInProvince != 'null' && $deceasedInProvince != 'NULL'
                    ){

                        if(
                            strpos($deceasedInProvince, 'S/C') !== false ||
                            strpos($deceasedInProvince, 'Tenerife') !== false ||
                            strpos($deceasedInProvince, 'TENERIFE') !== false ||
                            strpos($deceasedInProvince, 'CRUZ') !== false ||
                            strpos($deceasedInProvince, 'SC') !== false ||
                            strpos($deceasedInProvince, 'St cruz') !== false ||
                            strpos($deceasedInProvince, 'St Cruz') !== false ||
                            strpos($deceasedInProvince, 'tenerife') !== false
                        ){
                            $deceasedInProvince = 'Santa Cruz de Tenerife';
                        }

                        // Search location
                        $locationSearch = $db->query(" 
                            SELECT  locationID
                            FROM    Locations
                            WHERE   name = '$deceasedInLocality' AND
                                    province = '$deceasedInProvince'
                            LIMIT   1
                        ");

                        if(mysqli_num_rows($locationSearch) == 0){
                            $resp = $db->query(" INSERT INTO Locations(name, postalCode, province, leavingDate) VALUES ('$deceasedInLocality', null, '$deceasedInProvince', 1)");
                            
                            if(!$resp){
                                var_dump(" INSERT INTO Locations(name, postalCode, province) VALUES ('$deceasedInLocality', null, '$deceasedInProvince')");
                            }

                            $locationFind = $db->query(" 
                                SELECT  locationID
                                FROM    Locations
                                WHERE   name = '$deceasedInLocality' AND
                                        province = '$deceasedInProvince'
                                LIMIT   1
                            ");

                            $locationId = $db->resultToArray($locationFind)[0]['locationID'];
                        }else{
                            $locationId = $db->resultToArray($locationSearch)[0]['locationID'];
                        }

                        $deceasedIn = $db->query(" 
                            SELECT  deceasedInID
                            FROM    DeceasedIn
                            WHERE   name = '$deceasedInName' AND
                                    location = $locationId
                            LIMIT   1
                        ");
    
                        if(mysqli_num_rows($deceasedIn) == 0){
                            $resp = $db->query(" INSERT INTO DeceasedIn(location, name, leavingDate) VALUES ($locationId, '$deceasedInName', 1)");
                            
                            if(!$resp){
                                var_dump(" INSERT INTO DeceasedIn(location, name, leavingDate) VALUES ($locationId, '$deceasedInName', 1)");
                            }
                        }
                    }
                }
            }

            fclose($file);
        }
    }

    function updateExpedientesDifuntos(){

        $db = new DbHandler;

        if(($file = fopen("tb_expediente_difuntos.csv", "r")) !== false){
            while(($line = fgetcsv($file, 1000, ',')) !== false){
                
                if($line[0] != 'id_difunto'){

                    $idDifunto = str_replace ('"', "",$line[0]);
                    $idExpediente = str_replace ('"', "",$line[1]);
                    $deceasedName = str_replace ('"', "",$line[2]);
                    $deceasedSurname1 = str_replace ('"', "",$line[3]);
                    $deceasedSurname2 = str_replace ('"', "",$line[4]);
                    $deceasedNif = str_replace ('"', "",$line[5]);
                    $deceasedGenre = str_replace ('"', "",$line[6]);
                    $deceasedChildOfFather = str_replace ('"', "",$line[7]);
                    $deceasedChildOfMother = str_replace ('"', "",$line[8]);
                    $deceasedMaritalStatus = str_replace ('"', "",$line[9]);
                    $deceasedFirstNuptials = str_replace ('"', "",$line[10]);
                    $deceasedSecondNuptials = str_replace ('"', "",$line[11]);
                    $deceasedNationality = str_replace ('"', "",$line[12]);
                    $deceasedBirthday = str_replace ('"', "",$line[13]);
                    $deceasedBirthdayLocation = str_replace ('"', "",$line[14]);
                    $deceasedUsualAddress = str_replace ('"', "",$line[15]);
                    $deceasedLocality = str_replace ('"', "",$line[16]);
                    $deceasedPostalCode = str_replace ('"', "",$line[17]);
                    $deceasedProvince = str_replace ('"', "",$line[18]);
                    $deceasedInName = str_replace ('"', "",$line[19]);
                    $deceasedInLocality = str_replace ('"', "",$line[20]);
                    $deceasedInProvince = str_replace ('"', "",$line[21]);
                    $deceasedDate = str_replace ('"', "",$line[22]);
                    $deceasedTime = str_replace ('"', "",$line[23]);


                    if(!preg_match('!!u', $idDifunto)){
                        $idDifunto = utf8_encode($idDifunto);
                    }
                    if(!preg_match('!!u', $idExpediente)){
                        $idExpediente = utf8_encode($idExpediente);
                    }
                    if(!preg_match('!!u', $deceasedName)){
                        $deceasedName = utf8_encode($deceasedName);
                    }
                    if(!preg_match('!!u', $deceasedSurname1)){
                        $deceasedSurname1 = utf8_encode($deceasedSurname1);
                    }
                    if(!preg_match('!!u', $deceasedSurname2)){
                        $deceasedSurname2 = utf8_encode($deceasedSurname2);
                    }
                    if(!preg_match('!!u', $deceasedNif)){
                        $deceasedNif = utf8_encode($deceasedNif);
                    }
                    if(!preg_match('!!u', $deceasedGenre)){
                        $deceasedGenre = utf8_encode($deceasedGenre);
                    }
                    if(!preg_match('!!u', $deceasedChildOfFather)){
                        $deceasedChildOfFather = utf8_encode($deceasedChildOfFather);
                    }
                    if(!preg_match('!!u', $deceasedChildOfMother)){
                        $deceasedChildOfMother = utf8_encode($deceasedChildOfMother);
                    }
                    if(!preg_match('!!u', $deceasedMaritalStatus)){
                        $deceasedMaritalStatus = utf8_encode($deceasedMaritalStatus);
                    }
                    if(!preg_match('!!u', $deceasedFirstNuptials)){
                        $deceasedFirstNuptials = utf8_encode($deceasedFirstNuptials);
                    }
                    if(!preg_match('!!u', $deceasedSecondNuptials)){
                        $deceasedSecondNuptials = utf8_encode($deceasedSecondNuptials);
                    }
                    if(!preg_match('!!u', $deceasedNationality)){
                        $deceasedNationality = utf8_encode($deceasedNationality);
                    }
                    if(!preg_match('!!u', $deceasedBirthday)){
                        $deceasedBirthday = utf8_encode($deceasedBirthday);
                    }
                    if(!preg_match('!!u', $deceasedBirthdayLocation)){
                        $deceasedBirthdayLocation = utf8_encode($deceasedBirthdayLocation);
                    }
                    if(!preg_match('!!u', $deceasedUsualAddress)){
                        $deceasedUsualAddress = utf8_encode($deceasedUsualAddress);
                    }
                    if(!preg_match('!!u', $deceasedLocality)){
                        $deceasedLocality = utf8_encode($deceasedLocality);
                    }
                    if(!preg_match('!!u', $deceasedPostalCode)){
                        $deceasedPostalCode = utf8_encode($deceasedPostalCode);
                    }
                    if(!preg_match('!!u', $deceasedProvince)){
                        $deceasedProvince = utf8_encode($deceasedProvince);
                    }
                    if(!preg_match('!!u', $deceasedInName)){
                        $deceasedInName = utf8_encode($deceasedInName);
                    }
                    if(!preg_match('!!u', $deceasedInLocality)){
                        $deceasedInLocality = utf8_encode($deceasedInLocality);
                    }
                    if(!preg_match('!!u', $deceasedInProvince)){
                        $deceasedInProvince = utf8_encode($deceasedInProvince);
                    }
                    if(!preg_match('!!u', $deceasedDate)){
                        $deceasedDate = utf8_encode($deceasedDate);
                    }
                    if(!preg_match('!!u', $deceasedTime)){
                        $deceasedTime = utf8_encode($deceasedTime);
                    }
                    
                    $deceasedName = $deceasedName != null && $deceasedName != '' && $deceasedName != 'NULL' && $deceasedName != 'null' ? "'" . $deceasedName . "'" : 'null';

                    $deceasedSurname = '';
                    if($deceasedSurname1 != null && $deceasedSurname1 != '' && $deceasedSurname1 != 'NULL' && $deceasedSurname1 != 'null'){
                        $deceasedSurname = $deceasedSurname1;
                    }
                    if($deceasedSurname2 != null && $deceasedSurname2 != '' && $deceasedSurname2 != 'NULL' && $deceasedSurname2 != 'null'){
                        $deceasedSurname .= ' ' . $deceasedSurname2;
                    }
                    $deceasedSurname = $deceasedSurname != '' ? "'" . $deceasedSurname . "'" : 'null';

                    $deceasedNif = $deceasedNif != null && $deceasedNif != '' && $deceasedNif != 'NULL' && $deceasedNif != 'null' ? "'" . $deceasedNif . "'" : 'null';

                    switch($deceasedGenre){
                        case 'hombre':
                            $deceasedGender = 'Hombre';
                        break;
                        case 'mujer':
                            $deceasedGender = 'Mujer';
                        break;
                    }

                    $deceasedChildOfFather = $deceasedChildOfFather != null && $deceasedChildOfFather != '' && $deceasedChildOfFather != 'NULL' && $deceasedChildOfFather != 'null' ? "'" . $deceasedChildOfFather . "'" : 'null';
                    $deceasedChildOfMother = $deceasedChildOfMother != null && $deceasedChildOfMother != '' && $deceasedChildOfMother != 'NULL' && $deceasedChildOfMother != 'null' ? "'" . $deceasedChildOfMother . "'" : 'null';

                    switch($deceasedMaritalStatus){
                        case 0:
                            $deceasedMaritalStatus = 'null';
                        break;
                        case 1:
                            $deceasedMaritalStatus = "'".'Soltero' . "'";
                        break;
                        case 2:
                            $deceasedMaritalStatus = "'".'Casado'  . "'";
                        break;
                        case 3:
                            $deceasedMaritalStatus = "'".'Divorciado'  . "'";
                        break;
                        case 4:
                            $deceasedMaritalStatus = "'".'Viudo'  . "'";
                        break;
                        case 5:
                            $deceasedMaritalStatus = "'".'Otros'  . "'";
                        break;
                    }

                    $deceasedFirstNuptials = $deceasedFirstNuptials != null && $deceasedFirstNuptials != '' && $deceasedFirstNuptials != 'NULL' && $deceasedFirstNuptials != 'null' ? "'" . $deceasedFirstNuptials . "'" : 'null';
                    $deceasedSecondNuptials = $deceasedSecondNuptials != null && $deceasedSecondNuptials != '' && $deceasedSecondNuptials != 'NULL' && $deceasedSecondNuptials != 'null' ? "'" . $deceasedSecondNuptials . "'" : 'null';

                    if(
                        $deceasedNationality == 'ERSPAÑOLA' || 
                        $deceasedNationality == 'ESAPAÑOLA' || 
                        $deceasedNationality == 'ESP' || 
                        $deceasedNationality == 'ESPAÑA' || 
                        $deceasedNationality == 'ESPAÑAOLA' || 
                        $deceasedNationality == 'ESPAÑOA' || 
                        $deceasedNationality == 'ESPAÑOLA' || 
                        $deceasedNationality == 'ESPAOLA' || 
                        $deceasedNationality == 'ESPÑAOLA' ||
                        $deceasedNationality == 'ESPÑOLA' ||
                        $deceasedNationality == 'ESPOAÑOLA' ||
                        $deceasedNationality == 'ESPOÑOLA' ||
                        $deceasedNationality == 'ESPPAÑOLA'
                    ){
                        $deceasedNationality = 'España';
                        $deceasedNationalityName = '';
                    }else{
                        $deceasedNationality = 'Otro';
                        $deceasedNationalityName = $deceasedNationality;
                    }

                    $deceasedBirthday = $deceasedBirthday == '0000-00-00' ? 'null' : "'" . $deceasedBirthday. "'";
                    $deceasedBirthdayLocation = getLocation($deceasedBirthdayLocation);
                    $deceasedUsualAddress = $deceasedUsualAddress != null && $deceasedUsualAddress != '' && $deceasedUsualAddress != 'NULL' && $deceasedUsualAddress != 'null' ? "'" . $deceasedUsualAddress . "'" : 'null';

                    $deceasedLocality = $deceasedLocality != null && $deceasedLocality != '' && $deceasedLocality != 'NULL' && $deceasedLocality != 'null' ? "'" . $deceasedLocality . "'" : 'null';

                    if($deceasedProvince != '' && $deceasedProvince != 'null' && $deceasedProvince != 'NULL'){
                        if(
                            strpos($deceasedProvince, 'S/C') !== false ||
                            strpos($deceasedProvince, 'Tenerife') !== false ||
                            strpos($deceasedProvince, 'TENERIFE') !== false ||
                            strpos($deceasedProvince, 'CRUZ') !== false ||
                            strpos($deceasedProvince, 'cruz') !== false ||
                            strpos($deceasedProvince, 'SC') !== false ||
                            strpos($deceasedProvince, 'SANTA') !== false ||
                            strpos($deceasedProvince, 'Santa') !== false ||
                            strpos($deceasedProvince, 'St cruz') !== false ||
                            strpos($deceasedProvince, 'St Cruz') !== false ||
                            strpos($deceasedProvince, 'tenerife') !== false
                        ){
                            $deceasedProvince = 'Santa Cruz de Tenerife';
                        }
                    }
                    $deceasedProvince = $deceasedProvince != null && $deceasedProvince != '' && $deceasedProvince != 'NULL' && $deceasedProvince != 'null' ? "'" . $deceasedProvince . "'" : 'null';

                    if($deceasedInName != null && $deceasedInName != '' && $deceasedInName != 'null' && $deceasedInName != 'NULL'){
                        
                        $result = $db->query("  SELECT  di.deceasedInID
                                                FROM    DeceasedIn di
                                                WHERE   di.name = '" . $deceasedInName . "'");

                        if(mysqli_num_rows($result) == 0){


                            $db->query(" INSERT INTO DeceasedIn(name, leavingDate) VALUES ('" . $deceasedInName . "', 1)");

                            $result = $db->query("  SELECT  di.deceasedInID
                                                    FROM    DeceasedIn di
                                                    WHERE   di.name = '" . $deceasedInName . "'");

                            $deceasedLocation = mysqli_num_rows($result) == 0 ? 'null' : $db->resultToArray($result)[0]['deceasedInID'];
                        }else{
                            $deceasedLocation = $db->resultToArray($result)[0]['deceasedInID'];
                        }
                    }else{
                        $deceasedLocation = 'null';
                    }

                    $deceasedDate = $deceasedDate == '0000-00-00' ? 'null' : "'" . $deceasedDate. "'";
                    $deceasedTime = $deceasedTime != null && $deceasedTime != '' && $deceasedTime != 'NULL' && $deceasedTime != 'null' ? "'" . $deceasedTime . "'" : 'null';
                    
                    $res = $db->query("  
                        UPDATE  Expedients e
                        SET     e.deceasedName = $deceasedName,
                                e.deceasedSurname = $deceasedSurname,
                                e.deceasedNIF = $deceasedNif,
                                e.deceasedGender = '$deceasedGender',
                                e.deceasedChildOfFather = $deceasedChildOfFather,
                                e.deceasedChildOfMother = $deceasedChildOfMother,
                                e.deceasedMaritalStatus = $deceasedMaritalStatus,
                                e.deceasedFirstNuptials = $deceasedFirstNuptials,
                                e.deceasedSecondNuptials = $deceasedSecondNuptials,
                                e.deceasedNationality = '$deceasedNationality',
                                e.deceasedNationalityName = '$deceasedNationalityName',
                                e.deceasedBirthday = $deceasedBirthday,
                                e.deceasedBirthdayLocation = $deceasedBirthdayLocation,
                                e.deceasedUsualAddress = $deceasedUsualAddress,
                                e.deceasedLocality = $deceasedLocality,
                                e.deceasedProvince = $deceasedProvince,
                                e.deceasedLocation = $deceasedLocation,
                                e.deceasedDate = $deceasedDate,
                                e.deceasedTime = $deceasedTime
                        WHERE   e.expedientID = $idExpediente
                        "
                    );

                    if(!$res){
                        var_dump('ERROR - id_expediente: ' . $idExpediente);

                        var_dump("  
                            UPDATE  Expedients e
                            SET     e.deceasedName = $deceasedName,
                                    e.deceasedSurname = $deceasedSurname,
                                    e.deceasedNIF = $deceasedNif,
                                    e.deceasedGender = '$deceasedGender',
                                    e.deceasedChildOfFather = $deceasedChildOfFather,
                                    e.deceasedChildOfMother = $deceasedChildOfMother,
                                    e.deceasedMaritalStatus = $deceasedMaritalStatus,
                                    e.deceasedFirstNuptials = $deceasedFirstNuptials,
                                    e.deceasedSecondNuptials = $deceasedSecondNuptials,
                                    e.deceasedNationality = '$deceasedNationality',
                                    e.deceasedNationalityName = '$deceasedNationalityName',
                                    e.deceasedBirthday = $deceasedBirthday,
                                    e.deceasedBirthdayLocation = $deceasedBirthdayLocation,
                                    e.deceasedUsualAddress = $deceasedUsualAddress,
                                    e.deceasedLocality = $deceasedLocality,
                                    e.deceasedProvince = $deceasedProvince,
                                    e.deceasedLocation = $deceasedLocation,
                                    e.deceasedDate = $deceasedDate,
                                    e.deceasedTime = $deceasedTime
                            WHERE   e.expedientID = $idExpediente
                            "
                        );
                    }

                }
                
            }
        }

    }

    function getLocation($data){
        $db = new DbHandler;

        $location = $db->query("    SELECT  locationID
                                    FROM    Locations
                                    WHERE   name = '$data'
                                    LIMIT   1");

        if(mysqli_num_rows($location) > 0){
            $location = $db->resultToArray($location)[0]['locationID'];
        }else{
            $db->query(" INSERT INTO Locations(name, postalCode, province, leavingDate)
                            VALUES ('$data', null, null, 1)");

            $location = $db->query("SELECT  locationID
                                    FROM    Locations
                                    WHERE   name = '$data'");

            $location = $db->resultToArray($location)[0]['locationID'];
        }

        return $location;
    }

    function updateExpedientAssociates(){

         $db = new DbHandler;

        if(($file = fopen("tb_expedientes.csv", "r")) !== false){
            while(($line = fgetcsv($file, 1000, ',')) !== false){
                
                if($line[0] != 'id_expediente'){

                    $idExpediente = str_replace ('"', "",$line[0]);
                    $idExpAsociado = str_replace ('"', "",$line[4]);

                    //Evaluamos si los campos vienen con un caracter sin codear ('�') (excel los guarda sin codificación) y en ese caso los codeamos
                    if(!preg_match('!!u', $idExpediente)){
                        $idExpediente = utf8_encode($idExpediente);
                    }
                    if(!preg_match('!!u', $idExpAsociado)){
                        $idExpAsociado = utf8_encode($idExpAsociado);
                    }
                    
                    if($idExpAsociado == null || $idExpAsociado == '' || $idExpAsociado == 'null' || $idExpAsociado == 'NULL'){
                        continue;
                    }

                    $res = $db->query(" 
                        INSERT INTO Expedients_Associates(expedientID, associate) VALUES ($idExpediente, $idExpAsociado)"
                    );

                    if(!$res){
                        var_dump('ERROR - id_expediente: ' . $idExpediente);

                        var_dump(" 
                            INSERT INTO Expedients_Associates(expedientID, associate) VALUES ($idExpediente, $idExpAsociado)
                        ");
                    }
                }
            }

            fclose($file);
        }

    }

    function addDocuments(){

        $db = new DbHandler;

        $result = $db->query("  
            SELECT  id_expediente, numero
            FROM    tb_expedientes
        ");

        if(mysqli_num_rows($result) > 0){
            $expedients = $db->resultToArray($result);

            foreach($expedients as $item){

                // Checks if exists dir
                $dirName = str_replace("/", "_", $item['numero']);
                if(is_dir($_SESSION['basePath'] . "core/scripts/updates/documentos/$dirName")){
                    foreach(scandir($_SESSION['basePath'] . "core/scripts/updates/documentos/$dirName") as $elem){
                        if($elem != '.' && $elem != '..'){
                            
                            $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/{$item['id_expediente']}/docs/";
                            if(!is_dir($path)){
                                mkdir($path, 0777, true);
                            }
                            
                            $date = filemtime($_SESSION['basePath'] . "core/scripts/updates/documentos/$dirName/$elem");
                            $date = date("Y-m-d", $date);
                            $nameFile = str_replace(" ", "_", $elem);
                            $url = "http://10.20.73.20/resources/files/{$_SESSION['company']}/expedients/" . $item['id_expediente'] . '/docs/' . $nameFile;

                            $resp = $db->query("INSERT INTO Expedients_Documents(expedient, user, `type`, `date`, `name`, `file`, nameFile)
                                        VALUES (" . $item['id_expediente'] . ", " . 1 . ", 0, '" . date('Y-m-d') . "', 
                                            '" . $nameFile ."', '" . $nameFile ."', '" . $url ."')");
                            if($resp){
                                // Copy file
                                $source = $_SESSION['basePath'] . "core/scripts/updates/documentos/$dirName/$elem";
                                $dest = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/{$item['id_expediente']}/docs/$nameFile";
                                $result = copy($source, $dest);
                            }else{
                                var_dump("ERROR - Create Expedients_Documents");
                                var_dump("INSERT INTO Expedients_Documents(expedient, user, `type`, `date`, `name`, `file`, nameFile)
                                            VALUES (" . $item['id_expediente'] . ", " . 1 . ", 0, '" . date('Y-m-d') . "', 
                                                '" . $nameFile ."', '" . $nameFile ."', '" . $url ."')");
                            }
                        }
                    }
                }else{
                    var_dump("Not dir: " . $dirName);
                }
            }
        }
    }
?>