<?php

    if(!isset($_SESSION)){
        session_start();
    }
    
    require_once($_SESSION['basePath'] . "core/tools/utils.php");

    $utils = new Utils;

    if(!isset($_SESSION['basePath'])){
        echo '  <p>No tiene permiso para descargar este archivo...</p>
                <p>En breves será redirigido a la web</p>';
        header("refresh:3;url=" . $utils->getRoute());
        return;
    }

    if(!isset($_SESSION['user'])){
        echo '  <p>No tiene permiso para descargar este archivo...</p>
                <p>En breves será redirigido a la web</p>';
        header("refresh:3;url=" . $utils->getRoute());
        return;
    }

    if(empty($_GET)){
        http_response_code(405);
        return;
    }

    if(isset($_GET['file'])){
        $file = $_GET['file'];
        if(preg_match('/\.\.\//', $file)){
            echo '  <p>El archivo que intenta descargar no existe...</p>
                    <p>En breves será redirigido a la web</p>';
            header("refresh:3;url=" . $utils->getRoute());
        }else{
            $path = "{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/$file";

            if(file_exists($path)){
               
                require_once($_SESSION['basePath'] . "model/logs.php");
                $logs = new Logs;
                $aux = explode("/",$file);
                $lenghtAux = count($aux);
                $fileName = $aux[$lenghtAux-1];
                $expedients = $aux[0];
                if($expedients == 'expedients'){
                    $expedientID = $aux[1];
                    $logs->createExpedient("Expedientes", $expedientID, "Documentación - Visualización", "'Ha visualizado el archivo $fileName'");
                }else{
                    $logs->createSimple("Expedientes", "Documentación - Visualización", "'Ha visualizado el archivo $fileName'");
                }
                
                header('Content-Description: File Transfer');
                header('Content-Type: ' . mime_content_type($path));
                header('Content-Disposition: attachment; filename="' . basename($path) . '"');
                header('Expires: 0');
                header('Cache-Control: must-revalidate');
                header('Pragma: public');
                header('Content-Length: ' . filesize($path));

                while(ob_get_level()){
                    ob_end_clean();
                }
                readfile($path);
                // header('Content-Encoding: UTF-8');
                // header("Content-Type: application/pdf;");
                // header("Content-Disposition: attachment; filename=\"".basename($path)."\"");
                // readfile($path);
            }else{
                echo '  <p>El archivo que intenta descargar no existe...</p>
                        <p>En breves será redirigido a la web!</p>';
                header("refresh:3;url=" . $utils->getRoute());
            }
        }
    }else{
        echo '  <p>No tiene permiso para descargar este archivo...</p>
                <p>En breves será redirigido a la web</p>';
        header("refresh:3;url=" . $utils->getRoute());
    }
?>