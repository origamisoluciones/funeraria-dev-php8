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

    if(isset($_POST) && isset($_POST['expedient']) && isset($_POST['type']) && isset($_POST['model']) && isset($_POST['locked'])){
        require_once($_SESSION['basePath'] . "core/tools/security.php");

        $expedient = cleanStr($_POST['expedient']);
        $type = cleanStr($_POST['type']);
        $model = cleanStr($_POST['model']);
        $locked = cleanStr($_POST['locked']);

        if($locked == 1){
            echo json_encode(true);
        }else{
            require_once($_SESSION['basePath'] . "model/expedients.php");

            $expedients = new Expedients;
            echo json_encode($expedients->unlockReminderPacketEditor($expedient, $type, $model));
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