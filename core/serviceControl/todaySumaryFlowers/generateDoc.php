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
    
    $day = $_POST['day'];
    $type = $_POST['type'];
    
    use mikehaertl\wkhtmlto\Pdf;
    
    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    $utils = new Utils();

    require_once($_SESSION['basePath'] . "model/expedients.php");
    $expedients = new Expedients;
    $listData = $expedients->listSummaryFlowers($day);

    $filename = $type == 1 ? 'resumen_flores_hoy.pdf' : 'resumen_flores_manana.pdf';

    require_once($_SESSION['basePath'] . 'core/libraries/phpwkhtmltopdf/vendor/autoload.php');

    $pdf = new Pdf;

    $styleCustom = file_get_contents($_SESSION['basePath'] . 'resources/themes/adminlte/summaryFlowers.css');
       
    $options = array(
        'margin-bottom' => 5,
        'margin-left' => 5,
        'margin-right' => 5,
        'margin-top' => 5,
        'title' => $type == 1 ? 'Resumen flores de hoy' : 'Resumen flores de mañana',
        'orientation' => 'Landscape',
        'encoding' => 'UTF-8'
    );

    $summaryDate = converDate(strtotime($day));

    $html = '   
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>'.($type == 1 ? 'RESUMEN FLORES DE HOY' : 'RESUMEN FLORES DE MAÑANA').'</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">
                <style>' . $styleCustom . '</style>
            </head>
            <body>
                <div class="page">
                    <table class="header-table">
                        <tr>
                            <td class="header-logo">
                                <img src="'.$_SESSION['basePath'].'resources/files/'.$_SESSION['company'].'/settings/logo.png" class="logo">
                            </td>
                            <td class="header-title">
                                <h1>RESUMEN DE FLORES</h1>
                                <h2>'.$summaryDate.'</h2>
                            </td>
                        </tr>
                    </table>

                    <table class="summary-table">
                        <thead>
                            <tr>
                                <th class="col-producto">PRODUCTO</th>
                                <th class="col-cinta">TEXTO CINTA</th>
                                <th class="col-floristeria">PROVEEDOR</th>
                                <th class="col-recogida">ENTREGA</th>
                            </tr>
                        </thead>
                        <tbody>
    ';

    foreach($listData['expedients'] as $index=>$item){

        $html .= '
            <tr >
                <td colspan="4" class="bold"><strong>'.$item['deceasedName']. ' ' . $item['deceasedSurname'] .'</strong></td>
            </tr>
        ';

        foreach($item['products'] as $indexPr => $itemPr){

            $deliveryDate = '-';
            if (!empty($itemPr['deliveryDate'])) {
                $deliveryDate = converDate($itemPr['deliveryDate']);

                if(date('H:i', $itemPr['deliveryDate']) != '00:00'){
                    $deliveryDate .= ' ' . date('H:i', $itemPr['deliveryDate']);
                }
            }

            $styleTr = '';
            if(($indexPr+1) == count($item['products'])){
                $styleTr = 'border-bottom: 2px solid black !important;';
            }

            $html .= '
                <tr style="'.$styleTr.'">
                    <td>'.$itemPr['product_name'] . ' ' . $itemPr['model_name'] .'</td>
                    <td>'.$itemPr['texts'] .'</td>
                    <td>'.$itemPr['supplier_name'] .'</td>
                    <td>'.$deliveryDate.'</td>
                </tr>
            ';
        }
    }

    $html .= '
                        </tbody>
                    </table>
                </div>
            </body>
        </html>'
    ;

    $pdf->setOptions($options);
    $pdf->addPage($html);

    if(!is_dir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/tmp/')){
        mkdir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/tmp/', 0777, true);
    }

    if($pdf->saveAs($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/tmp/' . $filename)){
        echo json_encode($filename);
    }else{
        echo json_encode($pdf->getError());
    }


    function converDate($dateOriginal){

        $date = DateTime::createFromFormat('U', $dateOriginal);

        $formatter = new IntlDateFormatter(
            'es_ES',
            IntlDateFormatter::FULL,
            IntlDateFormatter::NONE,
            null,
            null,
            "EEEE dd MMMM yyyy"
        );
        $formatted = $formatter->format($date);
        $formatted = mb_strtolower($formatted, 'UTF-8');
        $parts = explode(' ', $formatted);

        $parts[0] = ucfirst($parts[0]);
        $parts[2] = ucfirst($parts[2]);

        return $parts[0] . ' ' . $parts[1] . ' de ' . $parts[2];
    }
?>
