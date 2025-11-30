<?php
	session_start();
	
	if(!isset($_SESSION['user']) || !isset($_SESSION['type'])){
        header('Location: inicio');
        return;
    }

    require_once($_SESSION['basePath'] . "core/tools/utils.php");
	$utils = new Utils();
?>

<!DOCTYPE html>
<html>
	<head>
		<title><?php echo $utils->getCompanyName(); ?> | Configuración</title>
		<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
		<link rel="stylesheet" href="<?php $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
	</head>
	<body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed configuration-page">
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
						<li class="active">Configuración</li>
					</ol>
				</section>
				<section id="block-content" class="content">
					<div class="row">
						<div class="col-xs-12">
							<div class="box">
								<div class="box-header">
									<h3 class="box-title"><i class="fa fa-gear" aria-hidden="true"></i> Configuración</h3>
								</div>
								<div class="box-body">
									<ul class="list-unstyled">
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/ajustes"><i class="fa fa-gears" aria-hidden="true"></i> <span>AJUSTES</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/asistentes"><i class="fa fa-user" aria-hidden="true"></i> <span>ASISTENTES</span></a></li>
										<?php if($_SESSION['company'] == '3' && $_SESSION['user'] == '100'){ ?>
											<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/boletines-actualizacion"><i class="fa fa-newspaper-o" aria-hidden="true"></i> <span>BOLETÍN DE ACTUALIZACIÓN</span></a></li>
										<?php } ?>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/campaneros"><i class="fa fa-bell" aria-hidden="true"></i> <span>CAMPANEROS</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/cementerios"><i class="fa fa-cemetery" aria-hidden="true"></i> <span>CEMENTERIOS</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/centrosCoste"><i class="fa fa-tanatory" aria-hidden="true"></i> <span>CENTROS DE COSTE</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/clientes"><i class="fa fa-user" aria-hidden="true"></i> <span>CLIENTES</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/coros"><i class="fa fa-choir" aria-hidden="true"></i> <span>COROS</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/correos"><i class="fa fa-at" aria-hidden="true"></i> <span>CORREOS ELECTRÓNICOS</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/crematorios"><i class="fa fa-ashes" aria-hidden="true"></i> <span>CREMATORIOS</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/cuestionario"><i class="fa fa fa-list-ol" aria-hidden="true"></i> <span>CUESTIONARIO DE SATISFACCIÓN</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/curas"><i class="fa fa-priest" aria-hidden="true"></i> <span>CURAS</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/documentos"><i class="fa fa-book" aria-hidden="true"></i> <span>DOCUMENTOS</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/editor-documentacion/categorias"><i class="fa fa-file" aria-hidden="true"></i> <span>DOCUMENTOS PERSONALIZADOS</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/encuestas-satisfaccion"><i class="fa fa-list-alt" aria-hidden="true"></i> <span>ENCUESTAS DE SATISFACCIÓN</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/enterradores"><i class="fa fa-user" aria-hidden="true"></i> <span>ENTERRADORES</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/esquelas"><i class="fa fa-file-text" aria-hidden="true"></i> <span>ESQUELAS Y DOCUMENTOS</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/estadisticas"><i class="fa fa-pie-chart" aria-hidden="true"></i> <span>ESTADÍSTICAS</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/fallecido-en"><i class="fa fa-thumb-tack" aria-hidden="true"></i> <span>FALLECIDO EN</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/funerarias"><i class="fa fa-mortuory" aria-hidden="true"></i> <span>FUNERARIAS</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/salidas/configuracion"><i class="fa fa-credit-card-alt" aria-hidden="true"></i> <span>GESTIÓN ECONÓMICA</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/iglesias"><i class="fa fa-church" aria-hidden="true"></i> <span>IGLESIAS</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/impuestos"><i class="fa fa-percent" aria-hidden="true"></i> <span>IMPUESTOS</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/limpieza"><i class="fa fa-paint-brush" aria-hidden="true"></i> <span>LIMPIEZA</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/localidades"><i class="fa fa-map-marker" aria-hidden="true"></i> <span>LOCALIDADES</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/lugares-destino"><i class="fa fa-thumb-tack" aria-hidden="true"></i> <span>LUGARES DE DESTINO</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/medicos"><i class="fa fa-user-md" aria-hidden="true"></i> <span>MÉDICOS</span></a></li>
										<li class="col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/panel-informativo"><i class="fa fa-columns" aria-hidden="true"></i> <span>PANEL INFORMATIVO</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/personal"><i class="fa fa-user" aria-hidden="true"></i> <span>PERSONAL</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/plantillas"><i class="fa fa-paint-brush" aria-hidden="true"></i> <span>PLANTILLAS</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/porteadores"><i class="fa fa-user" aria-hidden="true"></i> <span>PORTEADORES</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/productos"><i class="fa fa-product-hunt" aria-hidden="true"></i> <span>PRODUCTOS</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/proveedores"><i class="fa fa-users" aria-hidden="true"></i> <span>PROVEEDORES</span></a></li>
										<?php if($_SESSION['company'] == '3'){ ?>
											<!-- <li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/salas-tellmebye"><i class="fa fa-list" aria-hidden="true"></i> <span>SALAS (TELLMEBYE)</span></a></li> -->
										<?php } ?>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/series-facturacion"><i class="fa fa-file-text-o" aria-hidden="true"></i> <span>SERIES DE FACTURACIÓN</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/taller"><i class="fa fa-wrench" aria-hidden="true"></i> <span>TALLERES</span></a></li>
										<li class="sidebarPanel col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/tanatorios"><i class="fa fa-tanatory" aria-hidden="true"></i> <span>TANATORIOS</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/tarifas"><i class="fa fa-eur" aria-hidden="true"></i> <span>TARIFAS</span></a></li>
										<?php if($_SESSION['company'] == '3' && $_SESSION['user'] == '100'){ ?>
											<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/timeline"><i class="fa fa-bars" aria-hidden="true"></i> <span>TIMELINE</span></a></li>
										<?php } ?>
										<?php if($_SESSION['company'] == '3' || $_SESSION['company'] == '1' && ($_SESSION['user'] == '101' || $_SESSION['user'] == '100')){ ?>
											<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/tutoriales"><i class="fa fa-video-camera" aria-hidden="true"></i> <span>TUTORIALES</span></a></li>
										<?php } ?>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/usuarios"><i class="fa fa-users" aria-hidden="true"></i> <span>USUARIOS</span></a></li>
										<li class="sidebarPanel sidebarTramitador col-xs-2"><a href="<?php echo $utils->getRoute(); ?>configuracion/vacaciones"><i class="fa fa-gift" aria-hidden="true"></i> <span>VACACIONES</span></a></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
		<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
		<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/functions.js?v=<?=CACHE_DATE?>"></script>
	</body>
</html>