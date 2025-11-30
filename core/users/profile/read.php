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

    require_once($_SESSION['basePath'] . "model/logs.php");
    require_once($_SESSION['basePath'] . "model/users.php");

    $users = new Users();
    $logs = new Logs;

    $user = $users->getProfile();
    
    $logs->createSimple("Configuración", "Usuarios - Perfil - Consulta", "'Ha consulta el perfil'");
    
    echo json_encode($user);
?>