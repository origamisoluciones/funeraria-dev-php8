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

    if(isset($_POST) && isset($_POST['expedient']) && isset($_POST['type']) && isset($_POST['model'])){
        require_once($_SESSION['basePath'] . "model/expedients.php");

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

        $expedients = new Expedients;
        $locked = $expedients->isObituaryEditorLocked($expedient, $type, $model);
        if($locked == 1){
            echo json_encode('locked');
        }else{
            $expedients->lockObituaryEditor($expedient, $type, $model);
            echo json_encode(true);
        }
    }else{
        echo json_encode(false);
    }
?>