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

    /**
    * Obtiene los usuarios que se encuentra en línea
    *
    * @return array
    */
    function getUsersOnline(){
        $users = new Users();

        return $users->getUsersOnline();
    }

    /**
    * Obtiene los datos de un usuario
    *
    * @param int $user
    *
    * @return array
    */
    function getUser($user){
        $users = new Users();

        return $users->getUser($user);
    }
?>