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
        <title><?php echo $utils->getCompanyName(); ?> | Tarifas</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/extensions/Buttons/buttons.bootstrap.min.css?v=<?=CACHE_DATE?>">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed configuration-page price-page">
        <?php require_once($_SESSION['basePath'] . "view/configuration/modal/price-modal.php"); ?>
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
                        <li><a href="<?php echo $utils->getRoute(); ?>configuracion">Configuración</a></li>
                        <li class="active">Tarifas</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <?php require_once($_SESSION['basePath'] . "view/configuration/configuration-header.php"); ?>
                    <ul class="nav nav-tabs">
                        <li style="padding-right: 5px;" role="presentation" class="active"><a data-toggle="tab" href="#mainPrices" id="goMainPrices">Tarifas <span class="current-year"></span></a></li>
                        <li style="padding-right: 5px;" role="presentation" class="secondary-tab hide"><a data-toggle="tab" href="#secondaryPrices" id="goSecondaryPrices">Tarifas <span class="next-year"></span></a></li>
                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane fade in active" id="mainPrices">
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="box">
                                        <div class="box-header">
                                            <div class="pull-left">
                                                <h3 class="box-title"><i class="fa fa-eur" aria-hidden="true"></i> Gestión de Tarifas de <span class="current-year"></span></h3>
                                            </div>
                                            <div class="pull-right">
                                                <div class="box-actions">
                                                    <label>
                                                        Buscar:
                                                        <input id="input-search" class="form-control input-sm" aria-controls="datatable" type="search">
                                                    </label>
                                                    <a href="#" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal-new-price"><i class="fa fa-plus" aria-hidden="true"></i> NUEVA TARIFA</a>
                                                    <a class="btn btn-primary btn-sm hide" id="genNextYearPricesButton"></i> GENERAR TARIFAS <span class="next-year"></span></a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="box-body">
                                            <div class="table-responsive">
                                                <table id="datatable" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
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
                                                <h3 class="box-title"><i class="fa fa-eur" aria-hidden="true"></i> Impresión de Tarifas de <span class="current-year"></span></h3>
                                            </div>
                                            <div class="pull-right">
                                                <div class="box-actions">
                                                    <label>
                                                        Buscar:
                                                        <input id="input-search-template" class="form-control input-sm" aria-controls="datatable" type="search">
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="box-body">
                                            <div class="table-responsive">
                                                <table id="templates" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="secondary-tab hide tab-pane" id="secondaryPrices">
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="box">
                                        <div class="box-header">
                                            <div class="pull-left">
                                                <h3 class="box-title"><i class="fa fa-eur" aria-hidden="true"></i> Gestión de Tarifas de <span class="next-year"></span></h3>
                                            </div>
                                            <div class="pull-right">
                                                <div class="box-actions">
                                                    <label>
                                                        Buscar:
                                                        <input id="input-search-next" class="form-control input-sm" aria-controls="datatable" type="search">
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="box-body">
                                            <div class="table-responsive">
                                                <table id="datatable-next" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
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
                                                <h3 class="box-title"><i class="fa fa-eur" aria-hidden="true"></i> Impresión de Tarifas de <span class="next-year"></span></h3>
                                            </div>
                                            <div class="pull-right">
                                                <div class="box-actions">
                                                    <label>
                                                        Buscar:
                                                        <input id="input-search-template-next" class="form-control input-sm" aria-controls="datatable" type="search">
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="box-body">
                                            <div class="table-responsive">
                                                <table id="templates-next" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
                                            </div>
                                        </div>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?=CACHE_DATE?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/configuration/price/functions.js?v=<?=CACHE_DATE?>"></script>
    </body>
</html>