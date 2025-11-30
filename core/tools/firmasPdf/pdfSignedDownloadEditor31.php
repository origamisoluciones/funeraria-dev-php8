<?php
    session_start();

    $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/";
    $_SESSION['company'] = 31;

    require_once('./pdfSign.php');
    require_once($_SESSION['basePath'] . "model/expedients.php");
    require_once($_SESSION['basePath'] . "model/documentsEditor.php");

    $array = array();

    $array = json_decode( $_POST['message'], true);
    $code = $array['code'];
    $status = $array['workflow']['current'];
    $file = fopen("response/response.txt", "w");
    fwrite($file, "Fichero \n");
    fwrite($file, $code . " " .$status. "\n");

    //SOLICITUD FIRMADA
    if($status == 'RESPONSED'){
        $downloaded = download_signed($code);
        $result_json = json_decode($downloaded, true);
        $link = $result_json['link'];

        //BUSCAR CODIGO DE PETICION EN BD Y ACTUALIZAR ESTADO A FIRMADO
        $expedient = new Expedients();
        $idExp = $expedient->updateSignPDFEditor($code); 
        fwrite($file, $idExp[0]['expedient'] . " ". $idExp[0]['doc'] . "\n");
        
        //DESCARGAR PDF CON LA FIRMA EN DIRECTORIO DE DOCUMENTOS DEL EXPEDIENTE
        $source = file_get_contents($link);
        $path = $_SESSION['basePath'] . "resources/files/".$_SESSION['company']."/expedients/" . $idExp[0]['expedient'] . "/documentsEditor/" . $idExp[0]['doc'] . "/files/documento.pdf";
        file_put_contents($path, $source);

        //Eliminar de BD filas insertadas anteriormente para el mismo documento y mismo expediente
        $expedient->deleteOldEditor($idExp[0]['expedient'], $idExp[0]['doc'], $code);

        $documentsEditor = new DocumentsEditor;
        $documentsEditor->updateSigned($idExp[0]['doc']);
    }else{
        fwrite($file, "No responsed \n");
    }
    fclose($file);
?>