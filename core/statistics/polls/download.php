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

    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

    $data = $_POST['data'];
    $dateSince = $data['dateSince'];
    $dateUntil = $data['dateUntil'];
    $mortuary = $data['mortuary'];
    $clientType = $data['clientType'];
    $client = $data['client'];
    $poll = $data['poll'];

    require_once($_SESSION['basePath'] . "model/statistics.php");
    $statistics = new Statistics();
    $infoDownload = $statistics->downloadExpedientsPolls($dateSince, $dateUntil, $mortuary, $clientType, $client, $poll);

    if(count($infoDownload) > 0){

        // Draw totals by day
        $cellLetterIndex = 2;
        $cellsLettersData = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
            'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ',
            'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ',
            'DA', 'DB', 'DC', 'DD', 'DE', 'DF', 'DG', 'DH', 'DI', 'DJ', 'DK', 'DL', 'DM', 'DN', 'DO', 'DP', 'DQ', 'DR', 'DS', 'DT', 'DU', 'DV', 'DW', 'DX', 'DY', 'DZ',
            'EA', 'EB', 'EC', 'ED', 'EE', 'EF', 'EG', 'EH', 'EI', 'EJ', 'EK', 'EL', 'EM', 'EN', 'EO', 'EP', 'EQ', 'ER', 'ES', 'ET', 'EU', 'EV', 'EW', 'EX', 'EY', 'EZ',
            'FA', 'FB', 'FC', 'FD', 'FE', 'FF', 'FG', 'FH', 'FI', 'FJ', 'FK', 'FL', 'FM', 'FN', 'FO', 'FP', 'FQ', 'FR', 'FS', 'FT', 'FU', 'FV', 'FW', 'FX', 'FY', 'FZ',
            'GA', 'GB', 'GC', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GJ', 'GK', 'GL', 'GM', 'GN', 'GO', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GV', 'GW', 'GX', 'GY', 'GZ',
            'HA', 'HB', 'HC', 'HD', 'HE', 'HF', 'H', 'HH', 'HI', 'HJ', 'HK', 'HL', 'HM', 'HN', 'HO', 'HP', 'HQ', 'HR', 'HS', 'HT', 'HU', 'HV', 'HW', 'HX', 'HY', 'HZ',
            'IA', 'IB', 'IC', 'ID', 'IE', 'IF', 'I', 'IH', 'II', 'IJ', 'IK', 'IL', 'IM', 'IN', 'IO', 'IP', 'IQ', 'IR', 'IS', 'IT', 'IU', 'IV', 'IW', 'IX', 'IY', 'IZ',
            'JA', 'JB', 'JC', 'JD', 'JE', 'JF', 'J', 'JH', 'JI', 'JJ', 'JK', 'JL', 'JM', 'JN', 'JO', 'JP', 'JQ', 'JR', 'JS', 'JT', 'JU', 'JV', 'JW', 'JX', 'JY', 'JZ',
            'KA', 'KB', 'KC', 'KD', 'KE', 'KF', 'K', 'KH', 'KI', 'KJ', 'KK', 'KL', 'KM', 'KN', 'KO', 'KP', 'KQ', 'KR', 'KS', 'KT', 'KU', 'KV', 'KW', 'KX', 'KY', 'KZ',
            'LA', 'LB', 'LC', 'LD', 'LE', 'LF', 'L', 'LH', 'LI', 'LJ', 'LK', 'LL', 'LM', 'LN', 'LO', 'LP', 'LQ', 'LR', 'LS', 'LT', 'LU', 'LV', 'LW', 'LX', 'LY', 'LZ',
            'MA', 'MB', 'MC', 'MD', 'ME', 'MF', 'M', 'MH', 'MI', 'MJ', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ',
            'NA', 'NB', 'NC', 'ND', 'NE', 'NF', 'N', 'NH', 'NI', 'NJ', 'NK', 'NL', 'NM', 'NN', 'NO', 'NP', 'NQ', 'NR', 'NS', 'NT', 'NU', 'NV', 'NW', 'NX', 'NY', 'NZ',
            'OA', 'OB', 'OC', 'OD', 'OE', 'OF', 'O', 'OH', 'OI', 'OJ', 'OK', 'OL', 'OM', 'ON', 'OO', 'OP', 'OQ', 'OR', 'OS', 'OT', 'OU', 'OV', 'OW', 'OX', 'OY', 'OZ',
        ];

        require_once($_SESSION['basePath'] . 'resources/plugins/phpspreadsheet/autoload.php');
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet()->setTitle('Encuestas de satisfacción');

        $sheet->mergeCells("A1:A2");
        $sheet->setCellValue("A1", "Defunción");
        $sheet->getStyle("A1")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("A1")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("A1")->getFont()->setName('Arial')->setSize(9)->setBold(true);
        $sheet->getStyle("A2")->getBorders()->getBottom()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');

        $sheet->mergeCells("B1:B2");
        $sheet->setCellValue("B1", "Fallecido");
        $sheet->getStyle("B1")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("B1")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("B1")->getFont()->setName('Arial')->setSize(9)->setBold(true);
        $sheet->getStyle("B2")->getBorders()->getBottom()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');

        // Draw poll headers (Poll title and questions)
        $auxPollsLimitCell = [];
        foreach($infoDownload['pollsHeaders'] as $index=>$value){

            $cellLast = $cellLetterIndex + intval($value['total_questions']) - 1;

            $auxPollsLimitCell[$value['id']]['letterStart'] = $cellLetterIndex;

            $sheet->mergeCells($cellsLettersData[$cellLetterIndex]."1:".$cellsLettersData[$cellLast]."1");
            $sheet->setCellValue($cellsLettersData[$cellLetterIndex]."1", $value['title']);
            $sheet->getStyle($cellsLettersData[$cellLetterIndex]."1")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle($cellsLettersData[$cellLetterIndex]."1")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle($cellsLettersData[$cellLetterIndex]."1")->getFont()->setName('Arial')->setSize(9)->setBold(true);
            
            // Borders
            $sheet->getStyle($cellsLettersData[$cellLetterIndex]."1")->getBorders()->getLeft()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');
            $sheet->getStyle($cellsLettersData[$cellLetterIndex]."2")->getBorders()->getLeft()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');
            $sheet->getStyle($cellsLettersData[$cellLast]."1")->getBorders()->getRight()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');
            $sheet->getStyle($cellsLettersData[$cellLetterIndex]."1:".$cellsLettersData[$cellLast]."1")->getBorders()->getBottom()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN)->getColor()->setRGB('000000');
            $sheet->getStyle($cellsLettersData[$cellLast]."2")->getBorders()->getRight()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');
            $sheet->getStyle($cellsLettersData[$cellLetterIndex]."2:".$cellsLettersData[$cellLast]."2")->getBorders()->getBottom()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');

            $cellQuestionIndex = $cellLetterIndex;
            foreach($value['questions'] as $indexItem=>$item){
                $sheet->setCellValue($cellsLettersData[$cellQuestionIndex]."2", $item['question']);
                $sheet->getStyle($cellsLettersData[$cellQuestionIndex]."2")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                $sheet->getStyle($cellsLettersData[$cellQuestionIndex]."2")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle($cellsLettersData[$cellQuestionIndex]."2")->getFont()->setName('Arial')->setSize(9);
                $cellQuestionIndex++;
                $sheet->setCellValue($cellsLettersData[$cellQuestionIndex]."2", 'P'.($indexItem + 1) . '. Observaciones');
                $sheet->getStyle($cellsLettersData[$cellQuestionIndex]."2")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                $sheet->getStyle($cellsLettersData[$cellQuestionIndex]."2")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle($cellsLettersData[$cellQuestionIndex]."2")->getFont()->setName('Arial')->setSize(9);
                $cellQuestionIndex++;
            }

            $cellLetterIndex = $cellQuestionIndex;
        }

        // Statistics header
        $cellStartHeaderStatistics = $cellLast + 2;
        $cellLastStart = $cellStartHeaderStatistics;
        $cellLastEnd = $cellLastStart + 2;

        $sheet->mergeCells($cellsLettersData[$cellLastStart]."1:".$cellsLettersData[$cellLastEnd]."1");
        $sheet->setCellValue($cellsLettersData[$cellLastStart]."1", "Estadísticas");
        $sheet->getStyle($cellsLettersData[$cellLastStart]."1")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle($cellsLettersData[$cellLastStart]."1")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle($cellsLettersData[$cellLastStart]."1")->getFont()->setName('Arial')->setSize(9)->setBold(true);
        $sheet->getStyle($cellsLettersData[$cellLastStart]."1")->getBorders()->getLeft()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');
        $sheet->getStyle($cellsLettersData[$cellLastStart]."1")->getBorders()->getRight()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');

        $sheet->setCellValue($cellsLettersData[$cellLastStart]."2", "Suma total cuestiones");
        $sheet->getStyle($cellsLettersData[$cellLastStart]."2")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle($cellsLettersData[$cellLastStart]."2")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle($cellsLettersData[$cellLastStart]."2")->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');

        $cellLastStart++;
        $sheet->setCellValue($cellsLettersData[$cellLastStart]."2", "Núm. cuestiones respondidas");
        $sheet->getStyle($cellsLettersData[$cellLastStart]."2")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle($cellsLettersData[$cellLastStart]."2")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle($cellsLettersData[$cellLastStart]."2")->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');
        
        $cellLastStart++;
        $sheet->setCellValue($cellsLettersData[$cellLastStart]."2", "Suma total cuestiones / Máx. puntuación posible");
        $sheet->getStyle($cellsLettersData[$cellLastStart]."2")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle($cellsLettersData[$cellLastStart]."2")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle($cellsLettersData[$cellLastStart]."2")->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');

        // Fixed colum
        $cellLast++;
        $sheet->freezePane("A3");

        // Draw poll answers
        $numColum = 3;
        // $statisticsByExpedient = [];
        foreach($infoDownload['pollsExpedients'] as $index=>$value){

            $sheet->setCellValue("A$numColum", $value['number']);
            $sheet->getStyle("A$numColum")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle("A$numColum")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("A$numColum")->getFont()->setName('Arial')->setSize(9);

            $sheet->setCellValue("B$numColum", $value['deceased']);
            $sheet->getStyle("B$numColum")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle("B$numColum")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("B$numColum")->getFont()->setName('Arial')->setSize(9);

            if(!isset($value['answers']) || !isset($value['answers'][0]) || $value['answers'][0]['score'] == null){

                // Set statistics
                $cellLastStartAnswerStatistics = $cellStartHeaderStatistics;

                $sheet->setCellValue($cellsLettersData[$cellLastStartAnswerStatistics].$numColum, 0);
                $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getFont()->setName('Arial')->setSize(9);

                $cellLastStartAnswerStatistics++;
                $sheet->setCellValue($cellsLettersData[$cellLastStartAnswerStatistics].$numColum, 0);
                $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getFont()->setName('Arial')->setSize(9);

                $cellLastStartAnswerStatistics++;
                $sheet->setCellValue($cellsLettersData[$cellLastStartAnswerStatistics].$numColum, 0);
                $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getFont()->setName('Arial')->setSize(9);

                // array_push($statisticsByExpedient,[$value['number'], $value['deceased'], 0,0,0]);

                $numColum++;
                continue;
            }

            $posStart = $auxPollsLimitCell[$value['answers'][0]['poll']]['letterStart'];
            $currentResultID = $value['answers'][0]['result_id'];
            $totalScore = 0;
            $answered = 0;
            $maxScore = intval($value['total_questions']) * 5;
            foreach($value['answers'] as $indexItem=>$item){

                if($currentResultID != $item['result_id']){ // When 1 expedient has more than 1 answer

                    // Set statistics
                    $cellLastStartAnswerStatistics = $cellStartHeaderStatistics;

                    $sheet->setCellValue($cellsLettersData[$cellLastStartAnswerStatistics].$numColum, $totalScore);
                    $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                    $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                    $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getFont()->setName('Arial')->setSize(9);

                    $cellLastStartAnswerStatistics++;
                    $sheet->setCellValue($cellsLettersData[$cellLastStartAnswerStatistics].$numColum, $answered);
                    $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                    $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                    $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getFont()->setName('Arial')->setSize(9);

                    $cellLastStartAnswerStatistics++;
                    $percentage = $maxScore == 0 ? 0 : number_format(floatval(($totalScore / $maxScore) * 100), 2);
                    $sheet->setCellValue($cellsLettersData[$cellLastStartAnswerStatistics].$numColum, $percentage);
                    $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                    $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                    $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getFont()->setName('Arial')->setSize(9);

                    // array_push($statisticsByExpedient,[$value['number'], $value['deceased'], $totalScore,$answered,$percentage]);

                    $totalScore = 0;
                    $answered = 0;

                    $posStart = $auxPollsLimitCell[$value['answers'][0]['poll']]['letterStart'];
                    $numColum++;
                    $currentResultID = $item['result_id'];

                    $sheet->setCellValue("A$numColum", $value['number']);
                    $sheet->getStyle("A$numColum")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                    $sheet->getStyle("A$numColum")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                    $sheet->getStyle("A$numColum")->getFont()->setName('Arial')->setSize(9);

                    $sheet->setCellValue("B$numColum", $value['deceased']);
                    $sheet->getStyle("B$numColum")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                    $sheet->getStyle("B$numColum")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                    $sheet->getStyle("B$numColum")->getFont()->setName('Arial')->setSize(9);
                }

                $totalScore += floatval($item['score']);
                if($item['score'] != null){
                    $answered++;
                }

                $sheet->setCellValue($cellsLettersData[$posStart].$numColum, $item['score']);
                $sheet->getStyle($cellsLettersData[$posStart].$numColum)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                $sheet->getStyle($cellsLettersData[$posStart].$numColum)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle($cellsLettersData[$posStart].$numColum)->getFont()->setName('Arial')->setSize(9);
                $posStart++;

                $sheet->setCellValue($cellsLettersData[$posStart].$numColum, $item['notes']);
                $sheet->getStyle($cellsLettersData[$posStart].$numColum)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                $sheet->getStyle($cellsLettersData[$posStart].$numColum)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle($cellsLettersData[$posStart].$numColum)->getFont()->setName('Arial')->setSize(9);
                $posStart++;
            }

            // Set statistics
            $cellLastStartAnswerStatistics = $cellStartHeaderStatistics;

            $sheet->setCellValue($cellsLettersData[$cellLastStartAnswerStatistics].$numColum, $totalScore);
            $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getFont()->setName('Arial')->setSize(9);

            $cellLastStartAnswerStatistics++;
            $sheet->setCellValue($cellsLettersData[$cellLastStartAnswerStatistics].$numColum, $answered);
            $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getFont()->setName('Arial')->setSize(9);

            $cellLastStartAnswerStatistics++;
            $percentage = $maxScore == 0 ? 0 : number_format(floatval(($totalScore / $maxScore) * 100), 2);
            $sheet->setCellValue($cellsLettersData[$cellLastStartAnswerStatistics].$numColum, $percentage);
            $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle($cellsLettersData[$cellLastStartAnswerStatistics].$numColum)->getFont()->setName('Arial')->setSize(9);

            // array_push($statisticsByExpedient,[$value['number'], $value['deceased'], $totalScore,$answered,$percentage]);

            $numColum++;
        }
        $endData = $numColum - 1;

        // Set footer statistics
        $cellLast -=1;
        $numColum++;
        $sheet->mergeCells("A$numColum:$cellsLettersData[$cellLast]$numColum");
        $sheet->setCellValue("A$numColum", "Resumen total estadísticas");
        $sheet->getStyle("A$numColum")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("A$numColum")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("A$numColum")->getFont()->setName('Arial')->setSize(9)->setBold(true);
        $sheet->getStyle("A$numColum:$cellsLettersData[$cellLast]$numColum")->getBorders()->getTop()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');
        $sheet->getStyle("A$numColum:$cellsLettersData[$cellLast]$numColum")->getBorders()->getBottom()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN)->getColor()->setRGB('000000');
        $sheet->getStyle("A$numColum")->getBorders()->getLeft()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');
        
        $maxStatsCells = $numColum + 4;
        $sheet->getStyle($cellsLettersData[$cellLast].$numColum.":".$cellsLettersData[$cellLast].$maxStatsCells)->getBorders()->getRight()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');
        $sheet->getStyle("A".$numColum.":".$cellsLettersData[$cellLast].$maxStatsCells)->getBorders()->getBottom()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');

        $numColum++;
        $sheet->mergeCells("A$numColum:B$numColum");
        $sheet->setCellValue("A$numColum", "Total contestaciones");
        $sheet->getStyle("A$numColum")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("A$numColum")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT);
        $sheet->getStyle("A$numColum")->getFont()->setName('Arial')->setSize(9)->setBold(true);
        $sheet->getStyle("A$numColum")->getBorders()->getLeft()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');
        $sheet->getStyle("B$numColum")->getBorders()->getRight()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN)->getColor()->setRGB('000000');

        foreach($cellsLettersData as $index=>$cells){
            if(
                strpos($sheet->getCell($cellsLettersData[$index].'2')->getValue(), 'Observaciones') !== false ||
                $index < 2
            ){
                continue;
            }else if($sheet->getCell($cellsLettersData[$index].'2')->getValue() == ''){
                break;
            }else{
                $noBlanks = 0;
                for($i = 3; $i <= $endData; $i++){
                    if($sheet->getCell($cellsLettersData[$index].$i)->getValue() != ''){
                        $noBlanks++;
                    }
                }

                $sheet->setCellValue($cellsLettersData[$index].$numColum, $noBlanks);
                $sheet->getStyle($cellsLettersData[$index].$numColum)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                $sheet->getStyle($cellsLettersData[$index].$numColum)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            }
        }

        $numColum++;
        $sheet->mergeCells("A$numColum:B$numColum");
        $sheet->setCellValue("A$numColum", "Total puntos de la pregunta");
        $sheet->getStyle("A$numColum")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("A$numColum")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT);
        $sheet->getStyle("A$numColum")->getFont()->setName('Arial')->setSize(9)->setBold(true);
        $sheet->getStyle("A$numColum")->getBorders()->getLeft()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');
        $sheet->getStyle("B$numColum")->getBorders()->getRight()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN)->getColor()->setRGB('000000');

        foreach($cellsLettersData as $index=>$cells){
            if(
                strpos($sheet->getCell($cellsLettersData[$index].'2')->getValue(), 'Observaciones') !== false ||
                $index < 2
            ){
                continue;
            }else if($sheet->getCell($cellsLettersData[$index].'2')->getValue() == ''){
                break;
            }else{
                $SUMRANGE = $cellsLettersData[$index].'3:'.$cellsLettersData[$index].$endData;
                $sheet->setCellValue($cellsLettersData[$index].$numColum, "=SUM($SUMRANGE)");
                $sheet->getStyle($cellsLettersData[$index].$numColum)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                $sheet->getStyle($cellsLettersData[$index].$numColum)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            }
        }

        $numColum++;
        $sheet->setCellValue("A$numColum", "Puntuación media");
        $sheet->mergeCells("A$numColum:B$numColum");
        $sheet->getStyle("A$numColum")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("A$numColum")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT);
        $sheet->getStyle("A$numColum")->getFont()->setName('Arial')->setSize(9)->setBold(true);
        $sheet->getStyle("A$numColum")->getBorders()->getLeft()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');
        $sheet->getStyle("B$numColum")->getBorders()->getRight()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN)->getColor()->setRGB('000000');

        foreach($cellsLettersData as $index=>$cells){
            if(
                strpos($sheet->getCell($cellsLettersData[$index].'2')->getValue(), 'Observaciones') !== false ||
                $index < 2
            ){
                continue;
            }else if($sheet->getCell($cellsLettersData[$index].'2')->getValue() == ''){
                break;
            }else{

                $totalAnsweredIndex = $numColum-2;
                $totalAnswered = $cellsLettersData[$index].$totalAnsweredIndex;

                $totalAnsweredMediaIndex = $numColum-1;
                $totalAnsweredMedia = $cellsLettersData[$index].$totalAnsweredMediaIndex;

                $sheet->setCellValue($cellsLettersData[$index].$numColum, "=$totalAnsweredMedia/$totalAnswered");
                $sheet->getStyle($cellsLettersData[$index].$numColum)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                $sheet->getStyle($cellsLettersData[$index].$numColum)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle($cellsLettersData[$index].$numColum)->getNumberFormat()->setFormatCode('0.00');
            }
        }

        $numColum++;
        $sheet->mergeCells("A$numColum:B$numColum");
        $sheet->setCellValue("A$numColum", "Porcentaje puntuación media");
        $sheet->getStyle("A$numColum")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("A$numColum")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT);
        $sheet->getStyle("A$numColum")->getFont()->setName('Arial')->setSize(9)->setBold(true);
        $sheet->getStyle("A$numColum")->getBorders()->getLeft()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');
        $sheet->getStyle("B$numColum")->getBorders()->getRight()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN)->getColor()->setRGB('000000');
        $sheet->getStyle("A$numColum")->getBorders()->getBottom()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM)->getColor()->setRGB('000000');

        foreach($cellsLettersData as $index=>$cells){
            if(
                strpos($sheet->getCell($cellsLettersData[$index].'2')->getValue(), 'Observaciones') !== false ||
                $index < 2
            ){
                continue;
            }else if($sheet->getCell($cellsLettersData[$index].'2')->getValue() == ''){
                break;
            }else{

                $totalAnsweredIndex = $numColum-3;
                $maxScoreTotalAnswered = intval($sheet->getCell($cellsLettersData[$index].$totalAnsweredIndex)->getValue()) * 5;

                $totalAnsweredMediaIndex = $numColum-2;
                $totalAnsweredMedia = $cellsLettersData[$index].$totalAnsweredMediaIndex;

                $sheet->setCellValue($cellsLettersData[$index].$numColum, "=($totalAnsweredMedia/$maxScoreTotalAnswered)*100");
                $sheet->getStyle($cellsLettersData[$index].$numColum)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                $sheet->getStyle($cellsLettersData[$index].$numColum)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle($cellsLettersData[$index].$numColum)->getNumberFormat()->setFormatCode('0.00');
            }
        }

        // Sets cell dimensions
        foreach($cellsLettersData as $index=>$cell){
            if($index > $cellLastStart){
                break;
            }else if($index < 2){ // Expd number and deceased name
                $sheet->getColumnDimension($cell)->setAutoSize(true);
            }else if($sheet->getCell($cellsLettersData[$index].'2')->getValue() == ''){
                continue;
            }else{
                $sheet->getColumnDimension($cell)->setWidth(15);
                $sheet->getStyle($cellsLettersData[$index])->getAlignment()->setWrapText(true); 
            }
        }

        $filename = 'encuestas_satisfaccion_'.time();
        $writer = new Xlsx($spreadsheet);
        if(!is_dir("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/tmp/")){
            mkdir("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/tmp/", 0777, true);
        }
        $writer->save("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/tmp/$filename.xlsx");
        echo json_encode("tmp/$filename.xlsx");
    }else{
        echo json_encode('no_results');
    }
?>
