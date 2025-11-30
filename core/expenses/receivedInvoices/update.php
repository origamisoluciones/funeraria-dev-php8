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

    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/expenses.php");

    $expenses = new Expenses;
    $logs = new Logs;

    if(isset($_POST['deliveryMode'])){
        $updateResponse = $expenses->updateReceivedInvoiceDelivery($_POST);
        if($updateResponse === 'invoice_number'){
            echo json_encode('invoice_number');
            return;
        }
    }else{
        $updateResponse = $expenses->updateReceivedInvoice($_POST);
        if($updateResponse === 'invoice_number'){
            echo json_encode('invoice_number');
            return;
        }

        // Update files
        $dir = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/receivedInvoices/{$_POST['ID']}";
        $currentAttachments = array();
        if(is_dir($dir)){
            foreach(scandir($dir) as $elem){
                if($elem != '.' && $elem != '..'){
                    array_push($currentAttachments, $elem);
                }
            }
        }

        $newAttachments = $_POST['newAttachments'] == '' ? array() : $_POST['newAttachments'];
        
        $toDelete = array();
        foreach($currentAttachments as $elem){
            $flag = false;
            foreach($newAttachments as $item){
                if($elem == $item['name']){
                    $flag = true;
                    break;
                }
            }

            if(!$flag){
                array_push($toDelete, $elem);
            }
        }

        foreach($toDelete as $elem){
            if(is_file("$dir/$elem")){
                unlink("$dir/$elem");
            }
        }
    }

    if(!$updateResponse){
        $logs->createSimple("Salidas", "Facturas recibidas - Modificación", "'Error! No ha podido modificar la factura recibida'");
        
        echo json_encode(false);
    }else{
        $logs->createSimple("Salidas", "Facturas recibidas - Modificación", "'Ha modificado una factura recibida'");

        echo json_encode($_POST['ID']);
    }
?>