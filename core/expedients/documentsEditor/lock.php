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

    require_once($_SESSION['basePath'] . "core/tools/security.php");

    if(isset($_POST) && isset($_POST['document'])){
        require_once($_SESSION['basePath'] . "model/expedientsDocumentsEditor.php");

        $document = cleanStr($_POST['document']);
        if(preg_match('/\.\.\//', $document)){
            echo json_encode(false);
            return;
        }

        $expedientsDocumentsEditor = new ExpedientsDocumentsEditor;
        $locked = $expedientsDocumentsEditor->isLocked($document);
        if($locked == null){
            echo json_encode(false);
        }else{
            if($locked[0]['isOpen'] == 1){
                echo json_encode('locked');
            }else{
                $expedientsDocumentsEditor->lockEditor($document);
                echo json_encode(true);
            }
        }
    }else{
        echo json_encode(false);
    }
?>