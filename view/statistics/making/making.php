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
<title><?php echo $utils->getCompanyName(); ?> | Estadísticas</title>
<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
<link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css">
</head>
<body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed statistics-page assistances-page">
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
                    <li>Estadísticas</li>
                    <li class="active">Confección</li>
                </ol>
            </section>
            <section id="block-content" class="content">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="box">
                            <div class="box-header">
                                <div class="pull-left">
                                    <h3 class="box-title"><i class="fa fa-pie-chart"></i> Estadísticas de confecciones</h3>                   
                                </div>
                                <div class="pull-right">
                                    Aplicar plantilla:  <select class="form-control" id="template"></select>
                                    <button class="btn btn-primary btn-sm btn-filters inline-block" data-toggle="collapse" data-target="#filters">
                                        FILTROS
                                        <i class="fa fa-angle-down"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="box-body">
                                <div id="filters" class="collapse">
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp">Filtros</span></legend>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="requestDateCheck">
                                                        Fecha de solicitud
                                                    </label>
                                                    <div class="col-xs-6">
                                                        <div class="input-group date">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                            <input type="text" size="12" class="datepicker form-control" id="requestDate" autocomplete="off" disabled>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-1">
                                                        <input type="checkbox" id="requestDatePeriod" disabled>
                                                    </label>
                                                    <div class="col-xs-11">
                                                        <div class="input-group">
                                                            <div class="input-group-addon small">Desde</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="requestDateSince" autocomplete="off" disabled>
                                                            <div class="input-group-addon small">Hasta</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="requestDateUntil" autocomplete="off" disabled>
                                                        </div>
                                                        <span class="label label-danger hide" id="requestDateError">El rango de fechas no es válido</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="expedientTypeCheck">
                                                        Tipo de expediente
                                                    </label>
                                                    <div class="col-xs-6">
                                                        <select class="form-control" id="expedientType" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="clientTypeCheck">
                                                        Tipo de cliente
                                                    </label>
                                                    <div class="col-xs-6">
                                                        <select class="form-control" id="clientType" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-2">
                                                        <input type="checkbox" id="clientCheck" disabled>
                                                        Cliente
                                                    </label>
                                                    <div class="col-xs-10">
                                                        <select class="form-control" id="client" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="birthdateCheck">
                                                        Fecha de nacimiento
                                                    </label>
                                                    <div class="col-xs-6">
                                                        <div class="input-group date">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                            <input type="text" size="12" class="datepicker form-control" id="birthdate" autocomplete="off" disabled>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-1">
                                                        <input type="checkbox" id="birthdatePeriod" disabled>
                                                    </label>
                                                    <div class="col-xs-11">
                                                        <div class="input-group">
                                                            <div class="input-group-addon small">Desde</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="birthdateSince" autocomplete="off" disabled>
                                                            <div class="input-group-addon small">Hasta</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="birthdateUntil" autocomplete="off" disabled>
                                                        </div>
                                                        <span class="label label-danger hide" id="birthdateError">El rango de fechas no es válido</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="deceasedDateCheck">
                                                        Fecha de fallecimiento
                                                    </label>
                                                    <div class="col-xs-6">
                                                        <div class="input-group date">
                                                            <div class="input-group-addon">
                                                                <i class="fa fa-calendar"></i>
                                                            </div>
                                                            <input type="text" size="12" class="datepicker form-control" id="deceasedDate" autocomplete="off" disabled>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-1">
                                                        <input type="checkbox" id="deceasedDatePeriod" disabled>
                                                    </label>
                                                    <div class="col-xs-11">
                                                        <div class="input-group">
                                                            <div class="input-group-addon small">Desde</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="deceasedDateSince" autocomplete="off" disabled>
                                                            <div class="input-group-addon small">Hasta</div>
                                                            <input type="text" size="12" class="datepicker form-control" id="deceasedDateUntil" autocomplete="off" disabled>
                                                        </div>
                                                        <span class="label label-danger hide" id="deceasedDateError">El rango de fechas no es válido</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-3">
                                                        <input type="checkbox" id="deceasedInCheck">
                                                        Fallecido en
                                                    </label>
                                                    <div class="col-xs-6">
                                                        <select class="form-control" id="deceasedIn" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="doctorCheck">
                                                        Médico
                                                    </label>
                                                    <div class="col-xs-6">
                                                        <select class="form-control" id="doctor" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-2">
                                                        <input type="checkbox" id="tribunalCheck">
                                                        Juzgado
                                                    </label>
                                                    <div class="col-xs-6">
                                                        <input type="text" class="form-control" id="tribunal" disabled>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row spaceBottom">
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-4">
                                                        <input type="checkbox" id="mortuaryCheck">
                                                        Casa mortuoria
                                                    </label>
                                                    <div class="col-xs-6">
                                                        <select class="form-control" id="mortuary" multiple disabled></select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-4">
                                                <div class="form-group">
                                                    <label class="control-label col-xs-2">
                                                        <input type="checkbox" id="deceasedRoomCheck">
                                                        Sala
                                                    </label>
                                                    <div class="col-xs-8">
                                                        <input type="number" class="form-control" id="deceasedRoom" disabled>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <button type="button" id="filter" class="btn btn-primary"><i class="fa fa-database"></i> APLICAR CONSULTA</button>
                                    <br><br>
                                </div>
                                <div class="hide" id="tableSection">
                                    <div>
                                        Total expedientes: <span class="badge badge-primary" id="totalExpedients">0</span>
                                    </div>
                                    <div>
                                        <label>Buscar: </label>
                                        <div class="input-group">
                                            <input id="input-search" class="form-control input-sm" aria-controls="datatable" type="search">
                                        </div>
                                    </div>
                                </div>
                                <br>
                                <div class="clearfix table-responsive">
                                    <table id="makingTable" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
        </div>
    <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/stickytableheaders/jquery.stickytableheaders.min.js?v=<?= CACHE_DATE ?>"></script>
    <script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/fixedheader/3.1.2/js/dataTables.fixedHeader.min.js" type="text/javascript"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/dataTables.buttons.min.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
    <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.flash.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
    <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.html5.min.js"></script>
    <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.print.min.js"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/js/statistics/making/functions.js?v=<?= CACHE_DATE ?>"></script>
</body>
</html>