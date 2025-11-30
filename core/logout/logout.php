<?php
	if(!isset($_SESSION)){
        session_start();
    }

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
	}
	
	require_once($_SESSION['basePath'] . "model/users.php");
	require_once($_SESSION['basePath'] . "model/logs.php");
	require_once($_SESSION['basePath'] . "core/tools/security.php");

	if(isset($_SESSION['user'])){
		$logs = new Logs;
		$logs->createSimple("Usuario", "Salir", "'Ha salido de la aplicación'");
	
		$users = new Users;
		
		$users->closePages($_SESSION['user']);
		$users->setLastActivity($_SESSION['user']);
		$users->setLastLogout($_SESSION['user']);
		$users->setCloseEditors($_SESSION['user']);
	
		unset($_SESSION['user']);
		unset($_SESSION['type']);
		unset($_SESSION['company']);
		unset($_SESSION['tellmebye']);
	
		setcookie('user', 'false', time() + 60 * 60 * 24 * 30, '/', '', false, false);
	}

	echo json_encode(true);
?>