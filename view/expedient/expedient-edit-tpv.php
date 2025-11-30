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

    if(isset($_GET['id'])){
		$expedientID = $_GET['id'];
	}

    $route = $utils->getRoute();
?>

<!DOCTYPE html>
<html>
	<head>
		<title><?php echo $utils->getCompanyName(); ?> | Editar Expediente TPV</title>
		<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/all.css?v=<?= CACHE_DATE ?>">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
	</head>
	<body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed page expedient-page new-expedient-page">
		<?php require_once($_SESSION['basePath'] . "view/expedient/modal/expedient-new-modal.php"); ?>
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
					<li><a target="_blank" href="<?php echo $utils->getRoute(); ?>"><i class="fa fa-dashboard"></i> Inicio</a></li>
					<li><a target="_blank" href="<?php echo $utils->getRoute(); ?>expedientes">Expedientes</a></li>
					<li>Nº <span class="bolder numberExp"></span></li>
					<li class="active">Editar Expediente TPV</li>
				</ol>
			</section>
			<section id="block-content" class="content">
				<div class="hide" id="expedientBlocked">
					<div class="alert alert-warning alert-dismissible fade in" role="alert">
						<button type="button" class="close" data-dismiss="alert" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button> 
						Vista en modo lectura. Hay otro usuario (<strong><span id="firstUser"></span></strong>) en esta sección del expediente
					</div>
				</div>
				<div class="hide" id="expedientFinished">
					<div class="alert alert-warning alert-dismissible fade in" role="alert">
						<button type="button" class="close" data-dismiss="alert" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button> 
						Vista en modo lectura. El expediente ha finalizado y no puede ser modificado.<span id="expedientFinishedText"> Reactívelo (su estado pasará a facturado) para realizar modificaciones.</span>
					</div>
				</div>
				<div class="hide" id="existsExpedient">
					<div class="alert alert-warning alert-dismissible fade in" role="alert">
						<button type="button" class="close" data-dismiss="alert" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button> 
						El expediente no existe. En breves, será enviado al listado de los expedientes
					</div>
				</div>
				<div class="row">
					<div class="col-xs-12">
						<div class="box">
							<div class="box-header">
								<div class="pull-left">
									<p class="lead box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Editar Expediente TPV</p>						
								</div>
								<div class="pull-right">
									<button id="reactived" type="button" class="btn btn-warning hide">Reactivar</button>						
								</div>
							</div>
							<div class="box-body">
								<div class="tab-content">
									<form id="formEditExpedient" name="formEditExpedient" class="form-horizontal">
										<input type="hidden" id="expedientID" name="expedientID" value="<?php echo $expedientID; ?>">
										<input type="hidden" id="eventID" name="eventID" value="">
										<fieldset class="hide" id="associateSection">
											<legend class="toBold fsExp"><span class="label label-primary labelLgExp">Asociar a expediente</span></legend>
											<div class="row clearfix hide" id="expedientToAssociateSection">
												<div class="col-xs-12">
													<label class="toNormal">Expedientes:</label>&nbsp;
													<select id="expedients" class="associate-expedient-select"></select>
													<span class="badge badge-danger hide" id="errorAssociate"></span>
													<button type="button" class="btn btn-default" id="associate">Asociar a expediente</button>
												</div>
											</div>
											<div class="row clearfix hide" id="expedientAssociateSection">
												<div class="col-xs-12">
													<p class="toNormal">
														Asociado al expediente: <strong><span id="expedientAssociate"></span></strong>
														<button type="button" class="btn btn-danger" id="deleteAssociation">Eliminar asociación</button>
													</p>
												</div>
											</div>
											<br>
										</fieldset>
										<fieldset class="hide" id="convertToExpedientSection">
											<legend class="toBold fsExp"><span class="label label-primary labelLgExp">Convertir a defunción</span></legend>
											<div class="row clearfix">
												<div class="col-xs-12">
													<p>
														<label>Convertir a:</label>
														<button type="button" class="btn btn-danger" id="convertToExpedient1">Defunción</button>
														<span> / </span>
														<button type="button" class="btn btn-danger" id="convertToExpedient2">Varios</button>
														** Se asocian los datos del expediente y de la contratación
													</p>
												</div>
											</div>
										</fieldset>
										<fieldset>
											<legend class="toBold fsExp"><span class="label label-primary labelLgExp">Datos del Expediente</span> - <span class="numberExp bolder label label-primary small"></span></legend>
											<div class="row clearfix">
												<div class="col-xs-3">
													<div class="form-group">
														<label class="col-xs-4 control-label toNormal">Fecha solicitud</label>
														<div class="col-xs-8">
															<div class="input-group date">
																<input type="text" size="20" class="form-control datepicker" id="requestDate" name="requestDate" aria-describedby="requestDate" autocomplete="off">
																<div class="input-group-addon">
																	<i class="fa fa-calendar"></i>
																</div>
															</div>
															<span class="inputError" id="requestDateError"></span>
														</div>
													</div>
												</div>
												<div class="col-xs-3">
													<div class="form-group bootstrap-timepicker timepicker">
														<label class="col-xs-4 control-label toNormal">Hora solicitud</label>
														<div class="col-xs-6">
															<div class="input-group">
																<input type="text" size="20" class="form-control time" id="requestTime" name="requestTime" autocomplete="off">
																<div class="input-group-addon">
																	<i style="cursor:pointer" class="fa fa-clock-o"></i>
																</div>
															</div>
															<span class="inputError" id="requestTimeError"></span>
														</div>
													</div>
												</div>
												<div class="col-xs-3">
													<div class="form-group">
														<label class="col-xs-4 control-label toNormal">Fecha llegada</label>
														<div class="col-xs-8">
															<div class="input-group date">
																<input type="text" size="20" class="form-control datepicker" id="arriveDate" name="arriveDate" aria-describedby="arriveDate" autocomplete="off">
																<div class="input-group-addon">
																	<i class="fa fa-calendar"></i>
																</div>
															</div>
															<span class="inputError" id="arriveDateError"></span>
														</div>
													</div>
												</div>
												<div class="col-xs-3">
													<div class="form-group bootstrap-timepicker timepicker">
														<label class="col-xs-5 control-label toNormal" id="arriveTimeLabel">Hora llegada</label>
														<div class="col-xs-7">
															<div class="input-group">
																<input type="text" size="15" class="form-control time" id="arriveTime" name="arriveTime" autocomplete="off">
																<div class="input-group-addon">
																	<i style="cursor:pointer" class="fa fa-clock-o"></i>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div class="row">
												<div class="col-xs-3">
													<div class="form-group">
														<label class="col-xs-4 control-label toNormal">Tipo cliente</label>
														<div class="col-xs-8">
															<div class="input-group">
																<select id="clientType" name="clientType" class="form-control">
																	<option value="1" selected>Particular</option>
																	<option value="3">Empresa</option>
																	<option value="2">Seguros</option>
																</select>
																<span class="hide" id="infoNotChangeClient" style="margin-left: 0.7em;">
																	<button id="notChangeClientHelp" type="button" class="btn btn-info" data-toggle="popover" title="" data-content="Este expediente tiene una factura ya generada y no se puede modificar el tipo de cliente." style="padding: 0.6px 9px!important;margin-right: 15px;" data-original-title="<span class='text-center'><strong>Información facturación</strong></span>">
																		<i class="fa fa-info"></i>
																	</button>
																</span>
															</div>
														</div>
													</div>
												</div>
												<div id="divPolicy" class="col-xs-3">
													<div class="form-group">
														<label class="col-xs-4 control-label toNormal">Nº Póliza</label>
														<div class="col-xs-8">
															<input type="text" size="25" class="form-control" id="policy" name="policy" autocomplete="off">
														</div>
													</div>
												</div>
												<div id="divCapital" class="col-xs-3">
													<div class="form-group">
														<label class="col-xs-4 control-label toNormal">Capital</label>
														<div class="col-xs-8">
															<input type="text" size="25" class="form-control" id="capital" name="capital" autocomplete="off">
														</div>
													</div>
												</div>
												<div id="loss" class="col-xs-3 hide">
													<div class="form-group">
														<label class="col-xs-4 control-label toNormal">Nº Siniestro</label>
														<div class="col-xs-8">
															<input type="text" size="25" class="form-control" id="lossNumber" name="lossNumber" autocomplete="off">
														</div>
													</div>
												</div>
												<div class="col-xs-3">
													<div class="form-group">
														<label class="col-xs-4 control-label toNormal">Estado Expediente</label>
														<div class="col-xs-8">
															<select class="form-control select2 infinitySelect" id="status" name="status"></select>
														</div>
													</div>
												</div>
												<div class="col-xs-3">
													<div class="form-group disabled">
														<label class="col-xs-4 control-label toNormal">Tipo Expediente</label>
														<div class="col-xs-8">
															<input type="text" size="12" class="form-control" id="type" name="type" autocomplete="off" disabled>
														</div>
													</div>
												</div>
											</div>
										</fieldset>
										<fieldset id="clientSection">
											<legend class="toBold fsExp"><span class="label label-primary labelLgExp">Facturar a</span></legend>
											<div class="pull-left search-client-section">
												<legend class="toBold fsExp">Buscador</legend>
											</div>
											<div class="row clearfix search-client-section">
												<div id="divSearchByBrandName" class="col-xs-3">
													<div class="form-group">
														<label class="col-xs-3 control-label toNormal">Nombre Comercial</label>
														<div class="col-xs-6">
															<input type="text" size="25" class="form-control" id="searchByBrandName" name="searchByBrandName" autocomplete="off">
														</div>
													</div>
												</div>
												<div id="divSearchByName" class="col-xs-3 hide">
													<div class="form-group">
														<label class="col-xs-3 control-label toNormal">Nombre</label>
														<div class="col-xs-6">
															<input type="text" size="25" class="form-control" id="searchByName" name="searchByName" autocomplete="off">
															<span class="inputError" id="searchByName"></span>
														</div>
													</div>
												</div>
												<div id="divSearchBySurname"  class="col-xs-3 hide">
													<div class="form-group">
														<label class="col-xs-3 control-label toNormal">Apellidos</label>
														<div class="col-xs-6">
															<input type="text" size="25" class="form-control" id="searchBySurname" name="searchBySurname" autocomplete="off">
															<span class="inputError" id="searchBySurname"></span>
														</div>
													</div>
												</div>
												<div id="divSearchByNIF" class="col-xs-3">
													<div class="form-group">
														<label class="col-xs-3 control-label toNormal">NIF</label>
														<div class="col-xs-6">
															<input type="text" size="25" class="form-control" id="searchByNIF" name="searchByNIF" autocomplete="off">
															<span class="inputError" id="searchByNIFError"></span>
														</div>
													</div>
												</div>
												<div class="col-xs-3">
													<div class="form-group">
														<div class="col-xs-6">
															<button id="searchBtn" type="button" class="btn btn-default btn-sm c-lile"><i class="fa fa-search" aria-hidden="true"></i> BUSCAR</button>
														</div>
													</div>
												</div>
										
											</div>
											<div class="row clearfix search-client-section">
												<div id="divResults" class="col-xs-3 hide">
													<div class="form-group">
														<label class="col-xs-3 control-label toNormal">Resultados</label>
														<div class="col-xs-9">
															<div class="input-group">
																<select class="form-control" id="searchResults" name="searchResults"></select>
																<span class="input-group-addon" style="cursor: pointer;"><a id="selectResult" title="Seleccionar Cliente"><i class="fa fa-arrow-down"></i></a></span>
															</div>
														</div>
													</div>
												</div>
											</div>
											<hr class="search-client-section">
											<br class="search-client-section">
											<div class="row clearfix">
												<div class="col-xs-3">
													<div class="form-group">
														<label class="col-xs-3 control-label toNormal">Cliente</label>
														<div class="col-xs-9">
															<div class="input-group">
																<select class="form-control" id="client" name="client"></select>
																<span class="input-group-addon" id="addClientButton">
																	<a href="#" data-toggle="modal" data-target="#modal-new-client" title="Nuevo Cliente">
																		<i class="fa fa-plus"></i>
																	</a>
																</span>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div class="row clearfix">
												<div id="divClientBrandName" class="col-xs-3 hide">
													<div class="form-group">
														<label class="col-xs-3 control-label toNormal">Nombre comercial</label>
														<div class="col-xs-6">
															<input type="text" size="25" class="form-control" id="clientBrandName" name="clientBrandName" autocomplete="off" readonly>
														</div>
													</div>
												</div>
												<div id="divClientName" class="col-xs-3">
													<div class="form-group">
														<label class="col-xs-3 control-label toNormal">Nombre</label>
														<div class="col-xs-6">
															<input type="text" size="25" class="form-control" id="clientName" name="clientName" autocomplete="off" readonly>
														</div>
													</div>
												</div>
												<div id="divClientSurname" class="col-xs-3">
													<div class="form-group">
														<label class="col-xs-3 control-label toNormal">Apellidos</label>
														<div class="col-xs-6">
															<input type="text" size="25" class="form-control" id="clientSurname" name="clientSurname" autocomplete="off" readonly>
														</div>
													</div>
												</div>
												<div class="col-xs-3">
														<div class="form-group">
														<label class="col-xs-3 control-label toNormal">CIF / NIF</label>
														<div class="col-xs-6">
															<input type="text" size="25" class="form-control nif autocompleteNif" id="clientNIF" name="clientNIF" autocomplete="off" readonly>
															<span class="inputError" id="clientNIFError"></span>
														</div>
													</div>
												</div>
												<div class="col-xs-3">
													<div class="form-group">
														<label class="col-xs-3 control-label toNormal">E-mail</label>
														<div class="col-xs-6">
															<input type="email" size="25" class="form-control" id="clientMail" name="clientMail" readonly>
														</div>
													</div>
												</div>
											</div>
											<div class="row">
												<div class="col-xs-3">
													<div class="form-group">
														<label class="col-xs-3 control-label toNormal">Provincia</label>
														<div class="col-xs-6">
															<select id="clientProvince" name="clientProvince" class="form-control" disabled></select>
														</div>
													</div>
												</div>
												<div class="col-xs-3">
													<div class="form-group">
														<label class="col-xs-3 control-label toNormal">Localidad</label>
														<div class="col-xs-6">
															<select id="clientLocation" name="clientLocation" class="form-control" disabled></select>
															<span class="inputError" id="applicantLocationError"></span>
														</div>
													</div>
												</div>
												
												<div class="col-xs-3">
													<div class="form-group">
														<label class="col-xs-3 control-label toNormal">Domicilio</label>
														<div class="col-xs-6">
															<input type="text" size="25" class="form-control" id="clientAddress" name="clientAddress" autocomplete="off" readonly>
														</div>
													</div>
												</div>
												<div id="clientSection">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Teléfonos</label>
															<div class="col-xs-6">
																<div id="divPhones" class="input-group">
																	<input type="text" size="20" class="form-control phone" id="phone" name="phone" autocomplete="off" readonly>
																	<span class="input-group-addon hide">
																		<a class="btn-add-phone" title="Añadir Teléfono">
																			<i class="fa fa-plus"> </i> AÑADIR
																		</a>
																	</span>
																</div>
																<div class="phones"></div>
																<span class="inputError" id="phoneError"></span>
															</div>
														</div>
													</div>
												</div>
											</div>
										</fieldset>
										<fieldset>
											<legend class="toBold fsExp"><span class="label label-primary labelLgExp">Datos del Difunto</span></legend>
											<div class="row clearfix">
												<div class="col-xs-4">
													<div class="form-group">
														<label class="col-xs-5 control-label toNormal">Nombre</label>
														<div class="col-xs-6">
															<input type="text" size="25" class="form-control" id="deceasedName" name="deceasedName" autocomplete="off">
														</div>
													</div>
												</div>
												<div class="col-xs-4">
													<div class="form-group">
														<label class="col-xs-5 control-label toNormal">Apellidos</label>
														<div class="col-xs-6">
															<input type="text" size="25" class="form-control" id="deceasedSurname" name="deceasedSurname" autocomplete="off">
														</div>
													</div>
												</div>
												<div class="col-xs-4">
													<div class="form-group">
														<label class="col-xs-5 control-label toNormal">
															<input type="radio" name="deceasedNifType" value="1" checked> NIF
															<input type="radio" name="deceasedNifType" value="2"> NIE
															<input type="radio" name="deceasedNifType" value="3"> Pasaporte
															<input type="radio" name="deceasedNifType" value="4"> Otro
														</label>
														<div class="col-xs-6">
															<input type="text" size="25" class="form-control nif autocompleteNif" id="deceasedNIF" name="deceasedNIF" autocomplete="off">
															<span class="inputError" id="deceasedNIFError"></span>
														</div>
													</div>
												</div>
											</div>
											<div class="row">
												<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Género</label>
															<div class="col-xs-6">
																<select class="form-control" id="deceasedGender" name="deceasedGender">
																	<option value="Hombre">Hombre</option>
																	<option value="Mujer">Mujer</option>
																</select>
															</div>
														</div>
													</div>
												<div class="col-xs-4">
													<div class="form-group">
														<label class="col-xs-5 control-label toNormal">Casa Mortuoria</label>
														<div class="col-xs-6">
															<select class="form-control" id="deceasedMortuary" name="deceasedMortuary"></select>
															<span class="inputError" id="deceasedMortuaryError"></span>
														</div>
													</div>
												</div>
												<div class="col-xs-4 hide" id="deceasedMortuaryAddressField">
													<div class="form-group">
														<label class="col-xs-5 control-label toNormal">Dirección</label>
														<div class="col-xs-6">
															<input type="text" size="27" class="form-control" id="deceasedMortuaryAddress" name="deceasedMortuaryAddress" autocomplete="off">
														</div>
													</div>
												</div>
											</div>
										</fieldset>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
		<div class="footer-static-bottom" style="left:50px;width: 1858px;">
			<div class="row">
				<div class="col-xs-12">
					<ul id="expedient-tabs" class="nav nav-tabs" role="tablist">
						<li role="presentation" class="active"><a href="#">EXPEDIENTE</a></li>
						<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/contratacion/'.$expedientID; ?>">CONTRATACIÓN</a></li>
						<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/cservicio-tpv/'.$expedientID; ?>">C.SERVICIO</a></li>
						<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/documentacion-tpv/'.$expedientID; ?>">DOCUMENTACIÓN</a></li>
						<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/logs/'.$expedientID; ?>">LOGS</a></li>
						<li class="deceasedData">Nº 
							<span class="bolder numberExp"> </span>&nbsp;
							<span id="deceased"></span></li>
						<li class="hide" id="associatedData" style="margin-top: 10px;"><span style="margin-left: 35px;">Asociado al expediente: </span><span class="bolder" id="associateNav"></span></li>
						<li class="hide" id="numberInvoiceData" style="margin-top: 10px;"><span style="margin-left: 35px;">Factura: </span><span class="bolder" id="numberInvoiceNav"></span></li>
					</ul>
				</div>
			</div>
			<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions-expedient.php"); ?>
		</div>
		<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/icheck.min.js?v=<?= CACHE_DATE ?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
		<script src="<?php echo $utils->getRoute(); ?>resources/js/expedient/expedient-edit-tpv/functions.js?v=<?= CACHE_DATE ?>"></script>
	</body>
</html>