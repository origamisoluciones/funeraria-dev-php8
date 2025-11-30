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
?>

<!DOCTYPE html>
<html>
	<head>
		<title><?php echo $utils->getCompanyName(); ?> | Vacaciones</title>
		<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/fullcalendar/fullcalendar.min.css?v=<?=CACHE_DATE?>">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/fullcalendar/fullcalendar.print.css?v=<?=CACHE_DATE?>" media="print">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
	</head>
	<body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed holidays-page page">
		<?php require_once($_SESSION['basePath'] . "view/event/holidays/modal/holidays-new-modal.php"); ?>
		<?php require_once($_SESSION['basePath'] . "view/event/holidays/modal/holidays-edit-modal.php"); ?>
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
						<li>Agenda</li>
						<li class="active">Gestión de Vacaciones</li>
					</ol>
				</section>
				<section id="block-content" class="content">
					<div class="row">
						<div class="col-xs-12">
							<div class="box">
								<div class="box-header">
									<h3 class="box-title">Gestión de Vacaciones</h3>
								</div>
								<div class="box-body">
									<div class="row">
										<div class="col-xs-2">
											<label for="year">Año</label>
											<input type="number" min="0" class="input-medium" id="year">
										</div>
										<div class="col-xs-2">
											<label for="month">Mes</label>
											<select id="month">
												<option value="0">Enero</option>
												<option value="1">Febrero</option>
												<option value="2">Marzo</option>
												<option value="3">Abril</option>
												<option value="4">Mayo</option>
												<option value="5">Junio</option>
												<option value="6">Julio</option>
												<option value="7">Agosto</option>
												<option value="8">Septiembre</option>
												<option value="9">Octubre</option>
												<option value="10">Noviembre</option>
												<option value="11">Diciembre</option>
											</select>
										</div>
										<div class="col-xs-2">
											<button type="button" class="btn btn-primary input-medium" id="goToDate">Ir a</button>
										</div>
									</div>
									<hr>
									<div id="legend">
										<canvas width="15px" height="15px" style="background-color: #088A08"></canvas> Vacaciones
										<canvas width="15px" height="15px" style="background-color: #0080FF"></canvas> Personal
										<canvas width="15px" height="15px" style="background-color: #DF0101"></canvas> Enfermedad
										<canvas width="15px" height="15px" style="background-color: #F7D358"></canvas> Médico
										<canvas width="15px" height="15px" style="background-color: #f47d42"></canvas> Cumpleaños
									</div>
									<div id="calendar"></div>
									<hr>
									<div class="row">
										<div class="col-xs-12">
											<label for="notes">Notas</label>
											<textarea class="form-control" id="notes" cols="175" rows="6"></textarea>
										</div>
									</div><br>
									<div class="row">
										<div class="col-xs-2">
											<button type="button" class="btn btn-primary" id="saveNotes">Guardar notas</button>
										</div>
									</div>
									<hr>
									<div class="row">
										<div class="col-xs-12">
											<div class="table-responsive clearfix" id="holidaysUser" style="height: 500px; overflow: scroll;">
												<table class="table table-striped table-bordered" width="100%" cellspacing="0">
													<thead>
														<tr class="text-center">
															<td>Empleado</td>
															<td><span class="label label-primary">Enero</span></td>
															<td><span class="label label-primary">Febrero</span></td>
															<td><span class="label label-primary">Marzo</span></td>
															<td><span class="label label-primary">Abril</span></td>
															<td><span class="label label-primary">Mayo</span></td>
															<td><span class="label label-primary">Junio</span></td>
															<td><span class="label label-primary">Julio</span></td>
															<td><span class="label label-primary">Agosto</span></td>
															<td><span class="label label-primary">Septiembre</span></td>
															<td><span class="label label-primary">Octubre</span></td>
															<td><span class="label label-primary">Noviembre</span></td>
															<td><span class="label label-primary">Diciembre</span></td>
															<td><span class="label label-success headerYear"></span></td>
															<td>Restantes <span class="label label-danger headerYear"></td>
														</tr>
													</thead>
													<tbody id="holidaysUserBody"></tbody>
												</table>
											</div>
										</div>
									</div>
									<br>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
			<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
		</div>
		<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/fullcalendar/fullcalendar.min.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/fullcalendar/locale/es.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/jquery.dataTables.min.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js" charset="UTF-8"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/js/event/holidays/functions.js?v=<?=CACHE_DATE?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
	</body>
</html>