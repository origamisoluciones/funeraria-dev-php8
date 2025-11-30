<?php 
    session_start();

    if(!isset($_SESSION['basePath'])){
        $_SESSION['basePath'] = $_SERVER['DOCUMENT_ROOT'] . "/";
    }

    require_once($_SESSION['basePath'] . "core/tools/utils.php");

    $utils = new Utils;

    if(!isset($_SESSION['user']) || !isset($_SESSION['type'])){
        header('Location: inicio');
        return;
    }
    $route = $utils->getRoute();
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Información</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Select/select.bootstrap.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/fullcalendar/fullcalendar.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/fullcalendar/fullcalendar.print.css?v=<?= CACHE_DATE ?>" media="print">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/colorpicker/bootstrap-colorpicker.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/all.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/colorpicker/bootstrap-colorpicker.min.css?v=<?= CACHE_DATE ?>">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed page info info-page">
        <?php require_once($_SESSION['basePath'] . "view/serviceControl/modal/pendingTasks-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/cremations/modal/choose-expedient-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/cremations/modal/cremations-new-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/cremations/modal/cremations-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/invoices/modal/invoice-print-modal.php"); ?>
        <div class="wrapper">
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/header.php"); ?>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/main-sidebar.php"); ?>
            <div class="content-wrapper">
                <section class="content-header">
                    <h1>Información global</h1>
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
                        <li class="active">Información</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <?php if($_SESSION['company'] != '12'){ ?>
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="box">
                                    <div class="box-header">
                                        <div class="pull-left">
                                            <h3 class="box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Tareas pendientes</h3>
                                        </div>
                                        <div class="pull-right">
                                            <div class="box-actions">
                                                <label>
                                                    Buscar:
                                                    <input id="searchPending" class="form-control input-sm" aria-controls="datatable" type="search">
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="box-body">
                                        <div class="table-responsive">
                                            <table id="pendingExpedients" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php } ?>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Resumen de hoy</h3>
                                    </div>
                                    <div class="pull-right">
                                        <button type="button" class="btn btn-primary btn-sm" id="genPDF"><i class="fa fa-file-pdf-o"></i> PDF</button>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div id="todaySummary"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Cremaciones de hoy</h3>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div id="todayCremations"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Resumen de mañana</h3>
                                    </div>
                                    <div class="pull-right">
                                        <button type="button" class="btn btn-primary btn-sm" id="genPDFTomorrow"><i class="fa fa-file-pdf-o"></i> PDF</button>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div id="tomorrowSummary"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Cremaciones de mañana</h3>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div id="tomorrowCremations"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">
                                    <div class="pull-left">
                                        <h3 class="box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Calendario de cremaciones</h3>
                                    </div>
                                </div>
                                <div class="box-body">
                                    <div id="legend">
                                        <canvas width="15px" height="15px" style="background-color: #f47d42"></canvas> Reservada
                                        <canvas width="15px" height="15px" style="background-color: #614126"></canvas> Confirmada
                                    </div>
                                    <div id="calendar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="adminSection">
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="box">
                                    <div class="box-header">
                                        <div class="pull-left">
                                            <h3 class="box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Facturas pendientes de cobro</h3>
                                        </div>
                                        <div class="pull-right">
                                            <div class="box-actions">
                                                <label>
                                                    Buscar:
                                                    <input id="searchPendingInvoices" class="form-control input-sm" aria-controls="datatable" type="search">
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="box-body">
                                        <div class="table-responsive">
                                            <table id="pendingInvoices" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="box">
                                    <div class="box-header">
                                        <div class="pull-left">
                                            <h3 class="box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Facturas cobradas</h3>
                                        </div>
                                        <div class="pull-right">
                                            <div class="box-actions">
                                                <label>
                                                    Buscar:
                                                    <input id="searchInvoices" class="form-control input-sm" aria-controls="datatable" type="search">
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="box-body">
                                        <div class="table-responsive">
                                            <table id="invoices" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="box">
                                    <div class="box-header">
                                        <div class="pull-left">
                                            <h3 class="box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Facturas pendientes de pago</h3>
                                        </div>
                                        <div class="pull-right">
                                            <div class="box-actions">
                                                <label>
                                                    Buscar:
                                                    <input id="searchPendingReceivedInvoices" class="form-control input-sm" aria-controls="datatable" type="search">
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="box-body">
                                        <div class="table-responsive">
                                            <table id="pendingReceivedInvoices" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="box">
                                    <div class="box-header">
                                        <div class="pull-left">
                                            <h3 class="box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Facturas pagadas</h3>
                                        </div>
                                        <div class="pull-right">
                                            <div class="box-actions">
                                                <label>
                                                    Buscar:
                                                    <input id="searchReceivedInvoices" class="form-control input-sm" aria-controls="datatable" type="search">
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="box-body">
                                        <div class="table-responsive">
                                            <table id="receivedInvoices" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br>
                </section>
            </div>
            <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer-static-bottom-actions.php"); ?>
        </div>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/footer.php"); ?>
        <script src="https://cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/fixedheader/3.1.2/js/dataTables.fixedHeader.min.js" type="text/javascript"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Select/dataTables.select.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/dataTables.buttons.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.flash.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.html5.min.js"></script>
        <script src="//cdn.datatables.net/buttons/1.4.2/js/buttons.print.min.js"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/fullcalendar/fullcalendar.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/colorpicker/bootstrap-colorpicker.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/fullcalendar/locale/es.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.full.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/icheck.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/colorpicker/bootstrap-colorpicker.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/info/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>