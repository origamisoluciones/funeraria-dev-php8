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

    $id = $_POST['id'];
    
    $dir = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/receivedInvoices/$id";
    if(is_dir($dir)){
        if(count(scandir($dir)) == 3){
            foreach(scandir($dir) as $elem){
                if($elem != '.' && $elem != '..'){
                    echo json_encode('receivedInvoices/' . $id . '/' . $elem);
                    return;
                }
            }
        }else{
            $zipRoute = "tmp/factura_adjuntos_" . time() . ".zip";
            $zip = new ZipArchive();
            if($zip->open("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/$zipRoute", ZipArchive::CREATE) !== TRUE) {
                echo json_encode('error');
                return;
            }
            foreach(scandir($dir) as $elem){
                if($elem != '.' && $elem != '..'){
                    $zip->addFile("$dir/$elem", $elem);
                }
            }
            $zip->close();

            echo json_encode($zipRoute);
        }
    }else{
        echo json_encode('no_files');
    }
?>