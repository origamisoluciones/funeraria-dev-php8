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

    require_once($_SESSION['basePath'] . "model/salaries.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getMonthSalaries':
                echo json_encode(getMonthSalaries($_POST['year']));
            break;
            case 'getSalariesTemplates':
                echo json_encode(getSalariesTemplates());
            break;
            case 'getSalariesUsers':
                echo json_encode(getSalariesUsers($_POST['date']));

                require_once($_SESSION['basePath'] . "model/logs.php");
        
                $logs = new Logs;
                $logs->createSimple("Salarios", "Consulta", "'Ha consultado los salarios'");
            break;
            case 'getTemplate':
                echo json_encode(getTemplate($_POST['template']));

                require_once($_SESSION['basePath'] . "model/logs.php");
        
                $logs = new Logs;
                $logs->createSimple("Configuración", "Salidas - Plantillas salarios - Consulta", "'Ha consultado una plantilla'");
            break;
            case 'getSalariesYears':
                echo json_encode(getSalariesYears());
            break;
            case 'saveTemplate':
                echo json_encode(saveTemplate($_POST['salariesUsers'], $_POST['templateName']));

                require_once($_SESSION['basePath'] . "model/logs.php");
        
                $logs = new Logs;
                $logs->createSimple("Configuración", "Salidas - Plantillas salarios - Modificación", "'Ha modificado una plantilla'");
            break;
            case 'updateSalaries':
                echo json_encode(updateSalaries($_POST['salariesUsers']));
                
                require_once($_SESSION['basePath'] . "model/logs.php");
        
                $logs = new Logs;
                $logs->createSimple("Salarios", "Modificación", "'Ha modificado los salarios'");
            break;
            case 'updateTemplate':
                echo json_encode(updateTemplate($_POST['salariesUsers'], $_POST['templateName'], $_POST['template']));
                
                require_once($_SESSION['basePath'] . "model/logs.php");
        
                $logs = new Logs;
                $logs->createSimple("Configuración", "Salidas - Plantillas salarios - Modificación", "'Ha modificado una plantilla'");
            break;
            case 'loadSalaries':
                echo json_encode(loadSalaries($_POST['date']));
            break;
            case 'downloadSalaries':
                echo json_encode(downloadSalaries($_POST['date']));
            break;
            case 'createSalariesYear':
                echo json_encode(createSalariesYear($_POST['year']));
            break;
        }
    }

    function getMonthSalaries($year){
        $salaries = new Salaries();
        return $salaries->getMonthSalaries($year);
    }

    function getSalariesTemplates(){
        $salaries = new Salaries();
        return $salaries->getSalariesTemplates();
    }

    function getSalariesUsers($date){
        $salaries = new Salaries();
        return $salaries->getSalariesUsers($date);
    }

    function getTemplate($template){
        $salaries = new Salaries();
        return $salaries->getTemplate($template);
    }

    function getSalariesYears(){
        $salaries = new Salaries();
        return $salaries->getSalariesYears();
    }

    function saveTemplate($salariesUsers, $templateName){
        $salaries = new Salaries();
        return $salaries->saveTemplate($salariesUsers, $templateName);
    }

    function updateSalaries($salariesUsers){
        $salaries = new Salaries();
        return $salaries->updateSalaries($salariesUsers);
    }

    function updateTemplate($salariesUsers, $templateName, $template){
        $salaries = new Salaries();
        return $salaries->updateTemplate($salariesUsers, $templateName, $template);
    }

    function loadSalaries($date){
        $file = $_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/salaries/$date.xls";
        if(!move_uploaded_file($_FILES['file']['tmp_name'], $file)){
            return false;
        }

        require_once($_SESSION['basePath'] . "core/libraries/composer/vendor/autoload.php");

        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($file);

        $data = $spreadsheet->getActiveSheet()->toArray(null, true, true, true);
        array_shift($data);
        array_shift($data);
        array_shift($data);
        array_shift($data);
        array_shift($data);
        array_shift($data);
        array_shift($data);
        array_shift($data);
        array_shift($data);
        array_pop($data);
        array_pop($data);
        array_pop($data);

        require_once($_SESSION['basePath'] . "model/staff.php");
        require_once($_SESSION['basePath'] . "model/salaries.php");

        $staff = new Staff;
        $salaries = new Salaries;

        $allSalaries = array();
        $previousCode = $data[0]['B'];
        $code = 0;
        $gross = 0;
        $liquid = 0;
        $retribution = 0;
        $IRPF = 0;
        $SSTRAB = 0;
        $SSEMP = 0;
        $totalTC1 = 0;
        $companyCost = 0;
        $seizure = 0;
        $diet = 0;
        $plus = 0;
        $extra = 0;
        $discounts = 0;
        foreach($data as $value){
            $code = trim($value['B']);

            if($code == $previousCode){
                $gross += floatval(str_replace(',', '', $value['D']));
                $liquid += floatval(str_replace(',', '', $value['E']));
                $retribution += floatval(str_replace(',', '', $value['F']));
                $IRPF += floatval(str_replace(',', '', $value['G']));
                $SSTRAB += floatval(str_replace(',', '', $value['H']));
                $SSEMP += floatval(str_replace(',', '', $value['I']));
                $totalTC1 += floatval(str_replace(',', '', $value['J']));
                $companyCost += floatval(str_replace(',', '', $value['K']));
                $seizure += floatval(str_replace(',', '', $value['L']));
                $diet += floatval(str_replace(',', '', $value['M']));
                $plus += floatval(str_replace(',', '', $value['N']));
                $extra += floatval(str_replace(',', '', $value['O']));
                $discounts += floatval(str_replace(',', '', $value['P']));
            }else{
                $staffID = $staff->getIdByCode($previousCode, $date);
                if($staffID != null){
                    $dataInsert = array(
                        'gross' => $gross,
                        'liquid' => $liquid,
                        'retribution' => $retribution,
                        'IRPF' => $IRPF,
                        'SSTRAB' => $SSTRAB,
                        'SSEMP' => $SSEMP,
                        'totalTC1' => $totalTC1,
                        'companyCost' => $companyCost,
                        'seizure' => $seizure,
                        'diet' => $diet,
                        'plus' => $plus,
                        'extra' => $extra,
                        'discounts' => $discounts,
                        'date' => $date,
                        'staff' => $staffID,
                        'code' => $previousCode
                    );

                    array_push($allSalaries, $dataInsert);
                }

                $gross = floatval(str_replace(',', '', $value['D']));
                $liquid = floatval(str_replace(',', '', $value['E']));
                $retribution = floatval(str_replace(',', '', $value['F']));
                $IRPF = floatval(str_replace(',', '', $value['G']));
                $SSTRAB = floatval(str_replace(',', '', $value['H']));
                $SSEMP = floatval(str_replace(',', '', $value['I']));
                $totalTC1 = floatval(str_replace(',', '', $value['J']));
                $companyCost = floatval(str_replace(',', '', $value['K']));
                $seizure = floatval(str_replace(',', '', $value['L']));
                $diet = floatval(str_replace(',', '', $value['M']));
                $plus = floatval(str_replace(',', '', $value['N']));
                $extra = floatval(str_replace(',', '', $value['O']));
                $discounts = floatval(str_replace(',', '', $value['P']));

                $previousCode = $code;
            }
        }

        // if(trim($data[count($data) - 2]['B']) == $previousCode){
        //     $gross += floatval(str_replace(',', '', $data[count($data) - 1]['D']));
        //     $liquid += floatval(str_replace(',', '', $data[count($data) - 1]['E']));
        //     $retribution += floatval(str_replace(',', '', $data[count($data) - 1]['F']));
        //     $IRPF += floatval(str_replace(',', '', $data[count($data) - 1]['G']));
        //     $SSTRAB += floatval(str_replace(',', '', $data[count($data) - 1]['H']));
        //     $SSEMP += floatval(str_replace(',', '', $data[count($data) - 1]['I']));
        //     $totalTC1 += floatval(str_replace(',', '', $data[count($data) - 1]['J']));
        //     $companyCost += floatval(str_replace(',', '', $data[count($data) - 1]['K']));
        //     $seizure += floatval(str_replace(',', '', $data[count($data) - 1]['L']));
        //     $diet += floatval(str_replace(',', '', $data[count($data) - 1]['M']));
        //     $plus += floatval(str_replace(',', '', $data[count($data) - 1]['N']));
        //     $extra += floatval(str_replace(',', '', $data[count($data) - 1]['O']));
        //     $discounts += floatval(str_replace(',', '', $data[count($data) - 1]['P']));
        // }else{
        //     $gross = floatval(str_replace(',', '', $data[count($data) - 1]['D']));
        //     $liquid = floatval(str_replace(',', '', $data[count($data) - 1]['E']));
        //     $retribution = floatval(str_replace(',', '', $data[count($data) - 1]['F']));
        //     $IRPF = floatval(str_replace(',', '', $data[count($data) - 1]['G']));
        //     $SSTRAB = floatval(str_replace(',', '', $data[count($data) - 1]['H']));
        //     $SSEMP = floatval(str_replace(',', '', $data[count($data) - 1]['I']));
        //     $totalTC1 = floatval(str_replace(',', '', $data[count($data) - 1]['J']));
        //     $companyCost = floatval(str_replace(',', '', $data[count($data) - 1]['K']));
        //     $seizure = floatval(str_replace(',', '', $data[count($data) - 1]['L']));
        //     $diet = floatval(str_replace(',', '', $data[count($data) - 1]['M']));
        //     $plus = floatval(str_replace(',', '', $data[count($data) - 1]['N']));
        //     $extra = floatval(str_replace(',', '', $data[count($data) - 1]['O']));
        //     $discounts = floatval(str_replace(',', '', $data[count($data) - 1]['P']));
        // }

        $staffID = $staff->getIdByCode($code, $date);
        if($staffID != null){
            $dataInsert = array(
                'gross' => $gross,
                'liquid' => $liquid,
                'retribution' => $retribution,
                'IRPF' => $IRPF,
                'SSTRAB' => $SSTRAB,
                'SSEMP' => $SSEMP,
                'totalTC1' => $totalTC1,
                'companyCost' => $companyCost,
                'seizure' => $seizure,
                'diet' => $diet,
                'plus' => $plus,
                'extra' => $extra,
                'discounts' => $discounts,
                'date' => $date,
                'staff' => $staffID,
                'code' => $code
            );

            array_push($allSalaries, $dataInsert);
        }

        $salaries->updateSalaries($allSalaries);

        return true;
    }

    /**
     * Descarga los salarios en csv
     */

    function downloadSalaries($date){        
        $salaries = new Salaries;
        $response = $salaries->getSalaries($date);

        $f = fopen($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/salaries/salaries.csv', 'w');

        $fields = array('Personal', 'Bruto', 'Líquido', 'Ret. Espec', 'IRPF', 'SSTRAB', 'SSEMP', 'Total TC1', 'Coste empresa', 'Embargo', 'Dietas mes', 'Plus disponibilidad', 'Provisión pagas extras', 'Descuentos');
        fputcsv($f, $fields, ';');

        foreach($response as $line){
            fputcsv($f, $line, ';');
        }

        fclose($f);

        return 'resources/files/' . $_SESSION['company'] . '/salaries/salaries.csv';
    }

    /**
     * Crear los salarios que no se hayan creado para un año
     * 
     * @param int $year Año
     * @return bool
     */
    function createSalariesYear($year){
        $salaries = new Salaries;
        return $salaries->createSalariesYear($year);
    }
?>