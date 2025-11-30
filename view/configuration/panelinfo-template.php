<?php
	session_start();
	
	if(!isset($_SESSION['user']) || !isset($_SESSION['type'])){
        header('Location: inicio');
        return;
    }

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/";
    }

    require_once($_SESSION['basePath'] . "core/tools/utils.php");

    $utils = new Utils();

	$route = $utils->getRoute();
	
	if(isset($_GET['id'])){
        $mortuaryID = $_GET['id'];
    }
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo $utils->getCompanyName(); ?> | Editar Panel Informativo</title>
		<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
	</head>
	<body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed configuration-page panelInfoTemplate-page">
		<?php require_once($_SESSION['basePath'] . "view/configuration/modal/panelinfo-options-modal.php"); ?>
		<?php require_once($_SESSION['basePath'] . "view/configuration/modal/panelinfo-slides-modal.php"); ?>
		<?php require_once($_SESSION['basePath'] . "view/configuration/modal/panelInfo-footer.php"); ?>
		<?php require_once($_SESSION['basePath'] . "view/configuration/modal/panelInfo-msg-modal.php"); ?>
		<?php require_once($_SESSION['basePath'] . "view/configuration/modal/panelInfo-time-modal.php"); ?>
		<div class="wrapper">
			<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
			<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
			<div class="content-wrapper">
				<section class="content-header">
					<h1>&nbsp;</h1>
					<div class="div-content-progress">
						<span><strong>Tiempo de sesión restante:</strong></span>
						<div class="progress">
							<div id="sessionProgressBar" class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
								<strong><span id="barPercentage"></span></strong>
							</div>
						</div>
					</div>
					<ol class="breadcrumb">
						<li><a href="<?php echo $utils->getRoute(); ?>inicio"><i class="fa fa-dashboard"></i> Inicio</a></li>
						<li><a href="<?php echo $utils->getRoute(); ?>configuracion">Configuración</a></li>
						<li class="active">Panel Informativo</li>
					</ol>
				</section>
				<section id="block-content" class="content">
					<?php require_once($_SESSION['basePath'] . "view/configuration/configuration-header.php"); ?>
					<div class="row">
						<div class="col-xs-12">
							<div class="box">
								<div class="box-header">
									<div class="pull-left">
										<h3 class="box-title"><i class="fa fa-columns" aria-hidden="true"></i> Editar Panel Informativo</h3>
									</div>
								</div>
								<div class="box-body">
									<div class="hide" id="existsMortuary">
										<div class="alert alert-warning alert-dismissible fade in" role="alert">
											<button type="button" class="close" data-dismiss="alert" aria-label="Close">
												<span aria-hidden="true">×</span>
											</button> 
											El tanatorio no existe. En breves, será enviado al listado de los tanatorios del panel informativo
										</div>
									</div>
									<div class="row">
										<div class="col-xs-12">
											<button type="button" class="btn btn-primary" id="headerConf">Configurar Slider Superior</button>
											<button type="button" class="btn btn-primary" id="footerConf">Configurar Slider Inferior</button>
											<button type="button" class="btn btn-primary" id="msgConfig">Configurar Mensaje</button>
											<button type="button" class="btn btn-primary" id="timeConfig">Configurar Intervalos</button>
											<br><br>
										</div>
									</div>
									<div class="template">
										<input type="hidden" id="mortuaryID" value="<?php echo $mortuaryID; ?>">
										<section class="header">
											<div class="pull-left">
												<img class="panelInfoPreviewUpImg" id="logoLeftUp" src="" alt="Logo empresa">
											</div>
											<div class="pull-right">
												<div class="containerAlign">
													<div class="containerAlignItem">
														<div id="carouselUp" class="carousel slide">
															<div class="carousel-inner" id="carouselUpContent"></div> 
														</div>
													</div>
												</div>
											</div>
										</section>
										<section class="body">
											<div class="table-responsive" id="mortuaryInfo">
												<table id="table" class="table table-bordered">
													<thead>
														<tr class="centered">
															<th colspan="2"><span id="mortuaryName"></span></th>
															<th colspan="4">SEPELIO</th>
														</tr>
														<tr>
															<th>SALA</th>
															<th>NOMBRE</th>
															<th>DÍA</th>
															<th>HORA</th>
															<th>IGLESIA</th>
															<th>CEMENTERIO</th>
														</tr>
													</thead>
													<tbody></tbody>
												</table>
											</div>
											<div id="messages" class="messages centered"></div>
											<div id="carouselDown" class="carousel slide">
												<div class="carousel-inner" id="carouselDownContent"></div> 
											</div>
										</section>
									</div>
								</div>
							</div>
						</div>
					</div>
					<br>
				</section>
			</div>
			<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
		</div>
		<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/holder/holder.min.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/panelinfo/template/functions.js?v=<?=CACHE_DATE?>"></script>
	</body>
</html>