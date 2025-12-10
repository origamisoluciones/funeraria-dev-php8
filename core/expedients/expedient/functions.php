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

    if(empty($_POST) || !isset($_POST['type'])){
        http_response_code(405);
        return;
    }

    use PhpOffice\PhpWord\PhpWord;
    use PhpOffice\PhpWord\IOFactory;
    use PhpOffice\PhpWord\SimpleType\Jc;

    require_once($_SESSION['basePath'] . "model/expedients.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getExpedientStatus':
                echo json_encode(getExpedientStatus());
            break;
            case 'getFirstExpedientDate':
                echo json_encode(getFirstExpedientDate());
            break;
            case 'getExpedient':
                echo json_encode(getExpedient($_POST['expedientID']));
            break;
            case 'getStatus':
                echo json_encode(getStatus($_POST['expedientID']));
            break;
            case 'getClient':
                echo json_encode(getClient($_POST['expedientID']));
            break;
            case 'getClientExp':
                echo json_encode(getClientExp($_POST['template']));
            break;
            case 'getFirstExpedient':
                echo json_encode(getFirstExpedient());
            break;
            case 'reactive':
                echo json_encode(reactiveExpedient($_POST['expedientID']));
            break;
            case 'getFuneralHome':
                echo json_encode(getFuneralHome($_POST['expedientID']));
            break;
            case 'setStatusExpedient':
                echo json_encode(setStatusExpedient($_POST['expedientID'],$_POST['status']));
            break;
            case 'getExpedientID':
                echo json_encode(getExpedientID($_POST['assistance']));
            break;
            case 'getInfo':
                echo json_encode(getInfo($_POST['expedient']));
            break;
            case 'checkCremationTime':
                echo json_encode(checkCremationTime($_POST['crematoriumEntry'], $_POST['crematoriumLeaving'], $_POST['crematorium']));
            break;
            case 'checkCremationTimeEdit':
                echo json_encode(checkCremationTimeEdit($_POST['crematoriumEntry'], $_POST['crematoriumLeaving'], $_POST['expedient'], $_POST['crematorium']));
            break;
            case 'getNotesHiring':
                echo json_encode(getNotesHiring($_POST['expedient']));
            break;
            case 'getActiveExpedients':
                echo json_encode(getActiveExpedients());
            break;
            case 'associate':
                echo json_encode(associate($_POST['expedient'], $_POST['associate'], isset($_POST['mode'])));
            break;
            case 'getAssociate':
                echo json_encode(getAssociate($_POST['expedientID']));
            break;
            case 'deleteAssociation':
                echo json_encode(deleteAssociation($_POST['associate']));
            break;
            case 'convertToExpedient':
                echo json_encode(convertToExpedient($_POST['expedient'], $_POST['expedientType']));
            break;
            case 'checkAssistance':
                echo json_encode(checkAssistance($_POST['expedientID']));
            break;
            case 'exportObituaryTxt':
                echo json_encode(exportObituaryTxt($_POST['data']));
            break;
            case 'exportObituaryEditorTxt':
                echo json_encode(exportObituaryEditorTxt($_POST['data']));
            break;
            case 'getEmissionsControlStatistics':
                echo json_encode(getEmissionsControlStatistics($_POST['from'], $_POST['to'], $_POST['scale']));
            break;
            case 'exportObituaryEditorWord':
                echo json_encode(exportObituaryEditorWord($_POST['data']));
            break;
        }
    }

    /**
    * Obtiene los estados de los expedientes
    *
    * @return array
    */
    function getExpedient($data){
        $expedients = new Expedients();
        return $expedients->getExpedient($data);
    }
    
    /**
    * Obtiene los estados de los expedientes
    *
    * @return array
    */
    function getExpedientStatus(){
        $expedients = new Expedients();
        return $expedients->getExpedientStatus();
    }

    /**
    * Obtiene los estados de los expedientes
    *
    * @return array
    */
    function getFirstExpedientDate(){
        $expedients = new Expedients();
        return $expedients->getFirstExpedientDate();
    }

    /**
    * Obtiene los tipos de expedientes
    *
    * @return array
    */
    function getExpedientTypes($data){
        $expedients = new Expedients();
        return $expedients->getExpedientType($data);
    }

    /**
    * Obtiene los datos del cliente para el expediente a editar
    *
    * @return array
    */
    function getClient($data){
        $expedient = new Expedients();
        return $expedient->getClient($data);
    }
    
    /**
    * Obtiene los datos del cliente para el expediente a editar
    *
    * @return array
    */
    function getClientExp($data){
        $expedient = new Expedients();
        return $expedient->getClientExp($data);
    }
    
    /**
    * Obtiene los datos del cliente para el expediente a editar
    *
    * @return array
    */
    function getFirstExpedient(){
        $expedient = new Expedients();
        return $expedient->getFirstExpedient();
    }

    /**
    * Reactiva un expediente (Cambiando su estado de finalizado a facturado)
    *
    * @return array
    */
    function reactiveExpedient($data){
        $expedient = new Expedients();
        return $expedient->reactiveExpedient($data);
    }

    /**
    * Obtiene el estado del expediente a editar
    *
    * @return array
    */
    function getStatus($data){
        $expedient = new Expedients();
        return $expedient->getStatus($data);
    }

    /**
    * Obtiene la Funeraria asociada al expediente a editar
    *
    * @return array
    */
    function getFuneralHome($data){
        $expedient = new Expedients();
        return $expedient->getFuneralHome($data);
    }
    
    /**
    * Establece el nuevo estado para el expediente
    *
    * @return array
    */
    function setStatusExpedient($expedientID,$status){
        $expedient = new Expedients();
        return $expedient->setStatusExpedient($expedientID,$status);
    }

    /**
    * Obtiene el ID de un expediente dada su asistencia
    *
    * @return array
    */
    function getExpedientID($data){
        $expedient = new Expedients();
        return $expedient->getExpedientID($data);
    }

    /**
     * Obtiene información del expediente
     * 
     * @param int $data ID del expediente
     * @return array Información del expediente
     */
    function getInfo($data){
        $expedient = new Expedients();
        return $expedient->getInfo($data);
    }

    /**
     * Comprueba si ya hay una cremación para una fecha dada
     * 
     * @param int $start Fecha de inicio
     * @param int $end Fecha de fin
     * @return bool
     */
    function checkCremationTime($start, $end, $crematorium){
        $expedient = new Expedients;
        return $expedient->checkCremationTime($start, $end, $crematorium);
    }

    /**
     * Comprueba si ya hay una cremación para una fecha dada
     * 
     * @param int $start Fecha de inicio
     * @param int $end Fecha de fin
     * @param int $expedient Id del expediente
     * @return bool
     */
    function checkCremationTimeEdit($start, $end, $expedientId, $crematorium){
        $expedient = new Expedients;
        return $expedient->checkCremationTimeEdit($start, $end, $expedientId, $crematorium);
    }

    /**
     * Obtiene las notas de la contratación
     * 
     * @param int $id ID del expediente
     * @return array Notas de la contratación
     */
    function getNotesHiring($id){
        require_once($_SESSION['basePath'] . "model/expedientsNotes.php");
        $expedientNotes = new ExpedientsNotes;
        $found = $expedientNotes->getByExpedient($id, 0);

        return array($found, $_SESSION['user']);
    }

    /**
     * Obtiene los expedientes activos
     * 
     * @return array Expedientes activos
     */
    function getActiveExpedients(){
        $expedient = new Expedients;
        return $expedient->getActiveExpedients();
    }

    /**
     * Asocia un expediente de varios a un expediente activo
     * 
     * @param int $expedient Expediente a asociar
     * @param int $associate Expediente asociado
     * @param boolean $mode Si es moodo TPV (Sin sobreescribir datos de la ficha)
     * @return array Expedientes activos
     */
    function associate($expedient, $associate, $mode){
        $expedients = new Expedients;
        $associate = $expedients->associate($expedient, $associate, $mode);
        if($associate){
            if($expedients->getAssociate($expedient)){
                return true;
            }else{
                return false;
            }
        }else{
            return null;
        }
    }

    /**
     * Asocia un expediente de varios a un expediente activo
     * 
     * @param int $expedient Expediente a asociar
     * @param int $associate Expediente asociado
     * @return array Expedientes activos
     */
    function getAssociate($expedient){
        $expedients = new Expedients;
        return $expedients->getAssociate($expedient);
    }

    /**
     * Elimina la asociación de un expediente a otro
     * 
     * @param array $expedient Expediente
     * @return bool
     */
    function deleteAssociation($associateID){
        $expedients = new Expedients;
        return $expedients->deleteAssociation($associateID);
    }   

    /**
     * Convierte un expediente de tipo presupuesto en uno de tipo defunción
     * 
     * @param array $expedient Expediente
     * @return bool
     */
    function convertToExpedient($expedient, $expedientType){
        $expedients = new Expedients;

        // Checks if the expedient can be transform in defuntion or varios (cliente de contado)
        // -- Comentado por PESY 03/02 para que cualquier presupuesto pueda ser pasado
        // if($expedients->canBeConverted($expedient) == false){
        //     return false;
        // }

        $newExpedient = $expedients->getExpedient($expedient);
        foreach($newExpedient as $index => $value){
            if($value == null){
                $newExpedient[$index] = '';
            }
        }
        $newExpedient['requestDate'] = date('Y-m-d');
        $newExpedient['crematoriumStatus'] = 6;
        $newExpedient['expType'] = $expedientType;
        $newExpedient['status'] = 2;
        $newExpedient['crematoriumEntryDate'] = '';
        $newExpedient['crematoriumEntryTime'] = '';
        $newExpedient['crematoriumLeavingDate'] = '';
        $newExpedient['crematoriumLeavingTime'] = '';
        $newExpedient['deceasedLocality'] = '';
        $newExpedient['deceasedProvince'] = '';
        $newExpedient['funeralDateNew'] = '';
        $newExpedient['funeralTimeNew'] = '';
        $newExpedient['funeralDateBurial'] = '';
        $newExpedient['funeralTimeBurial'] = '';
        $newExpedient['moveTraslado'] = 0;
        $newExpedient['moveDevolucion'] = 0;
        $newExpedient['trazabilityId'] = '';
        $newExpedient['authNifType'] = 1;
        $newExpedient['placeOrigin'] = '';
        $newExpedient['locationOrigin'] = '';
        $newExpedient['carOrigin'] = '';
        $newExpedient['placeDestinyMiddle'] = '';
        $newExpedient['locationDestinyMiddle'] = '';
        $newExpedient['carDestinyMiddle'] = '';
        $newExpedient['placeDestinyFinal'] = '';
        $newExpedient['locationDestinyFinal'] = '';
        $newExpedient['dateDestinyFinal'] = '';
        $newExpedient['startVelaciontDate'] = '';
        $newExpedient['startVelaciontTime'] = '';
        $newExpedient['funeralHomeService'] = '';
        $newExpedient['familyAssistance'] = '';
        $newExpedient['carCollection1'] = '';
        $newExpedient['carCollection1LicensePlate'] = '';
        $newExpedient['carCollection1Brand'] = '';
        $newExpedient['carCollection1Model'] = '';
        $newExpedient['corpseCollection1'] = ''; 
        $newExpedient['corpseCollection2'] = '';
        $newExpedient['carCollection2'] = '';
        $newExpedient['staffTransfer1'] = ''; 
        $newExpedient['staffTransfer2'] = '';
        $newExpedient['hearse'] = '';
        $newExpedient['hearseLicensePlate'] = '';
        $newExpedient['hearseBrand'] = '';
        $newExpedient['hearseModel'] = '';
        $newExpedient['mortuaryRegNotes'] = '';
        $newExpedient['deceasedCause'] = '';
        $newExpedient['placeDestinationMiddle'] = '';
        $newExpedient['placeDestinationFinal'] = '';
        $newExpedient['placeDestinationFinalCemetery'] = '';
        $newExpedient['tellmebyeRoom'] = '';
        $newExpedient['tellmebyeRoomName'] = '';
        $newExpedient['entryDateBarrow'] = '';
        $newExpedient['entryTimeBarrow'] = '';
        $newExpedient['refrigeratedChamberName'] = '';
        $newExpedient['refrigeratedChamberDateStart'] = '';
        $newExpedient['refrigeratedChamberTimeStart'] = '';
        $newExpedient['refrigeratedChamberDateEnd'] = '';
        $newExpedient['refrigeratedChamberTimeEnd'] = '';

        $id = $expedients->createExpedient($newExpedient)['expedient'];
        $hirings = $expedients->getHiring($expedient);
        
        $expedients->unsetHirings($id);
        foreach($hirings as $value){
            $expedients->setHiring($id, $value);
        }

        // Get expedients notes
        require_once($_SESSION['basePath'] . "model/expedientsNotes.php");
        $expedientNotes = new ExpedientsNotes;
        $expedientNotesList = $expedientNotes->getByExpedientToConverted($expedient);
        $newExpedientNote = [];
        foreach($expedientNotesList as $value){

            $newExpedientNote['user'] = $value['user'];
            $newExpedientNote['expedient'] = $id;
            $newExpedientNote['section'] = $value['section'];
            $newExpedientNote['note'] = $value['note'];
            $newExpedientNote['create_date'] = $value['create_date'];

            $newExpedientNoteId = $expedientNotes->importNote($newExpedientNote);

            $expedientNotesUserList = $expedientNotes->getByExpedientNotesUsersToConverted($value['id']);
            $newExpedientNoteUser = [];
            foreach($expedientNotesUserList as $it){
             
                $newExpedientNoteUser['note'] = $newExpedientNoteId;
                $newExpedientNoteUser['user'] = $it['user'];
                $newExpedientNoteUser['date'] = $it['date'];
                $newExpedientNoteUser['seen'] = $it['seen'];
                $newExpedientNoteUser['create_date'] = $it['create_date'];
                $expedientNotes->importNoteUser($newExpedientNoteUser);
            }
        }

        // Update stock
        $expedients->updateHiringStock($id, 0);

        return true;
    }
    /**
     * Comprueba si existe la asistencia
     *     
     * @return array
     */
    function checkAssistance($expedientID){
        $expedients = new Expedients;
        return $expedients->checkAssistance($expedientID);
    }

    /**
     * Exporta a txt el formulario de la esquela
     *     
     * @return array
     */
    function exportObituaryTxt($data){
        if(!is_dir("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/exports/")){
            mkdir("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/exports/", 0777, true);
        }
        $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/exports/esquela.txt";
        $f = fopen($path, 'w');

        fwrite($f, "{$data['prayForText']}\n");
        fwrite($f, "{$data['prayForGenre']}\n");
        fwrite($f, "{$data['namePre']}\n");
        $data['dep'] == '1' ? fwrite($f, "D.E.P.: Sí\n") : fwrite($f, "D.E.P.: No\n");
        fwrite($f, "Nombre: {$data['namePre']} {$data['name']}\n");
        fwrite($f, "Apellidos: {$data['surname']}\n");
        fwrite($f, "Texto extra: {$data['extraText']}\n");
        fwrite($f, "Falleció: {$data['died']}\n");
        fwrite($f, "{$data['spousePre']} {$data['spouseName']}\n");
        fwrite($f, "{$data['childrenPre']} {$data['childrenNames']}\n");
        fwrite($f, "{$data['childrenInLawPre']} {$data['childrenInLawNames']}\n");
        fwrite($f, "{$data['grandchildrenPre']} {$data['grandchildrenNames']}\n");
        fwrite($f, "{$data['grandchildrenInLawPre']} {$data['grandchildrenInLawNames']}\n");
        fwrite($f, "{$data['greatGrandchildrenPre']} {$data['greatGrandchildrenNames']}\n");
        fwrite($f, "{$data['parentsPre']} {$data['parentsNames']}\n");
        fwrite($f, "{$data['parentsInLawPre']} {$data['parentsInLawNames']}\n");
        fwrite($f, "{$data['paternalGrandfathersPre']} {$data['paternalGrandfathersNames']}\n");
        fwrite($f, "{$data['paternalGrandmotherPre']} {$data['paternalGrandmotherNames']}\n");
        fwrite($f, "{$data['siblingsPre']} {$data['siblingsNames']}\n");
        fwrite($f, "{$data['politicalSiblingsPre']} {$data['politicalSiblingsNames']}\n");
        $data['siblings'] == '1' ? fwrite($f, "Hermanos: Sí\n") : fwrite($f, "Hermanos: No\n");
        $data['politicalSiblings'] == '1' ? fwrite($f, "Hermanos políticos: Sí\n") : fwrite($f, "Hermanos políticos: No\n");
        $data['grandchildren'] == '1' ? fwrite($f, "Nietos: Sí\n") : fwrite($f, "Nietos: No\n");
        $data['politicalGrandchildren'] == '1' ? fwrite($f, "Nietos políticos: Sí\n") : fwrite($f, "Nietos políticos: No\n");
        $data['greatGrandchildren'] == '1' ? fwrite($f, "Bisnietos: Sí\n") : fwrite($f, "Bisnietos: No\n");
        $data['uncles'] == '1' ? fwrite($f, "Tíos: Sí\n") : fwrite($f, "Tíos: No\n");
        $data['nephews'] == '1' ? fwrite($f, "Sobrinos: Sí\n") : fwrite($f, "Sobrinos: No\n");
        $data['cousins'] == '1' ? fwrite($f, "Primos: Sí\n") : fwrite($f, "Primos: No\n");
        fwrite($f, "Ruegan: {$data['pray']}\n");
        fwrite($f, "Funeral: {$data['funeral']}\n");
        fwrite($f, "Casa mortuoria: {$data['mortuary']}\n");
        fwrite($f, "Sala Nº: {$data['roomNumber']}\n");
        fwrite($f, "Localidad: {$data['location']}\n");
        $data['mourning'] == '1' ? fwrite($f, "No se recibe duelo: Sí\n") : fwrite($f, "No se recibe duelo: No\n");
        fwrite($f, "Reparto de esquelas en: {$data['deliverObituariesIn']}\n");
        fwrite($f, "Recorrido bus: {$data['busRoute']}\n");
        fclose($f);

        return true;
    }

    /**
     * Exporta a txt el formulario de la esquela
     *     
     * @return array
     */
    function exportObituaryEditorTxt($data){
        if(!is_dir("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/exports/")){
            mkdir("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/exports/", 0777, true);
        }
        $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/exports/esquela-editor.txt";
        $f = fopen($path, 'w');
        if(isset($data['quote'])){
            fwrite($f, "{$data['quote']}\n");
            fwrite($f, "--------\n");
        }
        if(isset($data['deceased'])){
            fwrite($f, "{$data['deceased']}\n");
            fwrite($f, "--------\n");
        }
        if(isset($data['extraText'])){
            fwrite($f, "{$data['extraText']}\n");
            fwrite($f, "--------\n");
        }
        if(isset($data['died'])){
            fwrite($f, "{$data['died']}\n");
            fwrite($f, "--------\n");
        }
        if(isset($data['widow'])){
            fwrite($f, "{$data['widow']}\n");
            fwrite($f, "--------\n");
        }
        if(isset($data['dep'])){
            fwrite($f, "{$data['dep']}\n");
            fwrite($f, "--------\n");
        }
        if(isset($data['family'])){
            fwrite($f, "{$data['family']}\n");
            fwrite($f, "--------\n");
        }
        if(isset($data['pray'])){
            fwrite($f, "{$data['pray']}\n");
            fwrite($f, "--------\n");
        }
        if(isset($data['funeral'])){
            fwrite($f, "{$data['funeral']}\n");
            fwrite($f, "--------\n");
        }
        if(isset($data['mourning'])){
            fwrite($f, "{$data['mourning']}\n");
            fwrite($f, "--------\n");
        }
        if(isset($data['bus'])){
            fwrite($f, "{$data['bus']}\n");
            fwrite($f, "--------\n");
        }
        if(isset($data['mortuary'])){
            fwrite($f, "{$data['mortuary']}\n");
            fwrite($f, "--------\n");
        }
        fclose($f);

        return true;
    }

    /**
     * Obtiene los datos para las estadísticas de control de mesiones
     *     
     * @return array
     */
    function getEmissionsControlStatistics($from, $to, $scale){
        $expedients = new Expedients;
        return $expedients->getEmissionsControlStatistics($from, $to, $scale);
    }

    /**
     * Exporta a docx el formulario de la esquela
     *     
     * @return array
     */
    function exportObituaryEditorWord($data){
        if(!is_dir("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/exports/")){
            mkdir("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/exports/", 0777, true);
        }
        $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/exports/esquela-editor.docx";

        require_once($_SESSION['basePath'] . 'resources/plugins/phpword/autoload.php');
        require_once($_SESSION['basePath'] . 'defines.php');

        $phpWord = new PhpWord();
        $phpWord->getSettings()->setThemeFontLang(new \PhpOffice\PhpWord\Style\Language(\PhpOffice\PhpWord\Style\Language::ES_ES));
        $section = $phpWord->addSection();

        $phpWord->addParagraphStyle('pLeft', ['alignment' => Jc::LEFT]);
        $phpWord->addParagraphStyle('pCenter', ['alignment' => Jc::CENTER]);
        $phpWord->addParagraphStyle('pRight', ['alignment' => Jc::RIGHT]);
        $phpWord->addParagraphStyle('pJustify', ['alignment' => Jc::BOTH]);
        $fontStyle = array('size' => 12, 'lang' => \PhpOffice\PhpWord\Style\Language::ES_ES);
        $fontStyleAddText = array('size' => 10, 'lang' => \PhpOffice\PhpWord\Style\Language::ES_ES);
        $fontStyleDeceased = array('size' => 22, 'bold' => true, 'lang' => \PhpOffice\PhpWord\Style\Language::ES_ES);

        // Order by y position
        usort($data, function($a, $b) {
            return ($a[3] <=> $b[3]) ?: ($a[2] <=> $b[2]);
        });

        foreach($data as $elem){
            if($elem[1] == 'image'){

                $imagePath = $_SESSION['basePath'] . explode(URL, $elem[0])[1];
                $imageInfo = getimagesize($imagePath);

                $originalWidth = $imageInfo[0];
                $originalHeight = $imageInfo[1];

                // Escalado según Konva
                if(isset($elem[5])){
                    $scaleX = floatval($elem[5]);
                }else{
                    $scaleX = 1;
                }
                if(isset($elem[6])){
                    $scaleY = floatval($elem[6]);
                }else{
                    $scaleY = 1;
                }

                $scaledWidth = $originalWidth * $scaleX;
                $scaledHeight = $originalHeight * $scaleY;

                // Limitar ancho máximo a 200 (opcional)
                if ($scaledWidth > 200) {
                    $aspect = $scaledWidth / 200;
                    $scaledWidth = $scaledWidth / $aspect;
                    $scaledHeight = $scaledHeight / $aspect;
                }

                $section->addImage($imagePath, [
                    'width' => $scaledWidth,
                    'height' => $scaledHeight,
                    'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER
                ]);

            }else{
                switch($elem[4]){
                    case 'left':
                        $alignment = 'pLeft';
                    break;
                    case 'center':
                        $alignment = 'pCenter';
                    break;
                    case 'right':
                        $alignment = 'pRight';
                    break;
                    case 'justify':
                        $alignment = 'pJustify';
                    break;
                    default:
                        $alignment = 'pLeft';
                    break;
                }

                if($elem[5] == 'deceased'){
                    $section->addText($elem[0], $fontStyleDeceased, $alignment);
                }else if (preg_match('/^addText/', $elem[5])) {
                    $section->addText($elem[0], $fontStyleAddText, $alignment);
                }else{
                    $section->addText($elem[0], $fontStyle, $alignment);
                }
            }
        }

        $writer = IOFactory::createWriter($phpWord, 'Word2007');
        $writer->save($path);
        unset($writer);

        return true;
    }
?>