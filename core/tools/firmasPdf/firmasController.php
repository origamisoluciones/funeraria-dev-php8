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
    
    require_once('./pdfSign.php');
    require_once($_SESSION['basePath'] . "model/expedients.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getMessage':            
                echo json_encode(get_message($_POST['code']));            
            break;
            case 'downloadSigned':            
                echo download_signed($_POST['code']);            
            break;
            case 'downloadPDFfromLink':            
                echo downloadPDFfromLink($_POST['link']);            
            break;
            case 'sistemAlive':            
                echo system_alive();            
            break;
            case 'convertTo64':            
                echo converTo64($_POST['path']);            
            break;
            case 'getDevices':
                echo get_user_devices($_POST['userCode']);
            break;
            case 'savePDFSigned':      
                $expedient = new Expedients();            
                echo $expedient->saveSignPDF($_POST['expedientID'], $_POST['docName'], $_POST['code']);  
            break;
            case 'savePDFSignedEditor':      
                $expedient = new Expedients();            
                echo $expedient->saveSignPDFEditor($_POST['expedient'], $_POST['doc'], $_POST['code']);  
            break;
            case 'checkPDFsigned':      
                $expedient = new Expedients();            
                echo $expedient->checkPDFsigned($_POST['expedientID'], $_POST['docName']);  
            break;
            case 'signDesktop':
                echo json_encode(signDesktop($_POST['message']));
            break;
            case 'getLink':
                echo json_encode(getLink($_POST['code']));
            break;
        }
    }else{
        $message = explode(' ', send_message_js());

        echo json_encode($message[0]);
    }
?>
