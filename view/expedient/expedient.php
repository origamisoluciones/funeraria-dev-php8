<?php
session_start();

if (!isset($_SESSION['user']) || !isset($_SESSION['type'])) {
	header('Location: inicio');
	return;
}

if (!isset($_SESSION['basePath'])) {
	$_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/";
}

require_once($_SESSION['basePath'] . "core/tools/utils.php");

$utils = new Utils();

$route = $utils->getRoute();
?>

<!DOCTYPE html>
<html>

<head>
	<title><?php echo $utils->getCompanyName(); ?> | Expedientes</title>
	<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
	<link rel="stylesheet" href="<?php echo $route; ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
	<link rel="stylesheet" href="<?php echo $route; ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.css?v=<?= CACHE_DATE ?>">
	<link rel="stylesheet" href="<?php echo $route; ?>resources/themes/adminlte/plugins/datatables/extensions/Select/select.bootstrap.min.css?v=<?= CACHE_DATE ?>">
	<link rel="stylesheet" href="<?php echo $route; ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
	<link rel="stylesheet" href="<?php echo $route; ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
	<link rel="stylesheet" href="<?php echo $route; ?>resources/themes/adminlte/plugins/iCheck/all.css?v=<?= CACHE_DATE ?>">
	<link rel="stylesheet" href="<?php echo $route; ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css">
</head>

