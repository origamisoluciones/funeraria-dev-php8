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

    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    require_once($_SESSION['basePath'] . "model/expenses.php");

    $utils = new Utils();
    $expenses = new Expenses();

    $ivaLabel = $utils->getIvaLabel();

    $list = $expenses->listReceivedInvoicedA3(
        $_POST['from'], $_POST['to'], $_POST['type'], null, $_POST['status'], $_POST['supplier'],
        $_POST['costCenterFilter'], $_POST['cashOutFilter'], $_POST['expenseTypeFilter'], $_POST['paymentMethodFilter'],
        $_POST['bankAccountFilter'], $_POST['creditCardFilter']
    );

    if(count($list) > 0){

        // Get IVA types
        require_once($_SESSION['basePath'] . "model/iva.php");
        $iva = new Iva;
        $ivaTypesList = $iva->get(2);

        require_once($_SESSION['basePath'] . 'resources/plugins/phpspreadsheet/autoload.php');
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet()->setTitle('Facturas');

        $sheet->getColumnDimension('A')->setAutoSize(true);
        $sheet->getColumnDimension('B')->setAutoSize(true);
        $sheet->getColumnDimension('C')->setAutoSize(true);
        $sheet->getColumnDimension('D')->setAutoSize(true);
        $sheet->getColumnDimension('E')->setAutoSize(true);
        $sheet->getColumnDimension('F')->setAutoSize(true);
        $sheet->getColumnDimension('G')->setWidth(15);
        $sheet->getColumnDimension('H')->setWidth(15);
        $sheet->getColumnDimension('I')->setWidth(15);
        $sheet->getColumnDimension('J')->setWidth(15);
        $sheet->getColumnDimension('K')->setWidth(15);

        $sheet->getRowDimension('1')->setRowHeight(25);

        $sheet->mergeCells("A1:F1");
        $sheet->setCellValue("A1", "Operaciones Interiores - Facturas Recibidas");
        $sheet->getStyle("A1")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("A1")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT);
        $sheet->getStyle("A1")->getFont()->setName('Arial')->setSize(18)->setBold(true)->setItalic(true);

        require_once($_SESSION['basePath'] . "model/settings.php");
        $settings = new Settings;
        $companyName = $settings->getCompanyName();

        $sheet->setCellValue("A3", "Empresa: " . $companyName);
        $sheet->getStyle("A3")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("A3")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT);
        $sheet->getStyle("A3")->getFont()->setName('Calibri')->setSize(11)->setBold(true);

        if(isset($_POST['from']) && isset($_POST['to'])){

            if(isset($_POST['from']) && !isset($_POST['to'])){
                $sheet->setCellValue("A4", "Período: Desde " . date('d/m/Y', $_POST['from']));
            }else if(!isset($_POST['from']) && isset($_POST['to'])){
                $sheet->setCellValue("A4", "Período: Hasta " . date('d/m/Y', $_POST['to']));
            }else{
                $sheet->setCellValue("A4", "Período: " . date('d/m/Y', $_POST['from']) . " - " . date('d/m/Y', $_POST['to']));
            }
        }else{
            $sheet->setCellValue("A4", "Período: -");
        }

        $sheet->getStyle("A4")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("A4")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT);
        $sheet->getStyle("A4")->getFont()->setName('Calibri')->setSize(11)->setBold(true);

        $sheet->setCellValue("A5", "Fecha: " . date('d/m/Y', time()));
        $sheet->getStyle("A5")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("A5")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT);
        $sheet->getStyle("A5")->getFont()->setName('Calibri')->setSize(11)->setBold(true);

        $sheet->setCellValue("A7", "Núm.Fact.");
        $sheet->getStyle("A7")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("A7")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("A7")->getFont()->setName('Arial')->setSize(10)->setItalic(true);
        $sheet->getStyle("A7")->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('FFFFC0');

        $sheet->setCellValue("B7", "Fecha");
        $sheet->getStyle("B7")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("B7")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("B7")->getFont()->setName('Arial')->setSize(10)->setItalic(true);
        $sheet->getStyle("B7")->getAlignment()->setWrapText(true);
        $sheet->getStyle("B7")->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('FFFFC0');

        $sheet->setCellValue("C7", "Concepto");
        $sheet->getStyle("C7")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("C7")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("C7")->getFont()->setName('Arial')->setSize(10)->setItalic(true);
        $sheet->getStyle("C7")->getAlignment()->setWrapText(true);
        $sheet->getStyle("C7")->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('FFFFC0');

        $sheet->setCellValue("D7", "N.I.F.");
        $sheet->getStyle("D7")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("D7")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("D7")->getFont()->setName('Arial')->setSize(10)->setItalic(true);
        $sheet->getStyle("D7")->getAlignment()->setWrapText(true);
        $sheet->getStyle("D7")->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('FFFFC0');

        $sheet->setCellValue("E7", "Expedidor");
        $sheet->getStyle("E7")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("E7")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("E7")->getFont()->setName('Arial')->setSize(10)->setItalic(true);
        $sheet->getStyle("E7")->getAlignment()->setWrapText(true);
        $sheet->getStyle("E7")->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('FFFFC0');

        $sheet->setCellValue("F7", "Tipo impositivo");
        $sheet->getStyle("F7")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("F7")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("F7")->getFont()->setName('Arial')->setSize(10)->setItalic(true);
        $sheet->getStyle("F7")->getAlignment()->setWrapText(true);
        $sheet->getStyle("F7")->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('FFFFC0');

        $sheet->setCellValue("G7", "Base Imp.");
        $sheet->getStyle("G7")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("G7")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("G7")->getFont()->setName('Arial')->setSize(10)->setItalic(true);
        $sheet->getStyle("G7")->getAlignment()->setWrapText(true);
        $sheet->getStyle("G7")->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('FFFFC0');

        $sheet->setCellValue("H7", "IVA");
        $sheet->getStyle("H7")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("H7")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("H7")->getFont()->setName('Arial')->setSize(10)->setItalic(true);
        $sheet->getStyle("H7")->getAlignment()->setWrapText(true);
        $sheet->getStyle("H7")->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('FFFFC0');

        $sheet->setCellValue("I7", "Suplido");
        $sheet->getStyle("I7")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("I7")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("I7")->getFont()->setName('Arial')->setSize(10)->setItalic(true);
        $sheet->getStyle("I7")->getAlignment()->setWrapText(true);
        $sheet->getStyle("I7")->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('FFFFC0');

        $sheet->setCellValue("J7", "Retención");
        $sheet->getStyle("J7")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("J7")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("J7")->getFont()->setName('Arial')->setSize(10)->setItalic(true);
        $sheet->getStyle("J7")->getAlignment()->setWrapText(true);
        $sheet->getStyle("J7")->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('FFFFC0');

        $sheet->setCellValue("K7", "Total");
        $sheet->getStyle("K7")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $sheet->getStyle("K7")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("K7")->getFont()->setName('Arial')->setSize(10)->setItalic(true);
        $sheet->getStyle("K7")->getAlignment()->setWrapText(true);
        $sheet->getStyle("K7")->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setRGB('FFFFC0');

        $sheet->setAutoFilter('A7:K7');
        $sheet->freezePane("A8");

        $row = 8;
        foreach($list as $item){

            $sheet->setCellValue("A$row", $item['invoiceNumber']);
            $sheet->getStyle("A$row")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle("A$row")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("A$row")->getAlignment()->setWrapText(true);

            $sheet->setCellValue("B$row", date('d/m/Y', $item['date']));
            $sheet->getStyle("B$row")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle("B$row")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);

            $sheet->setCellValue("C$row", "Su fra. nº " . $item['invoiceNumber']);
            $sheet->getStyle("C$row")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle("C$row")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);

            $sheet->setCellValue("D$row", $item['nif']);
            $sheet->getStyle("D$row")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle("D$row")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);

            $sheet->setCellValue("E$row", $item['name']);
            $sheet->getStyle("E$row")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle("E$row")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);

            $sheet->setCellValue("F$row", $item['typeIva']);
            $sheet->getStyle("F$row")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle("F$row")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("F$row")->getNumberFormat()->setFormatCode('0.00');

            $sheet->setCellValue("G$row", $item['base']);
            $sheet->getStyle("G$row")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle("G$row")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("G$row")->getNumberFormat()->setFormatCode('0.00');

            $sheet->setCellValue("H$row", $item['iva']);
            $sheet->getStyle("H$row")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle("H$row")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("H$row")->getNumberFormat()->setFormatCode('0.00');

            $sheet->setCellValue("I$row", $item['supplied']);
            $sheet->getStyle("I$row")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle("I$row")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("I$row")->getNumberFormat()->setFormatCode('0.00');
            if($item['supplied'] < 0){
                $sheet->getStyle("I$row")->getFont()->getColor()->setRGB('FF0000');
            }

            $sheet->setCellValue("J$row", floatval($item['withholding']));
            $sheet->getStyle("J$row")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle("J$row")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("J$row")->getNumberFormat()->setFormatCode('0.00');

            $sheet->setCellValue("K$row", $item['total']);
            $sheet->getStyle("K$row")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            $sheet->getStyle("K$row")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("K$row")->getNumberFormat()->setFormatCode('0.00');
            if($item['total'] < 0){
                $sheet->getStyle("K$row")->getFont()->getColor()->setRGB('FF0000');
            }

            $row++;
        }

        $rowLimit = $row - 1;
        $row += 1;

        // // Total
        // $sheet->setCellValue("E$row", "TOTALES");
        // $sheet->getStyle("E$row")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        // $sheet->getStyle("E$row")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        // $sheet->getStyle("E$row")->getFont()->setName('Arial')->setSize(11)->setBold(true);
        // $sheet->getStyle("E$row")->getAlignment()->setWrapText(true);

        // // Total Suplido
        // $sheet->setCellValue("J$row", "=SUM("."J8:"."J$rowLimit)");
        // $sheet->getStyle("J$row")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        // $sheet->getStyle("J$row")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        // $sheet->getStyle("J$row")->getFont()->setName('Calibri')->setSize(11)->setBold(true);
        // $sheet->getStyle("J$row")->getNumberFormat()->setFormatCode('0.00');

        // // Total Factura
        // $sheet->setCellValue("K$row", "=SUM("."K8:"."K"."$rowLimit)");
        // $sheet->getStyle("K$row")->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        // $sheet->getStyle("K$row")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        // $sheet->getStyle("K$row")->getFont()->setName('Calibri')->setSize(11)->setBold(true);
        // $sheet->getStyle("K$row")->getNumberFormat()->setFormatCode('0.00');

        $filename = 'facturas_recibidas_A3_'.time();

        $writer = new Xlsx($spreadsheet);
        ob_clean();
        flush();
        $writer->save("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/tmp/$filename.xlsx");

        echo json_encode("tmp/$filename.xlsx");
    }else{
        echo json_encode('no_results');
    }
?>