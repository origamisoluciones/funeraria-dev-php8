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
    require_once($_SESSION['basePath'] . "core/tools/mailHandler.php");
    require_once($_SESSION['basePath'] . "core/db/dbHandler.php");
    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    require_once($_SESSION['basePath'] . "model/users.php");
    require_once($_SESSION['basePath'] . "model/settings.php");

    $cif = cleanStr($_POST['cif']);
    $mail = cleanStr($_POST['email']);

    unset($_SESSION['company']);

    $settings = new Settings;
    
	$company = $settings->checkCompany($cif);
	if($company == null){
		echo json_encode('company');
	}else{
        $_SESSION['company'] = $company;

        $users = new Users;
    
        if(!$users->existsMail($mail)){
            echo json_encode('notfound');
        }else{
            // Creación de la nueva contraseña que contiene 10 caracteres elegidos de forma aleatoria de la semilla dada
            $password = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$,.+-'), 0, 10);
    
            $mailHandler = new MailHandler();
            $mailHandler->sendNewPass($mail, $password);
    
            $utils = new Utils();
            $password = password_hash($password, PASSWORD_DEFAULT, array('cost' => 11));
            $db = new DbHandler;
            $db->query("UPDATE Users 
                        SET `password` = '" . $password . "' 
                        WHERE mail = '" . $mail . "' AND leavingDate IS NULL");
            
            echo json_encode(true);
        }

        unset($_SESSION['company']);
    }
?>