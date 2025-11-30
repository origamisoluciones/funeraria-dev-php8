<?php
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");

    class Assistances{
        /**
         * Comprueba si una asistencia existe
         * 
         * @param int $assistance Id de la asistencia
         * @return bool
         */
        public function existsAssistance($assistance){
            $db = new DbHandler;

            $assistance = cleanStr($assistance);

            $result = $db->query("  SELECT  a.ID
                                    FROM    Assistances a
                                    WHERE   a.ID = $assistance AND
                                            a.leavingDate IS NULL");

            return mysqli_num_rows($result) == 0 ? false : true;
        }
        
        /**
         * Añade una asistencia
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function create($data){
            $db = new DbHandler;

            $data['expedient'] = cleanStr($data['expedient']);

            $result = $db->query("  SELECT  ID 
                                    FROM    Assistances 
                                    WHERE   expedient = " . $data['expedient']);

            if(mysqli_num_rows($result) > 0){
                return array(true, $db->resultToArray($result)[0]['ID']);
            }

            // Cálculo del extraID
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

            $result = $db->query("  INSERT INTO Assistances(expedient, location, extraID) 
                                    VALUES(" . $data['expedient'] . ", null, '" . $extraID . "')");

            if($result){
                $result = $db->query("  SELECT  ID 
                                        FROM    Assistances 
                                        WHERE   extraID = '" . $extraID . "'");

                $db->query("    INSERT INTO Satisfaction_Survey(expedient)
                                VALUES(" . $data['expedient'] . ")");

                if(mysqli_num_rows($result) > 0){
                    $assistanceId = $db->resultToArray($result)[0]['ID'];

                    require_once($_SESSION['basePath'] . "model/survey.php");
                    $survey = new Survey;
                    $services = $survey->get();
                    if($services != null){
                        foreach($services as $service){
                            $db->query("INSERT INTO Survey_Assistance(survey, assistance)
                                        VALUES (" . $service['ID'] . ", $assistanceId)");
                        }
                    }

                    return array(true, $assistanceId);
                }else{
                    array(false, "null");
                }
            }else{
                return array(false, "null");
            }
        }

        /**
         * Consulta una asistencia
         * 
         * @param int $data
         * 
         * @return array
         */
        public function read($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT      a.*, 
                                                l.locationID, l.name as locationName, l.postalCode, l.province,
                                                e.number, e.deceasedName, e.deceasedSurname, e.deceasedGender, e.deceasedFirstNuptials,
                                                e.policy, e.deceasedDate, e.capital, e.expedientID, e.deceasedMaritalStatus,
                                                m.name as mortuaryName
                                    FROM        (Assistances a, Expedients e)
                                    LEFT JOIN   Locations l ON a.location = l.locationID
                                    LEFT JOIN   Mortuaries m ON e.deceasedMortuary = m.mortuaryID
                                    WHERE       a.ID = " . $data . " AND 
                                                a.expedient = e.expedientID");
                  
            
            if(mysqli_num_rows($result) > 0){
                $res = $db->resultToArray($result)[0];
            }else{
                $res = [];
            }

            return count($res) > 0 ? $res : null;
        }

        /**
         * Modifica una asistencia
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function update($data){
            $db = new DbHandler;

            $data['province'] = cleanStr($data['province']);
            $data['attendanceDate'] = cleanStr($data['attendanceDate']);
            $data['literalDate'] = cleanStr($data['literalDate']);
            $data['receiptDate'] = cleanStr($data['receiptDate']);
            $data['ssDateStart'] = cleanStr($data['ssDateStart']);
            $data['ssDateEnd'] = cleanStr($data['ssDateEnd']);
            $data['inssDateStart'] = cleanStr($data['inssDateStart']);
            $data['inssDateEnd'] = cleanStr($data['inssDateEnd']);
            $data['ismDateStart'] = cleanStr($data['ismDateStart']);
            $data['ismDateEnd'] = cleanStr($data['ismDateEnd']);
            $data['socialDateStart'] = cleanStr($data['socialDateStart']);
            $data['socialDateEnd'] = cleanStr($data['socialDateEnd']);
            $data['passiveDateStart'] = cleanStr($data['passiveDateStart']);
            $data['passiveDateEnd'] = cleanStr($data['passiveDateEnd']);
            $data['isfasDateStart'] = cleanStr($data['isfasDateStart']);
            $data['isfasDateEnd'] = cleanStr($data['isfasDateEnd']);
            $data['lastWishDateStart'] = cleanStr($data['lastWishDateStart']);
            $data['lastWishDateEnd'] = cleanStr($data['lastWishDateEnd']);
            $data['insuranceCoverageStart'] = cleanStr($data['insuranceCoverageStart']);
            $data['insuranceCoverageEnd'] = cleanStr($data['insuranceCoverageEnd']);
            $data['dniDateGStart'] = cleanStr($data['dniDateGStart']);
            $data['dniDateGEnd'] = cleanStr($data['dniDateGEnd']);
            $data['familyBookDateGStart'] = cleanStr($data['familyBookDateGStart']);
            $data['familyBookDateGEnd'] = cleanStr($data['familyBookDateGEnd']);
            $data['literalMarriageDateGStart'] = cleanStr($data['literalMarriageDateGStart']);
            $data['literalMarriageDateGEnd'] = cleanStr($data['literalMarriageDateGEnd']);
            $data['literalBirthdayDateGStart'] = cleanStr($data['literalBirthdayDateGStart']);
            $data['literalBirthdayDateGEnd'] = cleanStr($data['literalBirthdayDateGEnd']);
            $data['registrationDateGStart'] = cleanStr($data['registrationDateGStart']);
            $data['registrationDateGEnd'] = cleanStr($data['registrationDateGEnd']);
            $data['dniDateRStart'] = cleanStr($data['dniDateRStart']);
            $data['dniDateREnd'] = cleanStr($data['dniDateREnd']);
            $data['familyBookDateRStart'] = cleanStr($data['familyBookDateRStart']);
            $data['familyBookDateREnd'] = cleanStr($data['familyBookDateREnd']);
            $data['literalMarriageDateRStart'] = cleanStr($data['literalMarriageDateRStart']);
            $data['literalMarriageDateREnd'] = cleanStr($data['literalMarriageDateREnd']);
            $data['literalBirthdayDateRStart'] = cleanStr($data['literalBirthdayDateRStart']);
            $data['literalBirthdayDateREnd'] = cleanStr($data['literalBirthdayDateREnd']);
            $data['registrationDateRStart'] = cleanStr($data['registrationDateRStart']);
            $data['registrationDateREnd'] = cleanStr($data['registrationDateREnd']);
            $data['address'] = cleanStr($data['address']);
            $data['phone1'] = cleanStr($data['phone1']);
            $data['phone2'] = cleanStr($data['phone2']);
            $data['phone3'] = cleanStr($data['phone3']);
            $data['ssDateStartCheck'] = cleanStr($data['ssDateStartCheck']);
            $data['ssDateEndCheck'] = cleanStr($data['ssDateEndCheck']);
            $data['spanishPension'] = cleanStr($data['spanishPension']);
            $data['foreignPension'] = cleanStr($data['foreignPension']);
            $data['inssDateStartCheck'] = cleanStr($data['inssDateStartCheck']);
            $data['inssDateEndCheck'] = cleanStr($data['inssDateEndCheck']);
            $data['ismDateStartCheck'] = cleanStr($data['ismDateStartCheck']);
            $data['ismDateEndCheck'] = cleanStr($data['ismDateEndCheck']);
            $data['socialDateStartCheck'] = cleanStr($data['socialDateStartCheck']);
            $data['socialDateEndCheck'] = cleanStr($data['socialDateEndCheck']);
            $data['passiveDateStartCheck'] = cleanStr($data['passiveDateStartCheck']);
            $data['passiveDateEndCheck'] = cleanStr($data['passiveDateEndCheck']);
            $data['isfasDateStartCheck'] = cleanStr($data['isfasDateStartCheck']);
            $data['isfasDateEndCheck'] = cleanStr($data['isfasDateEndCheck']);
            $data['lastWishDateStartCheck'] = cleanStr($data['lastWishDateStartCheck']);
            $data['lastWishDateEndCheck'] = cleanStr($data['lastWishDateEndCheck']);
            $data['insuranceCoverageStartCheck'] = cleanStr($data['insuranceCoverageStartCheck']);
            $data['insuranceCoverageEndCheck'] = cleanStr($data['insuranceCoverageEndCheck']);
            $data['dniDateGStartCheck'] = cleanStr($data['dniDateGStartCheck']);
            $data['dniDateGEndCheck'] = cleanStr($data['dniDateGEndCheck']);
            $data['familyBookDateGStartCheck'] = cleanStr($data['familyBookDateGStartCheck']);
            $data['familyBookDateGEndCheck'] = cleanStr($data['familyBookDateGEndCheck']);
            $data['literalMarriageDateGStartCheck'] = cleanStr($data['literalMarriageDateGStartCheck']);
            $data['literalMarriageDateGEndCheck'] = cleanStr($data['literalMarriageDateGEndCheck']);
            $data['literalBirthdayDateGStartCheck'] = cleanStr($data['literalBirthdayDateGStartCheck']);
            $data['literalBirthdayDateGEndCheck'] = cleanStr($data['literalBirthdayDateGEndCheck']);
            $data['registrationDateGStartCheck'] = cleanStr($data['registrationDateGStartCheck']);
            $data['registrationDateGEndCheck'] = cleanStr($data['registrationDateGEndCheck']);
            $data['several'] = cleanStr($data['several']);
            $data['dniDateRStartCheck'] = cleanStr($data['dniDateRStartCheck']);
            $data['dniDateREndCheck'] = cleanStr($data['dniDateREndCheck']);
            $data['familyBookDateRStartCheck'] = cleanStr($data['familyBookDateRStartCheck']);
            $data['familyBookDateREndCheck'] = cleanStr($data['familyBookDateREndCheck']);
            $data['literalMarriageDateRStartCheck'] = cleanStr($data['literalMarriageDateRStartCheck']);
            $data['literalMarriageDateREndCheck'] = cleanStr($data['literalMarriageDateREndCheck']);
            $data['literalBirthdayDateRStartCheck'] = cleanStr($data['literalBirthdayDateRStartCheck']);
            $data['literalBirthdayDateREndCheck'] = cleanStr($data['literalBirthdayDateREndCheck']);
            $data['registrationDateRStartCheck'] = cleanStr($data['registrationDateRStartCheck']);
            $data['registrationDateREndCheck'] = cleanStr($data['registrationDateREndCheck']);
            $data['successions'] = cleanEditor($data['successions']);
            $data['deathReport'] = cleanEditor($data['deathReport']);
            $data['production'] = cleanEditor($data['production']);
            $data['notes'] = cleanEditor($data['notes']);
            $data['assistanceID'] = cleanStr($data['assistanceID']);

            if(empty($data['province'])){
                $data['province'] = 'null';
            }

            if(empty($data['attendanceDate'])){
                $attendanceDate = 'attendanceDate = null, ';
            }else{
                $attendanceDate = 'attendanceDate = "' . $data['attendanceDate'] . '", ';
            }

            if(empty($data['literalDate'])){
                $literalDate = 'literalDate = null, ';
            }else{
                $literalDate = 'literalDate = "' . $data['literalDate'] . '", ';
            }

            if(empty($data['receiptDate'])){
                $receiptDate = 'receiptDate = null, ';
            }else{
                $receiptDate = 'receiptDate = "' . $data['receiptDate'] . '", ';
            }

            if(empty($data['ssDateStart'])){
                $ssDateStart = 'ssDateStart = null, ';
            }else{
                $ssDateStart = 'ssDateStart = "' . $data['ssDateStart'] . '", ';
            }
            if(empty($data['ssDateEnd'])){
                $ssDateEnd = 'ssDateEnd = null, ';
            }else{
                $ssDateEnd = 'ssDateEnd = "' . $data['ssDateEnd'] . '", ';
            }

            if(empty($data['inssDateStart'])){
                $inssDateStart = 'inssDateStart = null, ';
            }else{
                $inssDateStart = 'inssDateStart = "' . $data['inssDateStart'] . '", ';
            }
            if(empty($data['inssDateEnd'])){
                $inssDateEnd = 'inssDateEnd = null, ';
            }else{
                $inssDateEnd = 'inssDateEnd = "' . $data['inssDateEnd'] . '", ';
            }

            if(empty($data['ismDateStart'])){
                $ismDateStart = 'ismDateStart = null, ';
            }else{
                $ismDateStart = 'ismDateStart = "' . $data['ismDateStart'] . '", ';
            }
            if(empty($data['ismDateEnd'])){
                $ismDateEnd = 'ismDateEnd = null, ';
            }else{
                $ismDateEnd = 'ismDateEnd = "' . $data['ismDateEnd'] . '", ';
            }

            if(empty($data['socialDateStart'])){
                $socialDateStart = 'socialDateStart = null, ';
            }else{
                $socialDateStart = 'socialDateStart = "' . $data['socialDateStart'] . '", ';
            }
            if(empty($data['socialDateEnd'])){
                $socialDateEnd = 'socialDateEnd = null, ';
            }else{
                $socialDateEnd = 'socialDateEnd = "' . $data['socialDateEnd'] . '", ';
            }

            if(empty($data['passiveDateStart'])){
                $passiveDateStart = 'passiveDateStart = null, ';
            }else{
                $passiveDateStart = 'passiveDateStart = "' . $data['passiveDateStart'] . '", ';
            }
            if(empty($data['passiveDateEnd'])){
                $passiveDateEnd = 'passiveDateEnd = null, ';
            }else{
                $passiveDateEnd = 'passiveDateEnd = "' . $data['passiveDateEnd'] . '", ';
            }

            if(empty($data['isfasDateStart'])){
                $isfasDateStart = 'isfasDateStart = null, ';
            }else{
                $isfasDateStart = 'isfasDateStart = "' . $data['isfasDateStart'] . '", ';
            }
            if(empty($data['isfasDateEnd'])){
                $isfasDateEnd = 'isfasDateEnd = null, ';
            }else{
                $isfasDateEnd = 'isfasDateEnd = "' . $data['isfasDateEnd'] . '", ';
            }

            if(empty($data['lastWishDateStart'])){
                $lastWishDateStart = 'lastWishDateStart = null, ';
            }else{
                $lastWishDateStart = 'lastWishDateStart = "' . $data['lastWishDateStart'] . '", ';
            }
            if(empty($data['lastWishDateEnd'])){
                $lastWishDateEnd = 'lastWishDateEnd = null, ';
            }else{
                $lastWishDateEnd = 'lastWishDateEnd = "' . $data['lastWishDateEnd'] . '", ';
            }

            if(empty($data['insuranceCoverageStart'])){
                $insuranceCoverageStart = 'insuranceCoverageStart = null, ';
            }else{
                $insuranceCoverageStart = 'insuranceCoverageStart = "' . $data['insuranceCoverageStart'] . '", ';
            }
            if(empty($data['insuranceCoverageEnd'])){
                $insuranceCoverageEnd = 'insuranceCoverageEnd = null, ';
            }else{
                $insuranceCoverageEnd = 'insuranceCoverageEnd = "' . $data['insuranceCoverageEnd'] . '", ';
            }

            if(empty($data['dniDateGStart'])){
                $dniDateGStart = 'dniDateGStart = null, ';
            }else{
                $dniDateGStart = 'dniDateGStart = "' . $data['dniDateGStart'] . '", ';
            }
            if(empty($data['dniDateGEnd'])){
                $dniDateGEnd = 'dniDateGEnd = null, ';
            }else{
                $dniDateGEnd = 'dniDateGEnd = "' . $data['dniDateGEnd'] . '", ';
            }

            if(empty($data['familyBookDateGStart'])){
                $familyBookDateGStart = 'familyBookDateGStart = null, ';
            }else{
                $familyBookDateGStart = 'familyBookDateGStart = "' . $data['familyBookDateGStart'] . '", ';
            }
            if(empty($data['familyBookDateGEnd'])){
                $familyBookDateGEnd = 'familyBookDateGEnd = null, ';
            }else{
                $familyBookDateGEnd = 'familyBookDateGEnd = "' . $data['familyBookDateGEnd'] . '", ';
            }

            if(empty($data['literalMarriageDateGStart'])){
                $literalMarriageDateGStart = 'literalMarriageDateGStart = null, ';
            }else{
                $literalMarriageDateGStart = 'literalMarriageDateGStart = "' . $data['literalMarriageDateGStart'] . '", ';
            }
            if(empty($data['literalMarriageDateGEnd'])){
                $literalMarriageDateGEnd = 'literalMarriageDateGEnd = null, ';
            }else{
                $literalMarriageDateGEnd = 'literalMarriageDateGEnd = "' . $data['literalMarriageDateGEnd'] . '", ';
            }

            if(empty($data['literalBirthdayDateGStart'])){
                $literalBirthdayDateGStart = 'literalBirthdayDateGStart = null, ';
            }else{
                $literalBirthdayDateGStart = 'literalBirthdayDateGStart = "' . $data['literalBirthdayDateGStart'] . '", ';
            }
            if(empty($data['literalBirthdayDateGEnd'])){
                $literalBirthdayDateGEnd = 'literalBirthdayDateGEnd = null, ';
            }else{
                $literalBirthdayDateGEnd = 'literalBirthdayDateGEnd = "' . $data['literalBirthdayDateGEnd'] . '", ';
            }
            if(empty($data['registrationDateGStart'])){
                $registrationDateGStart = 'registrationDateGStart = null, ';
            }else{
                $registrationDateGStart = 'registrationDateGStart = "' . $data['registrationDateGStart'] . '", ';
            }
            if(empty($data['registrationDateGEnd'])){
                $registrationDateGEnd = 'registrationDateGEnd = null, ';
            }else{
                $registrationDateGEnd = 'registrationDateGEnd = "' . $data['registrationDateGEnd'] . '", ';
            }

            if(empty($data['dniDateRStart'])){
                $dniDateRStart = 'dniDateRStart = null, ';
            }else{
                $dniDateRStart = 'dniDateRStart = "' . $data['dniDateRStart'] . '", ';
            }
            if(empty($data['dniDateREnd'])){
                $dniDateREnd = 'dniDateREnd = null, ';
            }else{
                $dniDateREnd = 'dniDateREnd = "' . $data['dniDateREnd'] . '", ';
            }

            if(empty($data['familyBookDateRStart'])){
                $familyBookDateRStart = 'familyBookDateRStart = null, ';
            }else{
                $familyBookDateRStart = 'familyBookDateRStart = "' . $data['familyBookDateRStart'] . '", ';
            }
            if(empty($data['familyBookDateREnd'])){
                $familyBookDateREnd = 'familyBookDateREnd = null, ';
            }else{
                $familyBookDateREnd = 'familyBookDateREnd = "' . $data['familyBookDateREnd'] . '", ';
            }

            if(empty($data['literalMarriageDateRStart'])){
                $literalMarriageDateRStart = 'literalMarriageDateRStart = null, ';
            }else{
                $literalMarriageDateRStart = 'literalMarriageDateRStart = "' . $data['literalMarriageDateRStart'] . '", ';
            }
            if(empty($data['literalMarriageDateREnd'])){
                $literalMarriageDateREnd = 'literalMarriageDateREnd = null, ';
            }else{
                $literalMarriageDateREnd = 'literalMarriageDateREnd = "' . $data['literalMarriageDateREnd'] . '", ';
            }

            if(empty($data['literalBirthdayDateRStart'])){
                $literalBirthdayDateRStart = 'literalBirthdayDateRStart = null, ';
            }else{
                $literalBirthdayDateRStart = 'literalBirthdayDateRStart = "' . $data['literalBirthdayDateRStart'] . '", ';
            }
            if(empty($data['literalBirthdayDateREnd'])){
                $literalBirthdayDateREnd = 'literalBirthdayDateREnd = null, ';
            }else{
                $literalBirthdayDateREnd = 'literalBirthdayDateREnd = "' . $data['literalBirthdayDateREnd'] . '", ';
            }
            if(empty($data['registrationDateRStart'])){
                $registrationDateRStart = 'registrationDateRStart = null, ';
            }else{
                $registrationDateRStart = 'registrationDateRStart = "' . $data['registrationDateRStart'] . '", ';
            }
            if(empty($data['registrationDateREnd'])){
                $registrationDateREnd = 'registrationDateREnd = null, ';
            }else{
                $registrationDateREnd = 'registrationDateREnd = "' . $data['registrationDateREnd'] . '", ';
            }
            if(empty($data['km'])){
                $km = 'km = null, ';
            }else{
                $km = 'km = "' . $data['km'] . '", ';
            }

            return $db->query(" UPDATE  Assistances 
                                SET     location = " . $data['province'] . ",
                                        $attendanceDate
                                        address = '" . $data['address'] . "',
                                        phone1 = '" . $data['phone1'] . "',
                                        phone2 = '" . $data['phone2'] . "',
                                        phone3 = '" . $data['phone3'] . "',
                                        $literalDate
                                        $receiptDate
                                        ssDateStartCheck = " . $data['ssDateStartCheck'] . ",
                                        $ssDateStart
                                        ssDateEndCheck = " . $data['ssDateEndCheck'] . ",
                                        $ssDateEnd
                                        spanishPension = " . $data['spanishPension'] . ",
                                        foreignPension = " . $data['foreignPension'] . ",
                                        inssDateStartCheck = " . $data['inssDateStartCheck'] . ",
                                        $inssDateStart
                                        inssDateEndCheck = " . $data['inssDateEndCheck'] . ",
                                        $inssDateEnd
                                        ismDateStartCheck = " . $data['ismDateStartCheck'] . ",
                                        $ismDateStart
                                        ismDateEndCheck = " . $data['ismDateEndCheck'] . ",
                                        $ismDateEnd
                                        socialDateStartCheck = " . $data['socialDateStartCheck'] . ",
                                        $socialDateStart
                                        socialDateEndCheck = " . $data['socialDateEndCheck'] . ",
                                        $socialDateEnd
                                        passiveDateStartCheck = " . $data['passiveDateStartCheck'] . ",
                                        $passiveDateStart
                                        passiveDateEndCheck = " . $data['passiveDateEndCheck'] . ",
                                        $passiveDateEnd
                                        isfasDateStartCheck = " . $data['isfasDateStartCheck'] . ",
                                        $isfasDateStart
                                        isfasDateEndCheck = " . $data['isfasDateEndCheck'] . ",
                                        $isfasDateEnd
                                        lastWishDateStartCheck = " . $data['lastWishDateStartCheck'] . ",
                                        $lastWishDateStart
                                        lastWishDateEndCheck = " . $data['lastWishDateEndCheck'] . ",
                                        $lastWishDateEnd
                                        insuranceCoverageStartCheck = " . $data['insuranceCoverageStartCheck'] . ",
                                        $insuranceCoverageStart
                                        insuranceCoverageEndCheck = " . $data['insuranceCoverageEndCheck'] . ",
                                        $insuranceCoverageEnd
                                        dniDateGStartCheck = " . $data['dniDateGStartCheck'] . ",
                                        $dniDateGStart
                                        dniDateGEndCheck = " . $data['dniDateGEndCheck'] . ",
                                        $dniDateGEnd
                                        familyBookDateGStartCheck = " . $data['familyBookDateGStartCheck'] . ",
                                        $familyBookDateGStart
                                        familyBookDateGEndCheck = " . $data['familyBookDateGEndCheck'] . ",
                                        $familyBookDateGEnd
                                        literalMarriageDateGStartCheck = " . $data['literalMarriageDateGStartCheck'] . ",
                                        $literalMarriageDateGStart
                                        literalMarriageDateGEndCheck = " . $data['literalMarriageDateGEndCheck'] . ",
                                        $literalMarriageDateGEnd
                                        literalBirthdayDateGStartCheck = " . $data['literalBirthdayDateGStartCheck'] . ",
                                        $literalBirthdayDateGStart
                                        literalBirthdayDateGEndCheck = " . $data['literalBirthdayDateGEndCheck'] . ",
                                        $literalBirthdayDateGEnd
                                        registrationDateGStartCheck = " . $data['registrationDateGStartCheck'] . ",
                                        $registrationDateGStart
                                        registrationDateGEndCheck = " . $data['registrationDateGEndCheck'] . ",
                                        $registrationDateGEnd
                                        several = '" . $data['several'] . "',
                                        dniDateRStartCheck = " . $data['dniDateRStartCheck'] . ",
                                        $dniDateRStart
                                        dniDateREndCheck = " . $data['dniDateREndCheck'] . ",
                                        $dniDateREnd
                                        familyBookDateRStartCheck = " . $data['familyBookDateRStartCheck'] . ",
                                        $familyBookDateRStart
                                        familyBookDateREndCheck = " . $data['familyBookDateREndCheck'] . ",
                                        $familyBookDateREnd
                                        literalMarriageDateRStartCheck = " . $data['literalMarriageDateRStartCheck'] . ",
                                        $literalMarriageDateRStart
                                        literalMarriageDateREndCheck = " . $data['literalMarriageDateREndCheck'] . ",
                                        $literalMarriageDateREnd
                                        literalBirthdayDateRStartCheck = " . $data['literalBirthdayDateRStartCheck'] . ",
                                        $literalBirthdayDateRStart
                                        literalBirthdayDateREndCheck = " . $data['literalBirthdayDateREndCheck'] . ",
                                        $literalBirthdayDateREnd
                                        registrationDateRStartCheck = " . $data['registrationDateRStartCheck'] . ",
                                        $registrationDateRStart
                                        registrationDateREndCheck = " . $data['registrationDateREndCheck'] . ",
                                        $registrationDateREnd
                                        $km 
                                        successions = '" . $data['successions'] . "',
                                        deathReport = '" . $data['deathReport'] . "',
                                        production = '" . $data['production'] . "',
                                        notes = '" . $data['notes'] . "'
                                WHERE   ID = " . $data['assistanceID']);
        }

        /**
         * Elimina una asistencia
         * 
         * @param int $data
         * 
         * @return bool
         */
        public function delete($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            return $db->query(" UPDATE  Assistances
                                SET     leavingDate = " . time() . " 
                                WHERE   ID = " . $data);
        }

        /**
         * Obtiene los distintos años de las visitas para el filtrado
         * 
         * @return array
         */
        public function getYears(){
            $db = new DbHandler;

            $result = $db->query("  SELECT      DISTINCT(YEAR(FROM_UNIXTIME(attendanceDate))) as year
                                    FROM        Assistances
                                    ORDER BY    year DESC");

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        /**
         * Obtiene el total de asistencias para un período dado
         * 
         * @param array $data
         * 
         * @return array
         */
        public function getTotal($data){
            $db = new DbHandler;
            
            $data['year'] = cleanStr($data['year']);
            $data['month'] = cleanStr($data['month']);
            $data['trimester'] = cleanStr($data['trimester']);

            $query = "  SELECT  COUNT(a.ID) as total
                        FROM    Assistances a, Expedients e
                        WHERE   a.expedient = e.expedientID AND a.leavingDate = 0";

            if($data['year'] > 0){
                $query .= " AND EXTRACT(YEAR FROM e.entryDate) = " . $data['year'];
            }
            
            if($data['month'] > 0){
                $query .= " AND EXTRACT(MONTH FROM e.entryDate) = " . $data['month'];
            }
        
            switch($data['trimester']){
                case 1:
                    $query .= " AND EXTRACT(MONTH FROM e.entryDate) > 0 AND EXTRACT(MONTH FROM e.entryDate) < 4";
                    break;
                case 2:
                    $query .= " AND EXTRACT(MONTH FROM e.entryDate) > 3 AND EXTRACT(MONTH FROM e.entryDate) < 7";
                    break;
                case 3:
                    $query .= " AND EXTRACT(MONTH FROM e.entryDate) > 6 AND EXTRACT(MONTH FROM e.entryDate) < 10";
                    break;
                case 4:
                    $query .= " AND EXTRACT(MONTH FROM e.entryDate) > 9 AND EXTRACT(MONTH FROM e.entryDate) < 13";
                    break;
            }

            $result = $db->query($query);

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Obtiene las asistencias dado un período para crear un pdf
         * 
         * @param array $data
         * 
         * @return array
         */
        public function getDataToPDF($data){
            $db = new DbHandler;

            $data['year'] = cleanStr($data['year']);
            $data['month'] = cleanStr($data['month']);
            $data['trimester'] = cleanStr($data['trimester']);

            $query = "  SELECT      a.*, 
                                    l.locationID, l.name as locationName,
                                    e.number, e.deceasedName, e.deceasedSurname, e.deceasedFirstNuptials, e.policy, e.deceasedDate, 
                                    m.name as mortuaryName
                        FROM        (Assistances a, Expedients e)
                        LEFT JOIN   Locations l ON a.location = l.locationID
                        LEFT JOIN   Mortuaries m ON e.deceasedMortuary = m.mortuaryID
                        WHERE       a.expedient = e.expedientID";

            if($data['year'] > 0){
                $query .= " AND EXTRACT(YEAR FROM e.entryDate) = " . $data['year'];
            }
            
            if($data['month'] > 0){
                $query .= " AND EXTRACT(MONTH FROM e.entryDate) = " . $data['month'];
            }
        
            switch($data['trimester']){
                case 1:
                    $query .= " AND EXTRACT(MONTH FROM e.entryDate) > 0 AND EXTRACT(MONTH FROM e.entryDate) < 4";
                    break;
                case 2:
                    $query .= " AND EXTRACT(MONTH FROM e.entryDate) > 3 AND EXTRACT(MONTH FROM e.entryDate) < 7";
                    break;
                case 3:
                    $query .= " AND EXTRACT(MONTH FROM e.entryDate) > 6 AND EXTRACT(MONTH FROM e.entryDate) < 10";
                    break;
                case 4:
                    $query .= " AND EXTRACT(MONTH FROM e.entryDate) > 9 AND EXTRACT(MONTH FROM e.entryDate) < 13";
                    break;
            }

            $result = $db->query($query);

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result) : null;
        }

        public function getExpedientID($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  expedient
                                    FROM    Assistances
                                    WHERE   ID = " . $data);

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0]['expedient'] : null;
        }

        /** **************** Cuestionario de satisfacción **************** */
        /**
         * Obtiene los datos de un cuestionario
         * 
         * @param int $data
         * 
         * @return array
         */
        public function readSurvey($data){
            $db = new DbHandler;

            $data = cleanStr($data);

            $result = $db->query("  SELECT  *
                                    FROM    Satisfaction_Survey
                                    WHERE   expedient = " . $data);

            return mysqli_num_rows($result) > 0 ? $db->resultToArray($result)[0] : null;
        }

        /**
         * Actualiza los datos de un cuestionario
         * 
         * @param array $data
         * 
         * @return bool
         */
        public function updateSurvey($data){
            $db = new DbHandler;

            $data['date'] = cleanStr($data['date']);
            // $data['aspects'] = cleanStr($data['aspects']);
            $data['relationship'] = cleanStr($data['relationship']);
            $data['satisfactionSurveyID'] = cleanStr($data['satisfactionSurveyID']);

            if(empty($data['date'])){
                $data['date'] = 'null';
            }

            $db->query("UPDATE  Satisfaction_Survey ss
                        SET     ss.aspects = '" . $data['aspects'] . "',
                                ss.date = " . $data['date'] . ", 
                                ss.relationship = '" . $data['relationship'] . "', 
                                ss.name = '" . $data['name'] . "'
                        WHERE   ss.ID = " . $data['satisfactionSurveyID']);

            if(count($data['survey']) > 0){
                foreach($data['survey'] as $survey){
                    $survey[0] = cleanStr($survey[0]);
                    $survey[1] = cleanStr($survey[1]);
                    $survey[2] = cleanEditor($survey[2]);

                    $db->query("UPDATE  Survey_Assistance sa
                                SET     sa.value = " . $survey[1] . ",
                                        sa.notes = '" . $survey[2] . "'
                                WHERE   sa.ID = " . $survey[0]);
                }
            }

            return true;
        }

        /** **************** Estadísticas **************** */
        public function filter($data){
            $db = new DbHandler;
            
            $data['attendanceDateCheck'] = cleanStr($data['attendanceDateCheck']);
            $data['attendanceDateSince'] = cleanStr($data['attendanceDateSince']);
            $data['attendanceDateUntil'] = cleanStr($data['attendanceDateUntil']);
            $data['attendanceDate'] = cleanStr($data['attendanceDate']);
            $data['widowCheck'] = cleanStr($data['widowCheck']);
            $data['widow'] = cleanStr($data['widow']);
            $data['assistancePlaceCheck'] = cleanStr($data['assistancePlaceCheck']);
            $data['assistancePlace'] = cleanStr($data['assistancePlace']);
            $data['locationCheck'] = cleanStr($data['locationCheck']);
            $data['location'] = cleanStr($data['location']);
            $data['deceasedDateCheck'] = cleanStr($data['deceasedDateCheck']);
            $data['deceasedDateCheckPeriod'] = cleanStr($data['deceasedDateCheckPeriod']);
            $data['deceasedDateSince'] = cleanStr($data['deceasedDateSince']);
            $data['deceasedDateUntil'] = cleanStr($data['deceasedDateUntil']);
            $data['deceasedDate'] = cleanStr($data['deceasedDate']);
            $data['literalsPickDateCheck'] = cleanStr($data['literalsPickDateCheck']);
            $data['literalsPickDateCheckPeriod'] = cleanStr($data['literalsPickDateCheckPeriod']);
            $data['literalsPickDateSince'] = cleanStr($data['literalsPickDateSince']);
            $data['literalsPickDateUntil'] = cleanStr($data['literalsPickDateUntil']);
            $data['literalsPickDate'] = cleanStr($data['literalsPickDate']);
            $data['invoiceDeliveredDateCheck'] = cleanStr($data['invoiceDeliveredDateCheck']);
            $data['invoiceDeliveredDateCheckPeriod'] = cleanStr($data['invoiceDeliveredDateCheckPeriod']);
            $data['invoiceDeliveredDateSince'] = cleanStr($data['invoiceDeliveredDateSince']);
            $data['invoiceDeliveredDateUntil'] = cleanStr($data['invoiceDeliveredDateUntil']);
            $data['invoiceDeliveredDate'] = cleanStr($data['invoiceDeliveredDate']);
            $data['ssDateCheck'] = cleanStr($data['ssDateCheck']);
            $data['ssDateCheckPeriod'] = cleanStr($data['ssDateCheckPeriod']);
            $data['ssDateSince'] = cleanStr($data['ssDateSince']);
            $data['ssDateUntil'] = cleanStr($data['ssDateUntil']);
            $data['ssDate'] = cleanStr($data['ssDate']);
            $data['inssDateCheck'] = cleanStr($data['inssDateCheck']);
            $data['inssDateCheckPeriod'] = cleanStr($data['inssDateCheckPeriod']);
            $data['inssDateSince'] = cleanStr($data['inssDateSince']);
            $data['inssDateUntil'] = cleanStr($data['inssDateUntil']);
            $data['inssDate'] = cleanStr($data['inssDate']);
            $data['ismDateCheck'] = cleanStr($data['ismDateCheck']);
            $data['ismDateCheckPeriod'] = cleanStr($data['ismDateCheckPeriod']);
            $data['ismDateSince'] = cleanStr($data['ismDateSince']);
            $data['ismDateUntil'] = cleanStr($data['ismDateUntil']);
            $data['ismDate'] = cleanStr($data['ismDate']);
            $data['socialDateCheck'] = cleanStr($data['socialDateCheck']);
            $data['socialDateCheckPeriod'] = cleanStr($data['socialDateCheckPeriod']);
            $data['socialDateSince'] = cleanStr($data['socialDateSince']);
            $data['socialDateUntil'] = cleanStr($data['socialDateUntil']);
            $data['socialDate'] = cleanStr($data['socialDate']);
            $data['passiveDateCheck'] = cleanStr($data['passiveDateCheck']);
            $data['passiveDateCheckPeriod'] = cleanStr($data['passiveDateCheckPeriod']);
            $data['passiveDateSince'] = cleanStr($data['passiveDateSince']);
            $data['passiveDateUntil'] = cleanStr($data['passiveDateUntil']);
            $data['passiveDate'] = cleanStr($data['passiveDate']);
            $data['isfasDateCheck'] = cleanStr($data['isfasDateCheck']);
            $data['isfasDateCheckPeriod'] = cleanStr($data['isfasDateCheckPeriod']);
            $data['isfasDateSince'] = cleanStr($data['isfasDateSince']);
            $data['isfasDateUntil'] = cleanStr($data['isfasDateUntil']);
            $data['isfasDate'] = cleanStr($data['isfasDate']);
            $data['dniDateGCheck'] = cleanStr($data['dniDateGCheck']);
            $data['dniDateGCheckPeriod'] = cleanStr($data['dniDateGCheckPeriod']);
            $data['dniDateGSince'] = cleanStr($data['dniDateGSince']);
            $data['dniDateGUntil'] = cleanStr($data['dniDateGUntil']);
            $data['dniDateG'] = cleanStr($data['dniDateG']);
            $data['familyBookDateGCheck'] = cleanStr($data['familyBookDateGCheck']);
            $data['familyBookDateGCheckPeriod'] = cleanStr($data['familyBookDateGCheckPeriod']);
            $data['familyBookDateGSince'] = cleanStr($data['familyBookDateGSince']);
            $data['familyBookDateGUntil'] = cleanStr($data['familyBookDateGUntil']);
            $data['familyBookDateG'] = cleanStr($data['familyBookDateG']);
            $data['literalMarriageDateGCheck'] = cleanStr($data['literalMarriageDateGCheck']);
            $data['literalMarriageDateGCheckPeriod'] = cleanStr($data['literalMarriageDateGCheckPeriod']);
            $data['literalMarriageDateGSince'] = cleanStr($data['literalMarriageDateGSince']);
            $data['literalMarriageDateGUntil'] = cleanStr($data['literalMarriageDateGUntil']);
            $data['literalMarriageDateG'] = cleanStr($data['literalMarriageDateG']);
            $data['literalBirthdayDateGCheck'] = cleanStr($data['literalBirthdayDateGCheck']);
            $data['literalBirthdayDateGCheckPeriod'] = cleanStr($data['literalBirthdayDateGCheckPeriod']);
            $data['literalBirthdayDateGSince'] = cleanStr($data['literalBirthdayDateGSince']);
            $data['literalBirthdayDateGUntil'] = cleanStr($data['literalBirthdayDateGUntil']);
            $data['literalBirthdayDateG'] = cleanStr($data['literalBirthdayDateG']);
            $data['registrationDateGCheck'] = cleanStr($data['registrationDateGCheck']);
            $data['registrationDateGCheckPeriod'] = cleanStr($data['registrationDateGCheckPeriod']);
            $data['registrationDateGSince'] = cleanStr($data['aaaaaaaaaaaaaaaa']);
            $data['registrationDateGUntil'] = cleanStr($data['registrationDateGUntil']);
            $data['registrationDateG'] = cleanStr($data['registrationDateG']);
            $data['dniDateRCheck'] = cleanStr($data['dniDateRCheck']);
            $data['dniDateRCheckPeriod'] = cleanStr($data['dniDateRCheckPeriod']);
            $data['dniDateRSince'] = cleanStr($data['dniDateRSince']);
            $data['dniDateRUntil'] = cleanStr($data['dniDateRUntil']);
            $data['dniDateR'] = cleanStr($data['dniDateR']);
            $data['familyBookDateRCheck'] = cleanStr($data['familyBookDateRCheck']);
            $data['familyBookDateRCheckPeriod'] = cleanStr($data['familyBookDateRCheckPeriod']);
            $data['familyBookDateRSince'] = cleanStr($data['familyBookDateRSince']);
            $data['familyBookDateRUntil'] = cleanStr($data['familyBookDateRUntil']);
            $data['familyBookDateR'] = cleanStr($data['familyBookDateR']);
            $data['literalMarriageDateRCheck'] = cleanStr($data['literalMarriageDateRCheck']);
            $data['literalMarriageDateRCheckPeriod'] = cleanStr($data['literalMarriageDateRCheckPeriod']);
            $data['literalMarriageDateRSince'] = cleanStr($data['literalMarriageDateRSince']);
            $data['literalMarriageDateRUntil'] = cleanStr($data['literalMarriageDateRUntil']);
            $data['literalMarriageDateR'] = cleanStr($data['literalMarriageDateR']);
            $data['literalBirthdayDateRCheck'] = cleanStr($data['literalBirthdayDateRCheck']);
            $data['literalBirthdayDateRCheckPeriod'] = cleanStr($data['literalBirthdayDateRCheckPeriod']);
            $data['literalBirthdayDateRSince'] = cleanStr($data['literalBirthdayDateRSince']);
            $data['literalBirthdayDateRUntil'] = cleanStr($data['literalBirthdayDateRUntil']);
            $data['literalBirthdayDateR'] = cleanStr($data['literalBirthdayDateR']);
            $data['registrationDateRCheck'] = cleanStr($data['registrationDateRCheck']);
            $data['registrationDateRCheckPeriod'] = cleanStr($data['aaaaaaaaaaaaaaaa']);
            $data['registrationDateRSince'] = cleanStr($data['registrationDateRSince']);
            $data['registrationDateRUntil'] = cleanStr($data['registrationDateRUntil']);
            $data['registrationDateR'] = cleanStr($data['registrationDateR']);
            $data['lastWishDateCheck'] = cleanStr($data['lastWishDateCheck']);
            $data['lastWishDateCheckPeriod'] = cleanStr($data['lastWishDateCheckPeriod']);
            $data['lastWishDateSince'] = cleanStr($data['lastWishDateSince']);
            $data['lastWishDateUntil'] = cleanStr($data['lastWishDateUntil']);
            $data['lastWishDate'] = cleanStr($data['lastWishDate']);
            $data['from'] = cleanStr($data['from']);
            $data['to'] = cleanStr($data['to']);

            $sql = '';
            $select = 'SELECT a.ID, a.attendanceDate, e.number, e.deceasedName, e.deceasedSurname';
            $from = ' FROM Assistances a, Expedients e';
            $join = '';
            $where = ' WHERE a.expedient = e.expedientID AND e.leavingDate IS NULL';

            if($data['attendanceDateCheck'] == 'true'){
                if($data['attendanceDateCheckPeriod'] == 'true'){
                    $where .= ' AND a.attendanceDate BETWEEN ' . $data['attendanceDateSince'] . ' AND ' . $data['attendanceDateUntil'];
                }else{
                    $where .= ' AND a.attendanceDate = ' . $data['attendanceDate'];
                }
            }

            if($data['widowCheck'] == 'true'){
                if($data['widow'] == 'true'){
                    $where .= " AND e.deceasedFirstNuptials != ''";
                }else{
                    $where .= " AND e.deceasedFirstNuptials = ''";
                }
            }

            if($data['assistancePlaceCheck'] == 'true'){
                $where .= ' AND deceasedMortuary = ' . $data['assistancePlace'];
            }

            if($data['locationCheck'] == 'true'){
                $where .= ' AND location = ' . $data['location'];
            }

            if($data['deceasedDateCheck'] == 'true'){
                if($data['deceasedDateCheckPeriod'] == 'true'){
                    $where .= ' AND e.deceasedDate BETWEEN ' . $data['deceasedDateSince'] . ' AND ' . $data['deceasedDateUntil'];
                }else{
                    $where .= ' AND e.deceasedDate = ' . $data['deceasedDate'];
                }
            }

            if($data['literalsPickDateCheck'] == 'true'){
                if($data['literalsPickDateCheckPeriod'] == 'true'){
                    $where .= ' AND a.literalDate BETWEEN ' . $data['literalsPickDateSince'] . ' AND ' . $data['literalsPickDateUntil'];
                }else{
                    $where .= ' AND a.literalDate = ' . $data['literalsPickDate'];
                }
            }

            if($data['invoiceDeliveredDateCheck'] == 'true'){
                if($data['invoiceDeliveredDateCheckPeriod'] == 'true'){
                    $where .= ' AND a.receiptDate BETWEEN ' . $data['invoiceDeliveredDateSince'] . ' AND ' . $data['invoiceDeliveredDateUntil'];
                }else{
                    $where .= ' AND a.receiptDate = ' . $data['invoiceDeliveredDate'];
                }
            }

            if($data['ssDateCheck'] == 'true'){
                if($data['ssDateCheckPeriod'] == 'true'){
                    $where .= ' AND a.ssDate BETWEEN ' . $data['ssDateSince'] . ' AND ' . $data['ssDateUntil'];
                }else{
                    $where .= ' AND a.ssDate = ' . $data['ssDate'];
                }
            }

            if($data['pensionCheck'] == 'true'){
                $where .= ' AND pension = ' . $data['pension'];
            }

            if($data['inssDateCheck'] == 'true'){
                if($data['inssDateCheckPeriod'] == 'true'){
                    $where .= ' AND a.inssDate BETWEEN ' . $data['inssDateSince'] . ' AND ' . $data['inssDateUntil'];
                }else{
                    $where .= ' AND a.inssDate = ' . $data['inssDate'];
                }
            }

            if($data['ismDateCheck'] == 'true'){
                if($data['ismDateCheckPeriod'] == 'true'){
                    $where .= ' AND a.ismDate BETWEEN ' . $data['ismDateSince'] . ' AND ' . $data['ismDateUntil'];
                }else{
                    $where .= ' AND a.ismDate = ' . $data['ismDate'];
                }
            }

            if($data['socialDateCheck'] == 'true'){
                if($data['socialDateCheckPeriod'] == 'true'){
                    $where .= ' AND a.socialDate BETWEEN ' . $data['socialDateSince'] . ' AND ' . $data['socialDateUntil'];
                }else{
                    $where .= ' AND a.socialDate = ' . $data['socialDate'];
                }
            }

            if($data['passiveDateCheck'] == 'true'){
                if($data['passiveDateCheckPeriod'] == 'true'){
                    $where .= ' AND a.passiveDate BETWEEN ' . $data['passiveDateSince'] . ' AND ' . $data['passiveDateUntil'];
                }else{
                    $where .= ' AND a.passiveDate = ' . $data['passiveDate'];
                }
            }

            if($data['isfasDateCheck'] == 'true'){
                if($data['isfasDateCheckPeriod'] == 'true'){
                    $where .= ' AND a.isfasDate BETWEEN ' . $data['isfasDateSince'] . ' AND ' . $data['isfasDateUntil'];
                }else{
                    $where .= ' AND a.isfasDate = ' . $data['isfasDate'];
                }
            }

            if($data['dniDateGCheck'] == 'true'){
                if($data['dniDateGCheckPeriod'] == 'true'){
                    $where .= ' AND a.dniDateG BETWEEN ' . $data['dniDateGSince'] . ' AND ' . $data['dniDateGUntil'];
                }else{
                    $where .= ' AND a.dniDateG = ' . $data['dniDateG'];
                }
            }

            if($data['familyBookDateGCheck'] == 'true'){
                if($data['familyBookDateGCheckPeriod'] == 'true'){
                    $where .= ' AND a.familyBookDateG BETWEEN ' . $data['familyBookDateGSince'] . ' AND ' . $data['familyBookDateGUntil'];
                }else{
                    $where .= ' AND a.familyBookDateG = ' . $data['familyBookDateG'];
                }
            }

            if($data['literalMarriageDateGCheck'] == 'true'){
                if($data['literalMarriageDateGCheckPeriod'] == 'true'){
                    $where .= ' AND a.literalMarriageDateG BETWEEN ' . $data['literalMarriageDateGSince'] . ' AND ' . $data['literalMarriageDateGUntil'];
                }else{
                    $where .= ' AND a.literalMarriageDateG = ' . $data['literalMarriageDateG'];
                }
            }

            if($data['literalBirthdayDateGCheck'] == 'true'){
                if($data['literalBirthdayDateGCheckPeriod'] == 'true'){
                    $where .= ' AND a.literalBirthdayDateG BETWEEN ' . $data['literalBirthdayDateGSince'] . ' AND ' . $data['literalBirthdayDateGUntil'];
                }else{
                    $where .= ' AND a.literalBirthdayDateG = ' . $data['literalBirthdayDateG'];
                }
            }

            if($data['registrationDateGCheck'] == 'true'){
                if($data['registrationDateGCheckPeriod'] == 'true'){
                    $where .= ' AND a.registrationDateG BETWEEN ' . $data['registrationDateGSince'] . ' AND ' . $data['registrationDateGUntil'];
                }else{
                    $where .= ' AND a.registrationDateG = ' . $data['registrationDateG'];
                }
            }

            if($data['dniDateRCheck'] == 'true'){
                if($data['dniDateRCheckPeriod'] == 'true'){
                    $where .= ' AND a.dniDateR BETWEEN ' . $data['dniDateRSince'] . ' AND ' . $data['dniDateRUntil'];
                }else{
                    $where .= ' AND a.dniDateR = ' . $data['dniDateR'];
                }
            }

            if($data['familyBookDateRCheck'] == 'true'){
                if($data['familyBookDateRCheckPeriod'] == 'true'){
                    $where .= ' AND a.familyBookDateR BETWEEN ' . $data['familyBookDateRSince'] . ' AND ' . $data['familyBookDateRUntil'];
                }else{
                    $where .= ' AND a.familyBookDateR = ' . $data['familyBookDateR'];
                }
            }

            if($data['literalMarriageDateRCheck'] == 'true'){
                if($data['literalMarriageDateRCheckPeriod'] == 'true'){
                    $where .= ' AND a.literalMarriageDateR BETWEEN ' . $data['literalMarriageDateRSince'] . ' AND ' . $data['literalMarriageDateRUntil'];
                }else{
                    $where .= ' AND a.literalMarriageDateR = ' . $data['literalMarriageDateR'];
                }
            }

            if($data['literalBirthdayDateRCheck'] == 'true'){
                if($data['literalBirthdayDateRCheckPeriod'] == 'true'){
                    $where .= ' AND a.literalBirthdayDateR BETWEEN ' . $data['literalBirthdayDateRSince'] . ' AND ' . $data['literalBirthdayDateRUntil'];
                }else{
                    $where .= ' AND a.literalBirthdayDateR = ' . $data['literalBirthdayDateR'];
                }
            }

            if($data['registrationDateRCheck'] == 'true'){
                if($data['registrationDateRCheckPeriod'] == 'true'){
                    $where .= ' AND a.registrationDateR BETWEEN ' . $data['registrationDateRSince'] . ' AND ' . $data['registrationDateRUntil'];
                }else{
                    $where .= ' AND a.registrationDateR = ' . $data['registrationDateR'];
                }
            }

            if($data['lastWishDateCheck'] == 'true'){
                if($data['lastWishDateCheckPeriod'] == 'true'){
                    $where .= ' AND a.lastWishDate BETWEEN ' . $data['lastWishDateSince'] . ' AND ' . $data['lastWishDateUntil'];
                }else{
                    $where .= ' AND a.lastWishDate = ' . $data['lastWishDate'];
                }
            }

            $limit = " LIMIT " . $data['from'] . ", " . $data['to'];

            $sql = $select . $from . $join . $where . $limit;
            $result = $db->query($sql);

            $sql = $select . $from . $join . $where;
            $total = $db->query($sql);
            $total = mysqli_num_rows($total);

            return mysqli_num_rows($result) == 0 ? null : array($db->resultToArray($result), $total);
        }

        /*
        **
        * Obtiene las asistencias
        *
        * @return array
        */
        public function listAssistancesDatatables(){
            $db = new DbHandler;

            $result = $db->query("  SELECT a.ID, a.attendanceDate, e.number, e.deceasedName, e.deceasedSurname
                                    FROM Assistances a, Expedients e
                                    WHERE a.expedient = e.expedientID AND a.leavingDate IS NULL AND e.leavingDate IS NULL and e.type != 2");
                
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }


        /*
        **
        * Obtiene los proveedores
        *
        * @return array
        */
        public function listPendingLiteralesDatatables(){
            $db = new DbHandler;

            $result = $db->query("SELECT    DAYOFMONTH(e.deceasedDate) as date, MONTH(e.deceasedDate) as month, IF(es.literalRequest = 0, 'Sin solicitar', 'Sin recibir'),
                                            CONCAT(e.deceasedName, ' ', e.deceasedSurname) as deceasedName,
                                            e.deceasedBirthday,
                                            IF(c.brandName IS NULL or c.brandName = '', CONCAT(c.name, ' ', c.surname), c.brandName) as name, 
                                            IF(es.literalCivilRegister IS NULL or es.literalCivilRegister = '' or es.literalCivilRegister = 'null', NULL, es.literalCivilRegister) as literalCivilRegister, 
                                            m.name as mortuary, ce.name as cemeteryName, e.number, UNIX_TIMESTAMP(e.deceasedDate) as dateOrdered, e.expedientID
                                FROM        (Expedients e, Expedients_Services es)
                                LEFT JOIN   Clients c ON e.client = c.clientID
                                LEFT JOIN   Mortuaries m ON e.deceasedMortuary = m.mortuaryID
                                LEFT JOIN   Cemeteries ce ON e.cemetery = ce.cemeteryID
                                WHERE       e.leavingDate IS NULL AND 
                                            (
                                                es.literalReceived IS NULL OR
                                                es.literalReceived = 0 OR
                                                es.literalRequest IS NULL OR
                                                es.literalRequest = 0
                                            ) AND
                                            es.literalNotApply = 0 AND
                                            e.type = 1 AND
                                            e.literal = 0 AND
                                            es.expedient = e.expedientID
                                ORDER BY    dateOrdered ASC");
                                
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArrayValue($result);
			}
        }

        /**
         * Gets for statistics
         * 
         * @return array
         */
        public function getForStatistics($from, $to, $mortuary = null){
            $db = new DbHandler;

            if($mortuary != null && $mortuary != ''){
                $result = $db->query("  SELECT      sa.assistance, sa.survey, sa.value, sa.notes, e.number, e.expedientID
                                        FROM        Survey_Assistance sa, Assistances a, Expedients e
                                        WHERE       sa.assistance = a.ID AND
                                                    a.expedient = e.expedientID AND
                                                    e.leavingDate IS NULL AND
                                                    a.leavingDate IS NULL AND
                                                    $from <= a.attendanceDate AND
                                                    $to >= a.attendanceDate AND
                                                    e.deceasedMortuary = $mortuary AND
                                                    e.type != 2
                                        ORDER BY    e.expNumYear, e.expNumSecuence");
            }else{
                $result = $db->query("  SELECT      sa.assistance, sa.survey, sa.value, sa.notes, e.number, e.expedientID
                                        FROM        Survey_Assistance sa, Assistances a, Expedients e
                                        WHERE       sa.assistance = a.ID AND
                                                    a.expedient = e.expedientID AND
                                                    e.leavingDate IS NULL AND
                                                    a.leavingDate IS NULL AND
                                                    $from <= a.attendanceDate AND
                                                    $to >= a.attendanceDate AND
                                                    e.type != 2
                                        ORDER BY    e.expNumYear, e.expNumSecuence");
            }

            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Gets survey headers
         * 
         * @return array
         */
        public function getSurveyHeaders(){
            $db = new DbHandler;

            $result = $db->query("  SELECT  s.service
                                    FROM    Survey s
                                    WHERE   s.leavingDate IS NULL");
                                
            if(mysqli_num_rows($result) == 0){
				return array();
			}else{
				return $db->resultToArray($result);
			}
        }

        /**
         * Gets aspects by expedient
         * 
         * @param int $expedient Expedient
         * @return array
         */
        public function getAspectsByExpedient($expedient){
            $db = new DbHandler;

            $result = $db->query("  SELECT  ss.aspects
                                    FROM    Satisfaction_Survey ss
                                    WHERE   ss.expedient = $expedient");
                                
            if(mysqli_num_rows($result) == 0){
				return '';
			}else{
				return $db->resultToArray($result)[0]['aspects'];
			}
        }
    }
?>