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
</head>
<body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed statistics-page assistances-page servicesTimes-page">
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
                <li class="active">Horarios servicios personal</li>
            </ol>
        </section>
        <section id="block-content" class="content">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box">
                        <div class="box-header">
                            <div class="pull-left">
                                <h3 class="box-title"><i class="fa fa-pie-chart"></i> Estadísticas de horarios servicios personal</h3>                   
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
                                                <label class="control-label col-xs-3">
                                                    <input type="checkbox" id="usersCheck">
                                                    Personal
                                                </label>
                                                <div class="col-xs-6">
                                                    <select class="form-control" id="users" multiple disabled></select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label class="control-label col-xs-3">
                                                    <input type="checkbox" id="carriersCheck">
                                                    Porteadores
                                                </label>
                                                <div class="col-xs-6">
                                                    <select class="form-control" id="carriers" multiple disabled></select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label class="control-label col-xs-2">
                                                    <input type="checkbox" id="datePeriod">
                                                    Fechas
                                                </label>
                                                <div class="col-xs-10">
                                                    <div class="input-group">
                                                        <div class="input-group-addon small">Desde</div>
                                                        <input type="text" size="12" class="datepicker form-control" autocomplete="off" id="dateSince" disabled>
                                                        <div class="input-group-addon small">Hasta</div>
                                                        <input type="text" size="12" class="datepicker form-control" autocomplete="off" id="dateUntil" disabled>
                                                    </div>
                                                    <span class="label label-danger hide" id="dateError">El rango de fechas no es válido</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <button type="button" id="filter" class="btn btn-primary"><i class="fa fa-database"></i> APLICAR CONSULTA</button>
                                <button type="button" id="export" class="btn btn-secondary" disabled><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                <br><br>
                            </div>
                            <!-- <div id="tableDiv" class="row hide"> -->
                                <!-- <div class="col-xs-12"> -->
                                    <div class="table-responsive clearfix hide" id="summary" style="overflow: auto;">
                                        <table class="table table-striped table-bordered" id="summaryTable" width="100%" cellspacing="0">
                                            <thead id="performanceHead">
                                                <tr class="text-center">
                                                    <td>Usuario</td>
                                                    <!-- <td>Puesto</td> -->
                                                    <td>Recogida del Cadáver</td>
                                                    <td>Atención Familia</td>
                                                    <td>Documentos creados</td>
                                                    <td>Documentos visualizados</td>
                                                    <td>Servicios Diurnos</td>
                                                    <td>Servicios Nocturnos</td>
                                                    <td>Reparto de Esquelas</td>
                                                    <td>Juzgado</td>
                                                    <td>Certificado Médico</td>
                                                    <td>Creación de Eventos de Taller</td>
                                                    <td>Creación de Eventos de Matenimiento</td>
                                                    <td>Tiempo Medio de Respuesta</td>
                                                    <td>Expediente Lunes</td>
                                                    <td>Expediente Martes</td>
                                                    <td>Expediente Miércoles</td>
                                                    <td>Expediente Jueves</td>
                                                    <td>Expediente Viernes</td>
                                                    <td>Expediente Sábado</td>
                                                    <td>Expediente Domingo</td>
                                                    <td>Servicios de Porteo</td>
                                                </tr>
                                            </thead>
                                            <tbody id="performanceBody"></tbody>
                                        </table>
                                        
                                        <br>
                                    </div>
                                <!-- </div> -->
                            <!-- </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <br><br>
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
    <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/js/statistics/servicesTimes/functions.js?v=<?= CACHE_DATE ?>"></script>
</body>
</html>