<?php
    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/";
    }

    require_once($_SESSION['basePath'] . "core/tools/utils.php");

	$utils = new Utils();
    
	$route = $utils->getRoute();
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>Gestión de Funerarias</title>
		<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
		<meta http-equiv="Expires" content="0">
		<meta http-equiv="Last-Modified" content="0">
		<meta http-equiv="Cache-Control" content="no-cache, no-store, mustrevalidate">
		<meta http-equiv="Pragma" content="no-cache">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/bootstrap/css/bootstrap.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/dist/css/AdminLTE.min.css">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/styles.css">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/minimal/purple.css">
		<script>var uri = "<?php echo $utils->getRoute(); ?>";</script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jQuery/jquery-2.2.3.min.js"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/js/tools/cookies.js"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/js/tools/accessControl.js"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jquery.validation/jquery.validate.min.js"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jquery.validation/additional-methods.min.js"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/jquery.validation/messages_es.min.js"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/bootstrap/js/bootstrap.min.js"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/icheck.min.js"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/login/functions.js"></script>
	</head>
	<body class="hold-transition login-page hide" style="background-image:url('<?php echo $utils->getBackgroundLogin(); ?>');">
		<?php
		if(isset($_SESSION['errorTimeOut'])){
			unset($_SESSION['errorTimeOut']);
		?>
		<div class="alert alert-error alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> 
			El tiempo de sesión ha expirado. Por favor, acceda de nuevo con sus datos.
		</div>
		<?php
		}
		?>
		<div class="modal fade" id="modal-remember" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title">¿Has olvidado tu contraseña?</h4>
					</div>
					<div class="modal-body">
						<div class="row passwordBottom">
							<div class="col-xs-12">
								<div class="form-group">
									<label for="cifPassword" class="col-xs-4 control-label alignRight">CIF</label>
									<div class="col-xs-8">
										<input type="text" class="form-control" id="cifPassword">
										<span class="label label-danger hide" id="cifEmpty">Campo obligatorio</span>
									</div>
								</div>
							</div>
						</div>
						<div class="row passwordBottom">
							<div class="col-xs-12">
								<div class="form-group">
									<label for="email" class="col-xs-4 control-label alignRight">E-mail</label>
									<div class="col-xs-8">
										<input type="text" class="form-control" id="email">
										<span class="label label-danger hide" id="emailEmpty">Campo obligatorio</span>
										<span class="label label-danger hide" id="emailFormat">Formato incorrecto</span>
									</div>
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i> Cancelar</button>
							<button type="button" class="btn btn-primary btn-add-cure" id="goPassword"><i class="fa fa-floppy-o" aria-hidden="true"></i> Enviar</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12 block-message">
				<div class="text-center" id="block-message"></div>
			</div>
		</div>
		<div class="login-box">
			<div class="login-box-body">
				<!-- <p class="login-box-msg">Aplicación en mantenimiento</p> -->
				<p class="login-box-msg">Acceda ahora con sus datos</p>
				<div class="form-group has-feedback">
					<span>CIF</span>
					<input type="text" class="form-control" id="cif" placeholder="CIF..." autofocus>
					<span class="label label-danger hide" id="cifError">Campo obligatorio</span>
				</div>
				<div class="form-group has-feedback">
					<span>Nombre de usuario</span>
					<input type="text" class="form-control" id="username" placeholder="Nombre de usuario...">
					<span class="label label-danger hide" id="usernameError">Campo obligatorio</span>
				</div>
				<div class="form-group has-feedback">
					<span>Contraseña</span>
					<input type="password" class="form-control" id="password" placeholder="Contraseña...">
					<span class="label label-danger hide" id="passwordError">Campo obligatorio</span>
				</div>
				<div class="row">
					<div class="col-xs-12">
						<button type="button" class="btn btn-primary btn-block btn-flat" id="goLogin">ENTRAR</button>
					</div>
				</div>
				<br>
				<a href="#" data-toggle="modal" data-target="#modal-remember">
					<i class="fa fa-key c-lile" aria-hidden="true"></i>
					He olvidado mi contraseña
				</a>
				<br>
			</div>
		</div>
	</body>
</html>