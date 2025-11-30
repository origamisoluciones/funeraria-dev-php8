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
        <title><?php echo $utils->getCompanyName(); ?> | Gastos Generales</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/minimal/purple.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed generalexpenses-garage-page page">
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
                        <li>Taller</li>
                        <li class="active">Gastos Generales</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="col-xs-4">
                                        <h3 class="box-title"><i class="fa fa-car" aria-hidden="true"></i> Gastos Generales</h3>
                                    </div>
                                    <div class="col-xs-12">
                                        <div class="box-filters pull-right">
                                            <form class="form-inline">
                                                <label>
                                                    Filtrar por: 
                                                </label>
                                                <div class="form-group form-group-client">
                                                    <label class="col-xs-3 control-label toNormal">VEHÍCULO</label>
                                                    <div class="col-xs-8" style="padding-left: 0px!important;">
                                                        <div id="divCars" class="input-group" >
                                                            <select class="form-control" id="cars"></select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id="filtersVehicles" class="input-group">
                                                    <div class="input-group-addon small">AÑO</div>
                                                    <select class="form-control" id="year"></select>
                                                    <div class="input-group-addon small">MES</div>
                                                    <select class="form-control" id="month"></select>
                                                    <div class="input-group-addon small">TRIMESTRE</div>
                                                    <select class="form-control" id="trimester"></select>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp"><strong>Averías</strong></span> - <span id="failuresLbl" class="label label-info labelLgExp"></span>
                                            <div class="box-actions">
                                                <label>
                                                    Buscar:
                                                    <input id="input-search" class="form-control input-sm" aria-controls="datatable" type="search">
                                                </label>
                                            </div>
                                        </legend>
                                        <div class="table-responsive clearfix">
                                            <table id="datatable" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp"><strong>Mantenimientos</strong></span> - <span id="upkeepsLbl" class="label label-info labelLgExp"></span>
                                            <div class="box-actions">
                                                <label>
                                                    Buscar:
                                                    <input id="input-search2" class="form-control input-sm" aria-controls="datatable" type="search">
                                                </label>
                                            </div>
                                        </legend>
                                        <div class="table-responsive clearfix">
                                            <table id="datatable2" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                    <legend class="legendBottom"><span class="label label-primary labelLgExp"><strong>ITV</strong></span> - <span id="itvLbl" class="label label-info labelLgExp"></span></span>
                                            <div class="box-actions">
                                                <label>
                                                    Buscar:
                                                    <input id="input-search3" class="form-control input-sm" aria-controls="datatable" type="search">
                                                </label>
                                            </div>
                                        </legend>
                                        <div class="table-responsive clearfix">
                                            <table id="datatable3" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp"><strong>Seguro</strong></span> - <span id="insuranceLbl" class="label label-info labelLgExp"></span></span></span>
                                            <div class="box-actions">
                                                <label>
                                                    Buscar:
                                                    <input id="input-search4" class="form-control input-sm" aria-controls="datatable" type="search">
                                                </label>
                                            </div>
                                        </legend>
                                        <div class="table-responsive clearfix">
                                            <table id="datatable4" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend class="legendBottom"><span class="label label-primary labelLgExp"><strong>Repostaje</strong></span> - <span id="refuelLbl" class="label label-info labelLgExp"></span></span></span></span>
                                            <div class="box-actions">
                                                <label>
                                                    Buscar:
                                                    <input id="input-search5" class="form-control input-sm" aria-controls="datatable" type="search">
                                                </label>
                                            </div>
                                        </legend>
                                        <div class="table-responsive clearfix">
                                            <table id="datatable5" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/garage/generalExpenses/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>