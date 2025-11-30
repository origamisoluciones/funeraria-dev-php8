<?php
    if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
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
        if($type != 'deleteCurrentPage'){
            if(!isset($_SESSION['user'])){
                http_response_code(403);
                return;
            }
        }
        switch($type){
            case 'getCleaningUsers':
                echo json_encode(getCleaningUsers());
            break;
            case 'createCurrentPage':
                echo json_encode(createCurrentPage());
            break;
            case 'deleteCurrentPage':
                echo json_encode(deleteCurrentPage());
            break;
            case 'getUsersOnline':
                echo json_encode(getUsersOnline());
            break;
            case 'getUser':
                echo json_encode(getUser());
            break;
            case 'areUsers':
                echo json_encode(areUsers($_POST['page']));
            break;
            case 'getInfo':
                echo json_encode(getInfo());
            break;
            case 'getUserById':
                echo json_encode(getUserById($_POST['userID']));
            break;
            case 'getAllUsers':
                echo json_encode(getAllUsers());
            break;
            case 'getAllUsersExcepTemplates':
                echo json_encode(getAllUsersExcepTemplates());
            break;
            case 'getUserId':
                echo json_encode(getUserId());
            break;
            case 'getUserName':
                echo json_encode(getUserName($_POST['id']));
            break;
            case 'getUserTypes':
                echo json_encode(getUserTypes());
            break;
        }
    }

    function getAllUsers(){
        $users = new Users();
        return $users->getAllUsers();
    }
    function getAllUsersExcepTemplates(){
        $users = new Users();
        return $users->getAllUsersExcepTemplates();
    }
    function getCleaningUsers(){
        $users = new Users();
        return $users->getCleaningUsers();
    }

    function createCurrentPage(){
        $users = new Users();
        return $users->createCurrentPage($_SESSION['user'], $_POST['page']);
    }

    function deleteCurrentPage(){
        $users = new Users();
        return $users->deleteCurrentPage($_SESSION['user'], $_POST['page']);
    }

    function getUsersOnline(){
        $users = new Users();
        return $users->getUsersOnline();
    }

    function getUser(){
        $users = new Users();
        return $users->getUser($_SESSION['user']);
    }

    function areUsers($page){
        $users = new Users();
        return $users->areUsers($page);
    }

    function getInfo(){
        $users = new Users;
        return $users->getInfo();
    }

    function getUserById($userID){
        $users = new Users;
        return $users->getStaffById($userID);
    }

    function getUserId(){
        return $_SESSION['user'];
    }

    function getUserName($id){
        $users = new Users;
        return $users->getUserName($id);
    }

    /**
     * Obtiene los tipos de usuario
     * 
     * @return array
     */
    function getUserTypes(){
        $users = new Users;
        return $users->getUserTypes();
    }    
?>