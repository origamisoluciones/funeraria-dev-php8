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
        <title><?php echo $utils->getCompanyName(); ?> | Limpieza General</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/minimal/purple.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed generalMortuary-cleanings-page page">
        <?php require_once($_SESSION['basePath'] . "view/cleanings/generalMortuary/modal/description.php"); ?>
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section class="content-header">
                    <h1>&nbsp;</h1>
                    <div style="display: flex;">
                        <span><strong>Tiempo de sesión restante:</strong></span>
                        <div class="progress">
                            <div id="sessionProgressBar" class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                                <strong><span id="barPercentage"></span></strong>
                            </div>
                        </div>
                    </div>
                    <ol class="breadcrumb">
                        <li><a href="<?php echo $utils->getRoute(); ?>inicio"><i class="fa fa-dashboard"></i> Inicio</a></li>
                        <li>Mantenimiento</li>
                        <li class="active">Resumen limpieza general</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="col-xs-4">
                                        <h3 class="box-title"><i class="fa fa-wrench" aria-hidden="true"></i> Registro de limpieza tanatorio</h3>                   
                                    </div>
                                    <div class="col-xs-8">
                                        <div class="box-actions pull-right">
                                            <label>
                                                Buscar: 
                                                <input id="input-search" class="form-control input-sm" aria-controls="datatable" type="search">                                            
                                            </label>
                                        </div>
                                        <div class="box-filters pull-right">
                                            <form class="form-inline">
                                                <div class="input-group">
                                                    <div class="input-group-addon small">DESDE</div>
                                                    <input type="text" class="form-control datepicker" id="from1" name="from1">
                                                </div>
                                                <div class="input-group">
                                                    <div class="input-group-addon small">HASTA</div>
                                                    <input type="text" class="form-control datepicker" id="to1" name="to1">
                                                </div>
                                                <button id="search1" name="search1" type="button" class="btn btn-primary"><i class="fa fa-search" aria-hidden="true"></i> Buscar</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="table-responsive">
                                        <table id="datatable" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                    </div>
                                </div>
                            </div>
                            <div class="box">
                                <div class="box-header">
                                    <div class="col-xs-4">
                                        <h3 class="box-title"><i class="fa fa-wrench" aria-hidden="true"></i> Registro de limpieza general</h3>
                                    </div>
                                    <div class="col-xs-8">
                                        <div class="box-actions pull-right">
                                            <label>
                                                Buscar: 
                                                <input id="input-search2" class="form-control input-sm" aria-controls="datatable" type="search">                                            
                                            </label>
                                        </div>
                                        <div class="box-filters pull-right">
                                            <form class="form-inline">
                                                <div class="input-group">
                                                    <div class="input-group-addon small">DESDE</div>
                                                    <input type="text" class="form-control datepicker" id="from2" name="from2">
                                                </div>
                                                <div class="input-group">
                                                    <div class="input-group-addon small">HASTA</div>
                                                    <input type="text" class="form-control datepicker" id="to2" name="to2">
                                                </div>
                                                <button id="search2" name="search2" type="button" class="btn btn-primary"><i class="fa fa-search" aria-hidden="true"></i> Buscar</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div class="clearfix table-responsive">
                                        <table id="datatable2" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
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
        <script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/fixedheader/3.1.2/js/dataTables.fixedHeader.min.js" type="text/javascript"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/dataTables.buttons.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.flash.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.html5.min.js"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.print.min.js"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?=CACHE_DATE?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/cleanings/generalMortuary/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>