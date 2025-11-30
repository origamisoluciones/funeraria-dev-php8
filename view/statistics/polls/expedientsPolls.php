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
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.css">
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
                <li class="active">Encuestas de satisfacción</li>
            </ol>
        </section>
        <section id="block-content" class="content">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box">
                        <div class="box-header">
                            <div class="pull-left">
                                <h3 class="box-title"><i class="fa fa-pie-chart"></i> Estadísticas de encuestas de satisfacción</h3>                   
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
                                        <div class="alert alert-info alert-dismissible fade in" role="alert"> En caso de no seleccionar ningún valor se realizará la búsqueda sobre todos los posibles.</div>
                                    </div>
                                </div>
                                    <div class="row spaceBottom">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label class="control-label col-xs-4">
                                                    <input type="checkbox" id="datePeriod">
                                                    Fecha
                                                </label>
                                                <div class="col-xs-6">
                                                <div class="input-group">
                                                        <div class="input-group-addon small">Desde</div>
                                                        <input type="text" size="12" class="datepicker form-control" id="dateSince" autocomplete="off" disabled>
                                                        <div class="input-group-addon small">Hasta</div>
                                                        <input type="text" size="12" class="datepicker form-control" id="dateUntil" autocomplete="off" disabled>
                                                    </div>
                                                    <span class="label label-danger hide" id="dateError">El rango de fechas no es válido</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row spaceBottom">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label class="control-label col-xs-4">
                                                    <input type="checkbox" id="mortuaryCheck">
                                                    Centro de coste
                                                </label>
                                                <div class="col-xs-8">
                                                    <select class="form-control" id="mortuary" multiple disabled></select>
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
                                                <div class="col-xs-8">
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
                                                <div class="col-xs-8">
                                                    <select class="form-control" id="client" multiple disabled></select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row spaceBottom">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label class="control-label col-xs-4">
                                                    <input type="checkbox" id="pollCheck">
                                                    Encuesta
                                                </label>
                                                <div class="col-xs-8">
                                                    <select class="form-control" id="poll" multiple disabled></select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <button type="button" id="filter" class="btn btn-primary"><i class="fa fa-database"></i> APLICAR CONSULTA</button>
                                <button type="button" id="exportSummary" class="btn btn-secondary" style="margin-left: 0.25em" disabled><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                <br><br>
                            </div>
                            <div id="summary-tables">
                                <div class="table-responsive clearfix" id="summary-'+index+'" style="overflow-x:hidden">
                                    <table class="table table-striped table-bordered" id="summaryTable" width="100%" cellspacing="0">
                                        <thead>
                                            <tr class="text-center">
                                                <th class="text-center">EXPEDIENTE</th>
                                                <th class="text-center">FALLECIDO</th>
                                                <th class="text-center">ENCUESTA</th>
                                                <th class="text-center">VECES ENVIADA</th>
                                                <th class="text-center">VECES RESPONDIDA</th>
                                                <th class="text-center">PUNTUACIÓN MEDIA (SOBRE 5)</th>
                                                <th class="text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody id="summaryBody">
                                            <tr style="background-color:white!important">
                                                <td colspan="6">
                                                    <div class="alert alert-warning">No hay datos para mostrar en esta tabla.</div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/stickytableheaders/jquery.stickytableheaders.min.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/js/statistics/polls/functions.js?v=<?= CACHE_DATE ?>"></script>
    
</body>
</html>