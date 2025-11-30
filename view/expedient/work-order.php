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
		<title><?php echo $utils->getCompanyName(); ?> | Orden de Trabajo</title>
		<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/all.css?v=<?= CACHE_DATE ?>">
		<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
	</head>
	<body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed page expedient-tellmebye">
        <?php require_once($_SESSION['basePath'] . "view/expedient/modal/work-order-modal.php"); ?>
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
						<li class="active">Orden de trabajo</li>
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
                    <div class="hide" id="existsExpedient">
						<div class="alert alert-warning alert-dismissible fade in" role="alert">
							<button type="button" class="close" data-dismiss="alert" aria-label="Close">
								<span aria-hidden="true">×</span>
							</button> 
							El expediente no existe. En breves, será enviado al listado de los expedientes
						</div>
					</div>
                    <div class="hide" id="changesWorkOrderSection">
						<div class="alert alert-warning alert-dismissible fade in" role="alert">
							<button type="button" class="close" data-dismiss="alert" aria-label="Close">
								<span aria-hidden="true">×</span>
							</button> 
							Se han realizado modificaciones en los campos de la orden de trabajo, de ser necesario vuelva a generar los documentos de la orden de trabajo.
					    </div>
					</div>
                    <div class="row">
						<div class="col-xs-12" style="padding-right: 15px; padding-left: 15px;">
							<div class="box">
								<div class="box-header">
									<div class="pull-left">
										<p class="lead box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Orden de Trabajo</p>						
									</div>
									<div class="pull-right"></div>
								</div>
								<div class="box-body">
									<div class="tab-content">
                                        <form class="form-horizontal" id="formData">
                                            <input type="hidden" id="expedientID" name="expedientID" value="<?php echo $expedientID; ?>">
                                            <fieldset>
                                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Expediente</span></legend>
                                                <div class="row">
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Referencia Interna</label>
                                                        <input type="text" class="form-control" name="internalRef" id="internalRef" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Número de expediente</label>
                                                        <input type="text" class="form-control" name="expedientNumber" id="expedientNumber" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset>
                                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Cliente</span></legend>
                                                <div class="row">
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Tipo de Cliente</label>
                                                        <input type="text" class="form-control" name="clientType" id="clientType" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-9">
                                                        <label class="toNormal">Cliente</label>
                                                        <input type="text" class="form-control" name="clientName" id="clientName" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-6">
                                                        <label class="toNormal">Tramitación</label>
                                                        <input type="text" class="form-control" name="familyAssistance" id="familyAssistance" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <label class="toNormal">Seguimiento</label>
                                                        <input type="text" class="form-control" name="clientTracing" id="clientTracing" autocomplete="off">
                                                        <span class="inputError" id="clientTracingError"></span>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset>
                                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Porteadores</span></legend>
                                                <div class="row">
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Porteador 1</label>
                                                        <input type="text" class="form-control" name="driver1" id="driver1" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Vehículo 1</label>
                                                        <input type="text" class="form-control" name="vehicle1" id="vehicle1" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Porteador 2</label>
                                                        <input type="text" class="form-control" name="driver2" id="driver2" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Vehículo 2</label>
                                                        <input type="text" class="form-control" name="vehicle2" id="vehicle2" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Porteador 3</label>
                                                        <input type="text" class="form-control" name="driver3" id="driver3" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Vehículo 3</label>
                                                        <input type="text" class="form-control" name="vehicle3" id="vehicle3" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Porteador 4</label>
                                                        <input type="text" class="form-control" name="driver4" id="driver4" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Vehículo 4</label>
                                                        <input type="text" class="form-control" name="vehicle4" id="vehicle4" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Porteador 5</label>
                                                        <input type="text" class="form-control" name="driver5" id="driver5" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Vehículo 5</label>
                                                        <input type="text" class="form-control" name="vehicle5" id="vehicle5" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Sala</label>
                                                        <input type="text" class="form-control" name="carrierRoom" id="carrierRoom" autocomplete="off">
                                                        <span class="inputError" id="carrierRoomError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha y hora</label>
                                                        <input type="text" class="form-control" name="funeralDate" id="funeralDate" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset>
                                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Fallecido</span></legend>
                                                <div class="row">
                                                    <div class="col-xs-8">
                                                        <label class="toNormal">Fallecido</label>
                                                        <input type="text" class="form-control" name="deceasedName" id="deceasedName" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">DNI</label>
                                                        <input type="text" class="form-control" name="deceasedNif" id="deceasedNif" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Edad</label>
                                                        <input type="text" class="form-control" name="deceasedAge" id="deceasedAge" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha fallecimiento</label>
                                                        <input type="text" class="form-control" name="deceasedDate" id="deceasedDate" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Hora fallecimiento</label>
                                                        <input type="text" class="form-control" name="deceasedHour" id="deceasedHour" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Lugar fallecimiento</label>
                                                        <input type="text" class="form-control" name="deceasedIn" id="deceasedIn" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Causa</label>
                                                        <input type="text" class="form-control" name="deceasedCause" id="deceasedCause" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-1" style="margin-top: 15px;">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="judicial" name="judicial" class="minimal mortuaryReg" disabled> <span class="bolder">Judicial</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-6">
                                                        <label class="toNormal">Declarante</label>
                                                        <input type="text" class="form-control" name="familyContactName" id="familyContactName" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Parentesco</label>
                                                        <input type="text" class="form-control" name="familyContactRelationship" id="familyContactRelationship" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Teléfono</label>
                                                        <input type="text" class="form-control" name="familyContactPhone" id="familyContactPhone" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset>
                                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Arca</span></legend>
                                                <div class="row">
                                                    <div class="col-xs-8">
                                                        <label class="toNormal">Modelo Arca</label>
                                                        <input type="text" class="form-control" name="arkName" id="arkName" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2" style="margin-top: 15px;display:flex; align-items:center; justify-content:center">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="arkCross" name="arkCross" class="minimal mortuaryReg"> <span class="bolder">Cruz</span>
                                                        </label>
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="arkJesus" name="arkJesus" class="minimal mortuaryReg"> <span class="bolder">Cristo</span>
                                                        </label>
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="arkOther" name="arkOther" class="minimal mortuaryReg"> <span class="bolder">Otro</span>
                                                        </label>
                                                    </div>
                                                    <div id="arkOtherNameSection" class="col-xs-2">
                                                        <label class="toNormal">Otro</label>
                                                        <input type="text" class="form-control" name="arkOtherName" id="arkOtherName" autocomplete="off" readonly>
                                                        <span class="inputError" id="arkOtherNameError"></span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-8">
                                                        <label class="toNormal">Tanatoestética</label>
                                                        <input type="text" class="form-control" name="arkAesthetics" id="arkAesthetics" autocomplete="off">
                                                        <span class="inputError" id="arkAestheticsError"></span>
                                                    </div>
                                                    <div class="col-xs-2" style="margin-top: 15px;display:flex; align-items:center; justify-content:center">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="arkClothesPhoto" name="arkClothesPhoto" class="minimal mortuaryReg"> <span class="bolder">Foto</span>
                                                        </label>
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="arkClothesRosary" name="arkClothesRosary" class="minimal mortuaryReg"> <span class="bolder">Rosario</span>
                                                        </label>
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="arkClothesOwn" name="arkClothesOwn" class="minimal mortuaryReg"> <span class="bolder">Propio</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-8">
                                                        <label class="toNormal">Ropa</label>
                                                        <input type="text" class="form-control" name="arkClothes" id="arkClothes" autocomplete="off">
                                                        <span class="inputError" id="arkClothesError"></span>
                                                    </div>
                                                    <div class="col-xs-1" style="margin-top: 20px;text-align:center">
                                                        <span class="toNormal">Desechar ropa:</span>
                                                    </div>
                                                    <div class="col-xs-1" style="margin-top: 15px;display:flex; align-items:center; justify-content:center">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="arkClothesYes" name="arkClothesYes" class="minimal mortuaryReg"> <span class="bolder">Sí</span>
                                                        </label>
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="arkClothesNo" name="arkClothesNo" class="minimal mortuaryReg"> <span class="bolder">No</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-8">
                                                        <label class="toNormal">Objetos personales</label>
                                                        <input type="text" class="form-control" name="arkPersonalItems" id="arkPersonalItems" autocomplete="off">
                                                        <span class="inputError" id="arkPersonalItemsError"></span>
                                                    </div>
                                                    <div class="col-xs-2" style="margin-top: 15px;display:flex; align-items:center; justify-content:center">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="arkPersonalItemsPacemaker" name="arkPersonalItemsPacemaker" class="minimal mortuaryReg"> <span class="bolder">Marcapasos</span>
                                                        </label>
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="arkPersonalItemsShroud" name="arkPersonalItemsShroud" class="minimal mortuaryReg"> <span class="bolder">Manto/Sudario</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-1" style="margin-top: 15px;display:flex; align-items:center; justify-content:center">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="arkThanatoplasty" name="arkThanatoplasty" class="minimal mortuaryReg"> <span class="bolder">Tanatoplastia</span>
                                                            <span class="inputError" id="arkThanatoplastyError"></span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha Tanatoplastia</label>
                                                        <div class="input-group date">
                                                            <input type="text" class="form-control datepicker" name="arkThanatoplastyDate" id="arkThanatoplastyDate" size="30" autocomplete="off" disabled>
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="arkThanatoplastyDateError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Hora Tanatoplastia</label>
                                                        <div class="input-group bootstrap-timepicker timepicker">
                                                            <input type="text" class="form-control time" name="arkThanatoplastyTime" id="arkThanatoplastyTime" autocomplete="off" disabled>
                                                            <div class="input-group-addon">
                                                                <i class="cursor-pointer fa fa-clock-o"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="arkThanatoplastyTimeError"></span>
                                                    </div>
                                                    <div class="col-xs-1"></div>
                                                    <div class="col-xs-1" style="margin-top: 15px;display:flex; align-items:center; justify-content:center">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="arkThanatopraxy" name="arkThanatopraxy" class="minimal mortuaryReg"> <span class="bolder">Tanatopraxia</span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha Tanatopraxia</label>
                                                        <div class="input-group date">
                                                            <input type="text" class="form-control datepicker" name="arkThanatopraxyDate" id="arkThanatopraxyDate" size="30" autocomplete="off" disabled>
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="arkThanatopraxyDateError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Hora Tanatopraxia</label>
                                                        <div class="input-group bootstrap-timepicker timepicker">
                                                            <input type="text" class="form-control time" name="arkThanatopraxyTime" id="arkThanatopraxyTime" autocomplete="off" disabled>
                                                            <div class="input-group-addon">
                                                                <i class="cursor-pointer fa fa-clock-o"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="arkThanatopraxyTimeError"></span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-1" style="margin-top: 15px;display:flex; align-items:center; justify-content:center">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="arkCTransient" name="arkCTransient" class="minimal mortuaryReg"> <span class="bolder">C. Transitoria</span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha C. Transitoria</label>
                                                        <div class="input-group date">
                                                            <input type="text" class="form-control datepicker" name="arkCTransientDate" id="arkCTransientDate" size="30" autocomplete="off" disabled>
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="arkCTransientDateError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Hora C. Transitoria</label>
                                                        <div class="input-group bootstrap-timepicker timepicker">
                                                            <input type="text" class="form-control time" name="arkCTransientTime" id="arkCTransientTime" autocomplete="off" disabled>
                                                            <div class="input-group-addon">
                                                                <i class="cursor-pointer fa fa-clock-o"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="arkCTransientTimeError"></span>
                                                    </div>
                                                    <div class="col-xs-1"> </div>
                                                    <div class="col-xs-1" style="margin-top: 15px;display:flex; align-items:center; justify-content:center">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="arkEmbalmment" name="arkEmbalmment" class="minimal mortuaryReg"> <span class="bolder">Embalsamamiento</span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha Embalsamamiento</label>
                                                        <div class="input-group date">
                                                            <input type="text" class="form-control datepicker" name="arkEmbalmmentDate" id="arkEmbalmmentDate" size="30" autocomplete="off" disabled>
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="arkEmbalmmentDateError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Hora Embalsamamiento</label>
                                                        <div class="input-group bootstrap-timepicker timepicker">
                                                            <input type="text" class="form-control time" name="arkEmbalmmentTime" id="arkEmbalmmentTime" autocomplete="off" disabled>
                                                            <div class="input-group-addon">
                                                                <i class="cursor-pointer fa fa-clock-o"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="arkEmbalmmentTimeError"></span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-9">
                                                        <label class="toNormal">Tanatopractor</label>
                                                        <input type="text" class="form-control" name="arkMortuaryPractitioner" id="arkMortuaryPractitioner" autocomplete="off">
                                                        <span class="inputError" id="arkMortuaryPractitionerError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">DNI</label>
                                                        <input type="text" class="form-control" name="arkMortuaryPractitionerNif" id="arkMortuaryPractitionerNif" style="width:65%!important" autocomplete="off">
                                                        <span class="inputError" id="arkMortuaryPractitionerNifError"></span>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset>
                                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Velación</span></legend>
                                                <div class="row">
                                                    <div class="col-xs-10">
                                                        <label class="toNormal">Lugar velación</label>
                                                        <input type="text" class="form-control" name="deceasedMortuary" id="deceasedMortuary" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Sala</label>
                                                        <input type="text" class="form-control" name="deceasedRoom" id="deceasedRoom" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha Inicio V1</label>
                                                        <input type="text" class="form-control" name="startVelacionDate1" id="startVelacionDate1" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-1">
                                                        <label class="toNormal">Hora Inicio V1</label>
                                                        <input type="text" class="form-control" name="startVelacionTime1" id="startVelacionTime1" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha Fin V1</label>
                                                        <input type="text" class="form-control" name="endVelacionDate1" id="endVelacionDate1" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-1">
                                                        <label class="toNormal">Hora Fin V1</label>
                                                        <input type="text" class="form-control" name="endVelacionTime1" id="endVelacionTime1" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha Inicio V2</label>
                                                        <input type="text" class="form-control" name="startVelacionDate2" id="startVelacionDate2" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-1">
                                                        <label class="toNormal">Hora Inicio V2</label>
                                                        <input type="text" class="form-control" name="startVelacionTime2" id="startVelacionTime2" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha Fin V2</label>
                                                        <input type="text" class="form-control" name="endVelacionDate2" id="endVelacionDate2" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-1">
                                                        <label class="toNormal">Hora Fin V2</label>
                                                        <input type="text" class="form-control" name="endVelacionTime2" id="endVelacionTime2" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-12" style="margin-top: 15px;">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="velationCatering" name="velationCatering" class="minimal mortuaryReg"> <span class="bolder">Catering</span>
                                                        </label>
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="velationMemoriesScreen" name="velationMemoriesScreen" class="minimal mortuaryReg"> <span class="bolder">Pantalla recuerdos</span>
                                                        </label>
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="velationPrivate" name="velationPrivate" class="minimal mortuaryReg"> <span class="bolder">Velación privada</span>
                                                        </label>
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="velationArkClosed" name="velationArkClosed" class="minimal mortuaryReg"> <span class="bolder">Arca cerrada</span>
                                                        </label>
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="velationPhotoFrame" name="velationPhotoFrame" class="minimal mortuaryReg"> <span class="bolder">Marco de fotos</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset>
                                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Ceremonia</span></legend>
                                                <div class="row">
                                                    <div class="col-xs-8">
                                                        <label class="toNormal">Lugar ceremonia</label>
                                                        <input type="text" class="form-control" name="church" id="church" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha ceremonia</label>
                                                        <input type="text" class="form-control" name="ceremonyDate" id="ceremonyDate" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Hora ceremonia</label>
                                                        <input type="text" class="form-control" name="ceremonyTime" id="ceremonyTime" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-1" style="margin-top: 15px;">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="ceremonyResponse" name="ceremonyResponse" class="minimal mortuaryReg"> <span class="bolder">Responso</span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Lugar responso</label>
                                                        <input type="text" class="form-control" name="ceremonyResponsePlace" id="ceremonyResponsePlace" autocomplete="off">
                                                        <span class="inputError" id="ceremonyResponsePlaceError"></span>
                                                    </div>
                                                    <div class="col-xs-2" style="margin-top: 15px;display:flex; align-items:center; justify-content:center">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="ceremonyFamilyWaitChurch" name="ceremonyFamilyWaitChurch" class="minimal mortuaryReg"> <span class="bolder">Familia espera en Iglesia</span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Servicio musical</label>
                                                        <input type="text" class="form-control" name="ceremonyMusicalService" id="ceremonyMusicalService" autocomplete="off">
                                                        <span class="inputError" id="ceremonyMusicalServiceError"></span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-1" style="margin-top: 15px;">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="ceremonyBodyPresent" name="ceremonyBodyPresent" class="minimal mortuaryReg"> <span class="bolder">Cuerpo presente</span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-1" style="margin-top: 15px;">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="ceremonyUrn" name="ceremonyUrn" class="minimal mortuaryReg"> <span class="bolder">Urna</span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Quien lleva la urna</label>
                                                        <input type="text" class="form-control" name="ceremonyWhoTakesUrn" id="ceremonyWhoTakesUrn" autocomplete="off">
                                                        <span class="inputError" id="ceremonyWhoTakesUrnError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Pago Iglesia</label>
                                                        <div class="input-group">
                                                            <input type="text" class="form-control" name="ceremonyChurchPayment" id="ceremonyChurchPayment" autocomplete="off">
                                                            <div class="input-group-addon">
                                                                €
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="ceremonyChurchPaymentError"></span>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset>
                                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Crematorio</span></legend>
                                                <div class="row">
                                                    <div class="col-xs-8">
                                                        <label class="toNormal">Crematorio</label>
                                                        <input type="text" class="form-control" name="crematorium" id="crematorium" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha inicio</label>
                                                        <input type="text" class="form-control" name="crematoriumEntryDate" id="crematoriumEntryDate" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Hora inicio</label>
                                                        <input type="text" class="form-control" name="crematoriumEntryTime" id="crematoriumEntryTime" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha fin</label>
                                                        <input type="text" class="form-control" name="crematoriumLeavingDate" id="crematoriumLeavingDate" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Hora fin</label>
                                                        <input type="text" class="form-control" name="crematoriumLeavingTime" id="crematoriumLeavingTime" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha recogida de cenizas</label>
                                                        <div class="input-group date">
                                                            <input type="text" class="form-control datepicker" name="crematoryCollectingAshesDate" id="crematoryCollectingAshesDate" size="100" autocomplete="off">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="crematoryCollectingAshesDateError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Hora recogida de cenizas</label>
                                                        <div class="input-group bootstrap-timepicker timepicker">
                                                            <input type="text" class="form-control time" name="crematoryCollectingAshesTime" id="crematoryCollectingAshesTime" size="100" autocomplete="off">
                                                            <div class="input-group-addon">
                                                                <i class="cursor-pointer fa fa-clock-o"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="crematoryCollectingAshesTimeError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Id. Trazabilidad</label>
                                                        <input type="text" class="form-control" name="trazabilityId" id="trazabilityId" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Técnico</label>
                                                        <input type="text" class="form-control" name="crematoriumTechnical" id="crematoriumTechnical" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Persona de contacto</label>
                                                        <input type="text" class="form-control" name="crematoriumContactPerson" id="crematoriumContactPerson" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Teléfono de contacto</label>
                                                        <input type="text" class="form-control" name="crematoriumContactPhonePerson" id="crematoriumContactPhonePerson" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-2" style="margin-top: 15px;">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="crematoriumIntroduction" name="crematoriumIntroduction" class="minimal mortuaryReg" disabled> <span class="bolder">Asiste Familia Introducción</span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Hora de llegada de la Familia</label>
                                                        <input type="text" class="form-control" name="crematoriumArriveTime" id="crematoriumArriveTime" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-1" style="margin-top: 15px;">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="crematoriumWaitOnRoom" name="crematoriumWaitOnRoom" class="minimal mortuaryReg" disabled> <span class="bolder">Espera en sala</span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-1">
                                                        <label class="toNormal">Urna</label>
                                                        <input type="text" class="form-control" name="crematoryUrn" id="crematoryUrn" autocomplete="off">
                                                        <span class="inputError" id="crematoryUrnError"></span>
                                                    </div>
                                                    <div class="col-xs-1" style="margin-top: 15px;">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="crematoriumVaseBio" name="crematoriumVaseBio" class="minimal mortuaryReg" disabled> <span class="bolder">BIO</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Entregar cenizas a</label>
                                                        <input type="text" class="form-control" name="authName" id="authName" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">DNI</label>
                                                        <input type="text" class="form-control" name="authDni" id="authDni" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Teléfono</label>
                                                        <input type="text" class="form-control" name="authContactPhone" id="authContactPhone" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Fecha de entrega</label>
                                                        <input type="text" class="form-control" name="authDate" id="authDate" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Hora de entrega</label>
                                                        <input type="text" class="form-control" name="authTime" id="authTime" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Lugar</label>
                                                        <input type="text" class="form-control" name="authPlace" id="authPlace" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <label class="toNormal">Observaciones</label>
                                                        <textarea class="form-control" rows="3" cols="100" id="crematoryNotes" name="crematoryNotes"></textarea>
                                                        <span class="inputError" id="crematoryNotesError"></span>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset>
                                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Inhumación</span></legend>
                                                <div class="row">
                                                    <div class="col-xs-8">
                                                        <label class="toNormal">Lugar inhumación</label>
                                                        <input type="text" class="form-control" name="cemetery" id="cemetery" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha inhumación</label>
                                                        <input type="text" class="form-control" name="funeralDateBurial" id="funeralDateBurial" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Hora inhumación</label>
                                                        <input type="text" class="form-control" name="funeralTimeBurial" id="funeralTimeBurial" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Unidad de enterramiento</label>
                                                        <input type="text" class="form-control" name="niche" id="niche" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Régimen</label>
                                                        <input type="text" class="form-control" name="regime" id="regime" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Número</label>
                                                        <input type="text" class="form-control" name="funeralNicheNumber" id="funeralNicheNumber" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Calle</label>
                                                        <input type="text" class="form-control" name="inhumationStreet" id="inhumationStreet" autocomplete="off">
                                                        <span class="inputError" id="inhumationStreetError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Bloque</label>
                                                        <input type="text" class="form-control" name="inhumationBlock" id="inhumationBlock" autocomplete="off">
                                                        <span class="inputError" id="inhumationBlockError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Altura</label>
                                                        <input type="text" class="form-control" name="nicheHeight" id="nicheHeight" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-1" style="margin-top: 15px;">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="inhumationAttendOpening" name="inhumationAttendOpening" class="minimal mortuaryReg"> <span class="bolder">Asiste apertura</span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Declarante/Otro</label>
                                                        <input type="text" class="form-control" name="inhumationDeclarant" id="inhumationDeclarant" autocomplete="off">
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Teléfono</label>
                                                        <input type="text" class="form-control" name="inhumationDeclarantPhone" id="inhumationDeclarantPhone" autocomplete="off">
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha</label>
                                                        <div class="input-group date">
                                                            <input type="text" class="form-control datepicker" name="inhumationDeclarantDate" id="inhumationDeclarantDate" size="200" autocomplete="off">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="inhumationDeclarantDateError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Hora</label>
                                                        <div class="input-group bootstrap-timepicker timepicker">
                                                            <input type="text" class="form-control time" name="inhumationDeclarantTime" id="inhumationDeclarantTime" size="200" autocomplete="off">
                                                            <div class="input-group-addon">
                                                                <i class="cursor-pointer fa fa-clock-o"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="inhumationDeclarantTimeError"></span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-2" style="margin-top: 20px;">
                                                        <span class="toNormal">Complementos Undidad de Enterramiento:</span>
                                                    </div>
                                                    <div class="col-xs-1" style="margin-top: 15px;">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="inhumationIronCross" name="inhumationIronCross" class="minimal mortuaryReg"> <span class="bolder"> Cruz de Hierro</span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Otro</label>
                                                        <input type="text" class="form-control" name="inhumationIronCrossOther" id="inhumationIronCrossOther" autocomplete="off">
                                                        <span class="inputError" id="inhumationIronCrossOtherError"></span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Exhumación 1</label>
                                                        <input type="text" class="form-control" name="exhumation1" id="exhumation1" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fallecido el</label>
                                                        <input type="text" class="form-control" name="exhumationDate1" id="exhumationDate1" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-1" style="margin-top: 15px;display:flex; align-items:center; justify-content:center">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="inhumationReburial1" name="inhumationReburial1" class="minimal mortuaryReg"> <span class="bolder">Reinhumar</span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Nota</label>
                                                        <input type="text" class="form-control" name="inhumationNotes1" id="inhumationNotes1" autocomplete="off">
                                                        <span class="inputError" id="inhumationNotes1Error"></span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Exhumación 2</label>
                                                        <input type="text" class="form-control" name="exhumation2" id="exhumation2" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fallecido el</label>
                                                        <input type="text" class="form-control" name="exhumationDate2" id="exhumationDate2" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-1" style="margin-top: 15px;display:flex; align-items:center; justify-content:center">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="inhumationReburial2" name="inhumationReburial2" class="minimal mortuaryReg"> <span class="bolder">Reinhumar</span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Nota</label>
                                                        <input type="text" class="form-control" name="inhumationNotes2" id="inhumationNotes2" autocomplete="off">
                                                        <span class="inputError" id="inhumationNotes2Error"></span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Exhumación 3</label>
                                                        <input type="text" class="form-control" name="exhumation3" id="exhumation3" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fallecido el</label>
                                                        <input type="text" class="form-control" name="exhumationDate3" id="exhumationDate3" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-1" style="margin-top: 15px;display:flex; align-items:center; justify-content:center">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="inhumationReburial3" name="inhumationReburial3" class="minimal mortuaryReg"> <span class="bolder">Reinhumar</span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Nota</label>
                                                        <input type="text" class="form-control" name="inhumationNotes3" id="inhumationNotes3" autocomplete="off">
                                                        <span class="inputError" id="inhumationNotes3Error"></span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Titular de la Propiedad</label>
                                                        <input type="text" class="form-control" name="exhumation" id="exhumation" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-1" style="margin-top: 15px;display:flex; align-items:center; justify-content:center">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="inhumationRemoveTombstone" name="inhumationRemoveTombstone" class="minimal mortuaryReg"> <span class="bolder">Retirar Lápida</span>
                                                        </label>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Nota</label>
                                                        <input type="text" class="form-control" name="inhumationRemoveTombstoneNote" id="inhumationRemoveTombstoneNote" autocomplete="off">
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <label class="toNormal">Observaciones</label>
                                                        <textarea class="form-control" rows="3" cols="100" id="inhumationNotes" name="inhumationNotes"></textarea>
                                                        <span class="inputError" id="inhumationNotesError"></span>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset>
                                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Traslado</span></legend>
                                                <div class="row">
                                                    <div class="col-xs-10">
                                                        <label class="toNormal">Funeraria de destino</label>
                                                        <input type="text" class="form-control" name="moveFuneralHome" id="moveFuneralHome" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Teléfono</label>
                                                        <input type="text" class="form-control" name="moveFuneralHomePhone" id="moveFuneralHomePhone" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-5">
                                                        <label class="toNormal">Persona de contacto</label>
                                                        <input type="text" class="form-control" name="moveContactPerson" id="moveContactPerson" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-5">
                                                        <label class="toNormal">Email</label>
                                                        <input type="text" class="form-control" name="translationMoveContactEmail" id="translationMoveContactEmail" autocomplete="off">
                                                        <span class="inputError" id="translationMoveContactEmailError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Teléfono</label>
                                                        <input type="text" class="form-control" name="moveContactPhone" id="moveContactPhone" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-4">
                                                        <label class="toNormal">Provincia Origen</label>
                                                        <input type="text" class="form-control" name="moveCollectionProvince" id="moveCollectionProvince" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-4">
                                                        <label class="toNormal">Localidad</label>
                                                        <input type="text" class="form-control" name="moveCollectionLocality" id="moveCollectionLocality" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-4">
                                                        <label class="toNormal">Teléfono</label>
                                                        <input type="text" class="form-control" name="moveCollectionAddress" id="moveCollectionAddress" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-6">
                                                        <label class="toNormal">Pais de destino</label>
                                                        <input type="text" class="form-control" name="translationMoveDestinationCountry" id="translationMoveDestinationCountry" autocomplete="off">
                                                        <span class="inputError" id="translationMoveDestinationCountryError"></span>
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <label class="toNormal">Dirección</label>
                                                        <input type="text" class="form-control" name="moveDestinationAddress" id="moveDestinationAddress" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-6">
                                                        <label class="toNormal">Depósito Aeropuerto</label>
                                                        <input type="text" class="form-control" name="translationDepositAirport" id="translationDepositAirport" autocomplete="off">
                                                        <span class="inputError" id="translationDepositAirportError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Fecha Entrega Depósito</label>
                                                        <div class="input-group date">
                                                            <input type="text" class="form-control datepicker" name="translationDepositDate" id="translationDepositDate" size="100" autocomplete="off">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="translationDepositDateError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Hora Entrega Depósito</label>
                                                        <div class="input-group bootstrap-timepicker timepicker">
                                                            <input type="text" class="form-control time" name="translationDepositTime" id="translationDepositTime" size="100" autocomplete="off">
                                                            <div class="input-group-addon">
                                                                <i class="cursor-pointer fa fa-clock-o"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="translationDepositTimeError"></span>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Peso</label>
                                                        <div class="input-group">
                                                            <input type="text" class="form-control" name="translationDepositWeight" id="translationDepositWeight" size="100" autocomplete="off">
                                                            <div class="input-group-addon">
                                                                kg
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="translationDepositWeightError"></span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="moveViaRoad" name="moveViaRoad" class="minimal mortuaryReg" disabled> <span class="bolder">Vía Terrestre</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-4">
                                                        <label class="toNormal">Vehículo de Traslado</label>
                                                        <input type="text" class="form-control" name="roadCarCollection2" id="roadCarCollection2" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-4">
                                                        <label class="toNormal">Personal de Traslado 1</label>
                                                        <input type="text" class="form-control" name="roadStaffTransfer1" id="roadStaffTransfer1" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-4">
                                                        <label class="toNormal">Personal de Traslado 2</label>
                                                        <input type="text" class="form-control" name="roadStaffTransfer2" id="roadStaffTransfer2" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Fecha de Salida</label>
                                                        <input type="text" class="form-control" name="translationRoadLeavingDate" id="translationRoadLeavingDate" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Hora de Salida</label>
                                                        <input type="text" class="form-control" name="translationRoadLeavingTime" id="translationRoadLeavingTime" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Fecha de Llegada</label>
                                                        <input type="text" class="form-control" name="translationRoadArrivalDate" id="translationRoadArrivalDate" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Hora de Llegada</label>
                                                        <input type="text" class="form-control" name="translationRoadArrivalTime" id="translationRoadArrivalTime" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="moveViaAir" name="moveViaAir" class="minimal mortuaryReg" disabled> <span class="bolder">Vía Aérea</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-5">
                                                        <label class="toNormal">Agencia/Consignataria</label>
                                                        <input type="text" class="form-control" name="agency" id="agency" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-5">
                                                        <label class="toNormal">Persona de Contacto</label>
                                                        <input type="text" class="form-control" name="agencyContact" id="agencyContact" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Teléfono</label>
                                                        <input type="text" class="form-control" name="agencyContactPhone" id="agencyContactPhone" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-4">
                                                        <label class="toNormal">Vehículo de Traslado</label>
                                                        <input type="text" class="form-control" name="airCarCollection2" id="airCarCollection2" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-4">
                                                        <label class="toNormal">Personal de Traslado 1</label>
                                                        <input type="text" class="form-control" name="airStaffTransfer1" id="airStaffTransfer1" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-4">
                                                        <label class="toNormal">Personal de Traslado 2</label>
                                                        <input type="text" class="form-control" name="airStaffTransfer2" id="airStaffTransfer2" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-4">
                                                        <label class="toNormal">Responsable Precintado, Embalado</label>
                                                        <select id="translationResponsibleSealed" name="translationResponsibleSealed" class="form-control staff-collection select2"></select>
                                                        <span class="inputError" id="translationResponsibleSealedError"></span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-4">
                                                        <label class="toNormal">Aeropuerto Origen</label>
                                                        <input type="text" class="form-control" name="airportOrigin" id="airportOrigin" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-4">
                                                        <label class="toNormal">Aeropuerto Destino</label>
                                                        <input type="text" class="form-control" name="arrivalAirport" id="arrivalAirport" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">Núm. de Vuelo</label>
                                                        <input type="text" class="form-control" name="flightNumber" id="flightNumber" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <label class="toNormal">LTA</label>
                                                        <input type="text" class="form-control" name="translationLTA" id="translationLTA" autocomplete="off">
                                                        <span class="inputError" id="translationLTAError"></span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Fecha de Salida Vuelo</label>
                                                        <input type="text" class="form-control" name="departureDate" id="departureDate" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Hora de Salida Vuelo</label>
                                                        <input type="text" class="form-control" name="departureTime" id="departureTime" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Fecha de Salida Vuelo</label>
                                                        <input type="text" class="form-control" name="arrivalDate" id="arrivalDate" autocomplete="off" readonly>
                                                    </div>
                                                    <div class="col-xs-3">
                                                        <label class="toNormal">Hora de Salida Vuelo</label>
                                                        <input type="text" class="form-control" name="arrivalTime" id="arrivalTime" autocomplete="off" readonly>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <label class="toNormal">Notas</label>
                                                        <textarea class="form-control" rows="3" cols="100" id="translationNotes" name="translationNotes"></textarea>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset id="comunicationSection">
                                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Comunicación</span></legend>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="webConfirm" name="webConfirm" class="minimal mortuaryReg" disabled> <span class="bolder">Esquela Web</span>
                                                        </label>
                                                        <label class="checkbox-inline <?= ($_SESSION['company'] == '3' ? '' : 'hide') ?>">
                                                            <input type="checkbox" id="noShop" name="noShop" class="minimal mortuaryReg" disabled> <span class="bolder">NO Tienda</span>
                                                        </label>
                                                        <label class="checkbox-inline <?= ($_SESSION['company'] == '3' ? '' : 'hide') ?>">
                                                            <input type="checkbox" id="noCondolences" name="noCondolences" class="minimal mortuaryReg" disabled> <span class="bolder">NO Pésames</span>
                                                        </label>
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="showAgeObituaryWeb" name="showAgeObituaryWeb" class="minimal mortuaryReg" disabled> <span class="bolder">No mostrar edad</span>
                                                        </label>
                                                        <label class="checkbox-inline <?= ($_SESSION['company'] == '3' || $_SESSION['company'] == '11'  ? '' : 'hide') ?>">
                                                            <input type="checkbox" id="showFinalDestinationWeb" name="showFinalDestinationWeb" class="minimal mortuaryReg" disabled> <span class="bolder">NO Destino Final</span>
                                                        </label>
                                                        <label class="checkbox-inline <?= ($_SESSION['company'] == '3' || $_SESSION['company'] == '11'  ? '' : 'hide') ?>">
                                                            <input type="checkbox" id="showVelationWeb" name="showVelationWeb" class="minimal mortuaryReg" disabled> <span class="bolder">NO Velación</span>
                                                        </label>
                                                        <label class="checkbox-inline <?= ($_SESSION['company'] == '3' || $_SESSION['company'] == '11'  ? '' : 'hide') ?>">
                                                            <input type="checkbox" id="showCeremonyWeb" name="showCeremonyWeb" class="minimal mortuaryReg" disabled> <span class="bolder">NO Ceremonia</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset id="flowersSection">
                                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Arreglos Florales</span></legend>
                                            </fieldset>
                                            <fieldset>
                                                <legend class="toBold fsExp"><span class="label label-primary labelLgExp">Notas</span></legend>
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <textarea class="form-control" rows="10" cols="100" id="notes" name="notes"></textarea>
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
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'editar-expediente/'.$expedientID; ?>">EXPEDIENTE</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/contratacion/'.$expedientID; ?>">CONTRATACIÓN</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/esquela/'.$expedientID; ?>">ESQUELA</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/cservicio/'.$expedientID; ?>">C.SERVICIO</a></li>
							<?php if($_SESSION['tellmebye'] == '1'){ ?>
								<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/tellmebye/'.$expedientID; ?>">TELLMEBYE</a></li>
							<?php } ?>
                            <li role="presentation" class="active"><a>ORDEN DE TRABAJO</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/documentacion/'.$expedientID; ?>">DOCUMENTACIÓN</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/documentos/'.$expedientID; ?>">DOCUMENTACIÓN PERSONALIZADA</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/logs/'.$expedientID; ?>">LOGS</a></li>
							<li role="presentation"><a id="goToAssistance" class="changeTab">ASISTENCIA</a></li>
							<li class="deceasedData">Nº <span class="bolder numberExp"></span><span id="deceased"></span></li>
							<li class="hide" id="associatedData" style="margin-top: 10px;"><span style="margin-left: 35px;">Asociado al expediente: </span><span class="bolder" id="associateNav"></span></li>
							<li class="hide" id="numberInvoiceData" style="margin-top: 10px;"><span style="margin-left: 35px;">Factura: </span><span class="bolder" id="numberInvoiceNav"></span></li>
                            <li class="pull-right">
                                <div class="btn-group dropup">
                                    <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        ACCIONES <span class="caret"></span>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-right">
                                        <li id="liShowOTDocs" class="hide"><a id="viewOTs"><i class="fa fa-file-text-o" aria-hidden="true"></i>Ver órdenes de trabajo</a></li>
                                        <li id="liSeparatorOT" role="separator" class="hide divider"></li>
                                        <li><a class="generate-ot-doc" type="1"><i class="fa fa-file-text-o" aria-hidden="true"></i>Inhumación</a></li>
                                        <li><a class="generate-ot-doc" type="2"><i class="fa fa-file-text-o" aria-hidden="true"></i>Cremación</a></li>
                                        <li><a class="generate-ot-doc" type="3"><i class="fa fa-file-text-o" aria-hidden="true"></i>Cremación + Inhumación</a></li>
                                        <li><a class="generate-ot-doc" type="4"><i class="fa fa-file-text-o" aria-hidden="true"></i>Traslado</a></li>
                                        <li><a class="generate-ot-doc" type="5"><i class="fa fa-file-text-o" aria-hidden="true"></i>Traslado + Velación</a></li>
                                    </ul>
                                </div>
                            </li>
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
		<script src="<?php echo $utils->getRoute(); ?>resources/js/expedient/workOrder/functions.js?v=<?= CACHE_DATE ?>"></script>
	</body>
</html>