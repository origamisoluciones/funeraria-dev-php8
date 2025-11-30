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

    $expedient = $_POST['expedient'];
    $type = $_POST['type'];
    $model = $_POST['model'];
    $contImages = $_POST['contImages'];
    $webLink = $_POST['webLink'];

    use Endroid\QrCode\Color\Color;
    use Endroid\QrCode\Encoding\Encoding;
    use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelLow;
    use Endroid\QrCode\QrCode;
    use Endroid\QrCode\Label\Label;
    use Endroid\QrCode\Logo\Logo;
    use Endroid\QrCode\RoundBlockSizeMode\RoundBlockSizeModeMargin;
    use Endroid\QrCode\Writer\PngWriter;

    require_once($_SESSION['basePath'] . 'resources/plugins/qr/autoload.php');
    
    $writer = new PngWriter();

    // Create QR code
    if($_SESSION['company'] == '1' || $_SESSION['company'] == '3' || $_SESSION['company'] == '8'){
        $qrCode = QrCode::create($webLink)
            ->setEncoding(new Encoding('UTF-8'))
            ->setErrorCorrectionLevel(new ErrorCorrectionLevelLow())
            ->setSize(300)
            ->setMargin(10)
            ->setRoundBlockSizeMode(new RoundBlockSizeModeMargin())
            ->setForegroundColor(new Color(0, 48, 92))
            ->setBackgroundColor(new Color(255, 255, 255));
    }else if($_SESSION['company'] == '11'){
        $qrCode = QrCode::create($webLink)
            ->setEncoding(new Encoding('UTF-8'))
            ->setErrorCorrectionLevel(new ErrorCorrectionLevelLow())
            ->setSize(300)
            ->setMargin(10)
            ->setRoundBlockSizeMode(new RoundBlockSizeModeMargin())
            ->setForegroundColor(new Color(214, 95, 134))
            ->setBackgroundColor(new Color(255, 255, 255));
    }else{
        $qrCode = QrCode::create($webLink)
            ->setEncoding(new Encoding('UTF-8'))
            ->setErrorCorrectionLevel(new ErrorCorrectionLevelLow())
            ->setSize(300)
            ->setMargin(10)
            ->setRoundBlockSizeMode(new RoundBlockSizeModeMargin())
            ->setForegroundColor(new Color(0, 0, 0))
            ->setBackgroundColor(new Color(255, 255, 255));
    }

    // Create generic logo
    if($_SESSION['company'] == '1' || $_SESSION['company'] == '3'){
        $logo = Logo::create($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/settings/logoqr.jpg')->setResizeToWidth(70);
    }else if($_SESSION['company'] == '11'){
        $logo = Logo::create($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/settings/logoqr.jpg')->setResizeToWidth(90);
    }else{
        $logo = Logo::create($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/settings/logoqr.png')->setResizeToWidth(70);
    }

    // Create generic label
    $result = $writer->write($qrCode, $logo);

    // Save it to a file
    $imageName = "image_$contImages";

    $result->saveToFile($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/obituary/' . $type . '/' . $model . '/img/' . $imageName . '.png');

    echo json_encode('resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/obituary/' . $type . '/' . $model . '/img/' . $imageName . '.png');
?>