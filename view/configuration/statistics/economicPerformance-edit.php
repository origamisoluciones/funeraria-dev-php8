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
?>
<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Estadísticas - Plantillas</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed statistics-page assistances-page">
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
            <section class="content-header">
                <h1>Panel de Editar Plantilla de Rendimiento Económico</h1>
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
                    <li class="active">Editar plantilla de rendimiento económico</li>
                </ol>
            </section>
            <section id="block-content" class="content">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="box">
                            <div class="box-header">
                                <div class="pull-left">
                                    <h3 class="box-title"><i class="fa fa-pie-chart"></i> Editar plantilla para Rendimiento Económico</h3>                   
                                </div>
                                <div class="pull-right">
                                    <button class="btn btn-primary btn-sm btn-filters inline-block hide" data-toggle="collapse" data-target="#filters">
                                        FILTROS
                                        <i class="fa fa-angle-down"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="box-body">
                                <div id="filters">
                                    <legend>Plantilla</legend>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                    Nombre de la plantilla
                                                    </label>
                                                    <div class="col-xs-6">
                                                        <div class="input-group">
                                                            <input type="text" size="80" class="form-control" id="templateName">
                                                            <span class="inputError" id="templateNameError"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
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
                                            </div>
                                            <div class="col-xs-4">
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
                                                        <span class="label label-danger hide" id="dateError">El rango de fechas no es válido</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <button type="button" id="saveTemplate" class="btn btn-primary"><i class="fa fa-list-alt"></i> GUARDAR PLANTILLA</button>
                                    <br><br>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?=CACHE_DATE?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/stickytableheaders/jquery.stickytableheaders.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/statistics/economicPerformance/edit/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>