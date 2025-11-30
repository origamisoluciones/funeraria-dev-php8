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

                if (ob_get_length()) {
                    ob_end_clean();
                }

                header("Content-Disposition: attachment; filename=\"".basename($path)."\"");
                readfile($path);
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