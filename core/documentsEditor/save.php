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

    if(isset($_POST) && isset($_POST['document']) && isset($_POST['images']) && isset($_POST['json'])){
        $document = cleanStr($_POST['document']);

        if(preg_match('/\.\.\//', $document)){
            echo json_encode(false);
            return;
        }
        $images = $_POST['images'];
        $json = $_POST['json'];
        $signs = isset($_POST['signs']) ? $_POST['signs'] : array();

        if(is_dir("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/$document/files")){
            exec("rm -r {$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/$document/files");
        }
            
        mkdir("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/$document/files", 0777, true);
        
        $imagesToPrint = 0;
        foreach($images as $index => $elem){
            if(preg_match('/^data:image\/(\w+);base64,/', $elem, $fileType)){
                $img = substr($elem, strpos($elem, ',') + 1);
                $decoded = base64_decode($img);
                if($decoded !== false){
                    file_put_contents("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/$document/files/img-$imagesToPrint.png", $decoded);
                    $imagesToPrint++;
                }
            }
        }

        foreach($json as $index => $elem){
            file_put_contents("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/$document/files/json-$index.json", $elem);
        }

        if(!file_exists("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/$document/files/.htaccess")){
            $file = fopen("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/$document/files/.htaccess", 'w');
            fwrite($file, ' <FilesMatch ".*">
                                Order Allow,Deny
                                Allow from All
                            </FilesMatch>');
            fclose($file);
        }

        if(!is_dir("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/$document/img")){
            mkdir("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/$document/img", 0777, true);
        }

        if(!file_exists("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/$document/img/.htaccess")){
            $file = fopen("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/$document/img/.htaccess", 'w');
            fwrite($file, ' <FilesMatch ".*">
                                Order Allow,Deny
                                Allow from All
                            </FilesMatch>');
            fclose($file);
        }

        // Get info document
        require_once($_SESSION['basePath'] . "model/documentsEditor.php");
        $documentsEditor = new DocumentsEditor();

        $documentInfo = $documentsEditor->read(array('documentID' => $_POST['document']));
        $pageSize = $documentInfo[0]['pageSize'];

        require_once($_SESSION['basePath'] . 'core/libraries/phpwkhtmltopdf/vendor/autoload.php');

        $pdf = new Pdf;

        switch($pageSize){
            case 'srA3':
                $options = array(
                    'margin-bottom' => 0,
                    'margin-left' => 0,
                    'margin-right' => 0,
                    'margin-top' => 0,
                    'title' => 'Documento',
                    'encoding' => 'UTF-8',
                    'page-width' => '320',
                    'page-height' => '450'
                );
                
                $underline = '_________________';
            break;
            case 'A3':
                $options = array(
                    'margin-bottom' => 0,
                    'margin-left' => 0,
                    'margin-right' => 0,
                    'margin-top' => 0,
                    'title' => 'Documento',
                    'encoding' => 'UTF-8',
                    'page-width' => '297',
                    'page-height' => '420.8',
                );

                $underline = '_________________';
            break;
            case 'A4':
                $options = array(
                    'margin-bottom' => 0,
                    'margin-left' => 0,
                    'margin-right' => 0,
                    'margin-top' => 0,
                    'title' => 'Documento',
                    'encoding' => 'UTF-8',
                    'page-width' => '210',
                    'page-height' => '297.5'
                );

                $underline = '_________________';
            break;
            case 'A5':
                $options = array(
                    'margin-bottom' => 0,
                    'margin-left' => 0,
                    'margin-right' => 0,
                    'margin-top' => 0,
                    'title' => 'Documento',
                    'encoding' => 'UTF-8',
                    'page-width' => '148',
                    'page-height' => '211.2',
                );

                $underline = '_________________';
            break;
            case 'A6':
                $options = array(
                    'margin-bottom' => 0,
                    'margin-left' => 0,
                    'margin-right' => 0,
                    'margin-top' => 0,
                    'title' => 'Documento',
                    'encoding' => 'UTF-8',
                    'page-width' => '105',
                    'page-height' => '148.8',
                );

                $underline = '_________________';
            break;
        }

        array_push($options, 'enable-local-file-access');

        $html = '   
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Documento</title>
                    <style>
                        @media print{
                            .new-page{
                                page-break-before: always;
                            }
                        }

                        html,body,div{
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                        img{
                            margin: 0 !important;
                            padding: 0 !important;
                            border: 0.0001em solid white !important;
                        }
                    </style>
                </head>
                <body>
        ';

        for($i = 0; $i < $imagesToPrint; $i++){
            if(isset($signs[$i])){
                $htmlSigns = '';
                foreach($signs[$i] as $elem){
                    $htmlSigns .= '<div style="position: absolute; top: ' . ($elem['y'] * 1.25) . 'px; left: ' . ($elem['x'] * 1.25) . 'px; color: #00305c !important">Fdo.: ' . $underline . '</div>';
                }

                $html .= '
                    <div style="position: relative;">
                        <img src="' . $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/documentEditor/' . $document . '/files/img-' . $i . '.png" width="99.99%">
                        ' . $htmlSigns . '
                    </div>
                ';
            }else{
                $html .= '
                    <img src="' . $_SESSION['basePath'] . 'resources/files/' . $_SESSION['company'] . '/documentEditor/' . $document . '/files/img-' . $i . '.png" width="99.99%">
                ';
            }

            if($i < $imagesToPrint - 1){
                $html .= '<div class="new-page"></div>';
            }
        }
        
        $html .= '
                </body>
            </html>';

        $pdf->setOptions($options);
        $pdf->addPage($html);

        if($pdf->saveAs("{$_SESSION['basePath']}resources/files/{$_SESSION['company']}/documentEditor/$document/files/documento.pdf")){
            require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
            require_once($_SESSION['basePath'] . "core/tools/utils.php");

            require_once($_SESSION['basePath'] . "model/documentsEditor.php");

            $documentsEditor = new DocumentsEditor;
            $documentsEditor->unSigned($document);
            
            require_once($_SESSION['basePath'] . "model/logs.php");
            $logs = new Logs;
            $logs->createSimple("Expedientes", "Editor documentos - Guardar documento", "Se guardado el documento");
            
            echo json_encode(true);
        }else{
            echo json_encode($pdf->getError());
        }
    }else{
        echo json_encode(false);
    }
?>