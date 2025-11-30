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
		$assistance = $_GET['id'];
	}
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Editar Asistencia</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed assistances-page assistances-edit-page page">
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
                        <li><a href="<?php echo $utils->getRoute(); ?>asistencias"> Asistencias</a></li>
                        <li class="active">Editar asistencia</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="hide" id="existsAssistance">
                        <div class="alert alert-warning alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button> 
                            La asistencia no existe. En breves, será enviado al listado de las asistencias
                        </div>
                    </div>
                    <input type="hidden" name="assistanceID" id="assistanceID" value="<?php echo $assistance; ?>">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-plus-circle" aria-hidden="true"></i> Asistencias</h3>
                                    </div>
                                </div>
                                <div class="box-body" id="box-body">
                                    <form id="formEditAssistance" class="form-horizontal">
                                        <fieldset>
                                            <legend class="legendBottom"><span class="label label-primary labelLgExp">Datos</span></legend>
                                            <div class="row form-group">
                                                <div class="col-xs-4">
                                                    <label for="expedientNumber" class="col-xs-4 control-label">Nº expediente</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" size="30" class="form-control" name="expedientNumber" id="expedientNumber" disabled>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="attendanceDate" class="col-xs-4 control-label">Fecha asistencia tanatorio</label>
                                                    <div class="col-xs-8">
                                                        <div class="input-group date">
                                                            <input type="text" size="25" class="form-control datepicker" id="attendanceDate" name="attendanceDate">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="attendanceDateError"></span>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="deceased" class="col-xs-4 control-label">Difunto</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" size="30" class="form-control" name="deceased" id="deceased" disabled>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group">
                                                <div class="col-xs-4">
                                                    <label for="widow" class="col-xs-4 control-label" id="civilStatusLabel">Viudo/a de</label>
                                                    <div class="col-xs-8">
                                                        <input type="text"  size="30" class="form-control" name="widow" id="widow" disabled>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="capital" class="col-xs-4 control-label">Capital póliza</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" size="30" class="form-control" name="capital" id="capital" disabled>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="assistanceLocation" class="col-xs-4 control-label">Lugar asistencia</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" class="form-control" size="30" name="assistanceLocation" id="assistanceLocation" disabled>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group">
                                                <div class="col-xs-4">
                                                    <label for="address" class="col-xs-4 control-label">Dirección</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" size="30" class="form-control" name="address" id="address">
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="province" class="col-xs-4 control-label">Provincia</label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control province" id="province" name="province">
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="location" class="col-xs-4 control-label">Población</label>
                                                    <div class="col-xs-8">
                                                        <select class="form-control select2 location" id="location" name="location" disabled>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group">
                                                <div class="col-xs-4">
                                                    <label for="phone1" class="col-xs-4 control-label">Teléfono 1</label>
                                                    <div class="col-xs-8">
                                                        <input type="tel" size="30" class="form-control" name="phone1" id="phone1">
                                                        <span class="inputError" id="phone1Error"></span>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="phone2" class="col-xs-4 control-label">Teléfono 2</label>
                                                    <div class="col-xs-8">
                                                        <input type="tel" size="30" class="form-control" name="phone2" id="phone2">
                                                        <span class="inputError" id="phone2Error"></span>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="phone3" class="col-xs-4 control-label">Teléfono 3</label>
                                                    <div class="col-xs-8">
                                                        <input type="tel" size="30" class="form-control" name="phone3" id="phone3">
                                                        <span class="inputError" id="phone3Error"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group">
                                                <div class="col-xs-4">
                                                    <label for="deceasedDate" class="col-xs-4 control-label">Fecha defunción</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" class="form-control" size="30" name="deceasedDate" id="deceasedDate" disabled>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4 hide">
                                                    <label for="literalDate" class="col-xs-4 control-label">Fecha recogida literales</label>
                                                    <div class="col-xs-8">
                                                        <div class="input-group date">
                                                            <input type="text" size="25" class="form-control datepicker" id="literalDate" name="literalDate" disabled> 
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="literalDateError"></span>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="receiptDate" class="col-xs-4 control-label">Fecha entrega factura</label>
                                                    <div class="col-xs-8">
                                                        <div class="input-group date">
                                                            <input type="text" size="25" class="form-control datepicker" id="receiptDate" name="receiptDate">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                        </div>
                                                        <span class="inputError" id="receiptDateError"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend class="legendBottom"><span class="label label-primary labelLgExp">Trámites</span></legend>
                                            <div class="row form-group">
                                                <div class="col-xs-4">
                                                    <label for="ssDate" class="col-xs-4 control-label">Baja SS.SS.</label>
                                                    <div class="col-xs-8">
                                                        <div class="col-xs-4"> 
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="ssDateStartCheck" name="ssDateStartCheck" class="ssDateStartCheck processed disabled" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="ssDateEndCheck" name="ssDateEndCheck" class="ssDateEndCheck completed disabled" disabled> <span id="ssDateCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8"> <!--col-xs-offset-1-->
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="ssDateStart" name="ssDate">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="ssDateEnd" name="ssDate">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="pension" class="col-xs-4 control-label">Pensión</label>
                                                    <div class="col-xs-8">
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="spanishPension" name="spanishPension" class="minimal spanishPension"> <span class="">España</span>
                                                        </label>
                                                        <label class="checkbox-inline">
                                                            <input type="checkbox" id="foreignPension" name="foreignPension" class="minimal foreignPension"> <span class="">Extranjero</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="inssDate" class="col-xs-3 control-label">INSS</label>
                                                    <div class="col-xs-9">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="inssDateStartCheck" name="inssDateStartCheck" class="inssDateStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="inssDateEndCheck" name="inssDateEndCheck" class="inssDateEndCheck completed" disabled> <span id="inssDateCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="inssDateStart" name="inssDate">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="inssDateEnd" name="inssDate">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group">
                                                <div class="col-xs-4">
                                                    <label for="ismDate" class="col-xs-4 control-label">ISM</label>
                                                    <div class="col-xs-8">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="ismDateStartCheck" name="ismDateStartCheck" class="ismDateStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="ismDateEndCheck" name="ismDateEndCheck" class="ismDateEndCheck completed" disabled> <span id="ismDateCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="ismDateStart" name="ismDate">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="ismDateEnd" name="ismDate">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="socialDate" class="col-xs-3 control-label">T. Social</label>
                                                    <div class="col-xs-9">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="socialDateStartCheck" name="socialDateStartCheck" class="socialDateStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="socialDateEndCheck" name="socialDateEndCheck" class="socialDateEndCheck completed" disabled> <span id="socialDateCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="socialDateStart" name="socialDate">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="socialDateEnd" name="socialDate">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="passiveDate" class="col-xs-3 control-label">C. Pasivas</label>
                                                    <div class="col-xs-9">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="passiveDateStartCheck" name="passiveDateStartCheck" class="passiveDateStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="passiveDateEndCheck" name="passiveDateEndCheck" class="passiveDateEndCheck completed" disabled> <span id="passiveDateCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="passiveDateStart" name="passiveDate">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="passiveDateEnd" name="passiveDate">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group">
                                                <div class="col-xs-4">
                                                    <label for="isfasDate" class="col-xs-4 control-label">Isfas</label>
                                                    <div class="col-xs-8">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="isfasDateStartCheck" name="isfasDateStartCheck" class="isfasDateStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="isfasDateEndCheck" name="isfasDateEndCheck" class="isfasDateEndCheck completed" disabled> <span id="isfasDateCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="isfasDateStart" name="isfasDate">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="isfasDateEnd" name="isfasDate">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="lastWishDate" class="col-xs-3 control-label">Últimas voluntades</label>
                                                    <div class="col-xs-9">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="lastWishDateStartCheck" name="lastWishDateStartCheck" class="lastWishDateStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="lastWishDateEndCheck" name="lastWishDateEndCheck" class="lastWishDateEndCheck completed" disabled> <span id="lastWishDateCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="lastWishDateStart" name="lastWishDate">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="lastWishDateEnd" name="lastWishDate">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="insuranceCoverage" class="col-xs-3 control-label">Solicitud cobertura seguros</label>
                                                    <div class="col-xs-9">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="insuranceCoverageStartCheck" name="insuranceCoverageStartCheck" class="insuranceCoverageStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="insuranceCoverageEndCheck" name="insuranceCoverageEndCheck" class="insuranceCoverageEndCheck completed" disabled> <span id="insuranceCoverageCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="insuranceCoverageStart" name="insuranceCoverage">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="insuranceCoverageEnd" name="insuranceCoverage">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend class="legendBottom"><span class="label label-primary labelLgExp">Documentación recibida</span></legend>
                                            <div class="row form-group">
                                                <div class="col-xs-4">
                                                    <label for="dniDateG" class="col-xs-4 control-label">Dni</label>
                                                    <div class="col-xs-8">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="dniDateGStartCheck" name="dniDateGStartCheck" class="dniDateGStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="dniDateGEndCheck" name="dniDateGEndCheck" class="dniDateGEndCheck completed" disabled> <span id="dniDateGCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="dniDateGStart" name="dniDateG">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="dniDateGEnd" name="dniDateG">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="familyBookDateG" class="col-xs-3 control-label">Libro de familia</label>
                                                    <div class="col-xs-9">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="familyBookDateGStartCheck" name="familyBookDateGStartCheck" class="familyBookDateGStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="familyBookDateGEndCheck" name="familyBookDateGEndCheck" class="familyBookDateGEndCheck completed" disabled> <span id="familyBookDateGCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="familyBookDateGStart" name="familyBookDateGStart">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="familyBookDateGEnd" name="familyBookDateGEnd">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="literalBirthdayDateG" class="col-xs-3 control-label">Literal nacimiento</label>
                                                    <div class="col-xs-9">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="literalBirthdayDateGStartCheck" name="literalBirthdayDateGStartCheck" class="literalBirthdayDateGStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="literalBirthdayDateGEndCheck" name="literalBirthdayDateGEndCheck" class="literalBirthdayDateGEndCheck completed" disabled> <span id="literalBirthdayDateGCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="literalBirthdayDateGStart" name="literalBirthdayDateGStart">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="literalBirthdayDateGEnd" name="literalBirthdayDateGEnd">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group">
                                                <div class="col-xs-4">
                                                    <label for="registrationDateG" class="col-xs-4 control-label">Empadronamiento</label>
                                                    <div class="col-xs-8">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="registrationDateGStartCheck" name="registrationDateGStartCheck" class="registrationDateGStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="registrationDateGEndCheck" name="registrationDateGEndCheck" class="registrationDateGEndCheck completed" disabled> <span id="registrationDateGCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="registrationDateGStart" name="registrationDateGStart">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="registrationDateGEnd" name="registrationDateGEnd">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="literalMarriageDateG" class="col-xs-3 control-label">Literal matrimonio</label>
                                                    <div class="col-xs-9">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="literalMarriageDateGStartCheck" name="literalMarriageDateGStartCheck" class="literalMarriageDateGStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="literalMarriageDateGEndCheck" name="literalMarriageDateGEndCheck" class="literalMarriageDateGEndCheck completed" disabled> <span id="literalMarriageDateGCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="literalMarriageDateGStart" name="literalMarriageDateGStart">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="literalMarriageDateGEnd" name="literalMarriageDateGEnd">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="several" class="col-xs-3 control-label">Varios</label>
                                                    <div class="col-xs-9">
                                                        <textarea class="form-control" name="several" id="several" rows="3" cols="40"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend class="legendBottom"><span class="label label-primary labelLgExp">Devolución documentación</span></legend>
                                            <div class="row form-group">
                                                <div class="col-xs-4">
                                                    <label for="dniDateR" class="col-xs-4 control-label">Dni</label>
                                                    <div class="col-xs-8">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="dniDateRStartCheck" name="dniDateRStartCheck" class="dniDateRStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="dniDateREndCheck" name="dniDateREndCheck" class="dniDateREndCheck completed" disabled> <span id="dniDateRCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="dniDateRStart" name="dniDateRStart">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="dniDateREnd" name="dniDateREnd">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="familyBookDateR" class="col-xs-3 control-label">Libro de familia</label>
                                                    <div class="col-xs-9">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="familyBookDateRStartCheck" name="familyBookDateRStartCheck" class="familyBookDateRStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="familyBookDateREndCheck" name="familyBookDateREndCheck" class="familyBookDateREndCheck completed" disabled> <span id="familyBookDateRCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="familyBookDateRStart" name="familyBookDateRStart">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="familyBookDateREnd" name="familyBookDateREnd">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="literalBirthdayDateR" class="col-xs-3 control-label">Literal nacimiento</label>
                                                    <div class="col-xs-9">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="literalBirthdayDateRStartCheck" name="literalBirthdayDateRStartCheck" class="literalBirthdayDateRStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="literalBirthdayDateREndCheck" name="literalBirthdayDateREndCheck" class="literalBirthdayDateREndCheck completed" disabled> <span id="literalBirthdayDateRCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="literalBirthdayDateRStart" name="literalBirthdayDateRStart">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="literalBirthdayDateREnd" name="literalBirthdayDateREnd">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row form-group">
                                                <div class="col-xs-4">
                                                    <label for="registrationDateR" class="col-xs-4 control-label">Empadronamiento</label>
                                                    <div class="col-xs-8">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="registrationDateRStartCheck" name="registrationDateRStartCheck" class="registrationDateRStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="registrationDateREndCheck" name="registrationDateREndCheck" class="registrationDateREndCheck completed" disabled> <span id="registrationDateRCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="registrationDateRStart" name="registrationDateRStart">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="registrationDateREnd" name="registrationDateREnd">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-4">
                                                    <label for="literalMarriageDateR" class="col-xs-3 control-label">Literal matrimonio</label>
                                                    <div class="col-xs-9">
                                                        <div class="col-xs-4">
                                                            <label class="checkbox-inline">
                                                                <input type="checkbox" id="literalMarriageDateRStartCheck" name="literalMarriageDateRStartCheck" class="literalMarriageDateRStartCheck processed" disabled> <span class="">Proceso</span>
                                                            </label>
                                                            <label class="checkbox-inline checkBelow">
                                                                <input type="checkbox" id="literalMarriageDateREndCheck" name="literalMarriageDateREndCheck" class="literalMarriageDateREndCheck completed" disabled> <span id="literalMarriageDateRCompleted"class="">Realizada</span>
                                                            </label>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateStart" id="literalMarriageDateRStart" name="literalMarriageDateRStart">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                            <div class="input-group date">
                                                                <input type="text" size="10" class="form-control datepicker dateEnd" id="literalMarriageDateREnd" name="literalMarriageDateREnd">    
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend class="legendBottom"><span class="label label-primary labelLgExp">Otros</span></legend>
                                            <div class="row form-group">
                                                <div class="col-xs-6">
                                                    <div class="form-group">
                                                        <label for="successions" class="col-xs-4 control-label">Sucesiones</label>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control" name="successions" id="successions" rows="3" cols="100"></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="deathReport" class="col-xs-4 control-label">Informe defunción</label>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control" name="deathReport" id="deathReport" rows="3" cols="100"></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="production" class="col-xs-4 control-label">Producción</label>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control" name="production" id="production" rows="3" cols="100"></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="notes" class="col-xs-4 control-label">Notas</label>
                                                        <div class="col-xs-8">
                                                            <textarea class="form-control" name="notes" id="notes" rows="3" cols="100"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-6">
                                                    <div class="form-group">
                                                        <label for="km" class="col-xs-4 control-label">Km</label>
                                                        <div class="col-xs-8">
                                                            <input type="number" class="form-control" name="km" id="km">
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
                </section>
                <section id="block-content" class="content">
                    <input type="hidden" name="expedient" id="expedient" value="<?php echo $expedientID; ?>">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-plus-circle" aria-hidden="true"></i> Cuestionario</h3>
                                    </div>
                                </div>
                                <div class="box-body" id="box-body">
                                    <div class="row">
                                        <div class="col-xs-12">
                                            <form id="formSatisfactionSurvey" class="form-horizontal">
                                                <fieldset>
                                                    <legend class="legendBottom"><span class="label label-primary labelLgExp">Encuestado</span></legend>
                                                    <div class="row">
                                                        <div class="col-xs-4">
                                                            <div class="form-group">
                                                                <label for="date" class="col-xs-4 control-label">Fecha</label>
                                                                <div class="col-xs-8">
                                                                    <div class="input-group date">
                                                                        <input type="text" size="25" class="form-control datepicker" id="date" name="date">
                                                                        <div class="input-group-addon">
                                                                            <i class="fa fa-calendar"></i>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="form-group">
                                                                <label for="death" class="col-xs-4 control-label">Defunción</label>
                                                                <div class="col-xs-8">
                                                                    <input type="text" size="30" class="form-control" name="death" id="death" disabled>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-xs-4">
                                                            <div class="form-group">
                                                                <label for="relationship" class="col-xs-4 control-label">Parentesco</label>
                                                                <div class="col-xs-8">
                                                                    <input type="text" size="30" class="form-control" name="relationship" id="relationship">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-xs-8">
                                                            <div class="form-group">
                                                                <label for="name" class="col-xs-4 control-label">Nombre entrevistado</label>
                                                                <div class="col-xs-8">
                                                                    <input type="text" size="30" class="form-control" name="name" id="name">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                                <fieldset>
                                                    <legend class="legendBottom"><span class="label label-primary labelLgExp">Cuestionario</span></legend>
                                                    <div class="row">
                                                        <div class="col-xs-12">
                                                            <div class="table-responsive">
                                                                <table class="table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th></th>
                                                                            <th>Valoración de servicios</th>
                                                                            <th class="text-center">Excelente (5)</th>
                                                                            <th class="text-center">Buena (4)</th>
                                                                            <th class="text-center">Regular (3)</th>
                                                                            <th class="text-center">Mala (2)</th>
                                                                            <th class="text-center">Muy mala (1)</th>
                                                                            <th class="text-center">No aplica</th>
                                                                            <th width="20%" class="text-center">Observaciones</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="surveyBody"></tbody>
                                                                </table>
                                                                <strong>Puntuación total</strong>: <span id="totalScore"></span>
                                                            </div>
                                                            <span class="inputError" id="satisfactionSurveyError"></span>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                                <fieldset>
                                                    <legend class="legendBottom"><span class="label label-primary labelLgExp">Aspectos a mejorar</span></legend>
                                                    <div class="row">
                                                        <div class="col-xs-12">
                                                            <ol>
                                                                <li class="">En caso de que la valoración sea regular, mala o muy mala, solicitar explicación de que aspectos deberíamos mejorar.</li>
                                                                <li class="">En cualquier caso y aún valorando bien nuestro servicio, si consideran que existen aspectos que deberíamos mejorar, relacionarlos a continuación.</li>
                                                            </ol>
                                                            <textarea class="form-control" name="aspects" id="aspects" rows="6" cols="170"></textarea>
                                                            <br>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </form>
                                        </div>
                                    </div>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/jquery.dataTables.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?=CACHE_DATE?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/assistances/assistances-edit/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>