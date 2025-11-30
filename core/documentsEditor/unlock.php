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

    if(isset($_POST) && isset($_POST['document']) && isset($_POST['locked'])){
        $document = cleanStr($_POST['document']);
        if(preg_match('/\.\.\//', $document)){
            echo json_encode(false);
            return;
        }
        $locked = cleanStr($_POST['locked']);

        if($locked == 1){
            echo json_encode(true);
        }else{
            require_once($_SESSION['basePath'] . "model/documentsEditor.php");

            $documentsEditor = new DocumentsEditor;
            echo json_encode($documentsEditor->unlockEditor($document));
        }

        // Delete from Users_Pages (windowControl has 1 sendBeacon and editors has other, only execute from editors)
        if(isset($_POST['page'])){
            require_once($_SESSION['basePath'] . "model/users.php");
            $users = new Users();
            $users->deleteCurrentPage($_SESSION['user'], $_POST['page']);
        }
    }else{
        echo json_encode(false);
    }
?>