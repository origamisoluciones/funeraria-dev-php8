<?php
    header('Cache-Control: no cache');
    session_cache_limiter('private_no_expire');

    session_start();

    if(!isset($_SESSION['user']) || !isset($_SESSION['type'])){
        header('Location: inicio');
        return;
    }

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/";
    }

    require_once($_SESSION['basePath'] . "core/tools/utils.php");
    
    $utils = new Utils;

    if(isset($_GET['id'])){
        $id = $_GET['id'];
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Estadísticas - Plantillas</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed configuration-page times-edit-page">
        <?php require_once($_SESSION['basePath'] . "view/configuration/modal/cemetery-modal.php"); ?>
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section class="content-header">
                    <h1>Panel de Editar Plantilla de Tiempos de Respuesta</h1>
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
                        <li><a href="<?php echo $utils->getRoute(); ?>configuracion/estadisticas">Estadísticas</a></li>
                        <li class="active">Editar plantilla de tiempos de respuesta</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div id="block-message"></div>
                    <?php require_once($_SESSION['basePath'] . "view/configuration/configuration-header.php"); ?>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <h3 class="box-title"><i class="fa fa-pie-chart fa-small" aria-hidden="true"></i> Editar Plantilla para Tiempos de Respuesta</h3>
                                </div>
                                <div class="box-body">
                                    <form class="form-horizontal">
                                        <input type="hidden" id="ID" value="<?php echo $id; ?>">
                                        <div class="form-group">
                                            <label for="templateName" class="col-xs-1 control-label">Nombre</label>
                                            <div class="col-xs-10">
                                                <input type="text" id="templateName" class="form-control">
                                                <span class="inputError" id="nameError"></span>
                                            </div>
                                        </div>
                                        <fieldset>
                                            <legend>Datos de solicitud</legend>
                                            <div class="row">
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-6">
                                                            <input type="checkbox" id="dateCheck">
                                                            Fecha
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="date" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-6">
                                                            <input type="checkbox" id="callTimeCheck">
                                                            Hora llamada
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group bootstrap-timepicker timepicker">
                                                                <input type="text" size="12" class="time" id="callTime" disabled>
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-6">
                                                            <input type="checkbox" id="arriveTimeCheck">
                                                            Hora llegada
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group bootstrap-timepicker timepicker">
                                                                <input type="text" size="12" class="time" id="arriveTime" disabled>
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-1">
                                                            <input type="checkbox" id="datePeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="dateSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="dateUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-1">
                                                            <input type="checkbox" id="callTimePeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="time" id="callTimeSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="time" id="callTimeUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-1">
                                                            <input type="checkbox" id="arriveTimePeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="arriveTimeSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="datepicker form-control" id="arriveTimeUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <input type="checkbox" id="dateCheckLength" disabled>
                                                        <label>Año</label>
                                                        <select id="year" disabled></select>
                                                        <label>Mes</label>
                                                        <select id="month" disabled></select>
                                                        <label>Trimestre</label>
                                                        <select id="trimester" disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend>Datos de entrada</legend>
                                            <div class="row">
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-6">
                                                            <input type="checkbox" id="startDateCheck">
                                                            Fecha entrada
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="startDate" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-1">
                                                            <input type="checkbox" id="startDatePeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="time" id="startDateSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="time" id="startDateUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-6">
                                                            <input type="checkbox" id="startTimeCheck">
                                                            Hora entrada
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group bootstrap-timepicker timepicker">
                                                                <input type="text" size="12" class="time" id="startTime" disabled>
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-1">
                                                            <input type="checkbox" id="startTimePeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="time" id="startTimeSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="time" id="startTimeUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend>Datos de fallecimiento</legend>
                                            <div class="row">
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-6">
                                                            <input type="checkbox" id="deceasedDateCheck">
                                                            Fecha fallecimiento
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="deceasedDate" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-1">
                                                            <input type="checkbox" id="deceasedDatePeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="time" id="deceasedDateSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="time" id="deceasedDateUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-6">
                                                            <input type="checkbox" id="deceasedTimeCheck">
                                                            Hora fallecimiento
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group bootstrap-timepicker timepicker">
                                                                <input type="text" size="12" class="time" id="deceasedTime" disabled>
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-1">
                                                            <input type="checkbox" id="deceasedTimePeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="time" id="deceasedTimeSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="time" id="deceasedTimeUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-6">
                                                            <input type="checkbox" id="deceasedInCheck">
                                                            Fallecido en
                                                        </label>
                                                        <div class="col-xs-6 select2DeceasedIn">
                                                            <select id="deceasedIn" multiple disabled></select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-3">
                                                            <input type="checkbox" id="deceasedProvinceCheck">
                                                            Provincias
                                                        </label>
                                                        <div class="col-xs-9">
                                                            <select id="deceasedProvinces" multiple disabled></select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-2">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-4">
                                                            <input type="checkbox" id="deceasedLocationCheck">
                                                            Provincias
                                                        </label>
                                                        <div class="col-xs-8">
                                                            <select id="deceasedProvince" class="province" disabled></select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-2">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-4">
                                                            Localidades
                                                        </label>
                                                        <div class="col-xs-8">
                                                            <select id="deceasedLocation" class="location" disabled></select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend>Datos de inhumacion</legend>
                                            <div class="row">
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-6">
                                                            <input type="checkbox" id="funeralDateCheck">
                                                            Fecha inhumación
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group date">
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-calendar"></i>
                                                                </div>
                                                                <input type="text" size="12" class="datepicker form-control" id="funeralDate" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-1">
                                                            <input type="checkbox" id="funeralDatePeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="time" id="funeralDateSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="time" id="funeralDateUntil" disabled>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-6">
                                                            <input type="checkbox" id="funeralHomeCheck">
                                                            Funeraria
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <select id="funeralHome" multiple disabled></select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-xs-3">    
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-6">
                                                            <input type="checkbox" id="funeralTimeCheck">
                                                            Hora inhumación
                                                        </label>
                                                        <div class="col-xs-6">
                                                            <div class="input-group bootstrap-timepicker timepicker">
                                                                <input type="text" size="12" class="time" id="funeralTime" disabled>
                                                                <div class="input-group-addon">
                                                                    <i class="fa fa-clock-o"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-3">
                                                    <div class="form-group">
                                                        <label class="control-label col-xs-1">
                                                            <input type="checkbox" id="funeralTimePeriod" disabled>
                                                        </label>
                                                        <div class="col-xs-11">
                                                            <div class="input-group">
                                                                <div class="input-group-addon small">Desde</div>
                                                                <input type="text" size="12" class="time" id="funeralTimeSince" disabled>
                                                                <div class="input-group-addon small">Hasta</div>
                                                                <input type="text" size="12" class="time" id="funeralTimeUntil" disabled>
                                                            </div>
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
            </div>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom.php"); ?>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/jquery.dataTables.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?=CACHE_DATE?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/statistics/times/edit/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>