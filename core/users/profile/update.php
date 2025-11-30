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

    if(empty($_POST)){
        http_response_code(405);
        return;
    }

    
    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/users.php");

    $users = new Users();
    $logs = new Logs;

    if(!$users->setProfile($_POST)){
        $logs->createSimple("Configuración", "Usuarios - Perfil - Modificación", "'Error! No ha podido modificar el perfil de usuario'");

        echo json_encode(false);
    }else{
        $logs->createSimple("Configuración", "Usuarios - Perfil - Modificación", "'Ha modificado el perfil'");

        echo json_encode(true);
    }
?>