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

    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "core/tools/validations.php");
    $expedient = cleanStr($_POST['expedient']);
    $docName = cleanStr($_POST['doc_name']);
    $doc = cleanStr($_POST['doc']);
    $fileName = cleanStr($_POST['fileName']);

    // Checks if exists file
    if(!file_exists($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/docs/$fileName")){
        echo json_encode("El archivo que intentas enviar no existe.");
    }

    // Generate sent register
    require_once($_SESSION['basePath'] . "model/expedientsHistoryDocsSent.php");
    $expedientsHistoryDocsSent = new ExpedientsHistoryDocsSent;
    $createDate = time();
    $historyID = $expedientsHistoryDocsSent->create($expedient, $docName, $createDate);
    if($historyID === null){
        echo json_encode("Ha ocurrido un error al generar el histórico");
    }

    // Save file version
    if(!is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/docs/history_sent/$historyID")){
        mkdir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/docs/history_sent/$historyID", 0777, true);
    }
    copy(
        $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/docs/$fileName", 
        $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/docs/history_sent/$historyID/$fileName"
    );

    require_once($_SESSION['basePath'] . "core/tools/mailHandler.php");
    
    $withCopy = true;

    // Checks assistants
    $assistantsList = $_POST['assistants'];
    if($assistantsList != null && $assistantsList != '' && count($assistantsList) > 0){
        require_once($_SESSION['basePath'] . "model/assistants.php");
        $assistants = new Assistants;
        foreach($assistantsList as $index=>$assistant){
            $elemID = cleanStr($assistant);
            $elemEmail = $assistants->getEmail($elemID);
            if($elemEmail == null){
                continue;
            }else{
                $elemEmail = $elemEmail[0]['email'];
            }

            $mailHandler = new MailHandler;
            if($mailHandler->sendExpedientDoc($elemEmail, $expedient, $doc, $fileName, $withCopy)){
                $expedientsHistoryDocsSent->createUserRegister($historyID, 'assistant', $elemID, $elemEmail, $createDate);
                $withCopy = false;
            }
        }
    }

    // Checks bellringers
    $bellringersList = $_POST['bellringers'];
    if($bellringersList != null && $bellringersList != '' && count($bellringersList) > 0){
        require_once($_SESSION['basePath'] . "model/bellringers.php");
        $bellringers = new BellRingers;
        foreach($bellringersList as $index=>$bellringer){
            $elemID = cleanStr($bellringer);
            $elemEmail = $bellringers->getEmail($elemID);
            if($elemEmail == null){
                continue;
            }else{
                $elemEmail = $elemEmail[0]['email'];
            }

            $mailHandler = new MailHandler;
            if($mailHandler->sendExpedientDoc($elemEmail, $expedient, $doc, $fileName, $withCopy)){
                $expedientsHistoryDocsSent->createUserRegister($historyID, 'bellringer', $elemID, $elemEmail, $createDate);
                $withCopy = false;
            }
        }
    }

    // Checks cemeteries
    $cemeteriesList = $_POST['cemeteries'];
    if($cemeteriesList != null && $cemeteriesList != '' && count($cemeteriesList) > 0){
        require_once($_SESSION['basePath'] . "model/cemeteries.php");
        $cemeteries = new Cemeteries;
        foreach($cemeteriesList as $index=>$cemeterie){
            $elemID = cleanStr($cemeterie);
            $elemEmail = $cemeteries->getEmail($elemID);
            if($elemEmail == null){
                continue;
            }else{
                $elemEmail = $elemEmail[0]['email'];
            }

            $mailHandler = new MailHandler;
            if($mailHandler->sendExpedientDoc($elemEmail, $expedient, $doc, $fileName, $withCopy)){
                $expedientsHistoryDocsSent->createUserRegister($historyID, 'cemetery', $elemID, $elemEmail, $createDate);
                $withCopy = false;
            }
        }
    }

    // Checks clients
    $clientsList = $_POST['clients'];
    if($clientsList != null && $clientsList != '' && count($clientsList) > 0){
        require_once($_SESSION['basePath'] . "model/clients.php");
        $clients = new Clients;
        foreach($clientsList as $index=>$client){
            $elemID = cleanStr($client);
            $elemEmail = $clients->getEmail($elemID);
            if($elemEmail == null){
                continue;
            }else{
                $elemEmail = $elemEmail[0]['email'];
            }

            $mailHandler = new MailHandler;
            if($mailHandler->sendExpedientDoc($elemEmail, $expedient, $doc, $fileName, $withCopy)){
                $expedientsHistoryDocsSent->createUserRegister($historyID, 'client', $elemID, $elemEmail, $createDate);
                $withCopy = false;
            }
        }
    }

    // Checks choirs
    $choirsList = $_POST['choirs'];
    if($choirsList != null && $choirsList != '' && count($choirsList) > 0){
        require_once($_SESSION['basePath'] . "model/choirs.php");
        $choirs = new Choirs;
        foreach($choirsList as $index=>$choir){
            $elemID = cleanStr($choir);
            $elemEmail = $choirs->getEmail($elemID);
            if($elemEmail == null){
                continue;
            }else{
                $elemEmail = $elemEmail[0]['email'];
            }

            $mailHandler = new MailHandler;
            if($mailHandler->sendExpedientDoc($elemEmail, $expedient, $doc, $fileName, $withCopy)){
                $expedientsHistoryDocsSent->createUserRegister($historyID, 'choir', $elemID, $elemEmail, $createDate);
                $withCopy = false;
            }
        }
    }

    // Checks priests
    $priestsList = $_POST['priests'];
    if($priestsList != null && $priestsList != '' && count($priestsList) > 0){
        require_once($_SESSION['basePath'] . "model/priests.php");
        $priests = new Priests;
        foreach($priestsList as $index=>$priest){
            $elemID = cleanStr($priest);
            $elemEmail = $priests->getEmail($elemID);
            if($elemEmail == null){
                continue;
            }else{
                $elemEmail = $elemEmail[0]['email'];
            }

            $mailHandler = new MailHandler;
            if($mailHandler->sendExpedientDoc($elemEmail, $expedient, $doc, $fileName, $withCopy)){
                $expedientsHistoryDocsSent->createUserRegister($historyID, 'priest', $elemID, $elemEmail, $createDate);
                $withCopy = false;
            }
        }
    }

    // Checks gravediggers
    $gravediggersList = $_POST['gravediggers'];
    if($gravediggersList != null && $gravediggersList != '' && count($gravediggersList) > 0){
        require_once($_SESSION['basePath'] . "model/gravediggers.php");
        $gravediggers = new Gravediggers;
        foreach($gravediggersList as $index=>$gravedigger){
            $elemID = cleanStr($gravedigger);
            $elemEmail = $gravediggers->getEmail($elemID);
            if($elemEmail == null){
                continue;
            }else{
                $elemEmail = $elemEmail[0]['email'];
            }

            $mailHandler = new MailHandler;
            if($mailHandler->sendExpedientDoc($elemEmail, $expedient, $doc, $fileName, $withCopy)){
                $expedientsHistoryDocsSent->createUserRegister($historyID, 'gravedigger', $elemID, $elemEmail, $createDate);
                $withCopy = false;
            }
        }
    }

    // Checks churches
    $churchesList = $_POST['churches'];
    if($churchesList != null && $churchesList != '' && count($churchesList) > 0){
        require_once($_SESSION['basePath'] . "model/churches.php");
        $churches = new Churches;
        foreach($churchesList as $index=>$churche){
            $elemID = cleanStr($churche);
            $elemEmail = $churches->getEmail($elemID);
            if($elemEmail == null){
                continue;
            }else{
                $elemEmail = $elemEmail[0]['email'];
            }

            $mailHandler = new MailHandler;
            if($mailHandler->sendExpedientDoc($elemEmail, $expedient, $doc, $fileName, $withCopy)){
                $expedientsHistoryDocsSent->createUserRegister($historyID, 'church', $elemID, $elemEmail, $createDate);
                $withCopy = false;
            }
        }
    }

    // Checks doctors
    $doctorsList = $_POST['doctors'];
    if($doctorsList != null && $doctorsList != '' && count($doctorsList) > 0){
        require_once($_SESSION['basePath'] . "model/doctors.php");
        $doctors = new Doctors;
        foreach($doctorsList as $index=>$doctor){
            $elemID = cleanStr($doctor);
            $elemEmail = $doctors->getEmail($elemID);
            if($elemEmail == null){
                continue;
            }else{
                $elemEmail = $elemEmail[0]['email'];
            }

            $mailHandler = new MailHandler;
            if($mailHandler->sendExpedientDoc($elemEmail, $expedient, $doc, $fileName, $withCopy)){
                $expedientsHistoryDocsSent->createUserRegister($historyID, 'doctor', $elemID, $elemEmail, $createDate);
                $withCopy = false;
            }
        }
    }

    // Checks staff
    $staffList = $_POST['staff'];
    if($staffList != null && $staffList != '' && count($staffList) > 0){
        require_once($_SESSION['basePath'] . "model/staff.php");
        $staff = new Staff;
        foreach($staffList as $index=>$item){
            $elemID = cleanStr($item);
            $elemEmail = $staff->getEmail($elemID);
            if($elemEmail == null){
                continue;
            }else{
                $elemEmail = $elemEmail[0]['email'];
            }

            $mailHandler = new MailHandler;
            if($mailHandler->sendExpedientDoc($elemEmail, $expedient, $doc, $fileName, $withCopy)){
                $expedientsHistoryDocsSent->createUserRegister($historyID, 'staff', $elemID, $elemEmail, $createDate);
                $withCopy = false;
            }
        }
    }

    // Checks carriers
    $carriersList = $_POST['carriers'];
    if($carriersList != null && $carriersList != '' && count($carriersList) > 0){
        require_once($_SESSION['basePath'] . "model/carriers.php");
        $carriers = new Carriers;
        foreach($carriersList as $index=>$carrier){
            $elemID = cleanStr($carrier);
            $elemEmail = $carriers->getEmail($elemID);
            if($elemEmail == null){
                continue;
            }else{
                $elemEmail = $elemEmail[0]['email'];
            }

            $mailHandler = new MailHandler;
            if($mailHandler->sendExpedientDoc($elemEmail, $expedient, $doc, $fileName, $withCopy)){
                $expedientsHistoryDocsSent->createUserRegister($historyID, 'carrier', $elemID, $elemEmail, $createDate);
                $withCopy = false;
            }
        }
    }

    // Checks suppliers
    $suppliersList = $_POST['suppliers'];
    if($suppliersList != null && $suppliersList != '' && count($suppliersList) > 0){
        require_once($_SESSION['basePath'] . "model/suppliers.php");
        $suppliers = new Suppliers;
        foreach($suppliersList as $index=>$supplier){
            $elemID = cleanStr($supplier);
            $elemEmail = $suppliers->getEmail($elemID);
            if($elemEmail == null){
                continue;
            }else{
                $elemEmail = $elemEmail[0]['email'];
            }

            $mailHandler = new MailHandler;
            if($mailHandler->sendExpedientDoc($elemEmail, $expedient, $doc, $fileName, $withCopy)){
                $expedientsHistoryDocsSent->createUserRegister($historyID, 'supplier', $elemID, $elemEmail, $createDate);
                $withCopy = false;
            }
        }
    }

    // Checks ohers emails
    $othersEmails = $_POST['othersEmails'];
    if($othersEmails != null && $othersEmails != '' && count($othersEmails) > 0){
        foreach($othersEmails as $other){
            $elemEmail = cleanStr($other);

            if(!checkEmail($elemEmail)){
                continue;
            }

            $mailHandler = new MailHandler;
            if($mailHandler->sendExpedientDoc($elemEmail, $expedient, $doc, $fileName, $withCopy)){
                $expedientsHistoryDocsSent->createUserRegister($historyID, null, null, $elemEmail, $createDate);
                $withCopy = false;
            }
        }
    }

    require_once($_SESSION['basePath'] . "model/logs.php");
    $logs = new Logs;
    $logs->createExpedient("Expedientes", $expedient, "Expedientes - Documentación", "'Ha enviado el documento ".$doc."'");
    echo json_encode(true);
?>