<body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed page expedient-page expedient expedient-list">
	<?php include("../../view/expedient/modal/expedient-list-gen-invoice.php"); ?>
	<?php include("../../view/expedient/modal/expedient-modal.php"); ?>
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
					<li><a target="_blank" href="<?php echo $route; ?>inicio"><i class="fa fa-dashboard"></i> Inicio</a></li>
					<li class="active">Expedientes</li>
				</ol>
			</section>
			<section id="block-content" class="content">
				<div class="row">
					<div class="col-xs-12">
						<div class="box">
							<div class="box-header clearfix">
								<h3 class="box-title">
									<i class="fa fa-list-alt" aria-hidden="true"></i>
									Gestión de Expedientes <span id="showMode" class="hide">- En curso</span>
								</h3>

								<div class="box-actions pull-right">
									<nav class="labels" aria-label="Filtros rápidos por tipo">
										<ul class="list-inline">
											<li>
												<a href="#" class="all-label" title="Listar todos">
													<span class="label bge-lile">
														<i class="fa fa-circle" aria-hidden="true"></i> TODOS
													</span>
												</a>
											</li>
											<li>
												<a href="#" class="death-label" title="Listar defunciones">
													<span class="label bge-blue-light">
														<i class="fa fa-circle" aria-hidden="true"></i> DEFUNCIÓN
													</span>
												</a>
											</li>
											<li>
												<a href="#" class="budget-label" title="Listar presupuestos">
													<span class="label bge-green">
														<i class="fa fa-circle" aria-hidden="true"></i> PRESUPUESTO
													</span>
												</a>
											</li>
											<li>
												<a href="#" class="various-label" title="Listar varios">
													<span class="label bge-grey">
														<i class="fa fa-circle" aria-hidden="true"></i> VARIOS
													</span>
												</a>
											</li>
										</ul>
									</nav>
								</div>
							</div>

							<hr>

							<div class="box-body">
								<div class="clearfisx">

									<div class="box-actions pull-left">
										<div class="form-inline">
											<div class="box-actions pull-right">
												<label style="margin-left:0px!important;">Buscar por fechas:</label>
												<div class="input-group">
													<div class="input-group-addon small">DESDE</div>
													<input type="text" class="form-control datepicker" id="from" name="from" autocomplete="off" size="15" aria-label="Fecha desde">
													<div class="input-group-addon small">HASTA</div>
													<input type="text" class="form-control datepicker" id="to" name="to" autocomplete="off" size="15" aria-label="Fecha hasta">
													<div class="input-group-addon small">
														<a id="searchDates" role="button" tabindex="0" aria-label="Buscar por rango de fechas">
															<i class="fa fa-search" aria-hidden="true"></i>
														</a>
													</div>
												</div>

												<!-- Buscar texto -->
												<!-- <label for="input-search" class="ml-10">Buscar:</label>
												<input id="input-search" class="form-control input-sm" type="search" aria-controls="datatable" placeholder="Texto...">
												<div class="input-group-addon small">
													<a id="searchDates" role="button" tabindex="0" aria-label="Buscar por rango de fechas">
														<i class="fa fa-search" aria-hidden="true"></i>
													</a>
												</div> -->

												<label class="mr-5" style="margin-left:10px!">Buscar:</label>
												<div class="input-group">
													<input type="text" class="form-control" id="searchInTableFilter" name="searchInTableFilter" autocomplete="off" size="25" aria-label="Buscar en tabla">
													<div class="input-group-addon small">
														<a id="searchInTable" role="button" tabindex="0" aria-label="Buscar..." onclick="reloadExpedientTable()">
															<i class="fa fa-search" aria-hidden="true"></i>
														</a>
													</div>
													<div class="input-group-addon small">
														<a id="clearTopFilters" role="button" tabindex="0" aria-label="Borrar filtros...">
															<i class="fa fa-times" aria-hidden="true"></i>
														</a>
													</div>
												</div>

												<button id="showFiltersButton" type="button" class="btn btn-primary" style="margin-left:1.5em;">VER MÁS FILTROS</button>
												
											</div>
											
										</div>
									</div>
									<div class="box-actions pull-right">

										<form class="btn-group" style="padding-left: 80px;" method="POST">
											<button class="btn btn-primary btn-sm dropdown-toggle" style="width: 160px;" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
												<i class="fa fa-plus" aria-hidden="true"></i> &nbsp;&nbsp;NUEVO EXPEDIENTE&nbsp;&nbsp;<span class="caret"></span>
											</button>
											<ul class="dropdown-menu dropdown-menu-right">
												<li>
													<button class="btn btn-block bge-blue-light" type="submit"
														name="type" value="1"
														formmethod="POST" formaction="<?php echo $route; ?>nuevo-expediente"
														title="Nuevo expediente de defunción">
														DEFUNCIÓN
													</button>
												</li>
												<li>
													<button class="btn btn-block bge-green" type="submit"
														name="type" value="2"
														formmethod="POST" formaction="<?php echo $route; ?>nuevo-expediente"
														title="Nuevo presupuesto">
														PRESUPUESTO
													</button>
												</li>
												<li>
													<button class="btn btn-block bge-grey" type="submit"
														name="type" value="3"
														formmethod="POST" formaction="<?php echo $route; ?>nuevo-expediente"
														title="Nuevo expediente de varios">
														VARIOS
													</button>
												</li>
												<li>
													<button class="btn btn-block bge-lile" type="submit"
														name="type" value="4"
														formmethod="POST" formaction="<?php echo $route; ?>nuevo-expediente-tpv"
														title="Nuevo expediente TPV">
														TPV
													</button>
												</li>
											</ul>
										</form>
									</div>
								</div>

								<!-- Filtros secundarios -->
								<form class="form-inline expedients-filters hide">
									<div class="row">
										<div class="col-xs-12 box-filters" style="margin-top: 15px;margin-bottom: 10px;">
											<div class="input-group">

												<div class="input-group-addon small">AÑO</div>
												<label for="yearShowFilter" class="sr-only">Año</label>
												<select class="form-control select2 change-select-filter" id="yearShowFilter" data-placeholder="Filtrar por año"></select>

												<div class="input-group-addon small">TIPO EXPEDIENTE</div>
												<label for="typeShowFilter" class="sr-only">Tipo expediente</label>
												<select id="typeShowFilter" class="form-control select2 change-select-filter" data-placeholder="Filtrar por tipo">
													<option></option>
													<option value="1">Defunción</option>
													<option value="2">Presupuesto</option>
													<option value="3">Varios</option>
												</select>

												<div class="input-group-addon small">ESTADO</div>
												<label for="stateShowFilter" class="sr-only">Estado</label>
												<select id="stateShowFilter" class="form-control select2 change-select-filter" data-placeholder="Filtrar por estado">
													<option></option>
													<option value="2">En curso</option>
													<option value="6">Pdte. de revisión</option>
													<option value="3">Pdte. de facturación</option>
													<option value="4">Facturado</option>
													<option value="5">Finalizado</option>
												</select>

												<div class="input-group-addon small">PRÁCT. TANATOLÓGICA</div>
												<label for="tanatologicalPracticeShowFilter" class="sr-only">Prac. tanatológica</label>
												<select class="form-control select2 change-select-filter" id="tanatologicalPracticeShowFilter" data-placeholder="Filtrar por práctica">
													<option></option>
													<option value="1">Tanatoestética</option>
													<option value="2">Tanatopraxia</option>
													<option value="3">Embalsamamiento</option>
													<option value="4">Conservación</option>
												</select>
											
												<div class="input-group-addon small">CADÁVER TIPO I</div>
												<label for="covidShowFilter" class="sr-only">Cadaver tipo I</label>
												<select class="form-control select2 change-select-filter" id="covidShowFilter" data-placeholder="Filtrar si tipo I">
													<option></option>
													<option value="0">NO</option>
													<option value="1">SÍ</option>
												</select>
											</div>
										</div>
									</div>
								</form>

								<div class="row">
									<div class="col-xs-12 box-filters" style="margin-top:15px;">

										<div class="state-filter pull-left input-group" style="margin-bottom:0.5em;">
											<div class="input-group-addon small">CAMBIAR ESTADO</div>
											<label for="stateFilter" class="sr-only">Cambiar estado</label>
											<select class="form-control select2" id="stateFilter" data-placeholder="--">
												<option></option>
												<option value="2">En curso</option>
												<option value="6">Pdte. de revisión</option>
												<option value="3">Pdte. de facturación</option>
												<option value="4">Facturado</option>
												<option value="5">Finalizado</option>
											</select>
											<button type="button" class="btn btn-primary" style="margin-left:0.5em;">CAMBIAR</button>
										</div>
									</div>
								</div>

								<div class="table-responsive clearfix">
									<table id="expedients-table" class="table table-striped table-bordered display" width="100%"></table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
	<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
	<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
	<script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
	<script src="https://cdn.datatables.net/fixedheader/3.1.2/js/dataTables.fixedHeader.min.js" type="text/javascript"></script>
	<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
	<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/datatables/extensions/Select/dataTables.select.min.js?v=<?= CACHE_DATE ?>"></script>
	<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/dataTables.buttons.min.js?v=<?= CACHE_DATE ?>"></script>
	<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
	<script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.flash.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
	<script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.html5.min.js"></script>
	<script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.print.min.js"></script>
	<script src="<?php echo $route; ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
	<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
	<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
	<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
	<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/iCheck/icheck.min.js?v=<?= CACHE_DATE ?>"></script>
	<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
	<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
	<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
	<script src="<?php echo $route; ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
	<script src="<?php echo $route; ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
	<script src="<?php echo $route; ?>resources/js/expedient/expedient/functions.js?v=<?= CACHE_DATE ?>"></script>
</body>

<style>
.input-group .form-control{
	float:inherit!important;
}
</style>

</html>