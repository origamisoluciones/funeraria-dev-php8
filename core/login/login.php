<?php
	if(!isset($_SESSION)){
        session_start();
	}

    if(!isset($_SESSION['basePath'])){
        http_response_code(403);
        return;
	}

	if(empty($_POST)){
        http_response_code(405);
        return;
    }

    require_once($_SESSION['basePath'] . "core/tools/security.php");
    require_once($_SESSION['basePath'] . "model/logs.php");
	require_once($_SESSION['basePath'] . "model/users.php");
	require_once($_SESSION['basePath'] . "model/settings.php");

	$cif = cleanStr($_POST['cif']);
	$username = cleanStr($_POST['username']);
	$password = cleanStr($_POST['password']);

	$settings = new Settings;

	unset($_SESSION['company']);
	$company = $settings->checkCompany($cif);

	if($company == null){
		echo json_encode('company');
	}else{
		$_SESSION['company'] = $company;
		
		$users = new Users;
		$checkedUsername = $users->checkUsername($username);

		if($checkedUsername === true){
			$checkedUser = $users->login($username, $password);
			if($checkedUser){
				// $users->setLastLogoutActivityLogin($checkedUser);
				$_SESSION['user'] = $checkedUser;
				$userType = $users->getType($checkedUser);
				$_SESSION['type'] = $userType;
	
				$data = toCrypt($userType);
				setcookie('user', $data, time() + 60 * 60 * 24 * 30, '/', '', false, false);

				$users->setLastActivity($_SESSION['user']);

				require_once($_SESSION['basePath'] . "model/companies.php");

				$currentSession = $_SESSION['company'];
				$_SESSION['company'] = '0';

				$companies = new Companies;
				$tellmebyeAccess = $companies->getTellmebye($currentSession);

				$_SESSION['company'] = $currentSession;
				$_SESSION['tellmebye'] = $tellmebyeAccess;
	
				$logs = new Logs;
				$logs->createSimple("Usuarios", "Entrar", "'Ha accedido a la aplicación'");
				
				echo json_encode(true);
			}else{
				echo json_encode('password');
			}
		}else{
			echo json_encode('username');
		}
	}
?>