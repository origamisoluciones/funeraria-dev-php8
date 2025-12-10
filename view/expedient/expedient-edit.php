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
		<title><?php echo $utils->getCompanyName(); ?> | Editar Expediente</title>
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
						<li class="active">Editar Expediente</li>
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
										<p class="lead box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Editar Expediente</p>						
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
													<div class="col-xs-3">
														<div id="divPolicy" class="form-group">
															<label class="col-xs-4 control-label toNormal">Nº Póliza</label>
															<div class="col-xs-8">
																<input type="text" size="25" class="form-control" id="policy" name="policy" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div id="divCapital" class="form-group">
															<label class="col-xs-4 control-label toNormal">Capital</label>
															<div class="col-xs-8">
																<input type="text" size="25" class="form-control" id="capital" name="capital" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="row">
															<div class="col-xs-2">
																<label class="checkbox-inline" style="padding-top:0px!important;">
																	<input type="checkbox" id="room" name="room" class="minimal room"> <span class="bolder">Sala</span>
																</label>
															</div>
															<div id="cremationCheckSection" class="col-xs-3 hide">
																<label class="checkbox-inline" style="padding-top:0px!important;">
																	<input type="checkbox" id="cremation" name="cremation" class="minimal cremation"> <span class="bolder">Cremación</span>
																</label>
															</div>
															<div class="col-xs-3">
																<label class="checkbox-inline" style="padding-top:0px!important;">
																	<input type="checkbox" id="move" name="move" class="minimal move"> <span class="bolder">Traslado</span>
																</label>
															</div>
															<div class="col-xs-4">
																<label class="checkbox-inline" style="padding-top:0px!important;">
																	<input type="checkbox" id="literal" name="literal" class="minimal literal"> <span class="bolder">NO Literales</span>
																</label>
															</div>
														</div>
													</div>
												</div>
												<div class="row">
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
														<div class="form-group">
															<label class="col-xs-4 control-label toNormal">Referencia Interna</label>
															<div class="col-xs-8">
																<input type="text" size="25" class="form-control" id="internalRef" name="internalRef" autocomplete="off">
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
											<fieldset>
												<legend class="toBold fsExp"><span class="label label-primary labelLgExp">Datos del Solicitante</span></legend>
												<div class="row clearfix">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Nombre</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="applicantName" name="applicantName" autocomplete="off">
																<span class="inputError" id="applicantNameError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Apellidos</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="applicantSurname" name="applicantSurname" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Domicilio</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="applicantAddress" name="applicantAddress" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">E-mail</label>
															<div class="col-xs-6">
																<input type="email" size="25" class="form-control" id="applicantMail" name="applicantMail">
															</div>
														</div>
													</div>
												</div>
												<div class="row">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Provincia</label>
															<div class="col-xs-6">
																<select id="applicantProvince" name="applicantProvince" class="form-control"></select>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Localidad</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<select id="applicantLocation" name="applicantLocation" class="form-control" disabled></select>
																	<span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-deceasedBirthdayLocation" title="Nuevo"><i class="fa fa-plus"></i></a></span>
																</div>
																<span class="inputError" id="applicantLocationError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Teléfono</label>
															<div class="col-xs-5">
																<input type="text" size="25" class="form-control" id="applicantPhone" name="applicantPhone" autocomplete="off">
																<span class="inputError" id="applicantPhoneError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Móvil</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="applicantMobilePhone" name="applicantMobilePhone" autocomplete="off">
																<span class="inputError" id="applicantMobilePhoneError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-6 control-label toNormal">
																<input type="radio" name="applicantNifType" value="1" checked> NIF
																<input type="radio" name="applicantNifType" value="2"> NIE
																<input type="radio" name="applicantNifType" value="3"> Pasaporte
																<input type="radio" name="applicantNifType" value="4"> Otro
															</label>
															<div class="col-xs-5">
																<input type="text" size="25" class="form-control nif autocompleteNif" id="applicantNIF" name="applicantNIF" autocomplete="off">
																<span class="inputError" id="applicantNIFError"></span>
															</div>
														</div>
													</div>
												</div>
											</fieldset>
											<fieldset>
												<legend class="toBold fsExp"><span class="label label-primary labelLgExp">Contratante</span> - <button id="btn-add-applicant" type="button" class="btn btn-default btn-sm c-lile"><i class="fa fa-upload" aria-hidden="true"></i> CARGAR SOLICITANTE</button></legend>
												<div class="row clearfix">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Nombre</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="familyContactName" name="familyContactName" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Apellidos</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="familyContactSurname" name="familyContactSurname" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Domicilio</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="familyContactAddress" name="familyContactAddress" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">E-mail</label>
															<div class="col-xs-6">
																<input type="email" size="25" class="form-control" id="familyContactMail" name="familyContactMail" autocomplete="off">
															</div>
														</div>
													</div>
												</div>
												<div class="row">
													
													<div id="familyContactSpainFields">
														<div class="col-xs-3">
															<div class="form-group">
																<label class="col-xs-3 control-label toNormal">Provincia</label>
																<div class="col-xs-6">
																	<select id="familyContactProvince" name="familyContactProvince" class="form-control"></select>
																</div>
															</div>
														</div>
														<div class="col-xs-3">
															<div class="form-group">
																<label class="col-xs-3 control-label toNormal">Localidad</label>
																<div class="col-xs-6">
																	<div class="input-group">
																		<select size="25" id="familyContactLocation" name="familyContactLocation" class="form-control"></select>
																		<span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-deceasedBirthdayLocation" title="Nuevo"><i class="fa fa-plus"></i></a></span>
																	</div>
																	<span class="inputError" id="applicantLocationError"></span>
																</div>
															</div>
														</div>
													</div>
												
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Teléfono</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="familyContactPhone" name="familyContactPhone" autocomplete="off">
																<span class="inputError" id="familyContactPhoneError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Móvil</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="familyContactMobilePhone" name="familyContactMobilePhone" autocomplete="off">
																<span class="inputError" id="familyContactMobilePhoneError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-6 control-label toNormal">
																<input type="radio" name="familyContactNifType" value="1" checked> NIF
																<input type="radio" name="familyContactNifType" value="2"> NIE
																<input type="radio" name="familyContactNifType" value="3"> Pasaporte
																<input type="radio" name="familyContactNifType" value="4"> Otro
															</label>
															<div class="col-xs-5">
																<input type="text" size="25" class="form-control nif autocompleteNif" id="familyContactNIF" name="familyContactNIF" autocomplete="off">
																<span class="inputError" id="familyContactNIFError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Parentesco</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="familyContactRelationship" name="familyContactRelationship" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Origen</label>
															<div class="col-xs-6">
																<select class="form-control" id="familyContactNationality" name="familyContactNationality">
																	<option value="1" selected>España</option>
																	<option value="2">Otro</option>
																</select>
															</div>
														</div>
													</div>
													<div class="hide" id="familyContactOtherFields">
														<div class="col-xs-3">
															<div class="form-group">
																<label class="col-xs-3 control-label toNormal">País</label>
																<div class="col-xs-6">
																	<input type="text" size="25" class="form-control" id="familyContactOtherCountry" name="familyContactOtherCountry" autocomplete="off">
																</div>
															</div>
														</div>
														<div class="col-xs-3">
															<div class="form-group">
																<label class="col-xs-3 control-label toNormal">Región</label>
																<div class="col-xs-6">
																	<input type="text" size="25" class="form-control" id="familyContactOtherProvince" name="familyContactOtherProvince" autocomplete="off">
																</div>
															</div>
														</div>
														<div class="col-xs-3">
															<div class="form-group">
																<label class="col-xs-4 control-label toNormal">Localidad</label>
																<div class="col-xs-5">
																	<input type="text" size="25" class="form-control" id="familyContactOtherLocation" name="familyContactOtherLocation" autocomplete="off">
																</div>
															</div>
														</div>
													</div>
												</div>
												<hr>
												<div class="pull-left">
													<legend class="toBold fsExp">Otro contacto</legend>
												</div>
												<div class="row clearfix">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Nombre</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="otherContactName" name="otherContactName" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Teléfono</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="otherContactPhone" name="otherContactPhone" autocomplete="off">
																<span class="inputError" id="otherContactPhoneError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Parentesco</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="otherContactRelationship" name="otherContactRelationship" autocomplete="off">
																<span class="inputError" id="otherContactRelationshipError"></span>
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
																				<i style="cursor:pointer" class="fa fa-plus"> </i> AÑADIR
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
															<label class="col-xs-5 control-label toNormal">Estado civil</label>
															<div class="col-xs-6">
																<select class="form-control" id="deceasedMaritalStatus" name="deceasedMaritalStatus">
																	<option value="">-</option>
																	<option value="Soltero">Soltero/a</option>
																	<option value="Casado">Casado/a</option>
																	<option value="Divorciado">Divorciado/a</option>
																	<option value="Viudo">Viudo/a</option>
																	<option value="Otros">Otros</option>
																</select>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">1ª Nupcias con</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="deceasedFirstNuptials" name="deceasedFirstNuptials" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">2ª Nupcias con</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="deceasedSecondNuptials" name="deceasedSecondNuptials" autocomplete="off">
															</div>
														</div>
													</div>
												</div>
												<div class="row">
													<div class="col-xs-4">
														<div class="form-group otherMaritalStatus hide">
															<label class="col-xs-5 control-label toNormal">Estado civil (Otros)</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="deceasedMaritalStatusDescription" name="deceasedMaritalStatusDescription" autocomplete="off">
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
															<label class="col-xs-5 control-label toNormal">Hijo de</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="deceasedChildOfFather" name="deceasedChildOfFather" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">y de</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="deceasedChildOfMother" name="deceasedChildOfMother" autocomplete="off">
															</div>
														</div>
													</div>
													
												</div>
												<div class="row">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Nacionalidad</label>
															<div class="col-xs-6">
																<select class="form-control" id="deceasedNationality" name="deceasedNationality">
																	<option value="España" selected>España</option>
																	<option value="Otro">Otro</option>
																</select>
															</div>
														</div>
													</div>
												</div>
												<div class="row deceasedNationalityName hide">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">País</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="deceasedNationalityName" name="deceasedNationalityName" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Región/Estado</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="deceasedNationalityProvince" name="deceasedNationalityProvince" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Localidad</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="deceasedNationalityLocation" name="deceasedNationalityLocation">
															</div>
														</div>
													</div>
												</div>
												<div class="row">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha de Nacimiento</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="20" class="form-control datepicker" id="deceasedBirthday" name="deceasedBirthday" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="deceasedBirthdayError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Provincia de Nacimiento</label>
															<div class="col-xs-6">
																<select id="deceasedBirthdayProvince" name="deceasedBirthdayProvince" class="form-control"></select>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Lugar de Nacimiento</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<select class="form-control select2" size="15" id="deceasedBirthdayLocation" name="deceasedBirthdayLocation" disabled></select>
																	<span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-deceasedBirthdayLocation" title="Nuevo"><i class="fa fa-plus"></i></a></span>
																</div>
																<span class="inputError" id="deceasedBirthdayLocationError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Domicilio habitual</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="deceasedUsualAddress" name="deceasedUsualAddress" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Localidad</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="deceasedLocality" name="deceasedLocality" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Provincia</label>
															<div class="col-xs-6">
																<select id="deceasedProvince" name="deceasedProvince" class="form-control"></select>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fallecido en</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<select class="form-control" id="deceasedLocation" name="deceasedLocation"></select>
																	<span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-deceased" title="Nuevo"><i class="fa fa-plus"></i></a></span>
																</div>
																<span class="inputError" id="deceasedLocationError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha de Fallecimiento</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input size="20" class="form-control datepicker pull-right" id="deceasedDate" name="deceasedDate" type="text" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="deceasedDateError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora de Fallecimiento</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="deceasedTime" name="deceasedTime" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="deceasedTimeError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row">
													<div id="otherDeceasedLocationDiv" class="col-xs-4 hide">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Otro lugar de fallecimiento</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="otherDeceasedLocation" name="otherDeceasedLocation" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Médico</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<select class="form-control select2" id="deceasedDoctor" name="deceasedDoctor"></select>
																	<span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-deceasedDoctor" title="Nuevo"><i class="fa fa-plus"></i></a></span>
																</div>
																<span class="inputError" id="deceasedBirthdayLocationError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Certificado Médico Nº</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="deceasedDoctorCertificate" name="deceasedDoctorCertificate" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Causa Principal de la Muerte</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="deceasedCause" name="deceasedCause" autocomplete="off">
															</div>
														</div>
													</div>
												</div>
												<div class="row">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Juzgado de</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="deceasedTribunal" name="deceasedTribunal" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Juzgado Nº</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="deceasedTribunalNumber" name="deceasedTribunalNumber" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-4 hide">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">No mostrar en Panel</label>
															<div class="col-xs-6">
																<input type="checkbox" id="deceasedPanel" name="deceasedPanel" class="minimal deceasedPanel">
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="form-group">
														<label class="col-xs-11 toNormal">
															NOTA: Los campos marcados como (*) son necesarios para la creación del control de visitas.
															En el caso de la fecha y hora de entrada, se tomará como preferencia la fecha y hora de velación sobre la fecha y hora de entrada
															(siendo la fecha y hora de velación no obligatorios en el caso de que estén los otros cubiertos y viceversa)
														</label>
													</div>
												</div>
											</fieldset>

											<fieldset>
												<legend class="toBold fsExp"><span class="label label-primary labelLgExp">Datos de la Velación</span></legend>
												<div class="row">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Casa Mortuoria (*)</label>
															<div class="col-xs-6">
																<select class="form-control" id="deceasedMortuary" name="deceasedMortuary"></select>
																<span class="inputError" id="deceasedMortuaryError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3 hide" id="deceasedMortuaryAddressField">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Dirección</label>
															<div class="col-xs-6">
																<input type="text" size="27" class="form-control" id="deceasedMortuaryAddress" name="deceasedMortuaryAddress" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Nº de Sala</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="deceasedRoom" name="deceasedRoom" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3 hide" id="tellmebyeRoomSection">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Sala en Tellmebye</label>
															<div class="col-xs-6">
																<select class="form-control" id="tellmebyeRoom" name="tellmebyeRoom"></select>
																<span class="inputError" id="tellmebyeRoomError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha inicio velación (1)</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="20" class="form-control datepicker" id="startVelacionDate" name="startVelacionDate" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="startVelacionDateError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora inicio velación (1)</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="startVelacionTime" name="startVelacionTime" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="startVelacionTimeError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha fin velación (1)</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="20" class="form-control datepicker" id="endVelacionDate" name="endVelacionDate" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="endVelacionDateError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora fin velación (1)</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="endVelacionTime" name="endVelacionTime" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="endVelacionTimeError"></span>
															</div>
														</div>
													</div>
												</div>

												<div class="row">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha inicio velación (2)</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="20" class="form-control datepicker" id="startVelacionDate2" name="startVelacionDate2" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="startVelacionDate2Error"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora inicio velación (2)</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="startVelacionTime2" name="startVelacionTime2" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="startVelacionTime2Error"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha fin velación (2)</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="20" class="form-control datepicker" id="endVelacionDate2" name="endVelacionDate2" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="endVelacionDate2Error"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora fin velación (2)</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="endVelacionTime2" name="endVelacionTime2" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="endVelacionTime2Error"></span>
															</div>
														</div>
													</div>
												</div>
											</fieldset>
											<fieldset>
												<legend class="toBold fsExp"><span class="label label-primary labelLgExp">Datos del Entierro</span></legend>
												<div class="row">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Tipo de ceremonia</label>
															<div class="col-xs-6">
																<!--<input type="text" class="form-control" size="20" id="churchLabel" value="Iglesia Parroquial">-->
																<select name="churchLabel" id="churchLabel">
																	<option value="Iglesia Parroquial">Iglesia Parroquial</option>
																	<option value="Ceremonia Civil">Ceremonia Civil</option>
																	<option value="Otro">Otro</option>
																</select>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-4 control-label toNormal">Lugar de ceremonia</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<select class="form-control" id="church" name="church"></select>
																	<span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-church" title="Nuevo"><i class="fa fa-plus"></i></a></span>
																</div>
															</div>
															<span class="inputError" id="churchError"></span>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Inhumación</label>
															<div class="col-xs-6">
																<!--<input type="text" size="20" class="form-control" id="cemeteryLabel" value="Cementerio">-->
																<select name="cemeteryLabel" id="cemeteryLabel">
																	<option value="Cementerio">Cementerio</option>
																	<option value="Crematorio">Crematorio</option>
																	<option value="Otro">Otro</option>
																</select>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-4 control-label toNormal">Lugar de inhumación</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<select class="form-control" id="cemetery" name="cemetery"></select>
																	<span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-cemetery" title="Nuevo"><i class="fa fa-plus"></i></a></span>
																</div>
															</div>
															<span class="inputError" id="cemeteryError"></span>
														</div>
													</div>
												</div>
												<div class="row">
													<div class="col-xs-6">
														<div class="form-group">
															<label class="col-xs-2 control-label toNormal"></label>
															<div class="col-xs-6  otherCeremonyText hide">	
																<input type="text" size="20" class="form-control" id="otherCeremony" name="otherCeremony" placeHolder="Ceremonia (Otro)" autocomplete="off">
															</div>	
														</div>	
													</div>
													<div class="col-xs-6">
														<div class="form-group">								
															<label class="col-xs-2 control-label toNormal"></label>
															<div class="col-xs-6 otherInhumationText hide">	
																<input type="text" size="20" class="form-control" id="otherInhumation" name="otherInhumation" placeHolder="Inhumación (Otro)" autocomplete="off">
															</div>									
														</div>									
													</div>									
												</div>
												<div class="row">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha salida (*)</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="15" class="form-control datepicker" id="funeralDate" name="funeralDate" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="funeralDateError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora salida (*)</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="funeralTime" name="funeralTime" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="funeralTimeError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha inhumación</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="15" class="form-control datepicker" id="funeralDateBurial" name="funeralDateBurial" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="funeralDateBurialError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora inhumación</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="funeralTimeBurial" name="funeralTimeBurial" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="funeralTimeBurialError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Fecha ceremonia</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="15" class="form-control datepicker" id="ceremonyDate" name="ceremonyDate" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="ceremonyDateError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora ceremonia</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="ceremonyTime" name="ceremonyTime" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="ceremonyTimeError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha funeral</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="15" class="form-control datepicker" id="funeralDateNew" name="funeralDateNew" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="funeralDateNewError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora funeral</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="funeralTimeNew" name="funeralTimeNew" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="funeralTimeNewError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row">
													<div class="col-xs-3">
														<div class="form-group nicheSelect">
															<label class="col-xs-5 control-label toNormal">Unidad de enterramiento</label>
															<div class="col-xs-6">
																<select class="form-control select2 infinitySelect" id="niche" name="niche"></select>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Nº Nicho</label>
															<div class="col-xs-6">
																<input type="text" class="form-control" size="25" id="funeralNicheNumber" name="funeralNicheNumber" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-7 control-label toNormal">Nicho ocupado</label>
															<div class="col-xs-5">
																<input type="checkbox" id="funeralBusyNiche" name="funeralBusyNiche" class="minimal funeralBusyNiche" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-2">
														<div class="form-group">
															<label class="col-xs-4 control-label toNormal">Régimen</label>
															<div class="col-xs-6">
																<select class="form-control select2 infinitySelect" id="regime" name="regime">
																	<option value="0">--</option>
																	<option value="1">Propiedad</option>
																	<option value="2">Alquiler</option>
																	<option value="3">Concesión</option>
																	<option value="4">Cesión Temporal</option>
																</select>
															</div>
														</div>
													</div>
													<div class="col-xs-3 hide" id="property">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Titular</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="propertyName" name="propertyName" autocomplete="off">
															</div>
														</div>
													</div>
												</div>
												<div class="row hide busyNiche">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Exhumación de (1)</label>
															<div class="col-xs-6">
																<input type="text" size="20" class="form-control" id="deceasedNiche" name="deceasedNiche" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha fallecimiento (1)</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="20" class="form-control datepicker" id="funeralDateNiche" name="funeralDateNiche" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="row hide busyNiche">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Exhumación de (2)</label>
															<div class="col-xs-6">
																<input type="text" size="20" class="form-control" id="deceasedNiche2" name="deceasedNiche2" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha fallecimiento (2)</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="20" class="form-control datepicker" id="funeralDateNiche2" name="funeralDateNiche2" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="row hide busyNiche">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Exhumación de (3)</label>
															<div class="col-xs-6">
																<input type="text" size="20" class="form-control" id="deceasedNiche3" name="deceasedNiche3" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha fallecimiento (3)</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="20" class="form-control datepicker" id="funeralDateNiche3" name="funeralDateNiche3" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="row">
													<div class="col-xs-3" id="exhumTitular">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Titular</label>
															<div class="col-xs-6">
																<input type="text" size="20" class="form-control" id="exhumation" name="exhumation" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Altura del nicho</label>
															<div class="col-xs-6">
																<select class="form-control select2 infinitySelect" id="nicheHeight" name="nicheHeight">
																	<option value="0" selected>--</option>
																	<option value="1">1º</option>
																	<option value="2">2º</option>
																	<option value="3">3º</option>
																	<option value="4">4º</option>
																	<option value="5">5º</option>
																	<option value="6">6º</option>
																	<option value="7">7º</option>
																	<option value="8">8º</option>
																</select>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="form-group">
														<label class="col-xs-11 toNormal">
															NOTA: Los campos marcados como (*) son necesarios para la creación del control de visitas.
															En el caso de la fecha y hora de entrada, se tomará como preferencia la fecha y hora de velación sobre la fecha y hora de entrada
															(siendo la fecha y hora de velación no obligatorios en el caso de que estén los otros cubiertos y viceversa)
														</label>
													</div>
												</div>
											</fieldset>
											<fieldset id="cremationData" class="fieldset hide">
												<legend class="toBold fsExp">
													<span class="label label-primary labelLgExp">Datos Cremación</span> - 
													<a class="btn btn-default btn-sm c-lile bolder" href="<?php echo $utils->getRoute(); ?>cremaciones" target="_blank">Ver agenda</a>
												</legend>
												<div class="row clearfix">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Crematorio</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<select class="form-control select2" id="crematorium" name="crematorium"></select>
																	<span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-crematorium" title="Nuevo"><i class="fa fa-plus"></i></a></span>
																</div>
																<span class="inputError" id="crematoriumError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Estado</label>
															<div class="col-xs-6">
																<div class="input-group status">
																	<select class="form-control" id="crematoriumStatus" name="crematoriumStatus">
																		<option value="6">Reservada</option>
																		<option value="7">Confirmada</option>
																	</select>
																	<span class="input-group-addon"><i class="fa fa-circle crematoriumStatusColor"></i></span>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha inicio</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="20" class="form-control datepicker" id="crematoriumEntryDate" name="crematoriumEntryDate" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="crematoriumEntryDateError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora inicio</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="13" class="form-control time" id="crematoriumEntryTime" name="crematoriumEntryTime" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="crematoriumEntryTimeError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha fin</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="20" class="form-control datepicker" id="crematoriumLeavingDate" name="crematoriumLeavingDate" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="crematoriumLeavingDateError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora fin</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="13" class="form-control time" id="crematoriumLeavingTime" name="crematoriumLeavingTime" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="crematoriumLeavingTimeError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Técnico cremación</label>
															<div class="col-xs-6">
																<select class="form-control" id="crematoriumTechnical" name="crematoriumTechnical"></select>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Id. trazabilidad</label>
															<div class="col-xs-6" style="display:flex">
																<input type="number" min="0" step="1" size="25" class="form-control" id="trazabilityId" name="trazabilityId" autocomplete="off" disabled>
																<input type="checkbox" id="trazabilityIdCheck" name="trazabilityIdCheck" class="minimal trazabilityIdCheck" style="margin-left: 0.75em;margin-top: 0;padding-top: 0;cursor:pointer;">
																<label class="control-label toNormal" style="margin-top: 0.05em;padding-left: 0.25em;">Modificar</label>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Empresa solicitante</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<select class="form-control" id="crematoriumClient" name="crematoriumClient"></select>
																	<span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-funeralHome" title="Nuevo"><i class="fa fa-plus"></i></a></span>
																</div>
																<span class="inputError" id="crematoriumClientError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">CIF</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="crematoriumClientCIF" name="crematoriumClientCIF" autocomplete="off" disabled>
																<span class="inputError" id="crematoriumClientCIFError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Teléfono</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="crematoriumContactPersonPhone" name="crematoriumContactPersonPhone" autocomplete="off">
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Persona de contacto</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="crematoriumContactPerson" name="crematoriumContactPerson" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Teléfono de contacto</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="crematoriumContactPhonePerson" name="crematoriumContactPhonePerson" autocomplete="off">
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Familiar contacto</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="crematoriumContactName" name="crematoriumContactName" autocomplete="off" disabled>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Apellidos</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="crematoriumContactSurname" name="crematoriumContactSurname" autocomplete="off" disabled>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Teléfono</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="crematoriumContactPhone" name="crematoriumContactPhone" autocomplete="off" disabled>
															</div>
														</div>
													</div>									
												</div>
												<hr>
												<div class="row clearfix">
													<div class="col-xs-2">
														<div class="form-group">
															<label class="col-xs-6 control-label toNormal">Introducción</label>
															<div class="col-xs-6">
																<input type="checkbox" id="crematoriumIntroduction" name="crematoriumIntroduction"  class="minimal crematoriumIntroduction">
															</div>
														</div>										
													</div>
													<div class="col-xs-2">
														<div class="form-group">
															<label class="col-xs-6 control-label toNormal">Espera en sala</label>
															<div class="col-xs-6">
																<input type="checkbox" id="crematoriumWaitOnRoom" name="crematoriumWaitOnRoom" class="minimal crematoriumWaitOnRoom">
															</div>
														</div>
													</div>
													<div class="col-xs-2">
														<div class="form-group">
															<label class="col-xs-6 control-label toNormal">Urna biodegradable</label>
															<div class="col-xs-6">
																<input type="checkbox" id="crematoriumVaseBio" name="crematoriumVaseBio" class="minimal crematoriumVaseBio">
															</div>
														</div>
													</div>
													<div class="col-xs-2">
														<div class="form-group">
															<label class="col-xs-6 control-label toNormal">Féretro ecológico</label>
															<div class="col-xs-6">
																<input type="checkbox" id="ecologicCoffin" name="ecologicCoffin"  class="minimal ecologicCoffin">
															</div>
														</div>
													</div>
													<div class="col-xs-2">
														<div class="form-group">
															<label class="col-xs-6 control-label toNormal">Portador marcapasos</label>
															<div class="col-xs-6">
																<input type="checkbox" id="crematoriumPacemaker" name="crematoriumPacemaker" class="crematoriumPacemaker">
															</div>
														</div>
													</div>
												</div>
												<div class="row hide" id="arriveFamilyTime">
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora llegada familia</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="crematoriumArriveTime" name="crematoriumArriveTime" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="crematoriumArriveTimeError"></span>
															</div>
														</div>
													</div>
												</div>
												<hr>
												<div class="row clearfix">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Entregar cenizas a</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="authName" name="authName" autocomplete="off">
															</div>
														</div>
													</div>									
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-6 control-label toNormal">
																<input type="radio" name="authDniType" value="1" checked> NIF
																<input type="radio" name="authDniType" value="2"> NIE
																<input type="radio" name="authDniType" value="3"> Pasaporte
																<input type="radio" name="authDniType" value="4"> Otro
															</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="authDni" name="authDni" autocomplete="off">
																<span class="inputError" id="authDniError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Teléfono</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="authContactPhone" name="authContactPhone" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-1"></div>
													<div class="col-xs-2">
														<div class="form-group">
															<button id="loadFamilyContactCremation" type="button" class="btn btn-default btn-sm c-lile"><i class="fa fa-upload" aria-hidden="true"></i> CARGAR CONTRATANTE</button>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="20" class="form-control datepicker" id="authDate" name="authDate" autocomplete="off" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="authDateError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="authTime" name="authTime" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="authTimeError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Lugar</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="authPlace" name="authPlace" autocomplete="off">
															</div>
														</div>
													</div>
												</div>
												<hr>
												<div class="row clearfix">
													<legend class="toBold fsExp">
														<span class="label labelLgExp" style="background-color: grey;">Control de emisiones</span>
													</legend>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha Inicio</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="20" class="form-control datepicker" id="smokeOpacityDateStart" name="smokeOpacityDateStart" autocomplete="off" disabled>
																	<!-- <div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div> -->
																</div>
																<span class="inputError" id="smokeOpacityDateStartError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora Inicio</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="smokeOpacityTimeStart" name="smokeOpacityTimeStart" autocomplete="off" disabled>
																	<!-- <div class="input-group-addon">
																		<i class="fa fa-clock-o"></i>
																	</div> -->
																</div>
																<span class="inputError" id="smokeOpacityTimeStartError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha Fin</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="20" class="form-control datepicker" id="smokeOpacityDateEnd" name="smokeOpacityDateEnd" autocomplete="off" disabled>
																	<!-- <div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div> -->
																</div>
																<span class="inputError" id="smokeOpacityDateEndError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora Fin</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="smokeOpacityTimeEnd" name="smokeOpacityTimeEnd" autocomplete="off" disabled>
																	<!-- <div class="input-group-addon">
																		<i class="fa fa-clock-o"></i>
																	</div> -->
																</div>
																<span class="inputError" id="smokeOpacityTimeEndError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Peso carga</label>
															<div class="col-xs-6">
																<input type="number" min="0" size="30" class="form-control" id="smokeOpacityLoadWeight" name="smokeOpacityLoadWeight" autocomplete="off">
																<span class="inputError" id="smokeOpacityLoadWeightError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Escala Bacharach</label>
															<div class="col-xs-6">
																<select id="smokeOpacityBacharachScale" name="smokeOpacityBacharachScale" class="form-control smoke-section">
																	<option value="null" selected>-</option>	
																	<option value="0">0</option>
																	<option value="1">1</option>
																	<option value="2">2</option>
																	<option value="3">3</option>
																	<option value="4">4</option>
																	<option value="5">5</option>
																	<option value="6">6</option>
																	<option value="7">7</option>
																	<option value="8">8</option>
																	<option value="9">9</option>
																</select>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha Medición</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="20" class="form-control datepicker" id="smokeOpacityDateReading" name="smokeOpacityDateReading" autocomplete="off" disabled>
																	<!-- <div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div> -->
																</div>
																<span class="inputError" id="smokeOpacityDateReadingError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora Medición</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="smokeOpacityTimeReading" name="smokeOpacityTimeReading" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="smokeOpacityTimeReadingError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Incidencias</label>
															<div class="col-xs-7">
																<select id="smokeOpacityIncidents" name="smokeOpacityIncidents" class="form-control smoke-section">
																	<option value="0" selected>No</option>
																	<option value="1">Sí</option>
																</select>
															</div>
														</div>
													</div>
													<div class="col-xs-6 hide" id="smokeOpacityNotesSection">
														<div class="form-group" style="display:flex;align-items:center">
															<label class="col-xs-2 control-label toNormal" for="smokeOpacityIncidentsNotes" style="margin-left:-20px;">Notas</label>
															<div class="col-xs-10">
																<textarea class="form-control" name="smokeOpacityIncidentsNotes" id="smokeOpacityIncidentsNotes" cols="108" rows="4"></textarea>
																<span class="inputError" id="smokeOpacityIncidentsNotesError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<div class="col-xs-9">
																<input type="file" class="form-control" name="fileAttachDoc[]" accept="image/*" id="fileAttachDoc" style="width: 75%!important;margin-left: 7.5em;border: 0;">
																<div id="titleDocSmokeSection" class="hide phones in" style="margin-left: 7em;margin-top: 0.5em;">
																	<span class="label label-default small">
																		<span id="titleDocSmoke" class="number" style="cursor:pointer"></span> 
																		<i id="removeSmokeFile" class="fa fa-times-circle btn-remove" aria-hidden="true" title="Eliminar adjunto"></i>
																	</span>
																</div>
															</div>
														</div>
													</div>
												</div>
											</fieldset>
											<fieldset>
												<legend class="toBold fsExp"><span class="label label-primary labelLgExp">Datos de Personal y Libro de Registro</span></legend>
												<div class="row clearfix">
													<div class="col-xs-4" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Funeraria Servicio</label>
															<div class="col-xs-7">
																<div class="input-group select2-personal">
																	<select class="form-control" id="funeralHomeService" name="funeralHomeService"></select>
																	<span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-funeralHome" title="Nuevo"><i class="fa fa-plus"></i></a></span>
																</div>
																<span class="inputError" id="funeralHomeServiceError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-4" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Atención familia</label>
															<div class="col-xs-7">
																<div class="input-group select2-personal">
																	<select id="familyAssistance" name="familyAssistance" class="form-control select2"></select>
																</div>
																<span class="inputError" id="familyAssistanceError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-4" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Vehículo de Recogida Inicial</label>
															<div class="col-xs-7">
																<div class="input-group select2-personal">
																	<select id="carCollection1" name="carCollection1" class="form-control cars-collection select2"></select>
																</div>
																<span class="inputError" id="carCollection1Error"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3 car-collection-1-other hide" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Matrícula</label>
															<div class="col-xs-7">
																<input type="text" class="form-control" id="carCollection1LicensePlate" name="carCollection1LicensePlate" autocomplete="off">
																<span class="inputError" id="carCollection1LicensePlateError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3 car-collection-1-other hide" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Marca</label>
															<div class="col-xs-7">
																<input type="text" class="form-control" id="carCollection1Brand" name="carCollection1Brand" autocomplete="off">
																<span class="inputError" id="carCollection1BrandError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-2 car-collection-1-other hide" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Modelo</label>
															<div class="col-xs-7">
																<input type="text" class="form-control" id="carCollection1Model" name="carCollection1Model" autocomplete="off">
																<span class="inputError" id="carCollection1ModelError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Recogida Cadáver</label>
															<div class="col-xs-7">
																<div class="input-group select2-personal">
																	<select id="corpseCollection1" name="corpseCollection1" class="form-control staff-collection select2"></select>
																</div>
																<span class="inputError" id="corpseCollection1Error"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Recogida Cadáver</label>
															<div class="col-xs-7">
																<div class="input-group select2-personal">
																	<select id="corpseCollection2" name="corpseCollection2" class="form-control staff-collection select2"></select>
																</div>
																<span class="inputError" id="corpseCollection2Error"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-4" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Vehículo de Conducción</label>
															<div class="col-xs-7">
																<div class="input-group select2-personal">
																	<select id="hearse" name="hearse" class="cars-collection form-control select2"></select>
																</div>
																<span class="inputError" id="hearseError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3 hearse-other hide" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Matrícula</label>
															<div class="col-xs-7">
																<input type="text" class="form-control" id="hearseLicensePlate" name="hearseLicensePlate" autocomplete="off">
																<span class="inputError" id="hearseLicensePlateError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3 hearse-other hide" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Marca</label>
															<div class="col-xs-7">
																<input type="text" class="form-control" id="hearseBrand" name="hearseBrand" autocomplete="off">
																<span class="inputError" id="hearseBrandError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-2 hearse-other hide" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Modelo</label>
															<div class="col-xs-7">
																<input type="text" class="form-control" id="hearseModel" name="hearseModel" autocomplete="off">
																<span class="inputError" id="hearseModelError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-4" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Lugar de destino intermedio</label>
															<div class="col-xs-7">
																<div class="input-group select2-personal">
																	<select id="placeDestinationMiddle" name="placeDestinationMiddle" class="form-control select2"></select>
																	<span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-destinationPlaceMiddle" title="Nuevo"><i class="fa fa-plus"></i></a></span>
																</div>
																<span class="inputError" id="placeDestinationMiddleError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Lugar de destino final</label>
															<div class="col-xs-7">
																<div class="input-group select2-personal" style="display:flex">
																	<div class="destination-place-final-cemetery">
																		<select id="placeDestinationFinalCemetery" name="placeDestinationFinalCemetery" class="form-control select2 cemetery-destination-place-final"></select>
																	</div>
																	<div class="destination-place-final hide">
																		<select id="placeDestinationFinal" name="placeDestinationFinal" class="form-control select2"></select>
																		<span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-destinationPlaceFinal" title="Nuevo"><i class="fa fa-plus"></i></a></span>
																	</div>
																	<label class="checkbox-inline" style="margin-left:10px;margin-top:-0.5em">
																		<input type="checkbox" id="placeDestinationSearch" name="placeDestinationSearch" class="minimal"> <span class="bolder">Buscar</span>
																	</label>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="row mortuary-reg-section clearfix">
													<div class="col-xs-12">
														<div class="form-group">
															<label class="col-xs-1 control-label toNormal">Observaciones</label>
															<div class="col-xs-11">
																<textarea class="form-control" rows="3" cols="100" id="mortuaryRegNotes" name="mortuaryRegNotes"></textarea>
															</div>
														</div>
													</div>
												</div>
												<hr>
												<div class="row clearfix" style="padding-left: 40px;padding-bottom: 15px;">
													<div class="col-xs-12">
														<label class="checkbox-inline">
															<input type="checkbox" id="mortuaryReg" name="mortuaryReg" class="minimal mortuaryReg"> <span class="bolder">Reg. Funeraria</span>
														</label>
														<label class="checkbox-inline">
															<input type="checkbox" id="funeralReg" name="funeralReg" class="minimal funeralReg"> <span class="bolder">Reg. Tanatorio</span>
														</label>
														<label class="checkbox-inline">
															<input type="checkbox" id="personalReg" name="personalReg" class="minimal personalReg"> <span class="bolder">Reg. Personal</span>
														</label>
														<label class="checkbox-inline">
															<input type="checkbox" id="crematoriumReg" name="crematoriumReg" class="minimal crematoriumReg"> <span class="bolder">Reg. Crematorio</span>
														</label>
													</div>
												</div>
											</fieldset>
											<fieldset>
												<legend class="toBold fsExp"><span class="label label-primary labelLgExp">Datos de Entrada</span></legend>
												<div class="row clearfix">
													<div class="col-xs-3" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Funeraria de Procedencia</label>
															<div class="col-xs-6">
																<div class="col-xs-6">
																	<div class="input-group">
																		<select class="form-control" id="funeralHome" name="funeralHome"></select>
																		<span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-funeralHome" title="Nuevo"><i class="fa fa-plus"></i></a></span>
																	</div>
																	<span class="inputError" id="funeralHomeError"></span>
																</div>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">CIF</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="funeralHomeCIF" name="funeralHomeCIF" autocomplete="off" disabled>
																<span class="inputError" id="funeralHomeCIFError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Teléfono</label>
															<div class="col-xs-6">
																<input type="text" size="22" class="form-control" id="funeralHomePhone" name="funeralHomePhone" autocomplete="off" disabled>
															</div>
														</div>
													</div>
													<div class="col-xs-2">
														<div class="form-group">
															<label class="col-xs-4 control-label toNormal">Fax</label>
															<div class="col-xs-8">
																<input type="text" size="25" class="form-control" id="funeralHomeFax" name="funeralHomeFax" autocomplete="off" disabled>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha Entrada (*)</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="15" class="form-control datepicker" id="funeralHomeEntryDate" name="funeralHomeEntryDate" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="funeralHomeEntryDateError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora Entrada (*)</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="funeralHomeEntryTime" name="funeralHomeEntryTime" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="funeralHomeEntryTimeError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha Entrada en Túmulo</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="15" class="form-control datepicker" id="entryDateBarrow" name="entryDateBarrow" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="entryDateBarrowError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora Entrada en Túmulo</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="entryTimeBarrow" name="entryTimeBarrow" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="entryTimeBarrowError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Pract. Tanatológica</label>
															<div class="col-xs-6">
																<select class="form-control" id="tanatologicalPractice" name="tanatologicalPractice">
																	<option value="0" selected>--</option>	
																	<option value="1">Tanatoestética</option>	
																	<option value="2">Tanatopraxia</option>
																	<option value="3">Embalsamamiento</option>
																	<option value="4">Conservación</option>
																</select>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Responsable</label>
															<div class="col-xs-6">
																<select class="form-control" id="responsibleUser" name="responsibleUser">
																	<option value="null" selected>Otro</option>	
																</select>
															</div>
														</div>
													</div>
													<div id="responsibleNameDiv">
														<div class="col-xs-3">
															<div class="form-group">
																<label class="col-xs-5 control-label toNormal">Nombre</label>
																<div class="col-xs-6">
																	<input type="text" size="22" class="form-control name" id="responsibleName" name="responsibleName" autocomplete="off">
																</div>
															</div>
														</div>
														<div class="col-xs-3">
															<div class="form-group">
																<label id="respNifLBL" class="col-xs-6 control-label toNormal">
																	<input type="radio" name="responsibleNifType" value="1" checked> NIF
																	<input type="radio" name="responsibleNifType" value="2"> NIE
																	<input type="radio" name="responsibleNifType" value="3"> Pasaporte
																	<input type="radio" name="responsibleNifType" value="4"> Otro
																</label>
																<div class="col-xs-4">
																	<input type="text" size="25" class="form-control nif autocompleteNif" id="responsibleNIF" name="responsibleNIF" autocomplete="off">
																	<span class="inputError" id="responsibleNIFError"></span>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Féretro</label>
															<div class="col-xs-6">
																<select class="form-control" id="coffin" name="coffin">
																	<option value="0" selected>Féretro común</option>	
																	<option value="1">Féretro de Traslado</option>
																	<option value="2">Féretro Incinerar Ecológico</option>
																	<option value="4">Camilla de Recogida</option>
																	<option value="5">Caja de Restos</option>
																	<option value="6">Arca de Traslado</option>
																	<option value="3">Otro</option>
																</select>
																<span class="inputError" id="coffinError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3 hide" id="otherCoffinSection">
														<div class="form-group">
															<label class="col-xs-3 control-label toNormal">Otro</label>
															<div class="col-xs-6">
																<input type="text" size="25" id="otherCoffin" autocomplete="off">
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Cámara Refrigerada</label>
															<div class="col-xs-6">
																<input type="text" size="22" class="form-control" id="refrigeratedChamberName" name="refrigeratedChamberName" autocomplete="off">
																<span class="inputError" id="refrigeratedChamberNameError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha Entrada en Cámara</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="15" class="form-control datepicker" id="refrigeratedChamberDateStart" name="refrigeratedChamberDateStart" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="refrigeratedChamberDateStartError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora Entrada en Cámara</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="refrigeratedChamberTimeStart" name="refrigeratedChamberTimeStart" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="refrigeratedChamberTimeStartError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-3">
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha Salida de Cámara</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="15" class="form-control datepicker" id="refrigeratedChamberDateEnd" name="refrigeratedChamberDateEnd" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="refrigeratedChamberDateEndError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora Salida de Cámara</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="refrigeratedChamberTimeEnd" name="refrigeratedChamberTimeEnd" autocomplete="off">
																	<div class="input-group-addon">
																		<i style="cursor:pointer" class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="refrigeratedChamberTimeEndError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row" style="padding-left: 40px;">
													<div class="col-xs-12">
														<label class="checkbox-inline">
															<input type="checkbox" id="covid" name="covid" class="minimal"> <span class="bolder">Cadáver Grupo I</span>
														</label>
													</div>
												</div>
												<hr>
												<div class="row" style="padding-left: 40px;">
													<div class="col-xs-12">
														<label class="checkbox-inline">
															<input type="checkbox" id="moveJudicial" name="moveJudicial" class="minimal moveJudicial"> <span class="bolder">Judicial</span>
														</label>
														<label class="checkbox-inline">
															<input type="checkbox" id="moveTraslado" name="moveTraslado" class="minimal moveTraslado"> <span class="bolder">Recogida</span>
														</label>
														<label class="checkbox-inline">
															<input type="checkbox" id="moveDevolucion" name="moveDevolucion" class="minimal moveDevolucion"> <span class="bolder">Devolución</span>
														</label>
													</div>
												</div>
												<br>
												<div class="row clearfix">
													<div class="form-group">
														<label class="col-xs-11 toNormal">
															NOTA: Los campos marcados como (*) son necesarios para la creación del control de visitas.
															En el caso de la fecha y hora de entrada, se tomará como preferencia la fecha y hora de velación sobre la fecha y hora de entrada
															(siendo la fecha y hora de velación no obligatorios en el caso de que estén los otros cubiertos y viceversa)
														</label>
													</div>
												</div>
											</fieldset>
											<fieldset id="moveSection" class="hide fieldset">
												<legend class="toBold fsExp"><span class="label label-primary labelLgExp">Datos del Traslado</span></legend>
												<div class="row clearfix">
													<div class="col-xs-3" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Funeraria destino</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<select class="form-control" id="moveFuneralHome" name="moveFuneralHome"></select>
																	<span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-funeralHome" title="Nuevo"><i class="fa fa-plus"></i></a></span>
																</div>
																<span class="inputError" id="moveFuneralHomeError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">CIF</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="moveFuneralHomeCIF" name="moveFuneralHomeCIF" autocomplete="off" disabled>
																<span class="inputError" id="moveFuneralHomeCIFError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-3">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Teléfono</label>
															<div class="col-xs-6">
																<input type="text" size="23" class="form-control" id="moveFuneralHomePhone" name="moveFuneralHomePhone" autocomplete="off" disabled>
															</div>
														</div>
													</div>
													<div class="col-xs-2">
														<div class="form-group">
															<label class="col-xs-4 control-label toNormal">Fax</label>
															<div class="col-xs-8">
																<input type="text" size="25" class="form-control" id="moveFuneralHomeFax" name="moveFuneralHomeFax" autocomplete="off" disabled>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Persona de contacto</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="moveContactPerson" name="moveContactPerson" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Teléfono de contacto</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="moveContactPhone" name="moveContactPhone" autocomplete="off">
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Dirección</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="moveFuneralHomeAddress" name="moveFuneralHomeAddress" autocomplete="off" disabled>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Fecha Salida</label>
															<div class="col-xs-6">
																<div class="input-group date">
																	<input type="text" size="20" class="form-control datepicker" id="moveLeavingDate" name="moveLeavingDate" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-calendar"></i>
																	</div>
																</div>
																<span class="inputError" id="moveLeavingDateError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group bootstrap-timepicker timepicker">
															<label class="col-xs-5 control-label toNormal">Hora Salida</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<input type="text" size="20" class="form-control time" id="moveLeavingTime" name="moveLeavingTime" autocomplete="off">
																	<div class="input-group-addon">
																		<i class="fa fa-clock-o"></i>
																	</div>
																</div>
																<span class="inputError" id="moveLeavingTimeError"></span>
															</div>
														</div>
													</div>
												</div>								
												<div class="row clearfix">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Origen - Provincia</label>
															<div class="col-xs-6">
																<select id="moveCollectionProvince" name="moveCollectionProvince" class="form-control"></select>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Origen - Localidad</label>
															<div class="col-xs-6">
																<div class="input-group">
																	<select id="moveCollection" name="moveCollection" class="form-control"></select>
																	<span class="input-group-addon"><a href="#" data-toggle="modal" data-target="#modal-new-deceasedBirthdayLocation" title="Nuevo"><i class="fa fa-plus"></i></a></span>
																</div>
																<span class="inputError" id="moveCollectionError"></span>
															</div>
														</div>
													</div>									
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Origen - Dirección</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="moveCollectionAddress" name="moveCollectionAddress" autocomplete="off">
																<span class="inputError" id="moveCollectionAddressError"></span>
															</div>
														</div>
													</div>									
												</div>
												<div class="row clearfix">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Destino - Provincia</label>
															<div class="col-xs-6">
																<select id="moveDestinationProvince" name="moveDestinationProvince" class="form-control"></select>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Destino - Localidad</label>
															<div class="col-xs-6">
																<select id="moveDestination" name="moveDestination" class="form-control"></select>
																<span class="inputError" id="applicantLocationError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Destino - Dirección</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="moveDestinationAddress" name="moveDestinationAddress" autocomplete="off">
																<span class="inputError" id="moveDestinationAddressError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Vía</label>
															<div class="col-xs-6">
																<select class="form-control" name="moveVia" id="moveVia">
																	<option value="0" selected>Carretera</option>
																	<option value="1">Avión</option>
																</select>
															</div>
														</div>
													</div>
													<div class="col-xs-4">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Destino final</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="moveFinalDestination" name="moveFinalDestination" autocomplete="off">
																<span class="inputError" id="moveFinalDestinationError"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4 flightSection hide">
														<div class="form-group">
															<label class="col-xs-5 control-label toNormal">Número de vuelo</label>
															<div class="col-xs-6">
																<input type="text" size="25" class="form-control" id="flightNumber" name="flightNumber" autocomplete="off">
																<span class="inputError" id="flightNumberError"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix" id="roadSection">
													<div class="col-xs-3" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-6 control-label toNormal">Vehículo de Traslado</label>
															<div class="col-xs-6">
																<div class="input-group select2-personal">
																	<select id="carCollection2" name="carCollection2" class="form-control select2"></select>
																</div>
																<span class="inputError" id="carCollection2Error"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-5" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-6 control-label toNormal">Personal de Traslado</label>
															<div class="col-xs-6">
																<div class="input-group select2-personal">
																	<select id="staffTransfer1" name="staffTransfer1" class="form-control staff-collection select2"></select>
																</div>
																<span class="inputError" id="staffTransfer1Error"></span>
															</div>
														</div>
													</div>
													<div class="col-xs-4" style="z-index: 50">
														<div class="form-group">
															<label class="col-xs-4 control-label toNormal">Personal de Traslado</label>
															<div class="col-xs-6">
																<div class="input-group select2-personal">
																	<select id="staffTransfer2" name="staffTransfer2" class="form-control staff-collection select2"></select>
																</div>
																<span class="inputError" id="staffTransfer2Error"></span>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="row clearfix">
														<div class="col-xs-4 flightSection hide">
															<div class="form-group">
																<label class="col-xs-5 control-label toNormal">Aeropuerto de Salida</label>
																<div class="col-xs-6">
																	<input type="text" size="25" class="form-control" id="airportOrigin" name="airportOrigin" autocomplete="off">
																	<span class="inputError" id="airportOriginError"></span>
																</div>
															</div>
														</div>
														<div class="col-xs-4 flightSection hide">
															<div class="form-group">
																<label class="col-xs-5 control-label toNormal">Fecha Salida a Destino</label>
																<div class="col-xs-6">
																	<div class="input-group date">
																		<input type="text" size="20" class="form-control datepicker" id="departureDate" name="departureDate" autocomplete="off">
																		<div class="input-group-addon">
																			<i class="fa fa-calendar"></i>
																		</div>
																	</div>
																	<span class="inputError" id="departureDateError"></span>
																</div>
															</div>
														</div>
														<div class="col-xs-4 flightSection hide">
															<div class="form-group bootstrap-timepicker timepicker">
																<label class="col-xs-5 control-label toNormal">Hora Salida a Destino</label>
																<div class="col-xs-6">
																	<div class="input-group">
																		<input type="text" size="20" class="form-control time" id="departureTime" name="departureTime" autocomplete="off">
																		<div class="input-group-addon">
																			<i class="fa fa-clock-o"></i>
																		</div>
																	</div>
																	<span class="inputError" id="departureTimeError"></span>
																</div>
															</div>
														</div>
													</div>
													<div class="row clearfix">
														<div class="col-xs-4 flightSection hide">
															<div class="form-group">
																<label class="col-xs-5 control-label toNormal">Aeropuerto de Destino</label>
																<div class="col-xs-6">
																	<input type="text" size="25" class="form-control" id="arrivalAirport" name="arrivalAirport" autocomplete="off">
																	<span class="inputError" id="arrivalAirportError"></span>
																</div>
															</div>
														</div>
														<div class="col-xs-4">
															<div class="form-group">
																<label class="col-xs-5 control-label toNormal">Fecha Llegada a Destino</label>
																<div class="col-xs-6">
																	<div class="input-group date">
																		<input type="text" size="20" class="form-control datepicker" id="arrivalDate" name="arrivalDate" autocomplete="off">
																		<div class="input-group-addon">
																			<i class="fa fa-calendar"></i>
																		</div>
																	</div>
																	<span class="inputError" id="arrivalDateError"></span>
																</div>
															</div>
														</div>
														<div class="col-xs-4">
															<div class="form-group bootstrap-timepicker timepicker">
																<label class="col-xs-5 control-label toNormal">Hora Llegada a Destino</label>
																<div class="col-xs-6">
																	<div class="input-group">
																		<input type="text" size="20" class="form-control time" id="arrivalTime" name="arrivalTime" autocomplete="off">
																		<div class="input-group-addon">
																			<i class="fa fa-clock-o"></i>
																		</div>
																	</div>
																	<span class="inputError" id="arrivalTimeError"></span>
																</div>
															</div>
														</div>
													</div>
													<div class="row flightSection hide clearfix">
														<div class="col-xs-4">
															<div class="form-group">
																<label class="col-xs-5 control-label toNormal">Agencia/Consignataria</label>
																<div class="col-xs-6">
																	<input type="text" size="25" class="form-control" id="agency" name="agency" autocomplete="off">
																	<span class="inputError" id="agencyError"></span>
																</div>
															</div>
														</div>
														<div class="col-xs-4">
															<div class="form-group">
																<label class="col-xs-5 control-label toNormal">Persona de Contacto</label>
																<div class="col-xs-6">
																	<input type="text" size="25" class="form-control" id="agencyContact" name="agencyContact" autocomplete="off">
																	<span class="inputError" id="agencyContactError"></span>
																</div>
															</div>
														</div>
														<div class="col-xs-4">
															<div class="form-group">
																<label class="col-xs-5 control-label toNormal">Teléfono</label>
																<div class="col-xs-6">
																	<input type="text" size="25" class="form-control" id="agencyContactPhone" name="agencyContactPhone" autocomplete="off">
																	<span class="inputError" id="agencyContactPhoneError"></span>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div class="row clearfix">
													<div class="col-xs-12">
														<div class="form-group">
															<label class="col-xs-1 control-label toNormal">Notas</label>
															<div class="col-xs-11">
																<textarea class="form-control" rows="3" cols="100" id="moveNotes" name="moveNotes"></textarea>
															</div>
														</div>
													</div>
												</div>
											</fieldset>
											<fieldset class="fieldset">
												<legend class="toBold fsExp"><span class="label label-primary labelLgExp">Observaciones</span></legend>
												<div class="row clearfix">
													<div class="col-xs-12">
														<div class="form-group">
															<label class="col-xs-1 control-label toNormal">Notas</label>
															<div class="col-xs-11">
																<textarea class="form-control" rows="4" id="notesExpedient" name="notesExpedient" style="width: 90% !important;"></textarea>
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
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/esquela/'.$expedientID; ?>">ESQUELA</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/cservicio/'.$expedientID; ?>">C.SERVICIO</a></li>
							<?php if($_SESSION['tellmebye'] == '1'){ ?>
								<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/tellmebye/'.$expedientID; ?>">TELLMEBYE</a></li>
							<?php } ?>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/orden-trabajo/'.$expedientID; ?>">ORDEN DE TRABAJO</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/documentacion/'.$expedientID; ?>">DOCUMENTACIÓN</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/documentos/'.$expedientID; ?>">DOCUMENTACIÓN PERSONALIZADA</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/logs/'.$expedientID; ?>">LOGS</a></li>
							<li role="presentation"><a id="goToAssistance" style="cursor: pointer;">ASISTENCIA</a></li>
							<li class="deceasedData">Nº <span class="bolder numberExp"></span><span id="deceased"></span></li>
							<li class="hide" id="associatedData" style="margin-top: 10px;"><span style="margin-left: 35px;">Asociado al expediente: </span><span class="bolder" id="associateNav"></span></li>
							<li class="hide" id="numberInvoiceData" style="margin-top: 10px;"><span style="margin-left: 35px;">Factura: </span><span class="bolder" id="numberInvoiceNav"></span></li>
						</ul>
					</div>
				</div>
				<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions-expedient.php"); ?>
			</div>
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
		<script>var hasTellmebye = <?= isset($_SESSION['tellmebye']) ? 0 : intval($_SESSION['tellmebye']) ?>;</script>
		<script src="<?php echo $utils->getRoute(); ?>resources/js/expedient/expedient-edit/functions.js?v=<?= CACHE_DATE ?>"></script>
	</body>
</html>