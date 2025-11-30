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

    if(isset($_POST) && isset($_POST['document'])){
        require_once($_SESSION['basePath'] . "core/tools/security.php");
        require_once($_SESSION['basePath'] . "model/documentsEditor.php");

        $documentsEditor = new DocumentsEditor;

        $data = $documentsEditor->getInfoForEditor($_POST['document']);
        $data = $data == null ? null : $data[0];

        $saved = false;
        $documents = array();
        if(is_dir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentEditor/{$_POST['document']}/files")){
            foreach(scandir($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentEditor/{$_POST['document']}/files") as $elem){
                if($elem != '.' && $elem != '..' && preg_match('/.json/', $elem)){
                    array_push($documents, file_get_contents($_SESSION['basePath'] . "resources/files/{$_SESSION['company']}/documentEditor/{$_POST['document']}/files/$elem"));
                    $saved = true;
                }
            }
        }

        echo json_encode(array($saved, $data, $documents));
    }else{
        echo json_encode(array());
    }
?>