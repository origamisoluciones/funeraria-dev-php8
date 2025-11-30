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
    
    use mikehaertl\wkhtmlto\Pdf;

    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "defines.php");

    if(isset($_POST) && isset($_POST['expedient']) && isset($_POST['type']) && isset($_POST['model']) && isset($_POST['img']) && isset($_POST['json'])){
        $expedient = cleanStr($_POST['expedient']);
        if(preg_match('/\.\.\//', $expedient)){
            echo json_encode(false);
            return;
        }
        $type = cleanStr($_POST['type']);
        if(preg_match('/\.\.\//', $type)){
            echo json_encode(false);
            return;
        }
        $model = cleanStr($_POST['model']);
        if(preg_match('/\.\.\//', $model)){
            echo json_encode(false);
            return;
        }
        $img = cleanStr($_POST['img']);
        //$json = cleanStr($_POST['json']);
        $json = $_POST['json'];

        if(preg_match('/^data:image\/(\w+);base64,/', $img, $fileType)){
            $img = substr($img, strpos($img, ',') + 1);
            $fileType = strtolower($fileType[1]); // jpg, png, gif
        
            if(!in_array($fileType, ['jpg', 'jpeg', 'gif', 'png'])){
                throw new \Exception('Invalid image type');
            }
        
            $img = base64_decode($img);
        
            if($img === false){
                throw new \Exception('base64_decode failed');
            }
        }else{
            throw new \Exception('Did not match data URI with image data');
        }

        if(!is_dir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/obituary-press/' . $type . '/' . $model . '/files')){
            mkdir($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/obituary-press/' . $type . '/' . $model . '/files', 0777, true);
        }
        
        file_put_contents($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/$type/$model/files/img.{$fileType}", $img);
        file_put_contents($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/$type/$model/files/json.json", $json);
        $file = fopen($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/expedients/$expedient/obituary-press/$type/$model/files/.htaccess", 'w');
        fwrite($file, ' <FilesMatch ".*">
                            Order Allow,Deny
                            Allow from All
                        </FilesMatch>');
        fclose($file);

        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedients = new Expedients;

        $expedients->setObituaryPressAsDefault($expedient, $type, $model);

        require_once($_SESSION['basePath'] . 'core/libraries/phpwkhtmltopdf/vendor/autoload.php');

        $pdf = new Pdf;

        if($_SESSION['company'] == '14'){
            $options = array(
                'margin-bottom' => 0,
                'margin-left' => 2,
                'margin-right' => 0,
                'margin-top' => 3,
                'title' => 'Esquela',
                'orientation' => 'landscape',
                'encoding' => 'UTF-8'
            );

            $html = '   
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>Esquela</title>
                    </head>
                    <body>
                        <div style="width: 99.2%;">
                            <img src="' . $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/obituary-press/' . $type . '/' . $model . '/files/img.png" width="100%">
                        </div>
                    </body>
                </html>';
        }else{
            $options = array(
                'margin-bottom' => 0,
                'margin-left' => 0,
                'margin-right' => 0,
                'margin-top' => 2,
                'title' => 'Esquela',
                'encoding' => 'UTF-8'
            );

            $html = '   
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>Esquela</title>
                    </head>
                    <body>
                        <img src="' . $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/obituary-press/' . $type . '/' . $model . '/files/img.png" width="100%">
                    </body>
                </html>';
        }

        $pdf->setOptions($options);
        $pdf->addPage($html);

        if($pdf->saveAs($_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/obituary-press/' . $type . '/' . $model . '/files/esquela.pdf')){
            require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
            require_once($_SESSION['basePath'] . "core/tools/utils.php");
            
            $db = new DbHandler;
            $utils = new Utils();

            $user = $_SESSION['user'];
            $date = date('Y-m-d H:i:s');
            $nameFile =  $utils->getRoute(). 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/obituary-press/' . $type . '/' . $model . '/files/esquela.pdf';

            $db->query("UPDATE  Expedients_Documents
                        SET     user = $user,
                                date = '$date',
                                nameFile = '$nameFile'
                        WHERE   expedient = $expedient AND
                                type = 18");
            
            echo json_encode($utils->getRoute() . 'resources/files/' . $_SESSION['company'] . '/expedients/' . $expedient . '/obituary-press/' . $type . '/' . $model . '/files/esquela.pdf');
        }else{
            echo json_encode($pdf->getError());
        }
    }else{
        echo json_encode(false);
    }
?>