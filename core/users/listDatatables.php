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

    require_once($_SESSION['basePath'] . "model/users.php");
    $users = new Users();

    // Where condition
    if(isset($_GET['all'])){
        if($_GET['all'] == 1){
            $where = "u.type = ut.userTypeID";
        }else{
            $where = "u.type = ut.userTypeID AND u.leavingDate IS NULL";
        }
    }else{
        $where = "u.type = ut.userTypeID AND u.leavingDate IS NULL";
    }

    echo json_encode(array('data' => $users->listUsersDatatables($where)));
?>