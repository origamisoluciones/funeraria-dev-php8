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
		<title><?php echo $utils->getCompanyName(); ?> | Tellmebye</title>
		<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/all.css?v=<?= CACHE_DATE ?>">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
	</head>
	<body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed page expedient-tellmebye">
		<?php require_once($_SESSION['basePath'] . "view/expedient/modal/tellmebye-modal.php"); ?>
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
						<li class="active">Tellmebye</li>
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
                    <input type="hidden" id="expedientID" name="expedientID" value="<?php echo $expedientID; ?>">
                    <img class="img-responsive" src="<?php echo $utils->getRoute(); ?>resources/img/tellmebye_header_icons.png" alt="Logos">
                    <br>
                    <form class="form-horizontal" id="formData">
                        <div class="col-xs-12 hide" id="mortuaryRoomWarningSection">
                            <div class="alert alert-warning" id="mortuaryRoomWarning"></div>
                        </div>
                        <fieldset>
                            <div class="row">
                                <div class="col-xs-1"></div>
                                <div class="col-xs-2">
                                    <label class="toNormal">Código Tellmebye</label>
                                    <input type="text" class="form-control" name="tellmebyeCode" id="tellmebyeCode" autocomplete="off" readonly>
                                </div>
                                <div class="col-xs-1"></div>
                                <div class="col-xs-2">
                                    <label class="toNormal">Número de expediente</label>
                                    <input type="text" class="form-control" name="expedientNumber" id="expedientNumber" autocomplete="off" readonly>
                                </div>
                                <div class="col-xs-1"></div>
                                <div class="col-xs-3">
                                    <label class="toNormal">Asesor inicial</label>
                                    <input type="text" class="form-control" name="familyAttendance" id="familyAttendance" autocomplete="off" readonly>
                                </div>
                                <div class="col-xs-1"></div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <div class="row">
                                <div class="col-xs-4">
                                    <label class="toNormal">Mostrar en índice de muros</label>
                                    <div class="btn-group">
                                        <button type="button" class="tellmebye-button show-tv-info-no btn btn-danger btn-switch active">NO</button>
                                        <button type="button" class="tellmebye-button show-tv-info-yes btn btn-default btn-switch">SI</button>
                                    </div>
                                </div>
                                <div class="col-xs-4">
                                    <label class="toNormal">Mostrar servicio en TV</label>
                                    <div class="btn-group">
                                        <button type="button" class="tellmebye-button show-service-room-no btn btn-danger btn-switch active">NO</button>
                                        <button type="button" class="tellmebye-button show-service-room-yes btn btn-default btn-switch">SI</button>
                                    </div>
                                </div>
                                <div class="col-xs-4">
                                    <label class="toNormal">Muro del recuerdo</label>
                                    <div class="btn-group">
                                        <button type="button" class="tellmebye-button create-wall-reminder-no btn btn-danger btn-switch active">NO</button>
                                        <button type="button" class="tellmebye-button create-wall-reminder-yes btn btn-default btn-switch">SI</button>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-4" id="supervisedSection">
                                    <label class="toNormal">Supervisado</label>
                                    <div class="btn-group">
                                        <button type="button" class="tellmebye-button supervised-no btn btn-danger btn-switch active">NO</button>
                                        <button type="button" class="tellmebye-button supervised-yes btn btn-default btn-switch">SI</button>
                                    </div>
                                </div>
                                <div class="col-xs-4" id="privateSection">
                                    <label class="toNormal">Privado</label>
                                    <div class="btn-group">
                                        <button type="button" class="tellmebye-button private-no btn btn-danger btn-switch active">NO</button>
                                        <button type="button" class="tellmebye-button private-yes btn btn-default btn-switch">SI</button>
                                    </div>
                                </div>
                                <div class="col-xs-2 d-none" id="passwordSection">
                                    <label class="toNormal">Contraseña</label>
                                    <input type="text" class="form-control" name="wallPassword" id="wallPassword" autocomplete="off">
                                    <span class="inputError" id="wallPasswordError"></span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-3">
                                    <label class="toNormal">Tanatorio</label>
                                    <select class="form-control" name="tellmebyeMortuary" id="tellmebyeMortuary"></select>
                                    <span class="inputError" id="tellmebyeMortuaryError"></span>
                                </div>
                                <div class="col-xs-3">
                                    <label class="toNormal">Sala</label>
                                    <select class="form-control tellmebye-room" name="tellmebyeRoom" id="tellmebyeRoom"></select>
                                    <span class="inputError" id="tellmebyeRoomError"></span>
                                </div>
                                <div class="col-xs-3">
                                    <label class="toNormal">Dirección muro</label>
                                    <input type="text" class="form-control" name="tellmebyeWallUrl" id="tellmebyeWallUrl" autocomplete="off" readonly>
                                </div>
                            </div>
                            <div class="row hide" id="subheaderWarningSection">
                                <div class="col-12">
                                    <div class="alert alert-warning" id="subheaderWarning"></div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <div class="row">
                                <div class="col-xs-3"></div>
                                <div class="col-xs-6">
                                    <div class="text-center bg-primary fieldset-section-title">
                                        Datos del fallecido
                                    </div>
                                </div>
                                <div class="col-xs-3"></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-1">
                                    <label class="toNormal">Género</label>
                                    <input type="text" class="form-control" name="deceasedGender" id="deceasedGender" autocomplete="off">
                                    <span class="inputError" id="deceasedGenderError"></span>
                                </div>
                                <div class="col-xs-1">
                                    <label class="toNormal">D./Dña.</label>
                                    <input type="text" class="form-control" name="deceasedTitle" id="deceasedTitle" autocomplete="off">
                                    <span class="inputError" id="deceasedTitleError"></span>
                                </div>
                                <div class="col-xs-3">
                                    <label class="toNormal">Nombre del fallecido</label>
                                    <input type="text" class="form-control" name="deceasedName" id="deceasedName" autocomplete="off">
                                    <span class="inputError" id="deceasedNameError"></span>
                                </div>
                                <div class="col-xs-4">
                                    <label class="toNormal">Apellidos del fallecido</label>
                                    <input type="text" class="form-control" name="deceasedSurname" id="deceasedSurname" autocomplete="off">
                                    <span class="inputError" id="deceasedSurnameError"></span>
                                </div>
                                <div class="col-xs-2">
                                    <label class="toNormal">Alias</label>
                                    <input type="text" class="form-control" name="deceasedAlias" id="deceasedAlias" autocomplete="off">
                                    <span class="inputError" id="deceasedAliasError"></span>
                                </div>
                                <div class="col-xs-1">
                                    <label class="toNormal">Edad</label>
                                    <input type="text" class="form-control" name="deceasedAge" id="deceasedAge" autocomplete="off" readonly>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-2">
                                    <label class="toNormal">Fecha de nacimiento</label>
                                    <div class="input-group date">
                                        <input type="text" class="form-control datepicker" name="deceasedBirthdate" id="deceasedBirthdate" autocomplete="off">
                                        <div class="input-group-addon">
                                            <i class="fa fa-calendar"></i>
                                        </div>
                                    </div>
                                    <span class="inputError" id="deceasedBirthdateError"></span>
                                </div>
                                <div class="col-xs-2">
                                    <label class="toNormal">Fecha de fallecimiento</label>
                                    <div class="input-group date">
                                        <input type="text" class="form-control datepicker" name="deceasedDeceasedDate" id="deceasedDeceasedDate" autocomplete="off">
                                        <div class="input-group-addon">
                                            <i class="fa fa-calendar"></i>
                                        </div>
                                    </div>
                                    <span class="inputError" id="deceasedDeceasedDateError"></span>
                                </div>
                                <div class="col-xs-2">
                                    <label class="toNormal">Hora de fallecimiento</label>
                                    <div class="input-group bootstrap-timepicker timepicker">
                                        <input type="text" class="form-control time" name="deceasedDeceasedTime" id="deceasedDeceasedTime" autocomplete="off">
                                        <div class="input-group-addon">
                                            <i class="cursor-pointer fa fa-clock-o"></i>
                                        </div>
                                    </div>
                                    <span class="inputError" id="deceasedDeceasedTimeError"></span>
                                </div>
                                <div class="col-xs-6 deceased-picture-update d-none">
                                    <fieldset>
                                        <div class="row">
                                            <div class="col-xs-4">
                                                <label class="toNormal">Foto del fallecido</label>
                                                <div class="btn-group d-block"> 
                                                    <button type="button" class="tellmebye-button deceased-picture-no btn btn-danger btn-switch active">NO</button>
                                                    <button type="button" class="tellmebye-button deceased-picture-yes btn btn-default btn-switch">SI</button>
                                                </div>
                                            </div>
                                            <div class="col-xs-6 deceased-picture-section d-none">
                                                <input type="file" id="deceasedPicture" accept="image/jpeg,image/png">
                                                <span class="badge badge-danger d-none" id="emptyError">Debes seleccionar una imagen</span>
                                                <span class="badge badge-danger d-none" id="formatError">Formato de archivo no permitido (jpg, jpeg, png)</span>
                                                <button id="uploadImage" type="button" class="btn btn-primary" style="margin-top: 4px;"><i class="fa fa-floppy-o" aria-hidden="true"></i> Subir imagen</button>
                                            </div>
                                            <div class="col-xs-2 d-none" id="deceasedPictureSrcSection">
                                                <img class="img-responsive tellmebye-deceased-image" id="deceasedPictureSrc" src="" alt="Imagen difunto">
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <div class="row">
                                <div class="col-xs-3"></div>
                                <div class="col-xs-6">
                                    <div class="text-center bg-primary fieldset-section-title">
                                        Datos de los administradores
                                    </div>
                                </div>
                                <div class="col-xs-3"></div>
                            </div>
                            <div class="hiring-section" id="moreHiringIndexSection0" moreHiringIndex="0">
                                <div class="row">
                                    <div class="col-xs-3">
                                        <label class="toNormal">Nombre del administrador</label>
                                        <input type="text" class="form-control" name="hiringName0" id="hiringName0" autocomplete="off">
                                        <span class="inputError" id="hiringName0Error"></span>
                                    </div>
                                    <div class="col-xs-3">
                                        <label class="toNormal">Apellidos del administrador</label>
                                        <input type="text" class="form-control" name="hiringSurname0" id="hiringSurname0" autocomplete="off">
                                        <span class="inputError" id="hiringSurname0Error"></span>
                                    </div>
                                    <div class="col-xs-2">
                                        <label class="toNormal">DNI</label>
                                        <input type="text" class="form-control" name="hiringNif0" id="hiringNif0" autocomplete="off">
                                        <span class="inputError" id="hiringNif0Error"></span>
                                    </div>
                                    <div class="col-xs-2">
                                        <label class="toNormal">Parentesco</label>
                                        <input type="text" class="form-control" name="hiringRelationship0" id="hiringRelationship0" autocomplete="off">
                                        <span class="inputError" id="hiringRelationship0Error"></span>
                                    </div>
                                    <div class="col-xs-2">
                                        <label class="toNormal">Teléfono fijo</label>
                                        <input type="text" class="form-control" name="hiringPhone0" id="hiringPhone0" autocomplete="off">
                                        <span class="inputError" id="hiringPhone0Error"></span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-2">
                                        <label class="toNormal">Teléfono móvil</label>
                                        <input type="text" class="form-control" name="hiringMobilePhone0" id="hiringMobilePhone0" autocomplete="off">
                                        <span class="inputError" id="hiringMobilePhone0Error"></span>
                                    </div>
                                    <div class="col-xs-4">
                                        <label class="toNormal">Correo electrónico</label>
                                        <input type="text" class="form-control" name="hiringEmail0" id="hiringEmail0" autocomplete="off">
                                        <span class="inputError" id="hiringEmail0Error"></span>
                                    </div>
                                    <div class="col-xs-6">
                                        <label class="toNormal">Domicilio</label>
                                        <input type="text" class="form-control" name="hiringAddress0" id="hiringAddress0" autocomplete="off">
                                        <span class="inputError" id="hiringAddress0Error"></span>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div class="hiring-section" id="moreHiringIndexSection0" moreHiringIndex="1">
                                <div class="row">
                                    <div class="col-xs-3">
                                        <label class="toNormal">Nombre del administrador 2</label>
                                        <input type="text" class="form-control" name="hiringName1" id="hiringName1" autocomplete="off">
                                        <span class="inputError" id="hiringName1Error"></span>
                                    </div>
                                    <div class="col-xs-3">
                                        <label class="toNormal">Apellidos del administrador 2</label>
                                        <input type="text" class="form-control" name="hiringSurname1" id="hiringSurname1" autocomplete="off">
                                        <span class="inputError" id="hiringSurname1Error"></span>
                                    </div>
                                    <div class="col-xs-2">
                                        <label class="toNormal">DNI</label>
                                        <input type="text" class="form-control" name="hiringNif1" id="hiringNif1" autocomplete="off">
                                        <span class="inputError" id="hiringNif1Error"></span>
                                    </div>
                                    <div class="col-xs-2">
                                        <label class="toNormal">Parentesco</label>
                                        <input type="text" class="form-control" name="hiringRelationship1" id="hiringRelationship1" autocomplete="off">
                                        <span class="inputError" id="hiringRelationship1Error"></span>
                                    </div>
                                    <div class="col-xs-2">
                                        <label class="toNormal">Teléfono fijo</label>
                                        <input type="text" class="form-control" name="hiringPhone1" id="hiringPhone1" autocomplete="off">
                                        <span class="inputError" id="hiringPhone1Error"></span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-2">
                                        <label class="toNormal">Teléfono Móvil</label>
                                        <input type="text" class="form-control" name="hiringMobilePhone1" id="hiringMobilePhone1" autocomplete="off">
                                        <span class="inputError" id="hiringMobilePhone1Error"></span>
                                    </div>
                                    <div class="col-xs-4">
                                        <label class="toNormal">Correo electrónico</label>
                                        <input type="text" class="form-control" name="hiringEmail1" id="hiringEmail1" autocomplete="off">
                                        <span class="inputError" id="hiringEmail1Error"></span>
                                    </div>
                                    <div class="col-xs-6">
                                        <label class="toNormal">Domicilio</label>
                                        <input type="text" class="form-control" name="hiringAddress1" id="hiringAddress1" autocomplete="off">
                                        <span class="inputError" id="hiringAddress1Error"></span>
                                    </div>
                                </div>
                            </div>
                            <div id="moreHiring"></div>
                            <div class="row">
                                <div class="col-xs-10">
                                    <hr>
                                </div>
                                <div class="col-xs-2">
                                    <button type="button" class="btn btn-primary float-right" id="addMoreHiring">
                                        <i class="fa fa-arrow-down"></i>
                                        Añadir administrador
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <div class="row">
                                <div class="col-xs-3"></div>
                                <div class="col-xs-6">
                                    <div class="text-center bg-primary fieldset-section-title">
                                        Datos de los eventos (Ceremonias / Inhumación)
                                    </div>
                                </div>
                                <div class="col-xs-3"></div>
                            </div>
                            <div class="row">
                                <div class="col-xs-12">
                                    <fieldset>
                                        <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Velación</span></legend>
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <label class="toNormal">Tanatorio</label>
                                                <input type="text" class="form-control" name="eventVelationMortuary" id="eventVelationMortuary" autocomplete="off" readonly>
                                                <span class="inputError" id="eventVelationMortuaryError"></span>
                                            </div>
                                            <div class="col-xs-3">
                                                <label class="toNormal">Sala asignada</label>
                                                <select class="form-control tellmebye-room" name="eventVelationRoom" id="eventVelationRoom"></select>
                                                <span class="inputError" id="eventVelationRoomError"></span>
                                            </div>
                                            <div class="col-xs-4">
                                                <label class="toNormal">Dirección de la casa mortuoria</label>
                                                <input type="text" class="form-control" name="eventVelationMortuaryAddress" id="eventVelationMortuaryAddress" autocomplete="off" readonly>
                                                <span class="inputError" id="eventVelationMortuaryAddressError"></span>
                                            </div>
                                            <div class="col-xs-2">
                                                <label class="toNormal">Municipio</label>
                                                <input type="text" class="form-control" name="eventVelationCity" id="eventVelationCity" autocomplete="off" readonly>
                                                <span class="inputError" id="eventVelationCityError"></span>
                                            </div>
                                        </div>
                                        <div class="row hide" id="eventVelationWarningSection">
                                            <div class="col-12">
                                                <div class="alert alert-warning" id="eventVelationWarning"></div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <label class="toNormal">Cámara asignada</label>
                                                <select class="form-control tellmebye-camera" name="eventVelationCamera" id="eventVelationCamera"></select>
                                                <span class="inputError" id="eventVelationCameraError"></span>
                                            </div>
                                            <div class="col-xs-2">
                                                <div class="float-right">
                                                    <label class="toNormal">Fecha de inicio velación</label>
                                                    <div class="input-group date">
                                                        <input type="text" class="form-control datepicker" name="eventVelationStartDate" id="eventVelationStartDate" autocomplete="off">
                                                        <div class="input-group-addon">
                                                            <i class="fa fa-calendar"></i>
                                                        </div>
                                                    </div>
                                                    <span class="inputError" id="eventVelationStartDateError"></span>
                                                </div>
                                            </div>
                                            <div class="col-xs-2">
                                                <label class="toNormal">Hora de inicio velación</label>
                                                <div class="input-group bootstrap-timepicker timepicker">
                                                    <input type="text" class="form-control time" name="eventVelationStartTime" id="eventVelationStartTime" autocomplete="off">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-clock-o"></i>
                                                    </div>
                                                </div>
                                                <span class="inputError" id="eventVelationStartTimeError"></span>
                                            </div>
                                            <div class="col-xs-2">
                                                <div class="float-right">
                                                    <label class="toNormal">Fecha de fin velación</label>
                                                    <div class="input-group date">
                                                        <input type="text" class="form-control datepicker" name="eventVelationEndDate" id="eventVelationEndDate" autocomplete="off">
                                                        <div class="input-group-addon">
                                                            <i class="fa fa-calendar"></i>
                                                        </div>
                                                    </div>
                                                    <span class="inputError" id="eventVelationEndDateError"></span>
                                                </div>
                                            </div>
                                            <div class="col-xs-2">
                                                <label class="toNormal">Hora de fin velación</label>
                                                <div class="input-group bootstrap-timepicker timepicker">
                                                    <input type="text" class="form-control time" name="eventVelationEndTime" id="eventVelationEndTime" autocomplete="off">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-clock-o"></i>
                                                    </div>
                                                </div>
                                                <span class="inputError" id="eventVelationEndTimeError"></span>
                                            </div>
                                            <div class="col-xs-1">
                                                <br>
                                                <button type="button" class="btn btn-danger float-right" id="cleanEventVelation">Vaciar evento</button>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Ceremonia</span></legend>
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <label class="toNormal">Lugar de la ceremonia</label>
                                                <input type="text" class="form-control" name="eventCeremonyPlace" id="eventCeremonyPlace" autocomplete="off">
                                                <span class="inputError" id="eventCeremonyPlaceError"></span>
                                            </div>
                                            <div class="col-xs-3">
                                                <label class="toNormal">Sala asignada</label>
                                                <select class="form-control tellmebye-room" name="eventCeremonyRoom" id="eventCeremonyRoom"></select>
                                                <span class="inputError" id="eventCeremonyRoomError"></span>
                                            </div>
                                            <div class="col-xs-4">
                                                <label class="toNormal">Dirección del lugar de ceremonia</label>
                                                <input type="text" class="form-control" name="eventCeremonyAddress" id="eventCeremonyAddress" autocomplete="off">
                                                <span class="inputError" id="eventCeremonyAddressError"></span>
                                            </div>
                                            <div class="col-xs-2">
                                                <label class="toNormal">Municipio</label>
                                                <input type="text" class="form-control" name="eventCeremonyCity" id="eventCeremonyCity" autocomplete="off">
                                                <span class="inputError" id="eventCeremonyCityError"></span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <label class="toNormal">Cámara asignada</label>
                                                <select class="form-control tellmebye-camera" name="eventCeremonyCamera" id="eventCeremonyCamera"></select>
                                                <span class="inputError" id="eventCeremonyCameraError"></span>
                                            </div>
                                            <div class="col-xs-2">
                                                <div class="float-right">
                                                    <label class="toNormal">Fecha de inicio ceremonia</label>
                                                    <div class="input-group date">
                                                        <input type="text" class="form-control datepicker" name="eventCeremonyStartDate" id="eventCeremonyStartDate" autocomplete="off">
                                                        <div class="input-group-addon">
                                                            <i class="fa fa-calendar"></i>
                                                        </div>
                                                    </div>
                                                    <span class="inputError" id="eventCeremonyStartDateError"></span>
                                                </div>
                                            </div>
                                            <div class="col-xs-2">
                                                <label class="toNormal">Hora de inicio ceremonia</label>
                                                <div class="input-group bootstrap-timepicker timepicker">
                                                    <input type="text" class="form-control time" name="eventCeremonyStartTime" id="eventCeremonyStartTime" autocomplete="off">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-clock-o"></i>
                                                    </div>
                                                </div>
                                                <span class="inputError" id="eventCeremonyStartTimeError"></span>
                                            </div>
                                            <div class="col-xs-2">
                                                <div class="float-right">
                                                    <label class="toNormal">Fecha de fin ceremonia</label>
                                                    <div class="input-group date">
                                                        <input type="text" class="form-control datepicker" name="eventCeremonyEndDate" id="eventCeremonyEndDate" autocomplete="off">
                                                        <div class="input-group-addon">
                                                            <i class="fa fa-calendar"></i>
                                                        </div>
                                                    </div>
                                                    <span class="inputError" id="eventCeremonyEndDateError"></span>
                                                </div>
                                            </div>
                                            <div class="col-xs-2">
                                                <label class="toNormal">Hora de fin ceremonia</label>
                                                <div class="input-group bootstrap-timepicker timepicker">
                                                    <input type="text" class="form-control time" name="eventCeremonyEndTime" id="eventCeremonyEndTime" autocomplete="off">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-clock-o"></i>
                                                    </div>
                                                </div>
                                                <span class="inputError" id="eventCeremonyEndTimeError"></span>
                                            </div>
                                            <div class="col-xs-1">
                                                <br>
                                                <button type="button" class="btn btn-danger float-right" id="cleanEventCeremony">Vaciar evento</button>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Funeral</span></legend>
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <label class="toNormal">Lugar del funeral</label>
                                                <input type="text" class="form-control" name="eventFuneralPlace" id="eventFuneralPlace" autocomplete="off">
                                                <span class="inputError" id="eventFuneralPlaceError"></span>
                                            </div>
                                            <div class="col-xs-3">
                                                <label class="toNormal">Sala asignada</label>
                                                <select class="form-control tellmebye-room" name="eventFuneralRoom" id="eventFuneralRoom"></select>
                                                <span class="inputError" id="eventFuneralRoomError"></span>
                                            </div>
                                            <div class="col-xs-4">
                                                <label class="toNormal">Dirección del funeral</label>
                                                <input type="text" class="form-control" name="eventFuneralAddress" id="eventFuneralAddress" autocomplete="off">
                                                <span class="inputError" id="eventFuneralAddressError"></span>
                                            </div>
                                            <div class="col-xs-2">
                                                <label class="toNormal">Municipio</label>
                                                <input type="text" class="form-control" name="eventFuneralCity" id="eventFuneralCity" autocomplete="off">
                                                <span class="inputError" id="eventFuneralCityError"></span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <label class="toNormal">Cámara asignada</label>
                                                <select class="form-control tellmebye-camera" name="eventFuneralCamera" id="eventFuneralCamera"></select>
                                                <span class="inputError" id="eventFuneralCameraError"></span>
                                            </div>
                                            <div class="col-xs-2">
                                                <div class="float-right">
                                                    <label class="toNormal">Fecha de inicio funeral</label>
                                                    <div class="input-group date">
                                                        <input type="text" class="form-control datepicker" name="eventFuneralStartDate" id="eventFuneralStartDate" autocomplete="off">
                                                        <div class="input-group-addon">
                                                            <i class="fa fa-calendar"></i>
                                                        </div>
                                                    </div>
                                                    <span class="inputError" id="eventFuneralStartDateError"></span>
                                                </div>
                                            </div>
                                            <div class="col-xs-2">
                                                <label class="toNormal">Hora de inicio funeral</label>
                                                <div class="input-group bootstrap-timepicker timepicker">
                                                    <input type="text" class="form-control time" name="eventFuneralStartTime" id="eventFuneralStartTime" autocomplete="off">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-clock-o"></i>
                                                    </div>
                                                </div>
                                                <span class="inputError" id="eventFuneralStartTimeError"></span>
                                            </div>
                                            <div class="col-xs-2">
                                                <div class="float-right">
                                                    <label class="toNormal">Fecha de fin funeral</label>
                                                    <div class="input-group date">
                                                        <input type="text" class="form-control datepicker" name="eventFuneralEndDate" id="eventFuneralEndDate" autocomplete="off">
                                                        <div class="input-group-addon">
                                                            <i class="fa fa-calendar"></i>
                                                        </div>
                                                    </div>
                                                    <span class="inputError" id="eventFuneralEndDateError"></span>
                                                </div>
                                            </div>
                                            <div class="col-xs-2">
                                                <label class="toNormal">Hora de fin funeral</label>
                                                <div class="input-group bootstrap-timepicker timepicker">
                                                    <input type="text" class="form-control time" name="eventFuneralEndTime" id="eventFuneralEndTime" autocomplete="off">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-clock-o"></i>
                                                    </div>
                                                </div>
                                                <span class="inputError" id="eventFuneralEndTimeError"></span>
                                            </div>
                                            <div class="col-xs-1">
                                                <br>
                                                <button type="button" class="btn btn-danger float-right" id="cleanEventFuneral">Vaciar evento</button>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Cremación</span></legend>
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <label class="toNormal">Lugar de la cremación</label>
                                                <input type="text" class="form-control" name="eventCremationPlace" id="eventCremationPlace" autocomplete="off">
                                                <span class="inputError" id="eventCremationPlaceError"></span>
                                            </div>
                                            <div class="col-xs-3">
                                                <label class="toNormal">Sala asignada</label>
                                                <select class="form-control tellmebye-room" name="eventCremationRoom" id="eventCremationRoom"></select>
                                                <span class="inputError" id="eventCremationRoomError"></span>
                                            </div>
                                            <div class="col-xs-4">
                                                <label class="toNormal">Dirección del crematorio</label>
                                                <input type="text" class="form-control" name="eventCremationAddress" id="eventCremationAddress" autocomplete="off">
                                                <span class="inputError" id="eventCremationAddressError"></span>
                                            </div>
                                            <div class="col-xs-2">
                                                <label class="toNormal">Municipio</label>
                                                <input type="text" class="form-control" name="eventCremationCity" id="eventCremationCity" autocomplete="off">
                                                <span class="inputError" id="eventCremationCityError"></span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <label class="toNormal">Cámara asignada</label>
                                                <select class="form-control tellmebye-camera" name="eventCremationCamera" id="eventCremationCamera"></select>
                                                <span class="inputError" id="eventCremationCameraError"></span>
                                            </div>
                                            <div class="col-xs-2">
                                                <div class="float-right">
                                                    <label class="toNormal">Fecha de inicio cremación</label>
                                                    <div class="input-group date">
                                                        <input type="text" class="form-control datepicker" name="eventCremationStartDate" id="eventCremationStartDate" autocomplete="off">
                                                        <div class="input-group-addon">
                                                            <i class="fa fa-calendar"></i>
                                                        </div>
                                                    </div>
                                                    <span class="inputError" id="eventCremationStartDateError"></span>
                                                </div>
                                            </div>
                                            <div class="col-xs-2">
                                                <label class="toNormal">Hora de inicio cremación</label>
                                                <div class="input-group bootstrap-timepicker timepicker">
                                                    <input type="text" class="form-control time" name="eventCremationStartTime" id="eventCremationStartTime" autocomplete="off">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-clock-o"></i>
                                                    </div>
                                                </div>
                                                <span class="inputError" id="eventCremationStartTimeError"></span>
                                            </div>
                                            <div class="col-xs-2">
                                                <div class="float-right">
                                                    <label class="toNormal">Fecha de fin cremación</label>
                                                    <div class="input-group date">
                                                        <input type="text" class="form-control datepicker" name="eventCremationEndDate" id="eventCremationEndDate" autocomplete="off">
                                                        <div class="input-group-addon">
                                                            <i class="fa fa-calendar"></i>
                                                        </div>
                                                    </div>
                                                    <span class="inputError" id="eventCremationEndDateError"></span>
                                                </div>
                                            </div>
                                            <div class="col-xs-2">
                                                <label class="toNormal">Hora de fin cremación</label>
                                                <div class="input-group bootstrap-timepicker timepicker">
                                                    <input type="text" class="form-control time" name="eventCremationEndTime" id="eventCremationEndTime" autocomplete="off">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-clock-o"></i>
                                                    </div>
                                                </div>
                                                <span class="inputError" id="eventCremationEndTimeError"></span>
                                            </div>
                                            <div class="col-xs-1">
                                                <br>
                                                <button type="button" class="btn btn-danger float-right" id="cleanEventCremation">Vaciar evento</button>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Inhumación</span></legend>
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <label class="toNormal">Lugar de inhumación</label>
                                                <input type="text" class="form-control" name="eventBurialPlace" id="eventBurialPlace" autocomplete="off">
                                                <span class="inputError" id="eventBurialPlaceError"></span>
                                            </div>
                                            <div class="col-xs-3">
                                                <label class="toNormal">Sala asignada</label>
                                                <select class="form-control tellmebye-room" name="eventBurialRoom" id="eventBurialRoom"></select>
                                                <span class="inputError" id="eventBurialRoomError"></span>
                                            </div>
                                            <div class="col-xs-4">
                                                <label class="toNormal">Dirección de inhumación</label>
                                                <input type="text" class="form-control" name="eventBurialAddress" id="eventBurialAddress" autocomplete="off">
                                                <span class="inputError" id="eventBurialAddressError"></span>
                                            </div>
                                            <div class="col-xs-2">
                                                <label class="toNormal">Municipio</label>
                                                <input type="text" class="form-control" name="eventBurialCity" id="eventBurialCity" autocomplete="off">
                                                <span class="inputError" id="eventBurialCityError"></span>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <label class="toNormal">Cámara asignada</label>
                                                <select class="form-control tellmebye-camera" name="eventBurialCamera" id="eventBurialCamera"></select>
                                                <span class="inputError" id="eventBurialCameraError"></span>
                                            </div>
                                            <div class="col-xs-2">
                                                <div class="float-right">
                                                    <label class="toNormal">Fecha de inicio inhumación</label>
                                                    <div class="input-group date">
                                                        <input type="text" class="form-control datepicker" name="eventBurialStartDate" id="eventBurialStartDate" autocomplete="off">
                                                        <div class="input-group-addon">
                                                            <i class="fa fa-calendar"></i>
                                                        </div>
                                                    </div>
                                                    <span class="inputError" id="eventBurialStartDateError"></span>
                                                </div>
                                            </div>
                                            <div class="col-xs-2">
                                                <label class="toNormal">Hora de inicio inhumación</label>
                                                <div class="input-group bootstrap-timepicker timepicker">
                                                    <input type="text" class="form-control time" name="eventBurialStartTime" id="eventBurialStartTime" autocomplete="off">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-clock-o"></i>
                                                    </div>
                                                </div>
                                                <span class="inputError" id="eventBurialStartTimeError"></span>
                                            </div>
                                            <div class="col-xs-2">
                                                <div class="float-right">
                                                    <label class="toNormal">Fecha de fin inhumación</label>
                                                    <div class="input-group date">
                                                        <input type="text" class="form-control datepicker" name="eventBurialEndDate" id="eventBurialEndDate" autocomplete="off">
                                                        <div class="input-group-addon">
                                                            <i class="fa fa-calendar"></i>
                                                        </div>
                                                    </div>
                                                    <span class="inputError" id="eventBurialEndDateError"></span>
                                                </div>
                                            </div>
                                            <div class="col-xs-2">
                                                <label class="toNormal">Hora de fin inhumación</label>
                                                <div class="input-group bootstrap-timepicker timepicker">
                                                    <input type="text" class="form-control time" name="eventBurialEndTime" id="eventBurialEndTime" autocomplete="off">
                                                    <div class="input-group-addon">
                                                        <i class="fa fa-clock-o"></i>
                                                    </div>
                                                </div>
                                                <span class="inputError" id="eventBurialEndTimeError"></span>
                                            </div>
                                            <div class="col-xs-1">
                                                <br>
                                                <button type="button" class="btn btn-danger float-right" id="cleanEventBurial">Vaciar evento</button>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <div id="moreEvents"></div>
                                    <div class="row">
                                        <div class="col-xs-10">
                                            <hr>
                                        </div>
                                        <div class="col-xs-2">
                                            <button type="button" class="btn btn-primary float-right" id="addEvent">
                                                <i class="fa fa-arrow-down"></i>
                                                Añadir evento
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <!-- <div class="row">
                            <div class="col-xs-3"></div>
                            <div class="col-xs-6">
                                <div class="alert alert-warning text-center">
                                    <strong>¡¡¡OJO!!! CLIENTE CON ALTA EN LEGADOS</strong>
                                </div>
                            </div>
                            <div class="col-xs-3"></div>
                        </div> -->
                    </form>
				</section>
			</div>
			<div class="footer-static-bottom" style="left:50px;width: 1858px;">
				<div class="row">
					<div class="col-xs-12">
						<ul id="expedient-tabs" class="nav nav-tabs" role="tablist">
							<li role="presentation"><a href="<?php echo $utils->getRoute().'editar-expediente/'.$expedientID; ?>">EXPEDIENTE</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/contratacion/'.$expedientID; ?>">CONTRATACIÓN</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/esquela/'.$expedientID; ?>">ESQUELA</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/cservicio/'.$expedientID; ?>">C.SERVICIO</a></li>
							<?php if($_SESSION['tellmebye'] == '1'){ ?>
								<li role="presentation" class="active"><a style="cursor: pointer;" href="<?php echo $utils->getRoute().'expediente/tellmebye/'.$expedientID; ?>">TELLMEBYE</a></li>
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
		<script src="<?php echo $utils->getRoute(); ?>resources/js/expedient/tellmebye/functions.js?v=<?= CACHE_DATE ?>"></script>
	</body>
</html>