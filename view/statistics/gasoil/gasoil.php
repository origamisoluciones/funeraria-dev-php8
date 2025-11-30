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
    $ivaLabel = $utils->getIvaLabel();
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
                <li class="active">Cremaciones</li>
            </ol>
        </section>
        <section id="block-content" class="content">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box">
                        <div class="box-header">
                            <div class="pull-left">
                                <h3 class="box-title"><i class="fa fa-pie-chart"></i> Estadísticas de cremaciones</h3>                   
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
                                                <label class="control-label col-xs-6">
                                                    <input type="checkbox" id="dateCheck">
                                                    Fecha de Pedido
                                                </label>
                                                <div class="col-xs-6">
                                                    <div class="input-group date">
                                                        <div class="input-group-addon">
                                                            <i class="fa fa-calendar"></i>
                                                        </div>
                                                        <input type="text" size="12" class="datepicker form-control" id="date" autocomplete="off" disabled>
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
                                                        <input type="text" size="12" class="datepicker form-control" id="dateSince" autocomplete="off" disabled>
                                                        <div class="input-group-addon small">Hasta</div>
                                                        <input type="text" size="12" class="datepicker form-control" id="dateUntil" autocomplete="off" disabled>
                                                    </div>
                                                    <span class="label label-danger hide" id="datePeriodError">El rango de fechas no es válido</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>                              
                                    <div class="row spaceBottom">
                                        <div class="col-xs-4">
                                            <div class="form-group">
                                                <label class="control-label col-xs-6">
                                                    <input type="checkbox" id="supplierCheck">
                                                    Proveedor
                                                </label>
                                                <div class="col-xs-6">
                                                    <select class="form-control" id="supplier" multiple disabled></select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>               
                                </fieldset>
                                <button type="button" id="filter" class="btn btn-primary"><i class="fa fa-database"></i> APLICAR CONSULTA</button>
                                <button type="button" id="export" class="btn btn-secondary" disabled><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>
                                <br><br>
                            </div>
                            <div class="table-responsive clearfix" id="gasoil">
                                <table class="table table-striped table-bordered text-center" id="gasoilYearTable" width="100%" cellspacing="0">
                                    <thead>
                                        <tr class="text-center">
                                            <td>Fecha</td>
                                            <td>Mes</td>
                                            <td>Litros</td>
                                            <td>€/Litro</td>
                                            <td>Neto</td>
                                            <td><?= $ivaLabel ?></td>                                                                            
                                            <td>Total</td>                                                                            
                                        </tr>
                                    </thead>
                                    <tbody id="gasoilBody">
                                        <tr>
                                            <td colspan="13">
                                                <div class="alert alert-warning">Realice una consulta para obtener datos</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section id="block-content" class="content">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box">
                        <div class="box-header">
                            <div style="width: 1000px" class="pull-left">
                                <h3 style="margin-right: 2%" class="box-title"><i class="fa fa-pie-chart"></i> Registro de cremaciones por año</h3>
                                Seleccione un año:  <select  class="form-control" id="yearTemplate"></select>    
                                <button type="button" id="export-2" class="btn btn-secondary" style="margin-left: 1%" disabled><i class="fa fa-file-excel-o"></i> EXPORTAR RESULTADO</button>     
                            </div>
                        </div>
                        <div class="box-body">
                            <div class="table-responsive clearfix" id="gasoil">
                            
                                <table class="table table-striped table-bordered text-center" id="gasoilYearTable" width="100%" cellspacing="0">
                                    <thead>
                                        <tr class="text-center">
                                            <td>#</td>
                                            <td>Enero</td>
                                            <td>Febrero</td>
                                            <td>Marzo</td>
                                            <td>Abril</td>
                                            <td>Mayo</td>
                                            <td>Junio</td>                                                                            
                                            <td>Julio</td>                                                                            
                                            <td>Agosto</td>                                                                            
                                            <td>Septiembre</td>                                                                            
                                            <td>Octubre</td>                                                                            
                                            <td>Noviembre</td>                                                                            
                                            <td>Diciembre</td>                                                                            
                                            <td>Total</td>                                                                            
                                        </tr>
                                    </thead>
                                    <tbody id="cremationBody">
                                        <tr id="tdCremacion">
                                        </tr>
                                        <tr id="tdLitres">
                                        </tr>
                                        <tr id="tdLitresCremation">
                                        </tr>
                                        <tr id="tdCostGasoil">
                                        </tr>
                                        <tr id="tdCostCremation">
                                        </tr>
                                        <tr id="alert-message">
                                            <td colspan="14">
                                                <div class="alert alert-warning">Realice una consulta para obtener datos</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                              
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
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/stickytableheaders/jquery.stickytableheaders.min.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
    <script src="<?php echo $utils->getRoute(); ?>resources/js/statistics/gasoil/functions.js?v=<?= CACHE_DATE ?>"></script>
</body>
</html>