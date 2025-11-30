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
    $ivaLabel = $utils->getIvaLabel();
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $utils->getCompanyName(); ?> | Facturas</title>
        <?php require_once($_SESSION['basePath'] . "resources/themes/adminlte/head.php"); ?>
        <link rel="stylesheet" href="<?php echo $utils->getRoute();?>resources/themes/adminlte/plugins/datatables/dataTables.bootstrap.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/select2/select2.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/iCheck/minimal/purple.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" href="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/datepicker3.css?v=<?= CACHE_DATE ?>">
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css">
    </head>
    <body class="hold-transition skin-black sidebar-collapse sidebar-mini fixed invoices-page page">
        <?php require_once($_SESSION['basePath'] . "view/invoices/modal/invoices-edit-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/invoices/modal/invoice-print-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/invoices/modal/invoices-payments-modal.php"); ?>
        <?php require_once($_SESSION['basePath'] . "view/invoices/modal/invoice-import-breakdown.php"); ?>
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
                        <li class="active">Facturas</li>
                    </ol>
                </section>
                <section id="block-content" class="content">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="box">
                                <div class="box-header">                    
                                    <h3 class="box-title"><i class="fa fa-file" aria-hidden="true"></i> Gestión de Facturas</h3>
                                </div>
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-xs-12 box-filters pull-left">
                                            <form class="form-inline">
                                                <div class="input-group" style="margin-bottom: 10px;">
                                                    <div class="input-group-addon small">AÑO</div>
                                                    <select class="form-control" id="year"></select>
                                                    <div class="input-group-addon small">MES</div>
                                                    <select class="form-control" id="month"></select>
                                                    <div class="input-group-addon small">TRIMESTRE</div>
                                                    <select class="form-control" id="trimester"></select>
                                                    <div class="input-group-addon small">TIPO DE EXPEDIENTE</div>
                                                    <select class="form-control" id="type">
                                                        <option value="0">--</option>
                                                        <option value="1">Defunción</option>
                                                        <option value="3">Varios</option>
                                                    </select>
                                                    <div class="input-group-addon small">TIPO DE CLIENTE</div>
                                                    <select class="form-control" id="clientType">
                                                        <option value="0">--</option>
                                                        <option value="1">Particular</option>
                                                        <option value="2">Seguros</option>
                                                        <option value="3">Empresa</option>
                                                    </select>
                                                </div>
                                                <div class="input-group" style="margin-bottom: 10px;">
                                                    <div class="input-group-addon small">TIPO DE FACTURA</div>
                                                    <select class="form-control" id="invoiceType">
                                                        <option value="-">--</option>
                                                        <option value="D-">Serie D</option>
                                                        <option value="V-">Serie V</option>
                                                        <option value="FS-">Serie FS</option>
                                                        <option value="FR-">Serie FR</option>
                                                    </select>
                                                    <div class="input-group-addon small">ESTADO</div>
                                                    <select class="form-control" id="status">
                                                        <option value="-">--</option>
                                                        <option value="0">Pendiente</option>
                                                        <option value="2">Pago Parcial</option>
                                                        <option value="1">Pagada</option>
                                                        <option value="3">Rectificada</option>
                                                        <option value="4">Anulada</option>
                                                    </select>
                                                </div>
                                                <div class="input-group" style="margin-bottom: 10px;">
                                                    <div class="input-group-addon small">MÉTODO DE COBRO</div>
                                                    <select class="form-control" id="paymentMethodFilter">
                                                        <option value="" selected>--</option>
                                                        <option value="Contado">Contado</option>
                                                        <option value="Tarjeta">Tarjeta</option>
                                                        <option value="Giro bancario">Giro bancario</option>
                                                        <option value="Transferencia">Transferencia</option>
                                                    </select>
                                                </div>
                                                <div class="input-group" style="margin-bottom: 10px;">
                                                    <div id="clientsFilterSection" class="input-group">
                                                        <div class="input-group-addon small">CLIENTES</div>
                                                        <select class="form-control" id="clients"></select>
                                                    </div>
                                                    <div id="bankAccountSection" class="input-group hide">
                                                        <div class="input-group-addon small">NÚM. CUENTA</div>
                                                        <select class="form-control" id="bankAccountFilter"></select>
                                                    </div>
                                                    <div id="tpvSection" class="input-group hide">
                                                        <div class="input-group-addon small">TPV</div>
                                                        <select class="form-control" id="tpvFilter"></select>
                                                    </div>
                                                </div>
                                                <div class="input-group" style="margin-bottom: 10px;">
                                                    <label style="margin-left: 10px; margin-right: 10px;">Buscar por: </label>
                                                    <label class="checkbox-inline">
                                                        <input type="checkbox" id="invoiceDateFilter" name="invoiceDateFilter" checked> <span>Fecha de emisión</span>
                                                    </label>
                                                    <label class="checkbox-inline">
                                                        <input type="checkbox" id="invoicePaymentFilter" name="invoicePaymentFilter"> <span>Fecha de cobro</span>
                                                    </label>
                                                    <div class="input-group">
                                                        <div class="input-group-addon small">DESDE</div>
                                                        <input type="text" size="15" class="form-control datepicker" id="from" name="from" autocomplete="off">
                                                        <div class="input-group-addon small">HASTA</div>
                                                        <input type="text" size="15" class="form-control datepicker" id="to" name="to" autocomplete="off">
                                                        <div class="input-group-addon small"><a id="search" style="cursor:pointer"><i class="fa fa-search" aria-hidden="true"></i></a></div>
                                                    </div>
                                                    <label style="margin-left: 5px;padding-right:5px">Buscar: </label>
                                                    <div class="input-group">
                                                        <input id="input-search" class="form-control input-sm" aria-controls="datatable" type="search">
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <form class="form-inline">
                                        <div class="row">
                                            <div class="col-xs-8 box-filters">
                                                <div class="input-group">
                                                    <button type="button" class="btn btn-primary" id="downloadZip">Descargar</button>
                                                    <button type="button" class="btn btn-primary" id="downloadZipSelected" style="margin-left: 5px;">Descargar seleccionadas</button>
                                                    <button type="button" class="btn btn-primary" id="downloadFormatA3" style="margin-left: 5px;">Descargar en formato A3</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <hr style="margin-top: 15px;">
                                    <div style="margin-top: 15px;">
                                        <span class="c-lile inline-block"> 
                                            <span class="bolder">Total importe: </span> 
                                            <span id="totalCost" class="label label-info label-total inline-block" style="margin-right:0; font-size: 14px;">
                                        </span>
                                        <span class="c-lile inline-block"> 
                                            <span class="bolder">Total cobrado: </span> 
                                            <span id="totalPay" class="label label-success label-total inline-block" style="margin-right:0; font-size: 14px;">
                                        </span>
                                        <span class="c-lile inline-block"> 
                                            <span class="bolder">Total pendiente: </span> 
                                            <span id="totalNoPay" class="label label-warning label-total inline-block" style="margin-right:0; font-size: 14px;">
                                        </span>
                                    </div>
                                    <div class="clearfix table-responsive">
                                        <table id="invoicesTable" class="table table-striped table-bordered display" width="100%" cellspacing="0"></table>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/moment/moment-with-locales.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/tools/validations.js?v=<?= CACHE_DATE ?>"></script>
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
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/timepicker/bootstrap-timepicker.min.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/bootstrap-datepicker.js?v=<?= CACHE_DATE ?>" charset="UTF-8"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/datepicker/locales/bootstrap-datepicker.es.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/plugins/input-mask/jquery.inputmask.date.extensions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/themes/adminlte/functions.js?v=<?= CACHE_DATE ?>"></script>
        <script src="<?php echo $utils->getRoute(); ?>resources/js/invoices/functions.js?v=<?= CACHE_DATE ?>"></script>
    </body>
</html>