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

    $route = $utils->getRoute();    
?>
<!DOCTYPE html>
<html>
<head>
<title><?php echo $utils->getCompanyName(); ?> | Estadísticas</title>
<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
<link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
<link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.css?v=<?= CACHE_DATE ?>">
<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/minimal/purple.css?v=<?= CACHE_DATE ?>">
<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
<link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
</head>
<body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed generalexpenses-garage-page page">
<?php require_once($_SESSION['basePath'] . "view/statistics/invoiced/modal/modals.php"); ?>
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
        <li class="active">Facturación</li>
    </ol>
</section>
<section id="block-content" class="content">
    <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="box">
                <div class="box-header">
                    <div class="pull-left">
                        <p class="bolder large">
                            <i class="fa fa-money c-lile" aria-hidden="true"></i> Estadísticas de Facturación
                        </p>
                    </div>
                    <div class="pull-right">
                        <div class="box-actions">
                            <a href="#" id="genPDF"class="btn btn-default btn-sm btn-gen-pdf"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Gen. Facturación</a>
                        </div>
                    </div>
                </div>
                <div class="box-body box-filters centered bge-blue-light">
                    <form class="form-inline">
                        <label>
                            Filtrar por:
                        </label>
                        <div class="input-group">
                            <div class="input-group-addon small">AÑO</div>
                            <select class="form-control" id="year"></select>
                            <div class="input-group-addon small">MES</div>
                            <select class="form-control" id="month"></select>
                            <div class="input-group-addon small">TRIMESTRE</div>
                            <select class="form-control" id="trimester"></select>
                        </div>
                    </form>
                </div>                
                <div class="box-body box-filters centered">
                    <form class="form-inline">
                        <div class="input-group">
                            <label>Buscar: </label>
                            <div class="input-group-addon small">DESDE</div>
                            <input type="text" class="form-control datepicker" id="from" name="from" autocomplete="off">
                            <div class="input-group-addon small">HASTA</div>
                            <input type="text" class="form-control datepicker" id="to" name="to" autocomplete="off">
                            <div class="input-group-addon small"><a id="search"><i class="fa fa-search" aria-hidden="true"></i></a></div>
                        </div>
                    </form>
                </div>
                <div class="box-body box-filters centered bge-blue-light">
                    <form class="form-inline">
                        <label>1º PERÍODO</label>
                        <div class="input-group">
                            <div class="input-group-addon small">DESDE</div>
                            <input type="text" class="form-control datepicker" id="fromPer1" name="fromPer1" autocomplete="off">
                            <div class="input-group-addon small">HASTA</div>
                            <input type="text" class="form-control datepicker" id="toPer1" name="toPer1" autocomplete="off">
                        </div>
                        <label>2º PERÍODO</label>
                        <div class="input-group">
                            <div class="input-group-addon small">DESDE</div>
                            <input type="text" class="form-control datepicker" id="fromPer2" name="fromPer2" autocomplete="off">
                            <div class="input-group-addon small">HASTA</div>
                            <input type="text" class="form-control datepicker" id="toPer2" name="toPer2" autocomplete="off">
                        </div>
                        <div class="pull-right">
                            <div class="box-actions">
                                <a href="#" id="genPDFComp"class="btn btn-default btn-sm btn-gen-pdf"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> Gen. Comparativo Facturación</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div id="generals">
        <div class="box-statistic box-primary box">
            <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-pie-chart c-lile" aria-hidden="true"></i> % facturación general</h3>
            </div>
            <div class="box-body">
                <div class="col-xs-6">
                    <div id="data0" class="chartData"></div>
                </div>
                <div class="col-xs-6">
                    <div id="data00" class="chartData"></div>
                </div>
            </div>
        </div>
    </div>
    <div id="mortuaries"></div>   
</section>
</div>
</div>
<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
<?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/jquery.dataTables.min.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/dataTables.buttons.min.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
<script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.flash.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
<script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.html5.min.js"></script>
<script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.print.min.js"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/highcharts/code/options-chart.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
<script src="<?php echo $utils->getRoute(); ?>resources/js/statistics/invoiced/functions.js?v=<?= CACHE_DATE ?>"></script>
</body>
</html>