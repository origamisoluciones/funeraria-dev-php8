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
    require_once($_SESSION['basePath'] . 'core/users/functions.php');

    $utils = new Utils();

    if(isset($_GET['id'])){
		$expedientID = $_GET['id'];
	}

    $route = $utils->getRoute();
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Control de Servicio</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/all.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed page expedient-page cservice-page">
        <?php require_once($_SESSION['basePath'] . "view/expedient/modal/cservice-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/expedient/modal/docs/acta-preparacion-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/expedient/modal/docs/lapida-provisional-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/expedient/modal/docs/tarjeton-agradecimiento-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/expedient/modal/docs/lapida-provisional-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/expedient/modal/docs/libro-visitas-modal.php"); ?>
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
                        <li><a href="<?php echo $utils->getRoute(); ?>expedientes">Expedientes</a></li>
                        <li>Nº <span class="bolder numberExp"></span></li>
                        <li class="active">Control de servicio</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="hide" id="existsExpedient">
                        <div class="alert alert-warning alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button> 
                            El expediente no existe. En breves, será enviado al listado de los expedientes
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
                    <div class="hide" id="expedientBlocked">
                        <div class="alert alert-warning alert-dismissible fade in" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button> 
                            Vista en modo lectura. Hay otro usuario (<strong><span id="firstUser"></span></strong>) en esta sección del expediente
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div class="box" style="border: 1px solid #002490 !important;">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <p class="lead box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Control de Servicio</p>
                                    </div>
                                    <div class="pull-right">
                                        <button id="reactived" type="button" class="btn btn-warning hide">Reactivar</button>						
                                        <!-- <button id="noAplicated" type="button" class="btn btn-primary">No aplica</button> -->
                                        <div class="checkbox">
                                            <label class="checkbox-inline">
                                                <input type="checkbox" id="noAplicatedCheck" name="noAplicatedCheck"><span><strong>No aplica general</strong></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="tab-content">
                                        <form id="formCService" name="formCService" class="form-horizontal">
                                            <input type="hidden" name="expedientID" id="expedientID" value="<?php echo $expedientID; ?>">
                                            <fieldset>
                                                <legend class="legendBottom"><span class="label label-primary labelLgExp">Detalles del servicio</span></legend>
                                                <div class="row clearfix">
                                                    <div class="col-xs-3">
                                                        <div class="form-group">
                                                            <label for="nameLastname" class="col-xs-5 control-label">Nombre y Apellidos</label>
                                                            <div class="col-xs-7">
                                                                <input type="text" size="40" class="form-control" id="nameLastname" name="nameLastname" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-6"></div>
                                                    <div class="col-xs-2">
                                                        <div class="form-group disabled">
                                                            <label for="expedientNumber" class="col-xs-5 control-label">Nº Expediente</label>
                                                            <div class="col-xs-7">
                                                                <input type="text" class="form-control" size="15" id="expedientNumber" name="expedientNumber" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-3">
                                                        <div class="form-group">
                                                            <label for="expedienteDate" class="col-xs-5 control-label">Fecha solicitud</label>
                                                            <div class="col-xs-7">
                                                                <input type="text" size="40" class="form-control" id="expedienteDate" name="expedienteDate" aria-describedby="expedienteDate" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <div class="form-group bootstrap-timepicker timepicker">
                                                            <label for="callHour" class="col-xs-5 control-label">Hora solicitud</label>
                                                            <div class="col-xs-7">
                                                                <input type="text" size="15" class="form-control time" id="callHour" name="callHour" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <div class="form-group">
                                                            <label id="arriveDateLabel" class="col-xs-5 control-label toNormal">Fecha llegada</label>
                                                            <div class="col-xs-6">
                                                                <div class="input-group date">
                                                                    <input type="text" size="15" class="form-control datepicker" id="arriveDate" name="arriveDate" aria-describedby="arriveDate" autocomplete="off">
                                                                    <div class="input-group-addon">
                                                                        <i class="fa fa-calendar"></i>
                                                                    </div>
                                                                </div>
                                                                <span class="inputError" id="arriveDateError"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <div class="form-group bootstrap-timepicker timepicker">
                                                            <label for="arriveTime" class="col-xs-5 control-label" id="arriveTimeLabel">Hora llegada</label>
                                                            <div class="col-xs-6">
                                                                <div class="input-group">
                                                                    <input type="text" size="15" class="form-control time" id="arriveTime" name="arriveTime">
                                                                    <div class="input-group-addon">
                                                                        <i class="fa fa-clock-o"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-2">
                                                        <div class="form-group bootstrap-timepicker timepicker">
                                                            <label for="entryHour" class="col-xs-5 control-label">Hora entrada</label>
                                                            <div class="col-xs-7">
                                                                <input type="text" size="15" class="form-control time" id="entryHour" name="entryHour" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-3">
                                                        <div class="form-group">
                                                            <label for="insurance" class="col-xs-5 control-label">Aseguradora</label>
                                                            <div class="col-xs-7">
                                                                <input type="text" size="40" class="form-control" id="insurance" name="insurance" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="divDetailPolicy" class="col-xs-2">
                                                        <div class="form-group">
                                                            <label for="policyNumber" class="col-xs-5 control-label">Nº Poliza</label>
                                                            <div class="col-xs-7">
                                                                <input type="text" size="15" class="form-control" id="policyNumber" name="policyNumber" disabled>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                    <div id="divDetailCapital" class="col-xs-2">
                                                        <div class="form-group">
                                                            <label for="capital" class="col-xs-5 control-label">Capital</label>
                                                            <div class="col-xs-7">
                                                                <input type="text" class="form-control" id="capital" name="capital" disabled>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                    <div id="divDetailLoss" class="col-xs-2">
                                                        <div class="form-group">
                                                            <label for="loss" class="col-xs-5 control-label">Núm. Siniestro</label>
                                                            <div class="col-xs-7">
                                                                <input type="text" class="form-control" id="loss" name="loss" disabled>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-3">
                                                        <div class="form-group">
                                                            <label for="dni" class="col-xs-5 control-label">DNI entregado a</label>
                                                            <div class="col-xs-7">
                                                                <input type="text" size="40" class="form-control" id="dni" name="dni">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-2 float-right" id="checkControl">
                                                        <div class="col-xs-offset-5 col-xs-7">
                                                            <div class="checkbox">
                                                                <label class="checkbox-inline">
                                                                    <input type="hidden" id="revReqCheck" name="revReqCheck" value="">
                                                                    <input type="checkbox" class="minimal" id="revReq" name="revReq"> <span id="revReqText"><strong>Control</strong></span>
                                                                </label>
                                                            </div>
                                                            <span class="inputError" id="revReqCheckError"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset class="controlSection hide" id="controlFieldset">
                                                <legend class="legendBottom"><span class="label label-primary labelLgExp" id="controlTitle">Control</span></legend>
                                                <div class="row">
                                                    <div class="col-xs-4">
                                                        <div class="form-group col-xs-12">
                                                            <label class="control-label">Aviso de defunción Exp:</label>
                                                            <span id="controlExpedient"></span>
                                                        </div>
                                                        <div class="form-group col-xs-12">
                                                            <label class="control-label">Nombre:</label>
                                                            <span id="controlName"></span>
                                                        </div>
                                                        <div class="form-group col-xs-12">
                                                            <label class="control-label">DNI:</label>
                                                            <span id="controlDni"></span>
                                                        </div>
                                                        <div id="divCapital" class="form-group col-xs-12">
                                                            <label class="control-label">Capital:</label>
                                                            <span id="controlCapital"></span>
                                                        </div>
                                                        <div id="divPolicy" class="form-group col-xs-12">
                                                            <label class="control-label">Póliza:</label>
                                                            <span id="controlPolicy"></span>
                                                        </div>
                                                        <div id="divLoss" class="form-group col-xs-12">
                                                            <label class="control-label">Núm. Siniestro:</label>
                                                            <span id="controlLoss"></span>
                                                        </div>
                                                        <div class="form-group col-xs-12">
                                                            <label class="control-label controlDeceasedDate"></label>
                                                            <span id="controlDeceasedDate"></span>
                                                        </div>
                                                        <div class="form-group col-xs-12">
                                                            <label class="control-label controlDeceasedLocation"></label>
                                                            <span id="controlDeceasedLocation"></span>
                                                        </div>
                                                        <div class="form-group col-xs-12">
                                                            <label class="control-label controlMortuary">Casa mortuoria:</label>
                                                            <span id="controlMortuary"></span>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-8">
                                                        <div class="form-group">
                                                            <label for="controlAssistance" class="col-xs-3 control-label">Asistencia</label>
                                                            <div class="col-xs-9">
                                                                <select id="controlAssistance" class="form-control select2" multiple></select>
                                                            </div>
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="controlNotes" class="col-xs-3 control-label">Notas</label>
                                                            <div class="col-xs-9">
                                                                <textarea id="controlNotes" rows="4" cols="120" class="form-control"></textarea>
                                                            </div>
                                                        </div>
                                                        <div class="form-group" id="controlServiceSendEmail">
                                                            <label for="controlSend" class="col-xs-3 control-label">Enviar a</label>
                                                            <div class="col-xs-9">
                                                                <select id="controlSend" class="form-control select2" multiple></select>
                                                            </div>
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="controlCopy" class="col-xs-3 control-label">Copia para</label>
                                                            <div class="col-xs-9" style="display:flex">
                                                                <input type="email" size="44" class="form-control" id="controlCopy">
                                                                <button id="infoCopy" style="margin-left:5px;width: 25px;" type="button" class="btn btn-info" data-toggle="popover" title="<span class='text-center'><strong>Información</strong></span>" data-content="Si hay más de un correo tiene que ir separado por una <strong>,</strong>" style="padding: 0.6px 9px!important;margin-right: 15px;"><i class="fa fa-info"></i></button>
                                                            </div>
                                                        </div>
                                                        <div class="form-group">
                                                            <div class="col-xs-offset-3 col-xs-8">
                                                                <button type="button" id="sendControl" class="btn btn-primary"><i class="fa fa-envelope"></i> Enviar correo</button>
                                                            </div>
                                                            <div class="col-xs-offset-3 col-xs-4">
                                                                <p id="controlSent"></p>
                                                            </div>
                                                        </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-xs-9">
                                                                <input type="checkbox" id="control">
                                                                <label for="control" id="controlCheck"><strong>Control realizado</strong></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="alert hide sendControlError"></div>
                                            </fieldset>
                                            <div class="row form-horizontal">
                                                <div class="col-xs-12">
                                                    <div class="box-group" id="accordionCservices" role="tablist" aria-multiselectable="true">
                                                        <fieldset id="priestFieldset">
                                                            <legend class="legendBottom"><span id="curasLbl" class="label label-primary labelLgExp">Curas</span></legend>
                                                            <div class="panel box box-primary">
                                                                <div class="box-header">
                                                                    <h4 class="box-title">
                                                                        <a data-toggle="collapse" class="block-collapse" data-parent="#priestsSection" href="#priestsSection" aria-expanded="true"></a>
                                                                    </h4>
                                                                </div>
                                                                <div id="priestsSection" class="box-collapse block-collapse collapse in" aria-expanded="true">
                                                                    <div class="box-body">
                                                                        <div class="row" style="padding-bottom: 10px;">
                                                                            <label for="priestAdd" class="col-xs-1 control-label">Añadir cura</label>
                                                                            <div class="col-xs-5">
                                                                                <select id="priestAdd" name="priestAdd" class="form-control select2"></select>
                                                                                <a href="#" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-new-priest"><i class="fa fa-plus" aria-hidden="true"></i> NUEVO CURA</a>
                                                                            </div>  
                                                                            <label for="priestTime" class="col-xs-1 control-label" id="priestTimeLabel">Hora</label>
                                                                            <div class="col-xs-3">
                                                                                <div class="col-xs-4">
                                                                                    <div class="input-group bootstrap-timepicker timepicker">
                                                                                        <input type="text" size="5" class="form-control time" id="priestTime" name="priestTime">
                                                                                        <div class="input-group-addon">
                                                                                            <i class="fa fa-clock-o"></i>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-xs-4">
                                                                                    <div class="checkbox">
                                                                                        <label>
                                                                                            <input type="hidden" id="priestCheckedHidden" name="priestCheckedHidden">
                                                                                            <input type="checkbox" class="minimal" id="priestTimeCheck" name="priestTimeCheck"> <span id="priestTimeCheckLabel"><strong>Revisado</strong></span>
                                                                                        </label>
                                                                                    </div>
                                                                                    <span class="inputError" id="priestCheckedError"></span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row">
                                                                            <div class="col-xs-10">
                                                                                <div class="table-responsive">
                                                                                    <table id="priests-table" class="table table-striped table-bordered display" cellspacing="0" width="100%"></table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row">
                                                                            <div class="col-xs-12">
                                                                                <br>
                                                                                <div class="row">
                                                                                    <div class="col-xs-1">
                                                                                        <label for="funeralDateNew"><strong>Fecha funeral</strong></label>
                                                                                        <input type="text" class="form-control" id="funeralDateNew" disabled>
                                                                                    </div>
                                                                                    <div class="col-xs-1" style="margin-left: 50px;">
                                                                                        <label for="funeralTimeNew"><strong>Hora funeral</strong></label>
                                                                                        <input type="text" class="form-control" id="funeralTimeNew" disabled>
                                                                                    </div>
                                                                                </div>
                                                                                <br>
                                                                                <div class="hide" id="divPriestMoreInfo" style="display: inline-block;">
                                                                                    <div style="display: inline-block;">
                                                                                        <input type="checkbox" id="priestInspected">
                                                                                        <label for="priestInspected" class=""><strong>Revisado (Funeral)</strong></label>
                                                                                    </div>
                                                                                    <div style="display: inline-block;margin-left: 10px;">
                                                                                        <input type="checkbox" id="priestPayed">
                                                                                        <label for="priestPayed" class=""><strong>Pagado (Funeral)</strong></label>
                                                                                    </div>
                                                                                    <div>
                                                                                        <textarea class="form-control" id="priestNotes" rows="2" cols="220" placeholder="Notas..."></textarea>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                        <fieldset id="choirFieldset">
                                                            <legend class="legendBottom"><span id="corosLbl" class="label label-primary labelLgExp">Coros / Cantor-Organistas</span></legend>
                                                            <div class="panel box box-primary">
                                                                <div class="box-header" id="headingOne">
                                                                    <h4 class="box-title">
                                                                        <a data-toggle="collapse" class="block-collapse" data-parent="#choirSection" href="#choirSection" aria-expanded="true"></a>
                                                                    </h4>
                                                                </div>
                                                                <div id="choirSection" class="box-collapse block-collapse collapse in" aria-expanded="true">
                                                                    <div class="box-body">
                                                                        <div class="row">
                                                                            <label for="choir" class="col-xs-1 control-label">Añadir coro:</label>
                                                                            <div class="col-xs-11">
                                                                                <select id="choir" name="choir" class="select2 form-control"></select>
                                                                                <a href="#" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-new-choir"><i class="fa fa-plus" aria-hidden="true"></i> NUEVO CORO</a>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row">
                                                                            <div class="col-xs-11">
                                                                                <div class="table-responsive">
                                                                                    <table id="choir-table" class="table table-striped table-bordered display" cellspacing="0" width="100%"></table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                        <fieldset id="bellringersSection">
                                                            <legend class="legendBottom"><span id="campanerosLbl" class="label label-primary labelLgExp">Campaneros</span></legend>
                                                            <div class="panel box box-primary">
                                                                <div class="box-header" id="headingOne">
                                                                    <h4 class="box-title">
                                                                        <a data-toggle="collapse" class="block-collapse" data-parent="#bellringerSection" href="#bellringerSection" aria-expanded="true"></a>
                                                                    </h4>
                                                                </div>
                                                                <div id="bellringerSection" class="box-collapse block-collapse collapse in" aria-expanded="true">
                                                                    <div class="box-body">
                                                                        <div class="row">
                                                                            <label for="bellringer" class="col-xs-1 control-label">Campanero:</label>
                                                                            <div class="col-xs-11">
                                                                                <select id="bellringer" name="bellringer" class="select2 form-control"></select>
                                                                                <a href="#" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-new-bellringer"><i class="fa fa-plus" aria-hidden="true"></i> NUEVO CAMPANERO</a>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row">
                                                                            <div class="col-xs-7">
                                                                                <div class="table-responsive">
                                                                                    <table id="bellringer-table" class="table table-striped table-bordered display" cellspacing="0" width="100%"></table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                        <fieldset id="gravediggerFieldset">
                                                            <legend class="legendBottom"><span id="enterradorLbl" class="label label-primary labelLgExp">Enterradores</span></legend>
                                                            <div class="panel box box-primary">
                                                                <div class="box-header">
                                                                    <h4 class="box-title">
                                                                        <a data-toggle="collapse" class="block-collapse" data-parent="#gravediggersSection" href="#gravediggersSection" aria-expanded="true">
                                                                        </a>
                                                                    </h4>
                                                                </div>
                                                                <div id="gravediggersSection" class="box-collapse block-collapse collapse in" aria-expanded="true">
                                                                    <div class="box-body">
                                                                        <div class="row">
                                                                            <label for="addGravedigger" class="col-xs-1 control-label">Añadir enterrador</label>
                                                                            <div class="col-xs-4">
                                                                                <select id="addGravedigger" name="addGravedigger" class="form-control select2"></select>
                                                                                <a href="#" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-new-gravedigger"><i class="fa fa-plus" aria-hidden="true"></i> NUEVO ENTERRADOR</a>
                                                                            </div>
                                                                    
                                                                            <div class="col-xs-1">
                                                                                <label for="nicheNumber" class="col-xs-6 control-label">Nº Nicho</label>
                                                                                <div class="col-xs-6">
                                                                                    <input type="text" size="5" class="form-control" id="nicheNumber" name="nicheNumber" disabled>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-xs-2">
                                                                                <label for="nicheType" class="col-xs-4 control-label">Tipo Nicho</label>
                                                                                <div class="col-xs-8">
                                                                                    <input type="text" size="10" class="form-control" id="nicheType" name="nicheType" disabled>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-xs-2">
                                                                                <label for="funeralBusyNiche" class="col-xs-8 control-label">Nicho ocupado</label>
                                                                                <div class="col-xs-4">
                                                                                    <input type="text" size="5" class="form-control" id="funeralBusyNiche" name="funeralBusyNiche" disabled>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-xs-2">
                                                                                <label for="niche" class="col-xs-4 control-label">Régimen</label>
                                                                                <div class="col-xs-8">
                                                                                    <select class="form-control select" id="regime" name="regime" disabled>
                                                                                        <option value="0">Sin régimen</option>
                                                                                        <option value="1">Propiedad</option>
                                                                                        <option value="2">Alquiler</option>
                                                                                        <option value="3">Concesión</option>
                                                                                        <option value="4">Cesión Temporal</option>
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row" style="margin-top:10px">
                                                                            <div class="col-xs-4">
                                                                            </div>
                                                                            <div class="col-xs-3" style="margin-left: 6%;">
                                                                                <label for="deceasedNiche" class="col-xs-4 control-label">Exhumación de</label>
                                                                                <div class="col-xs-8">
                                                                                    <input type="text" size="20" class="form-control" id="deceasedNiche" name="deceasedNiche" disabled>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-xs-2" style="margin-left: -8%;">
                                                                                <label for="exhumation" class="col-xs-4 control-label">Titular</label>
                                                                                <div class="col-xs-8">
                                                                                    <input type="text" size="20" class="form-control" id="exhumation" name="exhumation" disabled>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-xs-2">
                                                                                <label for="nicheHeight" class="col-xs-4 control-label">Altura nicho</label>
                                                                                <div class="col-xs-8">
                                                                                    <select class="form-control" id="nicheHeight" name="nicheHeight" disabled>
                                                                                        <option value="0" selected>Sin altura</option>
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
                                                                        <div class="row">
                                                                            <div class="col-xs-5">
                                                                                <div class="table-responsive">
                                                                                    <table id="gravedigger-table" class="table table-striped table-bordered display" cellspacing="0" width="100%"></table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div style="margin-bottom: 10px;">
                                                                    <strong>Documento cementerio:</strong>
                                                                    <div id="divImpreso" style="display: inline-block;">
                                                                        <label for="gravediggersCheckPrinted" class="control-label" id="gravediggersCheckPrintedText"><strong>Impreso</strong></label>
                                                                        <input type="checkbox" id="gravediggersCheckPrinted">
                                                                    </div>
                                                                    <div id="divFirmado" style="display: inline-block;">
                                                                        <label for="gravediggersCheckSigned" class="control-label" id="gravediggersCheckSignedText"><strong>Firmado</strong></label>
                                                                        <input type="checkbox" id="gravediggersCheckSigned">
                                                                    </div>
                                                                    <label for="gravediggersNotApply" class="control-label"><strong>No aplica</strong></label>
                                                                    <input type="checkbox" id="gravediggersNotApply">
                                                                    <div class="checkbox">
                                                                        <span><strong>Estado del nicho:</strong></span>
                                                                        <label>
                                                                            <input type="hidden" id="gravediggersCheckedHidden" name="gravediggersCheckedHidden">
                                                                            <input type="checkbox" class="minimal" id="gravediggersChecked" name="gravediggersChecked"> <span id="gravediggersCheckText"><strong>Revisado</strong></span>
                                                                        </label>
                                                                    </div>
                                                                    <span class="inputError" id="gravediggersCheckedError"></span>
                                                                </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                        <fieldset>
                                                            <legend class="legendBottom"><span id="othersTitle" class="label label-primary labelLgExp">Otros</span></legend>
                                                            <div class="panel box box-primary">
                                                                <div class="box-header" id="headOthersSection">                                                            
                                                                    <h4 class="box-title">
                                                                        <a data-toggle="collapse" data-parent="#othersSections" href="#othersSections" aria-expanded="true"></a>
                                                                    </h4>
                                                                </div>
                                                                <div id="othersSections" class="box-collapse collapse in" aria-expanded="true">
                                                                    <div class="text-right" style="padding-top: 15px;">
                                                                        <input type="checkbox" id="notApplyAll">
                                                                        <label for="notApplyAll">No aplica</label>
                                                                    </div>
                                                                    <div class="box-body">
                                                                        <div id="othersSection"></div>
                                                                        <div class="panel box box-danger">
                                                                            <fieldset id="literalFieldset">
                                                                                <legend class="legendBottom"><span id="literalTitle" class="label label-primary labelLgExp">Literales</span></legend>
                                                                                <div class="table-responsive">
                                                                                    <table class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                                                        <thead>
                                                                                            <tr>                                                                                      
                                                                                                <th width="55%">Acciones</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td width="5%">
                                                                                                    <div class="col-xs-2">
                                                                                                        <input type="checkbox" id="literalRequest" class="literal-field">
                                                                                                        <label id="literalRequestLbl" for="literalRequest">Solicitado</label>
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <input type="checkbox" id="literalReceived" class="literal-field">
                                                                                                        <label id="literalReceivedLbl" for="literalReceived">Recibido</label>
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <input type="checkbox" id="literalNoFinished" class="literal-field">
                                                                                                        <label id="literalNoFinishedLbl" for="literalNoFinished">No finalizar</label>
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <input type="checkbox" id="literalNotApply" class="literal-field">
                                                                                                        <label for="literalNotApply">No aplica</label>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td width="5%">
                                                                                                    <div class="col-xs-2">
                                                                                                        <label for="literalVolumePage">Tomo y página</label>
                                                                                                        <input type="text" id="literalVolumePage" class="literal-field">
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <label for="literalCivilRegister">Registro Civil</label>
                                                                                                        <input type="text" id="literalCivilRegister" class="literal-field">
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <label for="literalWhoTakes">¿Quién se lo lleva?</label>
                                                                                                        <input type="text" id="literalWhoTakes" class="literal-field">
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <label for="literalDateExit">Fecha de entrega</label>
                                                                                                        <input type="text" id="literalDateExit" class="datepicker literal-field" autocomplete="off">
                                                                                                    </div>
                                                                
                                                                                                    <div class="col-xs-2 hide"> 
                                                                                                        <label for="literalTimeExit">Hora de salida</label>
                                                                                                        <input type="text" id="literalTimeExit" class="literal-field">
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>                                                                                   
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </fieldset>
                                                                        </div>
                                                                            <div id="panelCrematorium" class="panel box box-danger hide">
                                                                                <fieldset id="cremationFieldset">
                                                                                    <legend class="legendBottom"><span id="cremationTitle" class="label label-primary labelLgExp">Resumen Cremación</span></legend>
                                                                                    <div class="table-responsive">
                                                                                        <table class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                                                            <thead>
                                                                                                <tr>                                                                                      
                                                                                                    <th width="55%">Acciones</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody id="crematoriumData">
                                                                                                <tr>
                                                                                                    <td>
                                                                                                        <div class="col-xs-3">
                                                                                                            <input id="crematoriumProgramOven" type="checkbox"> 
                                                                                                            <label for="crematoriumProgramOven">Programación horno</label></div>
                                                                                                        </div>
                                                                                                        <div class="col-xs-3">
                                                                                                            <label for="crematoriumWhoProgramOven">Quién lo hace</label>
                                                                                                            <select id="crematoriumWhoProgramOven" class="select2"></select>
                                                                                                        </div>
                                                                                                        <div class="col-xs-3">
                                                                                                            <label for="crematoriumTechnical">Técnico de cremación</label>
                                                                                                            <input type="text" id="crematoriumTechnical" style="width: 250px!important;" disabled>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td>
                                                                                                        <div class="col-xs-3">
                                                                                                            <label for="crematoriumWhoDelivered">Entrega las cenizas</label>
                                                                                                            <select id="crematoriumWhoDelivered" class="select2"></select>
                                                                                                        </div>
                                                                                                        <div class="col-xs-3">
                                                                                                            <label for="authDate">Fecha y Hora de Entrega</label>
                                                                                                            <input type="text" id="authDate" style="width: 250px!important;" disabled>
                                                                                                        </div>
                                                                                                        <div class="col-xs-3">
                                                                                                            <label for="authPlace">Lugar de Entrega de Cenizas</label>
                                                                                                            <input type="text" id="authPlace" style="width: 250px!important;" disabled>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td>
                                                                                                        <div class="spaceRight">
                                                                                                            <label>Notas</label> 
                                                                                                            <textarea type="text" id="crematoriumNotes" style="width: 925px !important; vertical-align: middle;"></textarea>
                                                                                                        </div>  
                                                                                                        <div class="spaceRight">
                                                                                                            <input id="crematoriumControlDeliversAshes" type="checkbox"> 
                                                                                                            <label for="crematoriumControlDeliversAshes">Control de Entrega cenizas</label></div>
                                                                                                        </div>  
                                                                                                        <div id="crematoriumButtonsSection" style="float:right;margin-top: 1em;">
                                                                                                            <button type="button" class="btn btn-primary" id="genPDFCrematorium">Ver PDF</button>
                                                                                                        </div>       
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                </fieldset>
                                                                            </div>
                                                                        <div class="panel box box-danger">
                                                                            <fieldset id="policeFieldset">
                                                                                <legend class="legendBottom"><span id="policeTitle" class="label label-primary labelLgExp">Policía</span></legend>   
                                                                                <div class="table-responsive">
                                                                                    <table class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                                                        <thead>
                                                                                            <tr>                                                                                      
                                                                                                <th width="55%">Acciones</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td width="5%">
                                                                                                    <div class="col-xs-2">
                                                                                                        <input type="checkbox" id="policeNotified">
                                                                                                        <label id="policeLbl" for="policeNotified">Avisada</label>
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <label for="policeLocation">Municipio</label>
                                                                                                        <input type="text" id="policeLocation">
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <input type="checkbox" id="policeNotApply">
                                                                                                        <label for="policeNotApply">No aplica</label>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>                                                                                   
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </fieldset>
                                                                        </div>
                                                                        <div class="panel box box-danger">
                                                                            <fieldset id="tribunalFieldset">
                                                                                <legend class="legendBottom"><span id="tribunalTittle" class="label label-primary labelLgExp">Juzgado</span></legend>   
                                                                                <div class="table-responsive">
                                                                                    <table class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                                                        <thead>
                                                                                            <tr>                                                                                      
                                                                                                <th width="55%">Acciones</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td width="5%">
                                                                                                    <div class="col-xs-2">
                                                                                                        <input type="checkbox" id="tribunalInProgress">
                                                                                                        <label id="tribProgrLbl" for="tribunalInProgress">En proceso</label>
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <input type="checkbox" id="tribunalDeliver">
                                                                                                        <label id="tribDelivLbl" for="tribunalDeliver">Entregado</label>
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <select id="tribunalUser" class="select2"></select>
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <label for="tribunalLocation">Municipio</label>
                                                                                                        <input type="text" id="tribunalLocation">
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <input type="checkbox" id="tribunalNotApply">
                                                                                                        <label for="tribunalNotApply">No aplica</label>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>                                                                                   
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </fieldset>
                                                                        </div>
                                                                        <div class="panel box box-danger">
                                                                            <fieldset id="doctorFieldset">
                                                                            <legend class="legendBottom"><span id="doctorTitle" class="label label-primary labelLgExp">Certificado médico</span></legend>   
                                                                                    <div class="table-responsive">
                                                                                        <table class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                                                            <thead>
                                                                                                <tr>                                                                                      
                                                                                                    <th width="55%">Acciones</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td width="5%">
                                                                                                        <div class="col-xs-2">
                                                                                                            <input type="checkbox" id="doctorInProgress">
                                                                                                            <label id="docInProgLbl" for="doctorInProgress">En proceso</label>
                                                                                                        </div>
                                                                                                        <div class="col-xs-2">
                                                                                                            <input type="checkbox" id="doctorDone">
                                                                                                            <label id="docDoneLbl" for="doctorDone">Entregado</label>
                                                                                                        </div>
                                                                                                        <div class="col-xs-2">
                                                                                                            <select id="doctorDeliver" class="select2"></select>
                                                                                                        </div>                                                                                                
                                                                                                        <div class="col-xs-2">
                                                                                                            <input type="checkbox" id="doctorNotApply">
                                                                                                            <label for="doctorNotApply">No aplica</label>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>                                                                                   
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                </fieldset>
                                                                        </div>
                                                                        <div class="panel box box-danger" id="webSection">                                                                    
                                                                            <fieldset id="webFieldset">
                                                                                <legend class="legendBottom"><span id="webTitle" class="label label-primary labelLgExp">Página web</span></legend>     
                                                                                <div class="table-responsive">
                                                                                    <table class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                                                        <thead>
                                                                                            <tr>                                                                                      
                                                                                                <th width="55%">Acciones</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td width="5%">
                                                                                                    <div class="col-xs-1">
                                                                                                        <input type="checkbox" id="webConfirm">
                                                                                                        <label id="webLbl" for="webConfirm">Confirmada</label>
                                                                                                    </div>
                                                                                                    <div class="col-xs-2 <?= $_SESSION['company'] == '6' ? 'hide' : ''?>">
                                                                                                        <input type="checkbox" id="showAgeObituaryWeb">
                                                                                                        <label for="showAgeObituaryWeb"><strong>NO</strong> mostrar edad</label>
                                                                                                    </div>
                                                                                                    <div class="col-xs-2 <?= $_SESSION['company'] != '11' ? 'hide' : ''?>">
                                                                                                        <input type="checkbox" id="showFinalDestinationWeb">
                                                                                                        <label for="showFinalDestinationWeb"><strong>NO</strong> mostrar destino final</label>
                                                                                                    </div>
                                                                                                    <div class="col-xs-2 <?= $_SESSION['company'] != '11' ? 'hide' : ''?>">
                                                                                                        <input type="checkbox" id="showVelationWeb">
                                                                                                        <label for="showVelationWeb"><strong>NO</strong> mostrar velación</label>
                                                                                                    </div>
                                                                                                    <div class="col-xs-2 <?= $_SESSION['company'] != '11' ? 'hide' : ''?>">
                                                                                                        <input type="checkbox" id="showCeremonyWeb">
                                                                                                        <label for="showCeremonyWeb"><strong>NO</strong> mostrar ceremonia</label>
                                                                                                    </div>
                                                                                                    <div class="col-xs-1">
                                                                                                        <input type="checkbox" id="webNotApply">
                                                                                                        <label for="webNotApply">No aplica</label>
                                                                                                    </div>
                                                                                                    <div class="col-xs-1">
                                                                                                        <button type="button" class="btn btn-success" id="publish">Publicar</button>
                                                                                                        <button type="button" class="btn btn-primary" id="unpublish">Quitar de la web</button>
                                                                                                    </div>
                                                                                                    <div class="col-xs-1" style="padding-left: 5px;">
                                                                                                        <a href="javascript:void(0)" target="_blank" id="webLink">Enlace a la web</a>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr class="web-aniversary hide">
                                                                                                <td>
                                                                                                    <div class="col-xs-2">
                                                                                                        <label id="webLbl" for="sinceAniversaryWeb">Desde (aniversario)</label>
                                                                                                        <input type="text" class="form-control datepicker" id="sinceAniversaryWeb" autocomplete="off">
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <label id="webLbl" for="untilAniversaryWeb">Hasta (aniversario)</label>
                                                                                                        <input type="text" class="form-control datepicker" id="untilAniversaryWeb" autocomplete="off">
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <label for="churchAniversaryWeb" style="width:100%">Iglesia</label>
                                                                                                        <select id="churchAniversaryWeb" class="select2 church"></select>
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <label id="webLbl" for="dateAniversaryWeb">Fecha aniversario</label>
                                                                                                        <input type="text" class="form-control datepicker" id="dateAniversaryWeb" autocomplete="off">
                                                                                                    </div>
                                                                                                    <div class="col-xs-4">
                                                                                                        <label id="webLbl" for="dateAniversaryWeb">Hora aniversario</label>
                                                                                                        <div class="input-group bootstrap-timepicker time-aniversary-web timepicker">
                                                                                                            <input type="text" size="5" class="form-control time" id="timeAniversaryWeb" name="timeAniversaryWeb">
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </fieldset>
                                                                        </div>
                                                                        <div class="panel box box-danger">
                                                                            <fieldset id="prepFieldset">
                                                                                <legend class="legendBottom"><span id="prepTitle" class="label label-primary labelLgExp">Act. preparación</span></legend>   
                                                                                <div class="table-responsive">
                                                                                    <table class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                                                        <thead>
                                                                                            <tr>                                                                                      
                                                                                                <th width="55%">Acciones</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td width="5%">
                                                                                                    <div class="col-xs-2">
                                                                                                        <a class='btn btn-default' id='preparationNew'><i class='fa fa-plus-circle' aria-hidden='true'></i></a>
                                                                                                        <a class='btn btn-default' id='preparationView'><i class='fa fa-eye' aria-hidden='true'></i></a>
                                                                                                        <a class='btn btn-default' id='preparationDelete'><i class='fa fa-trash' aria-hidden='true'></i></a>
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <input type="checkbox" id="preparationConfirm">
                                                                                                        <label id="prepLbl" for="preparationConfirm">Confirmada</label>
                                                                                                    </div>
                                                                                                    <div class="col-xs-2">
                                                                                                        <input type="checkbox" id="preparationNotApply">
                                                                                                        <label for="preparationNotApply">No aplica</label>
                                                                                                    </div> 
                                                                                                </td>
                                                                                            </tr>                                                                                   
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </fieldset>                                                                     
                                                                        </div>
                                                                        <div class="panel box box-danger">                                                                    
                                                                            <fieldset id="tombstoneFieldset">
                                                                                <legend class="legendBottom"><span id="tombstoneTitle" class="label label-primary labelLgExp">Lápida provisional</span></legend>   
                                                                                <div class="table-responsive">
                                                                                    <table class="table table-striped table-bordered display" width="100%" cellspacing="0">
                                                                                        <thead>
                                                                                            <tr>                                                                                      
                                                                                                <th width="55%">Acciones</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td width="5%">
                                                                                                    <div class="col-xs-2">
                                                                                                    <div id="tombtoneOptions" class="col-xs-2">
                                                                                                        <a class='btn btn-default' id='tombstoneView'><i class='fa fa-eye' aria-hidden='true'></i></a>
                                                                                                        
                                                                                                    </div> 
                                                                                                    </div> 
                                                                                                    <div class="col-xs-2">
                                                                                                        <input type="checkbox" id="tombstonePrint">
                                                                                                        <label id="tombstonePrintLbl" for="tombstonePrint">Impresa</label>
                                                                                                    </div>   
                                                                                                    <div class="col-xs-2">
                                                                                                        <input type="checkbox" id="tombstoneNotApply">
                                                                                                        <label for="tombstoneNotApply">No aplica</label>
                                                                                                    </div>                                                                                        
                                                                                                </td>
                                                                                            </tr>                                                                                   
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </fieldset>  
                                                                        </div>
                                                                        <div id="vivorecuerdoSection"></div>
                                                                        <div class="hide" id="surveysSection">
                                                                            <fieldset id="surveyFieldset">
                                                                                <legend class="legendBottom"><span id="surveyLbl" class="label label-primary labelLgExp">Encuesta de satisfacción</span></legend>
                                                                                <div class="panel box box-primary">
                                                                                    <div class="box-body">
                                                                                        <div class="row" style="padding: 10px;">
                                                                                            <div class="col-xs-5 not-apply-survey">
                                                                                                <label style="padding-right:5px" for="selectSurvey">Seleccionar encuesta: </label>
                                                                                                <select id="selectSurvey" class="form-control select2"></select>
                                                                                                <button type="button" class="btn btn-primary btn-sm" style="margin-left:20px" id="sendSurvey">
                                                                                                    <i class="fa fa-envelope"></i> <span style="font-size:13px; padding-left:5px">ENVIAR</span>
                                                                                                </button>
                                                                                                <span style="margin-left: 0.2em;">
                                                                                                    <button id="sendSurveyHelp" type="button" class="btn btn-info" data-toggle="popover" title="" data-content="Al pulsar el botón de ENVIAR, se enviará la encuesta seleccionada a todos los teléfonos añadidos <strong> a los que no se les había enviado todavía la encuesta.</strong> <p>&nbsp;</p><p> Una vez que una encuesta se haya enviado <strong>a al menos un teléfono NO se podrá seleccionar una encuesta diferente.</strong></p>" style="padding: 0.6px 9px!important;margin-right: 15px;" data-original-title="<span class='text-center'><strong>Aviso de envío SMS</strong></span>">
                                                                                                        <i class="fa fa-info"></i>
                                                                                                    </button>
                                                                                                </span>
                                                                                            </div>
                                                                                            <div class="col-xs-2 not-apply-survey">
                                                                                                <input type="checkbox" id="surveySend">
                                                                                                <label id="surveySendLbl" for="surveySend">Enviada</label>
                                                                                            </div>
                                                                                            <div class="col-xs-2 hide" id="surveyNotApplySection">
                                                                                                <input type="checkbox" id="surveyNotApply">
                                                                                                <label for="surveyNotApply">No aplica</label>
                                                                                            </div>
                                                                                            <div class="col-xs-2">
                                                                                                <input type="checkbox" id="activateSurvey">
                                                                                                <label for="activateSurvey">Activar encuesta</label>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="hide" style="background-color: white;" id="surveyTableDiv">
                                                                                            <hr>
                                                                                            <div class="row" style="padding-top:10px; padding-bottom:20px">
                                                                                                <div class="col-xs-12">
                                                                                                    <div style="display:flex;">
                                                                                                        <label class="toNormal" style="padding-left:10px;padding-right:6px;">Añadir teléfono: </label>
                                                                                                        <input class="form-control" id="phoneSurvey" name="phoneSurvey">
                                                                                                        <a id="addPhoneSurvey" title="Añadir teléfono" class="btn btn-primary">&nbsp;<i class="fa fa-arrow-down"></i>&nbsp;</a>
                                                                                                        <a id="addPhoneFamilyContact" title="Cargar teléfono del contratante" class="btn btn-primary" style="margin-left:30px"> Cargar teléfono del contratante</a>
                                                                                                        <a id="addPhoneContact" title="Cargar teléfono del contacto" class="btn btn-primary" style="margin-left:5px"> Cargar teléfono del contacto</a>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div class="row">
                                                                                                <div class="col-xs-5">
                                                                                                    <div class="table-responsive">
                                                                                                        <table id="surveys-table" class="table table-striped table-bordered display" cellspacing="0" width="100%"></table>
                                                                                                    </div>
                                                                                                </div>                                                                    
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </fieldset>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>                                                    
                                                        </fieldset>
                                                        <fieldset>
                                                            <legend class="legendBottom"><span class="label label-primary labelLgExp">Formularios</span></legend>
                                                            <div class="panel box box-primary">
                                                                <div class="box-header" id="headFormsSection">
                                                                    <h4 class="box-title">
                                                                        <a data-toggle="collapse" data-parent="#formsSection" href="#formsSection" aria-expanded="true"></a>
                                                                    </h4>
                                                                </div>
                                                                <div id="formsSection" class="box-collapse collapse in" aria-expanded="true">
                                                                    <div class="box-body">
                                                                        <div class="table-responsive">
                                                                            <table id="datatable-docs" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                                                        </div>  
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                        <fieldset id="carriersFieldset">
                                                            <legend class="legendBottom"><span id="porteadoresLbl" class="label label-primary labelLgExp">Porteadores</span></legend>
                                                            <div class="panel box box-primary">
                                                                <div class="box-header" id="headFormsSection">
                                                                    <h4 class="box-title">
                                                                        <a data-toggle="collapse" class="block-collapse" data-parent="#carriersSection" href="#carriersSection" aria-expanded="true"></a>
                                                                    </h4>
                                                                </div>
                                                                <div id="carriersSection" class="box-collapse collapse in" aria-expanded="true">
                                                                    <div class="box-body">
                                                                        <div class="row" style="padding-bottom: 10px;">
                                                                            <label for="carrierAdd" class="col-xs-1 control-label">Añadir porteador</label>
                                                                            <div class="col-xs-5">
                                                                                <select id="carrierAdd" name="carrierAdd" class="form-control select2"></select>
                                                                                <a href="#" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-new-carrier"><i class="fa fa-plus" aria-hidden="true"></i> NUEVO PORTEADOR</a>
                                                                            </div>          
                                                                            <label for="carriersTime" class="col-xs-1 control-label" id="carriersTimeLabel">Hora</label>
                                                                            <div class="col-xs-3">
                                                                                <div class="col-xs-4">
                                                                                    <div class="input-group bootstrap-timepicker timepicker">
                                                                                        <input type="text" size="5" class="form-control time" id="carriersTime" name="carriersTime">
                                                                                        <div class="input-group-addon">
                                                                                            <i class="fa fa-clock-o"></i>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="col-xs-4 hide">
                                                                                    <input type="checkbox" id="carriersTimeCheck">
                                                                                    <label for="carriersTimeCheck" class="control-label" id="carriersTimeCheckText">Confirmada</label>
                                                                                </div>                                                                    
                                                                            </div> 
                                                                                                                            
                                                                        </div>
                                                                        <div class="row">
                                                                            <!--<label for="carrierAdd" class="col-xs-1 control-label">Porteadores</label>-->
                                                                            <div class="col-xs-5">
                                                                                <div class="table-responsive">
                                                                                    <table id="carriers-table" class="table table-striped table-bordered display" cellspacing="0" width="100%"></table>
                                                                                </div>
                                                                            </div>                                                                    
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                        <fieldset id="carsFieldset">
                                                            <legend class="legendBottom"><span id="cochesLbl" class="label label-primary labelLgExp">Coches</span></legend>
                                                            <div class="panel box box-primary">
                                                                <div class="box-header" id="headCarsSection">
                                                                    <h4 class="box-title">
                                                                        <a data-toggle="collapse" data-parent="#carsSection" href="#carsSection" aria-expanded="true"></a>
                                                                    </h4>
                                                                </div>
                                                                <div id="carsSection" class="box-collapse collapse in" aria-expanded="true">
                                                                    <div class="box-body">
                                                                        <div class="row" id="addCarSelect">
                                                                            <label for="addCar" class="col-xs-1 control-label">Añadir coche</label>
                                                                            <div class="col-xs-11">
                                                                                <select id="addCar" name="addCar" class="form-control select2"></select>
                                                                                <a href="#" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-new-car"><i class="fa fa-plus" aria-hidden="true"></i> NUEVO COCHE</a>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row">
                                                                            <!--<label for="addCar" class="col-xs-1 control-label">Coches</label>-->
                                                                            <div class="col-xs-11">
                                                                                <div class="table-responsive" style="margin-top:10px">
                                                                                    <table id="carsTable" class="table table-striped table-bordered display" cellspacing="0" width="100%">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th class="text-center hide">ID</th>
                                                                                                <th class="text-center">Placa</th>
                                                                                                <th class="text-center">Marca</th>
                                                                                                <th class="text-center">Modelo</th>
                                                                                                <th class="text-center">Conductor</th>
                                                                                                <th class="text-center">Limpieza antes</th>
                                                                                                <th class="text-center">Limpieza después</th>
                                                                                                <th class="text-center">Eliminar</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody id="carsTableBody"></tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                        <fieldset>
                                                            <legend class="legendBottom"><span class="label label-primary labelLgExp">Observaciones</span></legend>    
                                                            <div id="notesThreadSection" style="margin-left: 1em;"></div>
                                                        </fieldset>
                                                    </div>
                                                </div>
                                            </div>                   
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
                            <li role="presentation" class="active"><a>C.SERVICIO</a></li>
                            <?php if($_SESSION['tellmebye'] == '1'){ ?>
								<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/tellmebye/'.$expedientID; ?>">TELLMEBYE</a></li>
							<?php } ?>
                            <li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/orden-trabajo/'.$expedientID; ?>">ORDEN DE TRABAJO</a></li>
                            <li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/documentacion/'.$expedientID; ?>">DOCUMENTACIÓN</a></li>
							<li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/documentos/'.$expedientID; ?>">DOCUMENTACIÓN PERSONALIZADA</a></li>
                            <li role="presentation"><a class="changeTab" href="<?php echo $utils->getRoute().'expediente/logs/'.$expedientID; ?>">LOGS</a></li>
                            <li role="presentation"><a id="goToAssistance" style="cursor: pointer;">ASISTENCIA</a></li>
                            <li class="deceasedData">Nº <span class="bolder numberExp"></span><span class="deceased"></span></li>
                            <li class="hide" id="associatedData" style="margin-top: 10px;"><span style="margin-left: 35px;">Asociado al expediente: </span><span class="bolder" id="associateNav"></span></li>
                            <li class="pull-right">
                                <button type="button" class="btn btn-primary btn-sm" id="summary">
                                    <i class="fa fa-arrow-right"></i> RESUMEN
                                </button>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/jquery.dataTables.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/icheck.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/defines.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/expedient/expedient-services/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>