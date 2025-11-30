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

    require_once($_SESSION['basePath'] . "model/invoices.php");
    $invoices = new Invoices();

    if(isset($_POST['from']) && isset($_POST['to'])){
        $list = $invoices->listInvoicesDatatablesDownload($_POST['from'], $_POST['to'], $_POST['type'], $_POST['clientType'], $_POST['client'], $_POST['search'], $_POST['status'], $_POST['invoiceType'], $_POST['paymentMethod'], $_POST['numAccount'], $_POST['invoiceDateFilter'], $_POST['invoicePaymentFilter']);
    }else{
        $list = $invoices->listInvoicesDatatablesDownload(null, null, $_POST['type'], $_POST['clientType'], $_POST['client'], $_POST['search'], $_POST['status'], $_POST['invoiceType'], $_POST['paymentMethod'], $_POST['numAccount'], $_POST['invoiceDateFilter'], $_POST['invoicePaymentFilter']);
    }

    if(count($list) > 0){
        if(is_file("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/0/facturas.zip")){
            unlink("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/0/facturas.zip");
        }
        $zip = new ZipArchive();
        if($zip->open("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/0/facturas.zip", ZipArchive::CREATE) !== TRUE) {
            echo json_encode('error');
            return;
        }
        foreach($list as $elem){
            $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/expedients/{$elem['expedientID']}/docs/invoices/{$elem['invoiceID']}/";

            if(is_file($path . $elem['number_invoice'] . '.pdf')){
                $zip->addFile($path . $elem['number_invoice'] . '.pdf', str_replace('/', '-', $elem['number']) . '.pdf');
            }elseif(is_file($path . $elem['number_invoice'] . '_no-logo.pdf')){
                $zip->addFile($path . $elem['number_invoice'] . '_no-logo.pdf', str_replace('/', '-', $elem['number']) . '.pdf');
            }
        }
        $zip->close();

        echo json_encode('expedients/0/facturas.zip');
    }else{
        echo json_encode('no_results');
    }
?>