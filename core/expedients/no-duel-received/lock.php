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

    if(isset($_POST) && isset($_POST['expedient']) && isset($_POST['type']) && isset($_POST['model'])){
        require_once($_SESSION['basePath'] . "core/tools/security.php");
        require_once($_SESSION['basePath'] . "model/expedients.php");

        $expedient = cleanStr($_POST['expedient']);
        $type = cleanStr($_POST['type']);
        $model = cleanStr($_POST['model']);

        $expedients = new Expedients;
        $locked = $expedients->isNoDuelReceivedEditorLocked($expedient, $type, $model);
        if($locked == 1){
            echo json_encode('locked');
        }else{
            $expedients->lockNoDuelReceivedEditor($expedient, $type, $model);
            echo json_encode(true);
        }
    }else{
        echo json_encode(false);
    }
?>