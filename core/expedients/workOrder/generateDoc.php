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
    
    $expedient = $_POST['expedient'];
    $type = $_POST['type'];
    
    use mikehaertl\wkhtmlto\Pdf;
    
    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    $utils = new Utils();

    require_once($_SESSION['basePath'] . "model/workOrder.php");
    $workOrder = new WorkOrder;
    $params['ID'] = $expedient;
    $result = $workOrder->getWorkOrderInfo($params);

    require_once($_SESSION['basePath'] . 'core/libraries/phpwkhtmltopdf/vendor/autoload.php');

    $pdf = new Pdf;

    $styleCustom = file_get_contents($_SESSION['basePath'] . 'resources/themes/adminlte/workOrder.css');
       
    $options = array(
        'margin-bottom' => 0,
        'margin-left' => 0,
        'margin-right' => 0,
        'margin-top' => 2,
        'title' => 'Orden de Trabajo',
        'encoding' => 'UTF-8'
    );

    $colorInputs = 'color-green';
    if(intval($result['expedient']['cremation']) == 1){
        $colorInputs = 'color-red';
    }

    // Dates
    $deceasedDate = $result['expedient']['deceasedDate'] != null && $result['expedient']['deceasedDate'] != '' ? $utils->fechaCastellano4($result['expedient']['deceasedDate']) : '';
    if(
        $result['expedient']['deceasedDate'] != null && $result['expedient']['deceasedDate'] != '' &&
        $result['expedient']['deceasedBirthday'] != null && $result['expedient']['deceasedBirthday'] != ''
    ){
        $age = floor(abs(strtotime($result['expedient']['deceasedDate']) - strtotime($result['expedient']['deceasedBirthday'])) / (365*60*60*24));
    }else{
        $age = '';
    }

    if($result['expedient']['deceasedTime'] != null && $result['expedient']['deceasedTime'] != ''){
        $deceasedTime = substr($result['expedient']['deceasedTime'], 0, -3);
    }else{
        $deceasedTime = '';
    }

    $funeralDate = '';
    if($result['expedient']['funeralDate'] != null && $result['expedient']['funeralDate'] != ''){
        $funeralDate = $utils->fechaCastellano4($result['expedient']['funeralDate']);
    }
    if($result['expedient']['funeralTime'] != null && $result['expedient']['funeralTime'] != ''){
        $funeralDate .= ' ' . substr($result['expedient']['funeralTime'], 0, -3);
    }

    $arkThanatoplastyDateTime = '';
    if($result['workOrder']['arkThanatoplastyDate'] != null && $result['workOrder']['arkThanatoplastyDate'] != ''){
        $arkThanatoplastyDateTime = $utils->fechaCastellano4(date('Y-m-d', $result['workOrder']['arkThanatoplastyDate']));
    }
    if($result['workOrder']['arkThanatoplastyTime'] != null && $result['workOrder']['arkThanatoplastyTime'] != ''){
        $arkThanatoplastyDateTime .=  ' ' . date('H:i', $result['workOrder']['arkThanatoplastyTime']);
    }

    $arkThanatopraxyDateTime = '';
    if($result['workOrder']['arkThanatopraxyDate'] != null && $result['workOrder']['arkThanatopraxyDate'] != ''){
        $arkThanatopraxyDateTime = $utils->fechaCastellano4(date('Y-m-d', $result['workOrder']['arkThanatopraxyDate']));
    }
    if($result['workOrder']['arkThanatopraxyTime'] != null && $result['workOrder']['arkThanatopraxyTime'] != ''){
        $arkThanatopraxyDateTime .=  ' ' . date('H:i', $result['workOrder']['arkThanatopraxyTime']);
    }

    $arkCTransientDateTime = '';
    if($result['workOrder']['arkCTransientDate'] != null && $result['workOrder']['arkCTransientDate'] != ''){
        $arkCTransientDateTime = $utils->fechaCastellano4(date('Y-m-d', $result['workOrder']['arkCTransientDate']));
    }
    if($result['workOrder']['arkCTransientTime'] != null && $result['workOrder']['arkCTransientTime'] != ''){
        $arkCTransientDateTime .=  ' ' . date('H:i', $result['workOrder']['arkCTransientTime']);
    }

    $arkEmbalmmentDateTime = '';
    if($result['workOrder']['arkEmbalmmentDate'] != null && $result['workOrder']['arkEmbalmmentDate'] != ''){
        $arkEmbalmmentDateTime = $utils->fechaCastellano4(date('Y-m-d', $result['workOrder']['arkEmbalmmentDate']));
    }
    if($result['workOrder']['arkEmbalmmentTime'] != null && $result['workOrder']['arkEmbalmmentTime'] != ''){
        $arkEmbalmmentDateTime .=  ' ' . date('H:i', $result['workOrder']['arkEmbalmmentTime']);
    }

    if($result['expedient']['start_velacion_date_v1'] != null && $result['expedient']['start_velacion_date_v1'] != ''){
        $startVelationDate1 = $utils->fechaCastellano4($result['expedient']['start_velacion_date_v1']);
    }else{
        $startVelationDate1 = '';
    }
    if($result['expedient']['start_velacion_time_v1'] != null && $result['expedient']['start_velacion_time_v1'] != ''){
        $startVelationTime1 = substr($result['expedient']['start_velacion_time_v1'], 0, -3);
    }else{
        $startVelationTime1 = '';
    }
    if($result['expedient']['end_velacion_date_v1'] != null && $result['expedient']['end_velacion_date_v1'] != ''){
        $endVelationDate1 = $utils->fechaCastellano4($result['expedient']['end_velacion_date_v1']);
    }else{
        $endVelationDate1 = '';
    }
    if($result['expedient']['end_velacion_time_v1'] != null && $result['expedient']['end_velacion_time_v1'] != ''){
        $endVelationTime1 = substr($result['expedient']['end_velacion_time_v1'], 0, -3);
    }else{
        $endVelationTime1 = '';
    }

    if($result['expedient']['start_velacion_date_v2'] != null && $result['expedient']['start_velacion_date_v2'] != ''){
        $startVelationDate2 = $utils->fechaCastellano4($result['expedient']['start_velacion_date_v2']);
    }else{
        $startVelationDate2 = '';
    }
    if($result['expedient']['start_velacion_time_v2'] != null && $result['expedient']['start_velacion_time_v2'] != ''){
        $startVelationTime2 = substr($result['expedient']['start_velacion_time_v2'], 0, -3);
    }else{
        $startVelationTime2 = '';
    }
    if($result['expedient']['end_velacion_date_v2'] != null && $result['expedient']['end_velacion_date_v2'] != ''){
        $endVelationDate2 = $utils->fechaCastellano4($result['expedient']['end_velacion_date_v2']);
    }else{
        $endVelationDate2 = '';
    }
    if($result['expedient']['end_velacion_time_v2'] != null && $result['expedient']['end_velacion_time_v2'] != ''){
        $endVelationTime2 = substr($result['expedient']['end_velacion_time_v2'], 0, -3);
    }else{
        $endVelationTime2 = '';
    }

    $ceremonyDate = '';
    if($result['expedient']['ceremonyDate'] != null && $result['expedient']['ceremonyDate'] != ''){
        $ceremonyDate = $utils->fechaCastellano4($result['expedient']['ceremonyDate']);
    }

    $ceremonyTime = '';
    if($result['expedient']['ceremonyTime'] != null && $result['expedient']['ceremonyTime'] != ''){
        $ceremonyTime = substr($result['expedient']['ceremonyTime'], 0, -3);
    }

    $funeralDateBurial = '';
    if($result['expedient']['funeralDateBurial'] != null && $result['expedient']['funeralDateBurial'] != ''){
        $funeralDateBurial = $utils->fechaCastellano4($result['expedient']['funeralDateBurial']);
    }

    $funeralTime = '';
    if($result['expedient']['funeralTimeBurial'] != null && $result['expedient']['funeralTimeBurial'] != ''){
        $funeralTime = substr($result['expedient']['funeralTimeBurial'], 0, -3);
    }

    $inhumationDeclarantDate = '';
    if($result['workOrder']['inhumationDeclarantDate'] != null && $result['workOrder']['inhumationDeclarantDate'] != ''){
        $inhumationDeclarantDate = $utils->fechaCastellano4(date('Y-m-d', $result['workOrder']['inhumationDeclarantDate']));
    }

    $inhumationDeclarantTime = '';
    if($result['workOrder']['inhumationDeclarantTime'] != null && $result['workOrder']['inhumationDeclarantTime'] != ''){
        $inhumationDeclarantTime =  date('H:i', $result['workOrder']['inhumationDeclarantTime']);
    }

    $exhumationDate1 = '';
    if($result['expedient']['exhumationDate1'] != null && $result['expedient']['exhumationDate1'] != ''){
        $exhumationDate1 = $utils->fechaCastellano4(date('Y-m-d', $result['expedient']['exhumationDate1']));
    }

    $exhumationDate2 = '';
    if($result['expedient']['exhumationDate2'] != null && $result['expedient']['exhumationDate2'] != ''){
        $exhumationDate2 = $utils->fechaCastellano4(date('Y-m-d', $result['expedient']['exhumationDate2']));
    }

    $exhumationDate3 = '';
    if($result['expedient']['exhumationDate3'] != null && $result['expedient']['exhumationDate3'] != ''){
        $exhumationDate3 = $utils->fechaCastellano4(date('Y-m-d', $result['expedient']['exhumationDate3']));
    }

    $crematoriumEntryDate = '';
    if($result['expedient']['crematoriumEntry'] != null && $result['expedient']['crematoriumEntry'] != ''){
        $crematoriumEntryDate = $utils->fechaCastellano4($result['expedient']['crematoriumEntry']);
    }

    $crematoriumEntryTime = '';
    if($result['expedient']['crematoriumEntry'] != null && $result['expedient']['crematoriumEntry'] != ''){
        $crematoriumEntryTime = date('H:i', strtotime($result['expedient']['crematoriumEntry']));
    }

    $crematoriumLeavingDate = '';
    if($result['expedient']['crematoriumLeaving'] != null && $result['expedient']['crematoriumLeaving'] != ''){
        $crematoriumLeavingDate = $utils->fechaCastellano4($result['expedient']['crematoriumLeaving']);
    }

    $crematoriumLeavingTime = '';
    if($result['expedient']['crematoriumLeaving'] != null && $result['expedient']['crematoriumLeaving'] != ''){
        $crematoriumLeavingTime = date('H:i', strtotime($result['expedient']['crematoriumLeaving']));
    }

    $crematoryCollectingAshesDate = '';
    if($result['workOrder']['crematoryCollectingAshesDate'] != null && $result['workOrder']['crematoryCollectingAshesDate'] != ''){
        $crematoryCollectingAshesDate = $utils->fechaCastellano4(date('Y-m-d', $result['workOrder']['crematoryCollectingAshesDate']));
    }

    $crematoryCollectingAshesTime = '';
    if($result['workOrder']['crematoryCollectingAshesTime'] != null && $result['workOrder']['crematoryCollectingAshesTime'] != ''){
        $crematoryCollectingAshesTime = date('H:i', $result['workOrder']['crematoryCollectingAshesTime']);
    }

    $crematoriumArriveTime = '';
    if($result['expedient']['crematoriumArriveTime'] != null && $result['expedient']['crematoriumArriveTime'] != ''){
        $crematoriumArriveTime = substr($result['expedient']['crematoriumArriveTime'], 0, -3);
    }

    $authDate = '';
    if($result['expedient']['authDate'] != null && $result['expedient']['authDate'] != ''){
        $authDate = $utils->fechaCastellano4(date('Y-m-d', $result['expedient']['authDate']));
    }

    $authTime = '';
    if($result['expedient']['authTime'] != null && $result['expedient']['authTime'] != ''){
        $authTime = date('H:i', $result['expedient']['authTime']);
    }

    $translationDepositDate = '';
    if($result['workOrder']['translationDepositDate'] != null && $result['workOrder']['translationDepositDate'] != ''){
        $translationDepositDate = $utils->fechaCastellano4(date('Y-m-d', $result['workOrder']['translationDepositDate']));
    }

    $translationDepositTime = '';
    if($result['workOrder']['translationDepositTime'] != null && $result['workOrder']['translationDepositTime'] != ''){
        $translationDepositTime = date('H:i', $result['workOrder']['translationDepositTime']);
    }

    $translationRoadLeavingDateTime = '';
    $translationRoadArrivalDateTime = '';
    $translationAirLeavingDateTime = '';
    $translationAirArrivalDateTime = '';
    if(intval($result['expedient']['moveVia']) == 0){

        if($result['expedient']['moveLeavingDate'] != null && $result['expedient']['moveLeavingDate'] != ''){
            $translationRoadLeavingDateTime = $utils->fechaCastellano4($result['expedient']['moveLeavingDate']);
        }
        if($result['expedient']['moveLeavingTime'] != null && $result['expedient']['moveLeavingTime'] != ''){
            $translationRoadLeavingDateTime .= ' ' . substr($result['expedient']['moveLeavingTime'], 0, -3);
        }
    
        if($result['expedient']['arrivalDate'] != null && $result['expedient']['arrivalDate'] != ''){
            $translationRoadArrivalDateTime = $utils->fechaCastellano4($result['expedient']['arrivalDate']);
        }
        if($result['expedient']['arrivalTime'] != null && $result['expedient']['arrivalTime'] != ''){
            $translationRoadArrivalDateTime .= ' ' . date('H:i', $result['expedient']['arrivalTime']);
        }
    }else if(intval($result['expedient']['moveVia']) == 1){

        if($result['expedient']['departureDate'] != null && $result['expedient']['departureDate'] != ''){
            $translationAirLeavingDateTime = $utils->fechaCastellano4($result['expedient']['departureDate']);
        }
        if($result['expedient']['departureTime'] != null && $result['expedient']['departureTime'] != ''){
            $translationAirLeavingDateTime .= ' ' . date('H:i', $result['expedient']['departureTime']);
        }

        if($result['expedient']['arrivalDate'] != null && $result['expedient']['arrivalDate'] != ''){
            $translationAirArrivalDateTime = $utils->fechaCastellano4($result['expedient']['arrivalDate']);
        }
        if($result['expedient']['arrivalTime'] != null && $result['expedient']['arrivalTime'] != ''){
            $translationAirArrivalDateTime .= ' ' . date('H:i', $result['expedient']['arrivalTime']);
        }
    }

    // Others
    $churchName = '';
    if($result['expedient']['churchName'] != null){
        $churchName = ($result['expedient']['churchLabel'] == 'Otro' ? $result['expedient']['otherCeremony'] : ($result['expedient']['churchLabel'] == 'Iglesia Parroquial' ? $result['expedient']['churchLabel'] . ' de': $result['expedient']['churchLabel'])) . ' ' . ($result['expedient']['churchName'] != null ? $result['expedient']['churchName'] : '');
    }else{
        if($result['expedient']['churchLabel'] == 'Otro'){
            $churchName = $result['expedient']['otherCeremony'];
        }
    }

    $cemetery = '';
    if($result['expedient']['cemeteryName'] != null){
        if($result['expedient']['cemeteryLabel'] == 'Otro'){
            $cemetery = $result['expedient']['otherInhumation'] . ' ' . $result['expedient']['cemeteryName'];
        }else{
            $cemetery = $result['expedient']['cemeteryName'];
        }
    }else{
        if($result['expedient']['cemeteryLabel'] == 'Otro'){
            $cemetery = $result['expedient']['otherInhumation'];
        }
    }

    $moveDestinationAddress = '';
    if($result['expedient']['moveDestinationAddress'] != null && $result['expedient']['moveDestinationAddress'] != ''){
        $moveDestinationAddress = $result['expedient']['moveDestinationAddress'];
    }
    if($result['expedient']['moveDestinationLocality'] != null && $result['expedient']['moveDestinationLocality'] != ''){
        $moveDestinationAddress .= ', ' .  $result['expedient']['moveDestinationLocality'];
    }
    if($result['expedient']['moveDestinationProvince'] != null && $result['expedient']['moveDestinationProvince'] != ''){
        $moveDestinationAddress .= ', ' .  $result['expedient']['moveDestinationProvince'];
    }

    $carCollection2Road = intval($result['expedient']['moveVia']) == 0 ? $result['expedient']['carCollection2'] : '';
    $staffTransfer1Road = intval($result['expedient']['moveVia']) == 0 ? $result['expedient']['staffTransfer1'] : '';
    $staffTransfer2Road = intval($result['expedient']['moveVia']) == 0 ? $result['expedient']['staffTransfer1'] : '';

    $agency = intval($result['expedient']['moveVia']) == 1 && $result['expedient']['agency'] != 'null' ? $result['expedient']['agency'] : '';
    $agencyContact = intval($result['expedient']['moveVia']) == 1 && $result['expedient']['agencyContact'] != 'null' ? $result['expedient']['agencyContact'] : '';
    $agencyContactPhone = intval($result['expedient']['moveVia']) == 1 && $result['expedient']['agencyContactPhone'] != 'null' ? $result['expedient']['agencyContactPhone'] : '';
    $carCollection2Air = intval($result['expedient']['moveVia']) == 1 ? $result['expedient']['carCollection2'] : '';
    $staffTransfer1Air = intval($result['expedient']['moveVia']) == 1 ? $result['expedient']['staffTransfer1'] : '';
    $staffTransfer2Air = intval($result['expedient']['moveVia']) == 1 ? $result['expedient']['staffTransfer1'] : '';
    $airportOrigin = intval($result['expedient']['moveVia']) == 1 && $result['expedient']['airportOrigin'] != 'null' ? $result['expedient']['airportOrigin'] : '';
    $arrivalAirport = intval($result['expedient']['moveVia']) == 1 && $result['expedient']['arrivalAirport'] != 'null' ? $result['expedient']['arrivalAirport'] : '';
    $flightNumber = intval($result['expedient']['moveVia']) == 1 && $result['expedient']['flightNumber'] != 'null' ? $result['expedient']['flightNumber'] : '';

    // Checkbox
    $isJudicial = intval($result['expedient']['moveJudicial']) == 1 ? 'checked' : '';
    $arkCross = intval($result['workOrder']['arkCross']) == 1 ? 'checked' : '';
    $arkJesus = intval($result['workOrder']['arkJesus']) == 1 ? 'checked' : '';
    $arkOther = intval($result['workOrder']['arkOther']) == 1 ? 'checked' : '';
    $arkClothesPhoto = intval($result['workOrder']['arkClothesPhoto']) == 1 ? 'checked' : '';
    $arkClothesRosary = intval($result['workOrder']['arkClothesRosary']) == 1 ? 'checked' : '';
    $arkClothesOwn = intval($result['workOrder']['arkClothesOwn']) == 1 ? 'checked' : '';
    $arkClothesYes = intval($result['workOrder']['arkClothesYes']) == 1 ? 'checked' : '';
    $arkClothesNo = intval($result['workOrder']['arkClothesNo']) == 1 ? 'checked' : '';
    $arkPersonalItemsPacemaker = intval($result['workOrder']['arkPersonalItemsPacemaker']) == 1 ? 'checked' : '';
    $arkPersonalItemsShroud = intval($result['workOrder']['arkPersonalItemsShroud']) == 1 ? 'checked' : '';
    $arkThanatoplasty = intval($result['workOrder']['arkThanatoplasty']) == 1 ? 'checked' : '';
    $arkThanatopraxy = intval($result['workOrder']['arkThanatopraxy']) == 1 ? 'checked' : '';
    $arkCTransient = intval($result['workOrder']['arkCTransient']) == 1 ? 'checked' : '';
    $arkEmbalmment = intval($result['workOrder']['arkEmbalmment']) == 1 ? 'checked' : '';
    $velationCatering = intval($result['workOrder']['velationCatering']) == 1 ? 'checked' : '';
    $velationMemoriesScreen = intval($result['workOrder']['velationMemoriesScreen']) == 1 ? 'checked' : '';
    $velationPrivate = intval($result['workOrder']['velationPrivate']) == 1 ? 'checked' : '';
    $velationArkClosed = intval($result['workOrder']['velationArkClosed']) == 1 ? 'checked' : '';
    $velationPhotoFrame = intval($result['workOrder']['velationPhotoFrame']) == 1 ? 'checked' : '';
    $ceremonyResponse = intval($result['workOrder']['ceremonyResponse']) == 1 ? 'checked' : '';
    $ceremonyFamilyWaitChurch = intval($result['workOrder']['ceremonyFamilyWaitChurch']) == 1 ? 'checked' : '';
    $ceremonyBodyPresent = intval($result['workOrder']['ceremonyBodyPresent']) == 1 ? 'checked' : '';
    $ceremonyUrn = intval($result['workOrder']['ceremonyUrn']) == 1 ? 'checked' : '';
    $inhumationAttendOpening = intval($result['workOrder']['inhumationAttendOpening']) == 1 ? 'checked' : '';
    $inhumationIronCross = intval($result['workOrder']['inhumationIronCross']) == 1 ? 'checked' : '';
    $inhumationReburial1 = intval($result['workOrder']['inhumationReburial1']) == 1 ? 'checked' : '';
    $inhumationReburial2 = intval($result['workOrder']['inhumationReburial2']) == 1 ? 'checked' : '';
    $inhumationReburial3 = intval($result['workOrder']['inhumationReburial3']) == 1 ? 'checked' : '';
    $inhumationRemoveTombstone = intval($result['workOrder']['inhumationRemoveTombstone']) == 1 ? 'checked' : '';
    $crematoriumIntroduction = intval($result['expedient']['crematoriumIntroduction']) == 1 ? 'checked' : '';
    $crematoriumWaitOnRoom = intval($result['expedient']['crematoriumWaitOnRoom']) == 1 ? 'checked' : '';
    $crematoriumVaseBio = intval($result['expedient']['crematoriumVaseBio']) == 1 ? 'checked' : '';
    $translationViaRoad = intval($result['expedient']['moveVia']) == 0 ? 'checked' : '';
    $translationViaAir = intval($result['expedient']['moveVia']) == 1 ? 'checked' : '';

    $comunicationWebConfirm = $result['expedient']['webConfirm'] == null || $result['expedient']['webConfirm'] == 0 ? '' : 'checked';
    $comunicationShowAgeObituaryWeb = $result['expedient']['showAgeObituaryWeb'] == null || $result['expedient']['showAgeObituaryWeb'] == 1 ? '' : 'checked';
    $comunicationShowFinalDestinationWeb = $result['expedient']['showFinalDestinationWeb'] == null || $result['expedient']['showFinalDestinationWeb'] == 0 ? '' : 'checked';
    $comunicationShowVelationWeb = $result['expedient']['showVelationWeb'] == null || $result['expedient']['showVelationWeb'] == 0 ? '' : 'checked';
    $comunicationShowCeremonyWeb = $result['expedient']['showCeremonyWeb'] == null || $result['expedient']['showCeremonyWeb'] == 0 ? '' : 'checked';

    // Communication items
    $comunicationItems = '';
    if(count($result['communication']) > 0){
        foreach($result['communication'] as $index=>$item){

            $indexItem = ($index + 1);
            $dateItem = '';
            if($item['date'] != null && $item['date'] != ''){
                $dateItem = $utils->fechaCastellano4(date('Y-m-d', $item['date']));
            }
            $photoItem = intval($item['photo']) == 1 ? 'checked' : '';

            $comunicationItems.= '
                <div class="flex justify-content-space-between">
                    <div class="flex width-37">
                        <p style="white-space: nowrap">Periódico:</p>
                        <input class="flex width-75" type="text" name="periodico_'.$indexItem.'" value="'.$item['product_name'].'">
                    </div>
                    <div class="flex width-37">
                        <p style="white-space: nowrap">Modelo:</p>
                        <input class="flex width-79" type="text" name="modelo_'.$indexItem.'" value="'.$item['model_name'].'">
                    </div>
                    <div class="flex width-19">
                        <p style="white-space: nowrap">Fecha:</p>
                        <input class="flex width-63" type="text" name="fecha_'.$indexItem.'" value="'.$dateItem.'">
                    </div>
                    <div class="flex justify-content-center width-7">
                        <p style="white-space: nowrap">Foto:</p>
                        <input class="flex width-20" type="checkbox" name="foto_'.$indexItem.'" '.$photoItem .'>
                    </div>
                </div>
            ';
        }
    }

    // Complete with blanks
    if(count($result['communication']) < 3){
        for($i = count($result['communication']); $i < 3; $i++){
            $comunicationItems.= '
                <div class="flex justify-content-space-between">
                    <div class="flex width-37">
                        <p style="white-space: nowrap">Periódico:</p>
                        <input class="flex width-75" type="text" name="periodico_'.$i.'" value="">
                    </div>
                    <div class="flex width-37">
                        <p style="white-space: nowrap">Modelo:</p>
                        <input class="flex width-79" type="text" name="modelo_'.$i.'" value="">
                    </div>
                    <div class="flex width-19">
                        <p style="white-space: nowrap">Fecha:</p>
                        <input class="flex width-63" type="text" name="fecha_'.$i.'" value="">
                    </div>
                    <div class="flex justify-content-center width-7">
                        <p style="white-space: nowrap">Foto:</p>
                        <input class="flex width-20" type="checkbox" name="foto_'.$i.'">
                    </div>
                </div>
            ';
        }
    }

    // Flowers items
    $flowersItems = '';
    if(count($result['flowers']) > 0){
        foreach($result['flowers'] as $index=>$item){

            $indexItem = ($index + 1);
            $dateItem = '';
            if($item['date'] != null && $item['date'] != ''){
                $dateItem = $utils->fechaCastellano4(date('Y-m-d', $item['date']));
            }
            if($item['time'] != null && $item['time'] != ''){
                $dateItem .= ' ' . date('H:i', $item['time']);
            }

            $flowersItems.= '
                <div class="flex justify-content-space-between">
                    <div class="flex width-30">
                        <p style="white-space: nowrap">Prov.:</p>
                        <input class="flex width-78" type="text" name="prov_'.$indexItem.'" value="'.$item['supplier_name'].'">
                    </div>
                    <div class="flex width-40">
                        <p style="white-space: nowrap">Mod.:</p>
                        <input class="flex width-83" type="text" name="mod_'.$indexItem.'" value="'.$item['model_name'].'">
                    </div>
                    <div class="flex width-30">
                        <p style="white-space: nowrap">Fecha:</p>
                        <input class="flex width-77" type="text" name="f_h_'.$indexItem.'" value="'.$dateItem.'">
                    </div>
                </div>
                <div class="flex justify-content-space-between">
                    <div class="flex width-100">
                        <p style="white-space: nowrap">Txt:</p>
                        <input class="flex width-95" type="text" name="txt_'.$indexItem.'" value="'.$item['texts'].'">
                    </div>
                </div>
            ';
        }
    }

    // Complete with blanks
    if(count($result['flowers']) < 8){
        for($i = count($result['flowers']); $i < 8; $i++){
            $flowersItems.= '
                <div class="flex justify-content-space-between">
                    <div class="flex width-30">
                        <p style="white-space: nowrap">Prov.:</p>
                        <input class="flex width-78" type="text" name="prov_'.$i.'" value="">
                    </div>
                    <div class="flex width-40">
                        <p style="white-space: nowrap">Mod.:</p>
                        <input class="flex width-83" type="text" name="mod_'.$i.'" value="">
                    </div>
                    <div class="flex width-30">
                        <p style="white-space: nowrap">Fecha:</p>
                        <input class="flex width-77" type="text" name="f_h_'.$i.'" value="">
                    </div>
                </div>
                <div class="flex justify-content-space-between">
                    <div class="flex width-100">
                        <p style="white-space: nowrap">Txt:</p>
                        <input class="flex width-95" type="text" name="txt_'.$i.'" value="">
                    </div>
                </div>
            ';
        }
    }


    //Cars
    $carsData = [];
    $carsData[0]['personal'] = ''; 
    $carsData[0]['license'] = ''; 
    $carsData[1]['personal'] = ''; 
    $carsData[1]['license'] = ''; 
    $carsData[2]['personal'] = ''; 
    $carsData[2]['license'] = ''; 
    $carsData[3]['personal'] = ''; 
    $carsData[3]['license'] = ''; 
    $carsData[4]['personal'] = ''; 
    $carsData[4]['license'] = ''; 
    $carsData[5]['personal'] = ''; 
    $carsData[5]['license'] = ''; 
    foreach($result['cars'] as $index=>$item){
        $carsData[$index]['personal'] = $item['driver_name'];
        $carsData[$index]['license'] = $item['car'];
    }

    // Documents sections
    $deceasedSection = '
        <div class="custom-table">
            <div class="flex justify-content-space-between">
                <div class="flex width-60">
                    <p>Fallecido:</p>
                    <input class="flex width-85 '.$colorInputs.'" type="text" name="fallecido" value="'.$result['expedient']['deceasedName']. ' ' . $result['expedient']['deceasedSurname'].'">
                </div>
                <div class="flex width-15">
                    <p>DNI:</p>
                    <input class="flex width-50" type="text" name="dni" value="'.$result['expedient']['deceasedNIF'].'">
                </div>
                <div class="flex width-10">
                    <p>Edad:</p>
                    <input class="flex width-30" type="text" name="edad" value="'.$age.'">
                </div>
                <div class="flex width-10 justify-content-center">
                    <p>Judicial:</p>
                    <input class="flex width-10 checkbox" type="checkbox" name="judicial" '.$isJudicial.'>
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-25">
                    <p>Falleció el:</p>
                    <input class="flex width-60" type="text" name="dia_fallecimiento" value="'.$deceasedDate.'">
                </div>
                <div class="flex width-10">
                    <p>a las:</p>
                    <input class="flex width-40" type="text" name="hora_fallecimiento" value="'.$deceasedTime.'">
                </div>
                <div class="flex width-25">
                    <p>en:</p>
                    <input class="flex width-83" type="text" name="lugar_fallecimiento" value="'.$result['expedient']['deceasedLocation'].'">
                </div>
                <div class="flex width-40">
                    <p style="white-space: nowrap">a causa de:</p>
                    <input class="flex width-74" type="text" name="causa_fallecimiento" value="'.$result['expedient']['deceasedCause'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-50">
                    <p>Declarante:</p>
                    <input class="flex width-75" type="text" name="declarante" value="'.$result['expedient']['family_contact'].'">
                </div>
                <div class="flex width-30">
                    <p>Parentesco:</p>
                    <input class="flex width-60" type="text" name="parentesco" value="'.$result['expedient']['familyContactRelationship'].'">
                </div>
                <div class="flex width-20">
                    <p>Teléfono:</p>
                    <input class="flex width-56" type="text" name="telefono" value="'.$result['expedient']['familyContactPhone'].'">
                </div>
            </div>
        </div>
    ';

    $arkSection = '
        <div class="custom-table">
            <div class="flex justify-content-space-between">
                <div class="flex width-100">
                    <p>Modelo arca:</p>
                    <input class="flex width-89 '.$colorInputs.'" type="text" name="modelo_arca" value="'.$result['expedient']['arkName'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-6">
                    <p>Cruz:</p>
                    <input class="flex width-80 checkbox" type="checkbox" name="cruz" '.$arkCross.'>
                </div>
                <div class="flex width-7">
                    <p>Cristo:</p>
                    <input class="flex width-80" type="checkbox" name="cristo" '.$arkJesus.'>
                </div>
                <div class="flex width-87">
                    <p>Otro:</p>
                    <input class="flex width-1" type="checkbox" name="otro_check" '.$arkOther.'>
                    <input class="flex width-92" type="text" name="otro" value="'.$result['workOrder']['arkOtherName'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-75">
                    <p>Tanatoestética:</p>
                    <input class="flex width-80" type="text" name="tanatoestetica" value="'.$result['workOrder']['arkAesthetics'].'">
                </div>
                <div class="flex width-7">
                    <p>Foto:</p>
                    <input class="flex width-80" type="checkbox" name="foto" '.$arkClothesPhoto.'>
                </div>
                <div class="flex width-10">
                    <p>Rosario:</p>
                    <input class="flex width-80" type="checkbox" name="rosario" '.$arkClothesRosary.'>
                </div>
                <div class="flex width-8">
                    <p>Propio:</p>
                    <input class="flex width-78" type="checkbox" name="propio" '.$arkClothesOwn.'>
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-75">
                    <p>Ropa:</p>
                    <input class="flex width-90" type="text" name="ropa" value="'.$result['workOrder']['arkClothes'].'">
                </div>
                <div class="flex justify-content-center width-15">
                    <p style="white-space: nowrap">Desechar ropa:</p>
                </div>
                <div class="flex width-5">
                    <p>Si</p>
                    <input class="flex width-80" type="checkbox" name="ropasi" '.$arkClothesYes.'>
                </div>
                <div class="flex width-5">
                    <p>No</p>
                    <input class="flex width-78" type="checkbox" name="ropano" '.$arkClothesNo.'>
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-70">
                    <p>Objetos person.:</p>
                    <input class="flex width-78" type="text" name="objetos_personales" value="'.$result['workOrder']['arkPersonalItems'].'">
                </div>
                <div class="flex width-15">
                    <p>Marcapasos:</p>
                    <input class="flex width-50" type="checkbox" name="marcapasos" '.$arkPersonalItemsPacemaker.'>
                </div>
                <div class="flex width-15 justify-content-flex-end">
                    <p>Manto/Sudario:</p>
                    <input class="flex width-10" type="checkbox" name="propio" '.$arkPersonalItemsShroud.'>
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-13">
                    <p>Tanatoplastia:</p>
                    <input class="flex" type="checkbox" name="tanatoplastia" '.$arkThanatoplasty.'>
                </div>
                <div class="flex width-35">
                    <p style="white-space: nowrap">Fecha y hora:</p>
                    <input class="flex width-65" type="text" name="fecha_hora_tanatoplastia" value="'.$arkThanatoplastyDateTime.'">
                </div>
                <div class="flex width-13">
                    <p>Tanatopraxia:</p>
                    <input class="flex " type="checkbox" name="tanatopraxia" '.$arkThanatopraxy.'>
                </div>
                <div class="flex width-35">
                    <p style="white-space: nowrap">Fecha y hora:</p>
                    <input class="flex width-67" type="text" name="fecha_hora_tanatopraxia" value="'.$arkThanatopraxyDateTime.'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-13">
                    <p>C. Transitoria:</p>
                    <input class="flex" type="checkbox" name="transitoria" '.$arkCTransient.'>
                </div>
                <div class="flex width-35">
                    <p style="white-space: nowrap">Fecha y hora:</p>
                    <input class="flex width-65" type="text" name="fecha_hora_transitoria" value="'.$arkCTransientDateTime.'">
                </div>
                <div class="flex width-13">
                    <p>Embalsmto.:</p>
                    <input class="flex " type="checkbox" name="embalsamiento" '.$arkEmbalmment.'>
                </div>
                <div class="flex width-35">
                    <p style="white-space: nowrap">Fecha y hora:</p>
                    <input class="flex width-67" type="text" name="fecha_hora_embalsamiento" value="'.$arkEmbalmmentDateTime.'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-72">
                    <p>Tanatopractor:</p>
                    <input class="flex width-81" type="text" name="tanatopractor" value="'.$result['workOrder']['arkMortuaryPractitioner'].'">
                </div>
                <div class="flex width-28">
                    <p>DNI:</p>
                    <input class="flex width-83" type="text" name="dni_tanatopractor" value="'.$result['workOrder']['arkMortuaryPractitionerNif'].'">
                </div>
            </div>
        </div>  
    ';

    $velationSection = '
        <div class="custom-table">
            <div class="flex justify-content-space-between">
                <div class="flex width-60">
                    <p>Velación:</p>
                    <input class="flex width-85" type="text" name="modelo_velacion" value="'.$result['expedient']['deceasedMortuaryName'].'">
                </div>
                <div class="flex width-40">
                    <p>Sala:</p>
                    <input class="flex width-86" type="text" name="sala" value="'.$result['expedient']['deceasedRoom'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-30">
                    <p>Fecha V.1.:</p>
                    <input class="flex width-66" type="text" name="fecha_v1" value="'.$startVelationDate1.'">
                </div>
                <div class="flex width-20">
                    <p>Hora inicio V.1:</p>
                    <input class="flex width-33" type="text" name="fecha_v1_inicio" value="'.$startVelationTime1.'">
                </div>
                <div class="flex width-30">
                    <p>Fecha fin V.1.:</p>
                    <input class="flex width-58" type="text" name="fecha_v1_fin" value="'.$endVelationDate1.'">
                </div>
                <div class="flex width-20">
                    <p>Hora fin V.1.:</p>
                    <input class="flex width-42" type="text" name="fecha_v2" value="'.$endVelationTime1.'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-30">
                    <p>Fecha V.2.:</p>
                    <input class="flex width-66" type="text" name="fecha_v2" value="'.$startVelationDate2.'">
                </div>
                <div class="flex width-20">
                    <p>Hora inicio V.2:</p>
                    <input class="flex width-33" type="text" name="fecha_v2_inicio" value="'.$startVelationTime2.'">
                </div>
                <div class="flex width-30">
                    <p>Fecha fin V.2.:</p>
                    <input class="flex width-58" type="text" name="fecha_v2_fin" value="'.$endVelationDate2.'">
                </div>
                <div class="flex width-20">
                    <p>Hora fin V.2.:</p>
                    <input class="flex width-42" type="text" name="fecha_v2" value="'.$endVelationTime2.'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-20">
                    <p>Catering:</p>
                    <input class="flex" type="checkbox" name="catering" '.$velationCatering.'>
                </div>
                    <div class="flex width-20">
                    <p>Pantalla Recuerdos:</p>
                    <input class="flex" type="checkbox" name="pantalla_recuerdos" '.$velationMemoriesScreen.'>
                </div>
                    <div class="flex width-20 align-self-center">
                    <p>Velación privada:</p>
                    <input class="flex" type="checkbox" name="velación_privada" '.$velationPrivate.'>
                </div>
                    <div class="flex width-20 align-self-center">
                    <p>Arca cerrada:</p>
                    <input class="flex" type="checkbox" name="arca_cerrada" '.$velationArkClosed.'>
                </div>
                    <div class="flex width-20 align-self-center">
                    <p>Marco de Fotos:</p>
                    <input class="flex" type="checkbox" name="marco_fotos" '.$velationPhotoFrame.'>
                </div>
            </div>
        </div>                
    ';

    $ceremonySection = '
        <div class="custom-table">
            <div class="flex justify-content-space-between">
                <div class="flex width-65">
                    <p style="white-space: nowrap">Lugar ceremonia:</p>
                    <input class="flex width-75 '.$colorInputs.'" type="text" name="lugar_ceremonia" value="'.$churchName.'">
                </div>
                <div class="flex width-25">
                    <p>Fecha:</p>
                    <input class="flex width-73 '.$colorInputs.'" type="text" name="fecha_ceremonia" value="'.$ceremonyDate.'">
                </div>
                <div class="flex width-10">
                    <p>Hora:</p>
                    <input class="flex width-37 '.$colorInputs.'" type="text" name="hora_ceremonia" value="'.$ceremonyTime.'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-10">
                    <p>Responso:</p>
                    <input class="flex" type="checkbox" name="responso" '.$ceremonyResponse.'>
                </div>
                <div class="flex width-40">
                    <p>Lugar:</p>
                    <input class="flex width-83 '.$colorInputs.'" type="text" name="lugar_responso" value="'.$result['workOrder']['ceremonyResponsePlace'].'">
                </div>
                <div class="flex width-20">
                    <p style="white-space: nowrap">Familia espera en Iglesia:</p>
                    <input class="flex" type="checkbox" name="familia_espera_iglesia" '.$ceremonyFamilyWaitChurch.'>
                </div>
                <div class="flex width-27">
                    <p style="white-space: nowrap">Servicio musical:</p>
                    <input class="flex width-48 '.$colorInputs.'" type="text" name="servicio_musical" value="'.$result['workOrder']['ceremonyMusicalService'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-13">
                    <p style="white-space: nowrap">Cuerpo presente:</p>
                    <input class="flex" type="checkbox" name="" '.$ceremonyBodyPresent.'>
                </div>
                    <div class="flex width-5">
                    <p>Urna:</p>
                    <input class="flex" type="checkbox" name="" '.$ceremonyUrn.'>
                </div>
                <div class="flex width-50">
                    <p>Quien la lleva:</p>
                        <input class="flex width-75 '.$colorInputs.'" type="text" name="" value="'.$result['workOrder']['ceremonyWhoTakesUrn'].'">
                </div>
                <div class="flex width-25">
                    <p>Pago iglesia:</p>
                    <input class="flex width-50 '.$colorInputs.'" type="text" name="" value="'.$result['workOrder']['ceremonyChurchPayment'].'">
                    <p> €</p>
                </div>

            </div>
        </div>
    ';

    $communicationSection = '
        <div class="custom-table">
            <div class="flex justify-content-center">
                <div class="flex justify-content-center width-100">
                    <p style="text-decoration: underline; text-align: center">COMUNICACIÓN</p>
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-13">
                    <p>Esquela web:</p>
                    <input class="flex" type="checkbox" name="esquela_web" '.$comunicationWebConfirm.'>
                </div>
                <div class="flex width-12">
                    <p style="white-space: nowrap">NO tienda:</p>
                    <input class="flex" type="checkbox" name="no_tienda">
                </div>
                <div class="flex width-12">
                    <p>NO pésames:</p>
                    <input class="flex" type="checkbox" name="no_pesame" value="">
                </div>
                <div class="flex width-15">
                    <p style="white-space: nowrap">NO mostrar edad:</p>
                    <input class="flex" type="checkbox" name="no_mostrar_edad" '.$comunicationShowAgeObituaryWeb.'>
                </div>
                <div class="flex width-15">
                    <p>NO destino final:</p>
                    <input class="flex" type="checkbox" name="no_destino_final" '.$comunicationShowFinalDestinationWeb.'>
                </div>
                <div class="flex width-12">
                    <p>NO velación:</p>
                    <input class="flex" type="checkbox" name="no_velacion" '.$comunicationShowVelationWeb.'>
                </div>
                <div class="flex width-13">
                    <p style="white-space: nowrap">NO ceremonia:</p>
                    <input class="flex" type="checkbox" name="no_ceremonia" '.$comunicationShowCeremonyWeb.'>
                </div>
            </div>
            '.$comunicationItems.'
        </div>
    ';

    $flowersSection = '
        <div class="custom-table">
            <div class="flex justify-content-center">
                <div class="flex justify-content-center width-100">
                    <p style="text-decoration: underline; text-align: center">ARREGLOS FLORALES</p>
                </div>
            </div>
            '.$flowersItems.'
        </div>
    ';

    $clientSection = '
        <div class="custom-table">
            <div class="flex justify-content-space-between">
                <div class="flex width-40">
                    <p>Tipo de cliente:</p>
                    <input class="flex width-67" type="text" name="cremacion_tipo_cliente" value="'.$result['expedient']['client_type_name'].'">
                </div>
                <div class="flex width-60">
                    <p>Cliente:</p>
                    <input class="flex width-87" type="text" name="cremacion_cliente" value="'.$result['expedient']['client_name'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-60">
                    <p>Tramitador:</p>
                    <input class="flex width-82" type="text" name="cremacion_tramitador" value="'.$result['expedient']['family_assistance'].'">
                </div>
                <div class="flex width-40">
                    <p>Comercial:</p>
                    <input class="flex width-75" type="text" name="cremacion_comercial" value="'.$result['workOrder']['clientTracing'].'">
                </div>
            </div>
        </div>
    ';

    $carsSection = '
        <div class="custom-table">
            <div class="flex">
                <div class="flex justify-content-space-between">
                    <div class="flex width-100">
                        <p>Personal y vehículo:</p>
                    </div>
                </div>
                <div class="flex-row width-50">
                    <div class="flex justify-content-space-between width-89">
                        <div class="flex width-52">
                            <input class="flex width-90" type="text" name="porteador_1" value="'. $carsData[0]['personal'].'">
                        </div>
                        <div class="flex width-42">
                            <input class="flex width-90 type="text" name="vehiculo_1" value="'. $carsData[0]['license'].'">
                        </div>
                        <div class="flex width-52">
                            <input class="flex width-90" type="text" name="porteador_2" value="'. $carsData[1]['personal'].'">
                        </div>
                        <div class="flex width-42">
                            <input class="flex width-86" type="text" name="vehiculo_2" value="'. $carsData[1]['license'].'">
                        </div>
                    </div>
                    <div class="flex justify-content-space-between width-89">
                        <div class="flex width-52">
                            <input class="flex width-90" type="text" name="porteador_3" value="'. $carsData[2]['personal'].'">
                        </div>
                        <div class="flex width-42">
                            <input class="flex width-90" type="text" name="vehiculo_3" value="'. $carsData[2]['license'].'">
                        </div>
                        <div class="flex width-52">
                            <input class="flex width-90" type="text" name="porteador_4" value="'. $carsData[3]['personal'].'">
                        </div>
                        <div class="flex width-42">
                            <input class="flex width-86" type="text" name="vehiculo_4" value="'. $carsData[3]['license'].'">
                        </div>
                    </div>
                    <div class="flex justify-content-space-between width-89">
                        <div class="flex width-52">
                            <input class="flex width-90" type="text" name="porteador_5" value="'. $carsData[4]['personal'].'">
                        </div>
                        <div class="flex width-42">
                            <input class="flex width-90" type="text" name="vehiculo_5" value="'. $carsData[4]['license'].'">
                        </div>
                        <div class="flex width-23">
                            <p style="white-space: nowrap">Sala nº:</p>
                            <input class="flex width-20" type="text" name="cremacion_sala" value="'.$result['workOrder']['carrierRoom'].'">
                        </div>
                        <div class="flex width-90">
                            <p>Día:</p>
                            <input class="flex width-65" type="text" name="cremacion_dia" value="'.$funeralDate.'">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ';

    $inhumationSection = '
        <div class="custom-table">
            <div class="flex justify-content-space-between">
                <div class="flex width-50">
                    <p style="white-space: nowrap">Inhumación:</p>
                    <input class="flex width-78" type="text" name="lugar_inhumacion" value="'.$cemetery.'">
                </div>
                <div class="flex width-25">
                    <p>Fecha:</p>
                    <input class="flex width-72" type="text" name="fecha_inhumacion" value="'.$funeralDateBurial.'">
                </div>
                <div class="flex width-25">
                    <p>Hora:</p>
                    <input class="flex width-75" type="text" name="hora_inhumacion" value="'.$funeralTime.'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-20">
                    <p style="white-space: nowrap">Ud. entrmto.:</p>
                    <input class="flex width-38" type="text" name="lugar_inhumacion" value="'.$result['expedient']['niche'].'">
                </div>
                <div class="flex width-20">
                    <p>Régimen:</p>
                    <input class="flex width-55" type="text" name="fecha_inhumacion" value="'.$result['expedient']['niche_regime'].'">
                </div>
                <div class="flex width-8">
                    <p>Nº:</p>
                    <input class="flex width-48" type="text" name="hora_inhumacion" value="'.$result['expedient']['funeralNicheNumber'].'">
                </div>
                <div class="flex width-27">
                    <p>Calle:</p>
                    <input class="flex width-75" type="text" name="hora_inhumacion" value="'.$result['workOrder']['inhumationStreet'].'">
                </div>
                <div class="flex width-15">
                    <p>Bloque:</p>
                    <input class="flex width-50" type="text" name="hora_inhumacion" value="'.$result['workOrder']['inhumationBlock'].'">
                </div>
                <div class="flex width-10">
                    <p>Altura:</p>
                    <input class="flex width-25" type="text" name="hora_inhumacion" value="'.$result['expedient']['nicheHeight'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-12">
                    <p style="white-space: nowrap">Asiste apert.:</p>
                    <input class="flex" type="checkbox" name="" '.$inhumationAttendOpening.'>
                </div>
                <div class="flex width-35">
                    <p>Decl./Otro:</p>
                    <input class="flex width-72" type="text" name="" value="'.$result['workOrder']['inhumationDeclarant'].'">
                </div>
                <div class="flex width-15">
                    <p>Telf.:</p>
                    <input class="flex width-60" type="text" name="" value="'.$result['workOrder']['inhumationDeclarantPhone'].'">
                </div>
                <div class="flex width-23">
                    <p>Fecha:</p>
                    <input class="flex width-70" type="text" name="" value="'.$inhumationDeclarantDate.'">
                </div>
                <div class="flex width-15">
                    <p>Hora:</p>
                    <input class="flex width-57" type="text" name="" value="'.$inhumationDeclarantTime.'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-25">
                    <p style="white-space: nowrap">Complementos Und. de Entmto.:</p>
                </div>
                <div class="flex width-15">
                    <p style="white-space: nowrap">Cruz de Hierro:</p>
                    <input class="flex" type="checkbox" name="" '.$inhumationIronCross.'>
                </div>
                <div class="flex width-60">
                    <p style="white-space: nowrap">Otro:</p>
                    <input class="underline flex width-90" type="text" name="" value="'.$result['workOrder']['inhumationIronCrossOther'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-35">
                    <p style="white-space: nowrap">Exhumacion 1:</p>
                    <input class="flex width-63" type="text" name="" value="'.$result['expedient']['exhumation1'].'">
                </div>
                <div class="flex width-25">
                    <p style="white-space: nowrap">Fallecido el:</p>
                    <input class="flex width-55" type="text" name="" value="'.$exhumationDate1.'">
                </div>
                <div class="flex width-11">
                    <p style="white-space: nowrap">Reinhumar:</p>
                    <input class="flex" type="checkbox" name="" '.$inhumationReburial1.'>
                </div>
                <div class="flex width-29">
                    <p style="white-space: nowrap">Nota:</p>
                    <input class="flex width-78" type="text" name="" value="'.$result['workOrder']['inhumationNotes1'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-35">
                    <p style="white-space: nowrap">Exhumacion 2:</p>
                    <input class="flex width-63" type="text" name="" value="'.$result['expedient']['exhumation2'].'">
                </div>
                <div class="flex width-25">
                    <p style="white-space: nowrap">Fallecido el:</p>
                    <input class="flex width-55" type="text" name="" value="'.$exhumationDate2.'">
                </div>
                <div class="flex width-11">
                    <p style="white-space: nowrap">Reinhumar:</p>
                    <input class="flex" type="checkbox" name="" '.$inhumationReburial2.'>
                </div>
                <div class="flex width-29">
                    <p style="white-space: nowrap">Nota:</p>
                    <input class="flex width-78" type="text" name="" value="'.$result['workOrder']['inhumationNotes2'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-35">
                    <p style="white-space: nowrap">Exhumacion 3:</p>
                    <input class="flex width-63" type="text" name="" value="'.$result['expedient']['exhumation3'].'">
                </div>
                <div class="flex width-25">
                    <p style="white-space: nowrap">Fallecido el:</p>
                    <input class="flex width-55" type="text" name="" value="'.$exhumationDate3.'">
                </div>
                <div class="flex width-11">
                    <p style="white-space: nowrap">Reinhumar:</p>
                    <input class="flex" type="checkbox" name="" '.$inhumationReburial3.'>
                </div>
                <div class="flex width-29">
                    <p style="white-space: nowrap">Nota:</p>
                    <input class="flex width-78" type="text" name="" value="'.$result['workOrder']['inhumationNotes3'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-55">
                    <p style="white-space: nowrap">Titular de la propiedad:</p>
                    <input class="flex width-65" type="text" name="" value="'.$result['expedient']['exhumation'].'">
                </div>
                <div class="flex width-15">
                    <p style="white-space: nowrap">Retirar lápida:</p>
                    <input class="flex" type="checkbox" name="" '.$inhumationRemoveTombstone.'>
                </div>
                <div class="flex width-30">
                    <p style="white-space: nowrap">Nota:</p>
                    <input class="flex width-79" type="text" name="" value="'.$result['workOrder']['inhumationRemoveTombstoneNote'].'">
                </div>
            </div>
            <div class="flex align-self-top">
                <div class="flex-row width-100">
                    <p style="text-decoration: underline;">Notas:</p>
                    <textarea style="height:100px" class="lined-textarea flex">'.$result['workOrder']['inhumationNotes'].'</textarea>
                </div>
            </div>
        </div>
    ';

    $crematorySection = '
        <div class="custom-table">
            <div class="flex justify-content-space-between">
                <div class="flex width-30">
                    <p style="white-space: nowrap">Crematorio:</p>
                    <input class="flex width-64" type="text" name="" value="'.$result['expedient']['crematoriumName'].'">
                </div>
                <div class="flex width-24">
                    <p>Fecha inicio:</p>
                    <input class="flex width-53" type="text" name="" value="'.$crematoriumEntryDate.'">
                </div>
                <div class="flex width-13">
                    <p>H. inicio:</p>
                    <input class="flex width-36" type="text" name="" value="'.$crematoriumEntryTime.'">
                </div>
                <div class="flex width-22">
                    <p>Fecha fin:</p>
                    <input class="flex width-58" type="text" name="lugar_responso" value="'.$crematoriumLeavingDate.'">
                </div>
                <div class="flex width-11">
                    <p>H. fin:</p>
                    <input class="flex width-43" type="text" name="lugar_responso" value="'.$crematoriumLeavingTime.'">
                </div>

            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-40">
                    <p style="white-space: nowrap">Fecha recogida cenizas:</p>
                    <input class="flex width-51" type="text" name="" value="'.$crematoryCollectingAshesDate.'">
                </div>
                <div class="flex width-40">
                    <p style="white-space: nowrap">H. recogida:</p>
                    <input class="flex width-73" type="text" name="" value="'.$crematoryCollectingAshesTime.'">
                </div>
                <div class="flex width-20">
                    <p style="white-space: nowrap">Id.:</p>
                    <input class="flex width-80" type="text" name="" value="'.$result['expedient']['trazabilityId'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-40">
                    <p style="white-space: nowrap">Técnico:</p>
                    <input class="flex width-80" type="text" name="" value="'.$result['expedient']['crematorium_technical'].'">
                </div>
                <div class="flex width-40">
                    <p style="white-space: nowrap">Persona de contacto:</p>
                    <input class="flex width-56" type="text" name="" value="'.$result['expedient']['crematoriumContactPerson'].'">
                </div>
                <div class="flex width-20">
                    <p style="white-space: nowrap">Telf. contacto:</p>
                    <input class="flex width-39" type="text" name="" value="'.$result['expedient']['crematoriumContactPhonePerson'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-25">
                    <p style="white-space: nowrap">Asiste familia introducción:</p>
                    <input class="flex" type="checkbox" name="" '.$crematoriumIntroduction.'>
                </div>
                <div class="flex width-30">
                    <p style="white-space: nowrap">Hora de llegada de la familia:</p>
                    <input class="flex width-20" type="text" name="" value="'.$crematoriumArriveTime.'">
                </div>
                <div class="flex width-15">
                    <p style="white-space: nowrap">Esperan en sala:</p>
                    <input class="flex" type="checkbox" name="" '.$crematoriumWaitOnRoom.'>
                </div>
                <div class="flex justify-content-center width-10">
                    <p style="white-space: nowrap">BIO:</p>
                    <input class="flex width-10" type="checkbox" name="" '.$crematoriumVaseBio.'>
                </div>
                <div class="flex width-20">
                    <p style="white-space: nowrap">Urna:</p>
                    <input class="flex width-72" type="text" name="" '.$crematoriumVaseBio.'>
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-60">
                    <p style="white-space: nowrap">Entregar cenizas a:</p>
                    <input class="flex width-73" type="text" name="" value="'.$result['expedient']['authName'].'">
                </div>
                <div class="flex width-20">
                    <p style="white-space: nowrap">DNI:</p>
                    <input class="flex width-73" type="text" name="" value="'.$result['expedient']['authDni'].'">
                </div>
                <div class="flex width-20">
                    <p style="white-space: nowrap">Telf:</p>
                    <input class="flex width-76" type="text" name="" value="'.$result['expedient']['authContactPhone'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-35">
                    <p style="white-space: nowrap">Fecha de entrega de cenizas:</p>
                    <input class="flex width-33" type="text" name="" value="'.$authDate.'">
                </div>
                <div class="flex width-30">
                    <p style="white-space: nowrap">Hora de entrega:</p>
                    <input class="flex width-52" type="text" name="" value="'.$authTime.'">
                </div>
                <div class="flex width-35">
                    <p style="white-space: nowrap">Lugar:</p>
                    <input class="flex width-82" type="text" name="" value="'.$result['expedient']['authPlace'].'">
                </div>
            </div>
        </div>
    ';

    $translationSection = '
         <div class="custom-table">
            <div class="flex justify-content-space-between">
                <div class="flex width-70">
                    <p style="white-space: nowrap">Funeraria de destino:</p>
                    <input class="flex width-75" type="text" name="" value="'.$result['expedient']['moveFuneralHome'].'">
                </div>
                <div class="flex width-30">
                    <p>Telf.:</p>
                    <input class="flex width-83" type="text" name="" value="'.$result['expedient']['moveFuneralHomePhone'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-40">
                    <p style="white-space: nowrap">Persona de contacto:</p>
                    <input class="flex width-56" type="text" name="" value="'.$result['expedient']['moveContactPerson'].'">
                </div>
                <div class="flex width-40">
                    <p>Mail:</p>
                    <input class="flex width-87" type="text" name="" value="'.$result['workOrder']['translationMoveContactEmail'].'">
                </div>
                <div class="flex width-20">
                    <p>Telf.:</p>
                    <input class="flex width-74" type="text" name="" value="'.$result['expedient']['moveContactPhone'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-40">
                    <p style="white-space: nowrap">Provincia origen:</p>
                    <input class="flex width-64" type="text" name="" value="'.$result['expedient']['moveCollectionProvince'].'">
                </div>
                <div class="flex width-30">
                    <p>Localidad:</p>
                    <input class="flex width-69" type="text" name="" value="'.$result['expedient']['moveCollectionLocality'].'">
                </div>
                <div class="flex width-30">
                    <p>Dirección:</p>
                    <input class="flex width-71" type="text" name="" value="'.$result['expedient']['moveCollectionAddress'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-30">
                    <p style="white-space: nowrap">País de destino:</p>
                    <input class="flex width-55" type="text" name="" value="'.$result['workOrder']['translationMoveDestinationCountry'].'">
                </div>
                <div class="flex width-70">
                    <p>Dirección:</p>
                    <input class="flex width-87" type="text" name="" value="'.$moveDestinationAddress.'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-10">
                    <p style="white-space: nowrap">Depósito:</p>
                    <input class="flex" type="checkbox" name="" value="'.$result['workOrder']['translationDepositAirport'].'">
                </div>
                <div class="flex width-45">
                    <p style="white-space: nowrap">Fecha entrega depósito:</p>
                    <input class="flex width-50" type="text" name="" value="'.$translationDepositDate.'">
                </div>
                <div class="flex width-30">
                    <p style="white-space: nowrap">Hora entrega depósito:</p>
                    <input class="flex width-34" type="text" name="" value="'.$translationDepositTime.'">
                </div>
                <div class="flex width-15">
                    <p>Peso:</p>
                    <input class="flex width-40" type="text" name="" value="'.$result['workOrder']['translationDepositWeight'].'">
                    <p>Kg.:</p>
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-100">
                    <input class="flex width-1" type="checkbox" name="" '.$translationViaRoad.'>
                    <p style="white-space: nowrap">Vía terrestre:</p>
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-33">
                    <p style="white-space: nowrap">Vehículo de traslado:</p>
                    <input class="flex width-49" type="text" name="" value="'.$carCollection2Road.'">
                </div>
                <div class="flex width-33">
                    <p style="white-space: nowrap">Personal 1:</p>
                    <input class="flex width-70" type="text" name="" value="'.$staffTransfer1Road.'">
                </div>
                <div class="flex width-33">
                    <p style="white-space: nowrap">Personal 2:</p>
                    <input class="flex width-70" type="text" name="" value="'.$staffTransfer2Road.'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-50">
                    <p style="white-space: nowrap">Fecha y hora de salida:</p>
                    <input class="flex width-60" type="text" name="" value="'.$translationRoadLeavingDateTime.'">
                </div>
                <div class="flex width-50">
                    <p style="white-space: nowrap">Fecha y hora de llegada:</p>
                    <input class="flex width-60" type="text" name="" value="'.$translationRoadArrivalDateTime.'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-100">
                    <input class="flex width-1" type="checkbox" name="" '.$translationViaAir.'>
                    <p style="white-space: nowrap">Vía aérea:</p>
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-40">
                    <p style="white-space: nowrap">Agencia/Consignaria:</p>
                    <input class="flex width-55" type="text" name="" value="'.$agency.'">
                </div>
                <div class="flex width-40">
                    <p style="white-space: nowrap">Persona de contacto:</p>
                    <input class="flex width-56" type="text" name="" value="'.$agencyContact.'">
                </div>
                <div class="flex width-20">
                    <p style="white-space: nowrap">Telf.:</p>
                    <input class="flex width-71" type="text" name="" value="'.$agencyContactPhone.'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-33">
                    <p style="white-space: nowrap">Vehículo trasl. al aeropuerto:</p>
                    <input class="flex width-30" type="text" name="" value="'.$carCollection2Air.'">
                </div>
                <div class="flex width-33">
                    <p style="white-space: nowrap">Personal 1:</p>
                    <input class="flex width-70" type="text" name="" value="'.$staffTransfer1Air.'">
                </div>
                <div class="flex width-33">
                    <p style="white-space: nowrap">Personal 2:</p>
                    <input class="flex width-70" type="text" name="" value="'.$staffTransfer2Air.'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-35">
                    <p style="white-space: nowrap">Aeropuerto origen:</p>
                    <input class="flex width-55" type="text" name="" value="'.$airportOrigin.'">
                </div>
                <div class="flex width-35">
                    <p style="white-space: nowrap">Aerop. destino:</p>
                    <input class="flex width-63" type="text" name="" value="'.$arrivalAirport.'">
                </div>
                <div class="flex width-20">
                    <p style="white-space: nowrap">Nº de vuelo:</p>
                    <input class="flex width-45" type="text" name="" value="'.$flightNumber.'">
                </div>
                <div class="flex width-10">
                    <p style="white-space: nowrap">LTA:</p>
                    <input class="flex width-48 type="text" name="" value="'.$result['workOrder']['translationLTA'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-100">
                    <p style="white-space: nowrap">Responsable precintado, embalado:</p>
                    <input class="flex width-71" type="text" name="" value="'.$result['workOrder']['translationResponsibleSealedName'].'">
                </div>
            </div>
            <div class="flex justify-content-space-between">
                <div class="flex width-50">
                    <p style="white-space: nowrap">Fecha y hora salida vuelo:</p>
                    <input class="flex width-57" type="text" name="" value="'.$translationAirLeavingDateTime.'">
                </div>
                <div class="flex width-50">
                    <p style="white-space: nowrap">Fecha y hora llegada a destino:</p>
                    <input class="flex width-50" type="text" name="" value="'.$translationAirArrivalDateTime.'">
                </div>
            </div>
            <div class="flex align-self-top">
                <div class="flex-row width-100">
                    <p style="text-decoration: underline;">Notas:</p>
                    <textarea style="height:100px" class="lined-textarea flex">'.$result['workOrder']['translationNotes'].'</textarea>
                </div>
            </div>
        </div>
    ';

    $html = '   
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Orden de Trabajo</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">
                <style>' . $styleCustom . '</style>
            </head>
            <body>
                <h1 class="color-blue custom-text-center">ORDEN DE TRABAJO</h1>
                <div class="div-primary mb-1">
                    <div class="custom-table">
                        <div class="flex justify-content-space-between">
                            <div class="flex width-50">
                                <p>Referencia Interna:</p>
                                <input class="flex width-50" type="text" name="referencia_interna" value="'.$result['expedient']['internalRef'].'">
                            </div>
                            <div class="flex justify-content-flex-end width-50">
                                <p style="white-space: nowrap">Nº de Expediente:</p>
                                <input class="flex width-71" type="text" name="numero_expediente" value="'.$result['expedient']['number'].'">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="div-secondary mb-1">
                    '.$deceasedSection.'
                </div>
                <div class="div-secondary mb-1">
                    '.$arkSection.'
                </div>
                <div class="div-secondary mb-1">
                    '.$velationSection.'
                </div>
                <div class="div-secondary mb-1">
                    '.$ceremonySection.'
                </div>
                <div class="div-secondary mb-1">
                    '.$communicationSection.'
                </div>
                <div class="div-secondary mb-1">
                    '.$flowersSection.'
                </div>
                <div class="div-secondary mb-1 bg-white">
                    <div class="flex-row width-100">
                        <p style="text-decoration: underline; margin-bottom: 0; padding-bottom: 0;">NOTAS:</p>
                        <textarea class="lined-textarea flex" style="overflow: hidden;">'.$result['workOrder']['notes'].'</textarea>
                    </div>
                </div>
                <div class="new-page"></div>
    ';

    if(is_dir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/workOrders/')){
        $totalDocs = count(scandir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/workOrders/')) - 1;
    }else{
        $totalDocs = 0;
    }
    switch(intval($type)){
        case 1: // Inhumacion
            $html .= '
                <div class="mt-4 mb-3 flex width-100 height-100">
                    <div class="flex width-100 height-100">
                        <div class="flex justify-content-center width-25 height-100">
                            <img class="logo" src="' . $utils->getRoute() . 'resources/files/'.$_SESSION['company'].'/settings/logo.png">
                        </div>
                        <div class="flex flex-row width-50">
                            <h1 class="color-blue">ORDEN DE TRABAJO</h1>
                            <h2>Inhumación</h2>
                        </div>
                        <div class="flex width-25">
                            <p style="white-space: nowrap">Nº de Expediente:</p>
                            <input class="flex width-40 underline" type="text" name="numero_expediente" value="'.$result['expedient']['number'].'">
                        </div>
                    </div>
                </div>
                <div class="div-secondary mb-3">
                    '.$clientSection.'
                </div>
                <div class="div-secondary mb-3">
                    '.$carsSection.'
                </div>
                <div class="div-secondary mb-3">
                    '.$deceasedSection.'
                </div>
                <div class="div-secondary mb-3">
                   '.$arkSection.'
                </div>
                <div class="div-secondary mb-3 bg-white">
                    '.$velationSection.'  
                </div>
                <div class="div-secondary mb-3">
                    '.$ceremonySection.'  
                </div>
                <div class="div-secondary mb-3 bg-white">
                    '.$inhumationSection.'
                </div>
            ';

            $filename = 'inhumacion_' . $totalDocs . '.pdf';
        break;
        case 2:  // Cremacion
            $html .= '
                <div class="mt-4 mb-3 flex width-100 height-100">
                    <div class="flex width-100 height-100">
                        <div class="flex justify-content-center width-25 height-100">
                            <img class="logo" src="' . $utils->getRoute() . 'resources/files/'.$_SESSION['company'].'/settings/logo.png">
                        </div>
                        <div class="flex justify-content-center flex-row width-50">
                            <h1 class="color-blue">ORDEN DE TRABAJO</h1>
                            <h2 class="color-red">CREMACIÓN<br><small>(Sin inhumación de cenizas)</small></h2>
                        </div>
                        <div class="flex width-25">
                            <p style="white-space: nowrap">Nº de Expediente:</p>
                            <input class="flex width-40 underline" type="text" name="numero_expediente" value="'.$result['expedient']['number'].'">
                        </div>
                    </div>
                </div>
                <div class="div-secondary mb-2 bg-white">
                    '.$clientSection.'
                </div>
                <div class="div-secondary mb-2 bg-white">
                    '.$carsSection.'
                </div>
                <div class="div-secondary mb-2">
                   '.$deceasedSection.'
                </div>
                <div class="div-secondary mb-2 bg-white">
                    '.$arkSection.'
                </div>
                <div class="div-secondary mb-2">
                   '.$velationSection.'      
                </div>
                <div class="div-secondary mb-2 bg-white">
                    '.$ceremonySection.'      
                </div>
                <div class="div-secondary mb-2">
                    '.$crematorySection.'
                </div>
                <div class="div-secondary mb-1 bg-white">
                    <div class="flex-row width-100">
                        <p style="text-decoration: underline;">Observaciones:</p>
                        <textarea style="height:300px" class="lined-textarea flex">'.$result['workOrder']['crematoryNotes'].'</textarea>
                    </div>
                </div>
            ';

            $filename = 'cremacion_' . $totalDocs . '.pdf';
        break;
        case 3: // Cremacion + Inhumacion
            $html .= '
                <div class="mt-4 mb-3 flex width-100 height-100">
                    <div class="flex width-100 height-100">
                        <div class="flex justify-content-center width-25 height-100">
                            <img class="logo" src="' . $utils->getRoute() . 'resources/files/'.$_SESSION['company'].'/settings/logo.png">
                        </div>
                        <div class="flex justify-content-center flex-row width-50">
                            <h1 class="color-blue">ORDEN DE TRABAJO</h1>
                            <h2 class="color-red">CREMACIÓN<br><small>(Con inhumación de cenizas)</small></h2>
                        </div>
                        <div class="flex width-25">
                            <p style="white-space: nowrap">Nº de Expediente:</p>
                            <input class="flex width-40 underline" type="text" name="numero_expediente" value="'.$result['expedient']['number'].'">
                        </div>
                    </div>
                </div>
                <div class="div-secondary mb-2 bg-white">
                    '.$clientSection.'
                </div>
                <div class="div-secondary mb-2 bg-white">
                    '.$carsSection.'
                </div>
                <div class="div-secondary mb-2">
                   '.$deceasedSection.'
                </div>
                <div class="div-secondary mb-2 bg-white">
                    '.$arkSection.'
                </div>
                <div class="div-secondary mb-2">
                    '.$velationSection.'      
                </div>
                <div class="div-secondary mb-2 bg-white">
                    '.$ceremonySection.'                             
                </div>
                <div class="div-secondary mb-2">
                    '.$crematorySection.'
                </div>
                <div class="div-secondary mb-2 bg-white">
                   '.$inhumationSection.'
                </div>
                <div class="div-secondary mb-1">
                    <div class="flex-row width-100">
                        <p style="text-decoration: underline;">Obervaciones:</p>
                        <textarea style="height:75px" class="lined-textarea flex">'.$result['workOrder']['crematoryNotes'].'</textarea>
                    </div>
                </div>
            ';

            $filename = 'cremacion_inhumacion' . $totalDocs . '.pdf';
        break;
        case 4: // Traslado
            $html .= '
                <div class="mt-4 mb-3 flex width-100 height-100">
                    <div class="flex width-100 height-100">
                        <div class="flex justify-content-center width-25 height-100">
                            <img class="logo" src="' . $utils->getRoute() . 'resources/files/'.$_SESSION['company'].'/settings/logo.png">
                        </div>
                        <div class="flex justify-content-center flex-row width-50">
                            <h1 class="color-blue">ORDEN DE TRABAJO</h1>
                            <h2 class="color-red">TRASLADO</h2>
                            <small class="color-red">(Sin velación previa)</small>
                        </div>
                        <div class="flex width-25">
                            <p style="white-space: nowrap">Nº de Expediente:</p>
                            <input class="flex width-40 underline" type="text" name="numero_expediente" value="'.$result['expedient']['number'].'">
                        </div>
                    </div>
                </div>
                <div class="div-secondary mb-2 bg-white">
                    '.$clientSection.'
                </div>
                <div class="div-secondary mb-2 bg-white">
                    '.$carsSection.'
                </div>
                <div class="div-secondary mb-2">
                    '.$deceasedSection.'
                </div>
                <div class="div-secondary mb-2 bg-white">
                   '.$arkSection.'
                </div>
                <div class="div-secondary mb-2">
                    '.$translationSection.'
                </div>
            ';

            $filename = 'traslado' . $totalDocs . '.pdf';
        break;
        case 5: // Tralado + Velación
            $html .= '
                <div class="mt-4 mb-3 flex width-100 height-100">
                    <div class="flex width-100 height-100">
                        <div class="flex justify-content-center width-25 height-100">
                            <img class="logo" src="' . $utils->getRoute() . 'resources/files/'.$_SESSION['company'].'/settings/logo.png">
                        </div>
                        <div class="flex justify-content-center flex-row width-50">
                            <h1 class="color-blue">ORDEN DE TRABAJO</h1>
                            <h2 class="color-red">TRASLADO</h2>
                            <small class="color-red">(Con velación previa)</small>
                        </div>
                        <div class="flex width-25">
                            <p style="white-space: nowrap">Nº de Expediente:</p>
                            <input class="flex width-40 underline" type="text" name="numero_expediente" value="'.$result['expedient']['number'].'">
                        </div>
                    </div>
                </div>
                <div class="div-secondary mb-2 bg-white">
                    '.$clientSection.'
                </div>
                <div class="div-secondary mb-2 bg-white">
                    '.$carsSection.'
                </div>
                <div class="div-secondary mb-2">
                    '.$deceasedSection.'
                </div>
                <div class="div-secondary mb-2">
                    '.$arkSection.'
                </div>
                <div class="div-secondary mb-2 bg-white">
                    '.$velationSection.'
                </div>
                <div class="div-secondary mb-2">
                    '.$ceremonySection.'
                </div>
                <div class="div-secondary mb-2 bg-white">
                   '.$translationSection.'
                </div>
            ';

            $filename = 'traslado_velacion' . $totalDocs . '.pdf';
        break;
    }

    $html .= ' </body>
        </html>'
    ;

    $pdf->setOptions($options);
    $pdf->addPage($html);

    if(!is_dir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/workOrders/')){
        mkdir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/workOrders/', 0777, true);
    }

    if($pdf->saveAs($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/workOrders/' . $filename)){
        echo json_encode($filename);
    }else{
        echo json_encode($pdf->getError());
    }
?>