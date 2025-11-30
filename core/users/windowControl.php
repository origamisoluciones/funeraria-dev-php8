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

    if(empty($_POST) || !isset($_POST['type'])){
        http_response_code(405);
        return;
    }
    
    require_once($_SESSION['basePath'] . "model/users.php");

    if(isset($_POST['type'])){
        $type = $_POST['type'];
        switch($type){
            case 'getInfo':
                $array_return = array(  
                    "createCurrentPage" => createCurrentPage(),
                    "getUser" => getUser(),
                    "getUsersOnline" => getUsersOnline(),
                    "areUsers" => areUsers($_POST['page']),
                    "ivaType" => getIvaType(),
                );
                echo json_encode($array_return);
            break;
            case 'getInfoRefreshSession':
                createCurrentPage();
            break;
        }
    }

    function createCurrentPage(){
        $users = new Users();
        return $users->createCurrentPage($_SESSION['user'], $_POST['page']);
    }

    function getUser(){
        $users = new Users();
        return $users->getUser($_SESSION['user']);
    }

    function getUsersOnline(){
        $users = new Users();
        return $users->getUsersOnline();
    }

    function areUsers($page){
        $users = new Users();
        return $users->areUsers($page);
    }

    function getIvaType(){
        $settings = new Settings();
        return $settings->getIvaType();
    }
?>