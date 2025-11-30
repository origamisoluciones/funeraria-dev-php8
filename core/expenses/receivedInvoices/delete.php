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

    $expenses = new Expenses();
    $logs = new Logs;

    if(!$expenses->deleteReceivedInvoice($_POST['ID'])){
        $logs->createSimple("Salidas", "Facturas recibidas - Baja", "'Error! No ha podido eliminar la factura recibida'");
        
        echo json_encode(false);
    }else{
        // Delete files and folder
        $dir = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/receivedInvoices/{$_POST['ID']}";
        if(is_dir($dir)){
            foreach(scandir($dir) as $elem){
                if($elem != '.' && $elem != '..'){
                    if(is_file("$dir/$elem")){
                        unlink("$dir/$elem");
                    }
                }
            }
        }
        rmdir($dir);

        $logs->createSimple("Salidas", "Facturas recibidas - Baja", "'Error! Ha eliminado una factura recibida'");

        echo json_encode(true);
    }
?>