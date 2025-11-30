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

    if(empty($_POST) || !isset($_POST['opt'])){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "model/financing.php");
    
    if(isset($_POST['opt'])){
        $type = $_POST['opt'];
        switch($type){
            case 'create':
                echo json_encode(create($_POST));
            break;
            case 'delete':
                echo json_encode(delete($_POST['ID']));
            break;
            case 'getCuotas':
                echo json_encode(getCuotas($_POST['ID']));
            break;
            case 'read':
                echo json_encode(read($_POST['ID']));
            break;
            case 'update':
                echo json_encode(update($_POST));
            break;
            case 'updatePayments':
                echo json_encode(updatePayments($_POST));
            break;
            case 'repay':
                echo json_encode(repay($_POST));
            break;
        }
    }

    /**
    * Crea una nueva financiación
    *
    * @return array
    */
    function create($data){
        $financing = new Financings();
        $num = $financing->countByThisYear();
        $data['name'] = 1 + $num . "/" . date("Y");
        $data['endDate'] = strtotime("+" . $data['term'] / 12 . " years", $data['startDate']);
        
        $ID = $financing->create($data);

        if($ID){
            require_once($_SESSION['basePath'] . "model/events.php");
            $events = new Events();

            $startDate = $data['startDate'];
            $endDate = strtotime("+1 months", $data['startDate']);
            $deuda = $data['amortization'] - $data['initialCapital'];
            $deuda = $deuda + ($deuda * $data['openingCommission'] / 100) + ($deuda * $data['closeCommission'] / 100);
            $anhos = $data['term'];

            $financingName = $financing->read($ID)['name'];

            $interes = 0;
            if($data['interestType'] == 0){
                $interes = ($data['interest'] / 100) / 12;
            }else{
                $interes = ($data['diferencial'] + $data['euribor']) / 100 / 12;
            }

            $cuota = ($deuda * $interes * (pow((1 + $interes),($anhos))))/((pow((1 + $interes),($anhos))) -1);
            $totalint = 0;
            for($i = 1; $i <= $anhos; $i++){
                $name = "Fin: " . $financingName . " - Cuota Nº " . $i;

                //Creamos el evento para el pago
                $event = array(
                    "status" => 1, 
                    "start" => $startDate,
                    "end" => $endDate, "name" => $name, "financingID"=>$ID
                );
                $eventID = $events->createFinancingEvent($event);

                $financing->createCuota(
                    array(
                        "financing" => $ID, 
                        "interest" => $deuda * $interes, 
                        "startDate" => $startDate, 
                        "endDate" => $endDate, 
                        "cuote" => $cuota, 
                        "pendingCapital" => $deuda - ($cuota - ($deuda * $interes)), 
                        "amortization" => $cuota - $deuda * $interes, 
                        "event" => $eventID
                    )
                );

                $totalint = $totalint + ($deuda * $interes);
                $deuda = $deuda - ($cuota - ($deuda * $interes));

                $startDate = $endDate;
                $endDate = strtotime("+1 months", $endDate);
            }

            return true;
        }else{
            return null;
        }
    }

    /**
    * Actualiza los datos de una financiación
    *
    * @return array
    */
    function delete($data){
        $financing = new Financings();
        return $financing->delete($data);
    }

    /**
    * Obtiene las cuotas de una financiación
    *
    * @return array
    */
    function getCuotas($data){
        $cuotas = new Financings();
        return $cuotas->getCuotas($data);
    }

    /**
    * Obiene los datos de una financiación
    *
    * @return array
    */
    function read($data){
        $financing = new Financings();
        return $financing->read($data);
    }

    /**
    * Actualiza los datos de una financiación
    *
    * @return array
    */
    function update($data){
        require_once($_SESSION['basePath'] . "model/events.php");
        $finan = new Financings();
        $financing = new Financings();
        $financing = $financing->read($data['ID']);
        $financing['destination'] = $data['destination'];
        $financing['type'] = $data['type'];
        $financing['startDate'] = $data['startDate'];
        $financing['endDate'] = strtotime("+" . $data['term'] / 12 . " years", $data['startDate']);
        $pendingFee = $financing['pendingFee'] - $financing['term'] + $data['term'];
        $financing['term'] = $data['term'];
        $financing['pendingFee'] = $pendingFee;
        $financing['interest'] = $data['interest'];
        $financing['providerEntity'] = $data['providerEntity'];
        $financing['financeCenter'] = $data['financeCenter'];
        $financing['payMethod'] = $data['payMethod'];
        $financing['comments'] = $data['comments'];
        $financing['interest'] = $data['interest'];
        $financing['interestType'] = $data['interestType'];
        $financing['diferencial'] = $data['diferencial'];
        $financing['euribor'] = $data['euribor'];

        $finan->update($financing);

        $cuotas = $finan->getCuotas($data['ID']);

        $startDate = $data['startDate'];
        $startDateMonth = date("m", $startDate);
        $flag = true;
        $deuda = 0;
        $cuota = 0;
        $cuotaMonth = date("m", $cuotas[0]['startDate']);
        
        if($cuotaMonth == $startDateMonth){ //mismo mes
            
            for ($i = 0; $i < $data['term']; $i++) {
                if(is_array($cuotas) && $i < count($cuotas)){  

                    $end = strtotime("+1 months", $startDate);

                    if($cuotas[$i]['payDate'] == NULL){ //Cuotas no pagadas
                        $interes = 0;
                        if($data['interestType'] == 0){
                            $interes = ($data['interest'] / 100) / 12;
                        }else{
                            $interes = ($data['diferencial'] + $data['euribor']) / 100 / 12;
                        }
                        $anhos = $data['term'];
                        if($flag){
                            $deuda = $cuotas[$i]['cuote'] + $cuotas[$i]['pendingCapital'] - $cuotas[$i]['interest'];
                            $cuota = ($deuda * $interes * (pow((1 + $interes),($anhos-$i))))/((pow((1 + $interes),($anhos-$i))) -1);
                            $flag = false;
                        }else{
                            $deuda = $deuda - ($cuota - ($deuda * $interes));
                        }
                        
                        //Actualizar cuota
                        $finan->updateCuota(array("ID" => $cuotas[$i]['ID'], "interest" => $deuda * $interes,
                                                    "cuote" => $cuota, "pendingCapital" => $deuda - ($cuota - ($deuda * $interes)), 
                                                    "amortization" => $cuota - $deuda * $interes, "startDate" => $startDate, "endDate" => $end));  
                        //Actualizar evento                                                     
                        $finan->updateFinancingEvent(array("start" => $startDate, "end" => $end, "financingEvent" => $cuotas[$i]['event']));                         
                    }
                    $startDate = $end;
                }else{
                    $endDate = strtotime("+1 months", $startDate);
                    $events = new Events();
                    $name = "Fin: " . $financing['name'] . " - Cuota Nº " . $i + 1 ;
                    
                    //Creamos el evento para el pago
                    $event = array("status" => 1, 
                                    "start" => $startDate,
                                    "end" => $endDate, "name" => $name, "financingID" => $data['ID']);
                    $eventID = $events->createFinancingEvent($event);
    
                    $deuda = $deuda - ($cuota - ($deuda * $interes));
    
                    $finan->createCuota(
                        array(
                            "financing" => $data['ID'], "interest" => $deuda * $interes,
                            "startDate" => $startDate, "endDate" => $endDate, 
                            "cuote" => $cuota, "pendingCapital" => $deuda - ($cuota - ($deuda * $interes)), 
                            "amortization" => $cuota - $deuda * $interes, "event" => $eventID
                        )
                    );                                            
                    $startDate = $endDate;
                }
            }

        }else{ //distinto mes
            $c = 0;
            $flag1 = true;
            if(is_array($cuotas)){
                
                while ($c < count($cuotas) && $flag1) {
                    
                    if($cuotas[$c]['payDate'] == NULL){ //primera cuota no pagada
                        $flag1 = false;
                    }else{
                        $c++;
                    }                    
                }

                if($c != 0){
                    //Si la nueva fecha es menor que la ultima no pagada y mayor que la ultima pagada
                    if($startDateMonth < date("m", $cuotas[$c]['startDate']) && $startDateMonth == date("m", $cuotas[$c-1]['startDate'])){
                        $aux = strtotime("+1 months", $startDate);
                        $startDate = $aux;

                    }else if($startDateMonth < date("m", $cuotas[$c]['startDate']) && $startDateMonth < date("m", $cuotas[$c-1]['startDate']) ){

                        while($startDateMonth < date("m", $cuotas[$c]['startDate'])){
                            //Mientras que el mes de pago sea menor que el mes de la primera cuota no pagada
                            $aux = strtotime("+1 months", $startDate);
                            $startDate = $aux;
                            $startDateMonth = date("m", $startDate);
                        }
                    }
                }

                for ($i=$c; $i < count($cuotas); $i++) { //desde la primera cuota no pagada hasta la ultima                   
                    $end = strtotime("+1 months", $startDate);

                    if($cuotas[$i]['payDate'] == NULL){ //Cuotas no pagadas
                        $interes = 0;
                        if($data['interestType'] == 0){
                            $interes = ($data['interest'] / 100) / 12;
                        }else{
                            $interes = ($data['diferencial'] + $data['euribor']) / 100 / 12;
                        }
                        $anhos = $data['term'];
                        if($flag){
                            $deuda = $cuotas[$i]['cuote'] + $cuotas[$i]['pendingCapital'] - $cuotas[$i]['interest'];
                            $cuota = ($deuda * $interes * (pow((1 + $interes),($anhos-$i))))/((pow((1 + $interes),($anhos-$i))) -1);
                            $flag = false;
                        }else{
                            $deuda = $deuda - ($cuota - ($deuda * $interes));
                        }
                        
                        //Actualizar cuota
                        $finan->updateCuota(array("ID" => $cuotas[$i]['ID'], "interest" => $deuda * $interes,
                                                    "cuote" => $cuota, "pendingCapital" => $deuda - ($cuota - ($deuda * $interes)), 
                                                    "amortization" => $cuota - $deuda * $interes, "startDate" => $startDate, "endDate" => $end));  
                        //Actualizar evento                                                     
                        $finan->updateFinancingEvent(array("start" => $startDate, "end" => $end, "financingEvent" => $cuotas[$i]['event']));                          
                    }
                    $startDate = $end;
                }   

                if(count($cuotas) < $data['term']){ //Si cambia el plazo
                    for ($i= count($cuotas); $i < $data['term']; $i++) { //desde la primera cuota no pagada hasta a ultima
                        $endDate = strtotime("+1 months", $startDate);
                        $events = new Events();
                        $name = "Fin: " . $financing['name'] . " - Cuota Nº " . $i + 1 ;
                        
                        //Creamos el evento para el pago
                        $event = array("status" => 1, 
                                        "start" => $startDate,
                                        "end" => $endDate, "name" => $name, "financingID" => $data['ID']);
                        //  $eventID = $events->createFinancingEvent($event);
        
                        $deuda = $deuda - ($cuota - ($deuda * $interes));
        
                        $result = $finan->createCuota(array("financing" => $data['ID'], "interest" => $deuda * $interes,
                                                                "startDate" => $startDate, "endDate" => $endDate, 
                                                                "cuote" => $cuota, "pendingCapital" => $deuda - ($cuota - ($deuda * $interes)), 
                                                                "amortization" => $cuota - $deuda * $interes, "event" => $eventID));                                           
                        $startDate = $endDate;
                    }
                }
            }
        }

        if(is_array($cuotas) && count($cuotas) > $data['term']){
            for ($i=$data['term']; $i < count($cuotas); $i++) { 
                $finan->deleteCuota($cuotas[$i]['ID']);
            }
        }
        return true;
    }

    /**
    * Actualiza los datos de una financiación
    *
    * @return array
    */
    function updatePayments($data){
        require_once($_SESSION['basePath'] . "model/events.php");
        $modelo = new Financings();

        //Obtengo la financiación
        $financing = $modelo->read($data['financingID']);

        //Recorremos los checks comprobando si han sido marcados
        foreach ($data['checks'] as $check) {
            $cuota = $modelo->getCuota($check[0]);
            if($check[1] == 1 && $cuota['payDate'] == null){
                if($cuota['payDate'] == null){
                    $financing['amortizedCapital'] = $financing['amortization'] - floatval($check[3]);
                    $financing['pendingCapital'] = floatval($check[3]);
                    $financing['pendingFee']--;
                    $modelo->updatePayments($check[0]);
                }
            }
        }

        if($modelo->update($financing)){
            return true;
        }else{
            return false;
        }
    }

    /**
    * Amortiza
    *
    * @return array
    */
    function repay($data){
        
        $finan = new Financings();
        $financing = new Financings();
        $financing = $financing->read($data['financingID']);                   
       
        $cuotas = $finan->getCuotas($data['financingID']);     
        $amortizationType = $data['amortizationType'];
        $amortizationAmount = $data['amortization'];
        $flagResto = true; //Para actualizar el capital pendiente y amortizaciones a 0 cuando ya se han pagado
        $flagExtraAmortiz = true;
        $cuotaCero = 0;
        
        //Obener cuantas cuotas quedan sin pagar
        $cuotesUnpaid = 0;    
        if(is_array($cuotas)){
            foreach ($cuotas as $key => $cuota) {
                if($cuota['payDate'] == NULL){
                    $cuotesUnpaid++;
                }
            }
        } 
        
        $pendingCapital = $financing['pendingCapital'];
        $pendingCapitalAfterAmort = $pendingCapital - $amortizationAmount;

        $lastPayedCuote = $finan->getLAstCuotaPayed($data['financingID']);
        
        if($lastPayedCuote != NULL){
            //Acualizar el capital pendiente de la última cuota pagada
            $finan->updatePendingCapitalLastCuote($lastPayedCuote, $pendingCapitalAfterAmort);
        }
        
        if($amortizationType == 0){ //Amortizar cuotas            
            if($cuotesUnpaid != 0 && is_array($cuotas)){ //Existen cuotas sin pagar
                $amortizated = $amortizationAmount / $cuotesUnpaid;    

                for ($i=0; $i < count($cuotas) ; $i++) { 

                    if($flagResto){ 

                        if($cuotas[$i]['payDate'] == NULL){ 

                            //Añadir a la tabla el campo con la amortizacion manual en la pimera cuota no pagada
                            if($flagExtraAmortiz){
                                //Si es null, el valor es la cantidad introducida, sino, el valor es la cantidad que habia mas la nueva introducida
                                if($cuotas[$i]['extraAmortization'] == NULL){
                                    $finan->updateExtraAmortization(array("ID" => $cuotas[$i]['ID'], "extraAmortization"=>$amortizationAmount));
                                }else{
                                    $finan->updateExtraAmortization(array("ID" => $cuotas[$i]['ID'], "extraAmortization"=> $cuotas[$i]['extraAmortization'] + $amortizationAmount));
                                }
                                $flagExtraAmortiz = false;
                            }

                            $newCuote = $cuotas[$i]['cuote'] - $amortizated;
                            $amortization = $newCuote - $cuotas[$i]['interest'];
                            $pendingPrevCuote = $pendingCapitalAfterAmort;
                            $pendingCapitalCuote = $pendingCapitalAfterAmort - $amortization;
                            $pendingCapitalAfterAmort = $pendingCapitalCuote;
                            

                            if($pendingCapitalCuote <= 0.00){ //No queda nada pendiente
                                $amortization = $pendingPrevCuote;                                
                                $pendingCapitalCuote = 0.00;
                                $newCuote = $cuotas[$i]['interest'] + $amortization; 
                               
                                $flagResto = false; 
                                $cuotaCero = $i + 1;
                                $finan->updateCuota(
                                    array(
                                        "ID" => $cuotas[$i]['ID'], 
                                        "interest" => $cuotas[$i]['interest'],
                                        "cuote" => $newCuote, 
                                        "pendingCapital" => $pendingCapitalCuote, 
                                        "amortization" => $amortization, 
                                        "startDate"=>$cuotas[$i]['startDate'], 
                                        "endDate"=>$cuotas[$i]['endDate']
                                    )
                                );
                            }else if($amortization <= 0.00){
                                $flagResto = false; 
                                $cuotaCero = $i;
                            }else{
                                $finan->updateCuota(
                                    array(
                                        "ID" => $cuotas[$i]['ID'], 
                                        "interest" => $cuotas[$i]['interest'],
                                        "cuote" => $newCuote, 
                                        "pendingCapital" => $pendingCapitalCuote, 
                                        "amortization" => $amortization, 
                                        "startDate"=>$cuotas[$i]['startDate'], 
                                        "endDate"=>$cuotas[$i]['endDate']
                                    )
                                );
                            }                       
                        }   
                    }else{

                        $amortization  = 0.00;
                        $pendingCapitalCuote = 0.00;     
                        $newCuote = $cuotas[$i]['interest'];
                        for ($i=$cuotaCero; $i < count($cuotas); $i++){ 
                            $finan->updateCuota(
                                array(
                                    "ID" => $cuotas[$i]['ID'], 
                                    "interest" => $cuotas[$i]['interest'],
                                    "cuote" => $newCuote, 
                                    "pendingCapital" => $pendingCapitalCuote, 
                                    "amortization" => $amortization, 
                                    "startDate"=>$cuotas[$i]['startDate'], 
                                    "endDate"=>$cuotas[$i]['endDate']
                                )
                            );
                        }
                    }
                }
                $finan->updateFinancingPendingCapital(
                    array(
                        'pendingCapital' => $pendingCapital - $amortizationAmount, 
                        'ID'=>$data['financingID'], 
                        'amortization' => $financing['amortizedCapital'] + $amortizationAmount
                    )
                );    
            }
        }else{ //Amortizar plazos
            if($cuotesUnpaid != 0 && is_array($cuotas)){
                $cuoteNumber = 0;
                while($cuoteNumber < count($cuotas)) { 
                    if($cuotas[$cuoteNumber]['payDate'] == NULL){
                        $firtsCuote = $cuoteNumber;
                        $cuoteNumber = count($cuotas) + 1;
                    }else{
                        $cuoteNumber++;
                    }
                }
                
                $numCuotas = ($pendingCapital - $amortizationAmount) / $cuotas[$firtsCuote]['cuote'];
                $intNumCuotas = intval($numCuotas);                
              
                $cuotasPagadas = count($cuotas) - $cuotesUnpaid;
                if($cuotesUnpaid != 0){
    
                    //Eliminar las cuotas que sobran
                    for ($i=$cuotasPagadas + $intNumCuotas+1; $i < count($cuotas); $i++) { 
                        $finan->deleteCuota($cuotas[$i]['ID']);
                    }
        
                    //Actualizar cuotas
                    for ($i=0; $i <= $intNumCuotas+$cuotasPagadas ; $i++) { 
                        if($cuotas[$i]['payDate'] == NULL){
    
                            //Añadir a la tabla el campo con la amortizacion manual en la pimera cuota no pagada
                            if($flagExtraAmortiz){
                                //Si es null, el valor es la cantidad introducida, sino, el valor es la cantidad que habia mas la nueva introducida
                                if($cuotas[$i]['extraAmortization'] == NULL){
                                    $finan->updateExtraAmortization(
                                        array(
                                            "ID" => $cuotas[$i]['ID'], 
                                            "extraAmortization"=>$amortizationAmount
                                        )
                                    );
                                }else{
                                    $finan->updateExtraAmortization(
                                        array(
                                            "ID" => $cuotas[$i]['ID'], 
                                            "extraAmortization"=> $cuotas[$i]['extraAmortization'] + $amortizationAmount
                                        )
                                    );
                                }
                                $flagExtraAmortiz = false;
                            }
        
                            $pendingCapitalCuote = $cuotas[$i]['pendingCapital'] - $amortizationAmount;
                            if($i != $intNumCuotas+$cuotasPagadas){
                                $cuote = $cuotas[$i]['cuote'];                    
                                $amortization = $cuote - $cuotas[$i]['interest'];

                            }else{ //La ultima cuota
                                
                                $amortization = $cuotas[$i-1]['pendingCapital'] - $amortizationAmount;
                                $cuote = $amortization + $cuotas[$i]['interest'];
                                $pendingCapitalCuote = 0.00;               
                            }
                            
                            $finan->updateCuota(
                                array(
                                    "ID" => $cuotas[$i]['ID'], 
                                    "interest" => $cuotas[$i]['interest'],
                                    "cuote" => $cuote, "pendingCapital" => $pendingCapitalCuote, 
                                    "amortization" => $amortization, 
                                    "startDate"=>$cuotas[$i]['startDate'], 
                                    "endDate"=>$cuotas[$i]['endDate']
                                )
                            );
                        }
                    }   
                    
                    $finan->updateFinancingPendingCapital(
                        array(
                            'pendingCapital' => $pendingCapital - $amortizationAmount, 
                            'ID'=>$data['financingID'],
                            'amortization' => $financing['amortizedCapital'] + $amortizationAmount
                        )
                    );    
                }
            }
        } 
        
        return true;
    }
?>